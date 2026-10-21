import { describe, it, expect } from 'vitest'
import { mergeSync } from '@/services/persistence/mergeSync'

const progress = (fields: Record<string, string[]>) => ({ progress: fields })

describe('word lists merge as sets between two devices', () => {
  it('keeps the words both devices added', () => {
    const merged = mergeSync(
      progress({ wordsLearnedTotal: ['cat'] }),
      progress({ wordsLearnedTotal: ['cat', 'dog'] }),
      progress({ wordsLearnedTotal: ['cat', 'bee'] }),
    )
    expect(merged.progress.wordsLearnedTotal).toEqual(['cat', 'bee', 'dog'])
  })

  it("keeps a grown-up's reset today when the child's device learned another word", () => {
    const merged = mergeSync(
      progress({ wordsLearnedToday: ['a', 'b'] }),
      progress({ wordsLearnedToday: ['a', 'b', 'e'] }),
      progress({ wordsLearnedToday: [] }),
    )
    expect(merged.progress.wordsLearnedToday).toEqual(['e'])
  })

  it("does not bring yesterday's words back after this device starts a new day", () => {
    // This device rolled over (clearing a, b) and learned c; the other is
    // still on yesterday's list and learned d.
    const merged = mergeSync(
      progress({ wordsLearnedToday: ['a', 'b'] }),
      progress({ wordsLearnedToday: ['c'] }),
      progress({ wordsLearnedToday: ['a', 'b', 'd'] }),
    )
    expect(merged.progress.wordsLearnedToday).toEqual(['d', 'c'])
  })

  it("does not bring yesterday's words back when the other device started a new day", () => {
    const merged = mergeSync(
      progress({ wordsSpelledToday: ['a', 'b'] }),
      progress({ wordsSpelledToday: ['a', 'b', 'd'] }),
      progress({ wordsSpelledToday: ['c'] }),
    )
    expect(merged.progress.wordsSpelledToday).toEqual(['c', 'd'])
  })

  it('keeps both sides when there is no earlier snapshot to compare against', () => {
    const merged = mergeSync(
      undefined,
      progress({ wordsPracticedToday: ['a'] }),
      progress({ wordsPracticedToday: ['b'] }),
    )
    expect(merged.progress.wordsPracticedToday).toEqual(['b', 'a'])
  })

  it('lets the server win any other list', () => {
    const merged = mergeSync(
      progress({ missedDays: ['Mon'] }),
      progress({ missedDays: ['Mon', 'Tue'] }),
      progress({ missedDays: ['Mon', 'Wed'] }),
    )
    expect(merged.progress.missedDays).toEqual(['Mon', 'Wed'])
  })
})
