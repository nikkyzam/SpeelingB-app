import { render, screen, within, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import LearningHub from '@/pages/LearningHub'
import { UserProvider } from '@/contexts/UserContext'
import { ProgressProvider } from '@/contexts/ProgressContext'
import { AudioProvider } from '@/contexts/AudioContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { MemoryRouter } from 'react-router-dom'
import React from 'react'
import { LearningFlowController } from '@/services/progress/LearningFlow'
import { useUserStore } from '@/stores/userStore'
import { wordBank } from '@/services/wordBank'

// Mock the LearningFlowController
vi.mock('@/services/progress/LearningFlow')

// One-word group so groupCount === 1: learning/spelling word '1' completes the group.
vi.mock('@/services/wordBank', () => {
  const wordBank: Record<string, ReturnType<typeof vi.fn>> = {
    getRandomWords: vi.fn(() => [{ id: '1', word: 'apple', meaning: 'a fruit' }]),
    getAllWords: vi.fn(() => [{ id: '1', word: 'apple', meaning: 'a fruit' }]),
    getWordsForLevels: vi.fn(() => [{ id: '1', word: 'apple', meaning: 'a fruit' }]),
    getWordsByDifficulty: vi.fn((difficulty) =>
      difficulty === 1 ? [{ id: '1', word: 'apple', meaning: 'a fruit' }] : []
    ),
    // No private list on this device, so learning follows the levels.
    hasList: vi.fn(() => false),
  }
  wordBank.getLearningList = vi.fn((levels) => wordBank.getWordsForLevels(levels))
  return { wordBank }
})

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
      {/* Mirrors App.tsx: the hub renders themed components (the word trail
          uses the chosen world's mascot), so the theme has to be present. */}
      <ThemeProvider>
        <AudioProvider>
          <ProgressProvider>
            <UserProvider>{ui}</UserProvider>
          </ProgressProvider>
        </AudioProvider>
      </ThemeProvider>
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
  getWordLevels: () => [1],
  getWordList: () => null,
  setWordLevels: vi.fn(),
  getSelectedGroup: () => 0,
  getMissedDays: () => [],
  gamesLockedReason: () => 'quiz',
  gameAccessMessage(this: { areStarterGamesOpen: () => boolean }) {
    return this.areStarterGamesOpen()
      ? 'Starter games are ready. Today’s quiz and any due review open more games.'
      : 'Meet today’s words to open starter games. The quiz and any due review open more games.'
  },
  areStarterGamesOpen: () => false,
  // Mid-list, today's goal is just the daily goal.
  getLearnGoalToday(this: { getDailyGoal: () => number }) { return this.getDailyGoal() },
  isLevelFinished: () => false,
  // Nothing learned yet today.
  isDailyGoalReached: () => false,
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

    // Games follow today’s learning goal; spelling is optional practice.
    const gameStep = stepByHeading('Play a Game!')
    expect(within(gameStep).getByRole('button', { name: /Meet today’s words first/i })).toBeDisabled()
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
    expect(within(gameStep).getByRole('button', { name: /Meet today’s words first/i })).toBeDisabled()
  })

  it('opens starter games when today’s words are learned, even before spelling', () => {
    vi.mocked(LearningFlowController).mockImplementation(() => createMockLearningFlow({
      getWordsLearnedTotal: () => ['1'],
      getWordsSpelledTotal: () => [],
      // Today's words are met, so the starter games are open.
      areStarterGamesOpen: () => true,
    }))

    renderWithProviders(<LearningHub />)

    const gameStep = stepByHeading('Play a Game!')
    expect(within(gameStep).getByRole('button', { name: /Play a Game!/i })).not.toBeDisabled()
    // ...and it says what opens the rest, with a way there.
    expect(within(gameStep).getByText(/Today’s quiz and any due review/)).toBeInTheDocument()
    expect(within(gameStep).getByRole('button', { name: /Take the Quiz/i })).toBeInTheDocument()
  })

  it('does not promise a game when nothing is open today', () => {
    // A group spelled on an earlier day, and nothing learned yet today.
    vi.mocked(LearningFlowController).mockImplementation(() => createMockLearningFlow({
      getWordsLearnedTotal: () => ['1'],
      getWordsSpelledTotal: () => ['1'],
    }))

    renderWithProviders(<LearningHub />)

    const gameStep = stepByHeading('Play a Game!')
    expect(within(gameStep).queryByText(/You unlocked a game/)).not.toBeInTheDocument()
    expect(within(gameStep).getByText(/Meet today’s words to open/)).toBeInTheDocument()
    expect(within(gameStep).getByRole('button', { name: /Meet today’s words first/i })).toBeDisabled()
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

  it('leads with one next step from the ladder', () => {
    vi.mocked(LearningFlowController).mockImplementation(() => createMockLearningFlow({}))
    renderWithProviders(<LearningHub />)
    expect(screen.getByText('Next up')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Learn 1 new word/ })).toBeInTheDocument()
  })

  it('once the group is spelled, the next step is whatever really opens the games', () => {
    vi.mocked(LearningFlowController).mockImplementation(() => createMockLearningFlow({
      getWordsLearnedTotal: () => ['1'],
      getWordsSpelledTotal: () => ['1'],
      areStarterGamesOpen: () => true,
    }))
    renderWithProviders(<LearningHub />)
    expect(screen.getByRole('button', { name: /Take today’s quiz/ })).toBeInTheDocument()
  })

  it('puts today\u2019s new words before play, as Home does, once this group is done', () => {
    // Two groups of one word: group 1 is learned and spelled, today's goal isn't met.
    const one = [{ id: '1', word: 'apple', meaning: 'a fruit' }]
    const two = [...one, { id: '2', word: 'pear', meaning: 'a fruit' }]
    vi.mocked(wordBank.getWordsForLevels).mockReturnValue(two as any)
    try {
      vi.mocked(LearningFlowController).mockImplementation(() => createMockLearningFlow({
        getDailyGoal: () => 1,
        getWordsLearnedTotal: () => ['1'],
        getWordsSpelledTotal: () => ['1'],
        gamesLockedReason: () => null,
      }))
      renderWithProviders(<LearningHub />)
      expect(screen.getByRole('button', { name: /Meet your next words/ })).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /^🎮 Play a game!$/ })).not.toBeInTheDocument()
    } finally {
      vi.mocked(wordBank.getWordsForLevels).mockReturnValue(one as any)
    }
  })

  it('greets the child by name, never by an email, and lists no missed days', () => {
    vi.mocked(useUserStore).mockReturnValue({
      user: { id: 'joy-user', name: 'Joy', email: 'parent@example.com', dailyGoal: 5 },
      setUser: vi.fn(),
      updateDailyGoal: vi.fn(),
      logout: vi.fn(),
    } as any)
    vi.mocked(LearningFlowController).mockImplementation(() => createMockLearningFlow({
      getMissedDays: () => ['Mon Sep 29 2026'],
    }))
    renderWithProviders(<LearningHub />)
    expect(screen.queryByText(/parent@example\.com/)).not.toBeInTheDocument()
    expect(screen.queryByText(/Missed Goals/)).not.toBeInTheDocument()
  })

  it('keeps the level picker off the lesson and under "More" on the hub', () => {
    vi.mocked(LearningFlowController).mockImplementation(() => createMockLearningFlow({}))
    renderWithProviders(<LearningHub />)
    expect(screen.queryByText('🐝 Word level')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /More/ }))
    expect(screen.getByText('🐝 Word level')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '1-Word Test' })).toBeInTheDocument()
  })
})
