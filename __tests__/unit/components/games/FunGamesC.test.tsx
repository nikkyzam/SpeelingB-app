import React from 'react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'

// vi.mock is hoisted above everything, so what it uses must be hoisted too.
const h = vi.hoisted(() => {
  const noSound = {
    tap: vi.fn(), pop: vi.fn(), correct: vi.fn(), wrong: vi.fn(), win: vi.fn(),
    star: vi.fn(), whoosh: vi.fn(), thud: vi.fn(), applause: vi.fn(), fanfare: vi.fn(),
    worldJingle: vi.fn(),
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
// What a game says is what a child hears.
vi.mock('@/contexts/AudioContext', () => ({
  useAudio: () => ({ speak: h.speak }),
  AudioProvider: ({ children }: { children: React.ReactNode }) => children,
}))

import StoryBuilder from '@/components/games/StoryBuilder'
import TreasureTrail, { makeChallenge } from '@/components/games/TreasureTrail'
import HomophoneHero, { PUZZLES, dealPuzzles } from '@/components/games/HomophoneHero'
import WordFamily, { FAMILIES, dealTiles } from '@/components/games/WordFamily'
import SyllableClap, { isClappable } from '@/components/games/SyllableClap'
import DefinitionDetective from '@/components/games/DefinitionDetective'
import { countBeats } from '@/services/words/wordShape'
import { isRealWord } from '@/components/games/shared/realWords'
import { ThemeProvider } from '@/contexts/ThemeContext'

const word = (w: string, meaning = `the meaning of ${w}`) => ({
  id: w,
  word: w,
  meaning,
  sentence: `A ${w} appeared.`,
  difficulty: 1 as const,
  category: 'test',
})

const button = (name: string | RegExp) => screen.getByRole('button', { name })

/**
 * Two taps landing before React has re-rendered — the race a fast double tap
 * runs on a real iPad. Inside one act() neither tap sees the other's update,
 * so only a ref lock can stop the second one counting.
 */
const doubleTap = (el: Element) => act(() => {
  fireEvent.click(el)
  fireEvent.click(el)
})

beforeEach(() => {
  vi.clearAllMocks()
  vi.useFakeTimers()
})
afterEach(() => vi.useRealTimers())

// --- Syllable Clap: counting beats ---------------------------------------------

describe('counting the beats in a word', () => {
  // Real beat counts of common children's words, the ones the old vowel-group
  // count got wrong included (little → 1, lion → 1, jumped → 2).
  const BEATS: [string, number][] = [
    ['cat', 1], ['school', 1], ['cake', 1], ['tongue', 1],
    ['jumped', 1], ['played', 1], ['smiles', 1], ['games', 1], ['eyes', 1],
    ['little', 2], ['table', 2], ['apple', 2], ['purple', 2], ['people', 2], ['castle', 2],
    ['lion', 2], ['quiet', 2], ['poem', 2], ['create', 2], ['giant', 2], ['cruel', 2],
    ['wanted', 2], ['giggled', 2], ['boxes', 2],
    ['flying', 2], ['being', 2], ['player', 2], ['yellow', 2],
    ['someone', 2], ['something', 2], ['lovely', 2], ['careful', 2], ['rhythm', 2],
    ['idea', 3], ['radio', 3], ['video', 3], ['piano', 3], ['usual', 3], ['museum', 3],
    ['happier', 3], ['banana', 3], ['butterfly', 3], ['elephant', 3],
    ['caterpillar', 4], ['helicopter', 4],
  ]

  it.each(BEATS)('%s has %i', (w, beats) => {
    expect(countBeats(w)).toBe(beats)
  })

  it('only plays a word whose beats and chunks agree', () => {
    expect(isClappable(word('banana'))).toBe(true)
    expect(isClappable(word('little'))).toBe(true)
    // Right count, but the chunks on the reveal would read "jum-ped".
    expect(isClappable(word('jumped'))).toBe(false)
  })
})

describe('Syllable Clap: playing it', () => {
  const clap = (n: number) => {
    for (let i = 0; i < n; i++) fireEvent.click(button('Clap once'))
  }

  it('says the word, takes a double tap on the answer once, and finishes once', () => {
    const onComplete = vi.fn()
    render(<SyllableClap words={[word('banana')]} rounds={1} onComplete={onComplete} />)
    expect(h.speak).toHaveBeenCalledWith('banana')

    clap(3)
    doubleTap(button(/my answer/))
    expect(screen.getByRole('status')).toHaveTextContent('3 beats')
    expect(h.noSound.correct).toHaveBeenCalledTimes(1)

    act(() => { vi.advanceTimersByTime(2300) })
    expect(onComplete).toHaveBeenCalledTimes(1)
    expect(onComplete).toHaveBeenCalledWith(25)
  })

  it('on a miss shows the beats and claps the word out after saying how many', () => {
    const onComplete = vi.fn()
    render(<SyllableClap words={[word('banana')]} rounds={1} onComplete={onComplete} />)
    clap(1)
    fireEvent.click(button(/my answer/))
    expect(screen.getByRole('status')).toHaveTextContent('It has 3 beats')
    expect(h.speak).toHaveBeenCalledWith(expect.stringMatching(/banana has 3 beats/))
    // Queued behind that line, not cutting it off.
    expect(h.speak).toHaveBeenCalledWith('ba', { queue: true })

    act(() => { vi.advanceTimersByTime(6000) })
    expect(onComplete).toHaveBeenCalledTimes(1)
    expect(onComplete).toHaveBeenCalledWith(0)
  })

  it('leaves out words nobody is sure how to clap, and pays nothing for an empty game', () => {
    const onComplete = vi.fn()
    render(<SyllableClap words={[word('jumped'), word('games')]} onComplete={onComplete} />)
    expect(screen.getByText(/No words to clap yet/)).toBeInTheDocument()
    expect(screen.queryByRole('button')).toBeNull()
    act(() => { vi.advanceTimersByTime(5000) })
    expect(onComplete).not.toHaveBeenCalled()
  })
})

// --- Homophone Hero -------------------------------------------------------------

describe('Homophone Hero', () => {
  /** The puzzle on screen, found by its sentence. */
  const puzzleOnScreen = (container: HTMLElement) => {
    const shown = container.querySelector('.hh-sentence')!.textContent!.replace('🔊', '')
    return PUZZLES.find((p) => p.text.replace('___', '?????') === shown)!
  }

  it('shuffles the buttons, because every answer is written first', () => {
    // The regression: the answer is options[0] in every puzzle as written.
    expect(PUZZLES.every((p) => p.options[0] === p.answer)).toBe(true)
    let first = 0
    let total = 0
    for (let i = 0; i < 40; i++) {
      for (const p of dealPuzzles(PUZZLES.length)) {
        total++
        if (p.options[0] === p.answer) first++
        expect([...p.options].sort()).toEqual([...PUZZLES.find((q) => q.text === p.text)!.options].sort())
      }
    }
    expect(first).toBeLessThan(total * 0.75)
  })

  it('tapping the first button does not always win', () => {
    let wins = 0
    for (let i = 0; i < 20; i++) {
      const { container, unmount } = render(<HomophoneHero rounds={1} onComplete={() => {}} />)
      fireEvent.click(container.querySelectorAll('.hh-option')[0])
      if (container.querySelector('.hh-option.right') === container.querySelectorAll('.hh-option')[0]) wins++
      unmount()
    }
    expect(wins).toBeLessThan(20)
  })

  it('reads the sentence out, and scores a double tap once', () => {
    const onComplete = vi.fn()
    const { container } = render(<HomophoneHero rounds={1} onComplete={onComplete} />)
    const p = puzzleOnScreen(container)
    expect(h.speak).toHaveBeenCalledWith(p.text.replace('___', p.answer), { queue: false })

    doubleTap(button(p.answer))
    expect(h.noSound.correct).toHaveBeenCalledTimes(1)
    act(() => { vi.advanceTimersByTime(2700) })
    expect(onComplete).toHaveBeenCalledTimes(1)
    expect(onComplete).toHaveBeenCalledWith(30)
  })

  it('a miss shows the right word and says the trick, gently', () => {
    const onComplete = vi.fn()
    const { container } = render(<HomophoneHero rounds={1} onComplete={onComplete} />)
    const p = puzzleOnScreen(container)
    fireEvent.click(button(p.options.find((o) => o !== p.answer)!))
    expect(container.querySelector('.hh-gap')).toHaveTextContent(p.answer)
    expect(h.speak).toHaveBeenLastCalledWith(expect.stringContaining(`It's ${p.answer}.`))
    expect(screen.getByRole('status')).not.toHaveTextContent(/wrong/i)
    act(() => { vi.advanceTimersByTime(4100) })
    expect(onComplete).toHaveBeenCalledWith(0)
  })
})

// --- Word Family Factory --------------------------------------------------------

describe('Word Family Factory', () => {
  // Real words the common-word list and the bank don't know about.
  const ALSO_REAL = new Set([
    'vat', 'zing', 'ding', 'ping', 'ling', 'bling', 'hell', 'yell', 'cell', 'dell', 'jell', 'quell',
    'bight', 'tight', 'wight', 'plight', 'slight', 'knight', 'fake', 'hake', 'sake', 'take', 'quake',
    'pat', 'fat', 'gnat', 'slat', 'brat', 'spat', 'gat', 'plat', 'drat', 'hump', 'rump', 'chump',
    'frump', 'plump', 'crump', 'flump', 'cop', 'bop', 'lop', 'sop', 'fop', 'crop', 'flop', 'prop',
    'slop', 'glop', 'rand', 'wand', 'bland', 'gland', 'strand', 'nand',
  ])

  it('never calls a real word a fake', () => {
    for (const f of FAMILIES) {
      for (const onset of f.fake) {
        const made = onset + f.rime
        expect(isRealWord(made), `${made} is a real word`).toBe(false)
        expect(ALSO_REAL.has(made), `${made} is a real word`).toBe(false)
        expect(f.real).not.toContain(onset)
      }
    }
  })

  it('builds fakes from everyday letters, so "never tap z" is no trick', () => {
    const realStarts = new Set(FAMILIES.flatMap((f) => f.real.map((o) => o[0])))
    for (const f of FAMILIES) {
      for (const onset of f.fake) expect(realStarts.has(onset[0]), `${onset}${f.rime}`).toBe(true)
    }
  })

  it('drops an offered fake if the dictionary says it is a word', () => {
    const family = { rime: 'at', real: ['c', 'b', 'h', 'm', 'r'], fake: ['v', 'j'] }
    for (let i = 0; i < 20; i++) {
      const tiles = dealTiles(family, (t) => t === 'vat')
      expect(tiles).not.toContain('v')
      expect(tiles).toContain('j')
    }
  })

  /** The family on screen and which of its tiles are real. */
  const onScreen = (container: HTMLElement) => {
    const rime = container.querySelector('.wf2-rime-text')!.textContent!
    const family = FAMILIES.find((f) => f.rime === rime)!
    const tiles = [...container.querySelectorAll<HTMLButtonElement>('.wf2-tile')]
    return {
      real: tiles.filter((t) => family.real.includes(t.textContent!)),
      fake: tiles.filter((t) => !family.real.includes(t.textContent!)),
    }
  }

  it('counts a double-tapped tile once, and pays a bonus for a family with no tricks', () => {
    const onComplete = vi.fn()
    const { container } = render(<WordFamily rounds={1} onComplete={onComplete} />)
    const { real } = onScreen(container)
    expect(real).toHaveLength(5)

    doubleTap(real[0])
    expect(screen.getByText(/1\/5/)).toBeInTheDocument()
    real.slice(1).forEach((t) => fireEvent.click(t))
    expect(screen.getByText(/no tricks fooled you/i)).toBeInTheDocument()

    act(() => { vi.advanceTimersByTime(2300) })
    expect(onComplete).toHaveBeenCalledTimes(1)
    // 5 words × 20, the family bonus and the no-tricks bonus.
    expect(onComplete).toHaveBeenCalledWith(140)
  })

  it('a fake costs only the no-tricks bonus, and says kindly it is not a word', () => {
    const onComplete = vi.fn()
    const { container } = render(<WordFamily rounds={1} onComplete={onComplete} />)
    const { real, fake } = onScreen(container)
    fireEvent.click(fake[0])
    expect(screen.getByText(/isn’t a real word/)).toBeInTheDocument()
    expect(fake[0]).toBeDisabled()
    real.forEach((t) => fireEvent.click(t))
    act(() => { vi.advanceTimersByTime(2300) })
    expect(onComplete).toHaveBeenCalledWith(120)
  })
})

// --- Definition Detective -------------------------------------------------------

describe('Definition Detective', () => {
  const words = [
    word('apple', 'An apple is a round fruit that grows on trees.'),
    word('river', 'A river is a long stream of flowing water.'),
    word('candle', 'A candle is a stick of wax you light for a flame.'),
  ]
  const caseOnScreen = (container: HTMLElement) => {
    const clue = container.querySelector('.dd2-clue-text')!.textContent!
    return { clue, answer: words.find((w) => clue.includes(w.meaning.split(' ').slice(4, 7).join(' ')))! }
  }

  it('records a double-tapped answer once and moves on once', () => {
    const onComplete = vi.fn()
    const { container } = render(<DefinitionDetective words={words} rounds={1} onComplete={onComplete} />)
    const { answer } = caseOnScreen(container)

    doubleTap(button(answer.word))
    expect(h.record).toHaveBeenCalledTimes(1)
    expect(h.record).toHaveBeenCalledWith(answer.id, true)

    act(() => { vi.advanceTimersByTime(1900) })
    expect(onComplete).toHaveBeenCalledTimes(1)
    expect(onComplete).toHaveBeenCalledWith(30)
  })

  it('blanks the answer out of its own clue', () => {
    const { container } = render(<DefinitionDetective words={words} rounds={1} onComplete={() => {}} />)
    const { clue, answer } = caseOnScreen(container)
    expect(clue).toContain('____')
    expect(clue.toLowerCase()).not.toContain(answer.word)
    // Read aloud as a blank, not as underscores.
    expect(h.speak).toHaveBeenCalledWith(expect.stringContaining('blank'))
  })

  it('a miss records the miss, shows the word and says it', () => {
    const onComplete = vi.fn()
    const { container } = render(<DefinitionDetective words={words} rounds={1} onComplete={onComplete} />)
    const { answer } = caseOnScreen(container)
    fireEvent.click(button(words.find((w) => w !== answer)!.word))
    expect(h.record).toHaveBeenCalledWith(answer.id, false)
    expect(screen.getByRole('status')).toHaveTextContent(`It was “${answer.word}”`)
    expect(h.speak).toHaveBeenLastCalledWith(expect.stringContaining(`It was ${answer.word}`))
    act(() => { vi.advanceTimersByTime(2700) })
    expect(onComplete).toHaveBeenCalledWith(0)
  })
})

// --- Treasure Trail -------------------------------------------------------------

describe('Treasure Trail', () => {
  const REAL = new Set(['cat', 'cut', 'cot', 'cap', 'can', 'car', 'cab', 'bat', 'hat', 'mat', 'rat', 'sat', 'fat', 'pat', 'vat'])
  const isWord = (t: string) => REAL.has(t)

  it('never offers a letter or a "misspelling" that makes another real word', () => {
    for (let i = 0; i < 300; i++) {
      const c = makeChallenge(word('cat', ''), [], isWord)
      expect(new Set(c.choices).size).toBe(c.choices.length)
      if (c.kind === 'missing') {
        const at = c.prompt.split(' ').pop()!.indexOf('_')
        for (const d of c.choices.filter((x) => x !== c.answer)) {
          expect(isWord('cat'.slice(0, at) + d + 'cat'.slice(at + 1))).toBe(false)
        }
      } else {
        expect(c.kind).toBe('spelling')
        for (const d of c.choices.filter((x) => x !== c.answer)) expect(isWord(d)).toBe(false)
      }
    }
  })

  const wrap = (ui: React.ReactElement) => render(<ThemeProvider>{ui}</ThemeProvider>)

  it('rolls once for a double tap on the dice', () => {
    const { container } = wrap(<TreasureTrail words={[word('rocket', ''), word('garden', '')]} onComplete={() => {}} />)
    // The opening line, for a child who can't read the instructions yet.
    expect(h.speak).toHaveBeenCalledWith('Roll the dice to start your treasure hunt!')
    h.speak.mockClear()
    doubleTap(button(/Roll the dice/))
    expect(h.noSound.whoosh).toHaveBeenCalledTimes(1)
    act(() => { vi.advanceTimersByTime(2000) })
    // One landing, so one puzzle and one word said for it.
    expect(container.querySelectorAll('.tt-challenge')).toHaveLength(1)
    expect(h.speak).toHaveBeenCalledTimes(1)
  })

  it('solving the puzzle opens the path and lets the child roll again', () => {
    const { container } = wrap(<TreasureTrail words={[word('rocket', '')]} onComplete={() => {}} />)
    fireEvent.click(button(/Roll the dice/))
    act(() => { vi.advanceTimersByTime(2000) })

    const prompt = container.querySelector('.tt-prompt')!.textContent!
    const right = /missing/.test(prompt) ? 'rocket'[prompt.split(' ').pop()!.indexOf('_')] : 'rocket'
    doubleTap(button(right))
    expect(screen.getByRole('status')).toHaveTextContent('The path opens! +30')
    expect(h.noSound.correct).toHaveBeenCalledTimes(1)
    act(() => { vi.advanceTimersByTime(1400) })
    expect(button(/Roll the dice/)).toBeInTheDocument()
    expect(container.querySelector('.tt-stats')).toHaveTextContent('30')
  })

  it('an empty map pays nothing', () => {
    wrap(<TreasureTrail words={[]} onComplete={() => {}} />)
    expect(screen.getByText(/The map is blank/)).toBeInTheDocument()
    expect(screen.queryByRole('button')).toBeNull()
  })
})

// --- Story Builder --------------------------------------------------------------

describe('Story Builder', () => {
  // None of these is in any story's own text ("rocket" is: My rocket landed…).
  const words = ['zebra', 'walrus', 'pickle', 'lantern', 'muffin'].map((w) => word(w))

  const fillTheStory = (container: HTMLElement) => {
    const picked: string[] = []
    for (let i = 0; i < 4; i++) {
      const choice = container.querySelector<HTMLButtonElement>('.ss-choice')!
      picked.push(choice.textContent!)
      fireEvent.click(choice)
    }
    act(() => { vi.advanceTimersByTime(700) })
    return picked
  }

  it('hides the star word while it is spelled, and pays a double Enter once', () => {
    const onComplete = vi.fn()
    const { container } = render(<StoryBuilder words={words} onComplete={onComplete} />)
    const [star] = fillTheStory(container)

    fireEvent.click(button(/Finish/))
    expect(container.querySelector('.ss-text')!.textContent).not.toContain(star)

    const box = screen.getByPlaceholderText('Spell it...')
    fireEvent.change(box, { target: { value: star } })
    act(() => {
      fireEvent.keyPress(box, { key: 'Enter', code: 'Enter', charCode: 13 })
      fireEvent.keyPress(box, { key: 'Enter', code: 'Enter', charCode: 13 })
    })
    expect(h.noSound.correct).toHaveBeenCalledTimes(1)
    // Shown again once it's been spelled.
    expect(container.querySelector('.ss-text')!.textContent).toContain(star)

    act(() => { vi.advanceTimersByTime(3000) })
    expect(onComplete).toHaveBeenCalledTimes(1)
    // Four words in the story and the bonus.
    expect(onComplete).toHaveBeenCalledWith(130)
  })

  it('a missed star word is spelled out and still finishes the story', () => {
    const onComplete = vi.fn()
    const { container } = render(<StoryBuilder words={words} onComplete={onComplete} />)
    const [star] = fillTheStory(container)
    fireEvent.click(button(/Finish/))
    fireEvent.change(screen.getByPlaceholderText('Spell it...'), { target: { value: 'xyz' } })
    fireEvent.click(button('Check'))
    expect(screen.getByRole('status')).toHaveTextContent(`It was “${star}”`)
    expect(h.speak).toHaveBeenLastCalledWith(expect.stringContaining([...star].join(', ')))
    act(() => { vi.advanceTimersByTime(3000) })
    expect(onComplete).toHaveBeenCalledTimes(1)
    expect(onComplete).toHaveBeenCalledWith(80)
  })

  it('with no words, shows a friendly note and no button that pays', () => {
    render(<StoryBuilder words={[]} onComplete={() => {}} />)
    expect(screen.getByText(/No words for the story yet/)).toBeInTheDocument()
    expect(screen.queryByRole('button')).toBeNull()
  })
})


describe('Syllable Clap only plays words it can count', () => {
  const w = (word: string) => ({ id: word, word, meaning: '', sentence: '', difficulty: 1 as const, category: 'test' })

  it('leaves out words both counts get wrong together', () => {
    // Each of these was clappable, and a right clap would have been marked wrong.
    for (const word of ['forecast', 'forepaw', 'iceberg', 'limelight', 'gateway', 'stagestruck', 'aforesaid',
      'latticework', 'grotesqueness', 'crocheted', 'cooperate', 'reiterate', 'nucleated']) {
      expect(isClappable(w(word)), word).toBe(false)
    }
  })

  it('keeps the everyday words worth clapping', () => {
    for (const word of ['little', 'table', 'apple', 'butterfly', 'caterpillar', 'elephant', 'banana',
      'pancake', 'between', 'telephone', 'lemonade']) {
      expect(isClappable(w(word)), word).toBe(true)
    }
  })
})
