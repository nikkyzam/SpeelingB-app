import React, { useMemo, useState, useEffect } from 'react'
import { wordBank, Word } from '../../../services/wordBank'
import { useAudio } from '../../../contexts/AudioContext'
import { COMMON_WORDS, COMMON_WORD_SET } from './commonWords'
import './WordChef.css'

interface WordChefProps {
  onComplete: (score: number) => void
  words?: Word[]
  duration?: number
}

const MAX_TARGETS = 10

const letterCounts = (s: string): Record<string, number> => {
  const m: Record<string, number> = {}
  for (const c of s) m[c] = (m[c] || 0) + 1
  return m
}

const canForm = (word: string, base: Record<string, number>): boolean => {
  const need = letterCounts(word)
  return Object.keys(need).every((k) => (base[k] || 0) >= need[k])
}

const shuffle = <T,>(a: T[]): T[] => {
  const arr = [...a]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

/** Cook up as many real words as you can from the letters before time runs out. */
const WordChef: React.FC<WordChefProps> = ({ onComplete, words: providedWords, duration = 90 }) => {
  const { speak } = useAudio()

  const { base, targets } = useMemo(() => {
    const pool = providedWords && providedWords.length > 0 ? providedWords : wordBank.getRandomWords(60)
    const candidates = pool
      .map((w) => w.word.toLowerCase())
      .filter((w) => /^[a-z]+$/.test(w) && w.length >= 5 && w.length <= 8)
    const chosen = candidates.length
      ? shuffle(candidates)[0]
      : shuffle(wordBank.getAllWords().map((w) => w.word.toLowerCase()).filter((w) => /^[a-z]{5,8}$/.test(w)))[0] || 'spelling'

    const baseCount = letterCounts(chosen)
    // Validate against common kid words AND the word bank: the bank alone is
    // mostly long spelling-bee words, so few short words would be findable.
    const dictionary = [
      ...COMMON_WORDS,
      ...wordBank.getAllWords().map((w) => w.word.toLowerCase()),
    ]
    const all = dictionary.filter(
      (w) => /^[a-z]+$/.test(w) && w.length >= 3 && w.length <= chosen.length && canForm(w, baseCount)
    )

    const unique = Array.from(new Set(all))
    // Always include the full word as the star prize, plus a sample of the rest.
    const others = shuffle(unique.filter((w) => w !== chosen)).slice(0, MAX_TARGETS - 1)
    return { base: chosen, targets: new Set<string>([chosen, ...others]) }
  }, [providedWords])

  const tiles = useMemo(() => shuffle(base.split('')), [base])

  const [used, setUsed] = useState<number[]>([]) // tile indices in build order
  const [found, setFound] = useState<string[]>([])
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(duration)
  const [flash, setFlash] = useState<{ kind: 'ok' | 'bad'; msg: string } | null>(null)

  const build = used.map((i) => tiles[i]).join('')
  const finished = found.length >= targets.size

  useEffect(() => {
    if (timeLeft <= 0 || finished) {
      const t = setTimeout(() => onComplete(score), 600)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, finished])

  const say = (kind: 'ok' | 'bad', msg: string) => {
    setFlash({ kind, msg })
    setTimeout(() => setFlash(null), 1200)
  }

  const tapTile = (i: number) => {
    if (timeLeft <= 0) return
    // Functional update so quick successive taps can't drop letters.
    setUsed((prev) => (prev.includes(i) ? prev : [...prev, i]))
  }
  const undo = () => setUsed((prev) => prev.slice(0, -1))
  const clear = () => setUsed([])

  const submit = () => {
    const word = build
    if (word.length < 3) {
      say('bad', 'Words need at least 3 letters')
      return
    }
    if (found.includes(word)) {
      say('bad', `You already found "${word}"`)
      clear()
      return
    }
    if (targets.has(word)) {
      const points = word.length * 5 + (word === base ? 25 : 0)
      setScore((s) => s + points)
      setFound((f) => [...f, word])
      say('ok', word === base ? `⭐ The whole word! +${points}` : `Yum! "${word}" +${points}`)
      speak(word)
    } else if (COMMON_WORD_SET.has(word) || wordBank.getWordByWord(word)) {
      // A real word, just not on today's list — still give a small treat.
      setScore((s) => s + 3)
      say('ok', `Nice word! +3`)
    } else {
      say('bad', `"${word}" isn't on the menu`)
    }
    clear()
  }

  return (
    <div className="word-chef">
      <div className="wc-header">
        <div className="wc-title">🍲 Word Chef</div>
        <div className="wc-stats">
          <div className="wc-stat"><span>Time</span><strong className={timeLeft <= 15 ? 'low' : ''}>{timeLeft}s</strong></div>
          <div className="wc-stat"><span>Score</span><strong>{score}</strong></div>
          <div className="wc-stat"><span>Found</span><strong>{found.length}/{targets.size}</strong></div>
        </div>
      </div>

      <p className="wc-hint">Cook up words using these letters! Tap letters, then <strong>Cook it!</strong></p>

      <div className="wc-build">
        {Array.from({ length: base.length }).map((_, i) => (
          <span key={i} className={`wc-slot ${build[i] ? 'filled' : ''}`}>{build[i]?.toUpperCase() || ''}</span>
        ))}
      </div>

      <div className="wc-tiles">
        {tiles.map((ch, i) => (
          <button
            key={i}
            className={`wc-tile ${used.includes(i) ? 'used' : ''}`}
            onClick={() => tapTile(i)}
            disabled={used.includes(i) || timeLeft <= 0}
          >
            {ch.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="wc-actions">
        <button className="wc-btn ghost" onClick={undo} disabled={!used.length}>⬅ Undo</button>
        <button className="wc-btn" onClick={submit} disabled={used.length < 3}>🍳 Cook it!</button>
        <button className="wc-btn ghost" onClick={clear} disabled={!used.length}>Clear</button>
      </div>

      {flash && <div className={`wc-flash ${flash.kind}`}>{flash.msg}</div>}

      <div className="wc-found">
        <div className="wc-found-label">Your dishes:</div>
        <div className="wc-found-list">
          {found.length === 0 && <span className="wc-empty">Nothing cooked yet…</span>}
          {found.map((w) => (
            <span key={w} className={`wc-chip ${w === base ? 'star' : ''}`}>{w}</span>
          ))}
        </div>
      </div>

      {finished && <div className="wc-win">🎉 You found them all, chef!</div>}
    </div>
  )
}

export default WordChef
