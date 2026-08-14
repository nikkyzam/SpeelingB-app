import React, { useMemo, useState, useEffect, useRef } from 'react'
import { wordBank, Word } from '../../../services/wordBank'
import { useAudio } from '../../../contexts/AudioContext'
import { shuffle } from '../shared/wordTricks'
import './GhostWord.css'

interface GhostWordProps {
  onComplete: (score: number) => void
  words?: Word[]
  rounds?: number
  /** how long the word stays visible, in ms */
  peekMs?: number
}

type Phase = 'showing' | 'typing' | 'right' | 'wrong'

/** The word appears… then vanishes. Type it back from memory! */
const GhostWord: React.FC<GhostWordProps> = ({ onComplete, words: providedWords, rounds = 5, peekMs = 2500 }) => {
  const { speak } = useAudio()

  const words = useMemo<Word[]>(() => {
    const pool = providedWords && providedWords.length > 0 ? providedWords : wordBank.getRandomWords(30)
    return shuffle(pool).filter((w) => /^[a-z]+$/i.test(w.word) && w.word.length >= 3).slice(0, rounds)
  }, [providedWords, rounds])

  const [index, setIndex] = useState(0)
  const [phase, setPhase] = useState<Phase>('showing')
  const [input, setInput] = useState('')
  const [score, setScore] = useState(0)
  const [caught, setCaught] = useState(0)
  const [peeked, setPeeked] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const current = words[index]
  const answer = (current?.word || '').toLowerCase()

  // Show the word, then let it fade away.
  useEffect(() => {
    if (!current) return
    setPhase('showing')
    setInput('')
    setPeeked(false)
    speak(current.word)
    const t = setTimeout(() => {
      setPhase('typing')
      inputRef.current?.focus()
    }, peekMs)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, words])

  if (!current) {
    return (
      <div className="ghost-word">
        <p className="gw-empty">No words to haunt yet — learn a few first! 👻</p>
        <button className="gw-btn" onClick={() => onComplete(0)}>Back to Games</button>
      </div>
    )
  }

  const advance = (gained: number) => {
    setTimeout(() => {
      if (index < words.length - 1) {
        setIndex((i) => i + 1)
      } else {
        onComplete(score + gained)
      }
    }, 1400)
  }

  const check = () => {
    if (phase !== 'typing') return
    if (input.trim().toLowerCase() === answer) {
      // A peek still counts, just for fewer points — trying is what matters.
      const gained = peeked ? 10 : 25
      setScore((s) => s + gained)
      setCaught((c) => c + 1)
      setPhase('right')
      speak('You caught it!')
      advance(gained)
    } else {
      setPhase('wrong')
      speak(`It was ${current.word}`)
      advance(0)
    }
  }

  const peek = () => {
    if (phase !== 'typing') return
    setPeeked(true)
    setPhase('showing')
    setTimeout(() => {
      setPhase('typing')
      inputRef.current?.focus()
    }, 1200)
  }

  return (
    <div className="ghost-word">
      <div className="gw-header">
        <div className="gw-title">👻 Ghost Word</div>
        <div className="gw-stats">
          <div className="gw-stat"><span>Word</span><strong>{index + 1}/{words.length}</strong></div>
          <div className="gw-stat"><span>Score</span><strong>{score}</strong></div>
          <div className="gw-stat"><span>Caught</span><strong>👻 {caught}</strong></div>
        </div>
      </div>

      <div className="gw-stage">
        {phase === 'showing' ? (
          <div className="gw-word fading">{current.word}</div>
        ) : phase === 'right' ? (
          <div className="gw-word caught">{current.word} ✨</div>
        ) : phase === 'wrong' ? (
          <div className="gw-word revealed">{current.word}</div>
        ) : (
          <div className="gw-poof">
            <span className="gw-ghost" aria-hidden>👻</span>
            <span className="gw-poof-text">Poof! What was it?</span>
          </div>
        )}
      </div>

      <p className="gw-hint">
        {phase === 'showing' ? 'Remember it…' : 'Type the word you saw!'}
      </p>

      <div className="gw-answer">
        <input
          ref={inputRef}
          className={`gw-input ${phase === 'right' ? 'ok' : phase === 'wrong' ? 'bad' : ''}`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && check()}
          placeholder={phase === 'typing' ? 'Type it here...' : '...'}
          disabled={phase !== 'typing'}
        />
        <button className="gw-btn" onClick={check} disabled={phase !== 'typing' || !input.trim()}>Catch it!</button>
        <button className="gw-btn ghost" onClick={peek} disabled={phase !== 'typing'}>👀 Peek</button>
      </div>

      {phase === 'right' && <div className="gw-flash ok">🎉 You caught the ghost word! +{peeked ? 10 : 25}</div>}
      {phase === 'wrong' && <div className="gw-flash bad">It was “{current.word}” — you'll get the next one! 💪</div>}
    </div>
  )
}

export default GhostWord
