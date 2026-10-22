import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useAudio } from '../../../../contexts/AudioContext'
import { pickRounds, type TopicGameProps } from '../../../../services/subjects/gamePool'
import sfx from '../../../games/shared/sfx'
import useCheer from '../../../games/shared/useCheer'
import useLater from '../../../games/shared/useLater'
import Burst from '../../../games/shared/Burst'
import GameEmpty from '../../../games/shared/GameEmpty'
import './BubblePop.css'

/** Rounds in one game (fewer when the topic has fewer usable questions). */
const ROUNDS = 8
/** Misses on one round before the right bubble starts to glow. */
const GLOW_AFTER = 2
/** How long the explanation stays up after the right bubble pops. */
const EXPLAIN_MS = 2200
/** Options longer than this turn the whole round into wide pills, so text wraps instead of overflowing a circle. */
const ROUND_BUBBLE_MAX = 12
/** Explanations up to this length are read aloud after the cheer. */
const SAY_EXPLANATION_MAX = 120

/**
 * Bubble Pop — the answers float up as bubbles; pop the right one.
 *
 * Built from any topic's questions through `pickRounds`, so it has to cope
 * with "2/5" and with a 160-character sentence alike: short answers are round
 * bubbles, and a round with any long answer lays every option out as a wide
 * pill that wraps. A wrong bubble wobbles and fades and the child keeps
 * trying; after two misses the right one glows, so nobody is ever stuck. Only
 * a round popped with no misses counts towards the score.
 */
const BubblePop: React.FC<TopicGameProps> = ({ questions, onComplete }) => {
  const { speak } = useAudio()
  const cheer = useCheer()
  const later = useLater()

  const rounds = useMemo(() => pickRounds(questions, ROUNDS), [questions])

  const [index, setIndex] = useState(0)
  const [faded, setFaded] = useState<number[]>([])
  const [wobble, setWobble] = useState(-1)
  const [popped, setPopped] = useState(false)
  const [firstTry, setFirstTry] = useState(0)
  const [hits, setHits] = useState(0)
  const [line, setLine] = useState('')
  const [lineKind, setLineKind] = useState<'ok' | 'soft' | ''>('')
  const [finished, setFinished] = useState(false)

  // Refs settle a tap at once, so a double tap can't pop twice or count one miss twice.
  const locked = useRef(false)
  const missed = useRef<Set<number>>(new Set())
  const reported = useRef(false)

  const current = rounds[index]

  useEffect(() => {
    if (!current || finished) return
    // The instructions are only written, so say them once for a child who can't read yet.
    const intro = index === 0 ? 'Pop the bubble with the right answer! ' : ''
    speak(`${intro}${current.prompt}`, { queue: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, rounds])

  if (rounds.length < 2) {
    return (
      <div className="bubble-pop">
        <GameEmpty icon="🫧">
          There aren't enough questions here for bubbles yet. Try another topic and come back!
        </GameEmpty>
      </div>
    )
  }

  if (finished) {
    const pct = Math.round((100 * firstTry) / rounds.length)
    const done = () => {
      if (reported.current) return
      reported.current = true
      onComplete(pct)
    }
    return (
      <div className="bubble-pop">
        <div className="bub-finish" role="status">
          <div className="bub-finish-icon" aria-hidden>🫧</div>
          <h2 className="bub-finish-title">Bubbles popped! 🫧</h2>
          <p className="bub-finish-score">
            {firstTry} of {rounds.length} popped on the first try
          </p>
          <button type="button" className="bub-btn" onClick={done} aria-label="Done">
            Done
          </button>
        </div>
      </div>
    )
  }

  const misses = faded.length
  const left = current.options.length - misses
  const glow = !popped && (misses >= GLOW_AFTER || left === 1)
  const pills = current.options.some((o) => o.length > ROUND_BUBBLE_MAX)

  const next = () => {
    if (index < rounds.length - 1) {
      locked.current = false
      missed.current = new Set()
      setFaded([])
      setWobble(-1)
      setPopped(false)
      setLine('')
      setLineKind('')
      setIndex((i) => i + 1)
    } else {
      sfx.win()
      setFinished(true)
    }
  }

  const tap = (i: number) => {
    if (locked.current || missed.current.has(i)) return

    if (i === current.answer) {
      locked.current = true
      sfx.pop()
      const clean = missed.current.size === 0
      if (clean) setFirstTry((n) => n + 1)
      const say = current.explanation && current.explanation.length <= SAY_EXPLANATION_MAX ? current.explanation : undefined
      setLine(clean ? cheer.hit({ say }) : `You found it! ${cheer.hit({ say })}`)
      setLineKind('ok')
      setHits((h) => h + 1)
      setPopped(true)
      later(next, EXPLAIN_MS)
      return
    }

    missed.current.add(i)
    setFaded((f) => [...f, i])
    setWobble(i)
    later(() => setWobble((w) => (w === i ? -1 : w)), 500)
    setLine(cheer.miss({ quiet: true }))
    setLineKind('soft')
  }

  return (
    <div className="bubble-pop">
      <div className="bub-strip" aria-label={`Round ${index + 1} of ${rounds.length}, ${firstTry} stars`}>
        <span className="bub-title">🫧 Bubble Pop</span>
        <span className="bub-round">Round {index + 1} of {rounds.length}</span>
        <span className="bub-stars">⭐ {firstTry}</span>
      </div>

      <div className="bub-question">
        <p className="bub-prompt">{current.prompt}</p>
        <button
          type="button"
          className="bub-hear"
          onClick={() => speak(current.prompt)}
          aria-label="Read the question aloud"
        >
          🔊
        </button>
      </div>

      <div className={`bub-field ${pills ? 'pills' : 'round'}`} role="group" aria-label="Answer bubbles">
        {current.options.map((opt, i) => {
          const isFaded = faded.includes(i)
          const isRight = i === current.answer
          const cls = [
            'bub-bubble',
            isFaded ? 'faded' : '',
            wobble === i ? 'wobble' : '',
            popped && isRight ? 'popped' : '',
            glow && isRight ? 'glow' : '',
          ]
            .filter(Boolean)
            .join(' ')
          return (
            <button
              key={`${current.id}-${i}`}
              type="button"
              className={cls}
              style={{ '--bub-delay': `${(i * 0.37) % 1.4}s` } as React.CSSProperties}
              onClick={() => tap(i)}
              disabled={isFaded || popped}
              data-glow={glow && isRight ? 'true' : undefined}
              aria-label={`Pop the bubble: ${opt}`}
            >
              <span className="bub-text">{opt}</span>
            </button>
          )
        })}
      </div>

      <div className={`bub-flash ${lineKind}`} aria-live="polite">
        <Burst trigger={hits} emoji={['🫧', '✨', '⭐', '💧']} />
        {line && <p className="bub-line">{line}</p>}
        {popped && current.explanation && <p className="bub-why">{current.explanation}</p>}
        {!popped && glow && <p className="bub-nudge">The glowing bubble is the one — pop it!</p>}
      </div>
    </div>
  )
}

export default BubblePop
