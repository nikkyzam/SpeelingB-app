import React, { useEffect, useMemo, useRef, useState } from 'react'
import type { Word } from '../../../services/wordBank'
import { useAudio } from '../../../contexts/AudioContext'
import { shuffle, isPlayable } from '../shared/wordTricks'
import { spellOut } from '../../../services/words/praise'
import sfx from '../shared/sfx'
import useCheer from '../shared/useCheer'
import useLater from '../shared/useLater'
import Burst from '../shared/Burst'
import GameEmpty from '../shared/GameEmpty'
import './SecretCode.css'

interface SecretCodeProps {
  onComplete: (score: number) => void
  words?: Word[]
  rounds?: number
}

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.split('')
const codeFor = (ch: string) => ALPHABET.indexOf(ch) + 1 // a=1 ... z=26

/** Three goes at a code, then the secret word is told. */
const TRIES = 3
const CRACKED = 25
const FIRST_TRY_BONUS = 10

type Status = 'working' | 'right' | 'nearly' | 'shown'

/**
 * Crack the number code to reveal the secret word.
 *
 * The keys carry letters only: when every key showed its number too, cracking
 * the code was matching "3" to the key marked 3 — no decoding, no spelling.
 * Counting through the alphabet is the puzzle; the 🔑 key card is the help.
 */
const SecretCode: React.FC<SecretCodeProps> = ({ onComplete, words: providedWords, rounds = 5 }) => {
  const { speak } = useAudio()
  const cheer = useCheer()
  const later = useLater()

  const words = useMemo<Word[]>(() => {
    const pool = providedWords && providedWords.length > 0 ? providedWords : []
    return shuffle(pool)
      .filter((w) => isPlayable(w, 3) && w.word.length <= 8)
      .slice(0, rounds)
  }, [providedWords, rounds])

  const [index, setIndex] = useState(0)
  /** One letter (or '') per chip. */
  const [slots, setSlots] = useState<string[]>([])
  /** Chips checked and found right: they stay put. */
  const [kept, setKept] = useState<boolean[]>([])
  /** Chips that didn't match on the last check, shown for a moment. */
  const [marked, setMarked] = useState<boolean[]>([])
  const [tries, setTries] = useState(0)
  const [score, setScore] = useState(0)
  const [cracked, setCracked] = useState(0)
  const [status, setStatus] = useState<Status>('working')
  const [showLegend, setShowLegend] = useState(false)
  const [cheerLine, setCheerLine] = useState('')
  const [hits, setHits] = useState(0)
  const locked = useRef(false)
  /** Chips in the order they were filled, so Undo takes back the last one. */
  const typed = useRef<number[]>([])
  // Taps read the chips through a ref: two quick taps in one frame would both
  // see the same empty chip in state and land on top of each other.
  const slotsRef = useRef<string[]>([])
  const writeSlots = (next: string[]) => {
    slotsRef.current = next
    setSlots(next)
  }

  const current = words[index]
  const answer = (current?.word || '').toLowerCase()

  useEffect(() => {
    if (!current) return
    const n = current.word.length
    writeSlots(Array(n).fill(''))
    setKept(Array(n).fill(false))
    setMarked(Array(n).fill(false))
    setTries(0)
    setStatus('working')
    typed.current = []
    locked.current = false
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, words])

  if (!current) {
    return (
      <div className="secret-code">
        <GameEmpty icon="🔐">No codes to crack yet — learn a few words first!</GameEmpty>
      </div>
    )
  }

  const full = slots.length === answer.length && slots.every(Boolean)

  const next = (gained: number, wait: number) => {
    later(() => {
      if (index < words.length - 1) {
        // Lay out the next code in the same step as the index moves, or its
        // first frame would show the last code's flash with the new word in it.
        const n = words[index + 1].word.length
        writeSlots(Array(n).fill(''))
        setKept(Array(n).fill(false))
        setMarked(Array(n).fill(false))
        setTries(0)
        setStatus('working')
        typed.current = []
        setIndex((i) => i + 1)
      } else {
        onComplete(score + gained)
      }
    }, wait)
  }

  const submit = () => {
    if (locked.current || status !== 'working' || !full) return
    locked.current = true

    if (slotsRef.current.join('') === answer) {
      const gained = CRACKED + (tries === 0 ? FIRST_TRY_BONUS : 0)
      setScore((s) => s + gained)
      setCracked((c) => c + 1)
      setStatus('right')
      setCheerLine(cheer.hit({ say: `Code cracked! ${current.word}` }))
      setHits((h) => h + 1)
      next(gained, 1700)
      return
    }

    const used = tries + 1
    setTries(used)
    const wrong = slotsRef.current.map((ch, i) => ch !== answer[i])

    if (used >= TRIES) {
      writeSlots(answer.split(''))
      setMarked(Array(answer.length).fill(false))
      setStatus('shown')
      cheer.miss({ say: `The secret word was ${current.word}. ${spellOut(current.word)}.` })
      next(0, 2800)
      return
    }

    // Show which chips don't match, then clear just those for another go.
    setMarked(wrong)
    setKept(wrong.map((w) => !w))
    setStatus('nearly')
    setCheerLine(cheer.miss())
    later(() => {
      writeSlots(slotsRef.current.map((ch, i) => (wrong[i] ? '' : ch)))
      setMarked(Array(answer.length).fill(false))
      // What's left is all kept letters, and those can't be undone.
      typed.current = []
      setStatus('working')
      locked.current = false
    }, 1200)
  }

  const tapLetter = (ch: string) => {
    if (locked.current || status !== 'working') return
    const at = slotsRef.current.findIndex((s) => !s)
    if (at < 0) return
    sfx.tap()
    typed.current.push(at)
    writeSlots(slotsRef.current.map((c, i) => (i === at ? ch : c)))
  }

  const undo = () => {
    if (locked.current || status !== 'working') return
    const at = typed.current.pop()
    if (at === undefined) return
    sfx.tap()
    writeSlots(slotsRef.current.map((c, i) => (i === at ? '' : c)))
  }

  return (
    <div className="secret-code">
      <div className="sk-header">
        <div className="sk-title">🔐 Secret Code</div>
        <div className="sk-stats">
          <div className="sk-stat"><span>Code</span><strong>{index + 1}/{words.length}</strong></div>
          <div className="sk-stat"><span>Score</span><strong>{score}</strong></div>
          <div className="sk-stat"><span>Cracked</span><strong>🗝️ {cracked}</strong></div>
        </div>
      </div>

      <p className="sk-brief">Crack the code! Each number is a letter: <strong>A=1, B=2, C=3…</strong></p>

      <div className={`sk-code ${status}`} aria-label="The secret code">
        {status === 'right' && <Burst trigger={hits} />}
        {answer.split('').map((ch, i) => (
          <div
            key={i}
            className={`sk-chip ${marked[i] ? 'off' : ''} ${kept[i] && status !== 'shown' ? 'kept' : ''}`}
          >
            <span className="sk-num">{codeFor(ch)}</span>
            <span className={`sk-solved ${slots[i] ? 'filled' : ''}`}>{slots[i]?.toUpperCase() || '?'}</span>
          </div>
        ))}
      </div>

      <div className="sk-tries" aria-label={`${TRIES - tries} tries left on this code`}>
        {Array.from({ length: TRIES }).map((_, i) => (
          <span key={i} className={i < TRIES - tries ? 'on' : 'off'} aria-hidden>🗝️</span>
        ))}
      </div>

      <div className="sk-actions">
        <button className="sk-btn ghost" onClick={undo} disabled={status !== 'working' || typed.current.length === 0}>⬅ Undo</button>
        <button className="sk-btn" onClick={submit} disabled={status !== 'working' || !full}>🗝️ Crack it!</button>
        <button className="sk-btn ghost" onClick={() => setShowLegend((s) => !s)}>
          {showLegend ? 'Hide key' : '🔑 Show key'}
        </button>
      </div>

      {showLegend && (
        <div className="sk-legend">
          {ALPHABET.map((ch, i) => (
            <span key={ch} className="sk-legend-item"><b>{ch.toUpperCase()}</b>={i + 1}</span>
          ))}
        </div>
      )}

      <div className="sk-keys" role="group" aria-label="Letter keys">
        {ALPHABET.map((ch) => (
          <button key={ch} className="sk-key" onClick={() => tapLetter(ch)} disabled={status !== 'working'}>
            {ch.toUpperCase()}
          </button>
        ))}
      </div>

      {status === 'right' && <div className="sk-flash ok">🎉 {cheerLine} It was “{current.word}”!</div>}
      {status === 'nearly' && (
        <div className="sk-flash nearly">{cheerLine} The wobbly letters don&apos;t match — count again 🔍</div>
      )}
      {status === 'shown' && (
        <div className="sk-flash shown">The secret word was “{current.word}” — you&apos;ll crack the next one! 💪</div>
      )}
    </div>
  )
}

export default SecretCode
