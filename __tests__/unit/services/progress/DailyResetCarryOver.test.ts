import { describe, it, expect, beforeEach, vi } from 'vitest'
import DailyResetService from '@/services/progress/DailyReset'

describe('DailyResetService', () => {
  let store: Record<string, string> = {}

  beforeEach(() => {
    store = {}
    vi.stubGlobal('localStorage', {
      getItem: vi.fn((key) => store[key] || null),
      setItem: vi.fn((key, val) => { store[key] = val }),
      clear: vi.fn(() => { store = {} }),
      removeItem: vi.fn((key) => { delete store[key] }),
      key: vi.fn(),
      length: 0
    })
    vi.clearAllMocks()
    window.dispatchEvent = vi.fn()
  })

  it('should carry over missed goals to the next day', () => {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toDateString()
    
    store['lastDailyReset'] = yesterdayStr
    
    const initialProgress = {
      wordsLearnedToday: ['word1'], // 1 out of 10
      wordsSpelledToday: [], // 0 out of 10
      dailyGoal: 10,
      dailyGoalSpell: 10,
      dailyGoalVocab: 10,
      gamesUnlocked: false
    }
    store['learningProgress'] = JSON.stringify(initialProgress)
    
    // Trigger reset
    DailyResetService.initialize()
    
    const updatedProgress = JSON.parse(store['learningProgress'] || '{}')
    
    // Learn goal: 10 - 1 = 9 missed. New goal: 10 + 9 = 19
    expect(updatedProgress.dailyGoal).toBe(19)
    // Spell goal: 10 - 0 = 10 missed. New goal: 10 + 10 = 20
    expect(updatedProgress.dailyGoalSpell).toBe(20)
    // Vocab goal: 10 - 0 = 10 missed. New goal: 10 + 10 = 20
    expect(updatedProgress.dailyGoalVocab).toBe(20)
    
    // Check missed days log
    expect(updatedProgress.missedDays).toContain(yesterdayStr)
    
    // Daily progress should be reset
    expect(updatedProgress.wordsLearnedToday).toEqual([])
    expect(updatedProgress.wordsSpelledToday).toEqual([])
  })

  it('should not increase goal if it was met', () => {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toDateString()
    
    store['lastDailyReset'] = yesterdayStr
    
    const initialProgress = {
      wordsLearnedToday: ['w1', 'w2', 'w3', 'w4', 'w5', 'w6', 'w7', 'w8', 'w9', 'w10'],
      wordsSpelledToday: ['w1', 'w2', 'w3', 'w4', 'w5', 'w6', 'w7', 'w8', 'w9', 'w10'],
      dailyGoal: 10,
      dailyGoalSpell: 10,
      dailyGoalVocab: 10,
      gamesUnlocked: true
    }
    store['learningProgress'] = JSON.stringify(initialProgress)
    
    DailyResetService.initialize()
    
    const updatedProgress = JSON.parse(store['learningProgress'] || '{}')
    
    expect(updatedProgress.dailyGoal).toBe(10)
    expect(updatedProgress.dailyGoalSpell).toBe(10)
    expect(updatedProgress.dailyGoalVocab).toBe(10)
    expect(updatedProgress.missedDays || []).not.toContain(yesterdayStr)
  })
})
