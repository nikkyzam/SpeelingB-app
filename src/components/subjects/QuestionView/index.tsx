import React from 'react'
import type { Question, Response } from '../../../services/subjects/types'
import { isCorrect } from '../../../services/subjects/grading'
import RichText from '../RichText'
import CoordinateGrid from '../CoordinateGrid'
import NumberInput from '../NumberInput'
import SpellingInput from '../../common/SpellingInput'
import './QuestionView.css'

interface QuestionViewProps {
  question: Question
  response: Response
  onChange: (r: Response) => void
  /** Answers can no longer change; right and wrong choices are marked. */
  locked?: boolean
  /** Pressing Enter in a typed answer. */
  onSubmit?: () => void
  /** Show the question's hint under it. Practice keeps it behind a button instead. */
  showHint?: boolean
}

/** A stable shuffle, so a question's options don't jump around on every render. */
const seededOrder = (seed: string, n: number): number[] => {
  let h = 2166136261
  for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619)
  const order = Array.from({ length: n }, (_, i) => i)
  for (let i = n - 1; i > 0; i--) {
    h = Math.imul(h ^ (h >>> 13), 0x5bd1e995)
    const j = (h >>> 0) % (i + 1)
    ;[order[i], order[j]] = [order[j], order[i]]
  }
  // A shuffle that happens to be the answer is no puzzle.
  if (n > 1 && order.every((v, i) => v === i)) order.reverse()
  return order
}

/** Shows any kind of question and collects the child's answer. Grading is the parent's job. */
const QuestionView: React.FC<QuestionViewProps> = ({ question: q, response, onChange, locked, onSubmit, showHint = true }) => {
  const right = locked && isCorrect(q, response)

  const choiceClass = (i: number, chosen: boolean, correct: boolean) =>
    ['qv-choice', chosen && 'qv-chosen', locked && correct && 'qv-right', locked && chosen && !correct && 'qv-wrong']
      .filter(Boolean)
      .join(' ')

  const body = () => {
    switch (q.kind) {
      case 'choice':
        return (
          <div className={`qv-choices${q.mono ? ' qv-mono' : ''}`}>
            {q.choices.map((c, i) => (
              <button
                key={i}
                type="button"
                className={choiceClass(i, response === i, i === q.answer)}
                disabled={locked}
                aria-pressed={response === i}
                onClick={() => onChange(i)}
              >
                <RichText text={c} />
              </button>
            ))}
          </div>
        )

      case 'truefalse':
        return (
          <div className="qv-choices qv-two">
            {[true, false].map((v) => (
              <button
                key={String(v)}
                type="button"
                className={choiceClass(v ? 0 : 1, response === v, v === q.answer)}
                disabled={locked}
                aria-pressed={response === v}
                onClick={() => onChange(v)}
              >
                {v ? '👍 True' : '👎 False'}
              </button>
            ))}
          </div>
        )

      case 'multi': {
        const picked = Array.isArray(response) ? (response as number[]) : []
        return (
          <>
            <p className="qv-note">Pick every one that fits.</p>
            <div className={`qv-choices${q.mono ? ' qv-mono' : ''}`}>
              {q.choices.map((c, i) => {
                const on = picked.includes(i)
                return (
                  <button
                    key={i}
                    type="button"
                    className={choiceClass(i, on, q.answers.includes(i))}
                    disabled={locked}
                    aria-pressed={on}
                    onClick={() => onChange(on ? picked.filter((p) => p !== i) : [...picked, i])}
                  >
                    <span className="qv-check" aria-hidden>{on ? '☑' : '☐'}</span> <RichText text={c} />
                  </button>
                )
              })}
            </div>
          </>
        )
      }

      case 'order': {
        const chosen = Array.isArray(response) ? (response as number[]) : []
        const display = seededOrder(q.id, q.items.length)
        return (
          <>
            <p className="qv-note">Tap them in order. Tap a chosen one to take it back.</p>
            <ol className="qv-order-chosen">
              {chosen.map((idx, pos) => (
                <li key={idx}>
                  <button
                    type="button"
                    className={`qv-chip${locked ? (idx === pos ? ' qv-right' : ' qv-wrong') : ''}`}
                    disabled={locked}
                    onClick={() => onChange(chosen.filter((c) => c !== idx))}
                  >
                    <RichText text={q.items[idx]} />
                  </button>
                </li>
              ))}
            </ol>
            {!locked && (
              <div className="qv-order-pool">
                {display
                  .filter((idx) => !chosen.includes(idx))
                  .map((idx) => (
                    <button key={idx} type="button" className="qv-chip" onClick={() => onChange([...chosen, idx])}>
                      <RichText text={q.items[idx]} />
                    </button>
                  ))}
              </div>
            )}
          </>
        )
      }

      case 'match': {
        const picks = Array.isArray(response) ? (response as number[]) : q.pairs.map(() => -1)
        const rightOrder = seededOrder(q.id, q.pairs.length)
        return (
          <div className="qv-match">
            {q.pairs.map(([left], row) => (
              <label key={row} className={`qv-match-row${locked ? (picks[row] === row ? ' qv-right' : ' qv-wrong') : ''}`}>
                <span className="qv-match-left">
                  <RichText text={left} />
                </span>
                <select
                  value={picks[row]}
                  disabled={locked}
                  onChange={(e) => {
                    const next = [...picks]
                    next[row] = Number(e.target.value)
                    onChange(next)
                  }}
                >
                  <option value={-1}>Choose…</option>
                  {rightOrder.map((idx) => (
                    <option key={idx} value={idx}>
                      {q.pairs[idx][1].replace(/<[^>]+>/g, '')}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </div>
        )
      }

      case 'number':
      case 'pair':
        return (
          <NumberInput
            value={typeof response === 'string' ? response : ''}
            onChange={onChange}
            pair={q.kind === 'pair'}
            disabled={locked}
            onEnter={onSubmit}
          />
        )

      case 'text':
        return (
          <SpellingInput
            className="qv-text"
            value={typeof response === 'string' ? response : ''}
            disabled={locked}
            placeholder="Type your answer"
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onSubmit?.()
            }}
          />
        )

      case 'plot': {
        const placed = Array.isArray(response) ? (response as [number, number][]) : []
        return (
          <>
            <p className="qv-note">Tap the grid to place a point. Tap it again to remove it.</p>
            <CoordinateGrid
              figure={q.figure}
              bounds={q.grid}
              placed={placed}
              onToggle={
                locked
                  ? undefined
                  : (x, y) =>
                      onChange(
                        placed.some(([px, py]) => px === x && py === y)
                          ? placed.filter(([px, py]) => px !== x || py !== y)
                          : [...placed, [x, y]]
                      )
              }
            />
          </>
        )
      }
    }
  }

  return (
    <div className={`question-view${locked ? (right ? ' qv-is-right' : ' qv-is-wrong') : ''}`}>
      <p className={`qv-prompt${q.mono ? ' qv-mono' : ''}`}>
        <RichText text={q.prompt} />
      </p>
      {q.figure && q.kind !== 'plot' && <CoordinateGrid figure={q.figure} />}
      {q.hint && showHint && !locked && <p className="qv-hint">💡 {q.hint}</p>}
      {body()}
    </div>
  )
}

export default QuestionView
