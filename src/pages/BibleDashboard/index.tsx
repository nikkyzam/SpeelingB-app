import React from 'react'
import { useNavigate } from 'react-router-dom'
import BibleApiDashboard from '../../components/bible/BibleApiDashboard'
import './BibleDashboard.css'

const BibleDashboardPage: React.FC = () => {
  const navigate = useNavigate()

  const handleGameSelect = (gameId: string) => {
    // Navigate to GameCenter and trigger the game if possible, 
    // or we might need to add routes for these games.
    // For now, let's navigate to /games and we might need a way to auto-start the game.
    // Alternatively, we can add routes for these specific Bible games.
    if (gameId === 'reading') {
      navigate('/reading')
    } else if (gameId === 'trivia') {
      navigate('/games', { state: { startGame: 'bible-trivia' } })
    } else if (gameId === 'memorizer') {
      navigate('/games', { state: { startGame: 'bible-memorizer' } })
    }
  }

  return (
    <div className="bible-dashboard-page">
      <BibleApiDashboard onGameSelect={handleGameSelect} />
    </div>
  )
}

export default BibleDashboardPage
