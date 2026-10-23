import { useSyncExternalStore } from 'react'
import { getPreferences, PREFERENCES_EVENT, setPreferences } from '../services/preferences'

const subscribe = (listener: () => void) => {
  window.addEventListener(PREFERENCES_EVENT, listener)
  window.addEventListener('storage', listener)
  return () => {
    window.removeEventListener(PREFERENCES_EVENT, listener)
    window.removeEventListener('storage', listener)
  }
}
export function usePreferences() {
  return [useSyncExternalStore(subscribe, getPreferences, getPreferences), setPreferences] as const
}
