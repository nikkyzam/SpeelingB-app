import React, { useMemo, useState, useEffect, useCallback } from 'react'
import { wordBank, Word } from '../../../services/wordBank'
import { useAudio } from '../../../contexts/AudioContext'
import './BeeCatch.css'

interface BeeCatchProps {
  onComplete: (score: number) => void
  words?: Word[]
  duration?: number
}

const ALPHA = 'abcdefghijklmnopqrstuvwxyz'
const BEES = 7

const shuffle = <T,>(a: T[]): T[] => {
  const arr = [...a]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

interface Bee {
  id: number
  ch: string
  top: number
  left: number
  delay: number
}

let beeId = 0
const rand = (min: number, max: number) => min + Math.random() * (max - min)

/** Spell the word by tapping the buzzing letters in order before time runs out. */
const BeeCatch: React.FC<BeeCatchProps> = ({ onComplete, words: providedWords, duration = 60 }) => {
  const { speak } = useAudio()

  const pool = useMemo<Word[]>(() => {
    const list = providedWords && providedWords.length > 0 ? providedWords : wordBank.getRandomWords(40, 1)
    return shuffle(list).filter((w) => /^[a-z]+$/i.test(w.word) && w.word.length >= 3)
  }, [providedWords])

  const [wordIndex, setWordIndex] = useState(0)
  const [built, setBuilt] = useState(0)
  const [bees, setBees] = useState<Bee[]>([])
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [wordsDone, setWordsDone] = useState(0)
  const [timeLeft, setTimeLeft] = useState(duration)
  const [wrongId, setWrongId] = useState<number | null>(null)

  const word = (pool[wordIndex]?.word || '').toLowerCase()
  const nextChar = word[built]

  const spawn = useCallback((needed: string) => {
    const chars = new Set<string>([needed])
    while (chars.size < BEES) chars.add(ALPHA[Math.floor(Math.random() * 26)])
    setBees(
      shuffle([...chars]).map((ch) => ({
        id: beeId++,
        ch,
        top: rand(6, 74),
        left: rand(5, 82),
        delay: rand(0, 1.2),
      }))
    )
  }, [])

  // Start / advance to a word
  useEffect(() => {
    if (word) {
      speak(pool[wordIndex].word)
      spawn(word[0])
      setBuilt(0)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wordIndex, pool])

  // Countdown
  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete(score)
      return
    }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft])

  if (!word) {
    return <div className="bee-catch"><p>Loading…</p></div>
  }

  const tapBee = (bee: Bee) => {
    if (timeLeft <= 0) return
    if (bee.ch === nextChar) {
      const nextBuilt = built + 1
      setScore((s) => s + 5 + streak)
      setStreak((s) => s + 1)
      if (nextBuilt >= word.length) {
        // word complete!
        setScore((s) => s + 10)
        setWordsDone((w) => w + 1)
        setWordIndex((i) => (i + 1) % pool.length)
      } else {
        setBuilt(nextBuilt)
        spawn(word[nextBuilt])
      }
    } else {
      // wrong letter — small time penalty
      setStreak(0)
      setWrongId(bee.id)
      setTimeout(() => setWrongId((id) => (id === bee.id ? null : id)), 300)
      setTimeLeft((s) => Math.max(0, s - 2))
    }
  }

  return (
    <div className="bee-catch">
      <div className="bc-header">
        <div className="bc-title">🐝 Bee Catch</div>
        <div className="bc-stats">
          <div className="bc-stat"><span>Time</span><strong className={timeLeft <= 10 ? 'low' : ''}>{timeLeft}s</strong></div>
          <div className="bc-stat"><span>Score</span><strong>{score}</strong></div>
          <div className="bc-stat"><span>Words</span><strong>⭐ {wordsDone}</strong></div>
          <div className="bc-stat"><span>Streak</span><strong>🔥 {streak}</strong></div>
        </div>
      </div>

      <div className="bc-word">
        {word.split('').map((ch, i) => (
          <span key={i} className={`bc-slot ${i < built ? 'done' : i === built ? 'next' : ''}`}>
            {i < built ? ch.toUpperCase() : i === built ? ch.toUpperCase() : '_'}
          </span>
        ))}
        <button className="bc-hear" onClick={() => speak(pool[wordIndex].word)} aria-label="Hear the word">🔊</button>
      </div>
      <p className="bc-hint">Tap the letters in order! Next: <strong>{nextChar?.toUpperCase()}</strong></p>

      <div className="bc-field">
        {bees.map((bee) => (
          <button
            key={bee.id}
            className={`bc-bee ${wrongId === bee.id ? 'wrong' : ''}`}
            style={{ top: `${bee.top}%`, left: `${bee.left}%`, animationDelay: `${bee.delay}s` }}
            onClick={() => tapBee(bee)}
          >
            <span className="bc-bee-emoji" aria-hidden>🐝</span>
            <span className="bc-bee-letter">{bee.ch.toUpperCase()}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default BeeCatch
