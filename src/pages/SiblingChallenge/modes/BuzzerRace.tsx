import React, { useEffect, useRef, useState } from 'react'
import type { MatchProps } from '../index'
import { useAudio } from '../../../contexts/AudioContext'
import SpellTurn, { PLAYER_ICONS } from './SpellTurn'
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
const BuzzerRace: React.FC<MatchProps> = ({ names, words, onFinish, first = 0 }) => {
  const { speak } = useAudio()
  const [round, setRound] = useState(0)
  const [scores, setScores] = useState<[number, number]>([0, 0])
  const [buzzed, setBuzzed] = useState<number | null>(null)
  const [stealer, setStealer] = useState<number | null>(null)
  // Two thumbs land on two buzzers at once: the first one in wins the round.
  // A state check let the second tap overwrite the first.
  const buzzLock = useRef(false)

  // Rounds take turns between the two lists. Every word used to come from
  // player 1's list — so with different word lengths picked, one child's level
  // decided every round of the race.
  const list = words[(round + first) % 2]
  const word = list[Math.floor(round / 2) % list.length]

  // Say the word as the round opens. It used to wait in silence until someone
  // found the "Hear the word" button.
  useEffect(() => {
    buzzLock.current = false
    speak(`Round ${round + 1}! Listen. ${word.word}.`, { queue: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round])

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

  const buzz = (i: number) => {
    if (buzzLock.current) return
    buzzLock.current = true
    setBuzzed(i)
    sfx.pop()
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
      setStealer(who === 0 ? 1 : 0)
      return
    }
    nextRound(next) // both missed
  }

  const scoreboard = (
    <div className="buzz-score">
      {[0, 1].map((i) => (
        <span key={i} className={`chal-chip p${i}`}>
          <span aria-hidden>{PLAYER_ICONS[i]}</span> {names[i]} <strong>{scores[i]}</strong>
        </span>
      ))}
    </div>
  )

  if (buzzed === null) {
    return (
      <div className="buzz">
        {scoreboard}
        <h3 className="buzz-round">Round {round + 1} of {ROUNDS}</h3>
        <Button variant="secondary" icon="🔊" onClick={() => speak(word.word)}>Hear the word</Button>
        <p className="buzz-hint">Know it? Hit your buzzer first!</p>
        <div className="buzz-pads">
          {[0, 1].map((i) => (
            <button
              key={i}
              className={`buzz-pad p${i}`}
              onClick={() => buzz(i)}
              aria-label={`${names[i]} buzz in`}
            >
              <span aria-hidden>{PLAYER_ICONS[i]}🔔</span>
              {names[i]}
            </button>
          ))}
        </div>
      </div>
    )
  }

  const active = (stealer ?? buzzed) as 0 | 1
  return (
    <div className="buzz">
      {scoreboard}
      {stealer !== null && <div className="buzz-steal">🥷 {names[stealer]} gets a go!</div>}
      <SpellTurn
        key={`${round}-${active}`}
        who={names[active]}
        player={active}
        word={word}
        label={`Round ${round + 1} of ${ROUNDS}`}
        onAnswer={answer}
        // The first miss stays secret, because the same word goes straight to
        // the sibling; after the steal it is shown and spelled out.
        reveal={stealer !== null}
        passTo={names[active === 0 ? 1 : 0]}
        intro={stealer !== null ? `${names[stealer]}, you can steal it!` : undefined}
      />
    </div>
  )
}

export default BuzzerRace
