/**
 * Per-game keepsakes: personal bests, how many times each game was played, and
 * which games a child has starred as a favourite.
 *
 * "Beat your own best" is the motivator that keeps a child coming back without
 * ever pitting them against anyone else — the only rival is yesterday's score.
 */

const BEST_KEY = 'game_high_scores'
const PLAYS_KEY = 'game_play_counts'
const FAVS_KEY = 'game_favorites'
const SEEN_KEY = 'game_seen_ids'
const DAILY_KEY = 'game_daily_challenge'
const GOTD_KEY = 'game_of_day_bonus'

export const GAME_STATS_EVENT = 'gameStatsUpdated'

/**
 * A medal for coming back to a game: bronze for finishing it once, silver at
 * three plays, gold at seven. Game of the Day and the daily challenge reward
 * trying many games; this rewards sticking with the ones a child loves — and
 * forty-four empty medal spots are a collection worth filling.
 */
export type Medal = 'bronze' | 'silver' | 'gold'
export const MEDAL_AT: Record<Medal, number> = { bronze: 1, silver: 3, gold: 7 }
export const MEDAL_ICON: Record<Medal, string> = { bronze: '🥉', silver: '🥈', gold: '🥇' }
export const medalFor = (plays: number): Medal | null =>
  plays >= MEDAL_AT.gold ? 'gold' : plays >= MEDAL_AT.silver ? 'silver' : plays >= MEDAL_AT.bronze ? 'bronze' : null

/** How many different games make up today's challenge. */
export const DAILY_CHALLENGE_TARGET = 3
/** Stars handed out for finishing it. */
export const DAILY_CHALLENGE_REWARD = 25

export interface DailyChallenge {
  date: string
  /** distinct games played today */
  games: string[]
  claimed: boolean
}

type ScoreMap = Record<string, number>

/**
 * Games whose scoring was rebuilt, and which version of it they are on.
 *
 * Memory Match used to score 1,500 and now scores about 200; Balloon Pop,
 * Spell Sprint and the Bible games were in the thousands too. An old best on
 * the old scale could never be beaten again, so "Beat your best!" would be a
 * promise the game can't keep. Their best is kept under `id@version` instead:
 * the old number (and an old device that still writes one) stays under the
 * plain id, where nothing reads it, and the first game on the new scale
 * starts a fresh best. Bump a game's version whenever its score scale moves.
 */
export const SCORE_SCALES: Record<string, number> = {
  'word-race': 2,
  'memory-match': 2,
  'abc-order': 2,
  'balloon-pop': 2,
  'spell-sprint': 2,
  'word-scramble': 2,
  'spelling-adventure': 2,
  'bible-trivia': 2,
  'bible-memorizer': 2,
}

/** Where a game's best lives in the saved map. */
export const bestKey = (gameId: string): string =>
  SCORE_SCALES[gameId] ? `${gameId}@${SCORE_SCALES[gameId]}` : gameId

/** A game's best on its current scale, from a saved map of bests. */
export const bestOf = (bests: Readonly<ScoreMap>, gameId: string): number => {
  const best = bests[bestKey(gameId)]
  return typeof best === 'number' && Number.isFinite(best) ? best : 0
}

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
    window.dispatchEvent(new Event(GAME_STATS_EVENT))
  } catch {
    /* a full or blocked storage shouldn't stop anyone playing */
  }
}

export interface ScoreResult {
  /** the child's best score for this game, after this play */
  best: number
  /** true when this play beat the previous best (never on a first play of 0) */
  isNewBest: boolean
  /** how many times this game has now been played */
  plays: number
}

export const GameStats = {
  getBest(gameId: string): number {
    return bestOf(read<ScoreMap>(BEST_KEY, {}), gameId)
  },

  /** Every game's best on its current scale, keyed by game id. */
  getAllBests(): ScoreMap {
    const saved = read<ScoreMap>(BEST_KEY, {})
    const out: ScoreMap = {}
    for (const [key, best] of Object.entries(saved)) {
      if (!key.includes('@') && !SCORE_SCALES[key]) out[key] = best
    }
    for (const gameId of Object.keys(SCORE_SCALES)) {
      const best = bestOf(saved, gameId)
      if (best > 0) out[gameId] = best
    }
    return out
  },

  getPlays(gameId: string): number {
    return read<ScoreMap>(PLAYS_KEY, {})[gameId] || 0
  },

  getAllPlays(): ScoreMap {
    return read<ScoreMap>(PLAYS_KEY, {})
  },

  getTotalPlays(): number {
    return Object.values(read<ScoreMap>(PLAYS_KEY, {})).reduce((a, b) => a + b, 0)
  },

  /** Record a finished game and report whether it was a personal best. */
  recordScore(gameId: string, score: number): ScoreResult {
    const bests = read<ScoreMap>(BEST_KEY, {})
    const plays = read<ScoreMap>(PLAYS_KEY, {})

    const previous = bestOf(bests, gameId)
    // A first play only counts as a "best" if it actually scored something —
    // otherwise quitting a game instantly would pop a celebration.
    const isNewBest = score > previous && score > 0

    if (isNewBest) bests[bestKey(gameId)] = score
    plays[gameId] = (plays[gameId] || 0) + 1

    write(BEST_KEY, bests)
    write(PLAYS_KEY, plays)

    return { best: Math.max(previous, score), isNewBest, plays: plays[gameId] }
  },

  // --- Favourites: a child can pin the games they love to the top ---

  getFavorites(): string[] {
    return read<string[]>(FAVS_KEY, [])
  },

  isFavorite(gameId: string): boolean {
    return this.getFavorites().includes(gameId)
  },

  toggleFavorite(gameId: string): boolean {
    const favs = this.getFavorites()
    const next = favs.includes(gameId) ? favs.filter((id) => id !== gameId) : [...favs, gameId]
    write(FAVS_KEY, next)
    return next.includes(gameId)
  },

  // --- Today's challenge: play a few different games for bonus stars ---

  getDailyChallenge(): DailyChallenge {
    const today = new Date().toDateString()
    const saved = read<DailyChallenge>(DAILY_KEY, { date: today, games: [], claimed: false })
    // A new day wipes the slate — yesterday's three games don't count today.
    return saved.date === today ? saved : { date: today, games: [], claimed: false }
  },

  /** Count a finished game towards today's challenge. */
  recordDailyPlay(gameId: string): DailyChallenge {
    const challenge = this.getDailyChallenge()
    if (!challenge.games.includes(gameId)) challenge.games.push(gameId)
    write(DAILY_KEY, challenge)
    return challenge
  },

  isDailyChallengeComplete(): boolean {
    return this.getDailyChallenge().games.length >= DAILY_CHALLENGE_TARGET
  },

  /** Claim the reward once. Returns false if it isn't earned (or already taken). */
  claimDailyChallenge(): boolean {
    const challenge = this.getDailyChallenge()
    if (challenge.claimed || challenge.games.length < DAILY_CHALLENGE_TARGET) return false
    write(DAILY_KEY, { ...challenge, claimed: true })
    return true
  },

  // --- "NEW" badges: a game is new until the child has actually opened it ---

  /** Every game the child has opened at least once. */
  /**
   * Has the Game of the Day bonus already been taken today?
   *
   * Stored as the day it was claimed rather than a boolean, so it expires on
   * its own at midnight and cannot be re-claimed by replaying the same game.
   */
  hasClaimedDailyBonus(): boolean {
    try {
      return localStorage.getItem(GOTD_KEY) === new Date().toDateString()
    } catch {
      return false
    }
  },

  /** Take today's bonus. Returns false if it was already taken. */
  claimDailyBonus(): boolean {
    if (this.hasClaimedDailyBonus()) return false
    try {
      localStorage.setItem(GOTD_KEY, new Date().toDateString())
      window.dispatchEvent(new Event(GAME_STATS_EVENT))
    } catch {
      /* a bonus that cannot be saved is still a bonus this session */
    }
    return true
  },

  getSeen(): string[] {
    return read<string[]>(SEEN_KEY, [])
  },

  /** True when this game has never been opened, so the hub can flag it as new. */
  isUnseen(gameId: string): boolean {
    return !this.getSeen().includes(gameId)
  },

  markSeen(gameId: string): void {
    const seen = read<string[]>(SEEN_KEY, [])
    if (!seen.includes(gameId)) write(SEEN_KEY, [...seen, gameId])
  },
}

export default GameStats
