import { setPreferences } from '@/services/preferences'
import React from 'react'
import fs from 'fs'
import path from 'path'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act, cleanup } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

const h = vi.hoisted(() => ({ speak: vi.fn(), addStars: vi.fn() }))

vi.mock('@/contexts/AudioContext', () => ({
  useAudio: () => ({ speak: h.speak, isAudioEnabled: true, toggleAudio: vi.fn(), stopSpeaking: vi.fn() }),
  AudioProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))
vi.mock('@/stores/rewards/useRewardStore', () => ({ useRewardStore: () => ({ addStars: h.addStars }) }))
vi.mock('@/services/persistence/FirebaseSync', () => ({ default: { syncToServer: vi.fn().mockResolvedValue(undefined) } }))
vi.mock('@/components/games/shared/sfx', () => {
  const sfx = {
    tap: vi.fn(), correct: vi.fn(), wrong: vi.fn(), win: vi.fn(), pop: vi.fn(), star: vi.fn(),
    whoosh: vi.fn(), thud: vi.fn(), applause: vi.fn(), fanfare: vi.fn(),
  }
  return { default: sfx, sfx, setWorldSoundProfile: vi.fn() }
})
vi.mock('@/services/wordBank', () => {
  const words = [
    { id: '1', word: 'apple', meaning: 'a red fruit', sentence: 'I eat an apple.', difficulty: 1, category: 'food' },
    { id: '2', word: 'banana', meaning: 'a yellow fruit', sentence: 'I eat a banana.', difficulty: 1, category: 'food' },
    { id: '3', word: 'cherry', meaning: 'a small red fruit', sentence: 'I eat a cherry.', difficulty: 1, category: 'food' },
    { id: '4', word: 'date', meaning: 'a sweet brown fruit', sentence: 'I eat a date.', difficulty: 1, category: 'food' },
  ]
  return {
    wordBank: {
      getAllWords: () => words,
      getRandomWords: () => words,
      getWordsByDifficulty: () => words,
      getWordById: (id: string) => words.find((w) => w.id === id),
      getMaskedVocabularyQuestion: (w: string) => `What does "${w}" mean?`,
    },
  }
})

import { ProgressProvider } from '@/contexts/ProgressContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { LearningFlowController } from '@/services/progress/LearningFlow'
import SpellMode from '@/components/learning/SpellMode'
import QuizMode from '@/components/learning/QuizMode'
import TestAll from '@/components/learning/TestAll'
import LearnMode from '@/components/learning/LearnMode'
import QuickCheck from '@/components/learning/QuickCheck'
import WordTrail from '@/components/learning/WordTrail'
import Review from '@/pages/Review'

const W = (id: string, word: string, meaning: string) => ({
  id, word, meaning, sentence: `I eat a ${word}.`, difficulty: 1 as const, category: 'food',
})
const APPLE = { ...W('1', 'apple', 'a red fruit'), sentence: 'I eat an apple.' }
const WORDS = [APPLE, W('2', 'banana', 'a yellow fruit'), W('3', 'cherry', 'a small red fruit')]

const mount = (ui: React.ReactElement, entries: any[] = ['/']) =>
  render(
    <MemoryRouter initialEntries={entries}>
      <ThemeProvider>
        <ProgressProvider>{ui}</ProgressProvider>
      </ThemeProvider>
    </MemoryRouter>
  )

const type = (value: string, placeholder = 'Type the word...') =>
  fireEvent.change(screen.getByPlaceholderText(placeholder), { target: { value } })
const check = () => fireEvent.click(screen.getByRole('button', { name: /Check it/ }))
const spelled = (): string[] => {
  const saved = localStorage.getItem('learningProgress')
  return saved ? JSON.parse(saved).wordsSpelledToday ?? [] : []
}

it('waits for the child after a correct spelling in manual lesson mode', () => {
  setPreferences({ waitForMe: true })
  mount(<SpellMode words={WORDS} />)
  type('apple'); check()
  act(() => vi.advanceTimersByTime(30_000))
  expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '1')
  fireEvent.click(screen.getByRole('button', { name: /Next Word/ }))
  expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '2')
})

it('lets a child rebuild a missed word with help without claiming independent mastery or stars', () => {
  setPreferences({ waitForMe: true })
  mount(<SpellMode words={WORDS} />)
  type('aple'); check()
  fireEvent.click(screen.getByRole('button', { name: 'Try with help' }))
  type('apple'); check()
  expect(screen.getByText(/You built it with help/)).toBeInTheDocument()
  expect(spelled()).not.toContain('1')
  expect(h.addStars).not.toHaveBeenCalled()
  fireEvent.click(screen.getByRole('button', { name: /Next Word/ }))
  expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '2')
})

beforeEach(() => {
  vi.clearAllMocks()
  localStorage.clear(); setPreferences({ relaxed: false, waitForMe: false })
  vi.useFakeTimers()
  // A stable no-op shuffle, so words and options keep their order.
  vi.spyOn(Math, 'random').mockReturnValue(0.5)
})
afterEach(() => {
  cleanup()
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe('SpellMode: Stuck? shows the word without counting it', () => {
  it('never counts a shown word as spelled, even if it is then typed in', () => {
    mount(<SpellMode words={WORDS} />)
    fireEvent.click(screen.getByRole('button', { name: /Stuck\?/ }))

    expect(screen.getByPlaceholderText('Type the word...')).toHaveValue('apple')
    expect(screen.getByRole('status')).toHaveTextContent('Here it is: apple')
    // Spelled out loud, letter by letter.
    expect(h.speak).toHaveBeenLastCalledWith('apple is spelled a, p, p, l, e.')

    // Pressing Enter on the shown word must not score it.
    fireEvent.keyPress(screen.getByPlaceholderText('Type the word...'), { key: 'Enter', code: 'Enter', charCode: 13 })
    expect(screen.getByRole('status')).not.toHaveTextContent('⭐')
    expect(h.addStars).not.toHaveBeenCalled()
    expect(spelled()).not.toContain('1')
  })

  it('moves on through the one timer, so Next Word in the gap cannot skip a word', () => {
    mount(<SpellMode words={WORDS} />)
    fireEvent.click(screen.getByRole('button', { name: /Stuck\?/ }))
    fireEvent.click(screen.getByRole('button', { name: /Next Word/ }))
    expect(screen.getByText('I eat a _______.')).toBeInTheDocument() // banana

    act(() => { vi.advanceTimersByTime(10000) })
    expect(screen.getByText('I eat a _______.')).toBeInTheDocument() // still banana
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '2')
  })

  it('moves on by itself after showing the word', () => {
    mount(<SpellMode words={WORDS} />)
    fireEvent.click(screen.getByRole('button', { name: /Stuck\?/ }))
    act(() => { vi.advanceTimersByTime(2500 + 5 * 400) })
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '2')
  })
})

describe('SpellMode: where a set starts', () => {
  beforeEach(() => {
    // Apple was met today, so it counts as practised.
    new LearningFlowController().completeWord('1')
  })

  it('resumes at the first word not practised today by default', () => {
    mount(<SpellMode words={WORDS} />)
    expect(screen.getByText('I eat a _______.')).toBeInTheDocument() // banana
  })

  it('starts at the top when told not to resume', () => {
    mount(<SpellMode words={WORDS} resume={false} />)
    expect(screen.getByText('I eat an _______.')).toBeInTheDocument() // apple
  })
})

describe('Review', () => {
  it('starts at the first word even when the words were met today', () => {
    const flow = new LearningFlowController()
    for (const id of ['1', '2', '3', '4', '5']) flow.completeWord(id)
    flow.passDailyQuiz()
    expect(flow.gamesLockedReason()).toBe('review')

    mount(<Review />, [{ pathname: '/review', state: { missed: ['1', '2'] } }])

    expect(screen.getByText('I eat an _______.')).toBeInTheDocument() // apple, word 1 of 2
    // Practising words just missed is extra practice, not today's review, so
    // it doesn't promise to open the games (LearningLedger.test covers that).
    expect(screen.queryByText('🔓 Finish this to open every game!')).not.toBeInTheDocument()

    for (const word of ['apple', 'banana']) {
      type(word)
      check()
      act(() => { vi.advanceTimersByTime(1600) })
    }

    // SpellMode's own score card stays hidden; the Celebration is the finish,
    // showing a star per word spelled plus the review bonus.
    expect(screen.queryByRole('button', { name: /Practice More/ })).not.toBeInTheDocument()
    expect(screen.getByRole('dialog')).toHaveTextContent('+5 stars')
    // Two stars from the words, three for finishing — each word paid once.
    expect(h.addStars.mock.calls.map((c) => c[0])).toEqual([1, 1, 3])
  })
})

describe('QuizMode: one answer, one advance, one finish', () => {
  const quiz = (onComplete = vi.fn(), type: 'vocab' | 'spell' = 'vocab', words = WORDS) =>
    mount(<QuizMode type={type} words={words} onComplete={onComplete} />)

  it('"Next Question" cancels the auto-advance instead of skipping a question', () => {
    quiz()
    fireEvent.click(screen.getByText('a red fruit'))
    fireEvent.click(screen.getByRole('button', { name: /Next Question/ }))
    expect(screen.getByText('What does “banana” mean?')).toBeInTheDocument()

    act(() => { vi.advanceTimersByTime(5000) })
    expect(screen.getByText('What does “banana” mean?')).toBeInTheDocument()
  })

  it('finishes once, so the page moves on one word group, not two', () => {
    const onComplete = vi.fn()
    quiz(onComplete)
    for (const meaning of ['a red fruit', 'a yellow fruit', 'a small red fruit']) {
      fireEvent.click(screen.getByText(meaning))
      fireEvent.click(screen.getByRole('button', { name: /Next Question/ }))
    }
    act(() => { vi.advanceTimersByTime(5000) })

    expect(onComplete).toHaveBeenCalledTimes(1)
    expect(onComplete).toHaveBeenCalledWith(30, 0, ['1', '2', '3'])
  })

  it('a double tap on Skip skips one question and shows its answer', () => {
    const onComplete = vi.fn()
    quiz(onComplete)
    const skip = screen.getByRole('button', { name: /Skip/ })
    act(() => {
      fireEvent.click(skip)
      fireEvent.click(skip)
    })
    expect(screen.getByRole('status')).toHaveTextContent('Here it is: a red fruit')

    act(() => { vi.advanceTimersByTime(3500) })
    expect(screen.getByText('What does “banana” mean?')).toBeInTheDocument()
  })

  it('spells with sameSpelling: case, accents and stray spaces set aside', () => {
    quiz(vi.fn(), 'spell', [{ ...APPLE, id: '9', word: 'señor', sentence: 'The señor waved.' }, WORDS[1]])
    expect(h.speak).toHaveBeenCalledWith('señor. The señor waved. señor.')
    type(' Senor ', 'Type your answer here...')
    check()
    expect(screen.getByRole('status')).toHaveTextContent('⭐')
    expect(h.addStars).toHaveBeenCalledWith(1)
  })

  it('a miss is a gentle "nearly" with the word spelled out, never "Incorrect"', () => {
    quiz(vi.fn(), 'spell')
    type('apul', 'Type your answer here...')
    check()
    const status = screen.getByRole('status')
    expect(status).toHaveTextContent('It’s apple')
    expect(status.textContent).not.toMatch(/Incorrect|❌/)
    expect(h.speak.mock.lastCall?.[0]).toMatch(/apple is spelled a, p, p, l, e\.$/)
  })
})

describe('TestAll', () => {
  const start = () => {
    mount(<TestAll words={WORDS} />)
    fireEvent.click(screen.getByRole('button', { name: /Start!/ }))
  }

  it('is one line and a big Start, with honest numbers and no clock unless chosen', () => {
    mount(<TestAll words={WORDS} />)
    expect(screen.getByText(/Spell your 3 words/)).toBeInTheDocument()
    expect(screen.queryByText(/Up to 50|Comprehensive/)).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /Start!/ }))
    expect(screen.queryByRole('timer')).not.toBeInTheDocument()
  })

  it('checks with sameSpelling and flashes a soft answer for each word', () => {
    start()
    type(' Apple', 'Type the missing word...')
    check()
    expect(screen.getByRole('status')).toHaveTextContent('⭐')
    expect(h.addStars).toHaveBeenCalledWith(1)

    act(() => { vi.advanceTimersByTime(1200) })
    type('bananna', 'Type the missing word...')
    check()
    expect(screen.getByRole('status')).toHaveTextContent('It’s banana')
  })

  it('"Stuck?" shows the word and counts nothing, even with the right word typed', () => {
    start()
    type('apple', 'Type the missing word...')
    fireEvent.click(screen.getByRole('button', { name: /Stuck\?/ }))
    expect(screen.getByRole('status')).toHaveTextContent('Here it is! It’s apple')
    expect(h.addStars).not.toHaveBeenCalled()
  })

  it('ends with stars and words to practise, not a percentage', () => {
    start()
    for (const typed of ['apple', 'nope', 'cherry']) {
      type(typed, 'Type the missing word...')
      check()
      act(() => { fireEvent.click(screen.getByRole('button', { name: /Next/ })) })
    }
    expect(screen.getByText('⭐ +2 stars')).toBeInTheDocument()
    expect(screen.getByText('🌱 Words to practise')).toBeInTheDocument()
    expect(screen.queryByText(/%|Incorrect|Overall Score/)).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Practise the ones I missed/ })).toBeInTheDocument()
  })

  it('a timed test fills a ring and shows the answer gently when time is up', () => {
    mount(<TestAll words={WORDS} timePerWord={3} />)
    fireEvent.click(screen.getByRole('button', { name: /with a timer/ }))
    expect(screen.getByRole('timer')).toBeInTheDocument()
    act(() => { vi.advanceTimersByTime(1000) })
    act(() => { vi.advanceTimersByTime(1000) })
    act(() => { vi.advanceTimersByTime(1000) })
    expect(screen.getByRole('status')).toHaveTextContent('Time’s up — no worries! It’s apple')
  })
})

describe('the fun: speech, praise and streaks', () => {
  it('asks for each word the way a spelling-bee pronouncer does', () => {
    mount(<SpellMode words={WORDS} />)
    expect(h.speak).toHaveBeenCalledWith('apple. I eat an apple. apple.')
  })

  it('never says the same praise twice running, and cheers a streak of three', () => {
    mount(<SpellMode words={WORDS} />)
    const lines: string[] = []
    for (const word of ['apple', 'banana', 'cherry']) {
      type(word)
      check()
      // (The trail's "One to go!" is a status too, so read the praise itself.)
      lines.push(document.querySelector('.correct-feedback')?.textContent ?? '')
      if (word !== 'cherry') act(() => { vi.advanceTimersByTime(1600) })
    }
    expect(lines[0]).not.toBe(lines[1])
    expect(lines[2]).toContain('Three in a row!')
    const chip = screen.getByLabelText('3 in a row')
    expect(chip).toHaveClass('is-milestone')
    expect(chip).toHaveTextContent('🔥 3')
  })

  it('a miss spells the word out loud and shows a soft card', () => {
    mount(<SpellMode words={WORDS} />)
    type('apel')
    check()
    expect(h.speak.mock.lastCall?.[0]).toMatch(/apple is spelled a, p, p, l, e\.$/)
    expect(document.querySelector('.sm-nearly')).not.toBeNull()
    expect(document.querySelector('.incorrect-feedback')).toBeNull()
  })

  it('LearnMode says the very first card, and covers the word while checking', () => {
    mount(<LearnMode words={WORDS} />)
    expect(h.speak).toHaveBeenCalledWith('apple')
    fireEvent.click(screen.getByRole('button', { name: /Got it!/ }))
    expect(screen.queryByRole('heading', { name: 'apple' })).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /Peek/ }))
    expect(screen.getByRole('heading', { name: 'apple' })).toBeInTheDocument()
  })

  const buildWord = (word: string) => {
    for (const letter of word) {
      const tile = screen
        .getAllByRole('button')
        .find((b) => b.className.includes('qc-tile') && b.textContent === letter && !(b as HTMLButtonElement).disabled)!
      fireEvent.click(tile)
    }
  }

  it('LearnMode pays two stars unaided, and a peek counts as being shown the word', () => {
    mount(<LearnMode words={WORDS} />)
    fireEvent.click(screen.getByRole('button', { name: /Got it!/ }))
    buildWord('apple') // variant 0 is the build check
    act(() => { vi.advanceTimersByTime(900) })
    expect(h.addStars).toHaveBeenLastCalledWith(2)

    // Banana: peek, then build it — that is copying, so one star.
    fireEvent.click(screen.getByRole('button', { name: /Got it!/ }))
    fireEvent.click(screen.getByRole('button', { name: /Peek/ }))
    // Variant 1 is "which one is spelled right?"
    fireEvent.click(screen.getByRole('button', { name: 'banana' }))
    act(() => { vi.advanceTimersByTime(900) })
    expect(h.addStars).toHaveBeenLastCalledWith(1)
  })

  it('QuickCheck praise builds on the lesson streak', () => {
    const onPass = vi.fn()
    render(<QuickCheck word={W('7', 'cat', 'a pet')} streak={2} onPass={onPass} />)
    buildWord('cat')
    expect(screen.getByRole('status')).toHaveTextContent('Three in a row!')
    act(() => { vi.advanceTimersByTime(900) })
    expect(onPass).toHaveBeenCalledWith(false)
  })

  it('QuickCheck "Show me" spells the word out while the letters fill in', () => {
    const onPass = vi.fn()
    render(<QuickCheck word={W('7', 'cat', 'a pet')} onPass={onPass} />)
    fireEvent.click(screen.getByText(/Show me/))
    expect(h.speak).toHaveBeenCalledWith('cat. c, a, t.')
    expect(document.querySelectorAll('.qc-slot.shown')).toHaveLength(0)
    act(() => { vi.advanceTimersByTime(450) })
    expect(document.querySelectorAll('.qc-slot.shown')).toHaveLength(1)
    act(() => { vi.advanceTimersByTime(900) })
    expect(document.querySelectorAll('.qc-slot.shown')).toHaveLength(3)
    fireEvent.click(screen.getByRole('button', { name: /Finish|Next word/ }))
    expect(onPass).toHaveBeenCalledWith(true)
  })

  it('WordTrail puts a star on solved stones and cheers at halfway and one to go', () => {
    const { rerender } = render(<WordTrail total={4} current={2} solved={[0]} streak={1} stars={1} />)
    expect(screen.getByRole('status')).toHaveTextContent('Halfway there!')
    expect(document.querySelectorAll('.wt-stone.is-solved')).toHaveLength(1)
    rerender(<WordTrail total={4} current={3} solved={[0, 2]} />)
    expect(screen.getByRole('status')).toHaveTextContent('One to go!')
  })
})

describe('the learning screens speak gently', () => {
  const SRC = path.resolve(__dirname, '../../../../src')
  const DIRS = ['components/learning', 'pages/DailyQuiz', 'pages/Review', 'pages/LearningHub']
  const files = (dir: string): string[] =>
    fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
      const p = path.join(dir, d.name)
      if (d.isDirectory()) return files(p)
      return /\.tsx?$/.test(d.name) ? [p] : []
    })

  it('finds the files to check', () => {
    expect(DIRS.flatMap((d) => files(path.join(SRC, d))).length).toBeGreaterThan(8)
  })

  it('never tells a child "Incorrect", counts "Wrong:" or shows ❌', () => {
    const offenders = DIRS.flatMap((d) => files(path.join(SRC, d)))
      .filter((f) => /incorrect|Wrong:|❌/i.test(fs.readFileSync(f, 'utf-8')))
      .map((f) => path.relative(SRC, f))
    expect(
      offenders,
      'A miss is "Nearly! It’s …" with the word spelled out — never Incorrect, a wrong-count or a red cross.'
    ).toEqual([])
  })
})
