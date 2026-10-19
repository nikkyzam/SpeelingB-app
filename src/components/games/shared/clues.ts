/**
 * A definition can contain an answer, which turns the clue into a copying
 * exercise. Blank out the word and its obvious forms ("tags", "tagged",
 * "decoration" for "decor", "elegance" for "elegant").
 */
export const maskClue = (meaning: string, word: string): string => {
  const w = word.toLowerCase().replace(/[^a-z]/g, '')
  if (!w) return meaning
  // Three letters is too short to match on a prefix — "cat" is not in
  // "catalog" — so only its plain endings count.
  const shortForm = new RegExp(`^${w}(${w.slice(-1)})?(s|es|d|ed|ing|er|ers|y)?$`)
  // Long words match on a stem, but never one shorter than five letters —
  // "planet" must not blank out "plan" and "plants".
  const stem = w.slice(0, Math.max(5, w.length - 2))
  return meaning.replace(/[A-Za-z]+/g, (token) => {
    const t = token.toLowerCase()
    const hit = w.length <= 3 ? shortForm.test(t) : t.startsWith(w.length >= 6 ? stem : w)
    return hit ? '____' : token
  })
}
