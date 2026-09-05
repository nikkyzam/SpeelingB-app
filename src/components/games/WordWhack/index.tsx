import React, { useEffect, useMemo, useRef, useState } from 'react'
import type { Word } from '../../../services/wordBank'
import { useAudio } from '../../../contexts/AudioContext'
import { shuffle, misspell, isPlayable } from '../shared/wordTricks'
import sfx from '../shared/sfx'
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
const LIFETIME_MS = 2400
const MAX_ACTIVE = 3

/**
 * Whack-a-mole for proofreading: bugs carry misspelled words, bees carry good
 * ones. Bonk the bugs, leave the bees alone. Reading fast and reading carefully
 * are different skills — this one drills the second while feeling like the first.
 */
const WordWhack: React.FC<WordWhackProps> = ({ onComplete, words: providedWords, seconds = 45 }) => {
  const { speak } = useAudio()

  const pool = useMemo<Word[]>(() => {
    const base = providedWords && providedWords.length > 0 ? providedWords : []
    const usable = shuffle(base).filter((w) => isPlayable(w))
    return usable
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

  const scoreRef = useRef(score)
  scoreRef.current = score

  // Countdown
  useEffect(() => {
    if (done) return
    if (timeLeft <= 0) {
      setDone(true)
      sfx.win()
      const total = scoreRef.current
      setTimeout(() => onComplete(total), 900)
      return
    }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [timeLeft, done, onComplete])

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
    if (alive.length >= MAX_ACTIVE) {
      if (alive.length !== active.length) setMoles(alive)
      return
    }

    const used = new Set(alive.map((m) => m.hole))
    const free = Array.from({ length: HOLES }, (_, i) => i).filter((h) => !used.has(h))
    const word = pool.length ? pool[Math.floor(Math.random() * pool.length)].word.toLowerCase() : ''
    // Slightly more bugs than bees keeps the hammer busy.
    const bad = Math.random() < 0.55
    const text = bad ? misspell(word) : word

    // Nothing to add this beat (no room, no words, or the word wouldn't mangle).
    if (!word || free.length === 0 || (bad && text === word)) {
      if (alive.length !== active.length) setMoles(alive)
      return
    }

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
    const id = setInterval(() => spawnRef.current(), TICK_MS)
    return () => clearInterval(id)
  }, [done])

  const flash = (text: string) => {
    setToast(text)
    setTimeout(() => setToast((t) => (t === text ? null : t)), 800)
  }

  const whack = (mole: Mole) => {
    if (done || mole.hit) return

    if (mole.bad) {
      const nextCombo = combo + 1
      // Every third bonk in a row doubles the points — combos should feel loud.
      const points = 25 * (nextCombo >= 3 ? 2 : 1)
      setScore((s) => s + points)
      setCombo(nextCombo)
      setBestCombo((b) => Math.max(b, nextCombo))
      setBonked((b) => b + 1)
      sfx.pop()
      flash(nextCombo >= 3 ? `💥 COMBO x2! +${points}` : `💥 +${points}`)
      setMoles((ms) => ms.map((m) => (m.id === mole.id ? { ...m, hit: 'bonk', dieAt: Date.now() + 400 } : m)))
    } else {
      // Bonking a good word costs nothing but the combo — mistakes shouldn't sting.
      setCombo(0)
      sfx.wrong()
      speak(mole.text)
      flash(`“${mole.text}” was spelled right!`)
      setMoles((ms) => ms.map((m) => (m.id === mole.id ? { ...m, hit: 'oops', dieAt: Date.now() + 400 } : m)))
    }
  }

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

      <p className="ww-brief">Bonk the <strong>🐛 bugs</strong> with the wrong spelling. Leave the <strong>🐝 bees</strong> alone!</p>

      <div className="ww-field">
        {Array.from({ length: HOLES }).map((_, hole) => {
          const mole = moles.find((m) => m.hole === hole)
          return (
            <div key={hole} className="ww-hole">
              {mole && (
                <button
                  className={`ww-mole ${mole.bad ? 'bug' : 'bee'} ${mole.hit || ''}`}
                  onClick={() => whack(mole)}
                  disabled={done}
                >
                  <span className="ww-face" aria-hidden>{mole.bad ? '🐛' : '🐝'}</span>
                  <span className="ww-word">{mole.text}</span>
                </button>
              )}
            </div>
          )
        })}
      </div>

      {toast && <div className="ww-toast">{toast}</div>}

      {done && (
        <div className="ww-over">
          🎉 Time! You bonked <strong>{bonked}</strong> bugs — best combo <strong>{bestCombo}</strong>!
        </div>
      )}
    </div>
  )
}

export default WordWhack
