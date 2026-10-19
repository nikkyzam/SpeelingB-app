/**
 * How long a shown answer stays up while its letters are read out.
 *
 * After a miss the quiz screens say "Nearly! skeleton is spelled s, k, e, l,
 * e, t, o, n." in the slow voice (rate 0.8), and the next word's prompt used
 * to cut that off: a flat 3–3.5s pause left most words' letters unheard. So
 * the pause grows with the word — a little over half a second a letter after
 * the opening words, as SpellMode's "Stuck?" does. A short word keeps the
 * screen's own pause (`atLeast`), so "cat" is no slower than before, and a
 * very long word stops at `SPELL_OUT_MAX`. The screens also queue the next
 * prompt behind the letters, so a slow voice still finishes them.
 */
export const SPELL_OUT_MAX = 10000
const OPENING = 1200
const PER_LETTER = 550

export const spellOutPause = (word: string, atLeast: number): number => {
  const letters = [...word].filter((c) => /\S/.test(c)).length
  return Math.min(SPELL_OUT_MAX, Math.max(atLeast, OPENING + letters * PER_LETTER))
}
