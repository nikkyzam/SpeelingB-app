import React, { useRef, useState } from 'react'
import type { Question, Response } from '../../../services/subjects/types'
import { correctAnswerText, isAnswered, isCorrect } from '../../../services/subjects/grading'
import SubjectProgress from '../../../services/subjects/SubjectProgress'
import { useRewardStore } from '../../../stores/rewards/useRewardStore'
import { useCheer } from '../../games/shared/useCheer'
import Button from '../../common/Button'
import QuestionView from '../QuestionView'
import RichText from '../RichText'
import CoordinateGrid from '../CoordinateGrid'
import './PracticeRunner.css'

interface PracticeRunnerProps {
  title: string
  questions: Question[]
  /** Where the best score is kept, e.g. "quest:g4-multcomp:practice". */
  resultKey: string
  onExit: () => void
  onFinish?: (correct: number, total: number) => void
}

/** Two goes at each question; after the second miss the answer is shown. */
const TRIES = 2

type Verdict = { kind: 'right' | 'retry' | 'shown'; line: string } | null

/**
 * Practice one question at a time: check it straight away, try again once,
 * then see the answer and why — a child is never left stuck on a question.
 */
const PracticeRunner: React.FC<PracticeRunnerProps> = ({ title, questions, resultKey, onExit, onFinish }) => {
  const { addStars } = useRewardStore()
  const cheer = useCheer()
  const [index, setIndex] = useState(0)
  const [response, setResponse] = useState<Response>(null)
  const [tries, setTries] = useState(0)
  const [hintOpen, setHintOpen] = useState(false)
  const [verdict, setVerdict] = useState<Verdict>(null)
  const [score, setScore] = useState(0)
  const [result, setResult] = useState<{ newBest: boolean; stars: number } | null>(null)
  // A double tap on Check must settle the answer once.
  const settled = useRef(false)

  const q = questions[index]
  const locked = verdict?.kind === 'right' || verdict?.kind === 'shown'

  const check = () => {
    if (!q || settled.current || !isAnswered(q, response)) return
    if (isCorrect(q, response)) {
      settled.current = true
      setScore((s) => s + 1)
      setVerdict({ kind: 'right', line: cheer.hit({ quiet: true }) })
      return
    }
    const used = tries + 1
    setTries(used)
    if (used >= TRIES) {
      settled.current = true
      setVerdict({ kind: 'shown', line: cheer.miss({ quiet: true }) })
    } else {
      setVerdict({ kind: 'retry', line: `${cheer.miss({ quiet: true })} Have another go.` })
    }
  }

  const next = () => {
    settled.current = false
    setVerdict(null)
    setResponse(null)
    setTries(0)
    setHintOpen(false)
    if (index + 1 < questions.length) {
      setIndex(index + 1)
      return
    }
    const r = SubjectProgress.recordResult(resultKey, score, questions.length)
    if (r.stars) addStars(r.stars)
    setResult(r)
    onFinish?.(score, questions.length)
  }

  if (result) {
    const pct = Math.round((score / questions.length) * 100)
    return (
      <div className="practice-runner">
        <section className="pr-card pr-done pop-in">
          <div className="pr-done-icon" aria-hidden>
            {pct >= 80 ? '🏆' : pct >= 50 ? '🌟' : '💪'}
          </div>
          <h2>
            {score} of {questions.length} right!
          </h2>
          <p>
            {pct === 100 ? 'A perfect round!' : pct >= 80 ? 'Super work!' : 'Every try makes your brain stronger.'}
          </p>
          {(result.stars > 0 || result.newBest) && (
            <p className="pr-reward">
              {result.stars > 0 && <>⭐ +{result.stars} stars </>}
              {result.newBest && <>🏅 New best!</>}
            </p>
          )}
          <div className="pr-actions">
            <Button variant="secondary" onClick={onExit}>
              Done
            </Button>
          </div>
        </section>
      </div>
    )
  }

  if (!q) {
    return (
      <div className="practice-runner">
        <p className="pr-empty">No questions here yet — try another round!</p>
        <Button variant="secondary" onClick={onExit}>
          Back
        </Button>
      </div>
    )
  }

  return (
    <div className="practice-runner">
      <header className="pr-head">
        <h2>{title}</h2>
        <span className="pr-count">
          {index + 1} / {questions.length} · ⭐ {score}
        </span>
      </header>
      <div className="pr-track" aria-hidden>
        <div className="pr-fill" style={{ width: `${(index / questions.length) * 100}%` }} />
      </div>

      <section className="pr-card" key={q.id}>
        <QuestionView
          question={q}
          response={response}
          onChange={(r) => {
            setResponse(r)
            if (verdict?.kind === 'retry') setVerdict(null)
          }}
          locked={locked}
          onSubmit={locked ? next : check}
          showHint={hintOpen}
        />

        {verdict && (
          <div className={`pr-verdict pr-${verdict.kind}`} role="status">
            <p className="pr-line">{verdict.line}</p>
            {verdict.kind === 'shown' && (
              <p>
                The answer is <strong><RichText text={correctAnswerText(q)} /></strong>
              </p>
            )}
            {locked && (
              <>
                <p className="pr-why">
                  <RichText text={q.explanation} />
                </p>
                {q.answerFigure && <CoordinateGrid figure={q.answerFigure} />}
              </>
            )}
          </div>
        )}
      </section>

      <div className="pr-actions">
        {!locked && q.hint && !hintOpen && (
          <Button variant="secondary" icon="💡" onClick={() => setHintOpen(true)}>
            Show a hint
          </Button>
        )}
        {locked ? (
          <Button variant="primary" onClick={next}>
            {index + 1 < questions.length ? 'Next →' : 'Finish'}
          </Button>
        ) : (
          <Button variant="success" disabled={!isAnswered(q, response)} onClick={check}>
            Check
          </Button>
        )}
      </div>
      <button type="button" className="pr-leave" onClick={onExit}>
        Stop for now
      </button>
    </div>
  )
}

export default PracticeRunner
