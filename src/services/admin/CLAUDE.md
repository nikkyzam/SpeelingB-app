# src/services/admin — module notes

## Purpose and public interface
Backend of the grown-up console: lists every `users/{uid}` document and makes targeted dotted-path edits to one child's document from the admin's own browser, leaving an audit line each time. `AdminProgress` turns one raw document into a parent-readable picture without touching the grown-up's device. Operator runbook: `ADMIN.md`; sync and admin-claim basics: root CLAUDE.md.
- `AdminService.ts`: `listUsers`, `setUserDailyGoal`, `setUserLevels`, `setUserStars`, `resetToday`, `setGamesUnlockedToday`, `getAdminLog`, `exportUserData`, `deleteUserAccount`, `currentAdminUid`, `describeLevels`; types `AdminUser`, `AdminUserStats`, `AdminLogEntry`, `WordLevel`
- `AdminProgress.ts`: `deriveProgress(raw, now?)` (pure), `getUserProgress(uid)` (fetch + derive, no caller today); types `RawUserDoc`, `AdminUserProgress` and its parts

## Key files
- `src/services/admin/AdminService.ts` — Firestore reads/writes, private `log()` audit append, tombstone removal, export
- `src/services/admin/AdminProgress.ts` — pure derivation: counts, per-level reach, 14-day history, review boxes, tricky words, games, trophies/badges

## How it talks to other modules
- Inbound: only `src/components/admin/AdminUsers.tsx` (all AdminService exports + `deriveProgress`) and `AdminProgress.tsx` (types). Mounted by `src/pages/Settings/index.tsx` behind `user.isAdmin`
- Outbound: `src/config/firebase` (`db`; `auth.currentUser` for `by`/`deletedBy`/self-check), `firebase/firestore`, `wordBank.getWordById`/`availableLevels`, and only the pure `levelFromXp`/`xpFromTotals` from `services/progress/WordMastery`
- No window events emitted or listened to; no localStorage reads or writes
- Writes (all `users/{uid}`, `updateDoc` unless noted):
  - `setUserDailyGoal`: `userData.dailyGoal`, `progress.dailyGoal`, `progress.dailyGoalSpell`, `progress.dailyGoalVocab`
  - `setUserLevels`: `progress.wordLevels` (deduped, sorted, `[]` = all), `progress.difficulty` (the one level, else `deleteField()`), `progress.selectedGroup: 0`
  - `setUserStars`: `points.availablePoints`, `points.totalPoints` (= available + spent); `points.spentPoints` untouched
  - `resetToday`: `progress.wordsLearnedToday`/`wordsSpelledToday`/`wordsPracticedToday` → `[]`, `progress.dailyQuizPassedDate: null`, `progress.gamesUnlocked: false`
  - `setGamesUnlockedToday`: `progress.dailyQuizPassedDate` (admin's `toDateString()` or null), `progress.gamesUnlocked`
  - each of those then does a second write: `adminLog: arrayUnion({at, by, action, detail})`
  - `deleteUserAccount`: `setDoc` with `{merge: true}` of `deleted`/`deletedAt`/`deletedBy` + `deleteField()` on `progress`, `userData`, `rewards`, `points`, `adminLog`, `local`; no log line (the tombstone is the record)
- Reads: `listUsers` = whole collection, tombstones filtered, sorted by name, full doc kept as `raw`; the rest read one doc
- Reaching the child: only the five synced maps (`progress`, `userData`, `points`, `rewards`, `local`) reach a device (key mapping: `src/services/persistence/CLAUDE.md`), at its next `syncFromServer` or upload transaction. `adminLog` never reaches a device and survives uploads because they only replace the synced maps
- `firestore.rules`: `allow write: if isAdmin()` (token claim) covers create/update/delete on any user doc, tombstoned or not. A non-admin's `listUsers` is denied and the UI shows the error. No household scoping (see ADMIN.md)

## Conventions and gotchas
- Write leaves with dotted paths, never a whole map: the device's 3-way merge reads a missing leaf as a server deletion and drops it
- A field only affects the child if it sits in one of the five synced maps AND matches the name/shape the device reads (`LearningProgress` in `LearningFlow.ts`, PointsService's points object). Anything else is console-only metadata
- Server wins per leaf, except the five set-merged word lists (see persistence CLAUDE.md): an admin clear or removal sticks, and only words the child's device added since its last sync are kept on top of it
- `local.<key>` values must be JSON strings, as localStorage held them; `applySnapshot` removes a device key whose bundle value is not a string
- `setUserLevels` mirrors `LearningFlow.setWordLevels` (same three fields, empty = all, `difficulty` only for a single level). `listUsers` reads back with the same `wordLevels` → `difficulty` fallback as `getWordLevels`. Change them together
- `listUsers` reads the goal as `userData.dailyGoal ?? progress.dailyGoal ?? 5`, so `setUserDailyGoal` writes both places
- Never set `lastUpdated` from an admin write: it is the console's "Last played" (`stats.lastSeen`)
- `updateDoc` throws "No document to update" on a missing doc; removal uses `setDoc` merge so never-synced children can still be removed
- Audit: every mutator ends with `await log(uid, action, detail)`. Not atomic with the change. `adminLog` is never trimmed and shares the child's 1 MiB doc: one line per grown-up intent, not per field. It is informational, not tamper-proof (the child's own account may update any non-tombstone key)
- Removal cannot delete the Auth login. Hard delete (doc, then login, with its own backup) stays in `scripts/delete-user.mjs`; don't reimplement it client-side
- Export: `exportUserData` returns `{uid, exportedAt, ...raw doc}` (bundle values stay JSON strings, `adminLog` included); `AdminUsers.download` saves it as `<name>-spelling-bee.json`. There is no import/restore path
- `deriveProgress` must stay pure: `WordMastery`, `ReviewSchedule`, `GameStats`, `TrophyService`, `AchievementsService` all read the signed-in user's localStorage, which here is the grown-up's. Read only `raw` via `bundled()`. Likewise AdminService must never call local-state services (they would edit and upload the grown-up's own profile)
- `bundled()` takes a JSON string or an already-parsed object (old or console-edited docs) and falls back on anything else; `deriveProgress` must never throw on a malformed doc
- `deriveProgress` counts only ids `wordBank` resolves; the rest go to `unresolved`. `MASTERY_HITS = 3` duplicates WordMastery's private constant; keep them equal
- Dates: `dayKey` is UTC `toISOString().slice(0, 10)` to match the WordMastery/ReviewSchedule writers; reader must match writer. `setGamesUnlockedToday` and `stats.gamesUnlockedToday` use the admin's local `toDateString()`; the device compares `dailyQuizPassedDate` with its own local `toDateString()`, so the formats must stay identical. That stamp opens only the quiz half of the games gate; the review gate still applies. `AdminLogEntry.at` is UTC ISO
- New admin action checklist: (1) fn in `AdminService.ts` with dotted writes inside the synced maps using device-side names/formats, then `log()`; (2) extend `AdminUser`/`AdminUserStats` in `listUsers` if the console must show it; (3) UI in `AdminUsers.tsx`, either drafted (`isDirty` + `saveAll`) or immediate (`runDayAction` with a stats patch); (4) add it to the `vi.mock` factory and a case in `AdminUsers.test.tsx`; (5) service test in `__tests__/unit/services/admin/`; (6) update the ADMIN.md table; (7) a new `components/admin/` file with a text `<input>` needs a `NOT_SPELLING` entry in `NoSpellingHelp.test.ts`

## Testing this module
- `npx vitest run __tests__/unit/services/admin __tests__/unit/components/admin`
- `AdminProgress.test.ts` — derived numbers, purity (plants localStorage, asserts it is ignored), UTC fortnight, parsed-object bundles, corrupt and empty docs. Mocks `@/services/wordBank` with 5 words; real WordMastery XP rules; `NOW` pinned in UTC
- `AdminRemoval.test.ts` — tombstone deletes all six fields, `merge: true`, `deletedBy`, self-removal refused, `local` stays one field. `vi.hoisted` mocks of `firebase/firestore` and `@/config/firebase` (`doc` returns a path, `deleteField` a sentinel, `arrayUnion` identity)
- `AdminUsers.test.tsx` — drafted vs immediate writes, star-log reason, removal confirm/export/self-guard, level toggles, household summary. Mocks AdminService wholesale (the factory must list every export the component imports); real `wordBank` and `deriveProgress`
- Related: `__tests__/unit/services/persistence/SyncBundle.test.ts` ("preserves an admin balance correction") covers server-wins merging of admin edits
- Untested: `listUsers` mapping, the five mutators' field writes, `log`/`getAdminLog` ordering, `exportUserData`, `getUserProgress`, and `firestore.rules` (no emulator or rules tests)
