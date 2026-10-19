import React, { useEffect, useMemo, useRef, useState } from 'react'
import type { Word } from '../../../services/wordBank'
import { useAudio } from '../../../contexts/AudioContext'
import { shuffle, rhymes, rimeOf, RHYME_FAMILIES, isPlayable } from '../shared/wordTricks'
import { countBeats } from '../../../services/words/wordShape'
import useCheer from '../shared/useCheer'
import useLater from '../shared/useLater'
import Burst from '../shared/Burst'
import GameEmpty from '../shared/GameEmpty'
import './RhymeTime.css'

interface RhymeTimeProps {
  onComplete: (score: number) => void
  words?: Word[]
  rounds?: number
}

interface Round {
  target: string
  correct: string
  choices: string[]
}

const FAMILY_WORDS = RHYME_FAMILIES.flat()

/**
 * Words whose spelling lies about their sound — "one" looks like "bone",
 * "have" like "cave", "put" like "but" — so a spelling match proves nothing.
 */
const SOUNDS_ODD = new Set([
  'one', 'done', 'gone', 'none', 'have', 'give', 'live', 'love', 'dove', 'glove', 'shove', 'above',
  'come', 'some', 'move', 'prove', 'lose', 'whose', 'said', 'says', 'were', 'where', 'there', 'here',
  'put', 'push', 'bush', 'pull', 'bull', 'full', 'blood', 'flood', 'front', 'wolf', 'word', 'work',
  'worm', 'world', 'sword', 'bear', 'pear', 'wear', 'swear', 'great', 'break', 'steak', 'sweat',
  'threat', 'head', 'bread', 'dead', 'heart', 'earth', 'learn', 'eye', 'sew', 'wind', 'pint', 'both',
])
/** Endings said two ways: d-own/gr-own, b-ead/h-ead, m-ost/c-ost, h-ere/th-ere… */
const AMBIGUOUS_RIME = /^(ow|own|ead|ear|eak|ough|ood|ove|ome|one|ost|ere|ould|ow[ln])$/

/**
 * A pair we can trust to rhyme. Rhymes are matched by spelling, which only
 * tracks sound reliably in one-beat words: "favorite" ends like "kite" but
 * doesn't rhyme with it. So the word asked about is one beat, neither word
 * is a known liar, and their shared ending isn't one said two ways.
 */
export const trueRhyme = (target: string, partner: string): boolean =>
  countBeats(target) === 1 &&
  countBeats(partner) === 1 &&
  !SOUNDS_ODD.has(target) &&
  !SOUNDS_ODD.has(partner) &&
  !AMBIGUOUS_RIME.test(rimeOf(target)) &&
  rhymes(partner, target)

/**
 * Two tempting wrong answers that definitely do NOT rhyme with the target.
 *
 * The rime check alone wasn't enough: the families rhyme by sound, not
 * spelling — bee and sea, kite and night, sun and one — so "sea" could be
 * offered as the wrong answer to "bee". A decoy may not come from the family
 * of the target or the answer, nor share a rime with any word in it.
 */
export const pickDecoys = (target: string, correct: string, extra: string[]): string[] => {
  const kin = RHYME_FAMILIES.filter((row) => row.includes(target) || row.includes(correct)).flat()
  const banned = new Set([target, correct, ...kin])
  const bannedRimes = new Set([...banned].map(rimeOf))
  return shuffle([...FAMILY_WORDS, ...extra])
    .filter((w) => !banned.has(w) && !bannedRimes.has(rimeOf(w)) && !rhymes(w, target) && !rhymes(w, correct))
    .filter((w, i, arr) => arr.indexOf(w) === i)
    .slice(0, 2)
}

/** "cat: dog, hat or sun?" — the choices read out, for a child still learning to read them. */
export const sayChoices = (choices: string[]): string =>
  choices.length > 1 ? `${choices.slice(0, -1).join(', ')}, or ${choices[choices.length - 1]}?` : `${choices[0] ?? ''}?`

/**
 * Hearing that "cake" and "snake" end the same way is the doorway to sounding
 * words out. This is the ear-training game: no spelling, just listening.
 */
const RhymeTime: React.FC<RhymeTimeProps> = ({ onComplete, words: providedWords, rounds = 6 }) => {
  const { speak } = useAudio()
  const cheer = useCheer()
  const later = useLater()

  const gameRounds = useMemo<Round[]>(() => {
    const pool = [
      ...new Set(
        (providedWords && providedWords.length > 0 ? providedWords : [])
          .filter((w) => isPlayable(w))
          .map((w) => w.word.toLowerCase())
      ),
    ]
    const built: Round[] = []

    // First choice: the child's own words, when one of them actually rhymes
    // with something familiar. Their words should show up in their games.
    shuffle(pool).forEach((target) => {
      if (built.length >= rounds) return
      const partner = shuffle([...FAMILY_WORDS, ...pool]).find((w) => trueRhyme(target, w))
      if (!partner) return
      const choices = shuffle([partner, ...pickDecoys(target, partner, pool)])
      if (choices.length === 3) built.push({ target, correct: partner, choices })
    })

    // The rhyme families supply partners and decoys, but never the target:
    // the word a child is asked about is always one of their own.
    return built.slice(0, rounds)
  }, [providedWords, rounds])

  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [picked, setPicked] = useState<string | null>(null)
  const [cheerLine, setCheerLine] = useState('')
  const [hits, setHits] = useState(0)
  const locked = useRef(false)

  const current = gameRounds[index]

  /** The question, then the three choices queued after it so neither is cut off. */
  const ask = (round: Round) => {
    // Queued too: the last round's "Nearly! It was…" mustn't be cut off.
    speak(`Which word rhymes with ${round.target}?`, { queue: true })
    speak(sayChoices(round.choices), { queue: true })
  }

  useEffect(() => {
    if (!current) return
    setPicked(null)
    locked.current = false
    ask(current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, gameRounds])

  if (!current) {
    return (
      <div className="rhyme-time">
        <GameEmpty icon="🎤">
          None of your words has a rhyming buddy yet — learn some more words, then come back and rhyme!
        </GameEmpty>
      </div>
    )
  }

  const choose = (choice: string) => {
    if (locked.current) return
    locked.current = true
    setPicked(choice)

    const right = choice === current.correct
    let points = 0
    if (right) {
      const nextStreak = streak + 1
      points = 25 + (nextStreak >= 3 ? 15 : 0)
      setScore((s) => s + points)
      setStreak(nextStreak)
      setHits((h) => h + 1)
      setCheerLine(cheer.hit({ say: `${current.target}, ${choice}. They rhyme!` }))
    } else {
      setStreak(0)
      setCheerLine(cheer.miss({ say: `${current.target} rhymes with ${current.correct}. ${current.target}, ${current.correct}.` }))
    }

    later(() => {
      if (index < gameRounds.length - 1) {
        setPicked(null)
        setIndex((i) => i + 1)
      } else {
        onComplete(score + points)
      }
    }, right ? 2000 : 2800)
  }

  const right = picked === current.correct

  return (
    <div className="rhyme-time">
      <div className="rt-header">
        <div className="rt-title">🎤 Rhyme Time</div>
        <div className="rt-stats">
          <div className="rt-stat"><span>Round</span><strong>{index + 1}/{gameRounds.length}</strong></div>
          <div className="rt-stat"><span>Score</span><strong>{score}</strong></div>
          <div className="rt-stat"><span>Streak</span><strong>🔥 {streak}</strong></div>
        </div>
      </div>

      <div className="rt-stage">
        <span className="rt-note n1" aria-hidden>🎵</span>
        <span className="rt-note n2" aria-hidden>🎶</span>
        <div className="rt-mic" aria-hidden>🎤</div>
        <p className="rt-question">What rhymes with…</p>
        <button className="rt-target" onClick={() => speak(current.target)}>
          {current.target}
          <span className="rt-target-speak" aria-hidden>🔊</span>
        </button>
        <div>
          <button className="rt-again" onClick={() => ask(current)} aria-label="Hear the question and choices again">
            🔊 Hear it again
          </button>
        </div>
      </div>

      <div className="rt-choices">
        {current.choices.map((c) => {
          const isRight = c === current.correct
          let cls = 'rt-choice'
          if (picked) {
            if (isRight) cls += ' right'
            else if (c === picked) cls += ' wrong'
            else cls += ' dim'
          }
          return (
            <button key={c} className={cls} onClick={() => choose(c)} disabled={!!picked}>
              {c}
            </button>
          )
        })}
      </div>

      {picked && (
        <div className={`rt-flash ${right ? 'ok' : 'bad'}`}>
          {right && <Burst trigger={hits} />}
          {right
            ? `🎉 ${cheerLine} “${current.target}” and “${current.correct}” rhyme!`
            : `${cheerLine} “${current.target}” rhymes with “${current.correct}” — ${current.target}, ${current.correct}! 🎵`}
        </div>
      )}
    </div>
  )
}

export default RhymeTime
