import React, { useEffect, useMemo, useRef, useState } from 'react'
import type { Word } from '../../../services/wordBank'
import { useAudio } from '../../../contexts/AudioContext'
import { shuffle, isPlayable } from '../shared/wordTricks'
import { maskClue } from '../shared/clues'
import { spellOut } from '../../../services/words/praise'
import useCheer from '../shared/useCheer'
import useLater from '../shared/useLater'
import Burst from '../shared/Burst'
import GameEmpty from '../shared/GameEmpty'
import SpellingInput from '../../common/SpellingInput'
import './SpellingAdventure.css'

interface SpellingAdventureProps {
  onComplete: (score: number) => void
  words?: Word[]
  rounds?: number
}

type Kind = 'missing' | 'jumble' | 'hear'

/** The three places on the map, easiest first. */
export const PLACES: { name: string; icon: string; kind: Kind; ask: string }[] = [
  { name: 'Forest Path', icon: '🌲', kind: 'missing', ask: 'Some letters fell off the signpost — spell the whole word!' },
  { name: 'Mountain Pass', icon: '⛰️', kind: 'jumble', ask: 'A rockslide jumbled the letters — spell the word!' },
  { name: 'Dragon Cave', icon: '🐉', kind: 'hear', ask: 'Spell the word you hear to sing the dragon to sleep!' },
]

/** Which place word `i` of `n` belongs to: the map is split in three. */
export const placeOf = (i: number, n: number): number => Math.min(PLACES.length - 1, Math.floor((i * PLACES.length) / n))

interface Challenge {
  word: Word
  answer: string
  place: number
  kind: Kind
  /** What the child sees: a letter, or '' for a blank. */
  shown: string[]
}

const jumble = (w: string): string[] => {
  for (let t = 0; t < 20; t++) {
    const s = shuffle([...w])
    if (s.join('') !== w) return s
  }
  return [...w.slice(1), w[0]]
}

/** About a third of the letters hidden — at least one, never all of them. */
const withGaps = (w: string): string[] => {
  const hide = new Set(shuffle([...w].map((_, i) => i)).slice(0, Math.max(1, Math.round(w.length / 3))))
  return [...w].map((c, i) => (hide.has(i) ? '' : c))
}

const makeChallenge = (word: Word, i: number, n: number): Challenge => {
  const answer = word.word.toLowerCase()
  const place = placeOf(i, n)
  let kind = PLACES[place].kind
  // A word like "aaa" can't be jumbled; give it gaps instead.
  if (kind === 'jumble' && new Set(answer).size < 2) kind = 'missing'
  const shown = kind === 'missing' ? withGaps(answer) : kind === 'jumble' ? jumble(answer) : [...answer].map(() => '')
  return { word, answer, place, kind, shown }
}

/**
 * Spelling Adventure — one trip across the map: the Forest Path, the Mountain
 * Pass and the Dragon Cave, a couple of the child's words in each.
 *
 * Every word is spoken. There are no lives and no clock (three misses used to
 * end the whole game, and a clock running out moved you on, so idling won). A
 * wrong answer gets one more go; then the word is shown and spelled out, and
 * the adventure carries on.
 */
const SpellingAdventure: React.FC<SpellingAdventureProps> = ({ onComplete, words: providedWords, rounds = 7 }) => {
  const { speak } = useAudio()
  const cheer = useCheer()
  const later = useLater()

  const challenges = useMemo<Challenge[]>(() => {
    const picked = shuffle(providedWords ?? []).filter((w) => isPlayable(w, 3)).slice(0, rounds)
    return picked.map((w, i) => makeChallenge(w, i, picked.length))
  }, [providedWords, rounds])

  const [index, setIndex] = useState(0)
  const [input, setInput] = useState('')
  const [tries, setTries] = useState(0)
  const [flash, setFlash] = useState<'ok' | 'again' | 'shown' | null>(null)
  const [line, setLine] = useState('')
  const [shake, setShake] = useState(false)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [hits, setHits] = useState(0)
  const [sleepy, setSleepy] = useState(0)
  // One answer per challenge: a second Enter during the feedback used to score
  // the same word again.
  const settling = useRef(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const current = challenges[index]

  useEffect(() => {
    if (!current) return
    setInput('')
    setTries(0)
    setFlash(null)
    settling.current = false
    speak(current.word.word)
    inputRef.current?.focus()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, challenges])

  if (!current) {
    return (
      <div className="spelling-adventure">
        <GameEmpty icon="🗺️">No words for the adventure yet — learn a few, then come back and explore!</GameEmpty>
      </div>
    )
  }

  const { answer, word, place } = current
  const settled = flash === 'ok' || flash === 'shown'
  const isLast = index === challenges.length - 1
  const nextPlace = isLast ? null : challenges[index + 1].place
  const crossing = nextPlace !== null && nextPlace !== place
  const clue = word.meaning ? maskClue(word.meaning, word.word) : ''

  const advance = (gained: number, ms: number) => {
    if (crossing && nextPlace !== null) {
      speak(`On to the ${PLACES[nextPlace].name}!`, { queue: true })
    }
    later(() => {
      if (!isLast) {
        // Clear the last word's verdict in the same step that moves on: left to
        // the effect, one frame could show the new word's answer under the old flash.
        setInput('')
        setTries(0)
        setFlash(null)
        setIndex((i) => i + 1)
      } else onComplete(score + gained)
    }, ms)
  }

  const submit = () => {
    if (settling.current || settled) return
    const typed = input.trim().toLowerCase()
    if (!typed) return
    settling.current = true

    if (typed === answer) {
      const cave = PLACES[place].kind === 'hear'
      const gained = (tries === 0 ? 40 : 20) + (cave ? 10 : 0)
      setScore((s) => s + gained)
      if (cave) setSleepy((z) => z + 1)
      setFlash('ok')
      setLine(cheer.hit({ say: word.word }))
      setStreak(cheer.streak())
      setHits((h) => h + 1)
      advance(gained, crossing || isLast ? 2000 : 1500)
      return
    }

    setStreak(0)
    setShake(true)
    later(() => setShake(false), 400)

    if (tries === 0) {
      setTries(1)
      setFlash('again')
      setLine(cheer.miss({ say: `Listen again: ${word.word}` }))
      later(() => {
        setInput('')
        setFlash(null)
        settling.current = false
        inputRef.current?.focus()
      }, 900)
      return
    }

    setFlash('shown')
    setLine(cheer.miss({ say: `It's spelled ${spellOut(answer)}.` }))
    advance(0, 2400)
  }

  const cave = PLACES[place].kind === 'hear'
  const caveWords = challenges.filter((c) => PLACES[c.place].kind === 'hear').length

  return (
    <div className="spelling-adventure">
      <div className="adv-header">
        <div className="adv-title">🗺️ Spelling Adventure</div>
        <div className="adv-stats">
          <div className="adv-stat"><span>Word</span><strong>{index + 1}/{challenges.length}</strong></div>
          <div className="adv-stat"><span>Score</span><strong>{score}</strong></div>
          <div className="adv-stat"><span>Streak</span><strong>🔥 {streak}</strong></div>
        </div>
      </div>

      <ol className="adv-map" aria-label="The adventure map">
        {PLACES.map((p, k) => (
          <li
            key={p.name}
            className={`adv-place ${k === place ? 'here' : ''} ${k < place ? 'passed' : ''}`}
            aria-current={k === place ? 'step' : undefined}
          >
            <span className="adv-place-icon" aria-hidden>{k < place ? '✅' : p.icon}</span>
            <span className="adv-place-name">{p.name}</span>
            {k === place && <span className="adv-hero" aria-hidden>🧒</span>}
          </li>
        ))}
      </ol>

      <div className={`adv-scene ${cave ? 'cave' : ''}`}>
        <p className="adv-ask">{PLACES[place].ask}</p>
        {cave && (
          <p className="adv-dragon" aria-label={`The dragon is ${sleepy} of ${caveWords} asleep`}>
            🐉 {'💤'.repeat(sleepy)}
          </p>
        )}

        <button className="adv-btn ghost" onClick={() => speak(word.word)} aria-label="Hear the word again">
          🔊 Hear it again
        </button>

        <div className={`adv-letters ${shake ? 'shake' : ''} ${current.kind}`} aria-label="The word's letters">
          <Burst trigger={hits} />
          {flash === 'shown'
            ? [...answer].map((c, i) => <span key={`a${i}`} className="adv-letter shown">{c}</span>)
            : current.shown.map((c, i) => (
                <span key={i} className={`adv-letter ${c ? 'given' : 'gap'}`}>{c}</span>
              ))}
        </div>
        {clue && <p className="adv-clue">{clue}</p>}
      </div>

      <div className="adv-answer">
        <SpellingInput
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          className={`adv-input ${flash ?? ''}`}
          placeholder="Spell the whole word"
          aria-label="Spell the word"
          disabled={settled || flash === 'again'}
          autoFocus
        />
        <button className="adv-btn" onClick={submit} disabled={settled || !input.trim()} aria-label="Check my spelling">
          ✓ Check
        </button>
      </div>

      {flash === 'ok' && (
        <div className="adv-flash ok">
          🎉 {line}
          {crossing && nextPlace !== null && ` On to the ${PLACES[nextPlace].name} ${PLACES[nextPlace].icon}!`}
          {isLast && (cave ? ' The dragon is fast asleep — adventure complete! 🏆' : ' Adventure complete! 🏆')}
        </div>
      )}
      {flash === 'again' && <div className="adv-flash soft">{line} Listen and have another go! 💪</div>}
      {flash === 'shown' && (
        <div className="adv-flash soft">
          {line} It's “{word.word}” — onwards, the next one is yours! 💪
        </div>
      )}
    </div>
  )
}

export default SpellingAdventure
