import React, { useMemo, useState } from 'react'
import { wordBank, Word } from '../../../services/wordBank'
import { useAudio } from '../../../contexts/AudioContext'
import { shuffle, isPlayable } from '../shared/wordTricks'
import sfx from '../shared/sfx'
import './WordSort.css'

interface WordSortProps {
  onComplete: (score: number) => void
  words?: Word[]
  rounds?: number
}

interface Rule {
  id: string
  question: string
  /** basket A is the "true" side of `test` */
  a: { label: string; icon: string }
  b: { label: string; icon: string }
  test: (word: string) => boolean
}

const VOWELS = 'aeiou'

const RULES: Rule[] = [
  {
    id: 'starts',
    question: 'Which letter does it START with?',
    a: { label: 'Vowel (a e i o u)', icon: '🅰️' },
    b: { label: 'Consonant', icon: '🅱️' },
    test: (w) => VOWELS.includes(w[0]),
  },
  {
    id: 'length',
    question: 'How LONG is the word?',
    a: { label: 'Short (4 or fewer)', icon: '🐜' },
    b: { label: 'Long (5 or more)', icon: '🐘' },
    test: (w) => w.length <= 4,
  },
  {
    id: 'double',
    question: 'Does it have DOUBLE letters?',
    a: { label: 'Double letters', icon: '👯' },
    b: { label: 'No doubles', icon: '1️⃣' },
    test: (w) => /(.)\1/.test(w),
  },
  {
    id: 'ends',
    question: 'What does it END with?',
    a: { label: 'Ends in a vowel', icon: '🎈' },
    b: { label: 'Ends in a consonant', icon: '🧱' },
    test: (w) => VOWELS.includes(w[w.length - 1]),
  },
]

/**
 * Two baskets, one rule, a pile of words. Sorting forces a child to notice the
 * *shape* of a word — where the vowels sit, how it starts and ends — which is
 * exactly the noticing that makes spelling stick.
 */
const WordSort: React.FC<WordSortProps> = ({ onComplete, words: providedWords, rounds = 10 }) => {
  const { speak } = useAudio()

  const { rule, queue } = useMemo(() => {
    const pool = (providedWords && providedWords.length > 0 ? providedWords : wordBank.getRandomWords(60))
      .filter((w) => isPlayable(w))
      .map((w) => w.word.toLowerCase())
    const backup = wordBank.getRandomWords(80).filter((w) => isPlayable(w)).map((w) => w.word.toLowerCase())
    const all = [...new Set([...pool, ...backup])]

    // Pick a rule that actually splits this child's words — a rule where every
    // word lands in one basket is no fun to play.
    const scored = shuffle(RULES).map((r) => {
      const yes = pool.filter((w) => r.test(w))
      const no = pool.filter((w) => !r.test(w))
      return { rule: r, yes, no, balance: Math.min(yes.length, no.length) }
    })
    const chosen = scored.find((s) => s.balance >= Math.ceil(rounds / 3)) || scored[0]

    // Fill up from the whole bank if the child's own words lean one way.
    const half = Math.ceil(rounds / 2)
    const yes = [...chosen.yes, ...all.filter((w) => chosen.rule.test(w) && !chosen.yes.includes(w))].slice(0, half)
    const no = [...chosen.no, ...all.filter((w) => !chosen.rule.test(w) && !chosen.no.includes(w))].slice(0, rounds - half)

    return { rule: chosen.rule, queue: shuffle([...yes, ...no]).slice(0, rounds) }
  }, [providedWords, rounds])

  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [right, setRight] = useState(0)
  const [basketA, setBasketA] = useState<string[]>([])
  const [basketB, setBasketB] = useState<string[]>([])
  const [verdict, setVerdict] = useState<'a' | 'b' | null>(null)
  const [correct, setCorrect] = useState<boolean | null>(null)

  const current = queue[index]

  if (!current) {
    return (
      <div className="word-sort">
        <p className="ws2-empty">No words to sort yet — learn a few first! 🧺</p>
        <button className="ws2-btn" onClick={() => onComplete(0)}>Back to Games</button>
      </div>
    )
  }

  const sort = (side: 'a' | 'b') => {
    if (verdict) return
    const belongsInA = rule.test(current)
    const ok = (side === 'a') === belongsInA

    setVerdict(side)
    setCorrect(ok)
    if (belongsInA) setBasketA((x) => [...x, current])
    else setBasketB((x) => [...x, current])

    if (ok) {
      setScore((s) => s + 20)
      setRight((r) => r + 1)
      sfx.correct()
    } else {
      sfx.wrong()
      speak(`${current} goes in the other basket`)
    }

    setTimeout(() => {
      if (index < queue.length - 1) {
        setIndex((i) => i + 1)
        setVerdict(null)
        setCorrect(null)
      } else {
        const perfect = right + (ok ? 1 : 0) === queue.length
        const total = score + (ok ? 20 : 0) + (perfect ? 60 : 0)
        sfx.win()
        onComplete(total)
      }
    }, ok ? 900 : 1800)
  }

  const belongsInA = rule.test(current)

  return (
    <div className="word-sort">
      <div className="ws2-header">
        <div className="ws2-title">🧺 Word Sort</div>
        <div className="ws2-stats">
          <div className="ws2-stat"><span>Word</span><strong>{index + 1}/{queue.length}</strong></div>
          <div className="ws2-stat"><span>Score</span><strong>{score}</strong></div>
          <div className="ws2-stat"><span>Right</span><strong>✅ {right}</strong></div>
        </div>
      </div>

      <p className="ws2-rule">{rule.question}</p>

      <button className={`ws2-card ${verdict ? (correct ? 'good' : 'bad') : ''}`} onClick={() => speak(current)}>
        {current}
        <span className="ws2-card-speak" aria-hidden>🔊</span>
      </button>

      <div className="ws2-baskets">
        {(['a', 'b'] as const).map((side) => {
          const meta = rule[side]
          const filled = side === 'a' ? basketA : basketB
          const isRightSide = (side === 'a') === belongsInA
          let cls = 'ws2-basket'
          if (verdict) {
            if (isRightSide) cls += ' target'
            if (verdict === side && !correct) cls += ' missed'
          }
          return (
            <button key={side} className={cls} onClick={() => sort(side)} disabled={!!verdict}>
              <span className="ws2-basket-icon" aria-hidden>{meta.icon}</span>
              <span className="ws2-basket-label">{meta.label}</span>
              <span className="ws2-basket-count">{filled.length} word{filled.length === 1 ? '' : 's'}</span>
              <span className="ws2-basket-words">{filled.slice(-3).join(' · ')}</span>
            </button>
          )
        })}
      </div>

      {verdict && (
        <div className={`ws2-flash ${correct ? 'ok' : 'bad'}`}>
          {correct ? '🎉 Perfect sorting!' : `“${current}” belongs with ${belongsInA ? rule.a.label : rule.b.label}`}
        </div>
      )}
    </div>
  )
}

export default WordSort
