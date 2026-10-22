import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useAudio } from '../../../../contexts/AudioContext'
import { matchPairs, type MatchPair, type TopicGameProps } from '../../../../services/subjects/gamePool'
import { shuffle } from '../../../games/shared/wordTricks'
import useCheer from '../../../games/shared/useCheer'
import useLater from '../../../games/shared/useLater'
import Burst from '../../../games/shared/Burst'
import GameEmpty from '../../../games/shared/GameEmpty'
import sfx from '../../../games/shared/sfx'
import './MatchUp.css'

/** Pairs on the board when the topic has enough of them. */
export const MATCH_COUNT = 6
/** Misses on one question before its answer glows, so nobody is ever stuck. */
export const MISSES_BEFORE_HELP = 2
/** The lowest score a finished board pays. */
export const MIN_PCT = 10

/** 100 × pairs matched with no miss on them ÷ pairs, but never below MIN_PCT. */
export const matchScore = (total: number, firstTry: number): number =>
  total <= 0 ? MIN_PCT : Math.max(MIN_PCT, Math.round((100 * firstTry) / total))

/**
 * Match Up: questions on the left, their answers shuffled on the right. Tap a
 * question and then an answer (either order) to pair them. Built from any
 * topic's questions, so the text can be long and hold fractions like "2/5".
 */
const MatchUp: React.FC<TopicGameProps> = ({ questions, onComplete }) => {
  const { speak } = useAudio()
  const cheer = useCheer()
  const later = useLater()

  const pairs = useMemo<MatchPair[]>(() => matchPairs(questions, MATCH_COUNT), [questions])
  const answerOrder = useMemo<MatchPair[]>(() => shuffle(pairs), [pairs])

  const [pickedPrompt, setPickedPrompt] = useState<string | null>(null)
  const [pickedAnswer, setPickedAnswer] = useState<string | null>(null)
  // Pair id → the order it was matched in (1, 2, …), shown as a badge on both cards.
  const [matched, setMatched] = useState<Record<string, number>>({})
  const [misses, setMisses] = useState<Record<string, number>>({})
  const [wobble, setWobble] = useState<{ prompt: string; answer: string } | null>(null)
  const [flash, setFlash] = useState<{ tone: 'ok' | 'bad'; line: string } | null>(null)
  const [hits, setHits] = useState(0)
  const [finished, setFinished] = useState(false)

  // Refs settle at once, so a double tap can't pair (or finish) twice.
  const matchedRef = useRef<Set<string>>(new Set())
  const missRef = useRef<Record<string, number>>({})
  const busy = useRef(false)
  const sent = useRef(false)

  const enough = pairs.length >= 2

  useEffect(() => {
    if (enough) speak('Tap a question, then tap its answer.', { queue: true })
    // Said once, when the board opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!enough) {
    return (
      <div className="match-up">
        <GameEmpty icon="🧩">Not enough questions to match up in this topic yet. Try another game!</GameEmpty>
      </div>
    )
  }

  const firstTry = pairs.filter((p) => matchedRef.current.has(p.id) && !missRef.current[p.id]).length
  const doneCount = Object.keys(matched).length

  const settle = (promptId: string, answerId: string) => {
    if (busy.current) return
    if (matchedRef.current.has(promptId) || matchedRef.current.has(answerId)) return
    setPickedPrompt(null)
    setPickedAnswer(null)

    if (promptId === answerId) {
      matchedRef.current.add(promptId)
      const order = matchedRef.current.size
      setMatched((m) => ({ ...m, [promptId]: order }))
      setHits((h) => h + 1)
      const last = matchedRef.current.size === pairs.length
      setFlash({ tone: 'ok', line: cheer.hit({ quiet: last }) })
      if (last) {
        busy.current = true
        later(() => {
          sfx.win()
          speak('All matched!', { queue: true })
          setFinished(true)
        }, 900)
      }
      return
    }

    // A wrong pair: wobble both cards, then let go of them.
    busy.current = true
    const n = (missRef.current[promptId] ?? 0) + 1
    missRef.current = { ...missRef.current, [promptId]: n }
    setMisses(missRef.current)
    setWobble({ prompt: promptId, answer: answerId })
    const line = cheer.miss()
    setFlash({
      tone: 'bad',
      line: n >= MISSES_BEFORE_HELP ? `${line} Look for the glowing answer.` : `${line} Try another answer.`,
    })
    later(() => {
      setWobble(null)
      busy.current = false
    }, 600)
  }

  const tapPrompt = (id: string) => {
    if (busy.current || matchedRef.current.has(id)) return
    if (pickedAnswer) {
      settle(id, pickedAnswer)
      return
    }
    sfx.tap()
    setPickedPrompt((cur) => (cur === id ? null : id))
  }

  const tapAnswer = (id: string) => {
    if (busy.current || matchedRef.current.has(id)) return
    if (pickedPrompt) {
      settle(pickedPrompt, id)
      return
    }
    sfx.tap()
    setPickedAnswer((cur) => (cur === id ? null : id))
  }

  const finish = () => {
    if (sent.current) return
    sent.current = true
    onComplete(matchScore(pairs.length, firstTry))
  }

  if (finished) {
    return (
      <div className="match-up">
        <div className="mu-finish" role="status">
          <Burst trigger={hits} />
          <div className="mu-finish-title">All matched! 🎉</div>
          <p className="mu-finish-text">
            {firstTry} of {pairs.length} matched on the first try.
          </p>
          <button type="button" className="mu-done" onClick={finish} aria-label="Done">
            Done
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="match-up">
      <div className="mu-header">
        <div className="mu-title">🧩 Match Up</div>
        <div className="mu-count" aria-label={`${doneCount} of ${pairs.length} matched`}>
          {doneCount} / {pairs.length}
        </div>
      </div>
      <p className="mu-instructions">Tap a question, then tap its answer.</p>

      <div className="mu-board">
        <div className="mu-col" role="group" aria-label="Questions">
          {pairs.map((p) => {
            const order = matched[p.id]
            const classes = ['mu-card', 'mu-prompt']
            if (order) classes.push('matched')
            if (pickedPrompt === p.id) classes.push('picked')
            if (wobble?.prompt === p.id) classes.push('wobble')
            return (
              <div key={p.id} className={classes.join(' ')}>
                <button
                  type="button"
                  className="mu-card-main"
                  onClick={() => tapPrompt(p.id)}
                  disabled={!!order}
                  aria-pressed={pickedPrompt === p.id}
                  aria-label={`Question: ${p.prompt}`}
                >
                  {order ? <span className="mu-badge" aria-hidden>{order}</span> : null}
                  <span className="mu-text">{p.prompt}</span>
                </button>
                <button
                  type="button"
                  className="mu-say"
                  onClick={() => speak(p.prompt)}
                  aria-label={`Read aloud: ${p.prompt}`}
                >
                  🔊
                </button>
              </div>
            )
          })}
        </div>

        <div className="mu-col" role="group" aria-label="Answers">
          {answerOrder.map((p) => {
            const order = matched[p.id]
            const help = !order && (misses[p.id] ?? 0) >= MISSES_BEFORE_HELP
            const classes = ['mu-card', 'mu-answer']
            if (order) classes.push('matched')
            if (pickedAnswer === p.id) classes.push('picked')
            if (wobble?.answer === p.id) classes.push('wobble')
            if (help) classes.push('help')
            return (
              <button
                key={p.id}
                type="button"
                className={classes.join(' ')}
                onClick={() => tapAnswer(p.id)}
                disabled={!!order}
                aria-pressed={pickedAnswer === p.id}
                aria-label={`Answer: ${p.answer}`}
                data-help={help ? 'true' : undefined}
              >
                {order ? <span className="mu-badge" aria-hidden>{order}</span> : null}
                <span className="mu-text">{p.answer}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className={`mu-flash ${flash?.tone ?? ''}`} aria-live="polite">
        <Burst trigger={hits} />
        {flash ? (flash.tone === 'ok' ? `🎉 ${flash.line}` : flash.line) : ' '}
      </div>
    </div>
  )
}

export default MatchUp
