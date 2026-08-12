import { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import { useLocalStorage } from './useLocalStorage'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastLogin: string | null
  totalLogins: number
}

export const useStreak = () => {
  const [streakData, setStreakData] = useLocalStorage<StreakData>('streak', {
    currentStreak: 0,
    longestStreak: 0,
    lastLogin: null,
    totalLogins: 0
  })

  const [todaysStars, setTodaysStars] = useState(0)

  const updateStreak = () => {
    const today = dayjs().format('YYYY-MM-DD')
    const yesterday = dayjs().subtract(1, 'day').format('YYYY-MM-DD')

    let newCurrentStreak = streakData.currentStreak
    let newTotalLogins = streakData.totalLogins

    if (streakData.lastLogin === today) {
      // Already logged in today
      return
    }

    if (streakData.lastLogin === yesterday) {
      // Consecutive day
      newCurrentStreak += 1
    } else if (streakData.lastLogin && streakData.lastLogin !== today) {
      // Streak broken
      newCurrentStreak = 1
    } else {
      // First login or same day
      newCurrentStreak = Math.max(1, newCurrentStreak)
    }

    newTotalLogins += 1

    const newStreakData = {
      currentStreak: newCurrentStreak,
      longestStreak: Math.max(newCurrentStreak, streakData.longestStreak),
      lastLogin: today,
      totalLogins: newTotalLogins
    }

    setStreakData(newStreakData)

    // Calculate today's stars based on streak
    const streakBonus = Math.min(newCurrentStreak * 5, 25) // Max 25 bonus
    const dailyStars = 10 + streakBonus
    setTodaysStars(dailyStars)

    return dailyStars
  }

  const getStreakReward = () => {
    const baseReward = 10
    const streakBonus = Math.min(streakData.currentStreak * 5, 25)
    return baseReward + streakBonus
  }

  const resetStreak = () => {
    setStreakData({
      currentStreak: 0,
      longestStreak: streakData.longestStreak,
      lastLogin: null,
      totalLogins: streakData.totalLogins
    })
    setTodaysStars(0)
  }

  return {
    streakData,
    todaysStars,
    updateStreak,
    getStreakReward,
    resetStreak
  }
}
