import React from 'react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act, cleanup } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

// vi.mock is hoisted above everything, so what it uses must be hoisted too.
const h = vi.hoisted(() => {
  const sfx = {
    tap: vi.fn(), pop: vi.fn(), correct: vi.fn(), wrong: vi.fn(),
    win: vi.fn(), applause: vi.fn(), worldJingle: vi.fn(),
    star: vi.fn(), whoosh: vi.fn(), thud: vi.fn(), fanfare: vi.fn(),
  }
  return { sfx, speak: vi.fn(), addStars: vi.fn(), award: vi.fn(), record: vi.fn(), flow: null as any }
})
vi.mock('@/components/games/shared/sfx', () => ({ default: h.sfx, sfx: h.sfx, setWorldSoundProfile: () => {} }))
vi.mock('@/contexts/AudioContext', () => ({
  useAudio: () => ({ speak: h.speak }),
  AudioProvider: ({ children }: { children: React.ReactNode }) => children,
}))
vi.mock('@/contexts/ThemeContext', () => ({ useTheme: () => ({ world: { id: 'bee', mascot: '🐝' } }) }))
vi.mock('@/contexts/ProgressContext', () => ({ useProgress: () => ({ learningFlow: h.flow }) }))
vi.mock('@/stores/rewards/useRewardStore', () => ({ useRewardStore: () => ({ addStars: h.addStars }) }))
vi.mock('@/services/persistence/FirebaseSync', () => ({ default: { syncToServer: vi.fn() } }))
vi.mock('@/services/trophies/TrophyService', () => ({ default: { award: h.award } }))
vi.mock('@/services/progress/ReviewSchedule', () => ({ default: { record: h.record, dueCount: () => 0 } }))

import SpellTurn from '@/pages/SiblingChallenge/modes/SpellTurn'
import BuzzerRace from '@/pages/SiblingChallenge/modes/BuzzerRace'
import StealDuel from '@/pages/SiblingChallenge/modes/StealDuel'
import TugOfWar from '@/pages/SiblingChallenge/modes/TugOfWar'
import SiblingChallenge, { matchStars } from '@/pages/SiblingChallenge'
import BeeTournament, { CHAMPION_BONUS } from '@/pages/BeeTournament'
import { buildBracket } from '@/pages/BeeTournament/bracket'
import WordHunt, { HUNT_STARS } from '@/pages/WordHunt'
import SentenceMaker, { SENTENCE_STARS } from '@/pages/SentenceMaker'
import PrizeWheel, { SPIN_MS } from '@/components/games/PrizeWheel'
import { wordBank, type Word } from '@/services/wordBank'
import { LearningFlowController } from '@/services/progress/LearningFlow'

const word = (w: string, meaning = `the meaning of ${w}`): Word => ({
  id: `t-${w}`,
  word: w,
  meaning,
  sentence: `A ${w} appeared.`,
  difficulty: 1,
  category: 'test',
})
const CAT = word('cat'), DOG = word('dog'), SUN = word('sun'), HAT = word('hat')
const BEE = word('bee'), PIG = word('pig'), FOX = word('fox'), JAM = word('jam')
const LIST_A = [CAT, DOG, SUN, HAT, BEE, PIG]
const LIST_B = [FOX, JAM, word('map'), word('cup'), word('egg'), word('van')]

const said = () => h.speak.mock.calls.map(([text]) => String(text))
const lastSaid = () => said()[said().length - 1] ?? ''

/** What the last spoken prompt asked for: "Sam, your word is: cat. …". */
const askedWord = (): string => {
  const prompts = said().filter((t) => /your word is: /.test(t))
  return /your word is: ([a-z]+)\./.exec(prompts[prompts.length - 1] ?? '')?.[1] ?? ''
}

const typeAnswer = (label: string | RegExp, text: string) => {
  const box = screen.getByLabelText(label)
  fireEvent.change(box, { target: { value: text } })
  return box
}

beforeEach(() => {
  localStorage.clear()
  vi.clearAllMocks()
  vi.useFakeTimers()
})
afterEach(() => {
  cleanup()
  vi.useRealTimers()
  vi.restoreAllMocks()
})

// --- One turn in a sibling match ------------------------------------------------

describe('Sibling Challenge: one turn', () => {
  it('says whose turn it is, big, before the word', () => {
    render(<SpellTurn who="Ava" player={0} word={CAT} label="Round 1" onAnswer={() => {}} />)
    expect(screen.getByText("Ava's turn!")).toBeInTheDocument()
    expect(document.querySelector('.turn.p0')).not.toBeNull()
    // Bee-style: the word, a sentence, the word again — queued behind the last cheer.
    expect(h.speak).toHaveBeenCalledWith('Ava, your word is: cat. A cat appeared. cat.', { queue: true })
  })

  it('answers once for a double Enter — the sibling’s turn is not skipped', () => {
    const onAnswer = vi.fn()
    render(<SpellTurn who="Ava" word={CAT} label="Round 1" onAnswer={onAnswer} />)
    const box = typeAnswer('Ava, spell the word', 'cat')
    act(() => {
      fireEvent.keyDown(box, { key: 'Enter' })
      fireEvent.keyDown(box, { key: 'Enter' })
    })
    act(() => { vi.advanceTimersByTime(3000) })
    expect(onAnswer).toHaveBeenCalledTimes(1)
    expect(onAnswer).toHaveBeenCalledWith(true)
  })

  it('does not count Enter on an empty box as a miss', () => {
    const onAnswer = vi.fn()
    render(<SpellTurn who="Ava" word={CAT} label="Round 1" onAnswer={onAnswer} />)
    fireEvent.keyDown(screen.getByLabelText('Ava, spell the word'), { key: 'Enter' })
    act(() => { vi.advanceTimersByTime(3000) })
    expect(onAnswer).not.toHaveBeenCalled()
  })

  it('cheers a right answer by name, with a star burst', () => {
    render(<SpellTurn who="Ava" word={CAT} label="Round 1" onAnswer={() => {}} />)
    fireEvent.keyDown(typeAnswer('Ava, spell the word', 'cat'), { key: 'Enter' })
    expect(h.sfx.correct).toHaveBeenCalled()
    expect(lastSaid()).toMatch(/Ava!$/)
    expect(document.querySelector('.turn-verdict.right .bst-burst')).not.toBeNull()
  })

  it('spells a missed word out letter by letter, gently', () => {
    render(<SpellTurn who="Ava" word={CAT} label="Round 1" onAnswer={() => {}} />)
    fireEvent.keyDown(typeAnswer('Ava, spell the word', 'kat'), { key: 'Enter' })
    expect(h.sfx.wrong).toHaveBeenCalledTimes(1)
    expect(lastSaid()).toMatch(/It was cat\. c, a, t\.$/)
    expect(screen.getByText(/It was “cat”/)).toBeInTheDocument()
  })

  it('keeps a hidden miss secret and names who it passes to', () => {
    render(<SpellTurn who="Ava" word={CAT} label="Round 1" reveal={false} passTo="Sam" onAnswer={() => {}} />)
    fireEvent.keyDown(typeAnswer('Ava, spell the word', 'kat'), { key: 'Enter' })
    expect(lastSaid()).toMatch(/Over to Sam!$/)
    expect(lastSaid()).not.toMatch(/cat/)
    expect(screen.getByText(/Over to Sam!/)).toBeInTheDocument()
  })

  it('blanks the word out of its meaning while it is being spelled', () => {
    render(<SpellTurn who="Ava" word={word('cat', 'a small cat that purrs')} label="Round 1" onAnswer={() => {}} />)
    expect(document.querySelector('.turn-meaning')!.textContent).toBe('a small ____ that purrs')
  })
})

// --- The match modes ----------------------------------------------------------

describe('Sibling Challenge: Buzzer Race', () => {
  const names: [string, string] = ['Ava', 'Sam']

  it('says the word as the round opens', () => {
    render(<BuzzerRace names={names} words={[LIST_A, LIST_B]} onFinish={() => {}} />)
    expect(h.speak).toHaveBeenCalledWith('Round 1! Listen. cat.', { queue: true })
  })

  it('gives the round to the first buzzer when both land at once', () => {
    render(<BuzzerRace names={names} words={[LIST_A, LIST_B]} onFinish={() => {}} />)
    act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'Ava buzz in' }))
      fireEvent.click(screen.getByRole('button', { name: 'Sam buzz in' }))
    })
    expect(screen.getByText("Ava's turn!")).toBeInTheDocument()
  })

  it('takes turns between the two lists, so one child’s level does not decide every round', () => {
    render(<BuzzerRace names={names} words={[LIST_A, LIST_B]} onFinish={() => {}} />)
    fireEvent.click(screen.getByRole('button', { name: 'Ava buzz in' }))
    fireEvent.keyDown(typeAnswer('Ava, spell the word', 'cat'), { key: 'Enter' })
    act(() => { vi.advanceTimersByTime(1500) })
    // Round 2 comes from Sam's list.
    expect(h.speak).toHaveBeenCalledWith('Round 2! Listen. fox.', { queue: true })
  })
})

describe('Sibling Challenge: Steal-the-Point', () => {
  it('steals with a word from the thief’s own list, and shows the missed word at once', () => {
    render(<StealDuel names={['Ava', 'Sam']} words={[LIST_A, LIST_B]} onFinish={() => {}} />)
    fireEvent.keyDown(typeAnswer('Ava, spell the word', 'kat'), { key: 'Enter' })
    // The missed word is shown and spelled: nobody else is about to spell it.
    expect(screen.getByText(/It was “cat”/)).toBeInTheDocument()
    act(() => { vi.advanceTimersByTime(2700) })
    expect(screen.getByText('🥷 Sam can steal the point!')).toBeInTheDocument()
    expect(screen.getByText("Sam's turn!")).toBeInTheDocument()
    // Sam's list, after the five words of his own turns — not Ava's "cat".
    expect(askedWord()).toBe('van')
    expect(lastSaid()).toMatch(/^Sam, steal the point! Sam, your word is: van\./)
  })
})

describe('Sibling Challenge: Tug-of-War', () => {
  it('lets the second player start when it is their go first', () => {
    render(<TugOfWar names={['Ava', 'Sam']} words={[LIST_A, LIST_B]} onFinish={() => {}} first={1} />)
    expect(screen.getByText("Sam's turn!")).toBeInTheDocument()
    expect(askedWord()).toBe('fox')
  })

  it('says who is ahead in words, not "1.5 of 4"', () => {
    render(<TugOfWar names={['Ava', 'Sam']} words={[LIST_A, LIST_B]} onFinish={() => {}} />)
    expect(screen.getByText('Neck and neck!')).toBeInTheDocument()
    fireEvent.keyDown(typeAnswer('Ava, spell the word', 'cat'), { key: 'Enter' })
    act(() => { vi.advanceTimersByTime(1500) })
    expect(screen.getByText('Ava is pulling ahead!')).toBeInTheDocument()
  })
})

describe('Sibling Challenge: the match and its stars', () => {
  const POOL = [CAT, DOG, SUN, HAT, BEE, PIG]
  beforeEach(() => {
    h.flow = { getWordsLearnedTotal: () => POOL.map((w) => w.id) }
    vi.spyOn(wordBank, 'getLearnedWords').mockReturnValue(POOL)
  })
  const mount = () => render(<MemoryRouter><SiblingChallenge /></MemoryRouter>)
  const name = (i: number, value: string) =>
    fireEvent.change(screen.getByLabelText(`Player ${i} name`), { target: { value } })
  const answer = (who: string, text: string, wait: number) => {
    fireEvent.keyDown(typeAnswer(`${who}, spell the word`, text), { key: 'Enter' })
    act(() => { vi.advanceTimersByTime(wait) })
  }

  it('pays the match bonus only for real spelling', () => {
    expect(matchStars([0, 0], false)).toBe(1)
    expect(matchStars([1, 1], false)).toBe(2)
    expect(matchStars([4, 2], true)).toBe(15)
    expect(matchStars([3, 3], false)).toBe(10)
  })

  it('no longer pays 10 stars for three quick misses in Team Relay', () => {
    mount()
    fireEvent.click(screen.getByRole('button', { name: /Team Relay/ }))
    fireEvent.click(screen.getByRole('button', { name: /Start the match/ }))
    answer('Player 1', 'x', 2700)
    answer('Player 2', 'x', 2700)
    answer('Player 1', 'x', 2700)
    expect(h.addStars).toHaveBeenCalledTimes(1)
    expect(h.addStars).toHaveBeenCalledWith(1)
    expect(screen.getByText('🤝 Great try, team!')).toBeInTheDocument()
  })

  it('cheers the child who lost too, then swaps who goes first for the rematch', () => {
    mount()
    name(1, 'Ava')
    name(2, 'Sam')
    fireEvent.click(screen.getByRole('button', { name: /Word Tug-of-War/ }))
    fireEvent.click(screen.getByRole('button', { name: /Start the match/ }))
    expect(h.speak).toHaveBeenCalledWith('Ava versus Sam! Ava goes first. Good luck!')

    // Ava pulls four times while Sam misses: the rope reaches her end.
    for (let i = 0; i < 4; i++) {
      answer('Ava', askedWord(), 1500)
      if (i < 3) answer('Sam', 'zzz', 2700)
    }
    expect(h.addStars).toHaveBeenCalledTimes(1)
    expect(h.addStars).toHaveBeenCalledWith(15)
    expect(screen.getByText('🏆 Ava wins!')).toBeInTheDocument()
    expect(screen.getByText(/Great try, Sam — rematch\?/)).toBeInTheDocument()
    expect(h.sfx.fanfare).toHaveBeenCalledTimes(1)

    fireEvent.click(screen.getByRole('button', { name: 'Yay!' }))
    expect(screen.getByText('🏆 Ava won!')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /Rematch/ }))
    expect(screen.getByText("Sam's turn!")).toBeInTheDocument()
  })

  it('tells two children with the same name apart', () => {
    mount()
    name(1, 'Sam')
    name(2, 'sam')
    fireEvent.click(screen.getByRole('button', { name: /Word Tug-of-War/ }))
    fireEvent.click(screen.getByRole('button', { name: /Start the match/ }))
    expect(h.speak).toHaveBeenCalledWith('Sam versus sam 2! Sam goes first. Good luck!')
    expect(document.querySelector('.tug-side.p1')!.textContent).toContain('sam 2')
  })
})

// --- The Spelling Bee ----------------------------------------------------------

describe('The Spelling Bee', () => {
  beforeEach(() => {
    h.flow = new LearningFlowController()
  })
  const mount = () => render(<MemoryRouter><BeeTournament /></MemoryRouter>)
  const spell = (text: string) => {
    const box = typeAnswer('Spell the word', text)
    fireEvent.keyDown(box, { key: 'Enter' })
    return box
  }
  const learn = (n: number) => {
    for (let i = 0; i < n; i++) h.flow.completeWord(`concise-all-bee-${i}`)
  }

  it('costs one wing for a double tap on a miss, not two', () => {
    learn(3)
    mount()
    fireEvent.click(screen.getByRole('button', { name: /Enter the Bee/ }))
    act(() => { vi.advanceTimersByTime(2300) })
    typeAnswer('Spell the word', 'zzzz')
    const lock = screen.getByRole('button', { name: /Lock it in/ })
    act(() => {
      fireEvent.click(lock)
      fireEvent.click(lock)
    })
    expect(screen.getByLabelText('1 wings left')).toBeInTheDocument()
    expect(h.record).toHaveBeenCalledTimes(1)
    // A soft landing, with the letters said aloud.
    expect(lastSaid()).toMatch(/You still have one wing\. Keep going!$/)
  })

  it('does not take a wing for Enter on an empty box', () => {
    learn(3)
    mount()
    fireEvent.click(screen.getByRole('button', { name: /Enter the Bee/ }))
    act(() => { vi.advanceTimersByTime(2300) })
    fireEvent.keyDown(screen.getByLabelText('Spell the word'), { key: 'Enter' })
    expect(screen.getByLabelText('2 wings left')).toBeInTheDocument()
    expect(h.record).not.toHaveBeenCalled()
  })

  it('pays the champion’s bonus once a week, not on every replay', () => {
    learn(15)
    const bracket = buildBracket(h.flow, wordBank)
    const all = bracket.flat()
    expect(all).toHaveLength(15)

    const playThrough = () => {
      fireEvent.click(screen.getByRole('button', { name: /Enter the Bee/ }))
      act(() => { vi.advanceTimersByTime(2300) })
      for (const w of all) {
        spell(w.word)
        act(() => { vi.advanceTimersByTime(1500) })
        act(() => { vi.advanceTimersByTime(2300) })
      }
    }

    mount()
    playThrough()
    expect(screen.getByText('🏆 Champion of the Bee!')).toBeInTheDocument()
    expect(h.addStars).toHaveBeenLastCalledWith(15 * 3 + CHAMPION_BONUS)
    // Praise varies — not "Correct!" fifteen times.
    expect(said().filter((t) => t === 'Correct!')).toHaveLength(0)

    cleanup()
    mount()
    playThrough()
    expect(h.addStars).toHaveBeenCalledTimes(2)
    // A replay the same week pays like a game: a star a word, at most 5.
    expect(h.addStars).toHaveBeenLastCalledWith(5)
    expect(screen.getByText(/Champion again!/)).toBeInTheDocument()
  })
})

// --- Word Hunt ---------------------------------------------------------------

describe('Word Hunt', () => {
  beforeEach(() => {
    h.flow = { getWordsLearnedTotal: () => [CAT, DOG, SUN].map((w) => w.id) }
    vi.spyOn(wordBank, 'getLearnedWords').mockReturnValue([CAT, DOG, SUN])
  })
  const mount = () => render(<MemoryRouter><WordHunt /></MemoryRouter>)
  const card = (letter: string) =>
    [...document.querySelectorAll<HTMLButtonElement>('.hunt-task')].find(
      (b) => b.querySelector('.hunt-letter')!.textContent === letter
    )!

  it('keeps both ticks when two cards are tapped at once', () => {
    mount()
    act(() => {
      fireEvent.click(card('C'))
      fireEvent.click(card('D'))
    })
    expect(card('C')).toHaveAttribute('aria-pressed', 'true')
    expect(card('D')).toHaveAttribute('aria-pressed', 'true')
    expect(JSON.parse(localStorage.getItem('word_hunt_state')!).done).toHaveLength(2)
  })

  it('pays a finished hunt once for a double tap, and keeps the tick', () => {
    mount()
    fireEvent.click(card('C'))
    fireEvent.click(card('D'))
    act(() => {
      fireEvent.click(card('S'))
      fireEvent.click(card('S'))
    })
    expect(h.addStars).toHaveBeenCalledTimes(1)
    expect(h.addStars).toHaveBeenCalledWith(HUNT_STARS)
    expect(card('S')).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByText('🔍 Hunt complete!')).toBeInTheDocument()
  })

  it('cheers each find and reads a clue aloud for a child who can’t read it yet', () => {
    mount()
    fireEvent.click(card('C'))
    expect(h.sfx.correct).toHaveBeenCalled()
    expect(lastSaid()).toMatch(/You found something for C!$/)
    fireEvent.click(screen.getByRole('button', { name: 'Hear the clue for D' }))
    expect(lastSaid()).toMatch(/“D”.*Like the word dog!$/)
  })
})

// --- Sentence Maker ------------------------------------------------------------

describe('Sentence Maker', () => {
  beforeEach(() => {
    h.flow = { getWordsLearnedTotal: () => [CAT, DOG, SUN].map((w) => w.id) }
    vi.spyOn(wordBank, 'getLearnedWords').mockReturnValue([CAT, DOG, SUN])
  })
  const mount = () => render(<MemoryRouter><SentenceMaker /></MemoryRouter>)

  it('pays the day’s stars once for a double tap', () => {
    mount()
    const read = screen.getByRole('button', { name: /Read it out loud/ })
    act(() => {
      fireEvent.click(read)
      fireEvent.click(read)
    })
    expect(h.addStars).toHaveBeenCalledTimes(1)
    expect(h.addStars).toHaveBeenCalledWith(SENTENCE_STARS)
    expect(screen.getByText(/\+5 stars/)).toBeInTheDocument()
  })

  it('marks the child’s own words in the sentence', () => {
    mount()
    const marked = [...document.querySelectorAll('.sentence-word')].map((m) => m.textContent).sort()
    expect(marked).toEqual(['cat', 'dog', 'sun'])
  })

  it('still changes something when there is no other word to swap in', () => {
    mount()
    const before = document.querySelector('.sentence-text')!.getAttribute('aria-label')
    fireEvent.click(screen.getByRole('button', { name: 'Swap cat' }))
    expect(document.querySelector('.sentence-text')!.getAttribute('aria-label')).not.toBe(before)
  })
})

// --- Prize Wheel ---------------------------------------------------------------

describe('Prize Wheel', () => {
  it('spins once for a double tap — one prize, not two', () => {
    render(<PrizeWheel />)
    const spin = screen.getByRole('button', { name: /Spin the wheel/ })
    act(() => {
      fireEvent.click(spin)
      fireEvent.click(spin)
    })
    act(() => { vi.advanceTimersByTime(SPIN_MS + 100) })
    expect(h.addStars).toHaveBeenCalledTimes(1)
    expect(screen.getByText(/You won \d+ stars!/)).toBeInTheDocument()
    expect(h.sfx.fanfare).toHaveBeenCalledTimes(1)
  })

  it('clicks past the pegs while it turns', () => {
    render(<PrizeWheel />)
    fireEvent.click(screen.getByRole('button', { name: /Spin the wheel/ }))
    act(() => { vi.advanceTimersByTime(SPIN_MS) })
    expect(h.sfx.tap.mock.calls.length).toBeGreaterThanOrEqual(10)
  })

  it('pays a spin left mid-turn exactly once, and uses up the day’s spin', () => {
    const { unmount } = render(<PrizeWheel />)
    fireEvent.click(screen.getByRole('button', { name: /Spin the wheel/ }))
    act(() => { vi.advanceTimersByTime(1000) })
    unmount()
    act(() => { vi.advanceTimersByTime(SPIN_MS * 2) })
    expect(h.addStars).toHaveBeenCalledTimes(1)
    expect(localStorage.getItem('prizeWheelLastSpin')).toBe(new Date().toDateString())

    render(<PrizeWheel />)
    expect(screen.getByRole('button', { name: /Spun today/ })).toBeDisabled()
  })
})
