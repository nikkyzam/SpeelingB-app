import React, { useState } from 'react'
import type { MatchProps } from '../index'
import SpellTurn, { PLAYER_ICONS } from './SpellTurn'

const TARGET = 8
const LIVES = 3

/**
 * Team Relay.
 *
 * Deliberately not a fight. Both children feed one shared streak towards a
 * target, and a miss costs the team rather than the person — so an older
 * sibling has a reason to help the younger one rather than beat them. Worth
 * having on the days when a head-to-head would end in tears.
 */
const CoopRelay: React.FC<MatchProps> = ({ names, words, onFinish, first = 0 }) => {
  const [turn, setTurn] = useState(0)
  const [streak, setStreak] = useState(0)
  const [best, setBest] = useState(0)
  const [each, setEach] = useState<[number, number]>([0, 0])
  const [lives, setLives] = useState(LIVES)

  const player = ((turn + first) % 2) as 0 | 1
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
        // The page plays the fanfare for the result — once.
        onFinish(tally)
        return
      }
    } else {
      // SpellTurn has already played the soft "nearly" sound.
      const left = lives - 1
      setLives(left)
      setStreak(0)
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
        <span aria-label={`${lives} hearts left`}>
          {'💛'.repeat(Math.max(lives, 0))}
          <span className="relay-lost" aria-hidden>{'🤍'.repeat(Math.max(LIVES - lives, 0))}</span>
        </span>
      </div>
      <div className="relay-bar"><div style={{ width: `${(streak / TARGET) * 100}%` }} /></div>
      <p className="relay-note">
        <span className="chal-chip p0"><span aria-hidden>{PLAYER_ICONS[0]}</span> {names[0]} {each[0]}</span>{' '}
        <span className="chal-chip p1"><span aria-hidden>{PLAYER_ICONS[1]}</span> {names[1]} {each[1]}</span>
        <span className="relay-team"> — one team!</span>
      </p>
      <SpellTurn
        key={turn}
        who={names[player]}
        player={player}
        word={word}
        label={best > 0 ? `Best streak so far: ${best}` : 'Help each other — every word counts!'}
        onAnswer={answer}
      />
    </div>
  )
}

export default CoopRelay
