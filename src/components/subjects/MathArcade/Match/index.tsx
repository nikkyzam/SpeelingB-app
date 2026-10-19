import React, { useRef, useState } from 'react'
import { useAudio } from '../../../../contexts/AudioContext'
import { shuffle } from '../../../games/shared/wordTricks'
import sfx from '../../../games/shared/sfx'
import useCheer from '../../../games/shared/useCheer'
import useLater from '../../../games/shared/useLater'
import {
  FinishCard,
  Feedback,
  GameHeader,
  StartCard,
  levelForGrade,
  rnd,
  useFinish,
  type Level,
  type MathGameProps,
} from '../shared'
import './Match.css'

export interface MatchCard {
  id: number
  pair: number
  face: string
  kind: 'sum' | 'ans'
  /** What the pair is worth, for the kind line after a mismatch. */
  value: number
}

/** A shuffled deck of sum cards and their answer cards; every answer differs. */
export const makeMatchDeck = (level: Level): MatchCard[] => {
  const pairs = level === 'easy' ? 6 : 8
  const used = new Set<number>()
  const cards: MatchCard[] = []
  for (let p = 0; p < pairs; p++) {
    let a = 0
    let b = 0
    let ans = 0
    let face = ''
    for (let guard = 0; guard === 0 || (used.has(ans) && guard < 50); guard++) {
      if (level === 'easy') {
        a = 1 + rnd(9); b = 1 + rnd(9); ans = a + b; face = `${a} + ${b}`
      } else if (level === 'medium') {
        if (rnd(2)) { a = 2 + rnd(8); b = 2 + rnd(8); ans = a * b; face = `${a} × ${b}` }
        else { a = 8 + rnd(12); b = 2 + rnd(8); ans = a - b; face = `${a} − ${b}` }
      } else if (rnd(2)) {
        a = 4 + rnd(9); b = 4 + rnd(9); ans = a * b; face = `${a} × ${b}`
      } else {
        b = 2 + rnd(9); ans = 3 + rnd(9); a = b * ans; face = `${a} ÷ ${b}`
      }
    }
    used.add(ans)
    cards.push({ id: p * 2, pair: p, face, kind: 'sum', value: ans })
    cards.push({ id: p * 2 + 1, pair: p, face: String(ans), kind: 'ans', value: ans })
  }
  return shuffle(cards)
}

/** Fewer flips is better; the host wants higher-is-better, so 100 for a flawless board. */
export const matchScore = (moves: number, pairs: number): number => Math.max(10, 100 - 5 * Math.max(0, moves - pairs))

export const matchStars = (moves: number, pairs: number): number => {
  if (moves <= pairs + 2) return 3
  if (moves <= Math.ceil(pairs * 1.8)) return 2
  if (moves <= Math.ceil(pairs * 2.6)) return 1
  return 0
}

type Phase = 'start' | 'play' | 'done'

/**
 * Math Match — memory, but a sum only matches its answer. Kids work each sum
 * out twice: once to know what's under the card, once to remember where it
 * was. A mismatch says what the sum makes before the cards turn back.
 */
const Match: React.FC<MathGameProps> = ({ onComplete, grade }) => {
  const { speak } = useAudio()
  const cheer = useCheer()
  const later = useLater()
  const finish = useFinish(onComplete)

  const [phase, setPhase] = useState<Phase>('start')
  const [deck, setDeck] = useState<MatchCard[]>([])
  const [up, setUp] = useState<number[]>([])
  const [solved, setSolved] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [line, setLine] = useState('')
  const [ok, setOk] = useState<boolean | null>(null)
  const locked = useRef(false)

  const pairs = deck.length / 2

  const begin = (lv: Level) => {
    setDeck(makeMatchDeck(lv))
    setUp([])
    setSolved([])
    setMoves(0)
    setLine('')
    setOk(null)
    locked.current = false
    setPhase('play')
  }

  const flip = (card: MatchCard) => {
    if (locked.current || solved.includes(card.pair) || up.includes(card.id)) return
    sfx.tap()
    const nowUp = [...up, card.id]
    setUp(nowUp)
    if (nowUp.length < 2) {
      setLine('')
      setOk(null)
      return
    }

    locked.current = true
    const made = moves + 1
    setMoves(made)
    const [a, b] = nowUp.map((id) => deck.find((c) => c.id === id)!)

    if (a.pair === b.pair) {
      setOk(true)
      setLine(cheer.hit({ quiet: true }))
      later(() => {
        const nextSolved = [...solved, a.pair]
        setSolved(nextSolved)
        setUp([])
        locked.current = false
        if (nextSolved.length === pairs) {
          finish.record(matchScore(made, pairs))
          setPhase('done')
        }
      }, 500)
      return
    }

    // Say what each sum turned over really makes, so a miss still teaches.
    const sums = [a, b].filter((c) => c.kind === 'sum').map((c) => `${c.face} makes ${c.value}`)
    const kind = sums.length ? `${sums.join(', and ')}.` : 'Two answers — find the sum that makes each one.'
    setOk(false)
    setLine(`${cheer.miss({ quiet: true })} ${kind}`)
    speak(kind.replace(/×/g, 'times').replace(/÷/g, 'divided by').replace(/−/g, 'minus'))
    later(() => {
      setUp([])
      locked.current = false
    }, 1400)
  }

  if (phase === 'start') {
    return (
      <div className="ma-match">
        <StartCard
          icon="🃏"
          title="Math Match"
          blurb="Flip two cards. A sum only matches its answer — find every pair in as few flips as you can!"
          suggested={levelForGrade(grade)}
          onPick={begin}
        />
      </div>
    )
  }

  if (phase === 'done') {
    return (
      <div className="ma-match">
        <FinishCard
          title="All matched!"
          score={moves}
          label="moves"
          stars={matchStars(moves, pairs)}
          onAgain={() => setPhase('start')}
          onDone={finish.done}
        />
      </div>
    )
  }

  return (
    <div className="ma-match ma-card">
      <GameHeader icon="🃏" title="Math Match">
        <span className="ma-chip">🔄 {moves} {moves === 1 ? 'move' : 'moves'}</span>
        <span className="ma-chip">✅ {solved.length}/{pairs}</span>
      </GameHeader>

      <div className="ma-match-grid" role="group" aria-label="Cards">
        {deck.map((c) => {
          const isSolved = solved.includes(c.pair)
          const isUp = isSolved || up.includes(c.id)
          return (
            <button
              key={c.id}
              className={`ma-match-card ${isUp ? 'up' : ''} ${isSolved ? 'solved' : ''} ${c.kind}`}
              onClick={() => flip(c)}
              aria-label={isUp ? `Card ${c.face}` : 'Hidden card'}
              aria-pressed={isUp}
            >
              <span className="ma-match-face back" aria-hidden>?</span>
              <span className="ma-match-face front" aria-hidden>{c.face}</span>
            </button>
          )
        })}
      </div>

      <Feedback ok={ok}>{line}</Feedback>
    </div>
  )
}

export default Match
