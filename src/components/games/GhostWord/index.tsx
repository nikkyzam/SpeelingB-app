import React, { useMemo, useState, useEffect, useRef } from 'react'
import type { Word } from '../../../services/wordBank'
import { useAudio } from '../../../contexts/AudioContext'
import { shuffle, isPlayable } from '../shared/wordTricks'
import { spellOut } from '../../../services/words/praise'
import sfx from '../shared/sfx'
import useCheer from '../shared/useCheer'
import useLater from '../shared/useLater'
import Burst from '../shared/Burst'
import GameEmpty from '../shared/GameEmpty'
import SpellingInput from '../../common/SpellingInput'
import './GhostWord.css'

interface GhostWordProps {
  onComplete: (score: number) => void
  words?: Word[]
  rounds?: number
  /** how long the word stays visible, in ms (by default it grows with the word) */
  peekMs?: number
}

type Phase = 'showing' | 'typing' | 'right' | 'wrong'

const CAUGHT = 25
const CAUGHT_AFTER_PEEK = 15
/** Three caught in a row and every ghost after is worth a little more. */
const STREAK_BONUS = 10

/** A long word needs a longer look: 2.1s for "cat", 3.5s for "elephant". */
export const lookTime = (word: string): number => 1500 + 200 * word.length

/**
 * The word appears… then vanishes. Type it back from memory!
 *
 * One peek per word: when peeking was unlimited, a child could look, type,
 * look again — copying, not remembering, which is the whole challenge.
 */
const GhostWord: React.FC<GhostWordProps> = ({ onComplete, words: providedWords, rounds = 5, peekMs }) => {
  const { speak } = useAudio()
  const cheer = useCheer()
  const later = useLater()

  const words = useMemo<Word[]>(() => {
    const pool = providedWords && providedWords.length > 0 ? providedWords : []
    return shuffle(pool).filter((w) => isPlayable(w, 3)).slice(0, rounds)
  }, [providedWords, rounds])

  const [index, setIndex] = useState(0)
  const [phase, setPhase] = useState<Phase>('showing')
  const [input, setInput] = useState('')
  const [score, setScore] = useState(0)
  const [caught, setCaught] = useState(0)
  const [peeked, setPeeked] = useState(false)
  const [cheerLine, setCheerLine] = useState('')
  const [hits, setHits] = useState(0)
  const [gainedNow, setGainedNow] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const locked = useRef(false)

  const current = words[index]
  const answer = (current?.word || '').toLowerCase()
  const look = peekMs ?? lookTime(answer)

  // Show the word, then let it fade away.
  useEffect(() => {
    if (!current) return
    setPhase('showing')
    setInput('')
    setPeeked(false)
    locked.current = false
    // Queued, so the last word's spoken correction (its letters) isn't cut off.
    speak(current.word, { queue: true })
    const t = window.setTimeout(() => {
      sfx.whoosh()
      setPhase('typing')
    }, look)
    return () => window.clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, words])

  // Focus once the box is really ready — focusing it in the same tick as the
  // phase change hit a box that wasn't live yet, so desktop needed a click.
  useEffect(() => {
    if (phase === 'typing') inputRef.current?.focus()
  }, [phase])

  if (!current) {
    return (
      <div className="ghost-word">
        <GameEmpty icon="👻">No words to haunt yet — learn a few first!</GameEmpty>
      </div>
    )
  }

  const advance = (gained: number, wait: number) => {
    later(() => {
      if (index < words.length - 1) {
        setPhase('showing')
        setInput('')
        setPeeked(false)
        setIndex((i) => i + 1)
      } else {
        onComplete(score + gained)
      }
    }, wait)
  }

  const check = () => {
    if (phase !== 'typing' || locked.current || !input.trim()) return
    locked.current = true
    if (input.trim().toLowerCase() === answer) {
      // A peek still counts, just for fewer points — trying is what matters.
      const streak = cheer.streak() + 1
      const gained = (peeked ? CAUGHT_AFTER_PEEK : CAUGHT) + (streak >= 3 ? STREAK_BONUS : 0)
      setScore((s) => s + gained)
      setGainedNow(gained)
      setCaught((c) => c + 1)
      setPhase('right')
      setCheerLine(cheer.hit({ say: 'You caught it!' }))
      setHits((h) => h + 1)
      advance(gained, 1500)
    } else {
      setPhase('wrong')
      setCheerLine(cheer.miss({ say: `It was ${current.word}. ${spellOut(current.word)}.` }))
      advance(0, 2600)
    }
  }

  const peek = () => {
    if (phase !== 'typing' || peeked || locked.current) return
    setPeeked(true)
    setPhase('showing')
    later(() => {
      sfx.whoosh()
      setPhase('typing')
    }, look)
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
          <div className="gw-word fading" style={{ animationDuration: `${look}ms` }}>{current.word}</div>
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
        <button className="gw-btn ghost" onClick={() => speak(current.word)} aria-label="Hear the word again">🔊 Hear it</button>
        {/* Read-only rather than disabled between turns: disabling hid the
            touch keypad and brought it back for every word. */}
        <SpellingInput
          ref={inputRef}
          className={`gw-input ${phase === 'right' ? 'ok' : phase === 'wrong' ? 'bad' : ''}`}
          value={input}
          onChange={(e) => {
            if (phase === 'typing' && !locked.current) setInput(e.target.value)
          }}
          onKeyPress={(e) => e.key === 'Enter' && check()}
          placeholder={phase === 'typing' ? 'Type it here...' : '...'}
          readOnly={phase !== 'typing'}
        />
        <button className="gw-btn" onClick={check} disabled={phase !== 'typing' || !input.trim()}>Catch it!</button>
        <button
          className="gw-btn ghost"
          onClick={peek}
          disabled={phase !== 'typing' || peeked}
          aria-label={peeked ? 'Peek used for this word' : 'Peek at the word once'}
        >
          {peeked ? '👀 Peeked' : '👀 Peek (1)'}
        </button>
      </div>

      {phase === 'right' && (
        <div className="gw-flash ok">
          <Burst trigger={hits} />
          🎉 {cheerLine} +{gainedNow}
        </div>
      )}
      {phase === 'wrong' && (
        <div className="gw-flash bad">{cheerLine} It was “{current.word}” — you'll get the next one! 💪</div>
      )}
    </div>
  )
}

export default GhostWord
