import React, { useEffect, useMemo, useRef, useState } from 'react'
import type { Word } from '../../../services/wordBank'
import { useAudio } from '../../../contexts/AudioContext'
import { shuffle, misspell, splitChunk, isPlayable, letterTraps } from '../shared/wordTricks'
import { spellOut } from '../../../services/words/praise'
import useCheer from '../shared/useCheer'
import useLater from '../shared/useLater'
import Burst from '../shared/Burst'
import GameEmpty from '../shared/GameEmpty'
import './WordFishing.css'

interface WordFishingProps {
  onComplete: (score: number) => void
  words?: Word[]
  rounds?: number
}

interface Fish {
  id: number
  chunk: string
  right: boolean
  lane: number
  /** seconds for one lap across the pond */
  speed: number
  delay: number
  color: string
}

const FISH_COLORS = ['#FF8FAB', '#4ECDC4', '#FFD166', '#8AC926', '#7C5CFF']
/** Two splashes, then the right fish is reeled in for them. */
const MISSES_ALLOWED = 2
const FIRST_CAST = 30
const SECOND_CAST = 15
const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'

/**
 * Three wrong endings for `word`, all different from each other and from the
 * real one: two believable slips of the real ending, one borrowed from
 * another of the child's words, topped up from a fixed list.
 *
 * It always finishes. It used to top up with `tail + 'e'` in a while loop —
 * the same string every time — so a list like ball, tall, call, fall (every
 * ending "ll", whose only `misspell` is "lll") spun forever and froze the app.
 */
export const endingDecoys = (word: string, others: string[], n = 3): string[] => {
  const w = word.toLowerCase()
  const [head, tail] = splitChunk(w)
  const out: string[] = []
  const add = (c: string) => {
    if (out.length < n && c && /^[a-z]+$/.test(c) && c !== tail && !out.includes(c)) out.push(c)
  }

  // Slips a speller really makes: a typo, half of a double dropped, a letter
  // that sounds or looks like the right one.
  const slips: string[] = []
  for (let i = 0; i < 6; i++) slips.push(misspell(tail))
  slips.push(tail.replace(/(.)\1/, '$1'))
  for (let i = 0; i < tail.length; i++) {
    for (const c of letterTraps(w, head.length + i, 2)) slips.push(tail.slice(0, i) + c + tail.slice(i + 1))
  }
  const fresh = shuffle([...new Set(slips)])
  fresh.forEach((s) => {
    if (out.length < n - 1) add(s)
  })

  // …an ending borrowed from another word entirely…
  shuffle(others).forEach((o) => add(splitChunk(o.toLowerCase())[1] ?? ''))

  // …and whatever is still missing. 26 distinct fillers, so this always ends.
  fresh.forEach(add)
  for (let k = 0; k < ALPHABET.length && out.length < n; k++) add(tail + ALPHABET[k])
  return out
}

/**
 * The end of the word swam away! Hook the fish carrying the piece that finishes
 * it. Moving targets make careful reading feel like an arcade game.
 */
const WordFishing: React.FC<WordFishingProps> = ({ onComplete, words: providedWords, rounds = 6 }) => {
  const { speak } = useAudio()
  const cheer = useCheer()
  const later = useLater()

  const words = useMemo<Word[]>(() => {
    const pool = providedWords && providedWords.length > 0 ? providedWords : []
    const usable = shuffle(pool).filter((w) => isPlayable(w, 4))
    // Only their own words: a short game beats a game full of strangers.
    return usable.slice(0, rounds)
  }, [providedWords, rounds])

  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [caught, setCaught] = useState(0)
  const [misses, setMisses] = useState(0)
  /** Fish already tried this round: they swim off. */
  const [splashed, setSplashed] = useState<number[]>([])
  const [hooked, setHooked] = useState<Fish | null>(null)
  const [cheerLine, setCheerLine] = useState('')
  const [hits, setHits] = useState(0)
  const locked = useRef(false)

  const current = words[index]
  const [head, tail] = useMemo(() => splitChunk((current?.word || '').toLowerCase()), [current])

  // Four fish: the real ending plus three believable impostors.
  const fish = useMemo<Fish[]>(() => {
    if (!current) return []
    const others = words.filter((w) => w.id !== current.id).map((w) => w.word)
    const chunks = shuffle([
      { chunk: tail, right: true },
      ...endingDecoys(current.word, others).map((c) => ({ chunk: c, right: false })),
    ])
    return chunks.map((c, i) => ({
      id: i,
      ...c,
      lane: i,
      speed: 7 + Math.random() * 5,
      delay: -Math.random() * 6,
      color: FISH_COLORS[i % FISH_COLORS.length],
    }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, tail])

  useEffect(() => {
    if (!current) return
    locked.current = false
    // Queued, so the last word's spoken correction (its letters) isn't cut off.
    speak(current.word, { queue: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, words])

  if (!current) {
    return (
      <div className="word-fishing">
        <GameEmpty icon="🎣">The pond is empty — learn a few words first!</GameEmpty>
      </div>
    )
  }

  const reelIn = (f: Fish, gained: number, wait: number) => {
    locked.current = true
    setHooked(f)
    later(() => {
      if (index < words.length - 1) {
        // Cleared in the same step as the index moves, or the next word's
        // first frame would show its ending already filled in.
        setHooked(null)
        setMisses(0)
        setSplashed([])
        setIndex((i) => i + 1)
      } else {
        onComplete(score + gained)
      }
    }, wait)
  }

  const cast = (f: Fish) => {
    if (locked.current || hooked || splashed.includes(f.id)) return
    if (f.right) {
      // First-try catches are worth more, but a second look still pays.
      const gained = misses === 0 ? FIRST_CAST : SECOND_CAST
      setScore((s) => s + gained)
      setCaught((c) => c + 1)
      setCheerLine(cheer.hit({ say: current.word }))
      setHits((h) => h + 1)
      reelIn(f, gained, 1700)
      return
    }

    const used = misses + 1
    setMisses(used)
    setSplashed((s) => [...s, f.id])
    if (used >= MISSES_ALLOWED) {
      // Never left casting at random: the right fish comes in, and we hear why.
      const right = fish.find((x) => x.right)
      setCheerLine(cheer.miss({ say: `It was ${current.word}. ${spellOut(current.word)}.` }))
      if (right) reelIn(right, 0, 2700)
      return
    }
    setCheerLine(cheer.miss({ say: `Listen: ${current.word}` }))
  }

  return (
    <div className="word-fishing">
      <div className="wf-header">
        <div className="wf-title">🎣 Word Fishing</div>
        <div className="wf-stats">
          <div className="wf-stat"><span>Word</span><strong>{index + 1}/{words.length}</strong></div>
          <div className="wf-stat"><span>Score</span><strong>{score}</strong></div>
          <div className="wf-stat"><span>Caught</span><strong>🐟 {caught}</strong></div>
        </div>
      </div>

      <div className="wf-target" aria-label="The word with its ending missing">
        {hooked && misses < MISSES_ALLOWED && <Burst trigger={hits} />}
        <span className="wf-head">{head}</span>
        <span className={`wf-gap ${hooked ? 'filled' : ''}`}>{hooked ? tail : '?'.repeat(tail.length)}</span>
      </div>
      {/* The word itself is never printed here — hearing it is the puzzle. */}
      <p className="wf-hint">
        Listen, then catch the fish holding the missing ending!
        <button className="wf-speak" onClick={() => speak(current.word)} aria-label="Hear the word again">🔊</button>
      </p>

      <div className="wf-pond">
        {fish.map((f) => (
          <button
            key={`${index}-${f.id}`}
            className={`wf-fish ${hooked?.id === f.id ? 'hooked' : ''} ${splashed.includes(f.id) ? 'splash' : ''} ${hooked && hooked.id !== f.id ? 'swim-away' : ''}`}
            style={{
              top: `${8 + f.lane * 23}%`,
              animationDuration: `${f.speed}s`,
              animationDelay: `${f.delay}s`,
              '--fish-color': f.color,
              '--wf-rest': `${6 + f.lane * 22}%`,
            } as React.CSSProperties}
            onClick={() => cast(f)}
            disabled={!!hooked || splashed.includes(f.id)}
          >
            <span className="wf-fish-body">{f.chunk}</span>
            <span className="wf-tail" aria-hidden />
          </button>
        ))}
        <div className="wf-water" aria-hidden />
      </div>

      {hooked && misses < MISSES_ALLOWED && (
        <div className="wf-flash">🎉 {cheerLine} Reeled it in — <strong>{current.word}</strong>!</div>
      )}
      {hooked && misses >= MISSES_ALLOWED && (
        <div className="wf-nudge shown">It was <strong>{current.word}</strong> — the next fish is yours! 🐟</div>
      )}
      {!hooked && misses > 0 && (
        <div className="wf-nudge">{cheerLine} That one swam off — listen again and try another. 🌊</div>
      )}
    </div>
  )
}

export default WordFishing
