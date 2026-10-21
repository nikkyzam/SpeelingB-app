import React, { useEffect, useMemo, useRef, useState } from 'react'
import type { Word } from '../../../services/wordBank'
import { useAudio } from '../../../contexts/AudioContext'
import { shuffle, isPlayable, letterTraps } from '../shared/wordTricks'
import sfx from '../shared/sfx'
import useCheer from '../shared/useCheer'
import Burst from '../shared/Burst'
import { spellOut } from '../../../services/words/praise'
import './HoneyFlight.css'

interface HoneyFlightProps {
  onComplete: (score: number) => void
  words?: Word[]
  rounds?: number
  /** Milliseconds for a row of flowers to reach the bee. Unhurried on purpose. */
  pace?: number
}

export const LANES = 3
/** Where the bee flies, as a percentage across the sky. */
export const BEE_X = 16
/** Where each row of flowers comes in, just off the right edge. */
export const START_X = 104
const TICK_MS = 50

/** A row of flowers, one per lane: the letter wanted next and two that fool spellers. */
export interface Gate {
  id: number
  x: number
  letters: string[]
  /** The lane holding the right letter. */
  right: number
}
export interface Sky {
  lane: number
  gate: Gate | null
}

let gateIds = 0

/** The flowers for `answer[i]`: the right letter and two believable slips, lanes shuffled. */
export const makeGate = (answer: string, i: number): Gate => {
  const letters = shuffle([answer[i], ...letterTraps(answer, i, LANES - 1)])
  return { id: ++gateIds, x: START_X, letters, right: letters.indexOf(answer[i]) }
}

/**
 * One tick: the flowers drift towards the bee, and when they reach it the bee
 * flies through whichever flower is in its lane. There is no crashing — the
 * only thing tested is the letter, not the flying.
 */
export const flyOnce = (sky: Sky, step: number): { sky: Sky; through: { lane: number; right: boolean } | null } => {
  const { gate } = sky
  if (!gate) return { sky, through: null }
  const x = gate.x - step
  if (x > BEE_X) return { sky: { ...sky, gate: { ...gate, x } }, through: null }
  return { sky: { ...sky, gate: null }, through: { lane: sky.lane, right: sky.lane === gate.right } }
}

/** Three wrong flowers and the word is shown — a child should never be stuck. */
const MISSES_ALLOWED = 3
const PER_LETTER = 5
const WORD_BONUS = 20
const CLEAN_BONUS = 15

type Phase = 'ready' | 'flying' | 'won' | 'shown'

interface Flight {
  sky: Sky
  phase: Phase
  paused: boolean
  got: number
  misses: number
  score: number
  jars: number
  bump: boolean
  /** The cheer for the last jar. */
  cheer: string
}

const KEYS: Record<string, -1 | 1> = { ArrowUp: -1, ArrowDown: 1, w: -1, s: 1 }

/**
 * Honey Flight — fly the bee through the flowers that spell the word.
 *
 * Hear the word; rows of flowers drift in, each with three letters on it: the
 * one that comes next, and two a speller really reaches for instead — the
 * missing half of a double, a vowel that sounds right, a c for a k. Fly into
 * the right one and it joins the word in the honey pot. It moves, so it feels
 * like a race, but it is slow enough to think and nothing is lost by a wrong
 * flower except a heart; the same letter comes round again.
 */
const HoneyFlight: React.FC<HoneyFlightProps> = ({
  onComplete,
  words: providedWords,
  rounds = 4,
  pace = 4400,
}) => {
  const { speak } = useAudio()
  const cheer = useCheer()

  const words = useMemo<Word[]>(() => {
    const pool = shuffle(providedWords && providedWords.length > 0 ? providedWords : []).filter((w) =>
      isPlayable(w, 3)
    )
    // Every letter is a row of flowers, so shorter words come first when the
    // child has them; long ones still come when that is all there is.
    const short = pool.filter((w) => w.word.length <= 8)
    const long = pool.filter((w) => w.word.length > 8)
    return shuffle([...short, ...long].slice(0, rounds))
  }, [providedWords, rounds])

  const [index, setIndex] = useState(0)
  // The sky changes twenty times a second, so it lives in a ref that the
  // ticker reads and writes; a counter asks React to repaint.
  const flight = useRef<Flight>({
    sky: { lane: 1, gate: null },
    phase: 'ready',
    paused: false,
    got: 0,
    misses: 0,
    score: 0,
    jars: 0,
    bump: false,
    cheer: '',
  })
  const [, setFrame] = useState(0)
  const repaint = () => setFrame((f) => f + 1)

  /** Lay out a word's first row of flowers — before the index moves, never after. */
  const startRound = (word: Word | undefined) => {
    if (!word) return
    const f = flight.current
    f.sky = { lane: 1, gate: makeGate(word.word.toLowerCase(), 0) }
    f.phase = 'ready'
    f.paused = false
    f.got = 0
    f.misses = 0
    f.bump = false
  }
  const started = useRef(false)
  if (!started.current) {
    started.current = true
    startRound(words[0])
  }

  // A word finishing after the child has walked away must not pay out for a
  // game nobody is playing, so every delay is tracked and cleared on unmount.
  const timers = useRef<number[]>([])
  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms))
  }
  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), [])

  const current = words[index]
  const answer = (current?.word ?? '').toLowerCase()

  useEffect(() => {
    if (current) speak(current.word)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, words])

  const finish = (won: boolean) => {
    const f = flight.current
    f.sky = { ...f.sky, gate: null }
    if (won) {
      // A clean flight is worth more, but finishing at all still scores.
      f.score += WORD_BONUS + (f.misses === 0 ? CLEAN_BONUS : 0)
      f.jars += 1
      f.phase = 'won'
      f.cheer = cheer.hit({ say: current.word })
    } else {
      f.phase = 'shown'
      speak(`It was ${current.word}. ${spellOut(current.word)}`)
    }
    later(() => {
      if (index < words.length - 1) {
        startRound(words[index + 1])
        setIndex(index + 1)
      } else {
        onComplete(flight.current.score)
      }
    }, 2200)
  }

  useEffect(() => {
    if (!current) return
    const step = (START_X - BEE_X) / (pace / TICK_MS)
    const ticker = window.setInterval(() => {
      const f = flight.current
      if (f.phase !== 'flying' || f.paused) return

      const { sky, through } = flyOnce(f.sky, step)
      f.sky = sky
      if (through?.right) {
        f.got += 1
        f.score += PER_LETTER
        if (f.got >= answer.length) {
          finish(true)
        } else {
          sfx.pop()
          f.sky = { ...f.sky, gate: makeGate(answer, f.got) }
        }
      } else if (through) {
        f.misses += 1
        f.bump = true
        cheer.miss({ quiet: true })
        later(() => {
          flight.current.bump = false
          repaint()
        }, 900)
        if (f.misses >= MISSES_ALLOWED) finish(false)
        // The same letter comes round again, with its flowers mixed up.
        else f.sky = { ...f.sky, gate: makeGate(answer, f.got) }
      }
      repaint()
    }, TICK_MS)
    return () => window.clearInterval(ticker)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, words, pace])

  /** Fly to a lane. The first move is also "go", so the word is heard first. */
  const flyTo = (lane: number) => {
    const f = flight.current
    if (f.phase !== 'ready' && f.phase !== 'flying') return
    f.sky = { ...f.sky, lane: Math.min(Math.max(lane, 0), LANES - 1) }
    f.phase = 'flying'
    f.paused = false
    repaint()
  }
  const nudge = (by: -1 | 1) => flyTo(flight.current.sky.lane + by)

  // The keyboard listener lives for the whole mount; it reaches the latest
  // handlers through this ref.
  const nudgeRef = useRef(nudge)
  nudgeRef.current = nudge
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return
      const target = e.target as HTMLElement | null
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return
      const by = KEYS[e.key.length === 1 ? e.key.toLowerCase() : e.key]
      if (!by) return
      e.preventDefault()
      nudgeRef.current(by)
    }
    // Leaving the tab parks the bee rather than letting flowers fly past it.
    const onHide = () => {
      if (document.hidden && flight.current.phase === 'flying') {
        flight.current.paused = true
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
      <div className="honey-flight">
        {/* No button: onComplete() means a finished game to the hub, which
            pays a star for it. "Back to Games" in the header is the way out. */}
        <p className="hf-empty">
          No flowers in bloom yet — learn a few words, then come back and fly! 🐝
        </p>
      </div>
    )
  }

  const f = flight.current
  const { gate, lane } = f.sky

  return (
    <div className="honey-flight">
      <div className="hf-header">
        <div className="hf-title">🐝 Honey Flight</div>
        <div className="hf-stats">
          <div className="hf-stat"><span>Word</span><strong>{index + 1}/{words.length}</strong></div>
          <div className="hf-stat"><span>Score</span><strong>{f.score}</strong></div>
          <div className="hf-stat"><span>Honey</span><strong>🍯 {f.jars}</strong></div>
        </div>
      </div>

      <button className="hf-btn ghost" onClick={() => speak(current.word)}>🔊 Hear it again</button>
      {current.meaning && <p className="hf-meaning">{current.meaning}</p>}

      <div className={`hf-pot ${f.phase}`} aria-label="The letters collected so far">
        {[...answer].map((ch, i) => {
          const got = i < f.got
          const told = f.phase === 'shown' && !got
          return (
            <span key={i} className={`hf-slot ${got ? 'got' : ''} ${told ? 'told' : ''}`}>
              {got || told ? ch : ''}
            </span>
          )
        })}
      </div>

      <div className="hf-play">
        <div className="hf-sky" aria-label="The sky">
          {Array.from({ length: LANES }, (_, l) => (
            <button
              key={l}
              className={`hf-lane ${lane === l ? 'here' : ''}`}
              style={{ top: `${(l / LANES) * 100}%`, height: `${100 / LANES}%` }}
              onClick={() => flyTo(l)}
              aria-label={`Fly to lane ${l + 1}`}
            />
          ))}

          {gate &&
            gate.letters.map((letter, l) => (
              <span
                key={`${gate.id}-${l}`}
                className="hf-flower"
                data-flower
                data-lane={l}
                style={{ left: `${gate.x}%`, top: `${((l + 0.5) / LANES) * 100}%` }}
                aria-label={`Flower ${letter} in lane ${l + 1}`}
              >
                <span className="hf-petals" aria-hidden>🌼</span>
                <span className="hf-letter">{letter}</span>
              </span>
            ))}

          <span
            className={`hf-bee ${f.bump ? 'bump' : ''} ${f.phase === 'won' ? 'happy' : ''}`}
            data-bee
            data-lane={lane}
            style={{ left: `${BEE_X}%`, top: `${((lane + 0.5) / LANES) * 100}%` }}
            aria-hidden
          >
            🐝
          </span>

          {f.phase === 'ready' && (
            <div className="hf-overlay">Tap a lane, or ⬆️ ⬇️, to start flying!</div>
          )}
          {f.phase === 'flying' && f.paused && (
            <div className="hf-overlay">Paused — tap a lane to fly on.</div>
          )}
        </div>

        <div className="hf-pad" role="group" aria-label="Flying">
          <button className="hf-arrow" onClick={() => nudge(-1)} aria-label="Fly up">⬆️</button>
          <button
            className="hf-arrow"
            onClick={() => {
              if (f.phase !== 'flying') return
              f.paused = !f.paused
              repaint()
            }}
            disabled={f.phase !== 'flying'}
            aria-label={f.paused ? 'Keep flying' : 'Pause'}
          >
            {f.paused ? '▶️' : '⏸️'}
          </button>
          <button className="hf-arrow" onClick={() => nudge(1)} aria-label="Fly down">⬇️</button>
        </div>
      </div>

      <div className="hf-lives" aria-label={`${MISSES_ALLOWED - f.misses} tries left on this word`}>
        {Array.from({ length: MISSES_ALLOWED }).map((_, i) => (
          <span key={i} className={i < MISSES_ALLOWED - f.misses ? 'on' : 'off'}>💛</span>
        ))}
      </div>

      <p className="hf-hint">
        {f.phase === 'flying' &&
          (f.bump ? 'Bonk! Not that letter — it comes round again.' : 'Fly through the flower with the next letter.')}
      </p>

      {f.phase === 'won' && (
        <div className="hf-flash ok">
          <Burst trigger={f.jars} emoji={['🍯', '🌼', '✨', '⭐']} />
          🍯 {f.cheer} “{current.word}” — a whole jar of honey!
        </div>
      )}
      {f.phase === 'shown' && (
        <div className="hf-flash bad">It was “{current.word}” — the next one is yours! 💪</div>
      )}
    </div>
  )
}

export default HoneyFlight
