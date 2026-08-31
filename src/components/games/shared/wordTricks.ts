/** Small helpers shared by the word games. */

const VOWELS = 'aeiou'

export const shuffle = <T,>(a: T[]): T[] => {
  const arr = [...a]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

/**
 * Produce a believable misspelling of a word — swap two letters, double one,
 * drop one, or change a vowel. Believable is the point: an obvious mangling
 * ("qzzt") teaches nothing, whereas "recieve" trains the eye.
 */
export const misspell = (w: string): string => {
  const opts: string[] = []
  if (w.length > 2) {
    const i = 1 + Math.floor(Math.random() * (w.length - 2))
    opts.push(w.slice(0, i) + w[i + 1] + w[i] + w.slice(i + 2))
  }
  {
    const i = Math.floor(Math.random() * w.length)
    opts.push(w.slice(0, i) + w[i] + w.slice(i))
  }
  if (w.length > 3) {
    const i = 1 + Math.floor(Math.random() * (w.length - 2))
    opts.push(w.slice(0, i) + w.slice(i + 1))
  }
  const vowelIdx = [...w].map((c, i) => (VOWELS.includes(c) ? i : -1)).filter((i) => i >= 0)
  if (vowelIdx.length) {
    const i = vowelIdx[Math.floor(Math.random() * vowelIdx.length)]
    let v = VOWELS[Math.floor(Math.random() * VOWELS.length)]
    while (v === w[i]) v = VOWELS[Math.floor(Math.random() * VOWELS.length)]
    opts.push(w.slice(0, i) + v + w.slice(i + 1))
  }
  const cand = opts.filter((s) => s && s !== w)
  return cand.length ? cand[Math.floor(Math.random() * cand.length)] : w + w.slice(-1)
}

/** A word a game can actually spell out: plain letters, long enough to be fun. */
export const isPlayable = (w: { word: string }, min = 3): boolean =>
  /^[a-z]+$/i.test(w.word) && w.word.length >= min

/**
 * Split a word into a visible start and a hidden tail, e.g. "rocket" -> ["roc", "ket"].
 * Games use this to hide a chunk and ask the child to find the piece that fits.
 */
export const splitChunk = (w: string): [string, string] => {
  const at = Math.max(2, Math.round(w.length / 2))
  return [w.slice(0, at), w.slice(at)]
}

/**
 * The "rime" of a word — the last vowel sound onwards ("cake" -> "ake",
 * "balloon" -> "oon"). Rough and spelling-based, but good enough to spot
 * rhyming pairs among the simple words a child is learning.
 */
export const rimeOf = (w: string): string => {
  const lower = w.toLowerCase()
  const groups = [...lower.matchAll(/[aeiouy]+/g)]
  if (groups.length === 0) return lower.slice(-2)

  const last = groups[groups.length - 1]
  let start = last.index ?? 0
  // A silent final "e" isn't the rhyming vowel: "cake" rhymes on "ake", not "e".
  if (last[0] === 'e' && start === lower.length - 1 && groups.length > 1) {
    start = groups[groups.length - 2].index ?? start
  }
  return lower.slice(start)
}

/** True when two words rhyme by their spelling ending (and aren't the same word). */
export const rhymes = (a: string, b: string): boolean => {
  const x = a.toLowerCase()
  const y = b.toLowerCase()
  if (x === y) return false
  if (rimeOf(x) !== rimeOf(y)) return false

  // A shared "-er" or "-on" is not a rhyme — "retriever" and "goober" only look
  // alike. Longer words have to match over more of their ending to count.
  const need = Math.max(x.length, y.length) > 5 ? 3 : 2
  return rimeOf(x).length >= need
}

/**
 * Kid-friendly rhyme families. The spelling-bee word bank is full of long,
 * uncommon words that rarely rhyme with each other, so Rhyme Time leans on
 * these familiar families and folds in the child's own words when they fit.
 */
export const RHYME_FAMILIES: string[][] = [
  ['cat', 'hat', 'bat', 'mat', 'rat', 'flat'],
  ['dog', 'log', 'frog', 'jog', 'fog'],
  ['star', 'car', 'jar', 'far', 'guitar'],
  ['cake', 'lake', 'snake', 'bake', 'rake'],
  ['bee', 'tree', 'knee', 'sea', 'free'],
  ['moon', 'spoon', 'balloon', 'soon', 'noon'],
  ['light', 'night', 'bright', 'kite', 'white'],
  ['sing', 'king', 'ring', 'wing', 'spring'],
  ['play', 'day', 'stay', 'gray', 'today'],
  ['boat', 'coat', 'goat', 'float', 'note'],
  ['bug', 'hug', 'rug', 'mug', 'jug'],
  ['sun', 'run', 'fun', 'bun', 'one'],
  ['bell', 'shell', 'well', 'spell', 'tell'],
  ['duck', 'truck', 'luck', 'stuck', 'buck'],
  ['pig', 'big', 'dig', 'wig', 'twig'],
  ['snow', 'grow', 'glow', 'blow', 'slow'],
  ['nest', 'best', 'rest', 'west', 'chest'],
  ['jump', 'bump', 'lump', 'stump', 'thump'],
  ['sock', 'rock', 'clock', 'block', 'lock'],
  ['sheep', 'sleep', 'deep', 'keep', 'jeep'],
]

/** Pick `n` items from `pool` that aren't in `exclude`. */
export const pickDistinct = <T,>(pool: T[], n: number, exclude: (item: T) => boolean = () => false): T[] =>
  shuffle(pool.filter((p) => !exclude(p))).slice(0, n)
