import { activityClock } from '../../../services/games/activityClock'
import { useMemo, useRef } from 'react'
import { useAudio } from '../../../contexts/AudioContext'
import { praise, nearly, isStreakMilestone } from '../../../services/words/praise'
import sfx from './sfx'

interface CheerOptions {
  /** Said after the cheer — the word, or "It's spelled c, a, t". */
  say?: string
  /** Sound and the returned line only, nothing spoken. For fast arcade play. */
  quiet?: boolean
}

export interface Cheer {
  /** A right answer: the "yes!" sound, a fresh line of praise, the run grows. Returns the line to show. */
  hit: (options?: CheerOptions) => string
  /** A miss: the soft "nearly" sound and a gentle line; the run starts again. Returns the line to show. */
  miss: (options?: CheerOptions) => string
  /** Right answers in a row so far. */
  streak: () => number
}

/**
 * One way for every game to react to an answer, so each one sounds alive and
 * none says "Correct!" forty times in a row.
 *
 * A right answer plays `sfx.correct` (a star chime on top at 3, 5, 10 in a
 * row), and speaks praise that never repeats back to back and grows into a
 * streak cheer. A miss plays the soft `sfx.wrong` and says "Nearly!" or
 * similar — never "Wrong". Show the returned line in the game's own flash.
 */
export const useCheer = (): Cheer => {
  const { speak } = useAudio()
  const run = useRef(0)
  return useMemo<Cheer>(
    () => ({
      hit: ({ say, quiet } = {}) => {
        run.current += 1
        const line = praise(run.current)
        sfx.correct()
        if (isStreakMilestone(run.current)) activityClock.setTimeout(() => sfx.star(), 180)
        if (!quiet) speak(say ? `${line} ${say}` : line)
        return line
      },
      miss: ({ say, quiet } = {}) => {
        run.current = 0
        const line = nearly()
        sfx.wrong()
        if (!quiet) speak(say ? `${line} ${say}` : line)
        return line
      },
      streak: () => run.current,
    }),
    [speak]
  )
}

export default useCheer
