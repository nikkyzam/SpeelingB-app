import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'

const SRC = path.resolve(__dirname, '../../../src')

const sourceFiles = (dir: string): string[] =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = path.join(dir, d.name)
    if (d.isDirectory()) return sourceFiles(p)
    return /\.tsx$/.test(d.name) ? [p] : []
  })

/**
 * Files where a child is asked to spell a word. Anything here must stop the
 * device helping: on an iPad, autocorrect rewrites a misspelling as it is
 * typed and the predictive bar offers the finished word above the keys.
 *
 * Inputs for names, searches and grown-up settings are deliberately not
 * listed — capitalising a name is a kindness, not cheating.
 */
const SPELLING_FILES = [
  'components/learning/SpellMode/index.tsx',
  'components/learning/QuizMode/index.tsx',
  'pages/DailyQuiz/index.tsx',
  'pages/BeeTournament/index.tsx',
  'pages/SiblingChallenge/modes/SpellTurn.tsx',
  'components/games/WordScramble/index.tsx',
  'components/games/SpellSprint/index.tsx',
  'components/games/MysteryPicture/index.tsx',
  'components/games/GhostWord/index.tsx',
  'components/games/BibleMemorizer/index.tsx',
  'components/games/SiblingShowdown/index.tsx',
  'components/games/SpellTower/index.tsx',
  'components/games/DragonDuel/index.tsx',
  'components/games/SpellingAdventure/index.tsx',
  'components/games/StoryBuilder/index.tsx',
  'components/learning/TestAll/index.tsx',
]

/**
 * Every other text box in the app, and why it is not a spelling test.
 *
 * The list above is the wrong shape on its own: it only protects boxes someone
 * remembered to add. Two real spelling tests — the Test All Words round and
 * Story Builder's bonus word — sat unprotected for exactly that reason. So the
 * rule below is inverted: EVERY text input must be either a SpellingInput or
 * named here. Capitalising a name or a search is a kindness, not cheating.
 */
const NOT_SPELLING: Record<string, string> = {
  'components/auth/AuthModal.tsx': 'signing in — name, email, password',
  'components/profile/WhoIsPlaying/index.tsx': "the child's own name",
  'components/buddy/BuddyCard/index.tsx': 'naming the buddy',
  'components/admin/AdminUsers.tsx': "a grown-up's controls",
  'components/challenge/PrizeSetter/index.tsx': 'a grown-up types the prize',
  'components/reading/BookShelf.tsx': 'searching books',
  'components/bible/BibleApiDashboard/index.tsx': 'searching verses',
  'components/games/SiblingShowdown/index.tsx': 'player names (its spelling box is a SpellingInput)',
  'pages/SiblingChallenge/index.tsx': 'player names',
  'pages/WordCollection/index.tsx': 'searching their own words',
}

/** Inputs that cannot carry a word at all. */
const NOT_TEXT = /type="(range|number|checkbox|radio|file|color|date|email|password|submit|hidden)"/

describe('no device may spell the word for a child', () => {
  it.each(SPELLING_FILES)('%s spells into a SpellingInput, not a bare <input>', (rel) => {
    const src = fs.readFileSync(path.join(SRC, rel), 'utf-8')
    expect(
      src.includes('<SpellingInput'),
      `${rel} does not use SpellingInput. Without it an iPad will autocorrect the ` +
        `child's answer and its predictive bar will offer the whole word.`
    ).toBe(true)
    // A bare input with the attributes hand-spread is the old, weaker fix.
    expect(src, `${rel} still spreads NO_SPELLING_HELP by hand`).not.toContain('NO_SPELLING_HELP')
  })

  it('no text box anywhere is a spelling test in disguise', () => {
    const offenders: string[] = []
    for (const file of sourceFiles(SRC)) {
      const rel = path.relative(SRC, file).split(path.sep).join('/')
      if (rel.startsWith('components/common/SpellingInput/')) continue // the box itself
      if (NOT_SPELLING[rel]) continue
      const src = fs.readFileSync(file, 'utf-8')
      for (const match of src.matchAll(/<input\b/g)) {
        const props = src.slice(match.index, match.index + 420)
        if (NOT_TEXT.test(props)) continue
        offenders.push(`${rel} (line ${src.slice(0, match.index).split('\n').length})`)
      }
    }
    expect(
      offenders,
      'A raw <input> a child could be asked to spell into. Use SpellingInput, ' +
        'or add the file to NOT_SPELLING saying what the box is really for.'
    ).toEqual([])
  })

  it('every listed file actually exists, so the list cannot rot silently', () => {
    for (const rel of SPELLING_FILES) {
      expect(fs.existsSync(path.join(SRC, rel)), `${rel} is listed but missing`).toBe(true)
    }
  })

  it('the shared box covers what an iPad actually does', () => {
    const src = fs.readFileSync(path.join(SRC, 'components/common/SpellingInput/index.tsx'), 'utf-8')
    // autoCorrect is the Safari-specific one and the one most often forgotten.
    for (const attr of ['autoComplete', 'autoCorrect', 'autoCapitalize', 'spellCheck']) {
      expect(src, `NO_SPELLING_HELP is missing ${attr}`).toContain(attr)
    }
    // No web page can remove the predictive bar, so on touch the system
    // keyboard is never opened and the child spells on our own keypad.
    expect(src).toContain("inputMode={touch ? 'none'")
    expect(src).toContain('spelling-keypad')
  })

  it('no game hands a child the answer before they answer', () => {
    const offenders: string[] = []
    for (const file of sourceFiles(SRC)) {
      const src = fs.readFileSync(file, 'utf-8')
      const rel = path.relative(SRC, file)
      // The learn step is where a word is taught, so a hint belongs there.
      if (rel.includes('LearnMode')) continue
      // Games with no word in them: a nudge in a tile puzzle gives away no
      // spelling. These mirror GameCenter's own wordless-game list.
      if (/PuzzleSlider|PatternMemory|PatternSequencer|ColorMixer|MathPuzzle|ReactionTest|MemoryGrid|RhythmTap|ShapeCatcher|MusicComposer|PhysicsPuzzle/.test(rel)) continue
      if (/show first letter|Get Hint|Hint Used|revealFirst/i.test(src)) offenders.push(rel)
    }
    expect(
      offenders,
      'These reveal part of the answer while a child is being tested on it.'
    ).toEqual([])
  })
})
