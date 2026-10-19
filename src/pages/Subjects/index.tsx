import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../../contexts/UserContext'
import { useTheme } from '../../contexts/ThemeContext'
import { useRewardStore } from '../../stores/rewards/useRewardStore'
import { useStreak } from '../../hooks/useStreak'
import { SUBJECTS } from '../../services/subjects/catalogue'
import Button from '../../components/common/Button'
import AuthModal from '../../components/auth/AuthModal'
import MysteryBox from '../../components/rewards/MysteryBox'
import './Subjects.css'

/** Spelling, reading and Bible have their own homes; they sit beside the other subjects here. */
const CARDS = [
  { path: '/spelling', icon: '🐝', name: 'Spelling', blurb: 'Learn new words and spell them', tone: 'success' },
  ...SUBJECTS.map((s) => ({ path: `/subjects/${s.id}`, icon: s.icon, name: s.name, blurb: s.blurb, tone: s.tone })),
  { path: '/reading', icon: '📚', name: 'Reading', blurb: 'Books to read and words to find', tone: 'secondary' },
  { path: '/bible', icon: '⛪', name: 'Bible', blurb: 'Verses, stories and trivia', tone: 'primary' },
]

const EXTRAS = [
  { path: '/games', icon: '🎮', name: 'Games' },
  { path: '/rewards', icon: '🏆', name: 'Prizes' },
]

/**
 * The front door. It belongs to no subject: who is here, what they have
 * earned, and a choice of what to learn — nothing is picked for them.
 */
const Subjects: React.FC = () => {
  const navigate = useNavigate()
  const { user, logout } = useUser()
  const { world } = useTheme()
  const { heavenlyStars } = useRewardStore()
  // The streak counts days the child came to learn anything, so it is kept here.
  const { streakData, updateStreak, freezeUsed } = useStreak()
  const [authOpen, setAuthOpen] = useState(false)

  useEffect(() => {
    updateStreak()
  }, [])

  const name = user?.name || 'friend'

  return (
    <div className="subjects-page">
      <header className="sj-welcome">
        <div className="sj-welcome-mascot" aria-hidden>
          {world.mascot}
        </div>
        <div className="sj-welcome-text">
          <h1>Hi {name}!</h1>
          <p>What would you like to learn today?</p>
          <div className="sj-welcome-chips">
            <span className="sj-welcome-chip">
              🔥 <strong>{streakData.currentStreak}</strong> day streak
            </span>
            <span className="sj-welcome-chip">
              ⭐ <strong>{heavenlyStars}</strong> stars
            </span>
          </div>
        </div>
        <div className="sj-welcome-auth">
          {user?.isGuest ? (
            <Button variant="secondary" size="small" onClick={() => setAuthOpen(true)}>
              Sign In
            </Button>
          ) : (
            <Button variant="secondary" size="small" onClick={logout}>
              Log out
            </Button>
          )}
        </div>
      </header>

      {/* A missed day was forgiven — tell the child their streak survived. */}
      {freezeUsed && (
        <p className="sj-streak-saved pop-in">
          ❄️ We saved your <strong>{streakData.currentStreak}-day streak</strong>! Welcome back!
        </p>
      )}

      <section aria-labelledby="sj-choose">
        <h2 id="sj-choose" className="sj-choose-title">
          Choose a subject
        </h2>
        <div className="sj-grid">
          {CARDS.map((c) => (
            <button key={c.path} type="button" className={`sj-card sj-tone-${c.tone}`} onClick={() => navigate(c.path)}>
              <span className="sj-icon" aria-hidden>
                {c.icon}
              </span>
              <span className="sj-name">{c.name}</span>
              <span className="sj-blurb">{c.blurb}</span>
            </button>
          ))}
        </div>
      </section>

      {/* One free surprise a day, whatever they study. */}
      <MysteryBox />

      <nav className="sj-extras" aria-label="More">
        {EXTRAS.map((x) => (
          <button key={x.path} type="button" className="sj-chip" onClick={() => navigate(x.path)}>
            {x.icon}
            <span className="sj-chip-sub">{x.name}</span>
          </button>
        ))}
      </nav>

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  )
}

export default Subjects
