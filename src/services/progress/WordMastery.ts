/**
 * How well a child knows each word, and how far they've travelled overall.
 *
 * The learning flow already records *what* has been learned and spelled. This
 * adds the two things a child can actually feel: a per-word mastery (one, two
 * or three stars) and an Explorer level that only ever goes up.
 */

const CORRECT_KEY = 'word_correct_counts'
const CHALLENGE_KEY = 'learn_daily_challenge'
const HISTORY_KEY = 'learn_history'

export const MASTERY_EVENT = 'wordMasteryUpdated'

/** Correct spellings needed before a word counts as mastered. */
const MASTERY_HITS = 3

/** 0 = not met, 1 = met it, 2 = spelled it, 3 = mastered it. */
export type MasteryLevel = 0 | 1 | 2 | 3

type CountMap = Record<string, number>

const read = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

const write = (key: string, value: unknown): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    window.dispatchEvent(new Event(MASTERY_EVENT))
  } catch {
    /* storage being unavailable must never interrupt a lesson */
  }
}

// --- Explorer levels -------------------------------------------------------

export interface Rank {
  /** XP needed to reach this rank */
  at: number
  title: string
  icon: string
}

/** Ranks a child climbs by learning, spelling and mastering words. */
export const RANKS: Rank[] = [
  { at: 0, title: 'Word Sprout', icon: '🌱' },
  { at: 120, title: 'Busy Bee', icon: '🐝' },
  { at: 300, title: 'Word Scout', icon: '🔍' },
  { at: 600, title: 'Book Buddy', icon: '📚' },
  { at: 1000, title: 'Word Ranger', icon: '🚀' },
  { at: 1600, title: 'Word Wizard', icon: '🧙' },
  { at: 2400, title: 'Spelling Champion', icon: '👑' },
  { at: 3500, title: 'Grand Speller', icon: '🏆' },
]

export interface ExplorerLevel {
  /** 1-based level number */
  level: number
  title: string
  icon: string
  xp: number
  /** xp earned inside the current rank */
  xpIntoRank: number
  /** xp the current rank spans (0 at the final rank) */
  xpForRank: number
  /** 0-1 progress towards the next rank (1 at the final rank) */
  progress: number
  next: Rank | null
}

export const levelFromXp = (xp: number): ExplorerLevel => {
  let index = 0
  for (let i = 0; i < RANKS.length; i++) {
    if (xp >= RANKS[i].at) index = i
  }
  const rank = RANKS[index]
  const next = RANKS[index + 1] || null

  const xpIntoRank = xp - rank.at
  const xpForRank = next ? next.at - rank.at : 0
  return {
    level: index + 1,
    title: rank.title,
    icon: rank.icon,
    xp,
    xpIntoRank,
    xpForRank,
    progress: next ? Math.min(1, xpIntoRank / xpForRank) : 1,
    next,
  }
}

export interface MasteryTotals {
  met: number
  spelled: number
  mastered: number
}

/** Meeting a word is worth something; spelling it is worth more; mastering most. */
export const xpFromTotals = ({ met, spelled, mastered }: MasteryTotals): number =>
  met * 10 + spelled * 15 + mastered * 25

// --- Today's learning challenge -------------------------------------------

export interface LearnChallenge {
  date: string
  /** words met today via the learn flow */
  learned: number
  /** words spelled correctly today */
  spelled: number
  claimed: boolean
}

export const LEARN_CHALLENGE_TARGET = { learned: 3, spelled: 3 }
export const LEARN_CHALLENGE_REWARD = 20

/** How many words were learned on a given day: { 'YYYY-MM-DD': count }. */
export type LearnHistory = Record<string, number>

export const WordMastery = {
  // --- day-by-day history, so a grown-up can see the shape of a week ---

  getHistory(): LearnHistory {
    return read<LearnHistory>(HISTORY_KEY, {})
  },

  /** The last `days` days, oldest first, including days with nothing on them. */
  getRecentHistory(days = 7): { date: string; label: string; count: number }[] {
    const history = this.getHistory()
    const out: { date: string; label: string; count: number }[] = []
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const key = d.toISOString().slice(0, 10)
      out.push({
        date: key,
        label: d.toLocaleDateString(undefined, { weekday: 'short' }),
        count: history[key] || 0,
      })
    }
    return out
  },

  // --- per-word ---

  /** Record one correct spelling of a word (drives the third mastery star). */
  recordCorrect(wordId: string): number {
    const counts = read<CountMap>(CORRECT_KEY, {})
    counts[wordId] = (counts[wordId] || 0) + 1
    write(CORRECT_KEY, counts)
    return counts[wordId]
  },

  getCorrectCounts(): CountMap {
    return read<CountMap>(CORRECT_KEY, {})
  },

  getCorrectCount(wordId: string): number {
    return this.getCorrectCounts()[wordId] || 0
  },

  /**
   * Stars for one word. The learned/spelled sets come from the learning flow so
   * this service never has to guess at another module's storage.
   */
  levelFor(wordId: string, learned: Set<string>, spelled: Set<string>): MasteryLevel {
    if (!learned.has(wordId) && !spelled.has(wordId)) return 0
    if (this.getCorrectCount(wordId) >= MASTERY_HITS) return 3
    if (spelled.has(wordId)) return 2
    return 1
  },

  /** How many words sit at each stage — the numbers behind the level bar. */
  totals(learned: string[], spelled: string[]): MasteryTotals {
    const counts = this.getCorrectCounts()
    const met = new Set([...learned, ...spelled])
    const mastered = [...met].filter((id) => (counts[id] || 0) >= MASTERY_HITS)
    return {
      met: met.size,
      spelled: new Set(spelled).size,
      mastered: mastered.length,
    }
  },

  level(learned: string[], spelled: string[]): ExplorerLevel {
    return levelFromXp(xpFromTotals(this.totals(learned, spelled)))
  },

  // --- today's challenge ---

  getChallenge(): LearnChallenge {
    const today = new Date().toDateString()
    const saved = read<LearnChallenge>(CHALLENGE_KEY, { date: today, learned: 0, spelled: 0, claimed: false })
    return saved.date === today ? saved : { date: today, learned: 0, spelled: 0, claimed: false }
  },

  recordLearned(): LearnChallenge {
    const challenge = this.getChallenge()
    challenge.learned += 1
    write(CHALLENGE_KEY, challenge)

    // Also keep a day-by-day tally for the grown-ups' report.
    const today = new Date().toISOString().slice(0, 10)
    const history = this.getHistory()
    history[today] = (history[today] || 0) + 1
    write(HISTORY_KEY, history)

    return challenge
  },

  recordSpelled(): LearnChallenge {
    const challenge = this.getChallenge()
    challenge.spelled += 1
    write(CHALLENGE_KEY, challenge)
    return challenge
  },

  isChallengeComplete(): boolean {
    const c = this.getChallenge()
    return c.learned >= LEARN_CHALLENGE_TARGET.learned && c.spelled >= LEARN_CHALLENGE_TARGET.spelled
  },

  /** Claim today's reward once. Returns false if unearned or already taken. */
  claimChallenge(): boolean {
    const challenge = this.getChallenge()
    if (challenge.claimed || !this.isChallengeComplete()) return false
    write(CHALLENGE_KEY, { ...challenge, claimed: true })
    return true
  },
}

export default WordMastery
