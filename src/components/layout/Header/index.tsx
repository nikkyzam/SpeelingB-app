import React from 'react'
import { useUser } from '../../../contexts/UserContext'
import { useTheme } from '../../../contexts/ThemeContext'
import { useRewardStore } from '../../../stores/rewards/useRewardStore'
import { useNavigate } from 'react-router-dom'
import './Header.css'

const Header: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useUser()
  const { world } = useTheme()
  const { heavenlyStars } = useRewardStore()

  return (
    <header className="header">
      <div className="header-left">
        <div className="logo" onClick={() => navigate('/')}>
          <span className="logo-icon">{world.mascot}</span>
          <div className="logo-block">
            <h1 className="logo-text">Spelling Bee</h1>
            <span className="logo-world">{world.name}</span>
          </div>
        </div>
      </div>

      <div className="header-right">
        {user && (
          <div className="user-chip">
            <span className="user-avatar">{user.avatar === 'ava' ? '👧' : '🧒'}</span>
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
