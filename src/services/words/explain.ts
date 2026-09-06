import { chunkWord } from './wordShape'

/**
 * Why a word is spelled the way it is.
 *
 * Being told "wrong, it's «receive»" teaches one word. Being told "i before e,
 * except after c" teaches fifty. This turns a correct answer into a rule a
 * child can carry to the next word, which is the difference between a game
 * that drills and a game that teaches.
 *
 * When the child's attempt is known the explanation targets the mistake they
 * actually made; otherwise it falls back to the most interesting thing about
 * the word. It never returns a rule it cannot stand behind — a wrong
 * explanation is worse than none, so unremarkable words get a plain
 * sound-it-out chunking instead of an invented pattern.
 */

export interface Explanation {
  /** short, child-facing, one sentence */
  tip: string
  /** a stable id for the rule, so tests and analytics can name it */
  rule: string
}

const DIGRAPH_SOUNDS: Record<string, string> = {
  ch: 'ch makes one sound, like in “chair”',
  sh: 'sh makes one sound, like in “ship”',
  th: 'th makes one sound, like in “thumb”',
  ph: 'ph sounds like f, like in “phone”',
  wh: 'wh makes one sound, like in “whale”',
  ck: 'ck makes one k sound, like in “duck”',
  ng: 'ng makes one sound, like in “sing”',
}

const SILENT_STARTS: Record<string, string> = {
  kn: 'a silent k hides at the front — you say “n”, but you write “kn”',
  wr: 'a silent w hides at the front — you say “r”, but you write “wr”',
  gn: 'a silent g hides at the front — you say “n”, but you write “gn”',
  ps: 'a silent p hides at the front — you say “s”, but you write “ps”',
}

const clean = (s: string) => s.trim().toLowerCase().replace(/[^a-z]/g, '')

/** The doubled letter in a word, if it has one ("kitten" -> "t"). */
const doubledLetter = (w: string): string | null => {
  const m = w.match(/([a-z])\1/)
  return m ? m[1] : null
}

/** Compare what they wrote with what was right, and name the difference. */
const fromAttempt = (word: string, attempt: string): Explanation | null => {
  if (!attempt || attempt === word) return null

  // Missing magic e: "hop" for "hope".
  if (word.endsWith('e') && attempt === word.slice(0, -1)) {
    return {
      rule: 'magic-e',
      tip: `Nearly! “${word}” needs its magic e on the end — it’s the e that makes the vowel say its own name.`,
    }
  }
  // Added an e that isn't there.
  if (attempt.endsWith('e') && attempt.slice(0, -1) === word) {
    return { rule: 'extra-e', tip: `So close — “${word}” has no e on the end.` }
  }

  // Single letter where the word doubles: "riting"/"kiten".
  const dbl = doubledLetter(word)
  if (dbl && !doubledLetter(attempt) && attempt.replace(dbl, dbl + dbl) === word) {
    return {
      rule: 'double-letter',
      tip: `Almost — “${word}” has a double ${dbl}${dbl}. Say it slowly and you can hear the letter hold on.`,
    }
  }
  // Doubled a letter that stays single.
  const attemptDbl = doubledLetter(attempt)
  if (attemptDbl && !doubledLetter(word) && attempt.replace(attemptDbl + attemptDbl, attemptDbl) === word) {
    return { rule: 'no-double', tip: `Close! “${word}” only needs one ${attemptDbl}.` }
  }

  // ie / ei the wrong way round.
  if (word.includes('ie') && attempt === word.replace('ie', 'ei')) {
    const afterC = word.includes('cie')
    return {
      rule: 'ie-ei',
      tip: afterC
        ? `“${word}” keeps i before e even after the c — it’s one of the sneaky ones.`
        : `Remember: i before e — “${word}”.`,
    }
  }
  if (word.includes('ei') && attempt === word.replace('ei', 'ie')) {
    return {
      rule: 'ei-after-c',
      tip: word.includes('cei')
        ? `i before e, except after c — and “${word}” has a c, so it’s e first.`
        : `“${word}” is an e-before-i word. Picture it once and it sticks.`,
    }
  }

  // Right letters, wrong order — a swap rather than a misunderstanding.
  if (attempt.length === word.length && [...attempt].sort().join('') === [...word].sort().join('')) {
    return { rule: 'letter-order', tip: `All the right letters — just a different order. It’s “${word}”.` }
  }

  // Only the ending differs: name the ending.
  const endings: [RegExp, string, string][] = [
    [/tion$/, 'tion-ending', 'that “shun” sound at the end is nearly always spelled tion'],
    [/sion$/, 'sion-ending', 'that ending sounds like “shun” but is spelled sion here'],
    [/ough$/, 'ough-ending', 'ough is one of English’s trickiest endings — worth remembering by sight'],
    [/able$/, 'able-ending', 'the ending is able, with an a'],
    [/ible$/, 'ible-ending', 'the ending is ible, with an i'],
  ]
  for (const [re, rule, why] of endings) {
    if (re.test(word) && !re.test(attempt)) {
      return { rule, tip: `In “${word}”, ${why}.` }
    }
  }

  return null
}

/** The most interesting true thing about the word itself. */
const fromWord = (word: string): Explanation => {
  if (word.includes('q')) {
    const qu = word.includes('qu')
    if (qu) return { rule: 'qu', tip: `In “${word}”, q brings its friend u — q almost never goes anywhere alone.` }
  }

  for (const [start, why] of Object.entries(SILENT_STARTS)) {
    if (word.startsWith(start)) return { rule: `silent-${start}`, tip: `In “${word}”, ${why}.` }
  }
  if (/mb$/.test(word)) {
    return { rule: 'silent-b', tip: `“${word}” ends with a silent b — you hear the m, but the b is still there.` }
  }

  const dbl = doubledLetter(word)
  if (dbl) {
    return { rule: 'double-letter', tip: `“${word}” has a double ${dbl}${dbl} — two of them, side by side.` }
  }

  for (const [pair, why] of Object.entries(DIGRAPH_SOUNDS)) {
    if (word.includes(pair)) return { rule: `digraph-${pair}`, tip: `In “${word}”, ${why}.` }
  }

  if (/tion$/.test(word)) {
    return { rule: 'tion-ending', tip: `“${word}” ends in tion — that “shun” sound is nearly always tion.` }
  }
  if (word.endsWith('e') && word.length > 3 && !/[aeiou]e$/.test(word)) {
    return {
      rule: 'magic-e',
      tip: `“${word}” ends with a magic e — it’s silent, but it makes the vowel before it say its name.`,
    }
  }
  if (/[^aeiou]y$/.test(word)) {
    return { rule: 'y-vowel', tip: `In “${word}”, the y is doing a vowel’s job at the end.` }
  }

  // Nothing remarkable: give them the syllables, which always helps.
  const chunks = chunkWord(word)
  if (chunks.length > 1) {
    return { rule: 'chunks', tip: `Break it into bits and it’s easy: ${chunks.join(' – ')}.` }
  }
  return { rule: 'sound-out', tip: `Sound “${word}” out slowly — every letter you hear is a letter you write.` }
}

/**
 * A tip for this word, aimed at the mistake if one is given.
 * Always returns something usable.
 */
export const explain = (rawWord: string, rawAttempt?: string): Explanation => {
  const word = clean(rawWord)
  if (!word) return { rule: 'none', tip: '' }
  const attempt = rawAttempt ? clean(rawAttempt) : ''
  return (attempt ? fromAttempt(word, attempt) : null) || fromWord(word)
}

export default explain
