import React, { useState, useEffect } from 'react'
import './MathPuzzle.css'

interface Puzzle {
  id: number
  question: string
  answer: number
  options: number[]
  timeLimit: number
  points: number
}

interface MathPuzzleProps {
  onComplete: (score: number) => void
  difficulty?: 'easy' | 'medium' | 'hard'
}

const MathPuzzle: React.FC<MathPuzzleProps> = ({ onComplete, difficulty = 'medium' }) => {
  const [currentPuzzle, setCurrentPuzzle] = useState<Puzzle | null>(null)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [streak, setStreak] = useState(0)
  const [totalPuzzles, setTotalPuzzles] = useState(0)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [gameActive, setGameActive] = useState(true)
  const [feedback, setFeedback] = useState('')

  useEffect(() => {
    generatePuzzle()
  }, [difficulty])

  useEffect(() => {
    if (timeLeft > 0 && gameActive) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && gameActive && currentPuzzle) {
      handleTimeOut()
    }
  }, [timeLeft, gameActive])

  const generatePuzzle = () => {
    let question = ''
    let answer = 0
    let points = 0
    let timeLimit = 0

    switch (difficulty) {
      case 'easy':
        const num1 = Math.floor(Math.random() * 10) + 1
        const num2 = Math.floor(Math.random() * 10) + 1
        const op = Math.random() > 0.5 ? '+' : '-'
        answer = op === '+' ? num1 + num2 : num1 - num2
        question = `${num1} ${op} ${num2} = ?`
        points = 10
        timeLimit = 15
        break

      case 'medium':
        const n1 = Math.floor(Math.random() * 20) + 1
        const n2 = Math.floor(Math.random() * 10) + 1
        const operation = Math.random() > 0.5 ? '×' : '÷'
        if (operation === '×') {
          answer = n1 * n2
          question = `${n1} × ${n2} = ?`
        } else {
          answer = n1
          question = `${n1 * n2} ÷ ${n2} = ?`
        }
        points = 20
        timeLimit = 12
        break

      case 'hard':
        const base = Math.floor(Math.random() * 10) + 2
        const exp = Math.floor(Math.random() * 3) + 2
        answer = Math.pow(base, exp)
        question = `${base}^${exp} = ?`
        points = 30
        timeLimit = 10
        break
    }

    // Generate options
    const options = generateOptions(answer)

    setCurrentPuzzle({
      id: Date.now(),
      question,
      answer,
      options,
      timeLimit,
      points
    })
    setTimeLeft(timeLimit)
    setTotalPuzzles(prev => prev + 1)
  }

  const generateOptions = (correct: number): number[] => {
    const options = [correct]
    while (options.length < 4) {
      const offset = Math.floor(Math.random() * 5) + 1
      const sign = Math.random() > 0.5 ? 1 : -1
      const option = correct + (offset * sign)
      if (option > 0 && !options.includes(option)) {
        options.push(option)
      }
    }
    return options.sort(() => Math.random() - 0.5)
  }

  const handleAnswer = (selected: number) => {
    if (!currentPuzzle || !gameActive) return

    if (selected === currentPuzzle.answer) {
      const points = currentPuzzle.points + (streak * 5)
      setScore(prev => prev + points)
      setCorrectAnswers(prev => prev + 1)
      setStreak(prev => prev + 1)
      setFeedback(`✅ Correct! +${points} points`)
    } else {
      setStreak(0)
      setFeedback(`❌ Wrong! The answer was ${currentPuzzle.answer}`)
    }

    setTimeout(() => {
      setFeedback('')
      if (totalPuzzles < 10) {
        generatePuzzle()
      } else {
        endGame()
      }
    }, 1500)
  }

  const handleTimeOut = () => {
    setStreak(0)
    setFeedback('⏰ Time\'s up!')
    setTimeout(() => {
      setFeedback('')
      if (totalPuzzles < 10) {
        generatePuzzle()
      } else {
        endGame()
      }
    }, 1500)
  }

  const endGame = () => {
    setGameActive(false)
    const accuracy = Math.round((correctAnswers / totalPuzzles) * 100)
    const bonus = Math.round(score * (accuracy / 100))
    const finalScore = score + bonus
    setTimeout(() => onComplete(finalScore), 2000)
  }

  return (
    <div className="math-puzzle">
      <div className="game-header">
        <div className="game-title">🧮 Math Puzzle</div>
        <div className="game-stats">
          <div className="stat">
            <span className="stat-label">Time</span>
            <span className="stat-value time-left">{timeLeft}s</span>
          </div>
          <div className="stat">
            <span className="stat-label">Score</span>
            <span className="stat-value">{score}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Streak</span>
            <span className="stat-value streak">🔥 {streak}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Solved</span>
            <span className="stat-value">{correctAnswers}/10</span>
          </div>
        </div>
      </div>

      <div className="game-content">
        <div className="puzzle-display">
          {currentPuzzle && (
            <>
              <div className="puzzle-question">
                {currentPuzzle.question}
              </div>
              <div className="difficulty-badge">
                {difficulty.toUpperCase()}
              </div>
            </>
          )}
        </div>

        <div className="options-grid">
          {currentPuzzle?.options.map((option, index) => (
            <button
              key={index}
              className="option-btn"
              onClick={() => handleAnswer(option)}
              disabled={!gameActive || !!feedback}
            >
              {option}
            </button>
          ))}
        </div>

        {feedback && (
          <div className={`feedback ${feedback.includes('✅') ? 'correct' : 'incorrect'}`}>
            {feedback}
          </div>
        )}

        {streak > 2 && (
          <div className="streak-display">
            <div className="streak-icon">⚡</div>
            <div className="streak-text">
              {streak} in a row! +{streak * 5} bonus per question
            </div>
          </div>
        )}
      </div>

      <div className="game-footer">
        <div className="progress-info">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${(totalPuzzles / 10) * 100}%` }}
            />
          </div>
          <div className="progress-text">
            Puzzle {totalPuzzles} of 10
          </div>
        </div>
      </div>
    </div>
  )
}

export default MathPuzzle
