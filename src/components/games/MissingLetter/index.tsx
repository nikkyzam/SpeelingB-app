import React, { useState, useEffect, useMemo, useRef } from 'react'
import type { Word } from '../../../services/wordBank'
import { useAudio } from '../../../contexts/AudioContext'
import { shuffle, isPlayable, letterTraps } from '../shared/wordTricks'
import { maskClue } from '../shared/clues'
import { useCheer } from '../shared/useCheer'
import { useLater } from '../shared/useLater'
import Burst from '../shared/Burst'
import { spellOut } from '../../../services/words/praise'
import GameEmpty from '../shared/GameEmpty'
import './MissingLetter.css'

interface MissingLetterProps {
  onComplete: (score: number) => void
  words?: Word[]
  rounds?: number
}

export interface Puzzle {
  word: string
  clue: string
  missingIndex: number
  answer: string
  choices: string[]
}

/** How long a right answer stays up before the next word. */
const HIT_MS = 1300
/** A miss stays longer, so the right letter can be seen and heard. */
const MISS_MS = 2200

/**
 * One puzzle: a letter from the middle of the word (never the first or last,
 * which carry the word's shape) and three wrong letters a speller really
 * reaches for. Random letters ("q" for the "a" in "cat") were no choice at all.
 */
export const makePuzzle = (w: Word): Puzzle => {
  const word = w.word.toLowerCase()
  const missingIndex = 1 + Math.floor(Math.random() * (word.length - 2))
  const answer = word[missingIndex]
  const choices = shuffle([answer, ...letterTraps(word, missingIndex, 3)])
  const firstClause = (w.meaning || '').split(/[.;]/)[0].trim()
  return { word, clue: maskClue(firstClause, word), missingIndex, answer, choices }
}

/** Pick the letter that completes the word. Quick, satisfying, and teaches spelling. */
const MissingLetter: React.FC<MissingLetterProps> = ({ onComplete, words: providedWords, rounds = 6 }) => {
  const { speak } = useAudio()
  const cheer = useCheer()
  const later = useLater()

  const puzzles = useMemo<Puzzle[]>(() => {
    const pool = providedWords && providedWords.length > 0 ? providedWords : []
    return shuffle(pool).filter((w) => isPlayable(w, 3)).slice(0, rounds).map(makePuzzle)
  }, [providedWords, rounds])

  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [picked, setPicked] = useState<string | null>(null)
  const [line, setLine] = useState('')
  const [hits, setHits] = useState(0)
  // A state guard loses to a double tap; a ref settles each word exactly once.
  const settled = useRef(false)

  const puzzle = puzzles[index]

  useEffect(() => {
    // Queued, so "It was …" from the last word finishes first.
    if (puzzle) speak(puzzle.word, { queue: index > 0 })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, puzzles])

  /**
   * Clear the last answer in the same step as moving on. Cleared in an effect
   * after the index changed, the first frame of the next word still showed a
   * picked letter — and so the NEW answer, in green.
   */
  const nextPuzzle = () => {
    settled.current = false
    setPicked(null)
    setLine('')
    setIndex((i) => i + 1)
  }

  if (!puzzle) {
    return (
      <div className="missing-letter">
        <GameEmpty icon="🔡">No words to fill in yet — learn a few, then come back and find the missing letters!</GameEmpty>
      </div>
    )
  }

  const handlePick = (letter: string) => {
    if (settled.current) return
    settled.current = true
    setPicked(letter)
    const correct = letter === puzzle.answer
    const gained = correct ? 15 + streak * 3 : 0
    if (correct) {
      setScore((s) => s + gained)
      setStreak((s) => s + 1)
      setHits((h) => h + 1)
      setLine(cheer.hit({ say: puzzle.word }))
    } else {
      setStreak(0)
      setLine(cheer.miss({ say: `It was ${puzzle.word}: ${spellOut(puzzle.word)}.` }))
    }
    later(() => {
      if (index < puzzles.length - 1) nextPuzzle()
      else onComplete(score + gained)
    }, correct ? HIT_MS : MISS_MS)
  }

  const right = picked === puzzle.answer

  return (
    <div className="missing-letter">
      <div className="ml-header">
        <div className="ml-title">🔡 Missing Letter</div>
        <div className="ml-stats">
          <div className="ml-stat"><span>Word</span><strong>{index + 1}/{puzzles.length}</strong></div>
          <div className="ml-stat"><span>Score</span><strong>{score}</strong></div>
          <div className="ml-stat"><span>Streak</span><strong>🔥 {streak}</strong></div>
        </div>
      </div>

      <div className="ml-clue">
        <button className="ml-hear" onClick={() => speak(puzzle.word)}>🔊 Hear it again</button>
        {puzzle.clue && <p className="ml-meaning">Clue: {puzzle.clue}</p>}
      </div>

      <div className={`ml-word ${picked && !right ? 'shake' : ''}`} aria-label="The word with one letter missing">
        {puzzle.word.split('').map((ch, i) => {
          if (i !== puzzle.missingIndex) {
            return <span key={i} className="ml-cell">{ch.toUpperCase()}</span>
          }
          // After any answer the blank shows the RIGHT letter, in green — a
          // wrong letter left in the word is the spelling a child remembers.
          return (
            <span key={i} className={`ml-cell blank ${picked ? 'ok' : ''}`} data-testid="ml-blank">
              {picked ? puzzle.answer.toUpperCase() : '?'}
            </span>
          )
        })}
      </div>

      <div className="ml-choices">
        {puzzle.choices.map((letter) => {
          let cls = 'ml-choice'
          if (picked) {
            if (letter === puzzle.answer) cls += ' correct'
            else if (letter === picked) cls += ' missed'
          }
          return (
            <button key={letter} className={cls} onClick={() => handlePick(letter)} disabled={!!picked} aria-label={letter}>
              {letter.toUpperCase()}
            </button>
          )
        })}
      </div>

      {picked && (
        <div className={`ml-flash ${right ? 'ok' : 'bad'}`} role="status">
          {right ? (
            <>
              {line} 🎉
              <Burst trigger={hits} />
            </>
          ) : (
            <>
              {line} It was “{puzzle.word.toUpperCase()}” — you’ll get the next one! 💪
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default MissingLetter
