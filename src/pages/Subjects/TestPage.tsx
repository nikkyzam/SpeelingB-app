import React, { useEffect, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { gradeLabel, testById, type NoteSection, type TestForm } from '../../services/subjects/catalogue'
import type { QuestionBank } from '../../services/subjects/types'
import SubjectProgress from '../../services/subjects/SubjectProgress'
import TestRunner from '../../components/subjects/TestRunner'
import StudyNotes from '../../components/subjects/StudyNotes'
import Button from '../../components/common/Button'
import BackLink from './BackLink'
import './Subjects.css'

/** A practice test: choose a form (when there are several), then take it. */
const TestPage: React.FC = () => {
  const { subjectId = '', testId = '' } = useParams()
  const navigate = useNavigate()
  const test = testById(testId)
  const [bank, setBank] = useState<QuestionBank | null>(null)
  const [failed, setFailed] = useState(false)
  const [form, setForm] = useState<string | null>(test?.forms ? null : 'main')
  const [withAddOn, setWithAddOn] = useState(false)
  const [notes, setNotes] = useState<NoteSection[] | null>(null)
  const [readingNotes, setReadingNotes] = useState(false)

  useEffect(() => {
    let live = true
    test
      ?.load()
      .then((b) => live && setBank(b))
      .catch(() => live && setFailed(true))
    // Notes are a bonus: if they fail to load, the tests still work.
    test
      ?.notes?.()
      .then((n) => live && setNotes(n))
      .catch(() => live && setNotes(null))
    return () => {
      live = false
    }
  }, [test])

  if (!test || test.subject !== subjectId) return <Navigate to={`/subjects/${subjectId}`} replace />
  const back = `/subjects/${test.subject}`

  if (failed) {
    return (
      <div className="subjects-page">
        <BackLink to={back} label="Back" />
        <p className="sj-lede">This test didn&apos;t load. Check the internet and try again.</p>
      </div>
    )
  }
  if (!bank) return <div className="subjects-page sj-loading">Getting your test ready…</div>

  if (readingNotes && notes) {
    return (
      <div className="subjects-page">
        <button type="button" className="sj-back" onClick={() => setReadingNotes(false)}>
          ← Back to tests
        </button>
        <StudyNotes
          title={test.name}
          sections={notes}
          onDone={() => {
            setReadingNotes(false)
            window.scrollTo?.({ top: 0 })
          }}
        />
      </div>
    )
  }

  if (form) {
    const chosen = test.forms?.find((f) => f.id === form)
    const addOn = withAddOn && test.addOn && !chosen?.standalone ? bank[test.addOn.form] ?? [] : []
    const formName = chosen?.name
    return (
      <div className="subjects-page">
        <TestRunner
          key={`${form}${withAddOn}`}
          title={formName ? `${test.name} · ${formName}` : test.name}
          questions={[...(bank[form] ?? []), ...addOn]}
          resultKey={`test:${test.id}:${form}${addOn.length ? '+' + test.addOn!.form : ''}`}
          onExit={() => (test.forms ? setForm(null) : navigate(back))}
        />
      </div>
    )
  }

  const forms = test.forms as TestForm[]
  return (
    <div className="subjects-page">
      <BackLink to={back} label="Back" />
      <header className="sj-hero">
        <h1>{test.name}</h1>
        <p>
          {gradeLabel(test.grade)} · {test.desc}
        </p>
      </header>
      {notes && (
        <button type="button" className="sj-row sj-row-star" onClick={() => setReadingNotes(true)}>
          <span className="sj-row-main">
            <span className="sj-name">📖 Read the notes</span>
            <span className="sj-blurb">{notes.map((n) => n.title).join(' · ')}</span>
          </span>
          <span className="sj-best">Notes</span>
        </button>
      )}
      <section className="sj-section">
        <h2>Pick a test</h2>
        <div className="sj-list">
          {forms.map((f) => {
            const best = SubjectProgress.getBest(`test:${test.id}:${f.id}`)
            return (
              <button key={f.id} type="button" className={`sj-row${f.recommended ? ' sj-row-star' : ''}`} onClick={() => setForm(f.id)}>
                <span className="sj-row-main">
                  <span className="sj-name">
                    {f.name} {f.recommended && <span className="sj-tag">Start here</span>}
                  </span>
                  <span className="sj-blurb">
                    {f.desc} · {bank[f.id]?.length ?? 0} questions
                  </span>
                </span>
                <span className="sj-best">{best ? `Best ${best.pct}%` : 'New'}</span>
              </button>
            )
          })}
        </div>
        {test.addOn && (
          <label className="sj-addon">
            <input type="checkbox" checked={withAddOn} onChange={(e) => setWithAddOn(e.target.checked)} />
            {test.addOn.text} ({bank[test.addOn.form]?.length ?? 0} more)
          </label>
        )}
        {withAddOn && <p className="sj-lede">The challenge problems are added to the Fresh Tests and Study Guide.</p>}
      </section>
      <div className="tr-actions">
        <Button variant="secondary" onClick={() => navigate(back)}>
          Back to {test.subject === 'math' ? 'Math' : 'tests'}
        </Button>
      </div>
    </div>
  )
}

export default TestPage
