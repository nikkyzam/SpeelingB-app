import React, { useEffect, useState } from 'react'
import { listUsers, setUserDailyGoal, setUserLevel, AdminUser, WordLevel } from '../../services/admin/AdminService'
import './AdminUsers.css'

const MIN_GOAL = 3
const MAX_GOAL = 20

const LEVELS: { value: WordLevel; label: string }[] = [
  { value: 1, label: '🐝 One Bee' },
  { value: 2, label: '🐝🐝 Two Bee' },
  { value: undefined, label: '🌟 All Words' },
]

const sameLevel = (a: WordLevel, b: WordLevel) => a === b

/** Admin-only panel: edit each user's level & daily goal, then Save all changes. */
const AdminUsers: React.FC = () => {
  const [original, setOriginal] = useState<AdminUser[]>([]) // last-saved snapshot
  const [draft, setDraft] = useState<AdminUser[]>([]) // in-progress edits
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [savedAt, setSavedAt] = useState(false)

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const list = await listUsers()
      setOriginal(list)
      setDraft(list.map((u) => ({ ...u })))
    } catch (e: any) {
      setError(e?.message || 'Could not load users.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const orig = (uid: string) => original.find((u) => u.uid === uid)
  const isDirty = (u: AdminUser) => {
    const o = orig(u.uid)
    return !o || o.dailyGoal !== u.dailyGoal || !sameLevel(o.level, u.level)
  }
  const dirtyCount = draft.filter(isDirty).length

  const edit = (uid: string, patch: Partial<AdminUser>) => {
    setSavedAt(false)
    setDraft((list) => list.map((u) => (u.uid === uid ? { ...u, ...patch } : u)))
  }
  const editGoal = (uid: string, next: number) =>
    edit(uid, { dailyGoal: Math.min(MAX_GOAL, Math.max(MIN_GOAL, next)) })
  const editLevel = (uid: string, level: WordLevel) => edit(uid, { level })

  const discard = () => {
    setDraft(original.map((u) => ({ ...u })))
    setError('')
    setSavedAt(false)
  }

  const saveAll = async () => {
    setSaving(true)
    setError('')
    try {
      const changed = draft.filter(isDirty)
      for (const u of changed) {
        const o = orig(u.uid)
        if (!o || o.dailyGoal !== u.dailyGoal) await setUserDailyGoal(u.uid, u.dailyGoal)
        if (!o || !sameLevel(o.level, u.level)) await setUserLevel(u.uid, u.level)
      }
      setOriginal(draft.map((u) => ({ ...u }))) // new saved baseline
      setSavedAt(true)
      setTimeout(() => setSavedAt(false), 2500)
    } catch (e: any) {
      setError(e?.message || 'Could not save all changes. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="admin-users__state">Loading users…</div>
  if (error && draft.length === 0) {
    return (
      <div className="admin-users__state admin-users__error">
        {error}
        <button className="admin-users__retry" onClick={load}>Try again</button>
      </div>
    )
  }
  if (draft.length === 0) {
    return (
      <div className="admin-users__state">
        No users yet. Once children sign up and start playing, they&apos;ll appear here.
      </div>
    )
  }

  return (
    <div className="admin-users">
      <div className="admin-users__head">
        <span>{draft.length} {draft.length === 1 ? 'user' : 'users'}</span>
        <button className="admin-users__refresh" onClick={load} disabled={saving}>↻ Refresh</button>
      </div>

      <ul className="admin-users__list">
        {draft.map((u) => {
          const dirty = isDirty(u)
          return (
            <li key={u.uid} className={`admin-users__row ${dirty ? 'is-dirty' : ''}`}>
              <div className="admin-users__who">
                <span className="admin-users__name">
                  {u.name}
                  {u.isAdmin && <span className="admin-users__tag">admin</span>}
                  {dirty && <span className="admin-users__dot" title="Unsaved change">●</span>}
                </span>
                {u.email && <span className="admin-users__email">{u.email}</span>}
              </div>

              <div className="admin-users__controls">
                <label className="admin-users__field">
                  <span className="admin-users__label">level</span>
                  <select
                    className="admin-users__select"
                    value={u.level === undefined ? 'all' : String(u.level)}
                    disabled={saving}
                    onChange={(e) =>
                      editLevel(u.uid, e.target.value === 'all' ? undefined : (Number(e.target.value) as WordLevel))
                    }
                  >
                    {LEVELS.map((l) => (
                      <option key={l.label} value={l.value === undefined ? 'all' : String(l.value)}>
                        {l.label}
                      </option>
                    ))}
                  </select>
                </label>

                <div className="admin-users__field">
                  <span className="admin-users__label">daily words</span>
                  <div className="admin-users__stepper">
                    <button aria-label={`Fewer words for ${u.name}`} onClick={() => editGoal(u.uid, u.dailyGoal - 1)} disabled={u.dailyGoal <= MIN_GOAL || saving}>−</button>
                    <span className="admin-users__value">{u.dailyGoal}</span>
                    <button aria-label={`More words for ${u.name}`} onClick={() => editGoal(u.uid, u.dailyGoal + 1)} disabled={u.dailyGoal >= MAX_GOAL || saving}>+</button>
                  </div>
                </div>
              </div>
            </li>
          )
        })}
      </ul>

      {error && <div className="admin-users__savebar-error">{error}</div>}

      <div className="admin-users__savebar">
        <span className="admin-users__savemsg">
          {saving ? 'Saving…' : savedAt ? 'All changes saved ✓' : dirtyCount > 0 ? `${dirtyCount} unsaved change${dirtyCount === 1 ? '' : 's'}` : 'No changes to save'}
        </span>
        <div className="admin-users__saveactions">
          <button className="admin-users__discard" onClick={discard} disabled={saving || dirtyCount === 0}>Discard</button>
          <button className="admin-users__save" onClick={saveAll} disabled={saving || dirtyCount === 0}>
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </div>

      <p className="admin-users__note">Saved changes take effect the next time that child logs in.</p>
    </div>
  )
}

export default AdminUsers
