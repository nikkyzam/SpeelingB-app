import type { Question, Response } from './types'

/** Lowercase, plain dashes, no punctuation, single spaces — so "Scarcity." matches "scarcity". */
export const normText = (s: string): string =>
  s
    .toLowerCase()
    .replace(/[−–—]/g, '-')
    .replace(/[.,'’"`!?]/g, '')
    .replace(/\s+/g, ' ')
    .trim()

/**
 * The first signed number in whatever was typed, so "$8", "-37°C" and
 * "120 feet" all grade the same as the bare number. Null when there is none.
 */
export const parseNumber = (raw: string): number | null => {
  const s = raw.replace(/[−–—]/g, '-').replace(/,/g, '').trim()
  const m = s.match(/-?\d*\.?\d+/)
  if (!m) return null
  const v = Number(m[0])
  return Number.isFinite(v) ? v : null
}

/**
 * An expression in one plain spelling: no spaces or times signs, plain
 * minus, and "+ (−6)" read as "− 6" — so 6(3 + 2), 6 × (3+2) and 6(3+2)
 * all match.
 */
export const normExpression = (s: string): string =>
  s
    .toLowerCase()
    .replace(/[−–—]/g, '-')
    .replace(/\s+/g, '')
    .replace(/^=/, '')
    .replace(/[×*·x](?=\()/g, '')
    .replace(/\((-\d+(?:\.\d+)?)\)/g, '$1')
    .replace(/\+-/g, '-')

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : Math.abs(a))

/** A fraction in lowest terms, sign on top. */
export const simplify = ([n, d]: [number, number]): [number, number] => {
  const g = gcd(n, d) || 1
  const s = d < 0 ? -1 : 1
  return [(s * n) / g, (s * d) / g]
}

/**
 * Read "3/4", "1 1/3" (a mixed number), "5", or an exact decimal like "0.75"
 * as [numerator, denominator]. Null when it isn't one of those.
 */
export const parseFraction = (raw: string): [number, number] | null => {
  const s = raw.replace(/[−–—]/g, '-').replace(/\s+/g, ' ').trim()
  let m = s.match(/^(-?)(\d+) (\d+)\/(\d+)$/)
  if (m) {
    const [whole, n, d] = [Number(m[2]), Number(m[3]), Number(m[4])]
    if (d === 0) return null
    return simplify([(m[1] ? -1 : 1) * (whole * d + n), d])
  }
  m = s.match(/^(-?\d+) ?\/ ?(\d+)$/)
  if (m) return Number(m[2]) === 0 ? null : simplify([Number(m[1]), Number(m[2])])
  m = s.match(/^-?\d+$/)
  if (m) return [Number(s), 1]
  m = s.match(/^(-?)(\d*)\.(\d+)$/)
  if (m) {
    const scale = 10 ** m[3].length
    return simplify([(m[1] ? -1 : 1) * (Number(m[2] || 0) * scale + Number(m[3])), scale])
  }
  return null
}

/** 7/4 → "7/4 (1 3/4)"; 3/4 → "3/4"; 8/1 → "8". */
export const fractionText = ([n, d]: [number, number]): string => {
  if (d === 1) return String(n)
  const whole = Math.trunc(n / d)
  return whole === 0 ? `${n}/${d}` : `${n}/${d} (${whole} ${Math.abs(n % d)}/${d})`
}

/** "(3, -2)", "3,-2" and "3 −2" all read as [3, -2]. */
export const parsePair = (raw: string): [number, number] | null => {
  const nums = raw.replace(/[−–—]/g, '-').match(/-?\d*\.?\d+/g)
  if (!nums || nums.length !== 2) return null
  return [Number(nums[0]), Number(nums[1])]
}

const close = (a: number, b: number) => Math.abs(a - b) < 1e-9
const samePoint = (p: [number, number], q: [number, number]) => close(p[0], q[0]) && close(p[1], q[1])

export const isAnswered = (q: Question, r: Response): boolean => {
  if (r === null || r === undefined) return false
  switch (q.kind) {
    case 'choice':
      return typeof r === 'number'
    case 'truefalse':
      return typeof r === 'boolean'
    case 'number':
      return typeof r === 'string' && parseNumber(r) !== null
    case 'pair':
      return typeof r === 'string' && parsePair(r) !== null
    case 'fraction':
      return typeof r === 'string' && parseFraction(r) !== null
    case 'text':
    case 'expression':
      return typeof r === 'string' && r.trim() !== ''
    case 'multi':
      return Array.isArray(r) && r.length > 0
    case 'order':
      return Array.isArray(r) && r.length === q.items.length
    case 'match':
      return Array.isArray(r) && r.length === q.pairs.length && (r as number[]).every((v) => v >= 0)
    case 'plot':
      return Array.isArray(r) && r.length > 0
  }
}

export const isCorrect = (q: Question, r: Response): boolean => {
  if (!isAnswered(q, r)) return false
  switch (q.kind) {
    case 'choice':
      return r === q.answer
    case 'truefalse':
      return r === q.answer
    case 'number':
      return close(parseNumber(r as string)!, q.answer)
    case 'pair':
      return samePoint(parsePair(r as string)!, q.answer)
    case 'fraction': {
      // Equal value is enough: 6/8 for 3/4 and 1 1/3 for 4/3 are both right.
      const [n, d] = parseFraction(r as string)!
      return n * q.answer[1] === q.answer[0] * d
    }
    case 'text':
      return q.accept.some((ok) => normText(ok) === normText(r as string))
    case 'expression':
      return q.accept.some((ok) => normExpression(ok) === normExpression(r as string))
    case 'multi': {
      const got = [...new Set(r as number[])].sort((a, b) => a - b)
      const want = [...q.answers].sort((a, b) => a - b)
      return got.length === want.length && got.every((v, i) => v === want[i])
    }
    case 'order':
      // Item indices tapped in order; the stored order is the right one.
      return (r as number[]).every((v, i) => v === i)
    case 'match':
      return (r as number[]).every((v, i) => v === i)
    case 'plot': {
      const pts = r as [number, number][]
      if (q.rule) {
        const { m, c, need } = q.rule
        const distinct = pts.filter((p, i) => pts.findIndex((o) => samePoint(o, p)) === i)
        return distinct.length >= need && distinct.every(([x, y]) => close(y, m * x + c))
      }
      const want = q.answer ?? []
      return pts.length === want.length && want.every((w) => pts.some((p) => samePoint(p, w)))
    }
  }
}

const fmtPoint = ([x, y]: [number, number]) => `(${x}, ${y})`

/** The right answer, written out for the review screen. */
export const correctAnswerText = (q: Question): string => {
  switch (q.kind) {
    case 'choice':
      return q.choices[q.answer]
    case 'truefalse':
      return q.answer ? 'True' : 'False'
    case 'number':
      return String(q.answer)
    case 'pair':
      return fmtPoint(q.answer)
    case 'fraction':
      return fractionText(q.answer)
    case 'text':
    case 'expression':
      return q.display
    case 'multi':
      return q.answers.map((i) => q.choices[i]).join('; ')
    case 'order':
      return q.items.join('  →  ')
    case 'match':
      return q.pairs.map(([l, r]) => `${l} → ${r}`).join('; ')
    case 'plot':
      return q.rule
        ? `Any ${q.rule.need} points on y = ${q.rule.m}x ${q.rule.c < 0 ? '−' : '+'} ${Math.abs(q.rule.c)}`
        : (q.answer ?? []).map(fmtPoint).join(', ')
  }
}

/** What the child gave, written out the same way. */
export const givenText = (q: Question, r: Response): string => {
  if (!isAnswered(q, r)) return 'No answer'
  switch (q.kind) {
    case 'choice':
      return q.choices[r as number]
    case 'truefalse':
      return r ? 'True' : 'False'
    case 'number':
    case 'pair':
    case 'text':
    case 'expression':
    case 'fraction':
      return (r as string).trim()
    case 'multi':
      return [...(r as number[])].sort((a, b) => a - b).map((i) => q.choices[i]).join('; ')
    case 'order':
      return (r as number[]).map((i) => q.items[i]).join('  →  ')
    case 'match':
      return (r as number[]).map((v, i) => `${q.pairs[i][0]} → ${q.pairs[v][1]}`).join('; ')
    case 'plot':
      return (r as [number, number][]).map(fmtPoint).join(', ')
  }
}

/** Letter grade the way the original Study Hall printed it. */
export const letterGrade = (pct: number): string =>
  pct >= 90 ? 'A' : pct >= 80 ? 'B' : pct >= 70 ? 'C' : pct >= 60 ? 'D' : '—'
