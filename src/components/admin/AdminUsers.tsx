import React, { useEffect, useState } from 'react'
import { listUsers, setUserDailyGoal, AdminUser } from '../../services/admin/AdminService'
import './AdminUsers.css'

const MIN_GOAL = 3
const MAX_GOAL = 20

/** Admin-only panel: lists every user and lets a grown-up set each daily goal. */
const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [savingUid, setSavingUid] = useState<string | null>(null)
  const [savedUid, setSavedUid] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      setUsers(await listUsers())
    } catch (e: any) {
      setError(e?.message || 'Could not load users.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const changeGoal = async (uid: string, nextGoal: number) => {
    const goal = Math.min(MAX_GOAL, Math.max(MIN_GOAL, nextGoal))
    const prev = users
    // Optimistic update so the stepper feels instant.
    setUsers((list) => list.map((u) => (u.uid === uid ? { ...u, dailyGoal: goal } : u)))
    setSavingUid(uid)
    setSavedUid(null)
    try {
      await setUserDailyGoal(uid, goal)
      setSavedUid(uid)
      setTimeout(() => setSavedUid((s) => (s === uid ? null : s)), 1500)
    } catch (e: any) {
      setUsers(prev) // roll back on failure
      setError(e?.message || 'Could not save. Please try again.')
    } finally {
      setSavingUid((s) => (s === uid ? null : s))
    }
  }

  if (loading) {
    return <div className="admin-users__state">Loading users…</div>
  }

  if (error) {
    return (
      <div className="admin-users__state admin-users__error">
        {error}
        <button className="admin-users__retry" onClick={load}>Try again</button>
      </div>
    )
  }

  if (users.length === 0) {
    return (
      <div className="admin-users__state">
        No users yet. Once children sign up and start playing, they&apos;ll appear here.
      </div>
    )
  }

  return (
    <div className="admin-users">
      <div className="admin-users__head">
        <span>{users.length} {users.length === 1 ? 'user' : 'users'}</span>
        <button className="admin-users__refresh" onClick={load} aria-label="Refresh">↻ Refresh</button>
      </div>

      <ul className="admin-users__list">
        {users.map((u) => (
          <li key={u.uid} className="admin-users__row">
            <div className="admin-users__who">
              <span className="admin-users__name">
                {u.name}
                {u.isAdmin && <span className="admin-users__tag">admin</span>}
              </span>
              {u.email && <span className="admin-users__email">{u.email}</span>}
            </div>

            <div className="admin-users__control">
              <span className="admin-users__label">daily words</span>
              <div className="admin-users__stepper">
                <button
                  aria-label={`Fewer words for ${u.name}`}
                  onClick={() => changeGoal(u.uid, u.dailyGoal - 1)}
                  disabled={u.dailyGoal <= MIN_GOAL || savingUid === u.uid}
                >−</button>
                <span className="admin-users__value">{u.dailyGoal}</span>
                <button
                  aria-label={`More words for ${u.name}`}
                  onClick={() => changeGoal(u.uid, u.dailyGoal + 1)}
                  disabled={u.dailyGoal >= MAX_GOAL || savingUid === u.uid}
                >+</button>
              </div>
              <span className="admin-users__status">
                {savingUid === u.uid ? 'saving…' : savedUid === u.uid ? 'saved ✓' : ''}
              </span>
            </div>
          </li>
        ))}
      </ul>

      <p className="admin-users__note">
        Changes take effect the next time that child logs in.
      </p>
    </div>
  )
}

export default AdminUsers
