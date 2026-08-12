import React, { useState, useEffect, useCallback } from 'react'
import './PatternMemory.css'

interface PatternItem {
  id: number
  emoji: string
  color: string
  isActive: boolean
  isClickable: boolean
}

interface PatternMemoryProps {
  onComplete: (score: number) => void
}

const PatternMemory: React.FC<PatternMemoryProps> = ({ onComplete }) => {
  const [pattern, setPattern] = useState<PatternItem[]>([])
  const [playerPattern, setPlayerPattern] = useState<number[]>([])
  const [level, setLevel] = useState(1)
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [isShowingPattern, setIsShowingPattern] = useState(false)
  const [isPlayerTurn, setIsPlayerTurn] = useState(false)
  const [message, setMessage] = useState('Watch the pattern...')
  const [streak, setStreak] = useState(0)

  const items = [
    { id: 1, emoji: '🔶', color: '#FF6B6B' },
    { id: 2, emoji: '🔷', color: '#4ECDC4' },
    { id: 3, emoji: '🔸', color: '#FFD166' },
    { id: 4, emoji: '🔹', color: '#06D6A0' },
    { id: 5, emoji: '⭐', color: '#FFD700' },
    { id: 6, emoji: '🌟', color: '#9370DB' }
  ]

  useEffect(() => {
    startNewLevel()
  }, [])

  const startNewLevel = () => {
    const newPattern = generatePattern(level + 2)
    setPattern(newPattern)
    setPlayerPattern([])
    setIsShowingPattern(true)
    setIsPlayerTurn(false)
    setMessage(`Level ${level} - Watch carefully!`)

    // Show pattern
    setTimeout(() => {
      setIsShowingPattern(false)
      setIsPlayerTurn(true)
      setMessage('Your turn! Repeat the pattern')
    }, (level + 2) * 800)
  }

  const generatePattern = (length: number) => {
    return Array.from({ length }, (_, index) => {
      const randomItem = items[Math.floor(Math.random() * items.length)]
      return {
        id: index,
        emoji: randomItem.emoji,
        color: randomItem.color,
        isActive: false,
        isClickable: false
      }
    })
  }

  const handleItemClick = (index: number) => {
    if (!isPlayerTurn) return

    const clickedItem = pattern[index]

    // Animate clicked item
    const newPattern = [...pattern]
    newPattern[index] = { ...clickedItem, isActive: true }
    setPattern(newPattern)

    // Check if correct
    const expectedIndex = playerPattern.length
    if (pattern[expectedIndex].emoji === clickedItem.emoji) {
      const newPlayerPattern = [...playerPattern, index]
      setPlayerPattern(newPlayerPattern)

      // Check if pattern complete
      if (newPlayerPattern.length === pattern.length) {
        setMessage('Perfect! Next level...')
        const levelScore = level * 100 + streak * 50
        setScore(prev => prev + levelScore)
        setStreak(prev => prev + 1)

        setTimeout(() => {
          setLevel(prev => prev + 1)
          startNewLevel()
        }, 1500)
      }
    } else {
      // Wrong pattern
      setMessage('Wrong pattern! Try again...')
      setStreak(0)
      const newLives = lives - 1
      setLives(newLives)

      if (newLives <= 0) {
        endGame()
      } else {
        setTimeout(() => {
          startNewLevel()
        }, 2000)
      }
    }

    // Reset animation
    setTimeout(() => {
      const resetPattern = [...pattern]
      resetPattern[index] = { ...clickedItem, isActive: false }
      setPattern(resetPattern)
    }, 300)
  }

  const endGame = () => {
    setIsPlayerTurn(false)
    setMessage(`Game Over! Final Score: ${score}`)
    setTimeout(() => onComplete(score), 2000)
  }

  const renderPattern = () => {
    return pattern.map((item, index) => (
      <div
        key={index}
        className={`pattern-item ${item.isActive ? 'active' : ''}`}
        style={{ backgroundColor: item.color }}
        onClick={() => handleItemClick(index)}
      >
        <span className="pattern-emoji">{item.emoji}</span>
        {isShowingPattern && (
          <div className="pattern-number">{index + 1}</div>
        )}
      </div>
    ))
  }

  return (
    <div className="pattern-memory">
      <div className="game-header">
        <div className="game-title">🎯 Pattern Memory</div>
        <div className="game-stats">
          <div className="stat">
            <span className="stat-label">Level</span>
            <span className="stat-value">{level}</span>
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
            <span className="stat-label">Streak</span>
            <span className="stat-value streak">🔥 {streak}</span>
          </div>
        </div>
      </div>

      <div className="game-instructions">
        <div className="message-display">{message}</div>
        <div className="pattern-info">
          {isShowingPattern ? 'Memorize the sequence...' : 'Repeat the pattern in order'}
        </div>
      </div>

      <div className="pattern-grid">
        {renderPattern()}
      </div>

      <div className="game-footer">
        <div className="progress-info">
          <div className="progress-item">
            <span className="progress-label">Pattern Length</span>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${(pattern.length / 10) * 100}%` }}
              />
            </div>
          </div>

          {streak > 0 && (
            <div className="streak-bonus">
              <span className="streak-icon">⚡</span>
              <span className="streak-text">Streak Bonus: +{streak * 50} points</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PatternMemory
