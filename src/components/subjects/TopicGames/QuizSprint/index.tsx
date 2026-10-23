import { usePreferences } from '../../../../hooks/usePreferences'
import { activityClock } from '../../../../services/games/activityClock'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import type { Response } from '../../../../services/subjects/types'
import { correctAnswerText, isAnswered, isCorrect } from '../../../../services/subjects/grading'
import type { TopicGameProps } from '../../../../services/subjects/gamePool'
import { shuffle } from '../../../games/shared/wordTricks'
import { useCheer } from '../../../games/shared/useCheer'
import { useLater } from '../../../games/shared/useLater'
import Burst from '../../../games/shared/Burst'
import QuestionView from '../../QuestionView'
import RichText from '../../RichText'
import './QuizSprint.css'

/** Seconds on the clock. Long enough for a typed fraction, short enough to feel like a race. */
export const SPRINT_SECONDS = 90
/** Right answers that make a perfect run (pct 100). */
const FULL_MARKS = 10

type Flash = { ok: boolean; line: string; answer?: string } | null

/**
 * A race against the clock through the topic's own questions — any kind,
 * from multiple choice to typed fractions. One go at each; a miss shows the
 * answer for a moment and moves on, so nobody is ever stuck.
 */
const QuizSprint: React.FC<TopicGameProps> = ({ questions, onComplete }) => {
  const cheer = useCheer()
  const [preferences] = usePreferences()
  const later = useLater()
  const deck = useMemo(() => shuffle(questions), [questions])
  const [phase, setPhase] = useState<'ready' | 'playing' | 'done'>('ready')
  const [index, setIndex] = useState(0)
  const [response, setResponse] = useState<Response>(null)
  const [left, setLeft] = useState(SPRINT_SECONDS)
  const [right, setRight] = useState(0)
  const [tried, setTried] = useState(0)
  const [flash, setFlash] = useState<Flash>(null)
  const [burst, setBurst] = useState(0)
  const settled = useRef(false)
  const finished = useRef(false)

  const q = deck[index % Math.max(deck.length, 1)]

  useEffect(() => {
    if (phase !== 'playing' || preferences.relaxed) return
    const id = activityClock.setInterval(() => setLeft((s) => s - 1), 1000)
    return () => activityClock.clearInterval(id)
  }, [phase])

  useEffect(() => {
    if (phase === 'playing' && left <= 0) setPhase('done')
  }, [left, phase])

  const next = () => {
    settled.current = false
    setFlash(null)
    setResponse(null)
    if (preferences.relaxed && index + 1 >= Math.min(FULL_MARKS, deck.length)) setPhase('done')
    else setIndex((i) => i + 1)
  }

  const check = () => {
    if (!q || settled.current || phase !== 'playing' || !isAnswered(q, response)) return
    settled.current = true
    setTried((n) => n + 1)
    if (isCorrect(q, response)) {
      setRight((n) => n + 1)
      setBurst((n) => n + 1)
      setFlash({ ok: true, line: cheer.hit({ quiet: true }) })
      if (!preferences.waitForMe) later(next, 700)
    } else {
      setFlash({ ok: false, line: cheer.miss({ quiet: true }), answer: correctAnswerText(q) })
      if (!preferences.waitForMe) later(next, 2200)
    }
  }

  const skip = () => {
    if (settled.current || !q) return
    settled.current = true
    setFlash({ ok: false, line: 'Skipped — here it is:', answer: correctAnswerText(q) })
    if (!preferences.waitForMe) later(next, 1600)
  }

  if (deck.length === 0) {
    return <p className="quiz-sprint qs-empty">No questions to race through yet — try another topic!</p>
  }

  if (phase === 'ready') {
    return (
      <div className="quiz-sprint qs-card">
        <div className="qs-big" aria-hidden>
          ⏱️
        </div>
        <h2>Quiz Sprint</h2>
        <p>{preferences.relaxed ? `Try ${Math.min(FULL_MARKS, deck.length)} questions at your pace.` : `Answer as many as you can in ${SPRINT_SECONDS} seconds. ${FULL_MARKS} right is a perfect run!`}</p>
        <button type="button" className="qs-go" onClick={() => setPhase('playing')}>
          Go!
        </button>
      </div>
    )
  }

  if (phase === 'done') {
    // A relaxed round asks min(FULL_MARKS, deck) questions; all right is 100%.
    const outOf = preferences.relaxed ? Math.max(1, Math.min(FULL_MARKS, deck.length)) : FULL_MARKS
    const pct = Math.min(100, Math.round((right / outOf) * 100))
    return (
      <div className="quiz-sprint qs-card pop-in">
        <div className="qs-big" aria-hidden>
          {right >= outOf ? '🏆' : right >= outOf / 2 ? '🌟' : '💪'}
        </div>
        <h2>Time&apos;s up!</h2>
        <p>
          You got <strong>{right}</strong> right out of {tried} tried.
        </p>
        <button
          type="button"
          className="qs-go"
          onClick={() => {
            if (finished.current) return
            finished.current = true
            onComplete(Math.max(right > 0 ? 10 : 0, pct))
          }}
        >
          Done
        </button>
      </div>
    )
  }

  return (
    <div className="quiz-sprint">
      <div className="qs-bar">
        <span className={`qs-clock${left <= 10 ? ' qs-clock-low' : ''}`} aria-label={preferences.relaxed ? "No countdown" : `${left} seconds left`}>
          {preferences.relaxed ? `${index + 1} / ${Math.min(FULL_MARKS, deck.length)}` : `⏱️ ${left}s`}
        </span>
        <span className="qs-score" aria-label={`${right} right`}>
          ⭐ {right}
        </span>
      </div>
      <div className="qs-track" aria-hidden>
        <div className="qs-fill" style={{ width: `${(left / SPRINT_SECONDS) * 100}%` }} />
      </div>

      <section className="qs-question" key={`${q.id}-${index}`}>
        <Burst trigger={burst} />
        <QuestionView question={q} response={response} onChange={setResponse} locked={!!flash} onSubmit={check} showHint={false} />
        {flash && (
          <div className={`qs-flash ${flash.ok ? 'ok' : 'bad'}`} role="status">
            <strong>{flash.line}</strong>
            {flash.answer && (
              <span>
                {' '}
                The answer is <RichText text={flash.answer} />.
              </span>
            )}
          </div>
        )}
      </section>

      {flash && preferences.waitForMe && <button className="btn" onClick={next}>Continue →</button>}
      {!flash && (
        <div className="qs-actions">
          <button type="button" className="qs-skip" onClick={skip} aria-label="Skip this question">
            Skip
          </button>
          <button type="button" className="qs-go" disabled={!isAnswered(q, response)} onClick={check}>
            Check
          </button>
        </div>
      )}
    </div>
  )
}

export default QuizSprint
