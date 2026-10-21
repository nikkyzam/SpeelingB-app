import React from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { gradeLabel, subjectById, testsFor, QUEST_GRADES } from '../../services/subjects/catalogue'
import SubjectProgress from '../../services/subjects/SubjectProgress'
import BackLink from './BackLink'
import './Subjects.css'

const MATH_EXTRAS = [
  { path: '/subjects/math/arcade', icon: '🕹️', name: 'Math Arcade', blurb: 'Quick number games' },
  { path: '/subjects/math/puzzles', icon: '🧩', name: 'Puzzle Box', blurb: 'Brain-stretchers with hints' },
  { path: '/subjects/math/proofs', icon: '🔍', name: 'Proof Trainer', blurb: 'Show why it works, step by step' },
]

/** One subject: its practice tests by grade, and for math, Math Quest and friends. */
const SubjectPage: React.FC = () => {
  const { subjectId = '' } = useParams()
  const navigate = useNavigate()
  const subject = subjectById(subjectId)
  if (!subject) return <Navigate to="/" replace />

  const tests = testsFor(subject.id)
  const grades = [...new Set(tests.map((t) => t.grade))].sort((a, b) => b.localeCompare(a))

  return (
    <div className="subjects-page">
      <BackLink to="/" label="All subjects" />
      <header className={`sj-hero sj-tone-${subject.tone}`}>
        <h1>
          {subject.icon} {subject.name}
        </h1>
        <p>{subject.blurb}</p>
      </header>

      {subject.id === 'math' && (
        <section className="sj-section">
          <h2>🗺️ Math Quest</h2>
          <p className="sj-lede">Pick your grade, then a topic. Every topic has Practice, Challenge and Boss rounds.</p>
          <div className="sj-chips">
            {QUEST_GRADES.map((g) => (
              <button key={g.grade} type="button" className="sj-chip" onClick={() => navigate(`/subjects/math/quest/${g.grade}`)}>
                {g.grade === 'k' ? 'K' : g.grade}
                <span className="sj-chip-sub">{g.label}</span>
              </button>
            ))}
          </div>
          <div className="sj-grid sj-grid-small">
            {MATH_EXTRAS.map((x) => (
              <button key={x.path} type="button" className="sj-card sj-tone-accent" onClick={() => navigate(x.path)}>
                <span className="sj-icon" aria-hidden>{x.icon}</span>
                <span className="sj-name">{x.name}</span>
                <span className="sj-blurb">{x.blurb}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {grades.map((grade) => (
        <section key={grade} className="sj-section">
          <h2>📝 {gradeLabel(grade)} practice tests</h2>
          <div className="sj-list">
            {tests
              .filter((t) => t.grade === grade)
              .map((t) => {
                const bests = Object.values(SubjectProgress.bestsFor(`test:${t.id}:`))
                const top = bests.reduce((m, b) => Math.max(m, b.pct), -1)
                return (
                  <button
                    key={t.id}
                    type="button"
                    className="sj-row"
                    onClick={() => navigate(`/subjects/${subject.id}/tests/${t.id}`)}
                  >
                    <span className="sj-row-main">
                      <span className="sj-name">{t.name}</span>
                      <span className="sj-blurb">{t.desc}</span>
                    </span>
                    <span className="sj-best">{top >= 0 ? `Best ${top}%` : 'New'}</span>
                  </button>
                )
              })}
          </div>
        </section>
      ))}
    </div>
  )
}

export default SubjectPage
