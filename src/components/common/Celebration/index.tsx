import React, { useEffect } from 'react'
import { useTheme } from '../../../contexts/ThemeContext'
import './Celebration.css'

export interface CelebrationData {
  title: string
  message?: string
  stars?: number
  unlockedLabel?: string | null
}

interface CelebrationProps {
  data: CelebrationData | null
  onClose: () => void
  closeLabel?: string
}

/** A joyful, theme-aware "you did it!" overlay used when a game or stage finishes.
 *  Replaces jarring window.alert() popups. */
const Celebration: React.FC<CelebrationProps> = ({ data, onClose, closeLabel = 'Yay!' }) => {
  const { world } = useTheme()

  useEffect(() => {
    if (!data) return
    const t = setTimeout(onClose, 6000) // auto-dismiss so it never blocks play
    return () => clearTimeout(t)
  }, [data, onClose])

  if (!data) return null

  const confettiColors = ['var(--primary)', 'var(--secondary)', 'var(--accent)', 'var(--success)']

  return (
    <div className="celebration" role="dialog" aria-modal="true" onClick={onClose}>
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

        {data.unlockedLabel && (
          <div className="celebration__unlock">🔓 New game unlocked: <strong>{data.unlockedLabel}</strong></div>
        )}

        <button className="btn btn-primary btn-large celebration__btn" onClick={onClose}>
          {closeLabel}
        </button>
      </div>
    </div>
  )
}

export default Celebration
