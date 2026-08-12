import React, { useState, useEffect } from 'react'
import './BonusGame.css'

interface BonusGameProps {
  onComplete: (score: number) => void
  duration?: number
}

const BonusGame: React.FC<BonusGameProps> = ({ onComplete, duration = 15 }) => {
  const [timeLeft, setTimeLeft] = useState(duration)
  const [score, setScore] = useState(0)
  const [items, setItems] = useState<Array<{ id: number; x: number; y: number; type: string }>>([])
  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    // Create initial items
    const initialItems = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 80 + 10,
      y: Math.random() * 80 + 10,
      type: ['star', 'heart', 'diamond', 'circle'][Math.floor(Math.random() * 4)]
    }))
    setItems(initialItems)

    // Timer
    if (timeLeft > 0 && isActive) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1)

        // Add new items periodically
        if (timeLeft % 2 === 0) {
          setItems(prev => [
            ...prev,
            {
              id: prev.length,
              x: Math.random() * 80 + 10,
              y: Math.random() * 80 + 10,
              type: ['star', 'heart', 'diamond', 'circle'][Math.floor(Math.random() * 4)]
            }
          ])
        }
      }, 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false)
      onComplete(score)
    }
  }, [timeLeft, isActive])

  const handleItemClick = (id: number) => {
    setScore(prev => prev + 10)
    setItems(prev => prev.filter(item => item.id !== id))

    // Add new item
    setItems(prev => [
      ...prev,
      {
        id: prev.length + 1000,
        x: Math.random() * 80 + 10,
        y: Math.random() * 80 + 10,
        type: ['star', 'heart', 'diamond', 'circle'][Math.floor(Math.random() * 4)]
      }
    ])
  }

  const getItemEmoji = (type: string) => {
    switch (type) {
      case 'star': return '⭐'
      case 'heart': return '❤️'
      case 'diamond': return '💎'
      case 'circle': return '🔴'
      default: return '🎯'
    }
  }

  return (
    <div className="bonus-game">
      <div className="game-header">
        <div className="game-title">🎁 Bonus Game!</div>
        <div className="game-stats">
          <div className="stat">
            <span className="stat-label">Time</span>
            <span className="stat-value">{timeLeft}s</span>
          </div>
          <div className="stat">
            <span className="stat-label">Score</span>
            <span className="stat-value">{score}</span>
          </div>
        </div>
      </div>

      <div className="game-instructions">
        <h2>Tap Everything! 🎯</h2>
        <p>Tap as many items as you can before time runs out!</p>
        <p className="hint">Each item gives you 10 points!</p>
      </div>

      <div className="game-area">
        {items.map(item => (
          <button
            key={item.id}
            className={`game-item ${item.type}`}
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`
            }}
            onClick={() => handleItemClick(item.id)}
          >
            {getItemEmoji(item.type)}
          </button>
        ))}
      </div>

      <div className="game-footer">
        <div className="progress-container">
          <div className="progress-label">Time Remaining</div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${(timeLeft / duration) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default BonusGame
