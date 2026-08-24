import { PointsService } from './PointsService'

/**
 * The app used to keep two separate star balances: a persisted zustand store
 * (`reward-storage`) that Home, the daily quiz and the review screen wrote to,
 * and the PointsService balance shown in the header and spent in the shop.
 *
 * Everything now uses PointsService. This folds any stars stranded in the old
 * store into the live balance exactly once, so a child who was shown "50 stars"
 * on Home yesterday still has them today.
 */

const LEGACY_KEY = 'reward-storage'
const DONE_KEY = 'legacy_stars_migrated'

export const migrateLegacyStars = (): number => {
  try {
    if (localStorage.getItem(DONE_KEY)) return 0

    const raw = localStorage.getItem(LEGACY_KEY)
    // Mark it done even with nothing to move — a fresh install shouldn't
    // re-check this forever.
    localStorage.setItem(DONE_KEY, 'true')
    if (!raw) return 0

    // zustand's persist wraps state as { state: {...}, version: n }
    const parsed = JSON.parse(raw)
    const stars = Number(parsed?.state?.heavenlyStars)
    if (!Number.isFinite(stars) || stars <= 0) return 0

    PointsService.addPoints(stars, 'Stars from earlier sessions')
    return stars
  } catch {
    // A migration is never worth breaking start-up over.
    return 0
  }
}

export default migrateLegacyStars
