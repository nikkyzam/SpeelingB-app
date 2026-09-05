import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAudio } from '../../contexts/AudioContext'
import { useProgress } from '../../contexts/ProgressContext'
import { useRewardStore } from '../../stores/rewards/useRewardStore'
import { wordBank, Word } from '../../services/wordBank'
import sfx from '../../components/games/shared/sfx'
import Button from '../../components/common/Button'
import './SillySentences.css'

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
 * The Silly Sentence Maker — pick three of your own words and the app builds
 * something ridiculous out of them. Seeing "elephant", "danced" and "pizza"
 * turn into a joke is what makes a child *own* a word.
 */
const SillySentences: React.FC = () => {
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

  const shuffle = (arr: Word[]) => [...arr].sort(() => Math.random() - 0.5)

  const [picks, setPicks] = useState<Word[]>(() => shuffle(pool).slice(0, 3))
  const [template, setTemplate] = useState(() => TEMPLATES[Math.floor(Math.random() * TEMPLATES.length)])
  const [today, setToday] = useState(readToday)

  const sentence = picks.length === 3 ? fill(template, picks) : ''

  const reroll = (slot?: number) => {
    sfx.pop()
    if (slot === undefined) {
      setPicks(shuffle(pool).slice(0, 3))
      setTemplate(TEMPLATES[Math.floor(Math.random() * TEMPLATES.length)])
    } else {
      const options = pool.filter((w) => !picks.some((p) => p.id === w.id))
      if (options.length === 0) return
      const next = [...picks]
      next[slot] = options[Math.floor(Math.random() * options.length)]
      setPicks(next)
    }
  }

  const readAloud = () => {
    if (!sentence) return
    speak(sentence, { rate: 0.85, pitch: 1.2 })
    sfx.correct()

    // The first silly sentence of each day earns a few stars — after that
    // it's just for giggles, which is reward enough.
    if (today.made === 0) {
      const next = { date: today.date, made: 1 }
      setToday(next)
      try { localStorage.setItem(STATE_KEY, JSON.stringify(next)) } catch { /* fine */ }
      addStars(5)
      window.dispatchEvent(new Event('show-confetti'))
    } else {
      setToday({ ...today, made: today.made + 1 })
    }
  }

  if (picks.length < 3) {
    return (
      <div className="silly-page">
        <div className="silly-header">
          <Button variant="secondary" size="small" onClick={() => navigate('/')}>← Home</Button>
          <h1>🃏 Silly Sentence Maker</h1>
        </div>
        <p className="silly-intro">
          The jester needs three of YOUR words to build a sentence — go and meet
          a few more, then come back for the silliness! 🤪
        </p>
        <div className="silly-actions">
          <Button variant="primary" icon="📖" onClick={() => navigate('/learn')}>
            Learn some words
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="silly-page">
      <div className="silly-header">
        <Button variant="secondary" size="small" onClick={() => navigate('/')}>← Home</Button>
        <h1>🃏 Silly Sentence Maker</h1>
        <Button variant="secondary" size="small" onClick={() => navigate('/collection')}>🗂️ My Words</Button>
      </div>

      <p className="silly-intro">
        Three of YOUR words walk into a sentence… tap a word to swap it, then hear the madness! 🤪
      </p>

      <div className="silly-picks">
        {picks.map((w, i) => (
          <button key={`${w.id}-${i}`} className="silly-chip" onClick={() => reroll(i)}>
            <span className="silly-chip-word">{w.word}</span>
            <span className="silly-chip-swap" aria-hidden>🔄</span>
          </button>
        ))}
      </div>

      <div className="silly-stage pop-in" key={sentence}>
        <div className="silly-jester" aria-hidden>🤡</div>
        <p className="silly-sentence">{sentence}</p>
      </div>

      <div className="silly-actions">
        <Button variant="primary" size="large" icon="🔊" onClick={readAloud}>
          Read it out loud!
        </Button>
        <Button variant="secondary" icon="🎲" onClick={() => reroll()}>
          All new words!
        </Button>
      </div>

      {today.made === 0 && (
        <p className="silly-bonus">✨ Your first silly sentence of the day earns 5 stars!</p>
      )}
    </div>
  )
}

export default SillySentences
