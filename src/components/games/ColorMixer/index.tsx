import React, { useState, useEffect } from 'react'
import './ColorMixer.css'

interface Color {
  r: number
  g: number
  b: number
  name: string
}

interface ColorMixerProps {
  onComplete: (score: number) => void
}

const ColorMixer: React.FC<ColorMixerProps> = ({ onComplete }) => {
  const [targetColor, setTargetColor] = useState<Color>({ r: 0, g: 0, b: 0, name: '' })
  const [currentMix, setCurrentMix] = useState<Color>({ r: 0, g: 0, b: 0, name: '' })
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [timeLeft, setTimeLeft] = useState(60)
  const [attempts, setAttempts] = useState(0)
  const [perfectMatches, setPerfectMatches] = useState(0)
  const [gameActive, setGameActive] = useState(true)

  const baseColors = [
    { r: 255, g: 0, b: 0, name: 'Red' },
    { r: 0, g: 255, b: 0, name: 'Green' },
    { r: 0, g: 0, b: 255, name: 'Blue' },
    { r: 255, g: 255, b: 0, name: 'Yellow' },
    { r: 255, g: 0, b: 255, name: 'Magenta' },
    { r: 0, g: 255, b: 255, name: 'Cyan' },
    { r: 255, g: 165, b: 0, name: 'Orange' },
    { r: 128, g: 0, b: 128, name: 'Purple' }
  ]

  useEffect(() => {
    generateTargetColor()
  }, [level])

  useEffect(() => {
    if (timeLeft > 0 && gameActive) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && gameActive) {
      endGame()
    }
  }, [timeLeft, gameActive])

  const generateTargetColor = () => {
    const randomColor = {
      r: Math.floor(Math.random() * 256),
      g: Math.floor(Math.random() * 256),
      b: Math.floor(Math.random() * 256),
      name: ''
    }

    // Find closest named color
    const closestColor = baseColors.reduce((prev, curr) => {
      const prevDiff = colorDifference(randomColor, prev)
      const currDiff = colorDifference(randomColor, curr)
      return currDiff < prevDiff ? curr : prev
    })

    setTargetColor({ ...randomColor, name: closestColor.name })
    setCurrentMix({ r: 128, g: 128, b: 128, name: 'Starting Grey' })
  }

  const colorDifference = (color1: Color, color2: Color) => {
    return Math.sqrt(
      Math.pow(color1.r - color2.r, 2) +
      Math.pow(color1.g - color2.g, 2) +
      Math.pow(color1.b - color2.b, 2)
    )
  }

  const addColor = (color: Color) => {
    if (!gameActive) return

    const newMix = {
      r: Math.min(255, Math.max(0, currentMix.r + color.r / 4)),
      g: Math.min(255, Math.max(0, currentMix.g + color.g / 4)),
      b: Math.min(255, Math.max(0, currentMix.b + color.b / 4)),
      name: ''
    }

    setCurrentMix(newMix)
    setAttempts(prev => prev + 1)

    // Check match
    const difference = colorDifference(newMix, targetColor)
    if (difference < 10) {
      handlePerfectMatch()
    } else if (difference < 50) {
      handleGoodMatch(difference)
    }
  }

  const handlePerfectMatch = () => {
    const levelBonus = level * 100
    const timeBonus = Math.floor(timeLeft * 2)
    const points = 100 + levelBonus + timeBonus

    setScore(prev => prev + points)
    setPerfectMatches(prev => prev + 1)
    setLevel(prev => prev + 1)

    setTimeout(() => {
      generateTargetColor()
    }, 1000)
  }

  const handleGoodMatch = (difference: number) => {
    const points = Math.max(10, 100 - Math.floor(difference))
    setScore(prev => prev + points)
  }

  const resetMix = () => {
    setCurrentMix({ r: 128, g: 128, b: 128, name: 'Starting Grey' })
  }

  const endGame = () => {
    setGameActive(false)
    const accuracy = perfectMatches > 0 ? Math.round((perfectMatches / attempts) * 100) : 0
    const finalScore = score + (accuracy * 5)
    setTimeout(() => onComplete(finalScore), 2000)
  }

  const rgbToHex = (color: Color) => {
    const toHex = (c: number) => {
      const hex = c.toString(16)
      return hex.length === 1 ? '0' + hex : hex
    }
    return `#${toHex(color.r)}${toHex(color.g)}${toHex(color.b)}`
  }

  return (
    <div className="color-mixer">
      <div className="game-header">
        <div className="game-title">🎨 Color Mixer</div>
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
            <span className="stat-label">Perfect</span>
            <span className="stat-value">{perfectMatches}</span>
          </div>
        </div>
      </div>

      <div className="game-content">
        <div className="target-section">
          <div className="section-title">Target Color</div>
          <div
            className="color-display target-color"
            style={{ backgroundColor: rgbToHex(targetColor) }}
          >
            <div className="color-info">
              <div className="rgb-values">
                R: {targetColor.r} G: {targetColor.g} B: {targetColor.b}
              </div>
              <div className="color-name">{targetColor.name}</div>
            </div>
          </div>
        </div>

        <div className="mix-section">
          <div className="section-title">Your Mix</div>
          <div
            className="color-display current-mix"
            style={{ backgroundColor: rgbToHex(currentMix) }}
          >
            <div className="color-info">
              <div className="rgb-values">
                R: {Math.round(currentMix.r)} G: {Math.round(currentMix.g)} B: {Math.round(currentMix.b)}
              </div>
              <div className="difference">
                Difference: {Math.round(colorDifference(currentMix, targetColor))}
              </div>
            </div>
          </div>

          <button className="reset-btn" onClick={resetMix}>
            🔄 Reset Mix
          </button>
        </div>

        <div className="palette-section">
          <div className="section-title">Color Palette</div>
          <div className="palette-grid">
            {baseColors.map((color, index) => (
              <button
                key={index}
                className="color-btn"
                style={{
                  backgroundColor: rgbToHex(color),
                  border: `3px solid ${rgbToHex(color)}`
                }}
                onClick={() => addColor(color)}
                disabled={!gameActive}
              >
                <span className="color-name">{color.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="game-footer">
        <div className="instructions">
          <div className="instruction">🎯 Match the target color by mixing!</div>
          <div className="instruction">✨ Perfect match gives bonus points!</div>
          <div className="instruction">⚡ Time bonus for quick matches!</div>
        </div>
      </div>
    </div>
  )
}

export default ColorMixer
