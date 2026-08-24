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

    // VC|CV — two consonants between vowels split between them (but|ter).
    if (next && !isVowel(next) && after && isVowel(after)) {
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

/** How many vowel sounds a word has — a rough syllable count for kids. */
export const countBeats = (word: string): number => {
  const groups = word.toLowerCase().match(/[aeiouy]+/g)
  if (!groups) return 1
  // A silent final "e" doesn't get its own beat.
  const silentE = /[^aeiouy]e$/.test(word.toLowerCase()) && groups.length > 1
  return Math.max(1, groups.length - (silentE ? 1 : 0))
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
