import React, { useEffect, useRef, useState } from 'react'
import { useUser } from '../../../contexts/UserContext'
import { useTheme } from '../../../contexts/ThemeContext'
import { useAudio } from '../../../contexts/AudioContext'
import { useRewardStore } from '../../../stores/rewards/useRewardStore'
import { useNavigate } from 'react-router-dom'
import sfx from '../../games/shared/sfx'
import './Header.css'

/** What the mascot says when a child keeps poking it. */
const POKES = [
  'Hee hee, that tickles!',
  'Boop!',
  'Are you looking for a secret?',
  'Keep going…',
  'Almost there…',
]

const TAPS_FOR_PARTY = 5

const Header: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useUser()
  const { world } = useTheme()
  const { speak } = useAudio()
  const { heavenlyStars } = useRewardStore()

  const [taps, setTaps] = useState(0)
  const [dancing, setDancing] = useState(false)
  const [whisper, setWhisper] = useState<string | null>(null)
  const timers = useRef<number[]>([])

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), [])

  /**
   * Poking the mascot does nothing useful, which is exactly the point: an app
   * for children should have at least one thing in it that exists purely to be
   * found.
   */
  const pokeMascot = () => {
    const next = taps + 1
    setTaps(next)
    sfx.pop()

    if (next >= TAPS_FOR_PARTY) {
      setTaps(0)
      setDancing(true)
      setWhisper('🎉 You found the secret dance!')
      sfx.fanfare()
      speak('You found my secret dance!')
      window.dispatchEvent(new Event('show-confetti'))
      timers.current.push(window.setTimeout(() => setDancing(false), 3000))
      timers.current.push(window.setTimeout(() => setWhisper(null), 3600))
      return
    }

    setWhisper(POKES[Math.min(next - 1, POKES.length - 1)])
    timers.current.push(window.setTimeout(() => setWhisper(null), 1600))
  }

  return (
    <header className="header">
      <div className="header-left">
        <div className="logo">
          <button
            className={`logo-icon ${dancing ? 'dancing' : ''}`}
            onClick={pokeMascot}
            aria-label={`Poke ${world.name}'s mascot`}
            title="Poke me!"
          >
            {world.mascot}
          </button>
          <div className="logo-block" onClick={() => navigate('/')} role="link" tabIndex={0}
               onKeyDown={(e) => e.key === 'Enter' && navigate('/')}>
            <h1 className="logo-text">Spelling Bee</h1>
            <span className="logo-world">{world.name}</span>
          </div>
          {whisper && <span className="logo-whisper" role="status">{whisper}</span>}
        </div>
      </div>

      <div className="header-right">
        {user && (
          <div className="user-chip">
            {/* Whatever they picked. 'ava' is the legacy stored value from
                when the avatar was hardcoded to one of two faces. */}
            <span className="user-avatar">{!user.avatar || user.avatar === 'ava' ? '🧒' : user.avatar}</span>
            <span className="user-name">{user.name || 'Friend'}</span>
          </div>
        )}

        <div className="star-display" title="Heavenly Stars">
          <span className="star-icon">⭐</span>
          <span className="star-count">{heavenlyStars}</span>
        </div>

        <button
          className="world-button"
          onClick={() => navigate('/settings')}
          aria-label="Change your world"
          title="Change your world"
        >
          🎨
        </button>
      </div>
    </header>
  )
}

export default Header
