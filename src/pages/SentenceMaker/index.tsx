import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAudio } from '../../contexts/AudioContext'
import { useProgress } from '../../contexts/ProgressContext'
import { useRewardStore } from '../../stores/rewards/useRewardStore'
import { wordBank, Word } from '../../services/wordBank'
import sfx from '../../components/games/shared/sfx'
import { shuffle } from '../../components/games/shared/wordTricks'
import Burst from '../../components/games/shared/Burst'
import Button from '../../components/common/Button'
import './SentenceMaker.css'

const STATE_KEY = 'silly_sentences_state'

/** Templates with three slots — every slot takes one of the child's words. */
const TEMPLATES = [
  'The {a} danced on the {b} while singing about {c}!',
  'My pet {a} ate a {b} for breakfast and then hugged a {c}.',
  'One day, a {a} and a {b} built a rocket out of {c}.',
  'Never trust a {a} who hides a {b} inside a {c}.',
  'The {a} shouted, "Quick! Hide the {b} before the {c} wakes up!"',
  'A {a}, a {b} and a {c} walked into a puddle. Splash!',
  'Grandma keeps a {a} next to her {b}, just in case of {c}.',
  'If you give a {a} a {b}, it will probably ask for a {c}.',
  'The {a} won the race because the {b} was tickling the {c}.',
  'Shh! The {a} is teaching the {b} how to juggle a {c}.',
]

const fill = (template: string, picks: Word[]): string =>
  template
    .replace('{a}', picks[0].word)
    .replace('{b}', picks[1].word)
    .replace('{c}', picks[2].word)

const SLOT = { '{a}': 0, '{b}': 1, '{c}': 2 } as const

/** The sentence in pieces, with the child's own words marked so they stand out. */
const pieces = (template: string, picks: Word[]): { text: string; slot?: number }[] =>
  template
    .split(/(\{[abc]\})/)
    .filter(Boolean)
    .map((part) =>
      part in SLOT ? { text: picks[SLOT[part as keyof typeof SLOT]].word, slot: SLOT[part as keyof typeof SLOT] } : { text: part }
    )

/** The stars for the first sentence of the day. */
export const SENTENCE_STARS = 5

const pickTemplate = (not?: string): string => {
  const options = TEMPLATES.filter((t) => t !== not)
  return options[Math.floor(Math.random() * options.length)]
}

const readToday = (): { date: string; made: number } => {
  try {
    const raw = localStorage.getItem(STATE_KEY)
    const saved = raw ? JSON.parse(raw) : null
    const today = new Date().toDateString()
    if (saved && saved.date === today) return saved
    return { date: today, made: 0 }
  } catch {
    return { date: new Date().toDateString(), made: 0 }
  }
}

/**
 * The Sentence Maker — pick three of your own words and the app builds
 * something ridiculous out of them. Seeing "elephant", "danced" and "pizza"
 * turn into a joke is what makes a child *own* a word.
 */
const SentenceMaker: React.FC = () => {
  const navigate = useNavigate()
  const { speak } = useAudio()
  const { learningFlow } = useProgress()
  const { addStars } = useRewardStore()

  // Only the child's own words — the joke lands because they recognise every
  // word in it. Padding from the bank would put strangers in their sentence.
  const pool = useMemo(
    () => wordBank.getLearnedWords(learningFlow.getWordsLearnedTotal()),
    [learningFlow]
  )

  const [picks, setPicks] = useState<Word[]>(() => shuffle(pool).slice(0, 3))
  const [template, setTemplate] = useState(() => pickTemplate())
  const [today, setToday] = useState(readToday)
  const [bonus, setBonus] = useState(0)
  // The day's stars are paid once. The `today` state lost a race to a double
  // tap on "Read it out loud!" (both taps read made: 0, 5 stars twice), and a
  // page left open past midnight never paid the new day's.
  const paidFor = useRef<string | null>(null)

  // Words that arrive after the first render (a sync, a slow start) used to
  // leave the page on "learn more words" until it was opened again.
  useEffect(() => {
    if (picks.length < 3 && pool.length >= 3) setPicks(shuffle(pool).slice(0, 3))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pool])

  const sentence = picks.length === 3 ? fill(template, picks) : ''

  const reroll = (slot?: number) => {
    sfx.pop()
    if (slot === undefined) {
      setPicks(shuffle(pool).slice(0, 3))
      setTemplate(pickTemplate(template))
      return
    }
    const options = pool.filter((w) => !picks.some((p) => p.id === w.id))
    if (options.length === 0) {
      // Only three words so far: a tap that did nothing felt broken, so the
      // same words go into a new silly sentence instead.
      setTemplate(pickTemplate(template))
      return
    }
    const next = [...picks]
    next[slot] = options[Math.floor(Math.random() * options.length)]
    setPicks(next)
    speak(next[slot].word)
  }

  const readAloud = () => {
    if (!sentence) return
    speak(sentence, { rate: 0.85, pitch: 1.2 })
    sfx.correct()

    // The first sentence of each day earns a few stars — after that it is
    // its own reward. Read the day from storage, not from when the page opened.
    const now = readToday()
    if (now.made === 0 && paidFor.current !== now.date) {
      paidFor.current = now.date
      const next = { date: now.date, made: 1 }
      setToday(next)
      try { localStorage.setItem(STATE_KEY, JSON.stringify(next)) } catch { /* fine */ }
      addStars(SENTENCE_STARS)
      setBonus((n) => n + 1)
      speak(`${SENTENCE_STARS} stars for your silly sentence!`, { queue: true })
      window.dispatchEvent(new Event('show-confetti'))
    } else {
      setToday({ date: now.date, made: Math.max(now.made, today.made) + 1 })
    }
  }

  if (picks.length < 3) {
    return (
      <div className="sentence-page">
        <div className="sentence-header">
          <Button variant="secondary" size="small" onClick={() => navigate('/spelling')}>← Spelling</Button>
          <h1>✍️ Sentence Maker</h1>
        </div>
        <p className="sentence-intro">
          It takes three of YOUR words to build a sentence — go and meet
          a few more, then come back and build one! ✍️
        </p>
        <div className="sentence-actions">
          <Button variant="primary" icon="📖" onClick={() => navigate('/learn')}>
            Learn some words
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="sentence-page">
      <div className="sentence-header">
        <Button variant="secondary" size="small" onClick={() => navigate('/spelling')}>← Spelling</Button>
        <h1>✍️ Sentence Maker</h1>
        <Button variant="secondary" size="small" onClick={() => navigate('/collection')}>🗂️ My Words</Button>
      </div>

      <p className="sentence-intro">
        Three of YOUR words, one sentence — tap a word to swap it, then hear it read aloud! ✍️
      </p>

      <div className="sentence-picks">
        {picks.map((w, i) => (
          <button
            key={`${w.id}-${i}`}
            className={`sentence-chip s${i}`}
            onClick={() => reroll(i)}
            aria-label={`Swap ${w.word}`}
          >
            <span className="sentence-chip-word">{w.word}</span>
            <span className="sentence-chip-swap" aria-hidden>🔄</span>
          </button>
        ))}
      </div>

      <div className="sentence-stage pop-in" key={sentence}>
        <div className="sentence-mascot" aria-hidden>🐝</div>
        <p className="sentence-text" aria-label={sentence}>
          {pieces(template, picks).map((p, i) =>
            p.slot === undefined ? (
              <React.Fragment key={i}>{p.text}</React.Fragment>
            ) : (
              <mark key={i} className={`sentence-word s${p.slot}`}>{p.text}</mark>
            )
          )}
        </p>
      </div>

      {bonus > 0 && (
        <p className="sentence-flash" role="status">
          <Burst trigger={bonus} />
          🌟 +{SENTENCE_STARS} stars — what a silly sentence!
        </p>
      )}

      <div className="sentence-actions">
        <Button variant="primary" size="large" icon="🔊" onClick={readAloud}>
          Read it out loud!
        </Button>
        <Button variant="secondary" icon="🎲" onClick={() => reroll()}>
          All new words!
        </Button>
      </div>

      {today.made === 0 && bonus === 0 && (
        <p className="sentence-bonus">✨ Your first sentence of the day earns 5 stars!</p>
      )}
    </div>
  )
}

export default SentenceMaker
