import React, { useEffect, useState } from 'react'
import { useAudio } from '../../../contexts/AudioContext'
import { useRewardStore } from '../../../stores/rewards/useRewardStore'
import { checkPuzzle, loadPuzzles, trophyFor, type Puzzle, type Trophy } from '../../../services/subjects/mathExtras'
import NumberInput from '../NumberInput'
import './PuzzleBox.css'

/**
 * Puzzles: untimed, no score, something to sit with. Hints come one at a time
 * up a three-step ladder, and the fewer used, the better the trophy. If a
 * child is still stuck after trying, they can ask to see the answer and how
 * to get there.
 */
interface PuzzleBoxProps {
  /** Called after each newly solved puzzle with how many are solved this session. */
  onComplete?: (solved: number) => void
}

const TROPHY: Record<Trophy, { cup: string; word: string }> = {
  gold: { cup: '🥇', word: 'Gold' },
  silver: { cup: '🥈', word: 'Silver' },
  bronze: { cup: '🥉', word: 'Bronze' },
}

/** Best trophy per puzzle this session (until reload); stars are paid on the first solve. */
const trophiesThisSession = new Map<string, Trophy>()
const RANK: Record<Trophy, number> = { gold: 3, silver: 2, bronze: 1 }

/** Wrong tries before "Show me the answer" appears even without every hint. */
const TRIES_BEFORE_REVEAL = 3

const Pips: React.FC<{ n: number }> = ({ n }) => {
  const filled = Math.max(1, Math.min(4, n))
  return (
    <span className="puzzle-box-pips" role="img" aria-label={`Difficulty ${filled} out of 4`}>
      {'●'.repeat(filled)}
      {'○'.repeat(4 - filled)}
    </span>
  )
}

const PuzzleBox: React.FC<PuzzleBoxProps> = ({ onComplete }) => {
  const { speak } = useAudio()
  const { addStars } = useRewardStore()
  const [puzzles, setPuzzles] = useState<Puzzle[] | null>(null)
  const [failed, setFailed] = useState(false)
  const [trophies, setTrophies] = useState(() => new Map(trophiesThisSession))
  const [open, setOpen] = useState<Puzzle | null>(null)

  const [typed, setTyped] = useState('')
  const [hints, setHints] = useState(0)
  const [wrongTries, setWrongTries] = useState(0)
  const [lastWrong, setLastWrong] = useState(false)
  const [won, setWon] = useState<Trophy | null>(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    let live = true
    loadPuzzles()
      .then((list) => live && setPuzzles(list))
      .catch(() => live && setFailed(true))
    return () => {
      live = false
    }
  }, [])

  const start = (p: Puzzle) => {
    setOpen(p)
    setTyped('')
    setHints(0)
    setWrongTries(0)
    setLastWrong(false)
    setWon(null)
    setRevealed(false)
  }

  if (failed) {
    return (
      <p className="puzzle-box-msg" role="alert">
        The puzzles didn't load just now. Please try again in a moment.
      </p>
    )
  }
  if (!puzzles) return <p className="puzzle-box-msg" role="status">Finding the puzzles…</p>

  if (!open) {
    return (
      <div className="puzzle-box">
        <p className="puzzle-box-intro">
          No clock and no score. Hints are here if you want them — solve it with none for a gold trophy!
        </p>
        <p className="puzzle-box-count">
          Solved {puzzles.filter((p) => trophies.has(p.id)).length} of {puzzles.length}
        </p>
        <div className="puzzle-box-list">
          {puzzles.map((p) => {
            const t = trophies.get(p.id)
            return (
              <button key={p.id} type="button" className="puzzle-box-card" onClick={() => start(p)}>
                <span className="puzzle-box-name">{p.title}</span>
                <Pips n={p.difficulty} />
                {t && (
                  <span className="puzzle-box-won">
                    <span aria-hidden="true">{TROPHY[t].cup}</span> {TROPHY[t].word}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  const p = open
  const finished = won !== null || revealed
  const canReveal = !finished && wrongTries > 0 && (hints >= p.hints.length || wrongTries >= TRIES_BEFORE_REVEAL)

  const check = () => {
    if (finished || !typed.trim()) return
    if (!checkPuzzle(p, typed)) {
      setWrongTries((n) => n + 1)
      setLastWrong(true)
      return
    }
    const trophy = trophyFor(hints)
    setWon(trophy)
    setLastWrong(false)
    const before = trophiesThisSession.get(p.id)
    if (!before) {
      addStars(hints === 0 ? 2 : 1)
    }
    if (!before || RANK[trophy] > RANK[before]) {
      trophiesThisSession.set(p.id, trophy)
      setTrophies(new Map(trophiesThisSession))
    }
    if (!before) onComplete?.(trophiesThisSession.size)
  }

  const nextTrophy = TROPHY[trophyFor(hints)].word.toLowerCase()

  return (
    <div className="puzzle-box">
      <button type="button" className="puzzle-box-back" onClick={() => setOpen(null)}>
        ← All puzzles
      </button>

      <div className="puzzle-box-panel">
        <div className="puzzle-box-head">
          <h3 className="puzzle-box-title">{p.title}</h3>
          <Pips n={p.difficulty} />
        </div>
        <div className="puzzle-box-promptrow">
          <p className="puzzle-box-prompt">{p.prompt}</p>
          <button type="button" className="puzzle-box-say" onClick={() => speak(p.prompt)} aria-label="Read it to me">
            🔊
          </button>
        </div>

        {!finished && (
          <form
            className="puzzle-box-answer"
            onSubmit={(e) => {
              e.preventDefault()
              check()
            }}
          >
            <NumberInput
              value={typed}
              onChange={(v) => {
                setTyped(v)
                setLastWrong(false)
              }}
            />
            <button type="submit" className="puzzle-box-btn" disabled={!typed.trim()}>
              Check
            </button>
          </form>
        )}

        {hints > 0 && (
          <ol className="puzzle-box-hints">
            {p.hints.slice(0, hints).map((h, i) => (
              <li key={i}>
                <strong>Hint {i + 1}.</strong> {h}
              </li>
            ))}
          </ol>
        )}

        <div aria-live="polite">
          {lastWrong && !finished && (
            <div className="puzzle-box-feedback not-yet">
              <strong>Not that one — yet.</strong>
              <p>{hints < p.hints.length ? 'Try a different way, or take a hint.' : 'Try a different way of looking at it.'}</p>
            </div>
          )}
          {won && (
            <div className="puzzle-box-trophy">
              <span className="puzzle-box-cup" aria-hidden="true">
                {TROPHY[won].cup}
              </span>
              <div>
                <strong>{TROPHY[won].word} trophy!</strong>
                <p>{hints === 0 ? 'Solved with no hints at all. Brilliant thinking!' : 'Solved! You kept going.'}</p>
              </div>
            </div>
          )}
          {revealed && !won && (
            <div className="puzzle-box-feedback reveal">
              <strong>The answer is {p.answer}.</strong>
              <p>{p.solution}</p>
            </div>
          )}
          {won && <p className="puzzle-box-solution">{p.solution}</p>}
        </div>

        <div className="puzzle-box-actions">
          {!finished && (
            <>
              {hints < p.hints.length && (
                <button type="button" className="puzzle-box-btn soft" onClick={() => { setHints((h) => h + 1); setLastWrong(false) }}>
                  {hints === 0 ? "I'd like a hint" : 'Another hint'}
                </button>
              )}
              {canReveal && (
                <button type="button" className="puzzle-box-btn soft" onClick={() => setRevealed(true)}>
                  Show me the answer
                </button>
              )}
            </>
          )}
          {finished && (
            <button type="button" className="puzzle-box-btn" onClick={() => setOpen(null)}>
              Pick another puzzle
            </button>
          )}
        </div>

        {!finished && (
          <p className="puzzle-box-note">
            {hints === 0
              ? 'No hints so far — this one is heading for gold.'
              : `${hints} of ${p.hints.length} hints taken — this one is heading for ${nextTrophy}.`}
          </p>
        )}
      </div>
    </div>
  )
}

export default PuzzleBox
