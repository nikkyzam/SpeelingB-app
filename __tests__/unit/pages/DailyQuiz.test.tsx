import React from 'react'
import { beforeEach, afterEach, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, act, cleanup } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
const h = vi.hoisted(() => ({ flow: null as any, addStars: vi.fn(), word: 'cat' }))
vi.mock('@/contexts/ProgressContext', () => ({ useProgress: () => ({ learningFlow: h.flow }) }))
vi.mock('@/contexts/ThemeContext', () => ({ useTheme: () => ({ world: { mascot: '🐝' } }) }))
vi.mock('@/contexts/AudioContext', () => ({ useAudio: () => ({ speak: vi.fn() }) }))
vi.mock('@/stores/rewards/useRewardStore', () => ({ useRewardStore: () => ({ addStars: h.addStars }) }))
vi.mock('@/services/persistence/FirebaseSync', () => ({ default: { syncToServer: vi.fn() } }))
vi.mock('@/components/games/shared/sfx', () => ({ default: { tap: vi.fn() } }))
vi.mock('@/services/wordBank', () => ({ wordBank: { getWordById: (id: string) => ({ id, word: h.word, sentence: `A ${h.word} sat.`, meaning: 'An animal' }) } }))
import DailyQuiz from '@/pages/DailyQuiz'
import { LearningFlowController } from '@/services/progress/LearningFlow'

beforeEach(() => {
  localStorage.clear(); vi.clearAllMocks(); vi.useFakeTimers()
  h.word = 'cat'
  h.flow = new LearningFlowController()
  h.flow.completeWord('cat')
})
afterEach(() => { cleanup(); vi.useRealTimers() })
const mount = (weekly = false) => render(<MemoryRouter><DailyQuiz mode={weekly ? 'weekly' : 'daily'} /></MemoryRouter>)
const answer = (typed = 'cat') => {
  fireEvent.change(screen.getByPlaceholderText('Type the word...'), { target: { value: typed } })
  fireEvent.click(screen.getByRole('button', { name: /Check it/ }))
}

it('accepts a word typed without its accents, and shows how it is written', () => {
  // A laptop has no ñ key, and the accent keypad only appears on touch
  // screens: "señor" could never be spelled, so the quiz could never end.
  h.word = 'señor'
  mount()
  answer('senor')
  expect(screen.getByText(/It's written “señor”/)).toBeInTheDocument()
  act(() => vi.advanceTimersByTime(900))
  expect(h.flow.isDailyQuizPassed()).toBe(true)
})

it('counts only the words still waiting for another try', () => {
  mount()
  answer('kat')
  expect(screen.getByText('1 to try again')).toBeInTheDocument()
  act(() => vi.advanceTimersByTime(1800))
  answer('cat')
  act(() => vi.advanceTimersByTime(900))
  // Spelled on the second go: nothing is left to try again.
  expect(screen.queryByText(/to try again/)).not.toBeInTheDocument()
})

it('sends the child on to the review when one is still due after the quiz', () => {
  // Five words and no review yet: the day's review comes after the quiz.
  for (let i = 1; i < 5; i++) h.flow.completeWord(`cat-${i}`)
  mount()
  for (let i = 0; i < 5; i++) {
    answer()
    act(() => vi.advanceTimersByTime(900))
  }
  expect(h.flow.gamesLockedReason()).toBe('review')
  expect(screen.getByText(/One quick review and every game is open/)).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Start Review 🧠' })).toBeInTheDocument()
})

it('awards the daily quiz once and keeps a revisit completed', () => {
  const view = mount()
  answer()
  act(() => vi.advanceTimersByTime(900))
  expect(h.addStars).toHaveBeenCalledTimes(1)
  expect(screen.getByRole('dialog')).toBeInTheDocument()
  view.unmount()
  mount()
  expect(screen.getByText(/Today’s quiz is done/)).toBeInTheDocument()
  expect(screen.queryByPlaceholderText('Type the word...')).not.toBeInTheDocument()
  expect(h.addStars).toHaveBeenCalledTimes(1)
})

it('does not award a second reward if the quiz was passed while answering', () => {
  mount(); answer()
  h.flow.passDailyQuiz()
  act(() => vi.advanceTimersByTime(900))
  expect(h.addStars).not.toHaveBeenCalled()
})

it('does not finish an abandoned quiz after navigation', () => {
  const view = mount(); answer(); view.unmount()
  act(() => vi.advanceTimersByTime(900))
  expect(h.flow.isDailyQuizPassed()).toBe(false)
  expect(h.addStars).not.toHaveBeenCalled()
})

it('keeps the daily gate closed when this week has no words', () => {
  const saved = JSON.parse(localStorage.getItem('learningProgress')!)
  saved.wordLearnedDates = { cat: '2000-01-01' }
  localStorage.setItem('learningProgress', JSON.stringify(saved)); h.flow.refreshProgress()
  mount(true)
  expect(screen.getByText('No words for this week yet!')).toBeInTheDocument()
  expect(screen.queryByRole('button', { name: /Open my games/ })).not.toBeInTheDocument()
  expect(h.flow.isDailyQuizPassed()).toBe(false)
})

it('allows weekly practice without another reward', () => {
  h.flow.passWeeklyQuiz(); mount(true); answer()
  act(() => vi.advanceTimersByTime(900))
  expect(screen.getByRole('dialog')).toBeInTheDocument()
  expect(h.addStars).not.toHaveBeenCalled()
  expect(h.flow.isDailyQuizPassed()).toBe(false)
})
