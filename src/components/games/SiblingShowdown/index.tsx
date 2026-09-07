import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAudio } from '../../../contexts/AudioContext'
import { useProgress } from '../../../contexts/ProgressContext'
import { useRewardStore } from '../../../stores/rewards/useRewardStore'
import { wordBank, Word } from '../../../services/wordBank'
import Celebration, { CelebrationData } from '../../common/Celebration'
import sfx from '../shared/sfx'
import Button from '../../common/Button'
import './SiblingShowdown.css'
import { NO_SPELLING_HELP } from '../../common/spellingInput'

type Phase = 'setup' | 'handover' | 'turn' | 'podium'

interface Player {
  name: string
  score: number
  correct: number
  streak: number
}

const ROUNDS = 5 // words per player

/**
 * Sibling Showdown — two kids, one device.
 *
 * Players take turns spelling; a "pass the device" screen keeps each turn a
 * surprise. Sibling rivalry is the best engagement engine ever built, and it
 * needs no accounts, no network, and no moderation.
 */
const SiblingShowdown: React.FC = () => {
  const navigate = useNavigate()
  const { speak } = useAudio()
  const { learningFlow } = useProgress()
  const { addStars } = useRewardStore()

  const [phase, setPhase] = useState<Phase>('setup')
  const [names, setNames] = useState(['', ''])
  const [players, setPlayers] = useState<Player[]>([])
  const [words, setWords] = useState<Word[]>([])
  const [turn, setTurn] = useState(0) // global turn counter
  const [input, setInput] = useState('')
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [celebration, setCelebration] = useState<CelebrationData | null>(null)

  const current = turn % 2
  const round = Math.floor(turn / 2)
  const word = words[turn] || null

  const pickWords = (): Word[] => {
    // A fair fight uses words at least one child has actually met — never
    // topped up from the whole bank (that's the app's word-scoping rule).
    const learned = wordBank.getLearnedWords(learningFlow.getWordsLearnedTotal())
    const shuffled = [...learned].sort(() => Math.random() - 0.5)
    // With a small collection, cycle through it rather than pulling strangers.
    const out: Word[] = []
    for (let i = 0; i < ROUNDS * 2 && shuffled.length > 0; i++) {
      out.push(shuffled[i % shuffled.length])
    }
    return out
  }

  const start = () => {
    const clean = names.map((n, i) => n.trim() || `Player ${i + 1}`)
    setPlayers(clean.map((name) => ({ name, score: 0, correct: 0, streak: 0 })))
    setWords(pickWords())
    setTurn(0)
    setPhase('handover')
    sfx.win()
  }

  const beginTurn = () => {
    setPhase('turn')
    setInput('')
    setFeedback(null)
    if (word) speak(`Your word is. ${word.word}.`)
  }

  const submit = () => {
    if (!word || feedback) return
    const correct = input.trim().toLowerCase() === word.word.toLowerCase()
    setFeedback(correct ? 'correct' : 'wrong')

    // Score outside setState so `finish` can be handed the real final tally.
    // Reading `players` back after setPlayers gives the scores from *before*
    // this answer, which silently dropped the last turn of every game.
    const scored = players.map((p) => ({ ...p }))
    const scorer = scored[current]
    if (correct) {
      scorer.streak += 1
      scorer.correct += 1
      scorer.score += 10 + (scorer.streak - 1) * 5
    } else {
      scorer.streak = 0
    }
    setPlayers(scored)

    if (correct) {
      sfx.correct()
    } else {
      sfx.wrong()
      speak(`The correct spelling is. ${word.word.split('').join('. ')}. ${word.word}.`)
    }

    window.setTimeout(() => {
      if (turn + 1 >= words.length) {
        finish(scored)
      } else {
        setTurn((t) => t + 1)
        setPhase('handover')
      }
    }, 1800)
  }

  const finish = (final: Player[]) => {
    setPhase('podium')
    const [a, b] = final
    const winner = a.score === b.score ? null : a.score > b.score ? a : b
    // Everyone who took part gets stars; the winner gets a few more.
    addStars(15 + (winner ? 10 : 0))
    sfx.fanfare()
    window.dispatchEvent(new Event('show-confetti'))
    setCelebration({
      title: winner ? `🏆 ${winner.name} wins!` : "🤝 It's a tie!",
      message: winner
        ? `${winner.name} spelled ${winner.correct} words right. What a showdown!`
        : 'Both of you spelled brilliantly — rematch?',
      stars: 15 + (winner ? 10 : 0),
    })
  }


  if (phase === 'setup') {
    const hasWords = wordBank.getLearnedWords(learningFlow.getWordsLearnedTotal()).length > 0
    if (!hasWords) {
      return (
        <div className="showdown">
          <div className="showdown-card pop-in">
            <h1>⚔️ Sibling Showdown</h1>
            <p className="showdown-sub">
              The showdown uses words you've already met — go learn a few first, then come back and battle!
            </p>
            <div className="showdown-actions">
              <Button variant="primary" icon="📖" onClick={() => navigate('/learn')}>
                Learn some words
              </Button>
              <Button variant="secondary" onClick={() => navigate('/games')}>
                ← Back to Games
              </Button>
            </div>
          </div>
        </div>
      )
    }
    return (
      <div className="showdown">
        <div className="showdown-card pop-in">
          <h1>⚔️ Sibling Showdown</h1>
          <p className="showdown-sub">
            Two players, one device, {ROUNDS} words each. Who spells best?
          </p>
          {[0, 1].map((i) => (
            <input
              {...NO_SPELLING_HELP}
              key={i}
              className="showdown-name"
              value={names[i]}
              onChange={(e) => setNames((prev) => prev.map((n, j) => (j === i ? e.target.value : n)))}
              placeholder={`Player ${i + 1} name`}
              maxLength={12}
            />
          ))}
          <div className="showdown-actions">
            <Button variant="primary" size="large" icon="⚔️" onClick={start}>
              Start the Showdown!
            </Button>
            <Button variant="secondary" onClick={() => navigate('/games')}>
              ← Back to Games
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (phase === 'handover') {
    return (
      <div className="showdown">
        <div className="showdown-card pop-in showdown-handover">
          <div className="showdown-scoreboard">
            {players.map((p, i) => (
              <div key={i} className={`showdown-score ${i === current ? 'active' : ''}`}>
                <span className="showdown-score-name">{p.name}</span>
                <span className="showdown-score-value">{p.score}</span>
              </div>
            ))}
          </div>
          <div className="showdown-pass" aria-hidden>📲</div>
          <h2>Pass to {players[current]?.name}!</h2>
          <p>Round {round + 1} of {ROUNDS} — no peeking, {players[1 - current]?.name}! 🙈</p>
          <Button variant="primary" size="large" icon="👂" onClick={beginTurn}>
            I'm {players[current]?.name} — ready!
          </Button>
        </div>
      </div>
    )
  }

  if (phase === 'podium') {
    const [a, b] = players
    const winnerFirst = [...players].sort((x, y) => y.score - x.score)
    return (
      <div className="showdown">
        <div className="showdown-card pop-in">
          <h1>🏁 Final Scores</h1>
          <div className="showdown-podium">
            {winnerFirst.map((p, i) => (
              <div key={p.name} className={`podium-slot place-${i + 1}`}>
                <span className="podium-medal" aria-hidden>{i === 0 ? '🥇' : '🥈'}</span>
                <span className="podium-name">{p.name}</span>
                <span className="podium-score">{p.score} pts</span>
                <span className="podium-detail">{p.correct}/{ROUNDS} words</span>
              </div>
            ))}
          </div>
          <p className="showdown-gg">
            {a.name} {a.score} — {b.score} {b.name}
          </p>
          <div className="showdown-actions">
            <Button variant="primary" icon="🔄" onClick={() => setPhase('setup')}>
              Rematch!
            </Button>
            <Button variant="secondary" onClick={() => navigate('/games')}>
              Back to Games
            </Button>
          </div>
        </div>
        <Celebration data={celebration} onClose={() => setCelebration(null)} />
      </div>
    )
  }

  // phase === 'turn'
  return (
    <div className="showdown">
      <div className="showdown-card">
        <div className="showdown-scoreboard">
          {players.map((p, i) => (
            <div key={i} className={`showdown-score ${i === current ? 'active' : ''}`}>
              <span className="showdown-score-name">{p.name}</span>
              <span className="showdown-score-value">{p.score}</span>
            </div>
          ))}
        </div>

        <h2>{players[current]?.name}, your word!</h2>
        <p className="showdown-round">Round {round + 1} of {ROUNDS}</p>

        <div className="showdown-hear">
          <Button variant="secondary" icon="🔊" onClick={() => word && speak(`Your word is. ${word.word}.`)}>
            Hear the word
          </Button>
          {word?.sentence && (
            <Button
              variant="secondary"
              icon="📖"
              onClick={() => word && speak(word.sentence.replace(word.word, 'blank'))}
            >
              Hear it in a sentence
            </Button>
          )}
        </div>

        <input
              {...NO_SPELLING_HELP}
          className={`showdown-input ${feedback === 'correct' ? 'correct' : feedback === 'wrong' ? 'incorrect' : ''}`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && submit()}
          placeholder="Type the word…"
          autoFocus
          disabled={!!feedback}
        />

        {feedback === 'correct' && <p className="showdown-feedback good">✅ Yes! +{10 + (players[current].streak - 1) * 5} points!</p>}
        {feedback === 'wrong' && word && <p className="showdown-feedback bad">❌ It was <strong>{word.word}</strong></p>}

        {!feedback && (
          <Button variant="primary" size="large" onClick={submit} disabled={!input.trim()}>
            Lock it in! 🔒
          </Button>
        )}
      </div>
    </div>
  )
}

export default SiblingShowdown
