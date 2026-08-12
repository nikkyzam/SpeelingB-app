import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  name: string
  email?: string
  age: number
  avatar: string
  dailyGoal: number
  isGuest: boolean
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
      user: {
        id: 'guest-ava',
        name: 'Ava',
        age: 6,
        avatar: 'ava',
        dailyGoal: calculateDailyGoal('Ava'),
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
      name: 'user-storage'
    }
  )
)
