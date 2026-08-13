import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProgress } from '../../contexts/ProgressContext'
import { useRewardStore } from '../../stores/rewardStore'
import { wordBank, Word } from '../../services/wordBank'
import Button from '../../components/common/Button'
import SpellMode from '../../components/learning/SpellMode'
import Celebration, { CelebrationData } from '../../components/common/Celebration'
import './Review.css'

/** "Review Time!" — a friendly spaced-repetition quiz over words the child has
 *  already learned. Optional bonus; completing it awards stars. */
const Review: React.FC = () => {
  const navigate = useNavigate()
  const { learningFlow } = useProgress()
  const { addStars } = useRewardStore()

  const words = useMemo<Word[]>(() => {
    return learningFlow
      .getReviewWordIds(8)
      .map((id) => wordBank.getWordById(id))
      .filter((w): w is Word => !!w)
  }, [learningFlow])

  const [celebration, setCelebration] = useState<CelebrationData | null>(null)

  const handleComplete = () => {
    learningFlow.markReviewDone()
    const stars = Math.max(3, words.length)
    addStars(stars)
    setCelebration({
      title: 'Review done! 🧠',
      message: `You reviewed ${words.length} words — your brain is getting stronger!`,
      stars,
    })
  }

  if (words.length === 0) {
    return (
      <div className="review-page">
        <div className="review-empty">
          <div className="review-empty-icon" aria-hidden>🧠</div>
          <h1>Nothing to review yet</h1>
          <p>Learn a few words first, then come back to practice them here!</p>
          <Button variant="primary" icon="📖" onClick={() => navigate('/learn')}>Go Learn Words</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="review-page">
      <div className="review-header">
        <Button variant="secondary" size="small" onClick={() => navigate('/')}>← Home</Button>
        <h1>🧠 Review Time!</h1>
        <p>Spell the words you learned before. You&apos;ve got this! 💪</p>
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
