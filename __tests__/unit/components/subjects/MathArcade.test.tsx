import { setPreferences } from '@/services/preferences'
import React from 'react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'

// vi.mock is hoisted above everything, so what it uses must be hoisted too.
const h = vi.hoisted(() => {
  const noSound = {
    tap: () => {}, pop: () => {}, correct: () => {}, wrong: () => {}, applause: () => {},
    win: () => {}, star: () => {}, whoosh: () => {}, thud: () => {}, fanfare: () => {}, worldJingle: () => {},
  }
  return { noSound, speak: vi.fn() }
})
vi.mock('@/components/games/shared/sfx', () => ({
  default: h.noSound,
  sfx: h.noSound,
  setWorldSoundProfile: () => {},
}))
vi.mock('@/contexts/AudioContext', () => ({
  useAudio: () => ({ speak: h.speak }),
  AudioProvider: ({ children }: { children: React.ReactNode }) => children,
}))

import { MATH_ARCADE_GAMES } from '@/components/subjects/MathArcade'
import Bonds, { makeBondRound, BOND_ROUNDS } from '@/components/subjects/MathArcade/Bonds'
import Sprint, { makeSprintQuestion, SPRINT_SECONDS } from '@/components/subjects/MathArcade/Sprint'
import Match, { makeMatchDeck } from '@/components/subjects/MathArcade/Match'
import { makeFractionRound } from '@/components/subjects/MathArcade/Fractions'
import { makeCompareRound } from '@/components/subjects/MathArcade/Compare'
import { levelForGrade } from '@/components/subjects/MathArcade/shared'

describe('Math Arcade catalogue', () => {
  it('lists the five games with unique ids', () => {
    expect(MATH_ARCADE_GAMES.map((g) => g.id)).toEqual(['sprint', 'match', 'bonds', 'fractions', 'compare'])
  })

  it.each(MATH_ARCADE_GAMES.map((g) => [g.name, g] as const))('%s renders its start card and opens a level', (_name, game) => {
    const { Component } = game
    render(<Component onComplete={() => {}} />)
    expect(screen.getByRole('heading', { name: game.name })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Play Sprout' }))
    // In play: the start card is gone and the game header shows the title.
    expect(screen.queryByRole('button', { name: 'Play Sprout' })).not.toBeInTheDocument()
    expect(screen.getAllByText(game.name, { exact: false }).length).toBeGreaterThan(0)
  })
})

describe('Math Arcade grade suggestion', () => {
  it('maps grades to challenges', () => {
    expect(levelForGrade('k')).toBe('easy')
    expect(levelForGrade('1')).toBe('easy')
    expect(levelForGrade('3')).toBe('medium')
    expect(levelForGrade('7')).toBe('hard')
    expect(levelForGrade(undefined)).toBeUndefined()
  })

  it('marks the suggested challenge on the start card', () => {
    render(<Bonds onComplete={() => {}} grade="2" />)
    expect(screen.getByRole('button', { name: 'Play Explorer' })).toHaveTextContent('Just right for you')
  })
})

describe('Math Arcade round makers', () => {
  it('always deal four distinct, sensible options', () => {
    for (let i = 0; i < 300; i++) {
      for (const lv of ['easy', 'medium', 'hard'] as const) {
        const q = makeSprintQuestion(lv)
        expect(new Set(q.opts).size).toBe(4)
        expect(q.opts).toContain(q.answer)
        expect(q.opts.every((n) => n >= 0)).toBe(true)

        const b = makeBondRound(lv)
        expect(b.part + b.missing).toBe(b.target)
        expect(new Set(b.opts).size).toBe(4)
        expect(b.opts).toContain(b.missing)

        const f = makeFractionRound(lv)
        expect(new Set(f.opts).size).toBe(4)
        expect(f.opts).toContain(f.answer)

        const c = makeCompareRound(lv)
        if (c.mode === 'pick') expect(c.leftN).not.toBe(c.rightN)
        else expect(c.left).not.toBe(c.right)
      }
    }
  })

  it('deals a Match deck of unique answers', () => {
    const deck = makeMatchDeck('easy')
    expect(deck).toHaveLength(12)
    const answers = deck.filter((c) => c.kind === 'ans').map((c) => c.face)
    expect(new Set(answers).size).toBe(6)
  })
})

describe('Math Arcade play', () => {
  beforeEach(() => {
    setPreferences({ relaxed: false, waitForMe: false })
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('Bond Builder reports its score once, when Done is tapped', () => {
    const onComplete = vi.fn()
    render(<Bonds onComplete={onComplete} />)
    fireEvent.click(screen.getByRole('button', { name: 'Play Sprout' }))

    for (let r = 0; r < BOND_ROUNDS; r++) {
      // 10 = part + ?: read the part off the equation and pick the friend.
      const eq = screen.getByLabelText(/equals \d+ plus what\?/)
      const [, part] = eq.getAttribute('aria-label')!.match(/equals (\d+)/)!
      const missing = 10 - Number(part)
      const bubble = screen.getByRole('button', { name: `Choose ${missing}` })
      // A double tap settles once.
      act(() => {
        fireEvent.click(bubble)
        fireEvent.click(bubble)
      })
      act(() => {
        vi.advanceTimersByTime(2500)
      })
    }

    expect(screen.getByText('Bonds built!')).toBeInTheDocument()
    expect(onComplete).not.toHaveBeenCalled()
    fireEvent.click(screen.getByRole('button', { name: 'Done' }))
    fireEvent.click(screen.getByRole('button', { name: 'Done' }))
    expect(onComplete).toHaveBeenCalledTimes(1)
    expect(onComplete).toHaveBeenCalledWith(BOND_ROUNDS)
  })

  it('Bond Builder shows the right bubble after a miss', () => {
    render(<Bonds onComplete={() => {}} />)
    fireEvent.click(screen.getByRole('button', { name: 'Play Sprout' }))
    const eq = screen.getByLabelText(/equals \d+ plus what\?/)
    const missing = 10 - Number(eq.getAttribute('aria-label')!.match(/equals (\d+)/)![1])
    const wrong = screen.getAllByRole('button', { name: /^Choose / }).find((b) => b.textContent !== String(missing))!
    fireEvent.click(wrong)
    expect(screen.getByRole('button', { name: `Choose ${missing}` })).toHaveClass('reveal')
    expect(screen.getByRole('status')).toHaveTextContent(`the missing part is ${missing}`)
  })

  it('Number Sprint ends when the clock runs out', () => {
    const onComplete = vi.fn()
    render(<Sprint onComplete={onComplete} />)
    fireEvent.click(screen.getByRole('button', { name: 'Play Sprout' }))
    act(() => {
      vi.advanceTimersByTime((SPRINT_SECONDS + 1) * 1000)
    })
    expect(screen.getByText("Time’s up!")).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Done' }))
    expect(onComplete).toHaveBeenCalledWith(0)
  })

  it('Math Match turns a mismatch back over and keeps a match', () => {
    render(<Match onComplete={() => {}} />)
    fireEvent.click(screen.getByRole('button', { name: 'Play Sprout' }))
    const hidden = screen.getAllByRole('button', { name: 'Hidden card' })
    expect(hidden).toHaveLength(12)
    fireEvent.click(hidden[0])
    fireEvent.click(hidden[1])
    act(() => {
      vi.advanceTimersByTime(1500)
    })
    // Either a pair (stays up) or a miss (both hidden again): never one up alone.
    const stillHidden = screen.getAllByRole('button', { name: 'Hidden card' }).length
    expect([10, 12]).toContain(stillHidden)
    expect(screen.getByText(/1 move\b/)).toBeInTheDocument()
  })
})
