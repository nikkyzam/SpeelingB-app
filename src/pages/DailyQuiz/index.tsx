import React, { useMemo, useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProgress } from '../../contexts/ProgressContext'
import { useTheme } from '../../contexts/ThemeContext'
import { useAudio } from '../../contexts/AudioContext'
import { useRewardStore } from '../../stores/rewardStore'
import { wordBank, Word } from '../../services/wordBank'
import Button from '../../components/common/Button'
import Celebration, { CelebrationData } from '../../components/common/Celebration'
import './DailyQuiz.css'

/**
 * The daily gate for games: spell EVERY word learned so far, in random order.
 * Missed words go to the back of the queue rather than failing the child, so
 * the quiz is always finishable — it just takes another try.
 */
const DailyQuiz: React.FC = () => {
  const navigate = useNavigate()
  const { learningFlow } = useProgress()
  const { world } = useTheme()
  const { speak } = useAudio()
  const { addStars } = useRewardStore()

  const allWords = useMemo<Word[]>(
    () =>
      learningFlow
        .getDailyQuizWordIds()
        .map((id) => wordBank.getWordById(id))
        .filter((w): w is Word => !!w),
    [learningFlow]
  )

  const alreadyPassed = learningFlow.isDailyQuizPassed()

  const [queue, setQueue] = useState<Word[]>([])
  const [done, setDone] = useState<string[]>([])
  const [input, setInput] = useState('')
  const [result, setResult] = useState<'right' | 'wrong' | null>(null)
  const [retries, setRetries] = useState(0)
  const [celebration, setCelebration] = useState<CelebrationData | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setQueue(allWords)
  }, [allWords])

  const current = queue[0]
  const total = allWords.length
  const solved = done.length

  const say = (w: Word) => speak(`${w.word}. ${w.sentence}`)

  useEffect(() => {
    if (current) say(current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current?.id])

  if (total === 0) {
    // If ids were saved but none resolve, don't leave the child stuck behind a
    // quiz that can never run — open the games for today instead.
    const hasUnresolvableProgress = learningFlow.getWordsLearnedTotal().length > 0
    return (
      <div className="daily-quiz">
        <div className="dq-empty">
          <div className="dq-empty-icon" aria-hidden>{world.mascot}</div>
          <h1>No words yet!</h1>
          <p>Learn some words first, then come back and win your games.</p>
          {hasUnresolvableProgress ? (
            <Button
              variant="success"
              icon="🎮"
              onClick={() => { learningFlow.passDailyQuiz(); navigate('/games') }}
            >
              Open my games
            </Button>
          ) : (
            <Button variant="primary" icon="📖" onClick={() => navigate('/learn')}>Go Learn Words</Button>
          )}
        </div>
      </div>
    )
  }

  if (alreadyPassed && !current) {
    return (
      <div className="daily-quiz">
        <div className="dq-empty">
          <div className="dq-empty-icon" aria-hidden>🏆</div>
          <h1>Today&apos;s quiz is done!</h1>
          <p>All your games are unlocked for today. Go play!</p>
          <Button variant="success" icon="🎮" onClick={() => navigate('/games')}>Play Games</Button>
        </div>
      </div>
    )
  }

  const check = () => {
    if (!current || result) return
    const ok = input.trim().toLowerCase() === current.word.toLowerCase()

    if (ok) {
      setResult('right')
      const nextDone = [...done, current.word]
      setTimeout(() => {
        setResult(null)
        setInput('')
        setDone(nextDone)
        const rest = queue.slice(1)
        setQueue(rest)
        if (rest.length === 0) {
          // Every learned word spelled — games are open for today.
          learningFlow.passDailyQuiz()
          const stars = Math.max(5, total * 2)
          addStars(stars)
          setCelebration({
            title: 'Quiz passed! 🏆',
            message: `You spelled all ${total} of your words! Every game is unlocked today.`,
            stars,
          })
        } else {
          inputRef.current?.focus()
        }
      }, 900)
    } else {
      setResult('wrong')
      setRetries((r) => r + 1)
      speak(`It is spelled ${current.word}`)
      setTimeout(() => {
        setResult(null)
        setInput('')
        // Put the tricky word back at the end so the quiz stays winnable.
        setQueue((q) => [...q.slice(1), q[0]])
        inputRef.current?.focus()
      }, 1800)
    }
  }

  const progress = total ? (solved / total) * 100 : 0

  return (
    <div className="daily-quiz">
      <div className="dq-header">
        <Button variant="secondary" size="small" onClick={() => navigate('/games')}>← Back</Button>
        <h1>🏆 Daily Quiz</h1>
        <p>Spell all {total} of your words to unlock every game today!</p>
      </div>

      <div className="dq-progress">
        <div className="dq-track">
          <div className="dq-fill" style={{ width: `${progress}%` }}>
            <span className="dq-runner" aria-hidden>{world.mascot}</span>
          </div>
        </div>
        <div className="dq-counts">
          <span>{solved} / {total} spelled</span>
          {retries > 0 && <span className="dq-retries">{retries} to try again</span>}
        </div>
      </div>

      {current && (
        <div className="dq-card">
          <div className="dq-sentence">
            &ldquo;{current.sentence.replace(new RegExp(current.word, 'gi'), '_______')}&rdquo;
          </div>

          <div className="dq-audio">
            <button className="dq-hear" onClick={() => say(current)}>🔊 Hear it again</button>
            <button className="dq-hear ghost" onClick={() => speak(current.meaning)}>📖 Hear meaning</button>
          </div>

          <input
            ref={inputRef}
            className={`dq-input ${result ?? ''}`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && check()}
            placeholder="Type the word..."
            disabled={!!result}
            autoFocus
          />

          <Button variant="primary" size="large" onClick={check} disabled={!input.trim() || !!result}>
            Check it! →
          </Button>

          {result === 'right' && <div className="dq-flash ok">Yes! ⭐</div>}
          {result === 'wrong' && (
            <div className="dq-flash bad">
              It&apos;s &ldquo;{current.word}&rdquo; — we&apos;ll try it again in a bit! 💪
            </div>
          )}
        </div>
      )}

      <Celebration
        data={celebration}
        onClose={() => { setCelebration(null); navigate('/games') }}
        closeLabel="Play Games! 🎮"
      />
    </div>
  )
}

export default DailyQuiz
