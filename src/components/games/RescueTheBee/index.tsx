import React, { useMemo, useState, useEffect, useRef } from 'react'
import type { Word } from '../../../services/wordBank'
import { useAudio } from '../../../contexts/AudioContext'
import { shuffle, isPlayable } from '../shared/wordTricks'
import { maskClue } from '../shared/clues'
import { useCheer } from '../shared/useCheer'
import { useLater } from '../shared/useLater'
import { spellOut } from '../../../services/words/praise'
import sfx from '../shared/sfx'
import Burst from '../shared/Burst'
import GameEmpty from '../shared/GameEmpty'
import './RescueTheBee.css'

interface RescueTheBeeProps {
  onComplete: (score: number) => void
  words?: Word[]
  rounds?: number
}

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.split('')
const MIN_LIVES = 6
const WIN_MS = 1700
const LOST_MS = 2400

/**
 * Hearts for a word. A long word with many different letters needs more
 * guesses just to find its letters, so six alone was harsh: "elephant" has
 * seven different ones.
 */
export const livesFor = (word: string): number => Math.max(MIN_LIVES, new Set(word.toLowerCase()).size)

/** Points for a word: every letter found counts, a rescue earns a bonus on top. */
export const pointsFor = (revealedLetters: number, won: boolean, livesLeft: number): number =>
  revealedLetters * 3 + (won ? 10 + livesLeft * 2 : 0)

/** Guess letters to spell the word and rescue the bee from the jar before the hearts run out. */
const RescueTheBee: React.FC<RescueTheBeeProps> = ({ onComplete, words: providedWords, rounds = 5 }) => {
  const { speak } = useAudio()
  const cheer = useCheer()
  const later = useLater()

  const roundWords = useMemo<Word[]>(() => {
    const pool = providedWords && providedWords.length > 0 ? providedWords : []
    return shuffle(pool).filter((w) => isPlayable(w, 3)).slice(0, rounds)
  }, [providedWords, rounds])

  const [index, setIndex] = useState(0)
  const [guessed, setGuessed] = useState<Set<string>>(new Set())
  const [lives, setLives] = useState(() => (roundWords[0] ? livesFor(roundWords[0].word) : MIN_LIVES))
  const [score, setScore] = useState(0)
  const [solved, setSolved] = useState(0)
  const [status, setStatus] = useState<'playing' | 'won' | 'lost'>('playing')
  const [wobble, setWobble] = useState(0)
  const [line, setLine] = useState('')
  const settled = useRef(false)

  const current = roundWords[index]
  const word = (current?.word || '').toLowerCase()
  const maxLives = useMemo(() => livesFor(word), [word])
  const letters = useMemo(() => Array.from(new Set(word.split(''))), [word])
  const clue = useMemo(
    () => (current ? maskClue((current.meaning || '').split(/[.;]/)[0].trim(), word) : ''),
    [current, word]
  )

  /**
   * Reset for a word in the same step that moves to it. Reset in an effect
   * afterwards, the next word's first frame was still "lost" — every letter
   * of the NEW word on show.
   */
  const goTo = (i: number) => {
    const w = roundWords[i]
    if (!w) return
    setGuessed(new Set())
    setLives(livesFor(w.word))
    setStatus('playing')
    setLine('')
    settled.current = false
    setIndex(i)
  }

  useEffect(() => {
    if (current) speak(current.word, { queue: index > 0 })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, roundWords])

  if (!current) {
    return (
      <div className="rescue-bee">
        <GameEmpty icon="🐝">No words yet — learn a few, then come back and rescue the bee!</GameEmpty>
      </div>
    )
  }

  const moveOn = (gained: number, ms: number) => {
    later(() => {
      if (index < roundWords.length - 1) goTo(index + 1)
      else onComplete(score + gained)
    }, ms)
  }

  const guess = (ch: string) => {
    if (settled.current || status !== 'playing' || guessed.has(ch)) return
    const nextGuessed = new Set(guessed)
    nextGuessed.add(ch)
    setGuessed(nextGuessed)

    if (word.includes(ch)) {
      if (!letters.every((l) => nextGuessed.has(l))) {
        sfx.pop()
        return
      }
      settled.current = true
      const gained = pointsFor(word.length, true, lives)
      setScore((s) => s + gained)
      setSolved((s) => s + 1)
      setStatus('won')
      setLine(cheer.hit({ say: `You rescued the bee! ${current.word}.` }))
      moveOn(gained, WIN_MS)
      return
    }

    sfx.wrong()
    setWobble((n) => n + 1)
    const nextLives = lives - 1
    setLives(nextLives)
    if (nextLives > 0) return

    // Out of hearts: the letters already found still count, and the bee gets
    // out anyway — nobody is left in a jar.
    settled.current = true
    const found = word.split('').filter((c) => nextGuessed.has(c)).length
    const gained = pointsFor(found, false, 0)
    setScore((s) => s + gained)
    setStatus('lost')
    setLine(cheer.miss({ say: `It was ${current.word}: ${spellOut(word)}.` }))
    moveOn(gained, LOST_MS)
  }

  // 0 (whole) to 3 (badly cracked): the jar shows how many hearts are gone.
  const lost = maxLives - lives
  const cracks = status === 'playing' ? Math.min(3, Math.ceil((lost / maxLives) * 3)) : 0

  return (
    <div className="rescue-bee">
      <div className="rb-header">
        <div className="rb-title">🐝 Rescue the Bee</div>
        <div className="rb-stats">
          <div className="rb-stat"><span>Word</span><strong>{index + 1}/{roundWords.length}</strong></div>
          <div className="rb-stat"><span>Score</span><strong>{score}</strong></div>
          <div className="rb-stat"><span>Saved</span><strong>⭐ {solved}</strong></div>
        </div>
      </div>

      <div className="rb-stage">
        <div
          key={wobble}
          className={`rb-jar ${wobble ? 'wobble' : ''} ${status !== 'playing' ? 'open' : ''}`}
          data-cracks={cracks}
          role="img"
          aria-label={status === 'playing' ? 'A bee trapped in a jar' : 'The bee flies free'}
        >
          <span className="rb-lid" aria-hidden />
          <span className="rb-glass" aria-hidden>
            <span className="rb-crack c1" />
            <span className="rb-crack c2" />
            <span className="rb-crack c3" />
          </span>
          <span className={`rb-bee ${status !== 'playing' ? 'free' : ''}`} aria-hidden>🐝</span>
        </div>
        <div className="rb-lives" aria-label={`${lives} lives left`}>
          {Array.from({ length: maxLives }).map((_, i) => (
            <span key={i} className={`rb-heart ${i < lives ? '' : 'lost'}`}>{i < lives ? '💛' : '🤍'}</span>
          ))}
        </div>
      </div>

      <div className="rb-clue">
        <button className="rb-hear" onClick={() => speak(current.word)}>🔊 Hear it again</button>
        {clue && <p className="rb-meaning">Clue: {clue}</p>}
      </div>

      <div className="rb-word" aria-label="The word">
        {word.split('').map((ch, i) => {
          const found = guessed.has(ch)
          const cls = found ? 'shown' : status === 'lost' ? 'shown given' : ''
          return (
            <span key={i} className={`rb-slot ${cls}`}>
              {found || status !== 'playing' ? ch.toUpperCase() : ''}
            </span>
          )
        })}
      </div>

      <div className="rb-keys">
        {ALPHABET.map((ch) => {
          const used = guessed.has(ch)
          const hit = used && word.includes(ch)
          return (
            <button
              key={ch}
              className={`rb-key ${used ? (hit ? 'hit' : 'miss') : ''}`}
              onClick={() => guess(ch)}
              disabled={used || status !== 'playing'}
              aria-label={ch}
            >
              {ch.toUpperCase()}
            </button>
          )
        })}
      </div>

      {status === 'won' && (
        <div className="rb-flash ok" role="status">
          {line} The bee is free! 🎉
          <Burst trigger={solved} emoji={['🐝', '⭐', '✨', '🌼']} />
        </div>
      )}
      {status === 'lost' && (
        <div className="rb-flash bad" role="status">
          The bee wriggled out anyway! It was “{word}” — you’ll get the next one! 💪
        </div>
      )}
    </div>
  )
}

export default RescueTheBee
