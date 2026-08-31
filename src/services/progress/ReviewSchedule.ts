/**
 * Per-word spaced repetition, so practice lands where it is actually needed.
 *
 * Until now the app threw away every wrong answer and offered "8 random words
 * you have learned" every couple of days — drilling words a child already nails
 * exactly as often as the one they miss every single time.
 *
 * This keeps a Leitner box per word. Get it right and it moves up a box and
 * comes back later; get it wrong and it drops to box 1 and comes back tomorrow.
 * The effect is simple to state and hard to beat: the words you find hard are
 * the words you see most.
 */

const KEY = 'word_review_schedule'
export const SCHEDULE_EVENT = 'reviewScheduleUpdated'

/** Days until a word in each box comes round again. Box 1 is "see me tomorrow". */
const INTERVALS = [1, 2, 4, 7, 14]
const MAX_BOX = INTERVALS.length

export interface WordRecord {
  /** 1..5 — higher means better known */
  box: number
  /** YYYY-MM-DD this word is next worth practising */
  due: string
  right: number
  wrong: number
}

type Schedule = Record<string, WordRecord>

const today = (): string => new Date().toISOString().slice(0, 10)

const addDays = (days: number): string => {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

const read = (): Schedule => {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as Schedule) : {}
  } catch {
    return {}
  }
}

const write = (schedule: Schedule): void => {
  try {
    localStorage.setItem(KEY, JSON.stringify(schedule))
    window.dispatchEvent(new Event(SCHEDULE_EVENT))
  } catch {
    /* practice still counts even if we cannot save it */
  }
}

export const ReviewSchedule = {
  /**
   * Record one attempt at a word, from anywhere in the app — a quiz, a spelling
   * round, or a game. Everything a child does with a word teaches us something,
   * so everything should count.
   */
  record(wordId: string, correct: boolean): WordRecord {
    if (!wordId) return { box: 1, due: today(), right: 0, wrong: 0 }
    const schedule = read()
    const existing = schedule[wordId] || { box: 1, due: today(), right: 0, wrong: 0 }

    const box = correct ? Math.min(existing.box + 1, MAX_BOX) : 1
    const next: WordRecord = {
      box,
      // A missed word waits until tomorrow rather than reappearing immediately:
      // being asked the same word you just failed feels like a telling-off.
      due: addDays(INTERVALS[box - 1]),
      right: existing.right + (correct ? 1 : 0),
      wrong: existing.wrong + (correct ? 0 : 1),
    }

    schedule[wordId] = next
    write(schedule)
    return next
  },

  get(wordId: string): WordRecord | undefined {
    return read()[wordId]
  },

  all(): Schedule {
    return read()
  },

  /** Words due today or overdue, hardest first. */
  getDueWordIds(limit = 10): string[] {
    const schedule = read()
    const now = today()
    return Object.entries(schedule)
      .filter(([, r]) => r.due <= now)
      .sort((a, b) => a[1].box - b[1].box || b[1].wrong - a[1].wrong)
      .slice(0, limit)
      .map(([id]) => id)
  },

  dueCount(): number {
    const now = today()
    return Object.values(read()).filter((r) => r.due <= now).length
  },

  /**
   * The words a child keeps getting wrong — missed at least twice, and missed
   * more often than not. These are worth a practice session of their own.
   */
  getTrickyWordIds(limit = 20): string[] {
    return Object.entries(read())
      .filter(([, r]) => r.wrong >= 2 && r.wrong >= r.right)
      .sort((a, b) => b[1].wrong - a[1].wrong)
      .slice(0, limit)
      .map(([id]) => id)
  },

  isTricky(wordId: string): boolean {
    const r = read()[wordId]
    return !!r && r.wrong >= 2 && r.wrong >= r.right
  },

  /** 0-1 how well known a word is, for showing a little progress ring. */
  strength(wordId: string): number {
    const r = read()[wordId]
    return r ? (r.box - 1) / (MAX_BOX - 1) : 0
  },
}

export default ReviewSchedule
