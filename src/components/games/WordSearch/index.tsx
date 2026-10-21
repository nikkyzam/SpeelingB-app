import React, { useEffect, useMemo, useRef, useState } from 'react'
import type { Word } from '../../../services/wordBank'
import { useAudio } from '../../../contexts/AudioContext'
import { shuffle } from '../shared/wordTricks'
import { useCheer } from '../shared/useCheer'
import { useLater } from '../shared/useLater'
import sfx from '../shared/sfx'
import Burst from '../shared/Burst'
import GameEmpty from '../shared/GameEmpty'
import './WordSearch.css'

interface WordSearchProps {
  onComplete: (score: number) => void
  words?: Word[]
  /** how many words to hide in the grid */
  count?: number
}

/**
 * Right, down and down-right only. Backwards and upwards words are a puzzle
 * for grown-ups: a five-year-old reads left to right and top to bottom, and
 * can't find "tac" as "cat".
 */
export const DIRS: ReadonlyArray<readonly [number, number]> = [
  [0, 1],
  [1, 0],
  [1, 1],
]
const ALPHA = 'abcdefghijklmnopqrstuvwxyz'
const POINTS_PER_WORD = 25

export interface Puzzle {
  grid: string[][]
  size: number
  targets: string[]
  /** Where each hidden word starts and which way it runs. */
  placements: Record<string, { r: number; c: number; dr: number; dc: number }>
}

export const buildPuzzle = (candidateWords: string[], count: number): Puzzle => {
  const words = shuffle(Array.from(new Set(candidateWords.map((w) => w.toLowerCase()))))
    .filter((w) => /^[a-z]+$/.test(w) && w.length >= 3 && w.length <= 6)
  const longest = words.reduce((m, w) => Math.max(m, w.length), 3)
  const size = Math.min(10, Math.max(7, longest + 1))
  const grid: (string | null)[][] = Array.from({ length: size }, () => Array(size).fill(null))
  const placed: string[] = []
  const placements: Puzzle['placements'] = {}

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
    for (let attempt = 0; attempt < 120; attempt++) {
      const [dr, dc] = DIRS[Math.floor(Math.random() * DIRS.length)]
      const r = Math.floor(Math.random() * size)
      const c = Math.floor(Math.random() * size)
      if (fits(word, r, c, dr, dc)) {
        for (let i = 0; i < word.length; i++) grid[r + dr * i][c + dc * i] = word[i]
        placements[word] = { r, c, dr, dc }
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
  return { grid: full, size, targets: placed, placements }
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
  const { speak } = useAudio()
  const cheer = useCheer()
  const later = useLater()

  const puzzle = useMemo(() => {
    const fits = (w: string) => /^[a-z]+$/.test(w) && w.length >= 3 && w.length <= 6
    const studied = (providedWords || []).map((w) => w.word.toLowerCase()).filter(fits)
    // The grid can only hide SHORT words, and only ever the child's own. If
    // they have just a few short enough, the puzzle simply hides fewer.
    return buildPuzzle(studied, Math.min(count, studied.length))
  }, [providedWords, count])

  const [first, setFirst] = useState<[number, number] | null>(null)
  const [found, setFound] = useState<Set<string>>(new Set())
  const [foundCells, setFoundCells] = useState<Set<string>>(new Set())
  const [missCell, setMissCell] = useState<{ at: string; n: number } | null>(null)
  const [line, setLine] = useState('')
  // Pays out once, however fast the last two taps come.
  const finished = useRef(false)
  // Only the newest cheer may clear the flash.
  const flashId = useRef(0)

  const tap = (r: number, c: number) => {
    if (finished.current) return
    if (!first) {
      sfx.tap()
      setFirst([r, c])
      return
    }
    const [r1, c1] = first
    if (r1 === r && c1 === c) {
      setFirst(null)
      return
    }
    const cells = lineBetween(r1, c1, r, c)
    if (cells) {
      const str = cells.map(([rr, cc]) => puzzle.grid[rr][cc]).join('')
      const rev = str.split('').reverse().join('')
      const match = puzzle.targets.find((t) => !found.has(t) && (t === str || t === rev))
      if (match) {
        const nf = new Set(found)
        nf.add(match)
        setFound(nf)
        const fc = new Set(foundCells)
        cells.forEach(([rr, cc]) => fc.add(key(rr, cc)))
        setFoundCells(fc)
        setFirst(null)
        setLine(cheer.hit({ say: match }))
        const id = ++flashId.current
        later(() => {
          if (flashId.current === id) setLine('')
        }, 1500)
        if (nf.size === puzzle.targets.length) {
          finished.current = true
          later(() => onComplete(puzzle.targets.length * POINTS_PER_WORD), 1800)
        }
        return
      }
    }
    // Not a word: start again from nothing. Keeping the second tap as a new
    // first letter left a child wondering why a cell was still lit.
    sfx.wrong()
    setFirst(null)
    setMissCell((m) => ({ at: key(r, c), n: (m?.n ?? 0) + 1 }))
  }

  // Said once at the start, for a child who can't read the instructions yet.
  useEffect(() => {
    const n = puzzle.targets.length
    if (n > 0) speak(`Find ${n} hidden words. Tap the first letter of a word, then its last letter.`)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (puzzle.targets.length === 0) {
    return (
      <div className="word-search">
        <GameEmpty icon="🔎">No short words to hide yet — learn a few more, then come back and hunt for them!</GameEmpty>
      </div>
    )
  }

  const allFound = found.size === puzzle.targets.length

  return (
    <div className="word-search">
      <div className="ws-header">
        <div className="ws-title">🔎 Word Search</div>
        <div className="ws-progress">{found.size}/{puzzle.targets.length} found</div>
      </div>

      <p className="ws-instructions">Tap the <strong>first</strong> and <strong>last</strong> letter of a hidden word.</p>

      <div className="ws-board">
        <div className="ws-grid" style={{ gridTemplateColumns: `repeat(${puzzle.size}, 1fr)` }}>
          {puzzle.grid.map((row, r) =>
            row.map((letter, c) => {
              const at = key(r, c)
              const isFirst = first && first[0] === r && first[1] === c
              const isFound = foundCells.has(at)
              const isMiss = missCell?.at === at
              return (
                <button
                  // Keyed on the miss count too, so a second miss on the same
                  // cell shakes it again.
                  key={isMiss ? `${at}-${missCell!.n}` : at}
                  className={`ws-cell ${isFound ? 'found' : ''} ${isFirst ? 'first' : ''} ${isMiss ? 'miss' : ''}`}
                  onClick={() => tap(r, c)}
                  aria-label={`${letter}, row ${r + 1}, column ${c + 1}`}
                >
                  {letter.toUpperCase()}
                </button>
              )
            })
          )}
        </div>
        {line && (
          <div className="ws-flash ok" role="status" key={found.size}>
            {line}
            <Burst trigger={found.size} />
          </div>
        )}
      </div>

      <div className="ws-words">
        {puzzle.targets.map((t) => (
          <button
            key={t}
            className={`ws-word ${found.has(t) ? 'done' : ''}`}
            onClick={() => speak(t)}
            aria-label={`Hear ${t}`}
          >
            {t}
          </button>
        ))}
      </div>

      {allFound && <div className="ws-win">🎉 You found them all!</div>}
    </div>
  )
}

export default WordSearch
