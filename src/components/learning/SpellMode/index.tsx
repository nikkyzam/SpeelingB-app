import React, { useState, useEffect, useRef } from 'react'
import { useAudio } from '../../../contexts/AudioContext'
import { useProgress } from '../../../contexts/ProgressContext'
import { useTheme } from '../../../contexts/ThemeContext'
import { wordBank, Word } from '../../../services/wordBank'
import WordMastery from '../../../services/progress/WordMastery'
import ReviewSchedule from '../../../services/progress/ReviewSchedule'
import { AchievementsService } from '../../../services/rewards/AchievementsService'
import BuddyService from '../../../services/buddy/BuddyService'
import useSpeechRecognition, { parseSpelling } from '../../../hooks/useSpeechRecognition'
import { explain } from '../../../services/words/explain'
import sfx from '../../games/shared/sfx'
import Button from '../../common/Button'
import './SpellMode.css'

interface SpellModeProps {
  onComplete?: (wordIds: string[]) => void
  onMoveToQuiz?: () => void
  difficulty?: 1 | 2 | 3
  isQuiz?: boolean
  words?: Word[]
}

const SpellMode: React.FC<SpellModeProps> = ({ 
  onComplete, 
  onMoveToQuiz,
  difficulty, 
  isQuiz = false, 
  words: providedWords 
}) => {
  const { speak } = useAudio()
  const { learningFlow } = useProgress()
  const { world } = useTheme()
  const [currentWord, setCurrentWord] = useState<Word | null>(null)
  const [words, setWords] = useState<Word[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userInput, setUserInput] = useState('')
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [showHint, setShowHint] = useState(false)
  // What they wrote, kept after the box is cleared so the tip can name the
  // exact mistake rather than give a generic rule.
  const [lastAttempt, setLastAttempt] = useState('')
  // A correct answer schedules an advance; tapping "Next Word" must cancel it,
  // or the two together skip a word.
  const advanceTimer = useRef<number | null>(null)
  const [isCompleted, setIsCompleted] = useState(false)
  // Spell-by-speaking: like a real spelling bee, say the letters out loud.
  const mic = useSpeechRecognition()

  useEffect(() => {
    if (providedWords && providedWords.length > 0) {
      setWords(providedWords)
      
      // Find the first word that hasn't been practiced today in this group
      const practicedToday = learningFlow.getWordsPracticedToday()
      const firstUnpracticedIndex = providedWords.findIndex(w => !practicedToday.includes(w.id))
      
      const startIndex = firstUnpracticedIndex === -1 ? 0 : firstUnpracticedIndex
      
      setCurrentIndex(startIndex)
      setCurrentWord(providedWords[startIndex])
      setIsCompleted(false)
      speakSentence(providedWords[startIndex])
    } else {
      loadWords()
    }
  }, [difficulty, providedWords, learningFlow])

  const loadWords = () => {
    if (providedWords && providedWords.length > 0) {
      setWords(providedWords)
      
      const practicedToday = learningFlow.getWordsPracticedToday()
      const firstUnpracticedIndex = providedWords.findIndex(w => !practicedToday.includes(w.id))
      const startIndex = firstUnpracticedIndex === -1 ? 0 : firstUnpracticedIndex

      setCurrentIndex(startIndex)
      setCurrentWord(providedWords[startIndex])
      setIsCompleted(false)
      speakSentence(providedWords[startIndex])
      return
    }
    const wordList = difficulty ? wordBank.getWordsByDifficulty(difficulty) : wordBank.getAllWords()
    const goal = isQuiz ? learningFlow.getDailyGoal('spell') : 5
    const randomWords = wordBank.getRandomWords(goal, difficulty)
    setWords(randomWords)
    if (randomWords.length > 0) {
      setCurrentWord(randomWords[0])
      speakSentence(randomWords[0])
    }
    setCurrentIndex(0)
    setIsCompleted(false)
  }

  const speakSentence = (word: Word) => {
    const maskedSentence = word.sentence.replace(word.word, 'underscore')
    speak(maskedSentence)
  }

  const handleSpeakWord = () => {
    if (currentWord) {
      speak(currentWord.word)
    }
  }

  // When the child spells out loud, fill the box and check it straight away.
  useEffect(() => {
    if (!mic.transcript) return
    const spelled = parseSpelling(mic.transcript)
    mic.reset()
    if (!spelled) return
    setUserInput(spelled)
    handleSubmit(spelled)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mic.transcript])

  const handleSubmit = (spokenValue?: string) => {
    if (!currentWord) return
    // One answer per word. Without this a second tap on Check (or a late
    // transcript from the microphone) scores the word twice, double-counts
    // mastery and review, and queues a second moveToNextWord that skips a word.
    if (isCorrect !== null) return

    const answer = (spokenValue ?? userInput).toLowerCase().trim()
    const correct = answer === currentWord.word.toLowerCase()
    setLastAttempt(answer)
    setIsCorrect(correct)
    // Right or wrong, this word's next review date depends on what just happened.
    ReviewSchedule.record(currentWord.id, correct)

    if (correct) {
      // Correct answer
      sfx.correct()
      setScore(prev => prev + (streak + 1) * 10)
      setStreak(prev => prev + 1)

      // Track as spelled correctly today
      learningFlow.completeSpellQuiz([currentWord.id], 0)
      // Each correct spelling counts towards this word's third mastery star
      // and today's learning challenge.
      WordMastery.recordCorrect(currentWord.id)
      WordMastery.recordSpelled()
      BuddyService.earnSnack()
      // Badges only move if something tells them to.
      AchievementsService.recordWordSpelled(true, isQuiz)
      AchievementsService.recordComboAchieved(streak + 1)

      if (isQuiz) {
        // In quiz mode, mark as learned
        learningFlow.completeWord(currentWord.id)
      }

      advanceTimer.current = window.setTimeout(() => {
        advanceTimer.current = null
        moveToNextWord()
      }, 1500)
    } else {
      // Wrong answer
      sfx.wrong()
      setStreak(0)

      if (isQuiz) {
        // In quiz mode, show correct answer
        speak(`The correct spelling is ${currentWord.word}`)
      }
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1
      setCurrentIndex(prevIndex)
      setCurrentWord(words[prevIndex])
      setUserInput('')
      setIsCorrect(null)
      setShowHint(false)
      speakSentence(words[prevIndex])
    }
  }

  const moveToNextWord = () => {
    if (advanceTimer.current) {
      window.clearTimeout(advanceTimer.current)
      advanceTimer.current = null
    }
    if (currentIndex < words.length - 1) {
      const nextIndex = currentIndex + 1
      setCurrentIndex(nextIndex)
      setCurrentWord(words[nextIndex])
      setUserInput('')
      setIsCorrect(null)
      setShowHint(false)
      speakSentence(words[nextIndex])
    } else {
      setIsCompleted(true)
      if (onComplete) {
        onComplete(words.map(w => w.id))
      }
    }
  }

  const handleSkip = () => {
    if (isQuiz) {
      // In quiz mode, skipping counts as wrong
      setStreak(0)
    }
    moveToNextWord()
  }

  const handleReveal = () => {
    if (currentWord) {
      setUserInput(currentWord.word)
      setIsCorrect(true)
      setStreak(0)

      setTimeout(() => {
        moveToNextWord()
      }, 1500)
    }
  }

  const handleHint = () => {
    if (currentWord && !showHint) {
      setShowHint(true)
      if (currentWord.hint) {
        speak(currentWord.hint)
      }
    }
  }

  const handleSpeakMeaning = () => {
    if (currentWord) {
      speak(`The meaning is: ${currentWord.meaning}`)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }

  const getMaskedSentence = () => {
    if (!currentWord) return ''
    return currentWord.sentence.replace(currentWord.word, '_______')
  }

  if (!currentWord) {
    return <div className="spell-mode">Loading words...</div>
  }

  if (isCompleted) {
    return (
      <div className="spell-completed">
        <h2>{isQuiz ? '🎯 Quiz Complete!' : '✨ Practice Complete!'}</h2>
        <div className="score-summary">
          <div className="score-item">
            <span className="score-label">Final Score</span>
            <span className="score-value">{score}</span>
          </div>
          <div className="score-item">
            <span className="score-label">Words Practiced</span>
            <span className="score-value">{words.length}</span>
          </div>
          <div className="score-item">
            <span className="score-label">Accuracy</span>
            <span className="score-value">{Math.round((score / (words.length * 10)) * 100)}%</span>
          </div>
        </div>
        <div className="completed-actions">
          <Button onClick={loadWords} variant="primary">
            {isQuiz ? 'Take Another Quiz' : 'Practice More'}
          </Button>
          {!isQuiz && onMoveToQuiz && learningFlow.isDailyGoalReached() && (
            <Button onClick={onMoveToQuiz} variant="success" icon="🎯">
              Take Spelling Quiz
            </Button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="spell-mode">
      <div className="spell-header">
        <div className="spell-stats">
          <div className="stat">
            <span className="stat-label">Score</span>
            <span className="stat-value">{score}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Streak</span>
            <span className="stat-value streak-value">🔥 {streak}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Word</span>
            <span className="stat-value">{currentIndex + 1}/{words.length}</span>
          </div>
        </div>

        {isQuiz && (
          <div className="quiz-badge">
            🎯 Quiz Mode
          </div>
        )}
      </div>

      <div className="spell-content">
        <div className="sentence-display">
          <div
            className={`spell-mascot ${isCorrect === true ? 'is-happy' : isCorrect === false ? 'is-oops' : ''}`}
            aria-hidden
          >
            {isCorrect === true ? '🎉' : world.mascot}
          </div>
          <div className="sentence-text">{getMaskedSentence()}</div>
          <Button
            onClick={() => speakSentence(currentWord)}
            variant="secondary"
            icon="🔊"
            size="small"
          >
            Hear Sentence Again
          </Button>
          <Button
            onClick={handleSpeakWord}
            variant="secondary"
            icon="🔊"
            size="small"
          >
            Hear Word
          </Button>
          <Button
            onClick={handleSpeakMeaning}
            variant="secondary"
            icon="📖"
            size="small"
          >
            Hear Meaning
          </Button>
        </div>

        <div className="input-section">
          <div className="input-wrapper">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className={`spell-input ${isCorrect === true ? 'correct' : isCorrect === false ? 'incorrect' : ''}`}
              placeholder="Type the word..."
              autoFocus
            />
            <div className="input-actions">
              {mic.supported && (
                <Button
                  onClick={mic.listening ? mic.stop : mic.start}
                  variant={mic.listening ? 'warning' : 'secondary'}
                  size="small"
                >
                  {mic.listening ? '🎤 Listening…' : '🎤 Say it!'}
                </Button>
              )}
              <Button
                onClick={handleHint}
                disabled={showHint}
                variant="secondary"
                size="small"
              >
                {showHint ? 'Hint Used' : '💡 Get Hint'}
              </Button>
            </div>
          </div>

          {mic.listening && (
            <div className="mic-hint" role="status">
              🐝 Say the letters one by one — like “C… A… T”!
            </div>
          )}

          {showHint && currentWord.hint && (
            <div className="hint-display">
              <span className="hint-icon">💡</span>
              <span className="hint-text">{currentWord.hint}</span>
            </div>
          )}

          {isCorrect === false && (
            <div className="feedback incorrect-feedback">
              <div>Oops! Not quite — it’s <strong>{currentWord.word}</strong>.</div>
              {/* The rule, not just the answer: one word learned versus fifty. */}
              <div className="feedback-why">
                <span aria-hidden>💡</span> {explain(currentWord.word, lastAttempt).tip}
              </div>
            </div>
          )}

          {isCorrect === true && (
            <div className="feedback correct-feedback">
              Yes! You spelled it! 🎉
            </div>
          )}
        </div>

        <div className="action-buttons">
          <Button
            onClick={handlePrevious}
            variant="secondary"
            disabled={currentIndex === 0}
          >
            ← Previous
          </Button>

          <Button
            // Once an answer is in, this button moves on rather than re-scoring
            // it. It used to call handleSubmit either way, which the one-answer
            // guard then swallowed — leaving a child stuck on a word they had
            // just got wrong, staring at a greyed-out "Next Word".
            onClick={() => (isCorrect === null ? handleSubmit() : moveToNextWord())}
            variant="primary"
            disabled={isCorrect === null && !userInput.trim()}
            size="large"
          >
            {isCorrect === null ? 'Check it!' : 'Next Word'} →
          </Button>

          {!isQuiz && onMoveToQuiz && learningFlow.isDailyGoalReached() && (
            <Button
              onClick={onMoveToQuiz}
              variant="success"
              icon="🎯"
            >
              Take Quiz
            </Button>
          )}

          {!isQuiz && (
            <Button
              onClick={handleReveal}
              variant="secondary"
            >
              Reveal Answer
            </Button>
          )}

          <Button
            onClick={handleSkip}
            variant="warning"
          >
            Skip Word
          </Button>
        </div>

        <div className="progress-container">
          <div className="progress-label">
            Progress: {currentIndex + 1} of {words.length}
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${((currentIndex + 1) / words.length) * 100}%` }}
            />
          </div>
        </div>

        {streak > 2 && (
          <div className="combo-alert">
            <span className="combo-icon">🔥</span>
            <span className="combo-text">Amazing! {streak} in a row!</span>
            <span className="combo-bonus">+{streak * 5} bonus points!</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default SpellMode
