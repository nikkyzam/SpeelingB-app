import React, { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
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
 *  Completing it awards stars. `?mode=tricky` drills only the stubborn ones. */
const Review: React.FC = () => {
  const navigate = useNavigate()
  const { learningFlow } = useProgress()
  const { addStars } = useRewardStore()
  const [params] = useSearchParams()
  const tricky = params.get('mode') === 'tricky'

  const { words, source } = useMemo<{ words: Word[]; source: 'tricky' | 'due' | 'sample' }>(() => {
    const resolve = (ids: string[]) =>
      ids.map((id) => wordBank.getWordById(id)).filter((w): w is Word => !!w)

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
  }, [learningFlow, tricky])

  const [celebration, setCelebration] = useState<CelebrationData | null>(null)

  const handleComplete = () => {
    learningFlow.markReviewDone()
    const stars = Math.max(3, words.length)
    addStars(stars)
    setCelebration({
      title: source === 'tricky' ? 'Tricky words beaten! 💪' : 'Review done! 🧠',
      message: `You practised ${words.length} words — your brain is getting stronger!`,
      stars,
    })
  }

  if (words.length === 0) {
    return (
      <div className="review-page">
        <div className="review-empty">
          <div className="review-empty-icon" aria-hidden>🧠</div>
          <h1>{tricky ? 'No tricky words!' : 'Nothing to review yet'}</h1>
          <p>
            {tricky
              ? 'You are not getting anything wrong often enough to call it tricky. Show-off! 😄'
              : 'Learn a few words first, then come back to practice them here!'}
          </p>
          <Button variant="primary" icon="📖" onClick={() => navigate('/learn')}>Go Learn Words</Button>
        </div>
      </div>
    )
  }

  const blurb = {
    tricky: 'These are the ones that keep catching you out. Let’s beat them. 💪',
    due: 'These words are ready for another go — that’s how they stick. 🧠',
    sample: 'Spell the words you learned before. You’ve got this! 💪',
  }[source]

  return (
    <div className="review-page">
      <div className="review-header">
        <Button variant="secondary" size="small" onClick={() => navigate('/')}>← Home</Button>
        <h1>{source === 'tricky' ? '💪 Tricky Words' : '🧠 Review Time!'}</h1>
        <p>{blurb}</p>
      </div>

      <SpellMode words={words} onComplete={handleComplete} />

      <Celebration
        data={celebration}
        onClose={() => { setCelebration(null); navigate('/') }}
        closeLabel="Back Home"
      />
    </div>
  )
}

export default Review
