import React from 'react'
import fs from 'fs'
import path from 'path'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act, renderHook } from '@testing-library/react'

const h = vi.hoisted(() => ({
  sfx: { correct: vi.fn(), wrong: vi.fn(), star: vi.fn(), tap: vi.fn(), win: vi.fn(), pop: vi.fn() },
  speak: vi.fn(),
}))
vi.mock('@/components/games/shared/sfx', () => ({ default: h.sfx, sfx: h.sfx, setWorldSoundProfile: () => {} }))
vi.mock('@/contexts/AudioContext', () => ({ useAudio: () => ({ speak: h.speak }) }))

import useCheer from '@/components/games/shared/useCheer'
import useLater from '@/components/games/shared/useLater'
import Burst from '@/components/games/shared/Burst'
import GameEmpty from '@/components/games/shared/GameEmpty'
import { fakeSpelling, isRealWord } from '@/components/games/shared/realWords'

beforeEach(() => {
  vi.clearAllMocks()
  vi.useFakeTimers()
})
afterEach(() => vi.useRealTimers())

describe('the cheer every game shares', () => {
  it('cheers a right answer with a sound and fresh words, and grows the run', () => {
    const { result } = renderHook(() => useCheer())
    const first = result.current.hit({ say: 'cat' })
    expect(h.sfx.correct).toHaveBeenCalledTimes(1)
    expect(h.speak).toHaveBeenLastCalledWith(`${first} cat`)
    const second = result.current.hit()
    expect(second).not.toBe(first)
    expect(result.current.streak()).toBe(2)
  })

  it('adds a star chime and a streak cheer at three in a row', () => {
    const { result } = renderHook(() => useCheer())
    result.current.hit()
    result.current.hit()
    expect(result.current.hit()).toMatch(/Three in a row/)
    act(() => { vi.advanceTimersByTime(200) })
    expect(h.sfx.star).toHaveBeenCalledTimes(1)
  })

  it('meets a miss gently and starts the run again', () => {
    const { result } = renderHook(() => useCheer())
    result.current.hit()
    const line = result.current.miss({ say: "It's spelled c, a, t" })
    expect(line).not.toMatch(/wrong|incorrect/i)
    expect(h.sfx.wrong).toHaveBeenCalledTimes(1)
    expect(result.current.streak()).toBe(0)
  })

  it('stays quiet when asked, for fast play', () => {
    const { result } = renderHook(() => useCheer())
    result.current.hit({ quiet: true })
    expect(h.speak).not.toHaveBeenCalled()
    expect(h.sfx.correct).toHaveBeenCalledTimes(1)
  })
})

describe('delays that die with the game', () => {
  it('runs a delay, but never after the game has gone', () => {
    const fn = vi.fn()
    const { result, unmount } = renderHook(() => useLater())
    result.current(fn, 500)
    act(() => { vi.advanceTimersByTime(500) })
    expect(fn).toHaveBeenCalledTimes(1)

    result.current(fn, 500)
    unmount()
    vi.advanceTimersByTime(1000)
    expect(fn).toHaveBeenCalledTimes(1)
  })
})

describe('the little bits of joy', () => {
  it('bursts only once there is something to celebrate', () => {
    const { container, rerender } = render(<Burst trigger={0} />)
    expect(container.querySelector('.bst-burst')).toBeNull()
    rerender(<Burst trigger={1} count={6} />)
    expect(container.querySelectorAll('.bst-piece')).toHaveLength(6)
  })

  it('shows an empty game as a friendly note with nothing to tap', () => {
    render(<GameEmpty icon="🐛">Learn a few words first!</GameEmpty>)
    expect(screen.getByRole('status')).toHaveTextContent('Learn a few words first!')
    expect(screen.queryByRole('button')).toBeNull()
  })

  it('never passes off a real word as a misspelling', () => {
    for (let i = 0; i < 50; i++) {
      const fake = fakeSpelling('form')
      expect(fake).not.toBe('form')
      expect(isRealWord(fake)).toBe(false)
    }
    // When every slip is a word, it falls back to a doubled last letter.
    expect(fakeSpelling('tag', () => true)).toBe('tagg')
  })
})

describe('the tone of every game a child can open', () => {
  // The hidden games (GameCenter HIDDEN_GAMES) can't be reached, so they're left as they are.
  const HIDDEN = /^(BonusGame|ShapeCatcher|PatternMemory|RhythmTap|MemoryGrid|ReactionTest|PatternSequencer|ColorMixer|MathPuzzle|MusicComposer|PhysicsPuzzle|PuzzleSlider)$/
  const GAMES = path.resolve(__dirname, '../../../../src/components/games')

  it('never tells a child off: no "Game Over", ❌, "Wrong!", "Incorrect" or 💀', () => {
    const offenders: string[] = []
    for (const name of fs.readdirSync(GAMES)) {
      const file = path.join(GAMES, name, 'index.tsx')
      if (HIDDEN.test(name) || !fs.existsSync(file)) continue
      const src = fs.readFileSync(file, 'utf-8')
      // Case-sensitive: the shouted forms a child would read, not a `wrong!` in code.
      const hit = src.match(/Game Over|GAME OVER|❌|💀|Wrong!|Incorrect/)
      if (hit) offenders.push(`${name}: ${hit[0]}`)
    }
    expect(offenders, 'A miss should sound like "Nearly!", never like a buzzer').toEqual([])
  })
})
