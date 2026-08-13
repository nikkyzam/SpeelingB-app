import React from 'react'
import { useTheme } from '../../contexts/ThemeContext'
import { useUser } from '../../contexts/UserContext'
import Button from '../../components/common/Button'
import WorldPicker from '../../components/theme/WorldPicker'
import './Settings.css'

const MIN_GOAL = 3
const MAX_GOAL = 20

const Settings: React.FC = () => {
  const { user, logout, updateDailyGoal } = useUser()
  const { world } = useTheme()

  const goal = user?.dailyGoal ?? 5
  const changeGoal = (delta: number) =>
    updateDailyGoal(Math.min(MAX_GOAL, Math.max(MIN_GOAL, goal + delta)))

  return (
    <div className="settings">
      <div className="settings-header">
        <h1>Settings ⚙️</h1>
        <p>Make the app feel just right for you!</p>
      </div>

      {/* Grown-up tools — only visible to admins (Firebase "admin" custom claim). */}
      {user?.isAdmin && (
        <section className="settings-section">
          <h2>Grown-up Tools <span className="admin-badge">Admin</span></h2>
          <div className="settings-info-card">
            <div className="setting-item">
              <div className="setting-info">
                <h3>Daily words to learn</h3>
                <p>How many new words per group before spelling &amp; games unlock.</p>
              </div>
              <div className="goal-stepper">
                <button aria-label="Fewer words" onClick={() => changeGoal(-1)} disabled={goal <= MIN_GOAL}>−</button>
                <span className="goal-value">{goal}</span>
                <button aria-label="More words" onClick={() => changeGoal(1)} disabled={goal >= MAX_GOAL}>+</button>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="settings-section">
        <h2>Your World {world.mascot}</h2>
        <p className="settings-sub">
          You&apos;re exploring <strong>{world.name}</strong>. Tap another world to switch!
        </p>
        <WorldPicker showTitle={false} />
      </section>

      <section className="settings-section">
        <h2>Account</h2>
        <div className="settings-info-card">
          {user?.isGuest ? (
            <p>You are currently playing as a <strong>Guest</strong>.</p>
          ) : (
            <>
              <p>Logged in as: <strong>{user?.email}</strong></p>
              <div style={{ marginTop: 'var(--spacing-md)' }}>
                <Button variant="secondary" onClick={logout}>
                  Log out
                </Button>
              </div>
            </>
          )}
        </div>
      </section>

      <section className="settings-section">
        <h2>About</h2>
        <div className="settings-info-card">
          <p>Kids Spelling Bee v1.0.0</p>
          <p>A faith-based learning adventure! 💛</p>
        </div>
      </section>
    </div>
  )
}

export default Settings
