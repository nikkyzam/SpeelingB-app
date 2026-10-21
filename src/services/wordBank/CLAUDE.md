# src/services/wordBank — module notes

## Purpose and public interface
Builds the `wordBank` singleton (class `WordBank`) at import time from the bundled lists in `src/data/wordData.js` plus every seasonal event word, adding a few derived display fields. It is the one place saved word ids turn back into `Word` objects, and the only source of Bee-level word lists. It is in-memory only: no storage, no events, no Firestore.
- Types: `Word`, `WordCategory`. About 30 games, pages and services import `Word` as a type only
- `Word` fields: required `id`, `word`, `meaning`, `sentence` (`sentences[0]` or a placeholder), `difficulty` 1|2|3, `category`. Optional: `sentences`, `vocabulary_question` (target word masked by runs of `█`), `source` (data file tag), `hint` (first sentence of the meaning), `phonetic` (just `/word/` except three hand-written ones), `synonyms` (empty except three)
- `category` is guessed from the meaning (`animals`, `activities` or `general`); seasonal words carry `seasonal` and only `hint` among the optional fields
- Lookup: `getWordById` (the main entry point), `getWordByWord` (ignores case and surrounding spaces, first match wins), `getLearnedWords(ids)` / `getUnlearnedWords(ids)` (these return **bank order**, not id order), `searchWords`, `getVocabularyQuestion`, `getMaskedVocabularyQuestion` (replaces each `█` run with the word once; falls back to `What does "<word>" mean?`)
- Levels: `availableLevels()` (the levels that have words, with counts), `getWordsForLevels(levels)` (the learning list), `getWordsByDifficulty(d)` (raw difficulty, so it includes seasonal words)
- Random: `getRandomWord(d?)` (includes seasonal words; returns the first word if the pool is empty), `getRandomWords(n, d?)` (bundled words only, via `wordData.getRandomWords`, mapped back by text)
- Whole bank: `getAllWords()` (a shallow copy; the `Word` objects are shared, so never mutate them), `getWordCount()`, `getWordsByCategory`, `getCategories` / `getCategoryById` (3 categories, none for `seasonal`)
- Seasonal: `registerWords(extra)` appends and skips ids it already knows. Only the constructor calls it

## Key files
- `src/services/wordBank/index.ts`: the `Word`/`WordCategory` types, the `WordBank` class and the exported `wordBank` instance (`words.json` beside it is dead; see root)

## How it talks to other modules
- Outbound: `src/data/wordData.js` (`ALL_WORDS`, `getRandomWords`, `searchWords`; types in `wordData.d.ts`) and `src/services/seasonal` (`getAllSeasonalWords`)
- `seasonal/index.ts` imports `Word` from here with `import type`. Keep it that way; a value import would create a runtime import cycle
- Learning list: `pages/LearningHub` calls `getWordsForLevels(learningFlow.getWordLevels())` and slices the result into groups of `groupSize` at `selectedGroup`. During a seasonal event it uses `seasonalEvent.words` directly and skips the bank
- Resolving saved ids: `pages/{GameCenter,DailyQuiz,Review,Progress,TrophyRoom,WordCollection}`, `components/progress/{NextUp,WordProgress}` and `services/admin/AdminProgress` map ids through `getWordById` and drop any that don't resolve
- Learned-word pools: `pages/{SiblingChallenge,SentenceMaker,WordHunt}` and `games/SiblingShowdown` call `getLearnedWords(learningFlow.getWordsLearnedTotal())`
- `pages/BeeTournament/bracket.ts` receives the bank as a `BankLike` (`getWordById`, `getWordsForLevels`). `index.tsx` passes `wordBank` in
- Admin: `components/admin/AdminUsers` reads `availableLevels()` once at module load for the level picker counts. `AdminProgress` uses it for "N of total" and per-level reach
- Learning components: `QuizMode` uses `getMaskedVocabularyQuestion` and every word's `.meaning` for distractors; `WordOfTheDay` uses `getWordsByDifficulty(1)`. The rest need only the `Word` type
- The ids it resolves are stored elsewhere, by `LearningFlow` (learned/spelled totals, quiz ids), `ReviewSchedule` and `WordMastery` (both keyed by id)
- Its only side effect is the console log `WordBank initialized with N words`

## Conventions and gotchas
- Levels, ids and dedupe are fixed upstream in `wordData.js` (per-file difficulty, pre-dedupe positional ids, first file wins): see `src/data/CLAUDE.md`
- The `word-NNN` fallback in `processWordData` can't be reached, because `wordData` always sets `id`. Don't build on it: it would be positional over the merged list
- A Bee level excludes `category === 'seasonal'` (`leveledWords`). `getWordsByDifficulty`, `getRandomWord` and `getAllWords` don't. Use `availableLevels` or `getWordsForLevels` for anything shown to users as a level (totals, pickers)
- Seasonal words are registered even out of season, so `seasonal-*` ids learned earlier still resolve. They are appended after all bundled words, so bundled positions never move. Where the text collides (e.g. `candy`), `getWordByWord`, `getRandomWords` and `searchWords` return the bundled word
- The order of `getWordsForLevels` is a persisted contract, because `LearningFlow` saves only the group index. The rules:
  - it dedupes and sorts the requested levels, so request order doesn't matter, and drops unknown or empty levels
  - a single level comes back in bank order
  - two or three levels are blended by weighted round-robin: the next word comes from whichever bucket has the lowest `cursor/length`, and ties go to the lower level
  - `[]`, or a request for only empty levels, returns `getAllWords()` unblended (bundled words, then seasonal ones)
- These change what a saved group contains:
  - reordering or inserting data
  - changing how levels are assigned or the order of dedupe
  - changing the round-robin or its tie-break
  - changing the `[]` fallback
- Appending words only extends a single-level list, but it re-spaces every blend slightly
- Resetting and clamping `selectedGroup` on a level change: `src/services/progress/CLAUDE.md`
- Scoping (the rule itself is in the root file). The guard scans only `*/index.tsx` under `components/games`, `components/learning` and `pages`:
  - games and play pages: `getRandomWords?|getAllWords|getWordsByDifficulty|getWordsForLevels|getUnlearnedWords|getWordsByCategory|searchWords` (widened after SpellingAdventure, WordRace, WordScramble and SpellSprint were found drawing on `getRandomWord`)
  - learning components: still only `getRandomWords|getAllWords|getWordsByDifficulty`, allowed when `.meaning` is within 90 chars
  - not scanned: `shared/*.ts`, `bracket.ts`, `SiblingChallenge/modes/*`, and `src/App.tsx`, which calls `getWordsForLevels` to count the words left in a child's levels (a number for LearningFlow, never words for a child)
- Allowed in games and learning:
  - `getWordById` / `getLearnedWords` on ids from `LearningFlow`
  - `getWordByWord` / `getMaskedVocabularyQuestion` for a word already in play
  - reading only `.meaning` from `getAllWords` (for distractors)
- Sanctioned exceptions:
  - WordChef: only `getAllWords` + `getWordByWord`, used as a dictionary
  - BeeBingo: only `getWordByWord` (via `isRealWord`), to keep real words out of its look-alike misspellings; nothing from the bank goes on a card
  - WordOfTheDay: shows one date-seeded level-1 word to collect, never to test
  - the LearningHub, Review, DailyQuiz and GameCenter pages
  - BeeTournament finals: a stretch tier one level up via `bracket.ts`
- `getWordById` and `getWordByWord` are linear scans, and `getLearnedWords` costs bank size × ids. Most callers wrap them in `useMemo`; do that in new render paths too
- Changing the `Word` shape: add new fields as optional. The `w()` builder in `seasonal/index.ts` and the hand-built fixtures in tests are typechecked (`tsconfig` includes `__tests__`)
- Games or learning components starting to use a new bank method: extend the regex in `wordScoping.test.ts`, and add the method to the `vi.mock` factories of tests that render that component. Those mocks are partial objects, so a missing method is `undefined`

## Testing this module
- `npx vitest run __tests__/unit/services/WordLevels.test.ts __tests__/unit/components/games/wordScoping.test.ts`
- `WordLevels.test.ts` runs against the real bank and data. It checks:
  - `availableLevels` and that seasonal words are excluded from levels
  - a blend is interleaved (checked on the first and last 10 words), with no losses or duplicates
  - order is stable whatever the request order, and nonsense levels are ignored
  - `LearningFlow` persistence of `wordLevels` and the group reset (it mocks `userStore` and `FirebaseSync`)
- `wordScoping.test.ts` is a static `fs` + regex scan with no bank import. It lists the game, learning and page folders itself
- `__tests__/unit/components/admin/AdminUsers.test.tsx` uses the real bank through `AdminProgress` → `availableLevels`, so it breaks if level totals change. `Trophies.test.ts` passes a fake `BankLike` to `buildBracket`
- `SiblingShowdown`, `LearnMode`, `QuizMode`, `SpellMode`, `DailyQuiz`, `LearningHub` and `AdminProgress` tests mock `@/services/wordBank` with partial objects. An unmocked import loads the full data set
- Untested:
  - `getWordByWord` and `getMaskedVocabularyQuestion` (only ever mocked)
  - `getRandomWord(s)`, `searchWords`, `registerWords` dedupe, category and hint derivation
  - whether seasonal ids resolve through `getWordById`
  - exact blend positions
