import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProgress } from '../../contexts/ProgressContext'
import { useRewardStore } from '../../stores/rewards/useRewardStore'
import { wordBank } from '../../services/wordBank'
import Celebration, { CelebrationData } from '../../components/common/Celebration'
import sfx from '../../components/games/shared/sfx'
import Button from '../../components/common/Button'
import './WordHunt.css'

const STATE_KEY = 'word_hunt_state'

interface HuntTask {
  id: string
  letter: string
  /** an example drawn from the child's own words */
  example: string
  clue: string
}

interface HuntState {
  date: string
  /** the letters chosen for today — saved, or a reload would re-roll them and
   *  orphan every tick already made */
  letters: string[]
  done: string[]
  claimed: boolean
}

const CLUES = [
  'Find something you can touch that starts with “{L}”!',
  'Hunt for an object in your home beginning with “{L}”!',
  'Spy with your little eye: something that starts with “{L}”!',
  'Search your room for a thing that starts with “{L}”!',
  'Ask a grown-up to help you find something starting with “{L}”!',
]

const todayKey = () => new Date().toDateString()

const readState = (): HuntState => {
  try {
    const raw = localStorage.getItem(STATE_KEY)
    const saved = raw ? JSON.parse(raw) : null
    if (saved && saved.date === todayKey() && Array.isArray(saved.done)) {
      return { ...saved, letters: Array.isArray(saved.letters) ? saved.letters : [] }
    }
  } catch { /* fresh day, fresh hunt */ }
  return { date: todayKey(), letters: [], done: [], claimed: false }
}

const writeState = (state: HuntState) => {
  try { localStorage.setItem(STATE_KEY, JSON.stringify(state)) } catch { /* the hunt goes on */ }
}

/**
 * Word Hunt — the bit of the app that happens away from the screen.
 *
 * Three letters a day, drawn from words the child has actually met, turned
 * into a scavenger hunt around the house. Letters are checked off by hand
 * (honour system, like every good scavenger hunt) and a full hunt earns stars.
 */
const WordHunt: React.FC = () => {
  const navigate = useNavigate()
  const { learningFlow } = useProgress()
  const { addStars } = useRewardStore()
  const [state, setState] = useState<HuntState>(readState)
  const [celebration, setCelebration] = useState<CelebrationData | null>(null)

  const tasks = useMemo<HuntTask[]>(() => {
    // Only words the child has met — the clue says "like the word X that you
    // already know", so a bank word would make that a lie.
    const source = wordBank.getLearnedWords(learningFlow.getWordsLearnedTotal())

    // Today's letters are chosen once and saved. Re-rolling them on every visit
    // would leave the ticks already made pointing at letters that are no longer
    // on the page, and the hunt could never be completed.
    const byLetter = new Map<string, string>()
    const exampleFor = (letter: string) =>
      source.find((w) => w.word[0]?.toUpperCase() === letter)?.word || letter.toLowerCase()

    if (state.letters.length > 0) {
      for (const letter of state.letters) byLetter.set(letter, exampleFor(letter))
    } else {
      for (const w of [...source].sort(() => Math.random() - 0.5)) {
        const letter = w.word[0]?.toUpperCase()
        if (letter && /[A-Z]/.test(letter) && !byLetter.has(letter)) {
          byLetter.set(letter, w.word)
        }
        if (byLetter.size >= 3) break
      }
    }
    return [...byLetter.entries()].map(([letter, example], i) => ({
      id: `hunt-${letter}`,
      letter,
      example,
      clue: CLUES[i % CLUES.length].replace('{L}', letter),
    }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [learningFlow, state.letters])

  // Save the letters the first time they are drawn, so tomorrow's reload keeps
  // today's hunt intact.
  useEffect(() => {
    if (state.letters.length === 0 && tasks.length > 0) {
      const next = { ...state, letters: tasks.map((t) => t.letter) }
      setState(next)
      writeState(next)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tasks])

  const toggle = (task: HuntTask) => {
    const done = state.done.includes(task.id)
      ? state.done.filter((id) => id !== task.id)
      : [...state.done, task.id]
    const next = { ...state, done }
    setState(next)
    writeState(next)

    if (!state.done.includes(task.id)) {
      sfx.pop()
      // A finished hunt is a celebration — once per day.
      const doneOnScreen = tasks.filter((t) => done.includes(t.id)).length
      if (tasks.length > 0 && doneOnScreen === tasks.length && !state.claimed) {
        const claimed = { ...next, claimed: true }
        setState(claimed)
        writeState(claimed)
        addStars(15)
        sfx.fanfare()
        window.dispatchEvent(new Event('show-confetti'))
        setCelebration({
          title: '🔍 Hunt complete!',
          message: 'You found them all — letters are hiding everywhere, aren\u2019t they?',
          stars: 15,
        })
      }
    }
  }

  // Count only ticks that belong to a task on screen.
  const doneCount = tasks.filter((t) => state.done.includes(t.id)).length

  if (tasks.length === 0) {
    return (
      <div className="hunt-page">
        <div className="hunt-header">
          <Button variant="secondary" size="small" onClick={() => navigate('/')}>← Home</Button>
          <h1>🔍 Word Hunt</h1>
        </div>
        <p className="hunt-intro">
          The hunt uses letters from words you already know — go and meet a few,
          then come back and we&apos;ll send you exploring! 🕵️
        </p>
        <Button variant="primary" icon="📖" onClick={() => navigate('/learn')}>
          Learn some words
        </Button>
      </div>
    )
  }

  return (
    <div className="hunt-page">
      <div className="hunt-header">
        <Button variant="secondary" size="small" onClick={() => navigate('/')}>← Home</Button>
        <h1>🔍 Word Hunt</h1>
        <span className="hunt-count">{doneCount}/{tasks.length}</span>
      </div>

      <p className="hunt-intro">
        Time to hunt letters in the real world! Find each thing, come back, and tap the magnifying glass. 🕵️
      </p>

      <div className="hunt-track">
        <div className="hunt-track-fill" style={{ width: `${tasks.length ? (doneCount / tasks.length) * 100 : 0}%` }} />
      </div>

      <div className="hunt-tasks">
        {tasks.map((task) => {
          const done = state.done.includes(task.id)
          return (
            <button
              key={task.id}
              className={`hunt-task ${done ? 'done' : ''}`}
              onClick={() => toggle(task)}
            >
              <span className="hunt-letter" aria-hidden>{task.letter}</span>
              <span className="hunt-clue">
                {task.clue}
                <small>…like the word “{task.example}” that you already know!</small>
              </span>
              <span className="hunt-check" aria-hidden>{done ? '✅' : '🔍'}</span>
            </button>
          )
        })}
      </div>

      {state.claimed && (
        <p className="hunt-again">🌟 Today's hunt is complete — new letters tomorrow!</p>
      )}

      <Celebration data={celebration} onClose={() => setCelebration(null)} />
    </div>
  )
}

export default WordHunt
