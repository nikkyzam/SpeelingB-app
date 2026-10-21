import React, { useEffect, useMemo, useRef, useState } from 'react'
import type { Word } from '../../../services/wordBank'
import { useAudio } from '../../../contexts/AudioContext'
import { shuffle, isPlayable } from '../shared/wordTricks'
import { maskClue } from '../shared/clues'
import { spellOut } from '../../../services/words/praise'
import sfx from '../shared/sfx'
import useCheer from '../shared/useCheer'
import useLater from '../shared/useLater'
import Burst from '../shared/Burst'
import GameEmpty from '../shared/GameEmpty'
import SpellingInput from '../../common/SpellingInput'
import './WordScramble.css'

interface WordScrambleProps {
  onComplete: (score: number) => void
  words?: Word[]
  rounds?: number
}

/** The letters of `word` in a different order. Needs two different letters. */
export const scramble = (word: string): string => {
  if (new Set(word).size < 2) return word
  for (let t = 0; t < 20; t++) {
    const s = shuffle([...word]).join('')
    if (s !== word) return s
  }
  // A rotation always differs once there are two different letters.
  return word.slice(1) + word[0]
}

/** Which tiles the typed letters have used up, left to right. */
export const usedTiles = (tiles: string[], typed: string): boolean[] => {
  const used = tiles.map(() => false)
  for (const ch of typed.toLowerCase()) {
    const k = tiles.findIndex((t, i) => !used[i] && t === ch)
    if (k >= 0) used[k] = true
  }
  return used
}

interface Puzzle {
  word: Word
  answer: string
  tiles: string[]
}

/**
 * Word Scramble — put a jumbled word back together.
 *
 * Tap the letter tiles (or type) to rebuild the word. "🔊 Hear it" and the
 * clue are there on request; a solve without them earns a little extra. A
 * wrong answer gets one more go, then the word is shown and spelled out and
 * the next puzzle comes up — it used to stay on screen to be copied for full
 * points.
 */
const WordScramble: React.FC<WordScrambleProps> = ({ onComplete, words: providedWords, rounds = 6 }) => {
  const { speak } = useAudio()
  const cheer = useCheer()
  const later = useLater()

  const puzzles = useMemo<Puzzle[]>(
    () =>
      shuffle(providedWords ?? [])
        .filter((w) => isPlayable(w, 3) && new Set(w.word.toLowerCase()).size >= 2)
        .slice(0, rounds)
        .map((w) => {
          const answer = w.word.toLowerCase()
          return { word: w, answer, tiles: [...scramble(answer)] }
        }),
    [providedWords, rounds]
  )

  const [index, setIndex] = useState(0)
  const [input, setInput] = useState('')
  const [tries, setTries] = useState(0)
  const [helped, setHelped] = useState(false)
  const [showClue, setShowClue] = useState(false)
  const [flash, setFlash] = useState<'ok' | 'again' | 'shown' | null>(null)
  const [note, setNote] = useState('')
  const [line, setLine] = useState('')
  const [shake, setShake] = useState(false)
  const [score, setScore] = useState(0)
  const [solved, setSolved] = useState(0)
  const [streak, setStreak] = useState(0)
  const [hits, setHits] = useState(0)
  // One answer per check: two Enters inside a second used to score twice.
  const locked = useRef(false)

  const current = puzzles[index]

  useEffect(() => {
    if (!current) return
    setInput('')
    setTries(0)
    setHelped(false)
    setShowClue(false)
    setFlash(null)
    setNote('')
    locked.current = false
    sfx.whoosh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, puzzles])

  if (!current) {
    return (
      <div className="word-scramble">
        <GameEmpty icon="🔤">No words to unscramble yet — learn a few, then come back and play!</GameEmpty>
      </div>
    )
  }

  const { answer, tiles, word } = current
  const settled = flash === 'ok' || flash === 'shown'
  const used = usedTiles(tiles, input)
  const clue = word.meaning ? maskClue(word.meaning, word.word) : ''

  const advance = (gained: number, ms: number) => {
    later(() => {
      if (index < puzzles.length - 1) {
        // Clear the last word's verdict in the same step that moves on: left to
        // the effect, one frame could show the new word's answer under the old flash.
        setInput('')
        setTries(0)
        setHelped(false)
        setShowClue(false)
        setFlash(null)
        setNote('')
        setIndex((i) => i + 1)
      } else onComplete(score + gained)
    }, ms)
  }

  const check = () => {
    if (locked.current || settled) return
    const typed = input.trim().toLowerCase()
    if (!typed) return
    // Half a word isn't an answer yet — nothing is marked until every letter is in.
    if (typed.length < answer.length) {
      setNote(`Use all ${answer.length} letters`)
      return
    }
    locked.current = true
    setNote('')

    if (typed === answer) {
      const gained = (tries === 0 ? 40 : 20) + (helped ? 0 : 10)
      setScore((s) => s + gained)
      setSolved((n) => n + 1)
      setFlash('ok')
      setLine(cheer.hit({ say: word.word }))
      setStreak(cheer.streak())
      setHits((h) => h + 1)
      advance(gained, 1400)
      return
    }

    setStreak(0)
    setShake(true)
    later(() => setShake(false), 400)

    if (tries === 0) {
      setTries(1)
      setFlash('again')
      setLine(cheer.miss({ say: 'Have another go!' }))
      // The wrong answer doesn't stay up to be patched letter by letter.
      later(() => {
        setInput('')
        setFlash(null)
        locked.current = false
      }, 900)
      return
    }

    setFlash('shown')
    setInput(answer)
    setLine(cheer.miss({ say: `It's spelled ${spellOut(answer)}.` }))
    advance(0, 2400)
  }

  const tapTile = (k: number) => {
    if (locked.current || settled || used[k]) return
    sfx.tap()
    setNote('')
    // Re-checked against the latest letters, so a fast double tap uses a tile once.
    setInput((v) => (usedTiles(tiles, v)[k] ? v : v + tiles[k]))
  }

  const hear = () => {
    setHelped(true)
    speak(word.word)
  }

  const openClue = () => {
    setHelped(true)
    setShowClue(true)
    speak(clue.replace(/_+/g, 'blank'))
  }

  return (
    <div className="word-scramble">
      <div className="wsc-header">
        <div className="wsc-title">🔤 Word Scramble</div>
        <div className="wsc-stats">
          <div className="wsc-stat"><span>Word</span><strong>{index + 1}/{puzzles.length}</strong></div>
          <div className="wsc-stat"><span>Score</span><strong>{score}</strong></div>
          <div className="wsc-stat"><span>Solved</span><strong>✨ {solved}</strong></div>
        </div>
      </div>

      <p className="wsc-help">Tap the letters to put the word back together!</p>

      <div className={`wsc-tiles ${shake ? 'shake' : ''}`} role="group" aria-label="Scrambled letters">
        <Burst trigger={hits} />
        {(flash === 'shown' ? [...answer] : tiles).map((t, k) => (
          <button
            key={`${flash === 'shown' ? 'a' : 't'}-${k}`}
            className={`wsc-tile ${flash !== 'shown' && used[k] ? 'used' : ''} ${flash === 'shown' ? 'shown' : ''}`}
            onClick={() => tapTile(k)}
            disabled={settled || used[k] || flash === 'again'}
            aria-label={`Letter ${t}`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="wsc-answer">
        <SpellingInput
          type="text"
          value={input}
          onChange={(e) => {
            setNote('')
            setInput(e.target.value)
          }}
          onKeyDown={(e) => e.key === 'Enter' && check()}
          className={`wsc-input ${flash ?? ''}`}
          placeholder="Your word"
          aria-label="Your word"
          disabled={settled || flash === 'again'}
          autoFocus
        />
        <button className="wsc-btn ghost" onClick={() => setInput('')} disabled={settled || !input} aria-label="Clear my letters">
          ↺
        </button>
        <button className="wsc-btn" onClick={check} disabled={settled || !input.trim()} aria-label="Check my word">
          ✓ Check
        </button>
      </div>
      <p className="wsc-note" aria-live="polite">{note}</p>

      <div className="wsc-helpers">
        <button className="wsc-btn ghost" onClick={hear} disabled={settled} aria-label="Hear the word">
          🔊 Hear it
        </button>
        {clue && (
          <button className="wsc-btn ghost" onClick={openClue} disabled={settled || showClue} aria-label="Show a clue">
            💡 Clue
          </button>
        )}
      </div>
      {showClue && clue && <p className="wsc-clue">{clue}</p>}

      {flash === 'ok' && <div className="wsc-flash ok">🎉 {line}</div>}
      {flash === 'again' && <div className="wsc-flash soft">{line} Have another go! 💪</div>}
      {flash === 'shown' && (
        <div className="wsc-flash soft">
          {line} It's “{word.word}” — the next one is yours! 💪
        </div>
      )}
      {!flash && streak >= 2 && <div className="wsc-streak">🔥 {streak} in a row!</div>}
    </div>
  )
}

export default WordScramble
