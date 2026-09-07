import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../config/firebase'
import { wordBank } from '../wordBank'
import { levelFromXp, xpFromTotals } from '../progress/WordMastery'

/**
 * Everything a grown-up can see about one child's learning.
 *
 * The admin console showed four numbers a child. That is enough to know
 * someone is playing and not enough to help them: it cannot answer "which
 * words does she keep getting wrong?", "has he actually done anything this
 * week?", or "how far through the list are they?".
 *
 * All of it is already in the child's document — the sync carries the review
 * schedule, mastery counts and day-by-day history as an opaque bundle. Nothing
 * new has to be stored; it only has to be read and made sense of.
 *
 * `deriveProgress` is deliberately pure: it takes one document and returns the
 * whole picture, so it can be tested without Firebase and never accidentally
 * reads the *grown-up's own* localStorage — which is the trap here, since every
 * service in the app reads the signed-in child's data from exactly there.
 */

/** One child's stored document, as the sync writes it. */
export interface RawUserDoc {
  progress?: Record<string, unknown>
  points?: Record<string, unknown>
  rewards?: Record<string, unknown>
  /** the opaque bundle: localStorage key -> its JSON string */
  local?: Record<string, unknown>
  userData?: Record<string, unknown>
  lastUpdated?: unknown
}

/** A word the child gets wrong more often than not. */
export interface TrickyWord {
  id: string
  word: string
  level: number
  wrong: number
  right: number
  /** 1..5 in the spaced-repetition ladder; 1 means "back to the start" */
  box: number
}

export interface DayCount {
  date: string
  label: string
  count: number
}

export interface GamePlay {
  id: string
  name: string
  plays: number
  best: number
}

export interface LevelReach {
  level: number
  label: string
  met: number
  total: number
}

export interface AdminUserProgress {
  /** words met at least once */
  met: number
  /** words spelled correctly at least once */
  spelled: number
  /** spelled correctly three times or more */
  mastered: number
  /** every word the app currently ships */
  bankTotal: number
  /** 0-100, met against the whole list */
  pctMet: number
  perLevel: LevelReach[]
  explorer: { level: number; title: string; icon: string; xp: number; next: string | null }

  /** the last fortnight, oldest first */
  days: DayCount[]
  /** days in that fortnight with anything on them */
  activeDays: number
  bestDay: number

  /** words the spaced repetition says are worth practising today */
  dueToday: number
  /** how many words sit in each box, 1..5 */
  boxes: number[]
  /** words with any practice history at all */
  practised: number

  tricky: TrickyWord[]
  recent: { id: string; word: string; level: number }[]

  games: GamePlay[]
  totalPlays: number
  trophies: number
  badges: number

  /** saved ids the word bank no longer knows — a sign of a bank change */
  unresolved: number
}

const MASTERY_HITS = 3
const TRICKY_LIMIT = 12
const RECENT_LIMIT = 12
const HISTORY_DAYS = 14
const LEVEL_NAMES: Record<number, string> = { 1: 'One Bee', 2: 'Two Bee', 3: 'Three Bee' }

const ids = (v: unknown): string[] =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : []

const num = (v: unknown): number => (typeof v === 'number' && Number.isFinite(v) ? v : 0)

/**
 * Read one key out of the synced bundle.
 *
 * Values arrive as the raw strings localStorage held, but a document written by
 * an older build (or hand-edited in the Firebase console) can hold the parsed
 * object instead. Both are accepted; anything else is treated as absent, since
 * a grown-up looking at a progress page must never meet a crash.
 */
const bundled = <T>(raw: RawUserDoc, key: string, fallback: T): T => {
  const value = raw.local?.[key]
  if (value === undefined || value === null) return fallback
  if (typeof value === 'object') return value as T
  if (typeof value !== 'string') return fallback
  try {
    const parsed = JSON.parse(value)
    return parsed === null || parsed === undefined ? fallback : (parsed as T)
  } catch {
    return fallback
  }
}

/**
 * A day key, formed exactly the way the app forms the ones it stores.
 *
 * `WordMastery` and `ReviewSchedule` both key their data with
 * `toISOString().slice(0, 10)` — a UTC date. Reading those keys back with a
 * *local* date silently disagrees for part of every day outside UTC: an
 * evening in New York is already tomorrow in UTC, so a word practised then is
 * filed under a day this chart would not be looking at, and "due today" counts
 * the wrong set. Whatever one thinks of storing UTC, the reader must match the
 * writer.
 */
const dayKey = (d: Date): string => d.toISOString().slice(0, 10)

/** "word-scramble" -> "Word Scramble". Keeps this file free of a games registry. */
const gameName = (id: string): string =>
  id
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ') || id

/**
 * Turn one stored document into the whole picture of a child's learning.
 *
 * `now` is injectable so the fortnight and the "due today" count can be tested
 * without waiting for tomorrow.
 */
export const deriveProgress = (raw: RawUserDoc, now: Date = new Date()): AdminUserProgress => {
  const progress = (raw.progress || {}) as Record<string, unknown>

  const learnedIds = ids(progress.wordsLearnedTotal)
  const spelledIds = ids(progress.wordsSpelledTotal)

  // Count only words the bank still knows, so this agrees with what the child
  // sees in their own collection. Ids that no longer resolve are reported
  // separately rather than silently inflating or deflating the total.
  const metWords = learnedIds.map((id) => wordBank.getWordById(id)).filter((w) => !!w)
  const unresolved = learnedIds.length - metWords.length

  const correct = bundled<Record<string, number>>(raw, 'word_correct_counts', {})
  const mastered = spelledIds.filter((id) => num(correct[id]) >= MASTERY_HITS).length
  const spelledKnown = spelledIds.filter((id) => wordBank.getWordById(id)).length

  const levels = wordBank.availableLevels()
  const bankTotal = levels.reduce((n, l) => n + l.count, 0)
  const perLevel: LevelReach[] = levels.map((l) => ({
    level: l.level,
    label: LEVEL_NAMES[l.level] || `Level ${l.level}`,
    met: metWords.filter((w) => w!.difficulty === l.level).length,
    total: l.count,
  }))

  const xp = xpFromTotals({ met: metWords.length, spelled: spelledKnown, mastered })
  const rank = levelFromXp(xp)

  // --- the last fortnight ---------------------------------------------------
  const history = bundled<Record<string, number>>(raw, 'learn_history', {})
  const days: DayCount[] = []
  for (let i = HISTORY_DAYS - 1; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 86400000)
    days.push({
      date: dayKey(d),
      label: d.toLocaleDateString(undefined, { weekday: 'narrow' }),
      count: Math.max(0, num(history[dayKey(d)])),
    })
  }

  // --- what the spaced repetition knows -------------------------------------
  interface Record_ { box?: unknown; due?: unknown; right?: unknown; wrong?: unknown }
  const schedule = bundled<Record<string, Record_>>(raw, 'word_review_schedule', {})
  const entries = Object.entries(schedule).filter(([, r]) => r && typeof r === 'object')
  const todayKey = dayKey(now)

  const boxes = [0, 0, 0, 0, 0]
  let dueToday = 0
  for (const [, r] of entries) {
    const box = Math.min(5, Math.max(1, Math.round(num(r.box)) || 1))
    boxes[box - 1] += 1
    if (typeof r.due === 'string' && r.due <= todayKey) dueToday += 1
  }

  // Words that fight back. Sorted by how often they are missed, then by how
  // recently they slipped back down the ladder — that ordering puts the word a
  // grown-up should sit down and practise at the top.
  const tricky: TrickyWord[] = entries
    .map(([id, r]) => ({ id, wrong: num(r.wrong), right: num(r.right), box: Math.max(1, Math.round(num(r.box)) || 1) }))
    .filter((t) => t.wrong > 0)
    .flatMap((t): TrickyWord[] => {
      const word = wordBank.getWordById(t.id)
      // A word the bank has forgotten cannot be named, so it cannot be practised.
      return word ? [{ ...t, word: word.word, level: word.difficulty }] : []
    })
    .sort((a, b) => b.wrong - a.wrong || a.box - b.box || a.word.localeCompare(b.word))
    .slice(0, TRICKY_LIMIT)

  // --- most recently met, newest first --------------------------------------
  const recent = learnedIds
    .slice(-RECENT_LIMIT)
    .reverse()
    .flatMap((id): { id: string; word: string; level: number }[] => {
      const word = wordBank.getWordById(id)
      return word ? [{ id, word: word.word, level: word.difficulty }] : []
    })

  // --- play -----------------------------------------------------------------
  const plays = bundled<Record<string, number>>(raw, 'game_play_counts', {})
  const bests = bundled<Record<string, number>>(raw, 'game_high_scores', {})
  const games: GamePlay[] = Object.keys(plays)
    .map((id) => ({ id, name: gameName(id), plays: num(plays[id]), best: num(bests[id]) }))
    .filter((g) => g.plays > 0)
    .sort((a, b) => b.plays - a.plays || a.name.localeCompare(b.name))

  const trophyCase = bundled<Record<string, string>>(raw, 'trophy_case', {})
  const rewards = (raw.rewards || {}) as Record<string, unknown>
  const badgeList = Array.isArray(rewards.unlockedBadges)
    ? rewards.unlockedBadges
    : bundled<string[]>(raw, 'kids_spelling_badges', [])

  return {
    met: metWords.length,
    spelled: spelledKnown,
    mastered,
    bankTotal,
    pctMet: bankTotal > 0 ? (metWords.length / bankTotal) * 100 : 0,
    perLevel,
    explorer: {
      level: rank.level,
      title: rank.title,
      icon: rank.icon,
      xp: rank.xp,
      next: rank.next ? rank.next.title : null,
    },
    days,
    activeDays: days.filter((d) => d.count > 0).length,
    bestDay: days.reduce((max, d) => Math.max(max, d.count), 0),
    dueToday,
    boxes,
    practised: entries.length,
    tricky,
    recent,
    games,
    totalPlays: games.reduce((n, g) => n + g.plays, 0),
    trophies: Object.keys(trophyCase).length,
    badges: Array.isArray(badgeList) ? badgeList.length : 0,
    unresolved,
  }
}

/**
 * Fetch one child's document and derive their progress from it.
 *
 * The console already holds every document from its own listing, so this is
 * only needed to look at a single child fresh — after a day's play, say.
 */
export async function getUserProgress(uid: string): Promise<AdminUserProgress> {
  const snap = await getDoc(doc(db, 'users', uid))
  if (!snap.exists()) throw new Error('That child has no saved data yet.')
  return deriveProgress(snap.data() as RawUserDoc)
}

export default { deriveProgress, getUserProgress }
