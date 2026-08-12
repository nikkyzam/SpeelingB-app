import React, { useState, useEffect, useCallback } from 'react'
import { wordBank } from '../../../services/wordBank'
import './SpellingAdventure.css'

interface Level {
  id: number
  name: string
  difficulty: 'easy' | 'medium' | 'hard'
  targetWords: number
  timeLimit: number
  pointsMultiplier: number
}

interface WordChallenge {
  word: string
  meaning: string
  scrambledWord: string
  missingLetters: string
  challengeType: 'spelling' | 'missing-letters' | 'definition'
}

interface SpellingAdventureProps {
  onComplete: (score: number) => void
  words?: any[]
}

const SpellingAdventure: React.FC<SpellingAdventureProps> = ({ onComplete, words: providedWords }) => {
  const [currentLevel, setCurrentLevel] = useState(1)
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [timeLeft, setTimeLeft] = useState(180)
  const [wordsCompleted, setWordsCompleted] = useState(0)
  const [currentChallenge, setCurrentChallenge] = useState<WordChallenge | null>(null)
  const [userInput, setUserInput] = useState('')
  const [feedback, setFeedback] = useState<string | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [streak, setStreak] = useState(0)
  const [isActive, setIsActive] = useState(true)

  const levels: Level[] = [
    { id: 1, name: 'Forest Path', difficulty: 'easy', targetWords: 5, timeLimit: 180, pointsMultiplier: 1 },
    { id: 2, name: 'Mountain Pass', difficulty: 'medium', targetWords: 8, timeLimit: 240, pointsMultiplier: 1.5 },
    { id: 3, name: 'Dragon Cave', difficulty: 'hard', targetWords: 12, timeLimit: 300, pointsMultiplier: 2 },
  ]

  const currentLevelData = levels[currentLevel - 1]

  useEffect(() => {
    newChallenge()

    if (timeLeft > 0 && isActive) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && isActive) {
      handleLevelComplete()
    }
  }, [timeLeft, isActive])

  useEffect(() => {
    if (wordsCompleted >= currentLevelData.targetWords && isActive) {
      handleLevelComplete()
    }
  }, [wordsCompleted, currentLevelData.targetWords, isActive])

  const generateChallenge = useCallback((): WordChallenge => {
    const wordObj = wordBank.getRandomWord()
    const word = wordObj.word.toLowerCase()
    const challengeTypes: Array<WordChallenge['challengeType']> = ['spelling', 'missing-letters', 'definition']
    const challengeType = challengeTypes[Math.floor(Math.random() * challengeTypes.length)]

    switch (challengeType) {
      case 'spelling':
        return {
          word,
          meaning: wordObj.meaning,
          scrambledWord: scrambleWord(word),
          missingLetters: '',
          challengeType
        }
      case 'missing-letters':
        return {
          word,
          meaning: wordObj.meaning,
          scrambledWord: '',
          missingLetters: createMissingLetters(word),
          challengeType
        }
      case 'definition':
        return {
          word,
          meaning: wordObj.meaning,
          scrambledWord: '',
          missingLetters: '',
          challengeType
        }
      default:
        return {
          word,
          meaning: wordObj.meaning,
          scrambledWord: scrambleWord(word),
          missingLetters: '',
          challengeType: 'spelling'
        }
    }
  }, [])

  const scrambleWord = (word: string): string => {
    const letters = word.split('')
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[letters[i], letters[j]] = [letters[j], letters[i]]
    }
    const scrambled = letters.join('')
    return scrambled === word ? scrambleWord(word) : scrambled
  }

  const createMissingLetters = (word: string): string => {
    const wordLength = word.length
    const missingCount = Math.max(1, Math.floor(wordLength / 3))
    const positions = new Set<number>()

    while (positions.size < missingCount) {
      positions.add(Math.floor(Math.random() * wordLength))
    }

    return Array.from(word)
      .map((letter, index) => positions.has(index) ? '_' : letter)
      .join('')
  }

  const newChallenge = () => {
    setCurrentChallenge(generateChallenge())
    setUserInput('')
    setFeedback(null)
    setIsCorrect(null)
  }

  const handleSubmit = () => {
    if (!userInput.trim() || !currentChallenge) return

    const correct = userInput.toLowerCase() === currentChallenge.word.toLowerCase()
    setIsCorrect(correct)

    if (correct) {
      const points = Math.floor(10 * currentLevelData.pointsMultiplier * (1 + streak * 0.2))
      setScore(prev => prev + points)
      setStreak(prev => prev + 1)
      setWordsCompleted(prev => prev + 1)
      setFeedback(`✅ Correct! +${points} points`)

      setTimeout(() => {
        newChallenge()
      }, 1500)
    } else {
      setStreak(0)
      const newLives = lives - 1
      setLives(newLives)
      setFeedback(`❌ Wrong! The word was: ${currentChallenge.word}`)

      if (newLives <= 0) {
        setIsActive(false)
        setTimeout(() => onComplete(score), 2000)
      } else {
        setTimeout(() => {
          newChallenge()
        }, 2000)
      }
    }
  }

  const handleLevelComplete = () => {
    if (currentLevel < levels.length) {
      setCurrentLevel(prev => prev + 1)
      setWordsCompleted(0)
      setTimeLeft(levels[currentLevel].timeLimit)
      setStreak(0)
      setFeedback(`🎉 Level ${currentLevel} Complete! Advancing to ${levels[currentLevel].name}...`)

      setTimeout(() => {
        newChallenge()
        setFeedback(null)
      }, 3000)
    } else {
      setIsActive(false)
      setTimeout(() => onComplete(score), 2000)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }

  const renderChallenge = () => {
    if (!currentChallenge) return null

    switch (currentChallenge.challengeType) {
      case 'spelling':
        return (
          <div className="challenge-section">
            <div className="challenge-title">Unscramble the word:</div>
            <div className="scrambled-word">
              {currentChallenge.scrambledWord.split('').map((letter, index) => (
                <span key={index} className="scrambled-letter">
                  {letter.toUpperCase()}
                </span>
              ))}
            </div>
            <div className="challenge-hint">
              <strong>Hint:</strong> {currentChallenge.meaning.split('.')[0]}
            </div>
          </div>
        )

      case 'missing-letters':
        return (
          <div className="challenge-section">
            <div className="challenge-title">Fill in the missing letters:</div>
            <div className="missing-letters">
              {currentChallenge.missingLetters.split('').map((char, index) => (
                <span key={index} className={`letter-cell ${char === '_' ? 'missing' : 'filled'}`}>
                  {char === '_' ? '?' : char.toUpperCase()}
                </span>
              ))}
            </div>
            <div className="challenge-hint">
              <strong>Meaning:</strong> {currentChallenge.meaning}
            </div>
          </div>
        )

      case 'definition':
        return (
          <div className="challenge-section">
            <div className="challenge-title">Spell the word for this definition:</div>
            <div className="definition-challenge">
              <div className="definition">{currentChallenge.meaning}</div>
              <div className="word-length">
                Word has {currentChallenge.word.length} letters
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '#4ECDC4'
      case 'medium': return '#FFD166'
      case 'hard': return '#FF6B6B'
      default: return '#4ECDC4'
    }
  }

  return (
    <div className="spelling-adventure">
      <div className="game-header">
        <div className="game-title">🗺️ Spelling Adventure</div>
        <div className="game-stats">
          <div className="stat">
            <span className="stat-label">Level</span>
            <span className="stat-value level-badge" style={{
              backgroundColor: getDifficultyColor(currentLevelData.difficulty)
            }}>
              {currentLevel}
            </span>
          </div>
          <div className="stat">
            <span className="stat-label">Score</span>
            <span className="stat-value">{score}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Lives</span>
            <span className="stat-value lives">{'❤️'.repeat(lives)}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Time</span>
            <span className="stat-value">{timeLeft}s</span>
          </div>
          <div className="stat">
            <span className="stat-label">Streak</span>
            <span className="stat-value streak">🔥 {streak}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Words</span>
            <span className="stat-value">{wordsCompleted}/{currentLevelData.targetWords}</span>
          </div>
        </div>
      </div>

      <div className="level-info">
        <div className="level-name">
          <span className="level-icon">📍</span>
          {currentLevelData.name}
          <span className="difficulty-badge" style={{
            backgroundColor: getDifficultyColor(currentLevelData.difficulty)
          }}>
            {currentLevelData.difficulty.toUpperCase()}
          </span>
        </div>
        <div className="level-progress">
          <div className="progress-text">
            Progress: {wordsCompleted} / {currentLevelData.targetWords} words
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${(wordsCompleted / currentLevelData.targetWords) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="game-content">
        {renderChallenge()}

        <div className="input-section">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className={`adventure-input ${isCorrect === true ? 'correct' : isCorrect === false ? 'incorrect' : ''}`}
            placeholder={`Type the word here... (Level ${currentLevel} - ${currentLevelData.difficulty})`}
            disabled={!isActive}
            autoFocus
          />

          <button
            className="submit-btn"
            onClick={handleSubmit}
            disabled={!userInput.trim() || !isActive}
          >
            Submit Answer 🗡️
          </button>
        </div>

        {feedback && (
          <div className={`feedback ${isCorrect ? 'correct' : 'incorrect'}`}>
            {feedback}
          </div>
        )}

        {streak > 2 && (
          <div className="streak-bonus">
            <div className="streak-icon">⚡</div>
            <div className="streak-text">
              {streak} in a row! Points multiplier: {Math.floor(100 + streak * 20)}%
            </div>
          </div>
        )}
      </div>

      <div className="game-footer">
        <div className="status-display">
          <div className="status-item">
            <div className="status-label">Current Level</div>
            <div className="status-value">{currentLevelData.name}</div>
          </div>
          <div className="status-item">
            <div className="status-label">Points Multiplier</div>
            <div className="status-value">{currentLevelData.pointsMultiplier}x</div>
          </div>
          <div className="status-item">
            <div className="status-label">Time Remaining</div>
            <div className="status-value">{timeLeft}s</div>
          </div>
        </div>

        <div className="adventure-tips">
          <div className="tip">
            <span className="tip-icon">💡</span>
            <span className="tip-text">Each level gets harder but offers more points!</span>
          </div>
          <div className="tip">
            <span className="tip-icon">⚔️</span>
            <span className="tip-text">Maintain streaks for bonus multipliers!</span>
          </div>
          <div className="tip">
            <span className="tip-icon">🏆</span>
            <span className="tip-text">Complete all 3 levels to win the adventure!</span>
          </div>
        </div>
      </div>

      {!isActive && (
        <div className="game-overlay">
          <div className="overlay-content">
            <h2>{lives > 0 ? 'Adventure Complete! 🏆' : 'Game Over! 💀'}</h2>
            <p className="final-score">Final Score: {score}</p>
            <p className="level-reached">Levels Completed: {currentLevel - 1}/3</p>
            <button
              className="continue-btn"
              onClick={() => onComplete(score)}
            >
              Return to Game Menu
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default SpellingAdventure
