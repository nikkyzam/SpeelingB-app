import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useAudio } from '../../../contexts/AudioContext'
import { shuffle } from '../shared/wordTricks'
import { isRealWord } from '../shared/realWords'
import useCheer from '../shared/useCheer'
import useLater from '../shared/useLater'
import Burst from '../shared/Burst'
import GameEmpty from '../shared/GameEmpty'
import sfx from '../shared/sfx'
import './WordFamily.css'
import { spellOut } from '../../../services/words/praise'

interface WordFamilyProps {
  onComplete: (score: number) => void
  /** how many families to work through */
  rounds?: number
}

export interface Family {
  rime: string
  /** beginnings that make a real word */
  real: string[]
  /**
   * Beginnings that don't. They use the same everyday letters as the real
   * ones, so the only way to spot them is to read the word. When every fake
   * started with z, v or q, children learned "never tap z" instead — and
   * "vat" and "zing" are real words a child was told we don't use.
   */
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
export const FAMILIES: Family[] = [
  { rime: 'ight', real: ['l', 'n', 'f', 'r', 's', 'br', 'fl', 'm'], fake: ['g', 'ch', 'gl', 'cr', 'j'] },
  { rime: 'ake',  real: ['c', 'b', 'l', 'm', 'r', 'sn', 'sh', 'w'], fake: ['g', 'd', 'n', 'pl', 'tr'] },
  { rime: 'at',   real: ['c', 'b', 'h', 'm', 'r', 's', 'fl', 'ch'], fake: ['j', 'cr', 'tr', 'sn', 'gr'] },
  { rime: 'ing',  real: ['k', 'r', 's', 'w', 'br', 'st', 'th', 'sw'], fake: ['dr', 'gr', 'pl', 'tr', 'cr'] },
  { rime: 'ell',  real: ['b', 'f', 's', 't', 'w', 'sh', 'sm', 'sp'], fake: ['r', 'gr', 'dr', 'tr', 'cr'] },
  { rime: 'ump',  real: ['b', 'd', 'j', 'l', 'p', 'st', 'gr', 'th'], fake: ['n', 'w', 'br', 'dr', 'gl'] },
  { rime: 'op',   real: ['h', 'm', 'p', 't', 'st', 'sh', 'dr', 'ch'], fake: ['r', 'j', 'br', 'gr', 'sm'] },
  { rime: 'and',  real: ['b', 'h', 'l', 's', 'st', 'br', 'gr'], fake: ['d', 'p', 't', 'cr', 'pl'] },
]

/** How many beginnings to offer at once — enough to hunt, not enough to swamp. */
const REAL_ON_OFFER = 5
const FAKE_ON_OFFER = 2

/** Points for each real word, for finishing the family, and for not being fooled once. */
const PER_WORD = 20
const FAMILY_BONUS = 20
const CLEAN_BONUS = 20

/**
 * The tiles for one family: some real beginnings and a couple of impostors.
 * A fake that turns out to be a real word is dropped, never offered — calling
 * a real word "not a word" teaches the wrong thing.
 */
export const dealTiles = (family: Family, isWord: (text: string) => boolean = isRealWord): string[] => {
  const fakes = family.fake.filter((f) => !family.real.includes(f) && !isWord(f + family.rime))
  return shuffle([
    ...shuffle(family.real).slice(0, REAL_ON_OFFER),
    ...shuffle(fakes).slice(0, FAKE_ON_OFFER),
  ])
}

const WordFamilyFactory: React.FC<WordFamilyProps> = ({ onComplete, rounds = 3 }) => {
  const { speak } = useAudio()
  const cheer = useCheer()
  const later = useLater()

  const families = useMemo(() => shuffle(FAMILIES).slice(0, rounds), [rounds])
  const [round, setRound] = useState(0)
  const [found, setFound] = useState<string[]>([])
  const [rejected, setRejected] = useState<string[]>([])
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)
  const [line, setLine] = useState('')
  /** The last impostor tapped ("gake"), shown until the next tap. */
  const [trick, setTrick] = useState<string | null>(null)
  const [nope, setNope] = useState<string | null>(null)
  const [hits, setHits] = useState(0)

  // Taps settle through refs: a fast double tap on one tile used to add it to
  // `found` twice and finish the family a word early.
  const settled = useRef<Set<string>>(new Set())
  const finished = useRef(false)
  const fooled = useRef(false)
  // The running total, read when the last family closes: two quick taps on
  // different tiles can both land before `score` state catches up.
  const points = useRef(0)

  const family = families[round]

  const tiles = useMemo(() => (family ? dealTiles(family) : []), [family])
  const target = useMemo(() => tiles.filter((t) => family?.real.includes(t)).length, [tiles, family])

  useEffect(() => {
    if (!family) return
    settled.current = new Set()
    finished.current = false
    fooled.current = false
    // "the and family" read as nonsense aloud: say the ending's letters, and a
    // word from the family so the sound is clear.
    speak(`Let's build words that end in ${spellOut(family.rime)}, like ${family.real[0]}${family.rime}!`)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round, families])

  if (!family) {
    return (
      <div className="word-family">
        <GameEmpty icon="🏭">The factory is closed — try again in a moment!</GameEmpty>
      </div>
    )
  }

  const finishFamily = () => {
    finished.current = true
    setDone(true)
    later(() => {
      if (round < families.length - 1) {
        setFound([])
        setRejected([])
        setTrick(null)
        setLine('')
        setDone(false)
        setRound((r) => r + 1)
      } else {
        sfx.win()
        onComplete(points.current)
      }
    }, 2200)
  }

  const tryOnset = (onset: string) => {
    if (finished.current || settled.current.has(onset)) return
    settled.current.add(onset)
    const word = onset + family.rime

    if (family.real.includes(onset)) {
      setTrick(null)
      setFound((f) => [...f, onset])
      setHits((h) => h + 1)
      const builtNow = [...settled.current].filter((t) => family.real.includes(t)).length
      const complete = builtNow >= target
      // Completing a whole family is where the pattern actually lands — and
      // doing it without being fooled once shows the child really read them.
      const clean = complete && !fooled.current
      const gained = PER_WORD + (complete ? FAMILY_BONUS : 0) + (clean ? CLEAN_BONUS : 0)
      points.current += gained
      setScore(points.current)
      if (complete) {
        setLine(cheer.hit({ say: clean ? `${word}! Not one trick fooled you!` : `${word}! The whole family!` }))
        finishFamily()
      } else {
        cheer.hit({ quiet: true })
        speak(word)
      }
      return
    }

    // Not a word — say so kindly. It costs no points, only the no-tricks bonus.
    fooled.current = true
    setRejected((r) => [...r, onset])
    setNope(onset)
    later(() => setNope((n) => (n === onset ? null : n)), 500)
    setTrick(word)
    setLine(cheer.miss({ say: `${word} isn't a real word.` }))
  }

  const clean = rejected.length === 0

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
        Add a beginning. Does it make a real word? Watch out for tricks!
      </p>

      <div className="wf2-rime">
        <span className="wf2-rime-dash">-</span>
        <span className="wf2-rime-text">{family.rime}</span>
      </div>

      <div className="wf2-tiles">
        {tiles.map((t) => {
          const used = found.includes(t)
          const fake = rejected.includes(t)
          return (
            <button
              key={t}
              className={`wf2-tile ${used ? 'used' : ''} ${fake ? 'fake' : ''} ${nope === t ? 'nope' : ''}`}
              onClick={() => tryOnset(t)}
              disabled={used || fake || done}
              aria-label={fake ? `${t}${family.rime} is not a word` : t}
            >
              {t}
            </button>
          )
        })}
      </div>

      <div className={`wf2-shield ${trick ? 'trick' : clean ? 'on' : 'off'}`} aria-live="polite">
        {trick
          ? `🙃 ${line} “${trick}” isn’t a real word — keep looking!`
          : clean
            ? '🛡️ No tricks have fooled you yet!'
            : '🔍 Read each one carefully…'}
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

      {done && (
        <div className="wf2-flash" role="status">
          <Burst trigger={hits} />
          🎉 {line} The whole <strong>-{family.rime}</strong> family
          {clean ? ', and no tricks fooled you! 🛡️' : '!'}
        </div>
      )}
    </div>
  )
}

export default WordFamilyFactory
