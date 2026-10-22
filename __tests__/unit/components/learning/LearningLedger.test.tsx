import React from 'react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act, cleanup } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

/**
 * The learning ledgers move only for what a child really did: one finished
 * set moves the word group once, a word counts as spelled only when it was
 * spelled, a word met before pays nothing, and only the scheduled review opens
 * the review half of the games gate.
 */

const h = vi.hoisted(() => ({ speak: vi.fn(), addStars: vi.fn() }))

vi.mock('@/contexts/AudioContext', () => ({
  useAudio: () => ({ speak: h.speak, isAudioEnabled: true, toggleAudio: vi.fn(), stopSpeaking: vi.fn() }),
  AudioProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))
vi.mock('@/contexts/UserContext', () => ({
  useUser: () => ({ user: { id: 'kid', name: 'Kid', dailyGoal: 5 }, setUser: vi.fn(), updateDailyGoal: vi.fn(), logout: vi.fn() }),
  UserProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
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
  const W = (id: string, word: string, meaning: string, sentence: string) => ({
    id, word, meaning, sentence, difficulty: 1, category: 'food',
  })
  const words = [
    W('1', 'apple', 'a red fruit', 'I eat an apple.'),
    W('2', 'banana', 'a yellow fruit', 'I eat a banana.'),
    W('3', 'cherry', 'a small red fruit', 'I eat a cherry.'),
    W('4', 'date', 'a sweet brown fruit', 'I eat a date.'),
    W('5', 'grape', 'a tiny purple fruit', 'I eat a grape.'),
  ]
  return {
    wordBank: {
      getAllWords: () => words,
      getWordsForLevels: () => words,
      // No private list here: learning follows the levels.
      getLearningList: () => words,
      hasList: () => false,
      getRandomWords: () => words,
      getWordsByDifficulty: () => words,
      getWordById: (id: string) => words.find((w) => w.id === id),
    },
  }
})

import { ProgressProvider } from '@/contexts/ProgressContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { LearningFlowController } from '@/services/progress/LearningFlow'
import ReviewSchedule from '@/services/progress/ReviewSchedule'
import WordMastery from '@/services/progress/WordMastery'
import BuddyService from '@/services/buddy/BuddyService'
import LearnMode from '@/components/learning/LearnMode'
import SpellMode from '@/components/learning/SpellMode'
import QuizMode from '@/components/learning/QuizMode'
import TestAll from '@/components/learning/TestAll'
import { spellOutPause, SPELL_OUT_MAX } from '@/components/learning/spellOutPause'
import LearningHub from '@/pages/LearningHub'
import DailyQuiz from '@/pages/DailyQuiz'
import Review from '@/pages/Review'

const W = (id: string, word: string, meaning: string, sentence: string) => ({
  id, word, meaning, sentence, difficulty: 1 as const, category: 'food',
})
// Module-level, so the `words` prop stays the same array across renders.
const TWO = [W('1', 'apple', 'a red fruit', 'I eat an apple.'), W('2', 'banana', 'a yellow fruit', 'I eat a banana.')]
const LONG = [W('6', 'skeleton', 'the bones inside you', 'The skeleton danced.'), W('7', 'cat', 'a pet', 'The cat sat.')]
const SNEAKY = [W('8', 'apparently', 'it seems', 'Apparently, the cake was gone. It was apparently eaten.')]

const mount = (ui: React.ReactElement, entries: any[] = ['/']) =>
  render(
    <MemoryRouter initialEntries={entries}>
      <ThemeProvider>
        <ProgressProvider>{ui}</ProgressProvider>
      </ThemeProvider>
    </MemoryRouter>
  )

const saved = () => JSON.parse(localStorage.getItem('learningProgress') || '{}')
const button = (name: RegExp | string) => screen.getByRole('button', { name })
const click = (name: RegExp | string) => fireEvent.click(button(name))
const type = (value: string, placeholder = 'Type the word...') =>
  fireEvent.change(screen.getByPlaceholderText(placeholder), { target: { value } })

/** Today's goal of 2, with these words already met today. */
const seed = (goal: number, learned: string[]) => {
  const flow = new LearningFlowController()
  flow.setDailyGoal(goal)
  learned.forEach((id) => flow.completeWord(id))
  return flow
}

/** LearnMode's quick check, the "Show me" way (works for every check kind). */
const passCard = () => {
  click(/Got it!/)
  fireEvent.click(screen.getByText(/Show me/))
  click(/Next word|Finish!/)
}

/** Skip every question of a quiz on screen. */
const skipQuiz = (n: number) => {
  for (let i = 0; i < n; i++) {
    click(/Skip/)
    click(/Next Question/)
  }
}

beforeEach(() => {
  vi.clearAllMocks()
  localStorage.clear()
  vi.useFakeTimers()
  // A stable no-op shuffle, so words and options keep their order.
  vi.spyOn(Math, 'random').mockReturnValue(0.5)
})
afterEach(() => {
  cleanup()
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe('one finished quiz moves the word group once', () => {
  it('QuizMode reports a set once, even after "Try Again"', () => {
    const onComplete = vi.fn()
    mount(<QuizMode type="vocab" words={TWO} onComplete={onComplete} />)
    const answerAll = () => {
      for (const meaning of ['a red fruit', 'a yellow fruit']) {
        fireEvent.click(screen.getByText(meaning))
        click(/Next Question/)
      }
    }
    answerAll()
    expect(onComplete).toHaveBeenCalledTimes(1)

    click(/Try Again/)
    answerAll()
    expect(screen.getByText('🎉 Quiz done!')).toBeInTheDocument()
    expect(onComplete).toHaveBeenCalledTimes(1)
  })

  it('the hub moves the saved group on one, through "Try Again" and a second lap of the quizzes', () => {
    seed(2, ['1', '2'])
    mount(<LearningHub />, ['/learn'])
    expect(saved().selectedGroup).toBe(0)

    const throughTheQuizzes = () => {
      click(/Spell your 2 words/)
      click(/Take Quiz/)
      skipQuiz(2) // spelling
      click(/Next: Word Meanings/)
      skipQuiz(2) // meanings
    }
    throughTheQuizzes()
    expect(saved().selectedGroup).toBe(1)

    click(/Try Again/)
    skipQuiz(2)
    expect(saved().selectedGroup).toBe(1)

    click(/Back to Hub/)
    throughTheQuizzes()
    expect(saved().selectedGroup).toBe(1)
  })

  it('a seasonal event never moves the child’s place in their own list', () => {
    const flow = seed(2, ['seasonal-halloween-1', 'seasonal-halloween-2'])
    flow.setSelectedGroup(2)
    mount(<LearningHub />, ['/learn?seasonal=halloween'])

    click(/Spell your 2 words/)
    click(/Take Quiz/)
    skipQuiz(2)
    click(/Next: Word Meanings/)
    skipQuiz(2)

    expect(screen.getByText('🎉 Quiz done!')).toBeInTheDocument()
    expect(saved().selectedGroup).toBe(2)
  })
})

describe('only words really spelled count as spelled', () => {
  it('a "Stuck?" word in the hub’s spelling set is not credited', () => {
    seed(2, ['1', '2'])
    mount(<LearningHub />, ['/learn'])

    click(/Spell your 2 words/)
    type('apple')
    click(/Check it/)
    act(() => { vi.advanceTimersByTime(1600) })
    click(/Stuck\?/)
    act(() => { vi.advanceTimersByTime(6000) })

    expect(saved().wordsSpelledTotal).toEqual(['1'])
    expect(screen.getByRole('dialog')).toHaveTextContent('spelled 1 of your 2 words')
    click(/What’s next/)
    // Still the next step, and finishable: "Stuck?" showed the word.
    expect(button(/Spell your 2 words/)).toBeInTheDocument()
  })

  it('a skipped word in the spelling quiz is not credited', () => {
    seed(2, ['1', '2'])
    mount(<LearningHub />, ['/learn'])

    click(/Spell your 2 words/)
    click(/Take Quiz/)
    type('apple', 'Type your answer here...')
    click(/Check it/)
    click(/Next Question/)
    skipQuiz(1)

    expect(screen.getByText('🎉 Quiz done!')).toBeInTheDocument()
    expect(saved().wordsSpelledTotal).toEqual(['1'])
  })
})

describe('a word met before pays nothing', () => {
  it('Previous, then "Got it!" again, pays and records nothing more', () => {
    mount(<LearnMode words={TWO} />)
    passCard() // apple, shown: one star
    expect(h.addStars).toHaveBeenCalledTimes(1)
    const box = ReviewSchedule.get('1')

    click(/Previous/)
    passCard()

    expect(h.addStars).toHaveBeenCalledTimes(1)
    expect(ReviewSchedule.get('1')).toEqual(box)
    expect(screen.getByRole('heading', { name: 'banana' })).toBeInTheDocument()
    expect(screen.getByText(/You know “apple”/)).toBeInTheDocument()
  })

  it('learning an earlier day’s words again pays no stars or snacks and moves no ledger', () => {
    seed(2, ['1', '2'])
    // Met on an earlier day: in the total, not in today's list.
    localStorage.setItem(
      'learningProgress',
      JSON.stringify({ ...saved(), wordsLearnedToday: [], wordsPracticedToday: [] })
    )
    const snack = vi.spyOn(BuddyService, 'earnSnack')
    const learned = vi.spyOn(WordMastery, 'recordLearned')
    const record = vi.spyOn(ReviewSchedule, 'record')

    mount(<LearnMode words={TWO} />)
    passCard()
    passCard()

    expect(screen.getByText(/went over your 2 words again/)).toBeInTheDocument()
    expect(h.addStars).not.toHaveBeenCalled()
    expect(snack).not.toHaveBeenCalled()
    expect(learned).not.toHaveBeenCalled()
    expect(record).not.toHaveBeenCalled()
    // Old words are not today's new words.
    expect(saved().wordsLearnedToday).toEqual([])
  })
})

describe('a seasonal event’s "Next up" moves forward', () => {
  it('once the event is learned and spelled, it heads back to the child’s own words', () => {
    // A learn goal above the event's ten words: the event is one group.
    const flow = seed(12, [])
    const ids = Array.from({ length: 10 }, (_, i) => `seasonal-halloween-${i + 1}`)
    ids.forEach((id) => flow.completeWord(id))
    flow.completeSpellQuiz(ids, 0)

    mount(<LearningHub />, ['/learn?seasonal=halloween'])
    expect(screen.queryByRole('button', { name: /Learn these words again/ })).not.toBeInTheDocument()
    click(/Back to my words/)

    // The regular list, where today's new words are.
    expect(button(/Learn 5 new words/)).toBeInTheDocument()
  })
})

describe('a shown spelling is heard in full', () => {
  it('pauses longer for longer words, never slower for short ones, and stops at a cap', () => {
    expect(spellOutPause('cat', 3000)).toBe(3000)
    expect(spellOutPause('skeleton', 3000)).toBeGreaterThanOrEqual(5500)
    expect(spellOutPause('x'.repeat(40), 3000)).toBe(SPELL_OUT_MAX)
  })

  it('QuizMode keeps a missed long word up while it is spelled, then queues the next prompt', () => {
    mount(<QuizMode type="spell" words={LONG} />)
    type('skeliton', 'Type your answer here...')
    click(/Check it/)

    act(() => { vi.advanceTimersByTime(3500) }) // the old flat pause
    expect(document.querySelector('.answer-feedback')?.textContent).toMatch(/skeleton/)

    act(() => { vi.advanceTimersByTime(spellOutPause('skeleton', 3500) - 3500) })
    expect(h.speak).toHaveBeenLastCalledWith('cat. The cat sat. cat.', { queue: true })
  })

  it('the daily quiz keeps a missed word up while it is spelled, then asks behind the letters', () => {
    seed(1, ['2'])
    mount(<DailyQuiz />)
    type('banan')
    click(/Check it/)

    act(() => { vi.advanceTimersByTime(3000) }) // the old flat pause
    expect(document.querySelector('.dq-flash.soft')).not.toBeNull()

    act(() => { vi.advanceTimersByTime(spellOutPause('banana', 3000) - 3000) })
    expect(document.querySelector('.dq-flash.soft')).toBeNull()
    expect(h.speak).toHaveBeenLastCalledWith('banana. I eat a banana. banana.', { queue: true })
  })
})

describe('the sentence never shows the word being tested', () => {
  it('SpellMode hides every match, in any case', () => {
    mount(<SpellMode words={SNEAKY} />)
    const shown = document.querySelector('.sentence-text')?.textContent ?? ''
    expect(shown).toBe('_______, the cake was gone. It was _______ eaten.')
  })

  it('TestAll hides every match, in any case', () => {
    mount(<TestAll words={SNEAKY} />)
    click(/Start!/)
    const shown = document.querySelector('.sentence-text')?.textContent ?? ''
    expect(shown).not.toMatch(/apparently/i)
  })
})

describe('only the scheduled review opens the games', () => {
  const reviewDue = () => {
    const flow = seed(5, ['1', '2', '3', '4', '5'])
    flow.passDailyQuiz()
    expect(flow.gamesLockedReason()).toBe('review')
  }

  it('practising a word just missed does not count as today’s review', () => {
    reviewDue()
    mount(<Review />, [{ pathname: '/review', state: { missed: ['1'] } }])
    expect(screen.queryByText(/Finish this to open every game/)).not.toBeInTheDocument()

    type('apple')
    click(/Check it/)
    act(() => { vi.advanceTimersByTime(1600) })

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(saved().lastReviewDate).toBeFalsy()
    expect(new LearningFlowController().gamesLockedReason()).toBe('review')
  })

  it('the scheduled review still counts, and says so up front', () => {
    reviewDue()
    mount(<Review />, ['/review'])
    expect(screen.getByText('🔓 Finish this to open every game!')).toBeInTheDocument()

    for (let i = 0; i < 5 && !screen.queryByRole('dialog'); i++) {
      click(/Stuck\?/)
      act(() => { vi.advanceTimersByTime(10000) })
    }

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(new LearningFlowController().gamesLockedReason()).toBe(null)
  })
})
