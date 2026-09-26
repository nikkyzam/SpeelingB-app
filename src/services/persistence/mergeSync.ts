type Data = Record<string, any>
const object = (v: any): v is Data => !!v && typeof v === 'object' && !Array.isArray(v)
export const equalSyncData = (a: any, b: any): boolean => {
  if (a === b) return true
  if (Array.isArray(a) && Array.isArray(b)) return a.length === b.length && a.every((v, i) => equalSyncData(v, b[i]))
  if (object(a) && object(b)) {
    const keys = Object.keys(a)
    return keys.length === Object.keys(b).length && keys.every(k => equalSyncData(a[k], b[k]))
  }
  return false
}

/** Word-id lists both devices add to. They merge as sets, so either side's
 * additions survive and either side's removals stick — the day rollover and a
 * grown-up's "reset today" both clear the *Today lists. */
const SET_PATHS = new Set(['progress.wordsLearnedTotal', 'progress.wordsSpelledTotal',
  'progress.wordsLearnedToday', 'progress.wordsSpelledToday', 'progress.wordsPracticedToday'])

/** Keep what neither side removed, plus what either side added: remote order
 * first, then local additions. Without a base a removal can't be told from an
 * addition, so both sides are kept. */
function mergeSet(base: unknown, local: unknown[], remote: unknown[]): unknown[] {
  if (!Array.isArray(base)) return [...new Set([...remote, ...local])]
  const had = new Set(base)
  const kept = new Set(local)
  return [...new Set([
    ...remote.filter(v => !had.has(v) || kept.has(v)),
    ...local.filter(v => !had.has(v)),
  ])]
}

/** Apply local edits relative to the last downloaded snapshot. A concurrent
 * server edit wins a conflict (including a parent's balance correction),
 * except in the SET_PATHS word lists, which merge as sets. */
export function mergeSync(base: any, local: any, remote: any, path = ''): any {
  if (equalSyncData(local, base)) return remote
  if (equalSyncData(remote, base)) return local
  if (object(local) && object(remote) && (base === undefined || object(base))) {
    const out: Data = {}
    for (const key of new Set([...Object.keys(base || {}), ...Object.keys(local), ...Object.keys(remote)])) {
      const value = mergeSync(base?.[key], local[key], remote[key], path ? `${path}.${key}` : key)
      if (value !== undefined) out[key] = value
    }
    return out
  }
  if (SET_PATHS.has(path) && Array.isArray(local) && Array.isArray(remote)) {
    return mergeSet(base, local, remote)
  }
  return remote
}
