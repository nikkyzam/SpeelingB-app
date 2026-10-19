# src/services/persistence — module notes

## Purpose and public interface
Moves one child's localStorage state to and from `users/{uid}`, and decides which localStorage keys belong to a child versus the device. `userKeys.ts` is the registry, `mergeSync.ts` the pure 3-way merge, `FirebaseSync.ts` the only client code that reads/writes the sync fields as a whole.
- `FirebaseSync` (static class, also default export): `syncFromServer()`, `syncToServer()` (queued, returns a promise), `syncSoon(delayMs = 1500)`, `ensureUserDocument(name?)`, `resetHydration()`, `wipeDevice()`
- `userKeys.ts`: `USER_KEYS`, `DEVICE_KEYS`, `LAST_USER_KEY`, `TYPED_SYNC_KEYS`, `BUNDLED_SYNC_KEYS`, `clearUserData()`, `prepareDeviceFor(uid)` (true = it wiped another account), `forgetDeviceUser()`
- `mergeSync.ts`: `mergeSync(base, local, remote)`, `equalSyncData(a, b)` — imported only by FirebaseSync

## Key files
- `src/services/persistence/FirebaseSync.ts` — hydration gate, localStorage⇄payload mapping, upload queue + transaction, tombstone handling, module-load event listeners
- `src/services/persistence/mergeSync.ts` — pure deep 3-way merge and structural equality; no I/O
- `src/services/persistence/userKeys.ts` — key registry plus device-ownership helpers around `last_user_uid`

## How it talks to other modules
- Inbound: `AuthService.init` listener → `syncFromServer()` (not awaited); `AuthService.signUp` → `ensureUserDocument(name)`; `AuthService.logout` → `syncToServer()`, signOut, `resetHydration()`, `clearUserData()`, `forgetDeviceUser()`; `LearningFlow.saveProgress` → dynamic `import()` → `syncToServer()`; `src/App.tsx` imports it statically so the listeners attach at boot
- Outbound: `src/config/firebase` (`db`, `auth`); `firebase/firestore` `doc/getDoc/setDoc/runTransaction`; `firebase/auth` `signOut`; `src/services/auth/adminClaim.ts` (`withoutAdminClaim` when snapshotting, `withAdminClaimDenied` when applying)
- Listens (window, registered once at import): the `CHANGE_EVENTS` array → `syncSoon()`. Dispatched by BuddyService, WordMastery, ReviewSchedule, MysteryBox, GameStats, PointsService (`pointsEarned`, `rewardPurchased`), AchievementsService, `useStreak`
- Emits: `learningProgressUpdated` right before a post-merge reload
- Payload mapping: `learningProgress`→`progress`; `user-storage`.state.user→`userData`; `kids_spelling_points`→`points`; `reward-storage`.state→`rewards` (written back as `{state, version: 0}`); each `BUNDLED_SYNC_KEYS` raw string→`local.<key>`
- sessionStorage `fb-synced:<uid>` holds the JSON baseline (legacy value `'1'` means none)
- Firestore writes touch only `progress/userData/points/rewards/local/lastUpdated`; `adminLog` and tombstone fields belong to `src/services/admin/AdminService.ts`, which also writes dotted `progress.*`/`points.*` directly. `firestore.rules` forbids clients writing `deleted*` or updating a tombstoned doc — the client checks mirror that

## Conventions and gotchas
- Download order matters: `prepareDeviceFor` → read baseline (ignored if switched) → `getDoc` → tombstone check → merge → `remember(remote)` → `hydratedUid = uid` → apply → reload if switched or changed → `ensureUserDocument()` if no doc
- No baseline (new tab, fresh login, account switch): remote wins per typed field and per bundled key; bundled keys only local survive. With a baseline: `mergeSync(baseline, local, remote)`
- The baseline is always what the server holds (downloaded remote, or the merged result after an upload), never local. That is what ends the reload loop: after the reload local equals incoming and remote equals baseline
- `localSnapshot` and `applySnapshot` must stay exact inverses (same keys, same wrapping, admin claim stripped both ways) or every sync sees a diff and reloads forever. `applySnapshot` writes only differing values and reports whether anything changed
- Typed fields are written only when present, never removed locally; bundled keys missing from the incoming `local` map ARE removed — that is how deletions travel
- Upload captures the uid at call time and chains on `uploadQueue` so each transaction merges against the previous upload's baseline. Skipped unless uid still matches, `hydratedUid === uid` and `removedUid !== uid`; pre-hydration calls are dropped, not deferred, and a failed download keeps uploads blocked for the page session
- Keep the `runTransaction` callback free of side effects (Firestore may retry it). It uses `mergeFields` so each top-level map is replaced whole; `{ merge: true }` would resurrect deleted nested entries
- After commit: baseline = merged result, then `mergeSync(sentSnapshot, currentLocal, merged)` keeps edits made while the request was in flight and reloads only if the server brought something new
- Tombstone on download: set `removedUid`, `wipeDevice()`. On upload: the transaction returns `null` (no write), then wipe. `ensureUserDocument` returns early. `wipeDevice` clears ALL local and session storage, device keys included — deliberately stricter than logout
- `prepareDeviceFor` wipes only when `last_user_uid` is a different uid; a null previous (fresh install, after logout) keeps local data so guest progress carries into sign-up
- `SET_PATHS` in mergeSync set-merges exactly five arrays: `progress.wordsLearnedTotal`, `wordsSpelledTotal`, `wordsLearnedToday`, `wordsSpelledToday`, `wordsPracticedToday` — keep what neither side removed, add what either side added (remote order, then local additions). Every other leaf is remote-wins on conflict
- mergeSync, safe: add an id-set array path to `SET_PATHS` (dotted from payload root, e.g. `progress.x`). Removals relative to the base stick, so lists that get cleared (day rollover, admin `resetToday`) are fine. Without a base (no baseline) it falls back to a plain union, since a removal can't be told from an addition. Order within the list must not matter
- mergeSync, unsafe: making local win conflicts (admin goal/star corrections must survive stale devices); reordering the two base-equality short-circuits; recursing into arrays; merging inside bundled values (opaque strings, conflict = remote wins the whole key); swapping `equalSyncData` for JSON.stringify (key order can differ between Firestore and localStorage)
- A merged `undefined` drops the key, so a one-sided deletion propagates
- `user` sits in `TYPED_SYNC_KEYS` only to keep it out of the bundle; the typed sync reads `user-storage` alone
- Adding a synced per-child key: once in `USER_KEYS` it is auto-bundled, cleared on logout/switch and erased by the tombstone (`local` is deleted as one field). Also make its writer dispatch an event in `CHANGE_EVENTS` or add that event there, otherwise it uploads only when something else triggers a sync; store it as a string
- Adding a new typed top-level field instead: update `syncFields`, `localSnapshot`, `applySnapshot`, `TYPED_SYNC_KEYS`, `deleteUserAccount` in AdminService and `AdminRemoval.test.ts` together
- Adding a sync-trigger event: append its name to `CHANGE_EVENTS`; `syncSoon` coalesces bursts. `learningProgressUpdated` is not a trigger: LearningFlow uploads directly on save and FirebaseSync dispatches it itself before reloading

## Testing this module
- `npx vitest run __tests__/unit/services/persistence/` (3 files); neighbours: `npx vitest run __tests__/unit/services/admin/AdminRemoval.test.ts __tests__/unit/services/progress/AuthPersistence.test.ts`
- `SyncBundle.test.ts`: bundle up/down, device keys stay home, local-only keys survive without a baseline, switch wipe, debounce coalescing, tombstone on upload, admin correction + word-set merge, admin reset today surviving a concurrent save, "reads fresh data after a refresh without entering a reload loop", in-flight edits kept
- `UserKeys.test.ts`: source scan for unregistered keys, lists disjoint, bundle = `USER_KEYS` minus typed, clear/prepare/forget semantics
- `EnsureUserDocument.test.ts`: create-if-missing, sign-up name, existing doc untouched, tombstone never rebuilt, guest no-op, write errors swallowed
- `AdminRemoval.test.ts` pins that the tombstone deletes every sync field, `local` included
- Mocks: a `vi.hoisted` object (`getDoc`, `setDoc`, `doc`, `auth`, `reload`); `runTransaction` calls back with `{get: getDoc, set: setDoc}`, so transaction writes appear as `setDoc` calls; `@/config/firebase` → `{ db: {}, auth }` with a mutable `currentUser`
- Module-level state outlives tests: call `FirebaseSync.resetHydration()`, clear both storages and redefine `window.location` with a `reload` spy in `beforeEach`. localStorage is the in-memory mock from `setupTests.ts`; sessionStorage is jsdom's
- Consumers mock `@/services/persistence/FirebaseSync` as `{ default: { syncToServer: vi.fn(), ... } }`; anything reaching LearningFlow saves or AuthService needs it, since the real module loads `src/config/firebase`
- `MergeSync.test.ts`: the pure set merge — additions from both sides, a clear on either side sticking (admin reset, day rollover in either direction), no-base union, non-set lists stay remote-wins
- Untested: tombstone on download, pre-hydration drop, account change mid-transaction, the `'1'` legacy flag, switched-path reload
