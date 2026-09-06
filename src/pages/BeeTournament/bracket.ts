import type { Word } from '../../services/wordBank'

/**
 * Building the week's bracket.
 *
 * Five rounds that get harder, drawn first from words the child has actually
 * spelled — the Bee is a stage for what they know, not a test of what they do
 * not. The finals are allowed to reach one tier above their setting, so the
 * last rounds feel like a stretch rather than a trick.
 *
 * The bracket is seeded from the week number, so the Grand Bee is the same all
 * week (a child can practise it) and turns over on Monday.
 */

export interface RoundSpec {
  name: string
  blurb: string
  words: number
  /** allowed to reach above the child's usual level */
  stretch: boolean
}

export const ROUNDS: RoundSpec[] = [
  { name: 'Warm-up', blurb: 'Three words you know well. Shake off the nerves!', words: 3, stretch: false },
  { name: 'Qualifier', blurb: 'Four words. Take your time.', words: 4, stretch: false },
  { name: 'Semi-final', blurb: 'Four words, and they are getting harder.', words: 4, stretch: false },
  { name: 'Final', blurb: 'Three words. The crowd is watching!', words: 3, stretch: true },
  { name: 'Championship', blurb: 'One word for the Golden Cup. You can do this.', words: 1, stretch: true },
]

/** ISO-ish week stamp: the Monday that starts the current week. */
export const grandBeeWeek = (now: Date = new Date()): string => {
  const d = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const dayFromMonday = (d.getDay() + 6) % 7
  d.setDate(d.getDate() - dayFromMonday)
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
}

/** Deterministic shuffle, so the week's Bee is the same every time it is opened. */
const seededShuffle = <T,>(items: readonly T[], seed: string): T[] => {
  let h = 2166136261
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  const rand = () => {
    h = Math.imul(h ^ (h >>> 15), h | 1)
    h ^= h + Math.imul(h ^ (h >>> 7), h | 61)
    return ((h ^ (h >>> 14)) >>> 0) / 4294967296
  }
  const out = [...items]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

/** A word a child can be asked to spell letter by letter. */
const spellable = (w: Word) => /^[a-z]+$/i.test(w.word) && w.word.length >= 3

interface FlowLike {
  getWordsSpelledTotal(): string[]
  getWordsLearnedTotal(): string[]
  getWordLevels?: () => (1 | 2 | 3)[]
}
interface BankLike {
  getWordById(id: string): Word | undefined
  getWordsForLevels(levels: readonly number[]): Word[]
}

/**
 * The five rounds, easiest first.
 *
 * Words already spelled correctly come first, then merely met ones, and the
 * final rounds may reach a tier higher. Short rounds are returned rather than
 * padded with strangers: a three-round Bee for a new child is better than a
 * five-round one full of words they have never seen.
 */
export const buildBracket = (flow: FlowLike, bank: BankLike, now: Date = new Date()): Word[][] => {
  const seed = grandBeeWeek(now)
  const resolve = (ids: string[]) =>
    ids.map((id) => bank.getWordById(id)).filter((w): w is Word => !!w && spellable(w))

  const spelledIds = flow.getWordsSpelledTotal()
  const spelledSet = new Set(spelledIds)
  const confident = seededShuffle(resolve(spelledIds), `${seed}|confident`)
  // Met but never spelled correctly — fine for the early rounds.
  const met = seededShuffle(
    resolve(flow.getWordsLearnedTotal()).filter((w) => !spelledSet.has(w.id)),
    `${seed}|met`
  )

  // One tier above whatever they normally learn from, for the finals only.
  const levels = flow.getWordLevels?.() ?? []
  const highest = levels.length > 0 ? Math.max(...levels) : 2
  const stretchPool = seededShuffle(
    bank.getWordsForLevels([Math.min(highest + 1, 3)]).filter(spellable),
    `${seed}|stretch`
  )

  const used = new Set<string>()
  const take = (pools: Word[][], n: number): Word[] => {
    const out: Word[] = []
    for (const pool of pools) {
      for (const w of pool) {
        if (out.length >= n) return out
        if (used.has(w.id)) continue
        used.add(w.id)
        out.push(w)
      }
    }
    return out
  }

  return ROUNDS.map((spec) =>
    take(spec.stretch ? [confident, met, stretchPool] : [confident, met], spec.words)
  )
}
