import React, { useMemo, useState } from 'react'
import { wordBank, Word } from '../../../services/wordBank'
import './WordSearch.css'

interface WordSearchProps {
  onComplete: (score: number) => void
  words?: Word[]
  /** how many words to hide in the grid */
  count?: number
}

const DIRS = [
  [0, 1], [0, -1], [1, 0], [-1, 0],
  [1, 1], [1, -1], [-1, 1], [-1, -1],
]
const ALPHA = 'abcdefghijklmnopqrstuvwxyz'

const shuffle = <T,>(a: T[]): T[] => {
  const arr = [...a]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

interface Puzzle {
  grid: string[][]
  size: number
  targets: string[]
}

const buildPuzzle = (candidateWords: string[], count: number): Puzzle => {
  const words = shuffle(candidateWords.map((w) => w.toLowerCase()))
    .filter((w) => /^[a-z]+$/.test(w) && w.length >= 3 && w.length <= 6)
  const longest = words.reduce((m, w) => Math.max(m, w.length), 3)
  const size = Math.min(10, Math.max(7, longest + 1))
  const grid: (string | null)[][] = Array.from({ length: size }, () => Array(size).fill(null))
  const placed: string[] = []

  const fits = (word: string, r: number, c: number, dr: number, dc: number) => {
    for (let i = 0; i < word.length; i++) {
      const rr = r + dr * i
      const cc = c + dc * i
      if (rr < 0 || cc < 0 || rr >= size || cc >= size) return false
      const cell = grid[rr][cc]
      if (cell !== null && cell !== word[i]) return false
    }
    return true
  }
  const place = (word: string) => {
    for (let attempt = 0; attempt < 80; attempt++) {
      const [dr, dc] = DIRS[Math.floor(Math.random() * DIRS.length)]
      const r = Math.floor(Math.random() * size)
      const c = Math.floor(Math.random() * size)
      if (fits(word, r, c, dr, dc)) {
        for (let i = 0; i < word.length; i++) grid[r + dr * i][c + dc * i] = word[i]
        return true
      }
    }
    return false
  }

  for (const w of words) {
    if (placed.length >= count) break
    if (place(w)) placed.push(w)
  }
  // Fill blanks with random letters.
  const full = grid.map((row) => row.map((cell) => cell ?? ALPHA[Math.floor(Math.random() * 26)]))
  return { grid: full, size, targets: placed }
}

const lineBetween = (r1: number, c1: number, r2: number, c2: number): [number, number][] | null => {
  const dr = Math.sign(r2 - r1)
  const dc = Math.sign(c2 - c1)
  const straight = r1 === r2 || c1 === c2 || Math.abs(r2 - r1) === Math.abs(c2 - c1)
  if (!straight) return null
  const len = Math.max(Math.abs(r2 - r1), Math.abs(c2 - c1)) + 1
  const cells: [number, number][] = []
  for (let i = 0; i < len; i++) cells.push([r1 + dr * i, c1 + dc * i])
  return cells
}

const key = (r: number, c: number) => `${r},${c}`

/** Find the hidden words by tapping the first and last letter of each. */
const WordSearch: React.FC<WordSearchProps> = ({ onComplete, words: providedWords, count = 5 }) => {
  const puzzle = useMemo(() => {
    const pool =
      providedWords && providedWords.length > 0
        ? providedWords.map((w) => w.word)
        : wordBank.getRandomWords(30, 1).map((w) => w.word)
    return buildPuzzle(pool, count)
  }, [providedWords, count])

  const [first, setFirst] = useState<[number, number] | null>(null)
  const [found, setFound] = useState<Set<string>>(new Set()) // found words
  const [foundCells, setFoundCells] = useState<Set<string>>(new Set())
  const [flash, setFlash] = useState<'hit' | 'miss' | null>(null)

  const remaining = puzzle.targets.filter((t) => !found.has(t))

  const tap = (r: number, c: number) => {
    if (!first) {
      setFirst([r, c])
      return
    }
    const [r1, c1] = first
    if (r1 === r && c1 === c) {
      setFirst(null)
      return
    }
    const line = lineBetween(r1, c1, r, c)
    if (line) {
      const str = line.map(([rr, cc]) => puzzle.grid[rr][cc]).join('')
      const rev = str.split('').reverse().join('')
      const match = puzzle.targets.find((t) => !found.has(t) && (t === str || t === rev))
      if (match) {
        const nf = new Set(found)
        nf.add(match)
        setFound(nf)
        const fc = new Set(foundCells)
        line.forEach(([rr, cc]) => fc.add(key(rr, cc)))
        setFoundCells(fc)
        setFlash('hit')
        setTimeout(() => setFlash(null), 500)
        setFirst(null)
        if (nf.size === puzzle.targets.length) {
          setTimeout(() => onComplete(puzzle.targets.length * 25), 700)
        }
        return
      }
    }
    setFlash('miss')
    setTimeout(() => setFlash(null), 350)
    setFirst([r, c]) // treat as a fresh start
  }

  return (
    <div className="word-search">
      <div className="ws-header">
        <div className="ws-title">🔎 Word Search</div>
        <div className="ws-progress">{found.size}/{puzzle.targets.length} found</div>
      </div>

      <p className="ws-instructions">Tap the <strong>first</strong> and <strong>last</strong> letter of a hidden word.</p>

      <div className={`ws-grid ws-flash-${flash ?? 'none'}`} style={{ gridTemplateColumns: `repeat(${puzzle.size}, 1fr)` }}>
        {puzzle.grid.map((row, r) =>
          row.map((letter, c) => {
            const isFirst = first && first[0] === r && first[1] === c
            const isFound = foundCells.has(key(r, c))
            return (
              <button
                key={key(r, c)}
                className={`ws-cell ${isFound ? 'found' : ''} ${isFirst ? 'first' : ''}`}
                onClick={() => tap(r, c)}
              >
                {letter.toUpperCase()}
              </button>
            )
          })
        )}
      </div>

      <div className="ws-words">
        {puzzle.targets.map((t) => (
          <span key={t} className={`ws-word ${found.has(t) ? 'done' : ''}`}>{t}</span>
        ))}
      </div>

      {remaining.length === 0 && <div className="ws-win">🎉 You found them all!</div>}
    </div>
  )
}

export default WordSearch
