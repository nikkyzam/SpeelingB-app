import React from 'react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'

// vi.mock is hoisted above everything, so what it uses must be hoisted too.
const h = vi.hoisted(() => {
  const noSound = {
    tap: () => {}, pop: () => {}, correct: () => {}, wrong: () => {}, applause: () => {},
    win: () => {}, star: () => {}, whoosh: () => {}, thud: () => {}, fanfare: () => {}, worldJingle: () => {},
  }
  return { noSound }
})
vi.mock('@/components/games/shared/sfx', () => ({
  default: h.noSound,
  sfx: h.noSound,
  setWorldSoundProfile: () => {},
}))

import MatchUp, { matchScore } from '@/components/subjects/TopicGames/MatchUp'
import { AudioProvider } from '@/contexts/AudioContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import type { Question } from '@/services/subjects/types'

const base = { category: 'test', explanation: 'Because.' }
const questions: Question[] = [
  { ...base, id: 'n1', kind: 'number', prompt: 'What is 7 × 8?', answer: 56 },
  {
    ...base,
    id: 'c1',
    kind: 'choice',
    prompt: 'Which city is the capital of France, the country famous for the Eiffel Tower?',
    choices: ['Rome', 'Paris', 'Madrid'],
    answer: 1,
  },
  { ...base, id: 'f1', kind: 'fraction', prompt: 'Write 2 ÷ 5 as a fraction.', answer: [2, 5] },
]

/** Each question's prompt and the answer it should be paired with. */
const pairs: [string, string][] = [
  ['What is 7 × 8?', '56'],
  ['Which city is the capital of France, the country famous for the Eiffel Tower?', 'Paris'],
  ['Write 2 ÷ 5 as a fraction.', '2/5'],
]

const wrap = (ui: React.ReactElement) =>
  render(
    <ThemeProvider>
      <AudioProvider>{ui}</AudioProvider>
    </ThemeProvider>
  )

const q = (prompt: string) => screen.getByRole('button', { name: `Question: ${prompt}` })
const a = (answer: string) => screen.getByRole('button', { name: `Answer: ${answer}` })

const pair = (prompt: string, answer: string) => {
  fireEvent.click(q(prompt))
  fireEvent.click(a(answer))
}

describe('Match Up', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('puts every question and its answer on the board', () => {
    wrap(<MatchUp questions={questions} onComplete={() => {}} />)
    for (const [p, ans] of pairs) {
      expect(q(p)).toBeInTheDocument()
      expect(a(ans)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: `Read aloud: ${p}` })).toBeInTheDocument()
    }
  })

  it('scores 100 for a clean board and finishes exactly once', () => {
    const onComplete = vi.fn()
    wrap(<MatchUp questions={questions} onComplete={onComplete} />)

    pair(...pairs[0])
    expect(q(pairs[0][0])).toBeDisabled()
    // Answer first, then the question, works too.
    fireEvent.click(a(pairs[1][1]))
    fireEvent.click(q(pairs[1][0]))
    pair(...pairs[2])

    act(() => { vi.advanceTimersByTime(1500) })
    expect(screen.getByText('All matched! 🎉')).toBeInTheDocument()
    expect(screen.getByText(/3 of 3 matched on the first try/)).toBeInTheDocument()
    expect(onComplete).not.toHaveBeenCalled()

    const done = screen.getByRole('button', { name: 'Done' })
    act(() => {
      fireEvent.click(done)
      fireEvent.click(done)
    })
    expect(onComplete).toHaveBeenCalledTimes(1)
    expect(onComplete).toHaveBeenCalledWith(100)
  })

  it('lets go of a wrong pair and counts it against that question', () => {
    const onComplete = vi.fn()
    wrap(<MatchUp questions={questions} onComplete={onComplete} />)

    pair(pairs[0][0], pairs[2][1])
    // Neither card locks in; both come free after the wobble.
    expect(q(pairs[0][0])).not.toBeDisabled()
    expect(a(pairs[2][1])).not.toBeDisabled()
    act(() => { vi.advanceTimersByTime(700) })
    expect(q(pairs[0][0])).toHaveAttribute('aria-pressed', 'false')

    for (const p of pairs) pair(...p)
    act(() => { vi.advanceTimersByTime(1500) })
    expect(screen.getByText(/2 of 3 matched on the first try/)).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Done' }))
    expect(onComplete).toHaveBeenCalledWith(67)
  })

  it('makes the answer glow after two misses on the same question', () => {
    wrap(<MatchUp questions={questions} onComplete={() => {}} />)
    const [prompt, answer] = pairs[0]

    pair(prompt, pairs[1][1])
    act(() => { vi.advanceTimersByTime(700) })
    expect(a(answer)).not.toHaveAttribute('data-help')

    pair(prompt, pairs[2][1])
    act(() => { vi.advanceTimersByTime(700) })
    expect(a(answer)).toHaveAttribute('data-help', 'true')
  })

  it('never scores a finished board below 10', () => {
    expect(matchScore(6, 0)).toBe(10)
    expect(matchScore(6, 6)).toBe(100)
    expect(matchScore(3, 2)).toBe(67)
  })

  it('says so kindly, with no button, when there is only one pair', () => {
    const onComplete = vi.fn()
    wrap(<MatchUp questions={[questions[0]]} onComplete={onComplete} />)
    expect(screen.getByText(/Not enough questions to match up/)).toBeInTheDocument()
    expect(screen.queryByRole('button')).toBeNull()
    expect(onComplete).not.toHaveBeenCalled()
  })
})
