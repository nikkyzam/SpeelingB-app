import { beforeEach, expect, it } from 'vitest'
import { getPreferences, setPreferences } from '@/services/preferences'
import { wordBank } from '@/services/wordBank'
import { EARLY_READER_WORDS } from '@/services/words/earlyReader'

beforeEach(() => localStorage.clear())

it('uses short, concrete, illustrated words for early readers without replacing the regular bank', () => {
  const regular = wordBank.getLearningList([1])
  setPreferences({ stage: 'early' })
  const early = wordBank.getLearningList([1])
  expect(early.length).toBeGreaterThanOrEqual(10)
  expect(early.length).toBeLessThan(regular.length)
  expect(early.every(word => !!EARLY_READER_WORDS[word.word.toLowerCase()] && !!word.picture)).toBe(true)
  expect(early.find(word => word.word === 'tag')?.sentence).toBe('We play tag at the park.')
  setPreferences({ stage: 'confident' })
  expect(wordBank.getLearningList([1]).map(word => word.id)).toEqual(regular.map(word => word.id))
})

it('defaults to relaxed, manual learning and preserves a device’s old sound-off choice', () => {
  localStorage.setItem('audioEnabled', 'false')
  localStorage.removeItem('learning_preferences')
  expect(getPreferences().waitForMe).toBe(true)
  expect(getPreferences().relaxed).toBe(true)
  expect(getPreferences().effectsEnabled).toBe(false)
  setPreferences({ effectsEnabled: false })
  expect(getPreferences().effectsEnabled).toBe(false)
})
