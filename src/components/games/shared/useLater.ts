import { useCallback, useEffect, useRef } from 'react'

/**
 * `later(fn, ms)`: a setTimeout that dies with the game.
 *
 * A game that moves on, or calls `onComplete`, from a bare setTimeout keeps
 * going after the child has tapped "Back to Games" — it can pay for a game
 * nobody finished, or close the next one a second after it opened. Every delay
 * in a game should go through this.
 */
export const useLater = (): ((fn: () => void, ms: number) => void) => {
  const timers = useRef<number[]>([])
  useEffect(
    () => () => {
      timers.current.forEach((t) => window.clearTimeout(t))
      timers.current = []
    },
    []
  )
  return useCallback((fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms))
  }, [])
}

export default useLater
