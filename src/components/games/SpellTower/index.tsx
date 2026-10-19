import React, { useEffect, useMemo, useRef, useState } from 'react'
import type { Word } from '../../../services/wordBank'
import { useAudio } from '../../../contexts/AudioContext'
import { shuffle, isPlayable } from '../shared/wordTricks'
import { spellOut, sayPrompt } from '../../../services/words/praise'
import ReviewSchedule from '../../../services/progress/ReviewSchedule'
import sfx from '../shared/sfx'
import useCheer from '../shared/useCheer'
import useLater from '../shared/useLater'
import Burst from '../shared/Burst'
import GameEmpty from '../shared/GameEmpty'
import './SpellTower.css'
import SpellingInput from '../../common/SpellingInput'

interface SpellTowerProps {
  onComplete: (score: number) => void
  words?: Word[]
  floors?: number
}

interface Floor {
  word: string
  tilt: number
  hue: number
}

/** A tower with a floor for every word gets a gold flag. */
const PERFECT_BONUS = 100

/**
 * Every word spelled right becomes another floor of your tower.
 *
 * The reward isn't a number going up, it's a building growing on screen — kids
 * will spell one more word just to see the roof go on.
 *
 * The roof goes on after the last word whatever happened: a miss makes the
 * tower wobble and shows the word, but never knocks a floor off. It used to
 * finish only once every word was a floor, so after one miss the game ran
 * past its last word into an empty screen.
 */
const SpellTower: React.FC<SpellTowerProps> = ({ onComplete, words: providedWords, floors = 8 }) => {
  const { speak } = useAudio()
  const cheer = useCheer()
  const later = useLater()

  const words = useMemo<Word[]>(() => {
    const pool = providedWords && providedWords.length > 0 ? providedWords : []
    const usable = shuffle(pool).filter((w) => isPlayable(w))
    // Only their own words: a short game beats a game full of strangers.
    return usable.slice(0, floors)
  }, [providedWords, floors])

  const [index, setIndex] = useState(0)
  const [built, setBuilt] = useState<Floor[]>([])
  const [input, setInput] = useState('')
  const [score, setScore] = useState(0)
  const [wobble, setWobble] = useState(0)
  const [state, setState] = useState<'typing' | 'good' | 'bad' | 'done'>('typing')
  const [message, setMessage] = useState('Spell the word to lay the first block!')
  const [hits, setHits] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const locked = useRef(false)

  const current = words[index]
  const last = index >= words.length - 1

  useEffect(() => {
    // Word, sentence, word: "tail" alone could be "tale", and a miss there is recorded.
    // Queued, so the last word's spoken correction (its letters) isn't cut off.
    if (current && state !== 'done') speak(sayPrompt(current.word, current.sentence), { queue: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, words])

  // The box stays on screen, read-only between words, so the touch keypad
  // doesn't vanish and come back; focus returns once it's live again.
  useEffect(() => {
    if (state === 'typing') inputRef.current?.focus()
  }, [state])

  if (!current) {
    return (
      <div className="spell-tower">
        <GameEmpty icon="🏰">No bricks yet — learn a few words and come build!</GameEmpty>
      </div>
    )
  }

  const nextWord = () => {
    setInput('')
    setState('typing')
    setIndex((i) => i + 1)
    locked.current = false
  }

  /** The roof goes on. `floorsNow` and `gained` include this last word. */
  const topOut = (floorsNow: number, gained: number) => {
    const perfect = floorsNow === words.length
    const total = score + gained + (perfect ? PERFECT_BONUS : 0)
    setScore(total)
    setState('done')
    setHits((h) => h + 1)
    setMessage(
      perfect
        ? '🏰 A perfect tower — a floor for every word! Look at that view!'
        : `🏰 Roof on! Your tower is ${floorsNow} floor${floorsNow === 1 ? '' : 's'} tall!`
    )
    sfx.win()
    speak(perfect ? 'A perfect tower! You built every floor!' : 'Roof on! Look at your tower!', { queue: true })
    later(() => onComplete(total), 2800)
  }

  const build = () => {
    if (state !== 'typing' || locked.current || !input.trim()) return
    locked.current = true
    const ok = input.trim().toLowerCase() === current.word.toLowerCase()

    // Same as a spelling round: record it so review targets what's shaky.
    ReviewSchedule.record(current.id, ok)

    if (ok) {
      const floor: Floor = {
        word: current.word.toLowerCase(),
        // A hand-stacked look: every block leans a hair differently.
        tilt: Math.round((Math.random() * 4 - 2) * 10) / 10,
        hue: Math.floor(Math.random() * 360),
      }
      const nextBuilt = [...built, floor]
      // Higher floors are worth more — the climb should feel like it matters.
      const points = 30 + nextBuilt.length * 5
      setBuilt(nextBuilt)
      setScore((s) => s + points)
      setWobble(0)
      setState('good')
      setHits((h) => h + 1)
      sfx.thud()
      const line = cheer.hit()
      setMessage(`🧱 ${line} Floor ${nextBuilt.length} added! +${points}`)

      if (last) later(() => topOut(nextBuilt.length, points), 1200)
      else later(nextWord, 1300)
      return
    }

    setWobble((w) => Math.min(w + 1, 3))
    setState('bad')
    setInput(current.word.toLowerCase())
    const line = cheer.miss({ say: `It was ${current.word}. ${spellOut(current.word)}.` })
    setMessage(`${line} It was “${current.word}”. The tower wobbles — but it holds!`)
    if (last) later(() => topOut(built.length, 0), 2400)
    else later(nextWord, 2400)
  }

  const roofOn = state === 'done'

  return (
    <div className="spell-tower">
      <div className="st-header">
        <div className="st-title">🏰 Spell Tower</div>
        <div className="st-stats">
          <div className="st-stat"><span>Word</span><strong>{Math.min(index + 1, words.length)}/{words.length}</strong></div>
          <div className="st-stat"><span>Floors</span><strong>{built.length}</strong></div>
          <div className="st-stat"><span>Score</span><strong>{score}</strong></div>
          <div className="st-stat"><span>Wobble</span><strong>{'😬'.repeat(wobble) || '😌'}</strong></div>
        </div>
      </div>

      <div className={`st-site ${state === 'bad' ? 'wobbling' : ''}`}>
        {(state === 'good' || state === 'done') && <Burst trigger={hits} />}
        <div className="st-sky">
          <span className="st-cloud c1" aria-hidden>☁️</span>
          <span className="st-cloud c2" aria-hidden>☁️</span>
        </div>

        <div className="st-stack">
          {roofOn && (
            <div className="st-roof" role="img" aria-label="The roof is on">
              {built.length === words.length ? '🏆' : '🚩'}
            </div>
          )}
          {[...built].reverse().map((f, i) => (
            <div
              key={`${f.word}-${built.length - i}`}
              className="st-block"
              style={{
                transform: `rotate(${f.tilt}deg)`,
                background: `linear-gradient(180deg, hsl(${f.hue} 75% 68%), hsl(${f.hue} 70% 55%))`,
              }}
            >
              {f.word}
            </div>
          ))}
          <div className="st-ground" aria-hidden />
        </div>
      </div>

      <p className={`st-message ${state}`} role="status">{message}</p>

      {state !== 'done' && (
        <div className="st-controls">
          <button className="st-btn ghost" onClick={() => speak(sayPrompt(current.word, current.sentence))} aria-label="Hear the word again">🔊 Hear it</button>
          <SpellingInput
            ref={inputRef}
            className={`st-input ${state === 'good' ? 'ok' : state === 'bad' ? 'bad' : ''}`}
            value={input}
            onChange={(e) => {
              if (state === 'typing' && !locked.current) setInput(e.target.value)
            }}
            onKeyPress={(e) => e.key === 'Enter' && build()}
            placeholder="Spell it to build!"
            readOnly={state !== 'typing'}
            autoFocus
          />
          <button className="st-btn" onClick={build} disabled={state !== 'typing' || !input.trim()}>🧱 Build</button>
        </div>
      )}
    </div>
  )
}

export default SpellTower
