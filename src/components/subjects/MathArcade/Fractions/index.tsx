import React, { useRef, useState } from 'react'
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
import './Fractions.css'

export const FRACTION_ROUNDS = 8

export interface FractionRound {
  slices: number
  eaten: number
  /** Champion rounds sometimes ask what's left rather than what was eaten. */
  askLeft: boolean
  answer: string
  opts: string[]
}

const fmt = (n: number, d: number) => `${n}/${d}`

export const makeFractionRound = (level: Level): FractionRound => {
  const denoms = level === 'easy' ? [2, 4] : level === 'medium' ? [3, 4, 6, 8] : [3, 4, 5, 6, 8, 10, 12]
  const slices = denoms[rnd(denoms.length)]
  const eaten = 1 + rnd(slices - 1)
  // Only ask "left" when it differs from "eaten", or the question changes nothing.
  const askLeft = level === 'hard' && rnd(2) === 1 && slices - eaten !== eaten
  const shown = askLeft ? slices - eaten : eaten
  const answer = fmt(shown, slices)

  const opts = new Set<string>([answer])
  for (let guard = 0; opts.size < 4 && guard < 40; guard++) {
    const style = rnd(3)
    if (style === 0) opts.add(fmt(slices - shown, slices)) // the other part
    else if (style === 1) opts.add(fmt(shown, Math.max(2, slices + (rnd(2) ? 2 : -2))))
    else {
      const n = shown + (rnd(2) ? 1 : -1)
      if (n >= 1 && n <= slices) opts.add(fmt(n, slices))
    }
  }
  for (let k = 1; opts.size < 4; k++) opts.add(fmt(shown, slices + k))
  return { slices, eaten, askLeft, answer, opts: shuffle([...opts]) }
}

/** The pizza: slices round the circle, the eaten ones left as empty plate. */
export const Pizza: React.FC<{ slices: number; eaten: number }> = ({ slices, eaten }) => {
  const R = 90
  const C = 100
  return (
    <svg viewBox="0 0 200 200" className="ma-frac-pizza" role="img" aria-label={`A pizza cut into ${slices} slices, ${eaten} eaten`}>
      <circle cx={C} cy={C} r={R + 6} className="ma-frac-plate" />
      {Array.from({ length: slices }, (_, i) => {
        const a0 = (i / slices) * Math.PI * 2 - Math.PI / 2
        const a1 = ((i + 1) / slices) * Math.PI * 2 - Math.PI / 2
        const x0 = C + R * Math.cos(a0)
        const y0 = C + R * Math.sin(a0)
        const x1 = C + R * Math.cos(a1)
        const y1 = C + R * Math.sin(a1)
        return (
          <path
            key={i}
            d={`M${C} ${C} L${x0.toFixed(1)} ${y0.toFixed(1)} A${R} ${R} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)} Z`}
            className={`ma-frac-slice ${i < eaten ? 'eaten' : ''}`}
          />
        )
      })}
    </svg>
  )
}

/** A fraction stacked the way it's written in class. */
const Frac: React.FC<{ value: string }> = ({ value }) => {
  const [n, d] = value.split('/')
  return (
    <span className="ma-frac-stack">
      <span>{n}</span>
      <span className="ma-frac-bar" />
      <span>{d}</span>
    </span>
  )
}

type Phase = 'start' | 'play' | 'done'

/**
 * Fraction Feast — the bear baked a pizza and ate some slices. How much is
 * gone (or, for Champions, how much is left)? Real slices on screen, because
 * a fraction you can see is a fraction you understand.
 */
const Fractions: React.FC<MathGameProps> = ({ onComplete, grade }) => {
  const cheer = useCheer()
  const later = useLater()
  const finish = useFinish(onComplete)

  const [phase, setPhase] = useState<Phase>('start')
  const [level, setLevel] = useState<Level>('easy')
  const [round, setRound] = useState<FractionRound | null>(null)
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [picked, setPicked] = useState<string | null>(null)
  const [line, setLine] = useState('')
  const locked = useRef(false)

  const begin = (lv: Level) => {
    setLevel(lv)
    setRound(makeFractionRound(lv))
    setIndex(0)
    setScore(0)
    setPicked(null)
    setLine('')
    locked.current = false
    setPhase('play')
  }

  const pick = (s: string) => {
    if (!round || locked.current) return
    locked.current = true
    setPicked(s)
    const ok = s === round.answer
    const gained = ok ? 1 : 0
    if (ok) {
      setScore((v) => v + 1)
      setLine(cheer.hit())
    } else {
      const count = round.askLeft ? round.slices - round.eaten : round.eaten
      const what = round.askLeft ? 'are left' : 'were eaten'
      const why = `${count} of the ${round.slices} slices ${what}, so it's ${count} out of ${round.slices}.`
      setLine(`${cheer.miss({ say: why })} ${why.replace(`${count} out of ${round.slices}`, round.answer)}`)
    }
    later(() => {
      const next = index + 1
      if (next >= FRACTION_ROUNDS) {
        finish.record(score + gained)
        setPhase('done')
        return
      }
      setIndex(next)
      setRound(makeFractionRound(level))
      setPicked(null)
      setLine('')
      locked.current = false
    }, ok ? 1100 : 2400)
  }

  if (phase === 'start') {
    return (
      <div className="ma-frac">
        <StartCard
          icon="🍕"
          title="Fraction Feast"
          blurb="The bear baked a pizza and munched some slices. What fraction of the pizza is gone?"
          suggested={levelForGrade(grade)}
          onPick={begin}
        />
      </div>
    )
  }

  if (phase === 'done') {
    return (
      <div className="ma-frac">
        <FinishCard
          title="Feast finished!"
          score={`${score}/${FRACTION_ROUNDS}`}
          label="correct"
          stars={starsFor(score, [3, 5, 7])}
          onAgain={() => setPhase('start')}
          onDone={finish.done}
        />
      </div>
    )
  }

  if (!round) return null
  const answered = picked !== null
  const ok = picked === round.answer

  return (
    <div className="ma-frac ma-card">
      <GameHeader icon="🍕" title="Fraction Feast">
        <span className="ma-chip">{index + 1}/{FRACTION_ROUNDS}</span>
        <span className="ma-chip">⭐ {score}</span>
      </GameHeader>
      <ProgressBar value={index / FRACTION_ROUNDS} />

      <p className="ma-frac-q">
        {round.askLeft ? 'What fraction of the pizza is left?' : 'What fraction of the pizza was eaten?'}
      </p>
      <div className="ma-frac-fig">
        <Pizza slices={round.slices} eaten={round.eaten} />
      </div>

      <div className="ma-opts ma-frac-opts" role="group" aria-label="Answer choices">
        {round.opts.map((s) => {
          const state = !answered ? '' : s === picked ? (ok ? 'right' : 'wrong') : s === round.answer ? 'reveal' : ''
          const [n, d] = s.split('/')
          return (
            <button
              key={`${index}-${s}`}
              className={`ma-opt ${state}`}
              onClick={() => pick(s)}
              disabled={answered}
              aria-label={`${n} out of ${d}`}
            >
              <Frac value={s} />
            </button>
          )
        })}
      </div>

      <Feedback ok={answered ? ok : null}>{line}</Feedback>
    </div>
  )
}

export default Fractions
