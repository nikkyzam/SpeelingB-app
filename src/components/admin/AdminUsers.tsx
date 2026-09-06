import React, { useEffect, useState } from 'react'
import {
  listUsers,
  setUserDailyGoal,
  setUserLevel,
  setUserStars,
  resetToday,
  setGamesUnlockedToday,
  getAdminLog,
  exportUserData,
  deleteUserAccount,
  currentAdminUid,
  AdminUser,
  AdminLogEntry,
  WordLevel,
} from '../../services/admin/AdminService'
import './AdminUsers.css'

const MIN_GOAL = 3
const MAX_GOAL = 20
const MAX_STARS = 99999

const LEVELS: { value: WordLevel; label: string }[] = [
  { value: 1, label: '🐝 One Bee' },
  { value: 2, label: '🐝🐝 Two Bee' },
  { value: undefined, label: '🌟 All Words' },
]

const sameLevel = (a: WordLevel, b: WordLevel) => a === b

/**
 * Does the typed confirmation match the child's name?
 *
 * Deliberately forgiving about capitals and stray spaces. Requiring an exact
 * match meant a grown-up typing "ava" for a child called "Ava" got a dead
 * button and no explanation — the confirmation is there to make you stop and
 * think, not to test your typing.
 */
const confirms = (typed: string, name: string) =>
  typed.trim().toLowerCase() === name.trim().toLowerCase()

/** "yesterday", "3 days ago" — a parent doesn't want a timestamp. */
const lastSeenLabel = (iso?: string): string => {
  if (!iso) return 'not synced yet'
  const then = new Date(iso).getTime()
  if (Number.isNaN(then)) return 'not synced yet'
  const days = Math.floor((Date.now() - then) / 86400000)
  if (days <= 0) return 'today'
  if (days === 1) return 'yesterday'
  if (days < 7) return `${days} days ago`
  if (days < 14) return 'last week'
  return `${Math.floor(days / 7)} weeks ago`
}

/**
 * The grown-up console.
 *
 * Everything a parent needs to run the app for their children in one place:
 * see how each one is doing, size the daily work to the child, correct a star
 * balance, and open or reset a day. Edits to settings are drafted and saved
 * together; the day controls act immediately because that is what they are for.
 */
const AdminUsers: React.FC = () => {
  const [original, setOriginal] = useState<AdminUser[]>([]) // last-saved snapshot
  const [draft, setDraft] = useState<AdminUser[]>([]) // in-progress edits
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [savedAt, setSavedAt] = useState(false)
  const [busyUid, setBusyUid] = useState('') // a day action is running
  const [confirmReset, setConfirmReset] = useState('')
  const [openLog, setOpenLog] = useState('')
  const [removing, setRemoving] = useState('') // uid whose removal panel is open
  const [typedName, setTypedName] = useState('')
  const [log, setLog] = useState<AdminLogEntry[]>([])
  const [logLoading, setLogLoading] = useState(false)

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
    return (
      !o ||
      o.dailyGoal !== u.dailyGoal ||
      !sameLevel(o.level, u.level) ||
      o.stats.stars !== u.stats.stars
    )
  }
  const dirtyCount = draft.filter(isDirty).length

  const edit = (uid: string, patch: Partial<AdminUser>) => {
    setSavedAt(false)
    setDraft((list) => list.map((u) => (u.uid === uid ? { ...u, ...patch } : u)))
  }
  const editGoal = (uid: string, next: number) =>
    edit(uid, { dailyGoal: Math.min(MAX_GOAL, Math.max(MIN_GOAL, next)) })
  const editLevel = (uid: string, level: WordLevel) => edit(uid, { level })
  const editStars = (uid: string, next: number) => {
    const u = draft.find((x) => x.uid === uid)
    if (!u) return
    const stars = Math.min(MAX_STARS, Math.max(0, Math.round(next || 0)))
    edit(uid, { stats: { ...u.stats, stars } })
  }

  const discard = () => {
    setDraft(original.map((u) => ({ ...u })))
    setError('')
    setSavedAt(false)
  }

  const saveAll = async () => {
    setSaving(true)
    setError('')
    try {
      for (const u of draft.filter(isDirty)) {
        const o = orig(u.uid)
        if (!o || o.dailyGoal !== u.dailyGoal) await setUserDailyGoal(u.uid, u.dailyGoal)
        if (!o || !sameLevel(o.level, u.level)) await setUserLevel(u.uid, u.level)
        if (!o || o.stats.stars !== u.stats.stars) {
          const from = o ? o.stats.stars : 0
          const dir = u.stats.stars >= from ? 'added' : 'removed'
          await setUserStars(
            u.uid,
            u.stats.stars,
            u.stats.starsSpent,
            `${dir} ${Math.abs(u.stats.stars - from)} — balance now ${u.stats.stars}`
          )
        }
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

  /** Day controls write straight through — they exist to take effect now. */
  const runDayAction = async (uid: string, fn: () => Promise<void>, patch: Partial<AdminUser['stats']>) => {
    setBusyUid(uid)
    setError('')
    try {
      await fn()
      const apply = (list: AdminUser[]) =>
        list.map((u) => (u.uid === uid ? { ...u, stats: { ...u.stats, ...patch } } : u))
      setDraft(apply)
      setOriginal(apply)
    } catch (e: any) {
      setError(e?.message || 'That did not go through. Please try again.')
    } finally {
      setBusyUid('')
      setConfirmReset('')
    }
  }

  /** Hand the grown-up a copy of everything before it goes. */
  const download = async (u: AdminUser) => {
    setError('')
    try {
      const data = await exportUserData(u.uid)
      const url = URL.createObjectURL(
        new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      )
      const a = document.createElement('a')
      a.href = url
      a.download = `${u.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-spelling-bee.json`
      a.click()
      URL.revokeObjectURL(url)
    } catch (e: any) {
      setError(e?.message || 'Could not download a copy.')
    }
  }

  const remove = async (u: AdminUser) => {
    setBusyUid(u.uid)
    setError('')
    try {
      await deleteUserAccount(u.uid)
      setDraft((list) => list.filter((x) => x.uid !== u.uid))
      setOriginal((list) => list.filter((x) => x.uid !== u.uid))
      setRemoving('')
      setTypedName('')
    } catch (e: any) {
      setError(e?.message || 'Could not remove that child.')
    } finally {
      setBusyUid('')
    }
  }

  const toggleLog = async (uid: string) => {
    if (openLog === uid) {
      setOpenLog('')
      return
    }
    setOpenLog(uid)
    setLog([])
    setLogLoading(true)
    try {
      setLog(await getAdminLog(uid))
    } catch {
      setLog([])
    } finally {
      setLogLoading(false)
    }
  }

  if (loading) return <div className="admin-users__state">Loading children…</div>
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
        No children yet. Once they sign up and start playing, they&apos;ll appear here.
      </div>
    )
  }

  return (
    <div className="admin-users">
      <div className="admin-users__head">
        <span>{draft.length} {draft.length === 1 ? 'child' : 'children'}</span>
        <button className="admin-users__refresh" onClick={load} disabled={saving || !!busyUid}>↻ Refresh</button>
      </div>

      <ul className="admin-users__list">
        {draft.map((u) => {
          const dirty = isDirty(u)
          const busy = busyUid === u.uid
          const s = u.stats
          const goalMet = s.spelledToday >= u.dailyGoal

          return (
            <li key={u.uid} className={`admin-users__row ${dirty ? 'is-dirty' : ''}`}>
              <div className="admin-users__who">
                <span className="admin-users__avatar" aria-hidden>{u.avatar || '🧒'}</span>
                <span className="admin-users__ident">
                  <span className="admin-users__name">
                    {u.name}
                    {u.isAdmin && <span className="admin-users__tag">admin</span>}
                    {dirty && <span className="admin-users__dot" title="Unsaved change">●</span>}
                  </span>
                  {u.email && <span className="admin-users__email">{u.email}</span>}
                  <span className="admin-users__seen">Last played {lastSeenLabel(s.lastSeen)}</span>
                </span>
              </div>

              {/* How the child is actually doing, before you change anything. */}
              <div className="admin-users__stats">
                <div className="admin-users__stat">
                  <span className="admin-users__statnum">{s.wordsLearned}</span>
                  <span className="admin-users__statlabel">learnt</span>
                </div>
                <div className="admin-users__stat">
                  <span className="admin-users__statnum">{s.wordsSpelled}</span>
                  <span className="admin-users__statlabel">spelled</span>
                </div>
                <div className="admin-users__stat">
                  <span className="admin-users__statnum">🔥 {s.streak}</span>
                  <span className="admin-users__statlabel">streak</span>
                </div>
                <div className={`admin-users__stat ${goalMet ? 'is-met' : ''}`}>
                  <span className="admin-users__statnum">{s.spelledToday}/{u.dailyGoal}</span>
                  <span className="admin-users__statlabel">today</span>
                </div>
              </div>

              <div className="admin-users__controls">
                <label className="admin-users__field">
                  <span className="admin-users__label">level</span>
                  <select
                    className="admin-users__select"
                    value={u.level === undefined ? 'all' : String(u.level)}
                    disabled={saving || busy}
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
                    <button aria-label={`Fewer words for ${u.name}`} onClick={() => editGoal(u.uid, u.dailyGoal - 1)} disabled={u.dailyGoal <= MIN_GOAL || saving || busy}>−</button>
                    <span className="admin-users__value">{u.dailyGoal}</span>
                    <button aria-label={`More words for ${u.name}`} onClick={() => editGoal(u.uid, u.dailyGoal + 1)} disabled={u.dailyGoal >= MAX_GOAL || saving || busy}>+</button>
                  </div>
                </div>

                <label className="admin-users__field">
                  <span className="admin-users__label">stars ⭐</span>
                  <input
                    className="admin-users__stars"
                    type="number"
                    min={0}
                    max={MAX_STARS}
                    step={5}
                    value={s.stars}
                    disabled={saving || busy}
                    aria-label={`Star balance for ${u.name}`}
                    onChange={(e) => editStars(u.uid, Number(e.target.value))}
                  />
                </label>
              </div>

              {/* Today's controls act at once — that's the point of them. */}
              <div className="admin-users__actions">
                <button
                  className={`admin-users__action ${s.gamesUnlockedToday ? 'is-on' : ''}`}
                  disabled={busy || saving}
                  onClick={() =>
                    runDayAction(
                      u.uid,
                      () => setGamesUnlockedToday(u.uid, !s.gamesUnlockedToday),
                      { gamesUnlockedToday: !s.gamesUnlockedToday }
                    )
                  }
                >
                  {s.gamesUnlockedToday ? '🎮 Games open today' : '🔒 Open games today'}
                </button>

                <button
                  className={`admin-users__action ${confirmReset === u.uid ? 'is-danger' : ''}`}
                  disabled={busy || saving}
                  onClick={() => {
                    if (confirmReset !== u.uid) {
                      setConfirmReset(u.uid)
                      return
                    }
                    runDayAction(u.uid, () => resetToday(u.uid), {
                      learnedToday: 0,
                      spelledToday: 0,
                      gamesUnlockedToday: false,
                    })
                  }}
                >
                  {confirmReset === u.uid ? `Reset ${u.name}'s day — tap to confirm` : '↺ Start today again'}
                </button>

                <button className="admin-users__link" onClick={() => toggleLog(u.uid)}>
                  {openLog === u.uid ? 'Hide changes' : 'Recent changes'}
                </button>
              </div>

              <div className="admin-users__danger">
                {removing === u.uid ? (
                  <div className="admin-users__remove">
                    <p className="admin-users__removewarn">
                      This erases everything {u.name} has learnt — words, stars,
                      badges and streak — and signs them out on every device.
                      <strong> It cannot be undone.</strong>
                    </p>
                    <button className="admin-users__action" onClick={() => download(u)} disabled={busy}>
                      ⬇ Download a copy first
                    </button>
                    <label className="admin-users__field">
                      <span className="admin-users__label">type “{u.name}” to confirm</span>
                      <input
                        className="admin-users__confirm"
                        value={typedName}
                        disabled={busy}
                        autoComplete="off"
                        aria-label={`Type ${u.name} to confirm removal`}
                        onChange={(e) => setTypedName(e.target.value)}
                      />
                    </label>
                    {typedName.trim().length > 0 && !confirms(typedName, u.name) && (
                      <p className="admin-users__removehint">
                        That doesn&apos;t match — type <strong>{u.name}</strong> to turn the button on.
                      </p>
                    )}
                    <div className="admin-users__removeactions">
                      <button
                        className="admin-users__discard"
                        disabled={busy}
                        onClick={() => { setRemoving(''); setTypedName('') }}
                      >
                        Keep {u.name}
                      </button>
                      <button
                        className="admin-users__remove-go"
                        disabled={busy || !confirms(typedName, u.name)}
                        onClick={() => remove(u)}
                      >
                        {busy ? 'Removing…' : `Remove ${u.name} for good`}
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    className="admin-users__link admin-users__link--danger"
                    disabled={saving || busy || u.uid === currentAdminUid()}
                    title={u.uid === currentAdminUid() ? 'You cannot remove your own account here' : undefined}
                    onClick={() => { setRemoving(u.uid); setTypedName('') }}
                  >
                    Remove {u.name}…
                  </button>
                )}
              </div>

              {openLog === u.uid && (
                <div className="admin-users__log">
                  {logLoading && <p className="admin-users__logempty">Loading…</p>}
                  {!logLoading && log.length === 0 && (
                    <p className="admin-users__logempty">Nothing changed yet.</p>
                  )}
                  {!logLoading && log.map((e, i) => (
                    <p key={`${e.at}-${i}`} className="admin-users__logline">
                      <span className="admin-users__logwhen">{new Date(e.at).toLocaleDateString()}</span>
                      <strong>{e.action}</strong> — {e.detail}
                      <span className="admin-users__logwho"> by {e.by}</span>
                    </p>
                  ))}
                </div>
              )}
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

      <p className="admin-users__note">
        Level, daily words and stars take effect the next time that child signs in.
        Today&apos;s controls apply straight away.
      </p>
    </div>
  )
}

export default AdminUsers
