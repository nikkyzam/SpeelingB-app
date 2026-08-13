import React, { useMemo, useState } from 'react'
import { wordBank, Word } from '../../../services/wordBank'
import { useAudio } from '../../../contexts/AudioContext'
import './AbcOrder.css'

interface AbcOrderProps {
  onComplete: (score: number) => void
  words?: Word[]
  rounds?: number
  perRound?: number
}

const shuffle = <T,>(a: T[]): T[] => {
  const arr = [...a]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

/** Tap the words in A-B-C order. Teaches alphabetising and letter order. */
const AbcOrder: React.FC<AbcOrderProps> = ({ onComplete, words: providedWords, rounds = 4, perRound = 5 }) => {
  const { speak } = useAudio()

  const roundSets = useMemo<string[][]>(() => {
    const pool = providedWords && providedWords.length > 0 ? providedWords : wordBank.getRandomWords(60)
    const clean = Array.from(
      new Set(pool.map((w) => w.word.toLowerCase()).filter((w) => /^[a-z]+$/.test(w)))
    )
    const sets: string[][] = []
    const bag = shuffle(clean)
    for (let r = 0; r < rounds; r++) {
      const slice = bag.slice(r * perRound, r * perRound + perRound)
      if (slice.length === perRound) sets.push(slice)
    }
    return sets.length ? sets : [shuffle(clean).slice(0, perRound)]
  }, [providedWords, rounds, perRound])

  const [round, setRound] = useState(0)
  const [picked, setPicked] = useState<string[]>([])
  const [score, setScore] = useState(0)
  const [wrong, setWrong] = useState<string | null>(null)
  const [roundDone, setRoundDone] = useState(false)

  const words = roundSets[round] || []
  const sorted = useMemo(() => [...words].sort(), [words])
  const nextWord = sorted[picked.length]

  const tap = (w: string) => {
    if (roundDone || picked.includes(w)) return
    if (w === nextWord) {
      const nextPicked = [...picked, w]
      setPicked(nextPicked)
      setScore((s) => s + 10)
      speak(w)
      if (nextPicked.length === words.length) {
        setScore((s) => s + 20) // round bonus
        setRoundDone(true)
        setTimeout(() => {
          if (round < roundSets.length - 1) {
            setRound((r) => r + 1)
            setPicked([])
            setRoundDone(false)
          } else {
            onComplete(score + 10 + 20)
          }
        }, 1200)
      }
    } else {
      setWrong(w)
      setScore((s) => Math.max(0, s - 2))
      setTimeout(() => setWrong((x) => (x === w ? null : x)), 400)
    }
  }

  if (!words.length) return <div className="abc-order"><p>Loading…</p></div>

  return (
    <div className="abc-order">
      <div className="ao-header">
        <div className="ao-title">🔤 ABC Order</div>
        <div className="ao-stats">
          <div className="ao-stat"><span>Round</span><strong>{round + 1}/{roundSets.length}</strong></div>
          <div className="ao-stat"><span>Score</span><strong>{score}</strong></div>
        </div>
      </div>

      <p className="ao-hint">
        Tap the words in <strong>A B C</strong> order! Next letter:{' '}
        <strong className="ao-next">{nextWord ? nextWord[0].toUpperCase() : '🎉'}</strong>
      </p>

      <div className="ao-slots">
        {sorted.map((_, i) => (
          <span key={i} className={`ao-slot ${picked[i] ? 'filled' : ''}`}>
            {picked[i] ? picked[i] : i + 1}
          </span>
        ))}
      </div>

      <div className="ao-words">
        {words.map((w) => {
          const done = picked.includes(w)
          return (
            <button
              key={w}
              className={`ao-word ${done ? 'done' : ''} ${wrong === w ? 'wrong' : ''}`}
              onClick={() => tap(w)}
              disabled={done || roundDone}
            >
              {w}
            </button>
          )
        })}
      </div>

      {roundDone && <div className="ao-flash">🎉 Perfect order! +20 bonus</div>}
    </div>
  )
}

export default AbcOrder
