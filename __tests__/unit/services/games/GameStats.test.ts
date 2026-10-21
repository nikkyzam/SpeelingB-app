import { describe, it, expect, beforeEach } from 'vitest'
import { GameStats, SCORE_SCALES, bestKey, medalFor, MEDAL_AT } from '@/services/games/GameStats'

const KEY = 'game_high_scores'
const saved = (): Record<string, number> => JSON.parse(localStorage.getItem(KEY) || '{}')

describe('best scores across a game being rebuilt', () => {
  beforeEach(() => localStorage.clear())

  it('starts a fresh best for a game whose score scale changed', () => {
    // Memory Match scored 1,500 before; about 200 now. The old best would be unbeatable.
    localStorage.setItem(KEY, JSON.stringify({ 'memory-match': 1500, 'word-builder': 90 }))
    expect(GameStats.getBest('memory-match')).toBe(0)
    expect(GameStats.getAllBests()).toEqual({ 'word-builder': 90 })

    const result = GameStats.recordScore('memory-match', 210)
    expect(result).toMatchObject({ isNewBest: true, best: 210 })
    expect(GameStats.getBest('memory-match')).toBe(210)
    expect(GameStats.getAllBests()).toEqual({ 'word-builder': 90, 'memory-match': 210 })
  })

  it('never lets an old-scale best come back, even written by an old device', () => {
    GameStats.recordScore('balloon-pop', 250)
    // A device still on the old version merges its own best in under the plain id.
    localStorage.setItem(KEY, JSON.stringify({ ...saved(), 'balloon-pop': 1900 }))
    expect(GameStats.getBest('balloon-pop')).toBe(250)
    expect(GameStats.recordScore('balloon-pop', 300).isNewBest).toBe(true)
  })

  it('leaves every other game exactly as it was', () => {
    localStorage.setItem(KEY, JSON.stringify({ 'word-builder': 90 }))
    expect(GameStats.recordScore('word-builder', 80)).toMatchObject({ isNewBest: false, best: 90 })
    expect(saved()).toEqual({ 'word-builder': 90 })
    expect(bestKey('word-builder')).toBe('word-builder')
  })

  it('names only real game ids as rescaled', () => {
    for (const id of Object.keys(SCORE_SCALES)) expect(id).toMatch(/^[a-z]+(-[a-z]+)*$/)
  })
})

describe('medals for coming back to a game', () => {
  it('gives bronze for one finish, silver at three, gold at seven', () => {
    expect([0, 1, 2, 3, 6, 7, 20].map(medalFor)).toEqual([null, 'bronze', 'bronze', 'silver', 'silver', 'gold', 'gold'])
    expect(MEDAL_AT).toEqual({ bronze: 1, silver: 3, gold: 7 })
  })
})
