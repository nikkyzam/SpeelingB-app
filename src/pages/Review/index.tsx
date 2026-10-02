import React, { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useProgress } from '../../contexts/ProgressContext'
// Same store as the header, so review stars actually show up.
import { useRewardStore } from '../../stores/rewards/useRewardStore'
import { wordBank, Word } from '../../services/wordBank'
import ReviewSchedule from '../../services/progress/ReviewSchedule'
import Button from '../../components/common/Button'
import SpellMode from '../../components/learning/SpellMode'
import Celebration, { CelebrationData } from '../../components/common/Celebration'
import './Review.css'

const HOW_MANY = 8

/** "Review Time!" — spaced repetition over the words that actually need it.
 *  Completing it awards stars. `?mode=tricky` drills only the stubborn ones;
 *  a quiz or test sends the words it just saw missed as `state.missed`. */
const Review: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { learningFlow } = useProgress()
  const { addStars } = useRewardStore()
  const [params] = useSearchParams()
  const tricky = params.get('mode') === 'tricky'
  const missedState = (location.state as { missed?: unknown } | null)?.missed
  const missedKey = Array.isArray(missedState)
    ? missedState.filter((id): id is string => typeof id === 'string').join('|')
    : ''

  const { words, source } = useMemo<{ words: Word[]; source: 'missed' | 'tricky' | 'due' | 'sample' }>(() => {
    const resolve = (ids: string[]) =>
      ids.map((id) => wordBank.getWordById(id)).filter((w): w is Word => !!w)

    // Just missed in a quiz or test: a word needs two misses to be tricky, and
    // a missed word isn't due until tomorrow, so neither list would have it.
    if (missedKey) {
      const missed = resolve([...new Set(missedKey.split('|'))].slice(0, HOW_MANY))
      if (missed.length > 0) return { words: missed, source: 'missed' }
    }

    if (tricky) {
      const stubborn = resolve(ReviewSchedule.getTrickyWordIds(HOW_MANY))
      if (stubborn.length > 0) return { words: stubborn, source: 'tricky' }
    }

    // Words the scheduler says are ripe: hardest and longest-waiting first.
    const due = resolve(ReviewSchedule.getDueWordIds(HOW_MANY))
    if (due.length > 0) return { words: due, source: 'due' }

    // Nothing scheduled yet (a brand new learner, or everything is fresh) —
    // fall back to a sample of what they've learned so the page is never empty.
    return { words: resolve(learningFlow.getReviewWordIds(HOW_MANY)), source: 'sample' }
  }, [learningFlow, tricky, missedKey])

  const [celebration, setCelebration] = useState<CelebrationData | null>(null)
  // When this review was the last thing between the child and the games, the
  // celebration sends them to play rather than back home.
  const [gamesNext, setGamesNext] = useState(false)

  // A review can come due with nothing in it — saved word ids the list no
  // longer knows. With nothing to practise, today's review is done; otherwise
  // the games would stay locked behind a page that can never be finished.
  const [nothingToPractise] = useState(
    () => words.length === 0 && !tricky && !learningFlow.isReviewSatisfiedToday()
  )
  useEffect(() => {
    if (nothingToPractise) learningFlow.markReviewDone()
  }, [nothingToPractise, learningFlow])

  const handleComplete = () => {
    learningFlow.markReviewDone()
    setGamesNext(learningFlow.gamesLockedReason() === null)
    const stars = Math.max(3, words.length)
    addStars(stars)
    setCelebration({
      title: source === 'tricky' || source === 'missed' ? 'Tricky words beaten! 💪' : 'Review done! 🧠',
      message: `You practised ${words.length} words — your brain is getting stronger!`,
      stars,
    })
  }

  if (words.length === 0) {
    return (
      <div className="review-page">
        <div className="review-empty">
          <div className="review-empty-icon" aria-hidden>🧠</div>
          <h1>{tricky ? 'No tricky words!' : nothingToPractise ? 'Nothing to review right now' : 'Nothing to review yet'}</h1>
          <p>
            {tricky
              ? 'You are not getting anything wrong often enough to call it tricky. Show-off! 😄'
              : nothingToPractise
              ? 'Your words are all fresh — off you go and play!'
              : 'Learn a few words first, then come back to practice them here!'}
          </p>
          {nothingToPractise ? (
            <Button variant="primary" icon="🎮" onClick={() => navigate('/games')}>Play Games</Button>
          ) : (
            <Button variant="primary" icon="📖" onClick={() => navigate('/learn')}>Go Learn Words</Button>
          )}
        </div>
      </div>
    )
  }

  const blurb = {
    missed: 'The words that caught you out just now — one more go and they’re yours. 💪',
    tricky: 'These are the ones that keep catching you out. Let’s beat them. 💪',
    due: 'These words are ready for another go — that’s how they stick. 🧠',
    sample: 'Spell the words you learned before. You’ve got this! 💪',
  }[source]

  return (
    <div className="review-page">
      <div className="review-header">
        <Button variant="secondary" size="small" onClick={() => navigate('/')}>← Home</Button>
        <h1>{source === 'missed' ? '💪 One More Go' : source === 'tricky' ? '💪 Tricky Words' : '🧠 Review Time!'}</h1>
        <p>{blurb}</p>
      </div>

      <SpellMode words={words} onComplete={handleComplete} />

      <Celebration
        data={celebration}
        onClose={() => { setCelebration(null); navigate(gamesNext ? '/games' : '/') }}
        closeLabel={gamesNext ? 'Play Games! 🎮' : 'Back Home'}
      />
    </div>
  )
}

export default Review
