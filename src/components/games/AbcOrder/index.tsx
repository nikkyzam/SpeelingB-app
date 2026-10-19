import React, { useMemo, useRef, useState } from 'react'
import type { Word } from '../../../services/wordBank'
import { useAudio } from '../../../contexts/AudioContext'
import { shuffle, isPlayable } from '../shared/wordTricks'
import { useCheer } from '../shared/useCheer'
import { useLater } from '../shared/useLater'
import sfx from '../shared/sfx'
import Burst from '../shared/Burst'
import GameEmpty from '../shared/GameEmpty'
import './AbcOrder.css'

interface AbcOrderProps {
  onComplete: (score: number) => void
  words?: Word[]
  rounds?: number
  perRound?: number
}

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.split('')
const ROUND_BONUS = 20
const ROUND_MS = 1500

/** Tap the words in A-B-C order. Teaches alphabetising and letter order. */
const AbcOrder: React.FC<AbcOrderProps> = ({ onComplete, words: providedWords, rounds = 3, perRound = 5 }) => {
  const { speak } = useAudio()
  const cheer = useCheer()
  const later = useLater()

  const roundSets = useMemo<string[][]>(() => {
    const pool = providedWords && providedWords.length > 0 ? providedWords : []
    const clean = Array.from(new Set(pool.filter((w) => isPlayable(w, 1)).map((w) => w.word.toLowerCase())))
    if (!clean.length) return []
    const sets: string[][] = []
    const bag = shuffle(clean)
    for (let r = 0; r < rounds; r++) {
      const slice = bag.slice(r * perRound, r * perRound + perRound)
      if (slice.length === perRound) sets.push(slice)
    }
    return sets.length ? sets : [shuffle(clean).slice(0, perRound)]
  }, [providedWords, rounds, perRound])

  const [round, setRound] = useState(0)
  const [picked, setPicked] = useState<string[]>([])
  const [score, setScore] = useState(0)
  const [wrong, setWrong] = useState<{ word: string; n: number } | null>(null)
  const [missedThisStep, setMissedThisStep] = useState(false)
  const [roundDone, setRoundDone] = useState(false)
  const [line, setLine] = useState('')
  const [roundsWon, setRoundsWon] = useState(0)
  // Settles a finished round once, whatever the fingers do meanwhile.
  const settled = useRef(false)

  const words = roundSets[round] || []
  const sorted = useMemo(() => [...words].sort(), [words])
  const nextWord = sorted[picked.length]
  /** The first letters of this round's words — lit on the A–Z strip. */
  const lit = useMemo(() => new Set(words.map((w) => w[0])), [words])

  if (!words.length) {
    return (
      <div className="abc-order">
        <GameEmpty icon="🔤">No words to sort yet — learn a few, then come back and put them in A B C order!</GameEmpty>
      </div>
    )
  }

  const tap = (w: string) => {
    if (settled.current || roundDone || picked.includes(w)) return
    if (w !== nextWord) {
      // No points lost: a soft sound, a wiggle, and the strip shows where to look.
      cheer.miss({ quiet: true })
      setWrong((x) => ({ word: w, n: (x?.n ?? 0) + 1 }))
      setMissedThisStep(true)
      return
    }

    const nextPicked = [...picked, w]
    setPicked(nextPicked)
    setMissedThisStep(false)
    setWrong(null)
    speak(w)
    if (nextPicked.length < words.length) {
      sfx.pop()
      setScore((s) => s + 10)
      return
    }

    settled.current = true
    const gained = 10 + ROUND_BONUS
    setScore((s) => s + gained)
    setRoundDone(true)
    setRoundsWon((n) => n + 1)
    // Quiet: the word just tapped is still being said.
    setLine(cheer.hit({ quiet: true }))
    later(() => {
      if (round < roundSets.length - 1) {
        setRound((r) => r + 1)
        setPicked([])
        setRoundDone(false)
        setLine('')
        settled.current = false
      } else {
        onComplete(score + gained)
      }
    }, ROUND_MS)
  }

  // After a miss, the letter to look for glows on the strip.
  const helpLetter = missedThisStep && nextWord ? nextWord[0] : null

  return (
    <div className="abc-order">
      <div className="ao-header">
        <div className="ao-title">🔤 ABC Order</div>
        <div className="ao-stats">
          <div className="ao-stat"><span>Round</span><strong>{round + 1}/{roundSets.length}</strong></div>
          <div className="ao-stat"><span>Score</span><strong>{score}</strong></div>
        </div>
      </div>

      <p className="ao-hint">Tap the words in <strong>A B C</strong> order!</p>

      <div className="ao-strip" aria-label="The alphabet, with this round's first letters lit">
        {ALPHABET.map((ch) => {
          const cls = [
            'ao-letter',
            lit.has(ch) ? 'lit' : '',
            // Every word starting with it is in place: dim it.
            lit.has(ch) && words.every((w) => w[0] !== ch || picked.includes(w)) ? 'used' : '',
            helpLetter === ch ? 'help' : '',
          ].join(' ')
          return (
            <span key={ch} className={cls} data-letter={ch}>
              {ch.toUpperCase()}
            </span>
          )
        })}
      </div>

      <div className="ao-slots">
        {sorted.map((_, i) => (
          <span key={i} className={`ao-slot ${picked[i] ? 'filled' : ''}`}>
            {picked[i] ? picked[i] : i + 1}
          </span>
        ))}
      </div>

      <div className="ao-words">
        {words.map((w) => {
          const done = picked.includes(w)
          const shaking = wrong?.word === w
          return (
            <button
              key={shaking ? `${w}-${wrong!.n}` : w}
              className={`ao-word ${done ? 'done' : ''} ${shaking ? 'wrong' : ''}`}
              onClick={() => tap(w)}
              disabled={done || roundDone}
            >
              {w}
            </button>
          )
        })}
      </div>

      {missedThisStep && !roundDone && (
        <p className="ao-nudge" role="status">Not yet! Look for the glowing letter on the A–Z.</p>
      )}

      {roundDone && (
        <div className="ao-flash" role="status">
          🎉 {line} Perfect order! +{ROUND_BONUS} bonus
          <Burst trigger={roundsWon} />
        </div>
      )}
    </div>
  )
}

export default AbcOrder
