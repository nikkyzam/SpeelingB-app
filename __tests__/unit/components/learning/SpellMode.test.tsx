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
    
    expect(screen.getByText('Oops! Not quite — listen again and give it another go. 👂')).toBeInTheDocument()
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
})
