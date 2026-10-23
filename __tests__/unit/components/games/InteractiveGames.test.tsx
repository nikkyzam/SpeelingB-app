import { setPreferences } from '@/services/preferences'
import React from 'react'
import { describe, it, expect, vi, beforeEach, afterEach, beforeAll } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'

// vi.mock is hoisted above everything, so what it uses must be hoisted too.
const h = vi.hoisted(() => {
  const noSound = {
    tap: () => {}, pop: () => {}, correct: () => {}, wrong: () => {},
    win: () => {}, applause: () => {}, worldJingle: () => {},
    star: () => {}, whoosh: () => {}, thud: () => {}, fanfare: () => {},
  }
  return { noSound, record: vi.fn() }
})
vi.mock('@/components/games/shared/sfx', () => ({
  default: h.noSound,
  sfx: h.noSound,
  // ThemeProvider reaches for this when a world is chosen.
  setWorldSoundProfile: () => {},
}))
vi.mock('@/services/progress/ReviewSchedule', () => ({
  default: { record: h.record },
  ReviewSchedule: { record: h.record },
}))

import CaterpillarCrawl, {
  crawlOnce, plant, stepFrom, COLS, ROWS, type Dir, type Garden, type Cell,
} from '@/components/games/CaterpillarCrawl'
import SpellTacToe, { threeInARow, botMove, type Mark } from '@/components/games/SpellTacToe'
import CrissCross from '@/components/games/CrissCross'
import WordJigsaw, { piecesFor, decoyFor } from '@/components/games/WordJigsaw'
import { likelySlips, letterTraps } from '@/components/games/shared/wordTricks'
import { AudioProvider } from '@/contexts/AudioContext'
import { ThemeProvider } from '@/contexts/ThemeContext'

const word = (w: string, meaning = `the meaning of ${w}`) => ({
  id: w,
  word: w,
  meaning,
  sentence: `A ${w} appeared.`,
  difficulty: 1 as const,
  category: 'test',
})

const wrap = (ui: React.ReactElement) =>
  render(
    <ThemeProvider>
      <AudioProvider>{ui}</AudioProvider>
    </ThemeProvider>
  )

const button = (name: string | RegExp) => screen.getByRole('button', { name })

/** jsdom has no PointerEvent, and without one a drag loses its position and finger. */
const installPointerEvent = () => {
  if ('PointerEvent' in window) return
  class PointerEventShim extends MouseEvent {
    pointerId: number
    pointerType: string
    constructor(type: string, init: PointerEventInit = {}) {
      super(type, init)
      this.pointerId = init.pointerId ?? 1
      this.pointerType = init.pointerType ?? 'mouse'
    }
  }
  ;(window as unknown as { PointerEvent: unknown }).PointerEvent = PointerEventShim
}

// --- the traps a speller falls into -------------------------------------------

describe('believable wrong letters', () => {
  it('offers the half of a double that a speller skips', () => {
    // After "bal", reaching straight for the "o" spells "balon".
    expect(likelySlips('balloon', 3)[0]).toBe('o')
  })

  it('offers the double that isn’t there', () => {
    // "hopping" for "hoping" — the most common doubling slip of all.
    expect(likelySlips('hoping', 3)[0]).toBe('p')
  })

  it('swaps a vowel for another vowel', () => {
    for (const slip of likelySlips('cat', 1)) expect('aeiou').toContain(slip)
  })

  it('never offers the right letter, or the same wrong one twice', () => {
    for (const w of ['balloon', 'necessary', 'rhythm', 'cat', 'february']) {
      for (let i = 0; i < w.length; i++) {
        const traps = letterTraps(w, i, 3)
        expect(traps).toHaveLength(3)
        expect(traps).not.toContain(w[i])
        expect(new Set(traps).size).toBe(3)
      }
    }
  })
})

// --- Caterpillar Crawl --------------------------------------------------------

const garden = (body: [number, number][], dir: Dir, leaves: { at: [number, number]; right: boolean }[] = [], queued: Dir | null = null): Garden => ({
  body: body.map(([x, y]) => ({ x, y })),
  dir,
  queued,
  leaves: leaves.map((l, i) => ({ id: i + 1, x: l.at[0], y: l.at[1], letter: 'abc'[i], right: l.right })),
})

const apart = (a: Cell, b: Cell) => {
  const dx = Math.abs(a.x - b.x)
  const dy = Math.abs(a.y - b.y)
  return Math.min(dx, COLS - dx) + Math.min(dy, ROWS - dy)
}

describe('Caterpillar Crawl: the rules', () => {
  it('grows when it munches the right letter', () => {
    const { garden: next, munched } = crawlOnce(garden([[2, 2]], 'right', [{ at: [3, 2], right: true }]))
    expect(munched?.right).toBe(true)
    expect(next.body).toEqual([{ x: 3, y: 2 }, { x: 2, y: 2 }])
    expect(next.leaves).toEqual([])
  })

  it('eats a wrong letter without growing', () => {
    const { garden: next, munched } = crawlOnce(garden([[2, 2]], 'right', [{ at: [3, 2], right: false }]))
    expect(munched?.right).toBe(false)
    expect(next.body).toEqual([{ x: 3, y: 2 }])
    expect(next.leaves).toEqual([])
  })

  it('will not turn back into its own body', () => {
    const { garden: next } = crawlOnce(garden([[2, 2], [1, 2]], 'right', [], 'left'))
    expect(next.body[0]).toEqual({ x: 3, y: 2 })
    expect(next.dir).toBe('right')
  })

  it('can turn right round while it is only a head', () => {
    const { garden: next } = crawlOnce(garden([[2, 2]], 'right', [], 'left'))
    expect(next.body[0]).toEqual({ x: 1, y: 2 })
  })

  it('has no walls — off one edge is onto the other', () => {
    expect(stepFrom({ x: COLS - 1, y: 0 }, 'right')).toEqual({ x: 0, y: 0 })
    expect(stepFrom({ x: 0, y: 0 }, 'up')).toEqual({ x: 0, y: ROWS - 1 })
  })

  it('never grows a letter under the caterpillar, beside its head, or touching another', () => {
    const body = [{ x: 4, y: 3 }, { x: 3, y: 3 }, { x: 2, y: 3 }, { x: 2, y: 4 }, { x: 2, y: 5 }]
    for (let n = 0; n < 50; n++) {
      const leaves = plant(body, [
        { letter: 'c', right: true },
        { letter: 'k', right: false },
        { letter: 's', right: false },
      ])
      expect(leaves).toHaveLength(3)
      expect(leaves.filter((l) => l.right)).toHaveLength(1)
      for (const l of leaves) {
        expect(body.some((b) => b.x === l.x && b.y === l.y)).toBe(false)
        expect(apart(l, body[0])).toBeGreaterThanOrEqual(3)
        for (const other of leaves) if (other !== l) expect(apart(l, other)).toBeGreaterThanOrEqual(2)
      }
    }
  })
})

const DIRS: Dir[] = ['up', 'down', 'left', 'right']
const BACK: Record<Dir, Dir> = { up: 'down', down: 'up', left: 'right', right: 'left' }
const ARROW: Record<Dir, string> = { up: 'Crawl up', down: 'Crawl down', left: 'Crawl left', right: 'Crawl right' }

/** Where things are in the garden, read off the screen. */
const readGarden = (root: HTMLElement) => {
  const head = root.querySelector('[data-head]')!
  return {
    head: { x: Number(head.getAttribute('data-x')), y: Number(head.getAttribute('data-y')) },
    dir: head.getAttribute('data-dir') as Dir,
    leaves: [...root.querySelectorAll('[data-leaf]')].map((el) => ({
      x: Number(el.getAttribute('data-x')),
      y: Number(el.getAttribute('data-y')),
      letter: (el.getAttribute('aria-label') ?? '').replace('leaf ', ''),
    })),
  }
}

/** The shortest crawl to `target` that brushes no other leaf. */
const routeTo = (from: Cell, dir: Dir, canTurnBack: boolean, target: Cell, avoid: Cell[]): Dir[] => {
  const seen = new Set<string>()
  const queue: { at: Cell; dir: Dir; path: Dir[] }[] = [{ at: from, dir, path: [] }]
  while (queue.length) {
    const step = queue.shift()!
    for (const next of DIRS) {
      if (next === BACK[step.dir] && !(canTurnBack && step.path.length === 0)) continue
      const to = stepFrom(step.at, next)
      if (avoid.some((a) => a.x === to.x && a.y === to.y)) continue
      if (to.x === target.x && to.y === target.y) return [...step.path, next]
      const k = `${to.x},${to.y},${next}`
      if (seen.has(k)) continue
      seen.add(k)
      queue.push({ at: to, dir: next, path: [...step.path, next] })
    }
  }
  throw new Error('no way through the garden')
}

describe('Caterpillar Crawl: playing it', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('shows one blank per letter, and grows the next letter among two decoys', () => {
    const { container } = wrap(<CaterpillarCrawl words={[word('cat')]} rounds={1} onComplete={() => {}} />)
    const strip = screen.getByLabelText('The letters munched so far')
    expect(strip.children).toHaveLength(3)
    expect(strip.textContent).toBe('')
    const { leaves } = readGarden(container)
    expect(leaves).toHaveLength(3)
    expect(leaves.filter((l) => l.letter === 'c')).toHaveLength(1)
  })

  it('waits for the child before it crawls anywhere', () => {
    const { container } = wrap(<CaterpillarCrawl words={[word('cat')]} rounds={1} onComplete={() => {}} />)
    const start = readGarden(container).head
    act(() => { vi.advanceTimersByTime(3000) })
    expect(readGarden(container).head).toEqual(start)

    fireEvent.click(button('Crawl up'))
    act(() => { vi.advanceTimersByTime(420) })
    expect(readGarden(container).head).toEqual(stepFrom(start, 'up'))
  })

  it('stays put while paused', () => {
    const { container } = wrap(<CaterpillarCrawl words={[word('cat')]} rounds={1} onComplete={() => {}} />)
    fireEvent.click(button('Crawl down'))
    fireEvent.click(button('Pause'))
    const at = readGarden(container).head
    act(() => { vi.advanceTimersByTime(3000) })
    expect(readGarden(container).head).toEqual(at)
    expect(screen.getByText(/Paused/)).toBeInTheDocument()
  })

  it('munches its way through a word, turns into a butterfly and finishes', () => {
    const onComplete = vi.fn()
    const { container } = wrap(<CaterpillarCrawl words={[word('cat')]} rounds={1} onComplete={onComplete} />)

    for (let eaten = 0; eaten < 3; eaten++) {
      const g = readGarden(container)
      const target = g.leaves.find((l) => l.letter === 'cat'[eaten])!
      const path = routeTo(g.head, g.dir, eaten === 0, target, g.leaves.filter((l) => l !== target))
      for (const dir of path) {
        fireEvent.click(button(ARROW[dir]))
        act(() => { vi.advanceTimersByTime(420) })
      }
      // Each letter it eats joins the word at the top, and makes it longer.
      expect(screen.getByLabelText('The letters munched so far').textContent).toBe('cat'.slice(0, eaten + 1))
      expect(container.querySelector('[data-head]')?.getAttribute('data-length')).toBe(String(eaten + 2))
    }

    expect(screen.getByText(/it turned into a butterfly/)).toBeInTheDocument()
    expect(onComplete).not.toHaveBeenCalled()
    act(() => { vi.advanceTimersByTime(2300) })
    // Three letters at 5, 20 for the word, 15 for never munching a wrong one.
    expect(onComplete).toHaveBeenCalledWith(50)
    expect(onComplete).toHaveBeenCalledTimes(1)
  })

  it('steers only with the finger that started the swipe', () => {
    // Two children share one iPad: a second finger landing mid-swipe used to
    // restart the swipe from where it touched.
    installPointerEvent()
    const { container } = wrap(<CaterpillarCrawl words={[word('cat')]} rounds={1} onComplete={() => {}} />)
    const garden = screen.getByLabelText('The garden')
    const start = readGarden(container).head

    fireEvent.pointerDown(garden, { pointerId: 1, pointerType: 'touch', clientX: 100, clientY: 100 })
    fireEvent.pointerDown(garden, { pointerId: 2, pointerType: 'touch', clientX: 300, clientY: 100 })
    // The sibling's finger lifts after sliding right: not a swipe of its own.
    fireEvent.pointerUp(garden, { pointerId: 2, pointerType: 'touch', clientX: 400, clientY: 100 })
    fireEvent.pointerUp(garden, { pointerId: 1, pointerType: 'touch', clientX: 100, clientY: 200 })
    act(() => { vi.advanceTimersByTime(420) })

    expect(readGarden(container).head).toEqual(stepFrom(start, 'down'))
  })

  it('says so plainly when there are no words to play with', () => {
    const onComplete = vi.fn()
    wrap(<CaterpillarCrawl words={[]} onComplete={onComplete} />)
    expect(screen.getByText(/No leaves to munch yet/)).toBeInTheDocument()
    expect(onComplete).not.toHaveBeenCalled()
  })
})

// --- Spell-Tac-Toe -------------------------------------------------------------

const board = (s: string): Mark[] => [...s].map((c) => (c === 'x' ? 'you' : c === 'o' ? 'bot' : null))

describe('Spell-Tac-Toe: the rules', () => {
  it('spots three in a row across, down and corner to corner', () => {
    expect(threeInARow(board('xxx......'))?.who).toBe('you')
    expect(threeInARow(board('o..o..o..'))?.line).toEqual([0, 3, 6])
    expect(threeInARow(board('..x.x.x..'))?.line).toEqual([2, 4, 6])
    expect(threeInARow(board('xo.ox....'))).toBeNull()
  })

  it('takes a win when it sees one', () => {
    expect(botMove(board('oo.xx....'), () => 0)).toBe(2)
  })

  it('blocks the child’s row when it has no win of its own', () => {
    expect(botMove(board('xx..o....'), () => 0)).toBe(2)
  })

  it('only ever plays an empty square, and gives up on a full board', () => {
    for (let n = 0; n < 200; n++) {
      const cells = board([...'xo.......'].sort(() => Math.random() - 0.5).join(''))
      const move = botMove(cells)
      expect(cells[move]).toBeNull()
    }
    expect(botMove(board('xoxxoxoxo'))).toBe(-1)
  })
})

describe('Spell-Tac-Toe: playing it', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    h.record.mockClear()
  })
  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  const spell = (text: string) => {
    const box = screen.getByLabelText('Spell the word')
    fireEvent.change(box, { target: { value: text } })
    fireEvent.keyPress(box, { key: 'Enter', code: 'Enter', charCode: 13 })
  }

  it('claims a square for a word spelled right', () => {
    wrap(<SpellTacToe words={[word('cat')]} onComplete={() => {}} />)
    // Nothing to spell until a square is chosen.
    expect(screen.queryByLabelText('Spell the word')).not.toBeInTheDocument()

    fireEvent.click(button('Square 5: empty'))
    spell('cat')
    expect(button('Square 5: your star')).toBeInTheDocument()
    // Typed from the sound alone, so the review schedule hears about it.
    expect(h.record).toHaveBeenCalledWith('cat', true)
  })

  it('leaves the square empty and shows the word when it is misspelled', () => {
    wrap(<SpellTacToe words={[word('cat')]} onComplete={() => {}} />)
    fireEvent.click(button('Square 5: empty'))
    spell('kat')
    expect(screen.getByText(/It was “cat”/)).toBeInTheDocument()
    expect(button('Square 5: empty')).toBeInTheDocument()
    expect(h.record).toHaveBeenCalledWith('cat', false)
  })

  it('lets the mascot take its turn, then hands the board back', () => {
    wrap(<SpellTacToe words={[word('cat')]} onComplete={() => {}} />)
    fireEvent.click(button('Square 1: empty'))
    spell('cat')
    act(() => { vi.advanceTimersByTime(2100) })
    expect(screen.getAllByRole('button', { name: /taken by/ })).toHaveLength(1)
    expect(screen.getByText(/Your turn!/)).toBeInTheDocument()
  })

  it('pays out for three in a row', () => {
    // A mascot that never blocks and always plays the last free square.
    vi.spyOn(Math, 'random').mockReturnValue(0.99)
    const onComplete = vi.fn()
    wrap(<SpellTacToe words={[word('cat')]} onComplete={onComplete} />)

    for (const square of [1, 2, 3]) {
      fireEvent.click(button(`Square ${square}: empty`))
      spell('cat')
      act(() => { vi.advanceTimersByTime(2100) })
    }

    expect(screen.getByText(/you win/)).toBeInTheDocument()
    act(() => { vi.advanceTimersByTime(2700) })
    // Three words at 20 + 2 per letter, and 100 for the win.
    expect(onComplete).toHaveBeenCalledWith(178)
    expect(onComplete).toHaveBeenCalledTimes(1)
  })

  it('says so plainly when there are no words to play with', () => {
    const onComplete = vi.fn()
    wrap(<SpellTacToe words={[]} onComplete={onComplete} />)
    expect(screen.getByText(/No words to play with yet/)).toBeInTheDocument()
    expect(onComplete).not.toHaveBeenCalled()
  })
})

// --- Criss-Cross ---------------------------------------------------------------

describe('Criss-Cross', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  const CAT = word('cat', 'A small furry pet that purrs')
  const TAP = word('tap', 'Turn it on to get water')
  const type = (letters: string) => [...letters].forEach((ch) => fireEvent.click(button(ch)))

  it('fills a word in from its clue and marks it solved', () => {
    wrap(<CrissCross words={[CAT, TAP]} onComplete={() => {}} />)
    expect(screen.getByText('0/2')).toBeInTheDocument()

    fireEvent.click(button(/small furry pet/))
    type('cat')
    expect(screen.getByText('1/2')).toBeInTheDocument()
    // Clue alone: 10 + 3 a letter, and 15 for never hearing it.
    expect(screen.getByText(/“cat” — \+34/)).toBeInTheDocument()
  })

  it('lets a child type the whole of a crossing word, given letter and all', () => {
    // Whichever letter "tap" shares with "cat", typing all three letters from
    // the start must land each one in its own square.
    const onComplete = vi.fn()
    wrap(<CrissCross words={[CAT, TAP]} onComplete={onComplete} />)
    fireEvent.click(button(/small furry pet/))
    type('cat')
    fireEvent.click(button(/get water/))
    type('tap')
    expect(screen.getByText('2/2')).toBeInTheDocument()

    act(() => { vi.advanceTimersByTime(2100) })
    expect(onComplete).toHaveBeenCalledWith(68)
    expect(onComplete).toHaveBeenCalledTimes(1)
  })

  /** The letters showing in a clue's squares, read off the grid. */
  const lettersIn = (count: number) =>
    screen.getAllByRole('button', { name: /^Row \d+, column \d+: / })
      .map((b) => b.getAttribute('aria-label')!.split(': ')[1])
      .filter((l) => l !== 'empty')
      .slice(0, count)
      .join('')

  it('writes the word in after three wrong tries, for no points', () => {
    wrap(<CrissCross words={[CAT, TAP]} onComplete={() => {}} />)
    fireEvent.click(button(/small furry pet/))
    for (const attempt of ['cot', 'cut', 'kat']) {
      type(attempt)
      act(() => { vi.advanceTimersByTime(800) })
    }
    expect(screen.getByText(/It was “cat”/)).toBeInTheDocument()
    expect(screen.getByText('1/2')).toBeInTheDocument()
  })

  it('clears a wrong word for a fresh try, rather than marking every letter of a fix', () => {
    // Left up, "kog" would be marked again at each letter changed while fixing
    // it — "cog", then "cag" — and the answer given away mid-correction.
    const onComplete = vi.fn()
    wrap(<CrissCross words={[CAT, TAP]} onComplete={onComplete} />)
    fireEvent.click(button(/small furry pet/))
    type('kat')
    expect(screen.getByText(/Not quite/)).toBeInTheDocument()
    // While the wrong word is still showing, keys wait.
    type('c')
    act(() => { vi.advanceTimersByTime(800) })
    expect(lettersIn(3)).toBe('')

    type('cat')
    expect(screen.getByText(/“cat” — \+34/)).toBeInTheDocument()
    expect(screen.queryByText(/It was “cat”/)).not.toBeInTheDocument()
  })

  it('never lets one clue spell out another answer', () => {
    const PET = word('pet', 'An animal like a cat or a dog kept at home')
    const SMALL_CAT = word('cat', 'A small furry pet that purrs')
    wrap(<CrissCross words={[SMALL_CAT, PET]} onComplete={() => {}} />)
    expect(button(/An animal like a ____ or a dog kept at home/)).toBeInTheDocument()
    expect(button(/A small furry ____ that purrs/)).toBeInTheDocument()
  })

  it('costs the bonus to hear the word read out', () => {
    wrap(<CrissCross words={[CAT, TAP]} onComplete={() => {}} />)
    fireEvent.click(button(/small furry pet/))
    fireEvent.click(button(/Hear the word/))
    type('cat')
    expect(screen.getByText(/“cat” — \+19/)).toBeInTheDocument()
  })

  it('takes letters from a real keyboard too', () => {
    wrap(<CrissCross words={[CAT, TAP]} onComplete={() => {}} />)
    fireEvent.click(button(/small furry pet/))
    for (const key of ['c', 'x', 'Backspace', 'a', 't']) fireEvent.keyDown(window, { key })
    expect(screen.getByText('1/2')).toBeInTheDocument()
  })

  it('says so plainly when there are no words to play with', () => {
    const onComplete = vi.fn()
    wrap(<CrissCross words={[]} onComplete={onComplete} />)
    expect(screen.getByText(/No words to cross yet/)).toBeInTheDocument()
    expect(onComplete).not.toHaveBeenCalled()
  })
})

// --- Word Jigsaw ------------------------------------------------------------------

describe('Word Jigsaw: the pieces', () => {
  afterEach(() => vi.restoreAllMocks())

  it('cuts a word into the chunks LearnMode teaches', () => {
    expect(piecesFor('caterpillar')).toEqual(['ca', 'ter', 'pil', 'lar'])
    for (const w of ['balloon', 'necessary', 'February', 'tree', 'rhythm', 'elephant', 'egg', 'cry']) {
      const pieces = piecesFor(w)
      expect(pieces.length).toBeGreaterThanOrEqual(2)
      expect(pieces.join('')).toBe(w.toLowerCase())
    }
  })

  it('splits a one-beat word the way phonics does, keeping letter teams whole', () => {
    // Not "stu·ck" or "fi·sh": the ck and the sh are one sound each.
    expect(piecesFor('stuck')).toEqual(['st', 'uck'])
    expect(piecesFor('fish')).toEqual(['f', 'ish'])
    expect(piecesFor('brown')).toEqual(['br', 'own'])
    // A y that starts a word is a consonant, and qu is one sound.
    expect(piecesFor('yawn')).toEqual(['y', 'awn'])
    expect(piecesFor('quilt')).toEqual(['qu', 'ilt'])
    expect(piecesFor('squelch')).toEqual(['squ', 'elch'])
    // A word that opens on its vowel splits after the vowel sound.
    expect(piecesFor('egg')).toEqual(['e', 'gg'])
    expect(piecesFor('cat')).toEqual(['c', 'at'])
  })

  it('fakes the double that became single', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0)
    // "pil" + "ar" is "caterpilar" — one l short.
    expect(decoyFor(['ca', 'ter', 'pil', 'lar'], 3)).toBe('ar')
  })

  it('never fakes a piece that is really in the word', () => {
    for (const w of ['caterpillar', 'banana', 'balloon', 'necessary', 'cat']) {
      const pieces = piecesFor(w)
      for (let n = 0; n < 40; n++) {
        for (let k = 0; k < pieces.length; k++) {
          const fake = decoyFor(pieces, k)
          if (fake === null) continue
          expect(fake.length).toBeGreaterThan(0)
          expect(pieces).not.toContain(fake)
        }
      }
    }
  })
})

describe('Word Jigsaw: playing it', () => {
  beforeAll(installPointerEvent)
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  const piece = (text: string) => button(`Piece: ${text}`)
  const fakes = () =>
    screen.getAllByRole('button', { name: /^Piece: / }).filter(
      (b) => !['Piece: c', 'Piece: at'].includes(b.getAttribute('aria-label') ?? '')
    )

  it('builds the word from pieces tapped in order', () => {
    const onComplete = vi.fn()
    wrap(<WordJigsaw words={[word('cat')]} rounds={1} onComplete={onComplete} />)
    // The real pieces, and at least one fake among them.
    expect(fakes().length).toBeGreaterThanOrEqual(1)

    fireEvent.click(piece('c'))
    expect(screen.getByLabelText('Space 1 of 2: c')).toBeInTheDocument()
    fireEvent.click(piece('at'))
    expect(screen.getByText(/every piece in place/)).toBeInTheDocument()

    act(() => { vi.advanceTimersByTime(1800) })
    // Two pieces at 10, 20 for the word, 10 for no wrong pieces.
    expect(onComplete).toHaveBeenCalledWith(50)
  })

  it('sends a wrong piece back, and puts the word together after three', () => {
    const onComplete = vi.fn()
    wrap(<WordJigsaw words={[word('cat')]} rounds={1} onComplete={onComplete} />)
    const fake = fakes()[0]

    fireEvent.click(fake)
    expect(screen.getByLabelText('Space 1 of 2: empty')).toBeInTheDocument()
    expect(screen.getByLabelText('2 tries left on this word')).toBeInTheDocument()

    fireEvent.click(fake)
    fireEvent.click(fake)
    expect(screen.getByText(/It was “cat”/)).toBeInTheDocument()
    expect(screen.getByLabelText('Space 1 of 2: c')).toBeInTheDocument()
    expect(screen.getByLabelText('Space 2 of 2: at')).toBeInTheDocument()

    act(() => { vi.advanceTimersByTime(1800) })
    expect(onComplete).toHaveBeenCalledWith(0)
  })

  it('drops a dragged piece into the space it is let go over', () => {
    wrap(<WordJigsaw words={[word('cat')]} rounds={1} onComplete={() => {}} />)
    // Put the second space somewhere real; jsdom lays nothing out.
    const second = screen.getByLabelText('Space 2 of 2: empty')
    vi.spyOn(second, 'getBoundingClientRect').mockReturnValue({
      left: 200, right: 260, top: 100, bottom: 150, width: 60, height: 50, x: 200, y: 100, toJSON: () => ({}),
    } as DOMRect)

    const at = piece('at')
    fireEvent.pointerDown(at, { clientX: 20, clientY: 300, pointerId: 1, button: 0 })
    fireEvent.pointerMove(at, { clientX: 150, clientY: 200, pointerId: 1 })
    fireEvent.pointerUp(at, { clientX: 230, clientY: 120, pointerId: 1 })

    expect(screen.getByLabelText('Space 2 of 2: at')).toBeInTheDocument()
    expect(screen.getByLabelText('Space 1 of 2: empty')).toBeInTheDocument()
  })

  it('keeps a drag with the finger that started it when a second finger lands', () => {
    // Siblings share the iPad: a second touch mid-drag must neither steal the
    // piece nor leave the first one stranded mid-air.
    wrap(<WordJigsaw words={[word('cat')]} rounds={1} onComplete={() => {}} />)
    const second = screen.getByLabelText('Space 2 of 2: empty')
    vi.spyOn(second, 'getBoundingClientRect').mockReturnValue({
      left: 200, right: 260, top: 100, bottom: 150, width: 60, height: 50, x: 200, y: 100, toJSON: () => ({}),
    } as DOMRect)
    const at = piece('at')
    const c = piece('c')

    fireEvent.pointerDown(at, { clientX: 20, clientY: 300, pointerId: 1, button: 0 })
    fireEvent.pointerMove(at, { clientX: 150, clientY: 200, pointerId: 1 })
    fireEvent.pointerDown(c, { clientX: 90, clientY: 300, pointerId: 2, button: 0 })
    fireEvent.pointerMove(c, { clientX: 400, clientY: 500, pointerId: 2 })
    fireEvent.pointerUp(c, { clientX: 400, clientY: 500, pointerId: 2 })
    fireEvent.click(c) // the second finger's tap, mid-drag
    fireEvent.pointerUp(at, { clientX: 230, clientY: 120, pointerId: 1 })

    expect(screen.getByLabelText('Space 2 of 2: at')).toBeInTheDocument()
    expect(screen.getByLabelText('Space 1 of 2: empty')).toBeInTheDocument()
    expect(c.className).not.toContain('dragging')
  })

  it('lets a piece dropped away from any space slide home at no cost', () => {
    wrap(<WordJigsaw words={[word('cat')]} rounds={1} onComplete={() => {}} />)
    const c = piece('c')
    fireEvent.pointerDown(c, { clientX: 20, clientY: 300, pointerId: 1, button: 0 })
    fireEvent.pointerMove(c, { clientX: 400, clientY: 500, pointerId: 1 })
    fireEvent.pointerUp(c, { clientX: 400, clientY: 500, pointerId: 1 })

    expect(screen.getByLabelText('Space 1 of 2: empty')).toBeInTheDocument()
    expect(screen.getByLabelText('3 tries left on this word')).toBeInTheDocument()
    expect(piece('c')).toBeInTheDocument()
  })

  it('says so plainly when there are no words to play with', () => {
    const onComplete = vi.fn()
    wrap(<WordJigsaw words={[]} onComplete={onComplete} />)
    expect(screen.getByText(/No puzzles in the box yet/)).toBeInTheDocument()
    expect(onComplete).not.toHaveBeenCalled()
  })
})

// These timing regressions cover challenge mode; relaxed mode has its own tests.
beforeEach(() => setPreferences({ relaxed: false, waitForMe: false }))
