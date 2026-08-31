import React, { useState } from 'react'
import { useRewardStore } from '../../../stores/rewards/useRewardStore'
import { useAudio } from '../../../contexts/AudioContext'
import sfx from '../shared/sfx'
import './PrizeWheel.css'

interface Prize {
  stars: number
  label: string
  icon: string
  color: string
}

/** Eight slices — no blanks, ever. A wheel that can land on "nothing" is a wheel
 *  a child learns to distrust. The prize varies; getting one never does. */
const PRIZES: Prize[] = [
  { stars: 5, label: '5 stars', icon: '⭐', color: '#FFD166' },
  { stars: 15, label: '15 stars', icon: '🌟', color: '#4ECDC4' },
  { stars: 8, label: '8 stars', icon: '✨', color: '#FF8FAB' },
  { stars: 25, label: '25 stars', icon: '💫', color: '#8AC926' },
  { stars: 10, label: '10 stars', icon: '⭐', color: '#7C5CFF' },
  { stars: 50, label: 'JACKPOT!', icon: '🏆', color: '#FF6B6B' },
  { stars: 12, label: '12 stars', icon: '✨', color: '#06D6A0' },
  { stars: 20, label: '20 stars', icon: '🌟', color: '#F4A300' },
]

const SLICE = 360 / PRIZES.length
const LAST_SPIN_KEY = 'prizeWheelLastSpin'

const today = () => new Date().toDateString()

const readLastSpin = (): string | null => {
  try {
    return localStorage.getItem(LAST_SPIN_KEY)
  } catch {
    return null
  }
}

/**
 * One free spin every day, win something every time.
 *
 * It's the "come back tomorrow" hook — and unlike the games it asks nothing of
 * the child, which is exactly why they'll open the app to get it.
 */
const PrizeWheel: React.FC = () => {
  const { addStars } = useRewardStore()
  const { speak } = useAudio()

  const [spunToday, setSpunToday] = useState(() => readLastSpin() === today())
  const [angle, setAngle] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const [won, setWon] = useState<Prize | null>(null)

  const spin = () => {
    if (spinning || spunToday) return
    setSpinning(true)
    sfx.whoosh()

    const index = Math.floor(Math.random() * PRIZES.length)
    // Five full turns, then stop with the winning slice under the pointer.
    const target = 360 * 5 - (index * SLICE + SLICE / 2)
    setAngle(target)

    setTimeout(() => {
      const prize = PRIZES[index]
      setWon(prize)
      setSpinning(false)
      setSpunToday(true)
      addStars(prize.stars)
      try {
        localStorage.setItem(LAST_SPIN_KEY, today())
      } catch {
        /* if storage is blocked they simply get another spin later */
      }
      sfx.fanfare()
      speak(prize.stars >= 50 ? 'Jackpot!' : `You won ${prize.stars} stars!`)
    }, 4200)
  }

  return (
    <div className="prize-wheel">
      <div className="pw-text">
        <h3>🎡 Daily Prize Wheel</h3>
        <p>
          {won
            ? `${won.icon} You won ${won.stars} stars! Come back tomorrow for another spin.`
            : spunToday
              ? 'Already spun today — a fresh spin is waiting tomorrow! 🌙'
              : 'One free spin every day. Everybody wins something!'}
        </p>
        <button className="pw-btn" onClick={spin} disabled={spinning || spunToday}>
          {spinning ? 'Spinning…' : spunToday ? '✅ Spun today' : '🎡 Spin the wheel!'}
        </button>
      </div>

      <div className="pw-wheel-wrap">
        <div className="pw-pointer" aria-hidden>▼</div>
        <div
          className="pw-wheel"
          style={{
            transform: `rotate(${angle}deg)`,
            background: `conic-gradient(${PRIZES.map(
              (p, i) => `${p.color} ${i * SLICE}deg ${(i + 1) * SLICE}deg`
            ).join(', ')})`,
          }}
        >
          {PRIZES.map((p, i) => (
            <span
              key={i}
              className="pw-slice-label"
              style={{ transform: `rotate(${i * SLICE + SLICE / 2}deg) translateY(-64px)` }}
            >
              {p.icon}
            </span>
          ))}
          <span className="pw-hub" aria-hidden>🎁</span>
        </div>
      </div>
    </div>
  )
}

export default PrizeWheel
