import React from 'react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act, within } from '@testing-library/react'

// vi.mock is hoisted above everything, so what it uses must be hoisted too.
const h = vi.hoisted(() => {
  const noSound = {
    tap: () => {}, pop: () => {}, correct: () => {}, wrong: () => {},
    win: () => {}, applause: () => {}, worldJingle: () => {},
    star: () => {}, whoosh: () => {}, thud: () => {}, fanfare: () => {},
  }
  return { noSound, record: vi.fn(), speak: vi.fn() }
})
vi.mock('@/components/games/shared/sfx', () => ({
  default: h.noSound,
  sfx: h.noSound,
  setWorldSoundProfile: () => {},
}))
vi.mock('@/services/progress/ReviewSchedule', () => ({
  default: { record: h.record },
  ReviewSchedule: { record: h.record },
}))
// What the game says is what a child hears — Bee Bingo's call is never shown.
vi.mock('@/contexts/AudioContext', () => ({
  useAudio: () => ({ speak: h.speak }),
  AudioProvider: ({ children }: { children: React.ReactNode }) => children,
}))

import WordLock, { markTry } from '@/components/games/WordLock'
import BeeBingo, { makeCard, bingoLine, isRealWord, FREE, LINES } from '@/components/games/BeeBingo'
import HoneyFlight, { flyOnce, makeGate, BEE_X, START_X, LANES, type Sky } from '@/components/games/HoneyFlight'

const word = (w: string, meaning = `the meaning of ${w}`) => ({
  id: w,
  word: w,
  meaning,
  sentence: `A ${w} appeared.`,
  difficulty: 1 as const,
  category: 'test',
})

const button = (name: string | RegExp) => screen.getByRole('button', { name })

beforeEach(() => {
  h.record.mockClear()
  h.speak.mockClear()
})

// --- Word Lock ------------------------------------------------------------------

describe('Word Lock: marking a try', () => {
  it('marks right place, somewhere else and not in the word', () => {
    expect(markTry('tac', 'cat')).toEqual(['near', 'right', 'near'])
    expect(markTry('dog', 'cat')).toEqual(['out', 'out', 'out'])
  })

  it('never counts a letter more times than the word has it', () => {
    // Two l's in "hello", both already in place: the other three are spare.
    expect(markTry('lllll', 'hello')).toEqual(['out', 'out', 'right', 'right', 'out'])
    // One spare "a" in "apple": only the first stray "a" gets it.
    expect(markTry('papal', 'apple')).toEqual(['near', 'near', 'right', 'out', 'near'])
  })
})

describe('Word Lock: playing it', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  const typeWord = (text: string) => {
    for (const ch of text) fireEvent.click(button(ch))
  }

  it('asks for the whole word before a try can be checked', () => {
    render(<WordLock words={[word('cat')]} rounds={1} onComplete={() => {}} />)
    expect(h.speak).toHaveBeenCalledWith('cat')
    typeWord('ca')
    expect(button(/Try it/)).toBeDisabled()
    typeWord('t')
    expect(button(/Try it/)).toBeEnabled()
  })

  it('shows how each letter fits, then opens on a later try', () => {
    const onComplete = vi.fn()
    render(<WordLock words={[word('cat')]} rounds={1} onComplete={onComplete} />)

    typeWord('tac')
    fireEvent.click(button(/Try it/))
    const first = screen.getByLabelText('Try 1')
    expect(within(first).getByLabelText('a: in the right place')).toBeInTheDocument()
    expect(within(first).getByLabelText('t: in the word, somewhere else')).toBeInTheDocument()
    // Only the first try is a clean recall; it went in as a miss.
    expect(h.record).toHaveBeenCalledTimes(1)
    expect(h.record).toHaveBeenCalledWith('cat', false)

    typeWord('cat')
    fireEvent.click(button(/Try it/))
    expect(screen.getByText(/unlocked!/)).toBeInTheDocument()
    expect(h.record).toHaveBeenCalledTimes(1)

    act(() => { vi.advanceTimersByTime(2100) })
    // Opened on the second try.
    expect(onComplete).toHaveBeenCalledWith(45)
    expect(onComplete).toHaveBeenCalledTimes(1)
  })

  it('takes the real keyboard too, and scores most for a first-try open', () => {
    const onComplete = vi.fn()
    render(<WordLock words={[word('cat')]} rounds={1} onComplete={onComplete} />)
    for (const key of ['c', 'a', 'x', 'Backspace', 't', 'Enter']) fireEvent.keyDown(window, { key })
    expect(h.record).toHaveBeenCalledWith('cat', true)
    act(() => { vi.advanceTimersByTime(2100) })
    expect(onComplete).toHaveBeenCalledWith(60)
  })

  it('opens the lock for them after five tries, keeping a little for letters in place', () => {
    const onComplete = vi.fn()
    render(<WordLock words={[word('cat')]} rounds={1} onComplete={onComplete} />)
    for (let t = 0; t < 5; t++) {
      typeWord('cot')
      fireEvent.click(button(/Try it/))
    }
    expect(screen.getByText(/It was “cat”/)).toBeInTheDocument()
    expect(screen.getByLabelText('The word').textContent).toBe('cat')
    act(() => { vi.advanceTimersByTime(2100) })
    // "c" and "t" were in place: three points each.
    expect(onComplete).toHaveBeenCalledWith(6)
  })

  it('says so plainly when there are no words to play with', () => {
    const onComplete = vi.fn()
    render(<WordLock words={[]} onComplete={onComplete} />)
    expect(screen.getByText(/No locks to open yet/)).toBeInTheDocument()
    expect(onComplete).not.toHaveBeenCalled()
  })
})

// --- Bee Bingo ------------------------------------------------------------------

const seeded = (seed: number) => () => {
  seed = (seed * 16807) % 2147483647
  return (seed - 1) / 2147483646
}

describe('Bee Bingo: dealing a card', () => {
  const pools = [
    ['balloon', 'rabbit', 'kitten', 'summer'],
    ['tag', 'send', 'deck', 'stuck', 'snug'],
    ['happy', 'little', 'yellow', 'better', 'coffee', 'bottle', 'letter', 'dinner'],
  ]

  it('always deals nine squares, free in the middle, and a line with no misspelling', () => {
    for (const pool of pools) {
      for (let s = 1; s <= 40; s++) {
        const card = makeCard(pool.map((w) => word(w)), seeded(s))
        expect(card.squares).toHaveLength(9)
        expect(card.squares[FREE].kind).toBe('free')
        expect(LINES.some((line) => line.every((i) => card.squares[i].kind !== 'decoy'))).toBe(true)
      }
    }
  })

  it('calls every word on the card once, and only those', () => {
    const card = makeCard(pools[2].map((w) => word(w)), seeded(7))
    const onCard = card.squares.filter((s) => s.kind === 'word').map((s) => s.text)
    expect(onCard).toHaveLength(6)
    expect([...card.calls].sort()).toEqual([...onCard].sort())
  })

  it('never passes off a real word as a misspelling', () => {
    for (const pool of pools) {
      for (let s = 1; s <= 40; s++) {
        const card = makeCard(pool.map((w) => word(w)), seeded(s))
        for (const sq of card.squares.filter((q) => q.kind === 'decoy')) {
          expect(pool).not.toContain(sq.text)
          expect(isRealWord(sq.text)).toBe(false)
          expect(pool).toContain(sq.of)
        }
      }
    }
  })

  it('asks the dictionary about every misspelling before it goes on the card', () => {
    // "hopping" is one slip from "hoping", and a word in its own right. Here the
    // dictionary says every misspelling of "hoping" is a word, so none may appear.
    const asked: string[] = []
    const isWord = (t: string) => {
      asked.push(t)
      return t.startsWith('ho')
    }
    const card = makeCard(['hoping', 'rabbit', 'kitten', 'summer'].map((w) => word(w)), seeded(3), isWord)
    expect(asked.length).toBeGreaterThan(0)
    const decoys = card.squares.filter((q) => q.kind === 'decoy')
    expect(decoys).toHaveLength(4)
    for (const d of decoys) expect(d.text.startsWith('ho')).toBe(false)
  })

  it('finds a finished line, counting the free square', () => {
    expect(bingoLine(new Set([FREE, 3]))).toBeNull()
    expect(bingoLine(new Set([FREE, 3, 5]))).toEqual([3, 4, 5])
  })
})

describe('Bee Bingo: playing it', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  const lastCall = () => h.speak.mock.calls[h.speak.mock.calls.length - 1][0] as string
  const squares = () => screen.getAllByRole('button', { name: /^Square: / })

  it('marks the called word, and wins the card with a line', () => {
    const onComplete = vi.fn()
    const words = ['balloon', 'rabbit', 'kitten', 'summer', 'yellow', 'coffee'].map((w) => word(w))
    render(<BeeBingo words={words} rounds={1} onComplete={onComplete} />)

    let marks = 0
    for (let n = 0; n < 6 && !screen.queryByText(/BINGO/); n++) {
      const called = lastCall()
      fireEvent.click(button(`Square: ${called}`))
      marks += 1
      expect(button(`Square: ${called}, marked`)).toBeDisabled()
      act(() => { vi.advanceTimersByTime(1000) })
    }
    expect(screen.getByText(/BINGO/)).toBeInTheDocument()
    expect(onComplete).not.toHaveBeenCalled()

    act(() => { vi.advanceTimersByTime(2900) })
    // Ten a square, fifty for the line and twenty for never tapping wrong.
    expect(onComplete).toHaveBeenCalledWith(marks * 10 + 70)
    expect(onComplete).toHaveBeenCalledTimes(1)
  })

  it('catches a tap on a misspelling, then shows where the word is after three', () => {
    const words = ['balloon', 'rabbit', 'kitten', 'summer'].map((w) => word(w))
    const { container } = render(<BeeBingo words={words} rounds={1} onComplete={() => {}} />)
    const called = lastCall()
    const decoy = squares().find((b) => !words.some((w) => b.getAttribute('aria-label') === `Square: ${w.word}`))!
    expect(decoy).toBeTruthy()

    fireEvent.click(decoy)
    expect(screen.getByText(/spelled wrong/)).toBeInTheDocument()
    expect(decoy).toBeEnabled()
    fireEvent.click(decoy)
    fireEvent.click(decoy)
    const answer = button(`Square: ${called}`)
    expect(answer).toHaveClass('buzz')
    expect(container.querySelectorAll('.buzz')).toHaveLength(1)
  })

  it('turns the misspellings over once the card is won', () => {
    const words = ['balloon', 'rabbit', 'kitten', 'summer'].map((w) => word(w))
    const { container } = render(<BeeBingo words={words} rounds={1} onComplete={() => {}} />)
    for (let n = 0; n < 4 && !screen.queryByText(/BINGO/); n++) {
      fireEvent.click(button(`Square: ${lastCall()}`))
      act(() => { vi.advanceTimersByTime(1000) })
    }
    const turned = container.querySelectorAll('.bb-turned')
    expect(turned.length).toBe(4)
    turned.forEach((t) => expect(words.map((w) => w.word)).toContain(t.querySelector('span')!.textContent))
  })

  it('says so plainly when there are no words to play with', () => {
    const onComplete = vi.fn()
    render(<BeeBingo words={[]} onComplete={onComplete} />)
    expect(screen.getByText(/No bingo cards yet/)).toBeInTheDocument()
    expect(onComplete).not.toHaveBeenCalled()
  })
})

// --- Honey Flight ---------------------------------------------------------------

describe('Honey Flight: the rules', () => {
  it('grows a row of three flowers: the right letter and two believable slips', () => {
    for (let i = 0; i < 7; i++) {
      const gate = makeGate('balloon', i)
      expect(gate.letters).toHaveLength(LANES)
      expect(new Set(gate.letters).size).toBe(LANES)
      expect(gate.letters[gate.right]).toBe('balloon'[i])
      expect(gate.x).toBe(START_X)
    }
  })

  it('drifts the flowers in, and flies the bee through the one in its lane', () => {
    const gate = { id: 1, x: BEE_X + 5, letters: ['a', 'b', 'c'], right: 2 }
    const sky: Sky = { lane: 2, gate }
    const moved = flyOnce(sky, 3)
    expect(moved.through).toBeNull()
    expect(moved.sky.gate!.x).toBe(BEE_X + 2)

    expect(flyOnce(moved.sky, 3)).toEqual({ sky: { lane: 2, gate: null }, through: { lane: 2, right: true } })
    expect(flyOnce({ lane: 0, gate }, 10).through).toEqual({ lane: 0, right: false })
  })
})

describe('Honey Flight: playing it', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  const PACE = 500
  const laneOf = (container: HTMLElement, letter: string) =>
    Number(
      [...container.querySelectorAll('[data-flower]')]
        .find((f) => f.textContent?.endsWith(letter))!
        .getAttribute('data-lane')
    )
  const flowerX = (container: HTMLElement) =>
    (container.querySelector('[data-flower]') as HTMLElement | null)?.style.left

  it('waits for the child before any flowers move', () => {
    const { container } = render(<HoneyFlight words={[word('cat')]} rounds={1} pace={PACE} onComplete={() => {}} />)
    const start = flowerX(container)
    act(() => { vi.advanceTimersByTime(3000) })
    expect(flowerX(container)).toBe(start)
    expect(screen.getByText(/to start flying/)).toBeInTheDocument()
  })

  it('collects a word letter by letter and fills a honey jar', () => {
    const onComplete = vi.fn()
    const { container } = render(<HoneyFlight words={[word('cat')]} rounds={1} pace={PACE} onComplete={onComplete} />)

    for (let i = 0; i < 3; i++) {
      fireEvent.click(button(`Fly to lane ${laneOf(container, 'cat'[i]) + 1}`))
      act(() => { vi.advanceTimersByTime(PACE + 100) })
      expect(screen.getByLabelText('The letters collected so far').textContent).toBe('cat'.slice(0, i + 1))
    }

    expect(screen.getByText(/a whole jar of honey/)).toBeInTheDocument()
    act(() => { vi.advanceTimersByTime(2300) })
    // Three letters at 5, 20 for the word, 15 for never missing.
    expect(onComplete).toHaveBeenCalledWith(50)
    expect(onComplete).toHaveBeenCalledTimes(1)
  })

  it('brings a missed letter round again, and shows the word after three misses', () => {
    const onComplete = vi.fn()
    const { container } = render(<HoneyFlight words={[word('cat')]} rounds={1} pace={PACE} onComplete={onComplete} />)

    for (let miss = 0; miss < 3; miss++) {
      const wrong = [0, 1, 2].find((l) => l !== laneOf(container, 'c'))!
      fireEvent.click(button(`Fly to lane ${wrong + 1}`))
      act(() => { vi.advanceTimersByTime(PACE + 100) })
      expect(screen.getByLabelText('The letters collected so far').textContent).toBe(miss < 2 ? '' : 'cat')
    }

    expect(screen.getByText(/It was “cat”/)).toBeInTheDocument()
    act(() => { vi.advanceTimersByTime(2300) })
    expect(onComplete).toHaveBeenCalledWith(0)
  })

  it('says so plainly when there are no words to play with', () => {
    const onComplete = vi.fn()
    render(<HoneyFlight words={[]} onComplete={onComplete} />)
    expect(screen.getByText(/No flowers in bloom yet/)).toBeInTheDocument()
    expect(onComplete).not.toHaveBeenCalled()
  })
})
