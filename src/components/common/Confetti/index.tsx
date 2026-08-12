import React, { useEffect, useState } from 'react'
import './Confetti.css'

const Confetti: React.FC = () => {
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    // Listen for custom confetti events
    const handleConfetti = () => {
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3000)
    }

    window.addEventListener('show-confetti', handleConfetti)
    return () => window.removeEventListener('show-confetti', handleConfetti)
  }, [])

  if (!showConfetti) return null

  return (
    <div className="confetti-container">
      {Array.from({ length: 100 }).map((_, i) => (
        <div
          key={i}
          className="confetti-piece"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            backgroundColor: ['#FF6B6B', '#4ECDC4', '#FFD166', '#06D6A0', '#118AB2'][Math.floor(Math.random() * 5)],
            transform: `rotate(${Math.random() * 360}deg)`
          }}
        />
      ))}
    </div>
  )
}

export default Confetti
