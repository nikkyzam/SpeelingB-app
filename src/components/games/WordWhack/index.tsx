import React, { useEffect, useMemo, useRef, useState } from 'react'
import type { Word } from '../../../services/wordBank'
import { useAudio } from '../../../contexts/AudioContext'
import { shuffle, isPlayable } from '../shared/wordTricks'
import { fakeSpelling } from '../shared/realWords'
import sfx from '../shared/sfx'
import useCheer from '../shared/useCheer'
import useLater from '../shared/useLater'
import Burst from '../shared/Burst'
import './WordWhack.css'

interface WordWhackProps {
  onComplete: (score: number) => void
  words?: Word[]
  seconds?: number
}

interface Mole {
  id: number
  hole: number
  text: string
  /** true when the word is misspelled — these are the ones to bonk */
  bad: boolean
  dieAt: number
  hit?: 'bonk' | 'oops'
}

const HOLES = 9
const TICK_MS = 200
/** Long enough for a six-year-old to read the word and decide. */
const LIFETIME_MS = 3500
const MAX_ACTIVE = 2
/** A breath between pop-ups, so a gap never refills the instant it opens. */
const SPAWN_GAP_MS = [600, 1200] as const
/** A bonked or tapped critter stays up this long to show what it was. */
const REVEAL_MS = 750

/** Smaller type for longer words, so a word is never broken across lines. */
export const wordSize = (text: string): string => {
  const rem = Math.max(0.55, Math.min(1, 8.5 / Math.max(text.length, 1)))
  return `min(${rem.toFixed(2)}rem, ${(rem * 4.2).toFixed(2)}vw)`
}

/**
 * Whack-a-mole for proofreading: bugs carry misspelled words, bees carry good
 * ones. Bonk the bugs, leave the bees alone. Reading fast and reading carefully
 * are different skills — this one drills the second while feeling like the first.
 *
 * Every critter pops up looking the same, hiding behind a flower; only the
 * spelling tells them apart. When bugs wore a 🐛 face and an orange border the
 * game was "tap the bugs", and nobody read a word.
 */
const WordWhack: React.FC<WordWhackProps> = ({ onComplete, words: providedWords, seconds = 45 }) => {
  const { speak } = useAudio()
  const cheer = useCheer()
  const later = useLater()

  const pool = useMemo<Word[]>(() => {
    const base = providedWords && providedWords.length > 0 ? providedWords : []
    return shuffle(base).filter((w) => isPlayable(w))
  }, [providedWords])

  const [moles, setMoles] = useState<Mole[]>([])
  const [score, setScore] = useState(0)
  const [combo, setCombo] = useState(0)
  const [bestCombo, setBestCombo] = useState(0)
  const [bonked, setBonked] = useState(0)
  const [timeLeft, setTimeLeft] = useState(seconds)
  const [toast, setToast] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const idRef = useRef(0)
  const nextSpawnAt = useRef(0)
  /** Critters already tapped: a double tap must not bonk one twice. */
  const settled = useRef(new Set<number>())

  const scoreRef = useRef(score)
  scoreRef.current = score
  // The hub hands over a new onComplete on every render. Depending on it
  // restarted the countdown's tick each time, so it is read through a ref.
  const finish = useRef(onComplete)
  finish.current = onComplete

  // Countdown
  useEffect(() => {
    if (done) return
    if (timeLeft <= 0) {
      setDone(true)
      sfx.win()
      const total = scoreRef.current
      later(() => finish.current(total), 1200)
      return
    }
    const t = window.setTimeout(() => setTimeLeft((s) => s - 1), 1000)
    return () => window.clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, done])

  // Moles are read through a ref so the spawn timer decides everything outside
  // setState — updaters stay pure and nothing scores twice.
  const molesRef = useRef(moles)
  molesRef.current = moles

  const spawn = () => {
    const now = Date.now()
    const active = molesRef.current

    // Bugs that crawled away un-bonked break the combo — watch them all!
    if (active.some((m) => m.dieAt <= now && m.bad && !m.hit)) setCombo(0)

    const alive = active.filter((m) => m.dieAt > now)
    const tidy = () => {
      if (alive.length !== active.length) setMoles(alive)
    }
    const waiting = alive.filter((m) => !m.hit).length
    if (waiting >= MAX_ACTIVE || now < nextSpawnAt.current || pool.length === 0) return tidy()

    const used = new Set(alive.map((m) => m.hole))
    const free = Array.from({ length: HOLES }, (_, i) => i).filter((h) => !used.has(h))
    if (free.length === 0) return tidy()

    const word = pool[Math.floor(Math.random() * pool.length)].word.toLowerCase()
    // Slightly more bugs than bees keeps the hammer busy. A bug's word is
    // never a real word in its own right: "from" is no misspelling of "form".
    const bad = Math.random() < 0.55
    const text = bad ? fakeSpelling(word) : word

    const [lo, hi] = SPAWN_GAP_MS
    nextSpawnAt.current = now + lo + Math.random() * (hi - lo)
    setMoles([
      ...alive,
      {
        id: idRef.current++,
        hole: free[Math.floor(Math.random() * free.length)],
        text,
        bad,
        dieAt: now + LIFETIME_MS,
      },
    ])
  }

  const spawnRef = useRef(spawn)
  spawnRef.current = spawn

  useEffect(() => {
    if (done) return
    const id = window.setInterval(() => spawnRef.current(), TICK_MS)
    return () => window.clearInterval(id)
  }, [done])

  const flash = (text: string) => {
    setToast(text)
    later(() => setToast((t) => (t === text ? null : t)), 1100)
  }

  const whack = (mole: Mole) => {
    if (done || mole.hit || settled.current.has(mole.id)) return
    settled.current.add(mole.id)
    const hit: Mole['hit'] = mole.bad ? 'bonk' : 'oops'

    if (mole.bad) {
      const nextCombo = combo + 1
      // Every third bonk in a row doubles the points — combos should feel loud.
      const points = 25 * (nextCombo >= 3 ? 2 : 1)
      setScore((s) => s + points)
      setCombo(nextCombo)
      setBestCombo((b) => Math.max(b, nextCombo))
      setBonked((b) => b + 1)
      sfx.pop()
      const line = cheer.hit({ quiet: true })
      flash(nextCombo >= 3 ? `💥 ${line} COMBO x2! +${points}` : `💥 ${line} +${points}`)
    } else {
      // Bonking a good word costs nothing but the combo — mistakes shouldn't sting.
      setCombo(0)
      cheer.miss({ quiet: true })
      speak(`${mole.text} is spelled right`)
      flash(`🐝 A bee! “${mole.text}” was spelled right.`)
    }
    setMoles((ms) =>
      ms.map((m) => (m.id === mole.id ? { ...m, hit, dieAt: Date.now() + REVEAL_MS } : m))
    )
  }

  // Said once at the start, for a child who can't read the instructions yet.
  useEffect(() => {
    speak('Bonk the bugs hiding in words that are spelled wrong. Leave the right spellings alone!')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="word-whack">
      <div className="ww-header">
        <div className="ww-title">🔨 Word Whack</div>
        <div className="ww-stats">
          <div className="ww-stat"><span>Score</span><strong>{score}</strong></div>
          <div className="ww-stat"><span>Combo</span><strong>🔥 {combo}</strong></div>
          <div className="ww-stat"><span>Bonked</span><strong>🐛 {bonked}</strong></div>
          <div className="ww-stat"><span>Time</span><strong>⏱ {timeLeft}s</strong></div>
        </div>
      </div>

      <p className="ww-brief">
        Sneaky <strong>bugs</strong> hide in the words spelled wrong — bonk them! 🔨 Leave the right spellings alone: those are <strong>bees</strong>.
      </p>

      <div className="ww-field">
        {Array.from({ length: HOLES }).map((_, hole) => {
          const mole = moles.find((m) => m.hole === hole)
          return (
            <div key={hole} className="ww-hole">
              {mole && (
                <>
                  {mole.hit === 'bonk' && <Burst trigger={mole.id + 1} count={6} />}
                  <button
                    className={`ww-mole ${mole.hit || ''}`}
                    onClick={() => whack(mole)}
                    disabled={done}
                  >
                    {/* Who it really was shows only after the tap. */}
                    <span className="ww-face" aria-hidden>
                      {mole.hit === 'bonk' ? '🐛' : mole.hit === 'oops' ? '🐝' : '🌼'}
                    </span>
                    <span className="ww-word" style={{ fontSize: wordSize(mole.text) }}>{mole.text}</span>
                  </button>
                </>
              )}
            </div>
          )
        })}
      </div>

      {toast && <div className="ww-toast" role="status">{toast}</div>}

      {done && (
        <div className="ww-over">
          🎉 Time! You bonked <strong>{bonked}</strong> bugs — best combo <strong>{bestCombo}</strong>!
        </div>
      )}
    </div>
  )
}

export default WordWhack
