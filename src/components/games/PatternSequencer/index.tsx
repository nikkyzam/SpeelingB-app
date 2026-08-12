import React, { useState, useEffect, useCallback } from 'react'
import './PatternSequencer.css'

interface SequenceStep {
  id: number
  active: boolean
  color: string
  sound: string
}

interface Pattern {
  id: number
  steps: boolean[]
  color: string
  emoji: string
}

interface PatternSequencerProps {
  onComplete: (score: number) => void
}

const PatternSequencer: React.FC<PatternSequencerProps> = ({ onComplete }) => {
  const [patterns, setPatterns] = useState<Pattern[]>([
    { id: 1, steps: [true, false, false, true], color: '#FF6B6B', emoji: '🔴' },
    { id: 2, steps: [false, true, true, false], color: '#4ECDC4', emoji: '🔵' },
    { id: 3, steps: [true, true, false, true], color: '#FFD166', emoji: '🟡' },
    { id: 4, steps: [false, false, true, false], color: '#06D6A0', emoji: '🟢' }
  ])

  const [sequence, setSequence] = useState<SequenceStep[]>([
    { id: 1, active: false, color: '#FF6B6B', sound: 'kick' },
    { id: 2, active: false, color: '#4ECDC4', sound: 'snare' },
    { id: 3, active: false, color: '#FFD166', sound: 'hihat' },
    { id: 4, active: false, color: '#06D6A0', sound: 'clap' }
  ])

  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [tempo, setTempo] = useState(120)
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [combo, setCombo] = useState(0)
  const [timeLeft, setTimeLeft] = useState(120)
  const [isActive, setIsActive] = useState(true)
  const [userPattern, setUserPattern] = useState<boolean[]>([])

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && isActive) {
      endGame()
    }
  }, [timeLeft, isActive])

  useEffect(() => {
    let interval: any

    if (isPlaying) {
      const stepTime = (60000 / tempo) / 4 // 16th notes
      interval = setInterval(playNextStep, stepTime)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isPlaying, tempo])

  const playNextStep = useCallback(() => {
    setCurrentStep(prev => {
      const nextStep = (prev + 1) % 4

      // Play sounds for active patterns
      patterns.forEach(pattern => {
        if (pattern.steps[nextStep]) {
          playSound(pattern.color)
        }
      })

      // Update sequence visualization
      setSequence(prevSeq =>
        prevSeq.map((step, index) => ({
          ...step,
          active: index === nextStep
        }))
      )

      return nextStep
    })
  }, [patterns])

  const playSound = (color: string) => {
    // Map colors to different sound frequencies
    let frequency = 200
    switch(color) {
      case '#FF6B6B': frequency = 261.63; break // C4
      case '#4ECDC4': frequency = 329.63; break // E4
      case '#FFD166': frequency = 392.00; break // G4
      case '#06D6A0': frequency = 493.88; break // B4
    }
    console.log(`Playing ${frequency}Hz`)
  }

  const togglePatternStep = (patternId: number, stepIndex: number) => {
    if (!isActive) return

    setPatterns(prev =>
      prev.map(pattern => {
        if (pattern.id === patternId) {
          const newSteps = [...pattern.steps]
          newSteps[stepIndex] = !newSteps[stepIndex]
          return { ...pattern, steps: newSteps }
        }
        return pattern
      })
    )

    // Add to user pattern for scoring
    setUserPattern(prev => [...prev, patternId === 1])
  }

  const checkPatterns = () => {
    // Check if patterns create a nice rhythm
    let patternScore = 0

    patterns.forEach(pattern => {
      const activeSteps = pattern.steps.filter(step => step).length
      if (activeSteps === 2) patternScore += 50 // Good rhythm
      else if (activeSteps === 1 || activeSteps === 3) patternScore += 30
      else if (activeSteps === 4) patternScore += 10 // Too busy
      else patternScore += 0 // No rhythm
    })

    // Check for syncopation (off-beat patterns)
    if (patterns.some(p => !p.steps[0] && p.steps[1])) {
      patternScore += 100 // Syncopation bonus
    }

    return patternScore
  }

  const handleLevelUp = () => {
    const patternScore = checkPatterns()
    const comboBonus = combo * 50
    const levelBonus = level * 100
    const timeBonus = Math.floor(timeLeft * 2)

    const roundScore = patternScore + comboBonus + levelBonus + timeBonus
    setScore(prev => prev + roundScore)
    setCombo(prev => prev + 1)

    if (level < 5) {
      setLevel(prev => prev + 1)
      // Add more patterns
      const newPattern: Pattern = {
        id: patterns.length + 1,
        steps: Array(4).fill(false),
        color: `#${Math.floor(Math.random()*16777215).toString(16)}`,
        emoji: ['🎹', '🥁', '🎵', '🎶', '🎺', '🎷'][Math.floor(Math.random() * 6)]
      }
      setPatterns(prev => [...prev, newPattern])
      setTempo(prev => Math.min(200, prev + 20))
    } else {
      endGame()
    }
  }

  const endGame = () => {
    setIsActive(false)
    setIsPlaying(false)
    const finalScore = score + (combo * 200) + (level * 500)
    setTimeout(() => onComplete(finalScore), 2000)
  }

  const startPlayback = () => {
    setIsPlaying(true)
  }

  const stopPlayback = () => {
    setIsPlaying(false)
    handleLevelUp()
  }

  return (
    <div className="pattern-sequencer">
      <div className="game-header">
        <div className="game-title">🎛️ Pattern Sequencer</div>
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
            <span className="stat-label">Tempo</span>
            <span className="stat-value">{tempo} BPM</span>
          </div>
          <div className="stat">
            <span className="stat-label">Combo</span>
            <span className="stat-value combo">🎵 {combo}</span>
          </div>
        </div>
      </div>

      <div className="game-instructions">
        <p>Create musical patterns! Click to toggle steps, then play your sequence!</p>
        <div className="tempo-control">
          <label>Tempo: {tempo} BPM</label>
          <input
            type="range"
            min="60"
            max="200"
            value={tempo}
            onChange={(e) => setTempo(parseInt(e.target.value))}
            disabled={!isActive}
          />
        </div>
      </div>

      <div className="sequencer-grid">
        <div className="sequence-track">
          {sequence.map((step, index) => (
            <div
              key={step.id}
              className={`sequence-step ${step.active ? 'active' : ''}`}
              style={{ backgroundColor: step.color }}
            >
              <div className="step-number">{index + 1}</div>
              <div className="step-sound">{step.sound}</div>
            </div>
          ))}
        </div>

        <div className="patterns-container">
          {patterns.map(pattern => (
            <div key={pattern.id} className="pattern-track">
              <div className="pattern-header">
                <span className="pattern-emoji">{pattern.emoji}</span>
                <span className="pattern-name">Track {pattern.id}</span>
              </div>
              <div className="pattern-steps">
                {pattern.steps.map((isActive, stepIndex) => (
                  <button
                    key={stepIndex}
                    className={`pattern-step ${isActive ? 'active' : ''} ${
                      currentStep === stepIndex ? 'current' : ''
                    }`}
                    style={{
                      backgroundColor: isActive ? pattern.color : '#444',
                      borderColor: pattern.color
                    }}
                    onClick={() => togglePatternStep(pattern.id, stepIndex)}
                    disabled={!isActive}
                  >
                    {isActive && <span className="step-indicator">●</span>}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="playback-controls">
        <button
          className="play-btn"
          onClick={isPlaying ? stopPlayback : startPlayback}
          disabled={!isActive}
        >
          {isPlaying ? '⏹️ Stop & Score' : '▶️ Play Sequence'}
        </button>

        <button
          className="level-btn"
          onClick={handleLevelUp}
          disabled={!isActive || isPlaying}
        >
          🎯 Score This Level
        </button>
      </div>

      {combo > 0 && (
        <div className="combo-display">
          <div className="combo-text">
            Pattern Combo! x{combo}
            <div className="combo-notes">
              {'🎶'.repeat(Math.min(combo, 5))}
            </div>
          </div>
        </div>
      )}

      <div className="game-progress">
        <div className="progress-section">
          <div className="progress-label">Rhythm Complexity</div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${(patterns.reduce((acc, p) => acc + p.steps.filter(s => s).length, 0) / (patterns.length * 4)) * 100}%`
              }}
            />
          </div>
          <div className="progress-text">
            Active Steps: {patterns.reduce((acc, p) => acc + p.steps.filter(s => s).length, 0)} / {patterns.length * 4}
          </div>
        </div>
      </div>

      <div className="game-footer">
        <div className="scoring-tips">
          <div className="tip">🎵 2 active steps per pattern = Best rhythm!</div>
          <div className="tip">✨ Syncopated patterns = Bonus points!</div>
          <div className="tip">⚡ Higher tempo = More challenge!</div>
        </div>
      </div>
    </div>
  )
}

export default PatternSequencer
