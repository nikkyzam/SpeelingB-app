import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import ReviewSchedule, { localDay } from '@/services/progress/ReviewSchedule'

describe('the review schedule runs on the child’s own clock', () => {
  const originalTZ = process.env.TZ

  beforeEach(() => {
    localStorage.clear()
    // Four or five hours behind UTC — the case the UTC dates got wrong.
    process.env.TZ = 'America/New_York'
    vi.useFakeTimers({ toFake: ['Date'] })
  })
  afterEach(() => {
    vi.useRealTimers()
    process.env.TZ = originalTZ
  })

  it('names days by the local calendar', () => {
    // 9pm on the 28th in New York is already the 29th in UTC.
    expect(localDay(new Date('2026-09-29T01:00:00Z'))).toBe('2026-09-28')
  })

  it('does not bring tomorrow’s words due in the evening', () => {
    // Missed at 7:30pm: it waits until tomorrow.
    vi.setSystemTime(new Date('2026-09-28T23:30:00Z'))
    ReviewSchedule.record('word', false)
    expect(ReviewSchedule.get('word')?.due).toBe('2026-09-29')

    // 9pm the same evening. On UTC dates it was already due, and the games
    // a child had just opened locked themselves again.
    vi.setSystemTime(new Date('2026-09-29T01:00:00Z'))
    expect(ReviewSchedule.dueCount()).toBe(0)

    // The next morning it is.
    vi.setSystemTime(new Date('2026-09-29T12:00:00Z'))
    expect(ReviewSchedule.dueCount()).toBe(1)
  })

  it('moves a word up a box on a right answer and back to the start on a wrong one', () => {
    vi.setSystemTime(new Date('2026-09-28T15:00:00Z'))
    ReviewSchedule.record('word', true)
    ReviewSchedule.record('word', true)
    expect(ReviewSchedule.get('word')).toMatchObject({ box: 3, due: '2026-10-02', right: 2 })
    ReviewSchedule.record('word', false)
    expect(ReviewSchedule.get('word')).toMatchObject({ box: 1, due: '2026-09-29', wrong: 1 })
  })
})
