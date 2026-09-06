import React, { useEffect, useMemo, useState } from 'react'
import { wordBank } from '../../../services/wordBank'
import { useProgress } from '../../../contexts/ProgressContext'
import WordMastery, { MASTERY_EVENT } from '../../../services/progress/WordMastery'
import './WordProgress.css'

interface WordProgressProps {
  /** Compact bar for Home; the full breakdown is for the grown-up report. */
  detailed?: boolean
  onClick?: () => void
}

const pct = (part: number, whole: number) => (whole > 0 ? (part / whole) * 100 : 0)

/** "4%" — but never a bare 0% for a child who has genuinely started. */
const label = (part: number, whole: number): string => {
  const p = pct(part, whole)
  if (part > 0 && p < 1) return '<1%'
  return `${Math.round(p)}%`
}

/**
 * The whole journey, honestly.
 *
 * Everything else in the app measures a day: today's words, today's streak,
 * this group of five. Nothing showed how far through the actual spelling-bee
 * list a child had come — so a child could not tell whether they had climbed a
 * hill or a mountain. The numbers are deliberately real rather than flattering:
 * 142 of 3,475 is a small slice, and saying so is what makes the bar mean
 * something when it moves.
 */
const WordProgress: React.FC<WordProgressProps> = ({ detailed = false, onClick }) => {
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

  const stats = useMemo(() => {
    const learnedIds = learningFlow.getWordsLearnedTotal()
    const spelledIds = learningFlow.getWordsSpelledTotal()

    // Saved ids can stop resolving, so count only words the bank still knows —
    // the same rule the collection uses, so the two never disagree.
    const known = learnedIds.map((id) => wordBank.getWordById(id)).filter(Boolean)
    const totals = WordMastery.totals(learnedIds, spelledIds)

    const all = wordBank.getAllWords()
    const tiers = [1, 2, 3].map((d) => {
      const total = all.filter((w) => w.difficulty === d).length
      const met = known.filter((w) => w!.difficulty === d).length
      return { tier: d, total, met }
    }).filter((t) => t.total > 0) // Three Bee is empty; do not show an empty bar

    return { met: known.length, total: all.length, mastered: totals.mastered, tiers }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [learningFlow, tick])

  const Tag = onClick ? 'button' : 'div'

  return (
    <Tag
      className={`word-progress ${detailed ? 'detailed' : ''} ${onClick ? 'tappable' : ''}`}
      onClick={onClick}
      {...(onClick ? { 'aria-label': 'See your word collection' } : {})}
    >
      <div className="wp-head">
        <span className="wp-title">📚 Your word journey</span>
        <span className="wp-count">
          <strong>{stats.met.toLocaleString()}</strong> of {stats.total.toLocaleString()}
        </span>
      </div>

      <div className="wp-bar" role="img" aria-label={`${stats.met} of ${stats.total} words met, ${label(stats.met, stats.total)}`}>
        <div className="wp-bar-fill" style={{ width: `${Math.max(pct(stats.met, stats.total), stats.met > 0 ? 1.5 : 0)}%` }} />
        <div
          className="wp-bar-mastered"
          style={{ width: `${Math.max(pct(stats.mastered, stats.total), stats.mastered > 0 ? 1 : 0)}%` }}
          title={`${stats.mastered} mastered`}
        />
      </div>

      <div className="wp-legend">
        <span className="wp-pct">{label(stats.met, stats.total)} met</span>
        <span className="wp-dot" aria-hidden>·</span>
        <span className="wp-mastered">⭐ {stats.mastered.toLocaleString()} mastered</span>
      </div>

      {detailed && (
        <div className="wp-tiers">
          {stats.tiers.map((t) => (
            <div key={t.tier} className="wp-tier">
              <div className="wp-tier-head">
                <span>{t.tier === 1 ? '🐝 One Bee' : t.tier === 2 ? '🐝🐝 Two Bee' : '🐝🐝🐝 Three Bee'}</span>
                <span className="wp-tier-count">{t.met.toLocaleString()} / {t.total.toLocaleString()}</span>
              </div>
              <div className="wp-bar small">
                <div className="wp-bar-fill" style={{ width: `${Math.max(pct(t.met, t.total), t.met > 0 ? 1.5 : 0)}%` }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </Tag>
  )
}

export default WordProgress
