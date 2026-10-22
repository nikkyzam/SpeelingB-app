# BrightHive — repo map

## What this is
BrightHive (formerly Kids Spelling Bee; the repo folder is still `SpeelingB-app`) is a faith-based learning app for children, often siblings sharing one iPad. Each day a child learns a set of words (learn → spell → daily quiz → review), which unlocks ~44 mini-games, stars, a buddy pet, trophies, sibling challenges and Bible/reading sections. Grown-ups (Firebase `admin` claim) set levels and goals per child; progress is localStorage-first and synced to Firestore per signed-in child.

## Stack (installed versions)
- React 18.3, TypeScript 5.9 (strict, `noUnusedLocals` off), Vite 6.4, react-router-dom 7.12, zustand 5.0
- Firebase web SDK 10.14 — Auth (email/password) + Firestore only; no Storage/Analytics/emulator. firebase-admin 13 for `scripts/`
- Vitest 2.1 + jsdom + Testing Library; Cypress 13 (mostly stale). axios only for bible-api
- Installed but unused: framer-motion, phaser, msw, storybook. No Node version pinned. Package is ESM (`"type": "module"`)

## Directory map
- `src/App.tsx` — provider tree, every route, boot effects
- `src/pages/` — route screens: learning loop, GameCenter, SiblingChallenge (+`modes/`), BeeTournament, Bible/Reading, rewards, Settings
- `src/components/games/` — 58 game folders + `shared/` (sfx, wordTricks, plurals); `index.ts` is the only barrel
- `src/components/learning/` — LearnMode, SpellMode, QuizMode, QuickCheck, TestAll, WordOfTheDay
- `src/components/{common,progress,buddy,rewards,reading,bible,admin,auth,challenge,profile,seasonal,theme,layout}/` — feature UI
- `src/services/` — all business logic and persistence (see "Where to look")
- `src/contexts/` — Theme, User, Progress, Audio providers
- `src/stores/` — zustand: `userStore` + `rewards/useRewardStore` (live); `progressStore` (vestigial); `rewardStore` (retired)
- `src/hooks/` — speech synthesis/recognition, `useStreak`, `useLocalStorage`
- `src/data/` — word lists (`wordData.js` merges `original/*.js`), `books/`, `spelling-bee/*.json` (unused Scripps lists)
- `src/config/firebase.ts` (only Firebase init), `src/theme/worlds.ts` (8 colour worlds), `src/styles/global.css` (tokens)
- `src/assets/` — placeholder mp3/SVG, currently unreferenced
- `__tests__/unit/` — Vitest suites mirroring `src/` (unit only; no integration/visual dirs)
- `cypress/` — e2e specs (see Gotchas) · `scripts/` — Node admin + predeploy scripts
- `documents/` — design docs/backlog; `IMPLEMENTATION_PLAN.md` is the current one
- Root `*.sh`, `app_reading_patch.tsx`, `update_package.js`, `integration-example.txt` — stale initial-import generators

## Commands
- Install `npm install` · Dev `npm run dev` (:5173; `.claude/launch.json` "dev" uses :5199)
- Typecheck `npx tsc --noEmit` · Build `npm run build` (tsc + vite → `dist/`)
- Unit tests one-shot `npm run test:unit` · single file `npx vitest run <path>` · watch `npm test`
- Pre-PR check = typecheck + `npm run test:unit` (no CI exists)
- Deploy hosting `npx firebase-tools deploy --only hosting` (predeploy runs build + `scripts/verify-build.mjs`)
- Deploy rules separately `npx firebase-tools deploy --only firestore:rules` · preview `npx firebase-tools hosting:channel:deploy <name> --expires 7d`
- Admin claim `node scripts/set-admin.mjs <email> [--revoke]` · hard delete `node scripts/delete-user.mjs <email> --dry-run` (both need gitignored `serviceAccountKey.json`)
- BROKEN: `lint` (ESLint 9, no config), `format` (no Prettier config, would reformat all of src), `coverage`, `test:integration`, `test:visual`, `storybook`, `test:e2e`

## Entry points and data flow
1. `index.html` → `src/index.tsx` → `src/App.tsx`; providers Router > Theme > User > Progress > Audio
2. App mount: `AuthService.init()`, `DailyResetService.initialize()`, `migrateLegacyStars()`, `useRewardStore.loadPoints()`
3. Signed in: `src/services/auth/AuthService.ts` reads admin claim → `useUserStore.setUser` → `FirebaseSync.syncFromServer()`. Signed out: guest "Friend", local-only
4. `syncFromServer` (`src/services/persistence/FirebaseSync.ts`): `prepareDeviceFor(uid)` wipes if another child last used the device → read `users/{uid}` → tombstone check → 3-way `mergeSync` (sessionStorage baseline, local, remote) → write localStorage → full reload if changed
5. Pages/components call services; services write localStorage and dispatch a window event (`learningProgressUpdated`, `pointsEarned`, …)
6. Upload: `LearningFlow.saveProgress` syncs immediately; other events go through `syncSoon` (1.5s debounce). Transactional re-merge, then `set` with `mergeFields` on `progress/userData/points/rewards/local` + `lastUpdated`. Blocked until this session hydrated that uid
7. Logout: sync → signOut → clear `USER_KEYS` → hard navigate to `/`
- Routing has no lazy loading and no guards; gating lives inside pages (GameCenter via LearningFlow unlocks, admin via `user.isAdmin` in Settings)
- Firestore: single collection `users/{uid}` with `progress`, `userData`, `points`, `rewards`, `local` (bundled keys), `adminLog[]`, tombstone fields

## Conventions
- Components: `const X: React.FC<Props>` + default export, in `Name/index.tsx` + `Name.css` (admin/auth/reading/rewards/theme use flat `Name.tsx`). No class components
- Styling: one plain CSS file per component using theme CSS variables; `@keyframes` with `prefers-reduced-motion` blocks. No CSS modules/Tailwind
- Imports: relative paths in `src/`; tests use the `@/` alias
- Local-state services are static-class or object singletons with try/catch read/write helpers that swallow storage errors and dispatch a window Event on every write. Pure logic lives in separate modules (`mergeSync`, `userKeys`, `adminClaim`, `gameOfTheDay`, `deriveProgress`, `services/words/*`)
- Errors: auth/admin → `console.error` + rethrow to UI; books → return empty; FirebaseSync swallows. Logging is raw `console.*`, no logger
- Speech via `useAudio().speak` (`src/contexts/AudioContext`) so the mute flag applies; sfx are synthesized in `src/components/games/shared/sfx.ts`
- Every spelling input uses `src/components/common/SpellingInput` (no autocorrect, own keypad on touch) — enforced by `NoSpellingHelp.test.ts`
- Tone is gentle for kids: soft wrong sound, no buzzers/guilt, never leave a child stuck (the answer is always revealed; when varies by component)
- Tests: `*.test.ts(x)`, Firebase mocked per file (usually `vi.mock` of FirebaseSync; `vi.hoisted` for shared fns), plain-English `describe` names, no shared fixtures
- Commits: plain-English subjects, no conventional prefixes, body explains why

## Gotchas (intentional or load-bearing)
- Every per-child localStorage key MUST be registered in `src/services/persistence/userKeys.ts` or it leaks to the next child on a shared device. `UserKeys.test.ts` catches `setItem` literals and `*_KEY` constants but NOT zustand persist names or `useLocalStorage('key')` — register those by hand
- `isAdmin` is never persisted: it comes from the ID-token claim and is stripped/forced false on every save and load (`src/services/auth/adminClaim.ts`)
- Account removal is a tombstone (`deleted: true` on `users/{uid}`), not a delete; clients wipe themselves and refuse to recreate. Only `scripts/delete-user.mjs` hard-deletes
- The full page reload after a sync merge is deliberate (providers and singletons cache localStorage)
- Writing `learningProgress` directly requires dispatching `learningProgressUpdated`, or ProgressContext goes stale. Direct writes to a zustand persist key don't reach the in-memory store
- Word IDs are positional (`${source}-${index}`): only APPEND to `src/data/original/*.js`; inserting/reordering breaks saved progress. Adding words means updating the pinned total (3,686) in `AdminUsers.test.tsx`
- Games may only use words passed in props (the child's studied words), never the whole `wordBank` — `wordScoping.test.ts` is regex-based, so extend it if you use a new wordBank method
- `gamesUnlocked` survives day rollover but no longer gates play: `isGameUnlocked` requires today's daily quiz + the review gate. On day 1 the review comes due right after the first quiz (5+ words, never reviewed), so every screen words the next step from `gamesLockedReason()`, never from the quiz alone. At the end of a word list the day's learn goal shrinks to the words left (`getLearnGoalToday`, counted by a function App.tsx registers). Daily goal defaults to 5, capped at 20 (>20 is legacy); carry-over is `min(goal + missed, max(goal, 12))`
- Day keys use four formats (`toDateString`, UTC ISO date, local `YYYY-MM-DD`, unpadded `Y-M-D`); match the one the surrounding service uses
- Three separate streak counters exist (`useStreak`, PointsService `kids_spelling_streak`, `LearningFlow.currentStreak`, which nothing increments). Every screen now shows `useStreak`'s number (Home, Progress, the Learning Hub, the Rewards shop); the other two are only stored
- `progressStore` (defaults goal 30) is vestigial and `stores/rewardStore.ts` is retired — use LearningFlow and PointsService/useRewardStore. Navigation's Learn-tab 🎯 read `progressStore.dailyGoalCompleted`, which nothing sets; it now reads `learningFlow.isDailyGoalReached('learn')`
- Dead code: `src/App.tsx.backup`, `pages/RewardsPage.tsx`, `components/progress/WordJourney`, `data/test-import.js`, `services/wordBank/words.json`, `components/games/{constants,types}.ts` (still re-exported by `games/index.ts` — edit the barrel if deleting)
- Firestore rules protect cross-user access and tombstones only; there is no schema validation
- No emulator: dev and Cypress hit the real project `spellingb-5ebae` via `.env`. Cypress specs generated by `cypress.sh` use test ids that don't exist
- NEVER run the root `*.sh` scripts — they `cat >` over hand-edited files in `src/` (`cypress.sh` does `rm -rf cypress`)
- StrictMode double-runs App's mount effect in dev (no cleanup), so two auth listeners attach
- Stale docs/comments: "Three Bee ships empty" (it has 211 unique words), `INSTRUCTIONS.md` (predates `src/data/original/`), `documents/LEARNING_REQUIREMENTS.md`, `FOLDER_STRUCTURE.md`, `CYPRESS_SETUP_README.md`, scaffold `*_README.md`s. Trust `README.md`, `ADMIN.md`, `documents/IMPLEMENTATION_PLAN.md`

## Adding a game
- `src/components/games/<Name>/index.tsx` + `.css`; props `{ onComplete, words?, rounds? }`
- Export it from `src/components/games/index.ts`
- `src/pages/GameCenter/index.tsx`: `GameMode` union, `rawGames` card, `renderActiveGame` switch, `wordlessGames` if it takes no words
- `FREE_GAMES` in `src/services/progress/LearningFlow.ts` only if it should unlock before the daily quiz

## Adding a subject topic or test (every topic gets games)
- Every topic must be playable as games, not only as a quiz. Topic games are generated from the topic's own questions: `src/services/subjects/gamePool.ts` (`pickRounds`, `matchPairs`) feeds the games in `src/components/subjects/TopicGames/` (registry `index.ts`), shown at `/subjects/play/{quest|test}/:id` from a "🎮 Play games" row on every Math Quest topic and test page
- So a new Math Quest topic or `TESTS` entry gets games automatically — but `gamePool.test.ts` sweeps every topic and test and fails if one can't fill a pick or match game (e.g. all-paragraph answers). Fix the bank or gamePool, don't skip the topic
- A new `Question` kind must be handled in `gamePool.answerLabel` (and decoys), or its questions sit out pick/match games
- Adding a game to `TOPIC_GAMES` adds it to every topic. Games take `{ questions, onComplete(pct) }`, follow `src/components/games/CLAUDE.md` conventions, and never store anything; the page pays stars once a day per game per topic via `SubjectProgress` (`game:<source>:<id>:<gameId>`)

## Where to look for X
- Routes → `src/App.tsx`; bottom nav → `src/components/layout/Navigation`
- Auth/login → `src/services/auth/AuthService.ts`, `src/components/auth/AuthModal.tsx`
- Admin → `src/services/admin/{AdminService,AdminProgress}.ts`, `src/components/admin/`, gate in `src/pages/Settings`; runbook `ADMIN.md`
- Firebase config → `src/config/firebase.ts`, `.env.example`; rules → `firestore.rules`; hosting → `firebase.json`
- Sync/merge/keys → `src/services/persistence/{FirebaseSync,mergeSync,userKeys}.ts`
- Learning rules (goals, unlocks, daily/weekly quiz, review gate) → `src/services/progress/LearningFlow.ts`; rollover → `DailyReset.ts`; spaced repetition → `ReviewSchedule.ts`; mastery/XP → `WordMastery.ts`
- Private word lists (the 2026–27 Scripps School Bee study list: "copyrighted, do not post to Web", and this repo + site are PUBLIC) → never in `src/data` or git. Words + our own meanings live in gitignored `private/word-lists/`, go to Firestore `wordLists/{id}` via `node scripts/upload-word-list.mjs <id> "<title>" [--dry-run]` (bumps `version`), readable only when signed in (`firestore.rules`). `src/services/wordLists` downloads after sign-in, caches in `private_word_lists` (`SIGNED_IN_CACHE_KEYS`: cleared on sign-out, never synced) and registers before render (`src/index.tsx`). Words carry `list`, stay out of the Bee levels, ids `${list}-${n}` (n = official number, stable). A child picks it in LearningHub (`learningFlow.setWordList`); everything learning-related reads `wordBank.getLearningList(levels, list)`. Tests use made-up words, never the real list
- Words → `src/data/wordData.js` → `src/services/wordBank/index.ts`; seasonal → `src/services/seasonal/`; spelling tips → `src/services/words/`
- Stars/badges → `src/services/rewards/{PointsService,AchievementsService}.ts`, `src/stores/rewards/useRewardStore.ts` (`ProgressIntegration.ts` has no importers)
- Trophies → `src/services/trophies/`; sibling matches → `src/services/challenge/` + `src/pages/SiblingChallenge/`; tournament → `src/pages/BeeTournament/`
- Game catalogue and gating → `src/pages/GameCenter/index.tsx`; game of the day/stats → `src/services/games/`
- Buddy pet → `src/services/buddy/`, `src/components/buddy/`
- Front door `/` is the subject-neutral chooser `src/pages/Subjects/index.tsx` (greeting, streak, stars, mystery box, subject cards); the spelling home (`pages/Home`) lives at `/spelling` and keeps the buddy, since the buddy grows from words learned. `/subjects` redirects to `/`
- Subjects (math, social studies, language arts) → `src/pages/Subjects/` (routes under `/subjects/…`); one `Question` shape in `src/services/subjects/types.ts`, graded by `grading.ts`; catalogue/loaders `catalogue.ts`; bests + daily star claim in `SubjectProgress.ts` (key `subject_progress`); banks are JSON in `src/data/subjects/` (converted once from the old `quiz` repo — edit the JSON, not a converter); UI in `src/components/subjects/` (TestRunner = hand in then review, PracticeRunner = two tries then reveal, NumberInput = on-screen pad since iPad's decimal keyboard has no minus); proofs/puzzles/lessons in `mathExtras.ts`
- Bible → `src/services/bibleApi.ts`, `src/pages/BibleDashboard/`; books → `src/services/books/`, `src/data/books/`, `src/components/reading/`
- Theme/worlds → `src/theme/worlds.ts`, `src/contexts/ThemeContext`, `src/styles/global.css`
- Speech → `src/hooks/useSpeechSynthesis.ts`, `src/contexts/AudioContext`, `src/hooks/useSpeechRecognition.ts`
- User profile state → `src/stores/userStore.ts` + `src/contexts/UserContext`
- Deploy runbook and architecture notes → `README.md`
