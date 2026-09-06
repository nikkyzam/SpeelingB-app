import { describe, it, expect, beforeEach, vi } from 'vitest'
import { LearningFlowController, FREE_GAMES } from '@/services/progress/LearningFlow'

vi.mock('@/stores/userStore', () => ({
  useUserStore: {
    getState: vi.fn(() => ({
      user: { id: 'test-user', name: 'Test User', dailyGoal: 5 }
    }))
  }
}))

vi.mock('@/services/persistence/FirebaseSync', () => ({
  default: { syncToServer: vi.fn().mockResolvedValue(undefined) }
}))

/**
 * Games are gated by learning, in two steps: the three starter games open once
 * today's new words have been met, and everything else needs today's quiz
 * passed AND whatever is waiting to be reviewed cleared.
 *
 * The review half is the point — spaced repetition used to be optional, so a
 * child could unlock forty games without ever revisiting a word they got wrong.
 */
describe('Game unlocking via the daily quiz', () => {
  let controller: LearningFlowController

  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    controller = new LearningFlowController()
  })

  /** Meet today's words, which is what opens the starter games. */
  const learnTodaysWords = () => {
    const goal = controller.getDailyGoal('learn')
    for (let i = 0; i < goal; i++) controller.completeWord(`today-${i}`)
  }

  it('keeps even the starter games shut until today’s words are met', () => {
    FREE_GAMES.forEach((id) => {
      expect(controller.isGameUnlocked(id)).toBe(false)
    })

    learnTodaysWords()

    FREE_GAMES.forEach((id) => {
      expect(controller.isGameUnlocked(id)).toBe(true)
    })
  })

  it('keeps every other game locked until the quiz is passed', () => {
    const gated = ['word-search', 'ghost-word', 'secret-code', 'mystery-picture', 'typo-detective', 'word-chef']
    gated.forEach((id) => {
      expect(controller.isGameUnlocked(id)).toBe(false)
    })
    expect(controller.isDailyQuizPassed()).toBe(false)
  })

  it('unlocks all games once today’s quiz is passed and review is clear', () => {
    controller.passDailyQuiz()

    expect(controller.isDailyQuizPassed()).toBe(true)
    expect(controller.areGamesUnlocked()).toBe(true)
    ;['word-search', 'ghost-word', 'secret-code', 'bible-trivia'].forEach((id) => {
      expect(controller.isGameUnlocked(id)).toBe(true)
    })
  })

  it('re-locks the games on a new day (the quiz is daily)', () => {
    controller.passDailyQuiz()
    expect(controller.isGameUnlocked('ghost-word')).toBe(true)

    // Simulate the pass having happened yesterday.
    const progress = JSON.parse(localStorage.getItem('learningProgress') || '{}')
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    progress.dailyQuizPassedDate = yesterday.toDateString()
    localStorage.setItem('learningProgress', JSON.stringify(progress))
    controller.refreshProgress()

    expect(controller.isDailyQuizPassed()).toBe(false)
    expect(controller.isGameUnlocked('ghost-word')).toBe(false)
    // ...and the starter games are shut again too, until today's words are met.
    expect(controller.isGameUnlocked(FREE_GAMES[0])).toBe(false)
    learnTodaysWords()
    expect(controller.isGameUnlocked(FREE_GAMES[0])).toBe(true)
  })

  it('holds the games shut while words are waiting to be reviewed', () => {
    // Enough history for the periodic review sweep to come due.
    for (let i = 0; i < 30; i++) controller.completeWord(`old-${i}`)
    controller.passDailyQuiz()

    expect(controller.isReviewWaiting()).toBe(true)
    expect(controller.isReviewSatisfiedToday()).toBe(false)
    expect(controller.gamesLockedReason()).toBe('review')
    expect(controller.isGameUnlocked('ghost-word')).toBe(false)

    // One review session is all it asks for — not every due word.
    controller.markReviewDone()

    expect(controller.isReviewSatisfiedToday()).toBe(true)
    expect(controller.gamesLockedReason()).toBeNull()
    expect(controller.isGameUnlocked('ghost-word')).toBe(true)
  })

  it('does not ask for a review when there is nothing to review', () => {
    controller.passDailyQuiz()
    // A brand-new child has no history, so nothing is due and the quiz is enough.
    expect(controller.isReviewWaiting()).toBe(false)
    expect(controller.isReviewSatisfiedToday()).toBe(true)
    expect(controller.isGameUnlocked('ghost-word')).toBe(true)
  })

  it('asks again once the review interval comes round', () => {
    for (let i = 0; i < 30; i++) controller.completeWord(`old-${i}`)
    controller.passDailyQuiz()
    controller.markReviewDone()
    expect(controller.isReviewSatisfiedToday()).toBe(true)

    // A review done yesterday still counts today — nothing is due yet, and
    // demanding one every single day would be nagging, not spacing.
    const progress = JSON.parse(localStorage.getItem('learningProgress') || '{}')
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    progress.lastReviewDate = yesterday.toISOString()
    localStorage.setItem('learningProgress', JSON.stringify(progress))
    controller.refreshProgress()
    expect(controller.isReviewWaiting()).toBe(false)
    expect(controller.isReviewSatisfiedToday()).toBe(true)

    // Once the interval has passed, it asks again.
    const longAgo = new Date()
    longAgo.setDate(longAgo.getDate() - 5)
    progress.lastReviewDate = longAgo.toISOString()
    localStorage.setItem('learningProgress', JSON.stringify(progress))
    controller.refreshProgress()
    expect(controller.isReviewWaiting()).toBe(true)
    expect(controller.isReviewSatisfiedToday()).toBe(false)
  })

  it('quizzes every learned word, in a shuffled order', () => {
    const ids = Array.from({ length: 12 }, (_, i) => `word-${i}`)
    ids.forEach((id) => controller.completeWord(id))

    const quiz = controller.getDailyQuizWordIds()
    expect(quiz).toHaveLength(ids.length)
    expect([...quiz].sort()).toEqual([...ids].sort()) // same set, order may differ
  })
})
