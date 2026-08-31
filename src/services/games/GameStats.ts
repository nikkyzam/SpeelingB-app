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

export const GAME_STATS_EVENT = 'gameStatsUpdated'

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
    return read<ScoreMap>(BEST_KEY, {})[gameId] || 0
  },

  getAllBests(): ScoreMap {
    return read<ScoreMap>(BEST_KEY, {})
  },

  getPlays(gameId: string): number {
    return read<ScoreMap>(PLAYS_KEY, {})[gameId] || 0
  },

  getTotalPlays(): number {
    return Object.values(read<ScoreMap>(PLAYS_KEY, {})).reduce((a, b) => a + b, 0)
  },

  /** Record a finished game and report whether it was a personal best. */
  recordScore(gameId: string, score: number): ScoreResult {
    const bests = read<ScoreMap>(BEST_KEY, {})
    const plays = read<ScoreMap>(PLAYS_KEY, {})

    const previous = bests[gameId] || 0
    // A first play only counts as a "best" if it actually scored something —
    // otherwise quitting a game instantly would pop a celebration.
    const isNewBest = score > previous && score > 0

    if (isNewBest) bests[gameId] = score
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
