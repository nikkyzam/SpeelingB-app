import React, { useMemo, useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProgress } from '../../contexts/ProgressContext'
import { useTheme } from '../../contexts/ThemeContext'
import { useAudio } from '../../contexts/AudioContext'
// Stars must land in the same pot the header shows, or the reward never
// visibly arrives.
import { useRewardStore } from '../../stores/rewards/useRewardStore'
import { wordBank, Word } from '../../services/wordBank'
import Button from '../../components/common/Button'
import Celebration, { CelebrationData } from '../../components/common/Celebration'
import './DailyQuiz.css'
import SpellingInput from '../../components/common/SpellingInput'
import { sameSpelling, matchedWithoutAccents, escapeForRegExp } from '../../services/words/spelling'
import { praise, nearly, spellOut, sayPrompt, isStreakMilestone } from '../../services/words/praise'
import sfx from '../../components/games/shared/sfx'
import Burst from '../../components/games/shared/Burst'
import { trailCheer } from '../../components/learning/WordTrail'
import { spellOutPause } from '../../components/learning/spellOutPause'

/**
 * The daily gate for games: spell today's words (as many as the daily goal), in random order.
 * Missed words go to the back of the queue rather than failing the child, so
 * the quiz is always finishable — it just takes another try.
 */
interface QuizProps {
  /** daily: today's words, opens the games. weekly: the whole week's words. */
  mode?: 'daily' | 'weekly'
}

const DailyQuiz: React.FC<QuizProps> = ({ mode = 'daily' }) => {
  const weekly = mode === 'weekly'
  const navigate = useNavigate()
  const { learningFlow } = useProgress()
  const { world } = useTheme()
  const { speak } = useAudio()
  const { addStars } = useRewardStore()

  const allWords = useMemo<Word[]>(
    () =>
      (weekly ? learningFlow.getWeeklyQuizWordIds() : learningFlow.getDailyQuizWordIds())
        .map((id) => wordBank.getWordById(id))
        .filter((w): w is Word => !!w),
    [learningFlow, weekly]
  )

  const alreadyPassed = weekly ? learningFlow.isWeeklyQuizPassed() : learningFlow.isDailyQuizPassed()

  const [queue, setQueue] = useState<Word[]>([])
  const [done, setDone] = useState<string[]>([])
  const [input, setInput] = useState('')
  const [result, setResult] = useState<'right' | 'wrong' | null>(null)
  // Words missed and not yet spelled on a later try — what "to try again" counts.
  const [missed, setMissed] = useState<string[]>([])
  const [accentNote, setAccentNote] = useState(false)
  // Right answers in a row, the line said for the last answer, and the
  // runner's cheer at halfway and one to go.
  const [streak, setStreak] = useState(0)
  const [line, setLine] = useState('')
  const [cheer, setCheer] = useState<string | null>(null)
  const [burst, setBurst] = useState(0)
  // Said just before the next word, so the word's own prompt can't cut it off.
  const pendingCheer = useRef('')
  // After a miss the letters are still being read out: the next prompt waits
  // for them instead of cancelling them.
  const queueNextPrompt = useRef(false)
  // Bumped each time the queue moves on, so a word that comes straight back
  // (the last one left, missed) is asked again too.
  const [turn, setTurn] = useState(0)
  const [celebration, setCelebration] = useState<CelebrationData | null>(null)
  // Passing the quiz can still leave a review between the child and the games.
  const [reviewNext, setReviewNext] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout>>()
  const checking = useRef(false)

  useEffect(() => {
    setQueue(!weekly && learningFlow.isDailyQuizPassed() ? [] : allWords)
    setDone([])
    setMissed([])
    setInput('')
    setResult(null)
    setCelebration(null)
    setStreak(0)
    setCheer(null)
    pendingCheer.current = ''
    queueNextPrompt.current = false
    checking.current = false
    return () => clearTimeout(timerRef.current)
  }, [allWords, learningFlow, weekly])

  const current = queue[0]
  const total = allWords.length
  const solved = done.length

  const say = (w: Word) => speak(sayPrompt(w.word, w.sentence))

  useEffect(() => {
    if (!current) return
    const before = pendingCheer.current
    pendingCheer.current = ''
    const line = before ? `${before} ${sayPrompt(current.word, current.sentence)}` : sayPrompt(current.word, current.sentence)
    if (queueNextPrompt.current) {
      queueNextPrompt.current = false
      speak(line, { queue: true })
    } else {
      speak(line)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current?.id, turn])

  if (total === 0) {
    // If ids were saved but none resolve, don't leave the child stuck behind a
    // quiz that can never run — open the games for today instead.
    const hasUnresolvableProgress = !weekly && learningFlow.getWordsLearnedTotal().length > 0
    return (
      <div className="daily-quiz">
        <div className="dq-empty">
          <div className="dq-empty-icon" aria-hidden>{world.mascot}</div>
          <h1>{weekly ? 'No words for this week yet!' : 'No words yet!'}</h1>
          <p>{weekly ? 'Learn some new words, then come back for your weekly quiz.' : 'Learn some words first, then come back and win your games.'}</p>
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

  if (alreadyPassed && !current && !weekly && !celebration) {
    const reviewWaiting = learningFlow.gamesLockedReason() === 'review'
    return (
      <div className="daily-quiz">
        <div className="dq-empty">
          <div className="dq-empty-icon" aria-hidden>{reviewWaiting ? '🧠' : '🏆'}</div>
          <h1>{weekly ? 'This week’s quiz is done!' : 'Today’s quiz is done!'}</h1>
          <p>
            {weekly
              ? 'You can take it again for practice — a new one starts on Monday.'
              : reviewWaiting
              ? 'One more step: a quick review opens every game.'
              : 'All your games are unlocked for today. Go play!'}
          </p>
          {reviewWaiting ? (
            <Button variant="primary" icon="🧠" onClick={() => navigate('/review')}>Start Review</Button>
          ) : (
            <Button variant="success" icon="🎮" onClick={() => navigate('/games')}>Play Games</Button>
          )}
        </div>
      </div>
    )
  }

  const check = () => {
    if (!current || result || checking.current) return
    checking.current = true
    const ok = sameSpelling(input, current.word)

    if (ok) {
      const run = streak + 1
      const cheerLine = praise(run)
      setStreak(run)
      setLine(cheerLine)
      setBurst((b) => b + 1)
      setResult('right')
      setAccentNote(matchedWithoutAccents(input, current.word))
      sfx.correct()
      if (isStreakMilestone(run)) sfx.star()
      speak(cheerLine)
      const nextDone = [...done, current.word]
      timerRef.current = setTimeout(() => {
        checking.current = false
        setResult(null)
        setInput('')
        setDone(nextDone)
        // The runner calls out halfway and one to go as it moves.
        const call = trailCheer(nextDone.length, total)
        setCheer(call)
        pendingCheer.current = call ?? ''
        setMissed((m) => m.filter((id) => id !== current.id))
        const rest = queue.slice(1)
        setQueue(rest)
        setTurn((t) => t + 1)
        if (rest.length === 0) {
          if (weekly) {
            // Stars once a week; a replay is practice, not a star farm.
            const first = !learningFlow.isWeeklyQuizPassed()
            learningFlow.passWeeklyQuiz()
            const stars = first ? Math.max(20, total * 3) : 0
            if (stars) addStars(stars)
            setCelebration({
              title: 'Weekly quiz passed! 🏅',
              message: `You spelled all ${total} of this week’s words!`,
              stars,
            })
          } else {
            // Today's words spelled. The games open — unless a review is still
            // waiting, in which case that is what the child is sent to next.
            const first = !learningFlow.isDailyQuizPassed()
            learningFlow.passDailyQuiz()
            const stars = first ? Math.max(5, total * 2) : 0
            if (stars) addStars(stars)
            const review = learningFlow.gamesLockedReason() === 'review'
            setReviewNext(review)
            setCelebration({
              title: 'Quiz passed! 🏆',
              message: review
                ? `You spelled all ${total} of today’s words! One quick review and every game is open.`
                : `You spelled all ${total} of today’s words! Every game is unlocked today.`,
              stars,
            })
          }
        } else {
          inputRef.current?.focus()
        }
      }, 900)
    } else {
      // A soft "nearly", and the letters said one by one — repeating the word
      // only repeats the sound they already heard.
      const soft = nearly()
      setStreak(0)
      setLine(soft)
      setCheer(null)
      setResult('wrong')
      setMissed((m) => (m.includes(current.id) ? m : [...m, current.id]))
      sfx.wrong()
      speak(`${soft} ${current.word} is spelled ${spellOut(current.word)}.`)
      // Up long enough to hear every letter (a flat 3s cut most words off).
      timerRef.current = setTimeout(() => {
        checking.current = false
        setResult(null)
        setInput('')
        queueNextPrompt.current = true
        // Put the tricky word back at the end so the quiz stays winnable.
        setQueue((q) => [...q.slice(1), q[0]])
        setTurn((t) => t + 1)
        inputRef.current?.focus()
      }, spellOutPause(current.word, 3000))
    }
  }

  const progress = total ? (solved / total) * 100 : 0

  return (
    <div className="daily-quiz">
      <div className="dq-header">
        {/* Home, not the games: before this quiz is passed they are usually still locked. */}
        <Button variant="secondary" size="small" onClick={() => navigate('/spelling')}>← Spelling</Button>
        <h1>{weekly ? '🏅 Weekly Quiz' : '🏆 Daily Quiz'}</h1>
        <p>
          {weekly
            ? `Spell all ${total} words you learned this week!`
            : `Spell today’s ${total} words to unlock every game today!`}
        </p>
      </div>

      <div className="dq-progress">
        <div className="dq-track">
          <div className="dq-fill" style={{ width: `${progress}%` }}>
            <span key={solved} className="dq-runner" aria-hidden>{world.mascot}</span>
          </div>
        </div>
        <div className="dq-counts">
          <span>{solved} / {total} spelled</span>
          {streak >= 2 && (
            <span key={isStreakMilestone(streak) ? streak : 'run'} className={`dq-streak ${isStreakMilestone(streak) ? 'is-milestone' : ''}`}>
              🔥 {streak}
            </span>
          )}
          {missed.length > 0 && <span className="dq-retries">{missed.length} to try again</span>}
        </div>
        {cheer && current && <div key={cheer} className="dq-cheer" role="status">{cheer}</div>}
      </div>

      {current && (
        <div className="dq-card">
          <Burst trigger={burst} />
          <div className="dq-sentence">
            &ldquo;{current.sentence.replace(new RegExp(escapeForRegExp(current.word), 'gi'), '_______')}&rdquo;
          </div>

          <div className="dq-audio">
            <button className="dq-hear" onClick={() => say(current)}>🔊 Hear it again</button>
            <button className="dq-hear ghost" onClick={() => speak(current.meaning)}>📖 Hear meaning</button>
          </div>

          <SpellingInput
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

          {result === 'right' && (
            <div className="dq-flash ok" role="status">
              {line} ⭐{accentNote && <> It&apos;s written &ldquo;{current.word}&rdquo;.</>}
            </div>
          )}
          {result === 'wrong' && (
            <div className="dq-flash soft" role="status">
              <div>{line} It&apos;s &ldquo;{current.word}&rdquo; — we&apos;ll try it again in a bit! 💪</div>
              <div className="dq-letters" aria-hidden>
                {[...current.word].map((c, i) => (
                  <span key={i} className="dq-letter" style={{ animationDelay: `${i * 0.12}s` }}>{c}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <Celebration
        data={celebration}
        autoClose={false}
        onClose={() => { setCelebration(null); navigate(reviewNext ? '/review' : '/games') }}
        closeLabel={reviewNext ? 'Start Review 🧠' : 'Play Games! 🎮'}
      />
    </div>
  )
}

export default DailyQuiz
