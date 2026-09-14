import React from 'react'
import { beforeEach, afterEach, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, act, cleanup } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
const h = vi.hoisted(() => ({ flow: null as any, addStars: vi.fn() }))
vi.mock('@/contexts/ProgressContext', () => ({ useProgress: () => ({ learningFlow: h.flow }) }))
vi.mock('@/contexts/ThemeContext', () => ({ useTheme: () => ({ world: { mascot: '🐝' } }) }))
vi.mock('@/contexts/AudioContext', () => ({ useAudio: () => ({ speak: vi.fn() }) }))
vi.mock('@/stores/rewards/useRewardStore', () => ({ useRewardStore: () => ({ addStars: h.addStars }) }))
vi.mock('@/services/persistence/FirebaseSync', () => ({ default: { syncToServer: vi.fn() } }))
vi.mock('@/components/games/shared/sfx', () => ({ default: { tap: vi.fn() } }))
vi.mock('@/services/wordBank', () => ({ wordBank: { getWordById: (id: string) => ({ id, word: 'cat', sentence: 'A cat sat.', meaning: 'An animal' }) } }))
import DailyQuiz from '@/pages/DailyQuiz'
import { LearningFlowController } from '@/services/progress/LearningFlow'

beforeEach(() => {
  localStorage.clear(); vi.clearAllMocks(); vi.useFakeTimers()
  h.flow = new LearningFlowController()
  h.flow.completeWord('cat')
})
afterEach(() => { cleanup(); vi.useRealTimers() })
const mount = (weekly = false) => render(<MemoryRouter><DailyQuiz mode={weekly ? 'weekly' : 'daily'} /></MemoryRouter>)
const answer = () => {
  fireEvent.change(screen.getByPlaceholderText('Type the word...'), { target: { value: 'cat' } })
  fireEvent.click(screen.getByRole('button', { name: /Check it/ }))
}

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
