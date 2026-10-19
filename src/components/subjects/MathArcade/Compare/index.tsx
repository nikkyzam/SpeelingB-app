import React, { useRef, useState } from 'react'
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
import './Compare.css'

export const COMPARE_ROUNDS = 10

export type Sign = '<' | '=' | '>'
export type Side = 'left' | 'right'

export type CompareRound =
  /** Pick the bigger pile: berries to count (Sprout) or numbers (Explorer). */
  | { mode: 'pick'; leftN: number; rightN: number; berries: boolean }
  /** Champion: two sums, choose the sign between them. */
  | { mode: 'sign'; left: string; right: string; leftN: number; rightN: number }

/** Symbols read aloud as words, so the spoken correction makes sense. */
const say = (s: string) =>
  s
    .replace(/×/g, 'times')
    .replace(/−/g, 'minus')
    .replace(/ < /g, ' is less than ')
    .replace(/ > /g, ' is greater than ')
    .replace(/ = /g, ' equals ')

export const signFor = (l: number, r: number): Sign => (l < r ? '<' : l > r ? '>' : '=')

export const makeCompareRound = (level: Level): CompareRound => {
  if (level === 'easy') {
    const a = 1 + rnd(10)
    let b = 1 + rnd(10)
    for (let guard = 0; a === b && guard < 30; guard++) b = 1 + rnd(10)
    if (a === b) b = ((a + 3) % 10) + 1
    return { mode: 'pick', leftN: a, rightN: b, berries: true }
  }
  if (level === 'medium') {
    const a = 5 + rnd(95)
    let b = 5 + rnd(95)
    for (let guard = 0; a === b && guard < 30; guard++) b = 5 + rnd(95)
    if (a === b) b = a + 7 <= 100 ? a + 7 : a - 7
    return { mode: 'pick', leftN: a, rightN: b, berries: false }
  }

  const expr = (): { s: string; n: number } => {
    const kind = rnd(3)
    if (kind === 0) { const a = 2 + rnd(11), b = 2 + rnd(11); return { s: `${a} × ${b}`, n: a * b } }
    if (kind === 1) { const a = 20 + rnd(70), b = 10 + rnd(60); return { s: `${a} + ${b}`, n: a + b } }
    const a = 40 + rnd(60), b = 5 + rnd(40)
    return { s: `${a} − ${b}`, n: a - b }
  }
  /** The same value written another way, so "=" still takes working out. */
  const exprWorth = (n: number, avoid: string): { s: string; n: number } => {
    const forms: string[] = []
    for (let b = 2; b <= 12; b++) if (n % b === 0 && n / b >= 2) forms.push(`${n / b} × ${b}`)
    if (n >= 2) {
      const split = 1 + rnd(n - 1)
      forms.push(`${split} + ${n - split}`)
    }
    const over = (n < 1 ? 1 - n : 0) + 1 + rnd(40)
    forms.push(`${n + over} − ${over}`)
    const usable = forms.filter((s) => s !== avoid)
    return { s: usable[rnd(usable.length)], n }
  }

  const L = expr()
  // One time in four the two sides are equal: spotting "=" is the hard skill.
  let R = rnd(4) === 0 ? exprWorth(L.n, L.s) : expr()
  for (let guard = 0; L.s === R.s && guard < 10; guard++) R = expr()
  return { mode: 'sign', left: L.s, right: R.s, leftN: L.n, rightN: R.n }
}

/** A countable pile of berries, in rows of five like a ten-frame. */
const Berries: React.FC<{ n: number }> = ({ n }) => (
  <span className="ma-cmp-berries" aria-hidden>
    {Array.from({ length: n }, (_, i) => (
      <i key={i} />
    ))}
  </span>
)

type Phase = 'start' | 'play' | 'done'

const SIGN_NAMES: Record<Sign, string> = { '<': 'less than', '=': 'equals', '>': 'greater than' }

/**
 * Hungry Bear — the bear always eats the bigger pile. Sprouts count berries,
 * Explorers compare numbers, Champions choose <, = or > between two sums.
 * Comparing is estimation practice in disguise.
 */
const Compare: React.FC<MathGameProps> = ({ onComplete, grade }) => {
  const cheer = useCheer()
  const later = useLater()
  const finish = useFinish(onComplete)

  const [phase, setPhase] = useState<Phase>('start')
  const [level, setLevel] = useState<Level>('easy')
  const [round, setRound] = useState<CompareRound | null>(null)
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [picked, setPicked] = useState<string | null>(null)
  const [ok, setOk] = useState(false)
  const [line, setLine] = useState('')
  const locked = useRef(false)

  const begin = (lv: Level) => {
    setLevel(lv)
    setRound(makeCompareRound(lv))
    setIndex(0)
    setScore(0)
    setPicked(null)
    setLine('')
    locked.current = false
    setPhase('play')
  }

  const settle = (choice: string, right: boolean, correction: string) => {
    if (!round) return
    setPicked(choice)
    setOk(right)
    if (right) {
      setScore((s) => s + 1)
      setLine(cheer.hit())
    } else {
      setLine(`${cheer.miss({ say: say(correction) })} ${correction}`)
    }
    const gained = right ? 1 : 0
    later(() => {
      const next = index + 1
      if (next >= COMPARE_ROUNDS) {
        finish.record(score + gained)
        setPhase('done')
        return
      }
      setIndex(next)
      setRound(makeCompareRound(level))
      setPicked(null)
      setLine('')
      locked.current = false
    }, right ? 1100 : 2400)
  }

  const pickSide = (side: Side) => {
    if (!round || round.mode !== 'pick' || locked.current) return
    locked.current = true
    const bigger: Side = round.leftN > round.rightN ? 'left' : 'right'
    const big = Math.max(round.leftN, round.rightN)
    const small = Math.min(round.leftN, round.rightN)
    const unit = round.berries ? ' berries' : ''
    settle(side, side === bigger, `${big}${unit} is more than ${small}${unit}.`)
  }

  const pickSign = (sign: Sign) => {
    if (!round || round.mode !== 'sign' || locked.current) return
    locked.current = true
    const want = signFor(round.leftN, round.rightN)
    settle(
      sign,
      sign === want,
      `${round.left} is ${round.leftN} and ${round.right} is ${round.rightN}, so ${round.leftN} ${want} ${round.rightN}.`
    )
  }

  if (phase === 'start') {
    return (
      <div className="ma-cmp">
        <StartCard
          icon="🐻"
          title="Hungry Bear"
          blurb="The hungry bear always eats the bigger pile. Help it choose — or teach it the signs!"
          suggested={levelForGrade(grade)}
          onPick={begin}
        />
      </div>
    )
  }

  if (phase === 'done') {
    return (
      <div className="ma-cmp">
        <FinishCard
          title="The bear is full!"
          score={`${score}/${COMPARE_ROUNDS}`}
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

  return (
    <div className="ma-cmp ma-card">
      <GameHeader icon="🐻" title="Hungry Bear">
        <span className="ma-chip">{index + 1}/{COMPARE_ROUNDS}</span>
        <span className="ma-chip">⭐ {score}</span>
      </GameHeader>
      <ProgressBar value={index / COMPARE_ROUNDS} />

      {round.mode === 'pick' ? (
        <>
          <p className="ma-cmp-q">Which pile should the hungry bear eat?</p>
          <div className="ma-cmp-plates" role="group" aria-label="Piles">
            {(['left', 'right'] as const).map((side) => {
              const n = side === 'left' ? round.leftN : round.rightN
              const isBigger = n > (side === 'left' ? round.rightN : round.leftN)
              const state = !answered ? '' : picked === side ? (ok ? 'right' : 'wrong') : isBigger ? 'reveal' : ''
              return (
                <button
                  key={`${index}-${side}`}
                  className={`ma-cmp-plate ${state}`}
                  onClick={() => pickSide(side)}
                  disabled={answered}
                  aria-label={round.berries ? `${n} berries` : `${n}`}
                >
                  {round.berries ? <Berries n={n} /> : <span className="ma-cmp-num">{n}</span>}
                  {round.berries && answered && <span className="ma-cmp-count">{n}</span>}
                </button>
              )
            })}
          </div>
        </>
      ) : (
        <>
          <div className="ma-cmp-line">
            <span className="ma-cmp-expr">{round.left}</span>
            <span className={`ma-cmp-hole ${answered ? 'filled' : ''}`}>
              {answered ? signFor(round.leftN, round.rightN) : '?'}
            </span>
            <span className="ma-cmp-expr">{round.right}</span>
          </div>
          <div className="ma-cmp-signs" role="group" aria-label="Choose the sign">
            {(['<', '=', '>'] as const).map((s) => {
              const want = signFor(round.leftN, round.rightN)
              const state = !answered ? '' : picked === s ? (ok ? 'right' : 'wrong') : s === want ? 'reveal' : ''
              return (
                <button
                  key={s}
                  className={`ma-opt ma-cmp-sign ${state}`}
                  onClick={() => pickSign(s)}
                  disabled={answered}
                  aria-label={SIGN_NAMES[s]}
                >
                  {s}
                </button>
              )
            })}
          </div>
        </>
      )}

      <Feedback ok={answered ? ok : null}>{line}</Feedback>
    </div>
  )
}

export default Compare
