import React, { useEffect, useMemo, useState } from 'react'
import type { Word } from '../../../services/wordBank'
import { useAudio } from '../../../contexts/AudioContext'
import ReviewSchedule from '../../../services/progress/ReviewSchedule'
import { pickRounds } from '../shared/plurals'
import sfx from '../shared/sfx'
import './WordMachine.css'

interface WordMachineProps {
  onComplete: (score: number) => void
  words?: Word[]
  rounds?: number
}

const REVEAL_MS = 2400

/**
 * Feed a word into the machine and out comes more than one of it.
 *
 * Every other spelling game here asks "how do you spell this word?". This one
 * asks "what happens to the spelling when there are two?" — boxes not boxs,
 * babies not babys — which is where a lot of real-world spelling mistakes
 * live. The wrong answers are deliberately the *other* rules applied, so
 * telling them apart is the whole lesson, and the rule is spelled out after
 * every answer whether the child got it right or not.
 */
const WordMachine: React.FC<WordMachineProps> = ({ onComplete, words: providedWords, rounds = 6 }) => {
  const { speak } = useAudio()

  const gameRounds = useMemo(
    () => pickRounds(providedWords && providedWords.length > 0 ? providedWords : [], rounds),
    [providedWords, rounds]
  )

  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [picked, setPicked] = useState<string | null>(null)

  const current = gameRounds[index]

  useEffect(() => {
    if (current) speak(`One ${current.plural.singular}. What about two?`)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index])

  if (!current) {
    return (
      <div className="word-machine">
        <p className="wm-empty">
          The machine needs words it knows how to change — learn a few more and come back! ⚙️
        </p>
        <button className="wm-btn" onClick={() => onComplete(0)}>Back to Games</button>
      </div>
    )
  }

  const choose = (choice: string) => {
    if (picked) return
    setPicked(choice)

    const correct = choice === current.plural.plural
    // A plural is a spelling: right or wrong, it feeds the review schedule.
    ReviewSchedule.record(current.word.id, correct)

    let points = 0
    if (correct) {
      const nextStreak = streak + 1
      points = 25 + (nextStreak >= 3 ? 10 : 0)
      setScore((s) => s + points)
      setStreak(nextStreak)
      sfx.correct()
      speak(`${current.plural.plural}! ${current.plural.rule === 'special' ? 'You knew the tricky one!' : ''}`)
    } else {
      setStreak(0)
      sfx.wrong()
      speak(`Not quite. Two ${current.plural.plural}.`)
    }

    window.setTimeout(() => {
      if (index < gameRounds.length - 1) {
        setIndex((i) => i + 1)
        setPicked(null)
      } else {
        sfx.win()
        onComplete(score + points)
      }
    }, REVEAL_MS)
  }

  const revealed = picked !== null
  const right = picked === current.plural.plural

  return (
    <div className={`word-machine ${revealed ? (right ? 'flash-good' : 'flash-bad') : ''}`}>
      <div className="wm-header">
        <div className="wm-title">⚙️ Word Machine</div>
        <div className="wm-stats">
          <div className="wm-stat"><span>Word</span><strong>{index + 1}/{gameRounds.length}</strong></div>
          <div className="wm-stat"><span>Score</span><strong>{score}</strong></div>
          <div className="wm-stat"><span>Streak</span><strong>🔥 {streak}</strong></div>
        </div>
      </div>

      <div className={`wm-machine ${revealed ? 'running' : ''}`}>
        <div className="wm-dial" aria-hidden>
          <span className="wm-dial-label">MAKE IT MORE THAN ONE</span>
        </div>

        <button className="wm-hopper" onClick={() => speak(current.plural.singular)} aria-label={`Hear the word ${current.plural.singular}`}>
          <span className="wm-hopper-tag">one</span>
          <span className="wm-hopper-word">{current.plural.singular}</span>
          <span className="wm-hopper-speak" aria-hidden>🔊</span>
        </button>

        <div className="wm-gears" aria-hidden>
          <span className="wm-gear g1">⚙️</span>
          <span className="wm-gear g2">⚙️</span>
          <span className="wm-gear g3">⚙️</span>
        </div>

        <div className={`wm-output ${revealed ? 'filled' : ''}`} aria-live="polite">
          <span className="wm-output-tag">two</span>
          <span className="wm-output-word">{revealed ? current.plural.plural : '?'}</span>
        </div>
      </div>

      <p className="wm-prompt">Which one comes out of the machine?</p>

      <div className="wm-choices">
        {current.choices.map((c) => {
          const isRight = c === current.plural.plural
          let cls = 'wm-choice'
          if (revealed) {
            if (isRight) cls += ' right'
            else if (c === picked) cls += ' wrong'
            else cls += ' dim'
          }
          return (
            <button key={c} className={cls} onClick={() => choose(c)} disabled={revealed}>
              {c}
            </button>
          )
        })}
      </div>

      {revealed && (
        <div className={`wm-lesson ${right ? 'ok' : 'bad'}`}>
          <span className="wm-lesson-icon" aria-hidden>{right ? '✅' : '💡'}</span>
          <span>{current.plural.lesson}</span>
        </div>
      )}
    </div>
  )
}

export default WordMachine
