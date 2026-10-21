/**
 * One shape for every question outside spelling — math, social studies and
 * language arts all use it, so one set of screens can show and grade them.
 *
 * The question banks came from two older apps with their own field names
 * (Study Hall's `choices`/`answer`/`why`, Math Quest's `opts`/`a`/`expl`).
 * They were converted once into this shape; nothing reads the old names.
 */

/** A coordinate-grid drawing shown with a question. */
export interface GridFigure {
  /** Labelled points: [x, y, label?]. */
  points?: [number, number, string?][]
  /** A path joining points in order (a walk on the grid). */
  path?: [number, number][]
  /** A closed shape. */
  polygon?: [number, number][]
}

export interface GridBounds {
  xMin: number
  xMax: number
  yMin: number
  yMax: number
}

interface QuestionBase {
  id: string
  /** The question. May hold <strong>, <em>, <sup>, <sub> and fractions — see RichText. */
  prompt: string
  /** Groups misses into "what to review" (Study Hall) or a topic section (Math Quest). */
  category: string
  /** Why the right answer is right. Always shown once the question is answered. */
  explanation: string
  /** A shortcut or rule worth remembering ("Easy way to get it"). */
  tip?: string
  /** A nudge shown on request before answering. */
  hint?: string
  /** Math Quest tier: 1 practice, 2 challenge, 3 boss. */
  level?: 1 | 2 | 3
  /** Show the prompt (and choices) as a monospaced expression. */
  mono?: boolean
  /** The label printed on the original worksheet, when it isn't 1..n. */
  label?: string
  figure?: GridFigure
  /** A drawing that belongs to the explanation, shown only after answering. */
  answerFigure?: GridFigure
}

export type Question = QuestionBase &
  (
    | { kind: 'choice'; choices: string[]; answer: number }
    | { kind: 'multi'; choices: string[]; answers: number[] }
    | { kind: 'truefalse'; answer: boolean }
    /** Each left side matched to its right side. */
    | { kind: 'match'; pairs: [string, string][] }
    /** `items` is stored in the correct order and shuffled for display. */
    | { kind: 'order'; items: string[] }
    | { kind: 'number'; answer: number }
    | { kind: 'text'; accept: string[]; display: string }
    /** A short math expression such as 6(3 + 2) or 30 + 15, typed on the number pad. */
    | { kind: 'expression'; accept: string[]; display: string }
    /** Write an ordered pair. */
    | { kind: 'pair'; answer: [number, number] }
    /** Tap points onto a grid: exactly these points, or any `need` points on y = m·x + c. */
    | {
        kind: 'plot'
        grid: GridBounds
        answer?: [number, number][]
        rule?: { m: number; c: number; need: number }
      }
  )

export type QuestionKind = Question['kind']

/**
 * What a child has entered for a question. Shape depends on the kind:
 * - choice: the chosen index · truefalse: the boolean
 * - number, text, pair, expression: exactly what was typed (graded leniently)
 * - multi: chosen indices · order: item indices in the order tapped
 * - match: for each row, the index of the pair whose right side was picked (-1 for none)
 * - plot: the points placed
 */
export type Response = number | boolean | string | number[] | [number, number][] | null

/** A bank is split into forms (Form A, Form B, Challenge…); a one-form test uses `main`. */
export type QuestionBank = Record<string, Question[]>

export type SubjectId = 'math' | 'social-studies' | 'language-arts'
