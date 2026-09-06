import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const listUsers = vi.fn()
const setUserDailyGoal = vi.fn().mockResolvedValue(undefined)
const setUserLevels = vi.fn().mockResolvedValue(undefined)
const setUserStars = vi.fn().mockResolvedValue(undefined)
const resetToday = vi.fn().mockResolvedValue(undefined)
const setGamesUnlockedToday = vi.fn().mockResolvedValue(undefined)
const getAdminLog = vi.fn().mockResolvedValue([])
const exportUserData = vi.fn().mockResolvedValue({ uid: 'kid-1' })
const deleteUserAccount = vi.fn().mockResolvedValue(undefined)
const currentAdminUid = vi.fn().mockReturnValue('grown-up-1')

vi.mock('../../../../src/services/admin/AdminService', () => ({
  listUsers: (...a: any[]) => listUsers(...a),
  setUserDailyGoal: (...a: any[]) => setUserDailyGoal(...a),
  setUserLevels: (...a: any[]) => setUserLevels(...a),
  describeLevels: (levels: number[]) =>
    !levels.length || levels.length === 3
      ? 'all levels'
      : levels.map((l) => ({ 1: 'One Bee', 2: 'Two Bee', 3: 'Three Bee' }[l])).join(' + '),
  setUserStars: (...a: any[]) => setUserStars(...a),
  resetToday: (...a: any[]) => resetToday(...a),
  setGamesUnlockedToday: (...a: any[]) => setGamesUnlockedToday(...a),
  getAdminLog: (...a: any[]) => getAdminLog(...a),
  exportUserData: (...a: any[]) => exportUserData(...a),
  deleteUserAccount: (...a: any[]) => deleteUserAccount(...a),
  currentAdminUid: () => currentAdminUid(),
}))

import AdminUsers from '../../../../src/components/admin/AdminUsers'

const maya = {
  uid: 'kid-1',
  name: 'Maya',
  email: 'maya@example.com',
  avatar: '🦄',
  dailyGoal: 5,
  levels: [1 as const],
  isAdmin: false,
  stats: {
    wordsLearned: 42,
    wordsSpelled: 30,
    learnedToday: 5,
    spelledToday: 2,
    streak: 3,
    stars: 150,
    starsSpent: 50,
    gamesUnlockedToday: false,
    lastSeen: new Date().toISOString(),
  },
}

describe('the grown-up console', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    listUsers.mockResolvedValue([{ ...maya, stats: { ...maya.stats } }])
    currentAdminUid.mockReturnValue('grown-up-1')
  })

  it('shows how the child is doing before offering any controls', async () => {
    render(<AdminUsers />)
    expect(await screen.findByText('Maya')).toBeInTheDocument()
    expect(screen.getByText('42')).toBeInTheDocument() // words learnt
    expect(screen.getByText('🔥 3')).toBeInTheDocument() // streak
    expect(screen.getByText('2/5')).toBeInTheDocument() // today against the goal
    expect(screen.getByText(/Last played today/)).toBeInTheDocument()
  })

  it('drafts a daily-words change and only writes it on save', async () => {
    const user = userEvent.setup()
    render(<AdminUsers />)
    await screen.findByText('Maya')

    await user.click(screen.getByLabelText('More words for Maya'))
    expect(screen.getByText('6')).toBeInTheDocument()
    expect(setUserDailyGoal).not.toHaveBeenCalled() // nothing written yet
    expect(screen.getByText('1 unsaved change')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Save changes' }))
    await waitFor(() => expect(setUserDailyGoal).toHaveBeenCalledWith('kid-1', 6))
  })

  it('records why a star balance changed', async () => {
    const user = userEvent.setup()
    render(<AdminUsers />)
    await screen.findByText('Maya')

    const stars = screen.getByLabelText('Star balance for Maya')
    await user.clear(stars)
    await user.type(stars, '200')
    await user.click(screen.getByRole('button', { name: 'Save changes' }))

    await waitFor(() => expect(setUserStars).toHaveBeenCalled())
    const [uid, value, spent, reason] = setUserStars.mock.calls[0]
    expect(uid).toBe('kid-1')
    expect(value).toBe(200)
    expect(spent).toBe(50)
    expect(reason).toMatch(/added 50 — balance now 200/)
  })

  it('opens games for today straight away, without a save', async () => {
    const user = userEvent.setup()
    render(<AdminUsers />)
    await screen.findByText('Maya')

    await user.click(screen.getByRole('button', { name: /Open games today/ }))
    await waitFor(() => expect(setGamesUnlockedToday).toHaveBeenCalledWith('kid-1', true))
    expect(await screen.findByRole('button', { name: /Games open today/ })).toBeInTheDocument()
  })

  it('asks twice before restarting a child’s day', async () => {
    const user = userEvent.setup()
    render(<AdminUsers />)
    await screen.findByText('Maya')

    await user.click(screen.getByRole('button', { name: /Start today again/ }))
    expect(resetToday).not.toHaveBeenCalled() // first tap only arms it

    await user.click(screen.getByRole('button', { name: /tap to confirm/ }))
    await waitFor(() => expect(resetToday).toHaveBeenCalledWith('kid-1'))
  })

  it('says so plainly when there are no children yet', async () => {
    listUsers.mockResolvedValue([])
    render(<AdminUsers />)
    expect(await screen.findByText(/No children yet/)).toBeInTheDocument()
  })

  it('surfaces a permission error instead of hanging', async () => {
    listUsers.mockRejectedValue(new Error('Missing or insufficient permissions.'))
    render(<AdminUsers />)
    expect(await screen.findByText(/insufficient permissions/)).toBeInTheDocument()
  })

  it('will not remove a child until their name is typed', async () => {
    const user = userEvent.setup()
    render(<AdminUsers />)
    await screen.findByText('Maya')

    await user.click(screen.getByRole('button', { name: /Remove Maya…/ }))

    const go = screen.getByRole('button', { name: /Remove Maya for good/ })
    expect(go).toBeDisabled()

    await user.type(screen.getByLabelText('Type Maya to confirm removal'), 'Maya')
    expect(go).toBeEnabled()

    await user.click(go)
    await waitFor(() => expect(deleteUserAccount).toHaveBeenCalledWith('kid-1'))

    // The row goes; the list is what is left.
    await waitFor(() => expect(screen.queryByText('Maya')).not.toBeInTheDocument())
  })

  it('accepts the name whatever the capitals, and says so when it is wrong', async () => {
    const user = userEvent.setup()
    render(<AdminUsers />)
    await screen.findByText('Maya')

    await user.click(screen.getByRole('button', { name: /Remove Maya…/ }))
    const box = screen.getByLabelText('Type Maya to confirm removal')
    const go = screen.getByRole('button', { name: /Remove Maya for good/ })

    // A different name is still refused, and explains itself rather than
    // leaving a dead button.
    await user.type(box, 'Noah')
    expect(go).toBeDisabled()
    expect(screen.getByText(/That doesn't match/)).toBeInTheDocument()

    // Capitals and stray spaces are not the point of the confirmation.
    await user.clear(box)
    await user.type(box, '  maya ')
    expect(go).toBeEnabled()
    expect(screen.queryByText(/That doesn't match/)).not.toBeInTheDocument()
  })

  it('offers a copy of the data before it goes', async () => {
    const user = userEvent.setup()
    render(<AdminUsers />)
    await screen.findByText('Maya')

    await user.click(screen.getByRole('button', { name: /Remove Maya…/ }))
    await user.click(screen.getByRole('button', { name: /Download a copy first/ }))

    await waitFor(() => expect(exportUserData).toHaveBeenCalledWith('kid-1'))
  })

  it('says the removal is permanent, in the panel itself', async () => {
    const user = userEvent.setup()
    render(<AdminUsers />)
    await screen.findByText('Maya')

    await user.click(screen.getByRole('button', { name: /Remove Maya…/ }))
    expect(screen.getByText(/cannot be undone/)).toBeInTheDocument()
    expect(screen.getByText(/signs them out on every device/)).toBeInTheDocument()
  })

  it('will not let a grown-up remove their own account', async () => {
    currentAdminUid.mockReturnValue('kid-1') // signed in as the listed account
    render(<AdminUsers />)
    await screen.findByText('Maya')

    expect(screen.getByRole('button', { name: /Remove Maya…/ })).toBeDisabled()
  })
})
