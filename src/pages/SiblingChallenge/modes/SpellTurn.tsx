import React, { useEffect, useRef, useState } from 'react'
import type { Word } from '../../../services/wordBank'
import { useAudio } from '../../../contexts/AudioContext'
import Button from '../../../components/common/Button'
import SpellingInput from '../../../components/common/SpellingInput'
import useCheer from '../../../components/games/shared/useCheer'
import useLater from '../../../components/games/shared/useLater'
import Burst from '../../../components/games/shared/Burst'
import { maskClue } from '../../../components/games/shared/clues'
import { sayPrompt, spellOut } from '../../../services/words/praise'

/**
 * Each child's badge, worn on every turn, score and buzzer so a glance says
 * whose go it is. Colour comes from `.p0` / `.p1` in SiblingChallenge.css.
 */
export const PLAYER_ICONS = ['🦊', '🐼'] as const

interface SpellTurnProps {
  who: string
  word: Word
  /** shown above the box, e.g. "Round 3 of 6" */
  label: string
  onAnswer: (correct: boolean) => void
  /** ms to show the verdict before moving on (default: longer after a miss, so the letters can be said) */
  hold?: number
  /**
   * Whether a missed word is shown and read out.
   *
   * Normally it is — a child who never sees the word they missed has learned
   * nothing from missing it. But when the same word is about to be passed to
   * their sibling to steal, revealing it hands the sibling the answer, and the
   * steal stops being worth anything.
   */
  reveal?: boolean
  /** Which child (0 or 1): the turn wears their colour and badge. */
  player?: 0 | 1
  /** Who a hidden miss goes to — "Over to Sam!" rather than a faceless "rival". */
  passTo?: string
  /** Said before the word, e.g. "Sam, steal the point!" */
  intro?: string
}

/**
 * One person spelling one word.
 *
 * Every challenge mode needs exactly this, so it lives once: hear the word,
 * type it, find out. The word is never printed — hearing it is the task — but
 * it is always revealed after an answer, because a child who never sees the
 * word they missed has not learned anything from missing it.
 *
 * Two children share one iPad, so whose turn it is fills the top of the card
 * in that child's colour, and the prompt starts with their name.
 */
const SpellTurn: React.FC<SpellTurnProps> = ({
  who,
  word,
  label,
  onAnswer,
  hold,
  reveal = true,
  player,
  passTo,
  intro,
}) => {
  const { speak } = useAudio()
  const cheer = useCheer()
  // A match abandoned while the verdict is showing must not finish itself —
  // that would award stars, name a winner and spend the grown-up's prize after
  // the children have walked away. `later` dies with the turn.
  const later = useLater()
  const [value, setValue] = useState('')
  const [verdict, setVerdict] = useState<'right' | 'wrong' | null>(null)
  const [line, setLine] = useState('')
  const [hits, setHits] = useState(0)
  const box = useRef<HTMLInputElement>(null)
  // The verdict state loses a race to a double tap (or Enter plus the Lock-it
  // button): both read "no verdict yet", and the turn answered twice — which
  // skipped the sibling's turn, or finished the match twice and paid twice.
  const settled = useRef(false)

  useEffect(() => {
    setValue('')
    setVerdict(null)
    settled.current = false
    // Queued, so the cheer for the last turn (or "Good luck!") is not cut off.
    speak(`${intro ? `${intro} ` : ''}${who}, your word is: ${sayPrompt(word.word, word.sentence)}`, { queue: true })
    const t = window.setTimeout(() => box.current?.focus(), 80)
    return () => window.clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [word.id, who])

  const submit = () => {
    if (settled.current || !value.trim()) return
    settled.current = true
    const correct = value.trim().toLowerCase() === word.word.toLowerCase()
    setVerdict(correct ? 'right' : 'wrong')
    if (correct) {
      setLine(cheer.hit({ say: `${who}!` }))
      setHits((n) => n + 1)
    } else if (reveal) {
      setLine(cheer.miss({ say: `It was ${word.word}. ${spellOut(word.word)}.` }))
    } else {
      setLine(cheer.miss({ say: passTo ? `Over to ${passTo}!` : undefined }))
    }
    const wait = hold ?? (correct ? 1400 : reveal ? 2600 : 1600)
    later(() => onAnswer(correct), wait)
  }

  const colour = player === undefined ? '' : `p${player}`

  return (
    <div className={`turn ${colour}`}>
      <div className="turn-banner" role="status" aria-live="polite">
        {player !== undefined && <span className="turn-icon" aria-hidden>{PLAYER_ICONS[player]}</span>}
        <span className="turn-who">{who}&apos;s turn!</span>
      </div>
      <div className="turn-label">{label}</div>

      <Button variant="secondary" icon="🔊" onClick={() => speak(word.word)}>Hear it again</Button>
      {/* The meaning can contain the word itself ("cat: a small cat"), which
          would turn the spelling into copying — blank it out. */}
      {word.meaning && <p className="turn-meaning">{maskClue(word.meaning, word.word)}</p>}

      <SpellingInput
        ref={box}
        className={`turn-input ${verdict ?? ''}`}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && submit()}
        placeholder="Spell it…"
        disabled={!!verdict}
        aria-label={`${who}, spell the word`}
      />

      {verdict ? (
        <div className={`turn-verdict ${verdict}`}>
          {verdict === 'right' && <Burst trigger={hits} />}
          {verdict === 'right'
            ? `🎉 ${line}`
            : reveal
            ? `${line} It was “${word.word}”`
            : `${line} Over to ${passTo ?? 'the other player'}!`}
        </div>
      ) : (
        <Button variant="primary" size="large" disabled={!value.trim()} onClick={submit}>
          Lock it in! 🔒
        </Button>
      )}
    </div>
  )
}

export default SpellTurn
