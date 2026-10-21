import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useAudio } from '../../../contexts/AudioContext'
import { shuffle } from '../shared/wordTricks'
import useCheer from '../shared/useCheer'
import useLater from '../shared/useLater'
import Burst from '../shared/Burst'
import GameEmpty from '../shared/GameEmpty'
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
export const PUZZLES: Puzzle[] = [
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

/** The sentence as it should be read, with the right word in the gap. */
const sentenceOf = (p: Puzzle) => p.text.replace('___', p.answer)

/**
 * Deal the round: a few puzzles, each with its buttons in a fresh order. The
 * answer is listed first in every puzzle above, so showing them as written
 * meant tapping the first button always won.
 */
export const dealPuzzles = (rounds: number): Puzzle[] =>
  shuffle(PUZZLES)
    .slice(0, rounds)
    .map((p) => ({ ...p, options: shuffle(p.options) }))

const HomophoneHero: React.FC<HomophoneHeroProps> = ({ onComplete, rounds = 6 }) => {
  const { speak } = useAudio()
  const cheer = useCheer()
  const later = useLater()

  const puzzles = useMemo(() => dealPuzzles(rounds), [rounds])

  const [index, setIndex] = useState(0)
  const [picked, setPicked] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [saved, setSaved] = useState(0)
  const [line, setLine] = useState('')
  const [hits, setHits] = useState(0)

  // A state guard loses to a fast double tap (both taps read the old value),
  // which scored twice and skipped a puzzle. A ref settles at once.
  const locked = useRef(false)

  const puzzle = puzzles[index]
  const right = picked === puzzle?.answer

  // Read the sentence out each round: the two words sound the same, so
  // hearing it gives nothing away, and a child still learning to read can
  // follow along. Queued, so the last round's memory hook is never cut off.
  useEffect(() => {
    if (!puzzle) return
    locked.current = false
    speak(sentenceOf(puzzle), { queue: index > 0 })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, puzzles])

  if (!puzzle) {
    return (
      <div className="homophone-hero">
        <GameEmpty icon="🦸">No puzzles right now — try again in a moment!</GameEmpty>
      </div>
    )
  }

  const choose = (option: string) => {
    if (locked.current) return
    locked.current = true
    setPicked(option)

    const correct = option === puzzle.answer
    let gained = 0
    if (correct) {
      const run = streak + 1
      gained = 30 + (run >= 3 ? 20 : 0)
      setScore((s) => s + gained)
      setStreak(run)
      setSaved((d) => d + 1)
      setHits((h) => h + 1)
      setLine(cheer.hit({ say: sentenceOf(puzzle) }))
    } else {
      setStreak(0)
      // The trick is the teaching, so a miss says it out loud.
      setLine(cheer.miss({ say: `It's ${puzzle.answer}. ${puzzle.why}` }))
    }

    // The hook stays on screen long enough to actually read it.
    later(() => {
      if (index < puzzles.length - 1) {
        // Cleared in the same update, so the next puzzle never shows this answer.
        setPicked(null)
        setIndex((i) => i + 1)
      } else {
        onComplete(score + gained)
      }
    }, correct ? 2600 : 4000)
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

      <p className="hh-brief">
        These words sound the same. Which one fits?
        {streak >= 2 && <span className="hh-streak" aria-label={`${streak} in a row`}> 🔥 {streak} in a row</span>}
      </p>

      <div className="hh-sentence">
        <span>{before}</span>
        <span className={`hh-gap ${picked ? (right ? 'ok' : 'bad') : ''}`}>
          {picked ? puzzle.answer : '?????'}
        </span>
        <span>{after}</span>
        <button className="hh-speak" onClick={() => speak(sentenceOf(puzzle))} aria-label="Hear the sentence">🔊</button>
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
        <div className={`hh-why ${right ? 'ok' : 'bad'}`} role="status">
          {right && <Burst trigger={hits} />}
          <span className="hh-why-label">{right ? `🎉 ${line} Remember:` : `💡 ${line} Here’s the trick:`}</span>
          <span className="hh-why-text">{puzzle.why}</span>
        </div>
      )}
    </div>
  )
}

export default HomophoneHero
