import { PointsService } from '../rewards/PointsService'
import { RewardItem } from '../../types/rewards'

/**
 * Things a child can buy for their buddy with the stars they earn.
 *
 * Until now every star in this app led nowhere: the shop marked an item
 * "purchased" and not one pixel changed anywhere. Stars are the reward for
 * learning, so they have to buy something a child can *see* — and the most
 * personal thing in the app is their buddy.
 */

export type Slot = 'hat' | 'face' | 'held' | 'aura'

export interface WardrobeItem {
  id: string
  name: string
  emoji: string
  slot: Slot
  cost: number
  blurb: string
}

/** Ordered cheap → dear, so there is always something just within reach. */
export const WARDROBE: WardrobeItem[] = [
  // hats
  { id: 'cap', name: 'Baseball Cap', emoji: '🧢', slot: 'hat', cost: 25, blurb: 'For very sporty buddies.' },
  { id: 'sunhat', name: 'Sun Hat', emoji: '👒', slot: 'hat', cost: 35, blurb: 'Perfect for a picnic.' },
  { id: 'tophat', name: 'Top Hat', emoji: '🎩', slot: 'hat', cost: 55, blurb: 'Terribly fancy.' },
  { id: 'scholar', name: 'Scholar Cap', emoji: '🎓', slot: 'hat', cost: 80, blurb: 'For a truly clever buddy.' },

  // face
  { id: 'specs', name: 'Smart Specs', emoji: '👓', slot: 'face', cost: 30, blurb: 'Instantly 12% wiser.' },
  { id: 'shades', name: 'Cool Shades', emoji: '🕶️', slot: 'face', cost: 50, blurb: 'Too cool for school. Nearly.' },

  // things to hold
  { id: 'balloon', name: 'Balloon', emoji: '🎈', slot: 'held', cost: 20, blurb: 'Do not let go!' },
  { id: 'lolly', name: 'Lollipop', emoji: '🍭', slot: 'held', cost: 30, blurb: 'A treat that never runs out.' },
  { id: 'teddy', name: 'Teddy', emoji: '🧸', slot: 'held', cost: 45, blurb: 'A buddy for your buddy.' },
  { id: 'wand', name: 'Magic Wand', emoji: '🪄', slot: 'held', cost: 70, blurb: 'Spells! Get it?' },

  // auras
  { id: 'sparkles', name: 'Sparkle Aura', emoji: '✨', slot: 'aura', cost: 90, blurb: 'Shimmer wherever you go.' },
  { id: 'rainbow', name: 'Rainbow Aura', emoji: '🌈', slot: 'aura', cost: 120, blurb: 'Bring the weather with you.' },
  { id: 'stars', name: 'Starshine Aura', emoji: '⭐', slot: 'aura', cost: 150, blurb: 'The rarest glow of all.' },
]

export const SLOT_LABELS: Record<Slot, string> = {
  hat: '🎩 Hats',
  face: '👓 Faces',
  held: '🎈 Hold',
  aura: '✨ Auras',
}

export const itemById = (id: string): WardrobeItem | undefined => WARDROBE.find((i) => i.id === id)

/**
 * Buy an item, spending real stars through the same service as the shop so the
 * balance, the header and the purchase history all stay in step.
 * Returns false when there aren't enough stars.
 */
export const buyItem = (item: WardrobeItem): boolean => {
  const asReward: RewardItem = {
    id: `buddy-${item.id}`,
    name: `${item.name} (buddy)`,
    description: item.blurb,
    cost: item.cost,
    category: 'avatar',
    rarity: 'common',
    icon: item.emoji,
    unlocked: true,
  }
  return PointsService.spendPoints(item.cost, asReward)
}
