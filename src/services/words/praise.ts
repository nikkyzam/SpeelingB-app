/**
 * What the app says when a child gets a word right — or nearly.
 *
 * The same "Correct!" forty times in a row stops meaning anything by the
 * fifth. Kid-sized lines, never the same one twice running, and a bigger cheer
 * for a run of right answers, keep a right answer feeling like an event. A
 * miss gets a gentle "nearly", never "Wrong" or "Incorrect": a child who feels
 * told off stops trying, and trying is the whole point.
 *
 * Every line reads well aloud too, so the same words can be shown and spoken.
 */

const PRAISE = [
  'Yes!',
  'You got it!',
  'Nailed it!',
  'Super spelling!',
  'Buzz-tastic!',
  'Spot on!',
  'Brilliant!',
  'Sweet as honey!',
  'High five!',
  'Woohoo!',
  'Bee-autiful!',
  'Wonderful!',
  'Amazing!',
  'Perfect!',
]

const NEARLY = ['So close!', 'Nearly!', 'Good try!', 'Ooh, almost!', 'Nice try!', 'Almost there!']

/** A run of right answers worth its own cheer: 3, 5, 10, then every 5. */
export const isStreakMilestone = (streak: number): boolean =>
  streak === 3 || streak === 5 || (streak >= 10 && streak % 5 === 0)

/** The cheer for a run, or null when this run isn't one to shout about. */
export const streakCall = (streak: number): string | null => {
  if (!isStreakMilestone(streak)) return null
  if (streak === 3) return 'Three in a row! 🔥'
  if (streak === 5) return 'Five in a row — unstoppable! 🚀'
  if (streak === 10) return 'Ten in a row — you’re on fire! 🔥🔥'
  return `${streak} in a row — legendary! 👑`
}

const lastSaid = new Map<readonly string[], string>()

/** A line from `list`, never the one it gave last time. */
const pickFrom = (list: readonly string[], rand: () => number = Math.random): string => {
  const before = lastSaid.get(list)
  const fresh = list.filter((line) => line !== before)
  const line = fresh[Math.floor(rand() * fresh.length)] ?? list[0]
  lastSaid.set(list, line)
  return line
}

/**
 * Praise for a right answer. Pass the streak *including* this answer: on a
 * milestone (3, 5, 10…) it becomes the streak cheer.
 */
export const praise = (streak = 0, rand: () => number = Math.random): string =>
  streakCall(streak) ?? pickFrom(PRAISE, rand)

/** A gentle word for a miss. Show the real spelling beside it. */
export const nearly = (rand: () => number = Math.random): string => pickFrom(NEARLY, rand)

/**
 * A word spelled out for speech, letter by letter: "c, a, t". Saying the word
 * after a miss only repeats the sound the child already heard; the letters are
 * what they need.
 */
export const spellOut = (word: string): string => [...word.toLowerCase()].filter((c) => /\S/.test(c)).join(', ')

/**
 * How a spelling-bee pronouncer asks for a word: the word, the word in a
 * sentence, the word again. Saying only the sentence with a gap in it left a
 * child guessing which word was wanted.
 */
export const sayPrompt = (word: string, sentence?: string): string => {
  const said = (sentence ?? '').trim()
  return said ? `${word}. ${said} ${word}.` : `${word}.`
}
