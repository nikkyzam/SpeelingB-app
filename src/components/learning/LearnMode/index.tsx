import React, { useState, useEffect } from 'react'
import { useAudio } from '../../../contexts/AudioContext'
import { useProgress } from '../../../contexts/ProgressContext'
import { wordBank, Word } from '../../../services/wordBank'
import Button from '../../common/Button'
import './LearnMode.css'

interface LearnModeProps {
  onComplete?: () => void
  onMoveToPractice?: () => void
  difficulty?: 1 | 2 | 3
  words?: Word[]
}

const LearnMode: React.FC<LearnModeProps> = ({ 
  onComplete, 
  onMoveToPractice, 
  difficulty, 
  words: providedWords 
}) => {
  const { speak } = useAudio()
  const { learningFlow } = useProgress()
  const [currentWord, setCurrentWord] = useState<Word | null>(null)
  const [words, setWords] = useState<Word[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const [showGoalPrompt, setShowGoalPrompt] = useState(false)

  useEffect(() => {
    if (providedWords && providedWords.length > 0) {
      setWords(providedWords)
      
      // Find the first word that hasn't been learned yet in this group
      const learnedTotal = learningFlow.getWordsLearnedTotal()
      const firstUnlearnedIndex = providedWords.findIndex(w => !learnedTotal.includes(w.id))
      
      const startIndex = firstUnlearnedIndex === -1 ? 0 : firstUnlearnedIndex
      
      setCurrentIndex(startIndex)
      setCurrentWord(providedWords[startIndex])
      setIsCompleted(false)
    } else {
      loadWords()
    }
  }, [difficulty, providedWords, learningFlow])

  const loadWords = () => {
    if (providedWords && providedWords.length > 0) {
      setWords(providedWords)
      
      const learnedTotal = learningFlow.getWordsLearnedTotal()
      const firstUnlearnedIndex = providedWords.findIndex(w => !learnedTotal.includes(w.id))
      const startIndex = firstUnlearnedIndex === -1 ? 0 : firstUnlearnedIndex

      setCurrentIndex(startIndex)
      setCurrentWord(providedWords[startIndex])
      setIsCompleted(false)
      return
    }
    const goal = learningFlow.getDailyGoal('learn')
    // Get unique words from the word bank up to the goal count
    const wordList = difficulty ? wordBank.getWordsByDifficulty(difficulty) : wordBank.getAllWords()
    const shuffled = [...wordList].sort(() => 0.5 - Math.random())
    const selectedWords = shuffled.slice(0, goal)
    
    setWords(selectedWords)
    if (selectedWords.length > 0) {
      setCurrentWord(selectedWords[0])
    }
    setCurrentIndex(0)
    setIsCompleted(false)
  }

  const handleNext = () => {
    if (currentWord && currentIndex < words.length - 1) {
      // Mark word as learned
      const wasGoalReachedBefore = learningFlow.isDailyGoalReached()
      learningFlow.completeWord(currentWord.id)
      const isGoalReachedNow = learningFlow.isDailyGoalReached()

      // If we just hit the daily goal, show the prompt
      if (!wasGoalReachedBefore && isGoalReachedNow) {
        console.log('Daily goal reached! Showing prompt.');
        setShowGoalPrompt(true);
      }

      // Move to next word
      const nextIndex = currentIndex + 1
      setCurrentIndex(nextIndex)
      setCurrentWord(words[nextIndex])

      // Speak new word
      speak(words[nextIndex].word)
    } else if (currentWord) {
      // Last word
      const wasGoalReachedBefore = learningFlow.isDailyGoalReached()
      learningFlow.completeWord(currentWord.id)
      const isGoalReachedNow = learningFlow.isDailyGoalReached()

      if (!wasGoalReachedBefore && isGoalReachedNow) {
        console.log('Daily goal reached on last word! Showing prompt.');
        setShowGoalPrompt(true);
      } else {
        console.log('Lesson completed. Showing final screen.');
        setIsCompleted(true);
        if (onComplete) onComplete();
      }
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1
      setCurrentIndex(prevIndex)
      setCurrentWord(words[prevIndex])
      speak(words[prevIndex].word)
    }
  }

  const handleSpeak = () => {
    if (currentWord) {
      speak(currentWord.word)
    }
  }

  const handleSpeakSentence = () => {
    if (currentWord) {
      speak(currentWord.sentence)
    }
  }

  const handleSpeakMeaning = () => {
    if (currentWord) {
      speak(currentWord.meaning)
    }
  }

  const getDifficultyStars = (difficulty: number) => {
    return '★'.repeat(difficulty) + '☆'.repeat(3 - difficulty)
  }

  if (!currentWord) {
    return <div className="learn-mode">Loading words...</div>
  }

  if (showGoalPrompt) {
    return (
      <div className="goal-reached-prompt">
        <div className="prompt-card">
          <div className="prompt-icon">🎉</div>
          <h2>You did it! 🌟</h2>
          <p>
            Wow — you learned {learningFlow.getDailyGoal()} words today!
            Want to practice spelling them, or meet a few more?
          </p>
          <div className="prompt-actions">
            <Button
              variant="primary"
              icon="✏️"
              onClick={() => {
                setShowGoalPrompt(false)
                if (onMoveToPractice) onMoveToPractice()
              }}
            >
              Let&apos;s Spell!
            </Button>
            <Button
              variant="secondary"
              onClick={() => setShowGoalPrompt(false)}
            >
              More Words
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (isCompleted) {
    return (
      <div className="learn-completed">
        <div className="prompt-icon">🎉</div>
        <h2>Awesome job!</h2>
        <p>You just learned {words.length} new words! High five! ✋</p>
        <div className="completed-actions">
          <Button onClick={loadWords} variant="primary" icon="📖">
            More Words
          </Button>
          {onMoveToPractice && (
            <Button onClick={onMoveToPractice} variant="success" icon="✏️">
              Let&apos;s Spell!
            </Button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="learn-mode">
      <div className="word-header">
        <div className="word-meta">
          <span className="difficulty">
            Difficulty: {getDifficultyStars(currentWord.difficulty)}
          </span>
          <span className="category">
            Category: {currentWord.category}
          </span>
        </div>
        <div className="word-counter">
          Word {currentIndex + 1} of {words.length}
        </div>
      </div>

      <div className="word-display">
        <h1 className="word-text">{currentWord.word}</h1>
        {currentWord.phonetic && (
          <div className="phonetic">/{currentWord.phonetic}/</div>
        )}

        <div className="audio-controls">
          <Button onClick={handleSpeak} icon="🔊">
            Hear Word
          </Button>
          <Button onClick={handleSpeakSentence} icon="💬">
            Hear Sentence
          </Button>
          <Button onClick={handleSpeakMeaning} icon="📖">
            Hear Meaning
          </Button>
        </div>
      </div>

      <div className="word-details">
        <div className="meaning-section">
          <h3>Meaning</h3>
          <p>{currentWord.meaning}</p>
        </div>

        <div className="sentence-section">
          <h3>Example Sentence</h3>
          <p className="sentence">"{currentWord.sentence}"</p>
        </div>

        {currentWord.synonyms && currentWord.synonyms.length > 0 && (
          <div className="synonyms-section">
            <h3>Synonyms</h3>
            <div className="synonyms">
              {currentWord.synonyms.map((synonym, index) => (
                <span key={index} className="synonym-tag">
                  {synonym}
                </span>
              ))}
            </div>
          </div>
        )}

        {currentWord.hint && (
          <div className="hint-section">
            <h3>💡 Hint</h3>
            <p>{currentWord.hint}</p>
          </div>
        )}
      </div>

      <div className="navigation-controls">
        <Button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          variant="secondary"
        >
          ← Previous
        </Button>

        <div className="progress-indicator">
          <div
            className="progress-bar"
            style={{ width: `${((currentIndex + 1) / words.length) * 100}%` }}
          />
        </div>

        <Button
          onClick={handleNext}
          variant="primary"
          icon={currentIndex === words.length - 1 ? "🏁" : "→"}
        >
          {currentIndex === words.length - 1 ? "Finish!" : "Got it!"}
        </Button>
      </div>

      <div className="combo-display">
        <div className="combo-counter">
          <span className="combo-icon">🔥</span>
          <span className="combo-count">Combo: {currentIndex}</span>
        </div>
        <div className="stars-earned">
          <span className="star-icon">⭐</span>
          <span className="star-count">Stars: {currentIndex * 2}</span>
        </div>
      </div>
    </div>
  )
}

export default LearnMode
