import React from 'react'
import { beforeEach, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
const h = vi.hoisted(() => ({ flow: null as any }))
vi.mock('@/contexts/ProgressContext', () => ({ useProgress: () => ({ learningFlow: h.flow }) }))
vi.mock('@/contexts/ThemeContext', () => ({ useTheme: () => ({ world: { mascot: '🐝' } }) }))
vi.mock('@/stores/rewards/useRewardStore', () => ({ useRewardStore: () => ({ addStars: vi.fn() }) }))
vi.mock('@/services/persistence/FirebaseSync', () => ({ default: { syncToServer: vi.fn() } }))
vi.mock('@/components/games/shared/sfx', () => ({ default: { tap: vi.fn() } }))
vi.mock('@/components/games', () => ({ BibleTriviaEnhanced: () => <div>Running Bible trivia</div>, PrizeWheel: () => null }))
import { LearningFlowController } from '@/services/progress/LearningFlow'
import GameCenter from '@/pages/GameCenter'

beforeEach(() => { localStorage.clear(); h.flow = new LearningFlowController() })
const openShortcut = () => render(<MemoryRouter initialEntries={[{ pathname: '/games', state: { startGame: 'bible-trivia' } }]}><GameCenter /></MemoryRouter>)

it('does not start a locked game from a Home or Bible shortcut', () => {
  openShortcut()
  expect(screen.queryByText('Running Bible trivia')).not.toBeInTheDocument()
})

it('starts the shortcut when its quiz and review requirements are met', () => {
  h.flow.passDailyQuiz()
  openShortcut()
  expect(screen.getByText('Running Bible trivia')).toBeInTheDocument()
})

it('also respects outstanding review requirements', () => {
  for (let i = 0; i < 5; i++) h.flow.completeWord(`word-${i}`)
  h.flow.passDailyQuiz()
  openShortcut()
  expect(screen.queryByText('Running Bible trivia')).not.toBeInTheDocument()
})
