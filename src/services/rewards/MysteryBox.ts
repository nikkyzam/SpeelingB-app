/**
 * The Daily Mystery Box — one free surprise every day.
 *
 * A gift, never a streak-threat: the box simply appears each morning and waits
 * to be opened. Prizes lean into the things a child can *see* — stars, buddy
 * snacks, and wardrobe items for their buddy — never consumable filler.
 */

import { PointsService } from './PointsService'
import BuddyService from '../buddy/BuddyService'
import { WARDROBE, WardrobeItem } from '../buddy/wardrobe'

const STATE_KEY = 'mystery_box_state'
export const MYSTERY_BOX_EVENT = 'mysteryBoxUpdated'

export interface MysteryBoxState {
  /** YYYY-MM-DD of the last day the box was opened */
  lastOpened: string | null
  /** how many boxes the child has ever opened */
  totalOpened: number
}

export type MysteryPrize =
  | { kind: 'stars'; amount: number }
  | { kind: 'snacks'; amount: number }
  | { kind: 'wardrobe'; item: WardrobeItem }

const today = (): string => new Date().toISOString().slice(0, 10)

const read = (): MysteryBoxState => {
  try {
    const raw = localStorage.getItem(STATE_KEY)
    if (!raw) return { lastOpened: null, totalOpened: 0 }
    const saved = JSON.parse(raw)
    return {
      lastOpened: typeof saved.lastOpened === 'string' ? saved.lastOpened : null,
      totalOpened: typeof saved.totalOpened === 'number' ? saved.totalOpened : 0,
    }
  } catch {
    return { lastOpened: null, totalOpened: 0 }
  }
}

const write = (state: MysteryBoxState): void => {
  try {
    localStorage.setItem(STATE_KEY, JSON.stringify(state))
    window.dispatchEvent(new Event(MYSTERY_BOX_EVENT))
  } catch {
    /* a surprise that cannot be saved is still a surprise */
  }
}

/** Weighted prize table. Wardrobe entries are re-rolled if the child owns everything. */
const rollPrize = (): MysteryPrize => {
  const unowned = WARDROBE.filter((item) => !BuddyService.isOwned(item.id))
  const roll = Math.random()

  if (roll < 0.18 && unowned.length > 0) {
    // Cheaper items show up more often — the box delights, it doesn't hand out
    // the rarest aura on day two.
    const affordable = unowned.filter((i) => i.cost <= 70)
    const pool = affordable.length > 0 ? affordable : unowned
    return { kind: 'wardrobe', item: pool[Math.floor(Math.random() * pool.length)] }
  }

  if (roll < 0.45) {
    return { kind: 'snacks', amount: 1 + Math.floor(Math.random() * 3) }
  }

  // Stars: mostly modest, occasionally a jackpot.
  const jackpot = Math.random() < 0.1
  return { kind: 'stars', amount: jackpot ? 50 : 10 + Math.floor(Math.random() * 4) * 5 }
}

/** Hand the prize to whichever system owns it. */
const grant = (prize: MysteryPrize): void => {
  switch (prize.kind) {
    case 'stars':
      PointsService.addPoints(prize.amount, 'Daily mystery box')
      window.dispatchEvent(new Event('pointsEarned'))
      break
    case 'snacks':
      BuddyService.earnSnack(prize.amount)
      break
    case 'wardrobe':
      BuddyService.own(prize.item.id)
      break
  }
}

export const MysteryBox = {
  /** Is today's box still waiting to be opened? */
  isAvailable(): boolean {
    return read().lastOpened !== today()
  },

  totalOpened(): number {
    return read().totalOpened
  },

  /**
   * Open today's box. Returns the prize, or null if today's was already taken.
   * Re-rolls nothing — the first prize of the day is the prize.
   */
  open(): MysteryPrize | null {
    if (!this.isAvailable()) return null
    const prize = rollPrize()
    grant(prize)
    const state = read()
    write({ lastOpened: today(), totalOpened: state.totalOpened + 1 })
    return prize
  },
}

export default MysteryBox
