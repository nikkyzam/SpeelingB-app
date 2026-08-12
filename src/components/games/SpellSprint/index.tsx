import React, { useState, useEffect, useRef } from 'react'
import { wordBank } from '../../../services/wordBank'
import './SpellSprint.css'

interface SpellSprintProps {
  onComplete: (score: number) => void
  duration?: number
  words?: any[]
}

const SpellSprint: React.FC<SpellSprintProps> = ({ onComplete, duration = 60, words: providedWords }) => {
  const [timeLeft, setTimeLeft] = useState(duration)
  const [score, setScore] = useState(0)
  const [wordsCompleted, setWordsCompleted] = useState(0)
  const [currentWord, setCurrentWord] = useState('')
  const [userInput, setUserInput] = useState('')
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [combo, setCombo] = useState(0)
  const [isActive, setIsActive] = useState(true)
  const [targetPosition, setTargetPosition] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

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
        setTargetPosition(prev => (prev + 1) % 100)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false)
      onComplete(score)
    }
  }, [timeLeft, isActive])

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [currentWord])

  const newWord = () => {
    const wordObj = getRandomWord()
    setCurrentWord(wordObj.word.toLowerCase())
    setUserInput('')
    setIsCorrect(null)
  }

  const handleSubmit = () => {
    if (!userInput.trim()) return

    const correct = userInput.toLowerCase() === currentWord.toLowerCase()
    setIsCorrect(correct)

    if (correct) {
      const points = 10 + (combo * 3)
      setScore(prev => prev + points)
      setCombo(prev => prev + 1)
      setWordsCompleted(prev => prev + 1)

      setTimeout(() => {
        newWord()
      }, 300)
    } else {
      setCombo(0)
      setTimeout(() => {
        setIsCorrect(null)
        setUserInput('')
      }, 1000)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }

  const calculateWPM = () => {
    const minutes = (duration - timeLeft) / 60
    return minutes > 0 ? Math.round(wordsCompleted / minutes) : 0
  }

  const getProgressColor = () => {
    const ratio = timeLeft / duration
    if (ratio > 0.7) return '#06D6A0'
    if (ratio > 0.4) return '#FFD166'
    return '#FF6B6B'
  }

  return (
    <div className="spell-sprint">
      <div className="game-header">
        <div className="game-title">⚡ Spell Sprint</div>
        <div className="game-stats">
          <div className="stat">
            <span className="stat-label">Time</span>
            <span className="stat-value time-left" style={{ color: getProgressColor() }}>
              {timeLeft}s
            </span>
          </div>
          <div className="stat">
            <span className="stat-label">Score</span>
            <span className="stat-value">{score}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Words</span>
            <span className="stat-value">{wordsCompleted}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Combo</span>
            <span className="stat-value combo">🔥 {combo}</span>
          </div>
          <div className="stat">
            <span className="stat-label">WPM</span>
            <span className="stat-value">{calculateWPM()}</span>
          </div>
        </div>
      </div>

      <div className="game-instructions">
        <p>Spell as many words as you can in {duration} seconds!</p>
        <p className="hint">Type fast and keep your combo going for bonus points!</p>
      </div>

      <div className="sprint-track">
        <div className="track">
          <div className="track-line" />
          <div
            className="runner"
            style={{ left: `${targetPosition}%` }}
          >
            <div className="runner-icon">🏃‍♂️</div>
          </div>
          <div className="finish-line" />
        </div>

        <div className="speed-indicator">
          <div className="speed-label">Speed</div>
          <div className="speed-meter">
            <div
              className="speed-fill"
              style={{
                width: `${(wordsCompleted / 30) * 100}%`,
                backgroundColor: combo > 5 ? '#FF6B6B' : '#4ECDC4'
              }}
            />
          </div>
          <div className="speed-text">
            {combo > 5 ? 'Super Speed!' : 'Keep Going!'}
          </div>
        </div>
      </div>

      <div className="word-display">
        <div className="current-word">
          <span className="word-text">{currentWord}</span>
          <div className="word-hint">
            {wordBank.getWordByWord(currentWord)?.meaning.split('.')[0]}
          </div>
        </div>

        <div className="input-section">
          <input
            ref={inputRef}
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className={`sprint-input ${isCorrect === true ? 'correct' : isCorrect === false ? 'incorrect' : ''}`}
            placeholder="Type the word here..."
            disabled={!isActive}
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck="false"
          />

          <button
            className="submit-button"
            onClick={handleSubmit}
            disabled={!userInput.trim() || !isActive}
          >
            Submit ⚡
          </button>
        </div>

        {isCorrect === true && (
          <div className="feedback correct-feedback">
            ✅ +{10 + (combo * 3)} points! Next word...
          </div>
        )}

        {isCorrect === false && (
          <div className="feedback incorrect-feedback">
            ❌ Wrong! Try again: {currentWord}
          </div>
        )}
      </div>

      <div className="combo-display">
        {combo > 0 && (
          <div className={`combo-meter combo-${Math.min(combo, 10)}`}>
            <div className="combo-header">
              <span className="combo-icon">🔥</span>
              <span className="combo-count">{combo} COMBO</span>
              <span className="combo-bonus">+{combo * 3} per word</span>
            </div>
            <div className="combo-bar">
              <div
                className="combo-fill"
                style={{ width: `${Math.min(combo * 10, 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="game-footer">
        <div className="time-progress">
          <div className="time-label">
            Time Remaining: <span className="time-value">{timeLeft}s</span>
          </div>
          <div className="time-bar">
            <div
              className="time-fill"
              style={{
                width: `${(timeLeft / duration) * 100}%`,
                backgroundColor: getProgressColor()
              }}
            />
          </div>
        </div>

        <div className="game-tips">
          <div className="tip">
            <span className="tip-icon">💡</span>
            <span className="tip-text">Keep combos above 5 for maximum points!</span>
          </div>
          <div className="tip">
            <span className="tip-icon">⚡</span>
            <span className="tip-text">Aim for 20+ words per minute!</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SpellSprint
