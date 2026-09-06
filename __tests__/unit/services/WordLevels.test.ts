import { describe, it, expect, beforeEach, vi } from 'vitest'
import { wordBank } from '@/services/wordBank'
import { LearningFlowController } from '@/services/progress/LearningFlow'

vi.mock('@/stores/userStore', () => ({
  useUserStore: { getState: vi.fn(() => ({ user: { id: 'u', name: 'Test', dailyGoal: 5 } })) },
}))
vi.mock('@/services/persistence/FirebaseSync', () => ({
  default: { syncToServer: vi.fn().mockResolvedValue(undefined) },
}))

const levelsOf = (words: { difficulty: number }[]) => [...new Set(words.map((w) => w.difficulty))].sort()
/** Words in a Bee level, which is not the same as words of that difficulty:
 *  seasonal words are graded but are not part of the Bee lists. */
const levelSize = (level: number) =>
  wordBank.availableLevels().find((l) => l.level === level)?.count ?? 0

describe('choosing which Bee levels a child learns from', () => {
  it('reports only the levels that actually have words', () => {
    const available = wordBank.availableLevels()
    expect(available.map((l) => l.level)).toEqual([1, 2])
    // Three Bee ships empty, so nothing should offer it as a real choice —
    // not even the eight seasonal words that happen to be graded as hard.
    expect(available.find((l) => l.level === 3)).toBeUndefined()
    available.forEach((l) => expect(l.count).toBeGreaterThan(0))
  })

  it('an empty choice means every word', () => {
    expect(wordBank.getWordsForLevels([]).length).toBe(wordBank.getAllWords().length)
  })

  it('one level gives exactly that level', () => {
    const one = wordBank.getWordsForLevels([1])
    expect(levelsOf(one)).toEqual([1])
    expect(one.length).toBe(levelSize(1))
    // Seasonal words are graded too, so a level must be smaller than its difficulty.
    expect(one.length).toBeLessThan(wordBank.getWordsByDifficulty(1).length)
  })

  it('a blend contains both levels and loses nothing', () => {
    const mixed = wordBank.getWordsForLevels([1, 2])
    expect(levelsOf(mixed)).toEqual([1, 2])
    expect(mixed.length).toBe(levelSize(1) + levelSize(2))
    expect(new Set(mixed.map((w) => w.id)).size).toBe(mixed.length) // no duplicates
  })

  it('a blend is interleaved, not one level then the other', () => {
    const mixed = wordBank.getWordsForLevels([1, 2])
    // The point of a mix: the first groups a child sees contain both levels.
    // Concatenating would put ~1,455 One Bee words before the first Two Bee one.
    const firstGroup = mixed.slice(0, 10)
    expect(levelsOf(firstGroup)).toEqual([1, 2])

    // And it stays mixed all the way through, not just at the start.
    const lastGroup = mixed.slice(-10)
    expect(levelsOf(lastGroup)).toEqual([1, 2])
  })

  it('is stable, so a saved group number keeps its meaning', () => {
    const a = wordBank.getWordsForLevels([1, 2]).slice(0, 30).map((w) => w.id)
    const b = wordBank.getWordsForLevels([2, 1]).slice(0, 30).map((w) => w.id)
    expect(a).toEqual(b) // order of the request must not matter
  })

  it('falls back to everything rather than leaving a child with nothing', () => {
    // Three Bee has no Bee words at all; a child must never get an empty set.
    expect(wordBank.getWordsForLevels([3]).length).toBe(wordBank.getAllWords().length)
  })

  it('ignores nonsense levels', () => {
    expect(wordBank.getWordsForLevels([1, 1, 9 as never]).length).toBe(levelSize(1))
  })
})

describe('the setting survives on a child’s record', () => {
  let flow: LearningFlowController

  beforeEach(() => {
    localStorage.clear()
    flow = new LearningFlowController()
  })

  it('reads an older single difficulty as a one-level set', () => {
    const progress = JSON.parse(localStorage.getItem('learningProgress') || '{}')
    progress.difficulty = 2
    delete progress.wordLevels
    localStorage.setItem('learningProgress', JSON.stringify(progress))
    flow.refreshProgress()

    // A child part-way through Two Bee keeps exactly the words they had.
    expect(flow.getWordLevels()).toEqual([2])
  })

  it('treats an explicitly empty choice as every level', () => {
    // "All levels" is stored as the empty set, so a level added to the app
    // later is picked up without touching every child's record.
    flow.setWordLevels([])
    expect(flow.getWordLevels()).toEqual([])
    expect(flow.getDifficulty()).toBeUndefined()
  })

  it('saves a blend and keeps the old single field honest', () => {
    flow.setWordLevels([2, 1])

    expect(flow.getWordLevels()).toEqual([1, 2])
    // No single difficulty describes a blend, so the old field is cleared.
    expect(flow.getDifficulty()).toBeUndefined()
  })

  it('keeps the single field in step when only one level is chosen', () => {
    flow.setWordLevels([2])
    expect(flow.getDifficulty()).toBe(2)
  })

  it('sends the child back to the first group, because the order changed', () => {
    flow.setSelectedGroup(12)
    expect(flow.getSelectedGroup()).toBe(12)

    flow.setWordLevels([1, 2])

    // Group 12 of a One Bee list is different words from group 12 of a blend.
    expect(flow.getSelectedGroup()).toBe(0)
  })

  it('survives a reload', () => {
    flow.setWordLevels([1, 2])
    expect(new LearningFlowController().getWordLevels()).toEqual([1, 2])
  })
})
