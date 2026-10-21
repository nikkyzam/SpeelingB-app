import React, { useEffect, useMemo, useRef, useState } from 'react'
import type { Word } from '../../../services/wordBank'
import { useAudio } from '../../../contexts/AudioContext'
import { shuffle, isPlayable, letterTraps } from '../shared/wordTricks'
import sfx from '../shared/sfx'
import useCheer from '../shared/useCheer'
import Burst from '../shared/Burst'
import { spellOut } from '../../../services/words/praise'
import './CaterpillarCrawl.css'

interface CaterpillarCrawlProps {
  onComplete: (score: number) => void
  words?: Word[]
  rounds?: number
  /** Milliseconds per square. Slow on purpose: this is steering, not reflexes. */
  speed?: number
}

export type Dir = 'up' | 'down' | 'left' | 'right'
export interface Cell { x: number; y: number }
export interface Leaf extends Cell { id: number; letter: string; right: boolean }
export interface Garden {
  /** Head first. */
  body: Cell[]
  dir: Dir
  /** The last turn asked for, taken on the next step. */
  queued: Dir | null
  leaves: Leaf[]
}

export const COLS = 9
export const ROWS = 7
/** Wrong letters growing beside the right one. */
const DECOYS = 2
/** Three wrong munches and the word is shown — a child should never be stuck. */
const MISSES_ALLOWED = 3
const PER_LETTER = 5
const WORD_BONUS = 20
const CLEAN_BONUS = 15

const STEP: Record<Dir, Cell> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
}
const OPPOSITE: Record<Dir, Dir> = { up: 'down', down: 'up', left: 'right', right: 'left' }
const KEYS: Record<string, Dir> = {
  ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right',
  w: 'up', s: 'down', a: 'left', d: 'right',
}

/** Squares apart, counting the wrap — the far edge is only one step away. */
const gap = (a: Cell, b: Cell): number => {
  const dx = Math.abs(a.x - b.x)
  const dy = Math.abs(a.y - b.y)
  return Math.min(dx, COLS - dx) + Math.min(dy, ROWS - dy)
}

/** One square on. The garden has no walls: off one edge is onto the other. */
export const stepFrom = (c: Cell, dir: Dir): Cell => ({
  x: (c.x + STEP[dir].x + COLS) % COLS,
  y: (c.y + STEP[dir].y + ROWS) % ROWS,
})

/**
 * One tick: take the turn asked for, crawl a square, munch whatever grows
 * there. Only the right letter makes the caterpillar longer. There is no way
 * to lose — crossing its own body is fine — because the thing being tested is
 * the spelling, not the steering.
 */
export const crawlOnce = (g: Garden): { garden: Garden; munched: Leaf | null } => {
  // No U-turn back into its own tummy once it has one.
  const dir = g.queued && (g.body.length === 1 || g.queued !== OPPOSITE[g.dir]) ? g.queued : g.dir
  const head = stepFrom(g.body[0], dir)
  const munched = g.leaves.find((l) => l.x === head.x && l.y === head.y) ?? null
  const body = [head, ...g.body]
  if (!munched?.right) body.pop()
  return {
    garden: {
      body,
      dir,
      queued: null,
      leaves: munched ? g.leaves.filter((l) => l.id !== munched.id) : g.leaves,
    },
    munched,
  }
}

let leafIds = 0

/**
 * Grow the letters somewhere free: never under the caterpillar, never within
 * two squares of its head (it could munch one before the child had looked),
 * and never touching each other, so the right one can always be reached
 * without brushing a wrong one. The right letter comes first and always gets
 * a spot.
 */
export const plant = (body: Cell[], letters: { letter: string; right: boolean }[]): Leaf[] => {
  const head = body[0]
  const free: Cell[] = []
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const c = { x, y }
      if (body.some((b) => b.x === x && b.y === y) || gap(c, head) < 3) continue
      free.push(c)
    }
  }
  const spots: Cell[] = []
  for (const c of shuffle(free)) {
    if (spots.length === letters.length) break
    if (spots.every((s) => gap(s, c) >= 2)) spots.push(c)
  }
  return spots.map((c, i) => ({ ...c, ...letters[i], id: ++leafIds }))
}

/** The letter wanted next, and the believable wrong ones beside it. */
const lettersAt = (answer: string, i: number) => [
  { letter: answer[i], right: true },
  ...letterTraps(answer, i, DECOYS).map((letter) => ({ letter, right: false })),
]

type Phase = 'ready' | 'crawling' | 'won' | 'shown'

interface Run {
  garden: Garden
  phase: Phase
  paused: boolean
  eaten: number
  misses: number
  score: number
  butterflies: number
  oops: boolean
  /** The cheer for the last butterfly. */
  cheer: string
}

/**
 * Caterpillar Crawl — steer to munch the word's letters in order.
 *
 * Hear the word, then crawl to its first letter, its second, and so on, while
 * the wrong letters beside it are the ones a speller really reaches for: the
 * other half of a double ("balon"), a double that isn't there ("hopping" for
 * "hoping"), a vowel that sounds the same. The caterpillar's body carries every
 * letter it has eaten, and a whole word turns it into a butterfly.
 *
 * It is the one game in the hub where the child steers something — swipe, tap
 * the garden, the arrow pad or the keyboard all work.
 */
const CaterpillarCrawl: React.FC<CaterpillarCrawlProps> = ({
  onComplete,
  words: providedWords,
  rounds = 4,
  speed = 420,
}) => {
  const { speak } = useAudio()
  const cheer = useCheer()

  const words = useMemo<Word[]>(() => {
    const pool = shuffle(providedWords && providedWords.length > 0 ? providedWords : []).filter((w) =>
      isPlayable(w, 3)
    )
    // Every letter is a trip across the garden, so a twelve-letter word is a
    // long crawl. Shorter words are picked first when the child has them; the
    // long ones still come when that is all there is.
    const short = pool.filter((w) => w.word.length <= 8)
    const long = pool.filter((w) => w.word.length > 8)
    return shuffle([...short, ...long].slice(0, rounds))
  }, [providedWords, rounds])

  const [index, setIndex] = useState(0)
  // The garden changes on every step, so it lives in a ref that the ticker
  // reads and writes; a counter asks React to repaint.
  const run = useRef<Run>({
    garden: { body: [], dir: 'right', queued: null, leaves: [] },
    phase: 'ready',
    paused: false,
    eaten: 0,
    misses: 0,
    score: 0,
    butterflies: 0,
    oops: false,
    cheer: '',
  })
  const [, setFrame] = useState(0)
  const repaint = () => setFrame((f) => f + 1)

  /**
   * Lay out the garden for a word. Called before the index moves on, never in
   * an effect after it, so the first frame of a word is already that word's —
   * not the last one's caterpillar wearing the new word's letters.
   */
  const startRound = (word: Word | undefined) => {
    if (!word) return
    const r = run.current
    const start = { x: Math.floor(COLS / 2), y: Math.floor(ROWS / 2) }
    r.garden = {
      body: [start],
      dir: 'right',
      queued: null,
      leaves: plant([start], lettersAt(word.word.toLowerCase(), 0)),
    }
    r.phase = 'ready'
    r.paused = false
    r.eaten = 0
    r.misses = 0
    r.oops = false
  }
  const planted = useRef(false)
  if (!planted.current) {
    planted.current = true
    startRound(words[0])
  }

  // A word finishing after the child has walked away must not pay out for a
  // game nobody is playing, so every delay is tracked and cleared on unmount.
  const timers = useRef<number[]>([])
  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms))
  }
  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), [])

  const boardRef = useRef<HTMLDivElement>(null)
  // The finger that started a swipe owns it. Two children share one iPad: a
  // second finger landing mid-swipe must not restart it or steer with it.
  const press = useRef<{ x: number; y: number; pointer: number } | null>(null)

  const current = words[index]
  const answer = (current?.word ?? '').toLowerCase()

  useEffect(() => {
    if (current) speak(current.word)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, words])

  const finish = (won: boolean) => {
    const r = run.current
    r.garden = { ...r.garden, leaves: [] }
    if (won) {
      // A clean crawl is worth more, but finishing at all still scores.
      r.score += WORD_BONUS + (r.misses === 0 ? CLEAN_BONUS : 0)
      r.butterflies += 1
      r.phase = 'won'
      r.cheer = cheer.hit({ say: current.word })
    } else {
      r.phase = 'shown'
      speak(`It was ${current.word}. ${spellOut(current.word)}`)
    }
    later(() => {
      if (index < words.length - 1) {
        startRound(words[index + 1])
        setIndex(index + 1)
      } else {
        onComplete(run.current.score)
      }
    }, 2200)
  }

  useEffect(() => {
    if (!current) return
    const ticker = window.setInterval(() => {
      const r = run.current
      if (r.phase !== 'crawling' || r.paused) return

      const { garden, munched } = crawlOnce(r.garden)
      r.garden = garden

      if (munched?.right) {
        r.eaten += 1
        r.score += PER_LETTER
        if (r.eaten >= answer.length) {
          finish(true)
        } else {
          sfx.pop()
          r.garden = { ...r.garden, leaves: plant(r.garden.body, lettersAt(answer, r.eaten)) }
        }
      } else if (munched) {
        r.misses += 1
        r.oops = true
        cheer.miss({ quiet: true })
        later(() => {
          run.current.oops = false
          repaint()
        }, 1100)
        if (r.misses >= MISSES_ALLOWED) finish(false)
      }
      repaint()
    }, speed)
    return () => window.clearInterval(ticker)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, words, speed])

  const steer = (dir: Dir) => {
    const r = run.current
    if (r.phase === 'ready') {
      // The first turn is also "go" — the caterpillar waits for it, so the
      // word can be heard before anything moves.
      r.phase = 'crawling'
      r.garden = { ...r.garden, dir, queued: null }
    } else if (r.phase === 'crawling') {
      r.garden = { ...r.garden, queued: dir }
    } else {
      return
    }
    r.paused = false
    repaint()
  }

  // The keyboard listener lives for the whole mount; it always reaches the
  // latest steer through this ref.
  const steerRef = useRef(steer)
  steerRef.current = steer

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return
      const target = e.target as HTMLElement | null
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return
      const dir = KEYS[e.key.length === 1 ? e.key.toLowerCase() : e.key]
      if (!dir) return
      e.preventDefault()
      steerRef.current(dir)
    }
    // Leaving the tab parks the caterpillar rather than letting it wander
    // into leaves on its own.
    const onHide = () => {
      if (document.hidden && run.current.phase === 'crawling') {
        run.current.paused = true
        repaint()
      }
    }
    window.addEventListener('keydown', onKey)
    document.addEventListener('visibilitychange', onHide)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.removeEventListener('visibilitychange', onHide)
    }
  }, [])

  if (!current) {
    return (
      <div className="caterpillar-crawl">
        {/* No button: onComplete() means a finished game to the hub, which
            pays a star for it. "Back to Games" in the header is the way out. */}
        <p className="cc-empty">
          No leaves to munch yet — learn a few words, then come back and help the
          caterpillar grow! 🐛
        </p>
      </div>
    )
  }

  const r = run.current
  const { body, leaves, dir } = r.garden
  const head = body[0]

  /** A swipe steers that way; a tap steers towards the spot tapped. */
  const release = (e: React.PointerEvent) => {
    const start = press.current
    if (!start || e.pointerId !== start.pointer) return
    press.current = null
    const dx = e.clientX - start.x
    const dy = e.clientY - start.y
    if (Math.max(Math.abs(dx), Math.abs(dy)) >= 24) {
      steer(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : dy > 0 ? 'down' : 'up')
      return
    }
    const rect = boardRef.current?.getBoundingClientRect()
    if (!rect || !rect.width || !head) return
    const cellW = rect.width / COLS
    const cellH = rect.height / ROWS
    const tx = e.clientX - (rect.left + (head.x + 0.5) * cellW)
    const ty = e.clientY - (rect.top + (head.y + 0.5) * cellH)
    if (Math.abs(tx) < cellW / 2 && Math.abs(ty) < cellH / 2) return
    steer(Math.abs(tx) > Math.abs(ty) ? (tx > 0 ? 'right' : 'left') : ty > 0 ? 'down' : 'up')
  }

  const squares: React.ReactNode[] = []
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const at = body.findIndex((b) => b.x === x && b.y === y)
      const leaf = leaves.find((l) => l.x === x && l.y === y)
      let content: React.ReactNode = null
      if (at === 0) {
        content = (
          <span
            className={`cc-head ${r.phase === 'won' ? 'flying' : ''}`}
            data-head
            data-x={x}
            data-y={y}
            data-dir={dir}
            data-length={body.length}
          >
            {r.phase === 'won' ? '🦋' : ''}
          </span>
        )
      } else if (at > 0) {
        // The segment right behind the head is the letter eaten last, so
        // reading from the tail to the head spells the word.
        content = <span className="cc-seg">{answer[r.eaten - at] ?? ''}</span>
      } else if (leaf) {
        content = (
          <span className="cc-leaf" data-leaf data-x={x} data-y={y} aria-label={`leaf ${leaf.letter}`}>
            <span>{leaf.letter}</span>
          </span>
        )
      }
      squares.push(
        <div key={`${x},${y}`} className="cc-square">
          {content}
        </div>
      )
    }
  }

  return (
    <div className="caterpillar-crawl">
      <div className="cc-header">
        <div className="cc-title">🐛 Caterpillar Crawl</div>
        <div className="cc-stats">
          <div className="cc-stat"><span>Word</span><strong>{index + 1}/{words.length}</strong></div>
          <div className="cc-stat"><span>Score</span><strong>{r.score}</strong></div>
          <div className="cc-stat"><span>Butterflies</span><strong>🦋 {r.butterflies}</strong></div>
        </div>
      </div>

      <button className="cc-btn hear" onClick={() => speak(current.word)}>🔊 Hear it again</button>
      {current.meaning && <p className="cc-meaning">{current.meaning}</p>}

      <div className={`cc-word ${r.phase}`} aria-label="The letters munched so far">
        {[...answer].map((ch, i) => {
          const got = i < r.eaten
          const told = r.phase === 'shown' && !got
          return (
            <span key={i} className={`cc-slot ${got ? 'got' : ''} ${told ? 'told' : ''}`}>
              {got || told ? ch : ''}
            </span>
          )
        })}
      </div>

      <div className="cc-play">
        <div
          ref={boardRef}
          className="cc-board"
          onPointerDown={(e) => {
            if (press.current || (e.pointerType === 'mouse' && e.button !== 0)) return
            press.current = { x: e.clientX, y: e.clientY, pointer: e.pointerId }
            try {
              // A swipe that runs off the garden still ends here.
              e.currentTarget.setPointerCapture(e.pointerId)
            } catch {
              /* capture is a nicety; swipes inside the garden work without it */
            }
          }}
          onPointerUp={release}
          onPointerCancel={(e) => {
            if (press.current?.pointer === e.pointerId) press.current = null
          }}
          // Without an up or a cancel, losing the capture is the only sign the
          // swipe is over — clear it, or the garden would ignore every later one.
          onLostPointerCapture={(e) => {
            if (press.current?.pointer === e.pointerId) press.current = null
          }}
          aria-label="The garden"
        >
          {squares}
          {r.phase === 'ready' && (
            <div className="cc-overlay">Swipe, tap or press an arrow to start crawling!</div>
          )}
          {r.phase === 'crawling' && r.paused && (
            <div className="cc-overlay">Paused — pick a way to go and off it crawls.</div>
          )}
        </div>

        <div className="cc-pad" role="group" aria-label="Steering">
          <button className="cc-arrow up" onClick={() => steer('up')} aria-label="Crawl up">⬆️</button>
          <button className="cc-arrow left" onClick={() => steer('left')} aria-label="Crawl left">⬅️</button>
          <button
            className="cc-arrow pause"
            onClick={() => {
              if (r.phase !== 'crawling') return
              r.paused = !r.paused
              repaint()
            }}
            disabled={r.phase !== 'crawling'}
            aria-label={r.paused ? 'Keep crawling' : 'Pause'}
          >
            {r.paused ? '▶️' : '⏸️'}
          </button>
          <button className="cc-arrow right" onClick={() => steer('right')} aria-label="Crawl right">➡️</button>
          <button className="cc-arrow down" onClick={() => steer('down')} aria-label="Crawl down">⬇️</button>
        </div>
      </div>

      <div className="cc-lives" aria-label={`${MISSES_ALLOWED - r.misses} tries left on this word`}>
        {Array.from({ length: MISSES_ALLOWED }).map((_, i) => (
          <span key={i} className={i < MISSES_ALLOWED - r.misses ? 'on' : 'off'}>💚</span>
        ))}
      </div>

      <p className="cc-hint">
        {r.phase === 'crawling' && (r.oops ? 'Oops — not that letter! Find the one that comes next.' : 'Munch the letters of the word in order.')}
      </p>

      {r.phase === 'won' && (
        <div className="cc-flash ok">
          <Burst trigger={r.butterflies} emoji={['🦋', '✨', '🌸', '⭐']} />
          🦋 {r.cheer} “{current.word}” — it turned into a butterfly!
        </div>
      )}
      {r.phase === 'shown' && (
        <div className="cc-flash bad">It was “{current.word}” — the next one is yours! 💪</div>
      )}
    </div>
  )
}

export default CaterpillarCrawl
