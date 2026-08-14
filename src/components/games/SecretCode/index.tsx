import React, { useMemo, useState } from 'react'
import { wordBank, Word } from '../../../services/wordBank'
import { useAudio } from '../../../contexts/AudioContext'
import { shuffle } from '../shared/wordTricks'
import './SecretCode.css'

interface SecretCodeProps {
  onComplete: (score: number) => void
  words?: Word[]
  rounds?: number
}

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.split('')
const codeFor = (ch: string) => ALPHABET.indexOf(ch) + 1 // a=1 ... z=26

/** Crack the number code to reveal the secret word. */
const SecretCode: React.FC<SecretCodeProps> = ({ onComplete, words: providedWords, rounds = 5 }) => {
  const { speak } = useAudio()

  const words = useMemo<Word[]>(() => {
    const pool = providedWords && providedWords.length > 0 ? providedWords : wordBank.getRandomWords(40)
    return shuffle(pool)
      .filter((w) => /^[a-z]+$/i.test(w.word) && w.word.length >= 3 && w.word.length <= 8)
      .slice(0, rounds)
  }, [providedWords, rounds])

  const [index, setIndex] = useState(0)
  const [built, setBuilt] = useState('')
  const [score, setScore] = useState(0)
  const [cracked, setCracked] = useState(0)
  const [status, setStatus] = useState<'working' | 'right' | 'wrong'>('working')
  const [showLegend, setShowLegend] = useState(false)

  const current = words[index]
  const answer = (current?.word || '').toLowerCase()

  if (!current) {
    return (
      <div className="secret-code">
        <p className="sk-empty">No codes to crack yet — learn a few words first! 🔐</p>
        <button className="sk-btn" onClick={() => onComplete(0)}>Back to Games</button>
      </div>
    )
  }

  const submit = () => {
    if (status !== 'working') return
    if (built.toLowerCase() === answer) {
      const points = 25
      setScore((s) => s + points)
      setCracked((c) => c + 1)
      setStatus('right')
      speak(`Code cracked! ${current.word}`)
      setTimeout(() => {
        if (index < words.length - 1) {
          setIndex((i) => i + 1)
          setBuilt('')
          setStatus('working')
        } else {
          onComplete(score + points)
        }
      }, 1400)
    } else {
      setStatus('wrong')
      setTimeout(() => setStatus('working'), 900)
    }
  }

  const tapLetter = (ch: string) => {
    if (status !== 'working' || built.length >= answer.length) return
    setBuilt((b) => b + ch)
  }

  return (
    <div className="secret-code">
      <div className="sk-header">
        <div className="sk-title">🔐 Secret Code</div>
        <div className="sk-stats">
          <div className="sk-stat"><span>Code</span><strong>{index + 1}/{words.length}</strong></div>
          <div className="sk-stat"><span>Score</span><strong>{score}</strong></div>
          <div className="sk-stat"><span>Cracked</span><strong>🗝️ {cracked}</strong></div>
        </div>
      </div>

      <p className="sk-brief">Crack the code! Each number is a letter: <strong>A=1, B=2, C=3…</strong></p>

      <div className="sk-code">
        {answer.split('').map((ch, i) => (
          <div key={i} className="sk-chip">
            <span className="sk-num">{codeFor(ch)}</span>
            <span className={`sk-solved ${built[i] ? 'filled' : ''}`}>{built[i]?.toUpperCase() || '?'}</span>
          </div>
        ))}
      </div>

      <div className="sk-actions">
        <button className="sk-btn ghost" onClick={() => setBuilt((b) => b.slice(0, -1))} disabled={!built}>⬅ Undo</button>
        <button className="sk-btn" onClick={submit} disabled={built.length !== answer.length}>🗝️ Crack it!</button>
        <button className="sk-btn ghost" onClick={() => setShowLegend((s) => !s)}>
          {showLegend ? 'Hide key' : '🔑 Show key'}
        </button>
      </div>

      {showLegend && (
        <div className="sk-legend">
          {ALPHABET.map((ch, i) => (
            <span key={ch} className="sk-legend-item"><b>{ch.toUpperCase()}</b>={i + 1}</span>
          ))}
        </div>
      )}

      <div className="sk-keys">
        {ALPHABET.map((ch) => (
          <button key={ch} className="sk-key" onClick={() => tapLetter(ch)} disabled={status !== 'working'}>
            <span className="sk-key-letter">{ch.toUpperCase()}</span>
            <span className="sk-key-num">{codeFor(ch)}</span>
          </button>
        ))}
      </div>

      {status === 'right' && <div className="sk-flash ok">🎉 Code cracked — it was “{current.word}”!</div>}
      {status === 'wrong' && <div className="sk-flash bad">Not the secret word — check the numbers again 🔍</div>}
    </div>
  )
}

export default SecretCode
