import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useProgress } from '../../../contexts/ProgressContext'
import WordMastery, { MASTERY_EVENT } from '../../../services/progress/WordMastery'
import sfx from '../../games/shared/sfx'
import './FunFx.css'

interface Flight {
  id: number
  from: { x: number; y: number }
  to: { x: number; y: number }
  delay: number
}

interface Toast {
  id: number
  icon: string
  title: string
  message: string
}

const LEVEL_SEEN_KEY = 'explorer_level_seen'
const STREAK_SEEN_KEY = 'streak_milestone_seen'

/** Streak lengths worth stopping the world for. */
const STREAK_MILESTONES: { days: number; icon: string; title: string }[] = [
  { days: 3, icon: '🔥', title: '3 days in a row!' },
  { days: 7, icon: '🏅', title: 'A whole week!' },
  { days: 14, icon: '🚀', title: 'Two weeks straight!' },
  { days: 30, icon: '👑', title: 'A WHOLE MONTH!' },
  { days: 100, icon: '🏆', title: '100 days. Incredible.' },
]
const MAX_STARS_PER_BURST = 8

/**
 * The app's celebration layer: one component, mounted once, that turns things
 * the app already *does* into things a child can *see*.
 *
 * - Earning stars anywhere makes stars fly to the counter in the header.
 * - Climbing an explorer rank throws a party.
 * - Unlocking a badge shows a toast (the `badgeUnlocked` event previously had
 *   no listener at all, so badges unlocked in total silence).
 */
const FunFx: React.FC = () => {
  const { learningFlow } = useProgress()
  const [flights, setFlights] = useState<Flight[]>([])
  const [toasts, setToasts] = useState<Toast[]>([])
  // Used for both explorer ranks and streak milestones — same party, different news.
  const [rankUp, setRankUp] = useState<{ icon: string; title: string; kind?: 'rank' | 'streak' } | null>(null)
  const idRef = useRef(0)
  const timers = useRef<number[]>([])

  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms))
  }, [])

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), [])

  // --- stars flying to the counter ---
  useEffect(() => {
    const onPoints = (event: Event) => {
      const amount = Number((event as CustomEvent).detail?.amount) || 0
      if (amount <= 0) return

      const target = document.querySelector('.star-display')
      if (!target) return
      const box = target.getBoundingClientRect()
      const to = { x: box.left + box.width / 2, y: box.top + box.height / 2 }
      // Stars appear around the middle of the screen — where the child was
      // just looking — and stream up to their total.
      const from = { x: window.innerWidth / 2, y: window.innerHeight * 0.45 }

      const count = Math.max(3, Math.min(MAX_STARS_PER_BURST, Math.round(amount / 4)))
      const burst: Flight[] = Array.from({ length: count }, (_, i) => ({
        id: idRef.current++,
        from: {
          x: from.x + (Math.random() * 160 - 80),
          y: from.y + (Math.random() * 120 - 60),
        },
        to,
        delay: i * 70,
      }))

      setFlights((f) => [...f, ...burst])
      sfx.star()

      later(() => {
        setFlights((f) => f.filter((x) => !burst.some((b) => b.id === x.id)))
        target.classList.add('star-pop')
        later(() => target.classList.remove('star-pop'), 500)
      }, 900 + burst.length * 70)
    }

    window.addEventListener('pointsEarned', onPoints)
    return () => window.removeEventListener('pointsEarned', onPoints)
  }, [later])

  // --- badge unlocked ---
  useEffect(() => {
    const onBadge = (event: Event) => {
      const badge = (event as CustomEvent).detail?.badge
      if (!badge) return
      const id = idRef.current++
      setToasts((t) => [...t, {
        id,
        icon: badge.icon || '🏅',
        title: 'Badge unlocked!',
        message: badge.name || 'A shiny new badge',
      }])
      sfx.fanfare()
      window.dispatchEvent(new Event('show-confetti'))
      later(() => setToasts((t) => t.filter((x) => x.id !== id)), 5200)
    }

    window.addEventListener('badgeUnlocked', onBadge)
    return () => window.removeEventListener('badgeUnlocked', onBadge)
  }, [later])

  // --- explorer rank up ---
  useEffect(() => {
    const check = () => {
      const level = WordMastery.level(
        learningFlow.getWordsLearnedTotal(),
        learningFlow.getWordsSpelledTotal()
      )
      let seen: number | null = null
      try {
        const raw = localStorage.getItem(LEVEL_SEEN_KEY)
        seen = raw === null ? null : Number(raw)
      } catch {
        seen = null
      }

      // First run just records where they already are — nobody wants a party
      // for a rank they earned last week.
      if (seen === null || Number.isNaN(seen)) {
        try { localStorage.setItem(LEVEL_SEEN_KEY, String(level.level)) } catch { /* ignore */ }
        return
      }

      if (level.level > seen) {
        try { localStorage.setItem(LEVEL_SEEN_KEY, String(level.level)) } catch { /* ignore */ }
        setRankUp({ icon: level.icon, title: level.title, kind: 'rank' })
        sfx.win()
        window.dispatchEvent(new Event('show-confetti'))
        later(() => setRankUp(null), 5000)
      }
    }

    check()
    window.addEventListener(MASTERY_EVENT, check)
    window.addEventListener('learningProgressUpdated', check)
    return () => {
      window.removeEventListener(MASTERY_EVENT, check)
      window.removeEventListener('learningProgressUpdated', check)
    }
  }, [learningFlow, later])

  // --- streak milestones ---
  useEffect(() => {
    const check = () => {
      let streak = 0
      try {
        streak = Number(JSON.parse(localStorage.getItem('streak') || '{}').currentStreak) || 0
      } catch {
        return
      }
      const reached = [...STREAK_MILESTONES].reverse().find((m) => streak >= m.days)
      if (!reached) return

      let seen = 0
      try { seen = Number(localStorage.getItem(STREAK_SEEN_KEY)) || 0 } catch { seen = 0 }
      if (reached.days <= seen) return

      try { localStorage.setItem(STREAK_SEEN_KEY, String(reached.days)) } catch { /* ignore */ }
      setRankUp({ icon: reached.icon, title: reached.title, kind: 'streak' })
      sfx.fanfare()
      window.dispatchEvent(new Event('show-confetti'))
      later(() => setRankUp(null), 5000)
    }

    // Streaks are updated when Home mounts, so re-check on navigation too.
    check()
    window.addEventListener('streakUpdated', check)
    return () => window.removeEventListener('streakUpdated', check)
  }, [later])

  // Note: this layer is deliberately NOT aria-hidden — the toast and level-up
  // inside it are real announcements. Only the flying stars are decorative,
  // and they hide themselves individually.
  return (
    <div className="fun-fx">
      {flights.map((f) => (
        <FlyingStar key={f.id} flight={f} />
      ))}

      {toasts.length > 0 && (
        <div className="fx-toasts">
          {toasts.map((t) => (
            <div key={t.id} className="fx-toast" role="status">
              <span className="fx-toast-icon">{t.icon}</span>
              <span className="fx-toast-text">
                <strong>{t.title}</strong>
                <span>{t.message}</span>
              </span>
            </div>
          ))}
        </div>
      )}

      {rankUp && (
        <div className="fx-rankup" role="status">
          <div className="fx-rankup-card">
            <div className="fx-rankup-rays" aria-hidden />
            <div className="fx-rankup-icon">{rankUp.icon}</div>
            {rankUp.kind === 'streak' ? (
              <>
                <h3>Streak!</h3>
                <p><strong>{rankUp.title}</strong> You keep coming back — that is how words stick.</p>
              </>
            ) : (
              <>
                <h3>Level up!</h3>
                <p>You are now a <strong>{rankUp.title}</strong>!</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

/** One star, launched just after mount so the transition actually runs. */
const FlyingStar: React.FC<{ flight: Flight }> = ({ flight }) => {
  const [launched, setLaunched] = useState(false)

  useEffect(() => {
    // A timer, not requestAnimationFrame: rAF is paused entirely while the tab
    // is in the background, which left stars frozen at their start position
    // and never cleaned up until the child came back.
    const t = window.setTimeout(() => setLaunched(true), 30)
    return () => window.clearTimeout(t)
  }, [])

  const pos = launched ? flight.to : flight.from

  return (
    <span
      aria-hidden
      className={`fx-star ${launched ? 'flying' : ''}`}
      style={{
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        transitionDelay: `${flight.delay}ms`,
      }}
    >
      ⭐
    </span>
  )
}

export default FunFx
