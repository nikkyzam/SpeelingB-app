import React, { useEffect, useMemo } from 'react'
import { useTheme } from '../../../contexts/ThemeContext'
import sfx from '../../games/shared/sfx'
import './Celebration.css'
import Dialog from '../Dialog'
import { usePreferences } from '../../../hooks/usePreferences'

export interface CelebrationData {
  title: string
  message?: string
  stars?: number
  unlockedLabel?: string | null
  /** A line of its own for something newly earned — a medal, say. */
  badge?: string | null
}

export type CelebrationVariant = 'confetti' | 'fireworks' | 'balloons' | 'starrain' | 'cannon'

const VARIANTS: CelebrationVariant[] = ['confetti', 'fireworks', 'balloons', 'starrain', 'cannon']

interface CelebrationProps {
  data: CelebrationData | null
  onClose: () => void
  closeLabel?: string
  /** force a style; defaults to a surprise each time */
  variant?: CelebrationVariant
  /**
   * Close by itself after a few seconds (the default), so it never blocks
   * play. Turn it off when closing also leaves the page: a child still
   * looking at their stars was whisked off to another screen.
   */
  autoClose?: boolean
  onDone?: () => void
}

/** A joyful, theme-aware "you did it!" overlay used when a game or stage finishes.
 *  Replaces jarring window.alert() popups. The backdrop effect varies —
 *  confetti, fireworks, balloons, star rain or a mascot cannonball — so the
 *  hundredth win doesn't feel like the ninety-ninth. */
const Celebration: React.FC<CelebrationProps> = ({ data, onClose, closeLabel = 'Done for now', variant, autoClose = false, onDone }) => {
  const { world } = useTheme()
  const [preferences] = usePreferences()

  // A party needs a crowd: it opened in total silence before.
  useEffect(() => {
    if (data) sfx.applause()
  }, [data])

  useEffect(() => {
    if (!data || !autoClose) return
    const t = setTimeout(onClose, 6000) // auto-dismiss so it never blocks play
    return () => clearTimeout(t)
  }, [data, onClose, autoClose])

  // One surprise style per celebration, stable while it's open.
  const effect: CelebrationVariant = useMemo(
    () => variant || VARIANTS[Math.floor(Math.random() * VARIANTS.length)],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data]
  )

  if (!data) return null

  const confettiColors = ['var(--primary)', 'var(--secondary)', 'var(--accent)', 'var(--success)']

  return (
    <Dialog title={data.title} onClose={onClose} className="celebration-dialog">
      {!preferences.calm && effect === 'confetti' && (
        <div className="celebration__confetti" aria-hidden>
          {Array.from({ length: 40 }).map((_, i) => (
            <span
              key={i}
              className="celebration__bit"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 1.5}s`,
                background: confettiColors[i % confettiColors.length],
              }}
            />
          ))}
        </div>
      )}

      {!preferences.calm && effect === 'fireworks' && (
        <div className="celebration__fx" aria-hidden>
          {Array.from({ length: 6 }).map((_, i) => (
            <span
              key={i}
              className="celebration__firework"
              style={{
                left: `${10 + Math.random() * 80}%`,
                top: `${8 + Math.random() * 45}%`,
                animationDelay: `${i * 0.45}s`,
              }}
            >
              {['🎆', '✨', '💥', '🎇'][i % 4]}
            </span>
          ))}
        </div>
      )}

      {!preferences.calm && effect === 'balloons' && (
        <div className="celebration__fx" aria-hidden>
          {Array.from({ length: 12 }).map((_, i) => (
            <span
              key={i}
              className="celebration__balloon"
              style={{
                left: `${Math.random() * 95}%`,
                animationDelay: `${Math.random() * 2.5}s`,
                animationDuration: `${3.5 + Math.random() * 2}s`,
              }}
            >
              {['🎈', '🎈', '🎉', '🎁'][i % 4]}
            </span>
          ))}
        </div>
      )}

      {!preferences.calm && effect === 'starrain' && (
        <div className="celebration__fx" aria-hidden>
          {Array.from({ length: 26 }).map((_, i) => (
            <span
              key={i}
              className="celebration__starfall"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 1.5}s`,
              }}
            >
              {['⭐', '🌟', '✨'][i % 3]}
            </span>
          ))}
        </div>
      )}

      {!preferences.calm && effect === 'cannon' && (
        <div className="celebration__fx" aria-hidden>
          <span className="celebration__cannonball">{world.mascot}</span>
          {Array.from({ length: 16 }).map((_, i) => (
            <span
              key={i}
              className="celebration__starfall"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${0.4 + Math.random() * 1.6}s`,
              }}
            >
              ✨
            </span>
          ))}
        </div>
      )}

      <div className="celebration__card pop-in" onClick={(e) => e.stopPropagation()}>
        <div className="celebration__mascot wiggle" aria-hidden>{world.mascot}</div>
        <h2 className="celebration__title">{data.title}</h2>
        {data.message && <p className="celebration__msg">{data.message}</p>}

        {typeof data.stars === 'number' && data.stars > 0 && (
          <div className="celebration__stars">
            <span className="celebration__star" aria-hidden>⭐</span>
            <span>+{data.stars} {data.stars === 1 ? 'star' : 'stars'}</span>
          </div>
        )}

        {data.badge && <div className="celebration__unlock">{data.badge}</div>}

        {data.unlockedLabel && (
          <div className="celebration__unlock">🔓 New game unlocked: <strong>{data.unlockedLabel}</strong></div>
        )}

        <button className="btn btn-primary btn-large celebration__btn" onClick={onClose}>
          {closeLabel}
        </button>
        {onDone && <button className="comfort-button" onClick={onDone}>Done for now</button>}
        <p>Great work. You can stop whenever you need a break.</p>
      </div>
    </Dialog>
  )
}

export default Celebration
