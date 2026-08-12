import React, { useState, useEffect } from 'react'
import { wordBank } from '../../../services/wordBank'
import './BalloonPop.css'

interface Balloon {
  id: number
  letter: string
  order: number
  popped: boolean
  x: number
  y: number
}

interface BalloonPopProps {
  onComplete: (score: number) => void
  wordCount?: number
  words?: any[]
}

const BalloonPop: React.FC<BalloonPopProps> = ({ onComplete, wordCount = 3, words: providedWords }) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [gameWords, setGameWords] = useState<string[]>([])
  const [balloons, setBalloons] = useState<Balloon[]>([])
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [gameComplete, setGameComplete] = useState(false)
  const [mistakes, setMistakes] = useState(0)

  useEffect(() => {
    initializeGame()
  }, [providedWords])

  useEffect(() => {
    if (currentWordIndex >= gameWords.length && gameWords.length > 0) {
      setGameComplete(true)
      const finalScore = calculateScore()
      setTimeout(() => onComplete(finalScore), 1000)
    }
  }, [currentWordIndex, gameWords.length])

  const initializeGame = () => {
    let wordList = []
    if (providedWords && providedWords.length > 0) {
      const selected = [...providedWords].sort(() => 0.5 - Math.random()).slice(0, wordCount)
      wordList = selected.map(w => w.word.toUpperCase())
    } else {
      const randomWords = wordBank.getRandomWords(wordCount, 1)
      wordList = randomWords.map(w => w.word.toUpperCase())
    }
    
    setGameWords(wordList)
    if (wordList.length > 0) {
      setupWord(wordList[0])
    }
    setCurrentWordIndex(0)
    setCurrentLetterIndex(0)
    setScore(0)
    setStreak(0)
    setMistakes(0)
    setGameComplete(false)
  }

  const setupWord = (word: string) => {
    const letters = word.split('')
    const newBalloons: Balloon[] = letters.map((letter, index) => ({
      id: Date.now() + index,
      letter,
      order: index,
      popped: false,
      x: Math.random() * 70 + 15,
      y: Math.random() * 60 + 20
    })).sort(() => Math.random() - 0.5) // Shuffle positions

    setBalloons(newBalloons)
    setCurrentLetterIndex(0)
  }

  const handleBalloonClick = (balloon: Balloon) => {
    if (balloon.popped) return
    if (gameComplete) return

    const currentWord = gameWords[currentWordIndex]
    const currentLetter = currentWord[currentLetterIndex]

    if (balloon.letter === currentLetter) {
      // Correct letter
      setBalloons(prev =>
        prev.map(b =>
          b.id === balloon.id ? { ...b, popped: true } : b
        )
      )

      setCurrentLetterIndex(prev => prev + 1)
      setStreak(prev => prev + 1)
      setScore(prev => prev + (10 * (streak + 1)))

      // Check if word is complete
      if (currentLetterIndex + 1 >= currentWord.length) {
        setTimeout(() => {
          setCurrentWordIndex(prev => prev + 1)
          if (currentWordIndex + 1 < gameWords.length) {
            setupWord(gameWords[currentWordIndex + 1])
          }
        }, 500)
      }
    } else {
      // Wrong letter
      setStreak(0)
      setMistakes(prev => prev + 1)

      // Visual feedback for wrong click
      setBalloons(prev =>
        prev.map(b =>
          b.id === balloon.id
            ? { ...b, letter: '❌', popped: true }
            : b
        )
      )

      setTimeout(() => {
        setBalloons(prev => prev.filter(b => b.id !== balloon.id))
      }, 300)
    }
  }

  const calculateScore = () => {
    const baseScore = score
    const streakBonus = streak * 5
    const mistakePenalty = mistakes * 10
    const completionBonus = gameWords.length * 50

    return Math.max(0, baseScore + streakBonus - mistakePenalty + completionBonus)
  }

  const getCurrentWord = () => {
    if (currentWordIndex >= gameWords.length) return ''
    return gameWords[currentWordIndex]
  }

  const getCompletedLetters = () => {
    const word = getCurrentWord()
    return word ? word.substring(0, currentLetterIndex) : ''
  }

  const getRemainingLetters = () => {
    const word = getCurrentWord()
    return word ? word.substring(currentLetterIndex) : ''
  }

  return (
    <div className="balloon-pop">
      <div className="game-header">
        <div className="game-title">🎈 Balloon Pop</div>
        <div className="game-stats">
          <div className="stat">
            <span className="stat-label">Word</span>
            <span className="stat-value">{currentWordIndex + 1}/{gameWords.length}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Score</span>
            <span className="stat-value">{score}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Streak</span>
            <span className="stat-value streak">🔥 {streak}</span>
          </div>
        </div>
      </div>

      <div className="game-instructions">
        <p>Pop balloons in the correct order to spell the word!</p>
        <div className="current-word">
          <span className="completed">{getCompletedLetters()}</span>
          <span className="next-letter">{getRemainingLetters().charAt(0)}</span>
          <span className="remaining">{getRemainingLetters().substring(1)}</span>
        </div>
        <p className="hint">Next letter: <strong>{getRemainingLetters().charAt(0) || '🎉'}</strong></p>
      </div>

      <div className="game-area">
        {balloons.map(balloon => (
          <button
            key={balloon.id}
            className={`balloon ${balloon.popped ? 'popped' : ''} ${
              balloon.letter === getRemainingLetters().charAt(0) ? 'next' : ''
            }`}
            style={{
              left: `${balloon.x}%`,
              top: `${balloon.y}%`,
              animationDelay: `${balloon.order * 0.2}s`
            }}
            onClick={() => handleBalloonClick(balloon)}
            disabled={balloon.popped || gameComplete}
          >
            <div className="balloon-string" />
            <div className="balloon-body">
              {balloon.popped ? (
                <span className="popped-text">💥</span>
              ) : (
                <span className="balloon-letter">{balloon.letter}</span>
              )}
            </div>
          </button>
        ))}

        {streak > 3 && (
          <div className="streak-alert">
            <span className="streak-icon">🔥</span>
            <span className="streak-text">Amazing! {streak} in a row!</span>
          </div>
        )}
      </div>

      <div className="game-controls">
        <button
          className="skip-button"
          onClick={() => {
            if (currentWordIndex < gameWords.length - 1) {
              setCurrentWordIndex(prev => prev + 1)
              setupWord(gameWords[currentWordIndex + 1])
              setStreak(0)
            }
          }}
          disabled={gameComplete || currentWordIndex >= gameWords.length - 1}
        >
          Skip Word
        </button>

        <div className="progress-container">
          <div className="progress-label">
            Progress: {currentWordIndex + 1} of {gameWords.length} words
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${((currentWordIndex * 100) + (currentLetterIndex / getCurrentWord().length * 100)) / gameWords.length}%`
              }}
            />
          </div>
        </div>
      </div>

      {gameComplete && (
        <div className="completion-screen">
          <h2>🎉 Level Complete!</h2>
          <div className="final-score">
            Final Score: <span className="score-value">{calculateScore()}</span>
          </div>
          <button
            className="play-again-button"
            onClick={initializeGame}
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  )
}

export default BalloonPop
