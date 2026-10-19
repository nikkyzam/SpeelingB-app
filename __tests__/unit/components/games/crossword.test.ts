import { describe, it, expect } from 'vitest'
import { buildCrossword, maskClue, type Crossword } from '@/components/games/CrissCross/crossword'

/** The same "random" every run, so a failure can be replayed. */
const seeded = (seed: number) => () => {
  seed = (seed * 1664525 + 1013904223) % 4294967296
  return seed / 4294967296
}

const WORDS = ['balloon', 'letter', 'garden', 'rabbit', 'orange', 'yellow', 'window', 'button', 'kitten', 'pencil']

const lettersOn = (cw: Crossword) => {
  const grid = new Map<string, string>()
  for (const e of cw.entries) {
    e.cells.forEach(([r, c], i) => {
      const k = `${r},${c}`
      // Where two words cross, they must agree on the letter.
      if (grid.has(k)) expect(grid.get(k), `${e.word} crosses a different letter`).toBe(e.word[i])
      grid.set(k, e.word[i])
    })
  }
  return grid
}

/** Every run of two or more letters on the grid, the way a solver would read it. */
const runsOn = (cw: Crossword, grid: Map<string, string>): string[] => {
  const found: string[] = []
  const read = (dir: 'across' | 'down', outer: number, inner: number, at: (o: number, i: number) => string) => {
    for (let o = 0; o < outer; o++) {
      let run = ''
      for (let i = 0; i <= inner; i++) {
        const ch = i < inner ? grid.get(at(o, i)) : undefined
        if (ch) run += ch
        else {
          if (run.length >= 2) found.push(`${dir}:${run}`)
          run = ''
        }
      }
    }
  }
  read('across', cw.rows, cw.cols, (r, c) => `${r},${c}`)
  read('down', cw.cols, cw.rows, (c, r) => `${r},${c}`)
  return found.sort()
}

const connected = (grid: Map<string, string>): boolean => {
  const cells = [...grid.keys()]
  const seen = new Set([cells[0]])
  const queue = [cells[0]]
  while (queue.length) {
    const [r, c] = queue.shift()!.split(',').map(Number)
    for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const k = `${r + dr},${c + dc}`
      if (grid.has(k) && !seen.has(k)) {
        seen.add(k)
        queue.push(k)
      }
    }
  }
  return seen.size === cells.length
}

describe('building a crossword from a child’s words', () => {
  it('never spells anything on the grid except the words themselves', () => {
    // The real test of a crossword: read every row and column as a solver
    // would. Two words touching side by side would spell nonsense there.
    for (let seed = 1; seed <= 60; seed++) {
      const cw = buildCrossword(WORDS, { rand: seeded(seed) })
      const grid = lettersOn(cw)
      expect(runsOn(cw, grid), `seed ${seed}`).toEqual(cw.entries.map((e) => `${e.dir}:${e.word}`).sort())
    }
  })

  it('crosses the words into one connected puzzle', () => {
    for (let seed = 1; seed <= 60; seed++) {
      const cw = buildCrossword(WORDS, { rand: seeded(seed) })
      expect(connected(lettersOn(cw)), `seed ${seed}`).toBe(true)
    }
  })

  it('uses as many words as it was asked for when they can cross', () => {
    expect(buildCrossword(WORDS, { target: 5, rand: seeded(7) }).entries).toHaveLength(5)
    expect(buildCrossword(WORDS, { target: 3, rand: seeded(7) }).entries).toHaveLength(3)
  })

  it('stays small enough for a phone', () => {
    for (let seed = 1; seed <= 60; seed++) {
      const cw = buildCrossword(WORDS, { rand: seeded(seed) })
      expect(cw.rows).toBeLessThanOrEqual(12)
      expect(cw.cols).toBeLessThanOrEqual(12)
      for (const e of cw.entries) {
        for (const [r, c] of e.cells) {
          expect(r).toBeGreaterThanOrEqual(0)
          expect(c).toBeGreaterThanOrEqual(0)
          expect(r).toBeLessThan(cw.rows)
          expect(c).toBeLessThan(cw.cols)
        }
      }
    }
  })

  it('numbers the clues in reading order, starting at 1', () => {
    const cw = buildCrossword(WORDS, { rand: seeded(3) })
    const starts = new Map<number, string>()
    for (const e of cw.entries) {
      // An across and a down that start in the same square share a number.
      const at = `${e.row},${e.col}`
      if (starts.has(e.number)) expect(starts.get(e.number)).toBe(at)
      starts.set(e.number, at)
    }
    const order = [...starts.entries()].sort((a, b) => a[0] - b[0]).map(([, at]) => at.split(',').map(Number))
    expect([...starts.keys()].sort((a, b) => a - b)[0]).toBe(1)
    for (let i = 1; i < order.length; i++) {
      const [r0, c0] = order[i - 1]
      const [r1, c1] = order[i]
      expect(r1 > r0 || (r1 === r0 && c1 > c0)).toBe(true)
    }
  })

  it('gives words with no letters in common a row each, rather than leaving them out', () => {
    // c-a-t, d-o-g and f-i-s-h share nothing, so nothing can cross.
    const cw = buildCrossword(['cat', 'dog', 'fish'], { rand: seeded(1) })
    expect(cw.entries.map((e) => e.word).sort()).toEqual(['cat', 'dog', 'fish'])
    expect(runsOn(cw, lettersOn(cw))).toEqual(cw.entries.map((e) => `${e.dir}:${e.word}`).sort())
  })

  it('ignores repeats and anything that is not plain letters', () => {
    const cw = buildCrossword(['Cat', 'cat', 'ice-cream', 'tap'], { rand: seeded(2) })
    expect(cw.entries.map((e) => e.word).sort()).toEqual(['cat', 'tap'])
  })

  it('copes with nothing to build from', () => {
    expect(buildCrossword([]).entries).toEqual([])
  })
})

describe('keeping the answer out of its own clue', () => {
  it('blanks out the word and its simple forms', () => {
    expect(maskClue('A game of tag where the one who is tagged is it', 'tag')).toBe(
      'A game of ____ where the one who is ____ is it'
    )
    expect(maskClue('Cats are small', 'cat')).toBe('____ are small')
  })

  it('blanks out longer forms of a word', () => {
    expect(maskClue('Showing elegance; stylishly elegant', 'elegant')).toBe('Showing ____; stylishly ____')
    expect(maskClue('Decoration for a room', 'decor')).toBe('____ for a room')
    expect(maskClue('To stun with a Taser', 'tase')).toBe('To stun with a ____')
  })

  it('leaves unrelated words that merely start the same way alone', () => {
    // "plan" and "plants" are not "planet".
    expect(maskClue('A plan for planets and plants', 'planet')).toBe('A plan for ____ and plants')
    expect(maskClue('A catalog of things', 'cat')).toBe('A catalog of things')
  })
})
