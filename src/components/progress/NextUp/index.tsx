import { usePreferences } from '../../../hooks/usePreferences'
import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProgress } from '../../../contexts/ProgressContext'
import { wordBank } from '../../../services/wordBank'
import ReviewSchedule, { SCHEDULE_EVENT } from '../../../services/progress/ReviewSchedule'
import { AchievementsService } from '../../../services/rewards/AchievementsService'
import { MASTERY_EVENT } from '../../../services/progress/WordMastery'
import { Badge } from '../../../types/rewards'
import './NextUp.css'

interface Suggestion {
  icon: string
  title: string
  detail: string
  action: string
  path: string
}

/**
 * One clear thing to do next, and the badge they are closest to earning.
 *
 * A child opening this app meets a buddy, a rank, a quest, a word of the day,
 * five play buttons and a verse. That is a lot of deciding before any learning
 * happens, and deciding is the part children skip by closing the app. This
 * answers the question for them.
 *
 * The badge strip underneath is the goal-gradient trick: "2 more words" pulls
 * far harder than "0 / 100" ever does.
 */
const NextUp: React.FC = () => {
  const navigate = useNavigate()
  const [preferences] = usePreferences()
  const { learningFlow } = useProgress()
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const bump = () => setTick((t) => t + 1)
    window.addEventListener(MASTERY_EVENT, bump)
    window.addEventListener(SCHEDULE_EVENT, bump)
    window.addEventListener('learningProgressUpdated', bump)
    window.addEventListener('badgeUnlocked', bump)
    return () => {
      window.removeEventListener(MASTERY_EVENT, bump)
      window.removeEventListener(SCHEDULE_EVENT, bump)
      window.removeEventListener('learningProgressUpdated', bump)
      window.removeEventListener('badgeUnlocked', bump)
    }
  }, [])

  const suggestion = useMemo<Suggestion>(() => {
    const learnedToday = learningFlow.getWordsLearnedToday().length
    const goal = learningFlow.getLearnGoalToday()
    const due = ReviewSchedule.dueCount()
    // The same test the games use. A review done today counts even when more
    // words have come due since, so this card never nags for a second one.
    const reviewWaiting = !learningFlow.isReviewSatisfiedToday()
    const learnedTotal = learningFlow
      .getWordsLearnedTotal()
      .filter((id) => !!wordBank.getWordById(id)).length

    // Order matters: words that have come due first (revision is the thing
    // most easily skipped), then today's new words, then the quiz that opens
    // the games, then the day's review if one is still waiting.
    if (due > 0 && reviewWaiting) {
      return {
        icon: '🧠',
        title: 'Review time',
        detail: `${due} word${due === 1 ? '' : 's'} ${due === 1 ? 'is' : 'are'} ready for another go`,
        action: 'Start review',
        path: '/review',
      }
    }

    if (!learningFlow.isDailyGoalReached('learn')) {
      const left = Math.max(goal - learnedToday, 1)
      return {
        icon: '📖',
        title: 'Meet some new words',
        detail: `${left} more to finish today's quest`,
        action: 'Learn words',
        path: '/learn',
      }
    }

    if (learnedTotal > 0 && !learningFlow.isDailyQuizPassed()) {
      return {
        icon: '🏆',
        title: "Today's quiz",
        detail: reviewWaiting ? 'Pass it, then a quick review opens every game' : 'Pass it to unlock every game',
        action: 'Start quiz',
        path: '/daily-quiz',
      }
    }

    // Quiz passed, but the games still wait for the day's review — "all
    // done" here sent a child to a grid of locked games and back again.
    if (reviewWaiting && learnedTotal > 0) {
      return {
        icon: '🧠',
        title: 'One quick review',
        detail: 'Practise a few words you know to open every game',
        action: 'Start review',
        path: '/review',
      }
    }

    return {
      icon: '🎮',
      title: 'All done for today!',
      detail: 'Great work. You can stop here, or choose a game.',
      action: 'Play games',
      path: '/games',
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [learningFlow, tick])

  // The unearned badge closest to completion.
  const nextBadge = useMemo<Badge | null>(() => {
    const contenders = AchievementsService.getBadges()
      .filter((b) => !b.unlocked && b.requirements.target > 0)
      .sort(
        (a, b) =>
          b.requirements.current / b.requirements.target -
          a.requirements.current / a.requirements.target
      )
    return contenders[0] || null
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick])

  const remaining = nextBadge
    ? Math.max(0, nextBadge.requirements.target - nextBadge.requirements.current)
    : 0
  const percent = nextBadge
    ? Math.round((nextBadge.requirements.current / nextBadge.requirements.target) * 100)
    : 0

  return (
    <section className="next-up">
      <button className="nu-main" onClick={() => navigate(suggestion.path)}>
        <span className="nu-icon" aria-hidden>{suggestion.icon}</span>
        <span className="nu-text">
          <span className="nu-kicker">Next up</span>
          <span className="nu-title">{suggestion.title}</span>
          <span className="nu-detail">{suggestion.detail}</span>
        </span>
        <span className="nu-go">{suggestion.action} →</span>
      </button>

      {nextBadge && !preferences.calm && (
        <div className="nu-badge" title={nextBadge.description}>
          <span className="nu-badge-icon" aria-hidden>{nextBadge.icon}</span>
          <span className="nu-badge-body">
            <span className="nu-badge-top">
              <strong>{nextBadge.name}</strong>
              <span className="nu-badge-left">
                {remaining} to go
              </span>
            </span>
            <span className="nu-badge-track">
              <span className="nu-badge-fill" style={{ width: `${percent}%` }} />
            </span>
            <span className="nu-badge-desc">{nextBadge.description}</span>
          </span>
        </div>
      )}
    </section>
  )
}

export default NextUp
