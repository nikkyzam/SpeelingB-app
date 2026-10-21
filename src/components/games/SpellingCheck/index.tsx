import React, { useMemo, useState, useEffect, useRef } from 'react'
import type { Word } from '../../../services/wordBank'
import { useAudio } from '../../../contexts/AudioContext'
import { shuffle, isPlayable, likelySlips } from '../shared/wordTricks'
import { fakeSpelling, isRealWord } from '../shared/realWords'
import { maskClue } from '../shared/clues'
import { useCheer } from '../shared/useCheer'
import { useLater } from '../shared/useLater'
import { spellOut } from '../../../services/words/praise'
import Burst from '../shared/Burst'
import GameEmpty from '../shared/GameEmpty'
import './SpellingCheck.css'

interface SpellingCheckProps {
  onComplete: (score: number) => void
  words?: Word[]
  rounds?: number
}

const HIT_MS = 1400
/** Long enough to read the right spelling and hear it spelled out. */
const MISS_MS = 2400

/**
 * Misspellings a child would really write: one letter swapped for the letter
 * a speller reaches for there (half of a double dropped, a false double, a
 * sound-alike). The first letter is left alone — "ccat" or "kcat" was spotted
 * by its shape alone, without reading the word at all.
 */
export const slipSpellings = (word: string): string[] => {
  const w = word.toLowerCase()
  const out = new Set<string>()
  for (let i = 1; i < w.length; i++) {
    // Half of a double left out: "balon" for "balloon".
    if (w[i] === w[i - 1]) out.add(w.slice(0, i) + w.slice(i + 1))
    for (const slip of likelySlips(w, i).slice(0, 2)) out.add(w.slice(0, i) + slip + w.slice(i + 1))
  }
  out.delete(w)
  return [...out]
}

/**
 * The right spelling plus three that look right and aren't words: a
 * "misspelling" that is really another word ("from" for "form") would teach a
 * child that a correct spelling is wrong.
 */
export const buildOptions = (word: string, isWord: (text: string) => boolean = isRealWord): string[] => {
  const w = word.toLowerCase()
  const fakes = new Set<string>()
  for (const s of shuffle(slipSpellings(w))) {
    if (fakes.size >= 3) break
    if (!isWord(s)) fakes.add(s)
  }
  let guard = 0
  while (fakes.size < 3 && guard++ < 20) {
    const f = fakeSpelling(w, isWord)
    if (f !== w) fakes.add(f)
  }
  return shuffle([w, ...fakes])
}

/** Hear the word, then tap the correctly-spelled version. */
const SpellingCheck: React.FC<SpellingCheckProps> = ({ onComplete, words: providedWords, rounds = 6 }) => {
  const { speak } = useAudio()
  const cheer = useCheer()
  const later = useLater()

  const roundWords = useMemo<Word[]>(() => {
    const pool = providedWords && providedWords.length > 0 ? providedWords : []
    return shuffle(pool).filter((w) => isPlayable(w, 3)).slice(0, rounds)
  }, [providedWords, rounds])

  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [picked, setPicked] = useState<string | null>(null)
  const [line, setLine] = useState('')
  const [hits, setHits] = useState(0)
  const settled = useRef(false)

  const current = roundWords[index]
  const answer = (current?.word || '').toLowerCase()
  const options = useMemo(() => (answer ? buildOptions(answer) : []), [answer])
  const clue = useMemo(
    () => (current ? maskClue((current.meaning || '').split(/[.;]/)[0].trim(), answer) : ''),
    [current, answer]
  )

  useEffect(() => {
    if (current) speak(current.word, { queue: index > 0 })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, roundWords])

  // Cleared in the same step as moving on, so the next word's first frame
  // never shows the last verdict (it would mark the new answer).
  const nextWord = () => {
    settled.current = false
    setPicked(null)
    setLine('')
    setIndex((i) => i + 1)
  }

  if (!current) {
    return (
      <div className="spelling-check">
        <GameEmpty icon="🔍">No words to check yet — learn a few, then come back and spot the right spellings!</GameEmpty>
      </div>
    )
  }

  const pick = (opt: string) => {
    if (settled.current) return
    settled.current = true
    setPicked(opt)
    const correct = opt === answer
    const gained = correct ? 15 + streak * 3 : 0
    if (correct) {
      setScore((s) => s + gained)
      setStreak((s) => s + 1)
      setHits((h) => h + 1)
      setLine(cheer.hit({ say: current.word }))
    } else {
      setStreak(0)
      setLine(cheer.miss({ say: `It's spelled ${spellOut(answer)}.` }))
    }
    later(() => {
      if (index < roundWords.length - 1) nextWord()
      else onComplete(score + gained)
    }, correct ? HIT_MS : MISS_MS)
  }

  const right = picked === answer

  return (
    <div className="spelling-check">
      <div className="sck-header">
        <div className="sck-title">🔍 Spelling Check</div>
        <div className="sck-stats">
          <div className="sck-stat"><span>Word</span><strong>{index + 1}/{roundWords.length}</strong></div>
          <div className="sck-stat"><span>Score</span><strong>{score}</strong></div>
          <div className="sck-stat"><span>Streak</span><strong>🔥 {streak}</strong></div>
        </div>
      </div>

      <p className="sck-question">Which spelling is right?</p>
      <button className="sck-hear" onClick={() => speak(current.word)}>🔊 Hear it again</button>
      {clue && <p className="sck-clue">Clue: {clue}</p>}

      <div className="sck-options">
        {options.map((opt) => {
          let cls = 'sck-option'
          if (picked) {
            if (opt === answer) cls += ' correct'
            else if (opt === picked) cls += ' missed'
          }
          return (
            <button key={opt} className={cls} onClick={() => pick(opt)} disabled={!!picked}>
              {opt}
            </button>
          )
        })}
      </div>

      {picked && (
        <div className={`sck-flash ${right ? 'ok' : 'bad'}`} role="status">
          {right ? (
            <>
              {line} 🎉
              <Burst trigger={hits} />
            </>
          ) : (
            <>It’s spelled “{answer}” — you’ll get the next one! 💪</>
          )}
        </div>
      )}
    </div>
  )
}

export default SpellingCheck
