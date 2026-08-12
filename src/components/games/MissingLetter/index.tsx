import React, { useState, useEffect, useMemo } from 'react'
import { wordBank, Word } from '../../../services/wordBank'
import { useAudio } from '../../../contexts/AudioContext'
import './MissingLetter.css'

interface MissingLetterProps {
  onComplete: (score: number) => void
  words?: Word[]
  rounds?: number
}

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'

const shuffle = <T,>(arr: T[]): T[] => {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

interface Puzzle {
  word: string
  meaning: string
  missingIndex: number
  answer: string
  choices: string[]
}

/** Pick the letter that completes the word. Quick, satisfying, and teaches spelling. */
const MissingLetter: React.FC<MissingLetterProps> = ({ onComplete, words: providedWords, rounds = 6 }) => {
  const { speak } = useAudio()

  const puzzles = useMemo<Puzzle[]>(() => {
    const pool = providedWords && providedWords.length > 0
      ? providedWords
      : wordBank.getRandomWords(rounds * 2, 1)
    const chosen = shuffle(pool).filter(w => w.word.length >= 3).slice(0, rounds)
    return chosen.map(w => {
      const word = w.word.toLowerCase()
      const missingIndex = 1 + Math.floor(Math.random() * (word.length - 2)) // not first/last
      const answer = word[missingIndex]
      const distractors = shuffle(ALPHABET.split('').filter(l => l !== answer)).slice(0, 3)
      const choices = shuffle([answer, ...distractors])
      return { word, meaning: w.meaning, missingIndex, answer, choices }
    })
  }, [providedWords, rounds])

  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [solved, setSolved] = useState(0)
  const [picked, setPicked] = useState<string | null>(null)
  const [streak, setStreak] = useState(0)

  const puzzle = puzzles[index]

  useEffect(() => {
    if (puzzle) speak(puzzle.word)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, puzzles])

  if (!puzzle) {
    return <div className="missing-letter"><p>Loading…</p></div>
  }

  const handlePick = (letter: string) => {
    if (picked) return
    setPicked(letter)
    const correct = letter === puzzle.answer
    if (correct) {
      setScore(s => s + 15 + streak * 3)
      setSolved(s => s + 1)
      setStreak(s => s + 1)
      speak('Correct!')
    } else {
      setStreak(0)
      speak(`The letter is ${puzzle.answer}`)
    }
    setTimeout(() => {
      if (index < puzzles.length - 1) {
        setIndex(i => i + 1)
        setPicked(null)
      } else {
        onComplete(score + (correct ? 15 + streak * 3 : 0))
      }
    }, 1100)
  }

  const display = puzzle.word.split('').map((ch, i) => (i === puzzle.missingIndex ? null : ch))

  return (
    <div className="missing-letter">
      <div className="ml-header">
        <div className="ml-title">🔡 Missing Letter</div>
        <div className="ml-stats">
          <div className="ml-stat"><span>Word</span><strong>{index + 1}/{puzzles.length}</strong></div>
          <div className="ml-stat"><span>Score</span><strong>{score}</strong></div>
          <div className="ml-stat"><span>Streak</span><strong>🔥 {streak}</strong></div>
        </div>
      </div>

      <div className="ml-clue">
        <button className="ml-hear" onClick={() => speak(puzzle.word)}>🔊 Hear the word</button>
        <p className="ml-meaning">Clue: {puzzle.meaning.split('.')[0]}</p>
      </div>

      <div className="ml-word">
        {display.map((ch, i) => (
          <span
            key={i}
            className={`ml-cell ${ch === null ? 'blank' : ''} ${
              ch === null && picked ? (picked === puzzle.answer ? 'ok' : 'bad') : ''
            }`}
          >
            {ch === null ? (picked ?? '?') : ch.toUpperCase()}
          </span>
        ))}
      </div>

      <div className="ml-choices">
        {puzzle.choices.map(letter => {
          let cls = 'ml-choice'
          if (picked) {
            if (letter === puzzle.answer) cls += ' correct'
            else if (letter === picked) cls += ' wrong'
          }
          return (
            <button key={letter} className={cls} onClick={() => handlePick(letter)} disabled={!!picked}>
              {letter.toUpperCase()}
            </button>
          )
        })}
      </div>

      {picked && (
        <div className={`ml-flash ${picked === puzzle.answer ? 'ok' : 'bad'}`}>
          {picked === puzzle.answer ? 'Nice! 🎉' : `It was “${puzzle.answer.toUpperCase()}” — keep going! 💪`}
        </div>
      )}
    </div>
  )
}

export default MissingLetter
