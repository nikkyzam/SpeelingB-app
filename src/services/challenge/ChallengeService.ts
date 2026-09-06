import type { Word } from '../wordBank'

/**
 * Two children, one device, something real on the line.
 *
 * A grown-up puts up the prize (ice cream, a film night) from the admin
 * console; the children see what they are playing for, and the result is
 * recorded so the grown-up knows who to hand it to. Nothing is taken from
 * anybody — the loser keeps every star they already had and earns more for
 * the words they spelled.
 */

export const CHALLENGE_EVENT = 'challengeUpdated'
const PRIZE_KEY = 'challenge_prize'
const RESULTS_KEY = 'challenge_results'

export interface Prize {
  /** what the grown-up is offering, in their own words */
  label: string
  icon: string
  /** who set it, for the record */
  setBy: string
  setAt: string
}

export interface MatchResult {
  mode: string
  players: [string, string]
  scores: [number, number]
  /** null when it was a tie, or a co-op round */
  winner: string | null
  prize: string | null
  at: string
}

/** Prizes a grown-up can offer with one tap, mirroring the reward shop. */
export const PRIZE_PRESETS: { label: string; icon: string }[] = [
  { label: 'Ice cream', icon: '🍦' },
  { label: 'Movie night', icon: '🎬' },
  { label: 'A trip to the park', icon: '🌳' },
  { label: 'Stay up 30 minutes late', icon: '🌙' },
  { label: 'Choose dinner', icon: '🍕' },
  { label: 'Pick the next family game', icon: '🎲' },
]

const readJson = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

const writeJson = (key: string, value: unknown): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    window.dispatchEvent(new Event(CHALLENGE_EVENT))
  } catch {
    /* the match still happened */
  }
}

/**
 * Splitting one pool of words fairly between two children of different ages.
 *
 * Only the signed-in child has a list of words they have studied, so both
 * players must draw from it — pulling bank words in for the sibling would put
 * words in front of a child that nobody has taught them, which is the thing
 * every game here is careful not to do.
 *
 * Instead the *same* pool is split by how hard each word is: the stronger
 * speller gets the long, difficult end and the younger one gets the short,
 * easy end. Both are spelling words from the household's own list, and a
 * six-year-old is not asked to beat a nine-year-old at the nine-year-old's
 * words.
 */
export type Handicap = 'easier' | 'same' | 'harder'

const hardness = (w: Word) => w.word.length * 2 + (w.difficulty ?? 1)

export const splitForPlayers = (
  pool: readonly Word[],
  handicaps: [Handicap, Handicap],
  perPlayer: number
): [Word[], Word[]] => {
  const sorted = [...pool].sort((a, b) => hardness(a) - hardness(b))
  if (sorted.length === 0) return [[], []]

  const slice = (h: Handicap): Word[] => {
    // Each band is a third of the list, but widened so a short pool still
    // fills a match rather than repeating two words.
    const third = Math.max(1, Math.floor(sorted.length / 3))
    const band =
      h === 'easier' ? sorted.slice(0, Math.max(third, perPlayer))
      : h === 'harder' ? sorted.slice(-Math.max(third, perPlayer))
      : sorted.slice(
          Math.max(0, Math.floor((sorted.length - Math.max(third, perPlayer)) / 2)),
          Math.max(0, Math.floor((sorted.length - Math.max(third, perPlayer)) / 2)) + Math.max(third, perPlayer)
        )
    const usable = band.length > 0 ? band : sorted
    const out: Word[] = []
    const shuffled = [...usable].sort(() => Math.random() - 0.5)
    for (let i = 0; i < perPlayer; i++) out.push(shuffled[i % shuffled.length])
    return out
  }

  return [slice(handicaps[0]), slice(handicaps[1])]
}

export const ChallengeService = {
  /** What a grown-up is currently offering, if anything. */
  getPrize(): Prize | null {
    const p = readJson<Prize | null>(PRIZE_KEY, null)
    return p && typeof p.label === 'string' && p.label.trim() ? p : null
  },

  setPrize(label: string, icon: string, setBy: string): Prize | null {
    const clean = label.trim()
    if (!clean) {
      this.clearPrize()
      return null
    }
    const prize: Prize = { label: clean, icon: icon || '🎁', setBy, setAt: new Date().toISOString() }
    writeJson(PRIZE_KEY, prize)
    return prize
  },

  clearPrize(): void {
    try {
      localStorage.removeItem(PRIZE_KEY)
      window.dispatchEvent(new Event(CHALLENGE_EVENT))
    } catch {
      /* ignore */
    }
  },

  /**
   * Record a finished match. The prize is recorded with it and then cleared —
   * it has been won, so it should not still be on offer for the next match.
   */
  record(result: Omit<MatchResult, 'at' | 'prize'>): MatchResult {
    const prize = this.getPrize()
    const full: MatchResult = {
      ...result,
      prize: result.winner && prize ? `${prize.icon} ${prize.label}` : null,
      at: new Date().toISOString(),
    }
    const history = [full, ...readJson<MatchResult[]>(RESULTS_KEY, [])].slice(0, 20)
    writeJson(RESULTS_KEY, history)
    if (result.winner && prize) this.clearPrize()
    return full
  },

  /** Recent matches, newest first — the grown-up's record of who won what. */
  history(): MatchResult[] {
    return readJson<MatchResult[]>(RESULTS_KEY, [])
  },

  clearHistory(): void {
    writeJson(RESULTS_KEY, [])
  },
}

export default ChallengeService
