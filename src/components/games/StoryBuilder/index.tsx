import React, { useEffect, useMemo, useRef, useState } from 'react'
import SpellingInput from '../../common/SpellingInput'
import type { Word } from '../../../services/wordBank'
import { useAudio } from '../../../contexts/AudioContext'
import { shuffle, isPlayable } from '../shared/wordTricks'
import { spellOut } from '../../../services/words/praise'
import useCheer from '../shared/useCheer'
import useLater from '../shared/useLater'
import Burst from '../shared/Burst'
import GameEmpty from '../shared/GameEmpty'
import sfx from '../shared/sfx'
import './StoryBuilder.css'

interface StoryBuilderProps {
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
    prompts: ['Something HUGE', 'Something to sit on', 'A tasty treat', 'A word to shout'],
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

/** Points for each word put in the story, and for spelling the star word at the end. */
const PER_BLANK = 20
const BONUS = 50

/**
 * A fill-in-the-blanks story machine.
 *
 * Nothing here can be "wrong" — every choice makes a story worth reading out
 * loud. Kids who freeze at a spelling test will happily read their own
 * story five times, and each reading is five more looks at the word.
 */
const StoryBuilder: React.FC<StoryBuilderProps> = ({ onComplete, words: providedWords }) => {
  const { speak } = useAudio()
  const cheer = useCheer()
  const later = useLater()

  const template = useMemo(() => TEMPLATES[Math.floor(Math.random() * TEMPLATES.length)], [])
  const blanks = template.parts.length - 1

  const pool = useMemo<string[]>(() => {
    const base = providedWords && providedWords.length > 0 ? providedWords : []
    const usable = shuffle(base).filter((w) => isPlayable(w)).map((w) => w.word.toLowerCase())
    // The story is theirs because *their* words are in it.
    return [...new Set(usable)]
  }, [providedWords])

  const [filled, setFilled] = useState<string[]>([])
  const [phase, setPhase] = useState<Phase>('filling')
  const [score, setScore] = useState(0)
  const [spellInput, setSpellInput] = useState('')
  const [bonusResult, setBonusResult] = useState<'right' | 'wrong' | null>(null)
  const [line, setLine] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  // Taps and Enter settle through refs. A state guard loses to a double tap:
  // Enter twice paid the bonus twice and started two finishing timers, and a
  // double tap on a choice filled two blanks with one word.
  const picks = useRef<string[]>([])
  const pickLocked = useRef(false)
  const settled = useRef(false)
  useEffect(() => {
    pickLocked.current = false
  }, [filled.length])

  // Three fresh choices for whichever blank we're on.
  const choices = useMemo(() => {
    const unused = pool.filter((w) => !filled.includes(w))
    return shuffle(unused.length >= 3 ? unused : pool).slice(0, 3)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filled.length, pool])

  const bonusWord = filled[0] || ''
  // While the star word is being spelled it is hidden from the story —
  // otherwise "spell the first word" is copying it off the page.
  const hideBonus = phase === 'bonus'

  const storyText = useMemo(
    () => template.parts.reduce((out, part, i) => out + part + (filled[i] ? filled[i] : ''), ''),
    [template, filled]
  )

  useEffect(() => {
    if (phase === 'story') speak(storyText)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  // Said once at the start, for a child who can't read the instructions yet.
  useEffect(() => {
    if (pool.length > 0) speak(`Let's make a silly story! Pick a word: ${template.prompts[0]}.`)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (pool.length === 0) {
    return (
      <div className="story-builder">
        <GameEmpty icon="📜">No words for the story yet — learn a few first, then come back and write one!</GameEmpty>
      </div>
    )
  }

  const pick = (word: string) => {
    if (phase !== 'filling' || pickLocked.current || picks.current.length >= blanks) return
    pickLocked.current = true
    picks.current = [...picks.current, word]
    setFilled(picks.current)
    setScore((s) => s + PER_BLANK)
    sfx.star()
    speak(word)
    if (picks.current.length >= blanks) later(() => setPhase('story'), 600)
  }

  const startBonus = () => {
    if (phase !== 'story') return
    setPhase('bonus')
    speak(`Can you spell ${bonusWord}? ${bonusWord}.`)
    later(() => inputRef.current?.focus(), 100)
  }

  const checkBonus = () => {
    const tried = spellInput.trim().toLowerCase()
    if (!tried || settled.current || phase !== 'bonus') return
    settled.current = true
    const total = picks.current.length * PER_BLANK
    if (tried === bonusWord) {
      setBonusResult('right')
      setScore((s) => s + BONUS)
      setLine(cheer.hit({ say: 'Bonus stars!' }))
      sfx.win()
      later(() => onComplete(total + BONUS), 1900)
    } else {
      setBonusResult('wrong')
      setLine(cheer.miss({ say: `It's spelled ${spellOut(bonusWord)}. ${bonusWord}.` }))
      later(() => onComplete(total), 2600)
    }
    setPhase('done')
  }

  return (
    <div className="story-builder">
      <div className="ss-header">
        <div className="ss-title">📜 Story Builder</div>
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
                  ? hideBonus && filled[i] === bonusWord
                    ? <span className="ss-word secret" aria-label="the star word, hidden">⭐ ? ⭐</span>
                    : <span className="ss-word">{filled[i]}</span>
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
            <button className="ss-btn" onClick={startBonus}>
              Finish ⭐
            </button>
          </div>
        </div>
      )}

      {(phase === 'bonus' || phase === 'done') && (
        <div className="ss-bonus">
          <p className="ss-prompt">Last step! Spell the ⭐ word from your story for {BONUS} bonus points.</p>
          <div className="ss-bonus-row">
            <button className="ss-btn ghost" onClick={() => speak(bonusWord)} aria-label="Hear the word">🔊</button>
            <SpellingInput
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
          {bonusResult === 'right' && (
            <div className="ss-flash ok" role="status">
              <Burst trigger={1} />
              ⭐ {line} Perfect spelling!
            </div>
          )}
          {bonusResult === 'wrong' && (
            <div className="ss-flash bad" role="status">
              {line} It was “{bonusWord}” — great story though! 📚
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default StoryBuilder
