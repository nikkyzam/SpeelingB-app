import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'

const SRC = path.resolve(__dirname, '../../../../src')
const GAMES_DIR = path.join(SRC, 'components/games')
const PAGES_DIR = path.join(SRC, 'pages')

/**
 * A child should only ever meet words they are actually learning. It is very
 * easy to "fix" a short game by topping it up from the whole word bank, so this
 * test guards the rule at the source: games receive their words as a prop.
 *
 * WordChef is the one exception, and only for checking whether something the
 * child spelled is a real word — it never draws game words from the bank.
 */
const ALLOWED = new Set(['WordChef'])

const gameFiles = fs
  .readdirSync(GAMES_DIR, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => ({ name: d.name, file: path.join(GAMES_DIR, d.name, 'index.tsx') }))
  .filter((g) => fs.existsSync(g.file))

/**
 * Playful pages outside src/components/games play with the child's words too —
 * Silly Sentences and Word Hunt both shipped padding from the whole bank
 * because this test only looked at the games folder.
 */
const playPages = fs
  .readdirSync(PAGES_DIR, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => ({ name: d.name, file: path.join(PAGES_DIR, d.name, 'index.tsx') }))
  .filter((p) => fs.existsSync(p.file))
  // Pages that legitimately present the whole bank: the hub is where words are
  // chosen in the first place, and Review/DailyQuiz work off the same list.
  .filter((p) => !['LearningHub', 'Review', 'DailyQuiz', 'GameCenter'].includes(p.name))

describe('games only use the words a child is learning', () => {
  it('finds the games to check', () => {
    expect(gameFiles.length).toBeGreaterThan(20)
  })

  gameFiles
    .filter((g) => !ALLOWED.has(g.name))
    .forEach(({ name, file }) => {
      it(`${name} never pulls words from the shared bank`, () => {
        const src = fs.readFileSync(file, 'utf-8')
        const leaks = src.match(/wordBank\.(getRandomWords|getAllWords|getWordsByDifficulty)/g)
        expect(leaks, `${name} sources words outside the child's own list`).toBeNull()
      })
    })

  playPages.forEach(({ name, file }) => {
    it(`page ${name} never pads from the shared bank`, () => {
      const src = fs.readFileSync(file, 'utf-8')
      const leaks = src.match(/wordBank\.(getRandomWords|getAllWords|getWordsByDifficulty)/g)
      expect(leaks, `${name} sources words outside the child's own list`).toBeNull()
    })
  })

  it('WordChef uses the bank only to check spelling, never to pick words', () => {
    const src = fs.readFileSync(path.join(GAMES_DIR, 'WordChef/index.tsx'), 'utf-8')
    expect(src).not.toMatch(/wordBank\.getRandomWords/)
    // The only allowed uses are dictionary lookups: is this a real word?
    const uses = src.match(/wordBank\.(\w+)/g) || []
    expect(uses.sort()).toEqual(['wordBank.getAllWords', 'wordBank.getWordByWord'])
  })
})
