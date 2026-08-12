import React, { useState, useEffect, useCallback } from 'react'
import './ShapeCatcher.css'

interface Shape {
  id: number
  type: 'circle' | 'square' | 'triangle'
  letter: string
  x: number
  y: number
  speed: number
  isCorrect: boolean
}

interface ShapeCatcherProps {
  onComplete: (score: number) => void
  duration?: number
}

const ShapeCatcher: React.FC<ShapeCatcherProps> = ({ onComplete, duration = 60 }) => {
  const [timeLeft, setTimeLeft] = useState(duration)
  const [score, setScore] = useState(0)
  const [shapes, setShapes] = useState<Shape[]>([])
  const [targetLetter, setTargetLetter] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [lives, setLives] = useState(3)
  const [combo, setCombo] = useState(0)
  const [gameContainer, setGameContainer] = useState<HTMLDivElement | null>(null)
  const [nextShapeId, setNextShapeId] = useState(1)

  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const shapeTypes: ('circle' | 'square' | 'triangle')[] = ['circle', 'square', 'triangle']

  useEffect(() => {
    newTargetLetter()

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

  useEffect(() => {
    if (!isActive) return

    const spawnInterval = setInterval(() => {
      spawnShape()
    }, 800)

    const moveInterval = setInterval(() => {
      moveShapes()
    }, 50)

    return () => {
      clearInterval(spawnInterval)
      clearInterval(moveInterval)
    }
  }, [isActive])

  const newTargetLetter = () => {
    const newLetter = letters[Math.floor(Math.random() * letters.length)]
    setTargetLetter(newLetter)
  }

  const spawnShape = () => {
    if (!gameContainer) return

    const type = shapeTypes[Math.floor(Math.random() * shapeTypes.length)]
    const letter = letters[Math.floor(Math.random() * letters.length)]
    const speed = 1 + Math.random() * 2

    const newShape: Shape = {
      id: nextShapeId,
      type,
      letter,
      x: Math.random() * (gameContainer.clientWidth - 60),
      y: -60,
      speed,
      isCorrect: letter === targetLetter
    }

    setShapes(prev => [...prev, newShape])
    setNextShapeId(prev => prev + 1)
  }

  const moveShapes = () => {
    setShapes(prev => prev.map(shape => {
      const newY = shape.y + shape.speed

      // Check if shape reached bottom
      if (newY > (gameContainer?.clientHeight || 500)) {
        if (shape.isCorrect) {
          setLives(prev => Math.max(0, prev - 1))
          setCombo(0)
        }
        return null
      }

      return { ...shape, y: newY }
    }).filter(Boolean) as Shape[])
  }

  const handleShapeClick = useCallback((shape: Shape) => {
    if (!isActive) return

    if (shape.isCorrect) {
      const points = 10 + (combo * 2)
      setScore(prev => prev + points)
      setCombo(prev => prev + 1)
      setShapes(prev => prev.filter(s => s.id !== shape.id))

      if (combo % 3 === 2) {
        newTargetLetter()
      }
    } else {
      setCombo(0)
      setLives(prev => {
        const newLives = prev - 1
        if (newLives <= 0) {
          setIsActive(false)
          setTimeout(() => onComplete(score), 1000)
        }
        return newLives
      })
    }
  }, [isActive, combo, onComplete, score])

  const renderShape = (shape: Shape) => {
    const shapeClass = `shape ${shape.type} ${shape.isCorrect ? 'correct' : 'incorrect'}`

    return (
      <div
        key={shape.id}
        className={shapeClass}
        style={{
          left: `${shape.x}px`,
          top: `${shape.y}px`,
          animationDelay: `${shape.id * 0.1}s`
        }}
        onClick={() => handleShapeClick(shape)}
      >
        <div className="shape-letter">{shape.letter}</div>
        {shape.isCorrect && <div className="target-indicator">🎯</div>}
      </div>
    )
  }

  const getScoreMultiplier = () => {
    if (combo >= 10) return '3x'
    if (combo >= 5) return '2x'
    return '1x'
  }

  return (
    <div className="shape-catcher">
      <div className="game-header">
        <div className="game-title">🔺 Shape Catcher</div>
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
            <span className="stat-label">Lives</span>
            <span className="stat-value lives">
              {'❤️'.repeat(lives)}
            </span>
          </div>
          <div className="stat">
            <span className="stat-label">Combo</span>
            <span className="stat-value combo">🔥 {combo}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Multiplier</span>
            <span className="stat-value multiplier">{getScoreMultiplier()}</span>
          </div>
        </div>
      </div>

      <div className="game-instructions">
        <div className="target-section">
          <span className="target-label">Target Letter:</span>
          <div className="target-display">
            <span className="target-letter">{targetLetter}</span>
            <div className="target-hint">
              Click shapes with this letter! Catch {combo % 3 === 2 ? 1 : 3 - (combo % 3)} more to change target.
            </div>
          </div>
        </div>

        <div className="instructions-tip">
          <p>✨ Click only shapes with the target letter. Wrong clicks cost lives!</p>
        </div>
      </div>

      <div
        className="game-area"
        ref={setGameContainer}
      >
        {shapes.map(renderShape)}

        {!isActive && (
          <div className="game-over-overlay">
            <div className="game-over-content">
              <h2>{lives > 0 ? 'Time\'s Up!' : 'Game Over!'}</h2>
              <p className="final-score">Final Score: {score}</p>
            </div>
          </div>
        )}
      </div>

      <div className="game-controls">
        <div className="combo-display">
          {combo > 0 && (
            <div className={`combo-meter combo-${Math.min(combo, 10)}`}>
              <div className="combo-info">
                <span className="combo-icon">⚡</span>
                <span className="combo-text">{combo} IN A ROW!</span>
                <span className="combo-bonus">+{combo * 2} bonus per catch</span>
              </div>
              <div className="combo-progress">
                <div
                  className="combo-fill"
                  style={{ width: `${Math.min(combo * 10, 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="lives-display">
          <div className="lives-container">
            <div className="lives-label">Lives:</div>
            <div className="lives-hearts">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className={`heart ${i < lives ? 'active' : 'lost'}`}
                >
                  ❤️
                </div>
              ))}
            </div>
          </div>

          <div className="danger-zone">
            {lives === 1 && (
              <div className="warning-alert">
                ⚠️ Last life! Be careful!
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="game-footer">
        <div className="progress-container">
          <div className="time-progress">
            <div className="progress-label">
              Time: <span className="time-value">{timeLeft}s</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${(timeLeft / duration) * 100}%` }}
              />
            </div>
          </div>

          <div className="shape-guide">
            <div className="guide-title">Shape Guide:</div>
            <div className="shape-examples">
              <div className="shape-example">
                <div className="example-circle shape-example-item">A</div>
                <div className="example-label">Correct Letter</div>
              </div>
              <div className="shape-example">
                <div className="example-square shape-example-item incorrect">B</div>
                <div className="example-label">Wrong Letter</div>
              </div>
              <div className="shape-example">
                <div className="example-triangle shape-example-item correct">C</div>
                <div className="example-label">Target Letter</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShapeCatcher
