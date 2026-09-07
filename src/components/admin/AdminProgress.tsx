import React from 'react'
import type { AdminUserProgress } from '../../services/admin/AdminProgress'
import './AdminProgress.css'

interface Props {
  name: string
  progress: AdminUserProgress
}

/** "142" but "1,142" once it is worth grouping. */
const n = (v: number) => v.toLocaleString()

/** Never a bare 0% for a child who has genuinely started. */
const pct = (part: number, whole: number): string => {
  if (whole <= 0) return '0%'
  const p = (part / whole) * 100
  if (part > 0 && p < 1) return '<1%'
  return `${Math.round(p)}%`
}

const BOX_MEANING = [
  'just met — comes back tomorrow',
  'coming back in 2 days',
  'coming back in 4 days',
  'coming back in a week',
  'known well — a fortnight away',
]

/**
 * One child's whole picture, for the grown-up.
 *
 * Ordered by what a parent actually asks, in the order they ask it: how far
 * have they come, have they done anything this week, and — the one the four
 * summary numbers could never answer — which words should we sit down and
 * practise together?
 */
const AdminProgress: React.FC<Props> = ({ name, progress: p }) => {
  const maxDay = Math.max(1, p.bestDay)
  const boxTotal = p.boxes.reduce((a, b) => a + b, 0)

  return (
    <div className="admin-prog">
      {/* --- how far they have come ------------------------------------- */}
      <section className="admin-prog__section">
        <h4 className="admin-prog__h">The journey so far</h4>
        <div className="admin-prog__journey">
          <div className="admin-prog__bar" role="img" aria-label={`${n(p.met)} of ${n(p.bankTotal)} words met`}>
            <span className="admin-prog__fill is-met" style={{ width: `${Math.min(100, (p.met / Math.max(1, p.bankTotal)) * 100)}%` }} />
            <span className="admin-prog__fill is-spelled" style={{ width: `${Math.min(100, (p.spelled / Math.max(1, p.bankTotal)) * 100)}%` }} />
            <span className="admin-prog__fill is-mastered" style={{ width: `${Math.min(100, (p.mastered / Math.max(1, p.bankTotal)) * 100)}%` }} />
          </div>
          <p className="admin-prog__journeytext">
            <strong>{n(p.met)}</strong> of {n(p.bankTotal)} words met ({pct(p.met, p.bankTotal)}) ·{' '}
            <strong>{n(p.spelled)}</strong> spelled right · <strong>{n(p.mastered)}</strong> mastered
          </p>
          <p className="admin-prog__rank">
            {p.explorer.icon} Level {p.explorer.level} — {p.explorer.title}
            {p.explorer.next && <span className="admin-prog__muted"> · next: {p.explorer.next}</span>}
          </p>
        </div>

        <ul className="admin-prog__levels">
          {p.perLevel.map((l) => (
            <li key={l.level}>
              <span className="admin-prog__levelname">{l.label}</span>
              <span className="admin-prog__bar small">
                <span className="admin-prog__fill is-met" style={{ width: `${Math.min(100, (l.met / Math.max(1, l.total)) * 100)}%` }} />
              </span>
              <span className="admin-prog__levelnum">
                {n(l.met)}/{n(l.total)}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* --- the fortnight ---------------------------------------------- */}
      <section className="admin-prog__section">
        <h4 className="admin-prog__h">
          The last fortnight
          <span className="admin-prog__muted"> · {p.activeDays} of 14 days</span>
        </h4>
        <ol className="admin-prog__days">
          {p.days.map((d) => (
            <li key={d.date} className={d.count > 0 ? 'is-on' : ''} title={`${d.date}: ${d.count} ${d.count === 1 ? 'word' : 'words'}`}>
              <span className="admin-prog__daybar" style={{ height: `${Math.max(4, (d.count / maxDay) * 100)}%` }} />
              <span className="admin-prog__daylabel">{d.label}</span>
            </li>
          ))}
        </ol>
        {p.activeDays === 0 && (
          <p className="admin-prog__empty">Nothing learnt in the last fortnight.</p>
        )}
      </section>

      {/* --- the words that fight back ----------------------------------- */}
      <section className="admin-prog__section">
        <h4 className="admin-prog__h">
          Words to practise together
          {p.dueToday > 0 && <span className="admin-prog__due">{p.dueToday} due today</span>}
        </h4>
        {p.tricky.length === 0 ? (
          <p className="admin-prog__empty">
            {p.practised === 0
              ? `${name} hasn’t practised any words yet.`
              : `Nothing troubling ${name} — every word practised so far has gone in first time.`}
          </p>
        ) : (
          <ul className="admin-prog__tricky">
            {p.tricky.map((w) => (
              <li key={w.id}>
                <span className="admin-prog__word">{w.word}</span>
                <span className="admin-prog__wrong" title={`${w.wrong} wrong, ${w.right} right`}>
                  ✗ {w.wrong}
                </span>
                <span className="admin-prog__muted">{w.right > 0 ? `✓ ${w.right}` : 'never right yet'}</span>
              </li>
            ))}
          </ul>
        )}

        {boxTotal > 0 && (
          <div className="admin-prog__boxes" aria-label="How well each practised word is known">
            {p.boxes.map((count, i) => (
              <span
                key={i}
                className={`admin-prog__box ${count > 0 ? 'is-on' : ''}`}
                title={`${count} ${count === 1 ? 'word' : 'words'} — ${BOX_MEANING[i]}`}
              >
                <span className="admin-prog__boxnum">{count}</span>
                <span className="admin-prog__boxlabel">{i + 1}</span>
              </span>
            ))}
            <span className="admin-prog__muted">{n(p.practised)} words practised · box 1 is shakiest</span>
          </div>
        )}
      </section>

      {/* --- lately ------------------------------------------------------ */}
      {p.recent.length > 0 && (
        <section className="admin-prog__section">
          <h4 className="admin-prog__h">Most recently met</h4>
          <ul className="admin-prog__recent">
            {p.recent.map((w) => (
              <li key={w.id}>{w.word}</li>
            ))}
          </ul>
        </section>
      )}

      {/* --- play -------------------------------------------------------- */}
      <section className="admin-prog__section">
        <h4 className="admin-prog__h">
          Play
          <span className="admin-prog__muted">
            {' '}· {n(p.totalPlays)} {p.totalPlays === 1 ? 'game' : 'games'} · 🏆 {p.trophies} · 🎖 {p.badges}
          </span>
        </h4>
        {p.games.length === 0 ? (
          <p className="admin-prog__empty">No games played yet.</p>
        ) : (
          <ul className="admin-prog__games">
            {p.games.slice(0, 8).map((g) => (
              <li key={g.id}>
                <span className="admin-prog__gamename">{g.name}</span>
                <span className="admin-prog__muted">
                  {g.plays}× {g.best > 0 && `· best ${n(g.best)}`}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {p.unresolved > 0 && (
        <p className="admin-prog__note">
          {n(p.unresolved)} saved {p.unresolved === 1 ? 'word is' : 'words are'} no longer in the app’s
          word list, so they are left out of the totals above.
        </p>
      )}
    </div>
  )
}

export default AdminProgress
