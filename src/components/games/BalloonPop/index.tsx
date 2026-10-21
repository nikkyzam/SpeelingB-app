import React, { useEffect, useMemo, useRef, useState } from 'react'
import type { Word } from '../../../services/wordBank'
import { useAudio } from '../../../contexts/AudioContext'
import { shuffle, isPlayable, letterTraps } from '../shared/wordTricks'
import { maskClue } from '../shared/clues'
import sfx from '../shared/sfx'
import useCheer from '../shared/useCheer'
import useLater from '../shared/useLater'
import Burst from '../shared/Burst'
import GameEmpty from '../shared/GameEmpty'
import './BalloonPop.css'

interface BalloonPopProps {
  onComplete: (score: number) => void
  words?: Word[]
  rounds?: number
}

export interface Balloon {
  id: string
  letter: string
  right: boolean
  colour: number
}

/** Balloons up for each letter: the right one and three look-alike traps. */
const PER_WAVE = 4
const COLOURS = 5
/** Wrong balloons on one letter before the right one starts to glow. */
const GLOW_AFTER = 2

/**
 * The balloons for letter `i` of `word`: the right letter plus the slips a
 * speller really makes there ("balon" for "balloon", c for k), shuffled. The
 * whole word is never on screen, so the order can't simply be read off it.
 */
export const makeWave = (word: string, i: number): Balloon[] => {
  const w = word.toLowerCase()
  const right = w[i]
  return shuffle([right, ...letterTraps(w, i, PER_WAVE - 1)]).map((letter, k) => ({
    id: `${i}-${k}-${letter}`,
    letter,
    right: letter === right,
    colour: (i + k) % COLOURS,
  }))
}

/**
 * Balloon Pop — hear a word, then pop its letters in order.
 *
 * Each letter gets a fresh bunch of balloons: the right one and three traps.
 * A wrong balloon wobbles and stays (it used to vanish, and if its letter was
 * still needed the word could never be finished). After two wrong pops on one
 * letter the right balloon glows softly, so nobody is ever stuck.
 */
const BalloonPop: React.FC<BalloonPopProps> = ({ onComplete, words: providedWords, rounds = 6 }) => {
  const { speak } = useAudio()
  const cheer = useCheer()
  const later = useLater()

  const words = useMemo<Word[]>(
    () => shuffle(providedWords ?? []).filter((w) => isPlayable(w, 3)).slice(0, rounds),
    [providedWords, rounds]
  )

  const [index, setIndex] = useState(0)
  const [pos, setPos] = useState(0)
  const [wave, setWave] = useState<Balloon[]>(() => (words[0] ? makeWave(words[0].word, 0) : []))
  const [popping, setPopping] = useState<string | null>(null)
  const [tried, setTried] = useState<string[]>([])
  const [wobble, setWobble] = useState<string | null>(null)
  const [letterMisses, setLetterMisses] = useState(0)
  const [wordMisses, setWordMisses] = useState(0)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [done, setDone] = useState(false)
  const [line, setLine] = useState('')
  const [hits, setHits] = useState(0)
  // A ref settles a tap at once; a state guard loses to a fast double tap.
  const locked = useRef(false)

  const current = words[index]

  useEffect(() => {
    if (current) speak(current.word)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, words])

  if (!current) {
    return (
      <div className="balloon-pop">
        <GameEmpty icon="🎈">No words to pop yet — learn a few, then come back and pop some balloons!</GameEmpty>
      </div>
    )
  }

  const answer = current.word.toLowerCase()

  /** The next word, laid out in the same step so its first frame is right. */
  const startWord = (i: number) => {
    setIndex(i)
    setPos(0)
    setWave(makeWave(words[i].word, 0))
    setPopping(null)
    setTried([])
    setWobble(null)
    setLetterMisses(0)
    setWordMisses(0)
    setDone(false)
    locked.current = false
  }

  const tap = (b: Balloon) => {
    if (locked.current || done) return

    if (b.right) {
      locked.current = true
      sfx.pop()
      setPopping(b.id)
      const next = pos + 1
      setPos(next)
      // A letter found first time is worth more, but every letter counts.
      const points = letterMisses === 0 ? 5 : 2

      if (next < answer.length) {
        setScore((s) => s + points)
        later(() => {
          setWave(makeWave(answer, next))
          setPopping(null)
          setTried([])
          setLetterMisses(0)
          locked.current = false
        }, 280)
        return
      }

      const gained = points + (wordMisses === 0 ? 15 : 5)
      setScore((s) => s + gained)
      setDone(true)
      setLine(cheer.hit({ say: current.word }))
      setStreak(cheer.streak())
      setHits((h) => h + 1)
      later(() => {
        if (index < words.length - 1) startWord(index + 1)
        else onComplete(score + gained)
      }, 1500)
      return
    }

    // A wrong balloon wobbles and stays: its letter may still be needed later.
    cheer.miss({ quiet: true })
    setStreak(0)
    setWobble(b.id)
    later(() => setWobble((w) => (w === b.id ? null : w)), 450)
    setTried((t) => (t.includes(b.id) ? t : [...t, b.id]))
    setLetterMisses((m) => m + 1)
    setWordMisses((m) => m + 1)
  }

  const clue = current.meaning ? maskClue(current.meaning, current.word) : ''

  return (
    <div className="balloon-pop">
      <div className="bp-header">
        <div className="bp-title">🎈 Balloon Pop</div>
        <div className="bp-stats">
          <div className="bp-stat"><span>Word</span><strong>{index + 1}/{words.length}</strong></div>
          <div className="bp-stat"><span>Score</span><strong>{score}</strong></div>
          <div className="bp-stat"><span>Streak</span><strong>🔥 {streak}</strong></div>
        </div>
      </div>

      <p className="bp-help">Pop the letters of the word you hear, in order!</p>
      <button className="bp-btn hear" onClick={() => speak(current.word)} aria-label="Hear the word again">
        🔊 Hear it again
      </button>
      {clue && <p className="bp-clue">{clue}</p>}

      <div className={`bp-word ${done ? 'done' : ''}`} aria-label="The word so far">
        <Burst trigger={hits} />
        {[...answer].map((ch, i) => (
          <span key={i} className={`bp-slot ${i < pos ? 'filled' : ''} ${!done && i === pos ? 'next' : ''}`}>
            {i < pos ? ch : ''}
          </span>
        ))}
      </div>

      <div className="bp-sky" role="group" aria-label="Balloons">
        {wave.map((b, k) => {
          const glow = !done && b.right && letterMisses >= GLOW_AFTER
          return (
            <button
              key={b.id}
              className={[
                'bp-balloon',
                `c${b.colour}`,
                popping === b.id ? 'popping' : '',
                wobble === b.id ? 'wobble' : '',
                tried.includes(b.id) ? 'tried' : '',
                glow ? 'glow' : '',
              ].join(' ')}
              style={{ animationDelay: `${k * 0.35}s` }}
              onClick={() => tap(b)}
              disabled={done || popping !== null}
              aria-label={`Balloon ${b.letter}`}
            >
              <span className="bp-body">{popping === b.id ? '💥' : b.letter}</span>
              <span className="bp-string" aria-hidden />
            </button>
          )
        })}
      </div>

      {done && <div className="bp-flash ok">🎉 {line} You spelled “{current.word}”!</div>}
      {!done && streak >= 2 && <div className="bp-streak">🔥 {streak} words in a row!</div>}
    </div>
  )
}

export default BalloonPop
