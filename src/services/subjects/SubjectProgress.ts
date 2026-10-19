/**
 * Best scores for everything outside spelling: Study Hall tests, Math Quest
 * tiers and the math arcade. One localStorage key, registered in userKeys so
 * it follows the child and leaves with them on a shared tablet.
 *
 * Result keys are plain strings chosen by the caller:
 *   test:<testId>:<formId>   quest:<topicId>:<tier>   arcade:<gameId>
 */

export const SUBJECT_PROGRESS_KEY = 'subject_progress'
export const SUBJECT_PROGRESS_EVENT = 'subjectProgressUpdated'

export interface BestResult {
  correct: number
  total: number
  /** 0–100, rounded. Arcade games store their raw score here and total 0. */
  pct: number
  /** ISO time of the best attempt. */
  at: string
}

interface Stored {
  best: Record<string, BestResult>
  /** Result key → local day it last paid stars, so replays aren't a star farm. */
  paid: Record<string, string>
}

const empty = (): Stored => ({ best: {}, paid: {} })

const read = (): Stored => {
  try {
    const raw = localStorage.getItem(SUBJECT_PROGRESS_KEY)
    if (!raw) return empty()
    const parsed = JSON.parse(raw)
    return { best: parsed.best ?? {}, paid: parsed.paid ?? {} }
  } catch {
    return empty()
  }
}

const write = (data: Stored) => {
  try {
    localStorage.setItem(SUBJECT_PROGRESS_KEY, JSON.stringify(data))
  } catch {
    // storage full or blocked — progress just isn't kept
  }
  window.dispatchEvent(new Event(SUBJECT_PROGRESS_EVENT))
}

const today = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/** 1 star for trying, up to 5 for a perfect run. */
export const starsFor = (pct: number): number => Math.max(1, Math.min(5, Math.round(pct / 20)))

const SubjectProgress = {
  getBest(key: string): BestResult | null {
    return read().best[key] ?? null
  },

  /** Every best whose key starts with `prefix` — e.g. all forms of one test. */
  bestsFor(prefix: string): Record<string, BestResult> {
    const { best } = read()
    return Object.fromEntries(Object.entries(best).filter(([k]) => k.startsWith(prefix)))
  },

  /**
   * Save a finished test or tier. Returns whether it beat the old best and how
   * many stars it pays — stars only the first time each key is finished each day.
   */
  recordResult(key: string, correct: number, total: number): { newBest: boolean; stars: number } {
    const data = read()
    const pct = total > 0 ? Math.round((correct / total) * 100) : 0
    const old = data.best[key]
    const newBest = !old || pct > old.pct
    if (newBest) data.best[key] = { correct, total, pct, at: new Date().toISOString() }
    const day = today()
    const stars = data.paid[key] === day ? 0 : starsFor(pct)
    if (stars) data.paid[key] = day
    write(data)
    return { newBest, stars }
  },

  /** Save an arcade score; returns true when it is a new best. */
  recordArcadeScore(gameId: string, score: number): boolean {
    const data = read()
    const key = `arcade:${gameId}`
    const old = data.best[key]
    if (old && old.pct >= score) return false
    data.best[key] = { correct: score, total: 0, pct: score, at: new Date().toISOString() }
    write(data)
    return true
  },
}

export default SubjectProgress
