import React from 'react'
import { useNavigate } from 'react-router-dom'
import { getSeasonalEvent } from '../../../services/seasonal'
import Button from '../../common/Button'
import './SeasonalBanner.css'

/**
 * The "something special is happening right now" banner. Only appears while a
 * seasonal event is actually running — its rarity is the whole point.
 */
const SeasonalBanner: React.FC = () => {
  const navigate = useNavigate()
  const event = getSeasonalEvent()
  if (!event) return null

  return (
    <section className="seasonal-banner pop-in" aria-label={event.name}>
      <div className="seasonal-sprinkles" aria-hidden>
        {event.sprinkles.map((s, i) => (
          <span key={i} className={`seasonal-sprinkle ss${i}`}>{s}</span>
        ))}
      </div>
      <div className="seasonal-icon" aria-hidden>{event.icon}</div>
      <div className="seasonal-text">
        <h2>{event.name}</h2>
        <p>{event.tagline} Special words, here for a limited time only!</p>
      </div>
      <Button
        variant="secondary"
        icon={event.icon}
        onClick={() => navigate(`/learn?seasonal=${event.id}`)}
      >
        Learn them!
      </Button>
    </section>
  )
}

export default SeasonalBanner
