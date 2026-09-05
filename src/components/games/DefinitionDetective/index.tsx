import React, { useEffect, useMemo, useState } from 'react'
import type { Word } from '../../../services/wordBank'
import { useAudio } from '../../../contexts/AudioContext'
import ReviewSchedule from '../../../services/progress/ReviewSchedule'
import { shuffle, isPlayable } from '../shared/wordTricks'
import sfx from '../shared/sfx'
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
const DefinitionDetective: React.FC<DefinitionDetectiveProps> = ({
  onComplete,
  words: providedWords,
  rounds = 6,
}) => {
  const { speak } = useAudio()

  const cases = useMemo<Case[]>(() => {
    const pool = providedWords && providedWords.length > 0 ? providedWords : []
    // Only words that actually carry a meaning can be a case.
    const withMeaning = pool.filter((w) => isPlayable(w) && (w.meaning || '').trim().length > 8)
    // Suspects and culprits alike are drawn only from words they've met.
    const usable = withMeaning

    return shuffle(usable)
      .slice(0, rounds)
      .map((word) => {
        // Suspects: the real word plus two others that aren't it.
        const others = shuffle(usable.filter((w) => w.id !== word.id)).slice(0, 2)
        return {
          word,
          clue: (word.meaning || '').split('.')[0],
          options: shuffle([word, ...others]),
        }
      })
      .filter((c) => c.options.length === 3)
  }, [providedWords, rounds])

  const [index, setIndex] = useState(0)
  const [picked, setPicked] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [solved, setSolved] = useState(0)

  const current = cases[index]

  useEffect(() => {
    if (current) speak(current.clue)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index])

  if (!current) {
    return (
      <div className="definition-detective">
        <p className="dd2-empty">No cases to solve yet — learn a few words first! 🕵️</p>
        <button className="dd2-btn" onClick={() => onComplete(0)}>Back to Games</button>
      </div>
    )
  }

  const choose = (option: Word) => {
    if (picked) return
    setPicked(option.id)

    const correct = option.id === current.word.id
    // Recognising a word from its meaning is real recall — it counts.
    ReviewSchedule.record(current.word.id, correct)

    let points = 0
    if (correct) {
      points = 30
      setScore((s) => s + points)
      setSolved((n) => n + 1)
      sfx.correct()
      speak(`${current.word.word}. Case closed!`)
    } else {
      sfx.wrong()
      speak(`It was ${current.word.word}`)
    }

    setTimeout(() => {
      if (index < cases.length - 1) {
        setIndex((i) => i + 1)
        setPicked(null)
      } else {
        sfx.win()
        onComplete(score + points)
      }
    }, correct ? 1800 : 2600)
  }

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

      <p className="dd2-brief">Which word fits the clue?</p>

      <div className="dd2-clue">
        <span className="dd2-clue-mark" aria-hidden>“</span>
        <span className="dd2-clue-text">{current.clue}</span>
        <button className="dd2-speak" onClick={() => speak(current.clue)} aria-label="Hear the clue again">🔊</button>
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
        <div className={`dd2-verdict ${picked === current.word.id ? 'ok' : 'bad'}`}>
          {picked === current.word.id
            ? `🎉 Case closed — it was “${current.word.word}”!`
            : `The answer was “${current.word.word}”. ${current.word.sentence || ''}`}
        </div>
      )}
    </div>
  )
}

export default DefinitionDetective
