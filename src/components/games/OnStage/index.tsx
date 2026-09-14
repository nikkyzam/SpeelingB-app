import React, { useEffect, useMemo, useRef, useState } from 'react'
import type { Word } from '../../../services/wordBank'
import { useAudio } from '../../../contexts/AudioContext'
import { shuffle, isPlayable } from '../shared/wordTricks'
import sfx from '../shared/sfx'
import './OnStage.css'

interface OnStageProps {
  onComplete: (score: number) => void
  words?: Word[]
  rounds?: number
}

const ROWS = ['abcdefg', 'hijklmn', 'opqrstu', 'vwxyz'] as const

/**
 * On Stage — spell it the way you would at the microphone.
 *
 * Every other game in the hub gives a child a box they can edit: type, look at
 * it, fix it, submit. A real spelling bee gives them none of that. You say a
 * letter and it is said; there is no going back, and one wrong letter ends the
 * word. That is a genuinely different skill — committing to a letter — and
 * nothing here practised it.
 *
 * So: hear the word, tap it out one letter at a time, no backspace. The
 * definition is available on request, exactly as a speller may ask the judge.
 */
const OnStage: React.FC<OnStageProps> = ({ onComplete, words: providedWords, rounds = 5 }) => {
  const { speak } = useAudio()

  const words = useMemo<Word[]>(() => {
    const pool = providedWords && providedWords.length > 0 ? providedWords : []
    return shuffle(pool).filter((w) => isPlayable(w, 3)).slice(0, rounds)
  }, [providedWords, rounds])

  const [index, setIndex] = useState(0)
  const [typed, setTyped] = useState('')
  const [phase, setPhase] = useState<'spelling' | 'right' | 'wrong'>('spelling')
  const [score, setScore] = useState(0)
  const [cleared, setCleared] = useState(0)
  const [showMeaning, setShowMeaning] = useState(false)

  // A ref, not state: two taps in one frame both pass a state guard.
  const locked = useRef(false)
  const timers = useRef<number[]>([])
  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms))
  }
  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), [])

  const current = words[index]
  const answer = (current?.word || '').toLowerCase()

  useEffect(() => {
    if (!current) return
    setTyped('')
    setPhase('spelling')
    setShowMeaning(false)
    locked.current = false
    speak(current.word)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, words])

  if (!current) {
    return (
      <div className="on-stage">
        {/* No dismiss button — onComplete() is a finished round to the hub, and
            it pays a star for one. The header already offers "Back to Games". */}
        <p className="os-empty">
          The stage is set, but there are no words yet — learn a few, then come
          and take the microphone! 🎤
        </p>
      </div>
    )
  }

  const advance = (gained: number) => {
    later(() => {
      if (index < words.length - 1) {
        setIndex((i) => i + 1)
      } else {
        onComplete(score + gained)
      }
    }, 1800)
  }

  const tap = (letter: string) => {
    if (phase !== 'spelling' || locked.current) return

    // The letter is said the moment it is tapped — there is no taking it back.
    if (letter !== answer[typed.length]) {
      locked.current = true
      setTyped(typed + letter)
      setPhase('wrong')
      sfx.wrong()
      speak(`The word was ${current.word}`)
      advance(0)
      return
    }

    const next = typed + letter
    setTyped(next)
    sfx.tap()

    if (next.length === answer.length) {
      locked.current = true
      // Every letter is worth something, with a bonus for the whole word —
      // a child who gets six of seven letters still leaves with points.
      const gained = answer.length * 5 + 20
      setScore((s) => s + gained)
      setCleared((c) => c + 1)
      setPhase('right')
      sfx.applause()
      speak('Correct!')
      advance(gained)
    }
  }

  return (
    <div className="on-stage">
      <div className="os-header">
        <div className="os-title">🎤 On Stage</div>
        <div className="os-stats">
          <div className="os-stat"><span>Word</span><strong>{index + 1}/{words.length}</strong></div>
          <div className="os-stat"><span>Score</span><strong>{score}</strong></div>
          <div className="os-stat"><span>Spelled</span><strong>🏅 {cleared}</strong></div>
        </div>
      </div>

      <div className="os-mic" aria-hidden>🎤</div>

      <div className="os-asks">
        <button className="os-btn ask" onClick={() => speak(current.word)}>🔊 Hear it again</button>
        <button
          className="os-btn ask"
          onClick={() => {
            setShowMeaning(true)
            if (current.meaning) speak(current.meaning)
          }}
        >
          💡 What does it mean?
        </button>
      </div>

      {showMeaning && current.meaning && <p className="os-meaning">{current.meaning}</p>}

      <div className={`os-letters ${phase}`} aria-label="The letters you have said so far">
        {Array.from({ length: answer.length }).map((_, i) => {
          // On a miss the whole correct word is shown, with the slot that ended
          // the word marked. Keeping the child's wrong letter in place spelled
          // something that was neither their answer nor the word ("cxt"), so
          // the one letter they most needed to see was the one letter missing.
          const shown = phase === 'wrong' ? answer[i] : typed[i] || ''
          const isMistake = phase === 'wrong' && i === typed.length - 1
          return (
            <span key={i} className={`os-slot ${shown ? 'said' : ''} ${isMistake ? 'mistake' : ''}`}>
              {shown}
            </span>
          )
        })}
      </div>

      <p className="os-hint">
        {phase === 'spelling'
          ? 'One letter at a time — once you tap it, it is said for good.'
          : phase === 'right'
          ? ''
          : `The word was “${current.word}” — you said “${typed[typed.length - 1]}”.`}
      </p>

      <div className="os-pad" role="group" aria-label="Letter keys">
        {ROWS.map((row) => (
          <div key={row} className="os-row">
            {row.split('').map((ch) => (
              <button
                key={ch}
                className="os-key"
                onClick={() => tap(ch)}
                disabled={phase !== 'spelling'}
                aria-label={ch}
              >
                {ch}
              </button>
            ))}
          </div>
        ))}
      </div>

      {phase === 'right' && <div className="os-flash ok">🎉 Correct! +{answer.length * 5 + 20}</div>}
      {phase === 'wrong' && <div className="os-flash bad">Not this time — step up again for the next word! 💪</div>}
    </div>
  )
}

export default OnStage
