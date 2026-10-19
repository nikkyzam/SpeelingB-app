import React, { useState, useEffect, useRef, useMemo } from 'react'
import type { Word } from '../../../services/wordBank'
import { useAudio } from '../../../contexts/AudioContext'
import { isPlayable } from '../shared/wordTricks'
import { fakeSpelling } from '../shared/realWords'
import { useCheer } from '../shared/useCheer'
import { useLater } from '../shared/useLater'
import Burst from '../shared/Burst'
import GameEmpty from '../shared/GameEmpty'
import './WordRace.css'

/** The combo bonus stops growing here, so a long race stays on the hub's usual score scale. */
const MAX_COMBO_BONUS = 5
/** The ticker: the clock counts tenths of a second. */
const TICK_MS = 100
/** Where a falling word reaches the ground, in % of the play area. */
export const GROUND = 95
/** How long a caught or outdated word takes to fade away. */
const FADE_MS = 350

interface WordRaceProps {
  onComplete: (score: number) => void
  duration?: number
  words?: Word[]
}

export interface Faller {
  id: number
  word: string
  x: number
  y: number
  speed: number
  /**
   * Which target this word fell for. When the target changes, everything that
   * fell for the old one fades out: a copy of the old target isn't a wrong
   * answer, it's just old, and tapping it used to count as one.
   */
  round: number
  state: 'falling' | 'caught' | 'fading'
}

/**
 * One tick of the race: falling words move down and the ones that reach the
 * ground go. `missedTarget` is true only when the word being hunted (for this
 * round) lands uncaught. A look-alike or another word reaching the ground is
 * not a miss — leaving it alone was right — so only the target breaks a combo.
 */
export const fallOnce = (
  fallers: Faller[],
  target: string,
  round: number
): { fallers: Faller[]; missedTarget: boolean } => {
  let missedTarget = false
  const next: Faller[] = []
  for (const f of fallers) {
    if (f.state !== 'falling') {
      next.push(f)
      continue
    }
    const y = f.y + f.speed
    if (y >= GROUND) {
      if (f.round === round && f.word === target) missedTarget = true
      continue
    }
    next.push({ ...f, y })
  }
  return { fallers: next, missedTarget }
}

const WordRace: React.FC<WordRaceProps> = ({ onComplete, duration = 60, words: providedWords }) => {
  const { speak } = useAudio()
  const cheer = useCheer()
  const later = useLater()

  // Only the child's own words — the old fallback drew strangers from the
  // whole word bank.
  const pool = useMemo(
    () => (providedWords || []).filter((w) => isPlayable(w, 3)).map((w) => w.word.toLowerCase()),
    [providedWords]
  )
  const hasWords = pool.length > 0

  // The world lives in refs so the ticker always sees the latest of it; a
  // repaint counter puts it on screen.
  const world = useRef<Faller[]>([])
  const [, repaint] = useState(0)
  const paint = () => repaint((n) => n + 1)
  const nextId = useRef(0)
  const target = useRef('')
  const round = useRef(0)
  const scoreRef = useRef(0)
  const comboRef = useRef(0)
  const finished = useRef(false)
  const cheerId = useRef(0)

  // Tenths of a second: the ticker runs every 100ms, and counting it down in
  // whole seconds made the "60 second" race last six.
  const [timeLeft, setTimeLeft] = useState(duration * 10)
  const [score, setScore] = useState(0)
  const [combo, setCombo] = useState(0)
  const [targetWord, setTargetWord] = useState('')
  const [line, setLine] = useState('')
  const [catches, setCatches] = useState(0)
  const [shakeId, setShakeId] = useState<number | null>(null)

  const randomWord = () => pool[Math.floor(Math.random() * pool.length)]

  const spawn = (forceTarget = false) => {
    const t = target.current
    if (!t) return
    // The target falls often, beside look-alike misspellings of it and the
    // child's other words. Drawn only at random from a list of up to 60, the
    // target hardly ever fell, and a child waited out the clock.
    const roll = forceTarget ? 0 : Math.random()
    const text = roll < 0.35 ? t : roll < 0.6 ? fakeSpelling(t) : randomWord()
    world.current = [
      ...world.current,
      {
        id: nextId.current++,
        word: text,
        x: Math.random() * 76 + 12,
        y: -8,
        speed: 0.5 + Math.random(),
        round: round.current,
        state: 'falling',
      },
    ]
  }

  const newTarget = () => {
    if (finished.current || !hasWords) return
    const others = pool.filter((w) => w !== target.current)
    const from = others.length ? others : pool
    const t = from[Math.floor(Math.random() * from.length)]
    target.current = t
    round.current += 1

    const old = new Set(world.current.filter((f) => f.state === 'falling').map((f) => f.id))
    world.current = world.current.map((f) => (old.has(f.id) ? { ...f, state: 'fading' } : f))
    later(() => {
      world.current = world.current.filter((f) => !old.has(f.id))
      paint()
    }, FADE_MS)

    setTargetWord(t)
    speak(t)
    // One copy straight away, so a new target never means a wait.
    spawn(true)
    paint()
  }

  useEffect(() => {
    newTarget()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pool])

  // The ticker. No words, no clock: a clock running out pays for a game
  // nobody played.
  useEffect(() => {
    if (!hasWords) return
    const id = window.setInterval(() => {
      if (finished.current) return
      // A new word every second or so (this runs ten times a second).
      if (Math.random() > 0.93) spawn()
      const { fallers, missedTarget } = fallOnce(world.current, target.current, round.current)
      world.current = fallers
      if (missedTarget && comboRef.current > 0) {
        comboRef.current = 0
        setCombo(0)
      }
      setTimeLeft((t) => t - 1)
    }, TICK_MS)
    return () => window.clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasWords])

  useEffect(() => {
    if (timeLeft > 0 || finished.current || !hasWords) return
    finished.current = true
    world.current = []
    onComplete(scoreRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft])

  if (!hasWords) {
    return (
      <div className="word-race">
        <GameEmpty icon="🏃">No words to catch yet — learn a few, then come back and race!</GameEmpty>
      </div>
    )
  }

  const handleWordClick = (clicked: Faller) => {
    if (finished.current) return
    const f = world.current.find((w) => w.id === clicked.id)
    if (!f || f.state !== 'falling' || f.round !== round.current) return

    if (f.word !== target.current) {
      // A soft "nearly" and a wiggle; the word keeps falling.
      cheer.miss({ quiet: true })
      comboRef.current = 0
      setCombo(0)
      setShakeId(f.id)
      later(() => setShakeId((s) => (s === f.id ? null : s)), 400)
      return
    }

    const points = 10 + 2 * Math.min(comboRef.current, MAX_COMBO_BONUS)
    scoreRef.current += points
    setScore(scoreRef.current)
    comboRef.current += 1
    setCombo(comboRef.current)
    world.current = world.current.map((w) => (w.id === f.id ? { ...w, state: 'caught' } : w))
    later(() => {
      world.current = world.current.filter((w) => w.id !== f.id)
      paint()
    }, FADE_MS)

    // Quiet praise: the next target is about to be said.
    setLine(cheer.hit({ quiet: true }))
    setCatches((c) => c + 1)
    const id = ++cheerId.current
    later(() => {
      if (cheerId.current === id) setLine('')
    }, 1100)
    newTarget()
  }

  return (
    <div className="word-race">
      <div className="wr-header">
        <div className="wr-title">🏃 Word Race</div>
        <div className="wr-stats">
          <div className="wr-stat"><span>Time</span><strong>{Math.ceil(timeLeft / 10)}s</strong></div>
          <div className="wr-stat"><span>Score</span><strong>{score}</strong></div>
          <div className="wr-stat"><span>Combo</span><strong>🔥 {combo}</strong></div>
        </div>
      </div>

      <div className="wr-target-row">
        <div className="wr-target" aria-label={`Catch ${targetWord}`}>
          Catch: <strong className="wr-target-word">{targetWord}</strong>
          {line && (
            <span className="wr-cheer" key={catches} role="status">
              {line}
              <Burst trigger={catches} count={8} />
            </span>
          )}
        </div>
        <button className="wr-hear" onClick={() => speak(targetWord)} aria-label="Hear it again">🔊</button>
      </div>
      <p className="wr-instructions">Tap it as it falls — watch out for look-alikes!</p>

      <div className="wr-area">
        {world.current.map((f) => (
          <button
            key={f.id}
            // Every word looks the same: colouring the target green and the rest
            // red turned a reading game into "tap the green one".
            className={`wr-word ${f.state} ${shakeId === f.id ? 'shake' : ''}`}
            style={{ left: `${f.x}%`, top: `${f.y}%` }}
            onClick={() => handleWordClick(f)}
            disabled={f.state !== 'falling'}
          >
            {f.word}
          </button>
        ))}
        <div className="wr-ground" />
      </div>

      <div className="wr-controls">
        <button className="wr-skip" onClick={newTarget}>Skip word ⏭</button>
        {combo > 2 && (
          <div className="wr-combo">
            🔥 {combo} in a row! <span className="wr-combo-bonus">+{Math.min(combo, MAX_COMBO_BONUS) * 2} bonus</span>
          </div>
        )}
      </div>

      <div className="wr-progress" aria-label="Time remaining">
        <div className="wr-progress-fill" style={{ width: `${(timeLeft / (duration * 10)) * 100}%` }} />
      </div>
    </div>
  )
}

export default WordRace
