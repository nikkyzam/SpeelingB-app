import { beforeEach, describe, expect, it } from 'vitest'
import { addFamilyOffer, getFamilyRewards, removeFamilyOffer, requestFamilyReward, settleFamilyRequest } from '@/services/rewards/FamilyRewards'
import { PointsService } from '@/services/rewards/PointsService'
import { buyItem, returnItem, WARDROBE } from '@/services/buddy/wardrobe'
import BuddyService from '@/services/buddy/BuddyService'

beforeEach(() => localStorage.clear())

describe('family reward requests', () => {
  it('has no default real-world promises and charges only after approval, once', () => {
    expect(getFamilyRewards().offers).toEqual([])
    addFamilyOffer('Choose a family game', 25)
    const offer = getFamilyRewards().offers[0]
    expect(requestFamilyReward(offer.id)).toBe(true)
    expect(requestFamilyReward(offer.id)).toBe(false)
    expect(PointsService.getPoints().availablePoints).toBe(100)
    const request = getFamilyRewards().requests[0]
    expect(request.status).toBe('waiting')
    expect(settleFamilyRequest(request.requestId, 'approve')).toBe(true)
    expect(settleFamilyRequest(request.requestId, 'approve')).toBe(false)
    expect(PointsService.getPoints().availablePoints).toBe(75)
    expect(settleFamilyRequest(request.requestId, 'cancel')).toBe(true)
    expect(settleFamilyRequest(request.requestId, 'cancel')).toBe(false)
    expect(PointsService.getPoints().availablePoints).toBe(100)
    expect(PointsService.getPoints().totalPoints).toBe(100)
  })

  it('rechecks affordability at approval and prevents requests for removed offers', () => {
    addFamilyOffer('Picnic', 100)
    const offer = getFamilyRewards().offers[0]
    requestFamilyReward(offer.id)
    buyItem(WARDROBE[0])
    expect(settleFamilyRequest(getFamilyRewards().requests[0].requestId, 'approve')).toBe(false)
    expect(getFamilyRewards().requests[0].status).toBe('waiting')
    removeFamilyOffer(offer.id)
    expect(requestFamilyReward(offer.id)).toBe(false)
  })

  it('does not let children cancel rewards after they are received', () => {
    addFamilyOffer('Family game', 10)
    requestFamilyReward(getFamilyRewards().offers[0].id)
    const id = getFamilyRewards().requests[0].requestId
    settleFamilyRequest(id, 'approve')
    settleFamilyRequest(id, 'received')
    expect(settleFamilyRequest(id, 'cancel')).toBe(false)
    expect(PointsService.getPoints().availablePoints).toBe(90)
  })
})

it('a buddy purchase visibly equips, cannot double-charge, and can be undone once', () => {
  const item = WARDROBE[0]
  expect(buyItem(item)).toBe(true)
  expect(BuddyService.get().equipped[item.slot]).toBe(item.id)
  expect(buyItem(item)).toBe(false)
  expect(returnItem(item.id)).toBe(true)
  expect(returnItem(item.id)).toBe(false)
  expect(BuddyService.isOwned(item.id)).toBe(false)
  expect(BuddyService.get().equipped[item.slot]).toBeUndefined()
  expect(PointsService.getPoints().availablePoints).toBe(100)
})

it('returns stars for unsupported old shop items only once without inflating learning totals', () => {
  PointsService.spendPoints(50, { id: 'double-points', name: 'Double Points', cost: 50, category: 'powerup', rarity: 'rare', unlocked: true, description: '' })
  expect(PointsService.refundUnsupportedItems()).toBe(50)
  expect(PointsService.refundUnsupportedItems()).toBe(0)
  expect(PointsService.getPoints().availablePoints).toBe(100)
  expect(PointsService.getPoints().totalPoints).toBe(100)
})
