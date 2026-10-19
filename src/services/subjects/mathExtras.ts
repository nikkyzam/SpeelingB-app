/**
 * Math Quest's extras: proofs, puzzles and comic lessons.
 *
 * The old app graded these on its server; here everything is checked in the
 * browser by the pure functions below. The content lives in JSON under
 * src/data/subjects/math/quest/ and is loaded with dynamic import() so it only
 * downloads when a child opens one of these screens.
 *
 * Nothing here touches localStorage.
 */
import type { Question } from './types'
import { normText, parseNumber } from './grading'

// --- proofs ------------------------------------------------------------------

export type ProofKind = 'order' | 'reasons' | 'blanks'

/** What a child is asked to do, by kind. */
export const PROOF_KIND_LABEL: Record<ProofKind, string> = {
  order: 'Put the steps in order',
  reasons: 'Match each step to its reason',
  blanks: 'Fill in the missing step',
}

/** A step of the argument. `reason` is set on every step of a reasons proof. */
export interface ProofTextStep {
  text: string
  reason?: string
  missing?: undefined
}

/** The step a blanks proof leaves out; `answer` indexes `choices`. */
export interface ProofMissingStep {
  missing: true
  choices: string[]
  answer: number
}

export type ProofStep = ProofTextStep | ProofMissingStep

export interface Proof {
  id: string
  grade: number
  /** Math Quest topic it came from (several are advanced topics this app does not list). */
  topic: string
  kind: ProofKind
  claim: string
  /** Stored in the correct order. */
  steps: ProofStep[]
  /** The reasons a child picks from (reasons proofs only). */
  reasons?: string[]
  hints: string[]
}

/**
 * A child's attempt. Only the field for the proof's kind is read:
 * - order: step indices in the order the child placed them
 * - reasons: for each step index, the reason picked
 * - blanks: for each missing step's index, the chosen option's index
 */
export interface ProofAttempt {
  order?: number[]
  reasons?: Record<number, string | undefined>
  blanks?: Record<number, number | undefined>
}

export interface ProofResult {
  correct: boolean
  /** Order: the first position holding the wrong step. Others: the first wrong step. */
  firstWrong: number | null
  /** Order: positions in the wrong place. Others: step indices that are not right yet. */
  wrongSteps: number[]
}

export const isMissingStep = (s: ProofStep): s is ProofMissingStep => s.missing === true

export const checkProof = (p: Proof, attempt: ProofAttempt): ProofResult => {
  let wrong: number[]
  if (p.kind === 'order') {
    const given = attempt.order ?? []
    wrong = p.steps.map((_, i) => i).filter((i) => given[i] !== i)
  } else if (p.kind === 'reasons') {
    const given = attempt.reasons ?? {}
    wrong = p.steps
      .map((s, i) => (!isMissingStep(s) && given[i] === s.reason ? -1 : i))
      .filter((i) => i >= 0)
  } else {
    const given = attempt.blanks ?? {}
    wrong = p.steps
      .map((s, i) => (isMissingStep(s) && given[i] !== s.answer ? i : -1))
      .filter((i) => i >= 0)
  }
  return { correct: wrong.length === 0, firstWrong: wrong[0] ?? null, wrongSteps: wrong }
}

/** The whole correct attempt — what "show me" fills in. */
export const proofAnswer = (p: Proof): ProofAttempt => ({
  order: p.steps.map((_, i) => i),
  reasons: Object.fromEntries(p.steps.map((s, i) => [i, isMissingStep(s) ? undefined : s.reason])),
  blanks: Object.fromEntries(p.steps.map((s, i) => [i, isMissingStep(s) ? s.answer : undefined])),
})

/** Step indices in a random order that is never already the right one. */
export const shuffledSteps = (n: number, random: () => number = Math.random): number[] => {
  const order = Array.from({ length: n }, (_, i) => i)
  if (n < 2) return order
  do {
    for (let i = n - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1))
      ;[order[i], order[j]] = [order[j], order[i]]
    }
  } while (order.every((v, i) => v === i))
  return order
}

// --- puzzles -----------------------------------------------------------------

export interface Puzzle {
  id: string
  title: string
  /** 1 (gentle) to 4 (tough). */
  difficulty: number
  topic: string
  prompt: string
  /** Every answer that counts. Numbers are matched as numbers, strings as text. */
  accept: (number | string)[]
  /** The answer as shown when a child asks to see it. */
  answer: string
  /** A three-step ladder, each a bit more help than the last. */
  hints: string[]
  /** How to get there, shown with the answer. */
  solution: string
}

const close = (a: number, b: number) => Math.abs(a - b) < 1e-9

/** "16", "16 triangles" and " 16. " all count; a text answer is matched like grading.ts does. */
export const checkPuzzle = (p: Puzzle, raw: string): boolean => {
  if (!raw.trim()) return false
  const n = parseNumber(raw)
  return p.accept.some((ok) =>
    typeof ok === 'number' ? n !== null && close(n, ok) : normText(ok) === normText(raw)
  )
}

export type Trophy = 'gold' | 'silver' | 'bronze'

/** No hints is gold, one is silver, more is bronze. */
export const trophyFor = (hintsUsed: number): Trophy =>
  hintsUsed <= 0 ? 'gold' : hintsUsed === 1 ? 'silver' : 'bronze'

// --- comic lessons -----------------------------------------------------------

/** A small drawing beside a panel. */
export type LessonArt =
  | { kind: 'array'; rows: number; cols: number }
  | { kind: 'bar'; parts: number; filled: number }
  | { kind: 'compare'; left: number; right: number }

export type LessonSpeaker = 'pip' | 'nim' | 'vex'

export type LessonPanel =
  | { type: 'talk'; speaker: LessonSpeaker; text: string; art?: LessonArt }
  /** A question asked before moving on, graded with isCorrect. Never blocks. */
  | { type: 'check'; question: Question; art?: LessonArt }

export interface Lesson {
  id: string
  /** The Math Quest topic (curriculum.json id) this lesson teaches. */
  topicId: string
  title: string
  blurb: string
  panels: LessonPanel[]
}

/** Pure lookup, for callers that already hold the list. */
export const findLesson = (lessons: Lesson[], topicId: string): Lesson | null =>
  lessons.find((l) => l.topicId === topicId) ?? null

// --- loaders -----------------------------------------------------------------

/** Cache the promise, but forget a failed load so the next visit retries. */
const cached = <T>(load: () => Promise<T>) => {
  let p: Promise<T> | null = null
  return (): Promise<T> => {
    if (!p) {
      p = load().catch((e) => {
        p = null
        throw e
      })
    }
    return p
  }
}

export const loadProofs = cached(() =>
  import('../../data/subjects/math/quest/proofs.json').then((m) => m.default as unknown as Proof[])
)

export const loadPuzzles = cached(() =>
  import('../../data/subjects/math/quest/puzzles.json').then((m) => m.default as unknown as Puzzle[])
)

export const loadLessons = cached(() =>
  import('../../data/subjects/math/quest/lessons.json').then((m) => m.default as unknown as Lesson[])
)

/** The comic lesson for a topic, or null when that topic has none. */
export const lessonForTopic = async (topicId: string): Promise<Lesson | null> =>
  findLesson(await loadLessons(), topicId)
