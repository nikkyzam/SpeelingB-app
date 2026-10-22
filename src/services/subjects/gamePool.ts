/**
 * Turns any topic's questions into game material, so every topic — every
 * Math Quest topic and every practice test, and any added later — is
 * playable as games without anyone authoring a game per topic.
 *
 * A new Question kind must be handled here (answerLabel and decoys) or its
 * questions simply sit out the pick and match games.
 */
import type { Question } from './types'
import { shuffle } from '../../components/games/shared/wordTricks'

/** What every topic game takes and reports. `pct` is 0–100 for the star payout. */
export interface TopicGameProps {
  questions: Question[]
  onComplete: (pct: number) => void
}

/** Markup out, stacked fractions back to "a/b". */
export const plain = (s: string): string =>
  s
    .replace(/<span class="den">/g, '/')
    .replace(/<br\s*\/?>/g, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim()

/** The right answer as a short label, or null when it has none (multi, match, order, plot). */
export const answerLabel = (q: Question): string | null => {
  switch (q.kind) {
    case 'choice':
      return plain(q.choices[q.answer])
    case 'truefalse':
      return q.answer ? 'True' : 'False'
    case 'number':
      return String(q.answer)
    case 'fraction':
      return q.answer[1] === 1 ? String(q.answer[0]) : `${q.answer[0]}/${q.answer[1]}`
    case 'pair':
      return `(${q.answer[0]}, ${q.answer[1]})`
    case 'text':
    case 'expression':
      return plain(q.display)
    default:
      return null
  }
}

/** Wrong answers that look like they belong, made from the answer itself. */
const madeUpDecoys = (q: Question): string[] => {
  if (q.kind === 'number') {
    const a = q.answer
    const step = Number.isInteger(a) ? 1 : 0.1
    return [a + step, a - step, a * 2, a + 10 * step].map((x) => String(Math.round(x * 1000) / 1000))
  }
  if (q.kind === 'fraction') {
    const [n, d] = q.answer
    const flip = n === 0 ? null : d === 1 ? `1/${n}` : `${d}/${n}`
    return [flip, `${n + 1}/${d}`, `${n}/${d + 1}`, `${n * 2}/${d}`].filter((x): x is string => !!x)
  }
  if (q.kind === 'pair') {
    const [x, y] = q.answer
    return [`(${y}, ${x})`, `(${-x}, ${y})`, `(${x}, ${-y})`]
  }
  return []
}

/** Longest answer a pick round will show; longer ones (whole paragraphs) sit out. */
export const MAX_PICK = 160

export interface PickRound {
  id: string
  prompt: string
  options: string[]
  answer: number
  explanation: string
}

/**
 * Rounds of "pick the right answer". Multiple choice keeps its own options;
 * typed answers borrow other answers from the same topic as decoys, then
 * made-up ones, so a wrong option is always believable.
 */
export const pickRounds = (questions: Question[], count: number, optionCount = 4): PickRound[] => {
  const labelled = questions
    .map((q) => ({ q, label: answerLabel(q) }))
    .filter((x): x is { q: Question; label: string } => x.label !== null && x.label.length <= MAX_PICK)
  const rounds: PickRound[] = []
  for (const { q, label } of shuffle(labelled)) {
    if (rounds.length >= count) break
    let options: string[]
    if (q.kind === 'choice') {
      const wrong = shuffle(q.choices.map(plain).filter((c) => c !== label)).slice(0, optionCount - 1)
      options = [label, ...wrong]
    } else if (q.kind === 'truefalse') {
      options = ['True', 'False']
    } else {
      const borrowed = shuffle(labelled.filter((o) => o.q.kind === q.kind && o.label !== label).map((o) => o.label))
      const wrong = [...new Set([...borrowed, ...madeUpDecoys(q)])].filter((w) => w !== label).slice(0, optionCount - 1)
      options = [label, ...wrong]
    }
    if (options.length < 2) continue
    const order = q.kind === 'truefalse' ? options : shuffle(options)
    rounds.push({
      id: q.id,
      prompt: plain(q.prompt),
      options: order,
      answer: order.indexOf(label),
      explanation: plain(q.explanation),
    })
  }
  return rounds
}

export interface MatchPair {
  id: string
  prompt: string
  answer: string
}

/**
 * Question ↔ answer pairs for a matching game. Matching questions give their
 * own pairs (term ↔ meaning); others give prompt ↔ answer when both are short
 * enough for a card. No two pairs share an answer, or a match would be ambiguous.
 */
export const matchPairs = (questions: Question[], count: number): MatchPair[] => {
  const candidates: MatchPair[] = []
  for (const q of questions) {
    if (q.kind === 'match') {
      q.pairs.forEach(([l, r], i) => candidates.push({ id: `${q.id}-${i}`, prompt: plain(l), answer: plain(r) }))
      continue
    }
    if (q.kind === 'truefalse') continue // "True" would match half the board
    const answer = answerLabel(q)
    if (answer) candidates.push({ id: q.id, prompt: plain(q.prompt), answer })
  }
  const seen = new Set<string>()
  const out: MatchPair[] = []
  for (const c of shuffle(candidates)) {
    if (out.length >= count) break
    const key = c.answer.toLowerCase()
    if (c.answer.length > 60 || c.prompt.length > 140 || seen.has(key)) continue
    seen.add(key)
    out.push(c)
  }
  return out
}
