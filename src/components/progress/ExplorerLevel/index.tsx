import React, { useEffect, useMemo, useState } from 'react'
import { useProgress } from '../../../contexts/ProgressContext'
import WordMastery, { MASTERY_EVENT } from '../../../services/progress/WordMastery'
import './ExplorerLevel.css'

interface ExplorerLevelProps {
  /** Small inline version for headers */
  compact?: boolean
  onClick?: () => void
}

/**
 * The child's rank as a word explorer.
 *
 * Stars can be spent, streaks can be broken — this is the one number that only
 * ever goes up, which is exactly what makes it worth climbing.
 */
const ExplorerLevel: React.FC<ExplorerLevelProps> = ({ compact, onClick }) => {
  const { learningFlow } = useProgress()
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const bump = () => setTick((t) => t + 1)
    window.addEventListener(MASTERY_EVENT, bump)
    window.addEventListener('learningProgressUpdated', bump)
    return () => {
      window.removeEventListener(MASTERY_EVENT, bump)
      window.removeEventListener('learningProgressUpdated', bump)
    }
  }, [])

  const { level, totals } = useMemo(() => {
    const learned = learningFlow.getWordsLearnedTotal()
    const spelled = learningFlow.getWordsSpelledTotal()
    return {
      level: WordMastery.level(learned, spelled),
      totals: WordMastery.totals(learned, spelled),
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [learningFlow, tick])

  const percent = Math.round(level.progress * 100)
  const toNext = level.next ? level.next.at - level.xp : 0

  const Tag = onClick ? 'button' : 'div'

  return (
    <Tag className={`explorer-level ${compact ? 'compact' : ''}`} onClick={onClick} type={onClick ? 'button' : undefined}>
      <div className="xl-badge" aria-hidden>{level.icon}</div>

      <div className="xl-body">
        <div className="xl-top">
          <span className="xl-title">{level.title}</span>
          <span className="xl-level">Level {level.level}</span>
        </div>

        <div className="xl-track">
          <div className="xl-fill" style={{ width: `${percent}%` }} />
        </div>

        <div className="xl-foot">
          {level.next
            ? <span>{toNext} XP to <strong>{level.next.title}</strong> {level.next.icon}</span>
            : <span>Top rank reached — you legend! 🏆</span>}
          {!compact && (
            <span className="xl-totals">
              📖 {totals.met} met · ✏️ {totals.spelled} spelled · 🏅 {totals.mastered} mastered
            </span>
          )}
        </div>
      </div>
    </Tag>
  )
}

export default ExplorerLevel
