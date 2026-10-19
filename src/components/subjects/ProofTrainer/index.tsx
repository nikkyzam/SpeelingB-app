import React, { useEffect, useState } from 'react'
import { useAudio } from '../../../contexts/AudioContext'
import { useRewardStore } from '../../../stores/rewards/useRewardStore'
import {
  PROOF_KIND_LABEL,
  checkProof,
  isMissingStep,
  loadProofs,
  shuffledSteps,
  type Proof,
  type ProofResult,
} from '../../../services/subjects/mathExtras'
import './ProofTrainer.css'

/**
 * Proofs: an argument where every step follows from the one before. A child
 * puts steps in order, matches each step to its reason, or picks the missing
 * step. A wrong try says which step to look at again, not what it should be;
 * hints are there on request, and after a couple of tries the whole proof can
 * be shown so nobody is left stuck.
 */
interface ProofTrainerProps {
  /** Called after each newly solved proof with how many are solved this session. */
  onComplete?: (solved: number) => void
}

/** Solved this session (until the page reloads), so stars are paid once per proof. */
const solvedThisSession = new Set<string>()

/** Tries before "Show me the proof" appears. */
const TRIES_BEFORE_REVEAL = 2

const gradeLabel = (g: number) => (g <= 0 ? 'Kindergarten' : `Grade ${g}`)

/** What a wrong try means, in words. Names a step, never the correction. */
export const proofVerdict = (p: Proof, r: ProofResult): string => {
  if (p.kind === 'order') {
    const at = r.firstWrong ?? 0
    if (at === 0) return "The first step isn't the one to start with. Try a different opener."
    return `The first ${at} ${at === 1 ? 'step is' : 'steps are'} in the right place. Step ${at + 1} is the one to think about again.`
  }
  const which = r.wrongSteps.map((i) => i + 1).join(' and ')
  if (p.kind === 'reasons') {
    return r.wrongSteps.length === 1
      ? `Step ${which} doesn't have the right reason yet. The rest do!`
      : `Steps ${which} don't have the right reasons yet.`
  }
  return 'That isn’t quite the missing step. Read the steps before and after it again.'
}

const ProofTrainer: React.FC<ProofTrainerProps> = ({ onComplete }) => {
  const { speak } = useAudio()
  const { addStars } = useRewardStore()
  const [proofs, setProofs] = useState<Proof[] | null>(null)
  const [failed, setFailed] = useState(false)
  const [solved, setSolved] = useState<Set<string>>(() => new Set(solvedThisSession))
  const [open, setOpen] = useState<Proof | null>(null)

  // One attempt at the open proof.
  const [pool, setPool] = useState<number[]>([])
  const [placed, setPlaced] = useState<number[]>([])
  const [reasons, setReasons] = useState<Record<number, string>>({})
  const [blanks, setBlanks] = useState<Record<number, number>>({})
  const [result, setResult] = useState<ProofResult | null>(null)
  const [tries, setTries] = useState(0)
  const [hints, setHints] = useState(0)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    let live = true
    loadProofs()
      .then((list) => live && setProofs(list))
      .catch(() => live && setFailed(true))
    return () => {
      live = false
    }
  }, [])

  const start = (p: Proof) => {
    setOpen(p)
    setPool(shuffledSteps(p.steps.length))
    setPlaced([])
    setReasons({})
    setBlanks({})
    setResult(null)
    setTries(0)
    setHints(0)
    setRevealed(false)
  }

  if (failed) {
    return (
      <p className="proof-trainer-msg" role="alert">
        The proofs didn't load just now. Please try again in a moment.
      </p>
    )
  }
  if (!proofs) return <p className="proof-trainer-msg" role="status">Finding the proofs…</p>

  if (!open) {
    const grades = [...new Set(proofs.map((p) => p.grade))].sort((a, b) => a - b)
    return (
      <div className="proof-trainer">
        <p className="proof-trainer-intro">
          A proof shows <em>why</em> something is true. Every step has to follow from the one before.
        </p>
        <p className="proof-trainer-count">
          Solved {proofs.filter((p) => solved.has(p.id)).length} of {proofs.length}
        </p>
        {grades.map((g) => (
          <section key={g} className="proof-trainer-grade">
            <h3>{gradeLabel(g)}</h3>
            <div className="proof-trainer-list">
              {proofs
                .filter((p) => p.grade === g)
                .map((p) => (
                  <button key={p.id} type="button" className="proof-trainer-card" onClick={() => start(p)}>
                    <span className="proof-trainer-claim">{p.claim}</span>
                    <span className="proof-trainer-kind">{PROOF_KIND_LABEL[p.kind]}</span>
                    {solved.has(p.id) && <span className="proof-trainer-done">⭐ Solved</span>}
                  </button>
                ))}
            </div>
          </section>
        ))}
      </div>
    )
  }

  const p = open
  const done = result?.correct === true
  const finished = done || revealed
  const changed = () => setResult(null)

  const ready =
    p.kind === 'order'
      ? placed.length === p.steps.length
      : p.kind === 'reasons'
        ? p.steps.every((_, i) => reasons[i])
        : p.steps.every((s, i) => !isMissingStep(s) || blanks[i] !== undefined)

  const check = () => {
    if (!ready || finished) return
    const r = checkProof(p, { order: placed, reasons, blanks })
    setResult(r)
    setTries((t) => t + 1)
    if (!r.correct) return
    if (!solvedThisSession.has(p.id)) {
      solvedThisSession.add(p.id)
      setSolved(new Set(solvedThisSession))
      addStars(hints === 0 ? 2 : 1)
      onComplete?.(solvedThisSession.size)
    }
  }

  const place = (i: number) => {
    setPlaced((s) => [...s, i])
    changed()
  }
  const unplace = (pos: number) => {
    setPlaced((s) => s.filter((_, k) => k !== pos))
    changed()
  }

  const stepText = (i: number) => {
    const s = p.steps[i]
    return isMissingStep(s) ? s.choices[s.answer] : s.text
  }
  const wrong = new Set(result && !result.correct ? (p.kind === 'order' ? [result.firstWrong] : result.wrongSteps) : [])

  return (
    <div className="proof-trainer">
      <button type="button" className="proof-trainer-back" onClick={() => setOpen(null)}>
        ← All proofs
      </button>

      <div className="proof-trainer-panel">
        <div className="proof-trainer-label">
          {gradeLabel(p.grade)} · {PROOF_KIND_LABEL[p.kind]}
        </div>
        <div className="proof-trainer-claimrow">
          <p className="proof-trainer-bigclaim">{p.claim}</p>
          <button type="button" className="proof-trainer-say" onClick={() => speak(p.claim)} aria-label="Read it to me">
            🔊
          </button>
        </div>

        {revealed && !done ? (
          <div className="proof-trainer-reveal" role="status">
            <strong>Here's the whole proof.</strong>
            <ol>
              {p.steps.map((s, i) => (
                <li key={i}>
                  {stepText(i)}
                  {!isMissingStep(s) && s.reason && <span className="proof-trainer-why"> Because: {s.reason}</span>}
                </li>
              ))}
            </ol>
            <p>Read it through slowly. You can try it yourself again any time.</p>
          </div>
        ) : (
          <>
            {p.kind === 'order' && (
              <div className="proof-trainer-order">
                <div className="proof-trainer-sub">Your proof {placed.length > 0 && !done && '(tap a step to take it back)'}</div>
                <ol className="proof-trainer-placed">
                  {placed.map((i, pos) => (
                    <li key={i}>
                      <button
                        type="button"
                        className={`proof-trainer-step ${wrong.has(pos) ? 'look' : ''}`}
                        disabled={done}
                        onClick={() => unplace(pos)}
                      >
                        <span className="proof-trainer-num">{pos + 1}</span>
                        {stepText(i)}
                      </button>
                    </li>
                  ))}
                </ol>
                {!done && pool.some((i) => !placed.includes(i)) && (
                  <>
                    <div className="proof-trainer-sub">Steps to use</div>
                    <div className="proof-trainer-pool">
                      {pool
                        .filter((i) => !placed.includes(i))
                        .map((i) => (
                          <button key={i} type="button" className="proof-trainer-step pool" onClick={() => place(i)}>
                            {stepText(i)}
                          </button>
                        ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {p.kind === 'reasons' && (
              <ol className="proof-trainer-steps">
                {p.steps.map((s, i) => (
                  <li key={i} className={`proof-trainer-row ${wrong.has(i) ? 'look' : ''}`}>
                    <span>{stepText(i)}</span>
                    {wrong.has(i) && <span className="proof-trainer-pill">look again</span>}
                    <label className="proof-trainer-pick">
                      Why can we say that?
                      <select
                        value={reasons[i] ?? ''}
                        disabled={done}
                        onChange={(e) => {
                          setReasons((r) => ({ ...r, [i]: e.target.value }))
                          changed()
                        }}
                      >
                        <option value="">Choose a reason…</option>
                        {(p.reasons ?? []).map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </label>
                  </li>
                ))}
              </ol>
            )}

            {p.kind === 'blanks' && (
              <ol className="proof-trainer-steps">
                {p.steps.map((s, i) => (
                  <li key={i} className={`proof-trainer-row ${wrong.has(i) ? 'look' : ''}`}>
                    {isMissingStep(s) ? (
                      <div className="proof-trainer-blank">
                        <em>Which step belongs here?</em>
                        <div className="proof-trainer-choices">
                          {s.choices.map((c, j) => (
                            <button
                              key={j}
                              type="button"
                              className={`proof-trainer-choice ${blanks[i] === j ? 'chosen' : ''}`}
                              aria-pressed={blanks[i] === j}
                              disabled={done}
                              onClick={() => {
                                setBlanks((b) => ({ ...b, [i]: j }))
                                changed()
                              }}
                            >
                              {c}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <span>{s.text}</span>
                    )}
                  </li>
                ))}
              </ol>
            )}
          </>
        )}

        <div aria-live="polite">
          {result && !result.correct && !revealed && (
            <div className="proof-trainer-feedback not-yet">
              <strong>Not yet — nearly there.</strong>
              <p>{proofVerdict(p, result)}</p>
            </div>
          )}
          {done && (
            <div className="proof-trainer-feedback yes">
              <strong>That's a proof! 🎉</strong>
              <p>Every step follows from the one before, so the claim is true.{tries === 1 ? ' First try!' : ' You stuck with it.'}</p>
            </div>
          )}
        </div>

        {!finished && hints > 0 && (
          <ul className="proof-trainer-hints">
            {p.hints.slice(0, hints).map((h, i) => (
              <li key={i}>
                <strong>Hint {i + 1}.</strong> {h}
              </li>
            ))}
          </ul>
        )}

        <div className="proof-trainer-actions">
          {!finished && (
            <>
              <button type="button" className="proof-trainer-btn" disabled={!ready} onClick={check}>
                {ready ? 'Check my proof' : p.kind === 'order' ? 'Use every step' : p.kind === 'reasons' ? 'Pick every reason' : 'Pick the missing step'}
              </button>
              {hints < p.hints.length && (
                <button type="button" className="proof-trainer-btn soft" onClick={() => setHints((h) => h + 1)}>
                  {hints === 0 ? "I'd like a hint" : 'Another hint'}
                </button>
              )}
              {tries >= TRIES_BEFORE_REVEAL && (
                <button type="button" className="proof-trainer-btn soft" onClick={() => setRevealed(true)}>
                  Show me the proof
                </button>
              )}
            </>
          )}
          {finished && (
            <>
              {revealed && !done && (
                <button type="button" className="proof-trainer-btn soft" onClick={() => start(p)}>
                  Try it myself
                </button>
              )}
              <button type="button" className="proof-trainer-btn" onClick={() => setOpen(null)}>
                Pick another proof
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProofTrainer
