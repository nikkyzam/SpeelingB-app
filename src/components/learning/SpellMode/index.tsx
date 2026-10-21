import React, { useState, useEffect, useRef } from 'react'
import { useAudio } from '../../../contexts/AudioContext'
import { useProgress } from '../../../contexts/ProgressContext'
import { useTheme } from '../../../contexts/ThemeContext'
import { useRewardStore } from '../../../stores/rewards/useRewardStore'
import { Word } from '../../../services/wordBank'
import WordMastery from '../../../services/progress/WordMastery'
import ReviewSchedule from '../../../services/progress/ReviewSchedule'
import { AchievementsService } from '../../../services/rewards/AchievementsService'
import BuddyService from '../../../services/buddy/BuddyService'
import useSpeechRecognition, { parseSpelling } from '../../../hooks/useSpeechRecognition'
import { explain } from '../../../services/words/explain'
import { sameSpelling, escapeForRegExp } from '../../../services/words/spelling'
import { praise, nearly, spellOut, sayPrompt, isStreakMilestone } from '../../../services/words/praise'
import sfx from '../../games/shared/sfx'
import useLater from '../../games/shared/useLater'
import Burst from '../../games/shared/Burst'
import Button from '../../common/Button'
import WordTrail from '../WordTrail'
import './SpellMode.css'
import SpellingInput from '../../common/SpellingInput'

/** How a finished set went, for the page that celebrates it. */
export interface SpellResult {
  /** Words spelled right on their one try. */
  correct: number
  /** Stars this component already paid out (one per word spelled). */
  stars: number
}

interface SpellModeProps {
  /**
   * Every id in the set (not only the right ones), plus how it went. These ids
   * are NOT the words spelled: a miss, a "Stuck?" and a word before the resume
   * point are in here too. Each word spelled right is credited here, on the
   * hit (`completeSpellQuiz([id])`), so a page must not credit `wordIds` again.
   */
  onComplete?: (wordIds: string[], result: SpellResult) => void
  onMoveToQuiz?: () => void
  difficulty?: 1 | 2 | 3
  isQuiz?: boolean
  words?: Word[]
  /**
   * Start at the first word not practised today (the default, so a child
   * coming back to the hub picks up where they left off). Review passes
   * false: its words were often met today, and it opened at word 3 of 5.
   */
  resume?: boolean
  /**
   * Show this component's own finish card. A page that celebrates the set
   * itself turns it off, or the card sits behind its Celebration.
   */
  summary?: boolean
}

const SpellMode: React.FC<SpellModeProps> = ({
  onComplete,
  onMoveToQuiz,
  difficulty,
  isQuiz = false,
  words: providedWords,
  resume = true,
  summary = true,
}) => {
  const { speak } = useAudio()
  const { learningFlow } = useProgress()
  const { world } = useTheme()
  const { addStars } = useRewardStore()
  const later = useLater()
  const [currentWord, setCurrentWord] = useState<Word | null>(null)
  const [words, setWords] = useState<Word[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userInput, setUserInput] = useState('')
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  // "Stuck?" shows the word. It is not an answer: it never counts as spelled,
  // and once a word is shown it can't be typed in for the credit.
  const [revealed, setRevealed] = useState(false)
  const [streak, setStreak] = useState(0)
  // The praise or "nearly" line for the answer just given — a fresh one each time.
  const [line, setLine] = useState('')
  const [burst, setBurst] = useState(0)
  // What they wrote, kept after the box is cleared so the tip can name the
  // exact mistake rather than give a generic rule.
  const [lastAttempt, setLastAttempt] = useState('')
  // Words spelled and stars paid in this set. Refs too: the finish can fire
  // from the advance timer, whose closure would hold the old state.
  const [solvedIds, setSolvedIds] = useState<string[]>([])
  const [stars, setStars] = useState(0)
  const solvedRef = useRef<string[]>([])
  const starsRef = useRef(0)
  // The ONE way this screen moves on by itself. A right answer or a "Stuck?"
  // schedules it; "Next Word" cancels it, or the two together skip a word.
  const advanceTimer = useRef<number | null>(null)
  const [isCompleted, setIsCompleted] = useState(false)
  // Spell-by-speaking: like a real spelling bee, say the letters out loud.
  const mic = useSpeechRecognition()

  const clearAdvance = () => {
    if (advanceTimer.current) {
      window.clearTimeout(advanceTimer.current)
      advanceTimer.current = null
    }
  }

  // Leaving mid-word must not finish the set (and report it) a second later.
  useEffect(() => clearAdvance, [])

  /** Ask for a word the way a spelling-bee pronouncer does. */
  const speakPrompt = (word: Word) => {
    speak(sayPrompt(word.word, word.sentence))
  }

  const startSet = () => {
    clearAdvance()
    solvedRef.current = []
    starsRef.current = 0
    setSolvedIds([])
    setStars(0)
    setStreak(0)
    setUserInput('')
    setIsCorrect(null)
    setRevealed(false)
    setLine('')
    if (providedWords && providedWords.length > 0) {
      setWords(providedWords)

      // Pick up at the first word not practised today, unless told to start at the top.
      const practicedToday = resume ? learningFlow.getWordsPracticedToday() : []
      const firstUnpracticedIndex = providedWords.findIndex(w => !practicedToday.includes(w.id))
      const startIndex = firstUnpracticedIndex === -1 ? 0 : firstUnpracticedIndex

      setCurrentIndex(startIndex)
      setCurrentWord(providedWords[startIndex])
      setIsCompleted(false)
      speakPrompt(providedWords[startIndex])
      return
    }
    // No fallback to the word bank. Every caller passes the words this child
    // is studying; inventing words here would put ones nobody taught them in
    // front of them, and the flow then records them as learned.
    setWords([])
    setCurrentWord(null)
    setCurrentIndex(0)
    setIsCompleted(false)
  }

  useEffect(() => {
    startSet()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficulty, providedWords, learningFlow])

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
    // A word already shown by "Stuck?" can't be typed in for the credit either.
    if (isCorrect !== null || revealed) return

    const answer = (spokenValue ?? userInput).toLowerCase().trim()
    // Accents set aside: a laptop keyboard can't type the ñ in "señor".
    const correct = sameSpelling(answer, currentWord.word)
    setLastAttempt(answer)
    setIsCorrect(correct)
    // Right or wrong, this word's next review date depends on what just happened.
    ReviewSchedule.record(currentWord.id, correct)

    if (correct) {
      const run = streak + 1
      const cheer = praise(run)
      setStreak(run)
      setLine(cheer)
      setBurst((b) => b + 1)
      sfx.correct()
      if (isStreakMilestone(run)) later(() => sfx.star(), 180)
      speak(cheer)

      // A real star for every word spelled — the one currency in the app.
      starsRef.current += 1
      setStars(starsRef.current)
      addStars(1)
      solvedRef.current = [...solvedRef.current, currentWord.id]
      setSolvedIds(solvedRef.current)

      // Track as spelled correctly today
      learningFlow.completeSpellQuiz([currentWord.id], 0)
      // Each correct spelling counts towards this word's third mastery star
      // and today's learning challenge.
      WordMastery.recordCorrect(currentWord.id)
      WordMastery.recordSpelled()
      BuddyService.earnSnack()
      // Badges only move if something tells them to.
      AchievementsService.recordWordSpelled(true, isQuiz)
      AchievementsService.recordComboAchieved(run)

      if (isQuiz) {
        // In quiz mode, mark as learned
        learningFlow.completeWord(currentWord.id)
      }

      clearAdvance()
      advanceTimer.current = window.setTimeout(() => {
        advanceTimer.current = null
        moveToNextWord()
      }, 1500)
    } else {
      // A miss is a soft "nearly" and the word spelled out, letter by letter —
      // saying the word again only repeats the sound they already heard.
      const soft = nearly()
      setLine(soft)
      setStreak(0)
      sfx.wrong()
      speak(`${soft} ${currentWord.word} is spelled ${spellOut(currentWord.word)}.`)
    }
  }

  const moveToNextWord = () => {
    clearAdvance()
    setUserInput('')
    setIsCorrect(null)
    setRevealed(false)
    setLine('')
    if (currentIndex < words.length - 1) {
      const nextIndex = currentIndex + 1
      setCurrentIndex(nextIndex)
      setCurrentWord(words[nextIndex])
      speakPrompt(words[nextIndex])
    } else {
      setIsCompleted(true)
      if (onComplete) {
        onComplete(words.map(w => w.id), { correct: solvedRef.current.length, stars: starsRef.current })
      }
    }
  }

  /**
   * "Stuck?" — show the word, spell it out loud, then move on. It used to be
   * two buttons (Reveal and Skip), and Reveal marked the word as right: a peek
   * earned "Yes! You spelled it!", and its own timer skipped a word when
   * "Next Word" was tapped in the gap. It writes nothing anywhere.
   */
  const handleStuck = () => {
    if (!currentWord || isCorrect !== null || revealed) return
    setRevealed(true)
    setUserInput(currentWord.word)
    setStreak(0)
    setLine('')
    speak(`${currentWord.word} is spelled ${spellOut(currentWord.word)}.`)
    clearAdvance()
    // Long enough to hear every letter before the next word is asked.
    advanceTimer.current = window.setTimeout(() => {
      advanceTimer.current = null
      moveToNextWord()
    }, 2500 + currentWord.word.length * 400)
  }

  const handleSpeakMeaning = () => {
    if (currentWord) {
      speak(`${currentWord.word} means ${currentWord.meaning}`)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }

  const getMaskedSentence = () => {
    if (!currentWord) return ''
    // Every match, any case: replacing the first exact match left the word on
    // screen whenever it began the sentence ("Apparently, …") or came twice.
    return currentWord.sentence.replace(new RegExp(escapeForRegExp(currentWord.word), 'gi'), '_______')
  }

  if (!currentWord) {
    // Not "loading" — there is nothing on the way. Either this group is empty
    // or the child's chosen level has no words in it, and saying so is the
    // only thing that tells them what to do about it.
    return (
      <div className="spell-mode">
        <p>No words to practise here yet — pick a different group, or ask a
        grown-up to change your word level in Settings.</p>
      </div>
    )
  }

  if (isCompleted) {
    if (!summary) {
      // The page is celebrating; this just keeps the space friendly beneath it.
      return (
        <div className="spell-mode sm-finished">
          <div className="sm-finished-mascot" aria-hidden>{world.mascot}</div>
          <p>All done! 🎉</p>
        </div>
      )
    }
    const everyOne = solvedIds.length === words.length
    return (
      <div className="spell-completed">
        <h2>{isQuiz ? '🎯 Quiz done!' : '✨ All spelled!'}</h2>
        {stars > 0 && <div className="sm-done-stars">⭐ +{stars} {stars === 1 ? 'star' : 'stars'}</div>}
        <p className="sm-done-line">{everyOne ? 'Every single one! 🌟' : 'Great practice — every go makes you stronger! 💪'}</p>
        <div className="sm-done-words">
          {words.map((w) => (
            <span key={w.id} className={`sm-done-chip ${solvedIds.includes(w.id) ? 'is-solved' : ''}`}>
              {solvedIds.includes(w.id) ? '⭐ ' : ''}{w.word}
            </span>
          ))}
        </div>
        <div className="completed-actions">
          {!isQuiz && onMoveToQuiz && learningFlow.isDailyGoalReached() && (
            <Button onClick={onMoveToQuiz} variant="success" icon="🎯">
              Take Spelling Quiz
            </Button>
          )}
          <Button onClick={startSet} variant="secondary">
            Practice More
          </Button>
        </div>
      </div>
    )
  }

  const answered = isCorrect !== null || revealed
  const solvedIndexes = words.map((w, i) => (solvedIds.includes(w.id) ? i : -1)).filter((i) => i >= 0)
  const letters = [...currentWord.word]

  return (
    <div className="spell-mode">
      <WordTrail
        total={words.length}
        current={currentIndex}
        solved={solvedIndexes}
        mascot={world.mascot}
        streak={streak}
        stars={stars}
      />

      {isQuiz && (
        <div className="quiz-badge">
          🎯 Quiz Mode
        </div>
      )}

      <div className="spell-content">
        <div className="sentence-display">
          <Burst trigger={burst} />
          <div
            className={`spell-mascot ${isCorrect === true ? 'is-happy' : isCorrect === false ? 'is-oops' : ''}`}
            aria-hidden
          >
            {isCorrect === true ? '🎉' : world.mascot}
          </div>
          <div className="sentence-text">{getMaskedSentence()}</div>
          <div className="sm-hear-row">
            <Button
              onClick={() => speakPrompt(currentWord)}
              variant="secondary"
              icon="🔊"
              size="small"
            >
              Hear it again
            </Button>
            <Button
              onClick={handleSpeakMeaning}
              variant="secondary"
              icon="📖"
              size="small"
            >
              Meaning
            </Button>
          </div>
        </div>

        <div className="input-section">
          <div className="input-wrapper">
            <SpellingInput
              type="text"
              value={userInput}
              onChange={(e) => { if (!revealed) setUserInput(e.target.value) }}
              onKeyPress={handleKeyPress}
              className={`spell-input ${isCorrect === true ? 'correct' : isCorrect === false ? 'not-yet' : revealed ? 'shown' : ''}`}
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
            </div>
          </div>

          {mic.listening && (
            <div className="mic-hint" role="status">
              🐝 Say the letters one by one — like “C… A… T”!
            </div>
          )}

          {isCorrect === false && (
            <div className="feedback sm-nearly" role="status">
              <div>{line} It’s <strong>{currentWord.word}</strong>.</div>
              <div className="sm-letters" aria-hidden>
                {letters.map((c, i) => (
                  <span key={i} className="sm-letter" style={{ animationDelay: `${i * 0.12}s` }}>{c}</span>
                ))}
              </div>
              {/* The rule, not just the answer: one word learned versus fifty. */}
              <div className="feedback-why">
                <span aria-hidden>💡</span> {explain(currentWord.word, lastAttempt).tip}
              </div>
            </div>
          )}

          {revealed && (
            <div className="feedback sm-shown" role="status">
              <div>Here it is: <strong>{currentWord.word}</strong></div>
              <div className="sm-letters" aria-hidden>
                {letters.map((c, i) => (
                  <span key={i} className="sm-letter" style={{ animationDelay: `${i * 0.12}s` }}>{c}</span>
                ))}
              </div>
            </div>
          )}

          {isCorrect === true && (
            <div className="feedback correct-feedback" role="status">
              {line} ⭐
            </div>
          )}
        </div>

        <div className="action-buttons">
          <Button
            // Once an answer is in, this button moves on rather than re-scoring
            // it. It used to call handleSubmit either way, which the one-answer
            // guard then swallowed — leaving a child stuck on a word they had
            // just got wrong, staring at a greyed-out "Next Word".
            onClick={() => (answered ? moveToNextWord() : handleSubmit())}
            variant="primary"
            disabled={!answered && !userInput.trim()}
            size="large"
          >
            {answered ? 'Next Word' : 'Check it!'} →
          </Button>

          {!answered && (
            <Button onClick={handleStuck} variant="secondary" icon="🤔">
              Stuck?
            </Button>
          )}

          {!isQuiz && onMoveToQuiz && learningFlow.isDailyGoalReached() && (
            <Button
              onClick={onMoveToQuiz}
              variant="success"
              icon="🎯"
              size="small"
            >
              Take Quiz
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default SpellMode
