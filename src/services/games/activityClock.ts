/** Game timers retain their remaining time during a pause or hidden tab. */
export function createActivityClock() {
  type Timer = { callback: () => void; remaining: number; due: number; native?: number; interval?: number }
  const timers = new Map<number, Timer>()
  let next = 0, pausedAt: number | null = null, timePaused = 0
  const arm = (id: number, timer: Timer) => {
    timer.due = Date.now() + timer.remaining
    timer.native = window.setTimeout(() => {
      if (!timers.has(id)) return
      if (timer.interval === undefined) timers.delete(id)
      timer.callback()
      if (timer.interval !== undefined && timers.has(id)) {
        timer.remaining = timer.interval
        if (pausedAt === null) arm(id, timer)
      }
    }, timer.remaining)
  }
  const add = (callback: () => void, ms = 0, interval?: number) => {
    const id = ++next, timer: Timer = { callback, remaining: Math.max(0, ms), due: 0, interval }
    timers.set(id, timer)
    if (pausedAt === null) arm(id, timer)
    return id
  }
  const clear = (id: number | undefined) => {
    if (id === undefined) return
    const timer = timers.get(id)
    if (timer) window.clearTimeout(timer.native)
    timers.delete(id)
  }
  return {
    setTimeout: (callback: () => void, ms = 0) => add(callback, ms),
    setInterval: (callback: () => void, ms = 0) => add(callback, ms, Math.max(1, ms)),
    clearTimeout: clear,
    clearInterval: clear,
    now: () => (pausedAt ?? Date.now()) - timePaused,
    setPaused(paused: boolean) {
      if (paused === (pausedAt !== null)) return
      if (paused) {
        pausedAt = Date.now()
        for (const timer of timers.values()) {
          window.clearTimeout(timer.native)
          timer.remaining = Math.max(0, timer.due - pausedAt)
        }
      } else {
        timePaused += Date.now() - pausedAt!
        pausedAt = null
        for (const [id, timer] of timers) arm(id, timer)
      }
    },
  }
}
export const activityClock = createActivityClock()
