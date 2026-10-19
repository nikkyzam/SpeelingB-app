/**
 * Comparing what a child typed with the word they were asked to spell.
 *
 * A laptop keyboard has no key for "ñ" or "é", and the on-screen keypad with
 * accents only appears on touch devices. The word list has words like "señor"
 * and "éclair", so an exact comparison made them unspellable — and the daily
 * quiz, which keeps a missed word until it is spelled, could never be finished.
 * The accent is not the spelling being practised, so it is set aside.
 */

/** Letters as any keyboard can type them: lower case, accents and curly quotes set aside. */
export const plainLetters = (text: string): string =>
  text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[‘’]/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()

/** True when `typed` spells `word`, ignoring case, accents and stray spaces. */
export const sameSpelling = (typed: string, word: string): boolean =>
  typed.trim() !== '' && plainLetters(typed) === plainLetters(word)

/** True when it matched only once accents were set aside — worth showing the real form. */
export const matchedWithoutAccents = (typed: string, word: string): boolean =>
  sameSpelling(typed, word) && typed.trim().toLowerCase() !== word.trim().toLowerCase()

/** A word made safe to use inside a RegExp. */
export const escapeForRegExp = (text: string): string => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
