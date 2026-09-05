import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const listUsers = vi.fn()
const setUserDailyGoal = vi.fn().mockResolvedValue(undefined)
const setUserLevel = vi.fn().mockResolvedValue(undefined)
const setUserStars = vi.fn().mockResolvedValue(undefined)
const resetToday = vi.fn().mockResolvedValue(undefined)
const setGamesUnlockedToday = vi.fn().mockResolvedValue(undefined)
const getAdminLog = vi.fn().mockResolvedValue([])

vi.mock('../../../../src/services/admin/AdminService', () => ({
  listUsers: (...a: any[]) => listUsers(...a),
  setUserDailyGoal: (...a: any[]) => setUserDailyGoal(...a),
  setUserLevel: (...a: any[]) => setUserLevel(...a),
  setUserStars: (...a: any[]) => setUserStars(...a),
  resetToday: (...a: any[]) => resetToday(...a),
  setGamesUnlockedToday: (...a: any[]) => setGamesUnlockedToday(...a),
  getAdminLog: (...a: any[]) => getAdminLog(...a),
}))

import AdminUsers from '../../../../src/components/admin/AdminUsers'

const maya = {
  uid: 'kid-1',
  name: 'Maya',
  email: 'maya@example.com',
  avatar: '🦄',
  dailyGoal: 5,
  level: 1 as const,
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
})
