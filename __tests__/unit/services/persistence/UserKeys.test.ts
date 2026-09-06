import { describe, it, expect, beforeEach } from 'vitest'
import fs from 'fs'
import path from 'path'
import {
  USER_KEYS,
  DEVICE_KEYS,
  LAST_USER_KEY,
  BUNDLED_SYNC_KEYS,
  TYPED_SYNC_KEYS,
  clearUserData,
  prepareDeviceFor,
  forgetDeviceUser,
} from '../../../../src/services/persistence/userKeys'

const SRC = path.resolve(__dirname, '../../../../src')

/** Every .ts/.tsx file under src, recursively. */
const sourceFiles = (dir: string): string[] =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = path.join(dir, d.name)
    if (d.isDirectory()) return sourceFiles(p)
    return /\.(ts|tsx)$/.test(d.name) ? [p] : []
  })

/**
 * Every localStorage key the source writes: string literals passed straight
 * to setItem, plus any `SOMETHING_KEY = '...'` constant in a file that talks
 * to localStorage. The same two greps that found the leak in the first place.
 */
const keysWrittenInSource = (): Map<string, string> => {
  const found = new Map<string, string>()
  for (const file of sourceFiles(SRC)) {
    const src = fs.readFileSync(file, 'utf-8')
    if (!src.includes('localStorage')) continue
    const rel = path.relative(SRC, file)
    for (const m of src.matchAll(/localStorage\.setItem\(\s*'([^']+)'/g)) found.set(m[1], rel)
    for (const m of src.matchAll(/(?:const|static|readonly)\s+[A-Z_]*KEY[A-Z_]*\s*=\s*'([^']+)'/g)) {
      found.set(m[1], rel)
    }
  }
  return found
}

describe('the registry of what belongs to a child', () => {
  it('knows about every key the app writes', () => {
    const registered = new Set<string>([...USER_KEYS, ...DEVICE_KEYS])
    const unregistered = [...keysWrittenInSource()]
      .filter(([key]) => !registered.has(key))
      .map(([key, file]) => `${key}  (${file})`)

    expect(
      unregistered,
      'A localStorage key is written somewhere but is not in userKeys.ts. ' +
        'Add it to USER_KEYS (it belongs to the child: cleared on sign-out, synced) ' +
        'or DEVICE_KEYS (it belongs to the tablet). Otherwise it will leak from one ' +
        'child to the next on a shared device, exactly as the buddy did.'
    ).toEqual([])
  })

  it('keeps the two lists disjoint', () => {
    const both = USER_KEYS.filter((k) => (DEVICE_KEYS as readonly string[]).includes(k))
    expect(both).toEqual([])
  })

  it('bundles everything the typed sync does not already carry', () => {
    for (const k of TYPED_SYNC_KEYS) expect(BUNDLED_SYNC_KEYS).not.toContain(k)
    expect(BUNDLED_SYNC_KEYS).toContain('buddy_state')
    expect(BUNDLED_SYNC_KEYS).toContain('kids_spelling_badges')
    expect(BUNDLED_SYNC_KEYS).toContain('world')
    expect(BUNDLED_SYNC_KEYS.length + TYPED_SYNC_KEYS.length).toBe(USER_KEYS.length)
  })
})

describe('signing out takes everything of the child with them', () => {
  beforeEach(() => localStorage.clear())

  it('removes every user key and leaves the device alone', () => {
    for (const k of USER_KEYS) localStorage.setItem(k, 'theirs')
    localStorage.setItem('audioEnabled', 'false')
    // Firebase keeps its own entries in storage; we must not touch them.
    localStorage.setItem('firebase:authUser:abc:[DEFAULT]', '{"uid":"x"}')

    clearUserData()

    for (const k of USER_KEYS) expect(localStorage.getItem(k)).toBeNull()
    expect(localStorage.getItem('audioEnabled')).toBe('false')
    expect(localStorage.getItem('firebase:authUser:abc:[DEFAULT]')).toBe('{"uid":"x"}')
  })

  it('the buddy in particular does not survive', () => {
    localStorage.setItem('buddy_state', JSON.stringify({ name: 'Sprinkles' }))
    clearUserData()
    expect(localStorage.getItem('buddy_state')).toBeNull()
  })
})

describe('a different child signing in starts from a clean slate', () => {
  beforeEach(() => localStorage.clear())

  const seedAva = () => {
    localStorage.setItem('buddy_state', JSON.stringify({ name: "Ava's buddy" }))
    localStorage.setItem('kids_spelling_points', '{"availablePoints":900}')
    localStorage.setItem('world', 'unicorn')
    localStorage.setItem('audioEnabled', 'false')
  }

  it('clears the previous account when the uid differs', () => {
    localStorage.setItem(LAST_USER_KEY, 'ava')
    seedAva()

    expect(prepareDeviceFor('sam')).toBe(true)

    expect(localStorage.getItem('buddy_state')).toBeNull()
    expect(localStorage.getItem('kids_spelling_points')).toBeNull()
    expect(localStorage.getItem('world')).toBeNull()
    expect(localStorage.getItem('audioEnabled')).toBe('false') // the tablet's, not Ava's
    expect(localStorage.getItem(LAST_USER_KEY)).toBe('sam')
  })

  it('keeps everything when the same child comes back', () => {
    localStorage.setItem(LAST_USER_KEY, 'ava')
    seedAva()

    expect(prepareDeviceFor('ava')).toBe(false)
    expect(JSON.parse(localStorage.getItem('buddy_state')!).name).toBe("Ava's buddy")
  })

  it('keeps guest progress when a brand-new account signs up on a fresh device', () => {
    // Nobody signed in before: the local data is the guest's, and the guest is
    // the person signing up. Wiping it would lose their first week.
    seedAva()

    expect(prepareDeviceFor('newkid')).toBe(false)
    expect(localStorage.getItem('kids_spelling_points')).toBe('{"availablePoints":900}')
    expect(localStorage.getItem(LAST_USER_KEY)).toBe('newkid')
  })

  it('after a sign-out, a guest who then signs up also keeps their progress', () => {
    localStorage.setItem(LAST_USER_KEY, 'ava')
    clearUserData()
    forgetDeviceUser() // what logout does
    // a new guest plays…
    localStorage.setItem('kids_spelling_points', '{"availablePoints":40}')

    expect(prepareDeviceFor('sam')).toBe(false)
    expect(localStorage.getItem('kids_spelling_points')).toBe('{"availablePoints":40}')
  })
})
