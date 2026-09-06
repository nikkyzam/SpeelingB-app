import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../contexts/ThemeContext'
import { useUser } from '../../contexts/UserContext'
import Button from '../../components/common/Button'
import WorldPicker from '../../components/theme/WorldPicker'
import WhoIsPlaying from '../../components/profile/WhoIsPlaying'
import AdminUsers from '../../components/admin/AdminUsers'
import PrizeSetter from '../../components/challenge/PrizeSetter'
import './Settings.css'

const Settings: React.FC = () => {
  const { user, logout } = useUser()
  const { world } = useTheme()
  const navigate = useNavigate()

  return (
    <div className="settings">
      <div className="settings-header">
        <h1>Settings ⚙️</h1>
        <p>Make the app feel just right for you!</p>
      </div>

      <section className="settings-section">
        <h2>Who&apos;s Playing? 🧒</h2>
        <p className="settings-sub">
          Choose your name and the face that shows at the top of the screen.
        </p>
        <div className="settings-info-card">
          <WhoIsPlaying />
        </div>
      </section>

      {/* The progress report is for every grown-up, not just admins. */}
      <section className="settings-section">
        <h2>Progress 📈</h2>
        <p className="settings-sub">
          See which words are sticking, which need practice, and how the week has gone.
        </p>
        <Button variant="primary" icon="📈" onClick={() => navigate('/progress')}>
          Open progress report
        </Button>
      </section>

      {/* Any grown-up can put a prize up — it needs no admin rights, because
          it is about this device's children, not about anyone's account. */}
      <section className="settings-section">
        <h2>Sibling Challenge 🏅</h2>
        <p className="settings-sub">
          Put something real on the line for the next head-to-head. The winner is
          recorded here so you know who to give it to.
        </p>
        <div className="settings-info-card">
          <PrizeSetter />
        </div>
      </section>

      {/* Grown-up tools — only visible to admins (Firebase "admin" custom claim). */}
      {user?.isAdmin && (
        <section className="settings-section">
          <h2>Grown-up Tools <span className="admin-badge">Admin</span></h2>
          <p className="settings-sub">
            See how each child is doing, size their daily words, adjust stars, and
            open or restart a day.
          </p>
          <AdminUsers />
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
