export interface LearningPreferences {
  stage: 'early' | 'growing' | 'confident'
  calm: boolean
  relaxed: boolean
  waitForMe: boolean
  readPrompts: boolean
  narrationRate: number
  effectsEnabled: boolean
  readingAge: number
  readingGrade: string
}

const KEY = 'learning_preferences'
export const PREFERENCES_EVENT = 'learningPreferencesUpdated'
export const DEFAULT_PREFERENCES: LearningPreferences = {
  stage: 'growing', calm: false, relaxed: true, waitForMe: true,
  readPrompts: false, narrationRate: 0.8, effectsEnabled: true,
  readingAge: 5, readingGrade: 'K',
}
let lastRaw: string | null | undefined
let cached = DEFAULT_PREFERENCES
export function getPreferences(): LearningPreferences {
  let raw: string | null = null
  try { raw = localStorage.getItem(KEY) } catch { /* use defaults */ }
  if (raw !== lastRaw) {
    lastRaw = raw
    try {
      const value = raw ? JSON.parse(raw) : {}
      cached = { ...DEFAULT_PREFERENCES, effectsEnabled: localStorage.getItem('audioEnabled') !== 'false', ...value }
      if (!['early', 'growing', 'confident'].includes(cached.stage)) cached.stage = 'growing'
      cached.narrationRate = Math.max(0.5, Math.min(1.2, Number(cached.narrationRate) || 0.8))
    } catch { cached = DEFAULT_PREFERENCES }
  }
  return cached
}
export function setPreferences(changes: Partial<LearningPreferences>) {
  const next = { ...getPreferences(), ...changes }
  try { localStorage.setItem(KEY, JSON.stringify(next)) } catch { /* keep this session usable */ }
  cached = next
  window.dispatchEvent(new Event(PREFERENCES_EVENT))
}
