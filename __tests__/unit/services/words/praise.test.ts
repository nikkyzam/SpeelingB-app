import { describe, it, expect } from 'vitest'
import { praise, nearly, streakCall, isStreakMilestone, spellOut, sayPrompt } from '@/services/words/praise'

describe('praise for a right answer', () => {
  it('never says the same line twice in a row', () => {
    let before = praise()
    for (let i = 0; i < 200; i++) {
      const now = praise()
      expect(now).not.toBe(before)
      before = now
    }
  })

  it('cheers a run of right answers at 3, 5, 10 and every 5 after', () => {
    expect([1, 2, 3, 4, 5, 6, 9, 10, 11, 15, 20].filter(isStreakMilestone)).toEqual([3, 5, 10, 15, 20])
    expect(praise(3)).toMatch(/Three in a row/)
    expect(praise(5)).toMatch(/Five in a row/)
    expect(praise(15)).toMatch(/15 in a row/)
    expect(streakCall(4)).toBeNull()
  })

  it('keeps a miss gentle', () => {
    for (let i = 0; i < 50; i++) {
      expect(nearly()).not.toMatch(/wrong|incorrect|no!/i)
    }
  })
})

describe('saying a word', () => {
  it('spells a word out letter by letter for speech', () => {
    expect(spellOut('Cat')).toBe('c, a, t')
  })

  it('asks for a word the way a spelling bee does', () => {
    expect(sayPrompt('cat', 'The cat sat down.')).toBe('cat. The cat sat down. cat.')
    expect(sayPrompt('cat')).toBe('cat.')
  })
})
