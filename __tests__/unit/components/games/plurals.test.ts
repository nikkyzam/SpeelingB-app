import { describe, it, expect } from 'vitest'
import { pluralOf, pluralOfWord, looksLikeNoun, decoysFor, pickRounds } from '../../../../src/components/games/shared/plurals'
import type { Word } from '../../../../src/services/wordBank'

const rule = (w: string) => pluralOf(w)?.rule
const plural = (w: string) => pluralOf(w)?.plural

describe('the plural rules a child is taught', () => {
  it('most words just add s', () => {
    expect(plural('cat')).toBe('cats')
    expect(plural('dog')).toBe('dogs')
    expect(rule('cat')).toBe('add-s')
  })

  it('s, x, z, ch and sh endings add es', () => {
    expect(plural('box')).toBe('boxes')
    expect(plural('bus')).toBe('buses')
    expect(plural('brush')).toBe('brushes')
    expect(plural('church')).toBe('churches')
    expect(plural('buzz')).toBe('buzzes')
    expect(rule('box')).toBe('add-es')
  })

  it('a consonant before y swaps to ies; a vowel before y just adds s', () => {
    expect(plural('baby')).toBe('babies')
    expect(plural('city')).toBe('cities')
    expect(rule('baby')).toBe('y-to-ies')
    expect(plural('day')).toBe('days')
    expect(plural('boy')).toBe('boys')
    expect(rule('day')).toBe('add-s')
  })

  it('knows the f words that become ves', () => {
    expect(plural('leaf')).toBe('leaves')
    expect(plural('knife')).toBe('knives')
    expect(plural('wolf')).toBe('wolves')
    expect(rule('leaf')).toBe('f-to-ves')
  })

  it('knows the irregulars and the ones that never change', () => {
    expect(plural('child')).toBe('children')
    expect(plural('mouse')).toBe('mice')
    expect(plural('sheep')).toBe('sheep')
    expect(rule('child')).toBe('special')
    expect(rule('sheep')).toBe('special')
  })

  it('o after a vowel adds s; the known consonant+o words add es', () => {
    expect(plural('zoo')).toBe('zoos')
    expect(plural('radio')).toBe('radios')
    expect(plural('potato')).toBe('potatoes')
    expect(rule('potato')).toBe('o-to-oes')
  })
})

describe('when the rules cannot be trusted, the word is left out', () => {
  // Every one of these would teach a wrong spelling if guessed at.
  it.each([
    ['roof', 'f that does NOT become ves'],
    ['chief', 'f that does NOT become ves'],
    ['safe', 'fe that does NOT become ves'],
    ['piano', 'consonant+o that takes plain s'],
    ['photo', 'consonant+o that takes plain s'],
    ['quiz', 'single z that doubles'],
    ['quickly', 'an adverb'],
    ['beautiful', 'an adjective'],
    ['running', 'a verb form'],
    ['jumped', 'a verb form'],
    ['physics', 'an -ics noun'],
    ['kindness', 'a -ness noun'],
    ['biggest', 'a superlative'],
  ])('%s — %s', (word) => {
    expect(pluralOf(word)).toBeNull()
  })

  it('rejects anything that is not a plain word', () => {
    expect(pluralOf('ab')).toBeNull()
    expect(pluralOf("o'clock")).toBeNull()
    expect(pluralOf('ice cream')).toBeNull()
    expect(pluralOf('')).toBeNull()
  })
})

describe('the wrong answers are the other rules applied', () => {
  it('never includes the right answer, and gives exactly two', () => {
    for (const w of ['box', 'baby', 'cat', 'leaf', 'child', 'sheep', 'potato', 'day']) {
      const p = pluralOf(w)!
      const d = decoysFor(p)
      expect(d).toHaveLength(2)
      expect(d).not.toContain(p.plural)
      expect(new Set(d).size).toBe(2)
    }
  })

  it('tempts a child with the naive spelling', () => {
    expect(decoysFor(pluralOf('box')!)).toContain('boxs')
    expect(decoysFor(pluralOf('baby')!)).toContain('babys')
    expect(decoysFor(pluralOf('leaf')!)).toContain('leafs')
    expect(decoysFor(pluralOf('child')!)).toContain('childs')
  })
})

/** A bank word with a noun-shaped meaning, the way real entries read. */
const word = (id: string, w: string, meaning = `A ${w}.`): Word =>
  ({ id, word: w, meaning, sentence: '', difficulty: 1, category: 'test' })

describe('the meaning decides whether a word is a noun at all', () => {
  it('reads noun definitions as nouns', () => {
    expect(looksLikeNoun('A big round orange vegetable.')).toBe(true)
    expect(looksLikeNoun('The bones inside your body.')).toBe(true)
    expect(looksLikeNoun('Someone who looks after sheep.')).toBe(true)
    expect(looksLikeNoun('an insect with colourful wings')).toBe(true)
  })

  it('reads verbs and adjectives as not nouns', () => {
    expect(looksLikeNoun('To move quickly on foot.')).toBe(false)
    expect(looksLikeNoun('Feeling glad and pleased.')).toBe(false)
    expect(looksLikeNoun('Very large in size.')).toBe(false)
    expect(looksLikeNoun('')).toBe(false)
    expect(looksLikeNoun(undefined)).toBe(false)
  })

  it('is what stops "happy" becoming "happies"', () => {
    // Spelling alone says y-to-ies; the meaning says adjective. Meaning wins.
    expect(pluralOf('happy')?.plural).toBe('happies')
    expect(pluralOfWord(word('h', 'happy', 'Feeling glad and pleased.'))).toBeNull()
    expect(pluralOfWord(word('b', 'baby', 'A very young child.'))?.plural).toBe('babies')
  })

  it('and stops verbs and bare adjectives getting an s', () => {
    expect(pluralOfWord(word('r', 'run', 'To move quickly on foot.'))).toBeNull()
    expect(pluralOfWord(word('g', 'big', 'Very large in size.'))).toBeNull()
    expect(pluralOfWord(word('c', 'cat', 'A small furry pet.'))?.plural).toBe('cats')
  })
})

describe('picking rounds from a child’s own words', () => {
  it('uses only words it can pluralise safely, once each', () => {
    const rounds = pickRounds(
      [word('1', 'cat'), word('2', 'roof'), word('3', 'Cat'), word('4', 'box'), word('5', 'quickly')],
      10
    )
    const singulars = rounds.map((r) => r.plural.singular).sort()
    expect(singulars).toEqual(['box', 'cat'])
  })

  it('leads with the interesting rules rather than six rounds of "add s"', () => {
    const words = [
      ...['cat', 'dog', 'pen', 'hat', 'cup', 'map', 'sun', 'bed'].map((w, i) => word(`s${i}`, w)),
      word('x', 'box'),
      word('y', 'baby'),
      word('z', 'child'),
    ]
    const rules = pickRounds(words, 6).map((r) => r.plural.rule)
    expect(rules).toContain('add-es')
    expect(rules).toContain('y-to-ies')
    expect(rules).toContain('special')
    expect(rules.filter((r) => r === 'add-s').length).toBeLessThanOrEqual(3)
  })

  it('gives every round three distinct choices including the answer', () => {
    for (const r of pickRounds([word('1', 'box'), word('2', 'baby'), word('3', 'sheep')], 3)) {
      expect(r.choices).toHaveLength(3)
      expect(new Set(r.choices).size).toBe(3)
      expect(r.choices).toContain(r.plural.plural)
    }
  })

  it('returns nothing rather than inventing words', () => {
    expect(pickRounds([
      word('1', 'roof'),                                  // unsafe f ending
      word('2', 'happy', 'Feeling glad and pleased.'),    // an adjective
      word('3', 'jump', 'To push yourself into the air.'), // a verb
    ], 6)).toEqual([])
    expect(pickRounds([], 6)).toEqual([])
  })
})
