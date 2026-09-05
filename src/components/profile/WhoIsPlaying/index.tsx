import React, { useState } from 'react'
import { useUser } from '../../../contexts/UserContext'
import AuthService from '../../../services/auth/AuthService'
import sfx from '../../games/shared/sfx'
import './WhoIsPlaying.css'

/** Faces and friends to choose from. Deliberately wide: children pick an avatar
 *  that feels like them, and two options was never going to cover that. */
export const AVATARS = [
  '🧒', '👦', '👧', '🧑', '👶',
  '🦸', '🦸‍♀️', '🧙', '🧚', '🤴',
  '👸', '🥷', '🤖', '👽', '🐝',
  '🦊', '🐯', '🐼', '🐨', '🦁',
  '🐶', '🐱', '🐰', '🦄', '🐲',
  '🐧', '🦉', '🐙', '🦕', '🌟',
]

const MAX_NAME = 16

/**
 * Who is playing: their name and the face they picked.
 *
 * Both used to be fixed — every install greeted the child as "Ava" with the
 * same 👧, because the guest defaults were one real child's name and the header
 * chose between exactly two faces. A child should be able to say who they are.
 */
const WhoIsPlaying: React.FC = () => {
  const { user, setUser } = useUser()

  const [name, setName] = useState(user?.name || '')
  const [avatar, setAvatar] = useState(user?.avatar && user.avatar !== 'ava' ? user.avatar : '🧒')
  const [saved, setSaved] = useState(false)
  const [busy, setBusy] = useState(false)

  if (!user) return null

  const trimmed = name.trim()
  const dirty = trimmed !== user.name || avatar !== user.avatar
  const canSave = dirty && trimmed.length > 0 && !busy

  const save = async () => {
    if (!canSave) return
    setBusy(true)
    try {
      setUser({ ...user, name: trimmed, avatar })
      // Signed in? Put the name on the account too, or the next login would
      // read the old display name straight back out of Firebase.
      if (!user.isGuest) {
        await AuthService.updateDisplayName(trimmed)
      }
      sfx.correct()
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } finally {
      setBusy(false)
    }
  }

  const pick = (choice: string) => {
    setAvatar(choice)
    setSaved(false)
    sfx.tap()
  }

  return (
    <div className="who-playing">
      <div className="wp-preview">
        <span className="wp-preview-avatar" aria-hidden>{avatar}</span>
        <span className="wp-preview-name">{trimmed || 'Your name'}</span>
      </div>

      <label className="wp-field">
        <span className="wp-label">My name</span>
        <input
          className="wp-input"
          value={name}
          onChange={(e) => { setName(e.target.value.slice(0, MAX_NAME)); setSaved(false) }}
          onKeyPress={(e) => e.key === 'Enter' && save()}
          placeholder="Type your name"
          maxLength={MAX_NAME}
          aria-label="Your name"
        />
      </label>

      <span className="wp-label">Pick your face</span>
      <div className="wp-avatars" role="radiogroup" aria-label="Choose an avatar">
        {AVATARS.map((choice) => (
          <button
            key={choice}
            role="radio"
            aria-checked={avatar === choice}
            aria-label={`Avatar ${choice}`}
            className={`wp-avatar ${avatar === choice ? 'chosen' : ''}`}
            onClick={() => pick(choice)}
          >
            {choice}
          </button>
        ))}
      </div>

      <div className="wp-actions">
        <button className="wp-save" onClick={save} disabled={!canSave}>
          {busy ? 'Saving…' : saved ? 'Saved ✓' : 'Save'}
        </button>
        {user.isGuest && (
          <span className="wp-note">Sign in to keep this on any device.</span>
        )}
      </div>
    </div>
  )
}

export default WhoIsPlaying
