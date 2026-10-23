import { activityClock } from '../../../services/games/activityClock'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { Word } from '../../../services/wordBank'
import { useAudio } from '../../../contexts/AudioContext'
import { shuffle, isPlayable } from '../shared/wordTricks'
import sfx from '../shared/sfx'
import useCheer from '../shared/useCheer'
import Burst from '../shared/Burst'
import GameEmpty from '../shared/GameEmpty'
import './ParrotParty.css'

interface ParrotPartyProps {
  onComplete: (score: number) => void
  words?: Word[]
  /** how many words long the sequence grows before you win */
  maxRounds?: number
}

type Phase = 'watch' | 'repeat' | 'good' | 'oops' | 'won' | 'over'

const TILES = 6
/** From this many words on, Polly only says them — the tiles stay dark. */
export const DARK_FROM = 4

/**
 * How long Polly takes over one word: long enough to say it whole. A flat
 * 1s beat cut "butterfly" off halfway, because each new word stopped the last.
 */
export const beatFor = (word: string): number => 900 + 70 * word.length

/**
 * Polly says: "cake… river… bicycle". Now say it back.
 *
 * A memory game where the tokens are real words the child is learning, so each
 * replay is another look at a spelling they'll meet in tomorrow's quiz. Once
 * the chain is four long the tiles no longer light up: lit tiles could be
 * copied by position alone, without reading a word.
 */
const ParrotParty: React.FC<ParrotPartyProps> = ({ onComplete, words: providedWords, maxRounds = 6 }) => {
  const { speak } = useAudio()
  const cheer = useCheer()

  const tiles = useMemo<string[]>(() => {
    const pool = providedWords && providedWords.length > 0 ? providedWords : []
    const usable = shuffle(pool).filter((w) => isPlayable(w)).map((w) => w.word.toLowerCase())
    const unique = [...new Set(usable)]
    // Polly only ever repeats words this child has met.
    return unique.slice(0, TILES)
  }, [providedWords])

  const [sequence, setSequence] = useState<number[]>([])
  const [lit, setLit] = useState<number | null>(null)
  /** How many words of the chain Polly has said so far (lights the dots). */
  const [said, setSaid] = useState(0)
  const [phase, setPhase] = useState<Phase>('watch')
  const [step, setStep] = useState(0)
  const [score, setScore] = useState(0)
  const [retry, setRetry] = useState(false)
  const [message, setMessage] = useState('Listen to Polly…')
  const [hits, setHits] = useState(0)
  const timers = useRef<number[]>([])
  // Taps read these through refs: two quick taps in one frame both saw the
  // same step in state and could count one word twice.
  const phaseRef = useRef<Phase>('watch')
  const stepRef = useRef(0)

  const goPhase = (p: Phase) => {
    phaseRef.current = p
    setPhase(p)
  }
  const goStep = (n: number) => {
    stepRef.current = n
    setStep(n)
  }
  const later = (fn: () => void, ms: number) => {
    timers.current.push(activityClock.setTimeout(fn, ms))
  }
  const clearTimers = () => {
    timers.current.forEach((t) => activityClock.clearTimeout(t))
    timers.current = []
  }
  useEffect(() => clearTimers, [])

  /** Say (and, early on, light up) each word in turn, then hand over to the child. */
  const playback = useCallback(
    (seq: number[]) => {
      clearTimers()
      const dark = seq.length >= DARK_FROM
      goPhase('watch')
      setSaid(0)
      setMessage(dark ? 'No lights now — just listen to Polly! 👂' : 'Listen to Polly…')
      let at = 0
      seq.forEach((tile, i) => {
        const beat = beatFor(tiles[tile])
        later(() => {
          if (!dark) setLit(tile)
          setSaid(i + 1)
          sfx.tap()
          // Queued, so a word still being said is never cut off.
          speak(tiles[tile], { queue: true })
        }, at)
        later(() => setLit(null), at + beat * 0.6)
        at += beat
      })
      later(() => {
        goPhase('repeat')
        goStep(0)
        setMessage('Your turn — tap the words in order!')
      }, at + 200)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [speak, tiles]
  )

  // Start the first round once the tiles exist.
  useEffect(() => {
    if (tiles.length === 0) return
    const first = [Math.floor(Math.random() * tiles.length)]
    setSequence(first)
    playback(first)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tiles])

  if (tiles.length === 0) {
    return (
      <div className="parrot-party">
        <GameEmpty icon="🦜">Polly has nothing to say yet — learn a few words!</GameEmpty>
      </div>
    )
  }

  const nextRound = (seq: number[]) => {
    const grown = [...seq, Math.floor(Math.random() * tiles.length)]
    setSequence(grown)
    setRetry(false)
    later(() => playback(grown), 1100)
  }

  const tap = (tile: number) => {
    if (phaseRef.current !== 'repeat') return
    const at = stepRef.current
    setLit(tile)
    speak(tiles[tile])
    later(() => setLit((l) => (l === tile ? null : l)), 260)

    if (tile === sequence[at]) {
      const nextStep = at + 1
      if (nextStep < sequence.length) {
        sfx.tap()
        goStep(nextStep)
        return
      }

      // Whole sequence repeated — longer chains are worth more.
      const points = 20 * sequence.length
      goStep(nextStep)
      setScore((s) => s + points)
      setHits((h) => h + 1)

      if (sequence.length >= maxRounds) {
        const total = score + points + 80
        setScore(total)
        goPhase('won')
        setMessage('🦜 Polly is amazed! You remembered them all!')
        sfx.win()
        speak('Polly is amazed! You remembered them all!')
        later(() => onComplete(total), 2400)
        return
      }
      goPhase('good')
      const line = cheer.hit()
      setMessage(`🎉 ${line} +${points}`)
      nextRound(sequence)
      return
    }

    cheer.miss({ quiet: true })
    if (!retry) {
      // One free "listen again" before the run ends — memory needs second chances.
      setRetry(true)
      goPhase('oops')
      setMessage('Ooh, not that one. Listen again! 👂')
      speak('Ooh, not that one. Listen again!')
      later(() => playback(sequence), 1600)
    } else {
      // Show which word came next, then end on what they did manage.
      const wanted = sequence[at]
      goPhase('over')
      later(() => setLit(wanted), 300)
      setMessage(
        `Polly says well done — you reached ${sequence.length} word${sequence.length === 1 ? '' : 's'}! “${tiles[wanted]}” came next. 🦜`
      )
      speak(`Polly says well done! ${tiles[wanted]} came next.`)
      later(() => onComplete(score), 2800)
    }
  }

  const dark = sequence.length >= DARK_FROM

  return (
    <div className="parrot-party">
      <div className="pp-header">
        <div className="pp-title">🦜 Parrot Party</div>
        <div className="pp-stats">
          <div className="pp-stat"><span>Words</span><strong>{sequence.length}/{maxRounds}</strong></div>
          <div className="pp-stat"><span>Score</span><strong>{score}</strong></div>
        </div>
      </div>

      <div className="pp-stage">
        {(phase === 'good' || phase === 'won') && <Burst trigger={hits} />}
        <div className={`pp-parrot ${phase === 'watch' ? 'talking' : ''} ${phase === 'won' ? 'party' : ''}`} aria-hidden>🦜</div>
        <div className="pp-dots" aria-hidden>
          {sequence.map((_, i) => (
            <span
              key={i}
              className={`pp-dot ${(phase === 'watch' && i < said) || (phase !== 'watch' && i < step) ? 'done' : ''}`}
            />
          ))}
        </div>
        {dark && phase === 'watch' && <div className="pp-dark" aria-hidden>🙈 No peeking at lights!</div>}
      </div>

      <p className={`pp-message ${phase}`} role="status">{message}</p>

      <div className="pp-tiles">
        {tiles.map((w, i) => (
          <button
            key={w}
            className={`pp-tile ${lit === i ? 'lit' : ''}`}
            style={{ '--tile-hue': `${(i * 57) % 360}` } as React.CSSProperties}
            onClick={() => tap(i)}
            disabled={phase !== 'repeat'}
          >
            {w}
          </button>
        ))}
      </div>
    </div>
  )
}

export default ParrotParty
