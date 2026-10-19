import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import SpellMode from '@/components/learning/SpellMode'
import { ProgressProvider } from '@/contexts/ProgressContext'
import { AudioProvider } from '@/contexts/AudioContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import React from 'react'

// Mock wordBank
vi.mock('@/services/wordBank', () => ({
  wordBank: {
    getRandomWords: vi.fn(() => [
      { id: '1', word: 'apple', meaning: 'a red fruit', sentence: 'I eat an apple.', difficulty: 1, category: 'food' },
      { id: '2', word: 'banana', meaning: 'a yellow fruit', sentence: 'I eat a banana.', difficulty: 1, category: 'food' }
    ]),
    getWordsByDifficulty: vi.fn(() => []),
    getAllWords: vi.fn(() => [])
  }
}))

// Mock FirebaseSync
vi.mock('@/services/persistence/FirebaseSync', () => ({
  default: {
    syncToServer: vi.fn().mockResolvedValue(undefined)
  }
}))

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <ThemeProvider>
      <AudioProvider>
        <ProgressProvider>
          {ui}
        </ProgressProvider>
      </AudioProvider>
    </ThemeProvider>
  )
}

/** The words a child is studying. SpellMode is never used without them. */
const WORDS = [
  { id: '1', word: 'apple', meaning: 'a red fruit', sentence: 'I eat an apple.', difficulty: 1 as const, category: 'food' },
  { id: '2', word: 'banana', meaning: 'a yellow fruit', sentence: 'I eat a banana.', difficulty: 1 as const, category: 'food' },
]

describe('SpellMode Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders correctly and prompts for spelling', () => {
    renderWithProviders(<SpellMode words={WORDS} />)
    
    expect(screen.getByPlaceholderText('Type the word...')).toBeInTheDocument()
    expect(screen.getByText('I eat an _______.')).toBeInTheDocument()
  })

  it('handles correct spelling correctly', async () => {
    renderWithProviders(<SpellMode words={WORDS} />)
    
    const input = screen.getByPlaceholderText('Type the word...')
    // Use getByRole for button to be more specific and handle text content better
    const submitBtn = screen.getByRole('button', { name: /Check it/i })
    
    fireEvent.change(input, { target: { value: 'apple' } })
    fireEvent.click(submitBtn)
    
    // Praise (never the same line twice running) with a real star, and the run grows.
    expect(screen.getByRole('status')).toHaveTextContent('⭐')
    expect(screen.getByText('🔥 1')).toBeInTheDocument()
    
    // Should move to next word after timeout
    act(() => {
      vi.advanceTimersByTime(1500)
    })
    
    // After moving to next word, input should be cleared
    expect(input).toHaveValue('')
  })

  it('handles incorrect spelling correctly', () => {
    renderWithProviders(<SpellMode words={WORDS} />)
    
    const input = screen.getByPlaceholderText('Type the word...')
    const submitBtn = screen.getByRole('button', { name: /Check it/i })
    
    fireEvent.change(input, { target: { value: 'wrong' } })
    fireEvent.click(submitBtn)
    
    // A wrong answer names the word, softly, and the rule behind it.
    expect(document.querySelector('.sm-nearly')?.textContent).toMatch(/It’s apple/)
    // "apple" doubles its p, so that is the rule it should teach.
    expect(document.querySelector('.feedback-why')?.textContent).toMatch(/double|Sound|bits/)
    // The run is over, so there is no streak chip to show.
    expect(screen.queryByText(/🔥/)).not.toBeInTheDocument()
  })

  it('offers no hint, and lets no device spell the word for them', () => {
    renderWithProviders(<SpellMode words={WORDS} />)

    // A hint button handed a child the meaning mid-test. Gone.
    expect(screen.queryByText(/Get Hint/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/Hint Used/i)).not.toBeInTheDocument()

    // And the device must not help either: on an iPad, autocorrect silently
    // fixes a misspelling as it is typed and the predictive bar offers the
    // finished word above the keys.
    const input = screen.getByPlaceholderText('Type the word...')
    expect(input).toHaveAttribute('autocorrect', 'off')
    expect(input).toHaveAttribute('autocapitalize', 'off')
    expect(input).toHaveAttribute('spellcheck', 'false')
    expect(input).toHaveAttribute('autocomplete', 'off')
  })

  it('shows the word when the child is stuck', () => {
    renderWithProviders(<SpellMode words={WORDS} />)
    
    fireEvent.click(screen.getByRole('button', { name: /Stuck\?/ }))
    
    const input = screen.getByPlaceholderText('Type the word...')
    expect(input).toHaveValue('apple')
    expect(screen.getByText(/Here it is/)).toBeInTheDocument()
  })

  it('scores a word once, and cannot be made to score it twice', () => {
    renderWithProviders(<SpellMode words={WORDS} />)

    const input = screen.getByPlaceholderText('Type the word...')
    fireEvent.change(input, { target: { value: 'apple' } })
    fireEvent.click(screen.getByRole('button', { name: /Check it/i }))
    expect(screen.getByText('🔥 1')).toBeInTheDocument()

    // The button becomes "Next Word", so there is no way back to submitting.
    expect(screen.queryByRole('button', { name: /Check it/i })).not.toBeInTheDocument()

    // And the guard inside handleSubmit holds for callers that skip the button
    // entirely — the microphone calls it directly with the spoken word.
    fireEvent.change(input, { target: { value: 'apple' } })
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })

    expect(screen.getByText('🔥 1')).toBeInTheDocument()
    expect(screen.queryByText('🔥 2')).not.toBeInTheDocument()
  })

  it('lets a child move on after getting a word wrong', () => {
    renderWithProviders(<SpellMode words={WORDS} />)

    const input = screen.getByPlaceholderText('Type the word...')
    fireEvent.change(input, { target: { value: 'zzzzz' } })
    fireEvent.click(screen.getByRole('button', { name: /Check it/i }))

    // The word is wrong, so nothing advances on its own — the child has to be
    // able to move on themselves. This button was dead: it said "Next Word",
    // was disabled, and called the guarded submit.
    const next = screen.getByRole('button', { name: /Next Word/i })
    expect(next).toBeEnabled()

    fireEvent.click(next)

    expect(document.querySelector('.sm-nearly')).toBeNull()
    expect(screen.getByPlaceholderText('Type the word...')).toHaveValue('')
  })

  it('pays a real star per word spelled, and no pretend score or accuracy', () => {
    // The old Score grew with the streak and went nowhere; accuracy read "300%".
    const onComplete = vi.fn()
    renderWithProviders(<SpellMode words={WORDS} onComplete={onComplete} />)
    const input = screen.getByPlaceholderText('Type the word...')
    for (const word of ['apple', 'banana']) {
      fireEvent.change(input, { target: { value: word } })
      fireEvent.click(screen.getByRole('button', { name: /Check it/i }))
      act(() => { vi.advanceTimersByTime(1600) })
    }
    expect(screen.getByText('⭐ +2 stars')).toBeInTheDocument()
    expect(screen.queryByText(/Accuracy|Score/)).not.toBeInTheDocument()
    expect(onComplete).toHaveBeenCalledWith(['1', '2'], { correct: 2, stars: 2 })
  })

  it('accepts a word typed without its accents', () => {
    // A laptop keyboard has no ñ; "señor" could never be spelled right.
    renderWithProviders(
      <SpellMode words={[{ ...WORDS[0], id: '3', word: 'señor', sentence: 'The señor waved.' }]} />
    )
    fireEvent.change(screen.getByPlaceholderText('Type the word...'), { target: { value: 'senor' } })
    fireEvent.click(screen.getByRole('button', { name: /Check it/i }))
    expect(screen.getByRole('status')).toHaveTextContent('⭐')
    expect(document.querySelector('.sm-nearly')).toBeNull()
  })

  it('a correct answer still only advances once', () => {
    renderWithProviders(<SpellMode words={WORDS} />)

    const input = screen.getByPlaceholderText('Type the word...')
    fireEvent.change(input, { target: { value: 'apple' } })
    fireEvent.click(screen.getByRole('button', { name: /Check it/i }))
    expect(screen.getByRole('status')).toHaveTextContent('⭐')

    // Tapping "Next Word" cancels the automatic advance rather than adding to
    // it, so the two together cannot skip the following word.
    fireEvent.click(screen.getByRole('button', { name: /Next Word/i }))
    act(() => { vi.advanceTimersByTime(3000) })

    expect(screen.getByText('I eat a _______.')).toBeInTheDocument() // banana, not past it
  })
})
