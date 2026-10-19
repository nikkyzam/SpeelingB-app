import React from 'react'
import './Burst.css'

interface BurstProps {
  /**
   * Change this to fire a burst — a count of right answers is ideal. Zero (or
   * any falsy value) shows nothing, so nothing pops when the game first opens.
   */
  trigger: number
  /** What flies out. */
  emoji?: string[]
  /** Pieces per burst. */
  count?: number
}

const DEFAULT_EMOJI = ['⭐', '✨', '🌟', '🎉']

/**
 * A little firework of stars for a right answer.
 *
 * Put it inside an element with `position: relative` (the word, the board, the
 * flash) and bump `trigger` on every hit: the pieces fly out from the middle
 * of that element and fade, then the burst is gone. It never takes a tap, and
 * with reduced motion it simply doesn't appear.
 */
const Burst: React.FC<BurstProps> = ({ trigger, emoji = DEFAULT_EMOJI, count = 10 }) => {
  if (!trigger) return null
  return (
    // Keyed on the trigger, so each new value is a fresh burst.
    <span key={trigger} className="bst-burst" aria-hidden>
      {Array.from({ length: count }, (_, i) => {
        const angle = (360 / count) * i + (trigger % 7) * 9
        const reach = 60 + ((i * 37 + trigger * 13) % 50)
        return (
          <span
            key={i}
            className="bst-piece"
            style={{ '--bst-angle': `${angle}deg`, '--bst-reach': `${reach}px` } as React.CSSProperties}
          >
            {emoji[i % emoji.length]}
          </span>
        )
      })}
    </span>
  )
}

export default Burst
