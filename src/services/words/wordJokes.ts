/**
 * Terrible, wonderful word jokes.
 *
 * They are the reward at the end of a lesson: a child who finishes five words
 * gets a joke to run off and tell someone, which is a far better souvenir than
 * a number going up. They are all about letters and words, so even the punchline
 * is a tiny bit of literacy.
 */

export interface WordJoke {
  setup: string
  punchline: string
}

export const WORD_JOKES: WordJoke[] = [
  { setup: 'What word is spelled wrong in every single dictionary?', punchline: 'W-R-O-N-G!' },
  { setup: "What's the longest word in the dictionary?", punchline: '“Smiles” — there is a whole mile between its first and last letter!' },
  { setup: 'Why did the dictionary go to the doctor?', punchline: 'It had lost its definition.' },
  { setup: 'Why is the letter T like an island?', punchline: 'Because it is in the middle of waTer!' },
  { setup: 'Why did the letter Q get in trouble?', punchline: 'It would not stop following U around.' },
  { setup: 'What starts with E, ends with E, but only has one letter inside?', punchline: 'An envelope!' },
  { setup: 'Why was the alphabet so tired?', punchline: 'It had twenty-six letters to deliver.' },
  { setup: 'Which letters are the tastiest?', punchline: 'The ones in candY.' },
  { setup: 'What did one book say to the other book?', punchline: 'I have got you covered!' },
  { setup: 'How do you make the word “one” disappear?', punchline: 'Add a G — and it is gone!' },
  { setup: 'Why was the letter B feeling so cool?', punchline: 'Because it was sitting between A and C.' },
  { setup: 'What do you call a bee that cannot spell?', punchline: 'A spelling bee in training — just like you!' },
  { setup: 'Why did the silent E go to the party?', punchline: 'To make the other letters look longer.' },
  { setup: 'What has lots of keys but cannot open a single door?', punchline: 'A keyboard!' },
  { setup: 'Why did the comma break up with the full stop?', punchline: 'It said the ending was too final.' },
  { setup: 'What kind of tree fits neatly in your hand?', punchline: 'A palm tree!' },
  { setup: 'Why do letters never get lost?', punchline: 'They always follow the alphabet.' },
  { setup: 'What is a pirate’s favourite letter?', punchline: 'You would think R — but their first love is the C!' },
]

/** A joke, optionally not the one just told. */
export const randomJoke = (avoid?: WordJoke): WordJoke => {
  const pool = avoid ? WORD_JOKES.filter((j) => j.setup !== avoid.setup) : WORD_JOKES
  return pool[Math.floor(Math.random() * pool.length)]
}

export default randomJoke
