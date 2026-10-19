# src/data — module notes

## Purpose and public interface
Static, build-time content: the spelling word bank (four hand-authored arrays merged by `wordData.js`) and the local Christian bookshelf. No state, no network, nothing persisted here.
- `wordData.js` (types hand-written in `wordData.d.ts`): app code uses only `ALL_WORDS` (merged, deduped, each entry stamped with `id`, `difficulty`, `source`), `getRandomWords(count, difficulty?)` and `searchWords(query)` (substring over `word` + `meaning`). `getAllWords`, `getWordsByDifficulty`, `getWordByText`, `ONE/TWO/THREE_BEE_WORDS` have no app importers but are handy from node.
- `books/christianBooks.ts`: `christianBooks`, `christianReadingLevels`, `christianCategories`, types `ChristianBook`, `BookPage`, `ReadingLevel`.

## Key files
- `wordData.js` — merge, dedupe, id stamping; logs "Word data loaded with N words" on import. `wordData.d.ts` is not generated: edit it if exports change
- `original/word-concise-all-bee.js` — ~450 short/easy words, difficulty 1, source `concise-all-bee`
- `original/word-one-bee-data.js` — ~1k words, difficulty 1, source `one-bee` (older style: two sentences each)
- `original/word-two-bee-data.js` — ~2k words, difficulty 2, source `two-bee`
- `original/word-three-bee-data.js` — difficulty 3, source `three-bee`; the file that grows via batch commits (216 raw, 211 after dedupe); masks written as `\u2588` escapes (the other three files use a literal `█`)
- `word-concise-all-bee.js`, `word-{one,two,three}-bee-data.js` (top level) — 3-line wrappers re-exporting the `original/` arrays so `wordData.js` import paths survived the move into `original/`. Never add words here. Their named exports (`ONE_BEE_WORDS`…) are one raw file each and unused; `wordData.js`'s same-named exports mean "all words of that difficulty"
- `spelling-bee/{one,two,three}-bee-2022.json` — Scripps 2022 public lists, words only (`{ level, name, source, studyListCount, championsCount, totalCount, words: [{ word, alternates?, section }] }`). Unwired because they have no meaning/sentence/question and the gated loader (Task 0, `documents/IMPLEMENTATION_PLAN.md`) isn't built. Use as a pick-list when authoring a batch; provenance/licence in `documents/SPELLING_BEE_WORDS.md`
- `books/christianBooks.ts` — 8 local books (`cbook-001`…), reading levels for ages 3–10, category chips; its `getBooksBy*` helpers are unused (`BookService` reimplements them over local + online books)
- `books/index.ts` — barrel nobody imports; consumers import `books/christianBooks` directly
- `test-import.js` — dead (see root); imports a nonexistent `./importWords.js`, so importing it breaks the build
- Root `INSTRUCTIONS.md` predates the `original/` split: word content lives in `original/`, not `src/data/*.js`

## How it talks to other modules
- Sole importer of `wordData.js`: `src/services/wordBank/index.ts`. It reads only `id`, `word`, `meaning`, `sentences`, `vocabulary_question`, `difficulty`, `source`, so any other key on an entry is dropped (derived fields: `src/services/wordBank/CLAUDE.md`)
- Array order is consumed: `wordBank.getWordsForLevels` keeps `ALL_WORDS` order within a level and LearningHub groups it by the saved `selectedGroup` (order contract: wordBank CLAUDE.md)
- Per-level counts → `wordBank.availableLevels()` → admin totals (`src/components/admin/AdminUsers.tsx`, `src/services/admin/AdminProgress.ts`) and level pickers; a level with 0 words vanishes from pickers
- `meaning` → vocab-quiz answer and distractors (`QuizMode`), `DefinitionDetective` clue (text before the first `.`, meaning must be >8 chars)
- `sentences[0]` → Learn/Spell/TestAll/DailyQuiz/SiblingShowdown, which blank the word out of it (several with a case-sensitive `replace`)
- `vocabulary_question` → `wordBank.getMaskedVocabularyQuestion` (vocab quiz, shown and spoken)
- Books: `src/services/books/bookService.ts`, `src/components/reading/*`, `src/pages/ReadingHub.tsx` import `christianBooks.ts`; `src/services/books/apiService.ts` converts Open Library/Gutenberg results into `ChristianBook`, so that interface is shared with online books

## Conventions and gotchas
- Merge order is concise → one → two → three. Dedupe key is `word.toLowerCase().trim()`; the first occurrence wins and later copies are silently dropped
- Ids are stamped from the raw array index BEFORE dedupe, so a dropped duplicate still holds its index: deleting it shifts every later id in that file
- Reordering the merge changes which copy of a cross-file duplicate wins (e.g. `nirvana` is `one-bee-609`; its two-bee copy is dropped), changing its id and level. Likewise appending a word to an earlier file that a later file already has drops the later copy's id from the bank. Renaming a `source` string or a file's difficulty rewrites every id/level in that file
- `id`/`difficulty`/`source` keys on an entry are overwritten: difficulty is per file, not per entry
- Editing `meaning`/`sentences`/`vocabulary_question` in place is safe; editing an existing `word` is not (the saved id now means another word, or becomes a dropped duplicate)
- Append to the LAST file of a level in merge order (level 1 → `word-one-bee-data.js`, not concise): appending earlier shifts every later word's group for children on that level
- Entry rules, as in the Three Bee batch commits (`git log -- src/data/original/word-three-bee-data.js`):
  - `word`: preferred US spelling; keep proper-noun capitals. Multi-word/accented entries are allowed, but `isPlayable` (`src/components/games/shared/wordTricks.ts`) and BeeTournament's `spellable` skip anything not `[a-z]+`
  - `meaning`: written fresh for this app, kid-readable, first sentence works alone as a clue (no "e.g." before it), never contains the word. No reliable meaning → leave the word out
  - `sentences`: one sentence (only `[0]` is used) containing `word` verbatim in the same case — a capitalised sentence-initial copy survives the blanking and shows the answer
  - `vocabulary_question`: either/or question ending in `?`, the word replaced by one `█` per letter (literal `█` or `\u2588`; match the file). Every `█` run is swapped back for the word, so it must read naturally once filled; never write the word itself
- Add-a-batch checklist:
  1. Check each candidate from repo root: `node -e "import('./src/data/wordData.js').then(m=>console.log(m.getWordByText('WORD')))"`; skip hits and name them in the commit
  2. Append at the end of the target `original/` array; touch nothing above it
  3. Take the new total from the "Word data loaded with N words" line of that one-liner — it counts unique words, not the sum of array lengths
  4. Update the `3/N words` and `of N words met` assertions in `__tests__/unit/components/admin/AdminUsers.test.tsx` (comma-formatted)
  5. Run the tests below, then the root pre-PR check. Commit like "Three Bee, D–F: 88 more words", body lists skipped duplicates/omissions and the new total
- Books: `coverImage`/`image` are root-relative `/images/books/christian/*.jpg` URLs; the repo has no `public/` dir yet, so real art goes in `public/images/books/christian/`
- Local book ids stay `cbook-NNN`: `BookService` routes `api-` and `guten-` ids to online fetches
- `christianReadingLevels[].recommendedBooks` must name existing book ids; a book shows under a `christianCategories` chip only if its `categories` contains that chip's `id` exactly

## Testing this module
- `npx vitest run __tests__/unit/services/WordLevels.test.ts __tests__/unit/components/admin/AdminUsers.test.tsx __tests__/unit/services/books.test.ts`
- `WordLevels.test.ts` (real data): all three levels non-empty, level and blend sizes, blend interleaving, order stability so group numbers keep their meaning
- `AdminUsers.test.tsx` (real data): pins the unique total and ids `concise-all-bee-0..2` (`-1` must be "send"), so the head of the concise file is frozen
- `books.test.ts`: only `BookService` online deep links with `fetch` stubbed; local book data is untested
- Most other suites mock `@/services/wordBank`, so they won't notice data changes
- Untested: entry shape and the quality rules above, cross-file duplicates, the `spelling-bee/` JSON. Check a new batch with a node one-liner over the appended slice
