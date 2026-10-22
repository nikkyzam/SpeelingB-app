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
  // ThemeProvider reaches for this when a world is chosen.
  setWorldSoundProfile: () => {},
}))

import BubblePop from '@/components/subjects/TopicGames/BubblePop'
import type { Question } from '@/services/subjects/types'
import { AudioProvider } from '@/contexts/AudioContext'
import { ThemeProvider } from '@/contexts/ThemeContext'

const base = (id: string, prompt: string) => ({ id, prompt, category: 'test', explanation: `Because of ${id}.` })

const LONG_RIGHT = 'The Declaration of Independence explained why the colonies wanted to be free from Britain.'

/** One of each kind the game has to handle, with the right answer as it appears on a bubble. */
const MIXED: { q: Question; right: string }[] = [
  { q: { ...base('n1', 'What is 2 + 3?'), kind: 'number', answer: 5 }, right: '5' },
  {
    q: {
      ...base('c1', 'What did the Declaration of Independence do?'),
      kind: 'choice',
      choices: [
        'It set up the first public library in the colonies.',
        LONG_RIGHT,
        'It ended the war between Spain and France in Europe.',
        'It named the first mayor of New York City.',
      ],
      answer: 1,
    },
    right: LONG_RIGHT,
  },
  { q: { ...base('f1', 'What is 2 ÷ 5 as a fraction?'), kind: 'fraction', answer: [2, 5] }, right: '2/5' },
  { q: { ...base('t1', 'A square has four equal sides.'), kind: 'truefalse', answer: true }, right: 'True' },
]

/** All number questions, so every round has four bubbles. */
const NUMBERS: { q: Question; right: string }[] = [
  { q: { ...base('n1', 'What is 2 + 3?'), kind: 'number', answer: 5 }, right: '5' },
  { q: { ...base('n2', 'What is 4 + 5?'), kind: 'number', answer: 9 }, right: '9' },
  { q: { ...base('n3', 'What is 7 + 7?'), kind: 'number', answer: 14 }, right: '14' },
]

const wrap = (ui: React.ReactElement) =>
  render(
    <ThemeProvider>
      <AudioProvider>{ui}</AudioProvider>
    </ThemeProvider>
  )

/** The set entry whose prompt is on screen now. */
const shown = (set: { q: Question; right: string }[]) => {
  const hit = set.find((s) => screen.queryByText(s.q.prompt))
  if (!hit) throw new Error('no known prompt on screen')
  return hit
}

const bubble = (label: string) => screen.getByRole('button', { name: `Pop the bubble: ${label}` })
const bubbles = () => screen.getAllByRole('button', { name: /^Pop the bubble: / })

/** Wait out the explanation so the next round (or the finish card) comes up. */
const nextRound = () => act(() => { vi.advanceTimersByTime(2500) })

describe('Bubble Pop', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('shows the first question and its answers as bubbles', () => {
    wrap(<BubblePop questions={MIXED.map((s) => s.q)} onComplete={() => {}} />)

    const first = shown(MIXED)
    expect(bubble(first.right)).toBeInTheDocument()
    expect(bubbles().length).toBeGreaterThanOrEqual(2)
    expect(screen.getByRole('button', { name: 'Read the question aloud' })).toBeInTheDocument()
    expect(screen.getByText(`Round 1 of ${MIXED.length}`)).toBeInTheDocument()
  })

  it('lays long answers out as wide pills and short ones as round bubbles', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0)
    wrap(<BubblePop questions={MIXED.map((s) => s.q)} onComplete={() => {}} />)

    for (let i = 0; i < MIXED.length; i++) {
      const now = shown(MIXED)
      const field = screen.getByRole('group', { name: 'Answer bubbles' })
      expect(field.className).toContain(now.right === LONG_RIGHT ? 'pills' : 'round')
      fireEvent.click(bubble(now.right))
      nextRound()
    }
  })

  it('popping the right bubble every round finishes with 100, reported once', () => {
    const onComplete = vi.fn()
    wrap(<BubblePop questions={MIXED.map((s) => s.q)} onComplete={onComplete} />)

    for (let i = 0; i < MIXED.length; i++) {
      const now = shown(MIXED)
      fireEvent.click(bubble(now.right))
      fireEvent.click(bubble(now.right)) // a double tap must not pop twice
      expect(screen.getByText(`Because of ${now.q.id}.`)).toBeInTheDocument()
      nextRound()
    }

    expect(screen.getByText('Bubbles popped! 🫧')).toBeInTheDocument()
    expect(screen.getByText(`${MIXED.length} of ${MIXED.length} popped on the first try`)).toBeInTheDocument()
    expect(onComplete).not.toHaveBeenCalled()

    const done = screen.getByRole('button', { name: 'Done' })
    fireEvent.click(done)
    fireEvent.click(done)
    expect(onComplete).toHaveBeenCalledTimes(1)
    expect(onComplete).toHaveBeenCalledWith(100)
  })

  it('a miss fades the bubble, the right one glows after two, and the round no longer counts', () => {
    const onComplete = vi.fn()
    wrap(<BubblePop questions={NUMBERS.map((s) => s.q)} onComplete={onComplete} />)

    const now = shown(NUMBERS)
    const right = bubble(now.right)
    const wrong = bubbles().filter((b) => b !== right)
    expect(wrong.length).toBeGreaterThanOrEqual(2)

    fireEvent.click(wrong[0])
    expect(wrong[0]).toBeDisabled()
    expect(wrong[0].className).toContain('faded')
    expect(right).not.toHaveAttribute('data-glow')

    fireEvent.click(wrong[0]) // tapping a faded bubble again is not another miss
    expect(right).not.toHaveAttribute('data-glow')

    fireEvent.click(wrong[1])
    expect(right).toHaveAttribute('data-glow', 'true')
    expect(right.className).toContain('glow')

    // Still playable: the child pops it and moves on.
    fireEvent.click(right)
    nextRound()
    expect(screen.getByText('⭐ 0')).toBeInTheDocument()

    for (let i = 1; i < NUMBERS.length; i++) {
      fireEvent.click(bubble(shown(NUMBERS).right))
      nextRound()
    }

    expect(screen.getByText(`2 of ${NUMBERS.length} popped on the first try`)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Done' }))
    expect(onComplete).toHaveBeenCalledWith(67)
  })

  it('shows a friendly message and no button with only one question', () => {
    const onComplete = vi.fn()
    wrap(<BubblePop questions={[NUMBERS[0].q]} onComplete={onComplete} />)

    expect(screen.getByRole('status')).toHaveTextContent(/aren't enough questions/)
    expect(screen.queryByRole('button')).toBeNull()
    expect(onComplete).not.toHaveBeenCalled()
  })

  it('never uses a scolding word', async () => {
    const fs = await import('node:fs')
    const path = await import('node:path')
    const src = fs.readFileSync(
      path.resolve(__dirname, '../../../../src/components/subjects/TopicGames/BubblePop/index.tsx'),
      'utf8'
    )
    expect(src).not.toMatch(/Game Over|GAME OVER|❌|💀|Wrong!|Incorrect/)
  })
})
