# src/services/rewards — module notes

## Purpose and public interface
Owns a child's star balance ("Heavenly Stars"), purchase history, login-day streak, badge progress and the daily mystery box. All of it lives in localStorage and FirebaseSync carries it. `PointsService` is the single source of truth for the balance. `src/stores/rewards/useRewardStore.ts` is only an in-memory React cache of it and is not persisted.
- `PointsService`: `addPoints`, `spendPoints`, `getPoints`, `getPurchaseHistory`, `resetDailyPoints`, `STORAGE_KEY` (used by the store, `src/services/buddy/wardrobe.ts`, MysteryBox and badge unlocks)
- `AchievementsService`: `record*` methods, `getBadges`, `getUnlockedBadges`. `RewardsDataService`: `getAvailableRewards`, `getRewardCategories`, `getBadges` (the badge seed)
- `MysteryBox.isAvailable/open`, `MYSTERY_BOX_EVENT`, `MysteryPrize`; default export `migrateLegacyStars()` (called from `src/App.tsx`)

## Key files
- `PointsService.ts`: static class over `kids_spelling_points` (`UserPoints`), `kids_spelling_purchase_history` and `kids_spelling_streak`. Emits `pointsEarned` and `rewardPurchased`
- `AchievementsService.ts`: badge state in `kids_spelling_badges` plus lifetime counters (`total_words_spelled`, `total_quizzes_completed`, `games_played`, `daily_goals_completed`). Pays for and announces unlocks
- `RewardsDataService.ts`: static catalogues for shop items, badge definitions and shop tabs. `getStickerCollections`, `getDailyRewards` and `getRewardById` have no callers
- `MysteryBox.ts`: one weighted prize per day (`mystery_box_state`): stars, 1–3 buddy snacks, or a free unowned wardrobe item (items costing 70 or less are preferred)
- `migrateLegacyStars.ts`: one-time fold of the retired `reward-storage` `state.heavenlyStars` into PointsService, guarded by `legacy_stars_migrated`
- `ProgressIntegration.ts`: an older facade with award formulas (word/quiz/game/goal/bible/login); its point values are not live (see root)
- Outside the module: `src/types/rewards.ts` (`UserPoints`, `Badge`, `RewardItem`, `PurchaseHistory`) and the retired `src/stores/rewardStore.ts`

## How it talks to other modules
- Earning: the caller picks the amount and calls `useRewardStore().addStars(n)`, which runs `PointsService.addPoints`. Callers: LearnMode, WordOfTheDay, DailyQuiz, Review, GameCenter (finishing a game, the daily challenge), PrizeWheel, SiblingShowdown, SiblingChallenge, BeeTournament, SentenceMaker, WordHunt, LearningHub
- Other direct `addPoints` callers: badge unlocks (`rewardPoints`), MysteryBox and the migration. The store's `addPoints`, `addComboPoints` and `recordActivity` are reached only through the unused `src/hooks/rewards/useRewards.ts`
- Badge recording calls `AchievementsService` directly: LearnMode (`recordDailyGoalComplete`, `recordComboAchieved`), SpellMode and QuizMode (`recordWordSpelled`; SpellMode also records combos), GameCenter (`recordGamePlayed`), and `src/hooks/useStreak.ts` (`recordStreakAchieved`, fed by the learning streak, not PointsService's login streak)
- Badge readers: NextUp (the closest unearned badge), `src/components/rewards/BadgeCollection.tsx`, TrophyService (the `badge-streak-7` trophy)
- Spending: the `/rewards` shop calls `useRewardStore.purchaseReward`. The buddy Wardrobe calls `buyItem` (`src/services/buddy/wardrobe.ts`), which runs `spendPoints` with a synthetic `RewardItem` (`buddy-<id>`, category `avatar`). BuddyService records the ownership, not the purchase history
- Store cache: `useRewardStore` reads PointsService when it is imported and in `loadPoints`. It reloads on `pointsEarned` and on a cross-tab `storage` event for `PointsService.STORAGE_KEY`. It does not listen to `rewardPurchased`
- `heavenlyStars` and `addStars` are the V1 aliases for `points.availablePoints` and `addPoints`. Header, Navigation, Home and Wardrobe read `heavenlyStars`
- Outbound: MysteryBox calls `BuddyService.isOwned/earnSnack/own` and reads `WARDROBE`. Buddy writes emit `buddyUpdated`
- Events emitted: `pointsEarned` `{amount, reason, total}`, `rewardPurchased` `{reward, points}`, `badgeUnlocked` `{badge, points}`, `mysteryBoxUpdated`. All four are in FirebaseSync `CHANGE_EVENTS`, so each one calls `syncSoon`
- UI listeners: FunFx (the star burst uses `detail.amount`; badge toast), BuddyCompanion, NextUp, BadgeCollection, the MysteryBox component
- Firestore: `kids_spelling_points` is the typed `points` field, `reward-storage` is `rewards`, every other key here rides `local`. Mapping and merge rules: `src/services/persistence/CLAUDE.md`
- Admin (`src/services/admin/`) reads `points.availablePoints/spentPoints`, writes `availablePoints/totalPoints`, and falls back to `local.kids_spelling_badges` for the badge count, so renaming a `UserPoints` field needs a data migration

## Conventions and gotchas
- Change the balance through `PointsService` only. Never write `kids_spelling_points` or `heavenlyStars` directly. Components use `useRewardStore().addStars(n)`
- A store action that changes the balance must set both `points` and `heavenlyStars`, or rely on `pointsEarned`
- Spending emits no `pointsEarned`, so any direct `spendPoints` caller must then call `useRewardStore.getState().loadPoints()`. Wardrobe does
- `pointsEarned` listeners must cope with a missing `detail`: MysteryBox also dispatches a bare `Event('pointsEarned')`
- `getPoints()` is not a pure read: the first call seeds 100 stars, it advances the login streak once per `toDateString` day, and importing `useRewardStore` runs it at module load
- `updateStreak` calls back into `getPoints`. That only terminates because it writes the streak key first, so keep that order
- These writes dispatch no event and upload with the next sync: the streak, the seed, badge progress short of an unlock, counters, `current_combo`, `highestCombo`, `resetDailyPoints`. If a new write must upload promptly, dispatch a `CHANGE_EVENTS` event
- Badge definitions are copied into `kids_spelling_badges` on the first read, and the stored copy wins from then on. Editing a target, `rewardPoints` or name in `RewardsDataService.getBadges`, or adding a badge, does not reach existing children without a merge step. Unknown ids are silent no-ops
- Two progress modes: `updateBadgeProgress` adds to a running total; `setBadgeProgress` stores the best so far, clamped to the target and never decreasing (combo, streak, distinct games)
- An unlock pays `rewardPoints` through `addPoints` and fires `badgeUnlocked`, once per badge. Badge ids are string literals in `AchievementsService`. TrophyService matches `requirements.type === 'streak'` with a target of 7 or more
- Stored dates (`lastEarned`, `lastLogin`, `purchaseDate`, `dateEarned`) come back as ISO strings even though they are typed as `Date`
- Catalogue items carry no persisted owned flag: `loadRewards` rebuilds them from the catalogue, and the purchase history is the only record
- MysteryBox compares `lastOpened` with a UTC `YYYY-MM-DD` (`toISOString`). The first prize of the day is final and is never re-rolled. `open` uses `this`, so call it as `MysteryBox.open()`
- Legacy migration runs only once because of the `legacy_stars_migrated` flag (per child, synced in `local`) and because it runs at App mount, before the first sync. It deliberately leaves `reward-storage` in place (it still round-trips as `rewards`), so clearing the flag adds the old stars again
- Never import `src/stores/rewardStore.ts`. It exports the same name, `useRewardStore`, so auto-import can pick it by mistake. It also keeps a second persisted balance on `reward-storage` (default 50) that the header never shows and the migration will not fold in a second time
- `pointsToday` is reset lazily by `src/components/rewards/PointsDisplay.tsx` (`last_points_reset`), not by DailyReset

## Testing this module
- No test covers any file in `src/services/rewards/` or `useRewardStore` directly. New suites go in `__tests__/unit/services/rewards/`
- Closest coverage: `npx vitest run __tests__/unit/services/persistence/UserKeys.test.ts __tests__/unit/services/persistence/SyncBundle.test.ts __tests__/unit/services/trophies/Trophies.test.ts __tests__/unit/pages/DailyQuiz.test.tsx __tests__/unit/components/games/SiblingShowdown.test.tsx __tests__/unit/pages/GameShortcuts.test.tsx`
- `UserKeys.test.ts` scans the source and fails if this module's keys are not registered
- `SyncBundle.test.ts` covers the typed `points` round trip, an admin balance correction winning the merge, and `kids_spelling_badges` and `mystery_box_state` riding in `local`
- `Trophies.test.ts` mocks `AchievementsService` as `{ getUnlockedBadges: () => [] }`. The DailyQuiz, SiblingShowdown and GameShortcuts tests mock `@/stores/rewards/useRewardStore` as `{ addStars }` and count how many awards fire
- For direct tests: localStorage is the in-memory `vi.fn` mock from `setupTests.ts`, so call `localStorage.clear()` in `beforeEach`. Assert events with `window` listeners and use `vi.setSystemTime` for streak and mystery-box days
- For MysteryBox, also stub `Math.random` and `vi.mock('@/services/buddy/BuddyService')`
- Untested: award amounts and unlock payouts, `setBadgeProgress` clamping, `spendPoints` with too few stars, that the migration runs only once, the mystery box's daily reset and prize table, and `heavenlyStars` staying in step with the balance
