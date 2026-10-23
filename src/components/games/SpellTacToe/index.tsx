import { activityClock } from '../../../services/games/activityClock'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import type { Word } from '../../../services/wordBank'
import { useAudio } from '../../../contexts/AudioContext'
import { useTheme } from '../../../contexts/ThemeContext'
import ReviewSchedule from '../../../services/progress/ReviewSchedule'
import SpellingInput from '../../common/SpellingInput'
import { shuffle, isPlayable } from '../shared/wordTricks'
import sfx from '../shared/sfx'
import useCheer from '../shared/useCheer'
import Burst from '../shared/Burst'
import { spellOut } from '../../../services/words/praise'
import './SpellTacToe.css'

interface SpellTacToeProps {
  onComplete: (score: number) => void
  words?: Word[]
}

export type Mark = 'you' | 'bot' | null

export const LINES: readonly (readonly [number, number, number])[] = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
]

/** Three in a row, and which row it is — or null. */
export const threeInARow = (cells: Mark[]): { who: 'you' | 'bot'; line: readonly number[] } | null => {
  for (const line of LINES) {
    const who = cells[line[0]]
    if (who && who === cells[line[1]] && who === cells[line[2]]) return { who, line }
  }
  return null
}

/** The empty square that would finish a row for `who`, or -1. */
const finisher = (cells: Mark[], who: 'you' | 'bot'): number => {
  for (const line of LINES) {
    const marks = line.map((i) => cells[i])
    if (marks.filter((m) => m === who).length === 2 && marks.includes(null)) return line[marks.indexOf(null)]
  }
  return -1
}

/**
 * Where the mascot plays. A friendly opponent rather than a perfect one: it
 * nearly always takes a win it can see, blocks the child's row a little over
 * half the time, and otherwise plays anywhere. A child who spells their words
 * will usually win or draw; missing a few gives it a real chance.
 */
export const botMove = (cells: Mark[], rand: () => number = Math.random): number => {
  const empty = cells.flatMap((m, i) => (m ? [] : [i]))
  if (empty.length === 0) return -1
  const win = finisher(cells, 'bot')
  if (win >= 0 && rand() < 0.9) return win
  const block = finisher(cells, 'you')
  if (block >= 0 && rand() < 0.6) return block
  if (cells[4] === null && rand() < 0.5) return 4
  return empty[Math.floor(rand() * empty.length)]
}

type Phase = 'pick' | 'spell' | 'right' | 'wrong' | 'bot' | 'over'
type Result = 'won' | 'lost' | 'draw'

const WIN_BONUS = 100
const DRAW_BONUS = 40
/** Longer words are harder to spell, so they claim a square for more. */
const pointsFor = (word: string) => 20 + 2 * word.length

/**
 * Spell-Tac-Toe — noughts and crosses where every move costs a word.
 *
 * Tap a square and a word is read out; spell it and the square is yours.
 * Miss it and the square stays empty while the world's mascot takes its turn.
 * A game with an opponent gives the spelling stakes that a list of words
 * can't — which square to fight for is up to the child, but getting it means
 * spelling from the sound alone, exactly as at a bee.
 */
const SpellTacToe: React.FC<SpellTacToeProps> = ({ onComplete, words: providedWords }) => {
  const { speak } = useAudio()
  const { world } = useTheme()
  const bot = world.mascot
  const cheer = useCheer()
  const [cheerLine, setCheerLine] = useState('')

  const words = useMemo<Word[]>(
    () => shuffle(providedWords && providedWords.length > 0 ? providedWords : []).filter((w) => isPlayable(w, 3)),
    [providedWords]
  )

  const [cells, setCells] = useState<Mark[]>(() => Array<Mark>(9).fill(null))
  const [turn, setTurn] = useState(0)
  const [phase, setPhase] = useState<Phase>('pick')
  const [picked, setPicked] = useState<number | null>(null)
  const [input, setInput] = useState('')
  const [showMeaning, setShowMeaning] = useState(false)
  const [score, setScore] = useState(0)
  const [spelled, setSpelled] = useState(0)
  const [result, setResult] = useState<Result | null>(null)
  const [line, setLine] = useState<readonly number[] | null>(null)

  // The score state lags a render behind; the payout reads this instead.
  const scoreRef = useRef(0)
  // A ref, not state: two taps on "Claim" in one frame would both pass a state guard.
  const locked = useRef(false)
  const timers = useRef<number[]>([])
  const later = (fn: () => void, ms: number) => {
    timers.current.push(activityClock.setTimeout(fn, ms))
  }
  useEffect(() => () => timers.current.forEach((t) => activityClock.clearTimeout(t)), [])

  // One word per turn, going round the child's list again if the match runs long.
  const current = words.length > 0 ? words[turn % words.length] : undefined

  if (!current) {
    return (
      <div className="spell-tac-toe">
        {/* No button: onComplete() is a finished game to the hub, and it pays
            a star for one. "Back to Games" in the header is the way out. */}
        <p className="stt-empty">
          No words to play with yet — learn a few, then come back and challenge {bot} to a match! ⭕
        </p>
      </div>
    )
  }

  const addScore = (points: number) => {
    scoreRef.current += points
    setScore(scoreRef.current)
  }

  const endGame = (how: Result, row: readonly number[] | null) => {
    setResult(how)
    setLine(row)
    setPhase('over')
    if (how === 'won') {
      addScore(WIN_BONUS)
      sfx.win()
      speak('Three in a row. You win!')
    } else if (how === 'draw') {
      addScore(DRAW_BONUS)
      speak("It's a draw. Well played!")
    } else {
      speak('So close! Every word you spelled still counts.')
    }
    later(() => onComplete(scoreRef.current), 2600)
  }

  const botTurn = (board: Mark[]) => {
    setPhase('bot')
    later(() => {
      const move = botMove(board)
      if (move < 0) {
        endGame('draw', null)
        return
      }
      const next = [...board]
      next[move] = 'bot'
      setCells(next)
      sfx.pop()
      const row = threeInARow(next)
      if (row) {
        endGame('lost', row.line)
        return
      }
      if (next.every(Boolean)) {
        endGame('draw', null)
        return
      }
      locked.current = false
      setTurn((t) => t + 1)
      setPicked(null)
      setInput('')
      setShowMeaning(false)
      setPhase('pick')
    }, 900)
  }

  /** Choosing a square reads the word; choosing another just moves the target. */
  const pick = (i: number) => {
    if (cells[i] || (phase !== 'pick' && phase !== 'spell')) return
    sfx.tap()
    setPicked(i)
    if (phase === 'pick') {
      setPhase('spell')
      speak(current.word)
    }
  }

  const claim = () => {
    if (phase !== 'spell' || picked === null || !input.trim() || locked.current) return
    locked.current = true
    const right = input.trim().toLowerCase() === current.word.toLowerCase()
    // Typed from the sound alone — a real recall, so the review schedule hears about it.
    ReviewSchedule.record(current.id, right)

    if (!right) {
      setPhase('wrong')
      cheer.miss({ say: `It was ${current.word}. ${spellOut(current.word)}` })
      later(() => botTurn(cells), 2400)
      return
    }

    const next = [...cells]
    next[picked] = 'you'
    setCells(next)
    setSpelled((n) => n + 1)
    addScore(pointsFor(current.word))
    setPhase('right')
    setCheerLine(cheer.hit())
    const row = threeInARow(next)
    if (row) {
      endGame('won', row.line)
      return
    }
    if (next.every(Boolean)) {
      endGame('draw', null)
      return
    }
    later(() => botTurn(next), 1100)
  }

  const prompt =
    phase === 'pick'
      ? 'Your turn! Tap an empty square to hear your word.'
      : phase === 'spell'
      ? 'Spell it to put your ⭐ there — or tap a different square.'
      : phase === 'bot'
      ? `${bot} is thinking…`
      : ''

  return (
    <div className="spell-tac-toe">
      <div className="stt-header">
        <div className="stt-title">⭕ Spell-Tac-Toe</div>
        <div className="stt-stats">
          <div className="stt-stat"><span>You</span><strong>⭐</strong></div>
          <div className="stt-stat"><span>vs</span><strong>{bot}</strong></div>
          <div className="stt-stat"><span>Spelled</span><strong>{spelled}</strong></div>
          <div className="stt-stat"><span>Score</span><strong>{score}</strong></div>
        </div>
      </div>

      <p className="stt-prompt" aria-live="polite">{prompt}</p>

      <div className={`stt-board ${phase === 'bot' ? 'waiting' : ''}`} role="group" aria-label="The board">
        {cells.map((mark, i) => (
          <button
            key={i}
            className={`stt-square ${mark ?? ''} ${picked === i && !mark ? 'picked' : ''} ${line?.includes(i) ? 'line' : ''}`}
            onClick={() => pick(i)}
            disabled={!!mark || (phase !== 'pick' && phase !== 'spell')}
            aria-label={`Square ${i + 1}: ${mark === 'you' ? 'your star' : mark === 'bot' ? `taken by ${bot}` : 'empty'}`}
          >
            {mark === 'you' ? '⭐' : mark === 'bot' ? bot : picked === i && phase !== 'pick' ? '❔' : ''}
          </button>
        ))}
      </div>

      {(phase === 'spell' || phase === 'right' || phase === 'wrong') && (
        <div className="stt-spell">
          <div className="stt-asks">
            <button className="stt-btn ghost" onClick={() => speak(current.word)}>🔊 Hear it again</button>
            <button
              className="stt-btn ghost"
              onClick={() => {
                setShowMeaning(true)
                if (current.meaning) speak(current.meaning)
              }}
            >
              💡 What does it mean?
            </button>
          </div>
          {showMeaning && current.meaning && <p className="stt-meaning">{current.meaning}</p>}

          <div className="stt-entry">
            <SpellingInput
              className={`stt-input ${phase === 'right' ? 'ok' : phase === 'wrong' ? 'bad' : ''}`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && claim()}
              placeholder="Spell it to claim the square"
              aria-label="Spell the word"
              disabled={phase !== 'spell'}
              autoFocus
            />
            <button className="stt-btn" onClick={claim} disabled={phase !== 'spell' || !input.trim()}>
              ⭐ Claim it
            </button>
          </div>

          {phase === 'right' && (
            <div className="stt-flash ok">
              <Burst trigger={spelled} />
              🎉 {cheerLine} That square is yours!
            </div>
          )}
          {phase === 'wrong' && (
            <div className="stt-flash bad">It was “{current.word}” — {bot} takes a turn.</div>
          )}
        </div>
      )}

      {phase === 'over' && result && (
        <div className={`stt-flash big ${result}`}>
          {result === 'won'
            ? '🏆 Three in a row — you win!'
            : result === 'draw'
            ? '🤝 A draw — well played!'
            : `${bot} got three in a row this time — but you spelled ${spelled} word${spelled === 1 ? '' : 's'}! 💪`}
        </div>
      )}
    </div>
  )
}

export default SpellTacToe
