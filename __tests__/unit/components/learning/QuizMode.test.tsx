import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import QuizMode from '@/components/learning/QuizMode'
import { ProgressProvider, useProgress } from '@/contexts/ProgressContext' // Import useProgress
import { AudioProvider } from '@/contexts/AudioContext'
import React from 'react'
import { LearningFlowController } from '@/services/progress/LearningFlow'

// Mock wordBank
vi.mock('@/services/wordBank', () => ({
  wordBank: {
    // Provide a predictable, smaller set of words for getRandomWords
    getRandomWords: vi.fn(() => [
      { id: '1', word: 'apple', meaning: 'a red fruit', sentence: 'I eat an apple.', difficulty: 1 as 1 | 2 | 3, category: 'food' },
      { id: '2', word: 'banana', meaning: 'a yellow fruit', sentence: 'I eat a banana.', difficulty: 1 as 1 | 2 | 3, category: 'food' }
    ]),
    // Ensure getAllWords also returns a predictable set that includes the quiz words and some others for options
    getAllWords: vi.fn(() => [
      { id: '1', word: 'apple', meaning: 'a red fruit', sentence: 'I eat an apple.', difficulty: 1 as 1 | 2 | 3, category: 'food' },
      { id: '2', word: 'banana', meaning: 'a yellow fruit', sentence: 'I eat a banana.', difficulty: 1 as 1 | 2 | 3, category: 'food' },
      { id: '3', word: 'cherry', meaning: 'a small red fruit', sentence: 'I eat a cherry.', difficulty: 1 as 1 | 2 | 3, category: 'food' },
      { id: '4', word: 'date', meaning: 'a sweet brown fruit', sentence: 'I eat a date.', difficulty: 1 as 1 | 2 | 3, category: 'food' }
    ]),
    getMaskedVocabularyQuestion: vi.fn((word) => `What is the meaning of ${word}?`)
  }
}))

// Mock FirebaseSync
vi.mock('@/services/persistence/FirebaseSync', () => ({
  default: {
    syncToServer: vi.fn().mockResolvedValue(undefined)
  }
}))

// Mock useProgress hook
vi.mock('@/contexts/ProgressContext', () => ({
  useProgress: vi.fn(),
  ProgressProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>, // Mock ProgressProvider as well
}))

const TWO_WORDS = [
  { id: '1', word: 'apple', meaning: 'a red fruit', sentence: 'I eat an apple.', difficulty: 1 as 1 | 2 | 3, category: 'food' },
  { id: '2', word: 'banana', meaning: 'a yellow fruit', sentence: 'I eat a banana.', difficulty: 1 as 1 | 2 | 3, category: 'food' },
]

describe('QuizMode Component', () => {
  let mockLearningFlow: LearningFlowController
  // Cast the mocked useProgress to its mocked type for type-safety and autocompletion
  const mockedUseProgress = vi.mocked(useProgress)

  // Helper to create a mock LearningFlowController instance
  const createMockLearningFlow = (overrides: Partial<LearningFlowController> = {}) => ({
    completeSpellQuiz: vi.fn(),
    completeVocabQuiz: vi.fn(),
    getDailyGoal: vi.fn().mockReturnValue(30), // Mock getDailyGoal
    getWordsLearnedToday: vi.fn().mockReturnValue([]), // Mock getWordsLearnedToday
    getWordsSpelledToday: vi.fn().mockReturnValue([]), // Mock getWordsSpelledToday
    ...overrides,
  } as any)

  const renderWithProviders = (ui: React.ReactElement) => {
    return render(
      <AudioProvider>
        <ProgressProvider>
          {ui}
        </ProgressProvider>
      </AudioProvider>
    )
  }

  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    vi.useFakeTimers()
    // random === 0.5 makes the shuffle comparator (0.5 - random) return 0,
    // i.e. a stable no-op sort — so question/option order stays deterministic.
    vi.spyOn(Math, 'random').mockReturnValue(0.5)

    mockLearningFlow = createMockLearningFlow()
    mockedUseProgress.mockReturnValue({
      learningFlow: mockLearningFlow,
      refreshProgress: vi.fn(),
    })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders a vocabulary quiz correctly', () => {
    renderWithProviders(<QuizMode type="vocab" words={TWO_WORDS} />)
    
    expect(screen.getByText('📚 Vocabulary Quiz')).toBeInTheDocument()
    expect(screen.getByText('What is the meaning of apple?')).toBeInTheDocument()
    // Should have 4 options
    const options = screen.getAllByRole('button').filter(b => b.className.includes('option-button'))
    expect(options.length).toBe(4)
  })

  it('handles correct answers in vocab quiz', () => {
    renderWithProviders(<QuizMode type="vocab" words={TWO_WORDS} />)
    
    const correctOption = screen.getByText('a red fruit')
    fireEvent.click(correctOption)
    
    // Use a function with `getByText` to match text content across nodes
    expect(screen.getByText((content, element) => content.startsWith('Score:') && element?.tagName.toLowerCase() === 'span')).toBeInTheDocument()
    expect(screen.getByText('10')).toBeInTheDocument()
    
    act(() => {
      vi.advanceTimersByTime(2000)
    })
    
    // Should move to next question (banana)
    expect(screen.getByText('What is the meaning of banana?')).toBeInTheDocument()
    expect(mockLearningFlow.completeVocabQuiz).not.toHaveBeenCalled() // Should not be called until quiz complete
  })

  it('handles incorrect answers in vocab quiz', () => {
    renderWithProviders(<QuizMode type="vocab" words={TWO_WORDS} />)
    
    // Find an incorrect option
    const options = screen.getAllByRole('button').filter(b => b.className.includes('option-button'))
    const incorrectOption = options.find(o => !o.textContent?.includes('a red fruit'))
    
    if (incorrectOption) {
      fireEvent.click(incorrectOption)
    }
    
    // Use a function with `getByText` to match text content across nodes
    expect(screen.getByText((content, element) => content.startsWith('Score:') && element?.tagName.toLowerCase() === 'span')).toBeInTheDocument()
    expect(screen.getByText('0')).toBeInTheDocument()
    
    act(() => {
      vi.advanceTimersByTime(2000)
    })
    
    // Should move to next question
    expect(screen.getByText('What is the meaning of banana?')).toBeInTheDocument()
    expect(mockLearningFlow.completeVocabQuiz).not.toHaveBeenCalled() // Should not be called until quiz complete
  })

  it('completes the quiz and shows results', () => {
    const onComplete = vi.fn()
    renderWithProviders(<QuizMode type="vocab" words={TWO_WORDS} onComplete={onComplete} />)

    // Answer first question
    fireEvent.click(screen.getByText('a red fruit'))
    act(() => { vi.advanceTimersByTime(2000) })

    // Answer second question
    fireEvent.click(screen.getByText('a yellow fruit'))
    act(() => { vi.advanceTimersByTime(2000) })

    expect(screen.getByText('🎯 Quiz Complete!')).toBeInTheDocument()
    expect(screen.getByText('20')).toBeInTheDocument() // Final score
    // Completion is finalized once, via onComplete (score, wrongAnswers, wordIds).
    expect(onComplete).toHaveBeenCalledWith(20, 0, ['1', '2'])
  })
})
