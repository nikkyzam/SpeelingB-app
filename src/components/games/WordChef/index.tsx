import { usePreferences } from '../../../hooks/usePreferences'
import { activityClock } from '../../../services/games/activityClock'
import React, { useMemo, useState, useEffect, useRef } from 'react'
import { wordBank, Word } from '../../../services/wordBank'
import { useAudio } from '../../../contexts/AudioContext'
import { shuffle, isPlayable } from '../shared/wordTricks'
import { useCheer } from '../shared/useCheer'
import { useLater } from '../shared/useLater'
import sfx from '../shared/sfx'
import Burst from '../shared/Burst'
import GameEmpty from '../shared/GameEmpty'
import { COMMON_WORDS, COMMON_WORD_SET } from './commonWords'
import './WordChef.css'

interface WordChefProps {
  onComplete: (score: number) => void
  words?: Word[]
  duration?: number
}

/** Real words to cook before the menu is done. */
export const GOAL = 6
/** Bonus for finishing the menu before the clock. */
const MENU_BONUS = 30
/** Base words worth weighing up — enough to find a good one, few enough to be quick. */
const BASE_TRIES = 12

const letterCounts = (s: string): Record<string, number> => {
  const m: Record<string, number> = {}
  for (const c of s) m[c] = (m[c] || 0) + 1
  return m
}

export const canForm = (word: string, base: string): boolean => {
  const have = letterCounts(base)
  const need = letterCounts(word)
  return Object.keys(need).every((k) => (have[k] || 0) >= need[k])
}

/**
 * Real words, but not ones to set as a blank on a child's menu. They still
 * count if a child cooks one; they just never sit there as a target.
 */
const NOT_ON_THE_MENU = new Set([
  'beer', 'gin', 'rum', 'vodka', 'wine', 'die', 'gun', 'tumor', 'toxic', 'viral', 'virus', 'widow', 'hate', 'evil',
  'fat', 'ugly', 'war',
])

/** Common words (3+ letters) hiding inside `base`, the base itself included. */
const commonInside = (base: string): string[] =>
  COMMON_WORDS.filter((w) => w.length >= 3 && w.length <= base.length && canForm(w, base))

export interface Kitchen {
  base: string
  /** The menu: blank chips the child fills in — the base word plus familiar words in it. */
  targets: string[]
  /** How many real words finish the game. Never more than can be found. */
  goal: number
}

/**
 * Pick the base word — always one of the child's own — and lay out the menu.
 * Longer words hide more words, so 5–8 letters are tried first, but a child
 * whose list is all 4-letter (or 9–10-letter) words still gets a kitchen. The menu shows only
 * familiar words: the bank is full of spelling-bee words like "tael", and a
 * blank waiting for one could never be filled.
 */
export const makeKitchen = (childWords: string[], bankWords: string[] = []): Kitchen => {
  const preferred = (w: string) => (w.length >= 5 && w.length <= 8 ? 0 : 1)
  // Stable sort: still shuffled within each group.
  const candidates = shuffle(
    Array.from(new Set(childWords.map((w) => w.toLowerCase()))).filter((w) => /^[a-z]{4,10}$/.test(w))
  ).sort((a, b) => preferred(a) - preferred(b))
  if (!candidates.length) return { base: '', targets: [], goal: 0 }

  let base = candidates[0]
  let best = -1
  for (const c of candidates.slice(0, BASE_TRIES)) {
    const n = commonInside(c).length
    if (n > best) {
      best = n
      base = c
    }
  }

  const inside = commonInside(base)
  const familiar = shuffle(inside.filter((w) => w !== base && !NOT_ON_THE_MENU.has(w)))
    .sort((a, b) => a.length - b.length)
    .slice(0, GOAL - 1)
  const targets = [base, ...familiar]
  // Any real word counts towards the goal, so it can be as big as all the
  // real words in there — but no bigger, or the menu could never be finished.
  const findable = new Set([
    ...targets,
    ...inside,
    ...bankWords.filter((w) => w.length >= 3 && w.length <= base.length && canForm(w, base)),
  ])
  return { base, targets, goal: Math.min(GOAL, findable.size) }
}

/** Is this a real word? Common words, then the word bank — a dictionary check only. */
const isRealWord = (w: string): boolean => COMMON_WORD_SET.has(w) || !!wordBank.getWordByWord(w)

/** Cook up as many real words as you can from the letters before time runs out. */
const WordChef: React.FC<WordChefProps> = ({ onComplete, words: providedWords, duration = 120 }) => {
  const { speak } = useAudio()
  const [preferences] = usePreferences()
  const cheer = useCheer()
  const later = useLater()

  const kitchen = useMemo<Kitchen>(() => {
    const mine = (providedWords || []).filter((w) => isPlayable(w, 4)).map((w) => w.word.toLowerCase())
    if (!mine.length) return { base: '', targets: [], goal: 0 }
    // The bank only sizes the goal (how many real words are in there); it
    // never supplies a word to play.
    const bank = wordBank.getAllWords().map((w) => w.word.toLowerCase()).filter((w) => /^[a-z]+$/.test(w))
    return makeKitchen(mine, bank)
  }, [providedWords])
  const { base, targets, goal } = kitchen

  const tiles = useMemo(() => {
    const t = shuffle(base.split(''))
    // Laid out in order, the tiles would spell the star word for free.
    return base.length > 1 && t.join('') === base ? t.reverse() : t
  }, [base])

  const [used, setUsed] = useState<number[]>([]) // tile indices in build order
  const [found, setFound] = useState<string[]>([])
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(duration)
  const [flash, setFlash] = useState<{ kind: 'ok' | 'bad'; msg: string; id: number } | null>(null)
  const [hits, setHits] = useState(0)
  const [over, setOver] = useState(false)
  // Ends the game once — whether the menu or the clock gets there first.
  const ended = useRef(false)
  const flashId = useRef(0)

  const build = used.map((i) => tiles[i]).join('')

  const finish = (finalScore: number) => {
    if (ended.current) return
    ended.current = true
    setOver(true)
    // A moment to see the menu filled in (and any words they missed).
    later(() => onComplete(finalScore), 2600)
  }

  useEffect(() => {
    if (!base || ended.current || preferences.relaxed) return
    if (timeLeft <= 0) {
      finish(score)
      return
    }
    const t = activityClock.setTimeout(() => setTimeLeft((s) => s - 1), 1000)
    return () => activityClock.clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, base, preferences.relaxed])

  const say = (kind: 'ok' | 'bad', msg: string) => {
    const id = ++flashId.current
    setFlash({ kind, msg, id })
    later(() => setFlash((f) => (f && f.id === id ? null : f)), 1600)
  }

  const tapTile = (i: number) => {
    if (ended.current) return
    sfx.tap()
    // Functional update so quick successive taps can't drop letters.
    setUsed((prev) => (prev.includes(i) ? prev : [...prev, i]))
  }
  const undo = () => setUsed((prev) => prev.slice(0, -1))
  const clear = () => setUsed([])

  const submit = () => {
    if (ended.current) return
    const word = build
    if (word.length < 3) {
      say('bad', 'Words need at least 3 letters')
      return
    }
    clear()
    if (found.includes(word)) {
      sfx.tap()
      say('bad', `You already cooked “${word}” — try another!`)
      return
    }
    if (!isRealWord(word)) {
      say('bad', cheer.miss({ quiet: true }) + ` “${word}” isn’t on the menu.`)
      return
    }
    // Every real word counts, on the menu or not.
    const points = word.length * 5 + (word === base ? 25 : 0)
    const nextFound = [...found, word]
    setFound(nextFound)
    setHits((h) => h + 1)
    const line = cheer.hit({ say: word })
    say('ok', word === base ? `⭐ The whole word! +${points}` : `${line} “${word}” +${points}`)
    if (nextFound.length >= goal) {
      const total = score + points + MENU_BONUS
      setScore(total)
      finish(total)
    } else {
      setScore((s) => s + points)
    }
  }

  // Said once at the start, for a child who can't read the instructions yet.
  useEffect(() => {
    if (base) speak(`Let's cook! Make ${goal} little words from the letters of ${base}.`)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!base) {
    return (
      <div className="word-chef">
        <GameEmpty icon="👨‍🍳">The kitchen is bare — learn a few longer words, then come back and cook!</GameEmpty>
      </div>
    )
  }

  const extras = found.filter((w) => !targets.includes(w))
  const menuDone = found.length >= goal

  return (
    <div className="word-chef">
      {preferences.relaxed && !over && <button className="comfort-button" onClick={() => finish(score)}>Finish my round</button>}
      <div className="wch-header">
        <div className="wch-title">🍲 Word Chef</div>
        <div className="wch-stats">
          <div className="wch-stat"><span>Pace</span><strong>{preferences.relaxed ? "Your pace" : `${timeLeft}s`}</strong></div>
          <div className="wch-stat"><span>Score</span><strong>{score}</strong></div>
          <div className="wch-stat"><span>Cooked</span><strong>{Math.min(found.length, goal)}/{goal}</strong></div>
        </div>
      </div>

      <p className="wch-hint">Make {goal} real words from these letters, then tap <strong>Cook it!</strong></p>

      <div className="wch-build">
        {Array.from({ length: base.length }).map((_, i) => (
          <span key={i} className={`wch-slot ${build[i] ? 'filled' : ''}`}>{build[i]?.toUpperCase() || ''}</span>
        ))}
      </div>

      <div className="wch-tiles">
        {tiles.map((ch, i) => (
          <button
            key={i}
            className={`wch-tile ${used.includes(i) ? 'used' : ''}`}
            onClick={() => tapTile(i)}
            disabled={used.includes(i) || over}
            aria-label={ch}
          >
            {ch.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="wch-actions">
        <button className="wch-btn ghost" onClick={undo} disabled={!used.length || over}>⬅ Undo</button>
        <button className="wch-btn" onClick={submit} disabled={used.length < 3 || over}>🍳 Cook it!</button>
        <button className="wch-btn ghost" onClick={clear} disabled={!used.length || over}>Clear</button>
      </div>

      <div className="wch-flash-row">
        {flash && (
          <div key={flash.id} className={`wch-flash ${flash.kind}`} role="status">
            {flash.msg}
            {flash.kind === 'ok' && <Burst trigger={hits} emoji={['🍳', '⭐', '✨', '🧁']} />}
          </div>
        )}
      </div>

      <div className="wch-found">
        <div className="wch-found-label">On the menu:</div>
        <div className="wch-found-list" aria-label="Words on the menu">
          {targets.map((w) => {
            const got = found.includes(w)
            // Blank until cooked — one dash per letter, so the size is a clue
            // but the word isn't. Shown at the end, so nothing stays a mystery.
            if (got || over) {
              return (
                <span key={w} className={`wch-chip ${got ? 'got' : 'missed'} ${w === base ? 'star' : ''}`}>{w}</span>
              )
            }
            return (
              <span key={w} className={`wch-chip blank ${w === base ? 'star' : ''}`} aria-label={`A ${w.length}-letter word`}>
                {'_ '.repeat(w.length).trim()}
              </span>
            )
          })}
          {extras.map((w) => (
            <span key={w} className="wch-chip got bonus">{w}</span>
          ))}
        </div>
      </div>

      {over && (
        <div className="wch-win" role="status">
          {menuDone ? '🎉 Menu complete, chef!' : `⏰ Time’s up — you cooked ${found.length}!`}
        </div>
      )}
    </div>
  )
}

export default WordChef
