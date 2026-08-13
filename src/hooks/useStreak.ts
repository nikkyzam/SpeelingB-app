import { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import { useLocalStorage } from './useLocalStorage'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastLogin: string | null
  totalLogins: number
  /** Date a "streak freeze" was last spent to forgive a missed day. */
  lastFreezeUsed?: string | null
}

/** A freeze can only be spent once per this many days, so the streak still
 *  means something while a single busy day never wipes it out. */
const FREEZE_COOLDOWN_DAYS = 7

export const useStreak = () => {
  const [streakData, setStreakData] = useLocalStorage<StreakData>('streak', {
    currentStreak: 0,
    longestStreak: 0,
    lastLogin: null,
    totalLogins: 0,
    lastFreezeUsed: null
  })

  const [todaysStars, setTodaysStars] = useState(0)
  /** True when this visit's missed day was forgiven — lets the UI celebrate it. */
  const [freezeUsed, setFreezeUsed] = useState(false)

  const updateStreak = () => {
    const today = dayjs().format('YYYY-MM-DD')

    let newCurrentStreak = streakData.currentStreak
    let newTotalLogins = streakData.totalLogins
    let newLastFreeze = streakData.lastFreezeUsed ?? null
    let usedFreezeNow = false

    if (streakData.lastLogin === today) {
      // Already logged in today
      return
    }

    // Whole days since the last visit (1 = came back the very next day).
    const daysAway = streakData.lastLogin
      ? dayjs(today).diff(dayjs(streakData.lastLogin), 'day')
      : null

    if (daysAway === 1) {
      // Consecutive day
      newCurrentStreak += 1
    } else if (daysAway === 2 && newCurrentStreak > 0) {
      // Missed exactly ONE day. Losing a long streak over a single busy day is
      // crushing for a child, so we forgive it with a "streak freeze" — but
      // only once per cooldown, so the streak still means something.
      const freezeAvailable =
        !newLastFreeze || dayjs(today).diff(dayjs(newLastFreeze), 'day') >= FREEZE_COOLDOWN_DAYS

      if (freezeAvailable) {
        newCurrentStreak += 1
        newLastFreeze = today
        usedFreezeNow = true
      } else {
        newCurrentStreak = 1
      }
    } else if (daysAway !== null) {
      // Away too long — start a fresh streak
      newCurrentStreak = 1
    } else {
      // First ever login
      newCurrentStreak = Math.max(1, newCurrentStreak)
    }

    newTotalLogins += 1
    setFreezeUsed(usedFreezeNow)

    const newStreakData = {
      currentStreak: newCurrentStreak,
      longestStreak: Math.max(newCurrentStreak, streakData.longestStreak),
      lastLogin: today,
      totalLogins: newTotalLogins,
      lastFreezeUsed: newLastFreeze
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
      totalLogins: streakData.totalLogins,
      lastFreezeUsed: streakData.lastFreezeUsed ?? null
    })
    setTodaysStars(0)
    setFreezeUsed(false)
  }

  return {
    streakData,
    todaysStars,
    freezeUsed,
    updateStreak,
    getStreakReward,
    resetStreak
  }
}
