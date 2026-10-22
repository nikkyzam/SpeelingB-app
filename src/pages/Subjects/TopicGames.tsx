import React, { useEffect, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { findTopic, loadQuestTopic, testById } from '../../services/subjects/catalogue'
import type { Question } from '../../services/subjects/types'
import SubjectProgress from '../../services/subjects/SubjectProgress'
import { TOPIC_GAMES } from '../../components/subjects/TopicGames'
import { useRewardStore } from '../../stores/rewards/useRewardStore'
import Celebration from '../../components/common/Celebration'
import BackLink from './BackLink'
import './Subjects.css'

/** Where a topic's questions and back link come from. */
const useSource = (source: string, id: string) => {
  if (source === 'quest') {
    const found = findTopic(id)
    return found && { title: found.topic.name, back: `/subjects/math/quest/topic/${id}`, load: () => loadQuestTopic(id) }
  }
  if (source === 'test') {
    const test = testById(id)
    // A test's games draw on every form, so there is plenty to play with.
    return test && { title: test.name, back: `/subjects/${test.subject}/tests/${id}`, load: async () => Object.values(await test.load()).flat() }
  }
  return undefined
}

/**
 * Games for one topic, made from its own questions — every Math Quest topic
 * and every practice test has this page.
 */
const TopicGames: React.FC = () => {
  const { source = '', id = '' } = useParams()
  const src = useSource(source, id)
  const { addStars } = useRewardStore()
  const [questions, setQuestions] = useState<Question[] | null>(null)
  const [active, setActive] = useState<string | null>(null)
  const [done, setDone] = useState<{ name: string; pct: number; stars: number; newBest: boolean } | null>(null)
  const [paid, setPaid] = useState(false)

  useEffect(() => {
    let live = true
    src
      ?.load()
      .then((qs) => live && setQuestions(qs))
      .catch(() => live && setQuestions([]))
    return () => {
      live = false
    }
  }, [source, id])

  if (!src) return <Navigate to="/" replace />
  if (!questions) return <div className="subjects-page sj-loading">Setting up the games…</div>

  const key = (gameId: string) => `game:${source}:${id}:${gameId}`
  const game = TOPIC_GAMES.find((g) => g.id === active)

  if (game) {
    const Game = game.Component
    return (
      <div className="subjects-page">
        <button type="button" className="sj-back" onClick={() => setActive(null)}>
          ← Back to {src.title} games
        </button>
        <Game
          questions={questions}
          onComplete={(pct) => {
            if (paid) return
            setPaid(true)
            const result = SubjectProgress.recordResult(key(game.id), pct, 100)
            if (result.stars) addStars(result.stars)
            setDone({ name: game.name, pct, stars: result.stars, newBest: result.newBest })
            setActive(null)
          }}
        />
      </div>
    )
  }

  return (
    <div className="subjects-page">
      <BackLink to={src.back} label={src.title} />
      <header className="sj-hero sj-tone-secondary">
        <h1>🎮 {src.title} games</h1>
        <p>Practise this topic the fun way. Stars once a day for each game.</p>
      </header>
      <div className="sj-grid">
        {TOPIC_GAMES.map((g) => {
          const best = SubjectProgress.getBest(key(g.id))
          return (
            <button
              key={g.id}
              type="button"
              className="sj-card sj-tone-accent"
              onClick={() => {
                setPaid(false)
                setActive(g.id)
              }}
            >
              <span className="sj-icon" aria-hidden>
                {g.icon}
              </span>
              <span className="sj-name">{g.name}</span>
              <span className="sj-blurb">{g.blurb}</span>
              {best && <span className="sj-blurb">🏅 Best {best.pct}%</span>}
            </button>
          )
        })}
      </div>
      {done && (
        <Celebration
          data={{
            title: done.newBest ? `New best in ${done.name}! 🏅` : `${done.name} complete!`,
            message: `You scored ${done.pct}%.`,
            stars: done.stars,
          }}
          onClose={() => setDone(null)}
        />
      )}
    </div>
  )
}

export default TopicGames
