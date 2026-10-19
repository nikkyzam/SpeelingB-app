/**
 * Ways of *looking* at a word, for the parts of the app that teach it rather
 * than test it.
 *
 * A long word is frightening as one lump and friendly in chunks — "cat-er-pil-lar"
 * is four easy things instead of one hard one. These helpers cut words into
 * sayable pieces and describe their shape.
 */

const VOWELS = 'aeiouy'

const isVowel = (c: string): boolean => VOWELS.includes(c.toLowerCase())

/**
 * Two letters making one sound. Splitting through one of these produces
 * nonsense a child then tries to say — "misc-hief" instead of "mis-chief".
 */
const OPENING_DIGRAPHS = ['ch', 'sh', 'th', 'ph', 'wh']
/** These close a syllable rather than open one: "pock-et", not "po-cket". */
const CLOSING_DIGRAPHS = ['ck', 'ng', 'gh']

/**
 * Split a word into sayable chunks (roughly syllables).
 *
 * This is a spelling-based heuristic, not a dictionary: it breaks between two
 * consonants that sit between vowels (but-ter), and before a single consonant
 * that starts a new vowel sound (ti-ger). It errs towards *fewer* breaks,
 * because a missing break just means a slightly longer chunk, while a wrong
 * break teaches a sound the word doesn't have.
 */
export const chunkWord = (word: string): string[] => {
  const w = word.toLowerCase()
  if (w.length <= 3 || !/^[a-z]+$/.test(w)) return [word]

  const chunks: string[] = []
  let current = ''
  let seenVowel = false

  for (let i = 0; i < w.length; i++) {
    const c = w[i]
    current += c

    if (isVowel(c)) {
      seenVowel = true
      continue
    }

    if (!seenVowel) continue

    const next = w[i + 1]
    const after = w[i + 2]

    // "silent e" endings ride along with their chunk: ca-ke, not ca-k-e.
    const tailIsSilentE = next === 'e' && i + 2 >= w.length
    if (tailIsSilentE) continue

    // VC|CV — two consonants between vowels split between them (but|ter),
    // unless those two letters are really one sound.
    if (next && !isVowel(next) && after && isVowel(after)) {
      const pair = c + next

      if (OPENING_DIGRAPHS.includes(pair)) {
        // The digraph starts the next chunk: mis|chief, wa|shing.
        chunks.push(current.slice(0, -1))
        current = c
        seenVowel = false
        continue
      }

      if (CLOSING_DIGRAPHS.includes(pair)) {
        // The digraph finishes this chunk: pock|et, sing|er.
        chunks.push(current + next)
        current = ''
        seenVowel = false
        i++ // both letters are spoken for
        continue
      }

      chunks.push(current)
      current = ''
      seenVowel = false
      continue
    }

    // V|CV — a lone consonant starts the next chunk (ti|ger), but only when
    // enough letters remain to make one.
    if (next && isVowel(next) && current.length >= 2) {
      chunks.push(current.slice(0, -1))
      current = c
      seenVowel = false
    }
  }

  if (current) chunks.push(current)

  // Never leave a chunk without a vowel — glue orphans onto their neighbour.
  const merged: string[] = []
  chunks.filter(Boolean).forEach((chunk) => {
    const hasVowel = [...chunk].some(isVowel)
    if (!hasVowel && merged.length > 0) merged[merged.length - 1] += chunk
    else merged.push(chunk)
  })

  return merged.length > 0 ? merged : [word]
}

/** "-le"/"-re" after one of these is a beat of its own: lit-tle, ta-ble, cen-tre. */
const SYLLABIC_END = /([bcdfgkptvz]|ss)(le|re)$/
/** The same, with an "s" or "d" on: ta-bles, gig-gled. */
const SYLLABIC_END_PLUS = /([bcdfgkptvz]|ss)(le|re)[sd]$/
/** "-es" is its own beat after a hissing sound: box-es, wish-es, pag-es. */
const SOUNDED_ES = /(s|z|x|ch|sh|g|c)es$/
/** A silent "e" before an ending: love-ly, care-ful, safe-ty, move-ment. */
const SILENT_E_SUFFIX = /[aeiouy][^aeiouy]e(ly|ful|ment|ments|ness|less|ty)$/
/** The first half of a compound with a silent "e": some-thing, home-work, base-ball. */
const SILENT_E_HEAD = /^(some|home|base|life|time|side|fire|pine|nine|skate|grape)[^aeiouy]+[aeiouy]/

/**
 * How many beats (syllables) a vowel group really carries. Most vowel pairs
 * make one sound (rain, boat, field) but some say both letters: li-on, gi-ant,
 * qui-et, po-em, cru-el, vid-e-o, cre-ate.
 */
const groupBeats = (w: string, start: number, text: string): number => {
  const end = start + text.length
  const before = w[start - 1] ?? ''
  const before2 = w[start - 2] ?? ''
  const rest = w.slice(end)
  const atEnd = rest === '' || rest === 's'
  const hasEarlierVowel = /[aeiouy]/.test(w.slice(0, start))

  // -ing after a vowel starts a beat of its own: be-ing, fly-ing, go-ing.
  if (text.length > 1 && text.endsWith('i') && /^ngs?$/.test(rest)) return 2

  // i + vowel. Never after the "sh" sounds (sta-tion, spe-cial, de-li-cious)
  // or in mil-lion / on-ion; otherwise both are said (li-on, ra-di-o, cu-ri-ous).
  if (/^i[aou]/.test(text)) {
    if (text.startsWith('iu')) return 2 // sta-di-um
    if (atEnd && text.length === 2 && !/[cts]/.test(before)) return 2 // ra-di-o, me-di-a
    if (/[ctsx]/.test(before) || (before === 'l' && before2 === 'l') || before === 'n') return 1
    if (before === 'g' && start > 1) return 1 // re-gion, Geor-gia; but gi-ant
    return 2
  }
  // qui-et, di-et, so-ci-e-ty; hap-pi-er, fun-ni-est; cli-ent, or-i-ent
  if (text === 'ie') {
    if (rest.startsWith('t')) return 2
    if (hasEarlierVowel && /^(r|rs|st)$/.test(rest)) return 2
    if (/^nt/.test(rest) && !/[ctsxn]/.test(before)) return 2
    return 1
  }
  // vid-e-o, ste-re-o, ge-og-ra-phy, ne-on; but peo-ple, pi-geon, some-one
  if (text === 'eo') {
    if (atEnd) return 2
    if (start === 1 && /^g/.test(w) && rest[0] !== 'r') return 2
    if (/^ns?$/.test(rest) && !/[gh]/.test(before)) return 2
    return 1
  }
  // cre-ate, the-a-tre, i-de-a, ar-e-a; but sea, tea, great, beach
  if (text === 'ea') {
    if (/^cr$/.test(w.slice(0, start)) && /^t(e|ed|es|ing|ion|ions|ive|or|ors)$/.test(rest)) return 2
    if (/^th$/.test(w.slice(0, start)) && /^t(re|er)/.test(rest)) return 2
    if (atEnd && hasEarlierVowel) return 2
    return 1
  }
  // cru-el, fu-el, du-et, flu-ent; but blue, guess, Tues-day
  if (text === 'ue' && /^[ltn]/.test(rest) && before !== 'g') return 2
  // u-su-al, Jan-u-ar-y, ac-tu-al; but guard, lan-guage
  if (text.startsWith('ua') && before !== 'g') return 2
  // con-tin-u-ous, du-o
  if (text.startsWith('uo')) return 2
  // ru-in, flu-id; but build, suit, guide
  if (text === 'ui' && /^[nd]/.test(rest) && !/[gbq]/.test(before)) return 2
  // po-em, po-et-ry; but toe, shoes
  if (text === 'oe' && /^[mt]/.test(rest)) return 2
  // mu-se-um
  if (text === 'eu' && /^ms?$/.test(rest)) return 2
  return 1
}

/**
 * How many beats (syllables) a word has, as a child would clap it.
 *
 * Spelling-based, so it can be wrong on an odd word, but it knows the patterns
 * children's words are full of: lit-tle and ta-ble (consonant + le), jumped
 * and smiles (a silent -ed or -es), li-on and qui-et (two vowels, two beats),
 * play-er and yel-low (y as a consonant). SyllableClap also leaves out any
 * word where this and `chunkWord` disagree, so a right clap is never marked
 * wrong on a word nobody is sure of.
 */
export const countBeats = (word: string): number => {
  let w = word.toLowerCase().replace(/[^a-z]/g, '')
  if (!w) return 1

  // The u after q is part of the consonant: queen, qui-et, e-qual.
  w = w.replace(/qu/g, 'q')
  // So is a silent "-gue": tongue, league, cat-a-logue (but ar-gue).
  w = w.replace(/([aeiouy]|n)gue([sd]?)$/, '$1g$2')
  // y before a vowel at the start or between vowels is a consonant:
  // yel-low, play-er, be-yond, eye. (Upper case keeps it out of the vowels.)
  w = w.replace(/^y(?=[aeiou])/, 'Y').replace(/([aeiou])y(?=[aeiou])/g, '$1Y')

  let beats = 0
  for (const m of w.matchAll(/[aeiouy]+/g)) beats += groupBeats(w, m.index ?? 0, m[0])
  if (beats === 0) return 1

  // pris-m, rhy-thm: the m at the end is a beat of its own.
  if (/[aeiouy](s|th)ms?$/.test(w)) beats += 1

  // Silent letters at the end — only ever taking a beat off a word with more.
  const silent = (rule: boolean) => {
    if (rule && beats > 1) beats -= 1
  }
  // A silent final e: cake, smile (but lit-tle, cen-tre keep theirs).
  silent(/[^aeiouy]e$/.test(w) && !SYLLABIC_END.test(w))
  // A silent -ed: jumped, played, smiled (but want-ed, need-ed, gig-gled).
  silent(/[^aeiouytd]ed$/.test(w) && !SYLLABIC_END_PLUS.test(w))
  // A silent -es: smiles, games, eyes (but box-es, pag-es, ta-bles).
  silent(/[^aeiouy]es$/.test(w) && !SOUNDED_ES.test(w) && !SYLLABIC_END_PLUS.test(w))
  // A silent e in the middle: love-ly, some-thing — once, however it's spotted.
  silent(SILENT_E_SUFFIX.test(w) || SILENT_E_HEAD.test(w))

  return Math.max(1, beats)
}

/** Playful, true things to notice about a word — shown while learning it. */
export const wordFacts = (word: string): string[] => {
  const w = word.toLowerCase()
  const facts: string[] = []

  facts.push(`${w.length} letters`)

  const beats = countBeats(w)
  facts.push(`${beats} beat${beats === 1 ? '' : 's'} 👏`)

  const vowels = [...w].filter(isVowel).length
  facts.push(`${vowels} vowel${vowels === 1 ? '' : 's'}`)

  if (/(.)\1/.test(w)) facts.push('double letters! 👯')
  if (isVowel(w[0])) facts.push('starts with a vowel')
  if (w.startsWith('ph') || w.includes('gh') || /^(kn|wr|ps)/.test(w)) facts.push('sneaky silent letters 🤫')
  if (w.length >= 9) facts.push('a really long one! 🦒')

  return facts
}
