import { PointsService } from './PointsService'
import type { RewardItem } from '../../types/rewards'

export const FAMILY_REWARDS_EVENT = 'familyRewardsUpdated'
const KEY = 'family_rewards'
export interface FamilyOffer { id: string; name: string; cost: number }
export interface FamilyRequest extends FamilyOffer {
  requestId: string
  status: 'waiting' | 'approved' | 'received' | 'cancelled'
  purchaseId?: string
}
interface State { offers: FamilyOffer[]; requests: FamilyRequest[] }
export function getFamilyRewards(): State {
  try { const value = JSON.parse(localStorage.getItem(KEY) || '{}'); return { offers: value.offers || [], requests: value.requests || [] } }
  catch { return { offers: [], requests: [] } }
}
function write(state: State) {
  localStorage.setItem(KEY, JSON.stringify(state))
  window.dispatchEvent(new Event(FAMILY_REWARDS_EVENT))
}
export function addFamilyOffer(name: string, cost: number) {
  if (!name.trim() || !Number.isInteger(cost) || cost < 1 || cost > 10000) return false
  const state = getFamilyRewards()
  state.offers.push({ id: crypto.randomUUID(), name: name.trim().slice(0, 60), cost })
  write(state); return true
}
export function removeFamilyOffer(id: string) {
  const state = getFamilyRewards(); state.offers = state.offers.filter(o => o.id !== id); write(state)
}
export function requestFamilyReward(id: string) {
  const state = getFamilyRewards(), offer = state.offers.find(o => o.id === id)
  if (!offer || state.requests.some(r => r.id === id && (r.status === 'waiting' || r.status === 'approved'))) return false
  if (PointsService.getPoints().availablePoints < offer.cost) return false
  state.requests.unshift({ ...offer, requestId: crypto.randomUUID(), status: 'waiting' })
  write(state); return true
}
export function settleFamilyRequest(requestId: string, action: 'approve' | 'cancel' | 'received') {
  const state = getFamilyRewards(), request = state.requests.find(r => r.requestId === requestId)
  if (!request) return false
  if (action === 'approve' && request.status === 'waiting') {
    const reward: RewardItem = { id: `family-${request.requestId}`, name: request.name, cost: request.cost,
      category: 'real', description: 'Approved by your grown-up', unlocked: true, rarity: 'common' }
    if (!PointsService.spendPoints(request.cost, reward)) return false
    request.purchaseId = PointsService.getPurchaseHistory().slice(-1)[0].id
    request.status = 'approved'
  } else if (action === 'cancel' && (request.status === 'waiting' || request.status === 'approved')) {
    if (request.purchaseId && !PointsService.refundPurchase(request.purchaseId)) return false
    request.status = 'cancelled'
  } else if (action === 'received' && request.status === 'approved') request.status = 'received'
  else return false
  write(state); return true
}
