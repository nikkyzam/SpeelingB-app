import React, { useState, useEffect } from 'react'
import { bibleApi, BibleVersion, POPULAR_VERSES } from '../../../services/bibleApi'
import './BibleMemorizer.css'

interface MemorizationStage {
  level: number
  name: string
  missingWords: number
  timeLimit: number
  pointsMultiplier: number
}

interface BibleMemorizerProps {
  onComplete: (score: number) => void
  version?: BibleVersion
}

const BibleMemorizer: React.FC<BibleMemorizerProps> = ({ onComplete, version = 'KJV' }) => {
  const [currentVerse, setCurrentVerse] = useState<any>(null)
  const [currentStage, setCurrentStage] = useState<MemorizationStage>({
    level: 1,
    name: 'Beginner',
    missingWords: 2,
    timeLimit: 90,
    pointsMultiplier: 1
  })
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [stageComplete, setStageComplete] = useState(false)
  const [missingWords, setMissingWords] = useState<string[]>([])
  const [userInputs, setUserInputs] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [accuracy, setAccuracy] = useState(0)
  const [totalAttempts, setTotalAttempts] = useState(0)
  const [correctAttempts, setCorrectAttempts] = useState(0)
  const [showHint, setShowHint] = useState(false)

  const stages: MemorizationStage[] = [
    { level: 1, name: 'Beginner', missingWords: 2, timeLimit: 90, pointsMultiplier: 1 },
    { level: 2, name: 'Intermediate', missingWords: 4, timeLimit: 75, pointsMultiplier: 1.5 },
    { level: 3, name: 'Advanced', missingWords: 6, timeLimit: 60, pointsMultiplier: 2 },
    { level: 4, name: 'Expert', missingWords: 8, timeLimit: 45, pointsMultiplier: 3 }
  ]

  useEffect(() => {
    initializeGame()
  }, [version])

  useEffect(() => {
    if (timeLeft > 0 && !stageComplete) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !stageComplete) {
      handleTimeOut()
    }
  }, [timeLeft, stageComplete])

  const initializeGame = async () => {
    setIsLoading(true)
    try {
      // Get a random popular verse
      const randomVerse = POPULAR_VERSES[Math.floor(Math.random() * POPULAR_VERSES.length)]
      const verseData = await bibleApi.getVerse(randomVerse.reference, version)

      setCurrentVerse({
        ...verseData,
        category: randomVerse.category
      })

      setCurrentStage(stages[0])
      setTimeLeft(stages[0].timeLimit)
      generateMissingWords(verseData.text, stages[0].missingWords)
      setStageComplete(false)
      setShowHint(false)
    } catch (error) {
      console.error('Error initializing game:', error)
      // Fallback verse
      setCurrentVerse({
        reference: 'John 3:16',
        text: 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.',
        category: 'salvation'
      })
      generateMissingWords('For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.', stages[0].missingWords)
    } finally {
      setIsLoading(false)
    }
  }

  const generateMissingWords = (text: string, count: number) => {
    const words = text.split(' ')
    const wordCount = words.length

    // Don't remove too many words
    const actualCount = Math.min(count, Math.floor(wordCount / 3))

    const missingIndices = new Set<number>()
    while (missingIndices.size < actualCount) {
      missingIndices.add(Math.floor(Math.random() * wordCount))
    }

    const missing = Array.from(missingIndices).map(i => words[i])
    setMissingWords(missing)
    setUserInputs(Array(actualCount).fill(''))
  }

  const handleInputChange = (index: number, value: string) => {
    const newInputs = [...userInputs]
    newInputs[index] = value
    setUserInputs(newInputs)

    // Check if all inputs are filled
    if (newInputs.every(input => input.trim() !== '')) {
      checkAnswers(newInputs)
    }
  }

  const checkAnswers = (inputs: string[]) => {
    let correct = 0
    inputs.forEach((input, index) => {
      const cleanInput = input.trim().toLowerCase().replace(/[.,;!?]/g, '')
      const cleanMissing = missingWords[index].toLowerCase().replace(/[.,;!?]/g, '')

      if (cleanInput === cleanMissing) {
        correct++
      }
    })

    const newAccuracy = correct / inputs.length
    const attempts = totalAttempts + 1
    const corrects = correctAttempts + (newAccuracy >= 0.7 ? 1 : 0)

    setTotalAttempts(attempts)
    setCorrectAttempts(corrects)
    setAccuracy(Math.round((corrects / attempts) * 100))

    if (newAccuracy >= 0.7) {
      handleStageComplete(newAccuracy)
    } else {
      handleStageFail(newAccuracy)
    }
  }

  const handleStageComplete = (accuracy: number) => {
    setStageComplete(true)

    const basePoints = 100
    const accuracyBonus = Math.floor(accuracy * 100)
    const timeBonus = Math.floor((timeLeft / currentStage.timeLimit) * 100)
    const levelBonus = currentStage.level * 50
    const multiplier = currentStage.pointsMultiplier

    const points = Math.floor((basePoints + accuracyBonus + timeBonus + levelBonus) * multiplier)
    setScore(prev => prev + points)

    // Move to next stage after delay
    setTimeout(() => {
      if (currentStage.level < stages.length) {
        nextStage()
      } else {
        endGame()
      }
    }, 3000)
  }

  const handleStageFail = (accuracy: number) => {
    setStageComplete(true)
    // Allow retry with hint
    setShowHint(true)

    setTimeout(() => {
      // Reset for retry
      setUserInputs(Array(missingWords.length).fill(''))
      setStageComplete(false)
      setShowHint(false)
    }, 3000)
  }

  const handleTimeOut = () => {
    setStageComplete(true)
    setTimeout(() => {
      if (currentStage.level > 1) {
        // Go back a level on timeout
        const prevStage = stages[currentStage.level - 2]
        setCurrentStage(prevStage)
        setTimeLeft(prevStage.timeLimit)
        generateMissingWords(currentVerse.text, prevStage.missingWords)
        setStageComplete(false)
      } else {
        endGame()
      }
    }, 2000)
  }

  const nextStage = () => {
    const nextStageIndex = currentStage.level
    if (nextStageIndex < stages.length) {
      const nextStage = stages[nextStageIndex]
      setCurrentStage(nextStage)
      setTimeLeft(nextStage.timeLimit)
      generateMissingWords(currentVerse.text, nextStage.missingWords)
      setStageComplete(false)
      setShowHint(false)
    } else {
      endGame()
    }
  }

  const endGame = () => {
    const accuracyBonus = Math.floor(accuracy * 2)
    const stageBonus = currentStage.level * 100
    const finalScore = score + accuracyBonus + stageBonus

    setTimeout(() => onComplete(finalScore), 2000)
  }

  const renderVerseWithBlanks = () => {
    if (!currentVerse) return null

    const words = currentVerse.text.split(' ')
    let blankIndex = 0
    let wordIndex = 0

    return words.map((word: string, index: number) => {
      if (missingWords[blankIndex] === word) {
        const inputIndex = blankIndex
        blankIndex++

        const isCorrect = stageComplete && userInputs[inputIndex].toLowerCase() === word.toLowerCase()
        const isIncorrect = stageComplete && userInputs[inputIndex] && !isCorrect

        return (
          <span key={index} className="word-container">
            <input
              type="text"
              value={userInputs[inputIndex]}
              onChange={(e) => handleInputChange(inputIndex, e.target.value)}
              className={`verse-input ${isCorrect ? 'correct' : isIncorrect ? 'incorrect' : ''}`}
              disabled={stageComplete}
              style={{ width: `${Math.max(60, word.length * 10)}px` }}
            />
            {showHint && (
              <div className="word-hint">{word}</div>
            )}
          </span>
        )
      }

      return (
        <span key={index} className="verse-word">
          {word}{' '}
        </span>
      )
    })
  }

  if (isLoading) {
    return (
      <div className="bible-memorizer-loading">
        <div className="loading-content">
          <div className="loading-icon">🙏</div>
          <div className="loading-text">Preparing Scripture...</div>
          <div className="loading-subtext">"Your word is a lamp to my feet" - Psalm 119:105</div>
        </div>
      </div>
    )
  }

  return (
    <div className="bible-memorizer">
      <div className="game-header">
        <div className="header-top">
          <div className="game-title">
            <span className="title-icon">💭</span>
            Bible Memorizer
          </div>
          <div className="version-info">
            <span className="version-label">Version:</span>
            <span className="version-name">{version}</span>
          </div>
        </div>

        <div className="game-stats">
          <div className="stat">
            <span className="stat-label">Stage</span>
            <span className="stat-value stage-badge">
              {currentStage.level} - {currentStage.name}
            </span>
          </div>
          <div className="stat">
            <span className="stat-label">Time</span>
            <span className="stat-value time-left">{timeLeft}s</span>
          </div>
          <div className="stat">
            <span className="stat-label">Score</span>
            <span className="stat-value">{score}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Accuracy</span>
            <span className="stat-value">{accuracy}%</span>
          </div>
          <div className="stat">
            <span className="stat-label">Multiplier</span>
            <span className="stat-value multiplier">x{currentStage.pointsMultiplier}</span>
          </div>
        </div>
      </div>

      <div className="verse-section">
        <div className="verse-header">
          <div className="verse-reference">
            <span className="reference-icon">📜</span>
            <span className="reference-text">{currentVerse?.reference}</span>
            <span className="verse-category">{currentVerse?.category}</span>
          </div>
          <div className="stage-info">
            <div className="stage-progress">
              <div className="stage-label">Memorization Level</div>
              <div className="stage-levels">
                {stages.map(stage => (
                  <div
                    key={stage.level}
                    className={`stage-level ${stage.level === currentStage.level ? 'active' : stage.level < currentStage.level ? 'completed' : ''}`}
                  >
                    {stage.level}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="verse-display">
          <div className="verse-text">
            {renderVerseWithBlanks()}
          </div>

          {stageComplete && (
            <div className="verse-feedback">
              <div className="feedback-icon">⭐</div>
              <div className="feedback-text">
                {missingWords.length} words to memorize
              </div>
            </div>
          )}
        </div>

        <div className="memorization-help">
          <div className="help-tip">
            <span className="tip-icon">💡</span>
            <span className="tip-text">Type the missing words to complete the verse</span>
          </div>
          <div className="help-tip">
            <span className="tip-icon">🎯</span>
            <span className="tip-text">70% accuracy needed to advance to next level</span>
          </div>
          <div className="help-tip">
            <span className="tip-icon">⚡</span>
            <span className="tip-text">Time bonus decreases as timer runs out</span>
          </div>
        </div>
      </div>

      <div className="stage-progress-section">
        <div className="progress-info">
          <div className="progress-item">
            <div className="progress-label">Stage Progress</div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${(currentStage.level / stages.length) * 100}%` }}
              />
            </div>
            <div className="progress-text">
              Level {currentStage.level} of {stages.length}
            </div>
          </div>

          <div className="difficulty-info">
            <div className="difficulty-label">Current Difficulty:</div>
            <div className="difficulty-details">
              <span className="detail-item">Missing Words: {currentStage.missingWords}</span>
              <span className="detail-item">Time Limit: {currentStage.timeLimit}s</span>
              <span className="detail-item">Multiplier: x{currentStage.pointsMultiplier}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="game-footer">
        <div className="scoring-breakdown">
          <div className="breakdown-title">Scoring Breakdown</div>
          <div className="breakdown-items">
            <div className="breakdown-item">
              <span className="item-label">Base Points:</span>
              <span className="item-value">100</span>
            </div>
            <div className="breakdown-item">
              <span className="item-label">Accuracy Bonus:</span>
              <span className="item-value">Up to 100</span>
            </div>
            <div className="breakdown-item">
              <span className="item-label">Time Bonus:</span>
              <span className="item-value">Up to 100</span>
            </div>
            <div className="breakdown-item">
              <span className="item-label">Level Bonus:</span>
              <span className="item-value">{currentStage.level * 50}</span>
            </div>
            <div className="breakdown-item total">
              <span className="item-label">Total Multiplier:</span>
              <span className="item-value">x{currentStage.pointsMultiplier}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BibleMemorizer
