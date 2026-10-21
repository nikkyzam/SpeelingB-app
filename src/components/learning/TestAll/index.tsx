import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import SpellingInput from '../../common/SpellingInput'
import { useAudio } from '../../../contexts/AudioContext'
import { useTheme } from '../../../contexts/ThemeContext'
import { useRewardStore } from '../../../stores/rewards/useRewardStore'
import { Word } from '../../../services/wordBank'
import { sameSpelling, escapeForRegExp } from '../../../services/words/spelling'
import { praise, nearly, spellOut, sayPrompt, isStreakMilestone } from '../../../services/words/praise'
import sfx from '../../games/shared/sfx'
import useLater from '../../games/shared/useLater'
import Burst from '../../games/shared/Burst'
import Button from '../../common/Button'
import WordTrail from '../WordTrail'
import { spellOutPause } from '../spellOutPause'
import './TestAll.css'

interface TestAllProps {
  difficulty?: 1 | 2 | 3
  /** Seconds per word when the child chooses the timer. The test is untimed unless they do. */
  timePerWord?: number
  words?: Word[]
  onMoveToGames?: () => void
}

interface TestResult {
  word: Word
  userAnswer: string
  isCorrect: boolean
}

/** At most this many words in one test. */
const MAX_WORDS = 50
/** The ring's circumference (r = 16 in a 36-unit box). */
const RING = 2 * Math.PI * 16

/**
 * A spell-them-all practice test — just the child and their words, no help.
 * It gates nothing and records nothing but stars: one per word spelled.
 */
const TestAll: React.FC<TestAllProps> = ({
  difficulty,
  timePerWord = 30,
  words: providedWords,
  onMoveToGames
}) => {
  const navigate = useNavigate()
  const { speak } = useAudio()
  const { world } = useTheme()
  const { addStars } = useRewardStore()
  const later = useLater()
  const [words, setWords] = useState<Word[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userInput, setUserInput] = useState('')
  const [results, setResults] = useState<TestResult[]>([])
  const [phase, setPhase] = useState<'intro' | 'testing' | 'done'>('intro')
  // Untimed unless the child picks the timer: a clock is a game for some
  // children and a panic for others, so it is their choice.
  const [timed, setTimed] = useState(false)
  const [timeLeft, setTimeLeft] = useState(timePerWord)
  // What just happened to the word on screen, shown for a moment before the next.
  const [flash, setFlash] = useState<{ ok: boolean; line: string } | null>(null)
  const [streak, setStreak] = useState(0)
  const [stars, setStars] = useState(0)
  const [burst, setBurst] = useState(0)
  // The ONE way the test moves on by itself; "Next" cancels it.
  const advanceTimer = useRef<number | null>(null)
  // A star per word, once per word while this screen is open: "Try again" is practice.
  const paid = useRef(new Set<string>())

  const clearAdvance = () => {
    if (advanceTimer.current) {
      window.clearTimeout(advanceTimer.current)
      advanceTimer.current = null
    }
  }
  useEffect(() => clearAdvance, [])

  const available = Math.min(MAX_WORDS, providedWords?.length ?? 0)

  /** Ask for a word. `queue` waits for the last word's letters instead of cutting them off. */
  const askWord = (w: Word | undefined, queue = false) => {
    if (!w) return
    if (queue) speak(sayPrompt(w.word, w.sentence), { queue: true })
    else speak(sayPrompt(w.word, w.sentence))
  }

  // The optional clock. It pauses while an answer is showing.
  useEffect(() => {
    if (phase !== 'testing' || !timed || flash) return
    if (timeLeft <= 0) {
      submit('timeout')
      return
    }
    const t = window.setTimeout(() => setTimeLeft((s) => s - 1), 1000)
    return () => window.clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, timed, timeLeft, flash])

  const startTest = (withTimer: boolean) => {
    // Only the child's own words — a test of words nobody taught them is not a test.
    const testWords: Word[] = [...(providedWords || [])]
      .sort(() => 0.5 - Math.random())
      .slice(0, MAX_WORDS)
    clearAdvance()
    setWords(testWords)
    setCurrentIndex(0)
    setUserInput('')
    setResults([])
    setFlash(null)
    setStreak(0)
    setStars(0)
    setTimed(withTimer)
    setTimeLeft(timePerWord)
    setPhase('testing')
    askWord(testWords[0])
  }

  /**
   * Check the word on screen. A time-up checks whatever is in the box;
   * "Stuck?" checks nothing and just shows the word.
   */
  const submit = (how: 'check' | 'timeout' | 'stuck' = 'check') => {
    if (phase !== 'testing' || flash) return
    const currentWord = words[currentIndex]
    if (!currentWord) return
    const typed = how === 'stuck' ? '' : userInput.trim()
    const ok = sameSpelling(typed, currentWord.word)

    setResults((prev) => [...prev, { word: currentWord, userAnswer: typed, isCorrect: ok }])

    if (ok) {
      const run = streak + 1
      const cheer = praise(run)
      setStreak(run)
      setBurst((b) => b + 1)
      sfx.correct()
      if (isStreakMilestone(run)) later(() => sfx.star(), 180)
      speak(cheer)
      if (!paid.current.has(currentWord.id)) {
        paid.current.add(currentWord.id)
        addStars(1)
        setStars((s) => s + 1)
      }
      setFlash({ ok: true, line: cheer })
    } else {
      // Nothing typed is not a mistake to point at.
      const soft = how === 'stuck' ? 'Here it is!' : how === 'timeout' && !typed ? 'Time’s up — no worries!' : nearly()
      setStreak(0)
      sfx.wrong()
      speak(`${soft} ${currentWord.word} is spelled ${spellOut(currentWord.word)}.`)
      setFlash({ ok: false, line: soft })
    }

    clearAdvance()
    // A shown answer is read letter by letter: stay long enough to hear it all,
    // and ask the next word behind it rather than over it.
    advanceTimer.current = window.setTimeout(() => {
      advanceTimer.current = null
      advance(!ok)
    }, ok ? 1200 : spellOutPause(currentWord.word, 2800))
  }

  const advance = (queuePrompt = false) => {
    clearAdvance()
    setFlash(null)
    setUserInput('')
    if (currentIndex < words.length - 1) {
      const nextIndex = currentIndex + 1
      setCurrentIndex(nextIndex)
      setTimeLeft(timePerWord)
      askWord(words[nextIndex], queuePrompt)
    } else {
      setPhase('done')
      sfx.win()
    }
  }

  const resetTest = () => {
    clearAdvance()
    setWords([])
    setCurrentIndex(0)
    setUserInput('')
    setResults([])
    setFlash(null)
    setTimeLeft(timePerWord)
    setPhase('intro')
  }

  if (phase === 'intro') {
    if (available === 0) {
      return (
        <div className="test-all-intro">
          <p>No words to test yet — learn a few first!</p>
        </div>
      )
    }
    return (
      <div className="test-all-intro">
        <div className="ta-intro-mascot" aria-hidden>{world.mascot}</div>
        <h1>📝 Spell your {available} {available === 1 ? 'word' : 'words'} — just you!</h1>
        <Button onClick={() => startTest(false)} variant="primary" size="large" icon="🚀">
          Start!
        </Button>
        {timePerWord > 0 && (
          <button className="ta-timer-choice" onClick={() => startTest(true)}>
            ⏱️ Try it with a timer
          </button>
        )}
      </div>
    )
  }

  if (phase === 'done') {
    const solved = results.filter((r) => r.isCorrect)
    const toPractise = results.filter((r) => !r.isCorrect)

    return (
      <div className="test-completed">
        <div className="ta-done-mascot" aria-hidden>{world.mascot}</div>
        <h1>🎉 Test done!</h1>
        {stars > 0 && (
          <div className="ta-done-stars">⭐ +{stars} {stars === 1 ? 'star' : 'stars'}</div>
        )}
        <p className="ta-done-line">
          {toPractise.length === 0
            ? 'Every word right — superstar! 🌟'
            : solved.length > 0
            ? `You spelled ${solved.length} ${solved.length === 1 ? 'word' : 'words'}! 💪`
            : 'Brave try! Every go makes the words stick. 💪'}
        </p>

        {solved.length > 0 && (
          <div className="ta-chips">
            {solved.map((r, i) => (
              <span key={`${r.word.id}-${i}`} className="ta-chip is-solved">⭐ {r.word.word}</span>
            ))}
          </div>
        )}

        {toPractise.length > 0 && (
          <div className="ta-practise">
            <h3>🌱 Words to practise</h3>
            <div className="ta-chips">
              {toPractise.map((r, i) => (
                <button
                  key={`${r.word.id}-${i}`}
                  className="ta-chip"
                  onClick={() => speak(`${r.word.word} is spelled ${spellOut(r.word.word)}.`)}
                >
                  {r.word.word} 🔊
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="test-actions">
          {toPractise.length > 0 && (
            // The words missed in this test, practised now. The tricky-word
            // review never had them: this test records nothing anywhere.
            <Button
              onClick={() =>
                navigate('/review', { state: { missed: toPractise.map((r) => r.word.id) } })
              }
              variant="primary"
              icon="🧠"
            >
              Practise the ones I missed
            </Button>
          )}

          {onMoveToGames && (
            <Button onClick={onMoveToGames} variant="success" icon="🎮">
              Play Games
            </Button>
          )}

          <Button onClick={resetTest} variant="secondary">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  const currentWord = words[currentIndex]
  const solvedIndexes = results.map((r, i) => (r.isCorrect ? i : -1)).filter((i) => i >= 0)
  const elapsed = timePerWord > 0 ? 1 - timeLeft / timePerWord : 0

  return (
    <div className="test-all">
      <WordTrail
        total={words.length}
        current={currentIndex}
        solved={solvedIndexes}
        mascot={world.mascot}
        streak={streak}
        stars={stars}
      />

      <div className="test-content">
        <div className="ta-card">
          <Burst trigger={burst} />
          {timed && (
            // A ring that slowly fills — no red, no ticking numbers, no pulse.
            <div className="ta-ring" role="timer" aria-label={`${timeLeft} seconds left`}>
              <svg viewBox="0 0 36 36" aria-hidden>
                <circle className="ta-ring-bg" cx="18" cy="18" r="16" />
                <circle
                  className="ta-ring-fill"
                  cx="18"
                  cy="18"
                  r="16"
                  strokeDasharray={RING}
                  strokeDashoffset={RING * (1 - elapsed)}
                />
              </svg>
              <span className="ta-ring-icon" aria-hidden>⏱️</span>
            </div>
          )}
          <div className="sentence-text">
            {/* Every match, any case — "Apparently, …" showed the answer. */}
            {currentWord.sentence.replace(new RegExp(escapeForRegExp(currentWord.word), 'gi'), '_______')}
          </div>
          <Button onClick={() => askWord(currentWord)} variant="secondary" size="small" icon="🔊">
            Hear it again
          </Button>
        </div>

        <div className="input-section">
          <SpellingInput
            type="text"
            value={userInput}
            onChange={(e) => { if (!flash) setUserInput(e.target.value) }}
            onKeyPress={(e) => e.key === 'Enter' && userInput.trim() && submit()}
            className={`test-input ${flash ? (flash.ok ? 'is-right' : 'is-shown') : ''}`}
            placeholder="Type the missing word..."
            autoFocus
          />
        </div>

        {flash && (
          <div className={`ta-flash ${flash.ok ? 'ok' : 'soft'}`} role="status">
            {flash.ok ? (
              <>{flash.line} ⭐</>
            ) : (
              <>
                <div>{flash.line} It’s <strong>{currentWord.word}</strong>.</div>
                <div className="ta-letters" aria-hidden>
                  {[...currentWord.word].map((c, i) => (
                    <span key={i} className="ta-letter" style={{ animationDelay: `${i * 0.12}s` }}>{c}</span>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        <div className="test-controls">
          {flash ? (
            <Button onClick={() => advance()} variant="primary" size="large">
              Next →
            </Button>
          ) : (
            <>
              <Button onClick={() => submit()} variant="primary" size="large" disabled={!userInput.trim()}>
                Check it! →
              </Button>
              <Button onClick={() => submit('stuck')} variant="secondary" icon="🤔">
                Stuck?
              </Button>
            </>
          )}
        </div>
        {difficulty && <div className="ta-level" aria-hidden>{'🐝'.repeat(difficulty)}</div>}
      </div>
    </div>
  )
}

export default TestAll
