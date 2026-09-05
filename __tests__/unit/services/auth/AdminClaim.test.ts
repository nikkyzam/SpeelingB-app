import { describe, it, expect, beforeEach } from 'vitest'
import { withoutAdminClaim, withAdminClaimDenied } from '../../../../src/services/auth/adminClaim'
import { useUserStore } from '../../../../src/stores/userStore'

const child = {
  id: 'kid-1',
  name: 'Maya',
  age: 7,
  avatar: '🦄',
  dailyGoal: 5,
  isGuest: false,
}

describe('the admin claim never becomes stored data', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('strips the claim from anything about to be written down', () => {
    const stored = withoutAdminClaim({ ...child, isAdmin: true })
    expect('isAdmin' in stored).toBe(false)
    expect(stored.name).toBe('Maya')
  })

  it('refuses a claim arriving from storage or the server', () => {
    expect(withAdminClaimDenied({ ...child, isAdmin: true }).isAdmin).toBe(false)
  })

  it('leaves null users alone', () => {
    expect(withoutAdminClaim(null)).toBeNull()
    expect(withAdminClaimDenied(undefined)).toBeUndefined()
  })

  it('does not persist isAdmin when an admin is signed in', () => {
    useUserStore.getState().setUser({ ...child, isAdmin: true } as any)

    // In memory the claim is live — that is what gates the grown-up tools.
    expect(useUserStore.getState().user?.isAdmin).toBe(true)

    // On disk it is absent, so editing localStorage cannot grant it.
    const saved = JSON.parse(localStorage.getItem('user-storage') || '{}')
    expect('isAdmin' in (saved.state?.user || {})).toBe(false)
  })

  it('ignores a forged isAdmin planted in localStorage', () => {
    localStorage.setItem(
      'user-storage',
      JSON.stringify({ state: { user: { ...child, isAdmin: true } }, version: 0 })
    )

    // Rehydrating is what a page reload does after the flag was forged.
    useUserStore.persist.rehydrate()

    expect(useUserStore.getState().user?.isAdmin).toBe(false)
  })
})
