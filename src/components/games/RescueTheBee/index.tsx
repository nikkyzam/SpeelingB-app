import React, { useMemo, useState, useEffect } from 'react'
import { wordBank, Word } from '../../../services/wordBank'
import { useAudio } from '../../../contexts/AudioContext'
import './RescueTheBee.css'

interface RescueTheBeeProps {
  onComplete: (score: number) => void
  words?: Word[]
  rounds?: number
}

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.split('')
const MAX_LIVES = 6

const shuffle = <T,>(a: T[]): T[] => {
  const arr = [...a]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

/** Guess letters to spell the word and rescue the mascot before the hearts run out. */
const RescueTheBee: React.FC<RescueTheBeeProps> = ({ onComplete, words: providedWords, rounds = 5 }) => {
  const { speak } = useAudio()

  const roundWords = useMemo<Word[]>(() => {
    const pool = providedWords && providedWords.length > 0 ? providedWords : wordBank.getRandomWords(rounds * 2, 1)
    return shuffle(pool).filter((w) => w.word.length >= 3 && /^[a-z]+$/i.test(w.word)).slice(0, rounds)
  }, [providedWords, rounds])

  const [index, setIndex] = useState(0)
  const [guessed, setGuessed] = useState<Set<string>>(new Set())
  const [lives, setLives] = useState(MAX_LIVES)
  const [score, setScore] = useState(0)
  const [solved, setSolved] = useState(0)
  const [status, setStatus] = useState<'playing' | 'won' | 'lost'>('playing')

  const current = roundWords[index]
  const word = (current?.word || '').toLowerCase()
  const letters = useMemo(() => Array.from(new Set(word.split(''))), [word])

  useEffect(() => {
    setGuessed(new Set())
    setLives(MAX_LIVES)
    setStatus('playing')
    if (current) speak(current.word)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, roundWords])

  if (!current) return <div className="rescue-bee"><p>Loading…</p></div>

  const isRevealed = (ch: string) => guessed.has(ch)
  const allRevealed = letters.every((l) => guessed.has(l))

  const next = (didWin: boolean) => {
    const gained = didWin ? 10 + lives * 3 : 0
    if (index < roundWords.length - 1) {
      setIndex((i) => i + 1)
    } else {
      onComplete(score + gained)
    }
  }

  const guess = (ch: string) => {
    if (status !== 'playing' || guessed.has(ch)) return
    const nextGuessed = new Set(guessed)
    nextGuessed.add(ch)
    setGuessed(nextGuessed)

    if (word.includes(ch)) {
      const won = letters.every((l) => nextGuessed.has(l))
      if (won) {
        const gained = 10 + lives * 3
        setScore((s) => s + gained)
        setSolved((s) => s + 1)
        setStatus('won')
        speak('You rescued the bee!')
        setTimeout(() => next(true), 1300)
      }
    } else {
      const nextLives = lives - 1
      setLives(nextLives)
      if (nextLives <= 0) {
        setStatus('lost')
        speak(`The word was ${word}`)
        setTimeout(() => next(false), 1500)
      }
    }
  }

  return (
    <div className="rescue-bee">
      <div className="rb-header">
        <div className="rb-title">🐝 Rescue the Bee</div>
        <div className="rb-stats">
          <div className="rb-stat"><span>Word</span><strong>{index + 1}/{roundWords.length}</strong></div>
          <div className="rb-stat"><span>Score</span><strong>{score}</strong></div>
          <div className="rb-stat"><span>Saved</span><strong>⭐ {solved}</strong></div>
        </div>
      </div>

      <div className="rb-lives" aria-label={`${lives} lives left`}>
        {Array.from({ length: MAX_LIVES }).map((_, i) => (
          <span key={i} className={`rb-heart ${i < lives ? '' : 'lost'}`}>{i < lives ? '❤️' : '🤍'}</span>
        ))}
      </div>

      <div className="rb-clue">
        <button className="rb-hear" onClick={() => speak(current.word)}>🔊 Hear the word</button>
        <p className="rb-meaning">Clue: {current.meaning.split('.')[0]}</p>
      </div>

      <div className="rb-word">
        {word.split('').map((ch, i) => (
          <span key={i} className={`rb-slot ${isRevealed(ch) || status !== 'playing' ? 'shown' : ''}`}>
            {isRevealed(ch) || status !== 'playing' ? ch.toUpperCase() : ''}
          </span>
        ))}
      </div>

      <div className="rb-keys">
        {ALPHABET.map((ch) => {
          const used = guessed.has(ch)
          const hit = used && word.includes(ch)
          return (
            <button
              key={ch}
              className={`rb-key ${used ? (hit ? 'hit' : 'miss') : ''}`}
              onClick={() => guess(ch)}
              disabled={used || status !== 'playing'}
            >
              {ch.toUpperCase()}
            </button>
          )
        })}
      </div>

      {status === 'won' && <div className="rb-flash ok">🎉 You rescued the bee!</div>}
      {status === 'lost' && <div className="rb-flash bad">Oh no! The word was &ldquo;{word}&rdquo; — next one! 💪</div>}
      {status === 'playing' && allRevealed && null}
    </div>
  )
}

export default RescueTheBee
