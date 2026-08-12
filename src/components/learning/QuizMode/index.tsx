import React, { useState, useEffect, useRef } from 'react'
import { useAudio } from '../../../contexts/AudioContext'
import { useProgress } from '../../../contexts/ProgressContext'
import { wordBank, Word } from '../../../services/wordBank'
import Button from '../../common/Button'
import './QuizMode.css'

interface QuizModeProps {
  type: 'spell' | 'vocab'
  onComplete?: (score: number, wrongAnswers: number, wordIds: string[]) => void
  onNextFlow?: () => void
  difficulty?: 1 | 2 | 3
  words?: Word[]
}

interface QuizQuestion {
  word: Word
  options?: string[]
  correctAnswer: string
  userAnswer?: string
  isCorrect?: boolean
}

const QuizMode: React.FC<QuizModeProps> = ({ 
  type, 
  onComplete, 
  onNextFlow,
  difficulty, 
  words: providedWords 
}) => {
  const { speak } = useAudio()
  const { learningFlow } = useProgress()
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [currentQuestion, setCurrentQuestion] = useState<number>(0)
  const [score, setScore] = useState(0)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [wrongAnswers, setWrongAnswers] = useState(0)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [timeLeft, setTimeLeft] = useState(60)
  // Refs mirror score/wrong so completeQuiz (fired from a setTimeout) always
  // reports the up-to-date totals instead of a stale closured value.
  const scoreRef = useRef(0)
  const wrongRef = useRef(0)

  useEffect(() => {
    generateQuiz()
  }, [type, difficulty, providedWords])

  useEffect(() => {
    if (type === 'vocab' && !quizCompleted && !isAnswered) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimeUp()
            return 60
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [type, quizCompleted, isAnswered])

  const generateQuiz = () => {
    const goal = learningFlow.getDailyGoal(type)
    const wordList = difficulty ? wordBank.getWordsByDifficulty(difficulty) : wordBank.getAllWords()
    const shuffled = [...wordList].sort(() => 0.5 - Math.random())

    let words = providedWords && providedWords.length > 0
      ? [...providedWords].sort(() => 0.5 - Math.random()).slice(0, goal)
      : shuffled.slice(0, goal)
    
    const quizQuestions: QuizQuestion[] = words.map(word => {
      if (type === 'spell') {
        return {
          word,
          correctAnswer: word.word
        }
      } else {
        // For vocab quiz, generate multiple choice options using vocabulary_question
        const allMeanings = wordBank.getAllWords().map(w => w.meaning)
        const incorrectOptions = allMeanings
          .filter(meaning => meaning !== word.meaning)
          .sort(() => 0.5 - Math.random())
          .slice(0, 3)

        const options = [word.meaning, ...incorrectOptions]
          .sort(() => 0.5 - Math.random())

        return {
          word,
          options,
          correctAnswer: word.meaning
        }
      }
    })

    setQuestions(quizQuestions)
    setCurrentQuestion(0)
    scoreRef.current = 0
    wrongRef.current = 0
    setScore(0)
    setWrongAnswers(0)
    setQuizCompleted(false)

    // Speak first question
    if (quizQuestions[0]) {
      if (type === 'vocab') {
        const question = wordBank.getMaskedVocabularyQuestion(quizQuestions[0].word.word)
        speak(question)
      } else if (type === 'spell') {
        const word = quizQuestions[0].word
        speak(`Spell the word: ${word.word}. Meaning: ${word.meaning}. Sentence: ${word.sentence}`)
      }
    }
  }

  const handleTimeUp = () => {
    if (!isAnswered && !quizCompleted) {
      setSelectedOption(null)
      setIsAnswered(true)
      wrongRef.current += 1
      setWrongAnswers(wrongRef.current)

      const updatedQuestions = [...questions]
      updatedQuestions[currentQuestion] = {
        ...updatedQuestions[currentQuestion],
        userAnswer: undefined,
        isCorrect: false
      }
      setQuestions(updatedQuestions)

      setTimeout(() => {
        moveToNextQuestion()
      }, 2000)
    }
  }

  const handleAnswer = (answer: string) => {
    if (isAnswered || quizCompleted) return

    setSelectedOption(answer)
    setIsAnswered(true)

    const currentQ = questions[currentQuestion]
    const isCorrect = answer.toLowerCase() === currentQ.correctAnswer.toLowerCase()

    const updatedQuestions = [...questions]
    updatedQuestions[currentQuestion] = {
      ...currentQ,
      userAnswer: answer,
      isCorrect
    }
    setQuestions(updatedQuestions)

    if (isCorrect) {
      scoreRef.current += 10
      setScore(scoreRef.current)
      speak('Correct! Great job!')
      
      // Track spelled words for progress. Vocab completion (which advances the
      // word group) is finalized once at the end via onComplete, NOT per answer
      // — calling it per correct answer skipped several groups at once.
      if (type === 'spell') {
        learningFlow.completeSpellQuiz([currentQ.word.id], 0)
      }
    } else {
      wrongRef.current += 1
      setWrongAnswers(wrongRef.current)
      speak(`Incorrect. The correct meaning is: ${currentQ.correctAnswer}`)
    }

    setTimeout(() => {
      moveToNextQuestion()
    }, 2000)
  }

  const moveToNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
      setSelectedOption(null)
      setIsAnswered(false)
      setTimeLeft(60)

      // Speak next question
      if (type === 'vocab') {
        const question = wordBank.getMaskedVocabularyQuestion(questions[currentQuestion + 1].word.word)
        speak(question)
      } else if (type === 'spell') {
        const word = questions[currentQuestion + 1].word
        speak(`Spell the word: ${word.word}. Meaning: ${word.meaning}. Sentence: ${word.sentence}`)
      }
    } else {
      completeQuiz()
    }
  }

  const completeQuiz = () => {
    setQuizCompleted(true)
    if (onComplete) {
      const wordIds = questions.map(q => q.word.id)
      onComplete(scoreRef.current, wrongRef.current, wordIds)
    }
  }

  const handleSkip = () => {
    if (quizCompleted) return

    const updatedQuestions = [...questions]
    updatedQuestions[currentQuestion] = {
      ...updatedQuestions[currentQuestion],
      userAnswer: undefined,
      isCorrect: false
    }
    setQuestions(updatedQuestions)
    wrongRef.current += 1
    setWrongAnswers(wrongRef.current)

    setTimeout(() => {
      moveToNextQuestion()
    }, 500)
  }

  const getProgressPercentage = () => {
    return ((currentQuestion + 1) / questions.length) * 100
  }

  const getQuestionText = () => {
    const currentQ = questions[currentQuestion]
    if (!currentQ) return ''

    if (type === 'spell') {
      return 'Listen to the word and spell it correctly'
    } else {
      // Use vocabulary_question if available, otherwise use generic question
      const vocabQuestion = wordBank.getMaskedVocabularyQuestion(currentQ.word.word)
      return vocabQuestion
    }
  }

  if (questions.length === 0) {
    return <div className="quiz-mode">Loading quiz...</div>
  }

  if (quizCompleted) {
    const accuracy = ((questions.length - wrongAnswers) / questions.length) * 100

    return (
      <div className="quiz-completed">
        <h2>🎯 Quiz Complete!</h2>

        <div className="quiz-results">
          <div className="result-card">
            <div className="result-icon">🏆</div>
            <div className="result-value">{score}</div>
            <div className="result-label">Final Score</div>
          </div>

          <div className="result-card">
            <div className="result-icon">✅</div>
            <div className="result-value">{questions.length - wrongAnswers}/{questions.length}</div>
            <div className="result-label">Correct Answers</div>
          </div>

          <div className="result-card">
            <div className="result-icon">📊</div>
            <div className="result-value">{Math.round(accuracy)}%</div>
            <div className="result-label">Accuracy</div>
          </div>
        </div>

        <div className="quiz-feedback">
          {wrongAnswers === 0 ? (
            <div className="perfect-score">
              <h3>🌟 Perfect Score! 🌟</h3>
              <p>You got every question right! Amazing work!</p>
            </div>
          ) : wrongAnswers <= 2 ? (
            <div className="good-score">
              <h3>Great Job! 👍</h3>
              <p>You did really well! Keep practicing to get even better!</p>
            </div>
          ) : (
            <div className="improve-score">
              <h3>Good Effort! 💪</h3>
              <p>Keep practicing and you'll get even better!</p>
            </div>
          )}
        </div>

        <div className="quiz-actions">
          <Button
            onClick={generateQuiz}
            variant="primary"
          >
            Try Another Quiz
          </Button>

          {onNextFlow && (
            <Button
              onClick={onNextFlow}
              variant="success"
              icon={type === 'spell' ? '📚' : '🎮'}
            >
              {type === 'spell' ? 'Next: Vocabulary Quiz' : 'Next: Play Games'}
            </Button>
          )}

          <Button
            onClick={() => {/* Navigate to review */}}
            variant="secondary"
          >
            Review Mistakes
          </Button>
        </div>
      </div>
    )
  }

  const getMaskedSentence = (sentence: string, word: string) => {
    if (!sentence || !word) return sentence
    const regex = new RegExp(word, 'gi')
    return sentence.replace(regex, '____')
  }

  const currentQ = questions[currentQuestion]

  const isSpellingGoalReached = type === 'spell' && learningFlow.getWordsSpelledToday().length >= learningFlow.getDailyGoal('spell')
  const isVocabGoalReached = type === 'vocab' && learningFlow.getWordsLearnedToday().length >= learningFlow.getDailyGoal('vocab')

  return (
    <div className="quiz-mode">
      <div className="quiz-header">
        <div className="quiz-info">
          <div className="quiz-type">
            {type === 'spell' ? '✏️ Spelling Quiz' : '📚 Vocabulary Quiz'}
          </div>
          <div className="quiz-stats">
            <span className="stat">Score: <strong>{score}</strong></span>
            <span className="stat">Wrong: <strong>{wrongAnswers}</strong></span>
            <span className="stat">Question: <strong>{currentQuestion + 1}/{questions.length}</strong></span>
          </div>
        </div>

        {type === 'vocab' && (
          <div className="timer">
            <div className="timer-label">Time Left</div>
            <div className="timer-value">{timeLeft}s</div>
          </div>
        )}
      </div>

      <div className="quiz-progress">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${getProgressPercentage()}%` }}
          />
        </div>
        <div className="progress-text">
          {currentQuestion + 1} of {questions.length}
        </div>
      </div>

      <div className="question-display">
        <h2 className="question-text">{getQuestionText()}</h2>

        {type === 'spell' && (
          <div className="spelling-hint-section">
            <div className="hint-card">
              <div className="hint-label">Meaning:</div>
              <div className="hint-content">{currentQ.word.meaning}</div>
              <Button
                onClick={() => speak(currentQ.word.meaning)}
                variant="secondary"
                size="small"
                icon="🔊"
                className="audio-hint-btn"
              >
                Hear Meaning
              </Button>
            </div>
            <div className="hint-card">
              <div className="hint-label">Sentence:</div>
              <div className="hint-content">
                {getMaskedSentence(currentQ.word.sentence, currentQ.word.word)}
              </div>
              <Button
                onClick={() => speak(currentQ.word.sentence)}
                variant="secondary"
                size="small"
                icon="🔊"
                className="audio-hint-btn"
              >
                Hear Sentence
              </Button>
            </div>
            <div className="hint-card main-word-audio">
              <Button
                onClick={() => speak(currentQ.word.word)}
                variant="primary"
                size="large"
                icon="🔊"
              >
                Hear Word Again
              </Button>
            </div>
          </div>
        )}

        {type === 'vocab' && currentQ.options && (
          <div className="options-grid">
            {currentQ.options.map((option, index) => {
              let optionClass = 'option-button'
              if (isAnswered) {
                if (option === currentQ.correctAnswer) {
                  optionClass += ' correct'
                } else if (option === selectedOption) {
                  optionClass += ' incorrect'
                }
              } else if (option === selectedOption) {
                optionClass += ' selected'
              }

              return (
                <button
                  key={index}
                  className={optionClass}
                  onClick={() => handleAnswer(option)}
                  disabled={isAnswered}
                >
                  <span className="option-letter">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  <span className="option-text">{option}</span>
                </button>
              )
            })}
          </div>
        )}

        {type === 'spell' && (
          <div className="spell-input-section">
            <input
              type="text"
              value={selectedOption || ''}
              onChange={(e) => setSelectedOption(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && selectedOption && handleAnswer(selectedOption)}
              className={`spell-input ${isAnswered ? (currentQ.isCorrect ? 'correct' : 'incorrect') : ''}`}
              placeholder="Type your answer here..."
              disabled={isAnswered}
              autoFocus
            />
            <Button
              onClick={() => selectedOption && handleAnswer(selectedOption)}
              disabled={!selectedOption || isAnswered}
              variant="primary"
              size="large"
            >
              {isAnswered ? 'Checking...' : 'Submit Answer'}
            </Button>
          </div>
        )}

        {isAnswered && (
          <div className={`answer-feedback ${currentQ.isCorrect ? 'correct' : 'incorrect'}`}>
            {currentQ.isCorrect ? (
              <>
                <span className="feedback-icon">✅</span>
                <span className="feedback-text">Correct! Well done!</span>
              </>
            ) : (
              <>
                <span className="feedback-icon">❌</span>
                <span className="feedback-text">
                  The correct answer is: <strong>{currentQ.correctAnswer}</strong>
                </span>
              </>
            )}
          </div>
        )}
      </div>

      <div className="quiz-controls">
        <Button
          onClick={handleSkip}
          variant="warning"
          disabled={isAnswered}
        >
          Skip Question
        </Button>

        {isAnswered && (
          <Button
            onClick={moveToNextQuestion}
            variant="primary"
            icon="→"
          >
            Next Question
          </Button>
        )}

        {isSpellingGoalReached && onNextFlow && (
          <Button
            onClick={onNextFlow}
            variant="success"
            icon="📚"
          >
            Take Vocabulary Quiz
          </Button>
        )}

        {isVocabGoalReached && onNextFlow && (
          <Button
            onClick={onNextFlow}
            variant="success"
            icon="🎮"
          >
            Play Games
          </Button>
        )}
      </div>

      {wrongAnswers > 0 && (
        <div className="warning-banner">
          <span className="warning-icon">💪</span>
          <span className="warning-text">
            No worries — tricky ones happen! Finish the quiz and you&apos;ll still move on.
          </span>
        </div>
      )}
    </div>
  )
}

export default QuizMode
