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
import './DragonDuel.css'
import SpellingInput from '../../common/SpellingInput'

interface DragonDuelProps {
  onComplete: (score: number) => void
  words?: Word[]
  /** how much dragon health each duel starts with */
  dragonHp?: number
}

type Phase = 'ready' | 'hit' | 'burned' | 'won' | 'sleepy'

const HEARTS = 5
const BASE_DAMAGE = 20
/** For a duel that ends with the dragon dozing off: every hit still counts. */
const SLEEPY_BONUS = 20

/**
 * A turn-based boss battle where spelling is your sword.
 *
 * Nobody loses: run out of hearts and all that spelling has made the dragon
 * sleepy — it curls up for a nap and the duel ends tamed anyway, with every
 * hit landed counting towards the score. A critical hit wins a heart back.
 */
const DragonDuel: React.FC<DragonDuelProps> = ({ onComplete, words: providedWords, dragonHp = 100 }) => {
  const { speak } = useAudio()
  const cheer = useCheer()
  const later = useLater()

  const words = useMemo<Word[]>(() => {
    const pool = providedWords && providedWords.length > 0 ? providedWords : []
    const usable = shuffle(pool).filter((w) => isPlayable(w))
    // Only their own words — a shorter duel is better than fighting strangers.
    return usable.slice(0, 20)
  }, [providedWords])

  const [index, setIndex] = useState(0)
  const [hp, setHp] = useState(dragonHp)
  const [hearts, setHearts] = useState(HEARTS)
  const [streak, setStreak] = useState(0)
  const [score, setScore] = useState(0)
  const [input, setInput] = useState('')
  const [phase, setPhase] = useState<Phase>('ready')
  const [message, setMessage] = useState('The dragon guards your words. Spell to strike!')
  const [lastDamage, setLastDamage] = useState<number | null>(null)
  const [hits, setHits] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const locked = useRef(false)
  /**
   * A short list comes round again. Only the first go at a word is a clean
   * recall — the second time, the child has just been shown it.
   */
  const recorded = useRef(new Set<string>())

  const current = words[index % Math.max(words.length, 1)]
  const answer = (current?.word || '').toLowerCase()
  const over = phase === 'won' || phase === 'sleepy'

  useEffect(() => {
    // Word, sentence, word: "tail" alone could be "tale", and a miss there is recorded.
    // Queued, so the last word's spoken correction (its letters) isn't cut off.
    if (current && !over) speak(sayPrompt(current.word, current.sentence), { queue: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, words])

  // Ready for the next word: put the caret back. The box stays mounted and
  // read-only between turns, so the touch keypad doesn't vanish and return.
  useEffect(() => {
    if (phase === 'ready') inputRef.current?.focus()
  }, [phase])

  if (!current) {
    return (
      <div className="dragon-duel">
        <GameEmpty icon="🐉">The dragon is napping — learn a few words to wake it!</GameEmpty>
      </div>
    )
  }

  const nextTurn = () => {
    setIndex((i) => i + 1)
    setInput('')
    setPhase('ready')
    locked.current = false
  }

  const attack = () => {
    if (over || phase !== 'ready' || locked.current || !input.trim()) return
    locked.current = true
    const ok = input.trim().toLowerCase() === answer

    // Typing a word you heard is a spelling test — tell the scheduler, once.
    if (!recorded.current.has(current.id)) {
      recorded.current.add(current.id)
      ReviewSchedule.record(current.id, ok)
    }

    if (ok) {
      // Three in a row lands a critical hit — streaks should feel spectacular.
      const critical = streak >= 2
      const damage = critical ? BASE_DAMAGE * 2 : BASE_DAMAGE
      const nextHp = Math.max(0, hp - damage)
      const gained = critical ? 50 : 25
      const healed = critical && hearts < HEARTS
      const nextHearts = healed ? hearts + 1 : hearts

      setHp(nextHp)
      setStreak((s) => s + 1)
      setScore((s) => s + gained)
      setLastDamage(damage)
      setHearts(nextHearts)
      setHits((h) => h + 1)
      setPhase('hit')
      const line = cheer.hit({ say: critical ? 'Critical hit!' : undefined })
      setMessage(
        critical
          ? `⚡ CRITICAL HIT! ${line}${healed ? ' 💖 You won back a heart!' : ''}`
          : `🗡️ ${line} A direct hit!`
      )

      if (nextHp === 0) {
        const total = score + gained + 100 + nextHearts * 20
        setScore(total)
        setPhase('won')
        setMessage('🏆 You tamed the dragon! It bows to your spelling!')
        sfx.win()
        speak('You won! The dragon is tamed!', { queue: true })
        later(() => onComplete(total), 2600)
        return
      }
      later(nextTurn, 1500)
      return
    }

    const left = hearts - 1
    setHearts(left)
    setStreak(0)
    setPhase('burned')
    setInput(answer)
    cheer.miss({ say: `It was ${current.word}. ${spellOut(current.word)}.` })
    setMessage(`💨 The dragon puffs smoke! It was “${current.word}”.`)

    if (left <= 0) {
      // No game over: the dragon is worn out by all that spelling.
      const total = score + SLEEPY_BONUS
      later(() => {
        setScore(total)
        setPhase('sleepy')
        setMessage('🥱 All that spelling made the dragon sleepy… it curls up for a nap. You tamed it! 💤')
        speak('All that spelling made the dragon sleepy. It curled up for a nap. You tamed it!', { queue: true })
      }, 2400)
      later(() => onComplete(total), 5000)
      return
    }
    later(nextTurn, 2600)
  }

  const hpPercent = (hp / dragonHp) * 100

  return (
    <div className="dragon-duel">
      <div className="dd-header">
        <div className="dd-title">🐉 Dragon Duel</div>
        <div className="dd-stats">
          <div className="dd-stat"><span>Score</span><strong>{score}</strong></div>
          <div className="dd-stat"><span>Streak</span><strong>🔥 {streak}</strong></div>
        </div>
      </div>

      <div className="dd-arena">
        {(phase === 'hit' || phase === 'won') && <Burst trigger={hits} />}
        <div
          className={`dd-dragon ${phase === 'hit' ? 'struck' : ''} ${phase === 'won' ? 'tamed' : ''} ${phase === 'sleepy' ? 'sleepy' : ''}`}
        >
          <span aria-hidden>{phase === 'won' ? '🥰' : phase === 'sleepy' ? '😴' : '🐉'}</span>
          {phase === 'hit' && lastDamage && <span className="dd-damage">-{lastDamage}</span>}
          {phase === 'burned' && <span className="dd-fire" aria-hidden>💨</span>}
          {phase === 'sleepy' && <span className="dd-zzz" aria-hidden>💤</span>}
        </div>
        <div className="dd-hp">
          <div className="dd-hp-fill" style={{ width: `${hpPercent}%` }} />
          <span className="dd-hp-text">{hp} / {dragonHp}</span>
        </div>
      </div>

      <div className="dd-hearts" aria-label={`${hearts} hearts left`}>
        {Array.from({ length: HEARTS }).map((_, i) => (
          <span key={i} className={`dd-heart ${i < hearts ? '' : 'gone'}`} aria-hidden>
            {i < hearts ? '❤️' : '🤍'}
          </span>
        ))}
      </div>

      <p className={`dd-message ${phase}`} role="status">{message}</p>

      {!over && (
        <>
          <div className="dd-blanks">
            {answer.split('').map((_c, i) => (
              <span key={i} className="dd-blank">_</span>
            ))}
          </div>

          <div className="dd-controls">
            <button className="dd-btn ghost" onClick={() => speak(sayPrompt(current.word, current.sentence))} aria-label="Hear the word again">🔊 Hear it</button>
            <SpellingInput
              ref={inputRef}
              className={`dd-input ${phase === 'hit' ? 'ok' : phase === 'burned' ? 'bad' : ''}`}
              value={input}
              onChange={(e) => {
                if (phase === 'ready' && !locked.current) setInput(e.target.value)
              }}
              onKeyPress={(e) => e.key === 'Enter' && attack()}
              placeholder="Spell it to attack!"
              readOnly={phase !== 'ready'}
              autoFocus
            />
            <button className="dd-btn" onClick={attack} disabled={phase !== 'ready' || !input.trim()}>⚔️ Attack!</button>
          </div>
        </>
      )}
    </div>
  )
}

export default DragonDuel
