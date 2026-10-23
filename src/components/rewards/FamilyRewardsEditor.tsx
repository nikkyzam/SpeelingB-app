import React, { useEffect, useState } from 'react'
import { addFamilyOffer, FAMILY_REWARDS_EVENT, getFamilyRewards, removeFamilyOffer, settleFamilyRequest } from '../../services/rewards/FamilyRewards'
import { useRewardStore } from '../../stores/rewards/useRewardStore'

export default function FamilyRewardsEditor() {
  const [state, setState] = useState(getFamilyRewards)
  const [name, setName] = useState('')
  const [cost, setCost] = useState(25)
  const [message, setMessage] = useState('')
  const { loadPoints } = useRewardStore()
  useEffect(() => {
    const refresh = () => { setState(getFamilyRewards()); loadPoints() }
    window.addEventListener(FAMILY_REWARDS_EVENT, refresh)
    return () => window.removeEventListener(FAMILY_REWARDS_EVENT, refresh)
  }, [loadPoints])
  return <section className="settings-section">
    <h2>Family rewards</h2><p>Offer only things your family has agreed to provide. Requests do not spend stars until you approve them.</p>
    <form onSubmit={e => { e.preventDefault(); if (addFamilyOffer(name, cost)) { setName(''); setMessage('Reward added.'); } }}>
      <label>Reward name<input value={name} onChange={e => setName(e.target.value)} maxLength={60} required placeholder="Choose a family game" /></label>
      <label>Stars<input type="number" value={cost} min={1} max={10000} onChange={e => setCost(Number(e.target.value))} required /></label>
      <button className="btn">Offer this reward</button>
    </form>
    {state.offers.map(o => <p key={o.id}>{o.name} · {o.cost} stars <button className="comfort-button" onClick={() => removeFamilyOffer(o.id)}>Stop offering {o.name}</button></p>)}
    <h3>Requests</h3>
    {state.requests.length === 0 && <p>No requests yet.</p>}
    {state.requests.map(r => <div key={r.requestId} className="card">
      <p>{r.name} · {r.cost} stars · {r.status}</p>
      {r.status === 'waiting' && <button className="btn" onClick={() => setMessage(settleFamilyRequest(r.requestId, 'approve') ? 'Approved. Stars used.' : 'There are not enough stars now. You can leave this request waiting.')}>Approve and use {r.cost} stars</button>}
      {r.status === 'approved' && <button className="btn" onClick={() => settleFamilyRequest(r.requestId, 'received')}>Mark received</button>}
      {['waiting', 'approved'].includes(r.status) && <button className="comfort-button" onClick={() => settleFamilyRequest(r.requestId, 'cancel')}>{r.status === 'approved' ? 'Cancel and return stars' : 'Decline request'}</button>}
    </div>)}
    <p role="status">{message}</p>
  </section>
}
