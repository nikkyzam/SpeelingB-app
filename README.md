# SpeelingB-app

A spelling and reading app for kids: learn words, spell them, earn stars, and
unlock a shelf full of word games.

## Getting started

```bash
npm install
cp .env.example .env   # then fill in your Firebase web config
npm run dev
```

**The `.env` step is not optional.** Without a Firebase API key the SDK throws
`auth/invalid-api-key` while the app is starting, React never mounts, and the
page renders blank with nothing in the console to explain it.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Vite dev server |
| `npm run build` | Production build into `dist/` |
| `npm test` | Vitest unit tests (uses `.env.test`, no setup needed) |
| `npx tsc --noEmit` | Type-check |
| `npx firebase-tools deploy --only hosting` | Ship `dist/` to Firebase Hosting |

## Deploying

The app is on Firebase Hosting at **https://spellingb-5ebae.web.app**
(project `spellingb-5ebae`, set in `.firebaserc`; `firebase.json` serves
`dist/`).

```bash
npx tsc --noEmit && npm test        # don't ship a red build
npm run build                       # -> dist/
npx firebase-tools deploy --only hosting
```

A `predeploy` hook in `firebase.json` rebuilds and then runs
`scripts/verify-build.mjs`, which **stops the deploy** if the Firebase config is
not actually in the bundle. That guard exists because the failure is silent
otherwise: the config is read from `import.meta.env.VITE_FIREBASE_*` at *build*
time and inlined (`src/config/firebase.ts`), so a missing or placeholder `.env`
still builds, still deploys, and then serves a blank white page to every
visitor — `getAuth()` throws `auth/invalid-api-key` before React mounts, with
nothing on screen to explain it.

Run the check by hand any time:

```bash
node scripts/verify-build.mjs
```

First time on a machine, install the CLI and sign in:

```bash
npm i -g firebase-tools && firebase login
```

Two things that are **not** part of a hosting deploy and have to be sent
separately when they change:

```bash
npx firebase-tools deploy --only firestore:rules   # after editing firestore.rules
node scripts/set-admin.mjs someone@example.com     # grant a grown-up admin
```

Deploy from `main`, not a feature branch — hosting has one live channel and
whatever you push is what children see. To look at a branch first, use a
preview channel, which gets its own temporary URL and expires on its own:

```bash
npx firebase-tools hosting:channel:deploy my-branch --expires 7d
```

Rolling back is done from the Firebase console (Hosting → release history →
Rollback); there is no CLI flag for it.

## How the app fits together

- **Learn → Spell → Play.** A child meets a word, answers a quick check to prove
  they read it, spells it, and games open up. `services/progress/LearningFlow.ts`
  owns that chain; `services/progress/WordMastery.ts` tracks per-word mastery
  (met → spelled → mastered) and the Word Explorer level.
- **Games** live in `components/games/*`, one folder per game, each taking
  `{ words, onComplete }`. `pages/GameCenter` registers them and handles
  unlocking, favourites and personal bests (`services/games/GameStats.ts`).
- **Stars** are a single balance in `stores/rewards/useRewardStore.ts`
  (backed by `services/rewards/PointsService`). `stores/rewardStore.ts` is
  retired — do not import it.
- **Worlds** (`theme/worlds.ts`) re-skin the whole app; every component styles
  itself from CSS custom properties rather than fixed colours.

More detail in [`documents/`](documents/).
