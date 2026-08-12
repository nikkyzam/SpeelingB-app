import React from 'react'
import { NavLink } from 'react-router-dom'
import { useProgressStore } from '../../../stores/progressStore'
import { useRewardStore } from '../../../stores/rewards/useRewardStore'
import './Navigation.css'

const Navigation: React.FC = () => {
  const { dailyGoalCompleted } = useProgressStore()
  const { heavenlyStars } = useRewardStore()

  const navItems = [
    { path: '/', icon: '🏠', label: 'Home', badge: null },
    { path: '/learn', icon: '📚', label: 'Learn', badge: dailyGoalCompleted ? '🎯' : null },
    { path: '/bible', icon: '⛪', label: 'Bible', badge: null },
    { path: '/games', icon: '🎮', label: 'Games', badge: null },
    { path: '/rewards', icon: '🏆', label: 'Rewards', badge: heavenlyStars > 0 ? '⭐' : null },
    { path: '/settings', icon: '⚙️', label: 'Settings', badge: null },
  ]

  return (
    <nav className="navigation">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `nav-item ${isActive ? 'nav-item-active' : ''}`
          }
        >
          <span className="nav-icon">{item.icon}</span>
          {item.badge && <span className="nav-badge">{item.badge}</span>}
          <span className="nav-label">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}

export default Navigation
