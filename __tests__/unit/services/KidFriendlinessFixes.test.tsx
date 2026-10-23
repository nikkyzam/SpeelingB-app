import React from 'react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, fireEvent, act, cleanup } from '@testing-library/react'
import { webcrypto } from 'node:crypto'

const h = vi.hoisted(() => {
  const noSound = {
    tap: () => {}, pop: () => {}, correct: () => {}, wrong: () => {}, applause: () => {},
    win: () => {}, star: () => {}, whoosh: () => {}, thud: () => {}, fanfare: () => {}, worldJingle: () => {},
  }
  return { noSound }
})
vi.mock('@/components/games/shared/sfx', () => ({ default: h.noSound, sfx: h.noSound, setWorldSoundProfile: () => {} }))
vi.mock('@/stores/userStore', () => ({
  useUserStore: { getState: vi.fn(() => ({ user: { id: 'u', name: 'Test', dailyGoal: 5 } })) },
}))
vi.mock('@/services/persistence/FirebaseSync', () => ({
  default: { syncToServer: vi.fn().mockResolvedValue(undefined), syncSoon: vi.fn() },
}))

import { wordBank, EARLY_READER_LIST } from '@/services/wordBank'
import { LearningFlowController } from '@/services/progress/LearningFlow'
import { PointsService } from '@/services/rewards/PointsService'
import { setPreferences } from '@/services/preferences'
import GrownUpGate from '@/components/common/GrownUpGate'
import ActivityFrame from '@/components/common/ActivityFrame'
import QuizSprint from '@/components/subjects/TopicGames/QuizSprint'
import { AudioProvider } from '@/contexts/AudioContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import type { Question } from '@/services/subjects/types'

beforeEach(() => {
  localStorage.clear()
  vi.stubGlobal('crypto', webcrypto)
})
afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

describe('starter words for early readers', () => {
  it('stay out of the Bee levels, so blended groups keep their words', () => {
    for (const level of [1, 2, 3]) {
      expect(wordBank.getWordsForLevels([level]).some((w) => w.list === EARLY_READER_LIST)).toBe(false)
    }
    expect(wordBank.getWordsForLevels([1, 2]).some((w) => w.source === EARLY_READER_LIST)).toBe(false)
  })

  it('still resolve by id and fill the early-reader list', () => {
    const starter = wordBank.getAllWords().find((w) => w.list === EARLY_READER_LIST)
    expect(starter).toBeDefined()
    expect(wordBank.getWordById(starter!.id)?.word).toBe(starter!.word)
    setPreferences({ stage: 'early' })
    expect(wordBank.getLearningList([1]).some((w) => w.id === starter!.id)).toBe(true)
    setPreferences({ stage: 'growing' })
  })
})

describe('changing the learning stage', () => {
  it('keeps each stage’s place in its own word list', () => {
    const flow = new LearningFlowController()
    flow.setSelectedGroup(12)
    flow.switchStage('growing', 'early')
    expect(flow.getSelectedGroup()).toBe(0)
    flow.setSelectedGroup(2)
    flow.switchStage('early', 'growing')
    expect(flow.getSelectedGroup()).toBe(12)
    flow.switchStage('growing', 'early')
    expect(flow.getSelectedGroup()).toBe(2)
  })
})

describe('returning stars for retired shop items', () => {
  const buy = (rewardId: string, category: string, cost = 10) =>
    PointsService.spendPoints(cost, { id: rewardId, name: rewardId, cost, category, description: '', unlocked: true, rarity: 'common' } as never)

  it('refunds only the categories the old shop sold, never anything newer', () => {
    PointsService.addPoints(100, 'test')
    buy('old-theme', 'theme')
    buy('buddy-hat', 'buddy')
    buy('family-bike', 'real')
    buy('future-thing', 'adventure')
    const before = PointsService.getPoints().availablePoints
    expect(PointsService.refundUnsupportedItems()).toBe(10)
    expect(PointsService.getPoints().availablePoints).toBe(before + 10)
    // A second visit refunds nothing more.
    expect(PointsService.refundUnsupportedItems()).toBe(0)
  })
})

describe('the family PIN', () => {
  it('can be cleared by a grown-up who forgot it, then set again', async () => {
    localStorage.setItem('family_pin_hash', 'abc')
    render(<GrownUpGate><p>Approve family prizes</p></GrownUpGate>)
    fireEvent.click(screen.getByRole('button', { name: 'Open grown-up settings' }))
    fireEvent.click(screen.getByRole('button', { name: 'Forgot the PIN?' }))
    const label = screen.getByText(/What is \d+ × \d+\?/).textContent!
    const [, a, b] = label.match(/What is (\d+) × (\d+)\?/)!
    fireEvent.change(screen.getByLabelText(label), { target: { value: String(Number(a) * Number(b)) } })
    fireEvent.click(screen.getByRole('button', { name: 'Clear the PIN' }))
    expect(localStorage.getItem('family_pin_hash')).toBeNull()
    expect(screen.getByLabelText('Enter the PIN again')).toBeInTheDocument()
  })

  it('a wrong answer leaves the PIN in place', () => {
    localStorage.setItem('family_pin_hash', 'abc')
    render(<GrownUpGate><p>x</p></GrownUpGate>)
    fireEvent.click(screen.getByRole('button', { name: 'Open grown-up settings' }))
    fireEvent.click(screen.getByRole('button', { name: 'Forgot the PIN?' }))
    const label = screen.getByText(/What is \d+ × \d+\?/).textContent!
    fireEvent.change(screen.getByLabelText(label), { target: { value: '1' } })
    fireEvent.click(screen.getByRole('button', { name: 'Clear the PIN' }))
    expect(localStorage.getItem('family_pin_hash')).toBe('abc')
  })
})

describe('the pause screen', () => {
  it('opens as a plain break after help was closed with Escape', () => {
    render(
      <AudioProvider>
        <ActivityFrame onExit={() => {}} instructions="Pop the right bubble.">
          <p>game</p>
        </ActivityFrame>
      </AudioProvider>
    )
    fireEvent.click(screen.getByRole('button', { name: /How to play/ }))
    expect(screen.getByText('Let’s try it together')).toBeInTheDocument()
    fireEvent.keyDown(document.activeElement ?? document.body, { key: 'Escape' })
    fireEvent.click(screen.getByRole('button', { name: /Pause/ }))
    expect(screen.queryByText('Let’s try it together')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Take a break' })).toBeInTheDocument()
  })
})

describe('a relaxed Quiz Sprint', () => {
  it('scores a perfect run on a short topic as 100%', () => {
    vi.useFakeTimers()
    setPreferences({ relaxed: true, waitForMe: false })
    const qs: Question[] = [1, 2, 3].map((i) => ({
      id: `q${i}`, prompt: `Question ${i}`, category: 'c', explanation: 'e', kind: 'choice', choices: ['Right', 'Not this'], answer: 0,
    }))
    const onComplete = vi.fn()
    render(
      <ThemeProvider>
        <AudioProvider>
          <QuizSprint questions={qs} onComplete={onComplete} />
        </AudioProvider>
      </ThemeProvider>
    )
    fireEvent.click(screen.getByRole('button', { name: 'Go!' }))
    for (let i = 0; i < 3; i++) {
      fireEvent.click(screen.getByRole('button', { name: 'Right' }))
      fireEvent.click(screen.getByRole('button', { name: 'Check' }))
      act(() => vi.advanceTimersByTime(800))
    }
    fireEvent.click(screen.getByRole('button', { name: 'Done' }))
    expect(onComplete).toHaveBeenCalledWith(100)
    vi.useRealTimers()
  })
})
