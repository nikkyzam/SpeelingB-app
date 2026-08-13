import React from 'react'
import { useTheme } from '../../contexts/ThemeContext'
import { useUser } from '../../contexts/UserContext'
import Button from '../../components/common/Button'
import WorldPicker from '../../components/theme/WorldPicker'
import AdminUsers from '../../components/admin/AdminUsers'
import './Settings.css'

const Settings: React.FC = () => {
  const { user, logout } = useUser()
  const { world } = useTheme()

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
          <p className="settings-sub">
            Set how many new words each child learns per group before spelling &amp; games unlock.
          </p>
          <div className="settings-info-card">
            <AdminUsers />
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
