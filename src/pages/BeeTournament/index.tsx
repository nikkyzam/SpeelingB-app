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
import useCheer from '../../components/games/shared/useCheer'
import Burst from '../../components/games/shared/Burst'
import { maskClue } from '../../components/games/shared/clues'
import { sayPrompt, spellOut } from '../../services/words/praise'
import Button from '../../components/common/Button'
import './BeeTournament.css'
import SpellingInput from '../../components/common/SpellingInput'

const WINGS = 2
const BEST_KEY = 'bee_tournament_best'
/** How the lobby says how many rounds this child's Bee really has. */
const ROUND_COUNT: Record<number, string> = {
  1: 'One round',
  2: 'Two rounds',
  3: 'Three rounds',
  4: 'Four rounds',
  5: 'Five rounds',
}

type Phase = 'lobby' | 'announce' | 'spelling' | 'judging' | 'over'

/** This week's saved best: the furthest round reached, whether the crown was won, and Bees finished. */
const readBest = (): { round: number; champion: boolean; runs: number } => {
  try {
    const saved = JSON.parse(localStorage.getItem(BEST_KEY) || '{}')
    return saved.week === grandBeeWeek()
      ? { round: Number(saved.round) || 0, champion: saved.champion === true, runs: Number(saved.runs) || 0 }
      : { round: 0, champion: false, runs: 0 }
  } catch {
    return { round: 0, champion: false, runs: 0 }
  }
}

/** Stars a word spelled is worth in the week's first Bee. */
export const STARS_PER_WORD = 3
/**
 * A replay that week pays like a game — a star a word, at most this many. The
 * bracket is the same all week, so paying full price every time made the Bee
 * worth ~45 stars a run, as often as a child liked.
 */
export const REPLAY_MAX_STARS = 5

/** Stars for a finished Bee: full price the first time this week, game price after. */
export const beeStars = (spelled: number, runsBefore: number, firstCrown: boolean): number =>
  (runsBefore === 0 ? spelled * STARS_PER_WORD : Math.min(REPLAY_MAX_STARS, spelled)) + (firstCrown ? CHAMPION_BONUS : 0)

/** The champion's bonus. Paid once a week: the Bee is the same all week, so it could be replayed for it. */
export const CHAMPION_BONUS = 40

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
  // Rounds finished with a wing to spare. Cups are earned by these: going by
  // the round a child merely reached gave a Silver Cup to one who entered the
  // Final — a new child's only round — and spelled nothing.
  const [cleared, setCleared] = useState(0)
  const [input, setInput] = useState('')
  const [verdict, setVerdict] = useState<'right' | 'wrong' | null>(null)
  const [celebration, setCelebration] = useState<CelebrationData | null>(null)
  const cheer = useCheer()
  const [cheerLine, setCheerLine] = useState('')
  const [hits, setHits] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const timers = useRef<number[]>([])
  // The verdict state loses a race to a double tap on "Lock it in": both taps
  // read "no verdict yet", and one word cost two wings — or finished the Bee
  // twice, paying the stars twice. A ref settles at once.
  const settled = useRef(false)

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

  const best = readBest().round

  const recordBest = (reached: number, won: boolean) => {
    try {
      const saved = readBest()
      // Written every time now: the count of Bees this week decides replay pay.
      localStorage.setItem(
        BEST_KEY,
        JSON.stringify({
          week: grandBeeWeek(),
          round: Math.max(reached, saved.round),
          champion: saved.champion || won,
          runs: saved.runs + 1,
        })
      )
    } catch {
      /* a personal best that cannot be saved was still reached */
    }
  }

  /** The word, bee-style: the word, the word in a sentence, the word again. */
  const ask = (w: Word) => speak(`Your word is: ${sayPrompt(w.word, w.sentence)}`, { queue: true })

  /**
   * The rounds that actually have words in them.
   *
   * The bracket returns a short Bee rather than one padded with strangers, so
   * rounds can be empty — and for a child who has just signed up, the *early*
   * rounds are the empty ones: there is nothing they have spelled yet, and only
   * the stretch rounds can be filled from the bank. Starting at round 0
   * regardless left them looking at a blank stage with no way forward.
   */
  const playable = useMemo(
    () => bracket.map((round, i) => (round.length > 0 ? i : -1)).filter((i) => i >= 0),
    [bracket]
  )
  // The stretch rounds can always be filled from the bank, so a child with no
  // words of their own was handed a Bee made entirely of words nobody had
  // taught them. It needs at least one round of their own words.
  const enough = playable.some((i) => !ROUNDS[i].stretch)

  /** Only a word the child has met goes into their review schedule. */
  const known = useMemo(
    () => new Set([...learningFlow.getWordsLearnedTotal(), ...learningFlow.getWordsSpelledTotal()]),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [learningFlow, phase === 'lobby']
  )

  const announce = (index: number) => {
    setRoundIndex(index)
    setWordIndex(0)
    setVerdict(null)
    setInput('')
    setPhase('announce')
    const spec = ROUNDS[index]
    sfx.applause()
    // Queued, so the cheer for the last word of the round isn't cut off.
    speak(`${spec.name}! ${spec.blurb}`, { queue: true })
    later(() => {
      settled.current = false
      setPhase('spelling')
      later(() => inputRef.current?.focus(), 60)
      const first = bracket[index]?.[0]
      if (first) ask(first)
    }, 2200)
  }

  const start = () => {
    setWings(WINGS)
    setSpelled(0)
    setCleared(0)
    announce(playable[0])
  }

  const finish = (won: boolean, reached: number, spelledNow = spelled, clearedNow = cleared) => {
    setPhase('over')
    const before = readBest()
    const crownedBefore = before.champion
    recordBest(reached, won)

    // A cup for rounds cleared — bronze for two, silver for three, gold for
    // the lot. On a full bracket that is the same as reaching the Semi-final
    // and the Final; on a short one it can't be had without the spelling.
    const cup = won ? 'cup-gold' : clearedNow >= 3 ? 'cup-silver' : clearedNow >= 2 ? 'cup-bronze' : null
    if (cup) TrophyService.award(cup)

    const firstCrown = won && !crownedBefore
    const stars = beeStars(spelledNow, before.runs, firstCrown)
    addStars(stars)
    if (won) {
      sfx.fanfare()
      sfx.applause()
      window.dispatchEvent(new Event('show-confetti'))
    } else {
      sfx.win()
    }

    setCelebration({
      title: won
        ? '🏆 Champion of the Bee!'
        : spelledNow === 0
        ? '🎤 What a brave try!'
        : `You spelled ${spelledNow} ${spelledNow === 1 ? 'word' : 'words'}!`,
      message: won
        ? firstCrown
          ? 'You went all the way to the Championship word. The Golden Cup is yours — it is in your Trophy Room.'
          : 'Champion again! Your Golden Cup is already in your Trophy Room — a new Bee starts on Monday.'
        : cup
        ? `You reached the ${ROUNDS[reached - 1].name}. That is a cup for your Trophy Room — come back and go further!`
        : spelledNow === 0
        ? 'Standing on the stage is the bravest part. Practise your words and the Bee will be here for you!'
        : 'Every word you spelled counts. The trophy will wait for you — come back and try again!',
      stars,
    })
  }

  const submit = () => {
    if (!word || verdict || settled.current || !input.trim()) return
    settled.current = true
    const correct = input.trim().toLowerCase() === word.word.toLowerCase()
    setVerdict(correct ? 'right' : 'wrong')
    setPhase('judging')
    // A stretch word the child never met stays out of their review schedule —
    // missing it would otherwise lock tomorrow's games behind a word nobody taught.
    if (known.has(word.id)) ReviewSchedule.record(word.id, correct)

    const spelledNow = spelled + (correct ? 1 : 0)
    const wingsLeft = correct ? wings : wings - 1
    if (correct) {
      setSpelled((n) => n + 1)
      setCheerLine(cheer.hit())
      setHits((n) => n + 1)
    } else {
      setWings(wingsLeft)
      // The letters, not just the word again — and a soft landing for the wing.
      const after = wingsLeft === 1 ? ' You still have one wing. Keep going!' : ''
      setCheerLine(cheer.miss({ say: `The word was ${word.word}. ${spellOut(word.word)}.${after}` }))
    }

    later(() => {
      if (wingsLeft <= 0) {
        finish(false, roundIndex + 1, spelledNow)
        return
      }
      const nextWord = wordIndex + 1
      if (nextWord < roundWords.length) {
        settled.current = false
        setWordIndex(nextWord)
        setVerdict(null)
        setInput('')
        setPhase('spelling')
        later(() => inputRef.current?.focus(), 60)
        ask(roundWords[nextWord])
        return
      }
      // The round is finished with a wing to spare.
      const clearedNow = cleared + 1
      setCleared(clearedNow)
      const nextRound = playable[playable.indexOf(roundIndex) + 1]
      if (nextRound !== undefined) {
        announce(nextRound)
      } else {
        // Champion means the Championship word, not merely "no rounds left".
        // A child with eight words used to be crowned — Golden Cup, winner's
        // bonus and all — for finishing a Bee that stopped at the Qualifier.
        finish(roundIndex === ROUNDS.length - 1, roundIndex + 1, spelledNow, clearedNow)
      }
    }, correct ? 1400 : 2600)
  }

  // --- Not enough words to hold a Bee ---------------------------------------
  if (!enough) {
    return (
      <div className="bee">
        <div className="bee-header">
          <Button variant="secondary" size="small" onClick={() => navigate('/spelling')}>← Spelling</Button>
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
        <Button variant="secondary" size="small" onClick={() => navigate('/spelling')}>← Spelling</Button>
        <h1>🏆 The Spelling Bee</h1>
        <span className="bee-wings" aria-label={`${wings} wings left`}>
          {'🪽'.repeat(Math.max(wings, 0))}
          <span className="bee-wing-lost" aria-hidden>{'🪶'.repeat(Math.max(WINGS - wings, 0))}</span>
        </span>
      </div>

      {phase === 'lobby' && (
        <div className="bee-lobby">
          <div className="bee-stage-lights" aria-hidden><span /><span /><span /></div>
          <div className="bee-mascot" aria-hidden>{world.mascot}</div>
          <h2>This week&apos;s Grand Bee</h2>
          <p className="bee-blurb">
            {ROUND_COUNT[playable.length] ?? `${playable.length} rounds`}. The words get harder each time.
            You have <strong>two wings</strong> — miss a word and you lose one, but you keep going.
          </p>
          <ol className="bee-rounds">
            {/* Only the rounds this child will actually be asked — listing a
                round with no words in it promises a stage that never opens. */}
            {playable.map((i) => (
              <li key={ROUNDS[i].name} className={best >= i + 1 ? 'reached' : ''}>
                <strong>{ROUNDS[i].name}</strong>{' '}
                <span>{bracket[i].length} {bracket[i].length === 1 ? 'word' : 'words'}</span>
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
          {/* A meaning can hold the word itself, which turns the spelling into copying. */}
          {word.meaning && <p className="bee-meaning">{maskClue(word.meaning, word.word)}</p>}

          <SpellingInput
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
              {verdict === 'right' && <Burst trigger={hits} />}
              {verdict === 'right' ? `🎉 ${cheerLine}` : `${cheerLine} The word was “${word.word}”`}
            </div>
          )}

          <div className="bee-tally">Spelled right: <strong>{spelled}</strong></div>
        </div>
      )}

      <Celebration
        data={celebration}
        variant="cannon"
        autoClose={false}
        onClose={() => { setCelebration(null); navigate('/trophies') }}
        closeLabel="See my trophies"
      />
    </div>
  )
}

export default BeeTournament
