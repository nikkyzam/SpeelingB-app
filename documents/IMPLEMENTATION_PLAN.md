# 🛠️ Fun Features — Implementation Plan

**Product:** Kids Spelling Bee (SpeelingB-app)
**Companion document:** [FUN_FEATURES_REQUIREMENTS.md](FUN_FEATURES_REQUIREMENTS.md) (source of truth for *what*; this document is the *how*)
**Scope:** documentation only — no code changes in this deliverable.

---

## 1. Status at a Glance

| Feature | Title | Status |
|---|---|---|
| F1 | 🏆 Spelling Bee Tournament Mode | ✅ Shipped (`src/pages/BeeTournament`, route `/tournament`) |
| F2 | 🖼️ Trophy Room & Achievement Gallery | ✅ Shipped (`src/pages/TrophyRoom`, route `/trophies`, `src/services/trophies`) |
| F15 | 🕹️ Daily Game Rotation | ✅ Shipped (game-of-the-day on `main`) |
| F3 | 🏡 Buddy's Home (Decorate a Room) | 📋 Planned — Phase 1 |
| F9 | 🐣 Buddy Mini-Games | 📋 Planned — Phase 1 |
| F12 | 🌈 Kindness Quests | 📋 Planned — Phase 1 |
| F4 | 📖 Story Mode: The Word Quest | 📋 Planned — Phase 2 |
| F6 | 👨‍👩‍👧 Family Rally | 📋 Planned — Phase 2 |
| F10 | 🧭 Word Worlds Map Regions | 📋 Planned — Phase 2 |
| F13 | 🎨 Draw-a-Word Canvas | 📋 Planned — Phase 2 |
| F5 | 🎤 Voice Studio | 📋 Planned — Phase 3 |
| F7 | 🖨️ Printable Adventure Packs | 📋 Planned — Phase 3 |
| F8 | 🎵 Word Songs & Chants | 📋 Planned — Phase 3 |
| F11 | 📸 Grown-Up Corner 2.0 | 📋 Planned — Phase 3 |
| F14 | 🧑‍🏫 Classroom & List Sharing | 📋 Planned — Phase 4 (needs backend decision) |

---

## 2. Standing Architecture Conventions

Every feature below must follow the patterns already established in the codebase:

1. **Per-child, local-first persistence.** Each service in `src/services/`
   (`buddy`, `rewards`, `trophies`, `seasonal`, `games`, `progress`, `persistence`)
   scopes its localStorage keys to the active child. New services must do the same
   and must migrate gracefully when no key exists.
2. **Word scoping (hard rule).** Games and activities may only draw words the
   child has met (learned/in-progress pools). They must **not** call
   `wordBank.getRandomWords` / `getAllWords` / `getWordsByDifficulty` directly.
   Enforced by `__tests__/unit/components/games/wordScoping.test.ts` — any new
   word-using surface must be added to that test's coverage.
3. **Word data entry point.** All word access goes through `src/data/wordData.js`
   (merged, deduped `ALL_WORDS`) via `src/services/wordBank`. The new Scripps
   2022 lists in `src/data/spelling-bee/*.json` (see
   [SPELLING_BEE_WORDS.md](SPELLING_BEE_WORDS.md)) are **not yet imported**;
   features that need larger pools should plan on a loader being added first
   (pre-requisite task, Phase 1).
4. **Routes.** New pages register in `src/App.tsx` (routes currently span lines
   ~79–96) and, when they are games, also in the GameCenter catalogue array in
   `src/pages/GameCenter/index.tsx` (entries start ~line 200, with `id`, `title`,
   category, icon).
5. **Celebrations & sound.** Reuse the existing celebration components and the
   Web-Audio `sfx` utilities rather than introducing new audio assets or libraries.
6. **Rewards.** Trophy-type items currently fit `RewardItem.category: 'badge'`
   (`src/types/rewards.ts`). If a feature needs a new category (e.g. `'furniture'`
   for F3), extend the union type in one place and update the RewardShop filter UI.
7. **Testing.** Unit: Vitest (`vitest.config.ts`). E2E/visual: Cypress
   (`cypress/e2e`, `cypress.config.cjs`). Every feature ships with unit tests for
   its service and at least one Cypress smoke path.
8. **Design principles P1–P7** from the requirements doc apply throughout:
   no guilt mechanics, learning is the only currency, icons-first for pre-readers,
   encouragement over correction.

---

## 3. Phase 1 — Buddy Bond (F3, F9, F12)

Theme: deepen the child's attachment to their buddy. Small, self-contained,
high delight-per-effort. Also contains the shared pre-requisite for later phases.

### Task 0 (pre-requisite): Scripps 2022 word-list loader

- Add a loader in `src/services/wordBank` (or a new `src/services/words/bee2022.ts`)
  that imports `src/data/spelling-bee/{one,two,three}-bee-2022.json` and adapts
  entries to the app's word shape. `meaning` / `sentences` / `vocabulary_question`
  are absent in the source data — loader must tolerate empty fields and the UI must
  hide meaning/sentence affordances when they are empty.
- Gate behind a parent setting (default off) so it never silently changes what a
  child sees. Wire into the Settings page where Bee-level selection already lives.
- Tests: unit-test the adapter (counts: 825 / 2,025 / 1,149; alternates preserved;
  dedupe against existing bank by lower-cased word).

### F3 — 🏡 Buddy's Home (Decorate a Room)

**Data model.** New service `src/services/buddyHome/`:
`BuddyHomeState = { placed: { itemId, x, y, rotation }[], wallpaperId, floorId }`,
persisted per child. Furniture items are rewards: extend `RewardItem.category`
with `'furniture'` in `src/types/rewards.ts`.

**New files.**
- `src/pages/BuddyHome/` — room scene (single screen, drag-and-drop grid, no
  scrolling; P6 one-thumb rule).
- `src/services/buddyHome/` — state, purchase/placement logic.
- Furniture catalogue data file (12–18 launch items + 2 wallpapers + 2 floors).

**Edits.**
- `src/App.tsx`: route `/buddy-home`.
- `src/types/rewards.ts`: add `'furniture'` category.
- `src/pages/RewardShop`: filter chip for Furniture; buying adds to home inventory.
- Buddy page/widget: "Visit home" entry point.

**Kid-facing rules.** Furniture is bought with stars (learning currency, P2).
Buddy plays idle animations among placed items. Nothing decays (P1).

**Tests.** Placement service unit tests (bounds, overlap, persistence round-trip);
Cypress: buy item → place it → reload → still there.

**Effort:** M.

### F9 — 🐣 Buddy Mini-Games (Care Through Play)

**Concept.** Three tiny games playable *with* the buddy from its home or page:
Fetch (spell to throw), Hide & Seek (find buddy behind word cards), Trick Show
(chain 3 correct answers → buddy performs). "Care" is expressed through play,
never meters (P1 — no hunger/happiness bars).

**New files.**
- `src/components/buddy/games/FetchGame.tsx`, `HideSeekGame.tsx`, `TrickShowGame.tsx`.
- Register all three in the GameCenter catalogue (`category: 'arcade'`, tagged
  `buddy`) and as launch points inside Buddy's Home (F3) / buddy page.

**Data.** Reuse buddy service for unlocks; each game awards small star amounts
with a daily soft cap stored per child (prevents grinding without punishing absence).

**Word scoping.** All three use the child's met-words via the standard scoping
helper; add to `wordScoping.test.ts`.

**Tests.** Per-game unit tests for state machines; one Cypress path (open Fetch,
spell a word, buddy reacts).

**Effort:** M. **Depends on:** F3 optional but recommended (games live in the home).

### F12 — 🌈 Kindness Quests (Pro-social Play)

**Concept.** Daily gentle prompts ("Give someone a compliment", "Help clean up"),
self-confirmed with a big "I did it!" button; completing one grows a Kindness
Garden — a flower is planted in a garden strip shown on Home.

**Data model.** `src/services/kindness/`:
`{ completedByDate: Record<isoDate, questId[]>, garden: { questId, plantedAt }[] }`.
Quest catalogue: ~40 static prompts in a data file, rotated deterministically
(3 per day, seeded by date so siblings on the same day get the same set).

**New files.**
- `src/services/kindness/`, `src/data/kindnessQuests.js`.
- `src/components/kindness/KindnessGarden.tsx` (Home page strip) and a quest card
  component with TTS read-aloud (P5).

**Edits.** `src/pages/Home`: garden strip + today's quest card. Optional
grown-up toggle in Settings (some families will want it off).

**Tests.** Rotation determinism unit test; "no more than one flower per quest per
day" test; Cypress: complete a quest → flower appears.

**Effort:** S.

---

## 4. Phase 2 — Worlds & Stories (F4, F6, F10, F13)

### F4 — 📖 Story Mode: The Word Quest

**Concept.** Short branching stories (8–12 panels) where the child spells words
to advance the plot ("spell *bridge* to cross the river"). Words come from the
child's current learning list; story text has TTS.

**Data model.** `src/services/story/`:
`{ progressByStory: Record<storyId, { panel, completed }> }`.
Stories are data, not code: `src/data/stories/*.json` with
`{ id, title, panels: [{ text, illustration, challenge?: { wordSlot, difficulty } }] }`.
`wordSlot` is filled at runtime from the child's scoped words matching
`difficulty` — stories stay personal and reusable.

**New files.** `src/pages/StoryQuest/` (panel renderer + spelling interludes),
`src/services/story/`, 3 launch stories (~10 panels each).
Illustrations: emoji/composition art only for launch (no asset pipeline).

**Edits.** Route `/story`, `/story/:storyId`; Home card under Learn.

**Tests.** Story-engine unit tests (fill slots, advance, complete, restart);
Cypress: finish story 1 end-to-end with seeded words.

**Effort:** L (engine M + content S per story).

### F6 — 👨‍👩‍👧 Family Rally (Weekly Household Leaderboard)

**Concept.** A weekly family goal ("our family spelled 100 words this week!") with
a cooperative progress bar plus a friendly per-child star count. Cooperative first:
the bar fills from everyone's learning; ranking is secondary and never shames (P1/P7).

**Data model.** Extends `src/services/progress`: weekly aggregate per child is
already computable; add `src/services/familyRally/` for
`{ weekStart, goal, contributions: Record<childId, number> }`.

**New files.** `src/components/family/FamilyRallyCard.tsx` on Home (visible to
every profile) and a weekly celebration when the goal is met (reuse celebration
components).

**Edits.** Home page; Settings → grown-up sets the weekly goal and can disable.

**Tests.** Contribution aggregation unit tests (multi-child fixtures); week-rollover
test (previous week archived, new week empty); Cypress with two seeded children.

**Effort:** M.

### F10 — 🧭 Word Worlds: Unlockable Map Regions

**Concept.** The quest map gains named regions (Honey Meadows → Crystal Caves →
Cloud Kingdom). Regions unlock by mastered-word count, and each region re-skins
the map background, buddy accessories, and ambient sounds.

**Data model.** `src/services/worlds/`: region catalogue (threshold, theme asset
keys) + per-child unlocked list. Reuses the existing seasonal/theme plumbing.

**Edits.** Quest map page renders region theming; unlock triggers a celebration
+ new trophy (F2 Trophy Room entry, category `'special'`).

**Tests.** Threshold unlock unit tests; no region unlocks regress without the
required mastery count.

**Effort:** M. **Depends on:** none, but shines after F3 (region furniture bundles).

### F13 — 🎨 Draw-a-Word Canvas

**Concept.** After spelling a word, the child can draw it (finger/stylus on
canvas) and save it to their Word Collection card — their art becomes the card art.

**New files.** `src/components/draw/DrawingCanvas.tsx` (pointer events, 8-color
palette, 3 brush sizes, eraser, undo). Persist drawings as data-URLs via a new
`src/services/wordArt/` keyed by child + word (watch localStorage size: cap
stored drawings, e.g. latest 100, compress to max 512px).

**Edits.** Word Collection card shows child art when present; "Draw" button on
word-detail view.

**Tests.** Service round-trip, cap eviction, corrupt-data recovery. Canvas itself
covered by Cypress smoke (draw stroke → save → visible on card).

**Effort:** M.

---

## 5. Phase 3 — Rich Media & Grown-Ups (F5, F7, F8, F11)

### F5 — 🎤 Voice Studio (Record & Play Back)

- MediaRecorder-based: child records themselves saying/spelling a word, plays it
  back, saves one take per word. Stored as blobs in IndexedDB (localStorage is
  wrong for audio) via `src/services/voiceStudio/`.
- Mic permission failure must degrade gracefully (button hides, no error walls).
- COPPA: recordings never leave the device (P4); delete-all control in Settings.
- Effort: M. Tests: service logic with mocked MediaRecorder; permission-denied path.

### F7 — 🖨️ Printable Adventure Packs

- Print stylesheets + a generator page (`/print`) that lays out word searches,
  handwriting sheets, and flashcards from the child's current words; `window.print()`
  only, no PDF library for v1.
- Effort: M. Tests: snapshot/layout unit tests; Cypress print-view render check.

### F8 — 🎵 Word Songs & Chants

- Rhythmic letter-chant player using existing Web-Audio sfx: letters spoken/sung in
  time with a beat, clap-along mode. No licensed music; synthesized beats only.
- Effort: M. Tests: sequencer timing unit tests; mute/volume settings respected.

### F11 — 📸 Grown-Up Corner 2.0 (Progress Reports)

- Extends `src/pages/Progress` and Settings: weekly summary view, per-word
  mastery heatmap, export (JSON/CSV) — building on the existing export controls —
  and a "share snapshot" PNG card generated client-side.
- Effort: M. Tests: aggregation correctness against seeded progress fixtures;
  export file shape tests.

---

## 6. Phase 4 — Connected (F14)

### F14 — 🧑‍🏫 Classroom & List Sharing (Teacher Mode)

The only feature requiring a backend decision. Options:

1. **Local-first MVP (recommended):** export/import a custom word list as a
   JSON file or short share code (compressed JSON). Teacher makes a list, parents
   import it. No accounts, no PII, fits P4 perfectly.
2. **Firebase-backed (future):** custom lists in Firestore behind the existing
   admin/auth claims. Only if demand proves out.

Plan implements option 1: `src/services/customLists/` (validate, dedupe, scope to
child), UI in Settings (import) and a new Teacher export page. Word-scoping test
extended so custom-list words flow into games only after the child has met them
in Learn.

**Effort:** M (option 1) / XL (option 2).

---

## 7. Rollout & Sequencing

```
Phase 1  Task 0 (bee2022 loader) → F3 → F9 → F12
Phase 2  F4 → F6 → F10 → F13        (can parallelize after F4's engine)
Phase 3  F5, F7, F8, F11            (independent; pick by family feedback)
Phase 4  F14 (option 1)
```

- Ship each phase behind its own commits on a feature branch; keep `main`
  releasable after every feature, matching the current one-commit-per-feature
  history style.
- After each phase, run the full gate: `npm run build`, `npm run test` (Vitest),
  and the Cypress smoke suite against the dev server.

## 8. Cross-Cutting Risks

| Risk | Mitigation |
|---|---|
| localStorage quota (art F13, voice F5) | IndexedDB for blobs; caps + eviction; quota-error fallback messaging |
| New reward categories break RewardShop filters | Single-source the category union in `src/types/rewards.ts`; add filter chips data-driven |
| Word-pool dilution from 3,999-word Scripps import | Loader gated by parent setting; word-scoping test must cover it |
| Scope creep in content (stories, furniture, quests) | All content as data files; launch minimums stated per feature |
| Sibling data leakage between profiles | Every new service keys by child id; add a persistence-scoping unit test per service |

## 9. Definition of Done (per feature)

1. Requirements acceptance criteria in FUN_FEATURES_REQUIREMENTS.md all met.
2. Service unit tests + word-scoping test updated; `npm run test` green.
3. Cypress smoke path for the primary flow; screenshots verified visually.
4. Route registered, entry point reachable from Home or GameCenter.
5. Settings/grown-up toggle where the feature changes what a child sees.
6. No new dependencies without noting them in this plan's follow-up section.
