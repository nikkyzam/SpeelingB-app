import React, { useState } from 'react'
import type { MatchProps } from '../index'
import SpellTurn from './SpellTurn'
import sfx from '../../../components/games/shared/sfx'

/** How far the rope must be pulled to win. */
const TO_WIN = 4
/** A rope match cannot go on forever: two children who keep missing would
 *  pull it back and forth around the middle and never finish. */
const MAX_TURNS = 20

/**
 * Word Tug-of-War.
 *
 * The rope is the whole point: a child who is behind can see exactly how far
 * behind, and one good word pulls it back. A running score does not do that —
 * a rope does, which is why a losing player keeps playing.
 */
const TugOfWar: React.FC<MatchProps> = ({ names, words, onFinish }) => {
  const [rope, setRope] = useState(0) // negative = player 1 winning
  const [turn, setTurn] = useState(0)
  const [pulls, setPulls] = useState<[number, number]>([0, 0])

  const player = turn % 2
  const round = Math.floor(turn / 2)
  const word = words[player][round % words[player].length]

  const answer = (correct: boolean) => {
    const dir = player === 0 ? -1 : 1
    const scores: [number, number] = [...pulls] as [number, number]
    if (correct) scores[player] += 1
    setPulls(scores)

    let next = rope
    if (correct) {
      next = rope + dir
    } else {
      // A miss gives back ground you had gained, and nothing more. If the rope
      // is already on your rival's side there is nothing of yours to give back,
      // so it stays put — otherwise missing a word would drag the rope towards
      // the middle and quietly *help* the player who got it wrong.
      const mine = dir === -1 ? rope < 0 : rope > 0
      if (mine) {
        const slipped = rope - dir * 0.5
        next = dir === -1 ? Math.min(slipped, 0) : Math.max(slipped, 0)
      }
    }

    const decided = Math.abs(next) >= TO_WIN
    const outOfTurns = turn + 1 >= MAX_TURNS
    if (decided || outOfTurns) {
      if (decided) sfx.fanfare()
      onFinish(scores)
      return
    }
    setRope(next)
    setTurn((t) => t + 1)
  }

  const pct = 50 + (rope / TO_WIN) * 40

  return (
    <div className="tug">
      <div className="tug-scores">
        <span className={rope < 0 ? 'ahead' : ''}>{names[0]}</span>
        <span className={rope > 0 ? 'ahead' : ''}>{names[1]}</span>
      </div>

      <div className="tug-rope" role="img" aria-label={`Rope is ${Math.abs(rope)} from ${rope < 0 ? names[0] : names[1]}'s win`}>
        <div className="tug-line" />
        <div className="tug-centre" aria-hidden />
        <div className="tug-knot" style={{ left: `${pct}%` }} aria-hidden>🪢</div>
      </div>

      <SpellTurn
        who={names[player]}
        word={word}
        label={`Pull the rope! ${Math.abs(rope).toFixed(1)} of ${TO_WIN}`}
        onAnswer={answer}
      />
    </div>
  )
}

export default TugOfWar
