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
import GrownUpGate from '../../components/common/GrownUpGate'
import ComfortControls from '../../components/common/ComfortControls'
import FamilyRewardsEditor from '../../components/rewards/FamilyRewardsEditor'
import { usePreferences } from '../../hooks/usePreferences'
import { useProgress } from '../../contexts/ProgressContext'

const Settings: React.FC = () => {
  const { user, logout } = useUser()
  const { world } = useTheme()
  const navigate = useNavigate()
  const [preferences, setPreferences] = usePreferences()
  const { learningFlow } = useProgress()

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

      <section className="settings-section"><h2>Sound and pace</h2><ComfortControls /></section>
      <section className="settings-section">
        <h2>For grown-ups</h2><p>Learning stage, family rewards, and accounts live here.</p>
        <GrownUpGate>
          <label>Learning stage<select value={preferences.stage} onChange={e => {
            const stage = e.target.value as typeof preferences.stage
            // Each stage learns from its own list; keep each one's place.
            learningFlow.switchStage(preferences.stage, stage)
            setPreferences({ stage })
          }}>
            <option value="early">Early reader — fewer choices and short words</option>
            <option value="growing">Growing reader — the regular adventure</option>
            <option value="confident">Confident reader — all subjects and details</option>
          </select></label>
          <p>You can change this as your child grows. Age alone does not decide their level.</p>
          <Button onClick={() => navigate('/progress')}>See learning progress</Button>
          <FamilyRewardsEditor />
          <section><h3>Sibling prizes</h3><p>Choose only a prize you have agreed to give. Team Relay lets children work together without a prize.</p><PrizeSetter /></section>
          {user?.isAdmin && <section><h3>Manage learners</h3><AdminUsers /></section>}
          <section><h3>Account</h3><p>{user?.isGuest ? 'Guest progress stays in this browser. Use Save progress on Home to set up a grown-up account.' : `Signed in as ${user?.email || 'your family'}. Progress is saved to your account.`}</p>
            {!user?.isGuest && <Button variant="secondary" onClick={logout}>Log out</Button>}
          </section>
        </GrownUpGate>
      </section>

      <section className="settings-section">
        <h2>Your World {world.mascot}</h2>
        <p className="settings-sub">
          You&apos;re exploring <strong>{world.name}</strong>. Tap another world to switch!
        </p>
        <WorldPicker showTitle={false} />
      </section>

      <section className="settings-section">
        <h2>About</h2>
        <div className="settings-info-card">
          <p>BrightHive v1.0.0</p>
          <p>A faith-based learning adventure! 💛</p>
        </div>
      </section>
    </div>
  )
}

export default Settings
