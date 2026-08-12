import React, { useState, useEffect } from 'react'
import './MusicComposer.css'

interface Note {
  id: number
  name: string
  emoji: string
  frequency: number
  color: string
}

interface Sequence {
  notes: string[]
  tempo: number
  pattern: string
}

interface MusicComposerProps {
  onComplete: (score: number) => void
}

const MusicComposer: React.FC<MusicComposerProps> = ({ onComplete }) => {
  const [notes, setNotes] = useState<Note[]>([
    { id: 1, name: 'Do', emoji: '🎹', frequency: 261.63, color: '#FF6B6B' },
    { id: 2, name: 'Re', emoji: '🎵', frequency: 293.66, color: '#4ECDC4' },
    { id: 3, name: 'Mi', emoji: '🎶', frequency: 329.63, color: '#FFD166' },
    { id: 4, name: 'Fa', emoji: '🎼', frequency: 349.23, color: '#06D6A0' },
    { id: 5, name: 'Sol', emoji: '🎤', frequency: 392.00, color: '#118AB2' },
    { id: 6, name: 'La', emoji: '🎧', frequency: 440.00, color: '#EF476F' },
    { id: 7, name: 'Ti', emoji: '🎺', frequency: 493.88, color: '#FF9E6D' }
  ])

  const [sequence, setSequence] = useState<string[]>([])
  const [targetSequence, setTargetSequence] = useState<Sequence | null>(null)
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [timeLeft, setTimeLeft] = useState(90)
  const [isPlaying, setIsPlaying] = useState(false)
  const [combo, setCombo] = useState(0)

  useEffect(() => {
    generateTargetSequence()
  }, [level])

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      endGame()
    }
  }, [timeLeft])

  const generateTargetSequence = () => {
    const sequenceLength = 3 + level
    const newSequence: string[] = []
    for (let i = 0; i < sequenceLength; i++) {
      const note = notes[Math.floor(Math.random() * notes.length)]
      newSequence.push(note.name)
    }

    setTargetSequence({
      notes: newSequence,
      tempo: 500 - (level * 50),
      pattern: generatePattern(newSequence)
    })
    setSequence([])
  }

  const generatePattern = (seq: string[]): string => {
    return seq.map(note => {
      switch(note) {
        case 'Do': return '🔴'
        case 'Re': return '🔵'
        case 'Mi': return '🟡'
        case 'Fa': return '🟢'
        case 'Sol': return '🟣'
        case 'La': return '🟠'
        case 'Ti': return '⚪'
        default: return '⚫'
      }
    }).join('')
  }

  const playNote = (note: Note) => {
    if (!targetSequence) return

    // Add to sequence
    const newSequence = [...sequence, note.name]
    setSequence(newSequence)

    // Play sound
    playSound(note.frequency)

    // Check sequence
    if (newSequence.length === targetSequence.notes.length) {
      checkSequence(newSequence)
    }
  }

  const playSound = (frequency: number) => {
    // Simulate sound with Web Audio API
    console.log(`Playing frequency: ${frequency}Hz`)
  }

  const checkSequence = (playerSeq: string[]) => {
    if (!targetSequence) return

    let correct = 0
    playerSeq.forEach((note, index) => {
      if (note === targetSequence.notes[index]) {
        correct++
      }
    })

    const accuracy = correct / playerSeq.length
    if (accuracy === 1) {
      // Perfect match
      const levelBonus = level * 100
      const timeBonus = Math.floor(timeLeft * 2)
      const comboBonus = combo * 50
      const points = 200 + levelBonus + timeBonus + comboBonus

      setScore(prev => prev + points)
      setCombo(prev => prev + 1)
      setLevel(prev => prev + 1)

      setTimeout(() => {
        generateTargetSequence()
      }, 1500)
    } else if (accuracy >= 0.7) {
      // Good match
      setScore(prev => prev + Math.floor(100 * accuracy))
      setCombo(0)
      setTimeout(() => {
        generateTargetSequence()
      }, 1500)
    } else {
      // Try again
      setCombo(0)
      setSequence([])
    }
  }

  const playTargetSequence = () => {
    if (!targetSequence || isPlaying) return

    setIsPlaying(true)
    let index = 0

    const playNextNote = () => {
      if (index < targetSequence.notes.length) {
        const noteName = targetSequence.notes[index]
        const note = notes.find(n => n.name === noteName)
        if (note) {
          playSound(note.frequency)
          index++
          setTimeout(playNextNote, targetSequence.tempo)
        }
      } else {
        setIsPlaying(false)
      }
    }

    playNextNote()
  }

  const endGame = () => {
    const finalScore = score + (combo * 100)
    onComplete(finalScore)
  }

  return (
    <div className="music-composer">
      <div className="game-header">
        <div className="game-title">🎼 Music Composer</div>
        <div className="game-stats">
          <div className="stat">
            <span className="stat-label">Level</span>
            <span className="stat-value">{level}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Score</span>
            <span className="stat-value">{score}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Time</span>
            <span className="stat-value">{timeLeft}s</span>
          </div>
          <div className="stat">
            <span className="stat-label">Combo</span>
            <span className="stat-value combo">🎵 {combo}</span>
          </div>
        </div>
      </div>

      <div className="game-content">
        <div className="target-section">
          <div className="section-header">
            <h3>Target Melody</h3>
            <button
              className="play-btn"
              onClick={playTargetSequence}
              disabled={isPlaying}
            >
              {isPlaying ? '▶️ Playing...' : '▶️ Play Melody'}
            </button>
          </div>

          {targetSequence && (
            <div className="melody-display">
              <div className="melody-pattern">
                {targetSequence.pattern.split('').map((emoji, index) => (
                  <span key={index} className="melody-note">
                    {emoji}
                  </span>
                ))}
              </div>
              <div className="melody-info">
                <div className="tempo">Tempo: {targetSequence.tempo}ms</div>
                <div className="length">Notes: {targetSequence.notes.length}</div>
              </div>
            </div>
          )}
        </div>

        <div className="sequence-section">
          <div className="section-header">
            <h3>Your Sequence</h3>
            <div className="sequence-length">
              {sequence.length}/{targetSequence?.notes.length || 0}
            </div>
          </div>

          <div className="player-sequence">
            {sequence.map((note, index) => (
              <div key={index} className="sequence-note">
                {note}
              </div>
            ))}
          </div>
        </div>

        <div className="keyboard-section">
          <div className="section-header">
            <h3>Musical Keyboard</h3>
          </div>

          <div className="keyboard">
            {notes.map(note => (
              <button
                key={note.id}
                className="key"
                style={{
                  backgroundColor: note.color,
                  borderColor: note.color
                }}
                onClick={() => playNote(note)}
              >
                <span className="key-name">{note.name}</span>
                <span className="key-emoji">{note.emoji}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {combo > 0 && (
        <div className="combo-display">
          <div className="combo-text">
            Melody Combo! x{combo}
          </div>
          <div className="combo-notes">
            {'🎶'.repeat(Math.min(combo, 5))}
          </div>
        </div>
      )}

      <div className="game-footer">
        <div className="instructions">
          <div className="instruction">🎹 Listen to the target melody</div>
          <div className="instruction">🎵 Recreate it using the keyboard</div>
          <div className="instruction">✨ Perfect recreations give bonus!</div>
        </div>
      </div>
    </div>
  )
}

export default MusicComposer
