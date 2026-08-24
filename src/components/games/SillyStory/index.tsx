import React, { useEffect, useMemo, useRef, useState } from 'react'
import { wordBank, Word } from '../../../services/wordBank'
import { useAudio } from '../../../contexts/AudioContext'
import { shuffle, isPlayable } from '../shared/wordTricks'
import sfx from '../shared/sfx'
import './SillyStory.css'

interface SillyStoryProps {
  onComplete: (score: number) => void
  words?: Word[]
}

interface Template {
  title: string
  emoji: string
  /** story text split around the blanks: parts.length === blanks + 1 */
  parts: string[]
  prompts: string[]
}

const TEMPLATES: Template[] = [
  {
    title: 'The Day at School',
    emoji: '🏫',
    parts: [
      'One sunny morning a giant ',
      ' walked into our classroom. It sat on the teacher’s ',
      ' and asked for ',
      ' with extra sprinkles. Everyone shouted “',
      '!” and that is why we always keep snacks in the fridge.',
    ],
    prompts: ['Something HUGE', 'Something silly to sit on', 'A tasty treat', 'A word to shout'],
  },
  {
    title: 'Space Picnic',
    emoji: '🚀',
    parts: [
      'My rocket landed on a planet made entirely of ',
      '. A friendly alien offered me a ',
      ' sandwich and we danced around a ',
      '. Before I flew home it whispered, “Remember the ',
      '!” — and I still do.',
    ],
    prompts: ['A planet flavour', 'A sandwich filling', 'Something to dance around', 'A secret word'],
  },
  {
    title: 'The Grumpy Dragon',
    emoji: '🐲',
    parts: [
      'Deep in a cave lived a dragon who was scared of ',
      '. Every night it hid under a big ',
      ' and hummed a song about ',
      '. One day a brave kid gave it a ',
      ' — and the dragon smiled for the very first time.',
    ],
    prompts: ['Something scary (or not!)', 'Something to hide under', 'A song about…', 'A kind gift'],
  },
  {
    title: 'Underwater Surprise',
    emoji: '🐙',
    parts: [
      'I dove into the sea and found a city built from ',
      '. An octopus wearing a ',
      ' was juggling ',
      '. “Welcome!” it bubbled, “today we celebrate the festival of ',
      '.” Best swim ever.',
    ],
    prompts: ['A building material', 'Octopus fashion', 'Something to juggle', 'A festival name'],
  },
]

type Phase = 'filling' | 'story' | 'bonus' | 'done'

/**
 * A fill-in-the-blanks story machine.
 *
 * Nothing here can be "wrong" — every choice makes a story worth reading out
 * loud. Kids who freeze at a spelling test will happily read their own silly
 * story five times, and each reading is five more looks at the word.
 */
const SillyStory: React.FC<SillyStoryProps> = ({ onComplete, words: providedWords }) => {
  const { speak } = useAudio()

  const template = useMemo(() => TEMPLATES[Math.floor(Math.random() * TEMPLATES.length)], [])
  const blanks = template.parts.length - 1

  const pool = useMemo<string[]>(() => {
    const base = providedWords && providedWords.length > 0 ? providedWords : wordBank.getRandomWords(40)
    const usable = shuffle(base).filter((w) => isPlayable(w)).map((w) => w.word.toLowerCase())
    const unique = [...new Set(usable)]
    if (unique.length >= blanks * 3) return unique
    const extra = wordBank.getRandomWords(60).filter((w) => isPlayable(w)).map((w) => w.word.toLowerCase())
    return [...new Set([...unique, ...extra])]
  }, [providedWords, blanks])

  const [filled, setFilled] = useState<string[]>([])
  const [phase, setPhase] = useState<Phase>('filling')
  const [score, setScore] = useState(0)
  const [spellInput, setSpellInput] = useState('')
  const [bonusResult, setBonusResult] = useState<'right' | 'wrong' | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Three fresh choices for whichever blank we're on.
  const choices = useMemo(() => {
    const unused = pool.filter((w) => !filled.includes(w))
    return shuffle(unused.length >= 3 ? unused : pool).slice(0, 3)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filled.length, pool])

  const bonusWord = filled[0] || ''

  const storyText = useMemo(
    () => template.parts.reduce((out, part, i) => out + part + (filled[i] ? filled[i] : ''), ''),
    [template, filled]
  )

  useEffect(() => {
    if (phase === 'story') speak(storyText)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  if (pool.length === 0) {
    return (
      <div className="silly-story">
        <p className="ss-empty">No words for the story yet — learn a few first! 📜</p>
        <button className="ss-btn" onClick={() => onComplete(0)}>Back to Games</button>
      </div>
    )
  }

  const pick = (word: string) => {
    if (phase !== 'filling') return
    const next = [...filled, word]
    setFilled(next)
    setScore((s) => s + 20)
    sfx.star()
    speak(word)
    if (next.length >= blanks) setTimeout(() => setPhase('story'), 500)
  }

  const checkBonus = () => {
    if (!spellInput.trim()) return
    if (spellInput.trim().toLowerCase() === bonusWord) {
      setBonusResult('right')
      setScore((s) => s + 50)
      sfx.win()
      speak('Bonus stars!')
      setTimeout(() => onComplete(score + 50), 1900)
    } else {
      setBonusResult('wrong')
      sfx.wrong()
      speak(`It was ${bonusWord}`)
      setTimeout(() => onComplete(score), 2100)
    }
    setPhase('done')
  }

  return (
    <div className="silly-story">
      <div className="ss-header">
        <div className="ss-title">📜 Silly Story</div>
        <div className="ss-stats">
          <div className="ss-stat"><span>Blank</span><strong>{Math.min(filled.length + 1, blanks)}/{blanks}</strong></div>
          <div className="ss-stat"><span>Score</span><strong>{score}</strong></div>
        </div>
      </div>

      <div className="ss-book">
        <h3 className="ss-book-title">{template.emoji} {template.title}</h3>
        <p className="ss-text">
          {template.parts.map((part, i) => (
            <React.Fragment key={i}>
              {part}
              {i < blanks && (
                filled[i]
                  ? <span className="ss-word">{filled[i]}</span>
                  : <span className={`ss-blank ${i === filled.length ? 'active' : ''}`}>_____</span>
              )}
            </React.Fragment>
          ))}
        </p>
      </div>

      {phase === 'filling' && (
        <>
          <p className="ss-prompt">Pick a word: <strong>{template.prompts[filled.length]}</strong></p>
          <div className="ss-choices">
            {choices.map((c) => (
              <button key={c} className="ss-choice" onClick={() => pick(c)}>{c}</button>
            ))}
          </div>
        </>
      )}

      {phase === 'story' && (
        <div className="ss-finale">
          <div className="ss-cheer">🎉 What a story! Read it out loud!</div>
          <div className="ss-finale-actions">
            <button className="ss-btn ghost" onClick={() => speak(storyText)}>🔊 Tell it again</button>
            <button
              className="ss-btn"
              onClick={() => {
                setPhase('bonus')
                speak(bonusWord)
                setTimeout(() => inputRef.current?.focus(), 100)
              }}
            >
              ⭐ Bonus round!
            </button>
          </div>
        </div>
      )}

      {(phase === 'bonus' || phase === 'done') && (
        <div className="ss-bonus">
          <p className="ss-prompt">Spell the first word from your story for 50 bonus points!</p>
          <div className="ss-bonus-row">
            <button className="ss-btn ghost" onClick={() => speak(bonusWord)} aria-label="Hear the word">🔊</button>
            <input
              ref={inputRef}
              className={`ss-input ${bonusResult === 'right' ? 'ok' : bonusResult === 'wrong' ? 'bad' : ''}`}
              value={spellInput}
              onChange={(e) => setSpellInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && checkBonus()}
              placeholder="Spell it..."
              disabled={phase === 'done'}
            />
            <button className="ss-btn" onClick={checkBonus} disabled={phase === 'done' || !spellInput.trim()}>Check</button>
          </div>
          {bonusResult === 'right' && <div className="ss-flash ok">⭐ Bonus stars! Perfect spelling!</div>}
          {bonusResult === 'wrong' && <div className="ss-flash bad">It was “{bonusWord}” — great story though! 📚</div>}
        </div>
      )}
    </div>
  )
}

export default SillyStory
