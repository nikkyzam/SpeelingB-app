import React, { useMemo } from 'react'
import { Word } from '../../../services/wordBank'
import { useTheme } from '../../../contexts/ThemeContext'
import sfx from '../../games/shared/sfx'
import './WordJourney.css'

interface WordJourneyProps {
  words: Word[]
  groupSize: number
  current: number
  learnedIds: string[]
  spelledIds: string[]
  onSelect: (index: number) => void
}

type StoneState = 'done' | 'learned' | 'started' | 'current' | 'future'

interface Stone {
  index: number
  state: StoneState
  learned: number
  total: number
}

/** How many stones to show around where the child is standing. */
const WINDOW = 9

/**
 * The word groups drawn as a winding trail of stepping stones.
 *
 * A dropdown that says "Group 14 of 695" tells a child nothing. A path with
 * their mascot standing on it, flags behind them and stones ahead, tells them
 * exactly where they are and that there is somewhere to go.
 *
 * Only a window of stones is built — the bank runs to hundreds of groups and
 * nobody needs to scroll past six hundred rocks.
 */
const WordJourney: React.FC<WordJourneyProps> = ({
  words,
  groupSize,
  current,
  learnedIds,
  spelledIds,
  onSelect,
}) => {
  const { world } = useTheme()

  const groupsCount = Math.max(1, Math.ceil(words.length / groupSize))

  const stones = useMemo<Stone[]>(() => {
    const learned = new Set(learnedIds)
    const spelled = new Set(spelledIds)

    const half = Math.floor(WINDOW / 2)
    let start = Math.max(0, current - half)
    const end = Math.min(groupsCount, start + WINDOW)
    start = Math.max(0, end - WINDOW)

    const list: Stone[] = []
    for (let i = start; i < end; i++) {
      const slice = words.slice(i * groupSize, i * groupSize + groupSize)
      const ids = slice.map((w) => w.id)
      const learnedCount = ids.filter((id) => learned.has(id)).length
      const spelledCount = ids.filter((id) => spelled.has(id)).length

      let state: StoneState = 'future'
      if (ids.length > 0 && spelledCount === ids.length) state = 'done'
      else if (ids.length > 0 && learnedCount === ids.length) state = 'learned'
      else if (learnedCount > 0) state = 'started'
      if (i === current) state = 'current'

      list.push({ index: i, state, learned: learnedCount, total: ids.length })
    }
    return list
  }, [words, groupSize, current, learnedIds, spelledIds, groupsCount])

  const icons: Record<StoneState, string> = {
    done: '🏆',
    learned: '📖',
    started: '✨',
    current: world.mascot,
    future: '•',
  }

  const doneCount = stones.filter((s) => s.state === 'done').length

  return (
    <div className="word-journey">
      <div className="wj-head">
        <span className="wj-title">🗺️ Your word trail</span>
        <span className="wj-sub">
          Stop {current + 1} of {groupsCount}
          {doneCount > 0 && ` · ${doneCount} nearby stop${doneCount === 1 ? '' : 's'} finished`}
        </span>
      </div>

      <div className="wj-path">
        {stones.map((stone) => (
          <button
            key={stone.index}
            className={`wj-stone ${stone.state}`}
            onClick={() => { sfx.tap(); onSelect(stone.index) }}
            aria-label={`Word group ${stone.index + 1}, ${stone.learned} of ${stone.total} learned`}
            aria-current={stone.state === 'current' ? 'step' : undefined}
          >
            <span className="wj-icon" aria-hidden>{icons[stone.state]}</span>
            <span className="wj-number">{stone.index + 1}</span>
            {stone.state === 'current' && <span className="wj-here">you are here</span>}
          </button>
        ))}
      </div>
    </div>
  )
}

export default WordJourney
