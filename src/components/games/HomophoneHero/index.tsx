import React, { useMemo, useState } from 'react'
import { useAudio } from '../../../contexts/AudioContext'
import { shuffle } from '../shared/wordTricks'
import sfx from '../shared/sfx'
import './HomophoneHero.css'

interface HomophoneHeroProps {
  onComplete: (score: number) => void
  rounds?: number
}

interface Puzzle {
  /** the sentence, with ___ where the word goes */
  text: string
  options: string[]
  answer: string
  /** the memory hook — the actual teaching */
  why: string
}

/**
 * Words that sound identical and are spelled differently are the single most
 * common spelling mistake in English, and no amount of "sound it out" helps:
 * only meaning tells you which one to write.
 *
 * So every round ends with a memory hook ("hear has EAR in it"), because the
 * trick is what a child carries out of the game — the score isn't.
 */
const PUZZLES: Puzzle[] = [
  { text: 'I can ___ the birds singing.', options: ['hear', 'here'], answer: 'hear',
    why: '“Hear” has EAR in it — you hear with your ear! 👂' },
  { text: 'Come and sit over ___.', options: ['here', 'hear'], answer: 'here',
    why: '“Here” is a place, like t-HERE and w-HERE. 📍' },
  { text: '___ going to the park later.', options: ["They're", 'Their', 'There'], answer: "They're",
    why: '“They’re” is short for THEY ARE — the apostrophe is the missing A. ✂️' },
  { text: 'The children packed ___ bags.', options: ['their', 'there', "they're"], answer: 'their',
    why: '“Their” shows it belongs to them — it has HEIR in it, and an heir owns things. 👑' },
  { text: 'Put the box over ___.', options: ['there', 'their', "they're"], answer: 'there',
    why: '“There” is a place — it hides the word HERE inside it. 📍' },
  { text: 'This cake is ___ sweet for me.', options: ['too', 'to', 'two'], answer: 'too',
    why: '“Too” means extra — so it has an extra O! ➕' },
  { text: 'I have ___ hands.', options: ['two', 'too', 'to'], answer: 'two',
    why: '“Two” is the number — it starts like TWin and TWice. ✌️' },
  { text: '___ really good at spelling!', options: ["You're", 'Your'], answer: "You're",
    why: '“You’re” is short for YOU ARE. If you can say “you are”, use the apostrophe. ✂️' },
  { text: 'Is this ___ pencil?', options: ['your', "you're"], answer: 'your',
    why: '“Your” means it belongs to you — no apostrophe needed. ✏️' },
  { text: 'The dog wagged ___ tail.', options: ['its', "it's"], answer: 'its',
    why: '“Its” shows belonging, like HIS — and his has no apostrophe either. 🐶' },
  { text: '___ raining outside!', options: ["It's", 'Its'], answer: "It's",
    why: '“It’s” is short for IT IS. Try saying “it is” — if it fits, use the apostrophe. ☔' },
  { text: 'Please ___ your name at the top.', options: ['write', 'right'], answer: 'write',
    why: '“Write” starts with a silent W — you WRite with your Wrist. ✍️' },
  { text: 'You got the answer ___!', options: ['right', 'write'], answer: 'right',
    why: '“Right” means correct — or the opposite of left. 👉' },
  { text: 'We swam in the ___.', options: ['sea', 'see'], answer: 'sea',
    why: '“Sea” has water in it like bEAch and strEAm — all with EA. 🌊' },
  { text: 'I can ___ the mountain from here.', options: ['see', 'sea'], answer: 'see',
    why: '“See” uses your two eyes — and two Es! 👀' },
  { text: 'The wind ___ my hat away.', options: ['blew', 'blue'], answer: 'blew',
    why: '“Blew” is what the wind did — it rhymes with FLEW and GREW. 🌬️' },
  { text: 'The sky is bright ___.', options: ['blue', 'blew'], answer: 'blue',
    why: '“Blue” is the colour — like glUE and trUE, ending in UE. 🎨' },
  { text: 'A ___ lives in the woods.', options: ['bear', 'bare'], answer: 'bear',
    why: '“Bear” the animal has EAR in it — and bears have ears! 🐻' },
]

const HomophoneHero: React.FC<HomophoneHeroProps> = ({ onComplete, rounds = 6 }) => {
  const { speak } = useAudio()

  const puzzles = useMemo(() => shuffle(PUZZLES).slice(0, rounds), [rounds])

  const [index, setIndex] = useState(0)
  const [picked, setPicked] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [saved, setSaved] = useState(0)

  const puzzle = puzzles[index]
  const right = picked === puzzle?.answer

  if (!puzzle) {
    return (
      <div className="homophone-hero">
        <p className="hh-empty">No puzzles right now — try again in a moment! 🦸</p>
        <button className="hh-btn" onClick={() => onComplete(0)}>Back to Games</button>
      </div>
    )
  }

  const choose = (option: string) => {
    if (picked) return
    setPicked(option)

    const correct = option === puzzle.answer
    if (correct) {
      const nextStreak = streak + 1
      const points = 30 + (nextStreak >= 3 ? 20 : 0)
      setScore((s) => s + points)
      setStreak(nextStreak)
      setSaved((d) => d + 1)
      sfx.correct()
      speak(puzzle.text.replace('___', puzzle.answer))
    } else {
      setStreak(0)
      sfx.wrong()
      speak(`It's ${puzzle.answer}. ${puzzle.why}`)
    }

    // The hook stays on screen long enough to actually read it.
    setTimeout(() => {
      if (index < puzzles.length - 1) {
        setIndex((i) => i + 1)
        setPicked(null)
      } else {
        sfx.win()
        onComplete(score + (correct ? 30 + (streak + 1 >= 3 ? 20 : 0) : 0))
      }
    }, correct ? 2600 : 3400)
  }

  const [before, after] = puzzle.text.split('___')

  return (
    <div className="homophone-hero">
      <div className="hh-header">
        <div className="hh-title">🦸 Homophone Hero</div>
        <div className="hh-stats">
          <div className="hh-stat"><span>Round</span><strong>{index + 1}/{puzzles.length}</strong></div>
          <div className="hh-stat"><span>Score</span><strong>{score}</strong></div>
          <div className="hh-stat"><span>Saved</span><strong>🦸 {saved}</strong></div>
        </div>
      </div>

      <p className="hh-brief">These words sound the same. Only one is right here!</p>

      <div className="hh-sentence">
        <span>{before}</span>
        <span className={`hh-gap ${picked ? (right ? 'ok' : 'bad') : ''}`}>
          {picked ? puzzle.answer : '?????'}
        </span>
        <span>{after}</span>
        <button className="hh-speak" onClick={() => speak(puzzle.text.replace('___', puzzle.answer))} aria-label="Hear the sentence">🔊</button>
      </div>

      <div className="hh-options">
        {puzzle.options.map((o) => {
          let cls = 'hh-option'
          if (picked) {
            if (o === puzzle.answer) cls += ' right'
            else if (o === picked) cls += ' wrong'
            else cls += ' dim'
          }
          return (
            <button key={o} className={cls} onClick={() => choose(o)} disabled={!!picked}>
              {o}
            </button>
          )
        })}
      </div>

      {picked && (
        <div className={`hh-why ${right ? 'ok' : 'bad'}`}>
          <span className="hh-why-label">{right ? '🎉 Yes! Remember:' : '💡 Here’s the trick:'}</span>
          <span className="hh-why-text">{puzzle.why}</span>
        </div>
      )}
    </div>
  )
}

export default HomophoneHero
