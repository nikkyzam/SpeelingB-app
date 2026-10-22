import React from 'react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'

const h = vi.hoisted(() => {
  const noSound = {
    tap: () => {}, pop: () => {}, correct: () => {}, wrong: () => {}, applause: () => {},
    win: () => {}, star: () => {}, whoosh: () => {}, thud: () => {}, fanfare: () => {}, worldJingle: () => {},
  }
  return { noSound }
})
vi.mock('@/components/games/shared/sfx', () => ({ default: h.noSound, sfx: h.noSound, setWorldSoundProfile: () => {} }))

import QuizSprint, { SPRINT_SECONDS } from '@/components/subjects/TopicGames/QuizSprint'
import { AudioProvider } from '@/contexts/AudioContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import type { Question } from '@/services/subjects/types'

const wrap = (ui: React.ReactElement) =>
  render(
    <ThemeProvider>
      <AudioProvider>{ui}</AudioProvider>
    </ThemeProvider>
  )

// Every question has the same shape so the order the deck is shuffled into doesn't matter.
const questions: Question[] = [1, 2, 3].map((i) => ({
  id: `q${i}`,
  prompt: `Question ${i}`,
  category: 'c',
  explanation: 'e',
  kind: 'choice',
  choices: ['Right', 'Not this'],
  answer: 0,
}))

describe('Quiz Sprint', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('counts right answers, shows the answer after a miss, and reports once when time is up', () => {
    const onComplete = vi.fn()
    wrap(<QuizSprint questions={questions} onComplete={onComplete} />)
    fireEvent.click(screen.getByRole('button', { name: 'Go!' }))

    // Right
    fireEvent.click(screen.getByRole('button', { name: 'Right' }))
    fireEvent.click(screen.getByRole('button', { name: 'Check' }))
    act(() => vi.advanceTimersByTime(800))
    expect(screen.getByLabelText('1 right')).toBeInTheDocument()

    // A miss shows the answer and still moves on
    fireEvent.click(screen.getByRole('button', { name: 'Not this' }))
    fireEvent.click(screen.getByRole('button', { name: 'Check' }))
    expect(screen.getByRole('status').textContent).toContain('The answer is Right')
    act(() => vi.advanceTimersByTime(2300))
    expect(screen.getByLabelText('1 right')).toBeInTheDocument()

    act(() => vi.advanceTimersByTime(SPRINT_SECONDS * 1000))
    expect(screen.getByText(/Time.s up/)).toBeInTheDocument()
    const done = screen.getByRole('button', { name: 'Done' })
    fireEvent.click(done)
    fireEvent.click(done)
    expect(onComplete).toHaveBeenCalledTimes(1)
    expect(onComplete).toHaveBeenCalledWith(10) // 1 right of 10 for full marks
  })

  it('a skipped question shows its answer instead of leaving the child stuck', () => {
    wrap(<QuizSprint questions={questions} onComplete={() => {}} />)
    fireEvent.click(screen.getByRole('button', { name: 'Go!' }))
    fireEvent.click(screen.getByRole('button', { name: 'Skip this question' }))
    expect(screen.getByRole('status').textContent).toContain('The answer is Right')
  })
})
