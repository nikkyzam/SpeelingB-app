import { describe, it, expect, vi, beforeEach } from 'vitest'

// vi.mock factories are hoisted, so their dependencies are hoisted with them.
const h = vi.hoisted(() => ({
  getDoc: vi.fn(),
  setDoc: vi.fn(),
  doc: vi.fn((_db: unknown, ...path: string[]) => ({ path: path.join('/') })),
  auth: { currentUser: null as any },
  reload: vi.fn(),
}))
const { getDoc, setDoc, auth, reload } = h

vi.mock('firebase/firestore', () => ({
  doc: h.doc, getDoc: h.getDoc, setDoc: h.setDoc,
  runTransaction: vi.fn(async (_db, callback) => callback({ get: h.getDoc, set: h.setDoc })),
}))
vi.mock('firebase/auth', () => ({ signOut: vi.fn().mockResolvedValue(undefined) }))
vi.mock('@/config/firebase', () => ({ db: {}, auth: h.auth }))

import FirebaseSync from '@/services/persistence/FirebaseSync'
import { LAST_USER_KEY } from '@/services/persistence/userKeys'

const snap = (data: any) => ({ exists: () => data !== undefined, data: () => data })
const kid = (uid: string) => ({ uid, email: `${uid}@example.com`, displayName: uid, isAnonymous: false })

describe('the buddy follows the child, not the tablet', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    sessionStorage.clear()
    setDoc.mockResolvedValue(undefined)
    FirebaseSync.resetHydration()
    // jsdom's reload is not implemented; the sync reloads after applying data.
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { ...window.location, reload, href: '/' },
    })
  })

  it('uploads the buddy alongside progress', async () => {
    auth.currentUser = kid('ava')
    getDoc.mockResolvedValue(snap(undefined))
    await FirebaseSync.syncFromServer() // hydrates, so uploads are allowed
    setDoc.mockClear()

    localStorage.setItem('buddy_state', JSON.stringify({ name: 'Sprinkles', snacks: 3 }))
    localStorage.setItem('kids_spelling_badges', '["first-word"]')
    localStorage.setItem('audioEnabled', 'false') // the tablet's — must not travel

    await FirebaseSync.syncToServer()

    expect(setDoc).toHaveBeenCalledTimes(1)
    const payload = setDoc.mock.calls[0][1]
    expect(JSON.parse(payload.local.buddy_state).name).toBe('Sprinkles')
    expect(payload.local.kids_spelling_badges).toBe('["first-word"]')
    expect(payload.local.audioEnabled).toBeUndefined()
  })

  it('brings the buddy down onto a new device', async () => {
    auth.currentUser = kid('ava')
    getDoc.mockResolvedValue(
      snap({
        progress: { dailyGoal: 5 },
        local: { buddy_state: JSON.stringify({ name: 'Sprinkles' }), world: 'unicorn' },
      })
    )

    await FirebaseSync.syncFromServer()

    expect(JSON.parse(localStorage.getItem('buddy_state')!).name).toBe('Sprinkles')
    expect(localStorage.getItem('world')).toBe('unicorn')
    expect(reload).toHaveBeenCalled()
  })

  it('does not erase local keys the server has never seen', async () => {
    auth.currentUser = kid('ava')
    localStorage.setItem(LAST_USER_KEY, 'ava')
    // Ava opened today's mystery box on this device; the server is behind.
    localStorage.setItem('mystery_box_state', '{"lastOpened":"2026-09-06","totalOpened":4}')
    getDoc.mockResolvedValue(snap({ local: { buddy_state: '{"name":"Sprinkles"}' } }))

    await FirebaseSync.syncFromServer()

    expect(localStorage.getItem('mystery_box_state')).toBe('{"lastOpened":"2026-09-06","totalOpened":4}')
  })

  it("wipes the previous child's buddy before the next child's data arrives", async () => {
    // Ava used this tablet last and never signed out.
    localStorage.setItem(LAST_USER_KEY, 'ava')
    localStorage.setItem('buddy_state', JSON.stringify({ name: "Ava's buddy" }))
    localStorage.setItem('kids_spelling_points', '{"availablePoints":900}')

    // Sam signs in. His account has nothing yet.
    auth.currentUser = kid('sam')
    getDoc.mockResolvedValue(snap(undefined))

    await FirebaseSync.syncFromServer()

    expect(localStorage.getItem('buddy_state')).toBeNull()
    expect(localStorage.getItem('kids_spelling_points')).toBeNull()
    expect(localStorage.getItem(LAST_USER_KEY)).toBe('sam')
  })

  it("and never uploads Ava's buddy under Sam's name", async () => {
    localStorage.setItem(LAST_USER_KEY, 'ava')
    localStorage.setItem('buddy_state', JSON.stringify({ name: "Ava's buddy" }))
    auth.currentUser = kid('sam')
    getDoc.mockResolvedValue(snap(undefined))
    await FirebaseSync.syncFromServer()
    setDoc.mockClear()

    await FirebaseSync.syncToServer()

    const calls = setDoc.mock.calls
    const payload = calls.length ? calls[calls.length - 1][1] : undefined
    expect(payload?.local?.buddy_state).toBeUndefined()
  })

  it('a buddy change schedules an upload on its own', async () => {
    vi.useFakeTimers()
    try {
      auth.currentUser = kid('ava')
      getDoc.mockResolvedValue(snap(undefined))
      await FirebaseSync.syncFromServer()
      setDoc.mockClear()

      localStorage.setItem('buddy_state', '{"name":"Pip"}')
      window.dispatchEvent(new Event('buddyUpdated'))
      window.dispatchEvent(new Event('buddyUpdated'))
      window.dispatchEvent(new Event('buddyUpdated'))
      expect(setDoc).not.toHaveBeenCalled() // coalesced, not immediate

      await vi.advanceTimersByTimeAsync(2000)

      expect(setDoc).toHaveBeenCalledTimes(1) // three taps, one write
      expect(setDoc.mock.calls[0][1].local.buddy_state).toBe('{"name":"Pip"}')
    } finally {
      vi.useRealTimers()
    }
  })
})


describe('concurrent server changes', () => {
  beforeEach(() => {
    vi.clearAllMocks(); localStorage.clear(); sessionStorage.clear(); FirebaseSync.resetHydration()
    auth.currentUser = kid('ava')
    setDoc.mockResolvedValue(undefined)
    Object.defineProperty(window, 'location', { configurable: true, value: { reload, href: '/' } })
  })

  it('checks deletion on every upload and never writes a removed document', async () => {
    getDoc.mockResolvedValue(snap({}))
    await FirebaseSync.syncFromServer()
    localStorage.setItem('learningProgress', '{"wordsLearnedTotal":["cat"]}')
    getDoc.mockResolvedValue(snap({ deleted: true }))
    await FirebaseSync.syncToServer()
    expect(setDoc).not.toHaveBeenCalled()
    expect(localStorage.getItem('learningProgress')).toBeNull()
    expect(window.location.href).toBe('/')
  })

  it('preserves an admin balance correction and merges words from both devices', async () => {
    getDoc.mockResolvedValue(snap({ progress: { wordsLearnedTotal: ['cat'], dailyGoal: 5 }, points: { availablePoints: 100 } }))
    await FirebaseSync.syncFromServer()
    localStorage.setItem('learningProgress', JSON.stringify({ wordsLearnedTotal: ['cat', 'dog'], dailyGoal: 5 }))
    localStorage.setItem('kids_spelling_points', '{"availablePoints":110}')
    getDoc.mockResolvedValue(snap({ progress: { wordsLearnedTotal: ['cat', 'bee'], dailyGoal: 12 }, points: { availablePoints: 10 } }))
    await FirebaseSync.syncToServer()
    const data = setDoc.mock.calls[0][1]
    expect(data.points.availablePoints).toBe(10)
    expect(data.progress.dailyGoal).toBe(12)
    expect(data.progress.wordsLearnedTotal).toEqual(['cat', 'bee', 'dog'])
    expect(JSON.parse(localStorage.getItem('learningProgress')!).dailyGoal).toBe(12)
  })

  it('reads fresh data after a refresh without entering a reload loop', async () => {
    getDoc.mockResolvedValue(snap({ points: { availablePoints: 100 } }))
    await FirebaseSync.syncFromServer()
    reload.mockClear()
    await FirebaseSync.syncFromServer()
    expect(reload).not.toHaveBeenCalled()
    getDoc.mockResolvedValue(snap({ points: { availablePoints: 10 } }))
    await FirebaseSync.syncFromServer()
    expect(getDoc).toHaveBeenCalledTimes(3)
    expect(JSON.parse(localStorage.getItem('kids_spelling_points')!).availablePoints).toBe(10)
    expect(reload).toHaveBeenCalledTimes(1)
  })

  it('retains a word learned while an upload is in flight', async () => {
    getDoc.mockResolvedValue(snap({ progress: { wordsLearnedTotal: ['cat'] } }))
    await FirebaseSync.syncFromServer()
    localStorage.setItem('learningProgress', '{"wordsLearnedTotal":["cat","dog"]}')
    getDoc.mockImplementationOnce(async () => {
      localStorage.setItem('learningProgress', '{"wordsLearnedTotal":["cat","dog","owl"]}')
      return snap({ progress: { wordsLearnedTotal: ['cat', 'bee'] } })
    })
    await FirebaseSync.syncToServer()
    expect(JSON.parse(localStorage.getItem('learningProgress')!).wordsLearnedTotal).toEqual(['cat', 'bee', 'dog', 'owl'])
  })
})
