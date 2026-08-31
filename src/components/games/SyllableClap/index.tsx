import React, { useEffect, useMemo, useRef, useState } from 'react'
import { wordBank, Word } from '../../../services/wordBank'
import { useAudio } from '../../../contexts/AudioContext'
import { shuffle, isPlayable } from '../shared/wordTricks'
import { countBeats, chunkWord } from '../../../services/words/wordShape'
import sfx from '../shared/sfx'
import './SyllableClap.css'

interface SyllableClapProps {
  onComplete: (score: number) => void
  words?: Word[]
  rounds?: number
}

type Phase = 'clapping' | 'right' | 'wrong'

/**
 * Clap out the beats in a word.
 *
 * Hearing that "caterpillar" is four beats is what lets a child attack a long
 * word instead of freezing at it — it is the skill underneath sounding out,
 * and nothing else in the app teaches it. The reveal shows the beats lined up
 * with the chunks, so the ear and the eye learn the same thing at once.
 */
const SyllableClap: React.FC<SyllableClapProps> = ({ onComplete, words: providedWords, rounds = 6 }) => {
  const { speak } = useAudio()

  const words = useMemo<Word[]>(() => {
    const pool = providedWords && providedWords.length > 0 ? providedWords : wordBank.getRandomWords(40)
    // Longer words make better clapping — one-beat words are no fun to clap.
    const usable = shuffle(pool).filter((w) => isPlayable(w, 4))
    const multi = usable.filter((w) => countBeats(w.word) >= 2)
    const chosen = multi.length >= rounds ? multi : [...multi, ...usable]
    if (chosen.length >= rounds) return chosen.slice(0, rounds)
    const extra = shuffle(wordBank.getRandomWords(80)).filter((w) => isPlayable(w, 4))
    return [...chosen, ...extra].slice(0, rounds)
  }, [providedWords, rounds])

  const [index, setIndex] = useState(0)
  const [claps, setClaps] = useState(0)
  const [phase, setPhase] = useState<Phase>('clapping')
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const sayTimers = useRef<number[]>([])

  const current = words[index]
  const answer = current ? countBeats(current.word) : 0
  const chunks = useMemo(() => (current ? chunkWord(current.word) : []), [current])

  useEffect(() => () => sayTimers.current.forEach((t) => window.clearTimeout(t)), [])

  useEffect(() => {
    if (current) speak(current.word)
    setClaps(0)
    setPhase('clapping')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index])

  if (!current) {
    return (
      <div className="syllable-clap">
        <p className="sc-empty">No words to clap yet — learn a few first! 👏</p>
        <button className="sc-btn" onClick={() => onComplete(0)}>Back to Games</button>
      </div>
    )
  }

  /** Say the word beat by beat, so the child can hear what they're counting. */
  const clapItOut = () => {
    sayTimers.current.forEach((t) => window.clearTimeout(t))
    sayTimers.current = []
    chunks.forEach((chunk, i) => {
      sayTimers.current.push(window.setTimeout(() => { sfx.tap(); speak(chunk) }, i * 750))
    })
  }

  const clap = () => {
    if (phase !== 'clapping') return
    sfx.pop()
    setClaps((c) => Math.min(c + 1, 8))
  }

  const check = () => {
    if (phase !== 'clapping' || claps === 0) return
    const correct = claps === answer

    if (correct) {
      const nextStreak = streak + 1
      const points = 25 + (nextStreak >= 3 ? 15 : 0)
      setScore((s) => s + points)
      setStreak(nextStreak)
      setPhase('right')
      sfx.correct()
      speak(`Yes! ${answer} beats.`)
    } else {
      setStreak(0)
      setPhase('wrong')
      sfx.wrong()
      speak(`It has ${answer} beats`)
      clapItOut()
    }

    setTimeout(() => {
      if (index < words.length - 1) setIndex((i) => i + 1)
      else {
        sfx.win()
        onComplete(score + (correct ? 25 + (streak + 1 >= 3 ? 15 : 0) : 0))
      }
    }, correct ? 2200 : 3200)
  }

  return (
    <div className="syllable-clap">
      <div className="sc-header">
        <div className="sc-title">👏 Syllable Clap</div>
        <div className="sc-stats">
          <div className="sc-stat"><span>Word</span><strong>{index + 1}/{words.length}</strong></div>
          <div className="sc-stat"><span>Score</span><strong>{score}</strong></div>
          <div className="sc-stat"><span>Streak</span><strong>🔥 {streak}</strong></div>
        </div>
      </div>

      <p className="sc-brief">How many beats does this word have? Clap them out!</p>

      <div className="sc-word">
        {phase === 'clapping' ? (
          <span className="sc-word-text">{current.word}</span>
        ) : (
          <span className="sc-chunks">
            {chunks.map((chunk, i) => (
              <React.Fragment key={i}>
                {i > 0 && <span className="sc-chunk-dash">-</span>}
                <span className="sc-chunk">{chunk}</span>
              </React.Fragment>
            ))}
          </span>
        )}
        <button className="sc-speak" onClick={() => speak(current.word)} aria-label="Hear the word">🔊</button>
        <button className="sc-speak" onClick={clapItOut} aria-label="Hear it beat by beat">🐢</button>
      </div>

      <div className="sc-dots" aria-label={`${claps} claps`}>
        {Array.from({ length: Math.max(claps, 1) }).map((_, i) => (
          <span key={i} className={`sc-dot ${i < claps ? 'on' : ''}`} aria-hidden>👏</span>
        ))}
      </div>

      <button
        className={`sc-pad ${phase !== 'clapping' ? 'locked' : ''}`}
        onClick={clap}
        disabled={phase !== 'clapping'}
        aria-label="Clap once"
      >
        <span className="sc-pad-icon" aria-hidden>👏</span>
        <span className="sc-pad-label">{claps === 0 ? 'Tap to clap!' : `${claps} clap${claps === 1 ? '' : 's'}`}</span>
      </button>

      <div className="sc-actions">
        <button className="sc-btn ghost" onClick={() => setClaps(0)} disabled={phase !== 'clapping' || claps === 0}>
          ↺ Start again
        </button>
        <button className="sc-btn" onClick={check} disabled={phase !== 'clapping' || claps === 0}>
          That&apos;s my answer!
        </button>
      </div>

      {phase === 'right' && (
        <div className="sc-flash ok">🎉 Spot on — <strong>{answer}</strong> beat{answer === 1 ? '' : 's'}!</div>
      )}
      {phase === 'wrong' && (
        <div className="sc-flash bad">
          It has <strong>{answer}</strong> beat{answer === 1 ? '' : 's'} — listen: {chunks.join(' · ')}
        </div>
      )}
    </div>
  )
}

export default SyllableClap
