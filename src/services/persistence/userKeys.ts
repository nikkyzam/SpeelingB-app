/**
 * The one list of what the app keeps in localStorage, and who it belongs to.
 *
 * Almost everything stored is about ONE child: their buddy, their stars, their
 * review schedule, their high scores. On a shared tablet that data must be
 * cleared when they sign out and must never be shown to the next child who
 * signs in. It should also follow the child to another device.
 *
 * Before this file existed, logout cleared a hand-typed list of twelve keys
 * and sync carried four. Every feature added since then leaked: the buddy a
 * child named on Monday greeted their sibling on Tuesday.
 *
 * Adding a key here is what makes a new feature safe. A test scans the source
 * for localStorage writes and fails if it finds one that is not registered.
 */

/** Keys that belong to the signed-in child. Cleared on sign-out and account
 *  switch, and carried to their other devices. */
export const USER_KEYS = [
  // identity
  'user',
  'user-storage',

  // learning
  'learningProgress',
  'progress-storage',
  'word_review_schedule',
  'word_correct_counts',
  'learn_history',
  'learn_daily_challenge',
  'word_of_day_collected',
  'explorer_level_seen',
  'streak_milestone_seen',

  // stars and rewards
  'kids_spelling_points',
  'kids_spelling_purchase_history',
  'kids_spelling_streak',
  'kids_spelling_badges',
  'reward-storage',
  'legacy_stars_migrated',
  'last_points_reset',
  'last_badge_count',
  'prizeWheelLastSpin',
  'mystery_box_state',

  // the buddy — the one that was noticed
  'buddy_state',

  // the trophy shelf
  'trophy_case',

  // games
  'game_high_scores',
  'game_play_counts',
  'game_favorites',
  'game_seen_ids',
  'game_daily_challenge',
  'game_of_day_bonus',
  'bee_tournament_best',
  'games_played',
  'current_combo',
  'word_hunt_state',
  'silly_sentences_state',

  // two children on one device, and what a grown-up put up for it
  'challenge_prize',
  'challenge_results',

  // daily counters
  'total_words_spelled',
  'daily_words_spelled',
  'daily_goals_completed',
  'total_quizzes_completed',
  'lastDailyReset',
  'last_daily_reset',

  // a child's chosen world is theirs, not the tablet's
  'world',
  'worldChosen',

  'bible_favorites',

  // legacy keys still cleared for older installs
  'streak',
  'streak-storage',
  'theme',
] as const

/** Remembers which account last used this device, so a different account
 *  signing in starts from a clean slate. Device-scoped by definition. */
export const LAST_USER_KEY = 'last_user_uid'

/** Keys that belong to the device and survive a sign-out: a parent who muted
 *  the tablet did not mute one child. */
export const DEVICE_KEYS = ['audioEnabled', LAST_USER_KEY] as const

/**
 * Keys the sync already carries as typed, top-level Firestore fields
 * (progress, userData, points, rewards). They are excluded from the generic
 * bundle so there is exactly one source of truth for each.
 */
export const TYPED_SYNC_KEYS = [
  'learningProgress',
  'user',
  'user-storage',
  'kids_spelling_points',
  'reward-storage',
] as const

/** Everything else that belongs to the child, carried as an opaque bundle. */
export const BUNDLED_SYNC_KEYS: readonly string[] = USER_KEYS.filter(
  (k) => !(TYPED_SYNC_KEYS as readonly string[]).includes(k)
)

/** Remove everything that belongs to the signed-in child. Device keys and
 *  anything we do not own (Firebase's own auth entries, for one) are left. */
export const clearUserData = (): void => {
  for (const key of USER_KEYS) {
    try {
      localStorage.removeItem(key)
    } catch {
      /* storage can be unavailable; there is nothing to clear then */
    }
  }
}

/**
 * Make this device safe for `uid` to use.
 *
 * If a *different* signed-in account was here last, their data is cleared
 * first, so nothing of theirs is shown to — or uploaded as — this child.
 * If nobody was here (a fresh install, or the last person signed out), local
 * data is kept: that is how a child who played as a guest keeps their progress
 * when they sign up.
 *
 * Returns true when a previous account's data was cleared.
 */
export const prepareDeviceFor = (uid: string): boolean => {
  let previous: string | null = null
  try {
    previous = localStorage.getItem(LAST_USER_KEY)
  } catch {
    /* fall through: treat as nobody */
  }
  const switched = previous !== null && previous !== uid
  if (switched) clearUserData()
  try {
    localStorage.setItem(LAST_USER_KEY, uid)
  } catch {
    /* ignore */
  }
  return switched
}

/** Forget who was here. Called on sign-out, after their data is cleared. */
export const forgetDeviceUser = (): void => {
  try {
    localStorage.removeItem(LAST_USER_KEY)
  } catch {
    /* ignore */
  }
}
