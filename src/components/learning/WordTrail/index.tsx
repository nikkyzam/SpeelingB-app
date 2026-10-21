import React, { useEffect } from 'react'
import { isStreakMilestone } from '../../../services/words/praise'
import sfx from '../../games/shared/sfx'
import './WordTrail.css'

interface WordTrailProps {
  /** How many words are in the set: one stepping stone each. */
  total: number
  /** The word on the card now (0-based). `total` or more means the set is done. */
  current: number
  /** Indexes of the words solved so far — each of those stones gets a ⭐. */
  solved?: readonly number[]
  /** Who hops from stone to stone (the world's mascot). */
  mascot?: string
  /** Right answers in a row. Shown as a 🔥 chip that pops at 3, 5, 10… */
  streak?: number
  /** Stars earned in this set. Shown as a ⭐ chip when given. */
  stars?: number
}

/** More stones than this would wrap into a wall; past it the trail is one track. */
const MAX_STONES = 20

/** What the trail calls out as the mascot moves along. */
export const trailCheer = (done: number, total: number): string | null => {
  if (total >= 3 && total - done === 1) return 'One to go! 🚀'
  if (total >= 4 && done === Math.ceil(total / 2)) return 'Halfway there! 🎉'
  return null
}

/**
 * A set of words as a path of stepping stones: one stone per word, a ⭐ on
 * each one solved, and the world's mascot hopping onto the word being worked
 * on. Halfway and one-to-go get a little cheer.
 *
 * "Word 3 of 5" is a number a five-year-old has to read and work out; a bee
 * three stones along a path of five is something they can see.
 */
const WordTrail: React.FC<WordTrailProps> = ({ total, current, solved = [], mascot = '🐝', streak = 0, stars }) => {
  const done = Math.max(0, Math.min(current, total))
  const cheer = trailCheer(done, total)
  const milestone = isStreakMilestone(streak)
  const solvedSet = new Set(solved)
  const here = Math.min(current, total - 1)

  useEffect(() => {
    if (cheer) sfx.pop()
  }, [cheer])

  if (total <= 0) return null

  return (
    <div className="word-trail">
      <div className="wt-top">
        {typeof stars === 'number' && (
          <span className="wt-chip wt-stars" aria-label={`${stars} stars`}>⭐ {stars}</span>
        )}
        {streak > 0 && (
          // Keyed on a milestone so the pop replays at 3, 5, 10.
          <span
            key={milestone ? `m${streak}` : 'run'}
            className={`wt-chip wt-streak ${milestone ? 'is-milestone' : ''}`}
            aria-label={`${streak} in a row`}
          >
            🔥 {streak}
          </span>
        )}
        {cheer && (
          <span key={cheer} className="wt-cheer" role="status">{cheer}</span>
        )}
      </div>

      <div
        className="wt-path"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={here + 1}
        aria-valuetext={`Word ${here + 1} of ${total}`}
      >
        {total > MAX_STONES ? (
          <div className="wt-track">
            <div className="wt-fill" style={{ width: `${(done / total) * 100}%` }}>
              <span className="wt-runner" aria-hidden>{mascot}</span>
            </div>
          </div>
        ) : (
          Array.from({ length: total }, (_, i) => {
            const isHere = i === here && current < total
            const isSolved = solvedSet.has(i)
            const state = isHere ? 'here' : isSolved ? 'solved' : i < done ? 'passed' : 'ahead'
            return (
              <span key={i} className={`wt-stone is-${state}`} aria-hidden>
                {isHere ? (
                  // Keyed on the stone, so the mascot hops each time it lands.
                  <span key={`hop-${i}`} className="wt-mascot">{mascot}</span>
                ) : isSolved ? (
                  '⭐'
                ) : null}
              </span>
            )
          })
        )}
      </div>
    </div>
  )
}

export default WordTrail
