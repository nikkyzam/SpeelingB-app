import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../../contexts/UserContext'
import { useProgress } from '../../contexts/ProgressContext'
import { useTheme } from '../../contexts/ThemeContext'
import { useRewardStore } from '../../stores/rewardStore'
import { useStreak } from '../../hooks/useStreak'
import Button from '../../components/common/Button'
import AuthModal from '../../components/auth/AuthModal'
import './Home.css'

const Home: React.FC = () => {
  const navigate = useNavigate()
  const { user, logout } = useUser()
  const { learningFlow } = useProgress()
  const { world } = useTheme()
  const wordsLearnedToday = learningFlow.getWordsLearnedToday().length
  const dailyGoal = learningFlow.getDailyGoal('learn')
  const { heavenlyStars } = useRewardStore()
  const { streakData, updateStreak } = useStreak()

  const [dailyCompleted, setDailyCompleted] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  useEffect(() => {
    updateStreak()
    const completed = wordsLearnedToday >= dailyGoal
    setDailyCompleted(completed)
    if (completed) {
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3000)
    }
  }, [])

  const progressPercentage = Math.min((wordsLearnedToday / dailyGoal) * 100, 100)
  const reviewDue = learningFlow.isReviewDue()
  const name = user?.name || 'friend'

  const greeting = dailyCompleted
    ? `Woohoo, ${name}! You crushed today's goal! 🎉`
    : `Hi ${name}! Ready to play with some words?`

  const playCards = [
    { icon: '📖', label: 'Learn Words', sub: 'Meet new words', path: '/learn', tone: 'primary' },
    { icon: '✏️', label: 'Spell It!', sub: 'Type what you hear', path: '/learn?mode=spell', tone: 'secondary' },
    { icon: '🎮', label: 'Play Games', sub: dailyCompleted ? 'Unlocked!' : 'Finish learning first', path: '/games', tone: 'accent' },
    { icon: '🏆', label: 'My Prizes', sub: 'Spend your stars', path: '/rewards', tone: 'success' },
  ] as const

  return (
    <div className="home-page">
      {/* Hero — mascot greeting */}
      <section className="hero-card pop-in">
        <div className="hero-mascot wiggle" aria-hidden>{world.mascot}</div>
        <div className="hero-text">
          <div className="hero-top">
            <h1>{greeting}</h1>
            {user?.isGuest ? (
              <Button variant="secondary" size="small" onClick={() => setIsAuthModalOpen(true)}>
                Sign In
              </Button>
            ) : (
              <Button variant="secondary" size="small" onClick={logout}>
                Log out
              </Button>
            )}
          </div>
          <p className="hero-tagline">{world.name} — {world.tagline}</p>

          <div className="chips-row">
            <div className="chip">
              <span className="chip-icon">🔥</span>
              <span className="chip-value">{streakData.currentStreak}</span>
              <span className="chip-label">day streak</span>
            </div>
            <div className="chip">
              <span className="chip-icon">⭐</span>
              <span className="chip-value">{heavenlyStars}</span>
              <span className="chip-label">stars</span>
            </div>
            <div className="chip">
              <span className="chip-icon">📚</span>
              <span className="chip-value">{wordsLearnedToday}/{dailyGoal}</span>
              <span className="chip-label">words today</span>
            </div>
          </div>
        </div>
      </section>

      {/* Today's quest progress */}
      <section className="quest-card">
        <div className="quest-head">
          <h2>🎯 Today&apos;s Quest</h2>
          <span className="quest-count">{wordsLearnedToday} / {dailyGoal} words</span>
        </div>
        <div className="quest-track">
          <div className="quest-fill" style={{ width: `${progressPercentage}%` }}>
            <span className="quest-runner" aria-hidden>{world.mascot}</span>
          </div>
        </div>
        {dailyCompleted ? (
          <div className="quest-done">
            <span className="quest-done-badge">🎉 Quest complete! Games &amp; prizes unlocked!</span>
            <div className="quest-actions">
              <Button variant="primary" icon="🎮" onClick={() => navigate('/games')}>Play Games</Button>
              <Button variant="secondary" icon="✏️" onClick={() => navigate('/learn?mode=spell')}>Keep Practicing</Button>
            </div>
          </div>
        ) : (
          <p className="quest-hint">
            Learn {Math.max(dailyGoal - wordsLearnedToday, 0)} more word{dailyGoal - wordsLearnedToday === 1 ? '' : 's'} to unlock games! You&apos;ve got this. 💪
          </p>
        )}
      </section>

      {/* Spaced-repetition review — appears every couple of days */}
      {reviewDue && (
        <section className="review-cta pop-in">
          <div className="review-cta-icon" aria-hidden>🧠</div>
          <div className="review-cta-text">
            <h2>Review Time!</h2>
            <p>Let&apos;s practice some words you already learned. Earn bonus stars! ⭐</p>
          </div>
          <Button variant="primary" icon="🧠" onClick={() => navigate('/review')}>
            Start Review
          </Button>
        </section>
      )}

      {/* Big play buttons */}
      <section className="play-section">
        <h2>✨ What do you want to do?</h2>
        <div className="play-grid">
          {playCards.map((c) => (
            <button
              key={c.label}
              className={`play-card tone-${c.tone}`}
              onClick={() => navigate(c.path)}
            >
              <span className="play-icon">{c.icon}</span>
              <span className="play-label">{c.label}</span>
              <span className="play-sub">{c.sub}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Daily Bible verse */}
      <section className="verse-card">
        <h2>📖 Verse of the Day</h2>
        <p className="verse-text">
          &ldquo;For God so loved the world that he gave his one and only Son, that whoever
          believes in him shall not perish but have eternal life.&rdquo;
        </p>
        <p className="verse-ref">John 3:16</p>
        <Button variant="secondary" icon="⭐" onClick={() => navigate('/games', { state: { startGame: 'bible-trivia' } })}>
          Play &amp; earn stars
        </Button>
      </section>

      {showConfetti && (
        <div className="confetti-overlay">
          {Array.from({ length: 60 }).map((_, i) => (
            <div
              key={i}
              className="confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                backgroundColor: ['var(--primary)', 'var(--secondary)', 'var(--accent)', 'var(--success)'][i % 4],
              }}
            />
          ))}
        </div>
      )}

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  )
}

export default Home
