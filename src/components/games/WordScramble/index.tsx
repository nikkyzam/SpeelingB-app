import React, { useState, useEffect } from 'react'
import { wordBank } from '../../../services/wordBank'
import './WordScramble.css'

interface WordScrambleProps {
  onComplete: (score: number) => void
  duration?: number
  words?: any[]
}

const WordScramble: React.FC<WordScrambleProps> = ({ onComplete, duration = 45, words: providedWords }) => {
  const [timeLeft, setTimeLeft] = useState(duration)
  const [score, setScore] = useState(0)
  const [currentWord, setCurrentWord] = useState('')
  const [scrambledWord, setScrambledWord] = useState('')
  const [userInput, setUserInput] = useState('')
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [wordsSolved, setWordsSolved] = useState(0)
  const [streak, setStreak] = useState(0)
  const [isActive, setIsActive] = useState(true)
  const [hintUsed, setHintUsed] = useState(false)

  const getRandomWord = () => {
    if (providedWords && providedWords.length > 0) {
      return providedWords[Math.floor(Math.random() * providedWords.length)]
    }
    return wordBank.getRandomWord()
  }

  useEffect(() => {
    newWord()
  }, [providedWords])

  useEffect(() => {
    // Timer
    if (timeLeft > 0 && isActive) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false)
      onComplete(score)
    }
  }, [timeLeft, isActive])

  const scrambleWord = (word: string): string => {
    const letters = word.split('')
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[letters[i], letters[j]] = [letters[j], letters[i]]
    }
    const scrambled = letters.join('')
    return scrambled === word ? scrambleWord(word) : scrambled
  }

  const newWord = () => {
    const wordObj = getRandomWord()
    const word = wordObj.word.toLowerCase()
    setCurrentWord(word)
    setScrambledWord(scrambleWord(word))
    setUserInput('')
    setIsCorrect(null)
    setHintUsed(false)
  }

  const handleSubmit = () => {
    if (!userInput.trim()) return

    const correct = userInput.toLowerCase() === currentWord.toLowerCase()
    setIsCorrect(correct)

    if (correct) {
      const points = 10 + (streak * 2) + (hintUsed ? 0 : 5)
      setScore(prev => prev + points)
      setStreak(prev => prev + 1)
      setWordsSolved(prev => prev + 1)

      setTimeout(() => {
        newWord()
      }, 1000)
    } else {
      setStreak(0)
    }
  }

  const handleHint = () => {
    if (hintUsed) return

    // Reveal first and last letter
    const hint = currentWord[0] + ' _ '.repeat(currentWord.length - 2) + currentWord[currentWord.length - 1]
    setUserInput(hint.replace(/_/g, '').trim())
    setHintUsed(true)
  }

  const handleSkip = () => {
    setStreak(0)
    newWord()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }

  const calculateAccuracy = () => {
    return wordsSolved > 0 ? Math.round((wordsSolved / (wordsSolved + (streak === 0 ? 1 : 0))) * 100) : 0
  }

  return (
    <div className="word-scramble">
      <div className="game-header">
        <div className="game-title">🔤 Word Scramble</div>
        <div className="game-stats">
          <div className="stat">
            <span className="stat-label">Time</span>
            <span className="stat-value">{timeLeft}s</span>
          </div>
          <div className="stat">
            <span className="stat-label">Score</span>
            <span className="stat-value">{score}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Solved</span>
            <span className="stat-value">{wordsSolved}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Streak</span>
            <span className="stat-value streak">🔥 {streak}</span>
          </div>
        </div>
      </div>

      <div className="game-instructions">
        <p>Unscramble the letters to form a word!</p>
        <p className="hint">You have {duration} seconds to solve as many as you can!</p>
      </div>

      <div className="scramble-area">
        <div className="scrambled-letters">
          {scrambledWord.split('').map((letter, index) => (
            <span key={index} className="scrambled-letter">
              {letter.toUpperCase()}
            </span>
          ))}
        </div>

        <div className="word-info">
          <div className="hint-section">
            <div className="hint-label">Hint:</div>
            <div className="hint-content">
              {wordBank.getWordByWord(currentWord)?.meaning.split('.')[0] || 'Think carefully!'}
            </div>
          </div>
        </div>

        <div className="input-section">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className={`scramble-input ${isCorrect === true ? 'correct' : isCorrect === false ? 'incorrect' : ''}`}
            placeholder="Type the unscrambled word..."
            autoFocus
            disabled={!isActive}
          />

          <div className="input-actions">
            <Button
              onClick={handleHint}
              disabled={hintUsed || !isActive}
              variant="secondary"
              size="small"
            >
              {hintUsed ? 'Hint Used' : '💡 Get Hint (-5 points)'}
            </Button>
          </div>
        </div>

        {isCorrect === true && (
          <div className="feedback correct-feedback">
            ✅ Correct! +{10 + (streak * 2) + (hintUsed ? 0 : 5)} points
          </div>
        )}

        {isCorrect === false && (
          <div className="feedback incorrect-feedback">
            ❌ Try again! The word was: {currentWord}
          </div>
        )}
      </div>

      <div className="game-controls">
        <Button
          onClick={handleSubmit}
          variant="primary"
          size="large"
          disabled={!userInput.trim() || !isActive}
        >
          Submit Answer
        </Button>

        <Button
          onClick={handleSkip}
          variant="warning"
          disabled={!isActive}
        >
          Skip Word
        </Button>
      </div>

      <div className="game-footer">
        <div className="progress-container">
          <div className="progress-info">
            <div className="progress-item">
              <span className="progress-label">Time Left</span>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${(timeLeft / duration) * 100}%` }}
                />
              </div>
            </div>
            <div className="progress-item">
              <span className="progress-label">Accuracy</span>
              <div className="progress-bar">
                <div
                  className="progress-fill accuracy"
                  style={{ width: `${calculateAccuracy()}%` }}
                />
              </div>
            </div>
          </div>

          {streak > 2 && (
            <div className="streak-alert">
              <span className="streak-icon">🔥</span>
              <span className="streak-text">{streak} in a row! Keep going!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Button component for the game
const Button: React.FC<any> = ({ children, onClick, variant = 'primary', size = 'medium', disabled = false, ...props }) => {
  return (
    <button
      className={`game-btn btn-${variant} btn-${size}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

export default WordScramble
