import React, { useState, useEffect } from 'react'
import { bibleApi, BibleVersion, BIBLE_CATEGORIES } from '../../../services/bibleApi'
import './BibleTriviaEnhanced.css'

interface BibleQuestion {
  id: number
  question: string
  options: string[]
  correctAnswer: string
  reference: string
  explanation: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
  points: number
}

interface BibleTriviaEnhancedProps {
  onComplete: (score: number) => void
  difficulty?: 'easy' | 'medium' | 'hard'
  category?: string
  version?: BibleVersion
}

const BibleTriviaEnhanced: React.FC<BibleTriviaEnhancedProps> = ({
  onComplete,
  difficulty = 'medium',
  category,
  version = 'KJV'
}) => {
  const [questions, setQuestions] = useState<BibleQuestion[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(90)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [streak, setStreak] = useState(0)
  const [lives, setLives] = useState(3)
  const [gameActive, setGameActive] = useState(true)
  const [showExplanation, setShowExplanation] = useState(false)
  const [verseText, setVerseText] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [gameMode, setGameMode] = useState<'trivia' | 'verse'>('trivia')

  // Pre-defined questions as fallback
  const predefinedQuestions: BibleQuestion[] = [
    {
      id: 1,
      question: "Who was the first man created by God?",
      options: ["Abraham", "Moses", "Adam", "Noah"],
      correctAnswer: "Adam",
      reference: "Genesis 2:7",
      explanation: "The LORD God formed man from the dust of the ground and breathed into his nostrils the breath of life.",
      category: "old_testament",
      difficulty: "easy",
      points: 100
    },
    {
      id: 2,
      question: "What was the name of the giant that David defeated?",
      options: ["Goliath", "Samson", "Saul", "Jonathan"],
      correctAnswer: "Goliath",
      reference: "1 Samuel 17:49",
      explanation: "David took out a stone, slung it, and struck the Philistine on his forehead.",
      category: "old_testament",
      difficulty: "easy",
      points: 100
    },
    {
      id: 3,
      question: "How many disciples did Jesus have?",
      options: ["10", "12", "14", "16"],
      correctAnswer: "12",
      reference: "Matthew 10:1",
      explanation: "Jesus called his twelve disciples to him and gave them authority...",
      category: "new_testament",
      difficulty: "easy",
      points: 100
    }
  ]

  useEffect(() => {
    initializeGame()
  }, [difficulty, category, version])

  useEffect(() => {
    if (gameActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && gameActive) {
      endGame()
    }
  }, [timeLeft, gameActive])

  useEffect(() => {
    if (questions.length > 0 && currentQuestion < questions.length) {
      fetchVerseText(questions[currentQuestion].reference)
    }
  }, [currentQuestion, questions])

  const initializeGame = async () => {
    setIsLoading(true)
    try {
      // Try to generate questions from API
      const generatedQuestions = await generateQuestionsFromAPI()
      if (generatedQuestions.length > 0) {
        setQuestions(generatedQuestions)
      } else {
        // Use pre-defined questions as fallback
        let filtered = predefinedQuestions

        if (difficulty) {
          filtered = filtered.filter(q => q.difficulty === difficulty)
        }

        if (category) {
          filtered = filtered.filter(q => q.category === category)
        }

        setQuestions(filtered.slice(0, 10))
      }
    } catch (error) {
      console.error('Error initializing game:', error)
      // Use pre-defined questions on error
      setQuestions(predefinedQuestions.slice(0, 5))
    } finally {
      setIsLoading(false)
    }
  }

  const generateQuestionsFromAPI = async (): Promise<BibleQuestion[]> => {
    try {
      // This would ideally call an AI service to generate questions
      // For now, we'll use pre-defined questions
      return predefinedQuestions.slice(0, 8)
    } catch (error) {
      console.error('Error generating questions:', error)
      return []
    }
  }

  const fetchVerseText = async (reference: string) => {
    try {
      const verse = await bibleApi.getVerse(reference, version)
      setVerseText(verse.text)
    } catch (error) {
      console.error('Error fetching verse:', error)
      setVerseText('')
    }
  }

  const handleAnswerSelect = async (answer: string) => {
    if (isAnswered || !gameActive) return

    setSelectedAnswer(answer)
    setIsAnswered(true)

    const currentQ = questions[currentQuestion]
    const isCorrect = answer === currentQ.correctAnswer

    if (isCorrect) {
      const difficultyMultiplier = {
        easy: 1,
        medium: 1.5,
        hard: 2
      }

      const timeBonus = Math.floor((timeLeft / 90) * 50)
      const streakBonus = streak * 15
      const basePoints = currentQ.points
      const difficultyBonus = difficultyMultiplier[currentQ.difficulty] * basePoints

      const points = Math.floor(basePoints + difficultyBonus + timeBonus + streakBonus)
      setScore(prev => prev + points)
      setStreak(prev => prev + 1)

      setShowExplanation(true)

      // Fetch more context for the verse
      if (gameMode === 'verse') {
        const context = await bibleApi.getVerseContext(currentQ.reference, 1, version)
        if (context) {
          setVerseText(context.text)
        }
      }
    } else {
      setStreak(0)
      const newLives = lives - 1
      setLives(newLives)

      if (newLives <= 0) {
        setGameActive(false)
        setTimeout(() => endGame(), 2000)
      }
    }

    // Move to next question after delay
    setTimeout(() => {
      setShowExplanation(false)
      setSelectedAnswer(null)
      setIsAnswered(false)

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1)
      } else {
        endGame()
      }
    }, isCorrect ? 2500 : 1500)
  }

  const endGame = () => {
    setGameActive(false)
    const accuracy = questions.length > 0 ? Math.round(((currentQuestion + 1) / questions.length) * 100) : 0
    const timeBonus = Math.floor(timeLeft * 3)
    const streakBonus = streak * 50
    const finalScore = score + timeBonus + streakBonus + (accuracy * 2)

    setTimeout(() => onComplete(finalScore), 2000)
  }

  const getCategoryColor = (cat: string) => {
    const category = BIBLE_CATEGORIES.find(c => c.id === cat)
    return category ? category.color : '#4ECDC4'
  }

  const getCategoryName = (cat: string) => {
    const category = BIBLE_CATEGORIES.find(c => c.id === cat)
    return category ? category.name : 'Bible'
  }

  const getDifficultyColor = (diff: string) => {
    switch(diff) {
      case 'easy': return '#06D6A0'
      case 'medium': return '#FFD166'
      case 'hard': return '#FF6B6B'
      default: return '#FFD166'
    }
  }

  const toggleGameMode = () => {
    setGameMode(mode => mode === 'trivia' ? 'verse' : 'trivia')
  }

  const currentQ = questions[currentQuestion]

  if (isLoading) {
    return (
      <div className="bible-trivia-loading">
        <div className="loading-content">
          <div className="loading-icon">📖</div>
          <div className="loading-text">Loading Bible Trivia...</div>
          <div className="loading-subtext">Fetching questions from the Word of God</div>
        </div>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="bible-trivia-error">
        <div className="error-content">
          <div className="error-icon">⚠️</div>
          <div className="error-text">Unable to load questions</div>
          <button className="retry-btn" onClick={initializeGame}>
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bible-trivia-enhanced">
      <div className="game-header">
        <div className="header-left">
          <div className="game-title">
            <span className="title-icon">📖</span>
            <span className="title-text">Bible Trivia Enhanced</span>
            <span className="version-badge">{version}</span>
          </div>

          <div className="game-mode-selector">
            <button
              className={`mode-btn ${gameMode === 'trivia' ? 'active' : ''}`}
              onClick={toggleGameMode}
            >
              Trivia Mode
            </button>
            <button
              className={`mode-btn ${gameMode === 'verse' ? 'active' : ''}`}
              onClick={toggleGameMode}
            >
              Verse Study
            </button>
          </div>
        </div>

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
            <span className="stat-label">Question</span>
            <span className="stat-value">{currentQuestion + 1}/{questions.length}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Lives</span>
            <span className="stat-value lives">{'❤️'.repeat(lives)}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Streak</span>
            <span className="stat-value streak">🔥 {streak}</span>
          </div>
        </div>
      </div>

      <div className="question-info">
        <div className="info-row">
          <div className="category-tag" style={{ backgroundColor: getCategoryColor(currentQ?.category || 'old_testament') }}>
            {getCategoryName(currentQ?.category || 'old_testament')}
          </div>
          <div className="difficulty-tag" style={{ backgroundColor: getDifficultyColor(currentQ?.difficulty || 'medium') }}>
            {currentQ?.difficulty?.toUpperCase() || 'MEDIUM'}
          </div>
          <div className="points-tag">
            {currentQ?.points || 100} points
          </div>
        </div>

        <div className="progress-section">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
          <div className="progress-text">
            Question {currentQuestion + 1} of {questions.length}
          </div>
        </div>
      </div>

      <div className="game-content">
        <div className="question-section">
          <div className="question-box">
            <div className="question-text">
              {currentQ?.question}
            </div>

            {gameMode === 'verse' && verseText && (
              <div className="verse-preview">
                <div className="verse-text">{verseText}</div>
                <div className="verse-reference">{currentQ?.reference}</div>
              </div>
            )}
          </div>

          <div className="options-grid">
            {currentQ?.options.map((option, index) => {
              const isSelected = selectedAnswer === option
              const isCorrect = option === currentQ.correctAnswer
              const letter = String.fromCharCode(65 + index)

              return (
                <button
                  key={index}
                  className={`option-btn ${isSelected ? (isCorrect ? 'correct' : 'incorrect') : ''} ${isAnswered && isCorrect ? 'revealed-correct' : ''}`}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={isAnswered || !gameActive}
                >
                  <div className="option-letter">{letter}</div>
                  <div className="option-text">{option}</div>
                  {isSelected && (
                    <div className="answer-feedback">
                      {isCorrect ? '✓' : '✗'}
                    </div>
                  )}
                </button>
              )
            })}
          </div>

          {showExplanation && (
            <div className="explanation-section">
              <div className="explanation-header">
                <span className="explanation-icon">💡</span>
                <span className="explanation-title">Biblical Insight</span>
              </div>
              <div className="explanation-content">
                <div className="explanation-text">{currentQ?.explanation}</div>
                <div className="explanation-reference">
                  <span className="reference-icon">📜</span>
                  <span className="reference-text">{currentQ?.reference}</span>
                </div>
              </div>
            </div>
          )}

          {streak > 2 && (
            <div className="streak-display">
              <div className="streak-icons">
                {'🔥'.repeat(Math.min(streak, 5))}
              </div>
              <div className="streak-text">
                Bible Master! {streak} correct in a row!
              </div>
            </div>
          )}
        </div>

        <div className="api-info">
          <div className="api-status">
            <div className="status-indicator online"></div>
            <div className="status-text">Connected to Bible API</div>
          </div>
          <div className="api-version">
            Bible Version: <span className="version-name">{version}</span>
          </div>
        </div>
      </div>

      <div className="game-footer">
        <div className="scoring-info">
          <div className="score-item">
            <span className="score-icon">⏱️</span>
            <span className="score-text">Time Bonus: +{Math.floor(timeLeft * 3)}</span>
          </div>
          <div className="score-item">
            <span className="score-icon">📈</span>
            <span className="score-text">Streak Bonus: +{streak * 15} per question</span>
          </div>
          <div className="score-item">
            <span className="score-icon">⭐</span>
            <span className="score-text">Difficulty Multiplier: {difficulty === 'easy' ? '1x' : difficulty === 'medium' ? '1.5x' : '2x'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BibleTriviaEnhanced
