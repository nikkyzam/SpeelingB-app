import React, { useState } from 'react'
import type { MatchProps } from '../index'
import { useAudio } from '../../../contexts/AudioContext'
import SpellTurn from './SpellTurn'
import sfx from '../../../components/games/shared/sfx'

const ROUNDS_EACH = 5

/**
 * Steal-the-Point.
 *
 * Turn-based, but a missed word passes to the other player — so nobody can
 * stop paying attention on their sibling's turn, which is what makes taking
 * turns dull. A stolen point is worth the same; the theft is the fun.
 */
const StealDuel: React.FC<MatchProps> = ({ names, words, onFinish }) => {
  const { speak } = useAudio()
  const [turn, setTurn] = useState(0)
  const [scores, setScores] = useState<[number, number]>([0, 0])
  const [stealer, setStealer] = useState<number | null>(null)

  const owner = turn % 2
  const round = Math.floor(turn / 2)
  const active = stealer ?? owner
  // The word belongs to whoever's turn it is, so a steal means spelling one of
  // your sibling's words — harder if they are the stronger speller. Fair trade.
  const word = words[owner][round % words[owner].length]

  const advance = (next: [number, number]) => {
    setScores(next)
    setStealer(null)
    if (turn + 1 >= ROUNDS_EACH * 2) {
      onFinish(next)
      return
    }
    setTurn((t) => t + 1)
  }

  const answer = (correct: boolean) => {
    const next: [number, number] = [...scores] as [number, number]
    if (correct) {
      next[active] += 1
      advance(next)
      return
    }
    if (stealer === null) {
      sfx.whoosh()
      const other = owner === 0 ? 1 : 0
      speak(`${names[other]}, steal it!`)
      setStealer(other)
      return
    }
    advance(next)
  }

  return (
    <div className="steal">
      <div className="steal-score">{names[0]} {scores[0]} — {scores[1]} {names[1]}</div>
      {stealer !== null && <div className="steal-flag">🥷 {names[stealer]} is stealing {names[owner]}&apos;s word!</div>}
      <SpellTurn
        who={names[active]}
        word={word}
        label={`Round ${round + 1} of ${ROUNDS_EACH}`}
        onAnswer={answer}
      />
    </div>
  )
}

export default StealDuel
