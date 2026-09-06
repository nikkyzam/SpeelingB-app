import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProgress } from '../../contexts/ProgressContext'
import { useUser } from '../../contexts/UserContext'
import { useStreak } from '../../hooks/useStreak'
import { wordBank, Word } from '../../services/wordBank'
import WordMastery from '../../services/progress/WordMastery'
import ReviewSchedule from '../../services/progress/ReviewSchedule'
import Button from '../../components/common/Button'
import WordProgress from '../../components/progress/WordProgress'
import './Progress.css'

/**
 * The grown-ups' page.
 *
 * The app has been quietly collecting exactly the things a parent wants to know
 * — which words are shaky, whether this week happened at all — and showing none
 * of it to anyone but the child. This is that data, in plain language, with the
 * one useful action attached: practise the hard ones together.
 */
const ProgressReport: React.FC = () => {
  const navigate = useNavigate()
  const { learningFlow } = useProgress()
  const { user } = useUser()
  const { streakData } = useStreak()

  const learned = learningFlow.getWordsLearnedTotal()
  const spelled = learningFlow.getWordsSpelledTotal()

  const totals = useMemo(() => WordMastery.totals(learned, spelled), [learned, spelled])
  const level = useMemo(() => WordMastery.level(learned, spelled), [learned, spelled])
  const week = useMemo(() => WordMastery.getRecentHistory(7), [])

  const resolve = (ids: string[]): Word[] =>
    ids.map((id) => wordBank.getWordById(id)).filter((w): w is Word => !!w)

  const tricky = useMemo(() => resolve(ReviewSchedule.getTrickyWordIds(12)), [])
  const dueCount = ReviewSchedule.dueCount()

  const schedule = ReviewSchedule.all()
  const solid = useMemo(
    () =>
      resolve(
        Object.entries(schedule)
          .filter(([, r]) => r.box >= 4)
          .sort((a, b) => b[1].box - a[1].box)
          .slice(0, 12)
          .map(([id]) => id)
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const weekTotal = week.reduce((sum, d) => sum + d.count, 0)
  const busiest = Math.max(1, ...week.map((d) => d.count))
  const childName = user?.name || 'your child'

  return (
    <div className="progress-page">
      <div className="pg-header">
        <Button variant="secondary" size="small" onClick={() => navigate(-1)}>← Back</Button>
        <div>
          <h1>📈 Progress</h1>
          <p className="pg-sub">A plain-English summary for grown-ups</p>
        </div>
      </div>

      {/* Headline numbers */}
      <div className="pg-cards">
        <div className="pg-card">
          <span className="pg-value">{totals.met}</span>
          <span className="pg-label">words met</span>
        </div>
        <div className="pg-card">
          <span className="pg-value">{totals.spelled}</span>
          <span className="pg-label">spelled correctly</span>
        </div>
        <div className="pg-card">
          <span className="pg-value">{totals.mastered}</span>
          <span className="pg-label">mastered</span>
          <span className="pg-note">spelled right 3+ times</span>
        </div>
        <div className="pg-card">
          <span className="pg-value">{streakData.currentStreak}</span>
          <span className="pg-label">day streak</span>
          <span className="pg-note">best: {streakData.longestStreak}</span>
        </div>
      </div>

      {/* This week */}
      <section className="pg-section">
        <WordProgress detailed />
      </section>

      <section className="pg-section">
        <h2>This week</h2>
        <p className="pg-lead">
          {weekTotal === 0
            ? `No words yet this week. Little and often works better than one long session.`
            : `${childName} met ${weekTotal} word${weekTotal === 1 ? '' : 's'} over the last 7 days.`}
        </p>
        <div className="pg-chart" role="img" aria-label={`${weekTotal} words learned over the last seven days`}>
          {week.map((d) => (
            <div key={d.date} className="pg-bar-col">
              <div className="pg-bar-track">
                <div
                  className={`pg-bar ${d.count === 0 ? 'empty' : ''}`}
                  style={{ height: `${(d.count / busiest) * 100}%` }}
                />
              </div>
              <span className="pg-bar-count">{d.count || '·'}</span>
              <span className="pg-bar-label">{d.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Where the help is needed */}
      <section className="pg-section">
        <h2>Worth practising together</h2>
        {tricky.length === 0 ? (
          <p className="pg-lead">
            Nothing is being missed repeatedly right now — there is no list of problem words to work on. 🎉
          </p>
        ) : (
          <>
            <p className="pg-lead">
              These keep being missed. The app already schedules them more often, but they are the
              ones worth saying out loud together.
            </p>
            <div className="pg-words">
              {tricky.map((w) => {
                const record = schedule[w.id]
                return (
                  <div key={w.id} className="pg-word tricky">
                    <span className="pg-word-text">{w.word}</span>
                    {record && (
                      <span className="pg-word-note">
                        missed {record.wrong}× · right {record.right}×
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
            <Button variant="warning" icon="💪" onClick={() => navigate('/review?mode=tricky')}>
              Practise these now
            </Button>
          </>
        )}
      </section>

      {/* What's solid */}
      {solid.length > 0 && (
        <section className="pg-section">
          <h2>Sticking well</h2>
          <p className="pg-lead">
            These have been right often enough that the app now waits a week or more before asking again.
          </p>
          <div className="pg-words">
            {solid.map((w) => (
              <div key={w.id} className="pg-word solid">
                <span className="pg-word-text">{w.word}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* How it works, briefly */}
      <section className="pg-section pg-explain">
        <h2>How practice is scheduled</h2>
        <p>
          Every answer — in lessons, quizzes and the spelling games — moves a word along a ladder.
          Right answers push it further out (1 → 2 → 4 → 7 → 14 days); a wrong answer brings it back
          to tomorrow. Right now <strong>{dueCount}</strong> word{dueCount === 1 ? ' is' : 's are'} due,
          and {childName} is a <strong>{level.icon} {level.title}</strong>.
        </p>
        <p className="pg-fineprint">
          All of this is stored on this device only.
        </p>
      </section>
    </div>
  )
}

export default ProgressReport
