import React, { useState, useEffect, useMemo, useRef } from 'react'
import { useAudio } from '../../../contexts/AudioContext'
import { useProgress } from '../../../contexts/ProgressContext'
import { useRewardStore } from '../../../stores/rewards/useRewardStore'
import { wordBank, Word } from '../../../services/wordBank'
import { chunkWord, wordFacts } from '../../../services/words/wordShape'
import WordMastery from '../../../services/progress/WordMastery'
import BuddyService from '../../../services/buddy/BuddyService'
import randomJoke, { WordJoke } from '../../../services/words/wordJokes'
import sfx from '../../games/shared/sfx'
import Button from '../../common/Button'
import QuickCheck from '../QuickCheck'
import './LearnMode.css'

interface LearnModeProps {
  onComplete?: () => void
  onMoveToPractice?: () => void
  difficulty?: 1 | 2 | 3
  words?: Word[]
}

/** Reading the card, or proving you read it. */
type Phase = 'reading' | 'checking'

const LearnMode: React.FC<LearnModeProps> = ({
  onComplete,
  onMoveToPractice,
  difficulty,
  words: providedWords
}) => {
  const { speak } = useAudio()
  const { learningFlow } = useProgress()
  const { addStars } = useRewardStore()
  const [currentWord, setCurrentWord] = useState<Word | null>(null)
  const [words, setWords] = useState<Word[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const [showGoalPrompt, setShowGoalPrompt] = useState(false)
  const [phase, setPhase] = useState<Phase>('reading')
  // A real streak of words got right without help — the old counter just
  // echoed the card number, which meant nothing.
  const [combo, setCombo] = useState(0)
  const [bestCombo, setBestCombo] = useState(0)
  const [starsEarned, setStarsEarned] = useState(0)
  const sayTimers = useRef<number[]>([])
  // The prize for finishing: a joke worth running off to tell someone.
  const [joke, setJoke] = useState<WordJoke>(() => randomJoke())
  const [punchline, setPunchline] = useState(false)

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
      setPhase('reading')
    } else {
      loadWords()
    }
  }, [difficulty, providedWords, learningFlow])

  useEffect(() => () => sayTimers.current.forEach((t) => window.clearTimeout(t)), [])

  const loadWords = () => {
    if (providedWords && providedWords.length > 0) {
      setWords(providedWords)

      const learnedTotal = learningFlow.getWordsLearnedTotal()
      const firstUnlearnedIndex = providedWords.findIndex(w => !learnedTotal.includes(w.id))
      const startIndex = firstUnlearnedIndex === -1 ? 0 : firstUnlearnedIndex

      setCurrentIndex(startIndex)
      setCurrentWord(providedWords[startIndex])
      setIsCompleted(false)
      setPhase('reading')
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
    setPhase('reading')
  }

  const chunks = useMemo(() => (currentWord ? chunkWord(currentWord.word) : []), [currentWord])
  const facts = useMemo(() => (currentWord ? wordFacts(currentWord.word) : []), [currentWord])

  /** Say the word slowly, one chunk at a time, then whole. */
  const sayItSlowly = () => {
    if (!currentWord) return
    sayTimers.current.forEach((t) => window.clearTimeout(t))
    sayTimers.current = []
    chunks.forEach((chunk, i) => {
      sayTimers.current.push(window.setTimeout(() => speak(chunk), i * 800))
    })
    sayTimers.current.push(window.setTimeout(() => speak(currentWord.word), chunks.length * 800 + 250))
  }

  /** The child has shown they know this word — bank it and move on. */
  const completeCurrentWord = (helped: boolean) => {
    if (!currentWord) return

    // Getting there unaided is worth more, but asking for help still earns:
    // a child who looks up the answer has still just read it carefully.
    const gained = helped ? 1 : 2
    setStarsEarned((s) => s + gained)
    addStars(gained)
    setCombo((c) => {
      const next = helped ? 0 : c + 1
      setBestCombo((b) => Math.max(b, next))
      return next
    })
    WordMastery.recordLearned()
    // Every word learned is a snack for the buddy — the only way to get them.
    BuddyService.earnSnack()

    const wasGoalReachedBefore = learningFlow.isDailyGoalReached()
    learningFlow.completeWord(currentWord.id)
    const isGoalReachedNow = learningFlow.isDailyGoalReached()
    const justHitGoal = !wasGoalReachedBefore && isGoalReachedNow

    setPhase('reading')

    if (currentIndex < words.length - 1) {
      if (justHitGoal) setShowGoalPrompt(true)
      const nextIndex = currentIndex + 1
      setCurrentIndex(nextIndex)
      setCurrentWord(words[nextIndex])
      speak(words[nextIndex].word)
      return
    }

    // Last word of the set.
    if (justHitGoal) {
      setShowGoalPrompt(true)
      return
    }
    sfx.win()
    setIsCompleted(true)
    if (onComplete) onComplete()
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1
      setCurrentIndex(prevIndex)
      setCurrentWord(words[prevIndex])
      setPhase('reading')
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
        <div className="lesson-scoreboard">
          <div className="lesson-stat"><span>⭐ Stars</span><strong>+{starsEarned}</strong></div>
          <div className="lesson-stat"><span>🔥 Best streak</span><strong>{bestCombo}</strong></div>
          <div className="lesson-stat"><span>📚 Words</span><strong>{words.length}</strong></div>
        </div>
        <div className="joke-card">
          <div className="joke-label">🤭 Word joke of the day</div>
          <p className="joke-setup">{joke.setup}</p>
          {punchline ? (
            <p className="joke-punchline">{joke.punchline}</p>
          ) : (
            <button
              className="joke-btn"
              onClick={() => { setPunchline(true); sfx.pop(); speak(joke.punchline) }}
            >
              Tell me! 🙉
            </button>
          )}
          {punchline && (
            <button
              className="joke-btn ghost"
              onClick={() => { setJoke((j) => randomJoke(j)); setPunchline(false) }}
            >
              Another one! 🔁
            </button>
          )}
        </div>

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

        {/* Sound it out: a long word is friendlier in small pieces. */}
        {chunks.length > 1 && (
          <div className="chunk-strip">
            {chunks.map((chunk, i) => (
              <React.Fragment key={i}>
                {i > 0 && <span className="chunk-dash" aria-hidden>-</span>}
                <button className="chunk" onClick={() => speak(chunk)}>{chunk}</button>
              </React.Fragment>
            ))}
          </div>
        )}

        <div className="word-facts">
          {facts.map((f) => (
            <span key={f} className="word-fact">{f}</span>
          ))}
        </div>

        <div className="audio-controls">
          <Button onClick={handleSpeak} icon="🔊">
            Hear Word
          </Button>
          <Button onClick={sayItSlowly} icon="🐢">
            Say it Slowly
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

      {phase === 'checking' ? (
        <QuickCheck
          key={currentWord.id}
          word={currentWord}
          variant={currentIndex}
          isLast={currentIndex === words.length - 1}
          onPass={completeCurrentWord}
        />
      ) : (
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
            onClick={() => { sfx.tap(); setPhase('checking') }}
            variant="primary"
            icon={currentIndex === words.length - 1 ? "🏁" : "→"}
          >
            Got it!
          </Button>
        </div>
      )}

      <div className="combo-display">
        <div className="combo-counter">
          <span className="combo-icon">🔥</span>
          <span className="combo-count">Streak: {combo}</span>
        </div>
        <div className="stars-earned">
          <span className="star-icon">⭐</span>
          <span className="star-count">Stars: {starsEarned}</span>
        </div>
      </div>
    </div>
  )
}

export default LearnMode
