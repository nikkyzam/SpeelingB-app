import type { Word } from '../../../services/wordBank'

/**
 * Turning one into many — the spelling rules hiding inside plurals.
 *
 * "Add an s" is what every child knows. The teaching is in the exceptions:
 * boxes not boxs, babies not babys, leaves not leafs, and the handful of words
 * that simply refuse (child → children). This module decides which rule a word
 * follows and, just as importantly, when it cannot be sure — those words are
 * left out rather than guessed at, because a game that confidently teaches
 * "roofs → rooves" is worse than no game.
 *
 * The spelling rules (`pluralOf`) only ever look at letters, so they cannot
 * tell "happy" from "baby". `pluralOfWord` adds the missing judgement by
 * reading the word's definition: only words whose meaning reads like a noun's
 * are let through. The game uses that, never the bare rules.
 */

export type PluralRule = 'add-s' | 'add-es' | 'y-to-ies' | 'f-to-ves' | 'o-to-oes' | 'special'

export interface Plural {
  singular: string
  plural: string
  rule: PluralRule
  /** what the machine did, in words a seven-year-old can use next time */
  lesson: string
}

/** The words that just have to be known. */
const IRREGULAR: Record<string, string> = {
  child: 'children', mouse: 'mice', foot: 'feet', tooth: 'teeth', goose: 'geese',
  man: 'men', woman: 'women', person: 'people', ox: 'oxen', louse: 'lice', die: 'dice',
}

/** One is the same as many. A favourite trick question. */
const UNCHANGED = new Set(['sheep', 'fish', 'deer', 'moose', 'series', 'species', 'aircraft', 'salmon', 'trout'])

/** f → ves, but only for the words that actually do it (roof → roofs does not). */
const F_TO_VES = new Set(['leaf', 'knife', 'wife', 'life', 'wolf', 'shelf', 'half', 'calf', 'loaf', 'thief', 'elf', 'self', 'wharf', 'scarf'])

/** consonant + o → oes, again only for known cases (piano → pianos does not). */
const O_TO_OES = new Set(['potato', 'tomato', 'hero', 'echo', 'volcano', 'torpedo', 'veto', 'mosquito'])

/** Endings that mark a word as not-a-noun (or not sensibly countable). */
const NOT_A_NOUN = /(ly|ful|less|ous|ive|ing|ed|ics|ness|able|ible|est)$/

const VOWELS = 'aeiou'
const isVowel = (c: string) => VOWELS.includes(c)

/**
 * The plural of a word, or null when the rules cannot be applied safely.
 * Null is a feature: it is how a wrong answer never becomes a lesson.
 */
export const pluralOf = (raw: string): Plural | null => {
  const w = raw.trim().toLowerCase()
  if (!/^[a-z]{3,}$/.test(w)) return null
  if (NOT_A_NOUN.test(w)) return null

  if (IRREGULAR[w]) {
    return { singular: w, plural: IRREGULAR[w], rule: 'special',
      lesson: `“${w}” breaks the rules — the plural is “${IRREGULAR[w]}”. Some words you just have to know!` }
  }
  if (UNCHANGED.has(w)) {
    return { singular: w, plural: w, rule: 'special',
      lesson: `Sneaky! One ${w}, two ${w} — this word doesn’t change at all.` }
  }
  if (F_TO_VES.has(w)) {
    const stem = w.endsWith('fe') ? w.slice(0, -2) : w.slice(0, -1)
    return { singular: w, plural: `${stem}ves`, rule: 'f-to-ves',
      lesson: `The f turns into a v, then add es: ${w} → ${stem}ves.` }
  }
  // Any other f / fe ending is a coin toss (roof → roofs, but leaf → leaves).
  if (w.endsWith('f') || w.endsWith('fe')) return null

  if (O_TO_OES.has(w)) {
    return { singular: w, plural: `${w}es`, rule: 'o-to-oes',
      lesson: `Some o words want es on the end: ${w} → ${w}es.` }
  }
  if (w.endsWith('o')) {
    // vowel + o is reliably just s (zoo → zoos, radio → radios); consonant + o
    // is not (piano → pianos, but potato → potatoes), so those are left out.
    if (isVowel(w[w.length - 2])) return plain(w)
    return null
  }

  // A single z after a vowel doubles (quiz → quizzes) — leave those out.
  if (w.endsWith('z') && !w.endsWith('zz')) return null

  if (/(s|x|z|ch|sh)$/.test(w)) {
    return { singular: w, plural: `${w}es`, rule: 'add-es',
      lesson: `Try saying “${w}s” — you can’t! Words ending in s, x, z, ch or sh add es.` }
  }

  if (w.endsWith('y')) {
    if (isVowel(w[w.length - 2])) return plain(w) // day → days, boy → boys
    return { singular: w, plural: `${w.slice(0, -1)}ies`, rule: 'y-to-ies',
      lesson: `A consonant before the y? Swap the y for ies: ${w} → ${w.slice(0, -1)}ies.` }
  }

  return plain(w)
}

const plain = (w: string): Plural => ({
  singular: w, plural: `${w}s`, rule: 'add-s',
  lesson: `Most words just add an s: ${w} → ${w}s.`,
})

/**
 * Two convincing wrong answers. They are wrong the way a child is wrong —
 * the *other* rules applied to this word — so telling them apart is the lesson.
 */
export const decoysFor = (p: Plural): string[] => {
  const w = p.singular
  const stemY = w.endsWith('y') ? w.slice(0, -1) : w
  const candidates = [
    `${w}s`,
    `${w}es`,
    `${stemY}ies`,
    w.endsWith('f') ? `${w.slice(0, -1)}ves` : `${w}ves`,
    w, // "it doesn't change" is a tempting wrong answer for most words
  ]
  const unique: string[] = []
  for (const c of candidates) {
    if (c !== p.plural && !unique.includes(c)) unique.push(c)
  }
  return unique.slice(0, 2)
}

/**
 * Does this word's definition read like a noun's?
 *
 * The word bank has no part-of-speech tags, but every word has a meaning, and
 * noun definitions announce themselves: "A small…", "The bones inside…",
 * "Someone who…". Adjectives ("Feeling glad") and verbs ("To move quickly")
 * do not. Spelling alone cannot tell "happy" from "baby"; this can. Anything
 * that does not clearly read as a noun is left out — the machine would rather
 * skip a real noun than teach "happies".
 */
export const looksLikeNoun = (meaning: string | undefined): boolean => {
  const m = (meaning || '').trim().toLowerCase()
  if (!m) return false
  if (/^to\b/.test(m)) return false // a verb
  return /^(a|an|the|one|some|someone|something|somebody|any|each|every)\b/.test(m)
}

/** The plural of a bank word — spelling rules, gated by a noun-shaped meaning. */
export const pluralOfWord = (word: Word): Plural | null =>
  looksLikeNoun(word.meaning) ? pluralOf(word.word) : null

export interface MachineRound {
  word: Word
  plural: Plural
  /** shuffled: the right answer and two decoys */
  choices: string[]
}

const shuffle = <T,>(a: T[]): T[] => [...a].sort(() => Math.random() - 0.5)

/**
 * Pick rounds from a child's own words, preferring the interesting rules.
 *
 * Left to chance, a session would be six rounds of "add an s". So the
 * exceptions go first, one of each rule in turn, and plain s fills the rest.
 */
export const pickRounds = (words: Word[], count: number): MachineRound[] => {
  const seen = new Set<string>()
  const byRule = new Map<PluralRule, MachineRound[]>()

  for (const word of shuffle(words)) {
    const plural = pluralOfWord(word)
    if (!plural || seen.has(plural.singular)) continue
    seen.add(plural.singular)
    const round: MachineRound = {
      word,
      plural,
      choices: shuffle([plural.plural, ...decoysFor(plural)]),
    }
    const bucket = byRule.get(plural.rule) || []
    bucket.push(round)
    byRule.set(plural.rule, bucket)
  }

  const order: PluralRule[] = ['add-es', 'y-to-ies', 'special', 'f-to-ves', 'o-to-oes', 'add-s']
  const picked: MachineRound[] = []
  // Round-robin across the rules until we have enough or run dry.
  let progress = true
  while (picked.length < count && progress) {
    progress = false
    for (const rule of order) {
      const bucket = byRule.get(rule)
      if (bucket && bucket.length > 0 && picked.length < count) {
        picked.push(bucket.shift()!)
        progress = true
      }
    }
  }
  return shuffle(picked)
}
