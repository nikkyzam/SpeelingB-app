import React, { useEffect, useMemo, useRef, useState } from 'react'
import type { Word } from '../../../services/wordBank'
import { useAudio } from '../../../contexts/AudioContext'
import { shuffle, isPlayable } from '../shared/wordTricks'
import { spellOut } from '../../../services/words/praise'
import { maskClue } from '../shared/clues'
import useCheer from '../shared/useCheer'
import useLater from '../shared/useLater'
import Burst from '../shared/Burst'
import GameEmpty from '../shared/GameEmpty'
import SpellingInput from '../../common/SpellingInput'
import './MysteryPicture.css'

interface MysteryPictureProps {
  onComplete: (score: number) => void
  words?: Word[]
}

interface Scene {
  name: string
  tiles: string[] // 12 emoji making up the picture
}

const SCENES: Scene[] = [
  { name: 'A Sunny Garden', tiles: ['☀️','☁️','🦋','🌳','🌻','🌷','🐝','🌼','🌱','🐛','🍀','🌈'] },
  { name: 'Under the Sea',  tiles: ['🌊','🐠','🐡','🐙','🐚','🦀','🐬','🪸','🐟','⭐','🫧','🦈'] },
  { name: 'Outer Space',    tiles: ['🌕','⭐','🚀','🪐','👨‍🚀','🌟','☄️','🛸','✨','🌌','🔭','👽'] },
  { name: 'Dino Land',      tiles: ['🌋','🦕','🌿','🦖','🥚','🌴','🦴','🍃','🐊','⛰️','🌾','🦎'] },
  { name: 'Birthday Party', tiles: ['🎂','🎈','🎁','🎉','🧁','🍬','🎊','🍭','🎵','🥳','🍦','🎀'] },
]

/** Two goes at a word, then it is shown — and its tiles still come off. */
const TRIES = 2
const FIRST_TRY = 25
const SECOND_TRY = 15
/** For seeing the whole picture through. */
const PICTURE_BONUS = 30

/** Spell each word correctly to uncover another piece of a hidden picture. */
const MysteryPicture: React.FC<MysteryPictureProps> = ({ onComplete, words: providedWords }) => {
  const { speak } = useAudio()
  const cheer = useCheer()
  const later = useLater()

  const scene = useMemo(() => SCENES[Math.floor(Math.random() * SCENES.length)], [])

  const words = useMemo<Word[]>(() => {
    const pool = providedWords && providedWords.length > 0 ? providedWords : []
    return shuffle(pool).filter((w) => isPlayable(w, 3)).slice(0, 6)
  }, [providedWords])

  const [index, setIndex] = useState(0)
  const [input, setInput] = useState('')
  const [revealed, setRevealed] = useState<number[]>([])
  const [score, setScore] = useState(0)
  const [misses, setMisses] = useState(0)
  const [feedback, setFeedback] = useState<'right' | 'nearly' | 'shown' | null>(null)
  const [cheerLine, setCheerLine] = useState('')
  const [hits, setHits] = useState(0)
  const [finished, setFinished] = useState(false)
  // Settles each answer once: a double tap on "Uncover!" reads the same state.
  const locked = useRef(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const current = words[index]
  const tilesPerWord = Math.ceil(scene.tiles.length / Math.max(words.length, 1))

  // A new word: hear it, and the box is ready for it.
  useEffect(() => {
    if (!current) return
    setInput('')
    setMisses(0)
    setFeedback(null)
    locked.current = false
    // Queued, so the last word's spoken correction (its letters) isn't cut off.
    speak(current.word, { queue: true })
    inputRef.current?.focus()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, words])

  if (!current && !finished) {
    return (
      <div className="mystery-picture">
        <GameEmpty icon="🖼️">Learn a few more words to unlock a mystery picture!</GameEmpty>
      </div>
    )
  }

  const uncover = () => {
    const hidden = scene.tiles.map((_, i) => i).filter((i) => !revealed.includes(i))
    const picks = shuffle(hidden).slice(0, tilesPerWord)
    setRevealed((r) => [...r, ...picks])
  }

  /** On to the next word — or, after the last, admire the picture and finish. */
  const advance = (gained: number) => {
    if (index < words.length - 1) {
      // Cleared in the same step as the index moves: a flash left up for one
      // frame would say "It was …" with the next word in it.
      setFeedback(null)
      setInput('')
      setMisses(0)
      setIndex((i) => i + 1)
      return
    }
    const total = score + gained + PICTURE_BONUS
    setScore(total)
    setRevealed(scene.tiles.map((_, i) => i))
    setFinished(true)
    setHits((h) => h + 1)
    speak(`You revealed ${scene.name}!`)
    // Long enough to see the whole picture; the hub's celebration takes over.
    later(() => onComplete(total), 2500)
  }

  const check = () => {
    if (!current || locked.current || !input.trim()) return
    locked.current = true
    const word = current.word
    const ok = input.trim().toLowerCase() === word.toLowerCase()

    if (ok) {
      const gained = misses === 0 ? FIRST_TRY : SECOND_TRY
      setScore((s) => s + gained)
      setFeedback('right')
      setCheerLine(cheer.hit({ say: word }))
      setHits((h) => h + 1)
      uncover()
      later(() => advance(gained), 1300)
      return
    }

    const used = misses + 1
    setMisses(used)
    if (used >= TRIES) {
      // Never stuck: show the word, say its letters, and lift its tiles anyway.
      setFeedback('shown')
      setInput(word.toLowerCase())
      cheer.miss({ say: `It was ${word}. ${spellOut(word)}.` })
      uncover()
      later(() => advance(0), 2600)
      return
    }

    setFeedback('nearly')
    setCheerLine(cheer.miss({ say: `Listen again: ${word}` }))
    // The wrong spelling doesn't stay up to be copied over.
    later(() => {
      setFeedback(null)
      setInput('')
      locked.current = false
      inputRef.current?.focus()
    }, 1100)
  }

  if (finished) {
    return (
      <div className="mystery-picture">
        <div className="mp-header">
          <div className="mp-title">🖼️ Mystery Picture</div>
          <div className="mp-stats">
            <div className="mp-stat"><span>Score</span><strong>{score}</strong></div>
          </div>
        </div>
        <div className="mp-grid revealed">
          <Burst trigger={hits} />
          {scene.tiles.map((t, i) => (
            <div key={i} className="mp-tile shown">{t}</div>
          ))}
        </div>
        <div className="mp-win" role="status">
          🎉 You revealed <strong>{scene.name}</strong>!
        </div>
      </div>
    )
  }

  const clue = current.meaning ? maskClue(current.meaning.split('.')[0], current.word) : ''

  return (
    <div className="mystery-picture">
      <div className="mp-header">
        <div className="mp-title">🖼️ Mystery Picture</div>
        <div className="mp-stats">
          <div className="mp-stat"><span>Word</span><strong>{index + 1}/{words.length}</strong></div>
          <div className="mp-stat"><span>Score</span><strong>{score}</strong></div>
          <div className="mp-stat"><span>Found</span><strong>{revealed.length}/{scene.tiles.length}</strong></div>
        </div>
      </div>

      <div className="mp-grid">
        {feedback === 'right' && <Burst trigger={hits} />}
        {scene.tiles.map((t, i) => (
          <div key={i} className={`mp-tile ${revealed.includes(i) ? 'shown' : ''}`}>
            {revealed.includes(i) ? t : '❓'}
          </div>
        ))}
      </div>

      <p className="mp-hint">Spell it right to uncover more of the picture!</p>

      <div className="mp-clue">
        <button className="mp-hear" onClick={() => speak(current.word)}>🔊 Hear it again</button>
        {clue && <p className="mp-meaning">Clue: {clue}</p>}
      </div>

      <div className="mp-answer">
        <SpellingInput
          ref={inputRef}
          className={`mp-input ${feedback ?? ''}`}
          value={input}
          onChange={(e) => {
            if (!locked.current) setInput(e.target.value)
          }}
          onKeyPress={(e) => e.key === 'Enter' && check()}
          placeholder="Type the word..."
          readOnly={feedback !== null}
          autoFocus
        />
        <button className="mp-btn" onClick={check} disabled={!input.trim() || feedback !== null}>Uncover!</button>
      </div>

      <div className="mp-tries" aria-label={`${TRIES - misses} tries left on this word`}>
        {Array.from({ length: TRIES }).map((_, i) => (
          <span key={i} className={i < TRIES - misses ? 'on' : 'off'} aria-hidden>💛</span>
        ))}
      </div>

      {feedback === 'nearly' && <div className="mp-flash nearly">{cheerLine} Listen again and have another go 👂</div>}
      {feedback === 'shown' && (
        <div className="mp-flash shown">It was “{current.word}” — a piece comes off anyway! 🧩</div>
      )}
      {feedback === 'right' && <div className="mp-flash ok">🎉 {cheerLine} Another piece revealed ✨</div>}
    </div>
  )
}

export default MysteryPicture
