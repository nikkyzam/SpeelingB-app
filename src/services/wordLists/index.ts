/**
 * Private word lists — word lists we may use with our own children but must
 * not publish, like the Scripps 2026–27 School Spelling Bee Study List ("This
 * is copyrighted material. Do not post to Web.").
 *
 * So the words are not in this public repo or the site's code. They live in
 * Firestore at wordLists/{id}, readable only by signed-in users (see
 * firestore.rules), and are uploaded by scripts/upload-word-list.mjs from the
 * gitignored private/ folder. After sign-in the list is cached on the device
 * so saved word ids resolve straight away on the next visit; signing out
 * clears the cache (SIGNED_IN_CACHE_KEYS).
 */
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../config/firebase'
import { wordBank, type Word } from '../wordBank'

export const SCHOOL_2026 = 'school-2026'

/** Device cache of downloaded lists. Not the child's data: never synced, cleared on sign-out. */
export const PRIVATE_LISTS_KEY = 'private_word_lists'
/** Fired when a list arrives, so open screens can offer it. */
export const WORD_LISTS_EVENT = 'wordListsUpdated'

/** The lists the app knows how to offer. */
export const PRIVATE_LISTS = [{ id: SCHOOL_2026, title: '2026 School Bee', icon: '🏫' }] as const

export interface PrivateListEntry {
  /** Its number on the official list; ids are built from it so they never move. */
  n: number
  word: string
  meaning: string
  sentence: string
  vocabulary_question: string
  level: 1 | 2 | 3
}

export interface PrivateList {
  id: string
  title: string
  /** Bumped by the upload script whenever the content changes. */
  version: number
  words: PrivateListEntry[]
}

const firstSentence = (s: string) => (s.match(/^.*?[.!?](\s|$)/)?.[0] ?? s).trim()

/** A list's entries as word-bank words. Ids are `${listId}-${n}`, stable across uploads. */
export const listToWords = (list: PrivateList): Word[] =>
  [...list.words]
    .sort((a, b) => a.n - b.n)
    .map((e) => ({
      id: `${list.id}-${e.n}`,
      word: e.word,
      meaning: e.meaning,
      sentence: e.sentence,
      sentences: [e.sentence],
      vocabulary_question: e.vocabulary_question,
      difficulty: e.level,
      category: 'general',
      hint: firstSentence(e.meaning),
      phonetic: `/${e.word}/`,
      synonyms: [],
      source: list.id,
      list: list.id,
    }))

const readCache = (): Record<string, PrivateList> => {
  try {
    const raw = localStorage.getItem(PRIVATE_LISTS_KEY)
    return raw ? (JSON.parse(raw) as Record<string, PrivateList>) : {}
  } catch {
    return {}
  }
}

const writeCache = (lists: Record<string, PrivateList>) => {
  try {
    localStorage.setItem(PRIVATE_LISTS_KEY, JSON.stringify(lists))
  } catch {
    // storage full or blocked — the list is fetched again next sign-in
  }
}

/**
 * Put cached lists into the word bank. Runs before the app renders
 * (src/index.tsx), so a page that resolves saved ids finds these words.
 */
export const registerCachedLists = (): void => {
  for (const list of Object.values(readCache())) {
    if (list?.id && Array.isArray(list.words)) wordBank.registerWords(listToWords(list))
  }
}

/**
 * Download the lists for a signed-in user. A new list is added at once; a
 * changed one (new version) reloads the page, because the bank keeps the
 * first copy of each word and screens hold words in memory.
 */
export const refreshPrivateLists = async (): Promise<void> => {
  const cache = readCache()
  let added = false
  let changed = false
  for (const { id } of PRIVATE_LISTS) {
    try {
      const snap = await getDoc(doc(db, 'wordLists', id))
      if (!snap.exists()) continue
      const list = snap.data() as PrivateList
      if (!Array.isArray(list.words)) continue
      const had = cache[id]
      if (had && had.version === list.version) continue
      cache[id] = { ...list, id }
      if (had) changed = true
      else {
        wordBank.registerWords(listToWords(cache[id]))
        added = true
      }
    } catch (e) {
      // Offline or not allowed: keep whatever is cached.
      console.error(`Could not load the ${id} word list:`, e)
    }
  }
  if (!added && !changed) return
  writeCache(cache)
  if (changed) window.location.reload()
  else window.dispatchEvent(new Event(WORD_LISTS_EVENT))
}
