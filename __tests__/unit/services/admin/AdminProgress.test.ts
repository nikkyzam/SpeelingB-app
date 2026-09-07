import { describe, it, expect, beforeEach, vi } from 'vitest'

/**
 * A small, fixed word bank. The real one changes as words are added, and a
 * parent-facing count that silently changes with it would be untestable.
 */
const WORDS = [
  { id: 'w1', word: 'cat', difficulty: 1 },
  { id: 'w2', word: 'dog', difficulty: 1 },
  { id: 'w3', word: 'happy', difficulty: 1 },
  { id: 'w4', word: 'bicycle', difficulty: 2 },
  { id: 'w5', word: 'elephant', difficulty: 2 },
]

vi.mock('@/services/wordBank', () => ({
  wordBank: {
    getWordById: (id: string) => WORDS.find((w) => w.id === id),
    availableLevels: () => [
      { level: 1, count: 30 },
      { level: 2, count: 20 },
    ],
    getAllWords: () => WORDS,
  },
}))

import { deriveProgress, RawUserDoc } from '@/services/admin/AdminProgress'

/** Today, fixed, so "due today" and the fortnight can be asserted. */
const NOW = new Date(2026, 8, 7, 10) // Monday 7 September 2026

/** The bundle travels as raw localStorage strings — build one the same way. */
const bundle = (obj: Record<string, unknown>): Record<string, string> =>
  Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, JSON.stringify(v)]))

const doc = (over: Partial<RawUserDoc> = {}): RawUserDoc => ({
  progress: {
    wordsLearnedTotal: ['w1', 'w2', 'w3', 'w4'],
    wordsSpelledTotal: ['w1', 'w2'],
  },
  local: bundle({
    word_correct_counts: { w1: 3, w2: 1 },
    word_review_schedule: {
      w1: { box: 5, due: '2026-09-20', right: 6, wrong: 0 },
      w2: { box: 1, due: '2026-09-07', right: 1, wrong: 4 },
      w3: { box: 2, due: '2026-09-01', right: 2, wrong: 1 },
    },
    learn_history: { '2026-09-07': 3, '2026-09-05': 2, '2025-01-01': 99 },
    game_play_counts: { 'word-scramble': 4, 'spell-sprint': 9, 'ghost-word': 0 },
    game_high_scores: { 'spell-sprint': 120 },
    trophy_case: { 'cup-gold': '2026-09-01', 'plaque-50': '2026-08-02' },
  }),
  rewards: { unlockedBadges: ['first-word', 'streak-3'] },
  ...over,
})

describe('what a grown-up can see about one child', () => {
  beforeEach(() => localStorage.clear())

  it('counts words met, spelled and mastered', () => {
    const p = deriveProgress(doc(), NOW)
    expect(p.met).toBe(4)
    expect(p.spelled).toBe(2)
    // Mastery is three correct spellings — w1 has 3, w2 only 1.
    expect(p.mastered).toBe(1)
  })

  it('never reads the grown-up’s own device instead of the child’s document', () => {
    // The trap: every other service in this app reads the signed-in user's data
    // from localStorage. Doing that here would show one child's mastery on
    // every other child's page.
    localStorage.setItem('word_correct_counts', JSON.stringify({ w1: 9, w2: 9, w3: 9, w4: 9 }))
    localStorage.setItem('word_review_schedule', JSON.stringify({ w4: { box: 1, due: '2020-01-01', right: 0, wrong: 50 } }))

    const p = deriveProgress({ progress: { wordsLearnedTotal: ['w1'], wordsSpelledTotal: ['w1'] } }, NOW)
    expect(p.mastered).toBe(0)
    expect(p.tricky).toEqual([])
    expect(p.practised).toBe(0)
  })

  it('measures them against the whole word list, per level', () => {
    const p = deriveProgress(doc(), NOW)
    expect(p.bankTotal).toBe(50)
    expect(Math.round(p.pctMet)).toBe(8) // 4 of 50
    expect(p.perLevel).toEqual([
      { level: 1, label: 'One Bee', met: 3, total: 30 },
      { level: 2, label: 'Two Bee', met: 1, total: 20 },
    ])
  })

  it('leaves out words the app no longer has, and says how many', () => {
    const p = deriveProgress(
      doc({ progress: { wordsLearnedTotal: ['w1', 'gone-1', 'gone-2'], wordsSpelledTotal: ['w1', 'gone-1'] } }),
      NOW
    )
    // Counting words nobody can name would inflate the bar with nothing.
    expect(p.met).toBe(1)
    expect(p.spelled).toBe(1)
    expect(p.unresolved).toBe(2)
  })

  it('puts the word that most needs practising at the top', () => {
    const p = deriveProgress(doc(), NOW)
    expect(p.tricky.map((t) => t.word)).toEqual(['dog', 'happy'])
    expect(p.tricky[0]).toMatchObject({ word: 'dog', wrong: 4, right: 1, box: 1 })
    // A word never got wrong is not a worry and must not be listed.
    expect(p.tricky.some((t) => t.word === 'cat')).toBe(false)
  })

  it('counts words due today or overdue, but not tomorrow’s', () => {
    const p = deriveProgress(doc(), NOW)
    // w2 due today, w3 overdue, w1 due in a fortnight.
    expect(p.dueToday).toBe(2)
    expect(p.practised).toBe(3)
    expect(p.boxes).toEqual([1, 1, 0, 0, 1])
  })

  it('shows the last fortnight, ending today, with the quiet days in it', () => {
    const p = deriveProgress(doc(), NOW)
    expect(p.days).toHaveLength(14)
    expect(p.days[13].date).toBe('2026-09-07')
    expect(p.days[0].date).toBe('2026-08-25')
    expect(p.days[13].count).toBe(3)
    expect(p.days[11].count).toBe(2) // 5 September
    expect(p.days[12].count).toBe(0) // nothing on the 6th
    expect(p.activeDays).toBe(2)
    expect(p.bestDay).toBe(3)
    // A day from another year must not leak into this fortnight.
    expect(p.days.every((d) => d.date.startsWith('2026-0'))).toBe(true)
  })

  it('lists the games actually played, busiest first', () => {
    const p = deriveProgress(doc(), NOW)
    expect(p.games.map((g) => g.name)).toEqual(['Spell Sprint', 'Word Scramble'])
    expect(p.games[0]).toMatchObject({ plays: 9, best: 120 })
    expect(p.totalPlays).toBe(13)
    expect(p.trophies).toBe(2)
    expect(p.badges).toBe(2)
  })

  it('names the most recently met words, newest first', () => {
    const p = deriveProgress(doc(), NOW)
    expect(p.recent.map((w) => w.word)).toEqual(['bicycle', 'happy', 'dog', 'cat'])
  })

  it('gives them an explorer rank from what they have done', () => {
    const p = deriveProgress(doc(), NOW)
    // 4 met + 2 spelled + 1 mastered, by the app's own XP rule.
    expect(p.explorer.xp).toBe(4 * 10 + 2 * 15 + 25)
    expect(p.explorer.title).toBe('Word Sprout')
    expect(p.explorer.next).toBe('Busy Bee')
  })

  it('reads a bundle that was stored already-parsed', () => {
    // Older documents, and anything hand-edited in the Firebase console, hold
    // the object rather than the string localStorage had.
    const p = deriveProgress(
      {
        progress: { wordsLearnedTotal: ['w1'], wordsSpelledTotal: ['w1'] },
        local: { word_correct_counts: { w1: 3 } as unknown as string },
      },
      NOW
    )
    expect(p.mastered).toBe(1)
  })

  it('survives a corrupt document rather than taking the console down', () => {
    const p = deriveProgress(
      {
        progress: { wordsLearnedTotal: 'not-an-array', wordsSpelledTotal: null },
        local: {
          word_correct_counts: '{{{ broken',
          word_review_schedule: JSON.stringify({ w1: null, w2: 'nonsense' }),
          learn_history: JSON.stringify({ '2026-09-07': -5 }),
          game_play_counts: JSON.stringify({ 'word-scramble': 'lots' }),
        },
        rewards: { unlockedBadges: 'no' },
      } as unknown as RawUserDoc,
      NOW
    )
    expect(p.met).toBe(0)
    expect(p.tricky).toEqual([])
    expect(p.games).toEqual([])
    expect(p.badges).toBe(0)
    expect(p.days[13].count).toBe(0) // a negative day is not shown as negative
  })

  it('has something sensible to say about a child who has just signed up', () => {
    const p = deriveProgress({}, NOW)
    expect(p.met).toBe(0)
    expect(p.pctMet).toBe(0)
    expect(p.dueToday).toBe(0)
    expect(p.activeDays).toBe(0)
    expect(p.days).toHaveLength(14)
    expect(p.explorer.level).toBe(1)
  })
})
