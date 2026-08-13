import React, { useState, useEffect } from 'react'
import { useAudio } from '../../../contexts/AudioContext'
import { wordBank, Word } from '../../../services/wordBank'
import Button from '../../common/Button'
import './TestAll.css'

interface TestAllProps {
  difficulty?: 1 | 2 | 3
  timePerWord?: number // in seconds
  words?: Word[]
  onMoveToGames?: () => void
}

const TestAll: React.FC<TestAllProps> = ({ 
  difficulty, 
  timePerWord = 30, 
  words: providedWords,
  onMoveToGames
}) => {
  const { speak } = useAudio()
  const [words, setWords] = useState<Word[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userInput, setUserInput] = useState('')
  const [results, setResults] = useState<Array<{
    word: Word
    userAnswer: string
    isCorrect: boolean
  }>>([])
  const [timeLeft, setTimeLeft] = useState(timePerWord)
  const [testCompleted, setTestCompleted] = useState(false)
  const [testStarted, setTestStarted] = useState(false)

  useEffect(() => {
    if (testStarted && !testCompleted && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (testStarted && timeLeft === 0) {
      handleTimeUp()
    }
  }, [testStarted, timeLeft, testCompleted])

  const startTest = () => {
    let testWords: Word[] = []
    if (providedWords && providedWords.length > 0) {
      testWords = [...providedWords].sort(() => 0.5 - Math.random()).slice(0, 50)
    } else {
      const allWords = difficulty ? wordBank.getWordsByDifficulty(difficulty) : wordBank.getAllWords()
      testWords = allWords.sort(() => 0.5 - Math.random()).slice(0, Math.min(50, allWords.length))
    }
    setWords(testWords)
    setTestStarted(true)
    setTimeLeft(timePerWord)
    if (testWords.length > 0) {
      speak(testWords[0].sentence.replace(testWords[0].word, '_______'))
    }
  }

  const handleTimeUp = () => {
    handleSubmit()
  }

  const handleSubmit = () => {
    const currentWord = words[currentIndex]
    const isCorrect = userInput.toLowerCase() === currentWord.word.toLowerCase()

    setResults(prev => [...prev, {
      word: currentWord,
      userAnswer: userInput,
      isCorrect
    }])

    if (currentIndex < words.length - 1) {
      const nextIndex = currentIndex + 1
      setCurrentIndex(nextIndex)
      setUserInput('')
      setTimeLeft(timePerWord)
      speak(words[nextIndex].sentence.replace(words[nextIndex].word, '_______'))
    } else {
      completeTest()
    }
  }

  const completeTest = () => {
    setTestCompleted(true)
    setTestStarted(false)
  }

  const handleSkip = () => {
    const currentWord = words[currentIndex]

    setResults(prev => [...prev, {
      word: currentWord,
      userAnswer: '',
      isCorrect: false
    }])

    if (currentIndex < words.length - 1) {
      const nextIndex = currentIndex + 1
      setCurrentIndex(nextIndex)
      setUserInput('')
      setTimeLeft(timePerWord)
      speak(words[nextIndex].sentence.replace(words[nextIndex].word, '_______'))
    } else {
      completeTest()
    }
  }

  const resetTest = () => {
    setWords([])
    setCurrentIndex(0)
    setUserInput('')
    setResults([])
    setTimeLeft(timePerWord)
    setTestCompleted(false)
    setTestStarted(false)
  }

  const calculateScore = () => {
    const correct = results.filter(r => r.isCorrect).length
    const total = results.length
    return {
      correct,
      total,
      percentage: total > 0 ? Math.round((correct / total) * 100) : 0
    }
  }

  if (!testStarted && !testCompleted) {
    return (
      <div className="test-all-intro">
        <h1>📝 Comprehensive Spelling Test</h1>
        <div className="test-info">
          <div className="info-card">
            <div className="info-icon">⏱️</div>
            <div className="info-content">
              <h3>Time Per Word</h3>
              <p>{timePerWord} seconds</p>
            </div>
          </div>
          <div className="info-card">
            <div className="info-icon">📊</div>
            <div className="info-content">
              <h3>Total Words</h3>
              <p>Up to 50 words</p>
            </div>
          </div>
          <div className="info-card">
            <div className="info-icon">🎯</div>
            <div className="info-content">
              <h3>Difficulty</h3>
              <p>{difficulty ? `Level ${difficulty}` : 'All Levels'}</p>
            </div>
          </div>
        </div>
        <div className="test-instructions">
          <h3>Instructions:</h3>
          <ul>
            <li>You will hear sentences with missing words</li>
            <li>Type the missing word in the input field</li>
            <li>You have {timePerWord} seconds per word</li>
            <li>Skip if you don't know the answer</li>
            <li>Try to get as many correct as possible!</li>
          </ul>
        </div>
        <Button
          onClick={startTest}
          variant="primary"
          size="large"
          icon="🚀"
        >
          Start Test
        </Button>
      </div>
    )
  }

  if (testCompleted) {
    const { correct, total, percentage } = calculateScore()

    return (
      <div className="test-completed">
        <h1>📊 Test Results</h1>

        <div className="score-summary">
          <div className="score-card main-score">
            <div className="score-value">{percentage}%</div>
            <div className="score-label">Overall Score</div>
          </div>

          <div className="score-details">
            <div className="score-card">
              <div className="score-value">{correct}</div>
              <div className="score-label">Correct</div>
            </div>
            <div className="score-card">
              <div className="score-value">{total - correct}</div>
              <div className="score-label">Incorrect</div>
            </div>
            <div className="score-card">
              <div className="score-value">{total}</div>
              <div className="score-label">Total Words</div>
            </div>
          </div>
        </div>

        <div className="performance-feedback">
          {percentage >= 90 ? (
            <div className="feedback excellent">
              <h2>🌟 Excellent! 🌟</h2>
              <p>You're a spelling master! Perfect score!</p>
            </div>
          ) : percentage >= 70 ? (
            <div className="feedback good">
              <h2>👍 Great Job!</h2>
              <p>You did really well! Keep practicing!</p>
            </div>
          ) : percentage >= 50 ? (
            <div className="feedback average">
              <h2>😊 Good Effort!</h2>
              <p>You're getting there! Practice makes perfect!</p>
            </div>
          ) : (
            <div className="feedback improve">
              <h2>💪 Keep Practicing!</h2>
              <p>Review the words and try again!</p>
            </div>
          )}
        </div>

        <div className="test-actions">
          <Button
            onClick={resetTest}
            variant="primary"
          >
            Try Again
          </Button>

          {onMoveToGames && (
            <Button
              onClick={onMoveToGames}
              variant="success"
              icon="🎮"
            >
              Play Games
            </Button>
          )}

          <Button
            onClick={() => {/* Navigate to review */}}
            variant="secondary"
          >
            Review Mistakes
          </Button>
        </div>

        {results.length > 0 && (
          <div className="results-breakdown">
            <h3>Detailed Results</h3>
            <div className="results-list">
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`result-item ${result.isCorrect ? 'correct' : 'incorrect'}`}
                >
                  <div className="result-word">
                    <strong>Word {index + 1}:</strong> {result.word.word}
                  </div>
                  <div className="result-answer">
                    <span className="label">Your answer:</span>
                    <span className={`value ${result.isCorrect ? 'correct' : 'incorrect'}`}>
                      {result.userAnswer || '(skipped)'}
                    </span>
                  </div>
                  <div className="result-sentence">
                    <span className="label">Sentence:</span>
                    <span className="value">{result.word.sentence}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  const currentWord = words[currentIndex]
  const progressPercentage = ((currentIndex + 1) / words.length) * 100

  return (
    <div className="test-all">
      <div className="test-header">
        <div className="test-stats">
          <div className="stat">
            <div className="stat-label">Word</div>
            <div className="stat-value">{currentIndex + 1}/{words.length}</div>
          </div>
          <div className="stat">
            <div className="stat-label">Time Left</div>
            <div className="stat-value timer-value">{timeLeft}s</div>
          </div>
          <div className="stat">
            <div className="stat-label">Correct</div>
            <div className="stat-value">
              {results.filter(r => r.isCorrect).length}
            </div>
          </div>
        </div>

        <div className="progress-indicator">
          <div
            className="progress-bar"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      <div className="test-content">
        <div className="sentence-display">
          <div className="sentence-text">
            {currentWord.sentence.replace(currentWord.word, '_______')}
          </div>
          <Button
            onClick={() => speak(currentWord.sentence.replace(currentWord.word, '_______'))}
            variant="secondary"
            size="small"
            icon="🔊"
          >
            Hear Sentence Again
          </Button>
        </div>

        <div className="input-section">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            className="test-input"
            placeholder="Type the missing word..."
            autoFocus
          />

          {/* Encouraging, not alarming: red "Hurry!" panics young children. */}
          <div className="time-warning" style={{ color: 'var(--text-soft)' }}>
            {timeLeft <= 10 ? `${timeLeft}s left — you've got this! 💪` : `${timeLeft}s`}
          </div>
        </div>

        <div className="test-controls">
          <Button
            onClick={handleSubmit}
            variant="primary"
            size="large"
            disabled={!userInput.trim()}
          >
            Submit Answer
          </Button>

          <Button
            onClick={handleSkip}
            variant="warning"
          >
            Skip Word
          </Button>
        </div>

        <div className="test-tips">
          <div className="tip">
            <span className="tip-icon">💡</span>
            <span className="tip-text">
              Listen carefully to the sentence for context clues
            </span>
          </div>
          <div className="tip">
            <span className="tip-icon">⏱️</span>
            <span className="tip-text">
              Don't spend too long on one word - you can always skip
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TestAll
