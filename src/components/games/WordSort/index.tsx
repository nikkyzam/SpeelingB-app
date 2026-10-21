import React, { useEffect, useMemo, useRef, useState } from 'react'
import type { Word } from '../../../services/wordBank'
import { useAudio } from '../../../contexts/AudioContext'
import { shuffle, isPlayable } from '../shared/wordTricks'
import useCheer from '../shared/useCheer'
import useLater from '../shared/useLater'
import Burst from '../shared/Burst'
import GameEmpty from '../shared/GameEmpty'
import './WordSort.css'

interface WordSortProps {
  onComplete: (score: number) => void
  words?: Word[]
  rounds?: number
}

export interface Rule {
  id: string
  question: string
  /** The question as it is read aloud. */
  say: string
  /** basket A is the "true" side of `test` */
  a: { label: string; icon: string }
  b: { label: string; icon: string }
  test: (word: string) => boolean
  /** Why a word goes where it goes, said after a miss: "apple starts with a, a vowel". */
  why: (word: string) => string
}

const VOWELS = 'aeiou'
const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'
const isVowel = (c: string) => VOWELS.includes(c)

const CLASSIC_RULES: Rule[] = [
  {
    id: 'starts',
    question: 'Which letter does it START with?',
    say: 'Does it start with a vowel, or a consonant?',
    a: { label: 'Vowel (a e i o u)', icon: '🅰️' },
    b: { label: 'Consonant', icon: '🅱️' },
    test: (w) => isVowel(w[0]),
    why: (w) => `${w} starts with ${w[0]}, ${isVowel(w[0]) ? 'a vowel' : 'a consonant'}`,
  },
  {
    id: 'double',
    question: 'Does it have DOUBLE letters?',
    say: 'Does it have double letters?',
    a: { label: 'Double letters', icon: '👯' },
    b: { label: 'No doubles', icon: '1️⃣' },
    test: (w) => /(.)\1/.test(w),
    why: (w) => {
      const pair = /(.)\1/.exec(w)
      return pair ? `${w} has a double ${pair[1]}` : `${w} has no double letters`
    },
  },
  {
    id: 'ends',
    question: 'What does it END with?',
    say: 'Does it end with a vowel, or a consonant?',
    a: { label: 'Ends in a vowel', icon: '🎈' },
    b: { label: 'Ends in a consonant', icon: '🧱' },
    test: (w) => isVowel(w[w.length - 1]),
    why: (w) => `${w} ends with ${w[w.length - 1]}, ${isVowel(w[w.length - 1]) ? 'a vowel' : 'a consonant'}`,
  },
]

/** Short or long, with the line drawn where it splits these words best. */
const lengthRule = (most: number): Rule => ({
  id: `length-${most}`,
  question: 'How LONG is the word?',
  say: `Is it short, ${most} letters or fewer? Or long?`,
  a: { label: `Short (${most} or fewer)`, icon: '🐜' },
  b: { label: `Long (${most + 1} or more)`, icon: '🐘' },
  test: (w) => w.length <= most,
  why: (w) => `${w} has ${w.length} letters`,
})

/** "Is there a G in it?" — a rule almost any handful of words splits on. */
const letterRule = (ch: string): Rule => ({
  id: `letter-${ch}`,
  question: `Is there a letter ${ch.toUpperCase()} in it?`,
  say: `Is there a letter ${ch} in it?`,
  a: { label: `Has a ${ch.toUpperCase()}`, icon: '🔎' },
  b: { label: `No ${ch.toUpperCase()}`, icon: '🙈' },
  test: (w) => w.includes(ch),
  why: (w) => (w.includes(ch) ? `${w} has a ${ch} in it` : `${w} has no ${ch}`),
})

interface Split {
  rule: Rule
  yes: string[]
  no: string[]
}
const balance = (s: Split) => Math.min(s.yes.length, s.no.length)
const splitBy = (rule: Rule, words: string[]): Split => ({
  rule,
  yes: words.filter((w) => rule.test(w)),
  no: words.filter((w) => !rule.test(w)),
})
const mostEven = (splits: Split[]): Split => shuffle(splits).sort((x, y) => balance(y) - balance(x))[0]

/**
 * The rule and the pile of words for one game.
 *
 * Every rule must put at least two of the words in each basket. The old pick
 * fell back to the first rule it tried, so a pile like cat, dog, sun, pig got
 * "starts with a vowel?" — every word in one basket, nothing to decide.
 */
export const planSort = (words: string[], rounds: number): { rule: Rule; queue: string[] } => {
  const all = [...new Set(words.map((w) => w.toLowerCase()))]
  const candidates = [
    ...CLASSIC_RULES.map((r) => splitBy(r, all)),
    mostEven([3, 4, 5, 6, 7, 8, 9].map((n) => splitBy(lengthRule(n), all))),
  ]
  const letters = mostEven([...ALPHABET].map((ch) => splitBy(letterRule(ch), all)))
  const total = Math.min(rounds, all.length)
  const need = Math.max(2, Math.ceil(total / 3))

  const chosen =
    shuffle(candidates).find((s) => balance(s) >= need) ??
    (balance(letters) >= need ? letters : undefined) ??
    mostEven([...candidates, letters])

  // Half and half where the words allow, never fewer than two a side.
  let nYes = Math.min(chosen.yes.length, Math.ceil(total / 2))
  const nNo = Math.min(chosen.no.length, total - nYes)
  nYes = Math.min(chosen.yes.length, total - nNo)
  const queue = shuffle([...shuffle(chosen.yes).slice(0, nYes), ...shuffle(chosen.no).slice(0, nNo)])
  return { rule: chosen.rule, queue }
}

const SORTED = 20
const PERFECT_BONUS = 60

/**
 * Two baskets, one rule, a pile of words. Sorting forces a child to notice the
 * *shape* of a word — where the vowels sit, how it starts and ends — which is
 * exactly the noticing that makes spelling stick.
 */
const WordSort: React.FC<WordSortProps> = ({ onComplete, words: providedWords, rounds = 10 }) => {
  const { speak } = useAudio()
  const cheer = useCheer()
  const later = useLater()

  const { rule, queue } = useMemo(() => {
    const pool = (providedWords && providedWords.length > 0 ? providedWords : [])
      .filter((w) => isPlayable(w))
      .map((w) => w.word)
    return planSort(pool, rounds)
  }, [providedWords, rounds])

  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [right, setRight] = useState(0)
  const [streak, setStreak] = useState(0)
  const [basketA, setBasketA] = useState<string[]>([])
  const [basketB, setBasketB] = useState<string[]>([])
  const [verdict, setVerdict] = useState<'a' | 'b' | null>(null)
  const [correct, setCorrect] = useState<boolean | null>(null)
  const [cheerLine, setCheerLine] = useState('')
  const [hits, setHits] = useState(0)
  const locked = useRef(false)

  const current = queue[index]

  // The rule is read out before the first word, then every word as it comes.
  useEffect(() => {
    if (!current) return
    locked.current = false
    if (index === 0) {
      speak(rule.say)
      speak(current, { queue: true })
    } else {
      speak(current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, queue])

  if (!current) {
    return (
      <div className="word-sort">
        <GameEmpty icon="🧺">No words to sort yet — learn a few first!</GameEmpty>
      </div>
    )
  }

  const sort = (side: 'a' | 'b') => {
    if (locked.current) return
    locked.current = true
    const belongsInA = rule.test(current)
    const ok = (side === 'a') === belongsInA

    setVerdict(side)
    setCorrect(ok)
    if (belongsInA) setBasketA((x) => [...x, current])
    else setBasketB((x) => [...x, current])

    if (ok) {
      setScore((s) => s + SORTED)
      setRight((r) => r + 1)
      setHits((h) => h + 1)
      setCheerLine(cheer.hit())
      setStreak(cheer.streak())
    } else {
      setCheerLine(cheer.miss({ say: rule.why(current) }))
      setStreak(0)
    }

    later(() => {
      if (index < queue.length - 1) {
        setVerdict(null)
        setCorrect(null)
        setIndex((i) => i + 1)
      } else {
        const perfect = right + (ok ? 1 : 0) === queue.length
        onComplete(score + (ok ? SORTED : 0) + (perfect ? PERFECT_BONUS : 0))
      }
    }, ok ? 1200 : 2600)
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
          <div className="ws2-stat"><span>Streak</span><strong>🔥 {streak}</strong></div>
        </div>
      </div>

      <p className="ws2-rule">
        {rule.question}
        <button className="ws2-hear" onClick={() => speak(rule.say)} aria-label="Hear the rule again">🔊</button>
      </p>

      <button
        className={`ws2-card ${verdict ? (correct ? 'good' : 'bad') : ''}`}
        onClick={() => speak(current)}
      >
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
          {correct && <Burst trigger={hits} />}
          {correct
            ? `🎉 ${cheerLine}`
            : `${cheerLine} “${current}” belongs with ${belongsInA ? rule.a.label : rule.b.label} — ${rule.why(current)}.`}
        </div>
      )}
    </div>
  )
}

export default WordSort
