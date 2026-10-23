vi.mock('@/contexts/AudioContext', () => ({ useAudio: () => ({ speak: vi.fn(), stopSpeaking: vi.fn() }) }))
import React from 'react'
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

const h = vi.hoisted(() => ({
  flow: null as any,
  addStars: null as any,
  /** The payout callback of the game most recently put on screen. */
  lastFinish: null as null | ((score: number) => void),
}))
vi.mock('@/contexts/ProgressContext', () => ({ useProgress: () => ({ learningFlow: h.flow }) }))
vi.mock('@/contexts/ThemeContext', () => ({ useTheme: () => ({ world: { mascot: '🐝' } }) }))
vi.mock('@/stores/rewards/useRewardStore', () => ({ useRewardStore: () => ({ addStars: h.addStars }) }))
vi.mock('@/services/persistence/FirebaseSync', () => ({ default: { syncToServer: vi.fn() } }))
vi.mock('@/components/games/shared/sfx', () => {
  const quiet = () => {}
  const sfx = { tap: quiet, pop: quiet, correct: quiet, wrong: quiet, win: quiet, star: quiet, whoosh: quiet, thud: quiet, applause: quiet, fanfare: quiet, worldJingle: quiet }
  return { default: sfx, sfx, setWorldSoundProfile: quiet }
})
// Every game in the barrel becomes a stand-in that names itself and can be
// finished with one tap, so the test sees exactly which component a card opens.
vi.mock('@/components/games', async () => {
  const fs = await import('fs')
  const path = await import('path')
  const { createElement } = await import('react')
  const barrel = fs.readFileSync(path.resolve(process.cwd(), 'src/components/games/index.ts'), 'utf-8')
  const names = [...barrel.matchAll(/export \{ default as (\w+) \}/g)].map((m) => m[1])
  const standIn = (name: string) => (props: { onComplete: (score: number) => void }) => {
    h.lastFinish = props.onComplete
    return createElement(
      'div',
      null,
      createElement('button', { onClick: () => props.onComplete(150) }, `Finish ${name}`),
      // An older game's end-of-game button plus its own timer: two reports.
      createElement('button', { onClick: () => { props.onComplete(150); props.onComplete(150) } }, `Double-finish ${name}`)
    )
  }
  return Object.fromEntries(names.map((name) => [name, name === 'PrizeWheel' ? () => null : standIn(name)]))
})

import { LearningFlowController } from '@/services/progress/LearningFlow'
import GameCenter from '@/pages/GameCenter'

/** The twelve off-topic games GameCenter keeps out of the hub. */
const HIDDEN = /Bonus Game|Shape Catcher|Pattern Memory|Rhythm Tap|Memory Grid|Reaction Test|Pattern Sequencer|Color Mixer|Math Puzzle|Music Composer|Physics Puzzle|Puzzle Slider/

/** Enough real words studied, today's quiz passed and the review done: every card opens. */
const unlockEverything = () => {
  for (let i = 0; i < 6; i++) h.flow.completeWord(`concise-all-bee-${i}`)
  h.flow.passDailyQuiz()
  h.flow.markReviewDone()
}

const openHub = () => render(<MemoryRouter><GameCenter /></MemoryRouter>)

/** Open the first card in the grid and return its title. */
const openFirstGame = (container: HTMLElement) => {
  const card = container.querySelector<HTMLElement>('.game-card')!
  fireEvent.click(within(card).getByRole('button', { name: /Play Now|Beat your best/ }))
  return card.querySelector('h3')!.textContent!
}

beforeEach(() => {
  localStorage.clear()
  h.flow = new LearningFlowController()
  h.addStars = vi.fn()
  h.lastFinish = null
})

describe('the game catalogue', () => {
  it('opens a different game for every card in the grid', () => {
    unlockEverything()
    const { container } = openHub()
    const count = container.querySelectorAll('.game-card').length
    const opened: string[] = []

    for (let i = 0; i < count; i++) {
      const card = container.querySelectorAll<HTMLElement>('.game-card')[i]
      const title = card.querySelector('h3')!.textContent!
      fireEvent.click(within(card).getByRole('button', { name: /Play Now|Beat your best/ }))
      // A card with no case in the switch would open an empty page here.
      opened.push(screen.getByRole('button', { name: /^Finish / }).textContent!)
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(title)
      fireEvent.click(screen.getByRole('button', { name: /Back to Games/ }))
    }

    // Two cards opening the same component is a copy-paste slip in the switch.
    expect(new Set(opened).size).toBe(opened.length)
    for (const game of ['CaterpillarCrawl', 'SpellTacToe', 'CrissCross', 'WordJigsaw', 'WordLock', 'BeeBingo', 'HoneyFlight']) {
      expect(opened).toContain(`Finish ${game}`)
    }
  })

  it('never features a hidden game as the Game of the Day', () => {
    // A hidden game can't be opened, so featuring one left a "Play it!" button
    // that did nothing — and a day's double stars nobody could win.
    vi.useFakeTimers({ toFake: ['Date'] })
    try {
      for (let day = 1; day <= 60; day++) {
        vi.setSystemTime(new Date(2026, 8, day, 12))
        localStorage.setItem('learningProgress', JSON.stringify({
          wordsLearnedTotal: Array.from({ length: 6 }, (_, i) => `concise-all-bee-${i}`),
          wordsLearnedToday: Array.from({ length: 6 }, (_, i) => `concise-all-bee-${i}`),
          dailyQuizPassedDate: new Date().toDateString(), lastReviewDate: new Date().toISOString(),
        }))
        h.flow = new LearningFlowController()
        const { unmount } = openHub()
        const featured = within(screen.getByRole('region', { name: 'Game of the day' })).getByRole('heading', { level: 2 })
        const name = featured.parentElement!.querySelector('strong')!.textContent!
        expect(name, `day ${day}`).not.toMatch(HIDDEN)
        unmount()
      }
    } finally {
      vi.useRealTimers()
    }
  })

  it('pays for a game once, even when it reports finishing twice', () => {
    unlockEverything()
    openHub()
    fireEvent.click(screen.getAllByRole('button', { name: /Play Now|Beat your best/ })[0])
    fireEvent.click(screen.getByRole('button', { name: /^Double-finish / }))
    expect(h.addStars).toHaveBeenCalledTimes(1)
  })

  it('awards a medal for finishing a game, and shows it on the card', () => {
    unlockEverything()
    const { container } = openHub()
    expect(screen.getByLabelText('Your game medals')).toHaveTextContent(/first medal/)
    const title = openFirstGame(container)
    fireEvent.click(screen.getByRole('button', { name: /^Finish / }))
    expect(screen.getByRole('dialog')).toHaveTextContent(/New bronze medal/)
    fireEvent.click(screen.getByRole('button', { name: /Choose another game/ }))
    const card = [...container.querySelectorAll<HTMLElement>('.game-card')].find((c) => c.querySelector('h3')!.textContent === title)!
    expect(within(card).getByLabelText('bronze medal')).toBeInTheDocument()
    expect(screen.getByLabelText('Your game medals')).toHaveTextContent(/1 of \d+ games/)
  })

  it('does not pay for a game the child left before it finished', () => {
    unlockEverything()
    const { container } = openHub()
    openFirstGame(container)
    const lateTimer = h.lastFinish!
    fireEvent.click(screen.getByRole('button', { name: /Back to Games/ }))
    lateTimer(150)
    expect(h.addStars).not.toHaveBeenCalled()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('never lets a stray timer from one game close the next one', () => {
    unlockEverything()
    const { container } = openHub()
    openFirstGame(container)
    const staleTimer = h.lastFinish!
    fireEvent.click(screen.getByRole('button', { name: /Back to Games/ }))
    const cards = container.querySelectorAll<HTMLElement>('.game-card')
    fireEvent.click(within(cards[1]).getByRole('button', { name: /Play Now|Beat your best/ }))
    staleTimer(150)
    // Still playing the second game, and nothing paid out for the first.
    expect(screen.getByRole('button', { name: /^Finish / })).toBeInTheDocument()
    expect(h.addStars).not.toHaveBeenCalled()
  })

  it('points to the review, not "every game is open", when a review is still due', () => {
    for (let i = 0; i < 6; i++) h.flow.completeWord(`concise-all-bee-${i}`)
    h.flow.passDailyQuiz()
    openHub()
    expect(h.flow.gamesLockedReason()).toBe('review')
    expect(screen.queryByText('All games unlocked today!')).not.toBeInTheDocument()
    expect(screen.queryByText(/every game is unlocked/)).not.toBeInTheDocument()
    expect(screen.getByText('One more step: a quick review')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Start Review/ })).toBeInTheDocument()
  })

  it('says why a game a shortcut asked for is not open yet', () => {
    render(
      <MemoryRouter initialEntries={[{ pathname: '/games', state: { startGame: 'bible-trivia' } }]}>
        <GameCenter />
      </MemoryRouter>
    )
    expect(screen.getByRole('status')).toHaveTextContent(/Bible Trivia isn’t open yet/)
  })

  it('never suggests a hidden game to try next', () => {
    unlockEverything()
    const { container } = openHub()
    const count = container.querySelectorAll('.game-card').length

    for (let i = 0; i < count; i++) {
      const card = container.querySelectorAll<HTMLElement>('.game-card')[i]
      fireEvent.click(within(card).getByRole('button', { name: /Play Now|Beat your best/ }))
      fireEvent.click(screen.getByRole('button', { name: /^Finish / }))
      fireEvent.click(screen.getByRole('button', { name: 'Choose another game' }))
      const next = container.querySelector('.nextup-game-text strong')?.textContent ?? ''
      expect(next).not.toMatch(HIDDEN)
    }
  })
})
