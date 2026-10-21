import React, { useEffect, useState } from 'react'
import { useAudio } from '../../../contexts/AudioContext'
import { correctAnswerText, isAnswered, isCorrect } from '../../../services/subjects/grading'
import type { Lesson, LessonArt, LessonSpeaker } from '../../../services/subjects/mathExtras'
import NumberInput from '../NumberInput'
import './ComicLesson.css'

/**
 * A short comic: friendly characters talk a child through one idea, with a
 * quick check now and then. A check never blocks — right or wrong, the child
 * sees the answer and why, then carries on.
 */
interface ComicLessonProps {
  lesson: Lesson
  onDone: () => void
}

const SPEAKERS: Record<LessonSpeaker, { name: string; colour: string }> = {
  pip: { name: 'Pip', colour: 'var(--primary)' },
  nim: { name: 'Nim', colour: 'var(--secondary)' },
  vex: { name: 'Vex', colour: 'var(--accent)' },
}

/** A round little character. Drawn, not imported, so it follows the theme. */
const Speaker: React.FC<{ who: LessonSpeaker }> = ({ who }) => {
  const { colour } = SPEAKERS[who]
  return (
    <svg className="comic-lesson-speaker" viewBox="0 0 64 64" aria-hidden="true">
      <ellipse cx="32" cy="36" rx="26" ry="24" fill={colour} />
      {who === 'pip' && <path d="M24 14 L28 4 L32 13 L36 4 L40 14" fill={colour} />}
      {who === 'nim' && <circle cx="32" cy="10" r="5" fill={colour} />}
      {who === 'vex' && <path d="M14 20 L10 8 L22 15 M50 20 L54 8 L42 15" fill={colour} stroke={colour} strokeWidth="3" />}
      <circle cx="23" cy="33" r="6" fill="#fff" />
      <circle cx="41" cy="33" r="6" fill="#fff" />
      <circle cx="24" cy="34" r="3" fill="#333" />
      <circle cx="42" cy="34" r="3" fill="#333" />
      <path d="M24 46 Q32 53 40 46" fill="none" stroke="#333" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

/** Small diagrams for the lessons: dot arrays, a shaded bar, two bars compared. */
export const LessonArtView: React.FC<{ art: LessonArt }> = ({ art }) => {
  if (art.kind === 'array') {
    const { rows, cols } = art
    const cell = 30
    const pad = 14
    const w = cols * cell + pad * 2
    const h = rows * cell + pad * 2
    const dots = []
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        dots.push(
          <circle key={`${r}-${c}`} cx={pad + c * cell + cell / 2} cy={pad + r * cell + cell / 2} r="10" fill="var(--accent)" />
        )
      }
    }
    return (
      <svg className="comic-lesson-art" viewBox={`0 0 ${w} ${h}`} width={Math.min(w, 260)} role="img" aria-label={`${rows} rows of ${cols}`}>
        {dots}
      </svg>
    )
  }

  if (art.kind === 'bar') {
    const { parts, filled } = art
    const w = 260
    const h = 60
    const seg = w / parts
    return (
      <svg className="comic-lesson-art" viewBox={`0 0 ${w} ${h}`} width={w} role="img" aria-label={`${filled} of ${parts} equal parts shaded`}>
        {Array.from({ length: parts }, (_, i) => (
          <rect
            key={i}
            x={i * seg + 2}
            y={4}
            width={seg - 4}
            height={h - 8}
            rx="8"
            fill={i < filled ? 'var(--accent)' : 'var(--card-soft)'}
            stroke="var(--text-soft)"
            strokeWidth="2"
          />
        ))}
      </svg>
    )
  }

  const { left, right } = art
  const bar = (n: number, y: number) => {
    const seg = 220 / n
    return Array.from({ length: n }, (_, i) => (
      <rect
        key={`${y}-${i}`}
        x={i * seg + 1}
        y={y}
        width={seg - 2}
        height="22"
        rx="5"
        fill="var(--accent)"
        opacity={0.35 + 0.65 / n}
        stroke="var(--text-soft)"
        strokeWidth="1.5"
      />
    ))
  }
  return (
    <svg className="comic-lesson-art" viewBox="0 0 220 60" width={220} role="img" aria-label={`one bar cut into ${left} pieces and one cut into ${right}`}>
      {bar(left, 4)}
      {bar(right, 34)}
    </svg>
  )
}

const ComicLesson: React.FC<ComicLessonProps> = ({ lesson, onDone }) => {
  const { speak } = useAudio()
  const [pos, setPos] = useState(0)
  const [typed, setTyped] = useState('')
  const [picked, setPicked] = useState<number | null>(null)
  const [result, setResult] = useState<boolean | null>(null)

  useEffect(() => {
    setPos(0)
    setTyped('')
    setPicked(null)
    setResult(null)
  }, [lesson.id])

  const panel = lesson.panels[pos]
  const last = pos === lesson.panels.length - 1
  if (!panel) return null

  const next = () => {
    if (last) {
      onDone()
      return
    }
    setPos((p) => p + 1)
    setTyped('')
    setPicked(null)
    setResult(null)
  }

  const answer = (response: number | string) => {
    if (panel.type !== 'check' || result !== null) return
    if (!isAnswered(panel.question, response)) return
    if (typeof response === 'number') setPicked(response)
    setResult(isCorrect(panel.question, response))
  }

  const nextLabel = last ? 'Finish' : 'Next'

  return (
    <div className="comic-lesson">
      <div className="comic-lesson-head">
        <h2 className="comic-lesson-title">{lesson.title}</h2>
        <div className="comic-lesson-dots" aria-label={`Part ${pos + 1} of ${lesson.panels.length}`}>
          {lesson.panels.map((_, i) => (
            <i key={i} className={i === pos ? 'on' : i < pos ? 'done' : ''} />
          ))}
        </div>
      </div>

      {panel.type === 'talk' ? (
        <div className="comic-lesson-panel" key={pos}>
          <div className="comic-lesson-row">
            <div className="comic-lesson-who">
              <Speaker who={panel.speaker} />
              <span>{SPEAKERS[panel.speaker].name}</span>
            </div>
            <p className="comic-lesson-bubble">{panel.text}</p>
          </div>
          {panel.art && (
            <div className="comic-lesson-artbox">
              <LessonArtView art={panel.art} />
            </div>
          )}
          <div className="comic-lesson-actions">
            <button type="button" className="comic-lesson-say" onClick={() => speak(panel.text)} aria-label="Read it to me">
              🔊
            </button>
            {pos > 0 && (
              <button type="button" className="comic-lesson-btn soft" onClick={() => setPos((p) => p - 1)}>
                Back
              </button>
            )}
            <button type="button" className="comic-lesson-btn" onClick={next}>
              {nextLabel}
            </button>
          </div>
        </div>
      ) : (
        <div className="comic-lesson-panel comic-lesson-check" key={pos}>
          <div className="comic-lesson-label">Quick check</div>
          <p className="comic-lesson-q">{panel.question.prompt}</p>
          {panel.art && (
            <div className="comic-lesson-artbox">
              <LessonArtView art={panel.art} />
            </div>
          )}

          {panel.question.kind === 'choice' && (
            <div className="comic-lesson-choices">
              {panel.question.choices.map((c, i) => {
                const shown = result !== null
                const isRight = panel.question.kind === 'choice' && i === panel.question.answer
                const cls = shown ? (isRight ? 'right' : i === picked ? 'picked' : 'faded') : ''
                return (
                  <button key={i} type="button" className={`comic-lesson-choice ${cls}`} disabled={shown} onClick={() => answer(i)}>
                    {c}
                  </button>
                )
              })}
            </div>
          )}

          {panel.question.kind === 'number' && result === null && (
            <form
              className="comic-lesson-answer"
              onSubmit={(e) => {
                e.preventDefault()
                answer(typed)
              }}
            >
              <NumberInput value={typed} onChange={setTyped}/>
              <button type="submit" className="comic-lesson-btn" disabled={!typed.trim()}>
                Check
              </button>
            </form>
          )}

          {result !== null && (
            <div className={`comic-lesson-feedback ${result ? 'yes' : 'not-yet'}`} role="status" aria-live="polite">
              <strong>{result ? 'Exactly right!' : `Good try! The answer is ${correctAnswerText(panel.question)}.`}</strong>
              <p>{panel.question.explanation}</p>
            </div>
          )}

          <div className="comic-lesson-actions">
            <button type="button" className="comic-lesson-say" onClick={() => speak(panel.question.prompt)} aria-label="Read it to me">
              🔊
            </button>
            {result !== null && (
              <button type="button" className="comic-lesson-btn" onClick={next}>
                {nextLabel}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default ComicLesson
