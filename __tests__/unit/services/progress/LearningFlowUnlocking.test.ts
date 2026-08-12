import { describe, it, expect, beforeEach, vi } from 'vitest'
import { LearningFlowController } from '@/services/progress/LearningFlow'
import { useUserStore } from '@/stores/userStore'

vi.mock('@/stores/userStore', () => ({
  useUserStore: {
    getState: vi.fn(() => ({
      user: { id: 'test-user', name: 'Test User', dailyGoal: 30 }
    }))
  }
}))

// Mock FirebaseSync
vi.mock('@/services/persistence/FirebaseSync', () => ({
  default: {
    syncToServer: vi.fn().mockResolvedValue(undefined)
  }
}))

describe('LearningFlowController Sequential Unlocking', () => {
  let controller: LearningFlowController

  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    controller = new LearningFlowController()
  })

  it('should unlock the next game when a game is completed', () => {
    // 1. Initially, games are NOT unlocked generally
    expect(controller.areGamesUnlocked()).toBe(false)
    expect(controller.isGameUnlocked('word-scramble')).toBe(false)

    // 2. Unlock games generally (simulating vocab quiz completion)
    // We need to call completeVocabQuiz with a successful result
    controller.completeVocabQuiz(['word1'], 0)
    expect(controller.areGamesUnlocked()).toBe(true)

    // 3. 'word-scramble' should be unlocked by default when games are generally unlocked
    // as it's the first non-default game
    expect(controller.isGameUnlocked('word-scramble')).toBe(true)
    
    // Check if group advanced
    expect(controller.getSelectedGroup()).toBe(1)

    // 4. Complete a game that triggers the next unlock
    // Complete 'word-scramble' to unlock 'spell-sprint' (based on the order in LearningFlow.ts)
    const nextGame = controller.unlockNextGame('word-scramble')
    expect(nextGame).toBe('spell-sprint')
    expect(controller.isGameUnlocked('spell-sprint')).toBe(true)

    // 5. Complete 'spell-sprint' to unlock 'shape-catcher'
    const nextGame2 = controller.unlockNextGame('spell-sprint')
    expect(nextGame2).toBe('shape-catcher')
    expect(controller.isGameUnlocked('shape-catcher')).toBe(true)
  })

  it('should not unlock the same game twice', () => {
    controller.completeVocabQuiz(['word1'], 0)
    
    controller.unlockNextGame('balloon-pop') // Unlocks word-scramble
    const nextGame = controller.unlockNextGame('balloon-pop') // Try again
    
    expect(nextGame).toBeNull()
  })

  it('should return true for default unlocked games even if games are not generally unlocked', () => {
    expect(controller.isGameUnlocked('bonus')).toBe(true)
    expect(controller.isGameUnlocked('bible-trivia')).toBe(true)
  })

  it('should return false for non-default games if games are not generally unlocked even if they are in unlockedGames list', () => {
    // Force inject an unlocked game into localStorage
    const progress = JSON.parse(localStorage.getItem('learningProgress') || '{}')
    progress.unlockedGames = ['word-scramble']
    localStorage.setItem('learningProgress', JSON.stringify(progress))
    
    controller.refreshProgress()
    
    expect(controller.areGamesUnlocked()).toBe(false)
    expect(controller.isGameUnlocked('word-scramble')).toBe(false)
    
    // Now unlock generally
    controller.completeVocabQuiz(['word1'], 0)
    expect(controller.isGameUnlocked('word-scramble')).toBe(true)
  })
})
