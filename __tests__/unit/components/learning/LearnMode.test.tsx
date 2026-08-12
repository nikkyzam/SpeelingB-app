import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import LearnMode from '@/components/learning/LearnMode'
import { useProgress } from '@/contexts/ProgressContext' // Import useProgress
import { AudioProvider } from '@/contexts/AudioContext'
import React from 'react'
import { LearningFlowController } from '@/services/progress/LearningFlow'
import { wordBank } from '@/services/wordBank' // Import wordBank to mock its methods

// Mock the useProgress hook directly
vi.mock('@/contexts/ProgressContext', () => ({
  useProgress: vi.fn(),
}))

// Mock wordBank
vi.mock('@/services/wordBank', () => ({
  wordBank: {
    getRandomWords: vi.fn(() => [
      { id: '1', word: 'apple', meaning: 'a red fruit', sentence: 'I eat an apple.', difficulty: 1 as 1 | 2 | 3, category: 'food' },
      { id: '2', word: 'banana', meaning: 'a yellow fruit', sentence: 'I eat a banana.', difficulty: 1 as 1 | 2 | 3, category: 'food' }
    ]),
    getWordsByDifficulty: vi.fn(() => [
      { id: '1', word: 'apple', meaning: 'a red fruit', sentence: 'I eat an apple.', difficulty: 1 as 1 | 2 | 3, category: 'food' },
      { id: '2', word: 'banana', meaning: 'a yellow fruit', sentence: 'I eat a banana.', difficulty: 1 as 1 | 2 | 3, category: 'food' }
    ]),
    getAllWords: vi.fn(() => [
      { id: '1', word: 'apple', meaning: 'a red fruit', sentence: 'I eat an apple.', difficulty: 1 as 1 | 2 | 3, category: 'food' },
      { id: '2', word: 'banana', meaning: 'a yellow fruit', sentence: 'I eat a banana.', difficulty: 1 as 1 | 2 | 3, category: 'food' }
    ])
  }
}))

// Mock FirebaseSync
vi.mock('@/services/persistence/FirebaseSync', () => ({
  default: {
    syncToServer: vi.fn().mockResolvedValue(undefined)
  }
}))

// Cast the mocked useProgress to its mocked type for type-safety
const mockedUseProgress = vi.mocked(useProgress)
const mockedGetRandomWords = vi.mocked(wordBank.getRandomWords)

// Helper to create a mock LearningFlowController instance
const TWO_WORDS = [
  { id: '1', word: 'apple', meaning: 'a red fruit', sentence: 'I eat an apple.', difficulty: 1 as 1 | 2 | 3, category: 'food' },
  { id: '2', word: 'banana', meaning: 'a yellow fruit', sentence: 'I eat a banana.', difficulty: 1 as 1 | 2 | 3, category: 'food' },
]

const createMockLearningFlow = (overrides: Partial<LearningFlowController> = {}) => ({
  completeWord: vi.fn(),
  isDailyGoalReached: vi.fn().mockReturnValue(false),
  getWordsLearnedToday: vi.fn().mockReturnValue([]),
  getWordsLearnedTotal: vi.fn().mockReturnValue([]),
  getDailyGoal: vi.fn().mockReturnValue(30),
  ...overrides,
} as any)

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <AudioProvider>
      {ui}
    </AudioProvider>
  )
}

describe('LearnMode Component', () => {
  let mockLearningFlow: LearningFlowController

  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    // Keep the internal word shuffle deterministic so order is [apple, banana].
    vi.spyOn(Math, 'random').mockReturnValue(0.6)
    mockLearningFlow = createMockLearningFlow()

    // Provide the mocked learningFlow via the mocked useProgress hook
    mockedUseProgress.mockReturnValue({
      learningFlow: mockLearningFlow,
      refreshProgress: vi.fn(),
    })

    // Reset getRandomWords mock for each test
    mockedGetRandomWords.mockReturnValue([
      { id: '1', word: 'apple', meaning: 'a red fruit', sentence: 'I eat an apple.', difficulty: 1 as 1 | 2 | 3, category: 'food' },
      { id: '2', word: 'banana', meaning: 'a yellow fruit', sentence: 'I eat a banana.', difficulty: 1 as 1 | 2 | 3, category: 'food' }
    ])
  })

  it('renders the first word correctly', async () => {
    await act(async () => {
      renderWithProviders(<LearnMode words={TWO_WORDS} />)
    })

    expect(screen.getByText('apple')).toBeInTheDocument()
    expect(screen.getByText('a red fruit')).toBeInTheDocument()
    expect(screen.getByText('"I eat an apple."')).toBeInTheDocument()
  })

  it('navigates to the next word when "Next Word" is clicked', async () => {
    await act(async () => {
      renderWithProviders(<LearnMode words={TWO_WORDS} />)
    })
    
    const nextBtn = screen.getByText('Got it!')
    await act(async () => {
      fireEvent.click(nextBtn)
    })
    
    expect(screen.getByText('banana')).toBeInTheDocument()
    expect(screen.getByText('a yellow fruit')).toBeInTheDocument()
    expect(mockLearningFlow.completeWord).toHaveBeenCalledWith('1')
  })

  it('navigates back when "Previous" is clicked', async () => {
    await act(async () => {
      renderWithProviders(<LearnMode words={TWO_WORDS} />)
    })
    
    await act(async () => {
      fireEvent.click(screen.getByText('Got it!'))
    })
    expect(screen.getByText('banana')).toBeInTheDocument()
    
    await act(async () => {
      fireEvent.click(screen.getByText('← Previous'))
    })
    expect(screen.getByText('apple')).toBeInTheDocument()
  })

  it('calls onComplete when the last word is finished', async () => {
    const onComplete = vi.fn()
    await act(async () => {
      renderWithProviders(<LearnMode words={TWO_WORDS} onComplete={onComplete} />)
    })
    
    await act(async () => {
      fireEvent.click(screen.getByText('Got it!'))
    })
    
    await act(async () => {
      fireEvent.click(screen.getByText('Finish!'))
    })
    
    expect(onComplete).toHaveBeenCalled()
    expect(screen.getByText('Awesome job!')).toBeInTheDocument()
    expect(mockLearningFlow.completeWord).toHaveBeenCalledWith('2')
  })

  it('shows the goal-reached celebration when the daily goal is just met', async () => {
    const onMoveToPractice = vi.fn()
    // Simulate crossing the goal: not reached before the word, reached after it.
    mockLearningFlow = createMockLearningFlow({
      isDailyGoalReached: vi.fn().mockReturnValueOnce(false).mockReturnValue(true),
      getWordsLearnedToday: vi.fn().mockReturnValue(['w1', 'w2']),
      getDailyGoal: vi.fn().mockReturnValue(2),
    })
    mockedUseProgress.mockReturnValue({
      learningFlow: mockLearningFlow,
      refreshProgress: vi.fn(),
    })

    await act(async () => {
      renderWithProviders(<LearnMode onMoveToPractice={onMoveToPractice} />)
    })

    // Completing this word crosses the daily goal → celebration prompt appears.
    await act(async () => {
      fireEvent.click(screen.getByText('Got it!'))
    })

    expect(screen.getByText('You did it! 🌟')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Let's Spell!/i })).toBeInTheDocument()
  })
})
