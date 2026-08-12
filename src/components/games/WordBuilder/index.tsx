import React, { useState, useEffect, useMemo } from 'react'
import { wordBank, Word } from '../../../services/wordBank'
import { useAudio } from '../../../contexts/AudioContext'
import './WordBuilder.css'

interface WordBuilderProps {
  onComplete: (score: number) => void
  words?: Word[]
  /** how many words to build in one round */
  rounds?: number
}

interface Tile {
  id: number
  letter: string
  used: boolean
}

const shuffle = <T,>(arr: T[]): T[] => {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** Tap the scrambled letter tiles in the right order to build the spoken word. */
const WordBuilder: React.FC<WordBuilderProps> = ({ onComplete, words: providedWords, rounds = 5 }) => {
  const { speak } = useAudio()

  const roundWords = useMemo<Word[]>(() => {
    const pool = providedWords && providedWords.length > 0 ? providedWords : wordBank.getRandomWords(rounds, 1)
    return shuffle(pool).slice(0, rounds)
  }, [providedWords, rounds])

  const [index, setIndex] = useState(0)
  const [tiles, setTiles] = useState<Tile[]>([])
  const [built, setBuilt] = useState<Tile[]>([])
  const [score, setScore] = useState(0)
  const [status, setStatus] = useState<'playing' | 'correct' | 'wrong'>('playing')
  const [solved, setSolved] = useState(0)

  const current = roundWords[index]
  const target = (current?.word || '').toLowerCase()

  const setupWord = (word: string) => {
    const letters = word.split('')
    const scrambled = shuffle(letters)
    // guard: avoid already-in-order scramble for words > 1 letter
    if (word.length > 1 && scrambled.join('') === word) scrambled.reverse()
    setTiles(scrambled.map((letter, i) => ({ id: i, letter, used: false })))
    setBuilt([])
    setStatus('playing')
  }

  useEffect(() => {
    if (current) {
      setupWord(target)
      speak(current.word)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, roundWords])

  const handleTileTap = (tile: Tile) => {
    if (status !== 'playing' || tile.used) return
    const nextBuilt = [...built, tile]
    setBuilt(nextBuilt)
    setTiles(prev => prev.map(t => (t.id === tile.id ? { ...t, used: true } : t)))

    if (nextBuilt.length === target.length) {
      const attempt = nextBuilt.map(t => t.letter).join('')
      if (attempt === target) {
        const points = 20 + built.length * 2
        setScore(s => s + points)
        setSolved(s => s + 1)
        setStatus('correct')
        speak('Yes!')
        setTimeout(next, 1100)
      } else {
        setStatus('wrong')
        speak(`The word is ${current.word}`)
        setTimeout(() => {
          // reset tiles for another try
          setupWord(target)
        }, 1100)
      }
    }
  }

  const undo = () => {
    if (status !== 'playing' || built.length === 0) return
    const last = built[built.length - 1]
    setBuilt(built.slice(0, -1))
    setTiles(prev => prev.map(t => (t.id === last.id ? { ...t, used: false } : t)))
  }

  const next = () => {
    if (index < roundWords.length - 1) {
      setIndex(i => i + 1)
    } else {
      onComplete(score + (status === 'correct' ? 0 : 0))
    }
  }

  if (!current) {
    return <div className="word-builder"><p>Loading…</p></div>
  }

  const slots = Array.from({ length: target.length })

  return (
    <div className={`word-builder ${status}`}>
      <div className="wb-header">
        <div className="wb-title">🧱 Word Builder</div>
        <div className="wb-stats">
          <div className="wb-stat"><span>Word</span><strong>{index + 1}/{roundWords.length}</strong></div>
          <div className="wb-stat"><span>Score</span><strong>{score}</strong></div>
          <div className="wb-stat"><span>Solved</span><strong>⭐ {solved}</strong></div>
        </div>
      </div>

      <div className="wb-clue">
        <button className="wb-hear" onClick={() => speak(current.word)}>🔊 Hear the word</button>
        <p className="wb-meaning">Clue: {current.meaning.split('.')[0]}</p>
      </div>

      <div className="wb-slots" aria-label="word being built">
        {slots.map((_, i) => {
          const t = built[i]
          const stateClass = status === 'correct' ? 'filled ok' : status === 'wrong' ? 'filled bad' : t ? 'filled' : ''
          return (
            <div key={i} className={`wb-slot ${stateClass}`}>
              {t ? t.letter.toUpperCase() : ''}
            </div>
          )
        })}
      </div>

      <div className="wb-tiles">
        {tiles.map(tile => (
          <button
            key={tile.id}
            className={`wb-tile ${tile.used ? 'used' : ''}`}
            onClick={() => handleTileTap(tile)}
            disabled={tile.used || status !== 'playing'}
          >
            {tile.letter.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="wb-controls">
        <button className="wb-btn secondary" onClick={undo} disabled={built.length === 0 || status !== 'playing'}>
          ⬅ Undo
        </button>
        <button className="wb-btn ghost" onClick={() => { setScore(s => Math.max(0, s - 2)); setStatus('wrong'); speak(`The word is ${current.word}`); setTimeout(next, 900) }} disabled={status !== 'playing'}>
          Skip
        </button>
      </div>

      {status === 'correct' && <div className="wb-flash ok">Perfect! 🎉</div>}
      {status === 'wrong' && <div className="wb-flash bad">It was “{current.word}” — try the next one! 💪</div>}
    </div>
  )
}

export default WordBuilder
