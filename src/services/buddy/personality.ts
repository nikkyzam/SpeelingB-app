/**
 * The buddy's voice and personality.
 *
 * A name isn't just a label — it decides who the buddy *is*. The same name
 * always hatches the same personality, so "Captain Sprinkles" is reliably
 * giggly and "Rocky" is reliably brave. Everything is derived, never stored,
 * so renaming the buddy re-hatches its character for free.
 */

export interface BuddyPersonality {
  id: 'giggly' | 'brave' | 'dreamy' | 'curious'
  /** speech synthesis settings that make the buddy sound like itself */
  pitch: number
  rate: number
  catchphrase: string
  /** what the buddy loves — used in its cheers */
  loves: string
  /** how it laughs */
  laugh: string
}

const PERSONALITIES: BuddyPersonality[] = [
  {
    id: 'giggly',
    pitch: 1.6,
    rate: 1.05,
    catchphrase: 'Tee hee hee!',
    loves: 'silly words',
    laugh: 'Tee hee hee!',
  },
  {
    id: 'brave',
    pitch: 1.1,
    rate: 0.95,
    catchphrase: 'We can do hard things!',
    loves: 'big, tricky words',
    laugh: 'Ha HA!',
  },
  {
    id: 'dreamy',
    pitch: 1.3,
    rate: 0.8,
    catchphrase: 'Ooh… imagine that…',
    loves: 'bedtime stories',
    laugh: 'Hee… hee…',
  },
  {
    id: 'curious',
    pitch: 1.4,
    rate: 1.0,
    catchphrase: 'Ooh! What does THAT mean?',
    loves: 'asking why',
    laugh: 'Hehe!',
  },
]

/** Stable hash so the same name always gets the same personality. */
const hash = (text: string): number => {
  let h = 0
  for (let i = 0; i < text.length; i++) {
    h = (h * 31 + text.charCodeAt(i)) >>> 0
  }
  return h
}

export const personalityFor = (name: string | null): BuddyPersonality => {
  if (!name) return PERSONALITIES[3] // an unnamed egg is full of questions
  return PERSONALITIES[hash(name.toLowerCase().trim()) % PERSONALITIES.length]
}

/** Speech options to pass to AudioContext.speak so the buddy sounds like itself. */
export const buddyVoiceOptions = (name: string | null): { pitch: number; rate: number } => {
  const p = personalityFor(name)
  return { pitch: p.pitch, rate: p.rate }
}

/** Personality-flavoured reactions to things that happen in the app. */
export const reactionFor = (
  name: string | null,
  event: 'wordLearned' | 'wordSpelled' | 'stars' | 'greeting' | 'gameWon',
): string => {
  const p = personalityFor(name)
  const who = name || 'your buddy'
  switch (event) {
    case 'wordLearned':
      return {
        giggly: `Ooh, a new word! ${p.laugh} Say it again, say it again!`,
        brave: `A new word! Nothing can stop us now!`,
        dreamy: `A brand new word… I shall dream about it tonight…`,
        curious: `A new word! What does it mean? Can we use it in a sentence?`,
      }[p.id]
    case 'wordSpelled':
      return {
        giggly: `You spelled it! ${p.laugh} You are SO clever!`,
        brave: `YES! Spelled perfectly! ${p.catchphrase}`,
        dreamy: `Beautiful spelling… like stars in a row…`,
        curious: `Correct! How did your brain DO that?`,
      }[p.id]
    case 'stars':
      return {
        giggly: `Stars! Shiny shiny stars! ${p.laugh}`,
        brave: `More stars! Earned, every single one!`,
        dreamy: `Ooh… stars for the star jar… twinkly…`,
        curious: `Stars! How many do we have now? Count them, count them!`,
      }[p.id]
    case 'greeting':
      return {
        giggly: `Hi hi hi! ${p.laugh} Shall we play?`,
        brave: `There you are! Ready for an adventure?`,
        dreamy: `Hello… I was just dreaming about words…`,
        curious: `Hello! What are we learning today? Huh? Huh?`,
      }[p.id]
    case 'gameWon':
      return {
        giggly: `You WON! ${p.laugh} Again, again!`,
        brave: `Victory! I never doubted you for a second!`,
        dreamy: `You won… it was like watching a fireworks show…`,
        curious: `You won! How did you get SO good?`,
      }[p.id]
  }
  void who
}
