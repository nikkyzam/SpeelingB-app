import React, { useState, useEffect, useRef } from 'react'
import './PhysicsPuzzle.css'

interface Ball {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  color: string
  target: boolean
}

interface Obstacle {
  id: number
  x: number
  y: number
  width: number
  height: number
  type: 'rectangle' | 'triangle' | 'circle'
  color: string
  radius?: number
}

interface PhysicsPuzzleProps {
  onComplete: (score: number) => void
}

const PhysicsPuzzle: React.FC<PhysicsPuzzleProps> = ({ onComplete }) => {
  const [balls, setBalls] = useState<Ball[]>([
    { id: 1, x: 100, y: 100, vx: 0, vy: 0, radius: 20, color: '#FF6B6B', target: true }
  ])
  const [obstacles, setObstacles] = useState<Obstacle[]>([])
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [shots, setShots] = useState(0)
  const [power, setPower] = useState(50)
  const [angle, setAngle] = useState(45)
  const [gameActive, setGameActive] = useState(true)
  const [message, setMessage] = useState('')

  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    generateLevel()
  }, [level])

  useEffect(() => {
    if (gameActive) {
      const animationId = requestAnimationFrame(updatePhysics)
      return () => cancelAnimationFrame(animationId)
    }
  }, [gameActive])

  const generateLevel = () => {
    const newObstacles: Obstacle[] = []

    switch(level) {
      case 1:
        newObstacles.push(
          { id: 1, x: 300, y: 200, width: 100, height: 20, type: 'rectangle', color: '#4ECDC4' },
          { id: 2, x: 500, y: 300, width: 20, height: 100, type: 'rectangle', color: '#FFD166' }
        )
        break
      case 2:
        newObstacles.push(
          { id: 1, x: 250, y: 150, width: 80, height: 20, type: 'rectangle', color: '#4ECDC4' },
          { id: 2, x: 400, y: 250, width: 20, height: 80, type: 'rectangle', color: '#FFD166' },
          { id: 3, x: 550, y: 200, radius: 40, type: 'circle', color: '#06D6A0', width: 0, height: 0 }
        )
        break
      case 3:
        newObstacles.push(
          { id: 1, x: 200, y: 100, width: 60, height: 20, type: 'rectangle', color: '#4ECDC4' },
          { id: 2, x: 350, y: 180, width: 20, height: 60, type: 'rectangle', color: '#FFD166' },
          { id: 3, x: 450, y: 120, radius: 30, type: 'circle', color: '#06D6A0', width: 0, height: 0 },
          { id: 4, x: 600, y: 220, width: 100, height: 20, type: 'rectangle', color: '#118AB2' }
        )
        break
    }

    setObstacles(newObstacles)
    setBalls([{ id: 1, x: 100, y: 100, vx: 0, vy: 0, radius: 20, color: '#FF6B6B', target: true }])
    setShots(0)
    setMessage(`Level ${level} - Launch the ball to reach the target!`)
  }

  const updatePhysics = () => {
    setBalls(prev => prev.map(ball => {
      let newX = ball.x + ball.vx
      let newY = ball.y + ball.vy
      let newVx = ball.vx
      let newVy = ball.vy

      // Gravity
      newVy += 0.5

      // Friction
      newVx *= 0.99
      newVy *= 0.99

      // Boundary collision
      if (canvasRef.current) {
        if (newX - ball.radius < 0 || newX + ball.radius > canvasRef.current.width) {
          newVx = -newVx * 0.8
          newX = newX < ball.radius ? ball.radius : canvasRef.current.width - ball.radius
        }
        if (newY - ball.radius < 0 || newY + ball.radius > canvasRef.current.height) {
          newVy = -newVy * 0.8
          newY = newY < ball.radius ? ball.radius : canvasRef.current.height - ball.radius
        }
      }

      // Obstacle collision
      obstacles.forEach(obstacle => {
        if (obstacle.type === 'rectangle') {
          const closestX = Math.max(obstacle.x, Math.min(newX, obstacle.x + obstacle.width))
          const closestY = Math.max(obstacle.y, Math.min(newY, obstacle.y + obstacle.height))

          const distanceX = newX - closestX
          const distanceY = newY - closestY
          const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY)

          if (distance < ball.radius) {
            // Collision response
            const normalX = distanceX / distance
            const normalY = distanceY / distance

            newVx = -normalX * Math.abs(newVx) * 0.8
            newVy = -normalY * Math.abs(newVy) * 0.8

            // Move ball out of obstacle
            newX += normalX * (ball.radius - distance)
            newY += normalY * (ball.radius - distance)
          }
        } else if (obstacle.type === 'circle' && obstacle.radius !== undefined) {
          const dx = newX - obstacle.x
          const dy = newY - obstacle.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < ball.radius + obstacle.radius) {
            // Collision response
            const normalX = dx / distance
            const normalY = dy / distance

            newVx = -normalX * Math.abs(newVx) * 0.8
            newVy = -normalY * Math.abs(newVy) * 0.8

            // Move ball out of circle
            const overlap = ball.radius + obstacle.radius - distance
            newX += normalX * overlap
            newY += normalY * overlap
          }
        }
      })

      // Check if ball reached target (right side)
      if (newX > 750 && ball.target) {
        handleLevelComplete()
      }

      return {
        ...ball,
        x: newX,
        y: newY,
        vx: newVx,
        vy: newVy
      }
    }))
  }

  const launchBall = () => {
    if (!gameActive || shots >= 3) return

    const radians = (angle * Math.PI) / 180
    const velocity = power / 5

    setBalls(prev => prev.map(ball => ({
      ...ball,
      vx: Math.cos(radians) * velocity,
      vy: -Math.sin(radians) * velocity
    })))

    setShots(prev => prev + 1)
    setMessage(`Shot ${shots + 1} of 3`)
  }

  const handleLevelComplete = () => {
    const shotsBonus = (4 - shots) * 50
    const levelBonus = level * 100
    const points = 200 + shotsBonus + levelBonus

    setScore(prev => prev + points)
    setMessage(`Perfect! +${points} points`)

    setTimeout(() => {
      if (level < 3) {
        setLevel(prev => prev + 1)
      } else {
        endGame()
      }
    }, 2000)
  }

  const endGame = () => {
    setGameActive(false)
    const finalScore = score + (level * 200)
    setTimeout(() => onComplete(finalScore), 2000)
  }

  const renderGame = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw target
    ctx.fillStyle = '#FFD700'
    ctx.fillRect(750, 150, 50, 200)
    ctx.fillStyle = '#000'
    ctx.font = '16px Arial'
    ctx.fillText('TARGET', 755, 250)

    // Draw obstacles
    obstacles.forEach(obstacle => {
      ctx.fillStyle = obstacle.color
      if (obstacle.type === 'rectangle') {
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height)
      } else if (obstacle.type === 'circle' && obstacle.radius !== undefined) {
        ctx.beginPath()
        ctx.arc(obstacle.x, obstacle.y, obstacle.radius, 0, Math.PI * 2)
        ctx.fill()
      }
    })

    // Draw balls
    balls.forEach(ball => {
      ctx.fillStyle = ball.color
      ctx.beginPath()
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2)
      ctx.fill()

      // Draw trajectory
      if (ball.vx === 0 && ball.vy === 0) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)'
        ctx.setLineDash([5, 5])
        ctx.beginPath()
        ctx.moveTo(ball.x, ball.y)

        const radians = (angle * Math.PI) / 180
        const velocity = power / 5

        let x = ball.x
        let y = ball.y
        let vx = Math.cos(radians) * velocity
        let vy = -Math.sin(radians) * velocity

        for (let i = 0; i < 100; i++) {
          x += vx
          y += vy
          vy += 0.5
          vx *= 0.99
          vy *= 0.99

          ctx.lineTo(x, y)
        }
        ctx.stroke()
        ctx.setLineDash([])
      }
    })
  }

  useEffect(() => {
    renderGame()
  }, [balls, obstacles, angle, power])

  return (
    <div className="physics-puzzle">
      <div className="game-header">
        <div className="game-title">🎯 Physics Puzzle</div>
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
            <span className="stat-label">Shots</span>
            <span className="stat-value">{shots}/3</span>
          </div>
          <div className="stat">
            <span className="stat-label">Power</span>
            <span className="stat-value">{power}%</span>
          </div>
        </div>
      </div>

      <div className="game-instructions">
        <div className="message">{message}</div>
        <div className="hint">Launch the ball to reach the target area on the right!</div>
      </div>

      <div className="game-area">
        <canvas
          ref={canvasRef}
          width={800}
          height={400}
          className="physics-canvas"
        />
      </div>

      <div className="controls">
        <div className="control-group">
          <label>Angle: {angle}°</label>
          <input
            type="range"
            min="0"
            max="90"
            value={angle}
            onChange={(e) => setAngle(parseInt(e.target.value))}
            disabled={!gameActive}
          />
        </div>

        <div className="control-group">
          <label>Power: {power}%</label>
          <input
            type="range"
            min="10"
            max="100"
            value={power}
            onChange={(e) => setPower(parseInt(e.target.value))}
            disabled={!gameActive}
          />
        </div>

        <button
          className="launch-btn"
          onClick={launchBall}
          disabled={!gameActive || shots >= 3}
        >
          🚀 Launch Ball ({3 - shots} left)
        </button>
      </div>

      <div className="game-footer">
        <div className="tips">
          <div className="tip">🎯 Adjust angle and power for perfect shot</div>
          <div className="tip">💥 Balls bounce off obstacles</div>
          <div className="tip">✨ Fewer shots = more points!</div>
        </div>
      </div>
    </div>
  )
}

export default PhysicsPuzzle
