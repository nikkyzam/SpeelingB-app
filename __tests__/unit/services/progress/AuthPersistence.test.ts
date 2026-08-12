import { describe, it, expect, beforeEach, vi } from 'vitest'
import { LearningFlowController } from '@/services/progress/LearningFlow'
import { AuthService } from '@/services/auth/AuthService'
import { useUserStore } from '@/stores/userStore'

// Mock Firebase
vi.mock('@/config/firebase', () => ({
  auth: {
    currentUser: { uid: 'test-user', email: 'test@example.com' },
    signOut: vi.fn().mockResolvedValue(undefined)
  },
  db: {}
}))

vi.mock('firebase/auth', () => ({
  signOut: vi.fn().mockResolvedValue(undefined),
  onAuthStateChanged: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  createUserWithEmailAndPassword: vi.fn()
}))

// Mock FirebaseSync
vi.mock('@/services/persistence/FirebaseSync', () => ({
  default: {
    syncToServer: vi.fn().mockResolvedValue(undefined),
    syncFromServer: vi.fn().mockResolvedValue(undefined)
  }
}))

describe('Persistence after Logout and Login', () => {
  let controller: LearningFlowController

  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    // Reset UserStore
    useUserStore.getState().setUser({
      id: 'test-user',
      name: 'Test User',
      email: 'test@example.com',
      age: 6,
      avatar: 'ava',
      dailyGoal: 30,
      isGuest: false
    })
    controller = new LearningFlowController()
    
    // Mock window.location.href to avoid actual navigation
    // @ts-ignore
    delete window.location
    // @ts-ignore
    window.location = { href: '', reload: vi.fn() }
  })

  it('should clear progress from localStorage on logout', async () => {
    // 1. Set some progress
    controller.setSelectedGroup(5)
    controller.completeVocabQuiz(['word1'], 0) // Unlocks games and advances group
    
    expect(controller.getSelectedGroup()).toBe(6)
    expect(controller.areGamesUnlocked()).toBe(true)
    expect(localStorage.getItem('learningProgress')).toBeTruthy()

    // 2. Perform Logout
    await AuthService.logout()

    // 3. Verify localStorage is cleared for progress
    // Some environments return undefined, some return null for missing keys
    const progress = localStorage.getItem('learningProgress')
    expect(progress === null || progress === undefined).toBe(true)
    
    const userStorage = localStorage.getItem('user-storage')
    expect(userStorage === null || userStorage === undefined).toBe(true)
    
    expect(useUserStore.getState().user).toBeNull()
  })

  it('should restore progress when progress is set back to localStorage (simulating login/sync)', async () => {
    // This test simulates the flow where after login, FirebaseSync restores the data
    
    const savedProgress = {
      selectedGroup: 10,
      gamesUnlocked: true,
      unlockedGames: ['word-scramble', 'spell-sprint'],
      wordsLearnedTotal: ['word1', 'word2'],
      // Add other properties that LearningFlowController expects to be present
      wordsLearnedToday: [],
      wordsPracticedToday: [],
      wordsSpelledToday: [],
      dailyGoal: 30,
      dailyGoalSpell: 30,
      dailyGoalVocab: 30,
      spellQuizUnlocked: true, // Assuming it's unlocked in this saved state
      vocabQuizUnlocked: true, // Assuming it's unlocked in this saved state
      currentStreak: 5,
      difficulty: undefined,
      missedDays: [],
      lastGoalCheck: null,
      lockedModes: []
    }

    // Simulate login and sync from server
    localStorage.setItem('learningProgress', JSON.stringify(savedProgress))
    
    // Create new controller instance to load from localStorage
    const restoredController = new LearningFlowController()

    expect(restoredController.getSelectedGroup()).toBe(10)
    expect(restoredController.areGamesUnlocked()).toBe(true)
    expect(restoredController.isGameUnlocked('spell-sprint')).toBe(true)
    expect(restoredController.getWordsLearnedTotal()).toEqual(['word1', 'word2']) // Use toEqual for array comparison
  })

  it('should keep progress in localStorage if NOT logged out (sanity check)', () => {
    controller.setSelectedGroup(3)
    
    // Create a new controller instance (simulates page reload without logout)
    const newController = new LearningFlowController()
    expect(newController.getSelectedGroup()).toBe(3)
  })
})
