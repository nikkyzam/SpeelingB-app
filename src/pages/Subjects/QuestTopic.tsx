import React, { useEffect, useMemo, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { findTopic, loadQuestTopic, QUEST_TIERS, type QuestTierId } from '../../services/subjects/catalogue'
import type { Question } from '../../services/subjects/types'
import SubjectProgress from '../../services/subjects/SubjectProgress'
import { shuffle } from '../../components/games/shared/wordTricks'
import PracticeRunner from '../../components/subjects/PracticeRunner'
import ComicLesson from '../../components/subjects/ComicLesson'
import { lessonForTopic, type Lesson } from '../../services/subjects/mathExtras'
import BackLink from './BackLink'
import './Subjects.css'

/** Questions in one round. A long bank is sampled fresh each time. */
const ROUND_SIZE = 10

/**
 * A fresh, shuffled round — but a question and its follow-up (same `group`)
 * stay together and in order, and a pair is never cut in half at the end.
 */
export const dealRound = (questions: Question[], size: number): Question[] => {
  const groups = new Map<string, Question[]>()
  for (const q of questions) {
    const key = q.group ?? q.id
    groups.set(key, [...(groups.get(key) ?? []), q])
  }
  const round: Question[] = []
  for (const g of shuffle([...groups.values()])) {
    if (round.length >= size) break
    round.push(...g)
  }
  return round
}

/** One Math Quest topic: pick Practice, Challenge or Boss and play a round. */
const QuestTopic: React.FC = () => {
  const { topicId = '' } = useParams()
  const navigate = useNavigate()
  const found = findTopic(topicId)
  const [questions, setQuestions] = useState<Question[] | null>(null)
  const [tier, setTier] = useState<QuestTierId | null>(null)
  const [round, setRound] = useState(0)
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [inLesson, setInLesson] = useState(false)

  useEffect(() => {
    let live = true
    loadQuestTopic(topicId).then((qs) => live && setQuestions(qs))
    lessonForTopic(topicId)
      .then((l) => live && setLesson(l))
      .catch(() => live && setLesson(null))
    return () => {
      live = false
    }
  }, [topicId])

  const byTier = useMemo(() => {
    const groups: Record<QuestTierId, Question[]> = { practice: [], challenge: [], boss: [] }
    for (const q of questions ?? []) groups[QUEST_TIERS[(q.level ?? 1) - 1].id].push(q)
    return groups
  }, [questions])

  const roundQuestions = useMemo(
    () => (tier ? dealRound(byTier[tier], ROUND_SIZE) : []),
    // A new round deals a new set.
    [tier, byTier, round]
  )

  if (!found) return <Navigate to="/subjects/math" replace />
  const { grade, unit, topic } = found
  const back = `/subjects/math/quest/${grade.grade}`

  if (!questions) return <div className="subjects-page sj-loading">Getting your quest ready…</div>

  if (inLesson && lesson) {
    return (
      <div className="subjects-page">
        <ComicLesson lesson={lesson} onDone={() => setInLesson(false)} />
      </div>
    )
  }

  if (tier) {
    const t = QUEST_TIERS.find((x) => x.id === tier)!
    return (
      <div className="subjects-page">
        <PracticeRunner
          key={round}
          title={`${t.icon} ${topic.name} · ${t.name}`}
          questions={roundQuestions}
          resultKey={`quest:${topic.id}:${tier}`}
          onExit={() => {
            setTier(null)
            setRound((r) => r + 1)
          }}
        />
      </div>
    )
  }

  return (
    <div className="subjects-page">
      <BackLink to={back} label={grade.label} />
      <header className="sj-hero sj-tone-primary">
        <h1>{topic.name}</h1>
        <p>
          {grade.label} · {unit.name}
        </p>
      </header>
      {lesson && (
        <button type="button" className="sj-row sj-row-star" onClick={() => setInLesson(true)}>
          <span className="sj-row-main">
            <span className="sj-name">📖 {lesson.title}</span>
            <span className="sj-blurb">{lesson.blurb}</span>
          </span>
          <span className="sj-best">Lesson</span>
        </button>
      )}
      <button type="button" className="sj-row sj-row-star" onClick={() => navigate(`/subjects/play/quest/${topic.id}`)}>
        <span className="sj-row-main">
          <span className="sj-name">🎮 Play games</span>
          <span className="sj-blurb">Quiz Sprint, Match Up and Bubble Pop — made from this topic</span>
        </span>
        <span className="sj-best">Games</span>
      </button>
      <section className="sj-section">
        <h2>Choose your round</h2>
        <div className="sj-grid sj-grid-small">
          {QUEST_TIERS.map((t) => {
            const count = byTier[t.id].length
            const best = SubjectProgress.getBest(`quest:${topic.id}:${t.id}`)
            return (
              <button
                key={t.id}
                type="button"
                className={`sj-card sj-tone-${t.level === 1 ? 'success' : t.level === 2 ? 'secondary' : 'accent'}`}
                disabled={count === 0}
                onClick={() => setTier(t.id)}
              >
                <span className="sj-icon" aria-hidden>{t.icon}</span>
                <span className="sj-name">{t.name}</span>
                <span className="sj-blurb">
                  {count === 0
                    ? 'Coming soon'
                    : `${Math.min(count, ROUND_SIZE)} questions${best ? ` · best ${best.pct}%` : ''}`}
                </span>
              </button>
            )
          })}
        </div>
      </section>
      <button type="button" className="sj-back" onClick={() => navigate(back)}>
        ← More {grade.label} topics
      </button>
    </div>
  )
}

export default QuestTopic
