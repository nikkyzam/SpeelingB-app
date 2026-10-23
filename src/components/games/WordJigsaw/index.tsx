import { activityClock } from '../../../services/games/activityClock'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import type { Word } from '../../../services/wordBank'
import { useAudio } from '../../../contexts/AudioContext'
import { chunkWord } from '../../../services/words/wordShape'
import { shuffle, isPlayable, splitChunk, soundAlikes } from '../shared/wordTricks'
import sfx from '../shared/sfx'
import useCheer from '../shared/useCheer'
import Burst from '../shared/Burst'
import { spellOut } from '../../../services/words/praise'
import './WordJigsaw.css'

interface WordJigsawProps {
  onComplete: (score: number) => void
  words?: Word[]
  rounds?: number
}

/** Three wrong pieces and the word is put together for them. */
const MISSES_ALLOWED = 3
const PER_PIECE = 10
const WORD_BONUS = 20
const CLEAN_BONUS = 10
/** Colours are dealt at random each word, so a colour never hints at a place. */
const HUES = [0, 1, 2, 3, 4, 5]

/**
 * How phonics splits a one-beat word: the consonants before the vowel, then
 * the vowel and everything after it — "st·uck", "f·ish", "br·own". Cutting it
 * down the middle instead ("stu·ck", "fi·sh") tears apart the very letter
 * teams a child should learn to see as one. A word that opens on its vowel
 * splits after the vowel sound instead: "e·gg", "i·tch".
 */
const onsetAndRime = (w: string): [string, string] | null => {
  // "y" starts "yawn" as a consonant but is the vowel in "gym" and "cry";
  // the "u" of "qu" belongs with the q ("qu·ilt", "squ·elch").
  const vowelAt = (i: number) =>
    ('aeiou'.includes(w[i]) && !(w[i] === 'u' && w[i - 1] === 'q')) || (w[i] === 'y' && i > 0)
  let start = 0
  while (start < w.length && !vowelAt(start)) start++
  if (start === w.length) return null
  if (start > 0) return [w.slice(0, start), w.slice(start)]
  let end = start
  while (end < w.length && vowelAt(end)) end++
  return end < w.length ? [w.slice(0, end), w.slice(end)] : null
}

/**
 * The pieces a word breaks into: the same sayable chunks LearnMode shows while
 * teaching it ("ca·ter·pil·lar"), so the puzzle rebuilds exactly what the
 * child was shown. A one-beat word splits the way phonics splits it.
 */
export const piecesFor = (word: string): string[] => {
  const w = word.toLowerCase()
  const chunks = chunkWord(w)
  if (chunks.length >= 2) return chunks
  const [head, tail] = onsetAndRime(w) ?? splitChunk(w)
  return tail ? [head, tail] : [w]
}

/**
 * A fake that could pass for `pieces[k]` at a glance: where the word doubles a
 * letter across two pieces, the piece without its half of the double ("ar"
 * for "lar" — the classic "caterpilar"); otherwise the piece with one letter
 * swapped for one that sounds or looks alike ("tor" for "ter"). Never a copy
 * of a real piece, or the puzzle would have two right answers.
 */
export const decoyFor = (pieces: string[], k: number): string | null => {
  const piece = pieces[k]
  const isFresh = (d: string) => d.length > 0 && !pieces.includes(d)
  const before = k > 0 ? pieces[k - 1].slice(-1) : ''
  const dropped = piece.slice(1)
  if (before && piece[0] === before && isFresh(dropped) && Math.random() < 0.6) return dropped

  const swaps: string[] = []
  for (let j = 0; j < piece.length; j++) {
    for (const alike of soundAlikes(piece[j]).slice(0, 2)) {
      swaps.push(piece.slice(0, j) + alike + piece.slice(j + 1))
    }
  }
  const fresh = swaps.filter(isFresh)
  return fresh.length > 0 ? fresh[Math.floor(Math.random() * fresh.length)] : null
}

/** One or two fakes, from different pieces — one when the word is already long. */
const fakesFor = (pieces: string[]): string[] => {
  const want = pieces.length >= 5 ? 1 : 2
  const out: string[] = []
  for (const k of shuffle(pieces.map((_, i) => i))) {
    if (out.length >= want) break
    const fake = decoyFor(pieces, k)
    if (fake && !out.includes(fake)) out.push(fake)
  }
  return out
}

interface Piece { id: number; text: string; hue: number }
interface Round {
  answer: string[]
  tray: Piece[]
  placed: (Piece | null)[]
}

let pieceIds = 0

const makeRound = (word: Word | undefined): Round => {
  if (!word) return { answer: [], tray: [], placed: [] }
  const answer = piecesFor(word.word)
  const hues = shuffle(HUES)
  const tray = shuffle([...answer, ...fakesFor(answer)]).map((text, i) => ({
    id: ++pieceIds,
    text,
    hue: hues[i % hues.length],
  }))
  return { answer, tray, placed: answer.map(() => null) }
}

type Phase = 'building' | 'done' | 'shown'

/**
 * Word Jigsaw — snap a word together from its pieces.
 *
 * Long words are spelled in chunks, not letters: nobody spells "caterpillar"
 * as eleven separate decisions. Here the child hears the word and drags its
 * chunks into place, while a fake piece or two carries the mistake a speller
 * really makes — the double that became single, the vowel that sounds right
 * but isn't. Tapping a piece drops it in the next space, for small fingers
 * (and keyboards) that would rather not drag.
 */
const WordJigsaw: React.FC<WordJigsawProps> = ({ onComplete, words: providedWords, rounds = 6 }) => {
  const { speak } = useAudio()
  const cheer = useCheer()
  const [cheerLine, setCheerLine] = useState('')

  const words = useMemo<Word[]>(() => {
    const pool = providedWords && providedWords.length > 0 ? providedWords : []
    // Matches GameCenter's own gate, so an unlocked game is never empty.
    return shuffle(pool).filter((w) => isPlayable(w, 3)).slice(0, rounds)
  }, [providedWords, rounds])

  const [index, setIndex] = useState(0)
  // Built in the same step that moves the index on, so a word's first frame
  // never shows the last word's pieces.
  const [round, setRound] = useState<Round>(() => makeRound(words[0]))
  const [phase, setPhase] = useState<Phase>('building')
  const [misses, setMisses] = useState(0)
  const [score, setScore] = useState(0)
  const [built, setBuilt] = useState(0)
  const [bounce, setBounce] = useState<number | null>(null)
  const [drag, setDrag] = useState<{ id: number; dx: number; dy: number } | null>(null)
  const [hover, setHover] = useState<number | null>(null)

  const scoreRef = useRef(0)
  const missRef = useRef(0)
  // A ref settles before React re-renders, so a word can only finish once.
  const locked = useRef(false)
  const slotRefs = useRef<(HTMLDivElement | null)[]>([])
  // The finger that owns the drag. Two children on one iPad means a second
  // finger can land mid-drag; it must not steal the piece or strand it.
  const grab = useRef<{ id: number; pointer: number; x: number; y: number; moved: boolean } | null>(null)
  // A drag ends in a click on the piece it dragged; that click is not a tap.
  const ignoreClickUntil = useRef(0)
  const timers = useRef<number[]>([])
  const later = (fn: () => void, ms: number) => {
    timers.current.push(activityClock.setTimeout(fn, ms))
  }
  useEffect(() => () => timers.current.forEach((t) => activityClock.clearTimeout(t)), [])

  const current = words[index]

  useEffect(() => {
    if (current) speak(current.word)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, words])

  if (!current) {
    return (
      <div className="word-jigsaw">
        {/* No button: onComplete() is a finished game to the hub, and it pays
            a star for one. "Back to Games" in the header is the way out. */}
        <p className="jig-empty">
          No puzzles in the box yet — learn a few words, then come back and snap
          them together! 🧩
        </p>
      </div>
    )
  }

  const finish = (won: boolean) => {
    locked.current = true
    if (won) {
      const gained = WORD_BONUS + (missRef.current === 0 ? CLEAN_BONUS : 0)
      scoreRef.current += gained
      setScore(scoreRef.current)
      setBuilt((b) => b + 1)
      setPhase('done')
      setCheerLine(cheer.hit({ say: current.word }))
    } else {
      // The real pieces go in for them, so the last thing they see is the
      // word put together properly.
      setRound((r) => ({
        ...r,
        tray: [],
        placed: r.answer.map((text, i) => r.placed[i] ?? { id: -1 - i, text, hue: -1 }),
      }))
      setPhase('shown')
      speak(`It was ${current.word}. ${spellOut(current.word)}`)
    }
    later(() => {
      if (index < words.length - 1) {
        setRound(makeRound(words[index + 1]))
        setIndex(index + 1)
        setPhase('building')
        setMisses(0)
        missRef.current = 0
        locked.current = false
      } else {
        onComplete(scoreRef.current)
      }
    }, 1700)
  }

  const place = (piece: Piece, slot: number) => {
    if (phase !== 'building' || locked.current || slot < 0 || round.placed[slot]) return
    if (piece.text === round.answer[slot]) {
      const placed = round.placed.map((p, i) => (i === slot ? piece : p))
      setRound({ ...round, placed, tray: round.tray.filter((p) => p.id !== piece.id) })
      scoreRef.current += PER_PIECE
      setScore(scoreRef.current)
      sfx.pop()
      if (placed.every(Boolean)) finish(true)
      return
    }
    // Same soft sound, and the run of right answers starts again.
    cheer.miss({ quiet: true })
    setBounce(piece.id)
    later(() => setBounce(null), 450)
    missRef.current += 1
    setMisses(missRef.current)
    if (missRef.current >= MISSES_ALLOWED) finish(false)
  }

  /** A tap puts the piece in the first space still empty. */
  const tapPiece = (piece: Piece) => {
    if (grab.current || activityClock.now() < ignoreClickUntil.current) return
    place(piece, round.placed.findIndex((p) => !p))
  }

  /** Which empty space is under the finger — generously, for small fingers. */
  const slotAt = (x: number, y: number): number =>
    slotRefs.current.findIndex((el, i) => {
      if (!el || round.placed[i]) return false
      const box = el.getBoundingClientRect()
      const pad = 14
      return x >= box.left - pad && x <= box.right + pad && y >= box.top - pad && y <= box.bottom + pad
    })

  const onDown = (e: React.PointerEvent<HTMLButtonElement>, piece: Piece) => {
    if (phase !== 'building' || grab.current || (e.pointerType === 'mouse' && e.button !== 0)) return
    grab.current = { id: piece.id, pointer: e.pointerId, x: e.clientX, y: e.clientY, moved: false }
    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch {
      /* capture is a nicety; the drag still works without it */
    }
  }

  const onMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    const g = grab.current
    if (!g || e.pointerId !== g.pointer) return
    const dx = e.clientX - g.x
    const dy = e.clientY - g.y
    if (!g.moved && Math.hypot(dx, dy) < 8) return
    g.moved = true
    setDrag({ id: g.id, dx, dy })
    const over = slotAt(e.clientX, e.clientY)
    setHover(over >= 0 ? over : null)
  }

  const onUp = (e: React.PointerEvent<HTMLButtonElement>, piece: Piece) => {
    const g = grab.current
    if (!g || e.pointerId !== g.pointer) return
    grab.current = null
    if (!g.moved) return
    ignoreClickUntil.current = activityClock.now() + 400
    setDrag(null)
    setHover(null)
    const slot = slotAt(e.clientX, e.clientY)
    // Dropped somewhere that isn't a space: it just slides home, no harm done.
    if (slot >= 0) place(piece, slot)
  }

  const onCancel = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (grab.current && e.pointerId !== grab.current.pointer) return
    grab.current = null
    setDrag(null)
    setHover(null)
  }

  const nextSlot = round.placed.findIndex((p) => !p)

  return (
    <div className="word-jigsaw">
      <div className="jig-header">
        <div className="jig-title">🧩 Word Jigsaw</div>
        <div className="jig-stats">
          <div className="jig-stat"><span>Word</span><strong>{index + 1}/{words.length}</strong></div>
          <div className="jig-stat"><span>Score</span><strong>{score}</strong></div>
          <div className="jig-stat"><span>Built</span><strong>🧩 {built}</strong></div>
        </div>
      </div>

      <button className="jig-btn hear" onClick={() => speak(current.word)}>🔊 Hear it again</button>
      {current.meaning && <p className="jig-meaning">{current.meaning}</p>}

      <div className={`jig-board ${phase}`} aria-label="Where the word's pieces go">
        {round.answer.map((_, i) => {
          const p = round.placed[i]
          const classes = [
            'jig-slot',
            p ? 'filled' : '',
            hover === i ? 'hover' : '',
            !p && i === nextSlot && phase === 'building' ? 'next' : '',
          ]
          return (
            <div
              key={i}
              ref={(el) => {
                slotRefs.current[i] = el
              }}
              className={classes.filter(Boolean).join(' ')}
              aria-label={`Space ${i + 1} of ${round.answer.length}: ${p ? p.text : 'empty'}`}
            >
              {p && <span className={`jig-piece placed ${p.hue < 0 ? 'given' : `h${p.hue}`}`}>{p.text}</span>}
            </div>
          )
        })}
      </div>

      <p className="jig-hint">
        {phase === 'building' ? 'Drag a piece into place — or tap it to fill the next space.' : ''}
      </p>

      <div className="jig-tray" role="group" aria-label="Puzzle pieces">
        {round.tray.map((p) => (
          <button
            key={p.id}
            className={[
              'jig-piece',
              `h${p.hue}`,
              drag?.id === p.id ? 'dragging' : '',
              bounce === p.id ? 'bounce' : '',
            ].filter(Boolean).join(' ')}
            style={drag?.id === p.id ? { transform: `translate(${drag.dx}px, ${drag.dy}px) scale(1.08)` } : undefined}
            onPointerDown={(e) => onDown(e, p)}
            onPointerMove={onMove}
            onPointerUp={(e) => onUp(e, p)}
            onPointerCancel={onCancel}
            // Fires after every drag; after a lost pointerup it is the only
            // thing that frees the grab, so later taps still work.
            onLostPointerCapture={onCancel}
            onClick={() => tapPiece(p)}
            disabled={phase !== 'building'}
            aria-label={`Piece: ${p.text}`}
          >
            {p.text}
          </button>
        ))}
      </div>

      <div className="jig-lives" aria-label={`${MISSES_ALLOWED - misses} tries left on this word`}>
        {Array.from({ length: MISSES_ALLOWED }).map((_, i) => (
          <span key={i} className={i < MISSES_ALLOWED - misses ? 'on' : 'off'}>💛</span>
        ))}
      </div>

      {phase === 'done' && (
        <div className="jig-flash ok">
          <Burst trigger={built} emoji={['🧩', '⭐', '✨', '🎉']} />
          🎉 {cheerLine} “{current.word}” — every piece in place!
        </div>
      )}
      {phase === 'shown' && (
        <div className="jig-flash bad">It was “{current.word}” — the next one is yours! 💪</div>
      )}
    </div>
  )
}

export default WordJigsaw
