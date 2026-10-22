import React from 'react'
import type { NoteSection } from '../../../services/subjects/catalogue'
import { useAudio } from '../../../contexts/AudioContext'
import RichText from '../RichText'
import './StudyNotes.css'

interface StudyNotesProps {
  title: string
  sections: NoteSection[]
  onDone: () => void
}

/** Markup out, so a section can be read aloud. */
const plain = (s: string) => s.replace(/<[^>]+>/g, '').replace(/→/g, ', so').replace(/−/g, 'minus ')

const spoken = (s: NoteSection): string =>
  [
    s.title,
    s.intro,
    ...(s.steps ?? []).map((st, i) => `Step ${i + 1}. ${st}`),
    ...(s.example ? [s.example.title, ...s.example.lines] : []),
    ...(s.compare ?? []).flatMap((c) => [c.head, ...c.points, c.example ?? '']),
    s.remember ? `Remember: ${s.remember}` : '',
  ]
    .filter(Boolean)
    .map(plain)
    .join('. ')

/** The notes from class, one topic per card: what it is, how to do it, a worked example. */
const StudyNotes: React.FC<StudyNotesProps> = ({ title, sections, onDone }) => {
  const { speak } = useAudio()

  return (
    <div className="study-notes">
      <header className="sn-head">
        <h2>📖 {title} — notes</h2>
        <p>Read these first, then try a test. Tap 🔊 to hear a section.</p>
      </header>

      <nav className="sn-index" aria-label="Topics">
        {sections.map((s, i) => (
          <a key={s.title} href={`#sn-${i}`} className="sn-index-link">
            {s.icon} {s.title}
          </a>
        ))}
      </nav>

      {sections.map((s, i) => (
        <section key={s.title} id={`sn-${i}`} className="sn-card">
          <div className="sn-card-head">
            <h3>
              <span aria-hidden>{s.icon}</span> {s.title}
            </h3>
            <button type="button" className="sn-say" aria-label={`Read “${s.title}” aloud`} onClick={() => speak(spoken(s))}>
              🔊
            </button>
          </div>
          <p className="sn-intro">
            <RichText text={s.intro} />
          </p>

          {s.ladder && (
            <div className="sn-ladder" role="img" aria-label="Ladder diagram">
              {s.ladder.rows.map((row, r) => (
                <div key={r} className={`sn-ladder-row${r === s.ladder!.rows.length - 1 ? ' sn-ladder-last' : ''}`}>
                  <span className="sn-ladder-side">{row[0]}</span>
                  <span className="sn-ladder-nums">
                    {row.slice(1).map((n, c) => (
                      <span key={c}>{n}</span>
                    ))}
                  </span>
                </div>
              ))}
            </div>
          )}

          {s.steps && (
            <ol className="sn-steps">
              {s.steps.map((st) => (
                <li key={st}>
                  <RichText text={st} />
                </li>
              ))}
            </ol>
          )}

          {s.compare && (
            <div className="sn-compare">
              {s.compare.map((c) => (
                <div key={c.head} className="sn-compare-col">
                  <h4>{c.head}</h4>
                  <ul>
                    {c.points.map((p) => (
                      <li key={p}>
                        <RichText text={p} />
                      </li>
                    ))}
                  </ul>
                  {c.example && (
                    <p className="sn-compare-example">
                      <RichText text={c.example} />
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {s.example && (
            <div className="sn-example">
              <p className="sn-example-title">✏️ {s.example.title}</p>
              {s.example.lines.map((l) => (
                <p key={l}>
                  <RichText text={l} />
                </p>
              ))}
            </div>
          )}

          {s.remember && (
            <p className="sn-remember">
              ⭐ <RichText text={s.remember} />
            </p>
          )}
        </section>
      ))}

      <div className="sn-actions">
        <button type="button" className="sn-done" onClick={onDone}>
          I&apos;m ready — pick a test →
        </button>
      </div>
    </div>
  )
}

export default StudyNotes
