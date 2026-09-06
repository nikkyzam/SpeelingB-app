import React, { useState } from 'react'
import type { MatchProps } from '../index'
import SpellTurn from './SpellTurn'
import sfx from '../../../components/games/shared/sfx'

const TARGET = 8

/**
 * Team Relay.
 *
 * Deliberately not a fight. Both children feed one shared streak towards a
 * target, and a miss costs the team rather than the person — so an older
 * sibling has a reason to help the younger one rather than beat them. Worth
 * having on the days when a head-to-head would end in tears.
 */
const CoopRelay: React.FC<MatchProps> = ({ names, words, onFinish }) => {
  const [turn, setTurn] = useState(0)
  const [streak, setStreak] = useState(0)
  const [best, setBest] = useState(0)
  const [each, setEach] = useState<[number, number]>([0, 0])
  const [lives, setLives] = useState(3)

  const player = turn % 2
  const round = Math.floor(turn / 2)
  const word = words[player][round % words[player].length]

  const answer = (correct: boolean) => {
    const tally: [number, number] = [...each] as [number, number]
    if (correct) {
      tally[player] += 1
      const next = streak + 1
      setEach(tally)
      setStreak(next)
      setBest(Math.max(best, next))
      if (next >= TARGET) {
        sfx.fanfare()
        onFinish(tally)
        return
      }
    } else {
      const left = lives - 1
      setLives(left)
      setStreak(0)
      sfx.wrong()
      if (left <= 0) {
        onFinish(tally)
        return
      }
    }
    setTurn((t) => t + 1)
  }

  return (
    <div className="relay">
      <div className="relay-head">
        <span>🤝 Team streak</span>
        <strong>{streak} / {TARGET}</strong>
        <span aria-label={`${lives} lives left`}>{'❤️'.repeat(Math.max(lives, 0))}</span>
      </div>
      <div className="relay-bar"><div style={{ width: `${(streak / TARGET) * 100}%` }} /></div>
      <p className="relay-note">
        {names[0]} {each[0]} · {names[1]} {each[1]} — you win or lose together.
      </p>
      <SpellTurn
        who={names[player]}
        word={word}
        label={`Best streak so far: ${best}`}
        onAnswer={answer}
      />
    </div>
  )
}

export default CoopRelay
