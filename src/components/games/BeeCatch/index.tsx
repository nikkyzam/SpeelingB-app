import { usePreferences } from '../../../hooks/usePreferences'
import { activityClock } from '../../../services/games/activityClock'
import React, { useMemo, useState, useEffect, useRef } from 'react'
import type { Word } from '../../../services/wordBank'
import { useAudio } from '../../../contexts/AudioContext'
import { shuffle, isPlayable, letterTraps } from '../shared/wordTricks'
import { useCheer } from '../shared/useCheer'
import { useLater } from '../shared/useLater'
import sfx from '../shared/sfx'
import Burst from '../shared/Burst'
import GameEmpty from '../shared/GameEmpty'
import './BeeCatch.css'

interface BeeCatchProps {
  onComplete: (score: number) => void
  words?: Word[]
  duration?: number
}

const BEES = 7
/** The field is cut into this grid, one bee to a cell, so bees never pile up. */
const COLS = 4
const ROWS = 2
/** Wrong taps on one letter before its slot shows it — never stuck. */
const TAPS_BEFORE_HELP = 2
/** How long a finished word stays up, cheered and said, before the next. */
const WORD_DONE_MS = 1100
/** The streak bonus stops here, keeping a fast minute on the usual score scale. */
const MAX_STREAK_BONUS = 5

export interface Bee {
  id: number
  ch: string
  top: number
  left: number
  delay: number
}

let beeId = 0
const rand = (min: number, max: number) => min + Math.random() * (max - min)

/**
 * The bees for one letter: the letter itself and six letters a speller really
 * confuses with it, each in its own cell of a grid, nudged a little so the
 * field doesn't look like a chessboard. Random spots let a decoy sit right
 * on top of the one letter the child needed.
 */
export const makeBees = (word: string, at: number, random: () => number = Math.random): Bee[] => {
  const needed = word[at]
  const letters = shuffle([needed, ...letterTraps(word, at, BEES - 1)])
  const cells = shuffle(Array.from({ length: COLS * ROWS }, (_, i) => i)).slice(0, letters.length)
  const cellW = 100 / COLS
  const cellH = 100 / ROWS
  return letters.map((ch, i) => {
    const col = cells[i] % COLS
    const row = Math.floor(cells[i] / COLS)
    return {
      id: beeId++,
      ch,
      // Left/top are the bee's corner; leave room for its body in the cell.
      left: col * cellW + 1 + random() * (cellW - 18),
      top: row * cellH + 3 + random() * (cellH - 30),
      delay: rand(0, 1.2),
    }
  })
}

/** Spell the word by tapping the buzzing letters in order before time runs out. */
const BeeCatch: React.FC<BeeCatchProps> = ({ onComplete, words: providedWords, duration = 60 }) => {
  const { speak } = useAudio()
  const [preferences] = usePreferences()
  const cheer = useCheer()
  const later = useLater()

  const pool = useMemo<Word[]>(() => {
    const list = providedWords && providedWords.length > 0 ? providedWords : []
    return shuffle(list).filter((w) => isPlayable(w, 3))
  }, [providedWords])

  // Counts every word played; the list comes round again when it runs out.
  // (Stepping an index modulo the list stuck on a one-word list: the index
  // never changed, so the next word never started.)
  const [round, setRound] = useState(0)
  const wordIndex = pool.length ? round % pool.length : 0
  const [built, setBuilt] = useState(0)
  const [bees, setBees] = useState<Bee[]>([])
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [wordsDone, setWordsDone] = useState(0)
  const [timeLeft, setTimeLeft] = useState(duration)
  const [wrongId, setWrongId] = useState<number | null>(null)
  const [wrongTaps, setWrongTaps] = useState(0)
  const [line, setLine] = useState('')
  // True while a finished word is on show: bees wait, nothing scores twice.
  const holding = useRef(false)
  const finished = useRef(false)

  const word = (pool[wordIndex]?.word || '').toLowerCase()
  const nextChar = word[built]
  const done = built >= word.length && word.length > 0

  /**
   * Start a word, all in one step: in an effect after the round changed, the
   * next word's first frame still had the old word's letter count built.
   */
  const startRound = (r: number) => {
    const w = pool[r % pool.length]
    if (!w) return
    holding.current = false
    setBuilt(0)
    setWrongTaps(0)
    setLine('')
    setBees(makeBees(w.word.toLowerCase(), 0))
    setRound(r)
    speak(w.word, { queue: r > 0 })
  }

  useEffect(() => {
    startRound(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pool])

  // Countdown — only with words to play: a clock running out on an empty
  // screen paid for a game nobody played.
  useEffect(() => {
    if (!pool.length || finished.current || preferences.relaxed) return
    if (timeLeft <= 0) {
      finished.current = true
      onComplete(score)
      return
    }
    const t = activityClock.setTimeout(() => setTimeLeft((s) => s - 1), 1000)
    return () => activityClock.clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, pool, preferences.relaxed])

  if (!word) {
    return (
      <div className="bee-catch">
        <GameEmpty icon="🐝">No words to catch yet — learn a few, then come back and chase the letter bees!</GameEmpty>
      </div>
    )
  }

  const tapBee = (bee: Bee) => {
    if (timeLeft <= 0 || holding.current || finished.current) return
    if (bee.ch !== nextChar) {
      // No time lost, just the streak — and after two, the slot helps out.
      cheer.miss({ quiet: true })
      setStreak(0)
      setWrongTaps((n) => n + 1)
      setWrongId(bee.id)
      later(() => setWrongId((id) => (id === bee.id ? null : id)), 400)
      return
    }

    const nextBuilt = built + 1
    const letterPoints = 5 + Math.min(streak, MAX_STREAK_BONUS)
    setStreak((s) => s + 1)
    setBuilt(nextBuilt)
    setWrongTaps(0)

    if (nextBuilt < word.length) {
      sfx.pop()
      setScore((s) => s + letterPoints)
      setBees(makeBees(word, nextBuilt))
      return
    }

    // The whole word: hold it up, cheer and say it, then the next one.
    holding.current = true
    setScore((s) => s + letterPoints + 10)
    setWordsDone((w) => w + 1)
    setBees([])
    setLine(cheer.hit({ say: pool[wordIndex].word }))
    later(() => startRound(round + 1), WORD_DONE_MS)
  }

  return (
    <div className="bee-catch">
      {preferences.relaxed && <button className="comfort-button" onClick={() => { if (!finished.current) { finished.current = true; onComplete(score); } }}>Finish my round</button>}
      <div className="bc-header">
        <div className="bc-title">🐝 Bee Catch</div>
        <div className="bc-stats">
          <div className="bc-stat"><span>Pace</span><strong>{preferences.relaxed ? "Your pace" : `${timeLeft}s`}</strong></div>
          <div className="bc-stat"><span>Score</span><strong>{score}</strong></div>
          <div className="bc-stat"><span>Words</span><strong>⭐ {wordsDone}</strong></div>
          <div className="bc-stat"><span>Streak</span><strong>🔥 {streak}</strong></div>
        </div>
      </div>

      <div className={`bc-word ${done ? 'done' : ''}`} aria-label="The word so far">
        {word.split('').map((ch, i) => {
          const isNext = i === built && !done
          const helped = isNext && wrongTaps >= TAPS_BEFORE_HELP
          const cls = i < built ? 'done' : isNext ? (helped ? 'next help' : 'next') : ''
          return (
            <span key={i} className={`bc-slot ${cls}`} data-testid={isNext ? 'bc-next' : undefined}>
              {i < built || helped ? ch.toUpperCase() : '_'}
            </span>
          )
        })}
        <button className="bc-hear" onClick={() => speak(pool[wordIndex].word)} aria-label="Hear the word">🔊</button>
      </div>
      <p className="bc-hint">Tap the bees to spell the word you hear!</p>

      <div className="bc-field">
        {bees.map((bee) => (
          <button
            key={bee.id}
            className={`bc-bee ${wrongId === bee.id ? 'wrong' : ''}`}
            style={{ top: `${bee.top}%`, left: `${bee.left}%`, animationDelay: `${bee.delay}s` }}
            onClick={() => tapBee(bee)}
            aria-label={`Bee ${bee.ch}`}
          >
            <span className="bc-bee-emoji" aria-hidden>🐝</span>
            <span className="bc-bee-letter">{bee.ch.toUpperCase()}</span>
          </button>
        ))}
        {done && (
          <div className="bc-flash ok" role="status">
            {line} {word.toUpperCase()}
            <Burst trigger={wordsDone} emoji={['🐝', '⭐', '✨', '🌼']} />
          </div>
        )}
      </div>
    </div>
  )
}

export default BeeCatch
