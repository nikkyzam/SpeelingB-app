import React, { useEffect, useMemo, useRef, useState } from 'react'
import { wordBank, Word } from '../../../services/wordBank'
import { useAudio } from '../../../contexts/AudioContext'
import { shuffle, isPlayable } from '../shared/wordTricks'
import sfx from '../shared/sfx'
import './DragonDuel.css'

interface DragonDuelProps {
  onComplete: (score: number) => void
  words?: Word[]
  /** how much dragon health each duel starts with */
  dragonHp?: number
}

type Phase = 'ready' | 'hit' | 'burned' | 'won' | 'lost'

const HEARTS = 5
const BASE_DAMAGE = 20

/**
 * A turn-based boss battle where spelling is your sword.
 *
 * Losing is soft on purpose: run out of hearts and the dragon simply flies off
 * with a friendly roar, and every hit landed still counts towards the score.
 */
const DragonDuel: React.FC<DragonDuelProps> = ({ onComplete, words: providedWords, dragonHp = 100 }) => {
  const { speak } = useAudio()

  const words = useMemo<Word[]>(() => {
    const pool = providedWords && providedWords.length > 0 ? providedWords : wordBank.getRandomWords(40)
    const usable = shuffle(pool).filter((w) => isPlayable(w))
    if (usable.length >= 10) return usable
    return [...usable, ...shuffle(wordBank.getRandomWords(60)).filter((w) => isPlayable(w))].slice(0, 20)
  }, [providedWords])

  const [index, setIndex] = useState(0)
  const [hp, setHp] = useState(dragonHp)
  const [hearts, setHearts] = useState(HEARTS)
  const [streak, setStreak] = useState(0)
  const [score, setScore] = useState(0)
  const [input, setInput] = useState('')
  const [phase, setPhase] = useState<Phase>('ready')
  const [message, setMessage] = useState('The dragon guards your words. Spell to strike!')
  const [potionUsed, setPotionUsed] = useState(false)
  const [revealFirst, setRevealFirst] = useState(false)
  const [lastDamage, setLastDamage] = useState<number | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const current = words[index % Math.max(words.length, 1)]
  const answer = (current?.word || '').toLowerCase()
  const over = phase === 'won' || phase === 'lost'

  useEffect(() => {
    if (current && !over) speak(current.word)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index])

  if (!current) {
    return (
      <div className="dragon-duel">
        <p className="dd-empty">The dragon is napping — learn a few words to wake it! 🐉</p>
        <button className="dd-btn" onClick={() => onComplete(0)}>Back to Games</button>
      </div>
    )
  }

  const nextTurn = () => {
    setIndex((i) => i + 1)
    setInput('')
    setRevealFirst(false)
    setPhase('ready')
    inputRef.current?.focus()
  }

  const attack = () => {
    if (over || phase !== 'ready' || !input.trim()) return

    if (input.trim().toLowerCase() === answer) {
      // Three in a row lands a critical hit — streaks should feel spectacular.
      const critical = streak >= 2
      const damage = critical ? BASE_DAMAGE * 2 : BASE_DAMAGE
      const nextHp = Math.max(0, hp - damage)
      const gained = critical ? 50 : 25

      setHp(nextHp)
      setStreak((s) => s + 1)
      setScore((s) => s + gained)
      setLastDamage(damage)
      setPhase('hit')
      sfx.correct()
      setMessage(critical ? '⚡ CRITICAL HIT! The dragon staggers!' : '🗡️ A direct hit!')

      if (nextHp === 0) {
        const total = score + gained + 100 + hearts * 20
        setScore(total)
        setPhase('won')
        setMessage('🏆 You tamed the dragon! It bows to your spelling!')
        sfx.win()
        speak('You won! The dragon is tamed!')
        setTimeout(() => onComplete(total), 2600)
        return
      }
      setTimeout(nextTurn, 1500)
    } else {
      const left = hearts - 1
      setHearts(left)
      setStreak(0)
      setPhase('burned')
      sfx.wrong()
      setMessage(`🔥 Whoosh! It was “${current.word}”.`)
      speak(`It was ${current.word}`)

      if (left <= 0) {
        const total = score + 10
        setScore(total)
        setPhase('lost')
        setMessage('The dragon flew away with a friendly roar. Try again — you were close! 🐉')
        setTimeout(() => onComplete(total), 2600)
        return
      }
      setTimeout(nextTurn, 2000)
    }
  }

  const drinkPotion = () => {
    if (potionUsed || over) return
    setPotionUsed(true)
    setRevealFirst(true)
    sfx.star()
    setMessage('🧪 The potion shows you the first letter!')
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
        <div className={`dd-dragon ${phase === 'hit' ? 'struck' : ''} ${phase === 'won' ? 'tamed' : ''}`}>
          <span aria-hidden>{phase === 'won' ? '🥰' : '🐉'}</span>
          {phase === 'hit' && lastDamage && <span className="dd-damage">-{lastDamage}</span>}
          {phase === 'burned' && <span className="dd-fire" aria-hidden>🔥</span>}
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

      <p className={`dd-message ${phase}`}>{message}</p>

      {!over && (
        <>
          <div className="dd-blanks">
            {answer.split('').map((c, i) => (
              <span key={i} className="dd-blank">{revealFirst && i === 0 ? c.toUpperCase() : '_'}</span>
            ))}
          </div>

          <div className="dd-controls">
            <button className="dd-btn ghost" onClick={() => speak(current.word)} aria-label="Hear the word again">🔊 Hear it</button>
            <input
              ref={inputRef}
              className={`dd-input ${phase === 'hit' ? 'ok' : phase === 'burned' ? 'bad' : ''}`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && attack()}
              placeholder="Spell it to attack!"
              disabled={phase !== 'ready'}
              autoFocus
            />
            <button className="dd-btn" onClick={attack} disabled={phase !== 'ready' || !input.trim()}>⚔️ Attack!</button>
          </div>

          <button className="dd-btn potion" onClick={drinkPotion} disabled={potionUsed}>
            {potionUsed ? '🧪 Potion used' : '🧪 Use potion (show first letter)'}
          </button>
        </>
      )}
    </div>
  )
}

export default DragonDuel
