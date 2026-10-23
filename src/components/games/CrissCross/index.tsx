import { activityClock } from '../../../services/games/activityClock'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import type { Word } from '../../../services/wordBank'
import { useAudio } from '../../../contexts/AudioContext'
import { shuffle, isPlayable } from '../shared/wordTricks'
import sfx from '../shared/sfx'
import useCheer from '../shared/useCheer'
import Burst from '../shared/Burst'
import { spellOut } from '../../../services/words/praise'
import { buildCrossword, maskClue, type Dir, type Entry } from './crossword'
import './CrissCross.css'

interface CrissCrossProps {
  onComplete: (score: number) => void
  words?: Word[]
  rounds?: number
}

interface Clue extends Entry {
  source: Word
  clue: string
}

const KEY_ROWS = ['abcdefg', 'hijklmn', 'opqrstu', 'vwxyz'] as const
/** Three wrong fills and the word is written in — a child should never be stuck. */
const MISSES_ALLOWED = 3
/** How long a wrong word stays up, shaking, before it clears for another try. */
const MISS_SHOW_MS = 700
/** Solving from the definition alone, without hearing the word, earns this on top. */
const CLUE_ONLY_BONUS = 15
const pointsFor = (word: string) => 10 + 3 * word.length
const key = (r: number, c: number) => `${r},${c}`

/**
 * Criss-Cross — a mini crossword built from the child's own words.
 *
 * The clue is the word's definition, so this is the one game that asks a child
 * to go from meaning to spelling with nothing to pick from. Crossing words
 * share letters, as crosswords do, which is help a child earns by solving the
 * other word. Anyone stuck on a definition can ask to hear the word; solving
 * without it scores a bonus.
 *
 * Letters come from an on-screen keypad (or a real keyboard), never a text
 * box, so no tablet keyboard can offer to finish the word.
 */
const CrissCross: React.FC<CrissCrossProps> = ({ onComplete, words: providedWords, rounds = 5 }) => {
  const { speak } = useAudio()
  const cheer = useCheer()
  // Right answers so far, which fires the star burst over the flash.
  const [hits, setHits] = useState(0)

  const puzzle = useMemo(() => {
    const pool = shuffle(providedWords && providedWords.length > 0 ? providedWords : []).filter((w) =>
      isPlayable(w, 3)
    )
    // A long word stretches the grid past a phone's width. Use the shorter
    // words when there are enough of them; otherwise the grid just grows.
    const upTo = (n: number) => pool.filter((w) => w.word.length <= n)
    const fitting = upTo(9).length >= 3 ? upTo(9) : upTo(12).length >= 3 ? upTo(12) : pool
    const candidates = fitting.slice(0, 24)
    const byText = new Map(candidates.map((w): [string, Word] => [w.word.toLowerCase(), w]))
    const grid = buildCrossword(
      candidates.map((w) => w.word),
      { target: rounds }
    )
    // Every clue is on screen at once, so each is masked against every answer
    // in the grid, not only its own: "A sweet substance" must not spell SWEET.
    const clues: Clue[] = grid.entries.flatMap((e) => {
      const source = byText.get(e.word)
      if (!source) return []
      const clue = grid.entries.reduce((text, other) => maskClue(text, other.word), source.meaning || '')
      return [{ ...e, source, clue }]
    })
    return { rows: grid.rows, cols: grid.cols, clues }
  }, [providedWords, rounds])
  const { clues } = puzzle

  /** Every square on the grid: its letter, and which clues run through it. */
  const squares = useMemo(() => {
    const map = new Map<string, { answer: string; clues: number[]; number?: number }>()
    clues.forEach((e, i) => {
      e.cells.forEach(([r, c], j) => {
        const k = key(r, c)
        const sq = map.get(k) ?? { answer: e.word[j], clues: [] }
        sq.clues.push(i)
        if (j === 0) sq.number = e.number
        map.set(k, sq)
      })
    })
    return map
  }, [clues])

  const [letters, setLetters] = useState<Record<string, string>>({})
  // The delayed clears read the grid as it is when they fire, not as it was
  // when they were scheduled.
  const lettersRef = useRef(letters)
  lettersRef.current = letters
  const [solved, setSolved] = useState<Record<number, 'ok' | 'shown'>>({})
  const [misses, setMisses] = useState<Record<number, number>>({})
  const [heard, setHeard] = useState<Record<number, boolean>>({})
  const [sel, setSel] = useState<{ r: number; c: number; dir: Dir } | null>(() =>
    clues[0] ? { r: clues[0].row, c: clues[0].col, dir: clues[0].dir } : null
  )
  const [shake, setShake] = useState<number | null>(null)
  const [flash, setFlash] = useState<{ text: string; tone: 'ok' | 'bad' } | null>(null)
  const [score, setScore] = useState(0)

  // The score state lags a render behind; the payout reads this instead.
  const scoreRef = useRef(0)
  /** What each clue's squares spelled when last marked, so one fill is marked once. */
  const judged = useRef<Record<number, string>>({})
  /** Clues showing a wrong word that is about to clear; typing into them waits. */
  const clearing = useRef(new Set<number>())
  // Read by the delayed clears, which run after the render that scheduled them.
  const solvedRef = useRef<Record<number, 'ok' | 'shown'>>({})
  const finished = useRef(false)
  const timers = useRef<number[]>([])
  const later = (fn: () => void, ms: number) => {
    timers.current.push(activityClock.setTimeout(fn, ms))
  }
  useEffect(() => () => timers.current.forEach((t) => activityClock.clearTimeout(t)), [])

  /** Squares that belong to a finished clue can't be typed over. */
  const given = useMemo(
    () => new Set(clues.flatMap((e, i) => (solved[i] ? e.cells.map(([r, c]) => key(r, c)) : []))),
    [clues, solved]
  )
  const activeIdx = sel
    ? clues.findIndex((e) => e.dir === sel.dir && e.cells.some(([r, c]) => r === sel.r && c === sel.c))
    : -1
  const active = activeIdx >= 0 ? clues[activeIdx] : undefined

  /**
   * Where typing starts in a clue: its first empty square — or the very first
   * square when everything before that is already given, so a child who types
   * the whole word from the beginning lands every letter where it belongs.
   */
  const startOf = (i: number): [number, number] => {
    const e = clues[i]
    const firstEmpty = e.cells.findIndex(([r, c]) => !letters[key(r, c)])
    if (firstEmpty < 0) return e.cells[0]
    return e.cells.slice(0, firstEmpty).every(([r, c]) => given.has(key(r, c))) ? e.cells[0] : e.cells[firstEmpty]
  }

  const selectClue = (i: number) => {
    const [r, c] = startOf(i)
    setSel({ r, c, dir: clues[i].dir })
  }

  const tapSquare = (r: number, c: number) => {
    const sq = squares.get(key(r, c))
    if (!sq) return
    const dirs = sq.clues.map((i) => clues[i].dir)
    sfx.tap()
    setSel((prev) => {
      // Tapping the chosen square again flips between its across and down clues.
      if (prev && prev.r === r && prev.c === c && dirs.length > 1) {
        return { r, c, dir: prev.dir === 'across' ? 'down' : 'across' }
      }
      return { r, c, dir: prev && dirs.includes(prev.dir) ? prev.dir : dirs[0] }
    })
  }

  const type = (ch: string) => {
    if (!sel || !active || finished.current || solved[activeIdx] || clearing.current.has(activeIdx)) return
    const cells = active.cells
    let at = cells.findIndex(([r, c]) => r === sel.r && c === sel.c)
    if (at < 0) return
    // A given square accepts its own letter and steps on. Any other letter was
    // meant for the next open square — the child is filling only the gaps.
    if (given.has(key(...cells[at]))) {
      if (squares.get(key(...cells[at]))?.answer === ch) {
        const next = cells[at + 1]
        if (next) setSel({ r: next[0], c: next[1], dir: active.dir })
        return
      }
      const from = at
      at = cells.findIndex(([r, c], j) => j > from && !given.has(key(r, c)))
      if (at < 0) return
    }
    const [r, c] = cells[at]
    sfx.tap()
    setLetters((prev) => ({ ...prev, [key(r, c)]: ch }))
    const next = cells[at + 1]
    setSel(next ? { r: next[0], c: next[1], dir: active.dir } : { r, c, dir: active.dir })
  }

  const erase = () => {
    if (!sel || !active || finished.current || solved[activeIdx] || clearing.current.has(activeIdx)) return
    const cells = active.cells
    const at = cells.findIndex(([r, c]) => r === sel.r && c === sel.c)
    if (at < 0) return
    const here = key(...cells[at])
    if (letters[here] && !given.has(here)) {
      setLetters(({ [here]: _gone, ...rest }) => rest)
      return
    }
    // Nothing to rub out here: step back to the last open square and clear it.
    for (let j = at - 1; j >= 0; j--) {
      const k = key(...cells[j])
      if (given.has(k)) continue
      setLetters(({ [k]: _gone, ...rest }) => rest)
      setSel({ r: cells[j][0], c: cells[j][1], dir: active.dir })
      return
    }
  }

  const markSolved = (i: number, how: 'ok' | 'shown') => {
    solvedRef.current = { ...solvedRef.current, [i]: how }
    setSolved(solvedRef.current)
  }

  const solve = (i: number) => {
    const e = clues[i]
    const gained = pointsFor(e.word) + (heard[i] ? 0 : CLUE_ONLY_BONUS)
    scoreRef.current += gained
    setScore(scoreRef.current)
    markSolved(i, 'ok')
    const line = cheer.hit({ say: e.source.word })
    setFlash({ text: `✨ ${line} “${e.source.word}” — +${gained}`, tone: 'ok' })
    setHits((n) => n + 1)
  }

  /**
   * Take a wrong word off the grid so the next try starts clean. Left up, it
   * would be marked again at every letter a child changed while fixing it —
   * three keystrokes into a correction, the answer would be given away.
   * Given squares stay, and so does anything typed since (`keep`, or a square
   * whose letter has changed).
   */
  const clearAttempt = (i: number, attempt: string, keep: Set<string>) => {
    const e = clues[i]
    const locked = new Set(
      clues.flatMap((c, j) => (solvedRef.current[j] ? c.cells.map(([r, cc]) => key(r, cc)) : []))
    )
    const gone = e.cells
      .map(([r, c], j): [string, string] => [key(r, c), attempt[j]])
      .filter(([k, ch]) => !locked.has(k) && !keep.has(k) && lettersRef.current[k] === ch)
      .map(([k]) => k)
    clearing.current.delete(i)
    // Nothing of its own left to take off — every other square is given, and
    // the child is still typing the crossing one. It stays marked as this
    // attempt, so it is judged again only once that square changes; clearing
    // the mark here judged the same fill again and again until it was revealed.
    if (gone.length === 0) return
    setLetters((prev) => {
      const next = { ...prev }
      e.cells.forEach(([r, c], j) => {
        const k = key(r, c)
        if (gone.includes(k) && next[k] === attempt[j]) delete next[k]
      })
      return next
    })
    judged.current[i] = ''
    // Back to the start of the word, if the child is still on it.
    setSel((cur) =>
      cur && cur.dir === e.dir && e.cells.some(([r, c]) => r === cur.r && c === cur.c)
        ? { r: e.row, c: e.col, dir: e.dir }
        : cur
    )
  }

  /** Written in for them after three tries, so the grid can always be finished. */
  const reveal = (i: number) => {
    const e = clues[i]
    const after = { ...letters }
    e.cells.forEach(([r, c], j) => {
      after[key(r, c)] = e.word[j]
    })
    setLetters((prev) => {
      const next = { ...prev }
      e.cells.forEach(([r, c], j) => {
        next[key(r, c)] = e.word[j]
      })
      return next
    })
    markSolved(i, 'shown')
    // A crossing word that this happens to complete wrongly was never the
    // child's try, so it isn't marked wrong — it just clears for them.
    for (const [r, c] of e.cells) {
      for (const j of squares.get(key(r, c))?.clues ?? []) {
        if (j === i || solvedRef.current[j] || clearing.current.has(j)) continue
        const fill = clues[j].cells.map(([rr, cc]) => after[key(rr, cc)] ?? '')
        if (fill.some((ch) => !ch)) continue
        const attempt = fill.join('')
        if (attempt === clues[j].word) continue // marked right in the usual way
        judged.current[j] = attempt
        clearing.current.add(j)
        later(() => clearAttempt(j, attempt, new Set()), MISS_SHOW_MS)
      }
    }
    setFlash({ text: `It was “${e.source.word}” — on to the next one!`, tone: 'bad' })
    speak(`It was ${e.source.word}. ${spellOut(e.source.word)}`)
  }

  const miss = (i: number, attempt: string) => {
    const e = clues[i]
    const used = (misses[i] ?? 0) + 1
    setMisses((m) => ({ ...m, [i]: used }))
    // Same soft sound, and the run of right answers starts again.
    cheer.miss({ quiet: true })
    setShake(i)
    later(() => setShake(null), 500)
    if (used >= MISSES_ALLOWED) {
      reveal(i)
      return
    }
    setFlash({ text: `Not quite — try ${e.number} ${e.dir} again.`, tone: 'bad' })
    // Long enough to see what went wrong, then a clean slate. When a crossing
    // letter finished this word while the child was typing another, the
    // squares of the word they're on are left alone.
    clearing.current.add(i)
    const keep =
      activeIdx >= 0 && activeIdx !== i
        ? new Set(clues[activeIdx].cells.map(([r, c]) => key(r, c)))
        : new Set<string>()
    later(() => clearAttempt(i, attempt, keep), MISS_SHOW_MS)
  }

  // Mark a clue the moment its last square is filled — whichever clue that
  // square was typed for, since a crossing letter can finish both.
  useEffect(() => {
    if (finished.current) return
    clues.forEach((e, i) => {
      if (solved[i] || clearing.current.has(i)) return
      const fill = e.cells.map(([r, c]) => letters[key(r, c)] ?? '')
      if (fill.some((ch) => !ch)) {
        judged.current[i] = ''
        return
      }
      const attempt = fill.join('')
      if (judged.current[i] === attempt) return
      judged.current[i] = attempt
      if (attempt === e.word) solve(i)
      else miss(i, attempt)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [letters])

  useEffect(() => {
    if (finished.current || clues.length === 0) return
    if (clues.every((_, i) => solved[i])) {
      finished.current = true
      sfx.win()
      later(() => onComplete(scoreRef.current), 2000)
      return
    }
    // Finished the clue in hand? On to the next one still open.
    if (activeIdx >= 0 && solved[activeIdx]) {
      for (let step = 1; step <= clues.length; step++) {
        const i = (activeIdx + step) % clues.length
        if (!solved[i]) {
          selectClue(i)
          break
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [solved])

  const readClue = () => {
    if (active) speak(active.clue.replace(/_+/g, 'blank'))
  }
  const hearWord = () => {
    if (!active || solved[activeIdx]) return
    setHeard((h) => ({ ...h, [activeIdx]: true }))
    speak(active.source.word)
  }

  // A real keyboard works too. The listener lives for the whole mount and
  // reaches the latest handlers through these refs.
  const typeRef = useRef(type)
  typeRef.current = type
  const eraseRef = useRef(erase)
  eraseRef.current = erase
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return
      const target = e.target as HTMLElement | null
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return
      if (/^[a-z]$/i.test(e.key)) {
        e.preventDefault()
        typeRef.current(e.key.toLowerCase())
      } else if (e.key === 'Backspace') {
        e.preventDefault()
        eraseRef.current()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Said once at the start, for a child who can't read the instructions yet.
  useEffect(() => {
    const first = clues[0]
    if (first) speak(`Let's solve the crossword! ${first.number} ${first.dir}: ${first.clue.replace(/_+/g, 'blank')}`)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (clues.length === 0) {
    return (
      <div className="criss-cross">
        {/* No button: onComplete() is a finished game to the hub, and it pays
            a star for one. "Back to Games" in the header is the way out. */}
        <p className="cx-empty">
          No words to cross yet — learn a few, then come back and build a
          crossword out of them! ✏️
        </p>
      </div>
    )
  }

  const doneCount = clues.filter((_, i) => solved[i]).length
  const dirs = (['across', 'down'] as Dir[]).filter((d) => clues.some((e) => e.dir === d))

  return (
    <div className="criss-cross">
      <div className="cx-header">
        <div className="cx-title">✏️ Criss-Cross</div>
        <div className="cx-stats">
          <div className="cx-stat"><span>Words</span><strong>{doneCount}/{clues.length}</strong></div>
          <div className="cx-stat"><span>Score</span><strong>{score}</strong></div>
        </div>
      </div>

      <div className="cx-grid" style={{ '--cx-cols': puzzle.cols } as React.CSSProperties} aria-label="The crossword">
        {Array.from({ length: puzzle.rows * puzzle.cols }, (_, n) => {
          const r = Math.floor(n / puzzle.cols)
          const c = n % puzzle.cols
          const k = key(r, c)
          const sq = squares.get(k)
          if (!sq) return <div key={k} className="cx-void" aria-hidden />
          const letter = letters[k] ?? ''
          const state = sq.clues.some((i) => solved[i] === 'ok')
            ? 'ok'
            : sq.clues.some((i) => solved[i] === 'shown')
            ? 'shown'
            : ''
          const classes = [
            'cx-square',
            state,
            sq.clues.includes(activeIdx) ? 'active' : '',
            sel?.r === r && sel?.c === c ? 'selected' : '',
            shake !== null && sq.clues.includes(shake) ? 'shake' : '',
          ]
          return (
            <button
              key={k}
              className={classes.filter(Boolean).join(' ')}
              onClick={() => tapSquare(r, c)}
              aria-label={`Row ${r + 1}, column ${c + 1}: ${letter || 'empty'}`}
            >
              {sq.number !== undefined && <span className="cx-num">{sq.number}</span>}
              <span className="cx-letter">{letter}</span>
            </button>
          )
        })}
      </div>

      <p className={`cx-flash ${flash?.tone ?? ''}`} aria-live="polite">
        {flash?.tone === 'ok' && <Burst trigger={hits} />}
        {flash?.text ?? ''}
      </p>

      {active && (
        <div className="cx-clue-bar">
          <div className="cx-clue-tag">
            {active.number} {active.dir === 'across' ? 'Across ➡️' : 'Down ⬇️'} · {active.word.length} letters
          </div>
          <p className="cx-clue-text">{active.clue}</p>
          <div className="cx-clue-actions">
            <button className="cx-btn ghost" onClick={readClue}>🔊 Read the clue</button>
            <button className="cx-btn ghost" onClick={hearWord} disabled={!!solved[activeIdx]}>
              👂 Hear the word
            </button>
          </div>
          {!solved[activeIdx] && !heard[activeIdx] && (
            <p className="cx-bonus">Solve it from the clue alone for a +{CLUE_ONLY_BONUS} bonus!</p>
          )}
        </div>
      )}

      <div className="cx-pad" role="group" aria-label="Letter keys">
        {KEY_ROWS.map((row, ri) => (
          <div key={row} className="cx-row">
            {row.split('').map((ch) => (
              <button key={ch} className="cx-key" onClick={() => type(ch)} aria-label={ch}>
                {ch}
              </button>
            ))}
            {ri === KEY_ROWS.length - 1 && (
              <button className="cx-key wide" onClick={erase} aria-label="Delete a letter">⌫</button>
            )}
          </div>
        ))}
      </div>

      <div className="cx-clues">
        {dirs.map((d) => (
          <div key={d} className="cx-clue-col">
            <h3>{d === 'across' ? 'Across ➡️' : 'Down ⬇️'}</h3>
            <ul>
              {clues.map((e, i) =>
                e.dir !== d ? null : (
                  <li key={i}>
                    <button
                      className={`cx-clue ${i === activeIdx ? 'on' : ''} ${solved[i] ? 'done' : ''}`}
                      onClick={() => selectClue(i)}
                      aria-label={`${e.number} ${d}: ${e.clue}`}
                    >
                      <strong>{e.number}</strong>
                      <span className="cx-clue-words">{e.clue}</span>
                      {solved[i] === 'ok' && <span aria-hidden>✅</span>}
                      {solved[i] === 'shown' && <span aria-hidden>👀</span>}
                    </button>
                  </li>
                )
              )}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CrissCross
