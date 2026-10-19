import React, { useEffect, useMemo, useRef, useState } from 'react'
import type { Word } from '../../../services/wordBank'
import { useAudio } from '../../../contexts/AudioContext'
import { shuffle, isPlayable } from '../shared/wordTricks'
import { countBeats, chunkWord } from '../../../services/words/wordShape'
import useCheer from '../shared/useCheer'
import useLater from '../shared/useLater'
import Burst from '../shared/Burst'
import GameEmpty from '../shared/GameEmpty'
import sfx from '../shared/sfx'
import './SyllableClap.css'

interface SyllableClapProps {
  onComplete: (score: number) => void
  words?: Word[]
  rounds?: number
}

type Phase = 'clapping' | 'right' | 'wrong'

/** The most claps the pad counts — no word a child meets has more beats. */
const MAX_CLAPS = 8

/**
 * A word we can be sure how to clap. Beats are counted from spelling, which
 * can't be right for every word, so a word only plays when the beat count and
 * the chunks shown on the reveal agree. Marking a right clap wrong is the one
 * thing this game must never do.
 */
export const isClappable = (w: Word): boolean => {
  if (!isPlayable(w, 3)) return false
  const word = w.word.toLowerCase()
  const chunks = chunkWord(word)
  return (
    countBeats(word) === chunks.length &&
    !UNSURE.has(word) &&
    !SPLIT_PREFIX.test(word) &&
    !silentMiddleE(chunks)
  )
}

/**
 * Words the two counts get wrong *together*, so agreeing proves nothing.
 * A silent "e" in the middle of a compound — fore·cast, ice·berg, gate·way —
 * is split off as a beat by both ("fo-re-cast"): a middle chunk of
 * consonant + e straight after a long vowel. Real syllables like te·le·phone
 * and e·le·phant follow an "e", so they stay.
 */
const silentMiddleE = (chunks: string[]): boolean =>
  chunks.slice(1, -1).some((c, i) => /^[^aeiouy]{1,2}e$/.test(c) && /[aiou]$/.test(chunks[i]))
/** A prefix whose vowel is said apart from the next one: co·operate, re·iterate. */
const SPLIT_PREFIX = /^(co|re|pre|de)[aeiou]/
/** The rest the checks above miss, found by running the whole word list. */
const UNSURE = new Set(['stagestruck', 'grotesqueness', 'nucleated'])

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
  const cheer = useCheer()
  const later = useLater()

  const words = useMemo<Word[]>(() => {
    const sure = shuffle(providedWords ?? []).filter(isClappable)
    // Longer words make better clapping — one-beat words only fill a gap.
    // Only their own words: a short game beats a game full of strangers.
    const multi = sure.filter((w) => countBeats(w.word) >= 2)
    const single = sure.filter((w) => countBeats(w.word) < 2)
    return shuffle([...multi, ...single].slice(0, rounds))
  }, [providedWords, rounds])

  const [index, setIndex] = useState(0)
  const [claps, setClaps] = useState(0)
  const [phase, setPhase] = useState<Phase>('clapping')
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [line, setLine] = useState('')
  const [hits, setHits] = useState(0)
  const [shake, setShake] = useState(false)
  /** Which chunk is lit while the word is clapped out on the reveal. */
  const [beat, setBeat] = useState(-1)

  // Each answer settles once. A state guard loses to a double tap on "That's
  // my answer!", which scored twice and started two timers.
  const locked = useRef(false)
  // The beat-by-beat replay can be restarted, so its timers are its own.
  const beatTimers = useRef<number[]>([])
  const stopBeats = () => {
    beatTimers.current.forEach((t) => window.clearTimeout(t))
    beatTimers.current = []
  }
  useEffect(() => stopBeats, [])

  const current = words[index]
  const answer = current ? countBeats(current.word) : 0
  const chunks = useMemo(() => (current ? chunkWord(current.word) : []), [current])

  useEffect(() => {
    if (!current) return
    locked.current = false
    stopBeats()
    speak(current.word)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, words])

  if (!current) {
    return (
      <div className="syllable-clap">
        <GameEmpty icon="👏">No words to clap yet — learn a few more, then come back and clap them out!</GameEmpty>
      </div>
    )
  }

  /**
   * Say the word beat by beat, lighting each chunk with a clap. Queued, so it
   * follows whatever is being said instead of cutting it off.
   */
  const clapItOut = (startAfter = 0) => {
    stopBeats()
    chunks.forEach((chunk) => speak(chunk, { queue: true }))
    chunks.forEach((_, i) => {
      beatTimers.current.push(window.setTimeout(() => { setBeat(i); sfx.tap() }, startAfter + i * 650))
    })
    beatTimers.current.push(window.setTimeout(() => setBeat(-1), startAfter + chunks.length * 650))
  }

  /** Slow speech stretches the beats out without handing over the chunks. */
  const sayItSlowly = () => speak(current.word, { rate: 0.45 })

  const clap = () => {
    if (locked.current || phase !== 'clapping') return
    sfx.pop()
    setClaps((c) => Math.min(c + 1, MAX_CLAPS))
  }

  const check = () => {
    if (locked.current || phase !== 'clapping' || claps === 0) return
    locked.current = true
    const correct = claps === answer
    const beatsSaid = `${answer} beat${answer === 1 ? '' : 's'}`

    let gained = 0
    if (correct) {
      const run = streak + 1
      gained = 25 + (run >= 3 ? 15 : 0)
      setScore((s) => s + gained)
      setStreak(run)
      setHits((h) => h + 1)
      setPhase('right')
      setLine(cheer.hit({ say: `${beatsSaid}!` }))
    } else {
      setStreak(0)
      setPhase('wrong')
      setShake(true)
      later(() => setShake(false), 450)
      setLine(cheer.miss({ say: `${current.word} has ${beatsSaid}. Listen.` }))
      clapItOut(2200)
    }

    later(() => {
      if (index < words.length - 1) {
        // Reset in the same update as the move, so the next word opens clean.
        setClaps(0)
        setPhase('clapping')
        setBeat(-1)
        setIndex((i) => i + 1)
      } else {
        sfx.win()
        onComplete(score + gained)
      }
    }, correct ? 2200 : 2200 + chunks.length * 650 + 1400)
  }

  return (
    <div className="syllable-clap">
      <div className="scl-header">
        <div className="scl-title">👏 Syllable Clap</div>
        <div className="scl-stats">
          <div className="scl-stat"><span>Word</span><strong>{index + 1}/{words.length}</strong></div>
          <div className="scl-stat"><span>Score</span><strong>{score}</strong></div>
          <div className="scl-stat"><span>Streak</span><strong>🔥 {streak}</strong></div>
        </div>
      </div>

      <p className="scl-brief">How many beats? Clap once for each one!</p>

      <div className={`scl-word ${shake ? 'shake' : ''}`}>
        {phase === 'clapping' ? (
          <span className="scl-word-text">{current.word}</span>
        ) : (
          <span className="scl-chunks" aria-label={chunks.join(' - ')}>
            {chunks.map((chunk, i) => (
              <React.Fragment key={i}>
                {i > 0 && <span className="scl-chunk-dash" aria-hidden>-</span>}
                <span className={`scl-chunk ${beat === i ? 'beat' : ''}`}>{chunk}</span>
              </React.Fragment>
            ))}
          </span>
        )}
        <button className="scl-speak" onClick={() => speak(current.word)} aria-label="Hear the word">🔊</button>
        {phase === 'clapping' ? (
          <button className="scl-speak" onClick={sayItSlowly} aria-label="Say it slowly">🐢</button>
        ) : (
          <button className="scl-speak" onClick={() => clapItOut()} aria-label="Hear it beat by beat">👏</button>
        )}
      </div>

      <div className="scl-dots" aria-label={`${claps} claps`}>
        {Array.from({ length: Math.max(claps, 1) }).map((_, i) => (
          <span key={i} className={`scl-dot ${i < claps ? 'on' : ''}`} aria-hidden>👏</span>
        ))}
      </div>

      <button
        className={`scl-pad ${phase !== 'clapping' ? 'locked' : ''}`}
        onClick={clap}
        disabled={phase !== 'clapping'}
        aria-label="Clap once"
      >
        <span className="scl-pad-icon" aria-hidden>👏</span>
        <span className="scl-pad-label">{claps === 0 ? 'Tap to clap!' : `${claps} clap${claps === 1 ? '' : 's'}`}</span>
      </button>

      <div className="scl-actions">
        <button className="scl-btn ghost" onClick={() => setClaps(0)} disabled={phase !== 'clapping' || claps === 0}>
          ↺ Start again
        </button>
        <button className="scl-btn" onClick={check} disabled={phase !== 'clapping' || claps === 0}>
          That&apos;s my answer!
        </button>
      </div>

      {phase === 'right' && (
        <div className="scl-flash ok" role="status">
          <Burst trigger={hits} emoji={['👏', '⭐', '✨', '🎉']} />
          🎉 {line} <strong>{answer}</strong> beat{answer === 1 ? '' : 's'}!
        </div>
      )}
      {phase === 'wrong' && (
        <div className="scl-flash bad" role="status">
          {line} It has <strong>{answer}</strong> beat{answer === 1 ? '' : 's'} — listen: {chunks.join(' · ')}
        </div>
      )}
    </div>
  )
}

export default SyllableClap
