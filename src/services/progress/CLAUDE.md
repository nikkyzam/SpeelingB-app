# src/services/progress — module notes

## Purpose and public interface
The learning rules for one child: what they have met and spelled, daily goals, which games are open, day rollover, per-word spaced repetition, and mastery stars/XP. It is all localStorage-backed. `LearningFlow` owns the single `learningProgress` object, and the other three files each own their own keys.
- `LearningFlowController` (app code uses only `useProgress().learningFlow`):
  - record: `completeWord`, `completeSpellQuiz`, `completeVocabQuiz`, `unlockGames`, `passDailyQuiz`, `passWeeklyQuiz`, `markReviewDone`
  - `completeVocabQuiz` adds only words new to `wordsLearnedTotal` to `wordsLearnedToday` (an earlier day's word used to count towards today's goal), and still does `selectedGroup += 1`: the hub reports it once per set per visit and puts the group back during a seasonal event
  - gates: `isGameUnlocked`, `gamesLockedReason` ('quiz' | 'review' | null), `areStarterGamesOpen`, `isDailyQuizPassed`, `isWeeklyQuizPassed`, `isReviewDue`, `isReviewSatisfiedToday`, `isDailyGoalReached(mode)`, `areWordsSpelled`, `getLearnGoalToday` (the goal shrunk to the words left at the end of a list), `isLevelFinished`
  - word sets: `getDailyQuizWordIds`, `getWeeklyQuizWordIds`, `getReviewWordIds`, `getWords{Learned,Spelled}{Today,Total}`
  - settings: `get/setWordLevels`, `get/setSelectedGroup`, `advanceToNextGroup(maxGroups)`, `getDailyGoal(mode)`, `getMissedDays`, `refreshProgress` (re-reads storage)
- Also from `LearningFlow.ts`: `LearningProgress`, `FREE_GAMES`, `REVIEW_INTERVAL_DAYS`, `weekOf`, and `setWordsLeftCounter` / `wordsLeftFor`: LearningFlow can't see the word bank, so `src/App.tsx` registers (at import, cached) how to count the words a child has left to meet in their levels. With none registered (tests, scripts) goals are unchanged. Plus `DailyResetService.initialize()`.
- `ReviewSchedule`: `record`, `getDueWordIds`, `dueCount`, `getTrickyWordIds`, `isTricky`, `all`, `SCHEDULE_EVENT`. `WordMastery`: `recordCorrect`, `recordLearned`, `recordSpelled`, `levelFor`, `totals`, `level`, `getChallenge`, `claimChallenge`, `getRecentHistory`, plus `levelFromXp`, `xpFromTotals`, `LEARN_CHALLENGE_*`, `MASTERY_EVENT`.
- `LearningProgress` field groups:
  - lists: per-day `words{Learned,Spelled,Practiced}Today`; lifetime `wordsLearnedTotal` and `wordsSpelledTotal` (append-only, in learning order)
  - goals: `dailyGoal` (learn; also the LearningHub group size and daily-quiz size), `dailyGoalSpell`, `dailyGoalVocab`
  - flags: `spellQuizUnlocked`, `vocabQuizUnlocked`, `gamesUnlocked`. Word choice: `wordLevels` (empty = all), legacy `difficulty`, `selectedGroup`.
  - date stamps: `dailyQuizPassedDate`, `weeklyQuizPassedWeek`, `lastReviewDate`, `wordLearnedDates`, `missedDays`. Vestigial: `unlockedGames` (write-only), `lockedModes` (never populated), `lastGoalCheck` (unused).

## Key files
- `LearningFlow.ts`: the controller and every unlock and quiz-selection rule; persists `learningProgress`
- `DailyReset.ts`: rollover on the raw JSON (carry-over, `missedDays`, clears per-day state); also zeroes the vestigial `progress-storage`
- `ReviewSchedule.ts`: a Leitner box per word in `word_review_schedule`
- `WordMastery.ts`: `word_correct_counts`, star levels, XP `RANKS`, the learn challenge (`learn_daily_challenge`) and day tallies (`learn_history`)

## How it talks to other modules
- `src/contexts/ProgressContext` holds the only controller (lazy `useState`). On `learningProgressUpdated` it calls `learningFlow.refreshProgress()` and re-renders. Its own context `refreshProgress` only re-renders.
- Callers:
  - driving the ladder: LearnMode, WordOfTheDay, SpellMode, QuizMode, `pages/{LearningHub,DailyQuiz,Review,GameCenter,Home}`
  - `ReviewSchedule.record`: the learning modes, BeeTournament (only for words the child has met — never its stretch words), and the DragonDuel, SpellTower, SpellTacToe, WordMachine and DefinitionDetective games. `WordMastery.level`: buddy, FunFx, ExplorerLevel, Progress, TrophyRoom.
- Outbound: LearningFlow reads `useUserStore` `user.dailyGoal` (only to seed a fresh record) and `ReviewSchedule.dueCount()`. Every save lazily imports `../persistence/FirebaseSync` and calls `syncToServer()`. The other files import nothing; the module listens to no events.
- Emits `learningProgressUpdated` on every controller save and on rollover; a rollover uploads only with the next save or event. `reviewScheduleUpdated` and `wordMasteryUpdated` are both in FirebaseSync `CHANGE_EVENTS` (→ `syncSoon`).
- Firestore: `learningProgress` maps to the typed `progress` field; the other keys and `lastDailyReset` ride the `local` bundle. Merge rules (five word lists set-merged, the rest remote-wins): `src/services/persistence/CLAUDE.md`.
- Admin edits `progress.*` leaves directly (`src/services/admin/CLAUDE.md`). `AdminProgress.deriveProgress` reuses `levelFromXp` and `xpFromTotals`, so XP rule changes show in the console too.

## Conventions and gotchas
- Unlock ladder:
  1. `completeWord` until `wordsLearnedToday` ≥ `getLearnGoalToday()` (`dailyGoal`, or fewer when that many words aren't left): sets `spellQuizUnlocked` and opens `FREE_GAMES`. They also open once every other game is open, so they are never later than the rest
  2. `completeSpellQuiz` always sets `vocabQuizUnlocked` (forgiving by design)
  3. `passDailyQuiz` stamps today
  4. Review gate: if `isReviewWaiting` (`dueCount() > 0`, or ≥5 learned and `REVIEW_INTERVAL_DAYS` since `lastReviewDate` or none yet), one `markReviewDone` today clears it
  5. Every other game needs `isDailyQuizPassed() && isReviewSatisfiedToday()`; `gamesUnlocked` does not gate play
- Quiz words:
  - daily: today's learned words, then the most recent from Total, capped at `dailyGoal` and shuffled
  - weekly: words with `wordLearnedDates` in the last 7 local days, plus undated legacy words from the last `dailyGoal*7` of Total. Uncapped, passed per Monday week (`weekOf`), never gates games.
  - review (`pages/Review`): `?mode=tricky` uses `getTrickyWordIds`, else `getDueWordIds` (lowest box, then most wrong), else the random `getReviewWordIds`
- Rollover runs when `lastDailyReset !== toDateString()`: on App mount, and (App.tsx) on focus, on becoming visible and once a minute while visible, so an iPad left open overnight starts the new day without a reload; ProgressContext re-reads on its `learningProgressUpdated`. Date stamps lapse at midnight on their own. A day whose learn goal the word list couldn't fill is not a missed day (`wordsLeftFor` in DailyReset). Carry-over is goal + missed, capped at `max(goal, 12)`, so a goal a grown-up set above 12 is never inflated. The root's 20 cap is `sane()` in `loadProgress`.
- Day keys (match the writer):
  - `toDateString()`: `dailyQuizPassedDate` (the admin writes it too), `lastDailyReset`, `missedDays`, the challenge `date`
  - `lastReviewDate` is a full ISO timestamp compared by local day; `wordLearnedDates`, `weeklyQuizPassedWeek` and ReviewSchedule `due` (via its exported `localDay`; AdminProgress's `dueToday` compares with it too) are local `YYYY-MM-DD` — `due` was UTC, which brought words due, and re-locked games, at 8pm on the US east coast; `learn_history` is still UTC `toISOString().slice(0,10)`
- Leitner: boxes 1–5, intervals 1/2/4/7/14 days; right → next box, wrong → box 1. A word is due tomorrow at the earliest. Tricky = wrong ≥ 2 and wrong ≥ right. `record(id, false)` also enrols a word that was only met.
- Mastery: 0 none, 1 met, 2 spelled, 3 = at least 3 `recordCorrect`. XP = met×10 + spelled×15 + mastered×25. Callers pass the lifetime lists; WordMastery never reads `learningProgress`.
- `saveProgress` writes the whole in-memory object. Never `new LearningFlowController()` in app code; an outside write to `learningProgress` is lost unless `learningProgressUpdated` fires before the next save.
- In LearningHub, `selectedGroup` indexes `wordBank.getWordsForLevels(levels)` in chunks of `dailyGoal`. The hub moves groups only through `goToGroup`, which never saves during a seasonal event (the event's groups aren't the child's list); `advanceToNextGroup` is no longer called there. Every `setWordLevels` call resets it to 0, and so does `AdminService.setUserLevels`; a goal change moves group boundaries. LearningHub clamps an out-of-range group.
- Rollover exists twice: `DailyResetService.resetDailyProgress` (raw JSON) and the controller's `resetDailyProgress`
- Checklist for a new `LearningProgress` field:
  - make it optional (tsc includes `__tests__`'s typed fixtures), default it in `loadProgress` `baseDefault`, and normalise arrays/objects in the saved-merge branch
  - per-day: prefer a date stamp, or clear it in both `resetDailyProgress`s
  - word-id list edited on several devices: add `progress.<field>` to `SET_PATHS` in `mergeSync.ts`
  - visible to or set by grown-ups: `AdminProgress.deriveProgress` and `AdminService`.

## Testing this module
- Module only: `npx vitest run __tests__/unit/services/progress`
- With dependents, add: `__tests__/unit/services/WordLevels.test.ts __tests__/unit/pages/{DailyQuiz,GameShortcuts,LearningHub}.test.tsx __tests__/unit/components/learning __tests__/unit/services/admin/AdminProgress.test.ts __tests__/unit/services/persistence/SyncBundle.test.ts`
- Coverage by file:
  - `LearningFlow.test.ts`: defaults, load/merge, stage flags, goals, `resetDailyProgress`
  - `LearningFlowUnlocking.test.ts`: `FREE_GAMES` vs the quiz (and open once everything else is), relock on a new day, the review gate and interval, daily-quiz size, the weekly window, legacy fallback and week boundary
  - `LevelEnd.test.ts`: the goal shrinking to the words left, FREE_GAMES then, no missed day for an unfillable goal, unchanged with no counter registered
  - `ReviewSchedule.test.ts`: box moves and due dates, on the child's local day (it sets `process.env.TZ` to New York to catch the old UTC evening bug)
  - `DailyResetCarryOver.test.ts`: carry-over cap and `missedDays`; `AuthPersistence.test.ts`: logout clears progress; `WordLevels.test.ts`: `difficulty` migration and group reset
  - `DailyQuiz` and `GameShortcuts` inject a real controller through `vi.hoisted` and a mocked `useProgress`; `LearningHub.test.tsx` automocks LearningFlow
- Mocks: `vi.mock` of `@/stores/userStore` (seed goal) and `@/services/persistence/FirebaseSync` (lazy sync). localStorage is the in-memory mock from `setupTests.ts`; the DailyReset test stubs its own and replaces `window.dispatchEvent`. Review-gate tests use the real `ReviewSchedule` with an empty store.
- Untested: `WordMastery` directly (stars, challenge, history; only XP runs, via `AdminProgress.test.ts`), ReviewSchedule due order and tricky words, `getReviewWordIds`, the `advanceToNextGroup` clamp, the DailyReset first run.
