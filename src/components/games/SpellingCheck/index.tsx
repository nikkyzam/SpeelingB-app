import React, { useMemo, useState, useEffect } from 'react'
import { wordBank, Word } from '../../../services/wordBank'
import { useAudio } from '../../../contexts/AudioContext'
import './SpellingCheck.css'

interface SpellingCheckProps {
  onComplete: (score: number) => void
  words?: Word[]
  rounds?: number
}

const VOWELS = 'aeiou'
const shuffle = <T,>(a: T[]): T[] => {
  const arr = [...a]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

/** Make a plausible misspelling of a word (swap, double, drop, or vowel-swap). */
const misspell = (w: string): string => {
  const opts: string[] = []
  if (w.length > 2) {
    const i = 1 + Math.floor(Math.random() * (w.length - 2))
    opts.push(w.slice(0, i) + w[i + 1] + w[i] + w.slice(i + 2)) // swap adjacent
  }
  {
    const i = Math.floor(Math.random() * w.length)
    opts.push(w.slice(0, i) + w[i] + w.slice(i)) // double a letter
  }
  if (w.length > 3) {
    const i = 1 + Math.floor(Math.random() * (w.length - 2))
    opts.push(w.slice(0, i) + w.slice(i + 1)) // drop a letter
  }
  const vowelIdx = [...w].map((c, i) => (VOWELS.includes(c) ? i : -1)).filter((i) => i >= 0)
  if (vowelIdx.length) {
    const i = vowelIdx[Math.floor(Math.random() * vowelIdx.length)]
    let v = VOWELS[Math.floor(Math.random() * VOWELS.length)]
    while (v === w[i]) v = VOWELS[Math.floor(Math.random() * VOWELS.length)]
    opts.push(w.slice(0, i) + v + w.slice(i + 1))
  }
  const cand = opts.filter((s) => s && s !== w)
  return cand.length ? cand[Math.floor(Math.random() * cand.length)] : w + w.slice(-1)
}

const buildOptions = (word: string): string[] => {
  const set = new Set<string>([word])
  let guard = 0
  while (set.size < 4 && guard++ < 30) set.add(misspell(word))
  return shuffle([...set])
}

/** Hear the word, then tap the correctly-spelled version. */
const SpellingCheck: React.FC<SpellingCheckProps> = ({ onComplete, words: providedWords, rounds = 6 }) => {
  const { speak } = useAudio()

  const roundWords = useMemo<Word[]>(() => {
    const pool = providedWords && providedWords.length > 0 ? providedWords : wordBank.getRandomWords(rounds * 2)
    return shuffle(pool).filter((w) => w.word.length >= 3).slice(0, rounds)
  }, [providedWords, rounds])

  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [picked, setPicked] = useState<string | null>(null)

  const current = roundWords[index]
  const answer = (current?.word || '').toLowerCase()
  const options = useMemo(() => (answer ? buildOptions(answer) : []), [answer])

  useEffect(() => {
    if (current) speak(current.word)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, roundWords])

  if (!current) return <div className="spelling-check"><p>Loading…</p></div>

  const pick = (opt: string) => {
    if (picked) return
    setPicked(opt)
    const correct = opt === answer
    if (correct) {
      setScore((s) => s + 15 + streak * 3)
      setStreak((s) => s + 1)
      speak('Correct!')
    } else {
      setStreak(0)
      speak(`It is spelled ${answer}`)
    }
    setTimeout(() => {
      if (index < roundWords.length - 1) {
        setIndex((i) => i + 1)
        setPicked(null)
      } else {
        onComplete(score + (correct ? 15 + streak * 3 : 0))
      }
    }, 1100)
  }

  return (
    <div className="spelling-check">
      <div className="sc-header">
        <div className="sc-title">🔍 Spelling Check</div>
        <div className="sc-stats">
          <div className="sc-stat"><span>Word</span><strong>{index + 1}/{roundWords.length}</strong></div>
          <div className="sc-stat"><span>Score</span><strong>{score}</strong></div>
          <div className="sc-stat"><span>Streak</span><strong>🔥 {streak}</strong></div>
        </div>
      </div>

      <p className="sc-question">Which spelling is correct?</p>
      <button className="sc-hear" onClick={() => speak(current.word)}>🔊 Hear the word</button>
      <p className="sc-clue">Clue: {current.meaning.split('.')[0]}</p>

      <div className="sc-options">
        {options.map((opt) => {
          let cls = 'sc-option'
          if (picked) {
            if (opt === answer) cls += ' correct'
            else if (opt === picked) cls += ' wrong'
          }
          return (
            <button key={opt} className={cls} onClick={() => pick(opt)} disabled={!!picked}>
              {opt}
            </button>
          )
        })}
      </div>

      {picked && (
        <div className={`sc-flash ${picked === answer ? 'ok' : 'bad'}`}>
          {picked === answer ? 'Correct! 🎉' : `It's spelled "${answer}"`}
        </div>
      )}
    </div>
  )
}

export default SpellingCheck
