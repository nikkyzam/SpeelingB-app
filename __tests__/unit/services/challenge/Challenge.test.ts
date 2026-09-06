import { describe, it, expect, beforeEach } from 'vitest'
import ChallengeService, { splitForPlayers, PRIZE_PRESETS } from '@/services/challenge/ChallengeService'
import type { Word } from '@/services/wordBank'

const w = (word: string, difficulty: 1 | 2 | 3 = 1): Word =>
  ({ id: word, word, meaning: '', sentence: '', difficulty, category: 'test' })

/** Short to long — a pool a household might realistically have. */
const POOL = [
  w('cat'), w('dog'), w('sun'), w('hat'),
  w('happy'), w('table'), w('gentle'),
  w('bicycle', 2), w('elephant', 2), w('adventure', 2),
  w('chrysanthemum', 3), w('rhinoceros', 3),
]

const avgLength = (words: Word[]) => words.reduce((n, x) => n + x.word.length, 0) / words.length

describe('splitting one word list fairly between two children', () => {
  it('gives the younger speller shorter words than the older one', () => {
    const [younger, older] = splitForPlayers(POOL, ['easier', 'harder'], 6)

    // The whole point: a six-year-old is not asked to beat a nine-year-old at
    // the nine-year-old's words.
    expect(avgLength(younger)).toBeLessThan(avgLength(older))
  })

  it('never reaches outside the household’s own word list', () => {
    const [a, b] = splitForPlayers(POOL, ['easier', 'harder'], 6)
    const known = new Set(POOL.map((x) => x.id))

    // Pulling bank words in for the sibling would put words in front of a child
    // that nobody has taught them — the thing every game here avoids.
    for (const word of [...a, ...b]) expect(known.has(word.id)).toBe(true)
  })

  it('gives each player a full match even from a short list', () => {
    const tiny = [w('cat'), w('dog'), w('sun')]
    const [a, b] = splitForPlayers(tiny, ['easier', 'harder'], 6)
    expect(a).toHaveLength(6)
    expect(b).toHaveLength(6)
  })

  it('gives both the same kind of words when nobody is handicapped', () => {
    const [a, b] = splitForPlayers(POOL, ['same', 'same'], 6)
    // Within a word or two of each other — an even race.
    expect(Math.abs(avgLength(a) - avgLength(b))).toBeLessThan(3)
  })

  it('copes with an empty list', () => {
    expect(splitForPlayers([], ['same', 'same'], 6)).toEqual([[], []])
  })
})

describe('a tug-of-war always ends', () => {
  // Pure re-implementation of the rope rule, so the invariant is pinned down
  // even though the component itself needs a DOM to run.
  const TO_WIN = 4
  const MAX_TURNS = 20
  const play = (results: boolean[]) => {
    let rope = 0
    for (let turn = 0; turn < results.length; turn++) {
      const dir = turn % 2 === 0 ? -1 : 1
      if (results[turn]) {
        rope = rope + dir
      } else {
        const mine = dir === -1 ? rope < 0 : rope > 0
        if (mine) {
          const slipped = rope - dir * 0.5
          rope = dir === -1 ? Math.min(slipped, 0) : Math.max(slipped, 0)
        }
      }
      if (Math.abs(rope) >= TO_WIN || turn + 1 >= MAX_TURNS) return { rope, turns: turn + 1 }
    }
    return { rope, turns: results.length }
  }

  it('ends even when both children miss every single word', () => {
    // Without a turn cap the rope oscillates around the middle forever and the
    // match never finishes — two young spellers could genuinely do this.
    const result = play(Array(200).fill(false))
    expect(result.turns).toBe(MAX_TURNS)
  })

  it('never lets a miss gain ground for the player who missed', () => {
    // Player 1 pulls the rope to their side, then player 2 misses three times.
    // Those misses must not drag the rope back towards player 2 — a wrong
    // answer cannot be worth more than doing nothing.
    const afterPull = play([true])
    const afterTheirMisses = play([true, false, true, false])
    expect(afterTheirMisses.rope).toBeLessThanOrEqual(afterPull.rope)
  })

  it('is won by pulling all the way, not by running down a clock', () => {
    const result = play([true, false, true, false, true, false, true])
    expect(Math.abs(result.rope)).toBeGreaterThanOrEqual(TO_WIN)
    expect(result.turns).toBeLessThan(MAX_TURNS)
  })
})

describe('the prize a grown-up puts up', () => {
  beforeEach(() => {
    localStorage.clear()
    ChallengeService.clearHistory()
    ChallengeService.clearPrize()
  })

  it('starts with nothing on the table', () => {
    expect(ChallengeService.getPrize()).toBeNull()
  })

  it('remembers what was offered and who offered it', () => {
    ChallengeService.setPrize('Ice cream', '🍦', 'Dad')
    const prize = ChallengeService.getPrize()!
    expect(prize.label).toBe('Ice cream')
    expect(prize.setBy).toBe('Dad')
  })

  it('ignores an empty prize rather than offering nothing-in-particular', () => {
    ChallengeService.setPrize('   ', '🍦', 'Dad')
    expect(ChallengeService.getPrize()).toBeNull()
  })

  it('hands the prize to the winner and takes it off the table', () => {
    ChallengeService.setPrize('Movie night', '🎬', 'Mum')

    const result = ChallengeService.record({
      mode: 'Word Tug-of-War', players: ['Ava', 'Sam'], scores: [4, 2], winner: 'Ava',
    })

    expect(result.prize).toBe('🎬 Movie night')
    // It has been won, so it must not still be on offer for the next match.
    expect(ChallengeService.getPrize()).toBeNull()
  })

  it('keeps the prize on the table after a tie', () => {
    ChallengeService.setPrize('Ice cream', '🍦', 'Dad')

    const result = ChallengeService.record({
      mode: 'Buzzer Race', players: ['Ava', 'Sam'], scores: [3, 3], winner: null,
    })

    expect(result.prize).toBeNull()
    expect(ChallengeService.getPrize()?.label).toBe('Ice cream')
  })

  it('records a match even when nothing was on the table', () => {
    const result = ChallengeService.record({
      mode: 'Team Relay', players: ['Ava', 'Sam'], scores: [4, 4], winner: null,
    })
    expect(result.prize).toBeNull()
    expect(ChallengeService.history()).toHaveLength(1)
  })

  it('keeps a short history for the grown-up, newest first', () => {
    for (let i = 0; i < 25; i++) {
      ChallengeService.record({ mode: 'Steal-the-Point', players: ['Ava', 'Sam'], scores: [i, 0], winner: 'Ava' })
    }
    const history = ChallengeService.history()
    expect(history).toHaveLength(20) // capped, not unbounded
    expect(history[0].scores[0]).toBe(24) // newest first
  })

  it('offers presets a family would actually use', () => {
    expect(PRIZE_PRESETS.length).toBeGreaterThan(3)
    for (const p of PRIZE_PRESETS) {
      expect(p.label.length).toBeGreaterThan(0)
      expect(p.icon.length).toBeGreaterThan(0)
    }
  })
})
