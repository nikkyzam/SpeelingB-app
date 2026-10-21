/**
 * Builds a small crossword out of a child's own words.
 *
 * Greedy, the way people make one by hand: lay a word down, then keep crossing
 * new words through letters already on the grid, preferring the spot that
 * keeps the grid small and square (it has to fit a phone). Several shuffled
 * attempts are made and the best kept, so the same list gives a different
 * puzzle from one game to the next.
 */

export type Dir = 'across' | 'down'

export interface Slot {
  word: string
  row: number
  col: number
  dir: Dir
}

export interface Entry extends Slot {
  /** The clue number printed in the first square. */
  number: number
  /** [row, col] of each letter, in order. */
  cells: [number, number][]
}

export interface Crossword {
  rows: number
  cols: number
  entries: Entry[]
}

interface BuildOptions {
  /** How many words to aim for. */
  target?: number
  attempts?: number
  /** The grid may not grow beyond this many squares either way. */
  maxSide?: number
  rand?: () => number
}

const key = (r: number, c: number) => `${r},${c}`

export const cellsOf = (s: Slot): [number, number][] =>
  [...s.word].map((_, i): [number, number] => (s.dir === 'across' ? [s.row, s.col + i] : [s.row + i, s.col]))

class Board {
  letters = new Map<string, string>()
  dirs = new Map<string, Set<Dir>>()
  slots: Slot[] = []

  put(s: Slot) {
    cellsOf(s).forEach(([r, c], i) => {
      const k = key(r, c)
      this.letters.set(k, s.word[i])
      const d = this.dirs.get(k) ?? new Set<Dir>()
      d.add(s.dir)
      this.dirs.set(k, d)
    })
    this.slots.push(s)
  }

  /**
   * How many words `s` would cross, or -1 if it can't go there. Crossings must
   * agree and meet at right angles, and the new word may not run alongside or
   * end-to-end with another: the squares where they touched would spell
   * something that isn't a word.
   */
  crossings(s: Slot): number {
    const [dr, dc] = s.dir === 'across' ? [0, 1] : [1, 0]
    const n = s.word.length
    if (this.letters.has(key(s.row - dr, s.col - dc))) return -1
    if (this.letters.has(key(s.row + dr * n, s.col + dc * n))) return -1

    let count = 0
    for (let i = 0; i < n; i++) {
      const r = s.row + dr * i
      const c = s.col + dc * i
      const here = this.letters.get(key(r, c))
      if (here !== undefined) {
        if (here !== s.word[i] || this.dirs.get(key(r, c))?.has(s.dir)) return -1
        count++
      } else if (this.letters.has(key(r + dc, c + dr)) || this.letters.has(key(r - dc, c - dr))) {
        // An empty square with a letter beside it would join the two up.
        return -1
      }
    }
    return count
  }
}

const bounds = (slots: Slot[]) => {
  let top = Infinity
  let left = Infinity
  let bottom = -Infinity
  let right = -Infinity
  for (const s of slots) {
    const last = s.word.length - 1
    top = Math.min(top, s.row)
    left = Math.min(left, s.col)
    bottom = Math.max(bottom, s.dir === 'down' ? s.row + last : s.row)
    right = Math.max(right, s.dir === 'across' ? s.col + last : s.col)
  }
  return { top, left, rows: bottom - top + 1, cols: right - left + 1 }
}

const shuffled = <T,>(items: T[], rand: () => number): T[] => {
  const a = [...items]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** One try: place the words in this order, crossing each where it fits best. */
const attempt = (order: string[], target: number, maxSide: number, rand: () => number): Slot[] => {
  const board = new Board()
  board.put({ word: order[0], row: 0, col: 0, dir: rand() < 0.5 ? 'across' : 'down' })

  for (const word of order.slice(1)) {
    if (board.slots.length >= target) break
    const options: { slot: Slot; cost: number }[] = []
    for (const other of board.slots) {
      const dir: Dir = other.dir === 'across' ? 'down' : 'across'
      for (let i = 0; i < other.word.length; i++) {
        for (let j = 0; j < word.length; j++) {
          if (other.word[i] !== word[j]) continue
          const [r, c] = other.dir === 'across' ? [other.row, other.col + i] : [other.row + i, other.col]
          const slot: Slot = dir === 'across' ? { word, row: r, col: c - j, dir } : { word, row: r - j, col: c, dir }
          const crossing = board.crossings(slot)
          if (crossing < 1) continue
          const box = bounds([...board.slots, slot])
          if (box.rows > maxSide || box.cols > maxSide) continue
          // Small and squarish reads best on a small screen; every extra
          // crossing ties the puzzle together a little more.
          options.push({ slot, cost: box.rows * box.cols + 3 * Math.abs(box.rows - box.cols) - 8 * (crossing - 1) })
        }
      }
    }
    if (options.length === 0) continue
    options.sort((a, b) => a.cost - b.cost)
    // Any of the best few, so the same words make a different puzzle next time.
    board.put(options[Math.floor(rand() * Math.min(3, options.length))].slot)
  }
  return board.slots
}

/**
 * Words with no letter in common can't cross. Rather than hand a child a
 * one-word "crossword", they sit on rows of their own below the grid.
 */
const addLoners = (slots: Slot[], words: string[], want: number): Slot[] => {
  const out = [...slots]
  const box = out.length > 0 ? bounds(out) : { top: 0, left: 0, rows: -1, cols: 0 }
  let row = box.top + box.rows + 1
  for (const word of words) {
    if (out.length >= want) break
    if (out.some((s) => s.word === word)) continue
    out.push({ word, row, col: box.left, dir: 'across' })
    row += 2
  }
  return out
}

/** Shift the grid to start at 0,0 and number the clues in reading order. */
const numberIt = (slots: Slot[]): Crossword => {
  const box = bounds(slots)
  const moved = slots.map((s) => ({ ...s, row: s.row - box.top, col: s.col - box.left }))
  const starts = [...new Set(moved.map((s) => key(s.row, s.col)))]
    .map((k) => k.split(',').map(Number))
    .sort((a, b) => a[0] - b[0] || a[1] - b[1])
  const numbers = new Map(starts.map(([r, c], i): [string, number] => [key(r, c), i + 1]))
  const entries = moved
    .map((s) => ({ ...s, number: numbers.get(key(s.row, s.col)) ?? 0, cells: cellsOf(s) }))
    .sort((a, b) => a.number - b.number || (a.dir === 'across' ? -1 : 1))
  return { rows: box.rows, cols: box.cols, entries }
}

export const buildCrossword = (words: string[], options: BuildOptions = {}): Crossword => {
  const list = [...new Set(words.map((w) => w.toLowerCase()))].filter((w) => /^[a-z]{2,}$/.test(w))
  if (list.length === 0) return { rows: 0, cols: 0, entries: [] }

  const { target = 5, attempts = 30, rand = Math.random } = options
  const maxSide = options.maxSide ?? Math.max(12, ...list.map((w) => w.length))
  const goal = Math.min(target, list.length)

  let best: Slot[] = []
  let bestArea = Infinity
  for (let a = 0; a < attempts; a++) {
    const slots = attempt(shuffled(list, rand), goal, maxSide, rand)
    const box = bounds(slots)
    const area = box.rows * box.cols
    if (slots.length > best.length || (slots.length === best.length && area < bestArea)) {
      best = slots
      bestArea = area
    }
  }

  const floor = Math.min(goal, 3)
  if (best.length < floor) best = addLoners(best, list, floor)
  return numberIt(best)
}

// Kept here for the crossword's own imports; it lives with the other shared helpers.
export { maskClue } from '../shared/clues'
