import React, { useMemo, useState } from 'react'
import { wordBank, Word } from '../../../services/wordBank'
import { useAudio } from '../../../contexts/AudioContext'
import { shuffle, misspell } from '../shared/wordTricks'
import './TypoDetective.css'

interface TypoDetectiveProps {
  onComplete: (score: number) => void
  words?: Word[]
  rounds?: number
}

interface Case {
  tokens: string[] // sentence split into words (punctuation kept attached)
  culpritIndex: number // which token is misspelled
  correct: string // how it should be spelled
}

/** Build a "case": one sentence with exactly one word secretly misspelled. */
const buildCase = (w: Word): Case | null => {
  const clean = (w.sentence || '').trim()
  if (!clean) return null
  const tokens = clean.split(/\s+/)
  // Find the target word inside its own sentence (ignoring punctuation/case).
  const idx = tokens.findIndex(
    (t) => t.replace(/[^a-zA-Z]/g, '').toLowerCase() === w.word.toLowerCase()
  )
  if (idx === -1) return null

  const token = tokens[idx]
  const letters = token.replace(/[^a-zA-Z]/g, '')
  const bad = misspell(letters.toLowerCase())
  if (!bad || bad === letters.toLowerCase()) return null

  // Preserve the original capitalisation and any punctuation around the word.
  const cased = letters[0] === letters[0]?.toUpperCase() ? bad[0].toUpperCase() + bad.slice(1) : bad
  const swapped = token.replace(letters, cased)

  const next = [...tokens]
  next[idx] = swapped
  return { tokens: next, culpritIndex: idx, correct: token }
}

/** Read a sentence and catch the ONE word that's spelled wrong. */
const TypoDetective: React.FC<TypoDetectiveProps> = ({ onComplete, words: providedWords, rounds = 5 }) => {
  const { speak } = useAudio()

  const cases = useMemo<Case[]>(() => {
    const pool = providedWords && providedWords.length > 0 ? providedWords : wordBank.getRandomWords(40)
    const built = shuffle(pool)
      .map(buildCase)
      .filter((c): c is Case => !!c)
    if (built.length >= rounds) return built.slice(0, rounds)
    // Top up from the whole bank if this child's words lacked usable sentences.
    const extra = shuffle(wordBank.getRandomWords(80))
      .map(buildCase)
      .filter((c): c is Case => !!c)
    return [...built, ...extra].slice(0, rounds)
  }, [providedWords, rounds])

  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [solved, setSolved] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [wrongPick, setWrongPick] = useState<number | null>(null)

  const current = cases[index]

  if (!current) {
    return (
      <div className="typo-detective">
        <p className="td-empty">No cases to solve right now — learn a few more words and come back! 🕵️</p>
        <button className="td-btn" onClick={() => onComplete(0)}>Back to Games</button>
      </div>
    )
  }

  const tap = (i: number) => {
    if (picked !== null) return
    if (i === current.culpritIndex) {
      setPicked(i)
      const points = 20
      setScore((s) => s + points)
      setSolved((s) => s + 1)
      speak(`Yes! It should be ${current.correct.replace(/[^a-zA-Z]/g, '')}`)
      setTimeout(() => {
        if (index < cases.length - 1) {
          setIndex((n) => n + 1)
          setPicked(null)
          setWrongPick(null)
        } else {
          onComplete(score + points)
        }
      }, 1600)
    } else {
      // Gentle miss: no score loss, just a nudge to look again.
      setWrongPick(i)
      setTimeout(() => setWrongPick((x) => (x === i ? null : x)), 500)
    }
  }

  return (
    <div className="typo-detective">
      <div className="td-header">
        <div className="td-title">🕵️ Typo Detective</div>
        <div className="td-stats">
          <div className="td-stat"><span>Case</span><strong>{index + 1}/{cases.length}</strong></div>
          <div className="td-stat"><span>Score</span><strong>{score}</strong></div>
          <div className="td-stat"><span>Solved</span><strong>🔍 {solved}</strong></div>
        </div>
      </div>

      <p className="td-brief">One word is spelled wrong. Can you catch it?</p>

      <div className="td-sentence">
        {current.tokens.map((t, i) => {
          let cls = 'td-word'
          if (picked !== null && i === current.culpritIndex) cls += ' caught'
          if (wrongPick === i) cls += ' miss'
          return (
            <button key={i} className={cls} onClick={() => tap(i)} disabled={picked !== null}>
              {t}
            </button>
          )
        })}
      </div>

      {picked !== null && (
        <div className="td-solved">
          🎉 Caught it! It should be <strong>{current.correct.replace(/[^a-zA-Z]/g, '')}</strong>
        </div>
      )}
    </div>
  )
}

export default TypoDetective
