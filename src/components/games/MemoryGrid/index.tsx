import React, { useState, useEffect, useCallback } from 'react'
import './MemoryGrid.css'

interface Cell {
  id: number
  emoji: string
  isRevealed: boolean
  isMatched: boolean
  row: number
  col: number
}

interface MemoryGridProps {
  onComplete: (score: number) => void
  gridSize?: 4 | 6 | 8
}

const MemoryGrid: React.FC<MemoryGridProps> = ({ onComplete, gridSize = 6 }) => {
  const [grid, setGrid] = useState<Cell[][]>([])
  const [selectedCells, setSelectedCells] = useState<Cell[]>([])
  const [matches, setMatches] = useState(0)
  const [moves, setMoves] = useState(0)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(180)
  const [isActive, setIsActive] = useState(true)
  const [isShowing, setIsShowing] = useState(true)
  const [level, setLevel] = useState(1)

  const emojis = ['🌟', '🎮', '🎨', '🎵', '🎪', '🎭', '🎯', '🎲', '🎪', '🦄', '🐲', '🌈', '✨', '🎊', '🎉', '🎁']

  useEffect(() => {
    initializeGrid()

    if (isActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && isActive) {
      endGame()
    }
  }, [timeLeft, isActive])

  useEffect(() => {
    // Show all cells for 3 seconds at start
    if (isShowing) {
      const timer = setTimeout(() => {
        setIsShowing(false)
        hideAllCells()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [isShowing])

  useEffect(() => {
    if (matches === (gridSize * gridSize) / 2 && isActive) {
      levelUp()
    }
  }, [matches, gridSize, isActive])

  const initializeGrid = () => {
    const totalPairs = (gridSize * gridSize) / 2
    const selectedEmojis = emojis.slice(0, totalPairs)
    const allEmojis = [...selectedEmojis, ...selectedEmojis]
      .sort(() => Math.random() - 0.5)

    const newGrid: Cell[][] = []
    let id = 1

    for (let row = 0; row < gridSize; row++) {
      const newRow: Cell[] = []
      for (let col = 0; col < gridSize; col++) {
        newRow.push({
          id: id++,
          emoji: allEmojis[row * gridSize + col],
          isRevealed: isShowing,
          isMatched: false,
          row,
          col
        })
      }
      newGrid.push(newRow)
    }

    setGrid(newGrid)
    setSelectedCells([])
    setMatches(0)
    setMoves(0)
  }

  const hideAllCells = () => {
    setGrid(prev => prev.map(row =>
      row.map(cell => ({ ...cell, isRevealed: false }))
    ))
  }

  const handleCellClick = useCallback((cell: Cell) => {
    if (!isActive || isShowing || cell.isRevealed || cell.isMatched) return

    if (selectedCells.length < 2) {
      // Reveal cell
      const newGrid = [...grid]
      newGrid[cell.row][cell.col].isRevealed = true
      setGrid(newGrid)

      const newSelected = [...selectedCells, cell]
      setSelectedCells(newSelected)

      if (newSelected.length === 2) {
        setMoves(prev => prev + 1)

        // Check for match
        if (newSelected[0].emoji === newSelected[1].emoji) {
          // Match found
          setTimeout(() => {
            const updatedGrid = [...grid]
            updatedGrid[newSelected[0].row][newSelected[0].col].isMatched = true
            updatedGrid[newSelected[1].row][newSelected[1].col].isMatched = true
            setGrid(updatedGrid)

            const matchBonus = Math.max(100 - moves, 20)
            const levelBonus = level * 50
            const newScore = score + matchBonus + levelBonus
            setScore(newScore)
            setMatches(prev => prev + 1)
            setSelectedCells([])
          }, 500)
        } else {
          // No match - hide after delay
          setTimeout(() => {
            const updatedGrid = [...grid]
            updatedGrid[newSelected[0].row][newSelected[0].col].isRevealed = false
            updatedGrid[newSelected[1].row][newSelected[1].col].isRevealed = false
            setGrid(updatedGrid)
            setSelectedCells([])
          }, 1000)
        }
      }
    }
  }, [grid, isActive, isShowing, selectedCells, score, level])

  const levelUp = () => {
    const levelBonus = level * 200
    const timeBonus = Math.floor(timeLeft * 5)
    const moveBonus = Math.max(0, 500 - moves * 2)
    const newScore = score + levelBonus + timeBonus + moveBonus

    setScore(newScore)

    if (level < 3) {
      setLevel(prev => prev + 1)
      setTimeLeft(180)
      setIsShowing(true)
      setTimeout(() => {
        initializeGrid()
      }, 2000)
    } else {
      endGame()
    }
  }

  const endGame = () => {
    setIsActive(false)
    const finalScore = score + (matches * 100) + (level * 500)
    setTimeout(() => onComplete(finalScore), 2000)
  }

  return (
    <div className="memory-grid">
      <div className="game-header">
        <div className="game-title">🧠 Memory Grid</div>
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
            <span className="stat-label">Time</span>
            <span className="stat-value">{timeLeft}s</span>
          </div>
          <div className="stat">
            <span className="stat-label">Matches</span>
            <span className="stat-value">{matches}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Moves</span>
            <span className="stat-value">{moves}</span>
          </div>
        </div>
      </div>

      <div className="game-instructions">
        {isShowing ? (
          <p>Memorize the positions! They will hide in 3 seconds...</p>
        ) : (
          <p>Find matching pairs! Level {level} - {gridSize}x{gridSize} Grid</p>
        )}
        {!isShowing && (
          <div className="hint">Click two cells to reveal them</div>
        )}
      </div>

      <div className="grid-container">
        <div className={`grid grid-${gridSize}`}>
          {grid.map((row, rowIndex) => (
            <div key={rowIndex} className="grid-row">
              {row.map(cell => (
                <button
                  key={cell.id}
                  className={`grid-cell ${cell.isRevealed ? 'revealed' : ''} ${cell.isMatched ? 'matched' : ''}`}
                  onClick={() => handleCellClick(cell)}
                  disabled={!isActive || isShowing || cell.isMatched}
                >
                  {cell.isRevealed || cell.isMatched ? (
                    <span className="cell-emoji">{cell.emoji}</span>
                  ) : (
                    <span className="cell-hidden">?</span>
                  )}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="game-progress">
        <div className="progress-section">
          <div className="progress-label">Level Progress</div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${(matches / ((gridSize * gridSize) / 2)) * 100}%` }}
            />
          </div>
        </div>

        <div className="match-bonus">
          {selectedCells.length === 2 && (
            <div className="match-check">
              {selectedCells[0].emoji === selectedCells[1].emoji ? '✅ Match!' : '❌ Try Again'}
            </div>
          )}
        </div>
      </div>

      <div className="game-footer">
        <div className="tips">
          <div className="tip">🎯 Fewer moves = more points!</div>
          <div className="tip">⚡ Time bonus for quick completion!</div>
          <div className="tip">🏆 Complete all 3 levels!</div>
        </div>
      </div>
    </div>
  )
}

export default MemoryGrid
