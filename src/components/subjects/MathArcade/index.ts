import type React from 'react'
import Sprint from './Sprint'
import Match from './Match'
import Bonds from './Bonds'
import Fractions from './Fractions'
import Compare from './Compare'

/**
 * The Math Arcade: five tap-only number games. Each takes `onComplete(score)`
 * (called once, when the child taps Done; the best run of that sitting,
 * higher is better) and an optional `grade` ('k' | '1'..'8') that marks the
 * suggested challenge. None of them stores anything.
 */
export interface MathArcadeGame {
  id: string
  name: string
  icon: string
  blurb: string
  /** A score that counts as a great run, so the host can pay stars on one scale. */
  fullScore: number
  Component: React.FC<{ onComplete: (score: number) => void }>
}

export const MATH_ARCADE_GAMES: MathArcadeGame[] = [
  { id: 'sprint', fullScore: 16, name: 'Number Sprint', icon: '⚡', blurb: '60 seconds. How many can you solve?', Component: Sprint },
  { id: 'match', fullScore: 100, name: 'Math Match', icon: '🃏', blurb: 'Flip cards and match sums to answers.', Component: Match },
  { id: 'bonds', fullScore: 10, name: 'Bond Builder', icon: '🫧', blurb: 'Pop the bubble that completes the bond.', Component: Bonds },
  { id: 'fractions', fullScore: 8, name: 'Fraction Feast', icon: '🍕', blurb: 'What fraction of the pizza is gone?', Component: Fractions },
  { id: 'compare', fullScore: 10, name: 'Hungry Bear', icon: '🐻', blurb: 'Help the bear pick the bigger pile.', Component: Compare },
]

export { Sprint, Match, Bonds, Fractions, Compare }
export type { MathGameProps } from './shared'
