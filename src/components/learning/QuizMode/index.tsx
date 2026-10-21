import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAudio } from '../../../contexts/AudioContext'
import { useProgress } from '../../../contexts/ProgressContext'
import { useTheme } from '../../../contexts/ThemeContext'
import { useRewardStore } from '../../../stores/rewards/useRewardStore'
import { wordBank, Word } from '../../../services/wordBank'
import ReviewSchedule from '../../../services/progress/ReviewSchedule'
import { AchievementsService } from '../../../services/rewards/AchievementsService'
import { sameSpelling, escapeForRegExp } from '../../../services/words/spelling'
import { praise, nearly, spellOut, sayPrompt, isStreakMilestone } from '../../../services/words/praise'
import sfx from '../../games/shared/sfx'
import useLater from '../../games/shared/useLater'
import Burst from '../../games/shared/Burst'
import Button from '../../common/Button'
import WordTrail from '../WordTrail'
import { spellOutPause } from '../spellOutPause'
import './QuizMode.css'
import SpellingInput from '../../common/SpellingInput'

interface QuizModeProps {
  type: 'spell' | 'vocab'
  /**
   * Once per set of words (a "Try Again" replay is practice and isn't
   * reported). `wordIds` is every question, not only the right answers: a
   * spelling quiz has already credited each right answer itself.
   */
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

/** Meanings to choose from. Three, not four: each one is read aloud on request. */
const OPTION_COUNT = 3
/** How long a right answer stays up before the next question. */
const RIGHT_PAUSE = 2000
/**
 * A miss or a skip shows (and says) the answer, which takes longer to hear.
 * A spelled answer is read letter by letter, so its pause grows with the word.
 */
const SHOW_PAUSE = 3500

const QuizMode: React.FC<QuizModeProps> = ({
  type,
  onComplete,
  onNextFlow,
  difficulty,
  words: providedWords
}) => {
  const navigate = useNavigate()
  const { speak } = useAudio()
  const { learningFlow } = useProgress()
  const { world } = useTheme()
  const { addStars } = useRewardStore()
  const later = useLater()
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [currentQuestion, setCurrentQuestion] = useState<number>(0)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [skipped, setSkipped] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [streak, setStreak] = useState(0)
  const [stars, setStars] = useState(0)
  const [burst, setBurst] = useState(0)
  const [line, setLine] = useState('')
  // Refs mirror the totals so a finish fired from the timer reports what
  // really happened, not a stale closured value.
  const scoreRef = useRef(0)
  const wrongRef = useRef(0)
  const questionsRef = useRef<QuizQuestion[]>([])
  const indexRef = useRef(0)
  // One answer per question, and one finish per quiz. The state versions lag
  // a tap behind; these don't, so a double tap can't answer (or skip) twice.
  const answeredRef = useRef(false)
  const completedRef = useRef(false)
  // The page hears about a finished quiz ONCE per set of words. "Try Again"
  // starts a fresh round (so completedRef resets), but reporting the replay
  // ran the hub's completeVocabQuiz again and moved the saved word group on
  // twice, skipping a group of words the child had never met. Only a new set
  // (new type or new words) resets this.
  const reportedRef = useRef(false)
  // The ONE auto-advance. "Next Question" cancels it: the two together used to
  // skip a question, and on the last one finish the quiz twice — which ran the
  // page's completeVocabQuiz twice and moved the child on two word groups.
  const advanceTimer = useRef<number | null>(null)
  // A star per word answered right, once per word while this screen is open:
  // "Try again" is practice, not a star farm.
  const paid = useRef(new Set<string>())

  const clearAdvance = () => {
    if (advanceTimer.current) {
      window.clearTimeout(advanceTimer.current)
      advanceTimer.current = null
    }
  }

  useEffect(() => clearAdvance, [])

  useEffect(() => {
    reportedRef.current = false
    generateQuiz()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, difficulty, providedWords])

  // Deliberately NO countdown. A ticking clock that marks a young child wrong
  // for thinking too long is the fastest way to make them give up, so they can
  // take as long as they need on every question.

  /**
   * Ask a question. `queue` waits for what is being said — the answer to the
   * last one, after a miss — instead of cutting it off mid-letter.
   */
  const askQuestion = (q: QuizQuestion | undefined, queue = false) => {
    if (!q) return
    const text = type === 'vocab'
      ? `${q.word.word}. What does ${q.word.word} mean?`
      : sayPrompt(q.word.word, q.word.sentence)
    if (queue) speak(text, { queue: true })
    else speak(text)
  }

  const generateQuiz = () => {
    clearAdvance()
    const goal = learningFlow.getDailyGoal(type)

    // Only the words this child is actually studying. Falling back to the word
    // bank made a quiz out of words nobody had taught them — and then wrote
    // those words into their learned list as though they had.
    const words = [...(providedWords || [])].sort(() => 0.5 - Math.random()).slice(0, goal)

    const quizQuestions: QuizQuestion[] = words.map(word => {
      if (type === 'spell') {
        return {
          word,
          correctAnswer: word.word
        }
      }
      // Wrong answers: meanings of the child's other words first (words they
      // have met), then any meaning from the bank. A distractor is never spelled.
      const own = (providedWords || []).map(w => w.meaning)
      const allMeanings = wordBank.getAllWords().map(w => w.meaning)
      const pool = [...new Set([...own.sort(() => 0.5 - Math.random()), ...allMeanings.sort(() => 0.5 - Math.random())])]
      const decoys = pool
        .filter(meaning => !!meaning && meaning !== word.meaning)
        .slice(0, OPTION_COUNT - 1)

      const options = [word.meaning, ...decoys]
        .sort(() => 0.5 - Math.random())

      return {
        word,
        options,
        correctAnswer: word.meaning
      }
    })

    questionsRef.current = quizQuestions
    indexRef.current = 0
    answeredRef.current = false
    completedRef.current = false
    scoreRef.current = 0
    wrongRef.current = 0
    setQuestions(quizQuestions)
    setCurrentQuestion(0)
    setSelectedOption(null)
    setIsAnswered(false)
    setSkipped(false)
    setStreak(0)
    setStars(0)
    setLine('')
    setQuizCompleted(false)
    askQuestion(quizQuestions[0])
  }

  const markQuestion = (patch: Partial<QuizQuestion>) => {
    const updated = [...questionsRef.current]
    updated[indexRef.current] = { ...updated[indexRef.current], ...patch }
    questionsRef.current = updated
    setQuestions(updated)
  }

  /** `afterAnswerShown`: the answer is being said, so the next prompt queues behind it. */
  const scheduleAdvance = (ms: number, afterAnswerShown = false) => {
    clearAdvance()
    advanceTimer.current = window.setTimeout(() => {
      advanceTimer.current = null
      moveToNextQuestion(afterAnswerShown)
    }, ms)
  }

  /** How long a shown answer stays up: long enough to hear every letter of a spelling. */
  const showPause = (q: QuizQuestion): number =>
    type === 'spell' ? spellOutPause(q.word.word, SHOW_PAUSE) : SHOW_PAUSE

  /** Say the answer: the letters for spelling, the meaning for vocabulary. */
  const answerAloud = (q: QuizQuestion): string =>
    type === 'spell'
      ? `${q.word.word} is spelled ${spellOut(q.word.word)}.`
      : `${q.word.word} means ${q.word.meaning}`

  const handleAnswer = (answer: string) => {
    if (answeredRef.current || completedRef.current) return
    const currentQ = questionsRef.current[indexRef.current]
    if (!currentQ) return
    answeredRef.current = true

    setSelectedOption(answer)
    setIsAnswered(true)

    // Spelling ignores case, accents and stray spaces, like every other
    // spelling check; a meaning is one of the buttons, so it matches exactly.
    const isCorrect = type === 'spell'
      ? sameSpelling(answer, currentQ.correctAnswer)
      : answer === currentQ.correctAnswer

    markQuestion({ userAnswer: answer, isCorrect })

    // Every answer teaches the scheduler something about this word.
    ReviewSchedule.record(currentQ.word.id, isCorrect)
    AchievementsService.recordWordSpelled(isCorrect, true)

    if (isCorrect) {
      scoreRef.current += 10
      const run = streak + 1
      const cheer = praise(run)
      setStreak(run)
      setLine(cheer)
      setBurst((b) => b + 1)
      sfx.correct()
      if (isStreakMilestone(run)) later(() => sfx.star(), 180)
      speak(cheer)

      const key = `${type}:${currentQ.word.id}`
      if (!paid.current.has(key)) {
        paid.current.add(key)
        addStars(1)
        setStars((s) => s + 1)
      }

      // Track spelled words for progress. Vocab completion (which advances the
      // word group) is finalized once at the end via onComplete, NOT per answer
      // — calling it per correct answer skipped several groups at once.
      if (type === 'spell') {
        learningFlow.completeSpellQuiz([currentQ.word.id], 0)
      }
      scheduleAdvance(RIGHT_PAUSE)
    } else {
      wrongRef.current += 1
      const soft = nearly()
      setStreak(0)
      setLine(soft)
      sfx.wrong()
      speak(`${soft} ${answerAloud(currentQ)}`)
      scheduleAdvance(showPause(currentQ), true)
    }
  }

  const moveToNextQuestion = (queuePrompt = false) => {
    clearAdvance()
    // Only from an answered question: a second tap (or the timer after a tap)
    // finds the next question unanswered and does nothing.
    if (!answeredRef.current || completedRef.current) return
    const next = indexRef.current + 1
    if (next < questionsRef.current.length) {
      indexRef.current = next
      answeredRef.current = false
      setCurrentQuestion(next)
      setSelectedOption(null)
      setIsAnswered(false)
      setSkipped(false)
      setLine('')
      askQuestion(questionsRef.current[next], queuePrompt)
    } else {
      completeQuiz()
    }
  }

  const completeQuiz = () => {
    if (completedRef.current) return
    completedRef.current = true
    setQuizCompleted(true)
    sfx.win()
    if (onComplete && !reportedRef.current) {
      reportedRef.current = true
      const wordIds = questionsRef.current.map(q => q.word.id)
      onComplete(scoreRef.current, wrongRef.current, wordIds)
    }
  }

  /** Skip shows the answer (it never used to) and counts as one to practise. */
  const handleSkip = () => {
    if (answeredRef.current || completedRef.current) return
    const currentQ = questionsRef.current[indexRef.current]
    if (!currentQ) return
    answeredRef.current = true
    markQuestion({ userAnswer: undefined, isCorrect: false })
    wrongRef.current += 1
    setStreak(0)
    setSkipped(true)
    setIsAnswered(true)
    setLine('')
    speak(answerAloud(currentQ))
    scheduleAdvance(showPause(currentQ), true)
  }

  if (questions.length === 0) {
    return <div className="quiz-mode">No words to quiz yet — learn a few first!</div>
  }

  if (quizCompleted) {
    const missed = questions.filter((q) => q.isCorrect === false)
    return (
      <div className="quiz-completed">
        <div className="qm-done-mascot" aria-hidden>{world.mascot}</div>
        <h2>🎉 Quiz done!</h2>
        {stars > 0 && (
          <div className="qm-done-stars">⭐ +{stars} {stars === 1 ? 'star' : 'stars'}</div>
        )}
        <p className="qm-done-line">
          {missed.length === 0 ? 'Every one right — amazing! 🌟' : 'Great work — every quiz makes you stronger! 💪'}
        </p>
        <div className="qm-done-words">
          {questions.map((q) => (
            <span key={q.word.id} className={`qm-done-chip ${q.isCorrect ? 'is-solved' : ''}`}>
              {q.isCorrect ? '⭐ ' : ''}{q.word.word}
            </span>
          ))}
        </div>

        <div className="quiz-actions">
          {onNextFlow && (
            <Button
              onClick={onNextFlow}
              variant="success"
              size="large"
              icon={type === 'spell' ? '📚' : '🎮'}
            >
              {type === 'spell' ? 'Next: Word Meanings' : 'Next: Play Games'}
            </Button>
          )}

          {missed.length > 0 && (
            // The words missed in this quiz, practised now. The tricky-word
            // review wasn't the place: a word needs two misses to count as
            // tricky, and one missed today isn't due until tomorrow.
            <Button
              onClick={() =>
                navigate('/review', {
                  state: { missed: missed.map((q) => q.word.id) },
                })
              }
              variant="primary"
              icon="🧠"
            >
              Practise the ones I missed
            </Button>
          )}

          <Button onClick={generateQuiz} variant="secondary">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  const currentQ = questions[currentQuestion]
  const maskedSentence = currentQ.word.sentence.replace(
    new RegExp(escapeForRegExp(currentQ.word.word), 'gi'),
    '____'
  )
  const solvedIndexes = questions.map((q, i) => (q.isCorrect ? i : -1)).filter((i) => i >= 0)

  return (
    <div className="quiz-mode">
      <div className="qm-title">{type === 'spell' ? '✏️ Spelling Quiz' : '📚 Vocabulary Quiz'}</div>
      <WordTrail
        total={questions.length}
        current={currentQuestion}
        solved={solvedIndexes}
        mascot={world.mascot}
        streak={streak}
        stars={stars}
      />

      <div className="question-display">
        <Burst trigger={burst} />

        {type === 'vocab' ? (
          <>
            <button className="qm-word" onClick={() => askQuestion(currentQ)} aria-label={`Hear ${currentQ.word.word}`}>
              {currentQ.word.word} <span aria-hidden>🔊</span>
            </button>
            <h2 className="question-text">What does “{currentQ.word.word}” mean?</h2>
            <div className="options-grid">
              {currentQ.options?.map((option, index) => {
                let optionClass = 'option-button'
                if (isAnswered) {
                  if (option === currentQ.correctAnswer) optionClass += ' correct'
                  else if (option === selectedOption) optionClass += ' not-this'
                }
                return (
                  <div key={index} className="qm-option-row">
                    <button
                      className={optionClass}
                      onClick={() => handleAnswer(option)}
                      disabled={isAnswered}
                    >
                      <span className="option-text">{option}</span>
                    </button>
                    {/* Pre-readers choose by ear: every meaning can be heard. */}
                    <button
                      className="qm-option-hear"
                      onClick={() => speak(option)}
                      aria-label={`Hear answer ${index + 1}`}
                    >
                      🔊
                    </button>
                  </div>
                )
              })}
            </div>
          </>
        ) : (
          <>
            <h2 className="question-text">Listen, then spell it!</h2>
            <div className="qm-sentence">“{maskedSentence}”</div>
            <div className="qm-hear-row">
              <Button onClick={() => askQuestion(currentQ)} variant="primary" icon="🔊">
                Hear it again
              </Button>
              <Button
                onClick={() => speak(`${currentQ.word.word} means ${currentQ.word.meaning}`)}
                variant="secondary"
                size="small"
                icon="📖"
              >
                Meaning
              </Button>
            </div>
            <div className="spell-input-section">
              <SpellingInput
                type="text"
                value={selectedOption || ''}
                onChange={(e) => setSelectedOption(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && selectedOption && handleAnswer(selectedOption)}
                className={`qm-input ${isAnswered ? (currentQ.isCorrect ? 'correct' : 'not-yet') : ''}`}
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
                Check it! →
              </Button>
            </div>
          </>
        )}

        {isAnswered && (
          <div className={`answer-feedback ${currentQ.isCorrect ? 'correct' : 'soft'}`} role="status">
            {currentQ.isCorrect ? (
              <span className="feedback-text">{line} ⭐</span>
            ) : (
              <span className="feedback-text">
                {skipped ? 'Here it is: ' : `${line} It’s `}
                <strong>{currentQ.correctAnswer}</strong>
              </span>
            )}
          </div>
        )}
      </div>

      <div className="quiz-controls">
        {isAnswered ? (
          <Button onClick={() => moveToNextQuestion()} variant="primary" icon="→">
            Next Question
          </Button>
        ) : (
          <Button onClick={handleSkip} variant="secondary" icon="🤔">
            Skip
          </Button>
        )}
      </div>
    </div>
  )
}

export default QuizMode
