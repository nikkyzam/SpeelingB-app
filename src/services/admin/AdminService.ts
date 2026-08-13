import { collection, getDocs, doc, updateDoc } from 'firebase/firestore'
import { db } from '../../config/firebase'

export interface AdminUser {
  uid: string
  name: string
  email?: string
  dailyGoal: number
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
      return {
        uid: d.id,
        name: ud.name || 'Explorer',
        email: ud.email,
        dailyGoal: typeof goal === 'number' ? goal : 5,
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
