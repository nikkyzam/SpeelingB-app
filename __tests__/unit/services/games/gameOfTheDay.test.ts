import { describe, it, expect } from 'vitest'
import { pickGameOfTheDay, recommendNext, dayKey } from '@/services/games/gameOfTheDay'

const IDS = ['abc-order', 'balloon-pop', 'ghost-word', 'word-chef', 'word-fishing', 'word-machine']
const on = (y: number, m: number, d: number) => new Date(y, m - 1, d, 12, 0, 0)

describe('the Game of the Day', () => {
  it('is the same on every device for a given date', () => {
    // No RNG: two "devices" computing independently must agree.
    const deviceA = pickGameOfTheDay(IDS, on(2026, 9, 6))
    const deviceB = pickGameOfTheDay(IDS, on(2026, 9, 6))
    expect(deviceA).toBe(deviceB)
  })

  it('does not care what order the caller built its list in', () => {
    const forwards = pickGameOfTheDay(IDS, on(2026, 9, 6))
    const backwards = pickGameOfTheDay([...IDS].reverse(), on(2026, 9, 6))
    expect(forwards).toBe(backwards)
  })

  it('survives a page refresh — it cannot re-roll itself', () => {
    const picks = Array.from({ length: 20 }, () => pickGameOfTheDay(IDS, on(2026, 9, 6)))
    expect(new Set(picks).size).toBe(1)
  })

  it('always names a game that exists', () => {
    for (let d = 1; d <= 28; d++) {
      expect(IDS).toContain(pickGameOfTheDay(IDS, on(2026, 9, d)))
    }
  })

  it('actually changes from day to day, and spreads across the catalogue', () => {
    const month = Array.from({ length: 28 }, (_, i) => pickGameOfTheDay(IDS, on(2026, 9, i + 1)))
    const changes = month.filter((g, i) => i > 0 && g !== month[i - 1]).length
    expect(changes).toBeGreaterThan(14) // not stuck on one game
    expect(new Set(month).size).toBeGreaterThan(3) // uses most of the list
  })

  it('turns over at the child’s own midnight, not UTC', () => {
    // 23:59 and 00:01 either side of local midnight are different days.
    expect(dayKey(new Date(2026, 8, 6, 23, 59))).not.toBe(dayKey(new Date(2026, 8, 7, 0, 1)))
    expect(dayKey(new Date(2026, 8, 6, 0, 1))).toBe(dayKey(new Date(2026, 8, 6, 23, 59)))
  })

  it('copes with an empty or one-game catalogue', () => {
    expect(pickGameOfTheDay([], on(2026, 9, 6))).toBeNull()
    expect(pickGameOfTheDay(['only-one'], on(2026, 9, 6))).toBe('only-one')
  })
})

const game = (id: string, category: string, unlocked = true) => ({ id, category, unlocked })
const CATALOGUE = [
  game('abc-order', 'spelling'),
  game('ghost-word', 'spelling'),
  game('word-chef', 'think'),
  game('bee-catch', 'arcade'),
  game('locked-one', 'arcade', false),
]

describe('what to try next after a game', () => {
  it('never suggests the game just played', () => {
    for (const g of CATALOGUE) {
      expect(recommendNext(CATALOGUE, g.id, [], on(2026, 9, 6))).not.toBe(g.id)
    }
  })

  it('never suggests a locked game', () => {
    const picks = Array.from({ length: 28 }, (_, i) =>
      recommendNext(CATALOGUE, 'abc-order', [], on(2026, 9, i + 1))
    )
    expect(picks).not.toContain('locked-one')
  })

  it('prefers something unplayed from a different corner of the collection', () => {
    // Just played a spelling game, and has already tried the other spelling one.
    const pick = recommendNext(CATALOGUE, 'abc-order', ['ghost-word'], on(2026, 9, 6))
    expect(['word-chef', 'bee-catch']).toContain(pick)
  })

  it('falls back to a new game even when the category matches', () => {
    const two = [game('abc-order', 'spelling'), game('ghost-word', 'spelling')]
    expect(recommendNext(two, 'abc-order', [], on(2026, 9, 6))).toBe('ghost-word')
  })

  it('still suggests something to a child who has played everything', () => {
    const allPlayed = CATALOGUE.map((g) => g.id)
    const pick = recommendNext(CATALOGUE, 'abc-order', allPlayed, on(2026, 9, 6))
    expect(pick).not.toBeNull()
    expect(pick).not.toBe('abc-order')
  })

  it('holds steady between renders so the card does not flicker', () => {
    const a = recommendNext(CATALOGUE, 'abc-order', [], on(2026, 9, 6))
    const b = recommendNext(CATALOGUE, 'abc-order', [], on(2026, 9, 6))
    expect(a).toBe(b)
  })

  it('has nothing to say when there is nothing else playable', () => {
    expect(recommendNext([game('only', 'spelling')], 'only', [], on(2026, 9, 6))).toBeNull()
    expect(recommendNext([], null, [], on(2026, 9, 6))).toBeNull()
  })
})
