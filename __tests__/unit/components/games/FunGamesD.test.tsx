import React from 'react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'

// vi.mock is hoisted above everything, so what it uses must be hoisted too.
const h = vi.hoisted(() => {
  const noSound = {
    tap: () => {}, pop: () => {}, correct: () => {}, wrong: () => {},
    win: () => {}, applause: () => {}, worldJingle: () => {},
    star: () => {}, whoosh: () => {}, thud: () => {}, fanfare: () => {},
  }
  return { noSound, speak: vi.fn(), getVerse: vi.fn() }
})
vi.mock('@/components/games/shared/sfx', () => ({
  default: h.noSound,
  sfx: h.noSound,
  setWorldSoundProfile: () => {},
}))
vi.mock('@/contexts/AudioContext', () => ({
  useAudio: () => ({ speak: h.speak }),
  AudioProvider: ({ children }: { children: React.ReactNode }) => children,
}))
vi.mock('@/services/bibleApi', () => ({
  bibleApi: { getVerse: h.getVerse },
  default: { getVerse: h.getVerse },
  POPULAR_VERSES: [],
  BIBLE_CATEGORIES: [],
}))

import BalloonPop, { makeWave } from '@/components/games/BalloonPop'
import WordScramble, { scramble, usedTiles } from '@/components/games/WordScramble'
import SpellSprint, { beeWords, paceFor } from '@/components/games/SpellSprint'
import SpellingAdventure, { placeOf } from '@/components/games/SpellingAdventure'
import BibleTriviaEnhanced, { TRIVIA, dealTrivia } from '@/components/games/BibleTriviaEnhanced'
import BibleMemorizer, { KID_VERSES, STAGES, blankable, coreOf, pickBlanks } from '@/components/games/BibleMemorizer'

const word = (w: string, meaning = `the meaning of ${w}`) => ({
  id: w,
  word: w,
  meaning,
  sentence: `A ${w} appeared.`,
  difficulty: 1 as const,
  category: 'test',
})

const button = (name: string | RegExp) => screen.getByRole('button', { name })
const wait = (ms: number) => act(() => { vi.advanceTimersByTime(ms) })
const typeInto = (el: HTMLElement, value: string) => fireEvent.change(el, { target: { value } })
const enter = (el: HTMLElement) => fireEvent.keyDown(el, { key: 'Enter' })
const spokeLike = (re: RegExp) => h.speak.mock.calls.some(([text]) => re.test(String(text)))

beforeEach(() => {
  h.speak.mockClear()
  h.getVerse.mockReset()
  vi.useFakeTimers()
})
afterEach(() => vi.useRealTimers())

// --- Balloon Pop -----------------------------------------------------------------

describe('Balloon Pop', () => {
  // The slots only — the star burst for a finished word lives in the same box.
  const wordSoFar = () => Array.from(document.querySelectorAll('.bp-slot')).map((el) => el.textContent).join('')

  it('offers the right letter and three different traps for every letter', () => {
    for (let i = 0; i < 'balloon'.length; i++) {
      const wave = makeWave('balloon', i)
      expect(wave).toHaveLength(4)
      expect(wave.filter((b) => b.right).map((b) => b.letter)).toEqual(['balloon'[i]])
      expect(new Set(wave.map((b) => b.letter)).size).toBe(4)
    }
  })

  it('speaks the word, shows only blanks, and keeps a wrong balloon so the word can still be finished', () => {
    const onComplete = vi.fn()
    render(<BalloonPop words={[word('cat')]} rounds={1} onComplete={onComplete} />)
    expect(h.speak).toHaveBeenCalledWith('cat')
    expect(wordSoFar()).toBe('')
    expect(document.querySelectorAll('.bp-slot')).toHaveLength(3)

    const wrong = screen.getAllByRole('button', { name: /^Balloon / }).find((b) => b.getAttribute('aria-label') !== 'Balloon c')!
    fireEvent.click(wrong)
    // It wobbles and stays: nothing is taken off the board.
    expect(wrong).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: /^Balloon / })).toHaveLength(4)

    fireEvent.click(button('Balloon c'))
    wait(300)
    fireEvent.click(button('Balloon a'))
    wait(300)
    fireEvent.click(button('Balloon t'))
    fireEvent.click(button('Balloon t')) // a double tap must not score twice
    expect(wordSoFar()).toBe('cat')

    wait(1600)
    // c after a miss 2, a 5, t 5, and a 5 finish bonus for a word with a miss.
    expect(onComplete).toHaveBeenCalledTimes(1)
    expect(onComplete).toHaveBeenCalledWith(17)
  })

  it('glows the right balloon after two wrong pops on one letter', () => {
    render(<BalloonPop words={[word('dog')]} rounds={1} onComplete={() => {}} />)
    const wrongs = screen.getAllByRole('button', { name: /^Balloon / }).filter((b) => b.getAttribute('aria-label') !== 'Balloon d')
    fireEvent.click(wrongs[0])
    expect(button('Balloon d').className).not.toContain('glow')
    fireEvent.click(wrongs[1])
    expect(button('Balloon d').className).toContain('glow')
  })

  it('a clean run scores in the usual range and moves word to word', () => {
    const onComplete = vi.fn()
    render(<BalloonPop words={[word('cat'), word('dog')]} rounds={2} onComplete={onComplete} />)
    for (let w = 0; w < 2; w++) {
      const spoken = h.speak.mock.calls.map(([t]) => t).filter((t) => t === 'cat' || t === 'dog').pop() as string
      for (const ch of spoken) {
        fireEvent.click(button(`Balloon ${ch}`))
        wait(300)
      }
      wait(1300)
    }
    // 3 letters × 5 + 15 clean bonus, twice.
    expect(onComplete).toHaveBeenCalledTimes(1)
    expect(onComplete).toHaveBeenCalledWith(60)
  })

  it('says so plainly when there are no words', () => {
    const onComplete = vi.fn()
    render(<BalloonPop words={[]} onComplete={onComplete} />)
    expect(screen.getByText(/No words to pop yet/)).toBeInTheDocument()
    expect(onComplete).not.toHaveBeenCalled()
  })
})

// --- Word Scramble ---------------------------------------------------------------

describe('Word Scramble', () => {
  it('always scrambles a word with two different letters', () => {
    for (let i = 0; i < 50; i++) {
      expect(scramble('ab')).toBe('ba')
      const s = scramble('kitten')
      expect(s).not.toBe('kitten')
      expect([...s].sort().join('')).toBe('eikntt')
    }
    expect(usedTiles(['t', 'a', 'c', 't'], 'tt')).toEqual([true, false, false, true])
  })

  it('a double check scores once', () => {
    const onComplete = vi.fn()
    render(<WordScramble words={[word('cat')]} rounds={1} onComplete={onComplete} />)
    const box = screen.getByLabelText('Your word')
    typeInto(box, 'cat')
    enter(box)
    enter(box)
    fireEvent.click(button('Check my word'))
    wait(1500)
    // 40 for a first-try solve, 10 for needing no help.
    expect(onComplete).toHaveBeenCalledTimes(1)
    expect(onComplete).toHaveBeenCalledWith(50)
  })

  it('builds the word from the tiles', () => {
    const onComplete = vi.fn()
    render(<WordScramble words={[word('cat')]} rounds={1} onComplete={onComplete} />)
    for (const ch of 'cat') fireEvent.click(button(`Letter ${ch}`))
    expect(screen.getByLabelText('Your word')).toHaveValue('cat')
    fireEvent.click(button('Check my word'))
    wait(1500)
    expect(onComplete).toHaveBeenCalledWith(50)
  })

  it('does not mark half a word', () => {
    render(<WordScramble words={[word('cat')]} rounds={1} onComplete={() => {}} />)
    const box = screen.getByLabelText('Your word')
    typeInto(box, 'ca')
    enter(box)
    expect(screen.getByText('Use all 3 letters')).toBeInTheDocument()
    expect(h.speak).not.toHaveBeenCalled()
  })

  it('gives one more go, then shows the word and moves on with nothing to copy for points', () => {
    const onComplete = vi.fn()
    render(<WordScramble words={[word('cat')]} rounds={1} onComplete={onComplete} />)
    const box = screen.getByLabelText('Your word')
    typeInto(box, 'act')
    enter(box)
    expect(screen.queryByText(/It's “cat”/)).toBeNull()
    wait(900)
    expect(box).toHaveValue('')

    typeInto(box, 'tac')
    enter(box)
    expect(screen.getByText(/It's “cat”/)).toBeInTheDocument()
    expect(spokeLike(/c, a, t/)).toBe(true)
    expect(box).toBeDisabled()
    typeInto(box, 'cat')
    enter(box)
    wait(2500)
    expect(onComplete).toHaveBeenCalledTimes(1)
    expect(onComplete).toHaveBeenCalledWith(0)
  })

  it('speaks the word and a masked clue only when asked, for a smaller bonus', () => {
    const onComplete = vi.fn()
    render(<WordScramble words={[word('cat', 'a cat is a small pet')]} rounds={1} onComplete={onComplete} />)
    expect(h.speak).not.toHaveBeenCalled()
    fireEvent.click(button('Hear the word'))
    expect(h.speak).toHaveBeenCalledWith('cat')
    fireEvent.click(button('Show a clue'))
    expect(screen.getByText('a ____ is a small pet')).toBeInTheDocument()
    typeInto(screen.getByLabelText('Your word'), 'cat')
    fireEvent.click(button('Check my word'))
    wait(1500)
    expect(onComplete).toHaveBeenCalledWith(40)
  })
})

// --- Spell Sprint ----------------------------------------------------------------

describe('Spell Sprint', () => {
  it('works out how far the bee has flown', () => {
    const paces = [paceFor('cat'), paceFor('dog')]
    expect(paces[0]).toBe(7600)
    expect(beeWords(paces, 0)).toBe(0)
    expect(beeWords(paces, 3800)).toBeCloseTo(0.5)
    expect(beeWords(paces, 7600 + 3800)).toBeCloseTo(1.5)
    expect(beeWords(paces, 99999)).toBe(2)
  })

  it('speaks the word and never prints it — one blank per letter instead', () => {
    const { container } = render(<SpellSprint words={[word('cat')]} rounds={1} onComplete={() => {}} />)
    expect(h.speak).toHaveBeenCalledWith('cat')
    expect(container.textContent).not.toMatch(/\bcat\b/)
    expect(container.querySelectorAll('.ssp-blank')).toHaveLength(3)
    expect(screen.queryByText(/WPM|words per minute/i)).toBeNull()
  })

  it('a second Enter straight after the first scores once', () => {
    const onComplete = vi.fn()
    render(<SpellSprint words={[word('cat')]} rounds={1} onComplete={onComplete} />)
    const box = screen.getByLabelText('Spell the word')
    typeInto(box, 'cat')
    enter(box)
    enter(box)
    fireEvent.click(button('Check my spelling'))
    wait(1400)
    // 25 first try, 10 faster than the bee, 30 for beating it to the honey.
    expect(onComplete).toHaveBeenCalledTimes(1)
    expect(onComplete).toHaveBeenCalledWith(65)
  })

  it('the bee only races ahead — it never ends the game', () => {
    const onComplete = vi.fn()
    render(<SpellSprint words={[word('cat'), word('dog')]} rounds={2} onComplete={onComplete} />)
    wait(9000)
    expect(screen.getByLabelText('The bee is ahead')).toBeInTheDocument()
    wait(60000)
    expect(onComplete).not.toHaveBeenCalled()
    expect(screen.getByLabelText('Spell the word')).toBeEnabled()
  })

  it('shows and spells out a word after two misses, with no points for it', () => {
    const onComplete = vi.fn()
    render(<SpellSprint words={[word('cat')]} rounds={1} onComplete={onComplete} />)
    const box = screen.getByLabelText('Spell the word')
    typeInto(box, 'kat')
    enter(box)
    expect(screen.queryByText(/It's “cat”/)).toBeNull()
    wait(900)
    typeInto(box, 'catt')
    enter(box)
    expect(screen.getByText(/It's “cat”/)).toBeInTheDocument()
    expect(spokeLike(/c, a, t/)).toBe(true)
    wait(2500)
    expect(onComplete).toHaveBeenCalledWith(0)
  })
})

// --- Spelling Adventure ----------------------------------------------------------

describe('Spelling Adventure', () => {
  const lastSpoken = (list: string[]) =>
    h.speak.mock.calls.map(([t]) => String(t)).filter((t) => list.includes(t)).pop()!

  it('splits the words across the three places', () => {
    expect([0, 1, 2, 3].map((i) => placeOf(i, 4))).toEqual([0, 0, 1, 2])
    expect([0, 1, 2, 3, 4, 5, 6].map((i) => placeOf(i, 7))).toEqual([0, 0, 0, 1, 1, 2, 2])
  })

  it('one trip across the map, every word spoken, no lives and no clock', () => {
    const onComplete = vi.fn()
    const list = ['cat', 'dog', 'sun', 'hat']
    render(<SpellingAdventure words={list.map((w) => word(w))} rounds={4} onComplete={onComplete} />)
    expect(screen.queryByText(/Lives|Time/)).toBeNull()
    for (let i = 0; i < list.length; i++) {
      const box = screen.getByLabelText('Spell the word')
      typeInto(box, lastSpoken(list))
      enter(box)
      enter(box)
      wait(2100)
    }
    // Four first-try words at 40, plus 10 for the Dragon Cave word.
    expect(onComplete).toHaveBeenCalledTimes(1)
    expect(onComplete).toHaveBeenCalledWith(170)
    wait(10000)
    expect(onComplete).toHaveBeenCalledTimes(1)
  })

  it('a word missed twice is shown, spelled out, and the adventure carries on', () => {
    const onComplete = vi.fn()
    render(<SpellingAdventure words={[word('cat')]} rounds={1} onComplete={onComplete} />)
    const box = screen.getByLabelText('Spell the word')
    typeInto(box, 'dog')
    enter(box)
    expect(screen.queryByText(/Game Over/)).toBeNull()
    wait(900)
    typeInto(box, 'cot')
    enter(box)
    expect(screen.getByText(/It's “cat”/)).toBeInTheDocument()
    expect(spokeLike(/c, a, t/)).toBe(true)
    expect(screen.queryByRole('button', { name: /Return to Game Menu/ })).toBeNull()
    wait(2500)
    expect(onComplete).toHaveBeenCalledTimes(1)
    expect(onComplete).toHaveBeenCalledWith(0)
  })

  it('blanks the word out of its meaning', () => {
    render(<SpellingAdventure words={[word('cat', 'a cat is a small pet')]} rounds={1} onComplete={() => {}} />)
    expect(screen.getByText('a ____ is a small pet')).toBeInTheDocument()
  })
})

// --- Bible Trivia ----------------------------------------------------------------

describe('Bible Trivia', () => {
  it('has a real bank of questions, each with three different answers', () => {
    expect(TRIVIA.length).toBeGreaterThanOrEqual(15)
    for (const q of TRIVIA) {
      expect(new Set([q.answer, ...q.wrong]).size).toBe(3)
      expect(q.reference).toMatch(/\d+:\d+/)
    }
    expect(new Set(TRIVIA.map((q) => q.question)).size).toBe(TRIVIA.length)
  })

  it('shuffles the questions and where the right answer sits', () => {
    const slots = new Set<number>()
    const firsts = new Set<string>()
    for (let i = 0; i < 60; i++) {
      const game = dealTrivia(7)
      expect(game).toHaveLength(7)
      expect(new Set(game.map((q) => q.question)).size).toBe(7)
      firsts.add(game[0].question)
      for (const q of game) {
        expect([...q.options].sort()).toEqual([q.answer, ...q.wrong].sort())
        slots.add(q.options.indexOf(q.answer))
      }
    }
    expect(slots).toEqual(new Set([0, 1, 2]))
    expect(firsts.size).toBeGreaterThan(3)
  })

  const answerFor = () => {
    const text = document.querySelector('.btq-question')!.textContent
    return TRIVIA.find((q) => q.question === text)!
  }

  it('reads each question aloud and finishes once, counting the last answer', () => {
    const onComplete = vi.fn()
    render(<BibleTriviaEnhanced rounds={2} onComplete={onComplete} />)
    expect(h.speak).toHaveBeenCalledWith(answerFor().question)
    expect(h.speak).toHaveBeenCalledWith(expect.stringContaining('? Or '), { queue: true })

    fireEvent.click(button(answerFor().answer))
    wait(3700)
    const last = answerFor()
    fireEvent.click(button(last.answer))
    fireEvent.click(button(last.answer))
    wait(3700)
    expect(onComplete).toHaveBeenCalledTimes(1)
    expect(onComplete).toHaveBeenCalledWith(80)
    wait(10000)
    expect(onComplete).toHaveBeenCalledTimes(1)
  })

  it('a miss gently says the answer and the quiz carries on — no clock, lives or fake badge', () => {
    const onComplete = vi.fn()
    render(<BibleTriviaEnhanced rounds={1} onComplete={onComplete} />)
    expect(screen.queryByText(/Connected to Bible API|Lives|Time Bonus/)).toBeNull()
    const q = answerFor()
    fireEvent.click(button(q.wrong[0]))
    expect(screen.getByText(new RegExp(`It was “${q.answer}”`))).toBeInTheDocument()
    expect(button(q.answer)).toBeDisabled()
    expect(spokeLike(new RegExp(`It was ${q.answer}`))).toBe(true)
    wait(4300)
    expect(onComplete).toHaveBeenCalledWith(0)
  })
})

// --- Bible Memorizer -------------------------------------------------------------

describe('Bible Memorizer', () => {
  /** The hidden words, read off the page in reading order. */
  const hiddenWords = (): string[] => {
    const ref = document.querySelector('.bmz-ref')!.textContent!
    const verse = KID_VERSES.find((v) => ref.includes(v.reference))!
    const tokens = verse.text.split(/\s+/)
    const out: string[] = []
    Array.from(document.querySelector('.bmz-text')!.children).forEach((el, i) => {
      if (el.querySelector('input')) out.push(coreOf(tokens[i]))
    })
    return out
  }
  const boxes = () => screen.getAllByLabelText(/^Missing word/) as HTMLInputElement[]

  it('picks blanks in reading order, fresh words first', () => {
    const tokens = 'Trust in the LORD with all your heart; do not depend on your own understanding.'.split(' ')
    expect(blankable('heart;')).toBe(true)
    expect(blankable('in')).toBe(false)
    expect(blankable('Don’t')).toBe(false)
    for (let i = 0; i < 30; i++) {
      const first = pickBlanks(tokens, 4)
      expect(first).toEqual([...first].sort((a, b) => a - b))
      expect(first.every((k) => blankable(tokens[k]))).toBe(true)
      const second = pickBlanks(tokens, 4, new Set(first))
      expect(second.some((k) => first.includes(k))).toBe(false)
    }
  })

  it('every verse can fill all three steps', () => {
    for (const v of KID_VERSES) {
      expect(v.text.split(/\s+/).filter(blankable).length).toBeGreaterThanOrEqual(STAGES[STAGES.length - 1].blanks)
    }
  })

  it('reads the verse, renders every blank, and does not judge a half-typed word', () => {
    render(<BibleMemorizer onComplete={() => {}} />)
    expect(spokeLike(/\d+:\d+\. /)).toBe(true)
    expect(h.getVerse).not.toHaveBeenCalled()
    const words = hiddenWords()
    expect(boxes()).toHaveLength(2)
    expect(words).toHaveLength(2)

    // One letter in every blank used to be marked (and failed) at once.
    boxes().forEach((b, k) => typeInto(b, words[k][0]))
    expect(boxes().every((b) => !b.disabled)).toBe(true)
    expect(document.querySelector('.bmz-flash')).toBeNull()
    expect(spokeLike(/Nearly|So close|Good try|almost|Nice try/i)).toBe(false)

    // Enter with a blank still empty just moves on to it.
    typeInto(boxes()[0], words[0])
    typeInto(boxes()[1], '')
    enter(boxes()[0])
    expect(document.activeElement).toBe(boxes()[1])
    expect(document.querySelector('.bmz-flash')).toBeNull()

    typeInto(boxes()[1], words[1])
    enter(boxes()[1])
    expect(document.querySelector('.bmz-flash.ok')).not.toBeNull()
    wait(1900)
    expect(boxes()).toHaveLength(3)
  })

  it('a wrong word gets one more go, then is shown and spelled out', () => {
    render(<BibleMemorizer onComplete={() => {}} />)
    const words = hiddenWords()
    boxes().forEach((b) => typeInto(b, 'zzz'))
    fireEvent.click(button('Check my words'))
    expect(screen.getByText(/Have another go/)).toBeInTheDocument()
    wait(900)
    expect(boxes().map((b) => b.value)).toEqual(['', ''])
    expect(boxes().every((b) => !b.disabled)).toBe(true)

    boxes().forEach((b) => typeInto(b, 'qqq'))
    fireEvent.click(button('Check my words'))
    expect(boxes().map((b) => b.value)).toEqual(words)
    expect(boxes().every((b) => b.disabled)).toBe(true)
    expect(spokeLike(new RegExp(words[0].toLowerCase().split('').join(', ')))).toBe(true)
    wait(2900)
    expect(boxes()).toHaveLength(3)
  })

  it('plays all three steps and finishes once', () => {
    const onComplete = vi.fn()
    render(<BibleMemorizer onComplete={onComplete} />)
    for (const stage of STAGES) {
      const words = hiddenWords()
      expect(words).toHaveLength(stage.blanks)
      boxes().forEach((b, k) => typeInto(b, words[k]))
      fireEvent.click(button('Check my words'))
      fireEvent.click(button('Check my words'))
      wait(1900)
    }
    // Nine words at 20, and 20 for each step right first time.
    expect(onComplete).toHaveBeenCalledTimes(1)
    expect(onComplete).toHaveBeenCalledWith(240)
  })

  it('another version falls back to the built-in verse when the API fails or hangs', async () => {
    h.getVerse.mockRejectedValueOnce(new Error('offline'))
    const { unmount } = render(<BibleMemorizer version="KJV" onComplete={() => {}} />)
    expect(screen.getByText(/Opening the Bible/)).toBeInTheDocument()
    await act(async () => {})
    expect(boxes()).toHaveLength(2)
    unmount()

    h.getVerse.mockReturnValueOnce(new Promise(() => {}))
    render(<BibleMemorizer version="KJV" onComplete={() => {}} />)
    expect(screen.getByText(/Opening the Bible/)).toBeInTheDocument()
    wait(5000)
    expect(boxes()).toHaveLength(2)
  })
})
