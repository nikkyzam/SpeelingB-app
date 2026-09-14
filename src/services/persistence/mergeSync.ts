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

/** Apply local edits relative to the last downloaded snapshot. A concurrent
 * server edit wins a conflict (including a parent's balance correction).
 * Lifetime learned/spelled sets retain additions from both devices. */
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
  if (['progress.wordsLearnedTotal', 'progress.wordsSpelledTotal'].includes(path)
    && Array.isArray(local) && Array.isArray(remote)) {
    return [...new Set([...remote, ...local])]
  }
  return remote
}
