# Scripps Spelling Bee Word Lists — Provenance & Integration Notes

## What was requested

Pull the 2027 Scripps Spelling Bee words for each difficulty section: One Bee, Two Bee, Three Bee.

## What is actually available (checked 2026-09-06)

The **2027 (2026–27 school year) official lists are not publicly downloadable**. They are
distributed only through:

- the spellingbee.com educator portal, for schools enrolled in the 2026–27 program
  (enrollment opened August 18, 2026, $199/school),
- the printed *Words of the Champions* 2027 booklet sold on Amazon (after Labor Day 2026),
- the free **Word Club** app (iOS/Android, 2027 version released after Labor Day 2026),
  which contains all 450 School Spelling Bee Study List words and all 4,000
  Words of the Champions words as in-app quizzes.

The most recent edition that Scripps itself has posted publicly is the
**2022 Words of the Champions** low-ink printable PDF:
`https://www.spellingbee.com/sites/default/files/inline-files/2022 Words of the Champions_low_ink_printable.pdf`

## What was produced

The 2022 public PDF (28 pages) was parsed with `pdfplumber`, extracting the 12 pt word
grid while excluding headers, page furniture, and trivia sidebars (9 pt). British/variant
spellings marked "OR" in the booklet are stored as `alternates` on the primary
(Merriam-Webster preferred) entry.

Files written to `src/data/spelling-bee/`:

| File | Study-list words | Champions words | Total |
|---|---|---|---|
| `one-bee-2022.json` | 150 | 675 | 825 |
| `two-bee-2022.json` | 150 | 1,875 | 2,025 |
| `three-bee-2022.json` | 150 | 999 | 1,149 |

Grand total: **3,999 entries** — matching the published 4,000-word size of the booklet
(per-level counts in the booklet's own introduction are rounded and do not match the
actual printed grids; the totals reconcile).

Each level's first 150 entries (`section: "school-study-list"`) are the official
School Spelling Bee Study List for classroom/school bees; the remainder
(`section: "words-of-the-champions"`) are for district/regional/national preparation.

### Entry format

```json
{
  "word": "favorite",
  "alternates": ["favourite"],
  "section": "words-of-the-champions"
}
```

- `word` — the preferred (Merriam-Webster) spelling. Multi-word entries
  (e.g. "dim sum", "Yom Kippur") are kept as single entries.
- `alternates` — optional; accepted variant spellings (usually chiefly British).
- `section` — `"school-study-list"` or `"words-of-the-champions"`.

## Known gaps / follow-ups

1. **No meanings, sentences, or vocabulary questions.** The Scripps booklet contains
   words only. The app's existing word format (`src/data/original/word-*-bee-data.js`)
   expects `meaning`, `sentences[]`, and `vocabulary_question`. Generating those for
   3,999 words is a separate content task and should be reviewed before shipping.
2. **Not wired into the app yet.** The files are data-only; nothing imports them.
   To use them, either convert to the existing module shape in `src/data/wordData.js`
   or add a loader in `src/services/wordBank` (mind the word-scoping rule tested in
   `__tests__/unit/components/games/wordScoping.test.ts`).
3. **2027 refresh.** If the family/school enrolls (or uses the Word Club app), the
   2027 lists can replace these files with the same shape; each year's edition swaps
   roughly 800 words.
4. **Licensing note.** These lists are published by the Scripps National Spelling Bee
   for study purposes. Fine for personal/educational use in this app; do not
   redistribute commercially.
