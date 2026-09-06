import { describe, it, expect, vi, beforeEach } from 'vitest'

// vi.mock factories are hoisted above the file body, so anything they close
// over has to be hoisted with them.
const h = vi.hoisted(() => ({
  getDoc: vi.fn(),
  setDoc: vi.fn(),
  doc: vi.fn((_db: unknown, ...path: string[]) => ({ path: path.join('/') })),
  auth: { currentUser: null as any },
}))
const { getDoc, setDoc, auth } = h

vi.mock('firebase/firestore', () => ({
  doc: h.doc,
  getDoc: h.getDoc,
  setDoc: h.setDoc,
}))
vi.mock('firebase/auth', () => ({ signOut: vi.fn().mockResolvedValue(undefined) }))
vi.mock('@/config/firebase', () => ({ db: {}, auth: h.auth }))

import FirebaseSync from '@/services/persistence/FirebaseSync'

const snap = (data: any) => ({ exists: () => data !== undefined, data: () => data })

describe('a child gets a document before they have done anything', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    setDoc.mockResolvedValue(undefined)
    auth.currentUser = { uid: 'kid-1', email: 'maya@example.com', displayName: 'Maya', isAnonymous: false }
  })

  it('creates the document when the account has never synced', async () => {
    getDoc.mockResolvedValue(snap(undefined))

    await FirebaseSync.ensureUserDocument()

    expect(setDoc).toHaveBeenCalledTimes(1)
    const [, payload, opts] = setDoc.mock.calls[0]
    expect(payload.userData).toMatchObject({ id: 'kid-1', name: 'Maya', email: 'maya@example.com' })
    expect(payload.lastUpdated).toEqual(expect.any(String))
    expect(opts).toEqual({ merge: true })
  })

  it('takes the name from sign-up, before the display name exists', async () => {
    auth.currentUser.displayName = null
    getDoc.mockResolvedValue(snap(undefined))

    await FirebaseSync.ensureUserDocument('Noah')

    expect(setDoc.mock.calls[0][1].userData.name).toBe('Noah')
  })

  it('leaves an existing document alone', async () => {
    getDoc.mockResolvedValue(snap({ userData: { name: 'Maya' }, progress: {} }))

    await FirebaseSync.ensureUserDocument()

    expect(setDoc).not.toHaveBeenCalled()
  })

  it('never rebuilds a removed child', async () => {
    getDoc.mockResolvedValue(snap({ deleted: true, deletedAt: '2026-01-01' }))

    await FirebaseSync.ensureUserDocument('Maya')

    expect(setDoc).not.toHaveBeenCalled()
  })

  it('does nothing for a guest', async () => {
    auth.currentUser = null
    await FirebaseSync.ensureUserDocument()
    expect(getDoc).not.toHaveBeenCalled()
  })

  it('does not throw when the write is refused', async () => {
    getDoc.mockResolvedValue(snap(undefined))
    setDoc.mockRejectedValue(new Error('Missing or insufficient permissions.'))

    await expect(FirebaseSync.ensureUserDocument()).resolves.toBeUndefined()
  })
})
