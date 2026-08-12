import { render, screen, within } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import LearningHub from '@/pages/LearningHub'
import { UserProvider } from '@/contexts/UserContext'
import { ProgressProvider } from '@/contexts/ProgressContext'
import { AudioProvider } from '@/contexts/AudioContext'
import { MemoryRouter } from 'react-router-dom'
import React from 'react'
import { LearningFlowController } from '@/services/progress/LearningFlow'
import { useUserStore } from '@/stores/userStore'

// Mock the LearningFlowController
vi.mock('@/services/progress/LearningFlow')

// One-word group so groupCount === 1: learning/spelling word '1' completes the group.
vi.mock('@/services/wordBank', () => ({
  wordBank: {
    getRandomWords: vi.fn(() => [{ id: '1', word: 'apple', meaning: 'a fruit' }]),
    getAllWords: vi.fn(() => [{ id: '1', word: 'apple', meaning: 'a fruit' }]),
    getWordsByDifficulty: vi.fn((difficulty) =>
      difficulty === 1 ? [{ id: '1', word: 'apple', meaning: 'a fruit' }] : []
    ),
  }
}))

vi.mock('@/stores/progressStore', () => ({
  useProgressStore: () => ({ setDailyGoal: vi.fn() })
}))

vi.mock('@/stores/userStore')

vi.mock('@/services/persistence/FirebaseSync', () => ({
  default: { syncToServer: vi.fn() }
}))

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <MemoryRouter>
      <AudioProvider>
        <ProgressProvider>
          <UserProvider>{ui}</UserProvider>
        </ProgressProvider>
      </AudioProvider>
    </MemoryRouter>
  )
}

const createMockLearningFlow = (overrides: Partial<LearningFlowController>) => ({
  getWordsLearnedToday: () => [],
  getWordsSpelledToday: () => [],
  getDailyGoal: () => 30,
  isSpellQuizUnlocked: () => false,
  isVocabQuizUnlocked: () => false,
  areGamesUnlocked: () => false,
  getLockedModes: () => [],
  getCurrentStreak: () => 0,
  getWordsLearnedTotal: () => [],
  getWordsSpelledTotal: () => [],
  areWordsLearned: () => false,
  areWordsSpelled: () => false,
  unlockGames: vi.fn(),
  advanceToNextGroup: vi.fn(),
  getDifficulty: () => 1,
  getSelectedGroup: () => 0,
  getMissedDays: () => [],
  ...overrides,
} as any)

const stepByHeading = (name: string) =>
  screen.getByRole('heading', { name }).closest('.path-step') as HTMLElement

describe('LearningHub Page - Group Succession', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    vi.mocked(useUserStore).mockReturnValue({
      user: { id: 'test-user', name: 'Test User', dailyGoal: 30 },
      setUser: vi.fn(),
      updateDailyGoal: vi.fn(),
      logout: vi.fn(),
    } as any)
  })

  it('locks Spell and Game until the group is learned', () => {
    vi.mocked(LearningFlowController).mockImplementation(() => createMockLearningFlow({}))

    renderWithProviders(<LearningHub />)

    // Learn step is available from the start.
    const learnStep = stepByHeading('Learn the Words')
    expect(within(learnStep).getByRole('button', { name: /Start Learning/i })).not.toBeDisabled()

    // Spell step is locked until the words are learned.
    const spellStep = stepByHeading('Spell the Words')
    expect(within(spellStep).getByRole('button', { name: /Learn first/i })).toBeDisabled()

    // Game step is locked until the words are spelled.
    const gameStep = stepByHeading('Play a Game!')
    expect(within(gameStep).getByRole('button', { name: /Locked/i })).toBeDisabled()
  })

  it('unlocks Spell once every word in the group is learned', () => {
    vi.mocked(LearningFlowController).mockImplementation(() => createMockLearningFlow({
      getWordsLearnedTotal: () => ['1'],
    }))

    renderWithProviders(<LearningHub />)

    const spellStep = stepByHeading('Spell the Words')
    expect(within(spellStep).getByRole('button', { name: /Start Spelling/i })).not.toBeDisabled()

    // Game still locked — nothing spelled yet.
    const gameStep = stepByHeading('Play a Game!')
    expect(within(gameStep).getByRole('button', { name: /Locked/i })).toBeDisabled()
  })

  it('unlocks a Game once every word in the group is spelled', () => {
    vi.mocked(LearningFlowController).mockImplementation(() => createMockLearningFlow({
      getWordsLearnedTotal: () => ['1'],
      getWordsSpelledTotal: () => ['1'],
    }))

    renderWithProviders(<LearningHub />)

    const gameStep = stepByHeading('Play a Game!')
    expect(within(gameStep).getByRole('button', { name: /Play a Game!/i })).not.toBeDisabled()
  })

  it('shows the daily goal from the user profile', () => {
    vi.mocked(useUserStore).mockReturnValue({
      user: { id: 'joy-user', name: 'Joy', dailyGoal: 10 },
      setUser: vi.fn(),
      updateDailyGoal: vi.fn(),
      logout: vi.fn(),
    } as any)
    vi.mocked(LearningFlowController).mockImplementation(() => createMockLearningFlow({
      getDailyGoal: () => 10,
    }))

    renderWithProviders(<LearningHub />)

    expect(screen.getByText('0/10')).toBeInTheDocument()
  })
})
