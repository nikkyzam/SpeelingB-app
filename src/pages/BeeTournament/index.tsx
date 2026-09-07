import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAudio } from '../../contexts/AudioContext'
import { useTheme } from '../../contexts/ThemeContext'
import { useProgress } from '../../contexts/ProgressContext'
import { useRewardStore } from '../../stores/rewards/useRewardStore'
import { wordBank, Word } from '../../services/wordBank'
import ReviewSchedule from '../../services/progress/ReviewSchedule'
import TrophyService from '../../services/trophies/TrophyService'
import { buildBracket, ROUNDS, grandBeeWeek, RoundSpec } from './bracket'
import Celebration, { CelebrationData } from '../../components/common/Celebration'
import sfx from '../../components/games/shared/sfx'
import Button from '../../components/common/Button'
import './BeeTournament.css'
import { NO_SPELLING_HELP } from '../../components/common/spellingInput'

const WINGS = 2
const BEST_KEY = 'bee_tournament_best'

type Phase = 'lobby' | 'announce' | 'spelling' | 'judging' | 'over'

/**
 * The Spelling Bee itself — five rounds, rising stakes, a trophy at the end.
 *
 * Everything else in the app is practice; this is the event it is practice
 * for. The tension is real (two wings, and the words get harder) but the
 * landing is always soft: running out of wings ends on the number of words
 * spelled, never on the word missed. A child should want to come back, and
 * "you spelled fourteen words" is a better reason than "you failed".
 */
const BeeTournament: React.FC = () => {
  const navigate = useNavigate()
  const { speak } = useAudio()
  const { world } = useTheme()
  const { learningFlow } = useProgress()
  const { addStars } = useRewardStore()

  const [phase, setPhase] = useState<Phase>('lobby')
  const [roundIndex, setRoundIndex] = useState(0)
  const [wordIndex, setWordIndex] = useState(0)
  const [wings, setWings] = useState(WINGS)
  const [spelled, setSpelled] = useState(0)
  const [input, setInput] = useState('')
  const [verdict, setVerdict] = useState<'right' | 'wrong' | null>(null)
  const [celebration, setCelebration] = useState<CelebrationData | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const timers = useRef<number[]>([])

  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms))
  }
  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), [])

  const bracket = useMemo(
    () => buildBracket(learningFlow, wordBank),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [learningFlow, phase === 'lobby']
  )

  const round: RoundSpec | undefined = ROUNDS[roundIndex]
  const roundWords: Word[] = bracket[roundIndex] ?? []
  const word = roundWords[wordIndex]

  const best = (() => {
    try {
      const saved = JSON.parse(localStorage.getItem(BEST_KEY) || '{}')
      return saved.week === grandBeeWeek() ? Number(saved.round) || 0 : 0
    } catch {
      return 0
    }
  })()

  const recordBest = (reached: number) => {
    try {
      const saved = JSON.parse(localStorage.getItem(BEST_KEY) || '{}')
      const same = saved.week === grandBeeWeek()
      if (!same || reached > (Number(saved.round) || 0)) {
        localStorage.setItem(BEST_KEY, JSON.stringify({ week: grandBeeWeek(), round: reached }))
      }
    } catch {
      /* a personal best that cannot be saved was still reached */
    }
  }

  const enough = bracket.some((r) => r.length > 0)

  const announce = (index: number) => {
    setRoundIndex(index)
    setWordIndex(0)
    setVerdict(null)
    setInput('')
    setPhase('announce')
    const spec = ROUNDS[index]
    sfx.applause()
    speak(`${spec.name}! ${spec.blurb}`)
    later(() => {
      setPhase('spelling')
      later(() => inputRef.current?.focus(), 60)
      const first = bracket[index]?.[0]
      if (first) speak(`Your word is. ${first.word}.`)
    }, 2200)
  }

  const start = () => {
    setWings(WINGS)
    setSpelled(0)
    announce(0)
  }

  const finish = (won: boolean, reached: number) => {
    setPhase('over')
    recordBest(reached)

    // A cup for how far they got — bronze at the semi, gold for the lot.
    const cup = won ? 'cup-gold' : reached >= 4 ? 'cup-silver' : reached >= 3 ? 'cup-bronze' : null
    if (cup) TrophyService.award(cup)

    const stars = spelled * 3 + (won ? 40 : 0)
    addStars(stars)
    if (won) {
      sfx.fanfare()
      sfx.applause()
      window.dispatchEvent(new Event('show-confetti'))
    } else {
      sfx.win()
    }

    setCelebration({
      title: won ? '🏆 Champion of the Bee!' : `You spelled ${spelled} words!`,
      message: won
        ? 'You went all the way to the Championship word. The Golden Cup is yours — it is in your Trophy Room.'
        : cup
        ? `You reached the ${ROUNDS[reached - 1].name}. That is a cup for your Trophy Room — come back and go further!`
        : 'Every word you spelled counts. The trophy will wait for you — come back and try again!',
      stars,
    })
  }

  const submit = () => {
    if (!word || verdict) return
    const correct = input.trim().toLowerCase() === word.word.toLowerCase()
    setVerdict(correct ? 'right' : 'wrong')
    setPhase('judging')
    ReviewSchedule.record(word.id, correct)

    if (correct) {
      setSpelled((n) => n + 1)
      sfx.correct()
      speak('Correct!')
    } else {
      sfx.wrong()
      speak(`The word was. ${word.word}.`)
    }

    const wingsLeft = correct ? wings : wings - 1
    if (!correct) setWings(wingsLeft)

    later(() => {
      if (wingsLeft <= 0) {
        finish(false, roundIndex + 1)
        return
      }
      const nextWord = wordIndex + 1
      if (nextWord < roundWords.length) {
        setWordIndex(nextWord)
        setVerdict(null)
        setInput('')
        setPhase('spelling')
        later(() => inputRef.current?.focus(), 60)
        speak(`Your word is. ${roundWords[nextWord].word}.`)
        return
      }
      const nextRound = roundIndex + 1
      if (nextRound < ROUNDS.length && (bracket[nextRound]?.length ?? 0) > 0) {
        announce(nextRound)
      } else {
        finish(true, ROUNDS.length)
      }
    }, correct ? 1400 : 2600)
  }

  // --- Not enough words to hold a Bee ---------------------------------------
  if (!enough) {
    return (
      <div className="bee">
        <div className="bee-header">
          <Button variant="secondary" size="small" onClick={() => navigate('/')}>← Home</Button>
          <h1>🏆 The Spelling Bee</h1>
        </div>
        <p className="bee-empty">
          The Bee is spelled from words you already know — go and meet a few more,
          then come back and take the stage! 🎤
        </p>
        <Button variant="primary" icon="📖" onClick={() => navigate('/learn')}>Learn some words</Button>
      </div>
    )
  }

  return (
    <div className={`bee phase-${phase}`} data-world={world.id}>
      <div className="bee-header">
        <Button variant="secondary" size="small" onClick={() => navigate('/')}>← Home</Button>
        <h1>🏆 The Spelling Bee</h1>
        <span className="bee-wings" aria-label={`${wings} wings left`}>
          {'🪽'.repeat(Math.max(wings, 0)) || '—'}
        </span>
      </div>

      {phase === 'lobby' && (
        <div className="bee-lobby">
          <div className="bee-stage-lights" aria-hidden><span /><span /><span /></div>
          <div className="bee-mascot" aria-hidden>{world.mascot}</div>
          <h2>This week&apos;s Grand Bee</h2>
          <p className="bee-blurb">
            Five rounds. The words get harder each time. You have <strong>two wings</strong> —
            miss a word and you lose one, but you keep going.
          </p>
          <ol className="bee-rounds">
            {ROUNDS.map((r, i) => (
              <li key={r.name} className={best >= i + 1 ? 'reached' : ''}>
                <strong>{r.name}</strong> <span>{bracket[i]?.length ?? 0} {(bracket[i]?.length ?? 0) === 1 ? 'word' : 'words'}</span>
              </li>
            ))}
          </ol>
          {best > 0 && (
            <p className="bee-best">
              Best this week: <strong>{ROUNDS[best - 1].name}</strong>. A new Bee starts every Monday.
            </p>
          )}
          <Button variant="primary" size="large" icon="🎤" onClick={start}>Enter the Bee!</Button>
        </div>
      )}

      {phase === 'announce' && round && (
        <div className="bee-announce">
          <div className="bee-spotlight" aria-hidden />
          <h2>{round.name}</h2>
          <p>{round.blurb}</p>
        </div>
      )}

      {(phase === 'spelling' || phase === 'judging') && word && round && (
        <div className="bee-stage">
          <div className="bee-round-tag">{round.name} · word {wordIndex + 1} of {roundWords.length}</div>
          <div className="bee-spotlight" aria-hidden />
          <div className="bee-mascot small" aria-hidden>{world.mascot}</div>

          <Button variant="secondary" icon="🔊" onClick={() => speak(word.word)}>Hear it again</Button>
          {word.meaning && <p className="bee-meaning">{word.meaning}</p>}

          <input
              {...NO_SPELLING_HELP}
            ref={inputRef}
            className={`bee-input ${verdict ?? ''}`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            placeholder="Spell the word…"
            disabled={phase === 'judging'}
            aria-label="Spell the word"
          />

          {verdict === null ? (
            <Button variant="primary" size="large" disabled={!input.trim()} onClick={submit}>
              Lock it in! 🔒
            </Button>
          ) : (
            <div className={`bee-verdict ${verdict}`}>
              {verdict === 'right' ? '✅ Correct!' : `The word was “${word.word}”`}
            </div>
          )}

          <div className="bee-tally">Spelled right: <strong>{spelled}</strong></div>
        </div>
      )}

      <Celebration
        data={celebration}
        variant="cannon"
        onClose={() => { setCelebration(null); navigate('/trophies') }}
        closeLabel="See my trophies"
      />
    </div>
  )
}

export default BeeTournament
