import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useProgressStore } from '../../stores/progressStore'
import { useUserStore } from '../../stores/userStore'

import AuthService from '../../services/auth/AuthService'
import { auth } from '../../config/firebase'

interface User {
  id: string
  name: string
  email?: string
  age: number
  avatar: string
  dailyGoal: number
  isGuest: boolean
  isAdmin?: boolean // from the Firebase Auth "admin" custom claim
}

interface UserContextType {
  user: User | null
  setUser: (user: User | null) => void
  updateDailyGoal: (goal: number) => void
  logout: () => void
}

const calculateDailyGoal = (_name: string, _email?: string): number => {
  // Kid-friendly: a short, winnable set of words per day so the whole
  // learn -> spell -> quiz -> games flow can be completed in one sitting.
  return 5
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within UserProvider')
  }
  return context
}

interface UserProviderProps {
  children: ReactNode
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const { setDailyGoal } = useProgressStore()
  const { user: storeUser, setUser: setStoreUser, logout: storeLogout } = useUserStore()
  
  const [user, setUserState] = useState<User | null>(() => {
    // Migrate ONLY the old oversized default (goal of 30) down to the kid-sized
    // target. Any smaller value is a deliberate choice (e.g. a grown-up set it),
    // so it is preserved.
    const normalizeGoal = (u: User): User => {
      const legacyOversized = !u.dailyGoal || u.dailyGoal > 20
      return legacyOversized ? { ...u, dailyGoal: calculateDailyGoal(u.name, u.email) } : u
    }

    // Priority 1: User Store (Zustand/Persist)
    if (storeUser) {
      return normalizeGoal(storeUser)
    }

    // Priority 2: Local Storage (Legacy)
    const saved = localStorage.getItem('user')
    if (saved) {
      return normalizeGoal(JSON.parse(saved))
    }

    // Default guest user (Ava)
    const defaultName = 'Ava'
    return {
      id: 'guest-ava',
      name: defaultName,
      age: 6,
      avatar: 'ava',
      dailyGoal: calculateDailyGoal(defaultName),
      isGuest: true
    }
  })

  // Synchronize state with store changes
  useEffect(() => {
    if (storeUser && JSON.stringify(storeUser) !== JSON.stringify(user)) {
      setUserState(storeUser)
    }
  }, [storeUser])

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user))
      setDailyGoal(user.dailyGoal)
      
      // Update store if different
      if (JSON.stringify(user) !== JSON.stringify(storeUser)) {
        setStoreUser(user)
      }
    } else {
      localStorage.removeItem('user')
      if (storeUser) {
        storeLogout()
      }
    }
  }, [user, setDailyGoal, setStoreUser, storeLogout])

  const setUser = (newUser: User | null) => {
    if (newUser && (!newUser.dailyGoal || newUser.isGuest)) {
      newUser.dailyGoal = calculateDailyGoal(newUser.name, newUser.email)
    }
    setUserState(newUser)
  }

  const updateDailyGoal = (goal: number) => {
    if (user) {
      setUserState({ ...user, dailyGoal: goal })
    }
  }

  const logout = async () => {
    try {
      await AuthService.logout()
    } catch (error) {
      console.error('Error during logout:', error)
      // Fallback in case AuthService.logout fails
      setUserState(null)
      localStorage.clear()
      window.location.href = '/'
    }
  }

  return (
    <UserContext.Provider value={{ user, setUser, updateDailyGoal, logout }}>
      {children}
    </UserContext.Provider>
  )
}
