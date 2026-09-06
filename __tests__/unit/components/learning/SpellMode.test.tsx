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
    renderWithProviders(<SpellMode />)
    
    expect(screen.getByPlaceholderText('Type the word...')).toBeInTheDocument()
    expect(screen.getByText('I eat an _______.')).toBeInTheDocument()
  })

  it('handles correct spelling correctly', async () => {
    renderWithProviders(<SpellMode />)
    
    const input = screen.getByPlaceholderText('Type the word...')
    // Use getByRole for button to be more specific and handle text content better
    const submitBtn = screen.getByRole('button', { name: /Check it/i })
    
    fireEvent.change(input, { target: { value: 'apple' } })
    fireEvent.click(submitBtn)
    
    expect(screen.getByText('Yes! You spelled it! 🎉')).toBeInTheDocument()
    expect(screen.getByText('🔥 1')).toBeInTheDocument()
    
    // Should move to next word after timeout
    act(() => {
      vi.advanceTimersByTime(1500)
    })
    
    // After moving to next word, input should be cleared
    expect(input).toHaveValue('')
  })

  it('handles incorrect spelling correctly', () => {
    renderWithProviders(<SpellMode />)
    
    const input = screen.getByPlaceholderText('Type the word...')
    const submitBtn = screen.getByRole('button', { name: /Check it/i })
    
    fireEvent.change(input, { target: { value: 'wrong' } })
    fireEvent.click(submitBtn)
    
    // A wrong answer now names the word and the rule behind it, not just "nope".
    expect(screen.getByText(/Oops! Not quite/)).toBeInTheDocument()
    // "banana" doubles its n, so that is the rule it should teach.
    expect(document.querySelector('.feedback-why')?.textContent).toMatch(/double|Sound|bits/)
    expect(screen.getByText('🔥 0')).toBeInTheDocument()
  })

  it('provides a hint when "Show Hint" is clicked', () => {
    renderWithProviders(<SpellMode />)
    
    const hintBtn = screen.getByText('💡 Get Hint')
    fireEvent.click(hintBtn)
    
    expect(screen.getByText('Hint Used')).toBeInTheDocument()
  })

  it('reveals the word when "Reveal Word" is clicked', () => {
    renderWithProviders(<SpellMode />)
    
    const revealBtn = screen.getByText('Reveal Answer')
    fireEvent.click(revealBtn)
    
    const input = screen.getByPlaceholderText('Type the word...')
    expect(input).toHaveValue('apple')
  })

  it('scores a word once, and cannot be made to score it twice', () => {
    renderWithProviders(<SpellMode />)

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
    renderWithProviders(<SpellMode />)

    const input = screen.getByPlaceholderText('Type the word...')
    fireEvent.change(input, { target: { value: 'zzzzz' } })
    fireEvent.click(screen.getByRole('button', { name: /Check it/i }))

    // The word is wrong, so nothing advances on its own — the child has to be
    // able to move on themselves. This button was dead: it said "Next Word",
    // was disabled, and called the guarded submit.
    const next = screen.getByRole('button', { name: /Next Word/i })
    expect(next).toBeEnabled()

    fireEvent.click(next)

    expect(screen.queryByText(/Oops! Not quite/)).not.toBeInTheDocument()
    expect(screen.getByPlaceholderText('Type the word...')).toHaveValue('')
  })

  it('a correct answer still only advances once', () => {
    renderWithProviders(<SpellMode />)

    const input = screen.getByPlaceholderText('Type the word...')
    fireEvent.change(input, { target: { value: 'apple' } })
    fireEvent.click(screen.getByRole('button', { name: /Check it/i }))
    expect(screen.getByText('Yes! You spelled it! 🎉')).toBeInTheDocument()

    // Tapping "Next Word" cancels the automatic advance rather than adding to
    // it, so the two together cannot skip the following word.
    fireEvent.click(screen.getByRole('button', { name: /Next Word/i }))
    act(() => { vi.advanceTimersByTime(3000) })

    expect(screen.getByText('I eat a _______.')).toBeInTheDocument() // banana, not past it
  })
})
