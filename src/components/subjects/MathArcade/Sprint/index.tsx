import React, { useEffect, useRef, useState } from 'react'
import { shuffle } from '../../../games/shared/wordTricks'
import useCheer from '../../../games/shared/useCheer'
import useLater from '../../../games/shared/useLater'
import {
  FinishCard,
  Feedback,
  GameHeader,
  ProgressBar,
  StartCard,
  levelForGrade,
  rnd,
  starsFor,
  useFinish,
  type Level,
  type MathGameProps,
} from '../shared'
import './Sprint.css'

/** Seconds on the clock. */
export const SPRINT_SECONDS = 60
/** Right answers in a row before each one counts double. */
const DOUBLE_AFTER = 5

export interface SprintQuestion {
  text: string
  answer: number
  opts: number[]
}

/** One sum for the level, with three near-miss answers (never negative, never repeated). */
export const makeSprintQuestion = (level: Level): SprintQuestion => {
  let a: number
  let b: number
  let text: string
  let answer: number
  if (level === 'easy') {
    a = 1 + rnd(9)
    b = 1 + rnd(9)
    if (rnd(2) === 0 || a < b) {
      text = `${a} + ${b}`
      answer = a + b
    } else {
      text = `${a} − ${b}`
      answer = a - b
    }
  } else if (level === 'medium') {
    const op = rnd(3)
    if (op === 0) {
      a = 6 + rnd(14); b = 4 + rnd(14); text = `${a} + ${b}`; answer = a + b
    } else if (op === 1) {
      a = 10 + rnd(15); b = 1 + rnd(a - 1); text = `${a} − ${b}`; answer = a - b
    } else {
      a = 2 + rnd(5); b = 2 + rnd(5); text = `${a} × ${b}`; answer = a * b
    }
  } else {
    const op = rnd(4)
    if (op === 0) {
      a = 15 + rnd(35); b = 11 + rnd(30); text = `${a} + ${b}`; answer = a + b
    } else if (op === 1) {
      a = 30 + rnd(60); b = 5 + rnd(a - 6); text = `${a} − ${b}`; answer = a - b
    } else if (op === 2) {
      a = 3 + rnd(10); b = 3 + rnd(10); text = `${a} × ${b}`; answer = a * b
    } else {
      b = 2 + rnd(9); answer = 2 + rnd(9); a = b * answer; text = `${a} ÷ ${b}`
    }
  }
  const opts = new Set<number>([answer])
  for (let guard = 0; opts.size < 4 && guard < 40; guard++) {
    const spread = 1 + rnd(Math.max(2, Math.ceil(Math.abs(answer) / 4)))
    const d = answer + (rnd(2) ? spread : -spread)
    if (d >= 0) opts.add(d)
  }
  // Top up from an advancing counter so this always ends.
  for (let k = 1; opts.size < 4; k++) opts.add(answer + k)
  return { text, answer, opts: shuffle([...opts]) }
}

const STAR_BARS: Record<Level, [number, number, number]> = {
  easy: [8, 12, 16],
  medium: [7, 11, 15],
  hard: [6, 10, 14],
}

type Phase = 'start' | 'play' | 'done'

/**
 * Number Sprint — sixty seconds, as many sums as you can. Five right in a row
 * and every answer after counts double, so careful beats reckless. A miss
 * lights up the right answer before the next sum comes.
 */
const Sprint: React.FC<MathGameProps> = ({ onComplete, grade }) => {
  const cheer = useCheer()
  const later = useLater()
  const finish = useFinish(onComplete)

  const [phase, setPhase] = useState<Phase>('start')
  const [level, setLevel] = useState<Level>('easy')
  const [run, setRun] = useState(0)
  const [q, setQ] = useState<SprintQuestion | null>(null)
  const [time, setTime] = useState(SPRINT_SECONDS)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [line, setLine] = useState('')
  const locked = useRef(false)
  // Which run a pending timer belongs to, so "Play again" can't be touched by the last one.
  const runRef = useRef(0)

  const begin = (lv: Level) => {
    setLevel(lv)
    setQ(makeSprintQuestion(lv))
    setTime(SPRINT_SECONDS)
    setScore(0)
    setStreak(0)
    setPicked(null)
    setLine('')
    locked.current = false
    setPhase('play')
    runRef.current += 1
    setRun(runRef.current)
  }

  // The clock, measured from the wall so a busy tab can't stretch it.
  useEffect(() => {
    if (phase !== 'play') return
    const started = Date.now()
    const id = window.setInterval(() => {
      const left = Math.max(0, SPRINT_SECONDS - Math.floor((Date.now() - started) / 1000))
      setTime(left)
      if (left === 0) window.clearInterval(id)
    }, 250)
    return () => window.clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run])

  useEffect(() => {
    if (phase === 'play' && time === 0) {
      finish.record(score)
      locked.current = true
      setPhase('done')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time])

  const pick = (n: number) => {
    if (phase !== 'play' || !q || locked.current) return
    locked.current = true
    setPicked(n)
    const ok = n === q.answer
    if (ok) {
      setScore((s) => s + (streak >= DOUBLE_AFTER - 1 ? 2 : 1))
      setStreak((s) => s + 1)
      setLine(cheer.hit({ quiet: true }))
    } else {
      setStreak(0)
      setLine(`${cheer.miss({ quiet: true })} ${q.text} = ${q.answer}`)
    }
    const thisRun = runRef.current
    later(() => {
      if (thisRun !== runRef.current) return
      setQ(makeSprintQuestion(level))
      setPicked(null)
      setLine('')
      locked.current = false
    }, ok ? 300 : 1100)
  }

  if (phase === 'start') {
    return (
      <div className="ma-sprint">
        <StartCard
          icon="⚡"
          title="Number Sprint"
          blurb="How many can you solve in 60 seconds? Five in a row and every answer counts double!"
          suggested={levelForGrade(grade)}
          onPick={begin}
        />
      </div>
    )
  }

  if (phase === 'done') {
    return (
      <div className="ma-sprint">
        <FinishCard
          title="Time's up!"
          score={score}
          label="points"
          stars={starsFor(score, STAR_BARS[level])}
          onAgain={() => setPhase('start')}
          onDone={finish.done}
        />
      </div>
    )
  }

  if (!q) return null
  const answered = picked !== null
  const ok = picked === q.answer

  return (
    <div className="ma-sprint ma-card">
      <GameHeader icon="⚡" title="Number Sprint">
        <span className="ma-chip" aria-label={`Score ${score}`}>
          ⚡ {score}
          {streak >= DOUBLE_AFTER && <span className="ma-sprint-double">×2 🔥</span>}
        </span>
        <span className={`ma-chip ${time <= 10 ? 'low' : ''}`} aria-label={`${time} seconds left`}>
          ⏱ {time}s
        </span>
      </GameHeader>
      <ProgressBar value={time / SPRINT_SECONDS} low={time <= 10} />

      <div className="ma-sprint-q" aria-live="polite">
        {q.text} = <span className="ma-sprint-hole">{answered ? q.answer : '?'}</span>
      </div>

      <div className="ma-opts" role="group" aria-label="Answers">
        {q.opts.map((n) => {
          const state = !answered ? '' : n === picked ? (ok ? 'right' : 'wrong') : n === q.answer ? 'reveal' : ''
          return (
            <button
              key={`${q.text}-${n}`}
              className={`ma-opt ${state}`}
              onClick={() => pick(n)}
              disabled={answered}
              aria-label={`Answer ${n}`}
            >
              {n}
            </button>
          )
        })}
      </div>

      <Feedback ok={answered ? ok : null}>
        {answered ? line : streak >= 3 ? `🔥 ${streak} in a row!` : ''}
      </Feedback>
    </div>
  )
}

export default Sprint
