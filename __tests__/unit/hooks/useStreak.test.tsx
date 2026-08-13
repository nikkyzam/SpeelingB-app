import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import dayjs from 'dayjs'
import { useStreak } from '@/hooks/useStreak'

/** Seed the persisted streak as if the child last played `daysAgo` days ago. */
const seedStreak = (daysAgo: number, currentStreak: number, lastFreezeUsed: string | null = null) => {
  localStorage.setItem(
    'streak',
    JSON.stringify({
      currentStreak,
      longestStreak: currentStreak,
      lastLogin: dayjs().subtract(daysAgo, 'day').format('YYYY-MM-DD'),
      totalLogins: currentStreak,
      lastFreezeUsed,
    })
  )
}

describe('useStreak', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('increments the streak when the child returns the next day', () => {
    seedStreak(1, 5)
    const { result } = renderHook(() => useStreak())
    act(() => { result.current.updateStreak() })
    expect(result.current.streakData.currentStreak).toBe(6)
    expect(result.current.freezeUsed).toBe(false)
  })

  it('forgives a single missed day instead of wiping the streak', () => {
    // Missed exactly one day (last played 2 days ago) with no freeze on record.
    seedStreak(2, 12)
    const { result } = renderHook(() => useStreak())
    act(() => { result.current.updateStreak() })

    // A busy Saturday should not destroy a 12-day streak.
    expect(result.current.streakData.currentStreak).toBe(13)
    expect(result.current.freezeUsed).toBe(true)
  })

  it('does not forgive twice within the cooldown', () => {
    // Missed a day again, but a freeze was already spent yesterday.
    seedStreak(2, 12, dayjs().subtract(1, 'day').format('YYYY-MM-DD'))
    const { result } = renderHook(() => useStreak())
    act(() => { result.current.updateStreak() })

    expect(result.current.streakData.currentStreak).toBe(1)
    expect(result.current.freezeUsed).toBe(false)
  })

  it('starts a fresh streak after a long absence', () => {
    seedStreak(6, 20)
    const { result } = renderHook(() => useStreak())
    act(() => { result.current.updateStreak() })
    expect(result.current.streakData.currentStreak).toBe(1)
    expect(result.current.freezeUsed).toBe(false)
  })

  it('keeps the longest streak as a personal best', () => {
    seedStreak(6, 20)
    const { result } = renderHook(() => useStreak())
    act(() => { result.current.updateStreak() })
    expect(result.current.streakData.longestStreak).toBe(20)
  })
})
