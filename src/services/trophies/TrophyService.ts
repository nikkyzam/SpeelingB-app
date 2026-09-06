import { AchievementsService } from '../rewards/AchievementsService'
import BuddyService from '../buddy/BuddyService'

/**
 * Everything a child has won, and a place for it to live.
 *
 * Badges already existed but unlocked silently into a list nobody visited. A
 * trophy is the same idea given somewhere to sit: it is earned once, it keeps
 * the date it was earned, and the empty spaces around it are visible so a
 * child can see what is still out there.
 *
 * Unearned trophies show a hint and never a countdown or a deadline — the shelf
 * is meant to invite, not to nag.
 */

export const TROPHY_EVENT = 'trophyAwarded'
const STATE_KEY = 'trophy_case'

export type TrophyKind = 'cup' | 'plaque' | 'medal' | 'badge'

export interface Trophy {
  id: string
  kind: TrophyKind
  name: string
  icon: string
  /** how it was won — read aloud when a child taps it */
  story: string
  /** shown on the empty silhouette, before it is won */
  hint: string
}

export interface ShelfItem extends Trophy {
  earnedAt: string | null
}

/** Shelves, in the order the room shows them. */
export const SHELVES: { kind: TrophyKind; title: string; blurb: string }[] = [
  { kind: 'cup', title: 'Tournament Cups', blurb: 'Won in the Spelling Bee' },
  { kind: 'plaque', title: 'Word Plaques', blurb: 'For words learned' },
  { kind: 'medal', title: 'Event Medals', blurb: 'From special weeks' },
  { kind: 'badge', title: 'Buddy Badges', blurb: 'For looking after your buddy' },
]

/** Word-count milestones. Deliberately spaced so the next one is always visible. */
export const WORD_MILESTONES = [50, 100, 250, 500] as const

export const TROPHIES: Trophy[] = [
  {
    id: 'cup-bronze', kind: 'cup', name: 'Bronze Cup', icon: '🥉',
    story: 'You reached the Semi-final of the Spelling Bee.',
    hint: 'Reach the Semi-final in the Spelling Bee.',
  },
  {
    id: 'cup-silver', kind: 'cup', name: 'Silver Cup', icon: '🥈',
    story: 'You reached the Final of the Spelling Bee.',
    hint: 'Reach the Final in the Spelling Bee.',
  },
  {
    id: 'cup-gold', kind: 'cup', name: 'Golden Cup', icon: '🏆',
    story: 'You won the whole Spelling Bee — every round, all the way to the Championship word.',
    hint: 'Win the Championship word in the Spelling Bee.',
  },
  ...WORD_MILESTONES.map((n) => ({
    id: `plaque-${n}`,
    kind: 'plaque' as const,
    name: `${n} Words`,
    icon: n >= 500 ? '💎' : n >= 250 ? '🌟' : n >= 100 ? '⭐' : '📗',
    story: `You have met ${n} different words. That is a lot of words.`,
    hint: `Learn ${n} words.`,
  })),
  {
    id: 'medal-seasonal', kind: 'medal', name: 'Event Medal', icon: '🎖️',
    story: 'You learned a whole set of special words during an event week.',
    hint: 'Learn words during a special event week.',
  },
  {
    id: 'badge-named-buddy', kind: 'badge', name: 'Best Friends', icon: '🐣',
    story: 'You gave your buddy its name.',
    hint: 'Give your buddy a name.',
  },
  {
    id: 'badge-well-fed', kind: 'badge', name: 'Good Carer', icon: '🍪',
    story: 'You fed your buddy ten times. It has not gone hungry once.',
    hint: 'Feed your buddy ten times.',
  },
  {
    id: 'badge-streak-7', kind: 'badge', name: 'Seven Days', icon: '🔥',
    story: 'You came back seven days in a row.',
    hint: 'Practise seven days in a row.',
  },
]

type Case = Record<string, string> // trophy id -> ISO date earned

const read = (): Case => {
  try {
    const raw = localStorage.getItem(STATE_KEY)
    const saved = raw ? JSON.parse(raw) : null
    return saved && typeof saved === 'object' ? saved : {}
  } catch {
    return {}
  }
}

const write = (c: Case): void => {
  try {
    localStorage.setItem(STATE_KEY, JSON.stringify(c))
    window.dispatchEvent(new Event(TROPHY_EVENT))
  } catch {
    /* a trophy that cannot be saved was still won today */
  }
}

export interface TrophyTotals {
  wordsLearned: number
  streak: number
  seasonalWordsLearned: number
}

export const TrophyService = {
  /** Award a trophy. Returns false if it was already won — the date never moves. */
  award(id: string): boolean {
    if (!TROPHIES.some((t) => t.id === id)) return false
    const c = read()
    if (c[id]) return false
    c[id] = new Date().toISOString()
    write(c)
    return true
  },

  has(id: string): boolean {
    return !!read()[id]
  },

  earnedCount(): number {
    return Object.keys(read()).length
  },

  /**
   * The whole shelf: every trophy, with a date if it has been won.
   *
   * Unearned ones are returned too rather than hidden, because the empty
   * spaces are the point — a child should be able to see what is still there.
   */
  all(): ShelfItem[] {
    const c = read()
    return TROPHIES.map((t) => ({ ...t, earnedAt: c[t.id] ?? null }))
  },

  /**
   * Catch up on anything already true but never awarded.
   *
   * Milestones, buddy care and streaks are facts about the child's history, so
   * they can be checked rather than needing to have been watched for. This also
   * covers the migration from badges: a child who earned things before the room
   * existed finds them waiting on their first visit, rather than an empty shelf
   * that implies they have done nothing.
   *
   * Returns the ids awarded this time, so the room can make a fuss about them.
   */
  sync(totals: TrophyTotals): string[] {
    const won: string[] = []
    const give = (id: string) => {
      if (this.award(id)) won.push(id)
    }

    for (const n of WORD_MILESTONES) {
      if (totals.wordsLearned >= n) give(`plaque-${n}`)
    }
    if (totals.seasonalWordsLearned > 0) give('medal-seasonal')
    if (totals.streak >= 7) give('badge-streak-7')

    const buddy = BuddyService.get()
    if (buddy.name) give('badge-named-buddy')
    if ((buddy.meals ?? 0) >= 10) give('badge-well-fed')

    // Badges earned before the room existed still count towards the shelf.
    try {
      const unlocked = AchievementsService.getUnlockedBadges()
      if (unlocked.some((b) => b.requirements?.type === 'streak' && b.requirements.target >= 7)) {
        give('badge-streak-7')
      }
    } catch {
      /* badges are a bonus source; the shelf works without them */
    }

    return won
  },

  /** Reset — used only by tests. */
  clear(): void {
    write({})
  },
}

export default TrophyService
