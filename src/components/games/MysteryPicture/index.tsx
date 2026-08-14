import React, { useMemo, useState } from 'react'
import { wordBank, Word } from '../../../services/wordBank'
import { useAudio } from '../../../contexts/AudioContext'
import { shuffle } from '../shared/wordTricks'
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

/** Spell each word correctly to uncover another piece of a hidden picture. */
const MysteryPicture: React.FC<MysteryPictureProps> = ({ onComplete, words: providedWords }) => {
  const { speak } = useAudio()

  const scene = useMemo(() => SCENES[Math.floor(Math.random() * SCENES.length)], [])

  const words = useMemo<Word[]>(() => {
    const pool = providedWords && providedWords.length > 0 ? providedWords : wordBank.getRandomWords(30)
    return shuffle(pool).filter((w) => /^[a-z]+$/i.test(w.word) && w.word.length >= 3).slice(0, 6)
  }, [providedWords])

  const [index, setIndex] = useState(0)
  const [input, setInput] = useState('')
  const [revealed, setRevealed] = useState<number[]>([])
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState<'right' | 'wrong' | null>(null)
  const [finished, setFinished] = useState(false)

  const current = words[index]
  const tilesPerWord = Math.ceil(scene.tiles.length / Math.max(words.length, 1))

  if (!current && !finished) {
    return (
      <div className="mystery-picture">
        <p className="mp-empty">Learn a few more words to unlock a mystery picture! 🖼️</p>
        <button className="mp-btn" onClick={() => onComplete(0)}>Back to Games</button>
      </div>
    )
  }

  const revealNext = () => {
    const hidden = scene.tiles.map((_, i) => i).filter((i) => !revealed.includes(i))
    const picks = shuffle(hidden).slice(0, tilesPerWord)
    setRevealed((r) => [...r, ...picks])
    return picks.length
  }

  const check = () => {
    if (!current || feedback) return
    const ok = input.trim().toLowerCase() === current.word.toLowerCase()
    if (ok) {
      setFeedback('right')
      const points = 20
      setScore((s) => s + points)
      revealNext()
      speak('Yes!')
      setTimeout(() => {
        setFeedback(null)
        setInput('')
        if (index < words.length - 1) {
          setIndex((i) => i + 1)
        } else {
          setRevealed(scene.tiles.map((_, i) => i)) // uncover the rest
          setFinished(true)
        }
      }, 1000)
    } else {
      setFeedback('wrong')
      setTimeout(() => setFeedback(null), 900)
    }
  }

  if (finished) {
    return (
      <div className="mystery-picture">
        <div className="mp-header">
          <div className="mp-title">🖼️ Mystery Picture</div>
        </div>
        <div className="mp-grid revealed">
          {scene.tiles.map((t, i) => (
            <div key={i} className="mp-tile shown">{t}</div>
          ))}
        </div>
        <div className="mp-win">
          🎉 You revealed <strong>{scene.name}</strong>!
        </div>
        <button className="mp-btn" onClick={() => onComplete(score + 20)}>Collect my stars ⭐</button>
      </div>
    )
  }

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
        {scene.tiles.map((t, i) => (
          <div key={i} className={`mp-tile ${revealed.includes(i) ? 'shown' : ''}`}>
            {revealed.includes(i) ? t : '❓'}
          </div>
        ))}
      </div>

      <p className="mp-hint">Spell it right to uncover more of the picture!</p>

      <div className="mp-clue">
        <button className="mp-hear" onClick={() => speak(current.word)}>🔊 Hear the word</button>
        <p className="mp-meaning">Clue: {current.meaning.split('.')[0]}</p>
      </div>

      <div className="mp-answer">
        <input
          className={`mp-input ${feedback ?? ''}`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && check()}
          placeholder="Type the word..."
          autoFocus
        />
        <button className="mp-btn" onClick={check} disabled={!input.trim()}>Uncover!</button>
      </div>

      {feedback === 'wrong' && <div className="mp-flash bad">Not quite — listen again and try! 👂</div>}
      {feedback === 'right' && <div className="mp-flash ok">Yes! Another piece revealed ✨</div>}
    </div>
  )
}

export default MysteryPicture
