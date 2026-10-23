import { setPreferences } from '@/services/preferences'
import React from 'react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'

// vi.mock is hoisted above everything, so what it uses must be hoisted too.
const h = vi.hoisted(() => {
  const noSound = {
    tap: () => {}, pop: () => {}, correct: () => {}, wrong: () => {}, win: () => {},
    star: () => {}, whoosh: () => {}, thud: () => {}, applause: () => {}, fanfare: () => {},
    worldJingle: () => {},
  }
  return { noSound, record: vi.fn(), speak: vi.fn() }
})
vi.mock('@/components/games/shared/sfx', () => ({
  default: h.noSound,
  sfx: h.noSound,
  setWorldSoundProfile: () => {},
}))
vi.mock('@/services/progress/ReviewSchedule', () => ({
  default: { record: h.record },
  ReviewSchedule: { record: h.record },
}))
// What a game says is what a child hears.
vi.mock('@/contexts/AudioContext', () => ({
  useAudio: () => ({ speak: h.speak }),
  AudioProvider: ({ children }: { children: React.ReactNode }) => children,
}))

import MysteryPicture from '@/components/games/MysteryPicture'
import SecretCode from '@/components/games/SecretCode'
import GhostWord, { lookTime } from '@/components/games/GhostWord'
import WordMachine, { spokenLesson } from '@/components/games/WordMachine'
import DragonDuel from '@/components/games/DragonDuel'
import WordWhack, { wordSize } from '@/components/games/WordWhack'
import WordFishing, { endingDecoys } from '@/components/games/WordFishing'
import RhymeTime, { pickDecoys, sayChoices, trueRhyme } from '@/components/games/RhymeTime'
import SpellTower from '@/components/games/SpellTower'
import WordSort, { planSort } from '@/components/games/WordSort'
import ParrotParty, { DARK_FROM } from '@/components/games/ParrotParty'
import { isRealWord } from '@/components/games/shared/realWords'
import { RHYME_FAMILIES, splitChunk } from '@/components/games/shared/wordTricks'

const word = (w: string, meaning = `the meaning of ${w}`) => ({
  id: w,
  word: w,
  meaning,
  sentence: `A ${w} appeared.`,
  difficulty: 1 as const,
  category: 'test',
})
const words = (...list: string[]) => list.map((w) => word(w))

it('relaxed Word Whack has no countdown and finishes only when the child chooses', () => {
  setPreferences({ relaxed: true })
  const complete = vi.fn()
  render(<WordWhack words={words('cat', 'dog')} seconds={1} onComplete={complete} />)
  act(() => vi.advanceTimersByTime(60_000))
  expect(complete).not.toHaveBeenCalled()
  expect(screen.getByText('Your pace')).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Finish my round' }))
  expect(complete).toHaveBeenCalledOnce()
})

const button = (name: string | RegExp) => screen.getByRole('button', { name })
const wait = (ms: number) => act(() => { vi.advanceTimersByTime(ms) })

/** The last of `list` the game said out loud — which word is being asked. */
const heard = (list: string[]): string => {
  // A bare word, or bee-style "word. A word appeared. word." — the word comes first.
  const said = h.speak.mock.calls
    .map((c) => String(c[0]))
    .map((t) => (list.includes(t) ? t : t.split('.')[0]))
    .filter((t) => list.includes(t))
  return said[said.length - 1]
}

const type = (placeholder: string, text: string) =>
  fireEvent.change(screen.getByPlaceholderText(placeholder), { target: { value: text } })

beforeEach(() => {
  h.record.mockClear()
  h.speak.mockClear()
  vi.useFakeTimers()
})
afterEach(() => vi.useRealTimers())

// --- Word Fishing ----------------------------------------------------------------

describe('Word Fishing', () => {
  it('finds three different wrong endings even when every word ends the same way', () => {
    // Every ending here is "ll", whose only typo is "lll": the old top-up loop
    // added the same "lle" over and over and never finished.
    for (let i = 0; i < 60; i++) {
      const decoys = endingDecoys('ball', ['tall', 'call', 'fall'])
      expect(decoys).toHaveLength(3)
      expect(new Set(decoys).size).toBe(3)
      expect(decoys).not.toContain('ll')
    }
    expect(endingDecoys('ball', [])).toHaveLength(3)
  })

  it('opens with ball, tall, call and fall instead of freezing', () => {
    const { container } = render(<WordFishing words={words('ball', 'tall', 'call', 'fall')} onComplete={() => {}} />)
    const fish = [...container.querySelectorAll('.wf-fish')].map((f) => f.textContent)
    expect(fish).toHaveLength(4)
    expect(new Set(fish).size).toBe(4)
    expect(fish).toContain('ll')
  })

  it('reels in the right fish for them after two splashes, says the word, and moves on', () => {
    const onComplete = vi.fn()
    const list = ['rabbit', 'kitten', 'summer', 'window']
    const { container } = render(<WordFishing words={words(...list)} rounds={1} onComplete={onComplete} />)
    const target = heard(list)
    const tail = splitChunk(target)[1]
    const wrong = [...container.querySelectorAll<HTMLButtonElement>('.wf-fish')].filter((f) => f.textContent !== tail)

    fireEvent.click(wrong[0])
    expect(screen.getByText(/swam off/)).toBeInTheDocument()
    fireEvent.click(wrong[0]) // already tried: ignored, not a second miss
    fireEvent.click(wrong[1])
    expect(screen.getByText(/It was/)).toBeInTheDocument()
    expect(h.speak).toHaveBeenLastCalledWith(expect.stringContaining(`It was ${target}`))
    expect(onComplete).not.toHaveBeenCalled()
    wait(2700)
    expect(onComplete).toHaveBeenCalledTimes(1)
    expect(onComplete).toHaveBeenCalledWith(0)
  })

  it('pays most for a first cast', () => {
    const onComplete = vi.fn()
    const list = ['rabbit', 'kitten', 'summer', 'window']
    const { container } = render(<WordFishing words={words(...list)} rounds={1} onComplete={onComplete} />)
    const tail = splitChunk(heard(list))[1]
    const right = [...container.querySelectorAll<HTMLButtonElement>('.wf-fish')].find((f) => f.textContent === tail)!
    fireEvent.click(right)
    fireEvent.click(right)
    wait(1700)
    expect(onComplete).toHaveBeenCalledTimes(1)
    expect(onComplete).toHaveBeenCalledWith(30)
  })
})

// --- Spell Tower -----------------------------------------------------------------

describe('Spell Tower', () => {
  const build = (text: string) => {
    type('Spell it to build!', text)
    fireEvent.click(button(/Build/))
  }

  it('puts the roof on after the last word even when a word was missed', () => {
    const onComplete = vi.fn()
    const list = ['cat', 'dog']
    render(<SpellTower words={words(...list)} onComplete={onComplete} />)

    build('zzz')
    expect(screen.getByText(/It was/)).toBeInTheDocument()
    wait(2400)
    build(heard(list))
    wait(1200)

    // The old tower ran past its last word into an empty screen here.
    expect(screen.queryByText(/No bricks yet/)).not.toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'The roof is on' })).toBeInTheDocument()
    expect(screen.getByText(/Roof on! Your tower is 1 floor tall/)).toBeInTheDocument()
    wait(2800)
    // One floor (30 + 5); the perfect-tower bonus is only for a floor per word.
    expect(onComplete).toHaveBeenCalledTimes(1)
    expect(onComplete).toHaveBeenCalledWith(35)
    expect(h.record).toHaveBeenCalledTimes(2)
  })

  it('finishes on a miss of the very last word too', () => {
    const onComplete = vi.fn()
    const list = ['cat', 'dog']
    render(<SpellTower words={words(...list)} onComplete={onComplete} />)
    build(heard(list))
    wait(1300)
    build('zzz')
    wait(2400)
    expect(screen.getByRole('img', { name: 'The roof is on' })).toBeInTheDocument()
    wait(2800)
    expect(onComplete).toHaveBeenCalledTimes(1)
    expect(onComplete).toHaveBeenCalledWith(35)
  })

  it('gives the perfect-tower bonus for a floor on every word', () => {
    const onComplete = vi.fn()
    const list = ['cat', 'dog']
    render(<SpellTower words={words(...list)} onComplete={onComplete} />)
    build(heard(list))
    wait(1300)
    build(heard(list))
    wait(1200 + 2800)
    expect(onComplete).toHaveBeenCalledWith(35 + 40 + 100)
    expect(screen.getByText(/A perfect tower/)).toBeInTheDocument()
  })
})

// --- Mystery Picture -------------------------------------------------------------

describe('Mystery Picture', () => {
  const list = ['cat', 'dog', 'sun', 'pig']
  const uncover = (text: string) => {
    type('Type the word...', text)
    fireEvent.click(button('Uncover!'))
  }

  it('shows and says the word after two misses, lifts its tiles anyway, and moves on', () => {
    render(<MysteryPicture words={words(...list)} onComplete={() => {}} />)
    const target = heard(list)
    expect(screen.getByText('Word').nextSibling?.textContent).toBe('1/4')

    uncover('zzz')
    expect(screen.getByText(/have another go/)).toBeInTheDocument()
    wait(1100)
    expect((screen.getByPlaceholderText('Type the word...') as HTMLInputElement).value).toBe('')

    uncover('qqq')
    expect(screen.getByText(new RegExp(`It was “${target}”`))).toBeInTheDocument()
    expect(h.speak).toHaveBeenLastCalledWith(expect.stringContaining(`It was ${target}. ${[...target].join(', ')}`))
    expect(screen.getByText('Found').nextSibling?.textContent).toBe('3/12')

    wait(2600)
    expect(screen.getByText('Word').nextSibling?.textContent).toBe('2/4')
  })

  it('shows the finished picture, then reports once — no button to tap', () => {
    const onComplete = vi.fn()
    render(<MysteryPicture words={words(...list)} onComplete={onComplete} />)
    for (let i = 0; i < list.length; i++) {
      uncover(heard(list))
      wait(1300)
    }
    expect(screen.getByText(/You revealed/)).toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(onComplete).not.toHaveBeenCalled()
    wait(2500)
    // The last word used to be counted twice (score + 20 on a button).
    expect(onComplete).toHaveBeenCalledTimes(1)
    expect(onComplete).toHaveBeenCalledWith(4 * 25 + 30)
  })

  it('blanks the word out of its clue', () => {
    render(<MysteryPicture words={[word('cat', 'A cat is a small pet. It purrs.')]} onComplete={() => {}} />)
    expect(screen.getByText('Clue: A ____ is a small pet')).toBeInTheDocument()
  })
})

// --- Rhyme Time ------------------------------------------------------------------

describe('Rhyme Time', () => {
  it('never offers a true rhyme from the same family as a wrong answer', () => {
    // bee/sea, kite/night, boat/note and sun/one rhyme by sound, not spelling.
    for (const row of RHYME_FAMILIES) {
      for (const target of row) {
        const correct = row.find((w) => w !== target)!
        for (let i = 0; i < 8; i++) {
          const decoys = pickDecoys(target, correct, [])
          expect(decoys).toHaveLength(2)
          for (const d of decoys) expect(row).not.toContain(d)
        }
      }
    }
  })

  it('keeps a child’s own sound-alike words out too', () => {
    for (let i = 0; i < 40; i++) {
      const decoys = pickDecoys('kite', 'white', ['fight', 'sea', 'rocket'])
      expect(decoys).not.toContain('fight')
      expect(decoys).not.toContain('night')
    }
  })

  it('reads the three choices out after the question, queued so neither is cut off', () => {
    render(<RhymeTime words={words('cat', 'dog', 'sun', 'pig')} onComplete={() => {}} />)
    expect(h.speak).toHaveBeenCalledWith(expect.stringMatching(/^Which word rhymes with \w+\?$/), { queue: true })
    expect(h.speak).toHaveBeenCalledWith(expect.stringMatching(/^\w+, \w+, or \w+\?$/), { queue: true })
    expect(sayChoices(['dog', 'hat', 'sun'])).toBe('dog, hat, or sun?')
  })

  it('says so honestly, with no button, when none of the words rhyme with anything', () => {
    const onComplete = vi.fn()
    render(<RhymeTime words={words('quiz', 'rhythm', 'oxygen', 'zebra')} onComplete={onComplete} />)
    expect(screen.getByText(/rhyming buddy/)).toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(onComplete).not.toHaveBeenCalled()
  })
})

// --- Word Whack ------------------------------------------------------------------

describe('Word Whack', () => {
  const list = ['rabbit', 'kitten', 'summer', 'window', 'garden']

  it('every critter looks the same until it is tapped', () => {
    const { container } = render(<WordWhack words={words(...list)} onComplete={() => {}} />)
    wait(3000)
    const moles = [...container.querySelectorAll<HTMLButtonElement>('.ww-mole')]
    expect(moles.length).toBeGreaterThan(0)
    for (const m of moles) {
      // A 🐛 face or a "bug" border told the child which to hit without reading.
      expect(m.className).not.toMatch(/\b(bug|bee)\b/)
      expect(m.querySelector('.ww-face')?.textContent).toBe('🌼')
    }
    const mole = moles[0]
    const wasBug = !list.includes(mole.querySelector('.ww-word')!.textContent!)
    fireEvent.click(mole)
    expect(container.querySelector('.ww-mole.bonk, .ww-mole.oops')?.querySelector('.ww-face')?.textContent).toBe(
      wasBug ? '🐛' : '🐝'
    )
  })

  it('never passes off a real word as a misspelling, and keeps to two critters at a time', () => {
    const { container } = render(<WordWhack words={words(...list)} onComplete={() => {}} seconds={60} />)
    const seen = new Set<string>()
    for (let t = 0; t < 200; t++) {
      wait(200)
      const up = [...container.querySelectorAll('.ww-mole')]
      expect(up.length).toBeLessThanOrEqual(2)
      up.forEach((m) => seen.add(m.querySelector('.ww-word')!.textContent!))
    }
    const fakes = [...seen].filter((t) => !list.includes(t))
    expect(fakes.length).toBeGreaterThan(0)
    for (const f of fakes) expect(isRealWord(f), `"${f}" is a real word`).toBe(false)
  })

  it('keeps counting down while the hub re-renders it, and finishes once', () => {
    const calls: number[] = []
    const { rerender } = render(<WordWhack words={words(...list)} seconds={3} onComplete={(s) => calls.push(s)} />)
    // The hub hands over a new onComplete every render; that used to restart the tick.
    for (let i = 0; i < 12; i++) {
      wait(500)
      rerender(<WordWhack words={words(...list)} seconds={3} onComplete={(s) => calls.push(s)} />)
    }
    expect(calls).toHaveLength(1)
  })

  it('keeps long words at a readable size', () => {
    expect(wordSize('cat')).toBe('clamp(1rem, 4.2vw, 1.25rem)')
    expect(wordSize('extraordinary')).toBe('clamp(1rem, 4.2vw, 1.25rem)')
  })
})

// --- Secret Code -----------------------------------------------------------------

describe('Secret Code', () => {
  const press = (text: string) => {
    for (const ch of text) fireEvent.click(button(ch.toUpperCase()))
  }

  it('shows letters only on the keys, so the code has to be counted out', () => {
    render(<SecretCode words={[word('cat')]} rounds={1} onComplete={() => {}} />)
    const keys = screen.getByRole('group', { name: 'Letter keys' }).querySelectorAll('button')
    expect(keys).toHaveLength(26)
    for (const k of keys) expect(k.textContent).toMatch(/^[A-Z]$/)
    // The code itself: c=3, a=1, t=20.
    expect(screen.getByLabelText('The secret code').textContent).toContain('3')
  })

  it('clears only the letters that don’t match, keeping the right ones', () => {
    const onComplete = vi.fn()
    const { container } = render(<SecretCode words={[word('cat')]} rounds={1} onComplete={onComplete} />)
    press('cot')
    fireEvent.click(button(/Crack it/))
    expect(container.querySelectorAll('.sk-chip.off')).toHaveLength(1)
    wait(1200)
    expect([...container.querySelectorAll('.sk-solved')].map((s) => s.textContent)).toEqual(['C', '?', 'T'])
    press('a')
    fireEvent.click(button(/Crack it/))
    wait(1700)
    // Cracked on the second go: no first-try bonus.
    expect(onComplete).toHaveBeenCalledWith(25)
  })

  it('tells the secret word after three tries and moves on', () => {
    const onComplete = vi.fn()
    render(<SecretCode words={[word('cat')]} rounds={1} onComplete={onComplete} />)
    for (let t = 0; t < 3; t++) {
      // None of x, y, z is in "cat", so every chip clears between goes.
      press('xyz')
      fireEvent.click(button(/Crack it/))
      if (t < 2) wait(1200)
    }
    expect(screen.getByText(/The secret word was “cat”/)).toBeInTheDocument()
    expect(h.speak).toHaveBeenLastCalledWith(expect.stringContaining('c, a, t'))
    wait(2800)
    expect(onComplete).toHaveBeenCalledTimes(1)
    expect(onComplete).toHaveBeenCalledWith(0)
  })
})

// --- Ghost Word ------------------------------------------------------------------

describe('Ghost Word', () => {
  it('allows one peek per word, scaled to the word, and focuses the box itself', () => {
    const onComplete = vi.fn()
    render(<GhostWord words={[word('cat')]} rounds={1} onComplete={onComplete} />)
    expect(lookTime('cat')).toBe(2100)
    const box = screen.getByPlaceholderText('...')
    wait(2100)
    expect(document.activeElement).toBe(box)

    fireEvent.click(button('Peek at the word once'))
    expect(screen.getByText('Remember it…')).toBeInTheDocument()
    wait(2100)
    expect(button('Peek used for this word')).toBeDisabled()

    type('Type it here...', 'cat')
    fireEvent.click(button('Catch it!'))
    wait(1500)
    expect(onComplete).toHaveBeenCalledTimes(1)
    expect(onComplete).toHaveBeenCalledWith(15)
  })
})

// --- Dragon Duel -----------------------------------------------------------------

describe('Dragon Duel', () => {
  it('ends tamed and sleepy, not lost, when the hearts run out — and records each word once', () => {
    const onComplete = vi.fn()
    render(<DragonDuel words={words('cat', 'dog', 'sun', 'pig')} onComplete={onComplete} />)
    for (let miss = 0; miss < 5; miss++) {
      type('Spell it to attack!', 'zzz')
      fireEvent.click(button(/Attack/))
      wait(miss < 4 ? 2600 : 2400)
    }
    expect(screen.getByText(/dragon sleepy/)).toBeInTheDocument()
    expect(screen.getByText(/You tamed it/)).toBeInTheDocument()
    expect(screen.queryByText(/Try again/)).not.toBeInTheDocument()
    // Four words, five turns: the word that came round again isn't a clean recall.
    expect(h.record).toHaveBeenCalledTimes(4)
    expect(onComplete).not.toHaveBeenCalled()
    wait(2600)
    expect(onComplete).toHaveBeenCalledTimes(1)
    expect(onComplete).toHaveBeenCalledWith(20)
  })
})

// --- Word Sort -------------------------------------------------------------------

describe('Word Sort', () => {
  it('always picks a rule with at least two words in each basket', () => {
    const piles = [
      ['cat', 'dog', 'sun', 'pig'], // no classic rule splits these
      ['apple', 'egg', 'ant', 'owl', 'ice'],
      ['balloon', 'kitten', 'summer', 'rabbit', 'tree', 'moon', 'cake', 'kite'],
    ]
    for (const pile of piles) {
      for (let i = 0; i < 30; i++) {
        const { rule, queue } = planSort(pile, 10)
        const yes = queue.filter((w) => rule.test(w))
        expect(yes.length).toBeGreaterThanOrEqual(2)
        expect(queue.length - yes.length).toBeGreaterThanOrEqual(2)
      }
    }
  })

  it('reads the rule out, then the first word', () => {
    render(<WordSort words={words('cat', 'dog', 'sun', 'pig')} onComplete={() => {}} />)
    expect(h.speak.mock.calls[0][0]).toMatch(/\?$/)
    expect(h.speak.mock.calls[1][1]).toEqual({ queue: true })
  })
})

// --- Parrot Party ----------------------------------------------------------------

describe('Parrot Party', () => {
  it(`stops lighting the tiles from round ${DARK_FROM}, so the words have to be heard`, () => {
    const { container } = render(<ParrotParty words={words('cat', 'dog', 'sun', 'pig')} onComplete={() => {}} />)
    const playRound = (n: number) => {
      let lit = false
      for (let t = 0; t < 90; t++) {
        wait(100)
        if (container.querySelector('.pp-tile.lit')) lit = true
      }
      const said = h.speak.mock.calls.filter((c) => c[1]?.queue).map((c) => String(c[0]))
      expect(said).toHaveLength(n)
      h.speak.mockClear()
      for (const w of said) fireEvent.click(button(w))
      wait(300)
      return lit
    }
    for (let n = 1; n < DARK_FROM; n++) expect(playRound(n)).toBe(true)
    expect(playRound(DARK_FROM)).toBe(false)
  })
})

// --- Word Machine ----------------------------------------------------------------

describe('Word Machine', () => {
  it('says the rule in words a voice can read', () => {
    expect(spokenLesson('The f turns into a v, then add es: leaf → leaves.')).toBe(
      'The f turns into a v, then add es: leaf becomes leaves.'
    )
  })

  it('has a friendly empty state with no button to farm stars from', () => {
    const onComplete = vi.fn()
    render(<WordMachine words={words('run', 'jump', 'swim', 'hop').map((w) => ({ ...w, meaning: 'to move fast' }))} onComplete={onComplete} />)
    expect(screen.getByText(/needs words it knows how to change/)).toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(onComplete).not.toHaveBeenCalled()
  })
})

describe('rhymes a child can trust, and corrections a child can hear', () => {
  it('only pairs words that really rhyme out loud', () => {
    expect(trueRhyme('cat', 'hat')).toBe(true)
    expect(trueRhyme('sun', 'run')).toBe(true)
    // Spelling says yes, ears say no.
    expect(trueRhyme('prone', 'one')).toBe(false)
    expect(trueRhyme('favorite', 'kite')).toBe(false)
    expect(trueRhyme('cave', 'have')).toBe(false)
    expect(trueRhyme('down', 'grown')).toBe(false)
    expect(RHYME_FAMILIES.flat()).not.toContain('one')
  })

  it('asks Spell Tower and Dragon Duel words with a sentence, so "tail" is never "tale"', () => {
    render(<SpellTower words={words('tail', 'boat', 'cake', 'fish')} onComplete={() => {}} />)
    const asked = h.speak.mock.calls.map((c) => String(c[0])).find((t) => / appeared\. /.test(t))
    expect(asked).toMatch(/^(\w+)\. A \1 appeared\. \1\.$/)
    h.speak.mockClear()
    render(<DragonDuel words={words('tail', 'boat', 'cake', 'fish')} onComplete={() => {}} />)
    expect(h.speak.mock.calls.some((c) => / appeared\. /.test(String(c[0])))).toBe(true)
  })

  it('lets the last word’s spoken correction finish before the next word', () => {
    render(<GhostWord words={words('cat', 'dog', 'sun', 'hat')} onComplete={() => {}} />)
    const first = h.speak.mock.calls.find((c) => ['cat', 'dog', 'sun', 'hat'].includes(String(c[0])))
    expect(first?.[1]).toEqual({ queue: true })
  })
})

// These timing regressions cover challenge mode; relaxed mode has its own tests.
beforeEach(() => setPreferences({ relaxed: false, waitForMe: false }))
