import { christianBooks, christianReadingLevels, ChristianBook, ReadingLevel } from '../../data/books/christianBooks';
import { BookApiService } from './apiService';

export class BookService {
  private static onlineBooks: ChristianBook[] = [];

  // Get books by age range
  static async getBooksByAge(age: number): Promise<ChristianBook[]> {
    const localBooks = christianBooks.filter(book =>
      age >= book.ageRange.min && age <= book.ageRange.max
    );
    
    return [...localBooks, ...this.onlineBooks.filter(book => 
      age >= book.ageRange.min && age <= book.ageRange.max
    )];
  }

  // Fetch and cache online books
  static async fetchOnlineBooks(): Promise<ChristianBook[]> {
    try {
      const [bibleStories, moralStories, publicDomain] = await Promise.all([
        BookApiService.fetchBibleStories(10),
        BookApiService.fetchMoralStories(10),
        BookApiService.fetchPublicDomainChristianBooks()
      ]);

      const convertedBible = bibleStories.map(b => 
        BookApiService.convertToChristianBook(b, 'bible-stories')
      );
      const convertedMoral = moralStories.map(b => 
        BookApiService.convertToChristianBook(b, 'character')
      );
      const convertedPublic = publicDomain.map(b => 
        BookApiService.convertGutenbergToChristianBook(b)
      );

      this.onlineBooks = [...convertedBible, ...convertedMoral, ...convertedPublic];
      return this.onlineBooks;
    } catch (error) {
      console.error('Error in BookService.fetchOnlineBooks:', error);
      return [];
    }
  }

  // Fetch full content for a book if needed
  static async fetchFullBookContent(bookId: string): Promise<ChristianBook | undefined> {
    const book = this.getBookById(bookId);
    if (!book) return undefined;

    // If it's an Open Library book, try to get full description
    if (bookId.startsWith('api-')) {
      const workId = bookId.replace('api-', '');
      const workData = await BookApiService.fetchOpenLibraryWork(workId);
      if (workData && workData.description) {
        const description = typeof workData.description === 'string' 
          ? workData.description 
          : workData.description.value;
        
        if (description) {
          // Update the first page with real description
          book.pages[0].content = description;
          // Maybe split long description into more pages?
          if (description.length > 1000) {
            this.splitContentIntoPages(book, description);
          }
        }
      }
    }

    // If it's a Gutenberg book, fetch full text
    if (bookId.startsWith('guten-') && book.externalUrl) {
      const text = await BookApiService.fetchGutenbergText(book.externalUrl);
      if (text) {
        this.splitContentIntoPages(book, text);
      }
    }

    return book;
  }

  private static splitContentIntoPages(book: ChristianBook, text: string) {
    // Basic splitting logic: every ~1000 characters or by paragraphs
    const paragraphs = text.split(/\n\s*\n/);
    const pages = [];
    let currentPageContent = "";
    let pageNum = 1;

    for (const para of paragraphs) {
      if (para.trim().length === 0) continue;
      
      if ((currentPageContent.length + para.length) > 1200 && currentPageContent.length > 0) {
        pages.push({
          pageNumber: pageNum++,
          content: currentPageContent.trim(),
          vocabulary: this.extractVocabulary(currentPageContent)
        });
        currentPageContent = "";
      }
      currentPageContent += para + "\n\n";
    }

    if (currentPageContent.trim().length > 0) {
      pages.push({
        pageNumber: pageNum++,
        content: currentPageContent.trim(),
        vocabulary: this.extractVocabulary(currentPageContent)
      });
    }

    if (pages.length > 0) {
      book.pages = pages;
    }
  }

  private static extractVocabulary(text: string): string[] {
    // Simple mock vocab extractor - pick some long words
    const words = text.match(/\b\w{7,}\b/g) || [];
    return Array.from(new Set(words)).slice(0, 5);
  }

  // Get all available books (local + cached online)
  static getAllAvailableBooks(): ChristianBook[] {
    return [...christianBooks, ...this.onlineBooks];
  }

  // Get book by ID (checks local then online)
  static getBookById(id: string): ChristianBook | undefined {
    const local = christianBooks.find(book => book.id === id);
    if (local) return local;
    return this.onlineBooks.find(book => book.id === id);
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
