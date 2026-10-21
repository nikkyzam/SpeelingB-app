import React, { useEffect, useMemo, useRef, useState } from 'react'
import type { Word } from '../../../services/wordBank'
import { useAudio } from '../../../contexts/AudioContext'
import ReviewSchedule from '../../../services/progress/ReviewSchedule'
import { shuffle, isPlayable } from '../shared/wordTricks'
import { maskClue } from '../shared/clues'
import useCheer from '../shared/useCheer'
import useLater from '../shared/useLater'
import Burst from '../shared/Burst'
import GameEmpty from '../shared/GameEmpty'
import './DefinitionDetective.css'

interface DefinitionDetectiveProps {
  onComplete: (score: number) => void
  words?: Word[]
  rounds?: number
}

interface Case {
  word: Word
  clue: string
  options: Word[]
}

/**
 * Knowing how to spell a word is not the same as knowing what it means.
 *
 * The word bank has carried a meaning for every word all along and no game has
 * ever used one. This works the other way round from the rest of the app: the
 * meaning is the question and the word is the answer, which is what "knowing a
 * word" actually looks like.
 */
/** A blanked-out clue read aloud: "a ____ of bees" → "a blank of bees". */
const spokenClue = (clue: string) => clue.replace(/_{2,}/g, 'blank')

const DefinitionDetective: React.FC<DefinitionDetectiveProps> = ({
  onComplete,
  words: providedWords,
  rounds = 6,
}) => {
  const { speak } = useAudio()
  const cheer = useCheer()
  const later = useLater()

  const cases = useMemo<Case[]>(() => {
    const pool = providedWords && providedWords.length > 0 ? providedWords : []
    // Only words that actually carry a meaning can be a case. One per
    // spelling: two "bear"s on the buttons would make a right tap look wrong.
    const seen = new Set<string>()
    const usable = pool.filter((w) => {
      const key = w.word.toLowerCase()
      if (!isPlayable(w) || (w.meaning || '').trim().length <= 8 || seen.has(key)) return false
      seen.add(key)
      return true
    })

    return shuffle(usable)
      .slice(0, rounds)
      .map((word) => {
        // Suspects: the real word plus two others that aren't it, drawn only
        // from words they've met.
        const others = shuffle(usable.filter((w) => w.id !== word.id)).slice(0, 2)
        return {
          word,
          // A definition can name its own word ("a tag is a label tagged…"),
          // which turns the case into copying. Blank it out.
          clue: maskClue((word.meaning || '').split('.')[0], word.word),
          options: shuffle([word, ...others]),
        }
      })
      .filter((c) => c.options.length === 3)
  }, [providedWords, rounds])

  const [index, setIndex] = useState(0)
  const [picked, setPicked] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [solved, setSolved] = useState(0)
  const [streak, setStreak] = useState(0)
  const [line, setLine] = useState('')
  const [hits, setHits] = useState(0)

  // A state guard loses to a fast double tap: both taps read `picked` as
  // null, so the word was recorded twice and a case was skipped. A ref
  // settles at once.
  const locked = useRef(false)

  const current = cases[index]

  useEffect(() => {
    if (!current) return
    locked.current = false
    speak(spokenClue(current.clue))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, cases])

  if (!current) {
    return (
      <div className="definition-detective">
        <GameEmpty icon="🕵️">No cases to solve yet — learn a few words first, then come back!</GameEmpty>
      </div>
    )
  }

  const choose = (option: Word) => {
    if (locked.current) return
    locked.current = true
    setPicked(option.id)

    const correct = option.id === current.word.id
    // Recognising a word from its meaning is real recall — it counts, once.
    ReviewSchedule.record(current.word.id, correct)

    let points = 0
    if (correct) {
      points = 30
      setScore((s) => s + points)
      setSolved((n) => n + 1)
      setStreak((n) => n + 1)
      setHits((h) => h + 1)
      setLine(cheer.hit({ say: `${current.word.word}. Case closed!` }))
    } else {
      setStreak(0)
      setLine(cheer.miss({ say: `It was ${current.word.word}.` }))
    }

    later(() => {
      if (index < cases.length - 1) {
        // Cleared in the same update, so the next case never shows this verdict.
        setPicked(null)
        setIndex((i) => i + 1)
      } else {
        onComplete(score + points)
      }
    }, correct ? 1800 : 2600)
  }

  const right = picked === current.word.id

  return (
    <div className="definition-detective">
      <div className="dd2-header">
        <div className="dd2-title">🕵️ Definition Detective</div>
        <div className="dd2-stats">
          <div className="dd2-stat"><span>Case</span><strong>{index + 1}/{cases.length}</strong></div>
          <div className="dd2-stat"><span>Score</span><strong>{score}</strong></div>
          <div className="dd2-stat"><span>Solved</span><strong>🔍 {solved}</strong></div>
        </div>
      </div>

      <p className="dd2-brief">
        Which word fits the clue?
        {streak >= 2 && <span className="dd2-streak"> 🔥 {streak} in a row</span>}
      </p>

      <div className="dd2-clue">
        <span className="dd2-clue-mark" aria-hidden>“</span>
        <span className="dd2-clue-text">{current.clue}</span>
        <button className="dd2-speak" onClick={() => speak(spokenClue(current.clue))} aria-label="Hear the clue again">🔊</button>
      </div>

      <div className="dd2-suspects">
        {current.options.map((o) => {
          let cls = 'dd2-suspect'
          if (picked) {
            if (o.id === current.word.id) cls += ' right'
            else if (o.id === picked) cls += ' wrong'
            else cls += ' dim'
          }
          return (
            <button key={o.id} className={cls} onClick={() => choose(o)} disabled={!!picked}>
              {o.word}
            </button>
          )
        })}
      </div>

      {picked && (
        <div className={`dd2-verdict ${right ? 'ok' : 'bad'}`} role="status">
          {right && <Burst trigger={hits} emoji={['🔍', '⭐', '✨', '🕵️']} />}
          {right
            ? `🎉 ${line} Case closed — it was “${current.word.word}”!`
            : `${line} It was “${current.word.word}”. ${current.word.sentence || ''}`}
        </div>
      )}
    </div>
  )
}

export default DefinitionDetective
