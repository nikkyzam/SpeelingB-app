import React from 'react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

// One word only, so the shuffled turn order is irrelevant and every turn asks
// for the same word — the test can then control exactly who answers correctly.
const WORDS = [
  { id: 'w1', word: 'cat', meaning: 'a pet', sentence: 'The cat sat.', difficulty: 1, category: 'animals' },
]

vi.mock('@/services/wordBank', () => ({
  wordBank: {
    getLearnedWords: vi.fn(() => WORDS),
    getRandomWords: vi.fn(() => []),
    getAllWords: vi.fn(() => []),
    getWordsByDifficulty: vi.fn(() => []),
  },
}))

const addStars = vi.fn()
vi.mock('@/stores/rewards/useRewardStore', () => ({
  useRewardStore: () => ({ addStars }),
}))

import SiblingShowdown from '@/components/games/SiblingShowdown'
import { ProgressProvider } from '@/contexts/ProgressContext'
import { AudioProvider } from '@/contexts/AudioContext'
import { ThemeProvider } from '@/contexts/ThemeContext'

const renderGame = () =>
  render(
    <MemoryRouter>
      <ThemeProvider>
        <AudioProvider>
          <ProgressProvider>
            <SiblingShowdown />
          </ProgressProvider>
        </AudioProvider>
      </ThemeProvider>
    </MemoryRouter>
  )

/** Play one turn: reveal the word, type an answer, submit, wait out the delay. */
const playTurn = async (answer: string) => {
  fireEvent.click(screen.getByRole('button', { name: /ready!/i }))
  fireEvent.change(screen.getByPlaceholderText('Type the word…'), { target: { value: answer } })
  fireEvent.click(screen.getByRole('button', { name: /Lock it in/i }))
  await act(async () => {
    vi.advanceTimersByTime(2000)
  })
}

describe('Sibling Showdown scoring', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    addStars.mockClear()
    localStorage.clear()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('counts the final answer when deciding the winner', async () => {
    renderGame()

    // Start a game with two named players.
    fireEvent.change(screen.getByPlaceholderText('Player 1 name'), { target: { value: 'Ana' } })
    fireEvent.change(screen.getByPlaceholderText('Player 2 name'), { target: { value: 'Ben' } })
    fireEvent.click(screen.getByRole('button', { name: /Start the Showdown/i }))

    // Ana misses every turn; Ben gets only the very last word right. If the
    // final answer were dropped (the bug), this would be scored 0-0 as a tie.
    // Turn 9 is Ben's (turns alternate, 0-indexed). Everyone misses every word
    // except Ben on the very last turn — the answer the bug used to discard.
    for (let i = 0; i < 10; i++) {
      await playTurn(i === 9 ? 'cat' : 'zzzz')
      if (screen.queryByText(/wins!|It's a tie/)) break
    }

    expect(screen.queryByText(/It's a tie/)).not.toBeInTheDocument()
    expect(screen.getByText(/Ben wins!/)).toBeInTheDocument()
  })
})
