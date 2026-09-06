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
import Celebration, { CelebrationData } from '../../components/common/Celebration'
import Button from '../../components/common/Button'
import sfx from '../../components/games/shared/sfx'
import './SiblingChallenge.css'

export interface MatchProps {
  names: [string, string]
  /** one list per player, already fitted to their level */
  words: [Word[], Word[]]
  onFinish: (scores: [number, number]) => void
}

const MODES = [
  { id: 'tug', name: 'Word Tug-of-War', icon: '🪢', blurb: 'Spell to pull the rope your way. Miss and it slips back.' },
  { id: 'buzzer', name: 'Buzzer Race', icon: '🔔', blurb: 'Hit your buzzer first — but get it wrong and they can steal it.' },
  { id: 'steal', name: 'Steal-the-Point', icon: '🥷', blurb: 'Take turns. Miss a word and your rival can steal it.' },
  { id: 'relay', name: 'Team Relay', icon: '🤝', blurb: 'Not a fight — build one streak together and win as a team.' },
] as const

type ModeId = (typeof MODES)[number]['id']

const HANDICAPS: { value: Handicap; label: string; hint: string }[] = [
  { value: 'easier', label: 'Shorter words', hint: 'for the younger speller' },
  { value: 'same', label: 'Middling', hint: 'about even' },
  { value: 'harder', label: 'Longer words', hint: 'for the stronger speller' },
]

const PER_PLAYER = 6

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

  const clean = (): [string, string] => [names[0].trim() || 'Player 1', names[1].trim() || 'Player 2']

  const finish = (scores: [number, number]) => {
    const [a, b] = clean()
    const coop = mode === 'relay'
    const winner = coop || scores[0] === scores[1] ? null : scores[0] > scores[1] ? a : b

    // Nobody loses anything. Both earn for what they spelled; the winner earns
    // a bit more. A child who is beaten still leaves with more than they came
    // with, which is what makes them willing to play again.
    const earned = Math.max(5, Math.round((scores[0] + scores[1]) / 2)) + (winner ? 10 : 5)
    addStars(earned)

    const result = ChallengeService.record({
      mode: MODES.find((m) => m.id === mode)?.name ?? 'Challenge',
      players: [a, b],
      scores,
      winner,
    })

    sfx.fanfare()
    window.dispatchEvent(new Event('show-confetti'))
    setCelebration({
      title: coop
        ? `🤝 ${scores[0] + scores[1]} words together!`
        : winner
        ? `🏆 ${winner} wins!`
        : "🤝 It's a tie!",
      message: coop
        ? 'You built that streak as a team — nobody had to lose for you to win.'
        : result.prize
        ? `${winner} takes ${result.prize}! Go and tell a grown-up.`
        : winner
        ? `${a} spelled ${scores[0]}, ${b} spelled ${scores[1]}. Great match!`
        : `Both of you spelled ${scores[0]}. Rematch?`,
      stars: earned,
    })
    setPlaying(false)
  }

  const enough = pool.length >= 4

  // --- Not enough words for a match -----------------------------------------
  if (!enough) {
    return (
      <div className="chal">
        <div className="chal-header">
          <Button variant="secondary" size="small" onClick={() => navigate('/')}>← Home</Button>
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
    const shared = { names: clean(), words, onFinish: finish }
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

  return (
    <div className="chal">
      <div className="chal-header">
        <Button variant="secondary" size="small" onClick={() => navigate('/')}>← Home</Button>
        <h1>⚔️ Sibling Challenge</h1>
      </div>

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
          <div key={i} className="chal-player">
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
            onClick={() => { setMode(m.id); sfx.tap() }}
          >
            <span className="chal-mode-icon" aria-hidden>{m.icon}</span>
            <strong>{m.name}</strong>
            <span className="chal-mode-blurb">{m.blurb}</span>
          </button>
        ))}
      </div>

      <Button
        variant="primary"
        size="large"
        disabled={!mode}
        onClick={() => {
          setPlaying(true)
          speak(`${clean()[0]} versus ${clean()[1]}. Good luck!`)
          sfx.applause()
        }}
      >
        {mode ? 'Start the match! ⚔️' : 'Pick a game first'}
      </Button>

      <Celebration data={celebration} onClose={() => setCelebration(null)} closeLabel="Play again" />
    </div>
  )
}

export default SiblingChallenge
