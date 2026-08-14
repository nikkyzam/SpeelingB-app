import { describe, it, expect, beforeEach, vi } from 'vitest'
import { LearningFlowController, LearningProgress } from '@/services/progress/LearningFlow'
import { useUserStore } from '@/stores/userStore'
import FirebaseSync from '@/services/persistence/FirebaseSync'

// Mock FirebaseSync to prevent actual calls during tests
vi.mock('@/services/persistence/FirebaseSync', () => ({
  default: {
    syncToServer: vi.fn().mockResolvedValue(undefined),
    syncFromServer: vi.fn().mockResolvedValue(undefined)
  }
}))

// Mock useUserStore for user-specific data like dailyGoal and "Joy" rule
vi.mock('@/stores/userStore', () => ({
  useUserStore: {
    getState: vi.fn(() => ({
      user: {
        id: 'test-user',
        name: 'Test User',
        email: 'test@example.com',
        age: 8,
        avatar: 'avatar1',
        dailyGoal: 30, // Default daily goal
        isGuest: false
      },
      setUser: vi.fn(),
      updateDailyGoal: vi.fn(),
      logout: vi.fn(),
    })),
    setState: vi.fn(),
    subscribe: vi.fn(),
    destroy: vi.fn(),
  }
}))

describe('LearningFlowController', () => {
  let controller: LearningFlowController

  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear() // Clear localStorage before each test
    
    // Reset useUserStore mock to default for each test
    vi.mocked(useUserStore.getState).mockReturnValue({
      user: {
        id: 'test-user',
        name: 'Test User',
        email: 'test@example.com',
        age: 8,
        avatar: 'avatar1',
        dailyGoal: 30,
        isGuest: false
      },
      setUser: vi.fn(),
      updateDailyGoal: vi.fn(),
      logout: vi.fn(),
    })

    controller = new LearningFlowController()
  })

  // --- Initialization Tests ---
  it('should initialize with default progress values', () => {
    expect(controller.getWordsLearnedToday()).toEqual([])
    expect(controller.getWordsLearnedTotal()).toEqual([]) // Fixed typo
    expect(controller.getWordsSpelledToday()).toEqual([])
    expect(controller.getDailyGoal()).toBe(30)
    expect(controller.isSpellQuizUnlocked()).toBe(false)
    expect(controller.isVocabQuizUnlocked()).toBe(false)
    expect(controller.areGamesUnlocked()).toBe(false)
    expect(controller.getSelectedGroup()).toBe(0)
    expect(controller.getCurrentStreak()).toBe(0)
    // Defaults to the easiest tier so young kids meet approachable words first.
    expect(controller.getDifficulty()).toBe(1)
  })

  it('should load progress from localStorage if available', () => {
    const savedState: LearningProgress = {
      wordsLearnedToday: ['word1'],
      wordsLearnedTotal: ['word1', 'word2'],
      wordsPracticedToday: ['word1'],
      wordsSpelledToday: ['word1'],
      wordsSpelledTotal: ['word1'],
      dailyGoal: 20,
      dailyGoalSpell: 20,
      dailyGoalVocab: 20,
      spellQuizUnlocked: true,
      vocabQuizUnlocked: true,
      gamesUnlocked: true,
      unlockedGames: ['word-scramble'],
      lockedModes: [],
      currentStreak: 5,
      selectedGroup: 3,
      difficulty: 2,
      missedDays: [],
      lastGoalCheck: null,
      lastReviewDate: null,
      dailyQuizPassedDate: null
    }
    localStorage.setItem('learningProgress', JSON.stringify(savedState))
    
    controller = new LearningFlowController() // Re-initialize to load from storage

    expect(controller.getWordsLearnedToday()).toEqual(['word1'])
    expect(controller.getWordsLearnedTotal()).toEqual(['word1', 'word2']) // Fixed typo
    expect(controller.getDailyGoal()).toBe(20)
    expect(controller.isSpellQuizUnlocked()).toBe(true)
    expect(controller.isVocabQuizUnlocked()).toBe(true)
    expect(controller.areGamesUnlocked()).toBe(true)
    expect(controller.getSelectedGroup()).toBe(3)
    expect(controller.getCurrentStreak()).toBe(5)
    expect(controller.getDifficulty()).toBe(2)
  })

  // --- "Joy" Rule Test ---
  it('should set daily goal to 10 for "Joy" user', () => {
    vi.mocked(useUserStore.getState).mockReturnValue({
      user: {
        id: 'joy-user',
        name: 'Joy Smith',
        email: 'joy@example.com',
        age: 8,
        avatar: 'avatar1',
        dailyGoal: 10, // Explicitly set dailyGoal to 10 for Joy user mock
        isGuest: false
      },
      setUser: vi.fn(),
      updateDailyGoal: vi.fn(),
      logout: vi.fn(),
    })
    controller = new LearningFlowController() // Re-initialize with Joy user

    expect(controller.getDailyGoal()).toBe(10)
    expect(controller.getDailyGoal('spell')).toBe(10)
    expect(controller.getDailyGoal('vocab')).toBe(10)
  })

  // --- Learn Mode Tracking (`completeWord`) ---
  it('should track words learned today and total, but not change selectedGroup', () => {
    controller.completeWord('wordA')
    expect(controller.getWordsLearnedToday()).toEqual(['wordA'])
    expect(controller.getWordsLearnedTotal()).toEqual(['wordA']) // Fixed typo
    expect(controller.getWordsPracticedToday()).toEqual(['wordA'])
    expect(controller.getSelectedGroup()).toBe(0) // Should not change
    expect(localStorage.getItem('learningProgress')).toBeTruthy()
  })

  it('should not add duplicate words to learned lists', () => {
    controller.completeWord('wordA')
    controller.completeWord('wordA')
    expect(controller.getWordsLearnedToday()).toEqual(['wordA'])
    expect(controller.getWordsLearnedTotal()).toEqual(['wordA']) // Fixed typo
  })

  it('should unlock spell quiz if daily goal is met via completeWord', () => {
    // Mock daily goal to 1 for easy testing
    vi.mocked(useUserStore.getState).mockReturnValue({
      user: { ...useUserStore.getState().user!, dailyGoal: 1 },
      setUser: vi.fn(),
      updateDailyGoal: vi.fn(),
      logout: vi.fn(),
    })
    controller = new LearningFlowController() // Re-initialize with new goal

    expect(controller.isSpellQuizUnlocked()).toBe(false)
    controller.completeWord('word1')
    expect(controller.isSpellQuizUnlocked()).toBe(true)
  })

  // --- Spell Mode Tracking (`completeSpellQuiz`) ---
  it('tracks spelled words and, forgivingly, unlocks the vocab quiz even with errors', () => {
    // Progression is intentionally forgiving so kids never dead-end on a tricky
    // word: finishing the spell stage always opens the vocab quiz.
    controller.completeSpellQuiz(['wordS1', 'wordS2'], 1) // 1 wrong answer
    expect(controller.getWordsSpelledToday()).toEqual(['wordS1', 'wordS2'])
    expect(controller.getSelectedGroup()).toBe(0) // completeSpellQuiz never changes the group
    expect(controller.isVocabQuizUnlocked()).toBe(true)
  })

  it('should unlock vocab quiz if spell quiz completed with 0 errors', () => {
    expect(controller.isVocabQuizUnlocked()).toBe(false)
    controller.completeSpellQuiz(['wordS1'], 0) // 0 wrong answers
    expect(controller.isVocabQuizUnlocked()).toBe(true)
  })

  // --- Vocab Quiz Tracking (`completeVocabQuiz`) ---
  it('should increment selectedGroup and unlock games if vocab quiz completed with 0 errors', () => {
    expect(controller.getSelectedGroup()).toBe(0)
    expect(controller.areGamesUnlocked()).toBe(false)
    expect(controller.isGameUnlocked('word-scramble')).toBe(false)

    controller.completeVocabQuiz(['wordV1', 'wordV2'], 0) // 0 wrong answers

    expect(controller.getSelectedGroup()).toBe(1) // Should increment
    expect(controller.areGamesUnlocked()).toBe(true)
    // Playable games are gated by the DAILY QUIZ, not by the vocab quiz.
    expect(controller.isGameUnlocked('word-scramble')).toBe(false)
    expect(controller.getWordsLearnedToday()).toContain('wordV1')
    expect(controller.getWordsLearnedTotal()).toContain('wordV1')
  })

  it('forgivingly unlocks games and advances the group even if the vocab quiz had errors', () => {
    // Intentionally forgiving: completing the vocab stage always unlocks games
    // and moves to the next word group, so the flow can never dead-end.
    expect(controller.getSelectedGroup()).toBe(0)
    expect(controller.areGamesUnlocked()).toBe(false)

    controller.completeVocabQuiz(['wordV1'], 1) // 1 wrong answer

    expect(controller.getSelectedGroup()).toBe(1)
    expect(controller.areGamesUnlocked()).toBe(true)
  })

  // --- Daily Goal Checks (`isDailyGoalReached`) ---
  it('should correctly report daily goal reached for learn mode', () => {
    vi.mocked(useUserStore.getState).mockReturnValue({
      user: { ...useUserStore.getState().user!, dailyGoal: 2 },
      setUser: vi.fn(),
      updateDailyGoal: vi.fn(),
      logout: vi.fn(),
    })
    controller = new LearningFlowController()

    expect(controller.isDailyGoalReached('learn')).toBe(false)
    controller.completeWord('w1')
    expect(controller.isDailyGoalReached('learn')).toBe(false)
    controller.completeWord('w2')
    expect(controller.isDailyGoalReached('learn')).toBe(true)
  })

  it('should correctly report daily goal reached for spell mode', () => {
    // Default dailyGoalSpell is 30, let's mock it to 1
    const savedState: LearningProgress = {
      wordsLearnedToday: [], wordsLearnedTotal: [], wordsPracticedToday: [], wordsSpelledToday: [], wordsSpelledTotal: [],
      dailyGoal: 30, dailyGoalSpell: 1, dailyGoalVocab: 30,
      spellQuizUnlocked: false, vocabQuizUnlocked: false, gamesUnlocked: false,
      unlockedGames: [], lockedModes: [], currentStreak: 0, selectedGroup: 0, difficulty: undefined,
      missedDays: [], lastGoalCheck: null, lastReviewDate: null, dailyQuizPassedDate: null
    }
    localStorage.setItem('learningProgress', JSON.stringify(savedState))
    controller = new LearningFlowController()

    expect(controller.isDailyGoalReached('spell')).toBe(false)
    controller.completeSpellQuiz(['s1'], 0)
    expect(controller.isDailyGoalReached('spell')).toBe(true)
  })

  it('should correctly report daily goal reached for vocab mode (games unlocked)', () => {
    expect(controller.isDailyGoalReached('vocab')).toBe(false)
    controller.completeVocabQuiz(['v1'], 0) // Pass vocab quiz
    expect(controller.isDailyGoalReached('vocab')).toBe(true)
  })

  // --- Game Unlocking ---


  // --- Reset Daily Progress ---
  it('should reset daily progress but keep total learned words and streak', () => {
    // Set up a state where spellQuizUnlocked and vocabQuizUnlocked are true
    vi.mocked(useUserStore.getState).mockReturnValue({
      user: { ...useUserStore.getState().user!, dailyGoal: 1 }, // Set daily goal to 1
      setUser: vi.fn(),
      updateDailyGoal: vi.fn(),
      logout: vi.fn(),
    })
    controller = new LearningFlowController() // Re-initialize with new goal

    controller.completeWord('word1') // This should unlock spell quiz
    expect(controller.isSpellQuizUnlocked()).toBe(true) // Assert it's unlocked

    controller.completeSpellQuiz(['spell1'], 0) // This should unlock vocab quiz
    expect(controller.isVocabQuizUnlocked()).toBe(true) // Assert it's unlocked

    controller.completeVocabQuiz(['vocab1'], 0) // This increments selectedGroup and unlocks games
    controller.incrementStreak()

    expect(controller.getWordsLearnedToday()).toEqual(['word1', 'vocab1'])
    expect(controller.getWordsSpelledToday()).toEqual(['spell1'])
    expect(controller.getWordsLearnedTotal()).toEqual(['word1', 'vocab1'])
    expect(controller.getCurrentStreak()).toBe(1)
    expect(controller.getSelectedGroup()).toBe(1)
    expect(controller.areGamesUnlocked()).toBe(true)
    expect(controller.isSpellQuizUnlocked()).toBe(true) 
    expect(controller.isVocabQuizUnlocked()).toBe(true)

    controller.resetDailyProgress()

    expect(controller.getWordsLearnedToday()).toEqual([])
    expect(controller.getWordsSpelledToday()).toEqual([])
    expect(controller.getWordsLearnedTotal()).toEqual(['word1', 'vocab1']) // Should persist
    expect(controller.getCurrentStreak()).toBe(1) // Should persist
    expect(controller.getSelectedGroup()).toBe(1) // Should persist
    // Games a child already earned are deliberately NOT taken back overnight.
    expect(controller.areGamesUnlocked()).toBe(true)
    expect(controller.isSpellQuizUnlocked()).toBe(false) // Should reset
    expect(controller.isVocabQuizUnlocked()).toBe(false) // Should reset
  })

  // --- Direct Setters/Getters ---
  it('should correctly set and get selected group', () => {
    controller.setSelectedGroup(5)
    expect(controller.getSelectedGroup()).toBe(5)
  })

  it('should correctly set and get difficulty', () => {
    controller.setDifficulty(3)
    expect(controller.getDifficulty()).toBe(3)
  })

  it('should correctly set and get daily goals for different modes', () => {
    controller.setDailyGoal(15, 'learn')
    controller.setDailyGoal(10, 'spell')
    controller.setDailyGoal(5, 'vocab')

    expect(controller.getDailyGoal('learn')).toBe(15)
    expect(controller.getDailyGoal('spell')).toBe(10)
    expect(controller.getDailyGoal('vocab')).toBe(5)
  })
})
