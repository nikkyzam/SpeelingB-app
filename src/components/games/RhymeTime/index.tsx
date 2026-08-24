import React, { useEffect, useMemo, useState } from 'react'
import { wordBank, Word } from '../../../services/wordBank'
import { useAudio } from '../../../contexts/AudioContext'
import { shuffle, rhymes, rimeOf, RHYME_FAMILIES, isPlayable } from '../shared/wordTricks'
import sfx from '../shared/sfx'
import './RhymeTime.css'

interface RhymeTimeProps {
  onComplete: (score: number) => void
  words?: Word[]
  rounds?: number
}

interface Round {
  target: string
  correct: string
  choices: string[]
}

const FAMILY_WORDS = RHYME_FAMILIES.flat()

/**
 * Two tempting wrong answers that definitely do NOT rhyme with the target.
 * The ending check here is deliberately loose (any shared rime disqualifies a
 * decoy) so a "nearly rhymes" word can never end up marked wrong.
 */
const pickDecoys = (target: string, correct: string, extra: string[]): string[] =>
  shuffle([...FAMILY_WORDS, ...extra])
    .filter((w) => w !== target && w !== correct && rimeOf(w) !== rimeOf(target))
    .filter((w, i, arr) => arr.indexOf(w) === i)
    .slice(0, 2)

/**
 * Hearing that "cake" and "snake" end the same way is the doorway to sounding
 * words out. This is the ear-training game: no spelling, just listening.
 */
const RhymeTime: React.FC<RhymeTimeProps> = ({ onComplete, words: providedWords, rounds = 6 }) => {
  const { speak } = useAudio()

  const gameRounds = useMemo<Round[]>(() => {
    const pool = (providedWords && providedWords.length > 0 ? providedWords : wordBank.getRandomWords(40))
      .filter((w) => isPlayable(w))
      .map((w) => w.word.toLowerCase())
    const built: Round[] = []

    // First choice: the child's own words, when one of them actually rhymes
    // with something familiar. Their words should show up in their games.
    shuffle(pool).forEach((target) => {
      if (built.length >= rounds) return
      const partner = shuffle([...FAMILY_WORDS, ...pool]).find((w) => rhymes(w, target))
      if (!partner) return
      const choices = shuffle([partner, ...pickDecoys(target, partner, pool)])
      if (choices.length === 3) built.push({ target, correct: partner, choices })
    })

    // Top up from the classic rhyme families so the game is always full length.
    shuffle(RHYME_FAMILIES).forEach((family) => {
      if (built.length >= rounds) return
      const [target, correct] = shuffle(family)
      if (built.some((r) => r.target === target)) return
      const choices = shuffle([correct, ...pickDecoys(target, correct, [])])
      if (choices.length === 3) built.push({ target, correct, choices })
    })

    return built.slice(0, rounds)
  }, [providedWords, rounds])

  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [picked, setPicked] = useState<string | null>(null)

  const current = gameRounds[index]

  useEffect(() => {
    if (current) speak(`Which word rhymes with ${current.target}?`)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index])

  if (!current) {
    return (
      <div className="rhyme-time">
        <p className="rt-empty">The mic is warming up — try again in a moment! 🎤</p>
        <button className="rt-btn" onClick={() => onComplete(0)}>Back to Games</button>
      </div>
    )
  }

  const choose = (choice: string) => {
    if (picked) return
    setPicked(choice)

    if (choice === current.correct) {
      const nextStreak = streak + 1
      const points = 25 + (nextStreak >= 3 ? 15 : 0)
      setScore((s) => s + points)
      setStreak(nextStreak)
      sfx.correct()
      speak(`${current.target}, ${choice}. They rhyme!`)
      setTimeout(() => {
        if (index < gameRounds.length - 1) {
          setIndex((i) => i + 1)
          setPicked(null)
        } else {
          sfx.win()
          onComplete(score + points)
        }
      }, 2000)
    } else {
      setStreak(0)
      sfx.wrong()
      speak(`${current.target} rhymes with ${current.correct}`)
      setTimeout(() => {
        if (index < gameRounds.length - 1) {
          setIndex((i) => i + 1)
          setPicked(null)
        } else {
          sfx.win()
          onComplete(score)
        }
      }, 2400)
    }
  }

  const right = picked === current.correct

  return (
    <div className="rhyme-time">
      <div className="rt-header">
        <div className="rt-title">🎤 Rhyme Time</div>
        <div className="rt-stats">
          <div className="rt-stat"><span>Round</span><strong>{index + 1}/{gameRounds.length}</strong></div>
          <div className="rt-stat"><span>Score</span><strong>{score}</strong></div>
          <div className="rt-stat"><span>Streak</span><strong>🔥 {streak}</strong></div>
        </div>
      </div>

      <div className="rt-stage">
        <span className="rt-note n1" aria-hidden>🎵</span>
        <span className="rt-note n2" aria-hidden>🎶</span>
        <div className="rt-mic" aria-hidden>🎤</div>
        <p className="rt-question">What rhymes with…</p>
        <button className="rt-target" onClick={() => speak(current.target)}>
          {current.target}
          <span className="rt-target-speak" aria-hidden>🔊</span>
        </button>
      </div>

      <div className="rt-choices">
        {current.choices.map((c) => {
          const isRight = c === current.correct
          let cls = 'rt-choice'
          if (picked) {
            if (isRight) cls += ' right'
            else if (c === picked) cls += ' wrong'
            else cls += ' dim'
          }
          return (
            <button key={c} className={cls} onClick={() => choose(c)} disabled={!!picked}>
              {c}
            </button>
          )
        })}
      </div>

      {picked && (
        <div className={`rt-flash ${right ? 'ok' : 'bad'}`}>
          {right
            ? `🎉 Yes! “${current.target}” and “${current.correct}” rhyme!`
            : `“${current.target}” rhymes with “${current.correct}” — listen again! 👂`}
        </div>
      )}
    </div>
  )
}

export default RhymeTime
