// Bible API Service for fetching real Bible data
import axios from 'axios'

// Supported Bible versions
export type BibleVersion = 'KJV' | 'NIV' | 'ESV' | 'NASB' | 'NKJV' | 'NLT'

// Bible API Configuration
const BIBLE_API_CONFIG = {
  BASE_URL: 'https://bible-api.com',
  VERSIONS: {
    KJV: 'kjv',
    NIV: 'niv',
    ESV: 'esv',
    NASB: 'nasb',
    NKJV: 'nkjv',
    NLT: 'nlt'
  }
} as const

// API Endpoints
export const API_ENDPOINTS = {
  VERSES: `${BIBLE_API_CONFIG.BASE_URL}`,
  SEARCH: `${BIBLE_API_CONFIG.BASE_URL}/search`
} as const

// Bible Book Information
export interface BibleBook {
  id: string
  name: string
  testament: 'old' | 'new'
  chapters: number
}

export interface BibleVerse {
  reference: string
  text: string
  verses: Array<{
    book_id: string
    book_name: string
    chapter: number
    verse: number
    text: string
  }>
  translation_id: string
  translation_name: string
  translation_note: string
}

export interface BibleSearchResult {
  query: string
  results: BibleVerse[]
  total: number
}

export interface DailyVerse {
  reference: string
  text: string
  date: string
  theme: string
}

// Popular Bible verses for trivia
export const POPULAR_VERSES = [
  { reference: 'John 3:16', category: 'salvation' },
  { reference: 'Jeremiah 29:11', category: 'hope' },
  { reference: 'Philippians 4:13', category: 'strength' },
  { reference: 'Psalm 23:1', category: 'comfort' },
  { reference: 'Romans 8:28', category: 'providence' },
  { reference: 'Proverbs 3:5-6', category: 'trust' },
  { reference: 'Matthew 28:19-20', category: 'commission' },
  { reference: '1 Corinthians 13:4-7', category: 'love' },
  { reference: 'Psalm 46:1', category: 'refuge' },
  { reference: 'Isaiah 41:10', category: 'courage' }
]

// Bible trivia categories
export const BIBLE_CATEGORIES = [
  { id: 'old_testament', name: 'Old Testament', color: '#FF6B6B' },
  { id: 'new_testament', name: 'New Testament', color: '#4ECDC4' },
  { id: 'miracles', name: 'Miracles', color: '#FFD166' },
  { id: 'prophecy', name: 'Prophecy', color: '#9370DB' },
  { id: 'wisdom', name: 'Wisdom', color: '#06D6A0' },
  { id: 'parables', name: 'Parables', color: '#118AB2' },
  { id: 'characters', name: 'Characters', color: '#EF476F' }
]

// Bible API Service
class BibleApiService {
  private cache = new Map<string, any>()
  private cacheDuration = 1000 * 60 * 60 // 1 hour

  async getVerse(reference: string, version: BibleVersion = 'KJV'): Promise<BibleVerse> {
    const cacheKey = `verse-${reference}-${version}`
    const cached = this.cache.get(cacheKey)

    if (cached && Date.now() - cached.timestamp < this.cacheDuration) {
      return cached.data
    }

    try {
      const response = await axios.get(
        `${API_ENDPOINTS.VERSES}/${reference}`,
        {
          params: {
            translation: BIBLE_API_CONFIG.VERSIONS[version]
          }
        }
      )

      const verseData = response.data
      this.cache.set(cacheKey, {
        timestamp: Date.now(),
        data: verseData
      })

      return verseData
    } catch (error) {
      console.error('Error fetching verse:', error)
      throw new Error(`Failed to fetch verse: ${reference}`)
    }
  }

  async getRandomVerse(version: BibleVersion = 'KJV'): Promise<BibleVerse> {
    try {
      // bible-api.com does not have a /random endpoint
      // We'll use our popular verses as a source for random references
      const randomRef = POPULAR_VERSES[Math.floor(Math.random() * POPULAR_VERSES.length)].reference
      return this.getVerse(randomRef, version)
    } catch (error) {
      console.error('Error fetching random verse:', error)
      throw error
    }
  }

  async searchBible(query: string, version: BibleVersion = 'KJV'): Promise<BibleSearchResult> {
    const cacheKey = `search-${query}-${version}`
    const cached = this.cache.get(cacheKey)

    if (cached && Date.now() - cached.timestamp < this.cacheDuration) {
      return cached.data
    }

    try {
      const response = await axios.get(
        API_ENDPOINTS.SEARCH,
        {
          params: {
            q: query,
            translation: BIBLE_API_CONFIG.VERSIONS[version]
          }
        }
      )

      const searchData = response.data
      this.cache.set(cacheKey, {
        timestamp: Date.now(),
        data: searchData
      })

      return searchData
    } catch (error) {
      console.error('Error searching Bible:', error)
      throw new Error('Failed to search Bible')
    }
  }

  async getDailyVerse(): Promise<DailyVerse> {
    const today = new Date().toISOString().split('T')[0]
    const cacheKey = `daily-${today}`

    const cached = this.cache.get(cacheKey)
    if (cached) {
      return cached.data
    }

    try {
      // Get a random verse for today
      const verse = await this.getRandomVerse()
      const dailyVerse: DailyVerse = {
        reference: verse.reference,
        text: verse.text,
        date: today,
        theme: this.getVerseTheme(verse.reference)
      }

      this.cache.set(cacheKey, {
        timestamp: Date.now(),
        data: dailyVerse
      })

      return dailyVerse
    } catch (error) {
      console.error('Error getting daily verse:', error)
      // Fallback
      const randomVerse = POPULAR_VERSES[Math.floor(Math.random() * POPULAR_VERSES.length)]
      return {
        reference: randomVerse.reference,
        text: 'For God so loved the world that he gave his one and only Son...',
        date: today,
        theme: randomVerse.category
      }
    }
  }

  async getBibleBooks(): Promise<BibleBook[]> {
    // bible-api.com does not have a /books endpoint
    // Return basic book list
    return this.getBasicBooks()
  }

  private getBasicBooks(): BibleBook[] {
    return [
      { id: 'GEN', name: 'Genesis', testament: 'old', chapters: 50 },
      { id: 'EXO', name: 'Exodus', testament: 'old', chapters: 40 },
      { id: 'MAT', name: 'Matthew', testament: 'new', chapters: 28 },
      { id: 'MRK', name: 'Mark', testament: 'new', chapters: 16 },
      { id: 'LUK', name: 'Luke', testament: 'new', chapters: 24 },
      { id: 'JHN', name: 'John', testament: 'new', chapters: 21 }
    ]
  }

  private getVerseTheme(reference: string): string {
    const verse = POPULAR_VERSES.find(v => v.reference === reference)
    return verse ? verse.category : 'inspiration'
  }

  // Generate trivia questions using AI or pre-defined
  async generateTriviaQuestion(category: string, difficulty: 'easy' | 'medium' | 'hard' = 'medium') {
    // This would ideally call an AI service, but for now use pre-defined
    const questions = this.getPredefinedQuestions(category, difficulty)
    return questions[Math.floor(Math.random() * questions.length)]
  }

  private getPredefinedQuestions(category: string, difficulty: string) {
    // Pre-defined questions as fallback
    const questions = [
      {
        question: "Who built the ark?",
        options: ["Noah", "Moses", "Abraham", "David"],
        correctAnswer: "Noah",
        reference: "Genesis 6:14",
        explanation: "Noah built the ark according to God's instructions to save his family and animals from the flood."
      }
    ]
    return questions.filter(q => q.reference.includes(category) || category === 'all')
  }

  // Get verse context (surrounding verses)
  async getVerseContext(reference: string, contextVerses: number = 2, version: BibleVersion = 'KJV') {
    try {
      // Parse reference to get chapter and verse
      const match = reference.match(/(\d?\s?\w+)\s(\d+):(\d+)/)
      if (!match) throw new Error('Invalid reference format')

      const [, book, chapter, verse] = match
      const startVerse = Math.max(1, parseInt(verse) - contextVerses)
      const endVerse = parseInt(verse) + contextVerses
      const contextReference = `${book} ${chapter}:${startVerse}-${endVerse}`

      return await this.getVerse(contextReference, version)
    } catch (error) {
      console.error('Error getting verse context:', error)
      return null
    }
  }

  // Get cross-references for a verse
  async getCrossReferences(reference: string) {
    // This would require a separate cross-reference API
    // For now, return similar themed verses
    const verse = POPULAR_VERSES.find(v => v.reference === reference)
    if (!verse) return []

    return POPULAR_VERSES
      .filter(v => v.category === verse.category && v.reference !== reference)
      .slice(0, 3)
  }

  // Clear cache
  clearCache() {
    this.cache.clear()
  }

  // Get cache statistics
  getCacheStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    }
  }
}

export const bibleApi = new BibleApiService()
export default bibleApi
