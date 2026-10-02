import React, { useState, useEffect, useRef } from 'react'
import { misspell } from '../shared/wordTricks'
import './WordRace.css'

/** The combo bonus stops growing here, so a long race stays on the hub's usual score scale. */
const MAX_COMBO_BONUS = 5

interface WordRaceProps {
  onComplete: (score: number) => void
  duration?: number
  words?: any[]
}

interface FallingWord {
  id: number
  word: string
  x: number
  y: number
  speed: number
  caught: boolean
}

const WordRace: React.FC<WordRaceProps> = ({ onComplete, duration = 60, words: providedWords }) => {
  // Tenths of a second: the ticker runs every 100ms, and counting it down in
  // whole seconds made the "60 second" race last six.
  const [timeLeft, setTimeLeft] = useState(duration * 10)
  const [score, setScore] = useState(0)
  const [fallingWords, setFallingWords] = useState<FallingWord[]>([])
  const [combo, setCombo] = useState(0)
  // No words, no clock: a clock running out pays for a game nobody played.
  const [isActive, setIsActive] = useState(() => (providedWords?.length ?? 0) > 0)
  const [targetWord, setTargetWord] = useState('')
  const gameAreaRef = useRef<HTMLDivElement>(null)
  const wordIdCounter = useRef(0)

  // Only the child's own words — the old fallback drew strangers from the
  // whole word bank.
  const getRandomWord = () =>
    providedWords && providedWords.length > 0
      ? providedWords[Math.floor(Math.random() * providedWords.length)]
      : undefined

  useEffect(() => {
    // Set initial target word
    const randomWord = getRandomWord()
    if (randomWord) setTargetWord(randomWord.word)
  }, [providedWords])

  useEffect(() => {
    // Game timer
    if (timeLeft > 0 && isActive) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1)

        // Add new word every 1-2 seconds (this runs ten times a second)
        if (Math.random() > 0.93) {
          addNewWord()
        }

        // Update falling words
        setFallingWords(prev =>
          prev.map(w => ({
            ...w,
            y: w.y + w.speed
          })).filter(w => w.y < 100 && !w.caught)
        )

        // Check for missed words
        setFallingWords(prev => {
          const missed = prev.filter(w => w.y >= 95 && !w.caught)
          if (missed.length > 0) {
            setCombo(0)
          }
          return prev.filter(w => w.y < 95)
        })

      }, 100)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false)
      onComplete(score)
    }
  }, [timeLeft, isActive])

  const addNewWord = () => {
    // The target falls often, beside look-alike misspellings of it and the
    // child's other words. Drawn only at random from a list of up to 60, the
    // target hardly ever fell, and a child waited out the clock.
    const roll = Math.random()
    const text =
      targetWord && roll < 0.35
        ? targetWord
        : targetWord && roll < 0.6
        ? misspell(targetWord.toLowerCase())
        : getRandomWord()?.word
    if (!text) return
    const newWord: FallingWord = {
      id: wordIdCounter.current++,
      word: text,
      x: Math.random() * 80 + 10,
      y: -10,
      speed: 0.5 + Math.random() * 1,
      caught: false
    }
    setFallingWords(prev => [...prev, newWord])
  }

  const handleWordClick = (word: FallingWord) => {
    if (word.caught) return

    if (word.word.toLowerCase() === targetWord.toLowerCase()) {
      // Correct word caught
      const points = 10 + 2 * Math.min(combo, MAX_COMBO_BONUS)
      setScore(prev => prev + points)
      setCombo(prev => prev + 1)

      // Mark as caught
      setFallingWords(prev =>
        prev.map(w =>
          w.id === word.id ? { ...w, caught: true } : w
        )
      )

      // Remove caught word after animation
      setTimeout(() => {
        setFallingWords(prev => prev.filter(w => w.id !== word.id))
      }, 300)

      // Set new target word
      const newTarget = getRandomWord()
      if (newTarget) setTargetWord(newTarget.word)
    } else {
      // Wrong word
      setCombo(0)
    }
  }

  const handleSkipWord = () => {
    const newTarget = getRandomWord()
    if (newTarget) setTargetWord(newTarget.word)
    setCombo(prev => Math.max(0, prev - 1))
  }

  if (!providedWords || providedWords.length === 0) {
    return (
      <div className="word-race">
        <p className="race-empty">No words to catch yet — learn a few, then come back and race! 🏃</p>
      </div>
    )
  }

  return (
    <div className="word-race">
      <div className="game-header">
        <div className="game-info">
          <div className="game-title">🏃 Word Race</div>
          <div className="target-word">
            Catch: <span className="target">{targetWord}</span>
          </div>
        </div>
        <div className="game-stats">
          <div className="stat">
            <span className="stat-label">Time</span>
            <span className="stat-value">{Math.ceil(timeLeft / 10)}s</span>
          </div>
          <div className="stat">
            <span className="stat-label">Score</span>
            <span className="stat-value">{score}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Combo</span>
            <span className="stat-value combo">🔥 {combo}</span>
          </div>
        </div>
      </div>

      <div className="game-instructions">
        <p>Catch the target word before it hits the bottom — watch out for look-alike spellings!</p>
        <p className="hint">Only tap words spelled exactly: <strong>{targetWord}</strong></p>
      </div>

      <div
        ref={gameAreaRef}
        className="game-area"
      >
        {fallingWords.map(word => (
          <button
            key={word.id}
            // Every word looks the same: colouring the target green and the rest
            // red turned a reading game into "tap the green one".
            className={`falling-word ${word.caught ? 'caught' : ''}`}
            style={{
              left: `${word.x}%`,
              top: `${word.y}%`,
              transform: `translate(-50%, -50%)`
            }}
            onClick={() => handleWordClick(word)}
            disabled={word.caught}
          >
            {word.word}
            {word.caught && <span className="caught-indicator">✅</span>}
          </button>
        ))}

        <div className="ground-line" />
      </div>

      <div className="game-controls">
        <button
          className="skip-button"
          onClick={handleSkipWord}
          disabled={!isActive}
        >
          Skip Word
        </button>

        <div className="combo-display">
          {combo > 2 && (
            <div className="combo-alert">
              <span className="combo-icon">🔥</span>
              <span className="combo-text">{combo} in a row!</span>
              <span className="combo-bonus">+{Math.min(combo, MAX_COMBO_BONUS) * 2} bonus!</span>
            </div>
          )}
        </div>
      </div>

      <div className="game-footer">
        <div className="progress-container">
          <div className="progress-label">Time Remaining</div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${(timeLeft / (duration * 10)) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default WordRace
