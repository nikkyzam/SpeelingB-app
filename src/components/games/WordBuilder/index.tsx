import React, { useState, useEffect, useMemo, useRef } from 'react'
import type { Word } from '../../../services/wordBank'
import { useAudio } from '../../../contexts/AudioContext'
import { shuffle, isPlayable } from '../shared/wordTricks'
import { maskClue } from '../shared/clues'
import { useCheer } from '../shared/useCheer'
import { useLater } from '../shared/useLater'
import { spellOut } from '../../../services/words/praise'
import Burst from '../shared/Burst'
import GameEmpty from '../shared/GameEmpty'
import './WordBuilder.css'

interface WordBuilderProps {
  onComplete: (score: number) => void
  words?: Word[]
  /** how many words to build in one round */
  rounds?: number
}

interface Tile {
  id: number
  letter: string
  used: boolean
}

/**
 * - `playing`: tapping tiles
 * - `correct`: built it, moving on
 * - `peek`: a wrong build — the right letters show for a moment, then the
 *   tiles come back for another go
 * - `revealed`: second miss or a skip — the word is shown and said, moving on
 */
type Status = 'playing' | 'correct' | 'peek' | 'revealed'

/** Wrong builds before the word is shown and the game moves on. */
const MISSES_ALLOWED = 2
const PEEK_MS = 1500
const HIT_MS = 1300
const REVEAL_MS = 2200

/** Full points for building the word: more for longer words. */
export const pointsFor = (word: string, misses: number): number => {
  const full = 20 + (word.length - 1) * 2
  // A second go comes straight after seeing the answer, so it earns half.
  return misses === 0 ? full : Math.round(full / 2)
}

const scramble = (word: string): Tile[] => {
  const letters = shuffle(word.split(''))
  // An already-in-order scramble is no puzzle. Rotated rather than reversed:
  // a palindrome ("ewe") reads the same backwards.
  if (word.length > 1 && letters.join('') === word) letters.push(letters.shift() as string)
  return letters.map((letter, i) => ({ id: i, letter, used: false }))
}

/** Tap the scrambled letter tiles in the right order to build the spoken word. */
const WordBuilder: React.FC<WordBuilderProps> = ({ onComplete, words: providedWords, rounds = 5 }) => {
  const { speak } = useAudio()
  const cheer = useCheer()
  const later = useLater()

  const roundWords = useMemo<Word[]>(() => {
    const pool = providedWords && providedWords.length > 0 ? providedWords : []
    return shuffle(pool).filter((w) => isPlayable(w, 3)).slice(0, rounds)
  }, [providedWords, rounds])

  const [index, setIndex] = useState(0)
  const [tiles, setTiles] = useState<Tile[]>(() => (roundWords[0] ? scramble(roundWords[0].word.toLowerCase()) : []))
  const [built, setBuiltState] = useState<Tile[]>([])
  // The letters placed so far, current the moment a tile is tapped: two tiles
  // tapped in the same frame both read the last render's `built`, so one was
  // lost while both stayed marked used — and the word couldn't be finished.
  const builtRef = useRef<Tile[]>([])
  const setBuilt = (next: Tile[]) => {
    builtRef.current = next
    setBuiltState(next)
  }
  const [score, setScore] = useState(0)
  const [status, setStatus] = useState<Status>('playing')
  const [misses, setMisses] = useState(0)
  const [solved, setSolved] = useState(0)
  const [line, setLine] = useState('')
  // Settles each build once: a timer or a fast double tap can't score twice.
  const settled = useRef(false)

  const current = roundWords[index]
  const target = (current?.word || '').toLowerCase()
  const clue = useMemo(
    () => (current ? maskClue((current.meaning || '').split(/[.;]/)[0].trim(), target) : ''),
    [current, target]
  )

  const freshTiles = (word = target) => {
    setTiles(scramble(word))
    setBuilt([])
    setStatus('playing')
    settled.current = false
  }

  /**
   * Lay out the next word in the same step that moves to it. Done in an effect
   * afterwards, the next word's first frame still had the "revealed" status
   * and showed its answer in the slots.
   */
  const goTo = (i: number) => {
    const w = roundWords[i]
    if (!w) return
    freshTiles(w.word.toLowerCase())
    setMisses(0)
    setLine('')
    setIndex(i)
  }

  useEffect(() => {
    if (current) speak(current.word, { queue: index > 0 })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, roundWords])

  if (!current) {
    return (
      <div className="word-builder">
        <GameEmpty icon="🧱">No words to build yet — learn a few, then come back and stack up their letters!</GameEmpty>
      </div>
    )
  }

  const moveOn = (gained: number, ms: number) => {
    later(() => {
      if (index < roundWords.length - 1) goTo(index + 1)
      else onComplete(score + gained)
    }, ms)
  }

  const reveal = () => {
    settled.current = true
    setStatus('revealed')
    setLine(cheer.miss({ say: `It was ${current.word}: ${spellOut(target)}.` }))
    moveOn(0, REVEAL_MS)
  }

  const handleTileTap = (tile: Tile) => {
    if (settled.current || status !== 'playing' || tile.used) return
    if (builtRef.current.some((t) => t.id === tile.id)) return
    const nextBuilt = [...builtRef.current, tile]
    setBuilt(nextBuilt)
    setTiles((prev) => prev.map((t) => (t.id === tile.id ? { ...t, used: true } : t)))
    if (nextBuilt.length < target.length) return

    settled.current = true
    const attempt = nextBuilt.map((t) => t.letter).join('')
    if (attempt === target) {
      const points = pointsFor(target, misses)
      setScore((s) => s + points)
      setSolved((s) => s + 1)
      setStatus('correct')
      setLine(cheer.hit({ say: current.word }))
      moveOn(points, HIT_MS)
      return
    }

    const used = misses + 1
    setMisses(used)
    if (used >= MISSES_ALLOWED) {
      reveal()
      return
    }
    // Show how it goes for a moment, then hand the tiles back.
    setStatus('peek')
    setLine(cheer.miss({ say: 'Have another go!' }))
    later(() => freshTiles(), PEEK_MS)
  }

  const undo = () => {
    if (settled.current || status !== 'playing' || builtRef.current.length === 0) return
    const last = builtRef.current[builtRef.current.length - 1]
    setBuilt(builtRef.current.slice(0, -1))
    setTiles((prev) => prev.map((t) => (t.id === last.id ? { ...t, used: false } : t)))
  }

  const skip = () => {
    if (settled.current || status !== 'playing') return
    reveal()
  }

  const slots = Array.from({ length: target.length })
  const showAnswer = status === 'peek' || status === 'revealed'

  return (
    <div className={`word-builder ${status}`}>
      <div className="wb-header">
        <div className="wb-title">🧱 Word Builder</div>
        <div className="wb-stats">
          <div className="wb-stat"><span>Word</span><strong>{index + 1}/{roundWords.length}</strong></div>
          <div className="wb-stat"><span>Score</span><strong>{score}</strong></div>
          <div className="wb-stat"><span>Solved</span><strong>⭐ {solved}</strong></div>
        </div>
      </div>

      <div className="wb-clue">
        <button className="wb-hear" onClick={() => speak(current.word)}>🔊 Hear it again</button>
        {clue && <p className="wb-meaning">Clue: {clue}</p>}
      </div>

      <div className={`wb-slots ${status === 'peek' ? 'wb-shake' : ''}`} aria-label="word being built">
        {slots.map((_, i) => {
          const letter = showAnswer ? target[i] : built[i]?.letter
          const stateClass =
            status === 'correct' ? 'filled ok' : showAnswer ? 'filled show' : letter ? 'filled' : ''
          return (
            <div key={i} className={`wb-slot ${stateClass}`}>
              {letter ? letter.toUpperCase() : ''}
            </div>
          )
        })}
      </div>

      <div className="wb-tiles">
        {tiles.map((tile) => (
          <button
            key={tile.id}
            className={`wb-tile ${tile.used ? 'used' : ''}`}
            onClick={() => handleTileTap(tile)}
            disabled={tile.used || status !== 'playing'}
            aria-label={tile.letter}
          >
            {tile.letter.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="wb-controls">
        <button className="wb-btn secondary" onClick={undo} disabled={built.length === 0 || status !== 'playing'}>
          ⬅ Undo
        </button>
      </div>

      {status === 'correct' && (
        <div className="wb-flash ok" role="status">
          {line} 🎉
          <Burst trigger={solved} />
        </div>
      )}
      {status === 'peek' && (
        <div className="wb-flash bad" role="status">{line} Here’s how it goes — have another go! 💪</div>
      )}
      {status === 'revealed' && (
        <div className="wb-flash bad" role="status">It was “{current.word}” — you’ll get the next one! 💪</div>
      )}

      {/* Far from Undo, so a child fixing a letter never skips by accident. */}
      <div className="wb-skip-row">
        <button className="wb-skip" onClick={skip} disabled={status !== 'playing'}>
          Skip this word ⏭
        </button>
      </div>
    </div>
  )
}

export default WordBuilder
