import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAudio } from '../../contexts/AudioContext'
import { useProgress } from '../../contexts/ProgressContext'
import { useRewardStore } from '../../stores/rewards/useRewardStore'
import { wordBank, Word } from '../../services/wordBank'
import ChallengeService, { Handicap, splitForPlayers } from '../../services/challenge/ChallengeService'
import TugOfWar from './modes/TugOfWar'
import BuzzerRace from './modes/BuzzerRace'
import StealDuel from './modes/StealDuel'
import CoopRelay from './modes/CoopRelay'
import { PLAYER_ICONS } from './modes/SpellTurn'
import Celebration, { CelebrationData } from '../../components/common/Celebration'
import Button from '../../components/common/Button'
import sfx from '../../components/games/shared/sfx'
import './SiblingChallenge.css'

export interface MatchProps {
  names: [string, string]
  /** one list per player, already fitted to their level */
  words: [Word[], Word[]]
  onFinish: (scores: [number, number]) => void
  /** Who takes the first turn. It swaps every match, so nobody always goes first. */
  first?: 0 | 1
}

const MODES = [
  { id: 'tug', name: 'Word Tug-of-War', icon: '🪢', blurb: 'Spell to pull the rope your way!' },
  { id: 'buzzer', name: 'Buzzer Race', icon: '🔔', blurb: 'Buzz first — miss, and the other can steal it.' },
  { id: 'steal', name: 'Steal-the-Point', icon: '🥷', blurb: 'Take turns. Miss, and the other can steal the point!' },
  { id: 'relay', name: 'Team Relay', icon: '🤝', blurb: 'Not a fight — build one streak together.' },
] as const

type ModeId = (typeof MODES)[number]['id']

const HANDICAPS: { value: Handicap; label: string; hint: string }[] = [
  { value: 'easier', label: 'Shorter words', hint: 'for the younger speller' },
  { value: 'same', label: 'Medium words', hint: 'about even' },
  { value: 'harder', label: 'Longer words', hint: 'for the stronger speller' },
]

const PER_PLAYER = 6

/**
 * The match bonus needs some real spelling. Three quick misses end a Team
 * Relay, and that used to pay 10 stars — again and again, as fast as a child
 * could type "x" three times.
 */
const MIN_SPELLED_FOR_BONUS = 3

export const matchStars = (scores: [number, number], hasWinner: boolean): number => {
  const total = scores[0] + scores[1]
  if (total < MIN_SPELLED_FOR_BONUS) return Math.max(1, total)
  return Math.max(5, Math.round(total / 2)) + (hasWinner ? 10 : 5)
}

const words_ = (n: number) => `${n} ${n === 1 ? 'word' : 'words'}`

interface LastMatch {
  names: [string, string]
  scores: [number, number]
  winner: string | null
  coop: boolean
}

/**
 * Two children, one device, something real on the line.
 *
 * The thing that makes a sibling contest work is that the younger one can
 * actually win it: each player picks how hard their own words should be, and
 * the pool is split by word length rather than by pulling in words nobody has
 * taught them. A nine-year-old spelling "chrysanthemum" and a six-year-old
 * spelling "cat" is a fair race; both spelling the same list is not.
 */
const SiblingChallenge: React.FC = () => {
  const navigate = useNavigate()
  const { speak } = useAudio()
  const { learningFlow } = useProgress()
  const { addStars } = useRewardStore()

  const [mode, setMode] = useState<ModeId | null>(null)
  const [playing, setPlaying] = useState(false)
  const [names, setNames] = useState<[string, string]>(['', ''])
  const [handicaps, setHandicaps] = useState<[Handicap, Handicap]>(['same', 'same'])
  const [celebration, setCelebration] = useState<CelebrationData | null>(null)
  const [first, setFirst] = useState<0 | 1>(0)
  const [last, setLast] = useState<LastMatch | null>(null)

  const prize = ChallengeService.getPrize()

  const pool = useMemo(
    () =>
      wordBank
        .getLearnedWords(learningFlow.getWordsLearnedTotal())
        .filter((w) => /^[a-z]+$/i.test(w.word) && w.word.length >= 3),
    [learningFlow]
  )

  const words = useMemo(
    () => splitForPlayers(pool, handicaps, PER_PLAYER),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pool, handicaps, playing]
  )

  const clean = (): [string, string] => {
    const a = names[0].trim() || 'Player 1'
    let b = names[1].trim() || 'Player 2'
    // Two children both typing "Sam" made every turn, score and "Sam wins!"
    // ambiguous.
    if (a.toLowerCase() === b.toLowerCase()) b = `${b} 2`
    return [a, b]
  }

  const finish = (scores: [number, number]) => {
    const [a, b] = clean()
    const coop = mode === 'relay'
    const winner = coop || scores[0] === scores[1] ? null : scores[0] > scores[1] ? a : b
    const loser = winner === a ? b : a
    const loserScore = winner === a ? scores[1] : scores[0]

    // Nobody loses anything. Both earn for what they spelled; the winner earns
    // a bit more. A child who is beaten still leaves with more than they came
    // with, which is what makes them willing to play again.
    const earned = matchStars(scores, !!winner)
    addStars(earned)

    const result = ChallengeService.record({
      mode: MODES.find((m) => m.id === mode)?.name ?? 'Challenge',
      players: [a, b],
      scores,
      winner,
    })

    sfx.fanfare()
    window.dispatchEvent(new Event('show-confetti'))
    // The one who didn't win hears their own number, not just the winner's name.
    const soft = loserScore > 0 ? `${loser} spelled ${words_(loserScore)} too — rematch?` : `Great try, ${loser} — rematch?`
    const together = scores[0] + scores[1]
    setCelebration({
      title: coop
        ? together > 0 ? `🤝 ${words_(together)} together!` : '🤝 Great try, team!'
        : winner
        ? `🏆 ${winner} wins!`
        : "🤝 It's a tie!",
      message: coop
        ? 'You built that streak as a team — nobody had to lose for you to win.'
        : result.prize
        ? `${winner} takes ${result.prize}! Go and tell a grown-up. ${soft}`
        : winner
        ? `${winner} spelled ${words_(Math.max(...scores))}. ${soft}`
        : `You both spelled ${words_(scores[0])}. Rematch?`,
      stars: earned,
    })
    speak(
      coop
        ? together > 0 ? `Teamwork! ${words_(together)} together!` : 'Great try, team! Have another go!'
        : winner
        ? `${winner} wins! Great try, ${loser}!`
        : "It's a tie! Great spelling, both of you!",
      { queue: true }
    )
    setLast({ names: [a, b], scores, winner, coop })
    // Whoever went second goes first in the rematch.
    setFirst((f) => (f === 0 ? 1 : 0))
    setPlaying(false)
  }

  const enough = pool.length >= 4

  // --- Not enough words for a match -----------------------------------------
  if (!enough) {
    return (
      <div className="chal">
        <div className="chal-header">
          <Button variant="secondary" size="small" onClick={() => navigate('/spelling')}>← Spelling</Button>
          <h1>⚔️ Sibling Challenge</h1>
        </div>
        <p className="chal-empty">
          A challenge is spelled from words you already know — learn a few more,
          then bring someone to beat! 🏁
        </p>
        <Button variant="primary" icon="📖" onClick={() => navigate('/learn')}>Learn some words</Button>
      </div>
    )
  }

  // --- A match in progress ---------------------------------------------------
  if (playing && mode) {
    const shared = { names: clean(), words, onFinish: finish, first }
    return (
      <div className="chal playing">
        {mode === 'tug' && <TugOfWar {...shared} />}
        {mode === 'buzzer' && <BuzzerRace {...shared} />}
        {mode === 'steal' && <StealDuel {...shared} />}
        {mode === 'relay' && <CoopRelay {...shared} />}
        <Button variant="secondary" size="small" onClick={() => setPlaying(false)}>Stop the match</Button>
      </div>
    )
  }

  const start = () => {
    const [a, b] = clean()
    setPlaying(true)
    speak(`${a} versus ${b}! ${first === 0 ? a : b} goes first. Good luck!`)
    sfx.applause()
  }

  return (
    <div className="chal">
      <div className="chal-header">
        <Button variant="secondary" size="small" onClick={() => navigate('/spelling')}>← Spelling</Button>
        <h1>⚔️ Sibling Challenge</h1>
      </div>

      {last && (
        <div className="chal-last" role="status">
          <strong>
            {last.coop ? '🤝 Last match: ' : last.winner ? `🏆 ${last.winner} won! ` : "🤝 It's a tie! "}
          </strong>
          {[0, 1].map((i) => (
            <span key={i} className={`chal-chip p${i}`}>
              <span aria-hidden>{PLAYER_ICONS[i]}</span> {last.names[i]} spelled {last.scores[i]}
            </span>
          ))}
        </div>
      )}

      {prize ? (
        <div className="chal-prize" role="status">
          <span className="chal-prize-icon" aria-hidden>{prize.icon}</span>
          <div>
            <strong>Playing for: {prize.label}</strong>
            <span>Put up by {prize.setBy}. Winner takes it!</span>
          </div>
        </div>
      ) : (
        <p className="chal-noprize">
          No prize on the table yet — a grown-up can put one up in Settings. You
          can still play for the bragging rights!
        </p>
      )}

      <div className="chal-setup">
        <h2>Who&apos;s playing?</h2>
        {[0, 1].map((i) => (
          <div key={i} className={`chal-player p${i}`}>
            <div className="chal-name-row">
              <span className="chal-badge" aria-hidden>{PLAYER_ICONS[i]}</span>
              <input
                className="chal-name"
                value={names[i]}
                placeholder={`Player ${i + 1} name`}
                onChange={(e) => {
                  const next: [string, string] = [...names] as [string, string]
                  next[i] = e.target.value
                  setNames(next)
                }}
                aria-label={`Player ${i + 1} name`}
              />
            </div>
            <div className="chal-handicaps" role="group" aria-label={`Word length for player ${i + 1}`}>
              {HANDICAPS.map((h) => (
                <button
                  key={h.value}
                  className={`chal-hcap ${handicaps[i] === h.value ? 'on' : ''}`}
                  aria-pressed={handicaps[i] === h.value}
                  onClick={() => {
                    const next: [Handicap, Handicap] = [...handicaps] as [Handicap, Handicap]
                    next[i] = h.value
                    setHandicaps(next)
                    sfx.tap()
                  }}
                >
                  <strong>{h.label}</strong>
                  <span>{h.hint}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
        <p className="chal-fair">
          Pick a different length for each player and a younger speller can win —
          everyone spells words from your own word list, just not the same ones.
        </p>
      </div>

      <h2 className="chal-pick">Pick a game</h2>
      <div className="chal-modes">
        {MODES.map((m) => (
          <button
            key={m.id}
            className={`chal-mode ${mode === m.id ? 'on' : ''}`}
            aria-pressed={mode === m.id}
            onClick={() => { setMode(m.id); sfx.tap(); speak(`${m.name}. ${m.blurb}`) }}
          >
            <span className="chal-mode-icon" aria-hidden>{m.icon}</span>
            <strong>{m.name}</strong>
            <span className="chal-mode-blurb">{m.blurb}</span>
          </button>
        ))}
      </div>

      <Button variant="primary" size="large" disabled={!mode} onClick={start}>
        {!mode ? 'Pick a game first' : last ? 'Rematch! 🔁' : 'Start the match! ⚔️'}
      </Button>

      <Celebration data={celebration} onClose={() => setCelebration(null)} closeLabel="Yay!" />
    </div>
  )
}

export default SiblingChallenge
