import { activityClock } from '../../../services/games/activityClock'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import type { Word } from '../../../services/wordBank'
import { useAudio } from '../../../contexts/AudioContext'
import ReviewSchedule from '../../../services/progress/ReviewSchedule'
import { shuffle, isPlayable } from '../shared/wordTricks'
import sfx from '../shared/sfx'
import useCheer from '../shared/useCheer'
import Burst from '../shared/Burst'
import { spellOut } from '../../../services/words/praise'
import './WordLock.css'

interface WordLockProps {
  onComplete: (score: number) => void
  words?: Word[]
  rounds?: number
}

/** How one letter of a try fits the word. */
export type Fit = 'right' | 'near' | 'out'

/**
 * Mark a try against the word, the way the lock's dials click: `right` is the
 * right letter in the right place, `near` is in the word but somewhere else,
 * `out` isn't in the word at all. A letter is only ever counted as many times
 * as the word has it — "baloon" against "balloon" has no spare "l" to mark.
 */
export const markTry = (attempt: string, answer: string): Fit[] => {
  const fits: Fit[] = [...attempt].map(() => 'out')
  const spare: Record<string, number> = {}
  for (let i = 0; i < answer.length; i++) {
    if (attempt[i] === answer[i]) fits[i] = 'right'
    else spare[answer[i]] = (spare[answer[i]] ?? 0) + 1
  }
  for (let i = 0; i < attempt.length; i++) {
    if (fits[i] === 'right') continue
    const c = attempt[i]
    if ((spare[c] ?? 0) > 0) {
      fits[i] = 'near'
      spare[c] -= 1
    }
  }
  return fits
}

const RANK: Record<Fit, number> = { out: 0, near: 1, right: 2 }
const FIT_WORDS: Record<Fit, string> = { right: 'in the right place', near: 'in the word, somewhere else', out: 'not in the word' }
const FIT_MARK: Record<Fit, string> = { right: '✓', near: '↔', out: '·' }

const KEY_ROWS = ['abcdefg', 'hijklmn', 'opqrstu', 'vwxyz'] as const
/** Five goes at a word, then it opens for them — a child should never be stuck. */
const TRIES = 5
/** Opening it sooner is worth more; every opened lock still scores. */
const TRY_POINTS = [60, 45, 35, 25, 20]
/** Not opened: a little for every letter they had in the right place. */
const PER_RIGHT_LETTER = 3

type Phase = 'trying' | 'open' | 'shown'

/**
 * Word Lock — spell the word to open the lock, one try at a time.
 *
 * The child hears a word and has a go at the whole spelling. The lock answers
 * every try letter by letter: right place, in the word somewhere else, or not
 * in it at all — so the next try fixes the letters that were wrong instead of
 * starting over. That is the "have a go" routine good spellers use on paper:
 * write it, look at which bits are wrong, write it again. Only the first try is
 * a clean recall, so only the first try goes into the review schedule.
 *
 * Letters come from an on-screen keypad (or a real keyboard), never a text
 * box, so no tablet keyboard can offer to finish the word.
 */
const WordLock: React.FC<WordLockProps> = ({ onComplete, words: providedWords, rounds = 4 }) => {
  const { speak } = useAudio()
  const cheer = useCheer()
  const [cheerLine, setCheerLine] = useState('')

  const words = useMemo<Word[]>(() => {
    const pool = providedWords && providedWords.length > 0 ? providedWords : []
    return shuffle(pool).filter((w) => isPlayable(w, 3)).slice(0, rounds)
  }, [providedWords, rounds])

  const [index, setIndex] = useState(0)
  const [tries, setTries] = useState<string[]>([])
  const [typed, setTyped] = useState('')
  const [phase, setPhase] = useState<Phase>('trying')
  const [shake, setShake] = useState(false)
  const [showMeaning, setShowMeaning] = useState(false)
  const [score, setScore] = useState(0)
  const [opened, setOpened] = useState(0)

  // The score state lags a render behind; the payout reads this instead.
  const scoreRef = useRef(0)
  // A ref, not state: two taps on "Try it" in one frame would both pass a state guard.
  const settled = useRef(false)
  const timers = useRef<number[]>([])
  const later = (fn: () => void, ms: number) => {
    timers.current.push(activityClock.setTimeout(fn, ms))
  }
  useEffect(() => () => timers.current.forEach((t) => activityClock.clearTimeout(t)), [])

  const current = words[index]
  const answer = (current?.word ?? '').toLowerCase()

  useEffect(() => {
    if (current) speak(current.word)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, words])

  const marks = useMemo(() => tries.map((t) => markTry(t, answer)), [tries, answer])

  /** The best each letter has done so far, for colouring the keypad. */
  const keyFits = useMemo(() => {
    const best: Record<string, Fit> = {}
    tries.forEach((t, r) =>
      [...t].forEach((c, i) => {
        const fit = marks[r][i]
        if (!best[c] || RANK[fit] > RANK[best[c]]) best[c] = fit
      })
    )
    return best
  }, [tries, marks])

  const addScore = (points: number) => {
    scoreRef.current += points
    setScore(scoreRef.current)
  }

  /** Next word, laid out in the same step that moves the index on. */
  const moveOn = () => {
    later(() => {
      if (index < words.length - 1) {
        setTries([])
        setTyped('')
        setPhase('trying')
        setShowMeaning(false)
        settled.current = false
        setIndex(index + 1)
      } else {
        onComplete(scoreRef.current)
      }
    }, 2000)
  }

  const type = (ch: string) => {
    if (phase !== 'trying' || settled.current || typed.length >= answer.length) return
    sfx.tap()
    setTyped((t) => (t.length < answer.length ? t + ch : t))
  }

  const erase = () => {
    if (phase !== 'trying' || settled.current) return
    setTyped((t) => t.slice(0, -1))
  }

  const check = () => {
    if (!current || phase !== 'trying' || settled.current || typed.length !== answer.length) return
    const attempt = typed
    const nextTries = [...tries, attempt]
    const right = attempt === answer
    // The first try is typed from the sound alone — a real recall. Later tries
    // have the lock's help, so they don't count either way.
    if (tries.length === 0) ReviewSchedule.record(current.id, right)
    setTries(nextTries)
    setTyped('')

    if (right) {
      settled.current = true
      setPhase('open')
      setOpened((n) => n + 1)
      addScore(TRY_POINTS[tries.length] ?? TRY_POINTS[TRY_POINTS.length - 1])
      setCheerLine(cheer.hit({ say: `${current.word}. Unlocked!` }))
      moveOn()
      return
    }

    if (nextTries.length >= TRIES) {
      settled.current = true
      setPhase('shown')
      cheer.miss({ quiet: true })
      const best = Math.max(...nextTries.map((t) => markTry(t, answer).filter((f) => f === 'right').length))
      addScore(best * PER_RIGHT_LETTER)
      speak(`It was ${current.word}. ${spellOut(current.word)}`)
      moveOn()
      return
    }

    // Same soft sound, and the run of right answers starts again.
    cheer.miss({ quiet: true })
    setShake(true)
    later(() => setShake(false), 450)
  }

  // A real keyboard works too. The listener lives for the whole mount and
  // reaches the latest handlers through this ref.
  const handlers = useRef({ type, erase, check })
  handlers.current = { type, erase, check }
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return
      const target = e.target as HTMLElement | null
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return
      if (/^[a-z]$/i.test(e.key)) {
        e.preventDefault()
        handlers.current.type(e.key.toLowerCase())
      } else if (e.key === 'Backspace') {
        e.preventDefault()
        handlers.current.erase()
      } else if (e.key === 'Enter') {
        e.preventDefault()
        handlers.current.check()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  if (!current) {
    return (
      <div className="word-lock">
        {/* No button: onComplete() is a finished game to the hub, and it pays
            a star for one. "Back to Games" in the header is the way out. */}
        <p className="wl-empty">
          No locks to open yet — learn a few words, then come back and crack them! 🔒
        </p>
      </div>
    )
  }

  const triesLeft = TRIES - tries.length
  const rows: React.ReactNode[] = tries.map((t, r) => (
    <div key={r} className="wl-row" aria-label={`Try ${r + 1}`}>
      {[...t].map((c, i) => (
        <span
          key={i}
          className={`wl-tile ${marks[r][i]}`}
          aria-label={`${c}: ${FIT_WORDS[marks[r][i]]}`}
        >
          {c}
          <span className="wl-fit" aria-hidden>{FIT_MARK[marks[r][i]]}</span>
        </span>
      ))}
    </div>
  ))
  if (phase === 'trying') {
    rows.push(
      <div key="now" className={`wl-row now ${shake ? 'shake' : ''}`} aria-label="This try">
        {[...answer].map((_, i) => (
          <span key={i} className={`wl-tile blank ${i === typed.length ? 'cursor' : ''}`}>
            {typed[i] ?? ''}
          </span>
        ))}
      </div>
    )
  } else if (phase === 'shown') {
    rows.push(
      <div key="shown" className="wl-row" aria-label="The word">
        {[...answer].map((c, i) => (
          <span key={i} className="wl-tile told">{c}</span>
        ))}
      </div>
    )
  }

  return (
    <div className="word-lock">
      <div className="wl-header">
        <div className="wl-title">🔒 Word Lock</div>
        <div className="wl-stats">
          <div className="wl-stat"><span>Word</span><strong>{index + 1}/{words.length}</strong></div>
          <div className="wl-stat"><span>Score</span><strong>{score}</strong></div>
          <div className="wl-stat"><span>Opened</span><strong>🔓 {opened}</strong></div>
        </div>
      </div>

      <div className={`wl-lock ${phase}`} aria-hidden>{phase === 'open' ? '🔓' : '🔒'}</div>

      <div className="wl-asks">
        <button className="wl-btn ghost" onClick={() => speak(current.word)}>🔊 Hear it again</button>
        <button
          className="wl-btn ghost"
          onClick={() => {
            setShowMeaning(true)
            if (current.meaning) speak(current.meaning)
          }}
        >
          💡 What does it mean?
        </button>
      </div>
      {showMeaning && current.meaning && <p className="wl-meaning">{current.meaning}</p>}

      <div className="wl-board" style={{ '--wl-len': answer.length } as React.CSSProperties}>
        {rows}
      </div>

      <p className={`wl-flash ${phase === 'open' ? 'ok' : phase === 'shown' ? 'bad' : ''}`} aria-live="polite">
        {phase === 'open' && <Burst trigger={opened} emoji={['🔓', '🔑', '✨', '⭐']} />}
        {phase === 'open'
          ? `🔓 ${cheerLine} “${current.word}” — unlocked!`
          : phase === 'shown'
          ? `It was “${current.word}” — the next lock is yours! 💪`
          : tries.length === 0
          ? `Spell the word — ${answer.length} letters.`
          : `${triesLeft} ${triesLeft === 1 ? 'try' : 'tries'} left. Keep the ✓ letters, move the ↔ ones.`}
      </p>

      <div className="wl-pad" role="group" aria-label="Letter keys">
        {KEY_ROWS.map((row, ri) => (
          <div key={row} className="wl-keys">
            {[...row].map((ch) => (
              <button
                key={ch}
                className={`wl-key ${keyFits[ch] ?? ''}`}
                onClick={() => type(ch)}
                disabled={phase !== 'trying'}
                aria-label={ch}
              >
                {ch}
              </button>
            ))}
            {ri === KEY_ROWS.length - 1 && (
              <button className="wl-key wide" onClick={erase} disabled={phase !== 'trying'} aria-label="Delete a letter">
                ⌫
              </button>
            )}
          </div>
        ))}
        <button
          className="wl-btn try"
          onClick={check}
          disabled={phase !== 'trying' || typed.length !== answer.length}
        >
          🔑 Try it
        </button>
      </div>

      <p className="wl-legend">
        <span className="wl-tile right mini">✓</span> right place
        <span className="wl-tile near mini">↔</span> somewhere else
        <span className="wl-tile out mini">·</span> not in the word
      </p>
    </div>
  )
}

export default WordLock
