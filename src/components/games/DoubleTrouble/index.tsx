import React, { useEffect, useMemo, useRef, useState } from 'react'
import type { Word } from '../../../services/wordBank'
import { useAudio } from '../../../contexts/AudioContext'
import { shuffle, isPlayable } from '../shared/wordTricks'
import sfx from '../shared/sfx'
import './DoubleTrouble.css'

interface DoubleTroubleProps {
  onComplete: (score: number) => void
  words?: Word[]
  rounds?: number
}

/** Where a word doubles a letter ("balloon" -> 2), or -1 if it never does. */
export const doubleAt = (word: string): number => {
  const w = word.toLowerCase()
  for (let i = 0; i < w.length - 1; i++) {
    if (w[i] === w[i + 1]) return i
  }
  return -1
}

/**
 * Double Trouble — find the letter that comes twice.
 *
 * Doubling is the single most reliable way to misspell a word: "accommodate",
 * "embarrass", "necessary". Nothing else in the hub looks at it. Rounds are
 * deliberately mixed — some words double a letter and some do not — because a
 * game where the answer is always "yes" teaches a child to guess rather than
 * look.
 *
 * The answer is tapped on the word itself, so there is no box for a tablet
 * keyboard to autocorrect.
 */
const DoubleTrouble: React.FC<DoubleTroubleProps> = ({ onComplete, words: providedWords, rounds = 8 }) => {
  const { speak } = useAudio()

  const words = useMemo<Word[]>(() => {
    // 3+ letters, matching GameCenter's gate — "egg" and "all" double a letter
    // just as well as a long word, and a stricter filter here would let the hub
    // offer an unlocked game with no rounds in it.
    const pool = shuffle(providedWords && providedWords.length > 0 ? providedWords : []).filter((w) =>
      isPlayable(w, 3)
    )
    const withDoubles = pool.filter((w) => doubleAt(w.word) >= 0)
    const without = pool.filter((w) => doubleAt(w.word) < 0)

    // Aim for a roughly even mix, then top up from whichever side has more so a
    // short word list still fills a full game.
    const half = Math.ceil(rounds / 2)
    const picked = [...withDoubles.slice(0, half), ...without.slice(0, rounds - half)]
    const spare = [...withDoubles.slice(half), ...without.slice(rounds - half)]
    return shuffle([...picked, ...spare.slice(0, rounds - picked.length)]).slice(0, rounds)
  }, [providedWords, rounds])

  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [found, setFound] = useState(0)
  const [verdict, setVerdict] = useState<'right' | 'wrong' | null>(null)

  // Settles before React re-renders, so a double tap cannot score twice.
  const locked = useRef(false)
  const timers = useRef<number[]>([])
  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms))
  }
  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), [])

  const current = words[index]
  const pairAt = current ? doubleAt(current.word) : -1

  useEffect(() => {
    if (!current) return
    setVerdict(null)
    locked.current = false
    speak(current.word)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, words])

  if (!current) {
    return (
      <div className="double-trouble">
        {/* No dismiss button: onComplete() means "round finished" and the hub
            pays out for it. "Back to Games" already sits in the header. */}
        <p className="dt-empty">
          No words to inspect yet — learn a few words, then come back and hunt
          for their double letters! 🔍
        </p>
      </div>
    )
  }

  const settle = (correct: boolean) => {
    if (locked.current) return
    locked.current = true
    setVerdict(correct ? 'right' : 'wrong')
    if (correct) {
      setScore((s) => s + 20)
      setFound((f) => f + 1)
      sfx.correct()
    } else {
      sfx.wrong()
      speak(pairAt >= 0 ? `${current.word} has a double letter` : `${current.word} has no double letters`)
    }
    later(() => {
      if (index < words.length - 1) {
        setIndex((i) => i + 1)
      } else {
        onComplete(score + (correct ? 20 : 0))
      }
    }, 1600)
  }

  /** Tapping either half of the doubled pair counts — the child spotted it. */
  const tapLetter = (i: number) => {
    if (verdict) return
    settle(pairAt >= 0 && (i === pairAt || i === pairAt + 1))
  }

  return (
    <div className="double-trouble">
      <div className="dt-header">
        <div className="dt-title">👯 Double Trouble</div>
        <div className="dt-stats">
          <div className="dt-stat"><span>Word</span><strong>{index + 1}/{words.length}</strong></div>
          <div className="dt-stat"><span>Score</span><strong>{score}</strong></div>
          <div className="dt-stat"><span>Spotted</span><strong>🔍 {found}</strong></div>
        </div>
      </div>

      <button className="dt-btn hear" onClick={() => speak(current.word)}>🔊 Hear it again</button>

      <div className="dt-word" aria-label="Tap the letter that appears twice in a row">
        {[...current.word].map((ch, i) => {
          const isPair = pairAt >= 0 && (i === pairAt || i === pairAt + 1)
          const show = verdict && isPair
          return (
            <button
              key={i}
              className={`dt-letter ${show ? 'pair' : ''}`}
              onClick={() => tapLetter(i)}
              disabled={!!verdict}
              aria-label={`letter ${i + 1}: ${ch}`}
            >
              {ch}
            </button>
          )
        })}
      </div>

      <p className="dt-hint">
        {verdict ? '' : 'Tap the letter that appears twice in a row — or say there is no double.'}
      </p>

      <button className="dt-btn none" onClick={() => !verdict && settle(pairAt < 0)} disabled={!!verdict}>
        🚫 No doubles here!
      </button>

      {verdict === 'right' && <div className="dt-flash ok">🎉 Spotted it! +20</div>}
      {verdict === 'wrong' && (
        <div className="dt-flash bad">
          {pairAt >= 0
            ? `“${current.word}” doubles its ${current.word[pairAt]} — look again next time!`
            : `“${current.word}” has no double letters at all!`}
        </div>
      )}
    </div>
  )
}

export default DoubleTrouble
