import React, { useState } from 'react'
import { MATH_ARCADE_GAMES } from '../../components/subjects/MathArcade'
import SubjectProgress from '../../services/subjects/SubjectProgress'
import { useRewardStore } from '../../stores/rewards/useRewardStore'
import Celebration from '../../components/common/Celebration'
import BackLink from './BackLink'
import './Subjects.css'

/** Quick number games. Each reports one score; this page keeps the best and pays the stars. */
const MathArcadePage: React.FC = () => {
  const { addStars } = useRewardStore()
  const [active, setActive] = useState<string | null>(null)
  const [done, setDone] = useState<{ name: string; score: number; stars: number; best: boolean } | null>(null)
  // A game may only pay once per opening.
  const [paid, setPaid] = useState(false)

  const game = MATH_ARCADE_GAMES.find((g) => g.id === active)

  const finish = (score: number) => {
    if (!game || paid) return
    setPaid(true)
    const best = SubjectProgress.recordArcadeScore(game.id, score)
    // 1 to 5 stars, like the word games, measured against the game's own great run.
    const stars = Math.min(5, Math.max(1, Math.round((score / game.fullScore) * 5)))
    addStars(stars)
    setDone({ name: game.name, score, stars, best })
    setActive(null)
  }

  if (game) {
    const Game = game.Component
    return (
      <div className="subjects-page">
        <button type="button" className="sj-back" onClick={() => setActive(null)}>
          ← Back to the arcade
        </button>
        <Game onComplete={finish} />
      </div>
    )
  }

  return (
    <div className="subjects-page">
      <BackLink to="/subjects/math" label="Math" />
      <header className="sj-hero sj-tone-accent">
        <h1>🕹️ Math Arcade</h1>
        <p>Fast, fun number games. Beat your best!</p>
      </header>
      <div className="sj-grid">
        {MATH_ARCADE_GAMES.map((g) => {
          const best = SubjectProgress.getBest(`arcade:${g.id}`)
          return (
            <button
              key={g.id}
              type="button"
              className="sj-card sj-tone-secondary"
              onClick={() => {
                setPaid(false)
                setActive(g.id)
              }}
            >
              <span className="sj-icon" aria-hidden>{g.icon}</span>
              <span className="sj-name">{g.name}</span>
              <span className="sj-blurb">{g.blurb}</span>
              {best && <span className="sj-blurb">🏅 Best {best.pct}</span>}
            </button>
          )
        })}
      </div>
      {done && (
        <Celebration
          data={{
            title: done.best ? `New best in ${done.name}! 🏅` : `${done.name} complete!`,
            message: `You scored ${done.score}.`,
            stars: done.stars,
          }}
          onClose={() => setDone(null)}
        />
      )}
    </div>
  )
}

export default MathArcadePage
