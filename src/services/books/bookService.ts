import { christianBooks, christianReadingLevels, ChristianBook, ReadingLevel } from '../../data/books/christianBooks';

export class BookService {
  // Only the bundled, curated story collection is available to children.
  // External catalogue searches are previews, not verified children's stories.
  static async getBooksByAge(age: number): Promise<ChristianBook[]> {
    return christianBooks.filter(book => age >= book.ageRange.min && age <= book.ageRange.max);
  }

  static async fetchOnlineBooks(): Promise<ChristianBook[]> { return []; }

  static async fetchFullBookContent(bookId: string): Promise<ChristianBook | undefined> {
    return this.getBookById(bookId);
  }

  // Get all available books (local + cached online)
  static getAllAvailableBooks(): ChristianBook[] {
    return [...christianBooks];
  }

  // Get book by ID (checks local then online)
  static getBookById(id: string): ChristianBook | undefined {
    const local = christianBooks.find(book => book.id === id);
    if (local) return local;
    return undefined;
  }

  // Get books by grade
  static getBooksByGrade(grade: string): ChristianBook[] {
    return this.getAllAvailableBooks().filter(book =>
      book.grades.includes(grade)
    );
  }

  // Get books by difficulty
  static getBooksByDifficulty(difficulty: 'beginner' | 'intermediate' | 'advanced'): ChristianBook[] {
    return this.getAllAvailableBooks().filter(book => book.difficulty === difficulty);
  }

  // Get books by category
  static getBooksByCategory(category: string): ChristianBook[] {
    return this.getAllAvailableBooks().filter(book =>
      book.categories.includes(category.toLowerCase())
    );
  }

  // Get reading level for age/grade
  static getReadingLevel(age: number, grade?: string): ReadingLevel | undefined {
    if (grade) {
      return christianReadingLevels.find(level =>
        level.age === age && level.grade === grade
      );
    }
    return christianReadingLevels.find(level => level.age === age);
  }

  // Search books
  static searchBooks(query: string): ChristianBook[] {
    const lowerQuery = query.toLowerCase();
    return this.getAllAvailableBooks().filter(book =>
      book.title.toLowerCase().includes(lowerQuery) ||
      book.author.toLowerCase().includes(lowerQuery) ||
      book.categories.some(cat => cat.includes(lowerQuery)) ||
      book.moralThemes.some(theme => theme.includes(lowerQuery))
    );
  }

  // Get recommended books for level
  static getRecommendedBooks(levelId: string): ChristianBook[] {
    const level = christianReadingLevels.find(l => l.id === levelId);
    if (!level) return [];

    return level.recommendedBooks
      .map(bookId => this.getBookById(bookId))
      .filter((book): book is ChristianBook => book !== undefined);
  }

  // Get vocabulary from book
  static getBookVocabulary(bookId: string): string[] {
    const book = this.getBookById(bookId);
    if (!book) return [];

    const vocabulary = new Set<string>();
    book.pages.forEach(page => {
      if (page.vocabulary) {
        page.vocabulary.forEach(word => vocabulary.add(word));
      }
    });
    return Array.from(vocabulary);
  }

  // Get discussion questions from book
  static getDiscussionQuestions(bookId: string): string[] {
    const book = this.getBookById(bookId);
    if (!book) return [];

    const questions: string[] = [];
    book.pages.forEach(page => {
      if (page.discussionQuestions) {
        questions.push(...page.discussionQuestions);
      }
    });
    return questions;
  }
}
