import { wordBank } from '../../../services/wordBank'
import { COMMON_WORD_SET } from '../WordChef/commonWords'
import { misspell } from './wordTricks'

/**
 * Is this a real word? A "misspelling" that is really another word ("from" for
 * "form", "hopping" for "hoping") teaches a child that a correct spelling is
 * wrong. The bank only answers the question here — it never supplies a word
 * to a game, so games still play only the child's own words.
 */
export const isRealWord = (text: string): boolean => {
  const t = text.toLowerCase()
  return COMMON_WORD_SET.has(t) || !!wordBank.getWordByWord(t)
}

/**
 * A believable misspelling of `word` that isn't a word in its own right.
 * Tries `misspell` a few times; if every try lands on a real word, doubles the
 * last letter, which never does.
 */
export const fakeSpelling = (
  word: string,
  isWord: (text: string) => boolean = isRealWord,
  tries = 12
): string => {
  const w = word.toLowerCase()
  for (let i = 0; i < tries; i++) {
    const fake = misspell(w)
    if (fake !== w && !isWord(fake)) return fake
  }
  return w + w.slice(-1)
}
