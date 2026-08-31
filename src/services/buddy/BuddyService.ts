/**
 * The child's buddy — a creature that hatches and grows as they learn.
 *
 * Deliberately *not* a guilt machine. Nothing here decays, starves or scolds:
 * being away just means the buddy naps, and it wakes up delighted to see them.
 * A five-year-old should never open a learning app to find something sad
 * because they went on holiday.
 *
 * Snacks come from learning, not from stars, so feeding the buddy never
 * competes with the reward shop — it rewards the thing we actually want.
 */

import type { Slot } from './wardrobe'

const STATE_KEY = 'buddy_state'
export const BUDDY_EVENT = 'buddyUpdated'

export interface BuddyState {
  /** null until the child names them */
  name: string | null
  /** snacks earned by learning, spent on feeding */
  snacks: number
  /** 0-100, nudged up by feeding and playing; never decays */
  happiness: number
  /** how many times the buddy has been fed, ever */
  meals: number
  /** ISO date of the last interaction, used only to say hello */
  lastSeen: string | null
  /** highest stage reached, so an evolution is only celebrated once */
  celebratedStage: number
  /** wardrobe items bought with stars */
  owned: string[]
  /** what the buddy is currently wearing, one item per slot */
  equipped: Partial<Record<Slot, string>>
}

const DEFAULT_STATE: BuddyState = {
  name: null,
  snacks: 0,
  happiness: 60,
  meals: 0,
  lastSeen: null,
  celebratedStage: -1,
  owned: [],
  equipped: {},
}

export interface BuddyStage {
  index: number
  /** what to show when the buddy has no world mascot of its own yet */
  emoji: string | null
  label: string
  /** shown under the buddy */
  blurb: string
  /** scale applied to the world mascot, for the grown-up stages */
  scale: number
  crown: boolean
}

/**
 * Stages follow the Word Explorer level, so the buddy grows for exactly the
 * reason the child thinks it does: learning words.
 */
const STAGES: BuddyStage[] = [
  { index: 0, emoji: '🥚', label: 'Egg',       blurb: 'Something is wiggling in there…', scale: 1,    crown: false },
  { index: 1, emoji: '🐣', label: 'Hatchling', blurb: 'It hatched! Hello, little one!',  scale: 1,    crown: false },
  { index: 2, emoji: null, label: 'Little',    blurb: 'Growing fast — keep learning!',   scale: 0.75, crown: false },
  { index: 3, emoji: null, label: 'Big',       blurb: 'All grown up and very proud of you!', scale: 1, crown: false },
  { index: 4, emoji: null, label: 'Royal',     blurb: 'A royal buddy for a royal speller!',  scale: 1.1, crown: true },
]

/** Explorer level (1-based) → stage index. */
export const stageForLevel = (level: number): BuddyStage => {
  if (level <= 1) return STAGES[0]
  if (level === 2) return STAGES[1]
  if (level === 3) return STAGES[2]
  if (level <= 5) return STAGES[3]
  return STAGES[4]
}

/** Things the buddy says when tapped. Short, warm, never nagging. */
const CHEERS = [
  'You are doing brilliantly!',
  'I love learning words with you!',
  'You are my favourite speller.',
  'Wow, you are getting so clever!',
  'Shall we learn one more word?',
  'You make my day sunny!',
  'I believe in you, always.',
  'High five! Well, high wing!',
  'Every word you learn makes me bigger!',
  'You are braver than yesterday.',
]

const SILLY = [
  'I dreamt I ate a dictionary. It was a bit wordy.',
  'Do you know my favourite letter? W. It has so many legs!',
  'I tried to spell banana but I did not know when to stop. Banananana.',
  'I am not sleepy. I am just resting my eyeballs.',
  'Psst… the letter Q is never lonely. U always follows it.',
]

const read = (): BuddyState => {
  try {
    const raw = localStorage.getItem(STATE_KEY)
    if (!raw) return { ...DEFAULT_STATE }
    const saved = JSON.parse(raw)
    // Saved state from before the wardrobe existed has neither field.
    return {
      ...DEFAULT_STATE,
      ...saved,
      owned: Array.isArray(saved.owned) ? saved.owned : [],
      equipped: saved.equipped && typeof saved.equipped === 'object' ? saved.equipped : {},
    }
  } catch {
    return { ...DEFAULT_STATE }
  }
}

const write = (state: BuddyState): BuddyState => {
  try {
    localStorage.setItem(STATE_KEY, JSON.stringify(state))
    window.dispatchEvent(new Event(BUDDY_EVENT))
  } catch {
    /* a buddy that cannot be saved is still fun for this session */
  }
  return state
}

export const BuddyService = {
  get(): BuddyState {
    return read()
  },

  name(name: string): BuddyState {
    const trimmed = name.trim().slice(0, 14)
    return write({ ...read(), name: trimmed || null, lastSeen: new Date().toISOString() })
  },

  /** Learning earns snacks — the only way to get them. */
  earnSnack(count = 1): BuddyState {
    const state = read()
    return write({ ...state, snacks: Math.min(99, state.snacks + count) })
  },

  feed(): BuddyState {
    const state = read()
    if (state.snacks <= 0) return state
    return write({
      ...state,
      snacks: state.snacks - 1,
      meals: state.meals + 1,
      happiness: Math.min(100, state.happiness + 6),
      lastSeen: new Date().toISOString(),
    })
  },

  play(): BuddyState {
    const state = read()
    return write({
      ...state,
      happiness: Math.min(100, state.happiness + 2),
      lastSeen: new Date().toISOString(),
    })
  },

  /** True the first time a given stage is reached, so we only party once. */
  shouldCelebrate(stageIndex: number): boolean {
    return stageIndex > read().celebratedStage
  },

  markCelebrated(stageIndex: number): void {
    const state = read()
    if (stageIndex > state.celebratedStage) write({ ...state, celebratedStage: stageIndex })
  },

  /** Was the buddy napping? (Purely so it can say "I missed you!") */
  daysAway(): number {
    const last = read().lastSeen
    if (!last) return 0
    return Math.floor((Date.now() - new Date(last).getTime()) / 86_400_000)
  },

  // --- wardrobe ---

  /** Record an item as bought (the stars are spent by the wardrobe service). */
  own(itemId: string): BuddyState {
    const state = read()
    if (state.owned.includes(itemId)) return state
    return write({ ...state, owned: [...state.owned, itemId] })
  },

  isOwned(itemId: string): boolean {
    return read().owned.includes(itemId)
  },

  /** Wear an item, or pass null to take that slot off. */
  equip(slot: Slot, itemId: string | null): BuddyState {
    const state = read()
    const equipped = { ...state.equipped }
    if (itemId) equipped[slot] = itemId
    else delete equipped[slot]
    return write({ ...state, equipped, lastSeen: new Date().toISOString() })
  },

  cheer(): string {
    return CHEERS[Math.floor(Math.random() * CHEERS.length)]
  },

  joke(): string {
    return SILLY[Math.floor(Math.random() * SILLY.length)]
  },
}

export default BuddyService
