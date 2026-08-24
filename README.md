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
