import React from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { QUEST_GRADES, QUEST_TIERS } from '../../services/subjects/catalogue'
import SubjectProgress from '../../services/subjects/SubjectProgress'
import BackLink from './BackLink'
import './Subjects.css'

/** One grade of Math Quest: its units and topics, with a medal for each round passed. */
const MathQuest: React.FC = () => {
  const { grade = '' } = useParams()
  const navigate = useNavigate()
  const g = QUEST_GRADES.find((x) => x.grade === grade)
  if (!g) return <Navigate to="/subjects/math" replace />

  return (
    <div className="subjects-page">
      <BackLink to="/subjects/math" label="Math" />
      <header className="sj-hero sj-tone-primary">
        <h1>🗺️ Math Quest · {g.label}</h1>
        <p>Pass a round with 80% or more to earn its medal.</p>
      </header>
      <div className="sj-chips">
        {QUEST_GRADES.map((x) => (
          <button
            key={x.grade}
            type="button"
            className={`sj-chip${x.grade === grade ? ' sj-chip-on' : ''}`}
            aria-current={x.grade === grade}
            onClick={() => navigate(`/subjects/math/quest/${x.grade}`)}
          >
            {x.grade === 'k' ? 'K' : x.grade}
          </button>
        ))}
      </div>

      {g.units.map((unit) => (
        <section key={unit.name} className="sj-section">
          <h2>
            {unit.name} {unit.advanced && <span className="sj-tag">Extra challenge</span>}
          </h2>
          <div className="sj-list">
            {unit.topics.map((t) => (
              <button key={t.id} type="button" className="sj-row" onClick={() => navigate(`/subjects/math/quest/topic/${t.id}`)}>
                <span className="sj-row-main">
                  <span className="sj-name">{t.name}</span>
                </span>
                <span className="sj-medals" aria-label="Rounds passed">
                  {QUEST_TIERS.map((tier) => {
                    const best = SubjectProgress.getBest(`quest:${t.id}:${tier.id}`)
                    const passed = !!best && best.pct >= 80
                    return (
                      <span key={tier.id} className={passed ? 'sj-medal-on' : 'sj-medal-off'} title={tier.name}>
                        {tier.icon}
                      </span>
                    )
                  })}
                </span>
              </button>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

export default MathQuest
