import React, { useMemo } from 'react'
import { useTheme } from '../../../contexts/ThemeContext'
import { Word } from '../../../services/wordBank'
import './QuestMap.css'

interface QuestMapProps {
  words: Word[]
  groupSize: number
  /** index of the group the child is currently working on */
  current: number
  learnedIds: string[]
  spelledIds: string[]
  onSelect: (groupIndex: number) => void
}

interface Node {
  index: number
  /** 0-100 percentages within the map */
  x: number
  y: number
  total: number
  learned: number
  spelled: number
  state: 'done' | 'current' | 'open' | 'locked'
  /** every fifth stop is a dragon stop */
  boss: boolean
}

const COLS = [18, 50, 82] // x positions (%) for the serpentine columns
// Only a stretch of the trail is drawn at a time. The full word list is ~700
// groups, which would be 700 buttons and a map some 25,000px tall.
const WINDOW = 9
const ROW_H = 90 // viewBox units per row
const VIEW_W = 300

/**
 * The word adventure as a real map: a winding trail through the child's
 * chosen world, one stop per word group, a dragon every fifth stop, and the
 * world mascot standing on today's stop. Finishing a group visibly moves the
 * mascot along the trail — progress you can point at.
 */
const QuestMap: React.FC<QuestMapProps> = ({ words, groupSize, current, learnedIds, spelledIds, onSelect }) => {
  const { world } = useTheme()

  const nodes = useMemo<Node[]>(() => {
    const count = Math.max(1, Math.ceil(words.length / groupSize))
    const learned = new Set(learnedIds)
    const spelled = new Set(spelledIds)

    const groupAt = (i: number) => words.slice(i * groupSize, (i + 1) * groupSize)
    const fullyLearned = (i: number) => {
      const g = groupAt(i)
      return g.length > 0 && g.every((w) => learned.has(w.id))
    }

    // A window around the child's current stop, clamped to the ends.
    const half = Math.floor(WINDOW / 2)
    let from = Math.max(0, current - half)
    const to = Math.min(count, from + WINDOW)
    from = Math.max(0, to - WINDOW)

    // A group is open when every group before it is fully learned — including
    // the ones scrolled off the top of the window.
    let frontierOpen = true
    for (let i = 0; i < from; i++) {
      if (!fullyLearned(i)) {
        frontierOpen = false
        break
      }
    }

    const list: Node[] = []
    for (let i = from; i < to; i++) {
      const groupWords = groupAt(i)
      const learnedCount = groupWords.filter((w) => learned.has(w.id)).length
      const spelledCount = groupWords.filter((w) => spelled.has(w.id)).length
      const done = groupWords.length > 0 && spelledCount === groupWords.length

      let state: Node['state']
      if (done) state = 'done'
      else if (i === current) state = 'current'
      else if (frontierOpen) state = 'open'
      else state = 'locked'

      if (!fullyLearned(i)) frontierOpen = false

      // Serpentine, positioned within the window: row 0 left->right, row 1 right->left.
      const local = i - from
      const row = Math.floor(local / COLS.length)
      const col = row % 2 === 0 ? local % COLS.length : COLS.length - 1 - (local % COLS.length)

      list.push({
        index: i,
        x: COLS[col],
        y: row,
        total: groupWords.length,
        learned: learnedCount,
        spelled: spelledCount,
        state,
        boss: (i + 1) % 5 === 0,
      })
    }
    return list
  }, [words, groupSize, current, learnedIds, spelledIds])

  const rows = Math.max(1, Math.ceil(nodes.length / COLS.length))
  const viewH = rows * ROW_H + 40

  // Smooth trail through the stops, in viewBox coordinates.
  const trailPath = useMemo(() => {
    if (nodes.length < 2) return ''
    const pts = nodes.map((n) => ({ x: (n.x / 100) * VIEW_W, y: n.y * ROW_H + 45 }))
    let d = `M ${pts[0].x} ${pts[0].y}`
    for (let i = 1; i < pts.length; i++) {
      const prev = pts[i - 1]
      const p = pts[i]
      const midY = (prev.y + p.y) / 2
      d += ` C ${prev.x} ${midY}, ${p.x} ${midY}, ${p.x} ${p.y}`
    }
    return d
  }, [nodes])

  return (
    <div className="quest-map" style={{ aspectRatio: `${VIEW_W} / ${viewH}` }}>
      {/* scenery from the child's world */}
      <div className="quest-scenery" aria-hidden>
        {world.sprinkles.map((s, i) => (
          <span key={i} className={`quest-sprinkle qs${i}`}>{s}</span>
        ))}
      </div>

      <svg
        className="quest-trail"
        viewBox={`0 0 ${VIEW_W} ${viewH}`}
        preserveAspectRatio="none"
        aria-hidden
      >
        <path d={trailPath} className="quest-trail-line" />
      </svg>

      {nodes.map((n) => (
        <button
          key={n.index}
          className={`quest-node ${n.state} ${n.boss ? 'boss' : ''}`}
          style={{ left: `${n.x}%`, top: `${((n.y * ROW_H + 45) / viewH) * 100}%` }}
          onClick={() => n.state !== 'locked' && onSelect(n.index)}
          disabled={n.state === 'locked'}
          aria-label={
            n.state === 'locked'
              ? `Group ${n.index + 1}, locked`
              : `Group ${n.index + 1}, ${n.spelled} of ${n.total} spelled`
          }
        >
          {n.boss && <span className="quest-boss" aria-hidden>🐉</span>}
          <span className="quest-node-icon" aria-hidden>
            {n.state === 'done' ? '⭐' : n.state === 'locked' ? '🔒' : n.index + 1}
          </span>
          {n.state === 'current' && (
            <span className="quest-mascot" aria-hidden>{world.mascot}</span>
          )}
          {n.state !== 'locked' && n.state !== 'done' && n.total > 0 && (
            <span className="quest-node-progress">
              {n.spelled}/{n.total}
            </span>
          )}
        </button>
      ))}

      <div className="quest-legend" aria-hidden>
        <span>⭐ done</span>
        <span>{world.mascot} you are here</span>
        <span>🐉 dragon stop</span>
      </div>
    </div>
  )
}

export default QuestMap
