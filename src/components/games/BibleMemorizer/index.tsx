import React, { useEffect, useMemo, useRef, useState } from 'react'
import { bibleApi, type BibleVersion } from '../../../services/bibleApi'
import { useAudio } from '../../../contexts/AudioContext'
import { shuffle } from '../shared/wordTricks'
import { spellOut } from '../../../services/words/praise'
import useCheer from '../shared/useCheer'
import useLater from '../shared/useLater'
import Burst from '../shared/Burst'
import SpellingInput from '../../common/SpellingInput'
import './BibleMemorizer.css'

interface BibleMemorizerProps {
  onComplete: (score: number) => void
  /**
   * NLT (the default) uses the verses below and needs no network: bible-api.com
   * doesn't serve the NLT. Any other version is fetched, and falls back to the
   * NLT text if the fetch fails or takes too long.
   */
  version?: BibleVersion
}

export interface KidVerse {
  reference: string
  text: string
}

/** Short, well-loved verses a child can learn, in the New Living Translation. */
export const KID_VERSES: KidVerse[] = [
  { reference: 'Genesis 1:1', text: 'In the beginning God created the heavens and the earth.' },
  { reference: 'Psalm 23:1', text: 'The LORD is my shepherd; I have all that I need.' },
  { reference: 'Psalm 46:1', text: 'God is our refuge and strength, always ready to help in times of trouble.' },
  { reference: 'Psalm 56:3', text: 'But when I am afraid, I will put my trust in you.' },
  { reference: 'Psalm 118:24', text: 'This is the day the LORD has made. We will rejoice and be glad in it.' },
  { reference: 'Psalm 119:105', text: 'Your word is a lamp to guide my feet and a light for my path.' },
  { reference: 'Psalm 136:1', text: 'Give thanks to the LORD, for he is good! His faithful love endures forever.' },
  { reference: 'Proverbs 3:5', text: 'Trust in the LORD with all your heart; do not depend on your own understanding.' },
  { reference: 'Proverbs 17:17', text: 'A friend is always loyal, and a brother is born to help in time of need.' },
  { reference: 'Philippians 4:13', text: 'For I can do everything through Christ, who gives me strength.' },
  { reference: '1 Peter 5:7', text: 'Give all your worries and cares to God, for he cares about you.' },
  { reference: '1 John 4:19', text: 'We love each other because he loved us first.' },
  {
    reference: 'John 3:16',
    text: 'For this is how God loved the world: He gave his one and only Son, so that everyone who believes in him will not perish but have eternal life.',
  },
]

/** Three steps, each hiding a few more words: seed, sprout, tree. */
export const STAGES = [
  { name: 'Seed', icon: '🌱', blanks: 2 },
  { name: 'Sprout', icon: '🌿', blanks: 3 },
  { name: 'Tree', icon: '🌳', blanks: 4 },
] as const

/** A word without the punctuation around it: "world:" → "world". */
export const coreOf = (token: string): string => token.replace(/^[^A-Za-z]+|[^A-Za-z]+$/g, '')

/** Words worth hiding: plain letters, three or more ("Don’t" and "command—be" aren't). */
export const blankable = (token: string): boolean => /^[A-Za-z]{3,}$/.test(coreOf(token))

const tidy = (v: string) => v.toLowerCase().replace(/[^a-z]/g, '')

/**
 * Which words to hide, as positions in reading order. Words not hidden in an
 * earlier step come first. Sorted, because the blanks are drawn and checked
 * left to right — picking them in random order once left a blank that never
 * rendered, and the verse could never be checked.
 */
export const pickBlanks = (tokens: string[], n: number, used: ReadonlySet<number> = new Set()): number[] => {
  const all = tokens.map((t, i) => (blankable(t) ? i : -1)).filter((i) => i >= 0)
  const fresh = shuffle(all.filter((i) => !used.has(i)))
  const again = shuffle(all.filter((i) => used.has(i)))
  return [...fresh, ...again].slice(0, n).sort((a, b) => a - b)
}

type Mark = 'open' | 'right' | 'wrong' | 'shown'

/** How long to wait for another version before using the NLT verse instead. */
const FETCH_WAIT_MS = 5000

/**
 * Bible Memorizer — hear a verse, then fill in its missing words, three times
 * over with more words missing each time.
 *
 * The verse is read aloud at every step. Nothing is marked until the child
 * presses Enter or Check (it used to mark a half-typed word the moment every
 * blank had a letter in it). A blank that's wrong gets one more go; then the
 * word is shown and spelled out and the next step begins. There is no clock.
 */
const BibleMemorizer: React.FC<BibleMemorizerProps> = ({ onComplete, version = 'NLT' }) => {
  const { speak } = useAudio()
  const cheer = useCheer()
  const later = useLater()

  const [chosen] = useState<KidVerse>(() => KID_VERSES[Math.floor(Math.random() * KID_VERSES.length)])
  const [verse, setVerse] = useState<KidVerse | null>(version === 'NLT' ? chosen : null)

  // Another version comes from the API. It must never leave the game on
  // "Opening…": a failure or a slow network falls back to the NLT verse.
  useEffect(() => {
    if (version === 'NLT') return
    let live = true
    const settle = (v: KidVerse) => {
      if (live) setVerse((cur) => cur ?? v)
    }
    const wait = window.setTimeout(() => settle(chosen), FETCH_WAIT_MS)
    bibleApi
      .getVerse(chosen.reference, version)
      .then((data) => {
        const text = (data?.text ?? '').replace(/\s+/g, ' ').trim()
        const usable = text.split(' ').filter(blankable).length >= STAGES[0].blanks
        settle(usable ? { reference: chosen.reference, text } : chosen)
      })
      .catch(() => settle(chosen))
    return () => {
      live = false
      window.clearTimeout(wait)
    }
  }, [version, chosen])

  const tokens = useMemo(() => (verse ? verse.text.split(/\s+/).filter(Boolean) : []), [verse])

  const [stage, setStage] = useState(0)
  const [blanks, setBlanks] = useState<number[]>([])
  const [inputs, setInputs] = useState<string[]>([])
  const [marks, setMarks] = useState<Mark[]>([])
  const [tries, setTries] = useState(0)
  const [flash, setFlash] = useState<'ok' | 'again' | 'shown' | null>(null)
  const [line, setLine] = useState('')
  const [shake, setShake] = useState(false)
  const [score, setScore] = useState(0)
  const [hits, setHits] = useState(0)
  // One check at a time: a second Enter while a check settles is ignored.
  const locked = useRef(false)
  const used = useRef(new Set<number>())
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  /** Lay out a step: its blanks, empty boxes, and the verse read aloud. */
  const startStage = (s: number, v: KidVerse, toks: string[]) => {
    const picked = pickBlanks(toks, STAGES[s].blanks, used.current)
    picked.forEach((i) => used.current.add(i))
    setStage(s)
    setBlanks(picked)
    setInputs(picked.map(() => ''))
    setMarks(picked.map(() => 'open'))
    setTries(0)
    setFlash(null)
    locked.current = false
    speak(s === 0 ? `${v.reference}. ${v.text}` : v.text)
  }

  useEffect(() => {
    if (verse) startStage(0, verse, tokens)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verse])

  // The keypad belongs to the box most recently focused: start on the first.
  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [blanks])

  if (!verse) {
    return (
      <div className="bible-memorizer">
        <p className="bmz-loading" role="status">📖 Opening the Bible…</p>
      </div>
    )
  }

  const answers = blanks.map((i) => coreOf(tokens[i] ?? ''))
  const isLast = stage === STAGES.length - 1
  const typedSomething = marks.some((m, k) => m === 'open' && (inputs[k] ?? '').trim() !== '')

  const focusNextEmpty = (from: number) => {
    const empty = marks.map((m, k) => (m === 'open' && !(inputs[k] ?? '').trim() ? k : -1)).filter((k) => k >= 0)
    const next = empty.find((k) => k > from) ?? empty[0]
    if (next !== undefined) inputRefs.current[next]?.focus()
  }

  const moveOn = (gained: number, ms: number) => {
    later(() => {
      if (!isLast) startStage(stage + 1, verse, tokens)
      else onComplete(score + gained)
    }, ms)
  }

  /**
   * Mark the open blanks. From a box's Enter (`from` is its blank), an empty
   * blank elsewhere just moves the cursor there; the Check button marks what
   * is filled in, and an empty blank counts as a miss so nobody is stuck.
   */
  const check = (from: number | null) => {
    if (locked.current || flash) return
    const open = marks.map((m, k) => (m === 'open' ? k : -1)).filter((k) => k >= 0)
    if (open.length === 0) return
    const empty = open.filter((k) => !(inputs[k] ?? '').trim())
    if (from !== null && empty.length > 0) {
      focusNextEmpty(from)
      return
    }
    if (empty.length === open.length) return
    locked.current = true

    const next = [...marks]
    let points = 0
    for (const k of open) {
      if (tidy(inputs[k] ?? '') === tidy(answers[k])) {
        next[k] = 'right'
        points += tries === 0 ? 20 : 10
      } else {
        next[k] = 'wrong'
      }
    }
    const wrong = open.filter((k) => next[k] === 'wrong')

    if (wrong.length === 0) {
      const gained = points + (tries === 0 ? 20 : 0)
      setScore((s) => s + gained)
      setMarks(next)
      setFlash('ok')
      setHits((h) => h + 1)
      setLine(cheer.hit({ say: isLast ? 'You know the whole verse!' : 'On to the next step!' }))
      moveOn(gained, 1800)
      return
    }

    setShake(true)
    later(() => setShake(false), 400)
    setScore((s) => s + points)

    if (tries === 0) {
      setMarks(next)
      setTries(1)
      setFlash('again')
      setLine(cheer.miss({ say: 'Have another go at the empty spaces.' }))
      // Wrong words are cleared, not left up to be patched letter by letter.
      later(() => {
        setInputs((cur) => cur.map((v, k) => (next[k] === 'wrong' ? '' : v)))
        setMarks(next.map((m) => (m === 'wrong' ? 'open' : m)))
        setFlash(null)
        locked.current = false
        inputRefs.current[wrong[0]]?.focus()
      }, 900)
      return
    }

    setMarks(next.map((m) => (m === 'wrong' ? 'shown' : m)))
    setInputs((cur) => cur.map((v, k) => (next[k] === 'wrong' ? answers[k] : v)))
    setFlash('shown')
    setLine(cheer.miss({ say: wrong.map((k) => `${answers[k]}: ${spellOut(answers[k])}`).join('. ') }))
    moveOn(points, 2800)
  }

  return (
    <div className="bible-memorizer">
      <div className="bmz-header">
        <div className="bmz-title">🙏 Bible Memorizer</div>
        <div className="bmz-stats">
          <div className="bmz-stat"><span>Step</span><strong>{stage + 1}/{STAGES.length}</strong></div>
          <div className="bmz-stat"><span>Score</span><strong>{score}</strong></div>
        </div>
      </div>

      <ol className="bmz-steps" aria-label="Steps">
        {STAGES.map((s, k) => (
          <li key={s.name} className={`bmz-step ${k === stage ? 'here' : ''} ${k < stage ? 'done' : ''}`}>
            <span aria-hidden>{s.icon}</span> {s.name}
          </li>
        ))}
      </ol>

      <p className="bmz-help">Listen to the verse, fill in the missing words, then press Check.</p>
      <button className="bmz-btn ghost" onClick={() => speak(verse.text)} aria-label="Hear the verse">
        🔊 Hear the verse
      </button>

      <div className={`bmz-verse ${shake ? 'shake' : ''}`}>
        <Burst trigger={hits} />
        <p className="bmz-text">
          {tokens.map((tok, ti) => {
            const k = blanks.indexOf(ti)
            if (k < 0) return <span key={ti} className="bmz-word">{tok} </span>
            const core = coreOf(tok)
            const at = tok.indexOf(core)
            return (
              <span key={`${stage}-${ti}`} className="bmz-gap">
                {tok.slice(0, at)}
                <SpellingInput
                  ref={(el) => {
                    inputRefs.current[k] = el
                  }}
                  type="text"
                  value={inputs[k] ?? ''}
                  onChange={(e) => {
                    const v = e.target.value
                    setInputs((cur) => cur.map((x, j) => (j === k ? v : x)))
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && check(k)}
                  className={`bmz-input ${marks[k] ?? 'open'}`}
                  style={{ width: `${Math.max(3, core.length) + 1.5}ch` }}
                  disabled={marks[k] !== 'open' || flash === 'again'}
                  aria-label={`Missing word ${k + 1} of ${blanks.length}`}
                />
                {tok.slice(at + core.length)}{' '}
              </span>
            )
          })}
        </p>
        <p className="bmz-ref">📜 {verse.reference} ({verse === chosen ? 'NLT' : version})</p>
      </div>

      <button className="bmz-btn" onClick={() => check(null)} disabled={!!flash || !typedSomething} aria-label="Check my words">
        ✓ Check
      </button>

      {flash === 'ok' && (
        <div className="bmz-flash ok">
          🎉 {line} {isLast ? 'You know the whole verse!' : `Next: ${STAGES[stage + 1].icon} ${STAGES[stage + 1].name}`}
        </div>
      )}
      {flash === 'again' && <div className="bmz-flash soft">{line} Have another go at the empty spaces! 💪</div>}
      {flash === 'shown' && <div className="bmz-flash soft">{line} Here are the words — say the verse with me! 💪</div>}
    </div>
  )
}

export default BibleMemorizer
