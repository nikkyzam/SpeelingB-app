import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  LearningFlowController,
  FREE_GAMES,
  setWordsLeftCounter,
  type WordsLeftCounter,
} from '@/services/progress/LearningFlow'
import DailyResetService from '@/services/progress/DailyReset'

vi.mock('@/stores/userStore', () => ({
  useUserStore: {
    getState: vi.fn(() => ({ user: { id: 'test-user', name: 'Test User', dailyGoal: 5 } })),
  },
}))

vi.mock('@/services/persistence/FirebaseSync', () => ({
  default: { syncToServer: vi.fn().mockResolvedValue(undefined) },
}))

/**
 * A pretend level of six words. Words are grouped by the daily goal (5), so
 * its second and last group is one word long — the same shape as Three Bee's
 * 211 words, whose last group is a single word.
 */
const LEVEL = ['w1', 'w2', 'w3', 'w4', 'w5', 'w6']
const countLeft: WordsLeftCounter = (_levels, learned) => LEVEL.filter((id) => !learned.includes(id)).length

/** Yesterday's five words, learned and rolled over into today. */
const afterFirstGroup = () => {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  localStorage.setItem(
    'learningProgress',
    JSON.stringify({
      wordsLearnedToday: [],
      wordsLearnedTotal: ['w1', 'w2', 'w3', 'w4', 'w5'],
      dailyGoal: 5,
      wordLevels: [3],
    })
  )
}

describe('the end of a word list', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    setWordsLeftCounter(countLeft)
  })
  afterEach(() => setWordsLeftCounter(null))

  it('asks only for the words that are left, and counts the day done when they are met', () => {
    afterFirstGroup()
    const flow = new LearningFlowController()
    expect(flow.getLearnGoalToday()).toBe(1)
    expect(flow.isDailyGoalReached('learn')).toBe(false)

    flow.completeWord('w6')
    // Five new words were never there to meet. The one that was is enough.
    expect(flow.isDailyGoalReached('learn')).toBe(true)
    FREE_GAMES.forEach((id) => expect(flow.isGameUnlocked(id)).toBe(true))
    expect(flow.isLevelFinished()).toBe(true)
  })

  it('treats a finished level as today’s words done, not as a goal of five', () => {
    afterFirstGroup()
    const flow = new LearningFlowController()
    flow.completeWord('w6')
    // The next day there is nothing new at all to meet.
    const fresh = new LearningFlowController()
    fresh.refreshProgress()
    expect(fresh.isLevelFinished()).toBe(true)
  })

  it('does not count an unreachable goal as a missed day, or grow it', () => {
    // Yesterday: the last word of the list met, the goal of five out of reach.
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    localStorage.setItem('lastDailyReset', yesterday.toDateString())
    localStorage.setItem(
      'learningProgress',
      JSON.stringify({
        wordsLearnedToday: ['w6'],
        wordsLearnedTotal: LEVEL,
        wordsSpelledToday: ['w6', 'w1', 'w2', 'w3', 'w4'],
        dailyGoal: 5,
        dailyGoalSpell: 5,
        dailyGoalVocab: 5,
        gamesUnlocked: true,
        wordLevels: [3],
      })
    )

    DailyResetService.initialize()

    const saved = JSON.parse(localStorage.getItem('learningProgress')!)
    expect(saved.dailyGoal).toBe(5)
    expect(saved.missedDays ?? []).toEqual([])
  })

  it('leaves goals alone when the app has not said how to count words', () => {
    setWordsLeftCounter(null)
    afterFirstGroup()
    const flow = new LearningFlowController()
    expect(flow.getLearnGoalToday()).toBe(5)
    expect(flow.isLevelFinished()).toBe(false)
  })
})
