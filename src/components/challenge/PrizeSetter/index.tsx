import React, { useEffect, useMemo, useState } from 'react'
import ChallengeService, { CHALLENGE_EVENT, PRIZE_PRESETS } from '../../../services/challenge/ChallengeService'
import { useUser } from '../../../contexts/UserContext'
import Button from '../../common/Button'
import './PrizeSetter.css'

/**
 * A grown-up putting something real on the line.
 *
 * The stars in this app already buy real rewards, so the natural stake for a
 * sibling match is the currency a family actually deals in: ice cream, a film
 * night, choosing dinner. Nothing is taken from either child — the prize comes
 * from the grown-up, and the winner is recorded so it can be honoured.
 */
const PrizeSetter: React.FC = () => {
  const { user } = useUser()
  const [tick, setTick] = useState(0)
  const [custom, setCustom] = useState('')

  useEffect(() => {
    const bump = () => setTick((t) => t + 1)
    window.addEventListener(CHALLENGE_EVENT, bump)
    return () => window.removeEventListener(CHALLENGE_EVENT, bump)
  }, [])

  const prize = useMemo(() => ChallengeService.getPrize(), [tick])
  const history = useMemo(() => ChallengeService.history().slice(0, 3), [tick])
  const setBy = user?.name || 'a grown-up'

  const put = (label: string, icon: string) => {
    ChallengeService.setPrize(label, icon, setBy)
    setCustom('')
  }

  return (
    <div className="prize-setter">
      {prize ? (
        <div className="ps-current">
          <span className="ps-current-icon" aria-hidden>{prize.icon}</span>
          <div>
            <strong>On the table: {prize.label}</strong>
            <span>The next winner takes it.</span>
          </div>
          <button className="ps-clear" onClick={() => ChallengeService.clearPrize()}>Take it off</button>
        </div>
      ) : (
        <p className="ps-none">Nothing on the table. Tap a prize to put it up for the next match.</p>
      )}

      <div className="ps-presets">
        {PRIZE_PRESETS.map((p) => (
          <button
            key={p.label}
            className={`ps-preset ${prize?.label === p.label ? 'on' : ''}`}
            onClick={() => put(p.label, p.icon)}
          >
            <span aria-hidden>{p.icon}</span>
            {p.label}
          </button>
        ))}
      </div>

      <div className="ps-custom">
        <input
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && custom.trim() && put(custom, '🎁')}
          placeholder="…or something else"
          aria-label="A prize of your own"
          maxLength={60}
        />
        <Button variant="secondary" size="small" disabled={!custom.trim()} onClick={() => put(custom, '🎁')}>
          Put it up
        </Button>
      </div>

      {history.length > 0 && (
        <div className="ps-history">
          <h4>Recent matches</h4>
          {history.map((h, i) => (
            <p key={`${h.at}-${i}`}>
              <strong>{h.winner ? `${h.winner} won` : 'A tie'}</strong> at {h.mode}
              {h.prize ? ` — owed ${h.prize}` : ''}
              <span> · {new Date(h.at).toLocaleDateString()}</span>
            </p>
          ))}
        </div>
      )}
    </div>
  )
}

export default PrizeSetter
