import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('@/config/firebase', () => ({ db: {}, auth: {} }))
const fs = vi.hoisted(() => ({ getDoc: vi.fn() }))
vi.mock('firebase/firestore', () => ({ doc: vi.fn(), getDoc: fs.getDoc }))

import { wordBank } from '@/services/wordBank'
import {
  listToWords,
  registerCachedLists,
  refreshPrivateLists,
  getListStatus,
  PRIVATE_LISTS_KEY,
  type PrivateList,
} from '@/services/wordLists'
import { clearUserData } from '@/services/persistence/userKeys'

// Made-up words: the real list never appears in this public repo.
const list: PrivateList = {
  id: 'test-list',
  title: 'Test List',
  version: 1,
  words: [
    { n: 2, word: 'zebrafy', meaning: 'To paint with stripes.', sentence: 'We will zebrafy the fence.', vocabulary_question: 'Does ███████ mean to stripe or to shout?', level: 1 },
    { n: 1, word: 'glimmerous', meaning: 'Shining softly. Like a candle.', sentence: 'The lake looked glimmerous.', vocabulary_question: 'Is ██████████ shiny or dull?', level: 2 },
  ],
}

describe('private word lists', () => {
  beforeEach(() => localStorage.clear())

  it('turns entries into words with stable ids in list order', () => {
    const words = listToWords(list)
    expect(words.map((w) => w.id)).toEqual(['test-list-1', 'test-list-2'])
    expect(words[0]).toMatchObject({ word: 'glimmerous', difficulty: 2, list: 'test-list', hint: 'Shining softly.' })
  })

  it('registers a cached list so its saved ids resolve, without joining the Bee levels', () => {
    const levelCounts = wordBank.availableLevels()
    localStorage.setItem(PRIVATE_LISTS_KEY, JSON.stringify({ 'test-list': list }))
    registerCachedLists()
    expect(wordBank.hasList('test-list')).toBe(true)
    expect(wordBank.getWordById('test-list-2')?.word).toBe('zebrafy')
    expect(wordBank.getWordsForList('test-list').map((w) => w.word)).toEqual(['glimmerous', 'zebrafy'])
    // The levels and their counts are untouched
    expect(wordBank.availableLevels()).toEqual(levelCounts)
    expect(wordBank.getWordsByDifficulty(1).some((w) => w.list)).toBe(false)
  })

  it('learns from the list when chosen, and from the levels when it is not here', () => {
    expect(wordBank.getLearningList([1], 'test-list').map((w) => w.id)).toEqual(['test-list-1', 'test-list-2'])
    expect(wordBank.getLearningList([1], 'not-downloaded')).toEqual(wordBank.getWordsForLevels([1]))
    expect(wordBank.getLearningList([1], null)).toEqual(wordBank.getWordsForLevels([1]))
  })

  it('signing out clears the downloaded list from the device', () => {
    localStorage.setItem(PRIVATE_LISTS_KEY, '{}')
    clearUserData()
    expect(localStorage.getItem(PRIVATE_LISTS_KEY)).toBeNull()
  })
})

describe('downloading a private list says how it went', () => {
  beforeEach(() => localStorage.clear())

  it('reports an error instead of failing silently', async () => {
    fs.getDoc.mockRejectedValueOnce(new Error('Missing or insufficient permissions.'))
    await refreshPrivateLists()
    expect(getListStatus()).toEqual({ state: 'error', message: 'Missing or insufficient permissions.' })
  })

  it('reports when the list has not been uploaded', async () => {
    fs.getDoc.mockResolvedValueOnce({ exists: () => false })
    await refreshPrivateLists()
    expect(getListStatus()).toEqual({ state: 'missing' })
  })

  it('a first download adds the list to the bank and caches it', async () => {
    const fresh = { ...list, id: 'school-2026', words: [{ ...list.words[0], n: 7 }] }
    fs.getDoc.mockResolvedValueOnce({ exists: () => true, data: () => fresh })
    await refreshPrivateLists()
    expect(getListStatus()).toEqual({ state: 'ready' })
    expect(wordBank.getWordById('school-2026-7')?.word).toBe('zebrafy')
    expect(JSON.parse(localStorage.getItem(PRIVATE_LISTS_KEY)!)['school-2026'].version).toBe(1)
  })
})
