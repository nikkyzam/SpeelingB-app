/**
 * A different game to try each day, and a nudge towards the ones never opened.
 *
 * With thirty-odd games a child plays their favourite two and never learns
 * that Word Fishing exists. Both picks here are deliberate rather than random:
 * the Game of the Day is derived from the date, so every child sees the same
 * one and it cannot re-roll itself on a page refresh, and the recommendation
 * after a game prefers something from a different corner of the collection.
 */

/**
 * A small stable hash. Not cryptographic — it only has to spread dates evenly
 * and give the same answer on every device, which `Math.random` cannot.
 */
const hashDate = (key: string): number => {
  let h = 2166136261
  for (let i = 0; i < key.length; i++) {
    h ^= key.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return Math.abs(h)
}

/** The date key a day is chosen by — local, so it turns over at the child's midnight. */
export const dayKey = (date: Date = new Date()): string =>
  `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`

/**
 * Today's featured game.
 *
 * Chosen from the whole catalogue rather than only this child's unlocked
 * games, so two children on the same day genuinely see the same one. Whether
 * they can play it yet is a separate question the UI answers.
 *
 * `ids` is sorted first so the answer does not depend on the order the caller
 * happened to build its list in.
 */
export const pickGameOfTheDay = (ids: readonly string[], date: Date = new Date()): string | null => {
  const pool = [...new Set(ids)].sort()
  if (pool.length === 0) return null
  return pool[hashDate(dayKey(date)) % pool.length]
}

export interface RecommendableGame {
  id: string
  category: string
  unlocked: boolean
}

/**
 * What to try next, after finishing a game.
 *
 * Prefers a game never played before, from a different category to the one
 * just finished — that is what moves a child out of a rut. Falls back through
 * "unplayed, any category" and then "anything else playable", so the card
 * still has something to say to a child who has tried everything.
 *
 * Never suggests the game just played, and never suggests a locked one.
 */
export const recommendNext = (
  games: readonly RecommendableGame[],
  justPlayedId: string | null,
  playedIds: readonly string[],
  date: Date = new Date()
): string | null => {
  const played = new Set(playedIds)
  const justPlayed = games.find((g) => g.id === justPlayedId)
  const candidates = games.filter((g) => g.unlocked && g.id !== justPlayedId)
  if (candidates.length === 0) return null

  const tiers = [
    // Something new, somewhere new.
    candidates.filter((g) => !played.has(g.id) && g.category !== justPlayed?.category),
    // Something new at least.
    candidates.filter((g) => !played.has(g.id)),
    // They have played everything: send them somewhere different anyway.
    candidates.filter((g) => g.category !== justPlayed?.category),
    candidates,
  ]

  for (const tier of tiers) {
    if (tier.length === 0) continue
    // Stable within a day so the card does not flicker between renders, but
    // varied across days so it is not the same suggestion every time.
    const pool = [...tier].sort((a, b) => a.id.localeCompare(b.id))
    return pool[hashDate(`${dayKey(date)}|${justPlayedId ?? ''}`) % pool.length].id
  }
  return null
}
