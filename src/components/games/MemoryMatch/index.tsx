import React, { useState, useEffect } from 'react'
import { wordBank } from '../../../services/wordBank'
import './MemoryMatch.css'

interface Card {
  id: number
  content: string
  type: 'word' | 'meaning'
  matchedWord: string
  flipped: boolean
  matched: boolean
}

interface MemoryMatchProps {
  onComplete: (score: number) => void
  gridSize?: number
  words?: any[]
}

const MemoryMatch: React.FC<MemoryMatchProps> = ({ onComplete, gridSize = 4, words: providedWords }) => {
  const [cards, setCards] = useState<Card[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [matches, setMatches] = useState(0)
  const [moves, setMoves] = useState(0)
  const [gameComplete, setGameComplete] = useState(false)
  const [isChecking, setIsChecking] = useState(false)

  useEffect(() => {
    initializeGame()
  }, [providedWords])

  useEffect(() => {
    if (matches === (gridSize * gridSize) / 2) {
      setGameComplete(true)
      const score = calculateScore()
      setTimeout(() => onComplete(score), 1000)
    }
  }, [matches])

  const initializeGame = () => {
    const totalPairs = (gridSize * gridSize) / 2
    let words = []
    
    if (providedWords && providedWords.length >= totalPairs) {
      words = [...providedWords].sort(() => 0.5 - Math.random()).slice(0, totalPairs)
    } else {
      words = wordBank.getRandomWords(totalPairs)
    }

    const cardPairs: Card[] = []

    words.forEach((word, index) => {
      // Word card
      cardPairs.push({
        id: index * 2,
        content: word.word,
        type: 'word',
        matchedWord: word.word,
        flipped: false,
        matched: false
      })

      // Meaning card
      cardPairs.push({
        id: index * 2 + 1,
        content: word.meaning,
        type: 'meaning',
        matchedWord: word.word,
        flipped: false,
        matched: false
      })
    })

    // Shuffle cards
    const shuffled = [...cardPairs].sort(() => Math.random() - 0.5)
    setCards(shuffled)
  }

  const handleCardClick = (id: number) => {
    if (isChecking || gameComplete) return
    if (flippedCards.length >= 2) return
    if (flippedCards.includes(id)) return

    const clickedCard = cards.find(card => card.id === id)
    if (!clickedCard || clickedCard.matched) return

    setCards(prev =>
      prev.map(card =>
        card.id === id ? { ...card, flipped: true } : card
      )
    )

    const newFlipped = [...flippedCards, id]
    setFlippedCards(newFlipped)

    if (newFlipped.length === 2) {
      setIsChecking(true)
      setMoves(prev => prev + 1)

      setTimeout(() => {
        checkForMatch(newFlipped)
      }, 1000)
    }
  }

  const checkForMatch = (flippedIds: number[]) => {
    const [id1, id2] = flippedIds
    const card1 = cards.find(c => c.id === id1)
    const card2 = cards.find(c => c.id === id2)

    if (card1 && card2 && card1.matchedWord === card2.matchedWord) {
      // Match found
      setCards(prev =>
        prev.map(card =>
          flippedIds.includes(card.id)
            ? { ...card, matched: true, flipped: true }
            : card
        )
      )
      setMatches(prev => prev + 1)
    } else {
      // No match, flip back
      setCards(prev =>
        prev.map(card =>
          flippedIds.includes(card.id)
            ? { ...card, flipped: false }
            : card
        )
      )
    }

    setFlippedCards([])
    setIsChecking(false)
  }

  const calculateScore = () => {
    const baseScore = matches * 100
    const moveBonus = Math.max(0, 500 - (moves * 10))
    const timeBonus = 200
    return baseScore + moveBonus + timeBonus
  }

  const getCardEmoji = (type: 'word' | 'meaning') => {
    return type === 'word' ? '🔤' : '📖'
  }

  return (
    <div className="memory-match">
      <div className="game-header">
        <div className="game-title">🧠 Memory Match</div>
        <div className="game-stats">
          <div className="stat">
            <span className="stat-label">Matches</span>
            <span className="stat-value">{matches}/{(gridSize * gridSize) / 2}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Moves</span>
            <span className="stat-value">{moves}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Score</span>
            <span className="stat-value">{calculateScore()}</span>
          </div>
        </div>
      </div>

      <div className="game-instructions">
        <p>Match words with their meanings!</p>
        <p className="hint">Find all pairs to win!</p>
      </div>

      <div className={`game-grid grid-${gridSize}`}>
        {cards.map(card => (
          <button
            key={card.id}
            className={`memory-card ${
              card.flipped ? 'flipped' : ''
            } ${card.matched ? 'matched' : ''} ${
              flippedCards.includes(card.id) ? 'selected' : ''
            }`}
            onClick={() => handleCardClick(card.id)}
            disabled={card.matched || card.flipped || isChecking}
          >
            <div className="card-front">
              <span className="card-emoji">❓</span>
            </div>
            <div className="card-back">
              <div className="card-type">{getCardEmoji(card.type)}</div>
              <div className="card-content">
                {card.type === 'word' ? (
                  <span className="word-text">{card.content}</span>
                ) : (
                  <span className="meaning-text">{card.content}</span>
                )}
              </div>
              {card.matched && (
                <div className="match-indicator">✅</div>
              )}
            </div>
          </button>
        ))}
      </div>

      <div className="game-controls">
        <button
          className="reset-button"
          onClick={initializeGame}
        >
          Restart Game
        </button>

        <div className="game-info">
          {gameComplete ? (
            <div className="completion-message">
              🎉 Game Complete! Score: {calculateScore()}
            </div>
          ) : (
            <div className="current-status">
              {isChecking ? 'Checking...' : `Find the matches! ${flippedCards.length}/2 cards flipped`}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MemoryMatch
