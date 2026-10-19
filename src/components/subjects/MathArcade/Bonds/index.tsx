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
import './Bonds.css'

export const BOND_ROUNDS = 10

export interface BondRound {
  target: number
  part: number
  missing: number
  opts: number[]
}

/** target = part + missing: bonds to 10, 20, or 100 in fives and tens. */
export const makeBondRound = (level: Level): BondRound => {
  const target = level === 'easy' ? 10 : level === 'medium' ? 20 : 100
  const part = level === 'hard' ? (rnd(9) + 1) * 10 + (rnd(2) ? 0 : 5) : 1 + rnd(target - 1)
  const missing = target - part
  const opts = new Set<number>([missing])
  for (let guard = 0; opts.size < 4 && guard < 40; guard++) {
    const step = level === 'hard' ? 5 * (1 + rnd(2)) : 1 + rnd(3)
    const d = missing + (rnd(2) ? step : -step)
    if (d >= 0 && d <= target) opts.add(d)
  }
  // An advancing counter, bounded by the residues, so this always ends.
  for (let k = 1; opts.size < 4 && k <= target; k++) opts.add((missing + k) % (target + 1))
  return { target, part, missing, opts: shuffle([...opts]) }
}

type Phase = 'start' | 'play' | 'done'

/**
 * Bond Builder — every number has friends that build it. 10 = 7 + ? — pop
 * the bubble that completes the bond. Ten rounds; a miss shows what the
 * picked bubble made and lights the one that fits.
 */
const Bonds: React.FC<MathGameProps> = ({ onComplete, grade }) => {
  const cheer = useCheer()
  const later = useLater()
  const finish = useFinish(onComplete)

  const [phase, setPhase] = useState<Phase>('start')
  const [level, setLevel] = useState<Level>('easy')
  const [round, setRound] = useState<BondRound | null>(null)
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [line, setLine] = useState('')
  const locked = useRef(false)

  const begin = (lv: Level) => {
    setLevel(lv)
    setRound(makeBondRound(lv))
    setIndex(0)
    setScore(0)
    setPicked(null)
    setLine('')
    locked.current = false
    setPhase('play')
  }

  const pick = (n: number) => {
    if (!round || locked.current) return
    locked.current = true
    setPicked(n)
    const ok = n === round.missing
    const gained = ok ? 1 : 0
    if (ok) {
      setScore((s) => s + 1)
      setLine(cheer.hit())
    } else {
      const say = `${round.part} and ${round.missing} make ${round.target}.`
      setLine(`${cheer.miss({ say })} ${round.part} + ${n} makes ${round.part + n} — the missing part is ${round.missing}.`)
    }
    later(() => {
      const next = index + 1
      if (next >= BOND_ROUNDS) {
        finish.record(score + gained)
        setPhase('done')
        return
      }
      setIndex(next)
      setRound(makeBondRound(level))
      setPicked(null)
      setLine('')
      locked.current = false
    }, ok ? 1100 : 2200)
  }

  if (phase === 'start') {
    return (
      <div className="ma-bonds">
        <StartCard
          icon="🫧"
          title="Bond Builder"
          blurb="Every number has friends that build it. Ten is seven and what? Pop the bubble that completes the bond!"
          suggested={levelForGrade(grade)}
          onPick={begin}
        />
      </div>
    )
  }

  if (phase === 'done') {
    return (
      <div className="ma-bonds">
        <FinishCard
          title="Bonds built!"
          score={`${score}/${BOND_ROUNDS}`}
          label="correct"
          stars={starsFor(score, [5, 7, 9])}
          onAgain={() => setPhase('start')}
          onDone={finish.done}
        />
      </div>
    )
  }

  if (!round) return null
  const answered = picked !== null
  const ok = picked === round.missing

  return (
    <div className="ma-bonds ma-card">
      <GameHeader icon="🫧" title="Bond Builder">
        <span className="ma-chip">{index + 1}/{BOND_ROUNDS}</span>
        <span className="ma-chip">⭐ {score}</span>
      </GameHeader>
      <ProgressBar value={index / BOND_ROUNDS} />

      <div className="ma-bonds-eq" aria-label={`${round.target} equals ${round.part} plus what?`}>
        <span className="ma-bonds-num target">{round.target}</span>
        <span className="ma-bonds-op">=</span>
        <span className="ma-bonds-num">{round.part}</span>
        <span className="ma-bonds-op">+</span>
        <span className={`ma-bonds-num hole ${answered ? 'filled' : ''}`}>{answered ? round.missing : '?'}</span>
      </div>

      <div className="ma-bonds-row" role="group" aria-label="Bubbles">
        {round.opts.map((n) => {
          const state = !answered ? '' : n === picked ? (ok ? 'right' : 'wrong') : n === round.missing ? 'reveal' : ''
          return (
            <button
              key={`${index}-${n}`}
              className={`ma-bonds-bubble ${state}`}
              onClick={() => pick(n)}
              disabled={answered}
              aria-label={`Choose ${n}`}
            >
              {n}
            </button>
          )
        })}
      </div>

      <Feedback ok={answered ? ok : null}>{line}</Feedback>
    </div>
  )
}

export default Bonds
