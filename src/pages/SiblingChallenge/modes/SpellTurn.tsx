import React, { useEffect, useRef, useState } from 'react'
import type { Word } from '../../../services/wordBank'
import { useAudio } from '../../../contexts/AudioContext'
import Button from '../../../components/common/Button'
import sfx from '../../../components/games/shared/sfx'
import SpellingInput from '../../../components/common/SpellingInput'

interface SpellTurnProps {
  who: string
  word: Word
  /** shown above the box, e.g. "Round 3 of 6" */
  label: string
  onAnswer: (correct: boolean) => void
  /** ms to show the verdict before moving on */
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
}

/**
 * One person spelling one word.
 *
 * Every challenge mode needs exactly this, so it lives once: hear the word,
 * type it, find out. The word is never printed — hearing it is the task — but
 * it is always revealed after an answer, because a child who never sees the
 * word they missed has not learned anything from missing it.
 */
const SpellTurn: React.FC<SpellTurnProps> = ({ who, word, label, onAnswer, hold = 1500, reveal = true }) => {
  const { speak } = useAudio()
  const [value, setValue] = useState('')
  const [verdict, setVerdict] = useState<'right' | 'wrong' | null>(null)
  const box = useRef<HTMLInputElement>(null)
  const verdictTimer = useRef<number | null>(null)

  // A match abandoned while the verdict is showing must not finish itself —
  // that would award stars, name a winner and spend the grown-up's prize after
  // the children have walked away.
  useEffect(() => () => {
    if (verdictTimer.current !== null) window.clearTimeout(verdictTimer.current)
  }, [])

  useEffect(() => {
    setValue('')
    setVerdict(null)
    speak(`${who}, your word is. ${word.word}.`)
    const t = window.setTimeout(() => box.current?.focus(), 80)
    return () => window.clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [word.id, who])

  const submit = () => {
    if (verdict) return
    const correct = value.trim().toLowerCase() === word.word.toLowerCase()
    setVerdict(correct ? 'right' : 'wrong')
    if (correct) {
      sfx.correct()
    } else {
      sfx.wrong()
      if (reveal) speak(`It was. ${word.word}.`)
    }
    verdictTimer.current = window.setTimeout(() => onAnswer(correct), hold)
  }

  return (
    <div className="turn">
      <div className="turn-label">{label}</div>
      <h3 className="turn-who">{who}&apos;s turn</h3>

      <Button variant="secondary" icon="🔊" onClick={() => speak(word.word)}>Hear it again</Button>
      {word.meaning && <p className="turn-meaning">{word.meaning}</p>}

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
          {verdict === 'right'
            ? '✅ Yes!'
            : reveal
            ? `It was “${word.word}”`
            : 'Not quite — over to your rival!'}
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
