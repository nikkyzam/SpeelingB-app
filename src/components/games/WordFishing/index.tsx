import React, { useEffect, useMemo, useState } from 'react'
import type { Word } from '../../../services/wordBank'
import { useAudio } from '../../../contexts/AudioContext'
import { shuffle, misspell, splitChunk, isPlayable } from '../shared/wordTricks'
import sfx from '../shared/sfx'
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

/**
 * The end of the word swam away! Hook the fish carrying the piece that finishes
 * it. Moving targets make careful reading feel like an arcade game.
 */
const WordFishing: React.FC<WordFishingProps> = ({ onComplete, words: providedWords, rounds = 6 }) => {
  const { speak } = useAudio()

  const words = useMemo<Word[]>(() => {
    const pool = providedWords && providedWords.length > 0 ? providedWords : []
    const usable = shuffle(pool).filter((w) => isPlayable(w, 4))
    // Only their own words: a short game beats a game full of strangers.
    return usable.slice(0, rounds)
  }, [providedWords, rounds])

  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [caught, setCaught] = useState(0)
  const [missed, setMissed] = useState(false)
  const [hooked, setHooked] = useState<Fish | null>(null)
  const [splash, setSplash] = useState<number | null>(null)

  const current = words[index]
  const [head, tail] = useMemo(() => splitChunk((current?.word || '').toLowerCase()), [current])

  // Four fish: the real ending plus three believable impostors.
  const fish = useMemo<Fish[]>(() => {
    if (!current) return []
    const decoys = new Set<string>()
    // Two mangled versions of the real ending…
    for (let i = 0; i < 6 && decoys.size < 2; i++) {
      const bad = misspell(tail)
      if (bad !== tail) decoys.add(bad)
    }
    // …and an ending borrowed from another word entirely.
    shuffle(words)
      .filter((w) => w.id !== current.id)
      .forEach((w) => {
        if (decoys.size >= 3) return
        const other = splitChunk(w.word.toLowerCase())[1]
        if (other && other !== tail) decoys.add(other)
      })
    while (decoys.size < 3) decoys.add(tail + 'e')

    const chunks = shuffle([
      { chunk: tail, right: true },
      ...[...decoys].slice(0, 3).map((c) => ({ chunk: c, right: false })),
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
    if (current) speak(current.word)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index])

  if (!current) {
    return (
      <div className="word-fishing">
        <p className="wf-empty">The pond is empty — learn a few words first! 🎣</p>
        <button className="wf-btn" onClick={() => onComplete(0)}>Back to Games</button>
      </div>
    )
  }

  const cast = (f: Fish) => {
    if (hooked) return
    if (f.right) {
      // First-try catches are worth more, but a second look still pays.
      const points = missed ? 15 : 30
      setScore((s) => s + points)
      setCaught((c) => c + 1)
      setHooked(f)
      sfx.correct()
      speak(`${current.word}! Nice catch!`)
      setTimeout(() => {
        if (index < words.length - 1) {
          setIndex((i) => i + 1)
          setHooked(null)
          setMissed(false)
        } else {
          sfx.win()
          onComplete(score + points)
        }
      }, 1700)
    } else {
      setMissed(true)
      setSplash(f.id)
      sfx.wrong()
      setTimeout(() => setSplash((s) => (s === f.id ? null : s)), 600)
    }
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

      <div className="wf-target">
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
            key={f.id}
            className={`wf-fish ${hooked?.id === f.id ? 'hooked' : ''} ${splash === f.id ? 'splash' : ''} ${hooked && hooked.id !== f.id ? 'swim-away' : ''}`}
            style={{
              top: `${8 + f.lane * 23}%`,
              animationDuration: `${f.speed}s`,
              animationDelay: `${f.delay}s`,
              '--fish-color': f.color,
            } as React.CSSProperties}
            onClick={() => cast(f)}
            disabled={!!hooked}
          >
            <span className="wf-fish-body">{f.chunk}</span>
            <span className="wf-tail" aria-hidden />
          </button>
        ))}
        <div className="wf-water" aria-hidden />
      </div>

      {hooked && <div className="wf-flash">🎉 Reeled it in — <strong>{current.word}</strong>!</div>}
      {missed && !hooked && <div className="wf-nudge">Splash! That one didn&apos;t fit — try another. 🌊</div>}
    </div>
  )
}

export default WordFishing
