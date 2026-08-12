// WordBank service with proper imports
import {
  ALL_WORDS,
  getRandomWords,
  searchWords as searchWordsHelper
} from '../../data/wordData.js';

export interface Word {
  id: string
  word: string
  meaning: string
  sentence: string
  difficulty: 1 | 2 | 3
  category: string
  phonetic?: string
  synonyms?: string[]
  hint?: string
  vocabulary_question?: string
  source?: string
  sentences?: string[]
}

export interface WordCategory {
  id: string
  name: string
  description: string
  icon: string
  color: string
}

export class WordBank {
  private words: Word[]
  private categories: WordCategory[]

  constructor() {
    this.words = this.processWordData()
    this.categories = this.createCategories()
    console.log(`WordBank initialized with ${this.words.length} words`)
  }

  private processWordData(): Word[] {
    return ALL_WORDS.map((wordData, index) => {
      const wordText = wordData.word || ''

      const meaning = wordData.meaning || ''
      const sentence = wordData.sentences?.[0] || `The ${wordText} is interesting.`
      const vocabulary_question = wordData.vocabulary_question
      const difficulty = wordData.difficulty || 1
      const category = this.determineCategory(wordText, meaning)
      const hint = this.generateHint(wordText, meaning)
      const phonetic = this.generatePhonetic(wordText)
      const synonyms = this.generateSynonyms(wordText)

      return {
        id: wordData.id || `word-${String(index + 1).padStart(3, '0')}`,
        word: wordText,
        meaning: meaning,
        sentence: sentence,
        difficulty: difficulty as 1 | 2 | 3,
        category,
        phonetic,
        synonyms,
        hint,
        vocabulary_question,
        source: wordData.source,
        sentences: wordData.sentences
      }
    })
  }

  private determineCategory(word: string, meaning: string): string {
    const wordLower = word.toLowerCase()
    const meaningLower = meaning.toLowerCase()

    if (meaningLower.includes('animal') || meaningLower.includes('mammal') ||
        ['cat', 'dog'].includes(wordLower)) {
      return 'animals'
    }

    if (meaningLower.includes('game') || meaningLower.includes('play')) {
      return 'activities'
    }

    return 'general'
  }

  private generateHint(word: string, meaning: string): string {
    const hints: Record<string, string> = {
      'tag': 'You play this game by chasing friends',
      'cat': 'It says "meow"',
      'dog': "Man's best friend"
    }

    return hints[word.toLowerCase()] || meaning.split('.')[0]
  }

  private generatePhonetic(word: string): string {
    const phonetics: Record<string, string> = {
      'tag': '/tag/',
      'cat': '/kat/',
      'dog': '/dôg/'
    }

    return phonetics[word.toLowerCase()] || `/${word.toLowerCase()}/`
  }

  private generateSynonyms(word: string): string[] {
    const synonymMap: Record<string, string[]> = {
      'cat': ['feline', 'kitty'],
      'dog': ['canine', 'puppy'],
      'tag': ['chase', 'tig']
    }

    return synonymMap[word.toLowerCase()] || []
  }

  private createCategories(): WordCategory[] {
    return [
      {
        id: 'animals',
        name: 'Animals',
        description: 'Words about animals and pets',
        icon: '🐾',
        color: '#4ECDC4'
      },
      {
        id: 'activities',
        name: 'Activities',
        description: 'Words about games and activities',
        icon: '⚽',
        color: '#FF6B6B'
      },
      {
        id: 'general',
        name: 'General',
        description: 'Other words',
        icon: '🌟',
        color: '#FFD166'
      }
    ]
  }

  // Public methods
  getAllWords(): Word[] {
    return [...this.words]
  }

  getWordsByDifficulty(difficulty: 1 | 2 | 3): Word[] {
    return this.words.filter(word => word.difficulty === difficulty)
  }

  getWordsByCategory(category: string): Word[] {
    return this.words.filter(word => word.category.toLowerCase() === category.toLowerCase())
  }

  getRandomWord(difficulty?: 1 | 2 | 3): Word {
    const words = difficulty ? this.getWordsByDifficulty(difficulty) : this.words
    if (words.length === 0) return this.words[0]
    return words[Math.floor(Math.random() * words.length)]
  }

  getRandomWords(count: number, difficulty?: 1 | 2 | 3): Word[] {
    const rawWords = getRandomWords(count, difficulty);
    return rawWords.map(w => this.getWordByWord(w.word)).filter((w): w is Word => !!w);
  }

  getWordById(id: string): Word | undefined {
    return this.words.find(word => word.id === id)
  }

  getWordByWord(wordStr: string): Word | undefined {
    const wordText = wordStr.toLowerCase().trim();
    return this.words.find(w => w.word.toLowerCase() === wordText);
  }

  getCategories(): WordCategory[] {
    return [...this.categories]
  }

  getCategoryById(id: string): WordCategory | undefined {
    return this.categories.find(cat => cat.id === id)
  }

  searchWords(query: string): Word[] {
    const rawWords = searchWordsHelper(query);
    return rawWords.map(w => this.getWordByWord(w.word)).filter((w): w is Word => !!w);
  }

  getWordCount(): number {
    return this.words.length
  }

  getLearnedWords(learnedIds: string[]): Word[] {
    return this.words.filter(word => learnedIds.includes(word.id))
  }

  getUnlearnedWords(learnedIds: string[]): Word[] {
    return this.words.filter(word => !learnedIds.includes(word.id))
  }

  getVocabularyQuestion(word: string): string | undefined {
    const wordData = this.getWordByWord(word)
    return wordData?.vocabulary_question
  }

  getMaskedVocabularyQuestion(word: string): string {
    const question = this.getVocabularyQuestion(word)
    if (!question) return `What does "${word}" mean?`
    // The data masks the target word with a run of block characters whose length
    // varies (███, ██████, …). Collapse each whole run to the word exactly once,
    // otherwise a 6-block mask becomes "wordword" and leftovers render as boxes.
    return question.replace(/█+/g, word)
  }
}

// Export singleton instance
export const wordBank = new WordBank()
