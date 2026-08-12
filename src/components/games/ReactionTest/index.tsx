import React, { useState, useEffect, useCallback } from 'react'
import './ReactionTest.css'

interface ReactionTestProps {
  onComplete: (score: number) => void
  rounds?: number
}

const ReactionTest: React.FC<ReactionTestProps> = ({ onComplete, rounds = 10 }) => {
  const [score, setScore] = useState(0)
  const [currentRound, setCurrentRound] = useState(1)
  const [reactionTime, setReactionTime] = useState<number | null>(null)
  const [gameState, setGameState] = useState<'waiting' | 'ready' | 'go' | 'result'>('waiting')
  const [startTime, setStartTime] = useState<number>(0)
  const [bestTime, setBestTime] = useState<number | null>(null)
  const [averageTime, setAverageTime] = useState<number | null>(null)
  const [reactionTimes, setReactionTimes] = useState<number[]>([])
  const [countdown, setCountdown] = useState(3)

  useEffect(() => {
    if (currentRound > rounds) {
      endGame()
      return
    }

    if (gameState === 'waiting') {
      const waitTime = 1000 + Math.random() * 3000
      const timer = setTimeout(() => {
        setGameState('ready')
        setTimeout(() => {
          setGameState('go')
          setStartTime(Date.now())
        }, Math.random() * 2000 + 1000) // Random delay 1-3s
      }, waitTime)
      return () => clearTimeout(timer)
    }
  }, [currentRound, gameState, rounds])

  useEffect(() => {
    if (gameState === 'ready') {
      setCountdown(3)
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer)
            return 3
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [gameState])

  const handleClick = useCallback(() => {
    if (gameState === 'go') {
      const time = Date.now() - startTime
      setReactionTime(time)
      setReactionTimes(prev => [...prev, time])

      // Update best time
      if (!bestTime || time < bestTime) {
        setBestTime(time)
      }

      // Calculate average
      const newTimes = [...reactionTimes, time]
      const avg = Math.round(newTimes.reduce((a, b) => a + b, 0) / newTimes.length)
      setAverageTime(avg)

      // Calculate score for this round
      let roundScore = 0
      if (time < 200) roundScore = 100
      else if (time < 300) roundScore = 80
      else if (time < 400) roundScore = 60
      else if (time < 500) roundScore = 40
      else roundScore = 20

      setScore(prev => prev + roundScore)
      setGameState('result')

      // Move to next round
      setTimeout(() => {
        setCurrentRound(prev => prev + 1)
        setGameState('waiting')
        setReactionTime(null)
      }, 1500)
    } else if (gameState === 'waiting' || gameState === 'ready') {
      // Too early!
      setReactionTime(-1)
      setGameState('result')
      setTimeout(() => {
        setCurrentRound(prev => prev + 1)
        setGameState('waiting')
        setReactionTime(null)
      }, 1500)
    }
  }, [gameState, startTime, bestTime, reactionTimes])

  const endGame = () => {
    const bonus = bestTime ? Math.round(1000 - bestTime) : 0
    const avgBonus = averageTime ? Math.round(500 - averageTime) * 2 : 0
    const finalScore = score + bonus + avgBonus
    setTimeout(() => onComplete(finalScore), 1000)
  }

  const getFeedback = () => {
    if (!reactionTime) return ''

    if (reactionTime === -1) {
      return 'Too early! Wait for GO!'
    }

    if (reactionTime < 150) return 'Legendary! ⚡'
    if (reactionTime < 200) return 'Excellent! 🚀'
    if (reactionTime < 250) return 'Great! 🏎️'
    if (reactionTime < 300) return 'Good! 👍'
    if (reactionTime < 400) return 'Average 😐'
    return 'Slow... 🐢'
  }

  return (
    <div className="reaction-test">
      <div className="game-header">
        <div className="game-title">⚡ Reaction Test</div>
        <div className="game-stats">
          <div className="stat">
            <span className="stat-label">Round</span>
            <span className="stat-value">{currentRound}/{rounds}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Score</span>
            <span className="stat-value">{score}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Best</span>
            <span className="stat-value">{bestTime ? `${bestTime}ms` : '--'}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Average</span>
            <span className="stat-value">{averageTime ? `${averageTime}ms` : '--'}</span>
          </div>
        </div>
      </div>

      <div className="game-instructions">
        <p>Click as fast as possible when the screen turns GREEN!</p>
        <p className="warning">Don't click too early!</p>
      </div>

      <div className="reaction-area">
        <div
          className={`reaction-box ${gameState}`}
          onClick={handleClick}
        >
          {gameState === 'waiting' && (
            <div className="waiting-text">
              Wait for it...
              <div className="pulse"></div>
            </div>
          )}

          {gameState === 'ready' && (
            <div className="ready-text">
              Get Ready...
              <div className="countdown">{countdown}</div>
            </div>
          )}

          {gameState === 'go' && (
            <div className="go-text">
              GO! CLICK NOW! ⚡
            </div>
          )}

          {gameState === 'result' && reactionTime && (
            <div className="result-text">
              {reactionTime === -1 ? (
                <>
                  <div className="too-early">❌ Too Early!</div>
                  <div className="feedback">Wait for GO signal!</div>
                </>
              ) : (
                <>
                  <div className="time-display">{reactionTime}ms</div>
                  <div className="feedback">{getFeedback()}</div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="progress-section">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${(currentRound / rounds) * 100}%` }}
          />
        </div>
        <div className="progress-text">
          Round {currentRound} of {rounds}
        </div>
      </div>

      <div className="history-section">
        <div className="history-title">Recent Times:</div>
        <div className="history-list">
          {reactionTimes.slice(-5).map((time, index) => (
            <div key={index} className={`history-item ${time < 250 ? 'fast' : time < 400 ? 'medium' : 'slow'}`}>
              {time}ms
            </div>
          ))}
        </div>
      </div>

      <div className="game-footer">
        <div className="tips">
          <div className="tip">⚡ Under 200ms: Excellent!</div>
          <div className="tip">🎯 Under 300ms: Good!</div>
          <div className="tip">🏆 Beat your best time!</div>
        </div>
      </div>
    </div>
  )
}

export default ReactionTest
