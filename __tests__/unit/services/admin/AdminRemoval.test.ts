import { describe, it, expect, vi, beforeEach } from 'vitest'

// vi.mock factories are hoisted above the file body, so what they close over
// has to be hoisted with them.
const h = vi.hoisted(() => ({
  setDoc: vi.fn(),
  getDoc: vi.fn(),
  updateDoc: vi.fn(),
  doc: vi.fn((_db: unknown, ...path: string[]) => ({ path: path.join('/') })),
  deleteField: vi.fn(() => '<<deleted>>'),
  arrayUnion: vi.fn((v: unknown) => v),
  auth: { currentUser: { uid: 'grown-up-1', email: 'dad@example.com' } as any },
}))

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  getDocs: vi.fn(),
  doc: h.doc,
  getDoc: h.getDoc,
  setDoc: h.setDoc,
  updateDoc: h.updateDoc,
  deleteField: h.deleteField,
  arrayUnion: h.arrayUnion,
}))
vi.mock('@/config/firebase', () => ({ db: {}, auth: h.auth }))

import { deleteUserAccount } from '@/services/admin/AdminService'
import { BUNDLED_SYNC_KEYS } from '@/services/persistence/userKeys'

describe('removing a child', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    h.setDoc.mockResolvedValue(undefined)
    h.auth.currentUser = { uid: 'grown-up-1', email: 'dad@example.com' }
  })

  const tombstone = () => h.setDoc.mock.calls[0][1] as Record<string, unknown>

  it('erases every field the sync ever wrote, not just some of them', async () => {
    await deleteUserAccount('kid-1')

    // These are exactly the fields FirebaseSync.syncToServer writes. Leaving
    // any of them behind keeps a removed child's data in the database, where
    // the console can no longer show it and nobody can export it — while the
    // removal panel promises it is all gone.
    for (const field of ['progress', 'userData', 'rewards', 'points', 'adminLog', 'local']) {
      expect(tombstone()[field], `${field} survived the removal`).toBe('<<deleted>>')
    }
  })

  it('keeps the record that it happened, and who did it', async () => {
    await deleteUserAccount('kid-1')
    expect(tombstone()).toMatchObject({ deleted: true, deletedBy: 'dad@example.com' })
    expect(typeof tombstone().deletedAt).toBe('string')
    // A merge, not a replace: a child who never synced has no document to
    // update, and those are the accounts most likely to be removed.
    expect(h.setDoc.mock.calls[0][2]).toEqual({ merge: true })
  })

  it('will not let a grown-up remove the account they are signed in as', async () => {
    h.auth.currentUser = { uid: 'kid-1', email: 'kid@example.com' }
    await expect(deleteUserAccount('kid-1')).rejects.toThrow(/cannot remove your own/i)
    expect(h.setDoc).not.toHaveBeenCalled()
  })

  it('leaves nothing of the bundle behind, whatever is added to it later', async () => {
    await deleteUserAccount('kid-1')
    // The bundle is one field holding every per-child key, so deleting it
    // covers keys added to the registry in future. This asserts the shape the
    // guarantee rests on, so splitting `local` up later fails here first.
    expect(BUNDLED_SYNC_KEYS.length).toBeGreaterThan(0)
    expect(tombstone().local).toBe('<<deleted>>')
  })
})
