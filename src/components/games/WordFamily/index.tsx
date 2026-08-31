import React, { useEffect, useMemo, useState } from 'react'
import { useAudio } from '../../../contexts/AudioContext'
import { shuffle } from '../shared/wordTricks'
import sfx from '../shared/sfx'
import './WordFamily.css'

interface WordFamilyProps {
  onComplete: (score: number) => void
  /** how many families to work through */
  rounds?: number
}

interface Family {
  rime: string
  /** beginnings that make a real word */
  real: string[]
  /** beginnings that don't — they look plausible, which is the point */
  fake: string[]
}

/**
 * Spelling patterns, which are the closest thing to a cheat code in English:
 * a child who knows "-ight" can suddenly write light, night, fright and bright
 * without ever having been taught them one at a time.
 *
 * Rather than testing words the child already met, this builds new ones from a
 * pattern — the whole point being that the pattern travels.
 */
const FAMILIES: Family[] = [
  { rime: 'ight', real: ['l', 'n', 'f', 'r', 's', 'br', 'fl', 'm'], fake: ['z', 'v', 'j'] },
  { rime: 'ake',  real: ['c', 'b', 'l', 'm', 'r', 'sn', 'sh', 'w'], fake: ['z', 'v', 'p'] },
  { rime: 'at',   real: ['c', 'b', 'h', 'm', 'r', 's', 'fl', 'ch'], fake: ['z', 'v', 'q'] },
  { rime: 'ing',  real: ['k', 'r', 's', 'w', 'br', 'st', 'th', 'sw'], fake: ['z', 'v', 'q'] },
  { rime: 'ell',  real: ['b', 'f', 's', 't', 'w', 'sh', 'sm', 'sp'], fake: ['z', 'v', 'q'] },
  { rime: 'ump',  real: ['b', 'd', 'j', 'l', 'p', 'st', 'gr', 'th'], fake: ['z', 'v', 'q'] },
  { rime: 'op',   real: ['h', 'm', 'p', 't', 'st', 'sh', 'dr', 'ch'], fake: ['z', 'v', 'q'] },
  { rime: 'and',  real: ['b', 'h', 'l', 's', 'st', 'br', 'gr'], fake: ['z', 'v', 'q'] },
]

/** How many beginnings to offer at once — enough to hunt, not enough to swamp. */
const REAL_ON_OFFER = 5
const FAKE_ON_OFFER = 2

const WordFamilyFactory: React.FC<WordFamilyProps> = ({ onComplete, rounds = 3 }) => {
  const { speak } = useAudio()

  const families = useMemo(() => shuffle(FAMILIES).slice(0, rounds), [rounds])
  const [round, setRound] = useState(0)
  const [found, setFound] = useState<string[]>([])
  const [rejected, setRejected] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)

  const family = families[round]

  // The tiles for this family: some real beginnings, some impostors.
  const tiles = useMemo(() => {
    if (!family) return []
    return shuffle([
      ...shuffle(family.real).slice(0, REAL_ON_OFFER),
      ...shuffle(family.fake).slice(0, FAKE_ON_OFFER),
    ])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round, family])

  const target = useMemo(
    () => tiles.filter((t) => family?.real.includes(t)).length,
    [tiles, family]
  )

  useEffect(() => {
    if (family) speak(`Let's build the ${family.rime} family`)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round])

  if (!family) {
    return (
      <div className="word-family">
        <p className="wf2-empty">The factory is closed — try again in a moment! 🏭</p>
        <button className="wf2-btn" onClick={() => onComplete(0)}>Back to Games</button>
      </div>
    )
  }

  const finishRound = (points: number) => {
    if (round < families.length - 1) {
      setTimeout(() => {
        setRound((r) => r + 1)
        setFound([])
      }, 1600)
    } else {
      setDone(true)
      sfx.win()
      setTimeout(() => onComplete(score + points), 1800)
    }
  }

  const tryOnset = (onset: string) => {
    if (found.includes(onset) || done) return
    const word = onset + family.rime

    if (family.real.includes(onset)) {
      const nextFound = [...found, onset]
      setFound(nextFound)
      sfx.correct()
      speak(word)

      const points = 20
      const finished = nextFound.length >= target
      // Completing a whole family is where the pattern actually lands.
      const bonus = finished ? 40 : 0
      setScore((s) => s + points + bonus)
      if (finished) finishRound(points + bonus)
    } else {
      // Not a word — say so plainly, cost nothing.
      sfx.wrong()
      setRejected(onset)
      speak(`${word} is not a word we use`)
      setTimeout(() => setRejected((r) => (r === onset ? null : r)), 1200)
    }
  }

  return (
    <div className="word-family">
      <div className="wf2-header">
        <div className="wf2-title">🏭 Word Family Factory</div>
        <div className="wf2-stats">
          <div className="wf2-stat"><span>Family</span><strong>{round + 1}/{families.length}</strong></div>
          <div className="wf2-stat"><span>Score</span><strong>{score}</strong></div>
          <div className="wf2-stat"><span>Built</span><strong>🧱 {found.length}/{target}</strong></div>
        </div>
      </div>

      <p className="wf2-brief">
        Every word in a family ends the same way. Add a beginning and see if it makes a real word!
      </p>

      <div className="wf2-rime">
        <span className="wf2-rime-dash">-</span>
        <span className="wf2-rime-text">{family.rime}</span>
      </div>

      <div className="wf2-tiles">
        {tiles.map((t) => (
          <button
            key={t}
            className={`wf2-tile ${found.includes(t) ? 'used' : ''} ${rejected === t ? 'nope' : ''}`}
            onClick={() => tryOnset(t)}
            disabled={found.includes(t) || done}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="wf2-wall" aria-live="polite">
        {found.length === 0 ? (
          <span className="wf2-wall-empty">Your words will appear here…</span>
        ) : (
          found.map((o) => (
            <button key={o} className="wf2-word" onClick={() => speak(o + family.rime)}>
              <span className="wf2-word-onset">{o}</span>{family.rime}
            </button>
          ))
        )}
      </div>

      {found.length >= target && (
        <div className="wf2-flash">
          🎉 The whole <strong>-{family.rime}</strong> family! You can spell these now even if you have never seen them before.
        </div>
      )}
    </div>
  )
}

export default WordFamilyFactory
