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
