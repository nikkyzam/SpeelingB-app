import React, { useState, useEffect, useCallback } from 'react'
import './PuzzleSlider.css'

interface Tile {
  id: number
  number: number
  row: number
  col: number
  isCorrect: boolean
}

interface PuzzleSliderProps {
  onComplete: (score: number) => void
  gridSize?: 3 | 4 | 5
}

const PuzzleSlider: React.FC<PuzzleSliderProps> = ({ onComplete, gridSize = 4 }) => {
  const [tiles, setTiles] = useState<Tile[]>([])
  const [moves, setMoves] = useState(0)
  const [timeLeft, setTimeLeft] = useState(300)
  const [score, setScore] = useState(0)
  const [isActive, setIsActive] = useState(true)
  const [emptyPosition, setEmptyPosition] = useState({ row: gridSize - 1, col: gridSize - 1 })
  const [isSolved, setIsSolved] = useState(false)
  const [hintAvailable, setHintAvailable] = useState(true)

  useEffect(() => {
    initializePuzzle()
  }, [gridSize])

  useEffect(() => {
    if (isActive && timeLeft > 0 && !isSolved) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && isActive && !isSolved) {
      endGame()
    }
  }, [timeLeft, isActive, isSolved])

  const initializePuzzle = () => {
    const totalTiles = gridSize * gridSize - 1
    const numbers = Array.from({ length: totalTiles }, (_, i) => i + 1)
    numbers.sort(() => Math.random() - 0.5)

    const newTiles: Tile[] = []
    let id = 1

    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        if (row === gridSize - 1 && col === gridSize - 1) {
          // Empty space
          setEmptyPosition({ row, col })
        } else {
          const number = numbers[(row * gridSize) + col]
          newTiles.push({
            id: id++,
            number,
            row,
            col,
            isCorrect: number === (row * gridSize) + col + 1
          })
        }
      }
    }

    setTiles(newTiles)
    setMoves(0)
    setIsSolved(false)
  }

  const canMove = useCallback((tile: Tile): boolean => {
    const rowDiff = Math.abs(tile.row - emptyPosition.row)
    const colDiff = Math.abs(tile.col - emptyPosition.col)
    return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1)
  }, [emptyPosition])

  const moveTile = useCallback((tile: Tile) => {
    if (!canMove(tile) || isSolved || !isActive) return

    const newTiles = tiles.map(t => {
      if (t.id === tile.id) {
        return {
          ...t,
          row: emptyPosition.row,
          col: emptyPosition.col,
          isCorrect: t.number === (emptyPosition.row * gridSize) + emptyPosition.col + 1
        }
      }
      return t
    })

    setEmptyPosition({ row: tile.row, col: tile.col })
    setTiles(newTiles)
    setMoves(prev => prev + 1)

    // Check if solved
    checkIfSolved(newTiles)
  }, [tiles, emptyPosition, canMove, isSolved, isActive, gridSize])

  const checkIfSolved = (currentTiles: Tile[]) => {
    const sorted = [...currentTiles].sort((a, b) => a.id - b.id)
    const isComplete = sorted.every((tile, index) =>
      tile.number === index + 1
    )

    if (isComplete) {
      setIsSolved(true)
      calculateScore()
    }
  }

  const calculateScore = () => {
    const baseScore = 1000
    const moveBonus = Math.max(0, 500 - moves * 5)
    const timeBonus = Math.floor(timeLeft * 3)
    const gridBonus = gridSize * 200
    const total = baseScore + moveBonus + timeBonus + gridBonus

    setScore(total)

    setTimeout(() => {
      onComplete(total)
    }, 2000)
  }

  const getHint = () => {
    if (!hintAvailable) return

    // Find a tile that can move
    const movableTile = tiles.find(tile => canMove(tile))
    if (movableTile) {
      // Highlight the tile
      const tileElement = document.querySelector(`.tile-${movableTile.id}`)
      if (tileElement) {
        tileElement.classList.add('hinted')
        setTimeout(() => {
          tileElement.classList.remove('hinted')
        }, 1000)
      }
    }

    setHintAvailable(false)
    setTimeout(() => setHintAvailable(true), 30000)
  }

  const endGame = () => {
    setIsActive(false)
    onComplete(score)
  }

  const renderTile = (tile: Tile) => {
    const positionClass = `tile-${tile.id}`
    const isMovable = canMove(tile)

    return (
      <button
        key={tile.id}
        className={`tile ${positionClass} ${isMovable ? 'movable' : ''} ${tile.isCorrect ? 'correct' : ''}`}
        style={{
          gridRow: tile.row + 1,
          gridColumn: tile.col + 1
        }}
        onClick={() => moveTile(tile)}
        disabled={!isMovable || !isActive || isSolved}
      >
        <span className="tile-number">{tile.number}</span>
        {isMovable && <div className="move-indicator">↕️</div>}
      </button>
    )
  }

  return (
    <div className="puzzle-slider">
      <div className="game-header">
        <div className="game-title">🧩 Puzzle Slider</div>
        <div className="game-stats">
          <div className="stat">
            <span className="stat-label">Time</span>
            <span className="stat-value">{timeLeft}s</span>
          </div>
          <div className="stat">
            <span className="stat-label">Moves</span>
            <span className="stat-value">{moves}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Score</span>
            <span className="stat-value">{score}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Grid</span>
            <span className="stat-value">{gridSize}x{gridSize}</span>
          </div>
        </div>
      </div>

      <div className="game-instructions">
        <p>Arrange numbers in order! Slide tiles into the empty space.</p>
        <div className="hint">Only tiles adjacent to the empty space can move</div>
      </div>

      <div className="puzzle-container">
        <div
          className="puzzle-grid"
          style={{
            gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
            gridTemplateRows: `repeat(${gridSize}, 1fr)`
          }}
        >
          {tiles.map(renderTile)}
          <div
            className="empty-space"
            style={{
              gridRow: emptyPosition.row + 1,
              gridColumn: emptyPosition.col + 1
            }}
          />
        </div>
      </div>

      {isSolved && (
        <div className="solved-overlay">
          <div className="solved-message">
            <h2>🎉 Puzzle Solved!</h2>
            <p className="score">Score: {score}</p>
            <p className="stats">
              Moves: {moves} | Time: {300 - timeLeft}s
            </p>
          </div>
        </div>
      )}

      <div className="game-controls">
        <button
          className="hint-btn"
          onClick={getHint}
          disabled={!hintAvailable || isSolved}
        >
          {hintAvailable ? '💡 Get Hint' : '⏳ Hint in 30s'}
        </button>

        <button
          className="reset-btn"
          onClick={initializePuzzle}
          disabled={!isActive}
        >
          🔄 Restart Puzzle
        </button>
      </div>

      <div className="game-progress">
        <div className="progress-section">
          <div className="progress-label">Puzzle Progress</div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${(tiles.filter(t => t.isCorrect).length / (gridSize * gridSize - 1)) * 100}%`
              }}
            />
          </div>
          <div className="progress-text">
            {tiles.filter(t => t.isCorrect).length} of {gridSize * gridSize - 1} in place
          </div>
        </div>
      </div>

      <div className="game-footer">
        <div className="scoring-info">
          <div className="score-item">🎯 Base Score: 1000</div>
          <div className="score-item">⚡ Move Bonus: {Math.max(0, 500 - moves * 5)}</div>
          <div className="score-item">⏰ Time Bonus: {Math.floor(timeLeft * 3)}</div>
        </div>
      </div>
    </div>
  )
}

export default PuzzleSlider
