import { collection, getDocs, getDoc, doc, updateDoc, deleteField, arrayUnion } from 'firebase/firestore'
import { db, auth } from '../../config/firebase'

/** Word difficulty tier: 1 = One Bee (easiest), 2 = Two Bee, undefined = All Words. */
export type WordLevel = 1 | 2 | undefined

/** Read-only numbers a grown-up wants at a glance before changing anything. */
export interface AdminUserStats {
  wordsLearned: number
  wordsSpelled: number
  learnedToday: number
  spelledToday: number
  streak: number
  stars: number
  /** Stars already spent on rewards — kept so the totals stay coherent. */
  starsSpent: number
  /** True when today's quiz has been passed, so every game is open. */
  gamesUnlockedToday: boolean
  /** ISO timestamp of the last sync from that child's device. */
  lastSeen?: string
}

export interface AdminUser {
  uid: string
  name: string
  email?: string
  avatar?: string
  dailyGoal: number
  level: WordLevel
  isAdmin?: boolean
  stats: AdminUserStats
}

/** One line in the grown-up-visible audit trail kept on each child's document. */
export interface AdminLogEntry {
  at: string
  by: string
  action: string
  detail: string
}

const count = (v: unknown): number => (Array.isArray(v) ? v.length : 0)

/** The date string the app itself uses to decide "is this still today?". */
const today = () => new Date().toDateString()

/**
 * Record what a grown-up did, on the child's own document.
 *
 * Stars buy real-world rewards, so an unexplained jump in a balance should be
 * answerable. Every write below leaves a line here.
 */
const log = async (uid: string, action: string, detail: string): Promise<void> => {
  const entry: AdminLogEntry = {
    at: new Date().toISOString(),
    by: auth.currentUser?.email || auth.currentUser?.uid || 'a grown-up',
    action,
    detail,
  }
  await updateDoc(doc(db, 'users', uid), { adminLog: arrayUnion(entry) })
}

/**
 * Load every user profile. Only admins can do this — Firestore rules deny the
 * collection read to everyone else (see firestore.rules).
 */
export async function listUsers(): Promise<AdminUser[]> {
  const snap = await getDocs(collection(db, 'users'))
  return snap.docs
    .filter((d) => !(d.data() as any)?.deleted) // removed children are gone from the list
    .map((d) => {
      const data = d.data() as any
      const ud = data.userData || {}
      const p = data.progress || {}
      const pts = data.points || {}
      const goal = ud.dailyGoal ?? p.dailyGoal ?? 5
      const diff = p.difficulty

      return {
        uid: d.id,
        name: ud.name || 'Explorer',
        email: ud.email,
        avatar: ud.avatar,
        dailyGoal: typeof goal === 'number' ? goal : 5,
        level: (diff === 1 || diff === 2 ? diff : undefined) as WordLevel,
        isAdmin: !!ud.isAdmin,
        stats: {
          wordsLearned: count(p.wordsLearnedTotal),
          wordsSpelled: count(p.wordsSpelledTotal),
          learnedToday: count(p.wordsLearnedToday),
          spelledToday: count(p.wordsSpelledToday),
          streak: typeof p.currentStreak === 'number' ? p.currentStreak : 0,
          stars: typeof pts.availablePoints === 'number' ? pts.availablePoints : 0,
          starsSpent: typeof pts.spentPoints === 'number' ? pts.spentPoints : 0,
          gamesUnlockedToday: p.dailyQuizPassedDate === today(),
          lastSeen: typeof data.lastUpdated === 'string' ? data.lastUpdated : undefined,
        },
      }
    })
    .sort((a, b) => a.name.localeCompare(b.name))
}

/**
 * Set a user's daily goal. Written to userData.dailyGoal AND the progress goals
 * so it takes effect the next time that child logs in / syncs (the learning
 * flow's group size reads progress.dailyGoal).
 */
export async function setUserDailyGoal(uid: string, goal: number): Promise<void> {
  await updateDoc(doc(db, 'users', uid), {
    'userData.dailyGoal': goal,
    'progress.dailyGoal': goal,
    'progress.dailyGoalSpell': goal,
    'progress.dailyGoalVocab': goal,
  })
  await log(uid, 'daily words', `set to ${goal} a day`)
}

/**
 * Set which word level (difficulty tier) a user starts from. Changing the level
 * resets them to the first group of that level. undefined = "All Words".
 */
export async function setUserLevel(uid: string, level: WordLevel): Promise<void> {
  await updateDoc(doc(db, 'users', uid), {
    // Firestore can't store `undefined`; remove the field for "All Words".
    'progress.difficulty': level === undefined ? deleteField() : level,
    'progress.selectedGroup': 0,
  })
  const name = level === 1 ? 'One Bee' : level === 2 ? 'Two Bee' : 'All Words'
  await log(uid, 'word level', `moved to ${name} (back to the first group)`)
}

/**
 * Set a child's star balance.
 *
 * Stars are spent on real rewards, so the totals are kept coherent rather than
 * just overwriting one number: total always equals what's left plus what's
 * already been spent.
 */
export async function setUserStars(uid: string, stars: number, spent: number, reason: string): Promise<void> {
  const safe = Math.max(0, Math.round(stars))
  await updateDoc(doc(db, 'users', uid), {
    'points.availablePoints': safe,
    'points.totalPoints': safe + Math.max(0, spent),
  })
  await log(uid, 'stars', reason)
}

/**
 * Clear today's learning so a child can start the day again — after a session
 * that went wrong, or one a sibling did on their account by mistake.
 * Everything they have learned before today is untouched.
 */
export async function resetToday(uid: string): Promise<void> {
  await updateDoc(doc(db, 'users', uid), {
    'progress.wordsLearnedToday': [],
    'progress.wordsSpelledToday': [],
    'progress.wordsPracticedToday': [],
    'progress.dailyQuizPassedDate': null,
    'progress.gamesUnlocked': false,
  })
  await log(uid, 'reset today', "cleared today's words, quiz and game unlock")
}

/**
 * Open every game for the rest of today without the quiz — for a long car
 * journey, or a day when the learning is going to happen later.
 *
 * Uses the grown-up's date, which is what the child's device compares against;
 * on the same device (or the same timezone) that is the same day.
 */
export async function setGamesUnlockedToday(uid: string, unlocked: boolean): Promise<void> {
  await updateDoc(doc(db, 'users', uid), {
    'progress.dailyQuizPassedDate': unlocked ? today() : null,
    'progress.gamesUnlocked': unlocked,
  })
  await log(uid, 'games', unlocked ? 'unlocked for today' : 'locked again until the quiz is passed')
}

/** The most recent grown-up actions on a child, newest first. */
export async function getAdminLog(uid: string, limit = 20): Promise<AdminLogEntry[]> {
  const snap = await getDoc(doc(db, 'users', uid))
  const entries = ((snap.data() as any)?.adminLog || []) as AdminLogEntry[]
  return [...entries].sort((a, b) => (a.at < b.at ? 1 : -1)).slice(0, limit)
}

/** The signed-in grown-up — used to stop an admin removing themselves. */
export const currentAdminUid = (): string | undefined => auth.currentUser?.uid

/**
 * Everything stored about one child, for the grown-up to keep before removing
 * them. A learning history is months of a child's work; it should be possible
 * to take a copy of it away.
 */
export async function exportUserData(uid: string): Promise<Record<string, unknown>> {
  const snap = await getDoc(doc(db, 'users', uid))
  if (!snap.exists()) throw new Error('That child has no saved data.')
  return { uid, exportedAt: new Date().toISOString(), ...(snap.data() as object) }
}

/**
 * Remove a child: erase everything the app stores about them and lock the
 * account out.
 *
 * The document is replaced by a tombstone rather than deleted outright, for two
 * reasons. A device that is still signed in would otherwise re-upload its local
 * copy on the next sync and quietly resurrect the child; and signing in again
 * would silently create a fresh blank account. `FirebaseSync` sees the
 * tombstone, wipes that device and signs them out.
 *
 * This cannot remove their Firebase Auth login — the browser SDK can only
 * delete the account it is signed in as. Run `scripts/delete-user.mjs` to take
 * the login away for good.
 */
export async function deleteUserAccount(uid: string): Promise<void> {
  if (uid === auth.currentUser?.uid) {
    throw new Error('You cannot remove your own account from here.')
  }
  await updateDoc(doc(db, 'users', uid), {
    deleted: true,
    deletedAt: new Date().toISOString(),
    deletedBy: auth.currentUser?.email || auth.currentUser?.uid || 'a grown-up',
    // The data itself goes. What remains is the record that it was removed.
    progress: deleteField(),
    userData: deleteField(),
    rewards: deleteField(),
    points: deleteField(),
    adminLog: deleteField(),
  })
}
