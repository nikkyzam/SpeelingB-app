import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { Word } from '../../../services/wordBank'
import { useAudio } from '../../../contexts/AudioContext'
import { shuffle, isPlayable } from '../shared/wordTricks'
import sfx from '../shared/sfx'
import './WordSnake.css'

interface WordSnakeProps {
  onComplete: (score: number) => void
  words?: Word[]
  rounds?: number
  seconds?: number
}

type Dir = 'up' | 'down' | 'left' | 'right'
interface Cell { x: number; y: number }
interface Letter extends Cell { ch: string; id: number }

const SIZE = 11 // board is SIZE x SIZE cells
const SPEED_MS = 360 // slow enough for small hands to steer
const DECOYS = 3

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'
const same = (a: Cell, b: Cell) => a.x === b.x && a.y === b.y

const STEP: Record<Dir, Cell> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
}
const OPPOSITE: Record<Dir, Dir> = { up: 'down', down: 'up', left: 'right', right: 'left' }

/**
 * Slither around eating the letters of your word — in order!
 *
 * Deliberately forgiving: walls wrap instead of ending the run, the snake never
 * bites itself, and a wrong letter costs a segment rather than the whole game.
 * The fun is steering, not dying.
 */
const WordSnake: React.FC<WordSnakeProps> = ({ onComplete, words: providedWords, rounds = 3, seconds = 90 }) => {
  const { speak } = useAudio()

  const words = useMemo<Word[]>(() => {
    const pool = providedWords && providedWords.length > 0 ? providedWords : []
    const usable = shuffle(pool).filter((w) => isPlayable(w) && w.word.length <= 7)
    // Only their own words: a short game beats a game full of strangers.
    return usable.slice(0, rounds)
  }, [providedWords, rounds])

  const [snake, setSnake] = useState<Cell[]>([
    { x: 5, y: 5 },
    { x: 4, y: 5 },
    { x: 3, y: 5 },
  ])
  const [letters, setLetters] = useState<Letter[]>([])
  const [wordIndex, setWordIndex] = useState(0)
  const [progress, setProgress] = useState(0) // letters of this word eaten so far
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(seconds)
  const [flash, setFlash] = useState<'good' | 'bad' | null>(null)
  const [done, setDone] = useState(false)

  const dirRef = useRef<Dir>('right')
  const queuedDir = useRef<Dir | null>(null)
  const idRef = useRef(0)
  const touchStart = useRef<{ x: number; y: number } | null>(null)

  const current = words[wordIndex]
  const target = (current?.word || '').toLowerCase()
  const needed = target[progress]

  /** Scatter the letter we need plus a few decoys onto free squares. */
  const scatter = useCallback((want: string, body: Cell[]) => {
    const taken = new Set(body.map((c) => `${c.x},${c.y}`))
    const free: Cell[] = []
    for (let y = 0; y < SIZE; y++) {
      for (let x = 0; x < SIZE; x++) {
        if (!taken.has(`${x},${y}`)) free.push({ x, y })
      }
    }
    const spots = shuffle(free).slice(0, DECOYS + 1)
    const decoyChars = shuffle(ALPHABET.split('').filter((c) => c !== want)).slice(0, DECOYS)
    const chars = shuffle([want, ...decoyChars])
    return spots.map((s, i) => ({ ...s, ch: chars[i], id: idRef.current++ }))
  }, [])

  // New word (or new letter) → fresh letters on the board.
  useEffect(() => {
    if (!current || done) return
    setLetters(scatter(target[progress], snake))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wordIndex, progress, done])

  // Say each new word once so the child hears what they're spelling.
  useEffect(() => {
    if (current) speak(current.word)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wordIndex])

  const finish = useCallback(
    (total: number) => {
      if (done) return
      setDone(true)
      sfx.win()
      setTimeout(() => onComplete(total), 900)
    },
    [done, onComplete]
  )

  // Countdown. The score is read through a ref so scoring a point can't restart
  // the one-second timer — otherwise a fast eater would freeze the clock.
  const scoreRef = useRef(score)
  scoreRef.current = score

  useEffect(() => {
    if (done || !current) return
    if (timeLeft <= 0) {
      finish(scoreRef.current)
      return
    }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [timeLeft, done, current, finish])

  // The timer reads the live snake through a ref, so every move is decided
  // outside setState — no double-scoring when React replays an updater.
  const snakeRef = useRef(snake)
  snakeRef.current = snake

  /** One move of the snake. Kept in a ref so the timer never goes stale. */
  const step = () => {
    if (done || !current) return
    const dir = queuedDir.current || dirRef.current
    dirRef.current = dir
    queuedDir.current = null

    const body = snakeRef.current
    const delta = STEP[dir]
    // Walls wrap: bumping the edge is a wiggle, not a game over.
    const head = {
      x: (body[0].x + delta.x + SIZE) % SIZE,
      y: (body[0].y + delta.y + SIZE) % SIZE,
    }
    const eaten = letters.find((l) => same(l, head))

    if (!eaten) {
      setSnake([head, ...body.slice(0, -1)])
      return
    }

    if (eaten.ch === needed) {
      sfx.pop()
      setSnake([head, ...body]) // grow
      setFlash('good')
      setTimeout(() => setFlash(null), 320)

      const nextProgress = progress + 1
      if (nextProgress < target.length) {
        setScore((s) => s + 15)
        setProgress(nextProgress)
        return
      }

      // Whole word eaten!
      sfx.correct()
      speak(`${current.word}! Yum!`)
      if (wordIndex < words.length - 1) {
        setScore((s) => s + 55)
        setWordIndex((i) => i + 1)
        setProgress(0)
      } else {
        // Leftover seconds become points — hustle is rewarded, slowness isn't punished.
        const total = score + 55 + timeLeft * 2
        setScore(total)
        finish(total)
      }
      return
    }

    // Wrong letter: lose a segment (never below three) and try again.
    sfx.wrong()
    setFlash('bad')
    setTimeout(() => setFlash(null), 320)
    const shrunk = body.length > 3 ? body.slice(0, -1) : body
    const next = [head, ...shrunk.slice(0, -1)]
    setSnake(next)
    // Re-scatter rather than just removing the one eaten: the board never
    // empties out, and the letter they need never ends up marooned in a corner.
    setLetters(scatter(needed, next))
  }

  const stepRef = useRef(step)
  stepRef.current = step

  useEffect(() => {
    if (done) return
    const id = setInterval(() => stepRef.current(), SPEED_MS)
    return () => clearInterval(id)
  }, [done])

  const turn = (d: Dir) => {
    // No instant reversals — that would fold the snake onto itself.
    if (d === OPPOSITE[dirRef.current]) return
    queuedDir.current = d
    sfx.tap()
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const map: Record<string, Dir> = {
        ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right',
        w: 'up', s: 'down', a: 'left', d: 'right',
      }
      const d = map[e.key]
      if (d) {
        e.preventDefault()
        turn(d)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchStart.current
    if (!start) return
    const dx = e.changedTouches[0].clientX - start.x
    const dy = e.changedTouches[0].clientY - start.y
    if (Math.abs(dx) < 24 && Math.abs(dy) < 24) return
    turn(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : dy > 0 ? 'down' : 'up')
    touchStart.current = null
  }

  if (!current) {
    return (
      <div className="word-snake">
        <p className="ws-empty">No words for the snake yet — learn a few first! 🐍</p>
        <button className="ws-btn" onClick={() => onComplete(0)}>Back to Games</button>
      </div>
    )
  }

  const cells = Array.from({ length: SIZE * SIZE }, (_, i) => ({ x: i % SIZE, y: Math.floor(i / SIZE) }))

  return (
    <div className={`word-snake ${flash ? `flash-${flash}` : ''}`}>
      <div className="ws-header">
        <div className="ws-title">🐍 Word Snake</div>
        <div className="ws-stats">
          <div className="ws-stat"><span>Word</span><strong>{wordIndex + 1}/{words.length}</strong></div>
          <div className="ws-stat"><span>Score</span><strong>{score}</strong></div>
          <div className="ws-stat"><span>Time</span><strong>⏱ {timeLeft}s</strong></div>
        </div>
      </div>

      <div className="ws-word">
        {target.split('').map((c, i) => (
          <span key={i} className={`ws-slot ${i < progress ? 'eaten' : i === progress ? 'next' : ''}`}>
            {i < progress ? c : i === progress ? c : '•'}
          </span>
        ))}
      </div>
      <p className="ws-hint">Eat the <strong>{needed?.toUpperCase()}</strong> next!</p>

      <div className="ws-board" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        {cells.map((c) => {
          const bodyIndex = snake.findIndex((s) => same(s, c))
          const letter = letters.find((l) => same(l, c))
          const isHead = bodyIndex === 0
          return (
            <div key={`${c.x}-${c.y}`} className="ws-cell">
              {bodyIndex >= 0 && (
                <span className={`ws-snake ${isHead ? 'head' : ''}`} aria-hidden>
                  {isHead ? '🐍' : ''}
                </span>
              )}
              {letter && bodyIndex < 0 && <span className="ws-letter">{letter.ch.toUpperCase()}</span>}
            </div>
          )
        })}
      </div>

      <div className="ws-pad" aria-label="Steer the snake">
        <button className="ws-dpad up" onClick={() => turn('up')} aria-label="Up">▲</button>
        <div className="ws-pad-mid">
          <button className="ws-dpad" onClick={() => turn('left')} aria-label="Left">◀</button>
          <button className="ws-dpad" onClick={() => turn('right')} aria-label="Right">▶</button>
        </div>
        <button className="ws-dpad down" onClick={() => turn('down')} aria-label="Down">▼</button>
      </div>
      <p className="ws-tip">Swipe the board, tap the arrows, or use your arrow keys!</p>
    </div>
  )
}

export default WordSnake
