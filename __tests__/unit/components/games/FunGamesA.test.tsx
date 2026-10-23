import { setPreferences } from '@/services/preferences'
import React from 'react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'

// vi.mock is hoisted above everything, so what it uses must be hoisted too.
const h = vi.hoisted(() => {
  const sfx = {
    tap: vi.fn(), pop: vi.fn(), correct: vi.fn(), wrong: vi.fn(), win: vi.fn(), star: vi.fn(),
    whoosh: vi.fn(), thud: vi.fn(), applause: vi.fn(), fanfare: vi.fn(), worldJingle: vi.fn(),
  }
  /** The "word bank": only answers "is this a word?" for the games, never supplies one. */
  const bank = { words: [] as string[] }
  return { sfx, bank, record: vi.fn(), speak: vi.fn() }
})
vi.mock('@/components/games/shared/sfx', () => ({
  default: h.sfx,
  sfx: h.sfx,
  setWorldSoundProfile: () => {},
}))
vi.mock('@/services/progress/ReviewSchedule', () => ({
  default: { record: h.record },
  ReviewSchedule: { record: h.record },
}))
// What a game says is what a child hears.
vi.mock('@/contexts/AudioContext', () => ({
  useAudio: () => ({ speak: h.speak }),
  AudioProvider: ({ children }: { children: React.ReactNode }) => children,
}))
vi.mock('@/services/wordBank', () => ({
  wordBank: {
    getAllWords: () => h.bank.words.map((w) => ({ word: w })),
    getWordByWord: (w: string) => (h.bank.words.includes(w.trim().toLowerCase()) ? { word: w } : undefined),
  },
}))

import MissingLetter, { makePuzzle } from '@/components/games/MissingLetter'
import SpellingCheck, { buildOptions } from '@/components/games/SpellingCheck'
import WordBuilder, { pointsFor as builderPoints } from '@/components/games/WordBuilder'
import { COMMON_WORDS } from '@/components/games/WordChef/commonWords'
import RescueTheBee, { livesFor } from '@/components/games/RescueTheBee'
import WordSearch, { buildPuzzle, DIRS } from '@/components/games/WordSearch'
import BeeCatch, { makeBees } from '@/components/games/BeeCatch'
import WordChef, { makeKitchen } from '@/components/games/WordChef'
import AbcOrder from '@/components/games/AbcOrder'
import TypoDetective, { buildCase, pointsForTry } from '@/components/games/TypoDetective'
import MemoryMatch, { shortClue, memoryBonus } from '@/components/games/MemoryMatch'
import WordRace, { fallOnce, GROUND, type Faller } from '@/components/games/WordRace'
import { isRealWord } from '@/components/games/shared/realWords'

const word = (w: string, meaning = `the meaning of ${w}`, sentence = `A ${w} appeared.`) => ({
  id: w,
  word: w,
  meaning,
  sentence,
  difficulty: 1 as const,
  category: 'test',
})

const button = (name: string | RegExp) => screen.getByRole('button', { name })
const wait = (ms: number) => act(() => { vi.advanceTimersByTime(ms) })
/** Everything the game said, as one string per call. */
const said = () => h.speak.mock.calls.map((c) => String(c[0]))

beforeEach(() => {
  Object.values(h.sfx).forEach((f) => f.mockClear())
  h.speak.mockClear()
  h.record.mockClear()
  h.bank.words = []
  vi.useFakeTimers()
})
afterEach(() => {
  vi.useRealTimers()
})

// --- Missing Letter ---------------------------------------------------------------

describe('Missing Letter', () => {
  it('offers letters a speller would really reach for, never random ones', () => {
    for (let i = 0; i < 30; i++) {
      const p = makePuzzle(word('cat'))
      expect(p.missingIndex).toBe(1)
      expect(p.choices).toContain('a')
      expect(new Set(p.choices).size).toBe(4)
      // The traps for the "a" in "cat" are the other vowels, not "q" or "x".
      expect(p.choices.every((c) => 'aeiou'.includes(c))).toBe(true)
    }
  })

  it('after a miss the gap shows the RIGHT letter, says the word and lingers before moving on', () => {
    const onComplete = vi.fn()
    render(<MissingLetter words={[word('cat')]} rounds={1} onComplete={onComplete} />)
    expect(h.speak).toHaveBeenCalledWith('cat', expect.anything())

    // Any of the three traps — which vowels they are is random.
    const wrong = screen.getAllByRole('button').find((b) => b.className.includes('ml-choice') && b.textContent !== 'A')!
    fireEvent.click(wrong)
    const blank = screen.getByTestId('ml-blank')
    expect(blank).toHaveTextContent('A')
    expect(blank).toHaveClass('ok')
    expect(h.sfx.wrong).toHaveBeenCalled()
    expect(said().some((s) => s.includes('It was cat'))).toBe(true)
    expect(screen.getByRole('status')).toHaveTextContent(/It was “CAT”/)

    wait(1500)
    expect(onComplete).not.toHaveBeenCalled()
    wait(800)
    expect(onComplete).toHaveBeenCalledTimes(1)
    expect(onComplete).toHaveBeenCalledWith(0)
  })

  it('counts the last word’s points, with a cheer that is not always "Correct!"', () => {
    const onComplete = vi.fn()
    render(<MissingLetter words={[word('cat')]} rounds={1} onComplete={onComplete} />)
    fireEvent.click(button('a'))
    expect(h.sfx.correct).toHaveBeenCalled()
    expect(screen.getByRole('status')).not.toHaveTextContent('Correct!')
    wait(1400)
    expect(onComplete).toHaveBeenCalledWith(15)
  })
})

// --- Spelling Check ---------------------------------------------------------------

describe('Spelling Check', () => {
  it('never offers a doubled first letter or another real word as a misspelling', () => {
    const isWord = (t: string) => ['cut', 'cot', 'cad', 'hoping', 'from'].includes(t)
    for (const w of ['cat', 'hopping', 'form', 'balloon', 'happy']) {
      for (let i = 0; i < 25; i++) {
        const opts = buildOptions(w, isWord)
        expect(opts).toContain(w)
        expect(new Set(opts).size).toBe(opts.length)
        for (const o of opts.filter((o) => o !== w)) {
          expect(o.startsWith(w[0] + w[0]), `${o} for ${w}`).toBe(false)
          expect(isWord(o), `${o} is a real word`).toBe(false)
        }
      }
    }
  })

  it('a miss shows and spells the right word for a while, gently', () => {
    const onComplete = vi.fn()
    render(<SpellingCheck words={[word('cat')]} rounds={1} onComplete={onComplete} />)
    const wrong = screen.getAllByRole('button').find((b) => b.className.includes('sck-option') && b.textContent !== 'cat')!
    fireEvent.click(wrong)
    expect(screen.getByRole('status')).toHaveTextContent(/It’s spelled “cat” — you’ll get the next one!/)
    expect(said().some((s) => s.includes('c, a, t'))).toBe(true)
    expect(h.sfx.wrong).toHaveBeenCalled()
    wait(2000)
    expect(onComplete).not.toHaveBeenCalled()
    wait(500)
    expect(onComplete).toHaveBeenCalledWith(0)
  })

  it('pays the last word', () => {
    const onComplete = vi.fn()
    render(<SpellingCheck words={[word('cat')]} rounds={1} onComplete={onComplete} />)
    fireEvent.click(button('cat'))
    wait(1500)
    expect(onComplete).toHaveBeenCalledTimes(1)
    expect(onComplete).toHaveBeenCalledWith(15)
  })
})

// --- Word Builder -----------------------------------------------------------------

describe('Word Builder', () => {
  it('keeps both letters when two tiles are tapped in the same frame', () => {
    // Two children, two fingers: both taps read the same render. One letter
    // used to vanish while staying marked used, and the word couldn't finish.
    const onComplete = vi.fn()
    const { container } = render(<WordBuilder words={[word('cat')]} rounds={1} onComplete={onComplete} />)
    const tile = (ch: string) => screen.getAllByRole('button', { name: ch }).find((b) => !b.hasAttribute('disabled'))!
    const c = tile('c')
    const a = tile('a')
    act(() => {
      fireEvent.click(c)
      fireEvent.click(a)
    })
    expect([...container.querySelectorAll('.wb-slot')].map((x) => x.textContent).join('')).toBe('CA')
    fireEvent.click(tile('t'))
    wait(1400)
    expect(onComplete).toHaveBeenCalledWith(builderPoints('cat', 0))
  })

  it('never deals a palindrome already in order', () => {
    // An in-order deal is swapped around; reversing did nothing for "ewe".
    vi.spyOn(Math, 'random').mockReturnValue(0.999)
    try {
      render(<WordBuilder words={[word('ewe')]} rounds={1} onComplete={() => {}} />)
      const order = screen.getAllByRole('button', { name: /^[ew]$/ }).map((b) => b.getAttribute('aria-label')).join('')
      expect(order).not.toBe('ewe')
    } finally {
      vi.mocked(Math.random).mockRestore()
    }
  })

  const tapWord = (text: string) => {
    for (const ch of text) fireEvent.click(screen.getAllByRole('button', { name: ch }).find((b) => !b.hasAttribute('disabled'))!)
  }
  const slots = (container: HTMLElement) =>
    [...container.querySelectorAll('.wb-slot')].map((s) => s.textContent).join('')

  it('counts the last word’s points (the old finishing timer read a stale score)', () => {
    const onComplete = vi.fn()
    render(<WordBuilder words={[word('cat')]} rounds={1} onComplete={onComplete} />)
    tapWord('cat')
    wait(1400)
    expect(onComplete).toHaveBeenCalledTimes(1)
    expect(onComplete).toHaveBeenCalledWith(builderPoints('cat', 0))
    expect(builderPoints('cat', 0)).toBe(24)
  })

  it('after a wrong build shows the right letters, then a second go earns half', () => {
    const onComplete = vi.fn()
    const { container } = render(<WordBuilder words={[word('cat')]} rounds={1} onComplete={onComplete} />)
    tapWord('tac')
    expect(slots(container)).toBe('CAT')
    expect(screen.getByRole('status')).toHaveTextContent(/have another go/i)
    // While the answer is up the tiles wait — no copying it straight across.
    expect(screen.getAllByRole('button', { name: /^[cat]$/ }).every((b) => b.hasAttribute('disabled'))).toBe(true)

    wait(1600)
    expect(slots(container)).toBe('')
    tapWord('cat')
    wait(1400)
    expect(onComplete).toHaveBeenCalledWith(12)
  })

  it('moves on after two wrong builds, saying the word, so nobody is stuck', () => {
    const onComplete = vi.fn()
    render(<WordBuilder words={[word('cat')]} rounds={1} onComplete={onComplete} />)
    tapWord('tac')
    wait(1600)
    tapWord('act')
    expect(screen.getByRole('status')).toHaveTextContent(/It was “cat”/)
    expect(said().some((s) => s.includes('c, a, t'))).toBe(true)
    wait(2300)
    expect(onComplete).toHaveBeenCalledWith(0)
  })

  it('skipping costs nothing', () => {
    const onComplete = vi.fn()
    render(<WordBuilder words={[word('cat'), word('dog')]} rounds={2} onComplete={onComplete} />)
    const first = said().find((s) => s === 'cat' || s === 'dog')!
    tapWord(first)
    wait(1400)
    fireEvent.click(button(/Skip this word/))
    wait(2300)
    expect(onComplete).toHaveBeenCalledWith(24)
  })
})

// --- Rescue the Bee ---------------------------------------------------------------

describe('Rescue the Bee', () => {
  it('gives long words enough hearts to find all their letters', () => {
    expect(livesFor('cat')).toBe(6)
    expect(livesFor('elephant')).toBe(7)
    expect(livesFor('blackmouth')).toBe(10)
  })

  it('keeps points for letters found when the hearts run out, and the bee still gets out', () => {
    const onComplete = vi.fn()
    render(<RescueTheBee words={[word('cat')]} rounds={1} onComplete={onComplete} />)
    fireEvent.click(button('c'))
    expect(h.sfx.pop).toHaveBeenCalled()
    for (const ch of 'bdefgh') fireEvent.click(button(ch))
    expect(screen.getByRole('img', { name: 'The bee flies free' })).toBeInTheDocument()
    expect(screen.getByRole('status')).not.toHaveTextContent(/Oh no/)
    expect(screen.getByRole('status')).toHaveTextContent(/It was “cat”/)
    wait(2500)
    expect(onComplete).toHaveBeenCalledWith(3)
  })

  it('cracks the jar as hearts go, and scores a rescue', () => {
    const onComplete = vi.fn()
    const { container } = render(<RescueTheBee words={[word('cat')]} rounds={1} onComplete={onComplete} />)
    const jar = () => container.querySelector('.rb-jar')!
    expect(jar().getAttribute('data-cracks')).toBe('0')
    fireEvent.click(button('z'))
    expect(jar().getAttribute('data-cracks')).toBe('1')
    for (const ch of 'cat') fireEvent.click(button(ch))
    wait(1800)
    // 3 letters × 3, +10 for the rescue, +2 for each of the 5 hearts left.
    expect(onComplete).toHaveBeenCalledWith(29)
  })
})

// --- Word Search ------------------------------------------------------------------

describe('Word Search', () => {
  it('hides words only left-to-right, top-to-bottom and diagonally down-right', () => {
    for (let n = 0; n < 40; n++) {
      const p = buildPuzzle(['cat', 'dog', 'bird', 'fish', 'frog'], 5)
      for (const t of p.targets) {
        const { r, c, dr, dc } = p.placements[t]
        expect(DIRS.some(([a, b]) => a === dr && b === dc)).toBe(true)
        expect([...t].map((_, i) => p.grid[r + dr * i][c + dc * i]).join('')).toBe(t)
      }
    }
  })

  /** Reads the grid off the screen and finds a word the way a child would. */
  const findOnScreen = (container: HTMLElement, target: string) => {
    const cells = [...container.querySelectorAll<HTMLElement>('.ws-cell')]
    const size = Math.round(Math.sqrt(cells.length))
    const at = (r: number, c: number) => cells[r * size + c]
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        for (const [dr, dc] of DIRS) {
          const text = [...target].map((_, i) => at(r + dr * i, c + dc * i)?.textContent?.toLowerCase()).join('')
          if (text === target) return [at(r, c), at(r + dr * (target.length - 1), c + dc * (target.length - 1))]
        }
      }
    }
    throw new Error(`${target} not on the grid`)
  }

  it('a miss clears the selection and wobbles only the tapped cell', () => {
    const { container } = render(<WordSearch words={[word('cat'), word('dog')]} onComplete={() => {}} />)
    const cells = container.querySelectorAll<HTMLElement>('.ws-cell')
    fireEvent.click(cells[0])
    expect(container.querySelector('.ws-cell.first')).not.toBeNull()
    fireEvent.click(cells[1]) // two letters is never a hidden word
    expect(container.querySelector('.ws-cell.first')).toBeNull()
    expect(container.querySelectorAll('.ws-cell.miss')).toHaveLength(1)
    expect(h.sfx.wrong).toHaveBeenCalled()
  })

  it('says each word found and pays once when they are all found', () => {
    const onComplete = vi.fn()
    const { container } = render(<WordSearch words={[word('cat'), word('dog')]} onComplete={onComplete} />)
    const targets = [...container.querySelectorAll('.ws-word')].map((w) => w.textContent!)
    expect(targets.length).toBe(2)
    for (const t of targets) {
      const [start, end] = findOnScreen(container, t)
      fireEvent.click(start)
      fireEvent.click(end)
      expect(said().some((s) => s.endsWith(t))).toBe(true)
    }
    expect(h.sfx.correct).toHaveBeenCalledTimes(2)
    // Tapping on after the last word changes nothing.
    fireEvent.click(container.querySelectorAll<HTMLElement>('.ws-cell')[0])
    wait(2000)
    expect(onComplete).toHaveBeenCalledTimes(1)
    expect(onComplete).toHaveBeenCalledWith(50)
  })

  it('an empty grid has no button that pays', () => {
    const onComplete = vi.fn()
    render(<WordSearch words={[word('elephant')]} onComplete={onComplete} />)
    expect(screen.queryAllByRole('button')).toHaveLength(0)
    expect(onComplete).not.toHaveBeenCalled()
  })
})

// --- Bee Catch --------------------------------------------------------------------

describe('Bee Catch', () => {
  it('lays out one right bee and six believable decoys, each in its own spot', () => {
    for (let n = 0; n < 30; n++) {
      const bees = makeBees('cat', 1)
      expect(bees).toHaveLength(7)
      expect(bees.filter((b) => b.ch === 'a')).toHaveLength(1)
      const cells = bees.map((b) => `${Math.floor(b.left / 25)},${Math.floor(b.top / 50)}`)
      expect(new Set(cells).size).toBe(7)
    }
  })

  it('never shows the next letter until two wrong taps, and a wrong tap costs no time', () => {
    render(<BeeCatch words={[word('cat')]} onComplete={() => {}} />)
    expect(screen.getByTestId('bc-next')).toHaveTextContent('_')
    expect(screen.queryByText(/Next:/)).toBeNull()
    const wrongBee = screen.getAllByRole('button', { name: /^Bee / }).find((b) => b.getAttribute('aria-label') !== 'Bee c')!
    fireEvent.click(wrongBee)
    expect(screen.getByTestId('bc-next')).toHaveTextContent('_')
    fireEvent.click(wrongBee)
    expect(screen.getByTestId('bc-next')).toHaveTextContent('C')
    expect(screen.getByText('60s')).toBeInTheDocument()
  })

  it('holds a finished word up, cheers and says it, then starts the next (even on a one-word list)', () => {
    const onComplete = vi.fn()
    render(<BeeCatch words={[word('cat')]} onComplete={onComplete} />)
    for (const ch of 'cat') fireEvent.click(button(`Bee ${ch}`))
    expect(screen.getByRole('status')).toHaveTextContent('CAT')
    expect(said().some((s) => s.endsWith('cat') && s !== 'cat')).toBe(true)
    expect(screen.queryAllByRole('button', { name: /^Bee / })).toHaveLength(0)
    h.speak.mockClear()
    wait(1200)
    expect(h.speak).toHaveBeenCalledWith('cat', expect.anything())
    expect(screen.getAllByRole('button', { name: /^Bee / })).toHaveLength(7)

    for (let s = 0; s < 61; s++) wait(1000)
    // 5 + 6 + 7 for the letters, +10 for the word.
    expect(onComplete).toHaveBeenCalledTimes(1)
    expect(onComplete).toHaveBeenCalledWith(28)
  })

  it('runs no clock on an empty screen', () => {
    const onComplete = vi.fn()
    render(<BeeCatch words={[]} onComplete={onComplete} />)
    for (let s = 0; s < 61; s++) wait(1000)
    expect(onComplete).not.toHaveBeenCalled()
  })
})

// --- Word Chef --------------------------------------------------------------------

describe('Word Chef', () => {
  const cook = (text: string) => {
    for (const ch of text) fireEvent.click(button(ch))
    fireEvent.click(button(/Cook it/))
  }

  it('sets a menu of familiar words it is possible to finish, from a 4-letter word too', () => {
    const k = makeKitchen(['lemon'], ['enol'])
    expect(k.base).toBe('lemon')
    expect(k.targets[0]).toBe('lemon')
    expect(k.targets).toHaveLength(6)
    expect(k.goal).toBe(6)
    expect(makeKitchen(['cake']).base).toBe('cake')
    expect(makeKitchen(['quiz']).goal).toBe(1)
    expect(makeKitchen(['cat', 'dog']).base).toBe('')
  })

  it('counts a real word even when it is not one of the blanks', () => {
    h.bank.words = ['enol']
    render(<WordChef words={[word('lemon')]} onComplete={() => {}} />)
    expect(screen.getByText('0/6')).toBeInTheDocument()
    cook('enol')
    expect(screen.getByText('1/6')).toBeInTheDocument()
    expect(h.sfx.correct).toHaveBeenCalled()
    expect(said().some((s) => s.endsWith('enol'))).toBe(true)
    cook('lmo')
    expect(screen.getByText('1/6')).toBeInTheDocument()
    expect(h.sfx.wrong).toHaveBeenCalled()
  })

  it('finishes once the menu is cooked, with the bonus, and pays once', () => {
    const onComplete = vi.fn()
    render(<WordChef words={[word('quiz')]} onComplete={onComplete} />)
    cook('quiz')
    expect(screen.getByText(/Menu complete/)).toBeInTheDocument()
    wait(3000)
    // 4 letters × 5, +25 for the whole word, +30 for the menu.
    expect(onComplete).toHaveBeenCalledTimes(1)
    expect(onComplete).toHaveBeenCalledWith(75)
  })

  it('when time is up it shows the words still on the menu, then pays once', () => {
    const onComplete = vi.fn()
    const { container } = render(<WordChef words={[word('lemon')]} duration={2} onComplete={onComplete} />)
    expect(container.querySelectorAll('.wch-chip.blank')).toHaveLength(6)
    wait(1000)
    wait(1000)
    wait(10)
    expect(container.querySelectorAll('.wch-chip.blank')).toHaveLength(0)
    expect(screen.getByText('mole')).toHaveClass('missed')
    wait(3000)
    expect(onComplete).toHaveBeenCalledTimes(1)
    expect(onComplete).toHaveBeenCalledWith(0)
  })

  it('an empty kitchen has no button that pays', () => {
    render(<WordChef words={[word('cat')]} onComplete={() => {}} />)
    expect(screen.queryAllByRole('button')).toHaveLength(0)
  })
})

// --- ABC Order --------------------------------------------------------------------

describe('ABC Order', () => {
  const five = ['apple', 'banana', 'cherry', 'date', 'egg'].map((w) => word(w))

  it('no longer names the next letter, takes no points for a miss, and helps after one', () => {
    const onComplete = vi.fn()
    const { container } = render(<AbcOrder words={five} rounds={1} perRound={5} onComplete={onComplete} />)
    expect(screen.queryByText(/Next letter/)).toBeNull()
    expect(container.querySelector('.ao-letter.help')).toBeNull()

    fireEvent.click(button('egg'))
    expect(h.sfx.wrong).toHaveBeenCalled()
    expect(container.querySelector('.ao-letter.help')?.getAttribute('data-letter')).toBe('a')

    for (const w of ['apple', 'banana', 'cherry', 'date', 'egg']) fireEvent.click(button(w))
    expect(said()).toEqual(expect.arrayContaining(['apple', 'egg']))
    wait(1600)
    expect(onComplete).toHaveBeenCalledTimes(1)
    expect(onComplete).toHaveBeenCalledWith(70)
  })
})

// --- Typo Detective ---------------------------------------------------------------

describe('Typo Detective', () => {
  it('scores the first look most', () => {
    expect([0, 1, 2, 5].map(pointsForTry)).toEqual([20, 10, 5, 5])
  })

  it('never plants another real word as the typo', () => {
    for (let i = 0; i < 40; i++) {
      const c = buildCase(word('form', 'a paper to fill in', 'Fill in the form.'))!
      const planted = c.tokens[c.culpritIndex].replace(/[^a-z]/gi, '').toLowerCase()
      expect(planted).not.toBe('form')
      expect(isRealWord(planted), planted).toBe(false)
    }
  })

  it('reads the sentence as it should be, and glows the typo after two misses', () => {
    const onComplete = vi.fn()
    const { container } = render(
      <TypoDetective words={[word('cat', 'a pet', 'The cat sat on the mat.')]} rounds={1} onComplete={onComplete} />
    )
    fireEvent.click(button(/Read it to me/))
    expect(h.speak).toHaveBeenLastCalledWith('The cat sat on the mat.')

    const tokens = () => container.querySelectorAll<HTMLElement>('.td-word')
    fireEvent.click(tokens()[0])
    expect(tokens()[1]).not.toHaveClass('nudge')
    fireEvent.click(tokens()[2])
    expect(tokens()[1]).toHaveClass('nudge')
    expect(h.sfx.wrong).toHaveBeenCalledTimes(2)

    fireEvent.click(tokens()[1])
    expect(screen.getByRole('status')).toHaveTextContent(/It should be cat/)
    wait(2100)
    expect(onComplete).toHaveBeenCalledWith(5)
  })

  it('pays 20 for a first-look catch', () => {
    const onComplete = vi.fn()
    const { container } = render(
      <TypoDetective words={[word('cat', 'a pet', 'The cat sat on the mat.')]} rounds={1} onComplete={onComplete} />
    )
    fireEvent.click(container.querySelectorAll<HTMLElement>('.td-word')[1])
    wait(2100)
    expect(onComplete).toHaveBeenCalledWith(20)
  })
})

// --- Memory Match -----------------------------------------------------------------

describe('Memory Match', () => {
  it('puts a short clue on a card, with the word itself blanked out', () => {
    const clue = shortClue('A cat is a small furry animal that people keep as a pet; it says meow.', 'cat')
    expect(clue).not.toMatch(/\bcat\b/i)
    expect(clue.replace('…', '').split(/\s+/).length).toBeLessThanOrEqual(8)
  })

  it('adds the memory bonus at the end instead of shrinking the score', () => {
    expect(memoryBonus(6, 6)).toBe(90)
    expect(memoryBonus(6, 12)).toBe(42)
    expect(memoryBonus(6, 30)).toBe(0)
  })

  it('reads each card, matches pairs, and pays once on a familiar scale', () => {
    const onComplete = vi.fn()
    const { container } = render(
      <MemoryMatch
        words={[word('cat', 'a small pet that purrs'), word('dog', 'a loyal pet that barks')]}
        pairs={2}
        onComplete={onComplete}
      />
    )
    expect(screen.queryByText(/Restart/)).toBeNull()
    expect(screen.queryByText(/Score/)).toBeNull()
    const card = (text: string) =>
      [...container.querySelectorAll<HTMLElement>('.mm-card')].find((c) => c.textContent!.includes(text))!

    // A miss: they turn back over, quietly.
    fireEvent.click(card('purrs'))
    expect(h.speak).toHaveBeenLastCalledWith('a small pet that purrs')
    fireEvent.click(card('dog'))
    expect(h.speak).toHaveBeenLastCalledWith('dog')
    wait(1000)
    expect(container.querySelectorAll('.mm-card.flipped')).toHaveLength(0)
    expect(h.sfx.wrong).not.toHaveBeenCalled()

    fireEvent.click(card('cat'))
    fireEvent.click(card('purrs'))
    wait(1000)
    expect(h.sfx.correct).toHaveBeenCalledTimes(1)
    fireEvent.click(card('dog'))
    fireEvent.click(card('barks'))
    wait(1000)
    wait(1700)
    // 2 pairs × 25, + a bonus of 30 less 8 for the one extra turn.
    expect(onComplete).toHaveBeenCalledTimes(1)
    expect(onComplete).toHaveBeenCalledWith(72)
  })

  it('an empty board has no button that pays', () => {
    render(<MemoryMatch words={[]} onComplete={() => {}} />)
    expect(screen.queryAllByRole('button')).toHaveLength(0)
  })
})

// --- Word Race --------------------------------------------------------------------

describe('Word Race', () => {
  const faller = (w: string, round: number, y = GROUND - 0.5): Faller => ({
    id: Math.random(), word: w, x: 50, y, speed: 1, round, state: 'falling',
  })

  it('only the target reaching the ground breaks the combo', () => {
    expect(fallOnce([faller('cta', 2)], 'cat', 2).missedTarget).toBe(false)
    expect(fallOnce([faller('dog', 2)], 'cat', 2).missedTarget).toBe(false)
    expect(fallOnce([faller('cat', 1)], 'cat', 2).missedTarget).toBe(false)
    const hit = fallOnce([faller('cat', 2), faller('dog', 2, 10)], 'cat', 2)
    expect(hit.missedTarget).toBe(true)
    expect(hit.fallers.map((f) => f.word)).toEqual(['dog'])
  })

  it('a catch scores and says the next target; words that fell for the old one fade out', () => {
    render(<WordRace words={[word('cat'), word('dog')]} onComplete={() => {}} />)
    const first = screen.getByLabelText(/^Catch /).getAttribute('aria-label')!.replace('Catch ', '')
    expect(h.speak).toHaveBeenCalledWith(first)

    fireEvent.click(button(first))
    expect(h.sfx.correct).toHaveBeenCalled()
    expect(screen.getByText('🔥 1')).toBeInTheDocument()
    const second = first === 'cat' ? 'dog' : 'cat'
    expect(h.speak).toHaveBeenLastCalledWith(second)

    // Skipping costs nothing, and the second target's copy now belongs to the past.
    fireEvent.click(button(/Skip word/))
    expect(screen.getByText('🔥 1')).toBeInTheDocument()
    const stale = screen.getAllByRole('button', { name: second }).filter((b) => b.className.includes('wr-word'))
    expect(stale.length).toBeGreaterThan(0)
    stale.forEach((b) => {
      expect(b).toBeDisabled()
      fireEvent.click(b)
    })
    expect(h.sfx.wrong).not.toHaveBeenCalled()
    expect(screen.getByText('🔥 1')).toBeInTheDocument()
  })

  it('ends once when the clock runs out', () => {
    const onComplete = vi.fn()
    render(<WordRace words={[word('cat'), word('dog')]} duration={1} onComplete={onComplete} />)
    wait(1100)
    wait(2000)
    expect(onComplete).toHaveBeenCalledTimes(1)
    expect(onComplete).toHaveBeenCalledWith(0)
  })
})

describe('Word Chef’s word list', () => {
  it('lists each everyday word once, so the menu never shows one twice', () => {
    expect(new Set(COMMON_WORDS).size).toBe(COMMON_WORDS.length)
  })
})

// These timing regressions cover challenge mode; relaxed mode has its own tests.
beforeEach(() => setPreferences({ relaxed: false, waitForMe: false }))
