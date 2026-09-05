import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { withoutAdminClaim, withAdminClaimDenied } from '../services/auth/adminClaim'

interface User {
  id: string
  name: string
  email?: string
  age: number
  avatar: string
  dailyGoal: number
  isGuest: boolean
  isAdmin?: boolean // set from the Firebase Auth "admin" custom claim
}

interface UserState {
  user: User | null
  setUser: (user: User | null) => void
  updateDailyGoal: (goal: number) => void
  logout: () => void
}

const calculateDailyGoal = (_name: string, _email?: string): number => {
  // Kid-friendly: a short, winnable daily set (see UserContext for rationale).
  return 5
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      // A guest is nobody in particular — naming them after one child meant
      // every family's app greeted them as "Ava" until they signed in.
      user: {
        id: 'guest',
        name: 'Friend',
        age: 6,
        avatar: '🧒',
        dailyGoal: calculateDailyGoal('Friend'),
        isGuest: true
      },
      setUser: (user) => {
        if (user) {
          user.dailyGoal = calculateDailyGoal(user.name, user.email)
        }
        set({ user })
      },
      updateDailyGoal: (goal) =>
        set((state) => ({
          user: state.user ? { ...state.user, dailyGoal: goal } : null
        })),
      logout: () => set({ user: null })
    }),
    {
      name: 'user-storage',
      // The admin claim is read from the signed ID token on every auth state
      // change. It must never be written to localStorage (where a child could
      // set it) nor trusted on the way back out.
      partialize: (state) => ({ ...state, user: withoutAdminClaim(state.user) }),
      merge: (persisted, current) => {
        const saved = (persisted || {}) as Partial<UserState>
        return {
          ...current,
          ...saved,
          user: saved.user ? withAdminClaimDenied(saved.user) : current.user,
        }
      },
    }
  )
)
