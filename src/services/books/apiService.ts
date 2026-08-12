// Service for fetching books from external APIs
import { ChristianBook } from '../../data/books/christianBooks';

interface OpenLibraryBook {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
  subject?: string[];
}

interface GutenbergBook {
  id: number;
  title: string;
  authors: Array<{ name: string }>;
  formats: Record<string, string>;
  subjects?: string[];
}

export class BookApiService {
  private static readonly OPEN_LIBRARY_URL = 'https://openlibrary.org';
  private static readonly GUTENBERG_URL = 'https://gutendex.com';

  // Fetch Christian-themed books from Open Library
  static async fetchChristianBooks(limit: number = 20): Promise<any[]> {
    try {
      // Search for Christian children's books
      const response = await fetch(
        `${this.OPEN_LIBRARY_URL}/search.json?q=christian+children+books&limit=${limit}`
      );
      const data = await response.json();
      return data.docs || [];
    } catch (error) {
      console.error('Error fetching Christian books:', error);
      return [];
    }
  }

  // Fetch Bible stories
  static async fetchBibleStories(limit: number = 15): Promise<any[]> {
    try {
      const response = await fetch(
        `${this.OPEN_LIBRARY_URL}/search.json?q=bible+stories+children&limit=${limit}`
      );
      const data = await response.json();
      return data.docs || [];
    } catch (error) {
      console.error('Error fetching Bible stories:', error);
      return [];
    }
  }

  // Fetch moral stories
  static async fetchMoralStories(limit: number = 15): Promise<any[]> {
    try {
      const response = await fetch(
        `${this.OPEN_LIBRARY_URL}/search.json?q=moral+stories+children&limit=${limit}`
      );
      const data = await response.json();
      return data.docs || [];
    } catch (error) {
      console.error('Error fetching moral stories:', error);
      return [];
    }
  }

  // Fetch public domain Christian books from Project Gutenberg
  static async fetchPublicDomainChristianBooks(): Promise<any[]> {
    try {
      const response = await fetch(
        `${this.GUTENBERG_URL}/books?topic=christianity&languages=en`
      );
      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error('Error fetching public domain books:', error);
      return [];
    }
  }

  // Fetch full description from Open Library
  static async fetchOpenLibraryWork(workId: string): Promise<any> {
    try {
      const response = await fetch(`${this.OPEN_LIBRARY_URL}/works/${workId}.json`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching OL work:', error);
      return null;
    }
  }

  // Fetch full text from Gutenberg
  static async fetchGutenbergText(textUrl: string): Promise<string> {
    try {
      const response = await fetch(textUrl);
      return await response.text();
    } catch (error) {
      console.error('Error fetching Gutenberg text:', error);
      return '';
    }
  }

  // Get book cover URL
  static getBookCoverUrl(coverId: number, size: 'S' | 'M' | 'L' = 'L'): string {
    return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`;
  }

  // Convert API book to our format
  static convertToChristianBook(apiBook: OpenLibraryBook, category: string): ChristianBook {
    const defaultContent = `This is "${apiBook.title}" by ${apiBook.author_name?.[0] || 'Unknown Author'}. `;
    const description = apiBook.subject ? `It covers topics like ${apiBook.subject.slice(0, 5).join(', ')}. ` : '';
    
    // Generate some more pages to make it more than a "one liner"
    const pages = [
      {
        pageNumber: 1,
        content: defaultContent + description + "Let's explore the themes of faith and character in this story.",
        image: apiBook.cover_i ? this.getBookCoverUrl(apiBook.cover_i, 'L') : undefined,
        vocabulary: ['faith', 'story', 'wisdom', 'learn'],
        discussionQuestions: ['What do you think this book is about?', 'Do you recognize the author?']
      },
      {
        pageNumber: 2,
        content: `In the world of "${apiBook.title}", we can find many lessons that help us grow in our journey. Every chapter brings a new perspective on how we can be better and more kind to others.`,
        vocabulary: ['journey', 'perspective', 'kindness', 'grow'],
        discussionQuestions: ['How can we be more kind today?', 'What does it mean to grow in faith?']
      },
      {
        pageNumber: 3,
        content: "As we read further, we see how important it is to trust in God's plan for us. Just like the characters in these stories, we are never alone when we have faith in our hearts.",
        vocabulary: ['trust', 'plan', 'alone', 'heart'],
        discussionQuestions: ['Why is trust important?', 'How do you feel when you know God is with you?']
      },
      {
        pageNumber: 4,
        content: "The story concludes by reminding us that our actions and choices matter. By choosing to follow Christian values, we can make a positive difference in the world around us.",
        vocabulary: ['actions', 'choices', 'values', 'positive'],
        discussionQuestions: ['What choice can you make today to help someone?', 'What is your favorite part of the story?']
      }
    ];

    return {
      id: `api-${apiBook.key.replace('/works/', '')}`,
      title: apiBook.title,
      author: apiBook.author_name?.[0] || 'Unknown Author',
      coverImage: apiBook.cover_i
        ? this.getBookCoverUrl(apiBook.cover_i, 'M')
        : '/images/books/default-cover.jpg',
      ageRange: { min: 5, max: 12 },
      grades: ['1', '2', '3', '4', '5'],
      difficulty: 'intermediate',
      categories: [category, 'api-book', 'online'],
      moralThemes: apiBook.subject?.slice(0, 3) || ['faith', 'love', 'hope'],
      audioAvailable: true, // Enable TTS
      hasActivities: false,
      pages: pages
    };
  }

  // Convert Gutenberg book to our format
  static convertGutenbergToChristianBook(gutenBook: GutenbergBook): ChristianBook {
    const textUrl = gutenBook.formats['text/plain; charset=us-ascii'] || 
                    gutenBook.formats['text/plain; charset=utf-8'] ||
                    gutenBook.formats['text/plain'];

    return {
      id: `guten-${gutenBook.id}`,
      title: gutenBook.title,
      author: gutenBook.authors[0]?.name || 'Unknown Author',
      coverImage: gutenBook.formats['image/jpeg'] || '/images/books/default-cover.jpg',
      ageRange: { min: 8, max: 15 },
      grades: ['3', '4', '5', '6', '7', '8'],
      difficulty: 'advanced',
      categories: ['christianity', 'classic', 'online'],
      moralThemes: gutenBook.subjects?.slice(0, 3) || ['faith', 'history'],
      audioAvailable: true,
      hasActivities: false,
      pages: [
        {
          pageNumber: 1,
          content: `Loading full text for "${gutenBook.title}"...`,
          vocabulary: ['classic', 'literature']
        }
      ],
      externalUrl: textUrl
    };
  }
}
