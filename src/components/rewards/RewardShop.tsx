import React, { useEffect, useState } from 'react'
import { useRewardStore } from '../../stores/rewards/useRewardStore'
import { PointsService } from '../../services/rewards/PointsService'
import { FAMILY_REWARDS_EVENT, getFamilyRewards, requestFamilyReward, settleFamilyRequest } from '../../services/rewards/FamilyRewards'
import Wardrobe from '../buddy/Wardrobe'
import BuddyService from '../../services/buddy/BuddyService'
import Dialog from '../common/Dialog'
import { useAudio } from '../../contexts/AudioContext'
import { SPELLING_STARS, MAX_GAME_STARS } from '../../services/rewards/rules'
import './RewardShop.css'

export default function RewardShop() {
  const { heavenlyStars, loadPoints } = useRewardStore()
  const { speak } = useAudio()
  const [family, setFamily] = useState(getFamilyRewards)
  const [wardrobe, setWardrobe] = useState(false)
  const [message, setMessage] = useState('')
  useEffect(() => {
    const returned = PointsService.refundUnsupportedItems()
    if (returned) setMessage(`We returned ${returned} stars from older items that were not ready to use.`)
    loadPoints()
    const refresh = () => { setFamily(getFamilyRewards()); loadPoints() }
    window.addEventListener(FAMILY_REWARDS_EVENT, refresh)
    window.addEventListener('pointsEarned', refresh)
    return () => { window.removeEventListener(FAMILY_REWARDS_EVENT, refresh); window.removeEventListener('pointsEarned', refresh) }
  }, [loadPoints])
  return <div className="reward-shop">
    <h1>My prizes ⭐</h1><p>Choose something for your buddy, or ask for a family reward.</p>
    <p className="chip">⭐ {heavenlyStars} stars ready to use</p>
    <p role="status">{message}</p>
    <button className="btn" onClick={() => setWardrobe(true)}>🎽 Dress up my buddy</button>
    {wardrobe && <Dialog title="Buddy wardrobe" onClose={() => setWardrobe(false)}>
      <Wardrobe buddyName={BuddyService.get().name || 'My buddy'} onClose={() => setWardrobe(false)} onSay={text => { void speak(text) }} />
    </Dialog>}
    <section className="settings-section"><h2>Family rewards</h2>
      {family.offers.length === 0 && <p>Your grown-up can offer a reward in Settings. You can always dress up your buddy.</p>}
      {family.offers.map(offer => {
        const pending = family.requests.some(r => r.id === offer.id && ['waiting', 'approved'].includes(r.status))
        return <div className="card" key={offer.id}><h3>🎁 {offer.name}</h3><p>{offer.cost} stars · Your grown-up approves before stars are used.</p>
          <button className="btn" disabled={pending || heavenlyStars < offer.cost} onClick={() => {
            setMessage(requestFamilyReward(offer.id) ? 'Request saved! No stars used yet. Ask your grown-up to look.' : 'This reward is not ready to request.')
          }}>{pending ? 'Requested' : heavenlyStars < offer.cost ? `${offer.cost - heavenlyStars} more stars to go` : `Ask for ${offer.name}`}</button></div>
      })}
      {family.requests.map(r => <div className="card" key={r.requestId}><p>{r.name} · {r.status === 'waiting' ? 'Waiting for your grown-up. No stars used.' : r.status === 'approved' ? 'Approved! Ask your grown-up when it is ready.' : r.status === 'received' ? 'Received. Enjoy!' : 'Cancelled. Your stars are safe.'}</p>
        {r.status === 'waiting' && <button className="comfort-button" onClick={() => settleFamilyRequest(r.requestId, 'cancel')}>Cancel my request</button>}
      </div>)}
    </section>
    <details><summary>How stars work</summary><p>Spell a word on your own: {SPELLING_STARS} star. Finish a word game: up to {MAX_GAME_STARS} stars. The featured game can double those stars once a day. Lessons and quizzes show their own bonus when you finish.</p></details>
  </div>
}
