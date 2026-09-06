import { describe, it, expect, beforeEach, vi } from 'vitest'
import TrophyService, { TROPHIES, WORD_MILESTONES } from '@/services/trophies/TrophyService'
import { buildBracket, ROUNDS, grandBeeWeek } from '@/pages/BeeTournament/bracket'
import type { Word } from '@/services/wordBank'

vi.mock('@/services/buddy/BuddyService', () => ({
  default: { get: () => ({ name: '', meals: 0, equipped: {} }) },
  stageForLevel: () => ({ emoji: '🐣' }),
}))
vi.mock('@/services/rewards/AchievementsService', () => ({
  AchievementsService: { getUnlockedBadges: () => [] },
}))

describe('the trophy case', () => {
  beforeEach(() => {
    localStorage.clear()
    TrophyService.clear()
  })

  it('awards a trophy once and keeps the day it was won', () => {
    expect(TrophyService.award('cup-gold')).toBe(true)
    const first = TrophyService.all().find((t) => t.id === 'cup-gold')!.earnedAt

    // Winning again must not move the date — it is a record of when, not a counter.
    expect(TrophyService.award('cup-gold')).toBe(false)
    expect(TrophyService.all().find((t) => t.id === 'cup-gold')!.earnedAt).toBe(first)
  })

  it('refuses a trophy that does not exist', () => {
    expect(TrophyService.award('cup-imaginary')).toBe(false)
    expect(TrophyService.earnedCount()).toBe(0)
  })

  it('shows unearned trophies rather than hiding them', () => {
    TrophyService.award('cup-bronze')
    const all = TrophyService.all()

    expect(all.length).toBe(TROPHIES.length)
    expect(all.filter((t) => t.earnedAt).length).toBe(1)
    // The empty spaces are the point: a child should see there is more to come.
    expect(all.filter((t) => !t.earnedAt).length).toBeGreaterThan(0)
  })

  it('gives every unearned trophy a hint, and none of them a deadline', () => {
    for (const t of TROPHIES) {
      expect(t.hint.length).toBeGreaterThan(0)
      // Anticipation, not pressure — no countdowns, no "before" dates.
      expect(t.hint).not.toMatch(/today|day left|hurry|expires|deadline|before/i)
    }
  })

  it('catches up on milestones already reached', () => {
    // A child with 120 words has passed two milestones without anyone watching.
    const won = TrophyService.sync({ wordsLearned: 120, streak: 0, seasonalWordsLearned: 0 })

    expect(won).toContain('plaque-50')
    expect(won).toContain('plaque-100')
    expect(won).not.toContain('plaque-250')
  })

  it('does not re-award on a second visit', () => {
    TrophyService.sync({ wordsLearned: 120, streak: 9, seasonalWordsLearned: 3 })
    const second = TrophyService.sync({ wordsLearned: 120, streak: 9, seasonalWordsLearned: 3 })

    expect(second).toEqual([])
  })

  it('awards the event medal and the streak badge from history', () => {
    const won = TrophyService.sync({ wordsLearned: 0, streak: 7, seasonalWordsLearned: 4 })
    expect(won).toContain('medal-seasonal')
    expect(won).toContain('badge-streak-7')
  })

  it('has a milestone plaque for every milestone', () => {
    for (const n of WORD_MILESTONES) {
      expect(TROPHIES.some((t) => t.id === `plaque-${n}`)).toBe(true)
    }
  })
})

// --- the bracket -------------------------------------------------------------

const word = (id: string, w: string, difficulty: 1 | 2 | 3 = 1): Word =>
  ({ id, word: w, meaning: '', sentence: '', difficulty, category: 'test' })

/** Letter-only words: the Bee asks a child to spell them, so digits are out. */
const letters = (i: number) =>
  `zz${String.fromCharCode(97 + (i % 26))}${String.fromCharCode(97 + Math.floor(i / 26))}`

const WORDS = Array.from({ length: 40 }, (_, i) => word(`w${i}`, letters(i)))
const HARD = Array.from({ length: 20 }, (_, i) => word(`h${i}`, `hh${letters(i)}`, 2))

const bank = {
  getWordById: (id: string) => [...WORDS, ...HARD].find((w) => w.id === id),
  getWordsForLevels: () => HARD,
}
const flow = (spelled: string[], learned: string[]) => ({
  getWordsSpelledTotal: () => spelled,
  getWordsLearnedTotal: () => learned,
  getWordLevels: () => [1 as const],
})

const ids = (n: number) => Array.from({ length: n }, (_, i) => `w${i}`)

describe('the week’s bracket', () => {
  it('has five rounds that get harder', () => {
    expect(ROUNDS).toHaveLength(5)
    expect(ROUNDS[0].name).toBe('Warm-up')
    expect(ROUNDS[4].name).toBe('Championship')
    expect(ROUNDS[4].words).toBe(1) // one word for the cup
    // Only the last two rounds reach above the child's level.
    expect(ROUNDS.filter((r) => r.stretch).map((r) => r.name)).toEqual(['Final', 'Championship'])
  })

  it('is the same all week, so a child can practise it', () => {
    const monday = new Date(2026, 8, 7, 9)
    const thursday = new Date(2026, 8, 10, 18)
    const a = buildBracket(flow(ids(20), ids(30)), bank, monday)
    const b = buildBracket(flow(ids(20), ids(30)), bank, thursday)
    expect(a.flat().map((w) => w.id)).toEqual(b.flat().map((w) => w.id))
  })

  it('turns over on Monday', () => {
    const sunday = new Date(2026, 8, 6, 23)
    const monday = new Date(2026, 8, 7, 1)
    expect(grandBeeWeek(sunday)).not.toBe(grandBeeWeek(monday))

    const a = buildBracket(flow(ids(20), ids(30)), bank, sunday)
    const b = buildBracket(flow(ids(20), ids(30)), bank, monday)
    expect(a.flat().map((w) => w.id)).not.toEqual(b.flat().map((w) => w.id))
  })

  it('never asks the same word twice in one bracket', () => {
    const all = buildBracket(flow(ids(20), ids(30)), bank).flat().map((w) => w.id)
    expect(new Set(all).size).toBe(all.length)
  })

  it('opens with words the child has actually spelled right', () => {
    const spelled = ids(10)
    const warmUp = buildBracket(flow(spelled, ids(30)), bank)[0]
    // The Bee is a stage for what they know — the first round must not be new words.
    expect(warmUp.every((w) => spelled.includes(w.id))).toBe(true)
  })

  it('only reaches above their level in the finals', () => {
    const bracket = buildBracket(flow(ids(3), ids(3)), bank)
    const early = bracket.slice(0, 3).flat()
    const late = bracket.slice(3).flat()
    // Too few known words, so the finals stretch — the early rounds must not.
    expect(early.every((w) => w.difficulty === 1)).toBe(true)
    expect(late.some((w) => w.difficulty === 2)).toBe(true)
  })

  it('runs a short Bee rather than one full of strangers', () => {
    // A child with three words gets three words, not a padded five rounds.
    const bracket = buildBracket(
      { getWordsSpelledTotal: () => ids(3), getWordsLearnedTotal: () => ids(3), getWordLevels: () => [1] },
      { getWordById: bank.getWordById, getWordsForLevels: () => [] }
    )
    expect(bracket.flat()).toHaveLength(3)
  })

  it('has nothing to run when the child knows nothing yet', () => {
    const bracket = buildBracket(
      { getWordsSpelledTotal: () => [], getWordsLearnedTotal: () => [], getWordLevels: () => [1] },
      { getWordById: bank.getWordById, getWordsForLevels: () => [] }
    )
    expect(bracket.flat()).toHaveLength(0)
  })
})
