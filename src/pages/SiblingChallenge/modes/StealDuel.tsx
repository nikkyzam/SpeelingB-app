import React, { useState } from 'react'
import type { MatchProps } from '../index'
import SpellTurn, { PLAYER_ICONS } from './SpellTurn'
import sfx from '../../../components/games/shared/sfx'

const ROUNDS_EACH = 5

/**
 * Steal-the-Point.
 *
 * Turn-based, but a missed word lets the other player steal the point — so
 * nobody can stop paying attention on their sibling's turn, which is what
 * makes taking turns dull. A stolen point is worth the same; the theft is the
 * fun.
 *
 * The thief steals with a word from their OWN list. Stealing the missed word
 * itself was unfair whenever the children picked different lengths: the older
 * child stole the younger one's short words easily, and the younger one almost
 * never managed the older one's long ones — the handicap worked backwards on
 * every steal. It also means the missed word can be shown straight away.
 */
const StealDuel: React.FC<MatchProps> = ({ names, words, onFinish, first = 0 }) => {
  const [turn, setTurn] = useState(0)
  const [scores, setScores] = useState<[number, number]>([0, 0])
  const [stealer, setStealer] = useState<0 | 1 | null>(null)
  /** Steal words used by each player, so a second steal gets a new word. */
  const [steals, setSteals] = useState<[number, number]>([0, 0])

  const owner = ((turn + first) % 2) as 0 | 1
  const round = Math.floor(turn / 2)
  const active = stealer ?? owner
  const ownList = words[active]
  // Own turns use the first ROUNDS_EACH words; steals start after them.
  const word =
    stealer === null
      ? ownList[round % ownList.length]
      : ownList[(ROUNDS_EACH + steals[stealer]) % ownList.length]

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
    if (stealer !== null) {
      const used: [number, number] = [...steals] as [number, number]
      used[stealer] += 1
      setSteals(used)
    }
    if (correct) {
      next[active] += 1
      advance(next)
      return
    }
    if (stealer === null) {
      sfx.whoosh()
      setStealer(owner === 0 ? 1 : 0)
      return
    }
    advance(next)
  }

  return (
    <div className="steal">
      <div className="steal-score">
        {[0, 1].map((i) => (
          <span key={i} className={`chal-chip p${i}`}>
            <span aria-hidden>{PLAYER_ICONS[i]}</span> {names[i]} <strong>{scores[i]}</strong>
          </span>
        ))}
      </div>
      {stealer !== null && <div className="steal-flag">🥷 {names[stealer]} can steal the point!</div>}
      <SpellTurn
        // A fresh turn every time, so a steal cannot arrive still holding the
        // last answer — two children given the same name would otherwise leave
        // the box disabled and the match stuck.
        key={`${turn}-${stealer ?? 'own'}`}
        who={names[active]}
        player={active}
        word={word}
        label={stealer === null ? `Round ${round + 1} of ${ROUNDS_EACH}` : 'Steal the point!'}
        onAnswer={answer}
        intro={stealer !== null ? `${names[stealer]}, steal the point!` : undefined}
      />
    </div>
  )
}

export default StealDuel
