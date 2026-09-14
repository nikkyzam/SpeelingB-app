import React, { useEffect, useMemo, useRef, useState } from 'react'
import type { Word } from '../../../services/wordBank'
import { useAudio } from '../../../contexts/AudioContext'
import { shuffle, isPlayable } from '../shared/wordTricks'
import sfx from '../shared/sfx'
import './VowelRescue.css'

interface VowelRescueProps {
  onComplete: (score: number) => void
  words?: Word[]
  rounds?: number
}

const VOWELS = ['a', 'e', 'i', 'o', 'u'] as const
const isVowel = (c: string) => (VOWELS as readonly string[]).includes(c.toLowerCase())

/** Three wrong taps on one word and it is shown — a child should never be stuck. */
const MISSES_ALLOWED = 3

/**
 * Vowel Rescue — every vowel has floated away; put them back.
 *
 * The consonants of a word carry its shape, but the vowels are where spelling
 * actually goes wrong: "seperate", "definately", "accomodate". Missing Letter
 * hides one letter and offers a choice; this hides *all* the vowels at once and
 * offers none, which is the harder and more useful thing to practise.
 *
 * Answers are tapped from a five-key vowel pad rather than typed, so a tablet's
 * keyboard never gets the chance to autocorrect the answer.
 */
const VowelRescue: React.FC<VowelRescueProps> = ({ onComplete, words: providedWords, rounds = 6 }) => {
  const { speak } = useAudio()

  const words = useMemo<Word[]>(() => {
    const pool = providedWords && providedWords.length > 0 ? providedWords : []
    return shuffle(pool)
      // Must match GameCenter's gate (a-z, 3+ letters) or the hub can offer an
      // unlocked game with nothing in it. One vowel is a fine puzzle: c_t.
      .filter((w) => isPlayable(w, 3) && [...w.word].some(isVowel))
      .slice(0, rounds)
  }, [providedWords, rounds])

  const [index, setIndex] = useState(0)
  const [filled, setFilled] = useState<string[]>([])
  const [misses, setMisses] = useState(0)
  const [score, setScore] = useState(0)
  const [rescued, setRescued] = useState(0)
  const [shake, setShake] = useState(false)
  const [done, setDone] = useState(false)

  // A word left mid-round must not finish itself after the child has walked
  // away — that would award stars for a game nobody is playing any more.
  // State guards lose a race against a fast double tap: both handlers read the
  // pre-commit value. A ref settles immediately, so a word scores exactly once.
  const locked = useRef(false)
  const timers = useRef<number[]>([])
  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms))
  }
  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), [])

  const current = words[index]
  /** Where the vowels sit in the word, left to right. */
  const slots = useMemo(
    () => (current ? [...current.word].map((c, i) => (isVowel(c) ? i : -1)).filter((i) => i >= 0) : []),
    [current]
  )

  useEffect(() => {
    if (!current) return
    setFilled([])
    setMisses(0)
    setDone(false)
    locked.current = false
    speak(current.word)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, words])

  if (!current) {
    return (
      <div className="vowel-rescue">
        {/* Deliberately no button here: onComplete() is how a game reports a
            finished round, and GameCenter pays a star and a daily-challenge
            play for one. The header's own "Back to Games" is the way out. */}
        <p className="vr-empty">
          No words to rescue yet — learn a few words, then come back and put
          their vowels right! 🅰️
        </p>
      </div>
    )
  }

  const answer = current.word.toLowerCase()
  const nextSlot = slots[filled.length]

  const advance = (gained: number) => {
    later(() => {
      if (index < words.length - 1) {
        setIndex((i) => i + 1)
      } else {
        onComplete(score + gained)
      }
    }, 1500)
  }

  const reveal = () => {
    locked.current = true
    setDone(true)
    setFilled(slots.map((i) => answer[i]))
    speak(`It was ${current.word}`)
    advance(0)
  }

  const tap = (v: string) => {
    if (done || locked.current) return

    if (v === answer[nextSlot]) {
      const next = [...filled, v]
      setFilled(next)
      sfx.pop()

      if (next.length === slots.length) {
        locked.current = true
        // A clean rescue is worth more than one that took a few tries, but
        // finishing at all still scores — the word got spelled either way.
        const bonus = misses === 0 ? 25 : 0
        const gained = slots.length * 10 + bonus
        setScore((s) => s + gained)
        setRescued((r) => r + 1)
        setDone(true)
        sfx.correct()
        speak('Rescued!')
        advance(gained)
      }
      return
    }

    sfx.wrong()
    setShake(true)
    later(() => setShake(false), 400)
    const used = misses + 1
    setMisses(used)
    if (used >= MISSES_ALLOWED) reveal()
  }

  type Slot = { ch: string; kind: 'consonant' | 'filled' | 'blank' }
  const letters: Slot[] = [...current.word].map((ch, i) => {
    if (!isVowel(ch)) return { ch, kind: 'consonant' }
    const at = slots.indexOf(i)
    return { ch: filled[at] ?? '', kind: filled[at] ? 'filled' : 'blank' }
  })

  return (
    <div className="vowel-rescue">
      <div className="vr-header">
        <div className="vr-title">🅰️ Vowel Rescue</div>
        <div className="vr-stats">
          <div className="vr-stat"><span>Word</span><strong>{index + 1}/{words.length}</strong></div>
          <div className="vr-stat"><span>Score</span><strong>{score}</strong></div>
          <div className="vr-stat"><span>Rescued</span><strong>✨ {rescued}</strong></div>
        </div>
      </div>

      <button className="vr-btn hear" onClick={() => speak(current.word)}>🔊 Hear it again</button>
      {current.meaning && <p className="vr-meaning">{current.meaning}</p>}

      <div className={`vr-word ${shake ? 'shake' : ''} ${done ? 'done' : ''}`} aria-label="The word with its vowels missing">
        {letters.map((l, i) => (
          <span
            key={i}
            className={`vr-letter ${l.kind}`}
            data-active={!done && slots[filled.length] === i ? 'true' : undefined}
          >
            {l.kind === 'blank' ? '' : l.ch}
          </span>
        ))}
      </div>

      <p className="vr-hint">
        {done ? '' : `Tap the vowel that belongs in the glowing space (${slots.length - filled.length} to go)`}
      </p>

      <div className="vr-pad" role="group" aria-label="Vowel keys">
        {VOWELS.map((v) => (
          <button key={v} className="vr-key" onClick={() => tap(v)} disabled={done} aria-label={v}>
            {v}
          </button>
        ))}
      </div>

      <div className="vr-lives" aria-label={`${MISSES_ALLOWED - misses} tries left on this word`}>
        {Array.from({ length: MISSES_ALLOWED }).map((_, i) => (
          <span key={i} className={i < MISSES_ALLOWED - misses ? 'on' : 'off'}>💛</span>
        ))}
      </div>

      {done && misses < MISSES_ALLOWED && (
        <div className="vr-flash ok">🎉 Every vowel back where it belongs!</div>
      )}
      {done && misses >= MISSES_ALLOWED && (
        <div className="vr-flash bad">It was “{current.word}” — the next one is yours! 💪</div>
      )}
    </div>
  )
}

export default VowelRescue
