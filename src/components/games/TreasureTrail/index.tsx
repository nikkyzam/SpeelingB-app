import React, { useEffect, useMemo, useRef, useState } from 'react'
import type { Word } from '../../../services/wordBank'
import { useAudio } from '../../../contexts/AudioContext'
import { useTheme } from '../../../contexts/ThemeContext'
import { shuffle, isPlayable, letterTraps } from '../shared/wordTricks'
import { isRealWord, fakeSpelling } from '../shared/realWords'
import { maskClue } from '../shared/clues'
import useCheer from '../shared/useCheer'
import useLater from '../shared/useLater'
import Burst from '../shared/Burst'
import GameEmpty from '../shared/GameEmpty'
import sfx from '../shared/sfx'
import './TreasureTrail.css'

interface TreasureTrailProps {
  onComplete: (score: number) => void
  words?: Word[]
  tiles?: number
}

type TileKind = 'challenge' | 'star' | 'boost'
/** `moving` covers the dice and the walk, so a second tap can't roll again. */
type Phase = 'roll' | 'moving' | 'challenge' | 'result' | 'done'

interface Challenge {
  kind: 'spelling' | 'missing' | 'meaning'
  prompt: string
  word: string
  choices: string[]
  answer: string
}

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'
const DICE_FACES = ['⚀', '⚁', '⚂']
/** How long the token takes over each square of a move. */
const STEP_MS = 320

/**
 * Two wrong letters for the gap in `w` at `at`: the slips a speller really
 * makes (likelySlips via letterTraps), never one that spells another word —
 * "c_t" with a "u" is "cut", and a child who picked it wasn't wrong.
 */
const gapDecoys = (w: string, at: number, isWord: (t: string) => boolean): string[] => {
  const fits = (c: string) => !isWord(w.slice(0, at) + c + w.slice(at + 1))
  const picks = letterTraps(w, at, 6).filter(fits)
  for (const c of shuffle([...ALPHABET])) {
    if (picks.length >= 2) break
    if (c !== w[at] && !picks.includes(c) && fits(c)) picks.push(c)
  }
  return picks.slice(0, 2)
}

/** Build one of three quick puzzles from a word. */
export const makeChallenge = (
  word: Word,
  others: Word[],
  isWord: (text: string) => boolean = isRealWord
): Challenge => {
  const w = word.word.toLowerCase()
  const meaning = maskClue((word.meaning || '').split('.')[0].trim(), w)
  const decoyWords = [...new Set(others.map((o) => o.word.toLowerCase()).filter((o) => o !== w))]
  // Not every word carries a meaning, and a meaning needs two other words to
  // choose between — the rest become letter puzzles.
  const canMean = meaning.replace(/_{2,}|[^a-z]/gi, '').length >= 6 && decoyWords.length >= 2
  const roll = Math.floor(Math.random() * (canMean ? 3 : 2))

  if (roll === 1 && w.length >= 3) {
    // One letter has gone missing — which one belongs?
    const at = 1 + Math.floor(Math.random() * Math.max(w.length - 2, 1))
    const missing = w[at]
    return {
      kind: 'missing',
      prompt: `Which letter is missing? ${w.slice(0, at)}_${w.slice(at + 1)}`,
      word: w,
      choices: shuffle([missing, ...gapDecoys(w, at, isWord)]),
      answer: missing,
    }
  }

  if (roll === 2 && canMean) {
    // Vocabulary: match the meaning to the word.
    return {
      kind: 'meaning',
      prompt: `Which word means “${meaning}”?`,
      word: w,
      choices: shuffle([w, ...shuffle(decoyWords).slice(0, 2)]),
      answer: w,
    }
  }

  // Spot the right spelling among believable fakes that aren't words.
  const fakes = new Set<string>()
  for (let i = 0; i < 8 && fakes.size < 2; i++) {
    const bad = fakeSpelling(w, isWord)
    if (bad !== w) fakes.add(bad)
  }
  if (fakes.size < 2) fakes.add(w + w.slice(-1))
  if (fakes.size < 2) fakes.add(w + w.slice(-1) + w.slice(-1))
  return {
    kind: 'spelling',
    prompt: 'Which spelling is correct?',
    word: w,
    choices: shuffle([w, ...fakes]),
    answer: w,
  }
}

/** A prompt read aloud: "Which word means “a ____ of bees”?" → "... a blank of bees". */
const spoken = (text: string) => text.replace(/_{2,}/g, 'blank')

/**
 * A board game where every square is a tiny word puzzle.
 *
 * Rolling the dice gives a child a reason to keep going that has nothing to do
 * with being right — you always move forward, so the trail is never a punishment.
 */
const TreasureTrail: React.FC<TreasureTrailProps> = ({ onComplete, words: providedWords, tiles = 12 }) => {
  const { speak } = useAudio()
  const { world } = useTheme()
  const cheer = useCheer()
  const later = useLater()

  const pool = useMemo<Word[]>(() => {
    const base = providedWords && providedWords.length > 0 ? providedWords : []
    return shuffle(base).filter((w) => isPlayable(w))
  }, [providedWords])

  // A trail of mostly-puzzle tiles, sprinkled with freebies so there's a reason
  // to hope for a particular dice roll.
  const board = useMemo<TileKind[]>(
    () =>
      Array.from({ length: tiles }, (_, i) => {
        if (i === tiles - 1) return 'challenge'
        if (i % 5 === 3) return 'star'
        if (i % 7 === 5) return 'boost'
        return 'challenge'
      }),
    [tiles]
  )

  const [position, setPosition] = useState(-1) // -1 = at the start line
  const [dice, setDice] = useState<number | null>(null)
  const [phase, setPhase] = useState<Phase>('roll')
  const [challenge, setChallenge] = useState<Challenge | null>(null)
  const [picked, setPicked] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [solved, setSolved] = useState(0)
  const [hits, setHits] = useState(0)
  const [message, setMessage] = useState('Roll the dice to start your treasure hunt!')

  // Refs settle each tap once — a state guard loses to a fast double tap,
  // which rolled two or three times, paid star squares twice and could reach
  // the treasure twice. The score lives in a ref too, because the walk and
  // the gust of wind finish in timers that would read a stale state.
  const busy = useRef(false)
  const answered = useRef(false)
  const finished = useRef(false)
  const points = useRef(0)
  const nextWord = useRef(0)

  // Said once at the start, for a child who can't read the instructions yet.
  useEffect(() => {
    if (pool.length > 0) speak('Roll the dice to start your treasure hunt!')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (pool.length === 0) {
    return (
      <div className="treasure-trail">
        <GameEmpty icon="🗺️">The map is blank — learn a few words first, then come back to hunt for treasure!</GameEmpty>
      </div>
    )
  }

  const addPoints = (n: number) => {
    points.current += n
    setScore(points.current)
  }

  const backToRolling = () => {
    busy.current = false
    setPhase('roll')
  }

  const finish = () => {
    if (finished.current) return
    finished.current = true
    addPoints(100)
    setPhase('done')
    setMessage('🏆 TREASURE! You made it all the way to the chest!')
    sfx.win()
    speak('You found the treasure!')
    later(() => onComplete(points.current), 2800)
  }

  const landOn = (spot: number) => {
    if (spot >= tiles - 1) {
      finish()
      return
    }

    const kind = board[spot]
    if (kind === 'star') {
      addPoints(25)
      setHits((h) => h + 1)
      setMessage('⭐ A star square! +25 free points!')
      sfx.star()
      backToRolling()
      return
    }
    if (kind === 'boost') {
      setMessage('💨 A gust of wind pushes you one step further!')
      sfx.whoosh()
      later(() => {
        setPosition(spot + 1)
        landOn(spot + 1)
      }, 700)
      return
    }

    // Walk through their words in turn, so the same one doesn't keep coming up.
    const word = pool[nextWord.current % pool.length]
    nextWord.current += 1
    const next = makeChallenge(word, pool)
    answered.current = false
    setChallenge(next)
    setPicked(null)
    setPhase('challenge')
    setMessage('A puzzle blocks the path!')
    speak(next.kind === 'meaning' ? spoken(next.prompt) : next.word)
  }

  const roll = () => {
    if (busy.current || phase !== 'roll') return
    busy.current = true
    setPhase('moving')
    const steps = 1 + Math.floor(Math.random() * 3)
    setDice(steps)
    sfx.whoosh()
    const from = position
    const spot = Math.min(from + steps, tiles - 1)
    setMessage(`🎲 You rolled a ${steps}!`)
    // Hop one square at a time, so a child can count the move.
    for (let s = from + 1; s <= spot; s++) {
      later(() => {
        setPosition(s)
        sfx.tap()
      }, 450 + (s - from - 1) * STEP_MS)
    }
    later(() => landOn(spot), 450 + (spot - from) * STEP_MS)
  }

  const answer = (choice: string) => {
    if (answered.current || phase !== 'challenge' || !challenge) return
    answered.current = true
    setPicked(choice)
    const ok = choice === challenge.answer

    if (ok) {
      addPoints(30)
      setSolved((s) => s + 1)
      setHits((h) => h + 1)
      const line = cheer.hit({ say: challenge.kind === 'missing' ? challenge.word : undefined })
      setMessage(`✅ ${line} The path opens! +30`)
    } else {
      const it = challenge.kind === 'missing' ? `the letter ${challenge.answer}, for ${challenge.word}` : challenge.word
      const line = cheer.miss({ say: `It was ${it}.` })
      setMessage(`${line} It was “${challenge.answer}” — keep going, explorer!`)
    }
    setPhase('result')
    later(() => {
      setChallenge(null)
      backToRolling()
    }, ok ? 1300 : 2300)
  }

  return (
    <div className="treasure-trail">
      <div className="tt-header">
        <div className="tt-title">🗺️ Treasure Trail</div>
        <div className="tt-stats">
          <div className="tt-stat"><span>Step</span><strong>{Math.max(position + 1, 0)}/{tiles}</strong></div>
          <div className="tt-stat"><span>Score</span><strong>{score}</strong></div>
          <div className="tt-stat"><span>Solved</span><strong>🧩 {solved}</strong></div>
        </div>
      </div>

      <div className="tt-board">
        {board.map((kind, i) => (
          <div key={i} className={`tt-tile ${kind} ${i === position ? 'here' : ''} ${i < position ? 'passed' : ''}`}>
            <span className="tt-tile-icon" aria-hidden>
              {i === tiles - 1 ? '💰' : kind === 'star' ? '⭐' : kind === 'boost' ? '💨' : '🧩'}
            </span>
            {i === position && <span className="tt-token" aria-hidden>{world.mascot}</span>}
          </div>
        ))}
      </div>

      <div className={`tt-message ${phase}`} role="status">
        <Burst trigger={hits} />
        {phase === 'moving' && dice && <span className="tt-die" aria-hidden>{DICE_FACES[dice - 1]}</span>}
        {message}
      </div>

      {phase === 'roll' && (
        <button className="tt-btn dice" onClick={roll}>
          🎲 Roll the dice{dice ? ` (last: ${dice})` : ''}
        </button>
      )}

      {(phase === 'challenge' || phase === 'result') && challenge && (
        <div className="tt-challenge">
          <p className="tt-prompt">{challenge.prompt}</p>
          <button
            className="tt-btn ghost"
            onClick={() => speak(challenge.kind === 'meaning' ? spoken(challenge.prompt) : challenge.word)}
          >
            🔊 {challenge.kind === 'meaning' ? 'Hear the clue' : 'Hear the word'}
          </button>
          <div className={`tt-choices ${challenge.kind === 'missing' ? 'letters' : ''}`}>
            {challenge.choices.map((c) => {
              let cls = 'tt-choice'
              if (picked) {
                if (c === challenge.answer) cls += ' right'
                else if (c === picked) cls += ' wrong'
                else cls += ' dim'
              }
              return (
                <button key={c} className={cls} onClick={() => answer(c)} disabled={!!picked}>
                  {c}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {phase === 'done' && <div className="tt-treasure" aria-hidden>💰✨🎉</div>}
    </div>
  )
}

export default TreasureTrail
