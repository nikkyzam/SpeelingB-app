import React, { useState, useMemo, useRef } from 'react'
import type { Word } from '../../../services/wordBank'
import { useAudio } from '../../../contexts/AudioContext'
import { shuffle, isPlayable } from '../shared/wordTricks'
import { maskClue } from '../shared/clues'
import { useCheer } from '../shared/useCheer'
import { useLater } from '../shared/useLater'
import sfx from '../shared/sfx'
import Burst from '../shared/Burst'
import GameEmpty from '../shared/GameEmpty'
import './MemoryMatch.css'

export interface Card {
  id: number
  content: string
  type: 'word' | 'meaning'
  matchedWord: string
}

interface MemoryMatchProps {
  onComplete: (score: number) => void
  /** Kept for old callers; the board is sized by `pairs`. */
  gridSize?: number
  words?: Word[]
  /** Pairs on the board: six is twelve cards, about right for a five-year-old's memory. */
  pairs?: number
}

const POINTS_PER_PAIR = 25
/** Most clue words a card shows — a whole dictionary entry won't fit a card or a young reader. */
const CLUE_WORDS = 8
const CHECK_MS = 900
const FINISH_MS = 1600

/**
 * The bonus for a sharp memory, added once at the end. Every pair takes at
 * least one turn; each extra turn costs a little of the bonus, never the
 * points already won — a score that shrinks as a child plays feels like
 * being told off.
 */
export const memoryBonus = (pairs: number, turns: number): number =>
  Math.max(0, pairs * 15 - Math.max(0, turns - pairs) * 8)

/**
 * A meaning short enough for a card: the first clause, the word itself
 * blanked out (a clue that says the word is a copy, not a match), at most
 * eight words.
 */
export const shortClue = (meaning: string, word: string): string => {
  let clause = (meaning || '').split(/[.;:(]/)[0].trim()
  const words = clause.split(/\s+/)
  if (words.length > CLUE_WORDS) {
    const comma = clause.indexOf(',')
    clause = comma > 0 && clause.slice(0, comma).split(/\s+/).length >= 3
      ? clause.slice(0, comma)
      : words.slice(0, CLUE_WORDS).join(' ') + '…'
  }
  return maskClue(clause, word)
}

export const dealCards = (words: Word[], pairs: number): Card[] => {
  const chosen = shuffle(words.filter((w) => isPlayable(w, 3) && (w.meaning || '').trim())).slice(0, pairs)
  const cards: Card[] = []
  chosen.forEach((w, i) => {
    const word = w.word.toLowerCase()
    cards.push({ id: i * 2, content: word, type: 'word', matchedWord: word })
    cards.push({ id: i * 2 + 1, content: shortClue(w.meaning, word), type: 'meaning', matchedWord: word })
  })
  return shuffle(cards)
}

/** Flip two cards: find each word and the card that says what it means. */
const MemoryMatch: React.FC<MemoryMatchProps> = ({ onComplete, words: providedWords, pairs = 6 }) => {
  const { speak } = useAudio()
  const cheer = useCheer()
  const later = useLater()

  const cards = useMemo(() => dealCards(providedWords || [], pairs), [providedWords, pairs])
  const totalPairs = cards.length / 2

  const [flipped, setFlipped] = useState<number[]>([])
  const [matched, setMatched] = useState<Set<number>>(new Set())
  const [matches, setMatches] = useState(0)
  const [turns, setTurns] = useState(0)
  const [line, setLine] = useState('')
  const [bonus, setBonus] = useState<number | null>(null)
  // A third tap while two cards are face up waits; the last pair pays once.
  const checking = useRef(false)
  const finished = useRef(false)
  // Only the newest cheer may clear the flash.
  const flashId = useRef(0)

  if (totalPairs === 0) {
    return (
      <div className="memory-match">
        <GameEmpty icon="🧠">No word pairs yet — learn a few words, then come back and match them to their meanings!</GameEmpty>
      </div>
    )
  }

  const byId = (id: number) => cards.find((c) => c.id === id)!

  const handleCardClick = (id: number) => {
    if (checking.current || finished.current) return
    if (flipped.includes(id) || matched.has(id)) return

    const card = byId(id)
    sfx.tap()
    // Hearing the card read out lets a child who can't read the clue yet play too.
    speak(card.type === 'word' ? card.content : card.content.replace(/_+/g, 'blank'))
    const nowUp = [...flipped, id]
    setFlipped(nowUp)
    if (nowUp.length < 2) return

    checking.current = true
    const turnsNow = turns + 1
    setTurns(turnsNow)
    const [a, b] = nowUp.map(byId)
    later(() => {
      if (a.matchedWord === b.matchedWord) {
        const nextMatched = new Set(matched)
        nextMatched.add(a.id)
        nextMatched.add(b.id)
        setMatched(nextMatched)
        const found = matches + 1
        setMatches(found)
        setLine(cheer.hit({ say: a.matchedWord }))
        const id = ++flashId.current
        later(() => {
          if (flashId.current === id && !finished.current) setLine('')
        }, 1400)
        if (found === totalPairs) {
          finished.current = true
          const extra = memoryBonus(totalPairs, turnsNow)
          setBonus(extra)
          later(() => onComplete(totalPairs * POINTS_PER_PAIR + extra), FINISH_MS)
        }
      } else {
        // Not a pair: they just turn back over. No "wrong" sound — missing
        // is how a memory game is played.
        sfx.whoosh()
      }
      setFlipped([])
      checking.current = false
    }, CHECK_MS)
  }

  return (
    <div className="memory-match">
      <div className="mm-header">
        <div className="mm-title">🧠 Memory Match</div>
        <div className="mm-stats">
          <div className="mm-stat">
            <span className="mm-stat-label">Matches</span>
            <span className="mm-stat-value">{matches}/{totalPairs}</span>
          </div>
        </div>
      </div>

      <p className="mm-instructions">Match each word to what it means! Tap a card to turn it over.</p>

      <div className="mm-board">
        <div className="mm-grid">
          {cards.map((card) => {
            const up = flipped.includes(card.id) || matched.has(card.id)
            return (
              <button
                key={card.id}
                className={`mm-card ${up ? 'flipped' : ''} ${matched.has(card.id) ? 'matched' : ''} ${card.type}`}
                onClick={() => handleCardClick(card.id)}
                disabled={up}
                aria-label={up ? card.content : 'Face-down card'}
              >
                <span className="mm-front" aria-hidden>❓</span>
                <span className="mm-back" aria-hidden>
                  <span className="mm-type">{card.type === 'word' ? '🔤' : '📖'}</span>
                  <span className={card.type === 'word' ? 'mm-word' : 'mm-clue'}>{card.content}</span>
                  {matched.has(card.id) && <span className="mm-tick">✅</span>}
                </span>
              </button>
            )
          })}
        </div>
        {line && (
          <div className="mm-flash ok" role="status" key={matches}>
            {line}
            <Burst trigger={matches} />
          </div>
        )}
      </div>

      {bonus !== null && (
        <div className="mm-done" role="status">🎉 All matched! +{bonus} memory bonus</div>
      )}
    </div>
  )
}

export default MemoryMatch
