import { usePreferences } from '../../../hooks/usePreferences'
import { activityClock } from '../../../services/games/activityClock'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import type { Word } from '../../../services/wordBank'
import { useAudio } from '../../../contexts/AudioContext'
import { shuffle, isPlayable } from '../shared/wordTricks'
import { sayPrompt, spellOut } from '../../../services/words/praise'
import useCheer from '../shared/useCheer'
import useLater from '../shared/useLater'
import Burst from '../shared/Burst'
import GameEmpty from '../shared/GameEmpty'
import SpellingInput from '../../common/SpellingInput'
import './SpellSprint.css'

interface SpellSprintProps {
  onComplete: (score: number) => void
  words?: Word[]
  rounds?: number
}

const TICK_MS = 200

/**
 * The bee's time for one word: a few seconds to listen, plus a bit per letter.
 * Generous on purpose — it's a friendly race, not a typing test.
 */
export const paceFor = (word: string): number => 4000 + 1200 * word.length

/** How many words the bee has flown after `elapsed` ms of play (fractional). */
export const beeWords = (paces: number[], elapsed: number): number => {
  let left = elapsed
  let flown = 0
  for (const p of paces) {
    if (left >= p) {
      left -= p
      flown += 1
    } else {
      return flown + left / p
    }
  }
  return flown
}

/**
 * Spell Sprint — race the bee to the honey pot.
 *
 * Each word is spoken (never shown: it used to be printed above the box, which
 * made it a copying test). One blank per letter shows how long it is. The bee
 * flies at a steady pace and only while a word is being spelled; a word spelled
 * faster than the bee earns a "speedy" bonus, and finishing ahead of it a bigger
 * one. The bee never ends the race — it just waits at the honey.
 */
const SpellSprint: React.FC<SpellSprintProps> = ({ onComplete, words: providedWords, rounds = 8 }) => {
  const { speak } = useAudio()
  const [preferences] = usePreferences()
  const cheer = useCheer()
  const later = useLater()

  const words = useMemo<Word[]>(
    () => shuffle(providedWords ?? []).filter((w) => isPlayable(w, 3)).slice(0, rounds),
    [providedWords, rounds]
  )
  const paces = useMemo(() => words.map((w) => paceFor(w.word)), [words])
  const totalPace = paces.reduce((a, b) => a + b, 0)

  const [index, setIndex] = useState(0)
  const [input, setInput] = useState('')
  const [tries, setTries] = useState(0)
  const [flash, setFlash] = useState<'ok' | 'again' | 'shown' | null>(null)
  const [line, setLine] = useState('')
  const [speedy, setSpeedy] = useState(false)
  const [shake, setShake] = useState(false)
  const [score, setScore] = useState(0)
  const [rightCount, setRightCount] = useState(0)
  const [streak, setStreak] = useState(0)
  const [hits, setHits] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const [finished, setFinished] = useState<'beat' | 'made' | null>(null)
  // A second Enter a moment after the first used to score the word twice.
  const locked = useRef(false)
  const clock = useRef(0)
  const wordStart = useRef(0)
  const over = useRef(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const current = words[index]

  // The bee's clock runs only while a word is being spelled.
  useEffect(() => {
    if (words.length === 0 || preferences.relaxed) return
    const id = activityClock.setInterval(() => {
      if (locked.current || over.current) return
      clock.current += TICK_MS
      setElapsed(clock.current)
    }, TICK_MS)
    return () => activityClock.clearInterval(id)
  }, [words])

  useEffect(() => {
    if (!current) return
    setInput('')
    setTries(0)
    setFlash(null)
    setSpeedy(false)
    locked.current = false
    wordStart.current = clock.current
    speak(current.word)
    inputRef.current?.focus()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, words])

  if (!current) {
    return (
      <div className="spell-sprint">
        <GameEmpty icon="⚡">No words to sprint with yet — learn a few, then come back and race the bee!</GameEmpty>
      </div>
    )
  }

  const answer = current.word.toLowerCase()
  const settled = flash === 'ok' || flash === 'shown'

  const advance = (gained: number, right: number, ms: number) => {
    if (index === words.length - 1) {
      // The race is over the moment the last word settles.
      over.current = true
      // Beating the bee counts when most of the words were spelled, so racing
      // through with guesses doesn't earn it.
      const beatBee = !preferences.relaxed && clock.current < totalPace && right * 2 >= words.length
      setFinished(beatBee ? 'beat' : 'made')
      const bonus = beatBee ? 30 : 0
      if (bonus) setScore((s) => s + bonus)
      later(() => onComplete(score + gained + bonus), ms)
      return
    }
    later(() => {
      // Clear the last word's verdict in the same step that moves on: left to
      // the effect, one frame could show the new word's answer under the old flash.
      setInput('')
      setTries(0)
      setFlash(null)
      setSpeedy(false)
      setIndex((i) => i + 1)
    }, ms)
  }

  const check = () => {
    if (locked.current || settled) return
    const typed = input.trim().toLowerCase()
    if (!typed) return
    locked.current = true

    if (typed === answer) {
      const fast = !preferences.relaxed && clock.current - wordStart.current <= paces[index]
      const gained = (tries === 0 ? 25 : 10) + (fast ? 10 : 0)
      setScore((s) => s + gained)
      setRightCount((n) => n + 1)
      setSpeedy(fast)
      setFlash('ok')
      setLine(cheer.hit({ say: fast ? 'Speedy!' : undefined }))
      setStreak(cheer.streak())
      setHits((h) => h + 1)
      advance(gained, rightCount + 1, 1300)
      return
    }

    setStreak(0)
    setShake(true)
    later(() => setShake(false), 400)

    if (tries === 0) {
      setTries(1)
      setFlash('again')
      setLine(cheer.miss({ say: `Once more: ${current.word}` }))
      later(() => {
        setInput('')
        setFlash(null)
        locked.current = false
        inputRef.current?.focus()
      }, 900)
      return
    }

    setFlash('shown')
    setLine(cheer.miss({ say: `It's spelled ${spellOut(answer)}.` }))
    advance(0, rightCount, 2400)
  }

  const bee = Math.min(1, beeWords(paces, elapsed) / words.length)
  const me = (index + (settled ? 1 : 0)) / words.length
  const ahead = me >= bee

  return (
    <div className="spell-sprint">
      <div className="ssp-header">
        <div className="ssp-title">⚡ Spell Sprint</div>
        <div className="ssp-stats">
          <div className="ssp-stat"><span>Word</span><strong>{index + 1}/{words.length}</strong></div>
          <div className="ssp-stat"><span>Score</span><strong>{score}</strong></div>
          <div className="ssp-stat"><span>Streak</span><strong>🔥 {streak}</strong></div>
        </div>
      </div>

      <p className="ssp-help">Hear the word, spell it, and race the bee to the honey!</p>

      <div className="ssp-track" aria-label={ahead ? 'You are ahead of the bee' : 'The bee is ahead'}>
        <div className="ssp-lane">
          <span className="ssp-runner bee" style={{ left: `${bee * 88}%` }} aria-hidden>🐝</span>
        </div>
        <div className="ssp-lane">
          <span className="ssp-runner me" style={{ left: `${me * 88}%` }} aria-hidden>🧒</span>
        </div>
        <span className="ssp-honey" aria-hidden>🍯</span>
      </div>
      <p className="ssp-race">
        {finished === 'beat'
          ? 'You beat the bee! 🏁 +30'
          : finished === 'made'
            ? 'You made it to the honey! 🍯'
            : ahead
            ? 'You’re ahead of the bee!'
            : 'The bee is ahead — you can catch it!'}
      </p>

      <button
        className="ssp-btn ghost"
        onClick={() => speak(sayPrompt(current.word, current.sentence))}
        aria-label="Hear the word again"
      >
        🔊 Hear it again
      </button>

      <div className={`ssp-blanks ${shake ? 'shake' : ''}`} aria-label="One space for each letter">
        <Burst trigger={hits} />
        {[...answer].map((ch, i) => (
          <span key={i} className={`ssp-blank ${flash === 'shown' ? 'shown' : ''} ${flash === 'ok' ? 'ok' : ''}`}>
            {flash === 'shown' ? ch : input[i] ?? ''}
          </span>
        ))}
      </div>

      <div className="ssp-answer">
        <SpellingInput
          ref={inputRef}
          type="text"
          value={input}
          maxLength={answer.length + 3}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && check()}
          className={`ssp-input ${flash ?? ''}`}
          placeholder="Spell it here"
          aria-label="Spell the word"
          disabled={settled || flash === 'again'}
          autoFocus
        />
        <button className="ssp-btn" onClick={check} disabled={settled || !input.trim()} aria-label="Check my spelling">
          ✓ Check
        </button>
      </div>

      {flash === 'ok' && (
        <div className="ssp-flash ok">🎉 {line}{speedy ? ' ⚡ Faster than the bee!' : ''}</div>
      )}
      {flash === 'again' && <div className="ssp-flash soft">{line} Listen and try once more! 💪</div>}
      {flash === 'shown' && (
        <div className="ssp-flash soft">
          {line} It's “{current.word}” — the next one is yours! 💪
        </div>
      )}
    </div>
  )
}

export default SpellSprint
