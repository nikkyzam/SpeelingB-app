import { activityClock } from '../../../services/games/activityClock'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import type { Word } from '../../../services/wordBank'
import { useAudio } from '../../../contexts/AudioContext'
import { isRealWord } from '../shared/realWords'
import { shuffle, isPlayable, misspell } from '../shared/wordTricks'
import sfx from '../shared/sfx'
import useCheer from '../shared/useCheer'
import Burst from '../shared/Burst'
import './BeeBingo.css'

interface BeeBingoProps {
  onComplete: (score: number) => void
  words?: Word[]
  /** Cards to play. */
  rounds?: number
}

export interface Square {
  text: string
  kind: 'word' | 'decoy' | 'free'
  /** For a decoy, the word it is a misspelling of. */
  of?: string
}

export interface Card {
  squares: Square[]
  /** The card's words, in the order they will be called. */
  calls: string[]
}

export const FREE = 4
export const LINES: readonly (readonly number[])[] = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
]

/** A full row, column or diagonal of marked squares — the free one counts. */
export const bingoLine = (marked: ReadonlySet<number>): readonly number[] | null =>
  LINES.find((line) => line.every((i) => marked.has(i))) ?? null

/** Real words at most; the rest of the card is look-alike misspellings. */
const MAX_WORDS = 6

/**
 * Deal a card: up to six of the child's words and, in the squares left over,
 * misspellings of those same words ("baloon" two squares from "balloon"), so a
 * called word has to be read letter by letter, not spotted by its shape. A
 * misspelling that happens to be a real word ("hopping" for "hoping") would
 * teach the wrong lesson, so nothing the child knows, no common word and no
 * word in the bank is ever used as one — the bank only answers "is this a
 * word?", it never puts a word on the card. At least one line holds no
 * misspelling, so every card can reach Bingo.
 */
export { isRealWord }

export const makeCard = (
  words: Word[],
  rand: () => number = Math.random,
  isWord: (text: string) => boolean = isRealWord
): Card => {
  const texts = [...new Set(words.map((w) => w.word.toLowerCase()))]
  const real = texts.slice(0, MAX_WORDS)
  if (real.length === 0) return { squares: [], calls: [] }
  const known = new Set(texts)
  const taken = new Set(real)

  const decoys: Square[] = []
  for (let n = 0; decoys.length < 8 - real.length && n < 200; n++) {
    const of = real[n % real.length]
    // A short word has only a handful of misspellings; past those, its last
    // letter doubled, tripled… is never a word and always new.
    const fake = n < 60 ? misspell(of) : of + of.slice(-1).repeat(1 + Math.floor((n - 60) / real.length))
    if (!/^[a-z]{3,}$/.test(fake) || taken.has(fake) || known.has(fake) || isWord(fake)) continue
    taken.add(fake)
    decoys.push({ text: fake, kind: 'decoy', of })
  }
  const others: Square[] = [...real.map((text): Square => ({ text, kind: 'word' })), ...decoys]

  // Lay it out so a line can always be finished; four misspellings in the
  // wrong places could block all eight.
  let squares: Square[] = []
  for (let attempt = 0; attempt < 60; attempt++) {
    const order = [...others]
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1))
      ;[order[i], order[j]] = [order[j], order[i]]
    }
    squares = [...order.slice(0, FREE), { text: '', kind: 'free' }, ...order.slice(FREE)]
    if (LINES.some((line) => line.every((i) => squares[i]?.kind !== 'decoy'))) break
  }

  const calls = [...real]
  for (let i = calls.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[calls[i], calls[j]] = [calls[j], calls[i]]
  }
  return { squares, calls }
}

/** After this many wrong taps on one call, the right square buzzes to show itself. */
const HELP_AFTER = 3
const PER_MARK = 10
const HELPED_MARK = 5
const BINGO_BONUS = 50
const CLEAN_BONUS = 20

type Phase = 'calling' | 'bingo'

/**
 * Bee Bingo — the caller reads a word, you find it on your card.
 *
 * A listening game with a reading trap in it: the card holds the child's own
 * words and, beside them, believable misspellings of those same words. Hearing
 * "balloon" and tapping "baloon" is exactly the mistake a speller makes on
 * paper, so every call is a look at how the word is really spelled. When the
 * card is won, the misspellings turn over to show the right spelling.
 */
const BeeBingo: React.FC<BeeBingoProps> = ({ onComplete, words: providedWords, rounds = 2 }) => {
  const { speak } = useAudio()
  const cheer = useCheer()

  const words = useMemo<Word[]>(() => {
    const pool = providedWords && providedWords.length > 0 ? providedWords : []
    return shuffle(pool).filter((w) => isPlayable(w, 3))
  }, [providedWords])

  /** Each card deals from a fresh shuffle, so a second card isn't the first again. */
  const deal = (): Card => makeCard(shuffle(words))

  const [cardNo, setCardNo] = useState(0)
  const [card, setCard] = useState<Card>(() => deal())
  const [marked, setMarked] = useState<Set<number>>(() => new Set([FREE]))
  const [callNo, setCallNo] = useState(0)
  const [misses, setMisses] = useState(0)
  const [cardMisses, setCardMisses] = useState(0)
  const [phase, setPhase] = useState<Phase>('calling')
  const [line, setLine] = useState<readonly number[] | null>(null)
  const [note, setNote] = useState<{ text: string; tone: 'ok' | 'bad' | 'help' } | null>(null)
  const [wobble, setWobble] = useState<number | null>(null)
  // The square marked last, where the star burst goes off.
  const [lastMark, setLastMark] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [bingos, setBingos] = useState(0)

  // The score state lags a render behind; the payout reads this instead.
  const scoreRef = useRef(0)
  // A ref, not state: a double tap would pass a state guard twice.
  const locked = useRef(false)
  const timers = useRef<number[]>([])
  const later = (fn: () => void, ms: number) => {
    timers.current.push(activityClock.setTimeout(fn, ms))
  }
  useEffect(() => () => timers.current.forEach((t) => activityClock.clearTimeout(t)), [])

  const called = card.calls[callNo]

  useEffect(() => {
    if (called && phase === 'calling') speak(called)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardNo, callNo, card])

  if (words.length === 0 || card.calls.length === 0) {
    return (
      <div className="bee-bingo">
        {/* No button: onComplete() is a finished game to the hub, and it pays
            a star for one. "Back to Games" in the header is the way out. */}
        <p className="bb-empty">
          No bingo cards yet — learn a few words, then come back and play! 🐝
        </p>
      </div>
    )
  }

  const addScore = (points: number) => {
    scoreRef.current += points
    setScore(scoreRef.current)
  }

  const nextCard = () => {
    if (cardNo < rounds - 1) {
      setCard(deal())
      setMarked(new Set([FREE]))
      setCallNo(0)
      setMisses(0)
      setCardMisses(0)
      setLine(null)
      setLastMark(null)
      setNote(null)
      setPhase('calling')
      locked.current = false
      setCardNo(cardNo + 1)
    } else {
      onComplete(scoreRef.current)
    }
  }

  const tap = (i: number) => {
    const sq = card.squares[i]
    if (phase !== 'calling' || locked.current || !sq || sq.kind === 'free' || marked.has(i) || !called) return

    if (sq.kind === 'word' && sq.text === called) {
      locked.current = true
      const nowMarked = new Set(marked).add(i)
      setMarked(nowMarked)
      setLastMark(i)
      addScore(misses >= HELP_AFTER ? HELPED_MARK : PER_MARK)
      sfx.pop()
      // Quiet: the next call is about to be spoken, and would cut praise off.
      const line = cheer.hit({ quiet: true })
      const won = bingoLine(nowMarked)
      if (won) {
        const bonus = BINGO_BONUS + (cardMisses === 0 ? CLEAN_BONUS : 0)
        addScore(bonus)
        setLine(won)
        setPhase('bingo')
        setBingos((b) => b + 1)
        setNote({ text: `🎉 BINGO! +${bonus}`, tone: 'ok' })
        sfx.win()
        speak('Bingo!')
        later(nextCard, 2800)
        return
      }
      setNote({ text: `✅ ${line} “${called}”`, tone: 'ok' })
      later(() => {
        setNote(null)
        setMisses(0)
        locked.current = false
        // Every word on the card gets called, and one line has no misspelling
        // in it, so Bingo comes before the calls run out. Just in case:
        if (callNo + 1 >= card.calls.length) nextCard()
        else setCallNo(callNo + 1)
      }, 900)
      return
    }

    cheer.miss({ quiet: true })
    setWobble(i)
    later(() => setWobble(null), 450)
    const used = misses + 1
    setMisses(used)
    setCardMisses((m) => m + 1)
    if (used >= HELP_AFTER) {
      setNote({ text: `It's the buzzing square — “${called}”. 🐝`, tone: 'help' })
      speak(`Here it is. ${called}`)
    } else if (sq.kind === 'decoy' && sq.of === called) {
      setNote({ text: 'So close — look again, that one is spelled wrong! 🔍', tone: 'bad' })
    } else if (sq.kind === 'decoy') {
      setNote({ text: 'Careful — that one is spelled wrong!', tone: 'bad' })
    } else {
      setNote({ text: `That one says “${sq.text}”. Listen again!`, tone: 'bad' })
      speak(called)
    }
  }

  const answerAt = card.squares.findIndex((s) => s.kind === 'word' && s.text === called)
  const helping = phase === 'calling' && misses >= HELP_AFTER

  return (
    <div className="bee-bingo">
      <div className="bb-header">
        <div className="bb-title">🐝 Bee Bingo</div>
        <div className="bb-stats">
          <div className="bb-stat"><span>Card</span><strong>{cardNo + 1}/{rounds}</strong></div>
          <div className="bb-stat"><span>Score</span><strong>{score}</strong></div>
          <div className="bb-stat"><span>Bingos</span><strong>🎉 {bingos}</strong></div>
        </div>
      </div>

      <div className="bb-caller">
        <div className="bb-call-tag">{phase === 'bingo' ? 'Card won!' : `Call ${callNo + 1}`}</div>
        <button
          className="bb-btn"
          onClick={() => called && speak(called)}
          disabled={phase !== 'calling'}
        >
          🔊 Hear the call again
        </button>
      </div>

      <div className={`bb-card ${phase}`} role="group" aria-label="Your bingo card">
        {card.squares.map((sq, i) => {
          const isMarked = marked.has(i)
          const classes = [
            'bb-square',
            sq.kind,
            isMarked ? 'marked' : '',
            line?.includes(i) ? 'line' : '',
            wobble === i ? 'wobble' : '',
            helping && i === answerAt ? 'buzz' : '',
          ]
          if (sq.kind === 'free') {
            return (
              <div key={i} className={classes.filter(Boolean).join(' ')} aria-label="Free square">
                <span className="bb-stamp" aria-hidden>🐝</span>
                <span className="bb-free">FREE</span>
              </div>
            )
          }
          const turned = phase === 'bingo' && sq.kind === 'decoy'
          return (
            <button
              key={i}
              className={classes.filter(Boolean).join(' ')}
              onClick={() => tap(i)}
              disabled={phase !== 'calling' || isMarked}
              aria-label={`Square: ${sq.text}${isMarked ? ', marked' : ''}`}
            >
              {turned ? (
                <span className="bb-turned">
                  <s>{sq.text}</s>
                  <span>{sq.of}</span>
                </span>
              ) : (
                <span className="bb-word">{sq.text}</span>
              )}
              {isMarked && <span className="bb-stamp" aria-hidden>🐝</span>}
              {i === lastMark && <Burst trigger={marked.size} count={8} />}
            </button>
          )
        })}
      </div>

      <p className={`bb-note ${note?.tone ?? ''}`} aria-live="polite">
        {note?.text ?? 'Listen to the call, then tap that word on your card. Watch out for sneaky misspellings!'}
      </p>
      {phase === 'bingo' && (
        <p className="bb-lesson">The crossed-out squares were misspellings — see how the real words are spelled.</p>
      )}
    </div>
  )
}

export default BeeBingo
