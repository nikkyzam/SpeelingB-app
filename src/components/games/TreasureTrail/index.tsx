import React, { useMemo, useState } from 'react'
import { wordBank, Word } from '../../../services/wordBank'
import { useAudio } from '../../../contexts/AudioContext'
import { useTheme } from '../../../contexts/ThemeContext'
import { shuffle, misspell, isPlayable } from '../shared/wordTricks'
import sfx from '../shared/sfx'
import './TreasureTrail.css'

interface TreasureTrailProps {
  onComplete: (score: number) => void
  words?: Word[]
  tiles?: number
}

type TileKind = 'challenge' | 'star' | 'boost'
type Phase = 'roll' | 'challenge' | 'result' | 'done'

interface Challenge {
  kind: 'spelling' | 'missing' | 'meaning'
  prompt: string
  word: string
  choices: string[]
  answer: string
}

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'

/** Build one of three quick puzzles from a word. */
const makeChallenge = (word: Word, others: Word[]): Challenge => {
  const w = word.word.toLowerCase()
  const meaning = (word.meaning || '').split('.')[0]
  // Not every word in the bank carries a meaning — those become letter puzzles.
  const roll = Math.floor(Math.random() * (meaning ? 3 : 2))

  if (roll === 0 || !w) {
    // Spot the right spelling among believable fakes.
    const fakes = new Set<string>()
    for (let i = 0; i < 8 && fakes.size < 2; i++) {
      const bad = misspell(w)
      if (bad !== w) fakes.add(bad)
    }
    while (fakes.size < 2) fakes.add(w + w.slice(-1))
    return {
      kind: 'spelling',
      prompt: 'Which spelling is correct?',
      word: w,
      choices: shuffle([w, ...fakes]),
      answer: w,
    }
  }

  if (roll === 1) {
    // One letter has gone missing — which one belongs?
    const at = 1 + Math.floor(Math.random() * Math.max(w.length - 2, 1))
    const missing = w[at]
    const decoys = shuffle(ALPHABET.split('').filter((c) => c !== missing)).slice(0, 2)
    return {
      kind: 'missing',
      prompt: `Which letter is missing? ${w.slice(0, at)}_${w.slice(at + 1)}`,
      word: w,
      choices: shuffle([missing, ...decoys]),
      answer: missing,
    }
  }

  // Vocabulary: match the meaning to the word.
  const decoys = shuffle(others.filter((o) => o.id !== word.id))
    .slice(0, 2)
    .map((o) => o.word.toLowerCase())
  return {
    kind: 'meaning',
    prompt: `Which word means “${meaning}”?`,
    word: w,
    choices: shuffle([w, ...decoys]),
    answer: w,
  }
}

/**
 * A board game where every square is a tiny word puzzle.
 *
 * Rolling the dice gives a child a reason to keep going that has nothing to do
 * with being right — you always move forward, so the trail is never a punishment.
 */
const TreasureTrail: React.FC<TreasureTrailProps> = ({ onComplete, words: providedWords, tiles = 12 }) => {
  const { speak } = useAudio()
  const { world } = useTheme()

  const pool = useMemo<Word[]>(() => {
    const base = providedWords && providedWords.length > 0 ? providedWords : wordBank.getRandomWords(40)
    const usable = shuffle(base).filter((w) => isPlayable(w))
    return usable.length >= 6 ? usable : [...usable, ...wordBank.getRandomWords(40).filter((w) => isPlayable(w))]
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
  const [message, setMessage] = useState('Roll the dice to start your treasure hunt!')

  if (pool.length === 0) {
    return (
      <div className="treasure-trail">
        <p className="tt-empty">The map is blank — learn a few words first! 🗺️</p>
        <button className="tt-btn" onClick={() => onComplete(0)}>Back to Games</button>
      </div>
    )
  }

  const finish = (total: number) => {
    setPhase('done')
    setScore(total)
    setMessage('🏆 TREASURE! You made it all the way to the chest!')
    sfx.win()
    speak('You found the treasure!')
    setTimeout(() => onComplete(total), 2800)
  }

  const landOn = (spot: number) => {
    if (spot >= tiles - 1) {
      finish(score + 100)
      return
    }

    const kind = board[spot]
    if (kind === 'star') {
      setScore((s) => s + 25)
      setMessage('⭐ A star square! +25 free points!')
      sfx.star()
      setPhase('roll')
      return
    }
    if (kind === 'boost') {
      setMessage('💨 A gust of wind pushes you one step further!')
      sfx.whoosh()
      setTimeout(() => {
        setPosition(spot + 1)
        landOn(spot + 1)
      }, 700)
      return
    }

    const word = pool[Math.floor(Math.random() * pool.length)]
    const next = makeChallenge(word, pool)
    setChallenge(next)
    setPicked(null)
    setPhase('challenge')
    setMessage('A puzzle blocks the path!')
    if (next.kind !== 'meaning') speak(next.word)
  }

  const roll = () => {
    if (phase !== 'roll') return
    const steps = 1 + Math.floor(Math.random() * 3)
    setDice(steps)
    sfx.whoosh()
    const spot = Math.min(position + steps, tiles - 1)
    setMessage(`🎲 You rolled a ${steps}!`)
    setTimeout(() => {
      setPosition(spot)
      landOn(spot)
    }, 650)
  }

  const answer = (choice: string) => {
    if (phase !== 'challenge' || !challenge) return
    setPicked(choice)
    const ok = choice === challenge.answer

    if (ok) {
      setScore((s) => s + 30)
      setSolved((s) => s + 1)
      setMessage('✅ Solved it! The path opens. +30')
      sfx.correct()
    } else {
      setMessage(`The answer was “${challenge.answer}” — keep going, explorer!`)
      sfx.wrong()
      speak(challenge.word)
    }
    setPhase('result')
    setTimeout(() => {
      setChallenge(null)
      setPhase('roll')
    }, ok ? 1200 : 2200)
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

      <p className={`tt-message ${phase}`}>{message}</p>

      {phase === 'roll' && (
        <button className="tt-btn dice" onClick={roll}>
          🎲 Roll the dice{dice ? ` (last: ${dice})` : ''}
        </button>
      )}

      {(phase === 'challenge' || phase === 'result') && challenge && (
        <div className="tt-challenge">
          <p className="tt-prompt">{challenge.prompt}</p>
          {challenge.kind !== 'meaning' && (
            <button className="tt-btn ghost" onClick={() => speak(challenge.word)}>🔊 Hear the word</button>
          )}
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
