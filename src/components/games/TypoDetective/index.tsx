import React, { useMemo, useRef, useState } from 'react'
import type { Word } from '../../../services/wordBank'
import { useAudio } from '../../../contexts/AudioContext'
import { shuffle } from '../shared/wordTricks'
import { fakeSpelling } from '../shared/realWords'
import { useCheer } from '../shared/useCheer'
import { useLater } from '../shared/useLater'
import Burst from '../shared/Burst'
import GameEmpty from '../shared/GameEmpty'
import './TypoDetective.css'

interface TypoDetectiveProps {
  onComplete: (score: number) => void
  words?: Word[]
  rounds?: number
}

export interface Case {
  tokens: string[] // sentence split into words (punctuation kept attached)
  culpritIndex: number // which token is misspelled
  correct: string // how it should be spelled
}

/** Wrong taps before the misspelled word starts to glow. */
const NUDGE_AFTER = 2
const SOLVED_MS = 2000
const MISS_FLASH_MS = 1200

/**
 * Points for catching the typo: the first look counts most. Unlimited taps at
 * full points meant tapping every word in turn was as good as reading.
 */
export const pointsForTry = (misses: number): number => (misses === 0 ? 20 : misses === 1 ? 10 : 5)

/** Build a "case": one sentence with exactly one word secretly misspelled. */
export const buildCase = (w: Word, misspellIt: (word: string) => string = fakeSpelling): Case | null => {
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
  // Never another real word: "from" for "form" is not a typo at all.
  const bad = misspellIt(letters.toLowerCase())
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
  const cheer = useCheer()
  const later = useLater()

  const cases = useMemo<Case[]>(() => {
    const pool = providedWords && providedWords.length > 0 ? providedWords : []
    const built = shuffle(pool)
      .map((w) => buildCase(w))
      .filter((c): c is Case => !!c)
    // Only their own words: a shorter case file beats hunting strangers' typos.
    return built.slice(0, rounds)
  }, [providedWords, rounds])

  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [solved, setSolved] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [wrongPick, setWrongPick] = useState<{ at: number; n: number } | null>(null)
  const [misses, setMisses] = useState(0)
  const [line, setLine] = useState('')
  const [lastPoints, setLastPoints] = useState(0)
  const settled = useRef(false)

  const current = cases[index]

  if (!current) {
    return (
      <div className="typo-detective">
        <GameEmpty icon="🕵️">No cases to solve right now — learn a few more words and come back!</GameEmpty>
      </div>
    )
  }

  const correctWord = current.correct.replace(/[^a-zA-Z]/g, '')
  /** The sentence as it should read — what "Read it to me" says. */
  const rightSentence = current.tokens.map((t, i) => (i === current.culpritIndex ? current.correct : t)).join(' ')

  const tap = (i: number) => {
    if (settled.current || picked !== null) return
    if (i !== current.culpritIndex) {
      // Gentle miss: a soft sound and a wiggle; after two, the typo glows.
      cheer.miss({ quiet: true })
      setMisses((m) => m + 1)
      setWrongPick((x) => ({ at: i, n: (x?.n ?? 0) + 1 }))
      later(() => setWrongPick((x) => (x && x.at === i ? null : x)), MISS_FLASH_MS)
      return
    }

    settled.current = true
    setPicked(i)
    const points = pointsForTry(misses)
    setScore((s) => s + points)
    setSolved((s) => s + 1)
    setLastPoints(points)
    setLine(cheer.hit({ say: `It should be ${correctWord}.` }))
    later(() => {
      if (index < cases.length - 1) {
        setIndex((n) => n + 1)
        setPicked(null)
        setWrongPick(null)
        setMisses(0)
        setLine('')
        settled.current = false
      } else {
        onComplete(score + points)
      }
    }, SOLVED_MS)
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
      <button className="td-read" onClick={() => speak(rightSentence)}>🔊 Read it to me</button>

      <div className="td-sentence">
        {current.tokens.map((t, i) => {
          let cls = 'td-word'
          if (picked !== null && i === current.culpritIndex) cls += ' caught'
          if (wrongPick?.at === i) cls += ' miss'
          if (picked === null && misses >= NUDGE_AFTER && i === current.culpritIndex) cls += ' nudge'
          return (
            <button
              key={wrongPick?.at === i ? `${i}-${wrongPick.n}` : i}
              className={cls}
              onClick={() => tap(i)}
              disabled={picked !== null}
            >
              {t}
            </button>
          )
        })}
      </div>

      {picked === null && wrongPick && (
        <p className="td-look" role="status">
          {misses >= NUDGE_AFTER ? 'Look for the glowing word! 🔍' : 'That one’s fine — look again! 🔍'}
        </p>
      )}

      {picked !== null && (
        <div className="td-solved" role="status">
          🎉 {line} It should be <strong>{correctWord}</strong> +{lastPoints}
          <Burst trigger={solved} />
        </div>
      )}
    </div>
  )
}

export default TypoDetective
