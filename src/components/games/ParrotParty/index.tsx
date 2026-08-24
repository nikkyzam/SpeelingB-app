import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { wordBank, Word } from '../../../services/wordBank'
import { useAudio } from '../../../contexts/AudioContext'
import { shuffle, isPlayable } from '../shared/wordTricks'
import sfx from '../shared/sfx'
import './ParrotParty.css'

interface ParrotPartyProps {
  onComplete: (score: number) => void
  words?: Word[]
  /** how many words long the sequence grows before you win */
  maxRounds?: number
}

type Phase = 'watch' | 'repeat' | 'good' | 'oops' | 'won' | 'over'

const TILES = 6
const BEAT_MS = 1000

/**
 * Polly says: "cake… river… bicycle". Now say it back.
 *
 * A memory game where the tokens are real words the child is learning, so each
 * replay is another look at a spelling they'll meet in tomorrow's quiz.
 */
const ParrotParty: React.FC<ParrotPartyProps> = ({ onComplete, words: providedWords, maxRounds = 6 }) => {
  const { speak } = useAudio()

  const tiles = useMemo<string[]>(() => {
    const pool = providedWords && providedWords.length > 0 ? providedWords : wordBank.getRandomWords(30)
    const usable = shuffle(pool).filter((w) => isPlayable(w)).map((w) => w.word.toLowerCase())
    const unique = [...new Set(usable)]
    if (unique.length >= TILES) return unique.slice(0, TILES)
    const extra = wordBank.getRandomWords(40).filter((w) => isPlayable(w)).map((w) => w.word.toLowerCase())
    return [...new Set([...unique, ...extra])].slice(0, TILES)
  }, [providedWords])

  const [sequence, setSequence] = useState<number[]>([])
  const [lit, setLit] = useState<number | null>(null)
  const [phase, setPhase] = useState<Phase>('watch')
  const [step, setStep] = useState(0)
  const [score, setScore] = useState(0)
  const [retry, setRetry] = useState(false)
  const [message, setMessage] = useState('Listen to Polly…')
  const timers = useRef<number[]>([])

  const clearTimers = () => {
    timers.current.forEach((t) => window.clearTimeout(t))
    timers.current = []
  }
  useEffect(() => clearTimers, [])

  /** Light up and say each word in turn, then hand control to the child. */
  const playback = useCallback(
    (seq: number[]) => {
      clearTimers()
      setPhase('watch')
      setMessage('Listen to Polly…')
      seq.forEach((tile, i) => {
        timers.current.push(
          window.setTimeout(() => {
            setLit(tile)
            sfx.tap()
            speak(tiles[tile])
          }, i * BEAT_MS)
        )
        timers.current.push(
          window.setTimeout(() => setLit(null), i * BEAT_MS + BEAT_MS * 0.6)
        )
      })
      timers.current.push(
        window.setTimeout(() => {
          setPhase('repeat')
          setStep(0)
          setMessage('Your turn — tap the words in order!')
        }, seq.length * BEAT_MS + 200)
      )
    },
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
        <p className="pp-empty">Polly has nothing to say yet — learn a few words! 🦜</p>
        <button className="pp-btn" onClick={() => onComplete(0)}>Back to Games</button>
      </div>
    )
  }

  const nextRound = (seq: number[]) => {
    const grown = [...seq, Math.floor(Math.random() * tiles.length)]
    setSequence(grown)
    setRetry(false)
    timers.current.push(window.setTimeout(() => playback(grown), 900))
  }

  const tap = (tile: number) => {
    if (phase !== 'repeat') return
    setLit(tile)
    speak(tiles[tile])
    window.setTimeout(() => setLit(null), 260)

    if (tile === sequence[step]) {
      const nextStep = step + 1
      if (nextStep < sequence.length) {
        sfx.tap()
        setStep(nextStep)
        return
      }

      // Whole sequence repeated — longer chains are worth more.
      const points = 20 * sequence.length
      setScore((s) => s + points)
      setPhase('good')
      sfx.correct()
      setMessage(`🎉 Perfect! +${points}`)

      if (sequence.length >= maxRounds) {
        const total = score + points + 80
        setScore(total)
        setPhase('won')
        setMessage('🦜 Polly is amazed! You remembered them all!')
        sfx.win()
        speak('Polly is amazed!')
        timers.current.push(window.setTimeout(() => onComplete(total), 2400))
        return
      }
      nextRound(sequence)
    } else {
      sfx.wrong()
      if (!retry) {
        // One free "listen again" before the run ends — memory needs second chances.
        setRetry(true)
        setPhase('oops')
        setMessage('Ooh, not that one. Listen again! 👂')
        timers.current.push(window.setTimeout(() => playback(sequence), 1400))
      } else {
        setPhase('over')
        setMessage(`Polly says well done — you reached ${sequence.length} words!`)
        timers.current.push(window.setTimeout(() => onComplete(score), 2200))
      }
    }
  }

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
        <div className={`pp-parrot ${phase === 'watch' ? 'talking' : ''} ${phase === 'won' ? 'party' : ''}`} aria-hidden>🦜</div>
        <div className="pp-dots" aria-hidden>
          {sequence.map((_, i) => (
            <span key={i} className={`pp-dot ${phase === 'repeat' && i < step ? 'done' : ''}`} />
          ))}
        </div>
      </div>

      <p className={`pp-message ${phase}`}>{message}</p>

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
