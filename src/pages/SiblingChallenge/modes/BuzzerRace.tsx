import React, { useState } from 'react'
import type { MatchProps } from '../index'
import { useAudio } from '../../../contexts/AudioContext'
import SpellTurn from './SpellTurn'
import Button from '../../../components/common/Button'
import sfx from '../../../components/games/shared/sfx'

const ROUNDS = 6

/**
 * Buzzer Race.
 *
 * The same word goes to both, and whoever buzzes first has to spell it —
 * getting it wrong hands the chance to the other. That trade is the game:
 * buzzing fast is only worth it if you actually know the word, so the child
 * who listens carefully can beat the child with the quicker thumb.
 */
const BuzzerRace: React.FC<MatchProps> = ({ names, words, onFinish }) => {
  const { speak } = useAudio()
  const [round, setRound] = useState(0)
  const [scores, setScores] = useState<[number, number]>([0, 0])
  const [buzzed, setBuzzed] = useState<number | null>(null)
  const [stealer, setStealer] = useState<number | null>(null)

  // Both race for the same word, so it comes from the harder of the two lists
  // — otherwise the easier player's words would decide every round.
  const word = words[0][round % words[0].length]

  const nextRound = (next: [number, number]) => {
    setScores(next)
    setBuzzed(null)
    setStealer(null)
    if (round + 1 >= ROUNDS) {
      onFinish(next)
      return
    }
    setRound((r) => r + 1)
  }

  const answer = (correct: boolean) => {
    const who = stealer ?? buzzed!
    const next: [number, number] = [...scores] as [number, number]
    if (correct) {
      next[who] += 1
      nextRound(next)
      return
    }
    if (stealer === null) {
      // Missed it — the other player gets the chance.
      sfx.whoosh()
      const other = who === 0 ? 1 : 0
      speak(`${names[other]}, you can steal it!`)
      setStealer(other)
      return
    }
    nextRound(next) // both missed
  }

  if (buzzed === null) {
    return (
      <div className="buzz">
        <div className="buzz-score">{names[0]} {scores[0]} — {scores[1]} {names[1]}</div>
        <h3>Round {round + 1} of {ROUNDS}</h3>
        <Button variant="secondary" icon="🔊" onClick={() => speak(word.word)}>Hear the word</Button>
        <p className="buzz-hint">Listen, then hit your buzzer — but only if you know it!</p>
        <div className="buzz-pads">
          {[0, 1].map((i) => (
            <button
              key={i}
              className={`buzz-pad p${i}`}
              onClick={() => { setBuzzed(i); sfx.pop() }}
              aria-label={`${names[i]} buzz in`}
            >
              <span aria-hidden>🔔</span>
              {names[i]}
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="buzz">
      <div className="buzz-score">{names[0]} {scores[0]} — {scores[1]} {names[1]}</div>
      {stealer !== null && <div className="buzz-steal">🥷 {names[stealer]} is stealing!</div>}
      <SpellTurn
        who={names[stealer ?? buzzed]}
        word={word}
        label={`Round ${round + 1} of ${ROUNDS}`}
        onAnswer={answer}
      />
    </div>
  )
}

export default BuzzerRace
