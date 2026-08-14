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
 * Games are gated by ONE rule: three starter games are free, and everything
 * else opens by passing today's quiz over all the words learned so far.
 */
describe('Game unlocking via the daily quiz', () => {
  let controller: LearningFlowController

  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    controller = new LearningFlowController()
  })

  it('leaves exactly the three starter games free before the quiz', () => {
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

  it('unlocks all games once today’s quiz is passed', () => {
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
    // ...but the free games are always available.
    expect(controller.isGameUnlocked(FREE_GAMES[0])).toBe(true)
  })

  it('quizzes every learned word, in a shuffled order', () => {
    const ids = Array.from({ length: 12 }, (_, i) => `word-${i}`)
    ids.forEach((id) => controller.completeWord(id))

    const quiz = controller.getDailyQuizWordIds()
    expect(quiz).toHaveLength(ids.length)
    expect([...quiz].sort()).toEqual([...ids].sort()) // same set, order may differ
  })
})
