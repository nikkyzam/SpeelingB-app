import React, { useEffect, useMemo, useRef, useState } from 'react'
import type { Word } from '../../../services/wordBank'
import { useAudio } from '../../../contexts/AudioContext'
import { shuffle, isPlayable } from '../shared/wordTricks'
import ReviewSchedule from '../../../services/progress/ReviewSchedule'
import sfx from '../shared/sfx'
import './SpellTower.css'

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

const MAX_WOBBLE = 3

/**
 * Every word spelled right becomes another floor of your tower.
 *
 * The reward isn't a number going up, it's a building growing on screen — kids
 * will spell one more word just to see the roof go on.
 */
const SpellTower: React.FC<SpellTowerProps> = ({ onComplete, words: providedWords, floors = 8 }) => {
  const { speak } = useAudio()

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
  const inputRef = useRef<HTMLInputElement>(null)

  const current = words[index]

  useEffect(() => {
    if (current && state !== 'done') speak(current.word)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index])

  if (!current) {
    return (
      <div className="spell-tower">
        <p className="st-empty">No bricks yet — learn a few words and come build! 🏰</p>
        <button className="st-btn" onClick={() => onComplete(0)}>Back to Games</button>
      </div>
    )
  }

  const nextWord = () => {
    setInput('')
    setState('typing')
    setIndex((i) => i + 1)
    inputRef.current?.focus()
  }

  const build = () => {
    if (state !== 'typing' || !input.trim()) return

    // Same as a spelling round: record it so review targets what's shaky.
    ReviewSchedule.record(current.id, input.trim().toLowerCase() === current.word.toLowerCase())

    if (input.trim().toLowerCase() === current.word.toLowerCase()) {
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
      setState('good')
      sfx.thud()
      setMessage(`🧱 Floor ${nextBuilt.length} added! +${points}`)

      if (nextBuilt.length >= words.length) {
        const total = score + points + 100
        setScore(total)
        setState('done')
        setMessage('🏰 Your tower is finished! Look at that view!')
        sfx.win()
        speak('You built the whole tower!')
        setTimeout(() => onComplete(total), 2800)
        return
      }
      setTimeout(nextWord, 1200)
    } else {
      const nextWobble = wobble + 1
      setWobble(nextWobble)
      setState('bad')
      sfx.wrong()
      speak(`It was ${current.word}`)

      if (nextWobble >= MAX_WOBBLE && built.length > 0) {
        // Three wobbles knocks the top block off — but never the whole tower.
        setBuilt((b) => b.slice(0, -1))
        setWobble(0)
        setMessage(`😮 Wobble! A block slipped off. It was “${current.word}”.`)
      } else {
        setMessage(`Not quite — it was “${current.word}”. The tower wobbles!`)
      }
      setTimeout(nextWord, 2100)
    }
  }

  const roofOn = built.length >= words.length

  return (
    <div className="spell-tower">
      <div className="st-header">
        <div className="st-title">🏰 Spell Tower</div>
        <div className="st-stats">
          <div className="st-stat"><span>Floors</span><strong>{built.length}/{words.length}</strong></div>
          <div className="st-stat"><span>Score</span><strong>{score}</strong></div>
          <div className="st-stat"><span>Wobble</span><strong>{'😬'.repeat(wobble) || '😌'}</strong></div>
        </div>
      </div>

      <div className={`st-site ${state === 'bad' ? 'wobbling' : ''}`}>
        <div className="st-sky">
          <span className="st-cloud c1" aria-hidden>☁️</span>
          <span className="st-cloud c2" aria-hidden>☁️</span>
        </div>

        <div className="st-stack">
          {roofOn && <div className="st-roof" aria-hidden>🚩</div>}
          {[...built].reverse().map((f, i) => (
            <div
              key={`${f.word}-${i}`}
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

      <p className={`st-message ${state}`}>{message}</p>

      {state !== 'done' && (
        <div className="st-controls">
          <button className="st-btn ghost" onClick={() => speak(current.word)} aria-label="Hear the word again">🔊 Hear it</button>
          <input
            ref={inputRef}
            className={`st-input ${state === 'good' ? 'ok' : state === 'bad' ? 'bad' : ''}`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && build()}
            placeholder="Spell it to build!"
            disabled={state !== 'typing'}
            autoFocus
          />
          <button className="st-btn" onClick={build} disabled={state !== 'typing' || !input.trim()}>🧱 Build</button>
        </div>
      )}
    </div>
  )
}

export default SpellTower
