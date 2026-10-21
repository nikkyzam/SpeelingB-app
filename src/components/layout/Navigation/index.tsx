import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useProgress } from '../../../contexts/ProgressContext'
import { useRewardStore } from '../../../stores/rewards/useRewardStore'
import './Navigation.css'

const Navigation: React.FC = () => {
  // Today's words met. This read the vestigial progressStore flag, which
  // nothing ever sets, so the Learn tab's 🎯 never appeared.
  const { learningFlow } = useProgress()
  const dailyGoalCompleted = learningFlow.isDailyGoalReached('learn')
  const { heavenlyStars } = useRewardStore()
  const { pathname } = useLocation()

  // Home is the subject chooser, so every subject page sits under it; the
  // spelling screens all belong to the Spelling tab.
  const navItems: { path: string; icon: string; label: string; badge: string | null; alsoOn?: string[] }[] = [
    { path: '/', icon: '🏠', label: 'Home', badge: null, alsoOn: ['/subjects'] },
    {
      path: '/spelling',
      icon: '🐝',
      label: 'Spelling',
      badge: dailyGoalCompleted ? '🎯' : null,
      alsoOn: ['/learn', '/review', '/daily-quiz', '/weekly-quiz', '/collection', '/progress', '/sentences', '/tournament', '/trophies', '/challenge', '/hunt'],
    },
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
          end={item.path === '/'}
          className={({ isActive }) =>
            `nav-item ${isActive || item.alsoOn?.some((p) => pathname.startsWith(p)) ? 'nav-item-active' : ''}`
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
