import React from 'react'
import { beforeEach, afterEach, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, act, cleanup } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

const h = vi.hoisted(() => ({ flow: null as any, award: vi.fn(), record: vi.fn() }))
vi.mock('@/contexts/ProgressContext', () => ({ useProgress: () => ({ learningFlow: h.flow }) }))
vi.mock('@/contexts/ThemeContext', () => ({ useTheme: () => ({ world: { id: 'bee', mascot: '🐝' } }) }))
vi.mock('@/contexts/AudioContext', () => ({ useAudio: () => ({ speak: vi.fn() }) }))
vi.mock('@/stores/rewards/useRewardStore', () => ({ useRewardStore: () => ({ addStars: vi.fn() }) }))
vi.mock('@/services/persistence/FirebaseSync', () => ({ default: { syncToServer: vi.fn() } }))
vi.mock('@/services/trophies/TrophyService', () => ({ default: { award: h.award } }))
vi.mock('@/services/progress/ReviewSchedule', () => ({ default: { record: h.record, dueCount: () => 0 } }))
vi.mock('@/components/games/shared/sfx', () => {
  const quiet = () => {}
  // Every method: the cheer plays `star` on a three-in-a-row, and a missing
  // method throws from inside a timer.
  const sfx = {
    tap: quiet, correct: quiet, wrong: quiet, win: quiet, applause: quiet, fanfare: quiet,
    pop: quiet, star: quiet, whoosh: quiet, thud: quiet, worldJingle: quiet,
  }
  return { default: sfx, sfx, setWorldSoundProfile: quiet }
})

import BeeTournament from '@/pages/BeeTournament'
import { buildBracket } from '@/pages/BeeTournament/bracket'
import { wordBank } from '@/services/wordBank'
import { LearningFlowController } from '@/services/progress/LearningFlow'

beforeEach(() => {
  localStorage.clear()
  vi.clearAllMocks()
  h.flow = new LearningFlowController()
})
afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

const mount = () => render(<MemoryRouter><BeeTournament /></MemoryRouter>)
const learnThree = () => {
  for (let i = 0; i < 3; i++) h.flow.completeWord(`concise-all-bee-${i}`)
}
const spell = (text: string) => {
  const box = screen.getByLabelText('Spell the word')
  fireEvent.change(box, { target: { value: text } })
  fireEvent.keyDown(box, { key: 'Enter' })
}

it('asks a child with no words of their own to learn some before the Bee', () => {
  // The stretch rounds can always be filled from the bank; a Bee made only of
  // them is a Bee of words nobody taught this child.
  mount()
  expect(screen.getByText(/The Bee is spelled from words you already know/)).toBeInTheDocument()
  expect(screen.queryByRole('button', { name: /Enter the Bee/ })).not.toBeInTheDocument()
})

it('says how many rounds this Bee really has', () => {
  learnThree()
  mount()
  // Their three words make a warm-up; the final two rounds are the stretch.
  const blurb = document.querySelector('.bee-blurb')!
  expect(blurb.textContent).toMatch(/^Three rounds\./)
})

it('gives no cup for entering the Final without clearing the rounds before it', () => {
  vi.useFakeTimers()
  learnThree()
  const bracket = buildBracket(h.flow, wordBank)
  mount()

  fireEvent.click(screen.getByRole('button', { name: /Enter the Bee/ }))
  act(() => { vi.advanceTimersByTime(2300) })
  for (const word of bracket[0]) {
    spell(word.word)
    act(() => { vi.advanceTimersByTime(1500) })
  }

  // Into the Final, and out of wings on its first two words.
  act(() => { vi.advanceTimersByTime(2300) })
  spell('zzzz')
  act(() => { vi.advanceTimersByTime(2700) })
  spell('zzzz')
  act(() => { vi.advanceTimersByTime(2700) })

  expect(screen.getByText('You spelled 3 words!')).toBeInTheDocument()
  // Reaching the Final used to mean a Silver Cup, cleared rounds or not.
  expect(h.award).not.toHaveBeenCalled()
  // Only words this child was taught went into their review schedule.
  const recorded = h.record.mock.calls.map(([id]) => id as string)
  expect(recorded).toHaveLength(3)
  expect(recorded.every((id) => id.startsWith('concise-all-bee-'))).toBe(true)
})

it('pays full price for the week’s first Bee, and game price for replays', async () => {
  const { beeStars, STARS_PER_WORD, REPLAY_MAX_STARS, CHAMPION_BONUS } = await import('@/pages/BeeTournament')
  // The bracket is the same all week, so a replay is worth what a game is.
  expect(beeStars(5, 0, false)).toBe(5 * STARS_PER_WORD)
  expect(beeStars(12, 1, false)).toBe(REPLAY_MAX_STARS)
  expect(beeStars(2, 3, false)).toBe(2)
  // The crown's bonus still comes once, on whichever run wins it.
  expect(beeStars(5, 2, true)).toBe(REPLAY_MAX_STARS + CHAMPION_BONUS)
})
