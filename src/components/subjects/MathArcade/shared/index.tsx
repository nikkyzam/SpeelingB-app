import React, { useEffect, useMemo, useRef } from 'react'
import { useAudio } from '../../../../contexts/AudioContext'
import sfx from '../../../games/shared/sfx'
import Burst from '../../../games/shared/Burst'
import './shared.css'

/**
 * The furniture every Math Arcade game shares, so the five feel like one toy
 * box: a start card with three kid-named challenges, a header with the score,
 * a gentle feedback line, and a finish card whose Done button reports back.
 *
 * Nothing here is stored: the page hosting the arcade records best scores.
 */

export type Level = 'easy' | 'medium' | 'hard'

export const LEVELS: { id: Level; icon: string; name: string }[] = [
  { id: 'easy', icon: '🐣', name: 'Sprout' },
  { id: 'medium', icon: '🚀', name: 'Explorer' },
  { id: 'hard', icon: '🦁', name: 'Champion' },
]

/** Props every arcade game takes. `grade` is 'k' or '1'..'8'. */
export interface MathGameProps {
  onComplete: (score: number) => void
  grade?: string
}

export const rnd = (n: number): number => Math.floor(Math.random() * n)

/** The challenge that suits a grade: K–1 Sprout, 2–3 Explorer, 4+ Champion. */
export const levelForGrade = (grade?: string): Level | undefined => {
  if (!grade) return undefined
  const g = grade.trim().toLowerCase()
  if (g === 'k' || g === '0' || g === '1') return 'easy'
  if (g === '2' || g === '3') return 'medium'
  const n = Number(g)
  return Number.isInteger(n) && n >= 4 ? 'hard' : undefined
}

/** 0–3 stars from a score and the three bars to clear. */
export const starsFor = (score: number, bars: readonly [number, number, number]): number =>
  score >= bars[2] ? 3 : score >= bars[1] ? 2 : score >= bars[0] ? 1 : 0

/**
 * Remembers the best run of this sitting and hands it to `onComplete` once,
 * when the child taps Done. "Play again" can come before that any number of
 * times; the host only ever hears one number.
 */
export const useFinish = (onComplete: (score: number) => void) => {
  const best = useRef<number | null>(null)
  const sent = useRef(false)
  const report = useRef(onComplete)
  report.current = onComplete
  return useMemo(
    () => ({
      record: (score: number) => {
        best.current = best.current === null ? score : Math.max(best.current, score)
      },
      done: () => {
        if (sent.current || best.current === null) return
        sent.current = true
        report.current(best.current)
      },
    }),
    []
  )
}

interface StartCardProps {
  icon: string
  title: string
  blurb: string
  suggested?: Level
  onPick: (level: Level) => void
}

/** Title, a one-line how-to (said aloud for pre-readers) and the three challenges. */
export const StartCard: React.FC<StartCardProps> = ({ icon, title, blurb, suggested, onPick }) => {
  const { speak } = useAudio()
  useEffect(() => {
    speak(`${title}. ${blurb}`)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="ma-card ma-start">
      <div className="ma-start-icon" aria-hidden>{icon}</div>
      <h2 className="ma-title">{title}</h2>
      <p className="ma-blurb">{blurb}</p>
      <button className="ma-hear" onClick={() => speak(blurb)} aria-label="Hear how to play">
        🔊 Hear it
      </button>
      <h3 className="ma-pick-head">Pick your challenge</h3>
      <div className="ma-levels" role="group" aria-label="Challenges">
        {LEVELS.map((l) => (
          <button
            key={l.id}
            className={`ma-level ${suggested === l.id ? 'suggested' : ''}`}
            onClick={() => {
              sfx.pop()
              onPick(l.id)
            }}
            aria-label={`Play ${l.name}`}
          >
            <span className="ma-level-icon" aria-hidden>{l.icon}</span>
            <strong>{l.name}</strong>
            {suggested === l.id && <span className="ma-level-tag">Just right for you</span>}
          </button>
        ))}
      </div>
    </div>
  )
}

interface HeaderProps {
  icon: string
  title: string
  children?: React.ReactNode
}

export const GameHeader: React.FC<HeaderProps> = ({ icon, title, children }) => (
  <div className="ma-header">
    <div className="ma-header-title">
      <span aria-hidden>{icon}</span> {title}
    </div>
    <div className="ma-hud">{children}</div>
  </div>
)

/** A thin bar that empties (time) or fills (rounds). */
export const ProgressBar: React.FC<{ value: number; low?: boolean }> = ({ value, low }) => (
  <div className="ma-track" aria-hidden>
    <div className={`ma-fill ${low ? 'low' : ''}`} style={{ width: `${Math.max(0, Math.min(1, value)) * 100}%` }} />
  </div>
)

export const Stars: React.FC<{ n: number }> = ({ n }) => (
  <span className="ma-stars" role="img" aria-label={`${n} out of 3 stars`}>
    {[0, 1, 2].map((i) => (
      <span key={i} className={i < n ? 'lit' : ''}>★</span>
    ))}
  </span>
)

interface FinishCardProps {
  title: string
  score: React.ReactNode
  label: string
  stars: number
  onAgain: () => void
  onDone: () => void
}

/** The end of a run. Every finish is worth celebrating, stars or not. */
export const FinishCard: React.FC<FinishCardProps> = ({ title, score, label, stars, onAgain, onDone }) => {
  const { speak } = useAudio()
  const cheer = stars >= 3 ? 'Superstar!' : stars === 2 ? 'Great work!' : stars === 1 ? 'Nice going!' : 'Good practice — every try makes you stronger!'
  useEffect(() => {
    sfx.win()
    speak(`${title} ${cheer}`)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="ma-card ma-finish">
      <div className="ma-finish-burst">
        <Burst trigger={1} />
        <h2 className="ma-title">{title}</h2>
      </div>
      <Stars n={stars} />
      <div className="ma-bigscore">
        {score} <small>{label}</small>
      </div>
      <p className="ma-blurb">{cheer}</p>
      <div className="ma-endbtns">
        <button className="ma-btn" onClick={onDone} aria-label="Done">
          Done ✓
        </button>
        <button className="ma-btn ghost" onClick={onAgain} aria-label="Play again">
          Play again
        </button>
      </div>
    </div>
  )
}

/** The line under the board after an answer: praise, or the right answer kindly. */
export const Feedback: React.FC<{ ok: boolean | null; children?: React.ReactNode }> = ({ ok, children }) => (
  <p className={`ma-flash ${ok === null ? '' : ok ? 'ok' : 'bad'}`} role="status" aria-live="polite">
    {children}
  </p>
)
