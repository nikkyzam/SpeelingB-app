import React, { useState, useEffect, useCallback } from 'react'
import './RhythmTap.css'

interface Beat {
  id: number
  type: 'red' | 'blue' | 'green' | 'yellow'
  position: number
  timing: number
  hit: boolean | null
}

interface RhythmTapProps {
  onComplete: (score: number) => void
}

const RhythmTap: React.FC<RhythmTapProps> = ({ onComplete }) => {
  const [beats, setBeats] = useState<Beat[]>([])
  const [score, setScore] = useState(0)
  const [combo, setCombo] = useState(0)
  const [streak, setStreak] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  const [accuracy, setAccuracy] = useState(100)
  const [isActive, setIsActive] = useState(true)
  const [nextBeatId, setNextBeatId] = useState(1)
  const [musicPlaying, setMusicPlaying] = useState(false)

  const colors: Record<string, { emoji: string; sound: string }> = {
    red: { emoji: '🔴', sound: 'C4' },
    blue: { emoji: '🔵', sound: 'D4' },
    green: { emoji: '🟢', sound: 'E4' },
    yellow: { emoji: '🟡', sound: 'F4' }
  }

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)

      // Generate new beat every 0.8-1.5 seconds
      if (Math.random() < 0.3) {
        generateBeat()
      }

      moveBeats()

      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && isActive) {
      endGame()
    }
  }, [timeLeft, isActive])

  const generateBeat = () => {
    const types: ('red' | 'blue' | 'green' | 'yellow')[] = ['red', 'blue', 'green', 'yellow']
    const type = types[Math.floor(Math.random() * types.length)]

    const newBeat: Beat = {
      id: nextBeatId,
      type,
      position: 100,
      timing: Date.now(),
      hit: null
    }

    setBeats(prev => [...prev, newBeat])
    setNextBeatId(prev => prev + 1)
  }

  const moveBeats = () => {
    setBeats(prev =>
      prev.map(beat => {
        const newPosition = beat.position - 2
        if (newPosition < -20 && beat.hit === null) {
          // Missed beat
          setCombo(0)
          return { ...beat, position: newPosition, hit: false }
        }
        return { ...beat, position: newPosition }
      }).filter(beat => beat.position > -50)
    )
  }

  const handleBeatClick = (beat: Beat) => {
    if (!isActive || beat.hit !== null) return

    const distance = Math.abs(beat.position - 50) // Target zone at position 50
    const isPerfect = distance < 10
    const isGood = distance < 25

    if (isPerfect || isGood) {
      const points = isPerfect ? 100 : 50
      const newScore = score + points + (combo * 10)
      const newCombo = combo + 1
      const newStreak = streak + 1

      setScore(newScore)
      setCombo(newCombo)
      setStreak(newStreak)

      // Play sound based on beat type
      playSound(colors[beat.type].sound)

      // Update beat
      setBeats(prev => prev.map(b =>
        b.id === beat.id
          ? { ...b, hit: true, position: b.position - 5 }
          : b
      ))

      // Update accuracy
      setAccuracy(Math.round((newStreak / (newStreak + 1)) * 100))
    } else {
      setCombo(0)
      setBeats(prev => prev.map(b =>
        b.id === beat.id ? { ...b, hit: false } : b
      ))
    }
  }

  const playSound = (note: string) => {
    // Simulate sound with Web Audio API (simplified)
    console.log(`Playing note: ${note}`)
  }

  const endGame = () => {
    setIsActive(false)
    const finalScore = score + (combo * 50) + (accuracy * 10)
    setTimeout(() => onComplete(finalScore), 1000)
  }

  const startMusic = () => {
    setMusicPlaying(true)
    // Start music loop
  }

  return (
    <div className="rhythm-tap">
      <div className="game-header">
        <div className="game-title">🎵 Rhythm Tap</div>
        <div className="game-stats">
          <div className="stat">
            <span className="stat-label">Time</span>
            <span className="stat-value">{timeLeft}s</span>
          </div>
          <div className="stat">
            <span className="stat-label">Score</span>
            <span className="stat-value">{score}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Combo</span>
            <span className="stat-value combo">🔥 {combo}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Accuracy</span>
            <span className="stat-value">{accuracy}%</span>
          </div>
        </div>
      </div>

      <div className="game-instructions">
        <p>Tap the beats when they reach the target line! Follow the rhythm!</p>
        {!musicPlaying && (
          <button className="music-start-btn" onClick={startMusic}>
            🎵 Start Music
          </button>
        )}
      </div>

      <div className="rhythm-track">
        <div className="target-line" />

        <div className="beat-lane">
          {beats.map(beat => (
            <div
              key={beat.id}
              className={`beat ${beat.type} ${beat.hit === true ? 'hit' : beat.hit === false ? 'missed' : ''}`}
              style={{ left: `${beat.position}%` }}
              onClick={() => handleBeatClick(beat)}
            >
              <span className="beat-emoji">{colors[beat.type].emoji}</span>
              {beat.hit === true && <span className="hit-effect">✨</span>}
            </div>
          ))}
        </div>

        <div className="control-panel">
          {['red', 'blue', 'green', 'yellow'].map(color => (
            <button
              key={color}
              className={`beat-btn ${color}`}
              onClick={() => playSound(colors[color].sound)}
            >
              {colors[color].emoji}
            </button>
          ))}
        </div>
      </div>

      {combo > 3 && (
        <div className="combo-display">
          <div className="combo-text">
            COMBO x{combo}!
            <div className="combo-notes">
              {'🎵'.repeat(Math.min(combo, 10))}
            </div>
          </div>
        </div>
      )}

      <div className="game-footer">
        <div className="tips">
          <div className="tip">🎯 Tap when beat reaches the line</div>
          <div className="tip">✨ Perfect taps give more points</div>
          <div className="tip">🔥 Keep the combo going!</div>
        </div>
      </div>
    </div>
  )
}

export default RhythmTap
