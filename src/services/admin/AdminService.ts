import { collection, getDocs, doc, updateDoc, deleteField } from 'firebase/firestore'
import { db } from '../../config/firebase'

/** Word difficulty tier: 1 = One Bee (easiest), 2 = Two Bee, undefined = All Words. */
export type WordLevel = 1 | 2 | undefined

export interface AdminUser {
  uid: string
  name: string
  email?: string
  dailyGoal: number
  level: WordLevel
  isAdmin?: boolean
}

/**
 * Load every user profile. Only admins can do this — Firestore rules deny the
 * collection read to everyone else (see firestore.rules).
 */
export async function listUsers(): Promise<AdminUser[]> {
  const snap = await getDocs(collection(db, 'users'))
  return snap.docs
    .map((d) => {
      const data = d.data() as any
      const ud = data.userData || {}
      const goal = ud.dailyGoal ?? data.progress?.dailyGoal ?? 5
      const diff = data.progress?.difficulty
      return {
        uid: d.id,
        name: ud.name || 'Explorer',
        email: ud.email,
        dailyGoal: typeof goal === 'number' ? goal : 5,
        level: (diff === 1 || diff === 2 ? diff : undefined) as WordLevel,
        isAdmin: !!ud.isAdmin,
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
}
