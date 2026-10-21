import React, { useMemo, useState } from 'react'
import type { Question, Response } from '../../../services/subjects/types'
import { correctAnswerText, givenText, isAnswered, isCorrect, letterGrade } from '../../../services/subjects/grading'
import SubjectProgress from '../../../services/subjects/SubjectProgress'
import { useRewardStore } from '../../../stores/rewards/useRewardStore'
import Button from '../../common/Button'
import QuestionView from '../QuestionView'
import RichText from '../RichText'
import CoordinateGrid from '../CoordinateGrid'
import './TestRunner.css'

interface TestRunnerProps {
  title: string
  questions: Question[]
  /** Where the best score is kept, e.g. "test:european-union:main". */
  resultKey: string
  onExit: () => void
}

type Phase = 'answering' | 'confirm' | 'results'

/**
 * A practice test: one question per screen, nothing graded until the child
 * hands it in — then the score, what to review, and every question with the
 * right answer and why.
 */
const TestRunner: React.FC<TestRunnerProps> = ({ title, questions, resultKey, onExit }) => {
  const { addStars } = useRewardStore()
  const [index, setIndex] = useState(0)
  const [responses, setResponses] = useState<Response[]>(() => questions.map(() => null))
  const [phase, setPhase] = useState<Phase>('answering')
  const [outcome, setOutcome] = useState<{ newBest: boolean; stars: number } | null>(null)
  const [reviewMissesOnly, setReviewMissesOnly] = useState(true)

  const answered = responses.filter((r, i) => isAnswered(questions[i], r)).length
  const correct = useMemo(
    () => (phase === 'results' ? questions.filter((q, i) => isCorrect(q, responses[i])).length : 0),
    [phase, questions, responses]
  )
  const pct = Math.round((correct / questions.length) * 100)

  const setResponse = (r: Response) =>
    setResponses((prev) => {
      const next = [...prev]
      next[index] = r
      return next
    })

  const handIn = () => {
    const right = questions.filter((q, i) => isCorrect(q, responses[i])).length
    const result = SubjectProgress.recordResult(resultKey, right, questions.length)
    if (result.stars) addStars(result.stars)
    setOutcome(result)
    setPhase('results')
    window.scrollTo?.({ top: 0 })
  }

  const tryHandIn = () => (answered < questions.length ? setPhase('confirm') : handIn())

  if (phase === 'results') {
    const misses = questions.map((q, i) => ({ q, r: responses[i], i })).filter(({ q, r }) => !isCorrect(q, r))
    const byCategory = misses.reduce<Record<string, number>>((acc, { q }) => {
      acc[q.category] = (acc[q.category] ?? 0) + 1
      return acc
    }, {})
    const shown = reviewMissesOnly ? misses : questions.map((q, i) => ({ q, r: responses[i], i }))

    return (
      <div className="test-runner">
        <section className="tr-score pop-in">
          <div className="tr-grade" aria-label={`Grade ${letterGrade(pct)}`}>
            {letterGrade(pct)}
          </div>
          <div>
            <h2>
              {correct} of {questions.length} right — {pct}%
            </h2>
            <p>
              {pct === 100
                ? 'Every single one! 🎉'
                : pct >= 80
                ? 'Brilliant work! Look over the few you missed.'
                : 'Good effort! Each miss below shows the answer and an easier way to get it.'}
            </p>
            {outcome && (outcome.stars > 0 || outcome.newBest) && (
              <p className="tr-reward">
                {outcome.stars > 0 && <>⭐ +{outcome.stars} stars </>}
                {outcome.newBest && <>🏅 New best!</>}
              </p>
            )}
          </div>
        </section>

        {Object.keys(byCategory).length > 0 && (
          <section className="tr-categories">
            <h3>What to review</h3>
            <ul>
              {Object.entries(byCategory)
                .sort((a, b) => b[1] - a[1])
                .map(([cat, n]) => (
                  <li key={cat}>
                    <strong>{cat}</strong> — {n} to look at
                  </li>
                ))}
            </ul>
          </section>
        )}

        <div className="tr-review-toggle">
          <Button size="small" variant={reviewMissesOnly ? 'primary' : 'secondary'} onClick={() => setReviewMissesOnly(true)}>
            Missed ({misses.length})
          </Button>
          <Button size="small" variant={reviewMissesOnly ? 'secondary' : 'primary'} onClick={() => setReviewMissesOnly(false)}>
            All questions
          </Button>
        </div>

        <ol className="tr-review">
          {shown.map(({ q, r, i }) => {
            const ok = isCorrect(q, r)
            return (
              <li key={q.id} className={`tr-review-item ${ok ? 'tr-ok' : 'tr-miss'}`}>
                <div className="tr-review-head">
                  <span className="tr-num">{q.label ?? i + 1}</span>
                  <span>{ok ? '✅' : '💛'}</span>
                </div>
                <p className="tr-review-q">
                  <RichText text={q.prompt} />
                </p>
                {!ok && (
                  <p>
                    You said: <em>{givenText(q, r)}</em>
                  </p>
                )}
                <p>
                  Answer: <strong><RichText text={correctAnswerText(q)} /></strong>
                </p>
                <p className="tr-why">
                  <RichText text={q.explanation} />
                </p>
                {q.answerFigure && <CoordinateGrid figure={q.answerFigure} />}
                {q.tip && (
                  <p className="tr-tip">
                    ✨ Easy way to get it: <RichText text={q.tip} />
                  </p>
                )}
              </li>
            )
          })}
        </ol>

        <div className="tr-actions">
          <Button variant="primary" icon="🔁" onClick={() => {
            setResponses(questions.map(() => null))
            setIndex(0)
            setOutcome(null)
            setPhase('answering')
          }}>
            Try again
          </Button>
          <Button variant="secondary" onClick={onExit}>
            Back to tests
          </Button>
        </div>
      </div>
    )
  }

  const q = questions[index]
  return (
    <div className="test-runner">
      <header className="tr-head">
        <h2>{title}</h2>
        <span className="tr-count">
          {answered} of {questions.length} answered
        </span>
      </header>

      <nav className="tr-dots" aria-label="Questions">
        {questions.map((qq, i) => (
          <button
            key={qq.id}
            type="button"
            className={`tr-dot${i === index ? ' tr-dot-current' : ''}${isAnswered(qq, responses[i]) ? ' tr-dot-done' : ''}`}
            aria-label={`Question ${i + 1}${isAnswered(qq, responses[i]) ? ', answered' : ''}`}
            aria-current={i === index}
            onClick={() => setIndex(i)}
          >
            {qq.label ?? i + 1}
          </button>
        ))}
      </nav>

      <section className="tr-card" key={q.id}>
        <div className="tr-card-meta">
          <span className="tr-num">{q.label ?? index + 1}</span>
          <span className="tr-cat">{q.category}</span>
        </div>
        <QuestionView
          question={q}
          response={responses[index]}
          onChange={setResponse}
          onSubmit={() => index < questions.length - 1 && setIndex(index + 1)}
        />
      </section>

      {phase === 'confirm' ? (
        <div className="tr-confirm" role="alert">
          <p>
            {questions.length - answered} question{questions.length - answered === 1 ? ' is' : 's are'} still blank. Hand it in anyway?
          </p>
          <div className="tr-actions">
            <Button variant="secondary" onClick={() => {
              const firstBlank = responses.findIndex((r, i) => !isAnswered(questions[i], r))
              if (firstBlank >= 0) setIndex(firstBlank)
              setPhase('answering')
            }}>
              Go to a blank one
            </Button>
            <Button variant="primary" onClick={handIn}>
              Hand it in
            </Button>
          </div>
        </div>
      ) : (
        <div className="tr-actions">
          <Button variant="secondary" disabled={index === 0} onClick={() => setIndex(index - 1)}>
            ← Back
          </Button>
          {index < questions.length - 1 ? (
            <Button variant="primary" onClick={() => setIndex(index + 1)}>
              Next →
            </Button>
          ) : (
            <Button variant="success" icon="📝" onClick={tryHandIn}>
              Check my test
            </Button>
          )}
        </div>
      )}
      {index < questions.length - 1 && answered === questions.length && phase === 'answering' && (
        <div className="tr-actions">
          <Button variant="success" icon="📝" onClick={handIn}>
            All done — check my test
          </Button>
        </div>
      )}
      <button type="button" className="tr-leave" onClick={onExit}>
        Leave this test
      </button>
    </div>
  )
}

export default TestRunner
