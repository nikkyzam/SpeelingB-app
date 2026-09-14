import React from 'react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'

// vi.mock is hoisted above everything, so what it uses must be hoisted too.
const h = vi.hoisted(() => {
  const noSound = { tap: () => {}, pop: () => {}, correct: () => {}, wrong: () => {}, applause: () => {} }
  return { noSound }
})
vi.mock('@/components/games/shared/sfx', () => ({
  default: h.noSound,
  sfx: h.noSound,
  // ThemeProvider reaches for this when a world is chosen.
  setWorldSoundProfile: () => {},
}))

import VowelRescue from '@/components/games/VowelRescue'
import DoubleTrouble, { doubleAt } from '@/components/games/DoubleTrouble'
import OnStage from '@/components/games/OnStage'
import { AudioProvider } from '@/contexts/AudioContext'
import { ThemeProvider } from '@/contexts/ThemeContext'

const word = (w: string, id = w) => ({
  id,
  word: w,
  meaning: `the meaning of ${w}`,
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

/** Tap a key on a game's letter pad. */
const key = (label: string) => screen.getByRole('button', { name: label })

describe('Vowel Rescue', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('hides every vowel and leaves the consonants standing', () => {
    wrap(<VowelRescue words={[word('balloon')]} onComplete={() => {}} />)

    const shown = screen.getByLabelText('The word with its vowels missing')
    // b_ll__n — the consonants are the scaffold the child works from.
    expect(shown.textContent).toBe('blln')
  })

  it('fills the vowels in order as they are tapped', () => {
    wrap(<VowelRescue words={[word('cake')]} onComplete={() => {}} />)
    const shown = screen.getByLabelText('The word with its vowels missing')

    fireEvent.click(key('a'))
    expect(shown.textContent).toBe('cak')
    fireEvent.click(key('e'))
    expect(shown.textContent).toBe('cake')
  })

  it('costs a try for a wrong vowel, and shows the word after three', () => {
    wrap(<VowelRescue words={[word('cake')]} onComplete={() => {}} />)
    const lives = () => screen.getByLabelText(/tries left on this word/)

    expect(lives()).toHaveTextContent('💛💛💛')
    fireEvent.click(key('o'))
    expect(screen.getByLabelText('2 tries left on this word')).toBeInTheDocument()

    fireEvent.click(key('i'))
    fireEvent.click(key('u'))
    // Three misses: the word is given rather than leaving a child stuck.
    expect(screen.getByText(/It was “cake”/)).toBeInTheDocument()
  })

  it('scores the word and finishes the game', () => {
    const onComplete = vi.fn()
    wrap(<VowelRescue words={[word('cake')]} onComplete={onComplete} />)

    fireEvent.click(key('a'))
    fireEvent.click(key('e'))
    act(() => { vi.advanceTimersByTime(2000) })

    // Two vowels at 10, plus 25 for a clean rescue.
    expect(onComplete).toHaveBeenCalledWith(45)
  })

  it('says so plainly when there are no words to play with', () => {
    const onComplete = vi.fn()
    wrap(<VowelRescue words={[]} onComplete={onComplete} />)
    expect(screen.getByText(/No words to rescue yet/)).toBeInTheDocument()
    expect(onComplete).not.toHaveBeenCalled()
  })
})

describe('Double Trouble', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('finds where a word doubles a letter', () => {
    expect(doubleAt('balloon')).toBe(2)
    expect(doubleAt('letter')).toBe(2)
    expect(doubleAt('aardvark')).toBe(0)
    // Two of the same letter apart is not a double — they must be neighbours.
    expect(doubleAt('banana')).toBe(-1)
    expect(doubleAt('cat')).toBe(-1)
  })

  it('scores a tap on either half of the doubled pair', () => {
    const onComplete = vi.fn()
    wrap(<DoubleTrouble words={[word('letter')]} rounds={1} onComplete={onComplete} />)

    // "letter" doubles its t at positions 3 and 4 — tap the second half.
    fireEvent.click(screen.getByRole('button', { name: 'letter 4: t' }))
    expect(screen.getByText(/Spotted it/)).toBeInTheDocument()

    act(() => { vi.advanceTimersByTime(2000) })
    expect(onComplete).toHaveBeenCalledWith(20)
  })

  it('rewards saying there is no double when there is none', () => {
    const onComplete = vi.fn()
    wrap(<DoubleTrouble words={[word('cats')]} rounds={1} onComplete={onComplete} />)

    fireEvent.click(screen.getByRole('button', { name: /No doubles here/ }))
    expect(screen.getByText(/Spotted it/)).toBeInTheDocument()

    act(() => { vi.advanceTimersByTime(2000) })
    expect(onComplete).toHaveBeenCalledWith(20)
  })

  it('does not reward claiming no double when the word has one', () => {
    const onComplete = vi.fn()
    wrap(<DoubleTrouble words={[word('letter')]} rounds={1} onComplete={onComplete} />)

    fireEvent.click(screen.getByRole('button', { name: /No doubles here/ }))
    expect(screen.getByText(/doubles its t/)).toBeInTheDocument()

    act(() => { vi.advanceTimersByTime(2000) })
    expect(onComplete).toHaveBeenCalledWith(0)
  })
})

describe('On Stage', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('shows one slot per letter, and fills them as they are said', () => {
    wrap(<OnStage words={[word('cat')]} rounds={1} onComplete={() => {}} />)
    const said = screen.getByLabelText('The letters you have said so far')

    expect(said.children).toHaveLength(3)
    fireEvent.click(key('c'))
    expect(said.textContent).toBe('c')
  })

  it('ends the word on a wrong letter — there is no going back', () => {
    const onComplete = vi.fn()
    wrap(<OnStage words={[word('cat')]} rounds={1} onComplete={onComplete} />)

    fireEvent.click(key('c'))
    fireEvent.click(key('x')) // wrong, and final

    // The whole word is shown, and no further letter can be tapped.
    expect(screen.getByText(/The word was “cat”/)).toBeInTheDocument()
    expect(key('a')).toBeDisabled()

    act(() => { vi.advanceTimersByTime(2500) })
    expect(onComplete).toHaveBeenCalledWith(0)
  })

  it('scores a word spelled all the way through', () => {
    const onComplete = vi.fn()
    wrap(<OnStage words={[word('cat')]} rounds={1} onComplete={onComplete} />)

    fireEvent.click(key('c'))
    fireEvent.click(key('a'))
    fireEvent.click(key('t'))

    act(() => { vi.advanceTimersByTime(2500) })
    // Three letters at 5, plus 20 for finishing the word.
    expect(onComplete).toHaveBeenCalledWith(35)
  })

  it('gives the meaning only when a child asks for it', () => {
    wrap(<OnStage words={[word('cat')]} rounds={1} onComplete={() => {}} />)

    expect(screen.queryByText(/the meaning of cat/)).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /What does it mean/ }))
    expect(screen.getByText(/the meaning of cat/)).toBeInTheDocument()
  })
})
