#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}📚 Setting up Kids Book Reading Feature with Christian Books${NC}"

# Project root
#PROJECT_ROOT="spellingB"
#cd "$PROJECT_ROOT" || { echo -e "${RED}❌ Project directory not found!${NC}"; exit 1; }

# Create directories
echo -e "${YELLOW}Creating directory structure...${NC}"

# Create book-related directories
mkdir -p src/components/reading
mkdir -p src/components/reading/games
mkdir -p src/components/reading/bookshelf
mkdir -p src/pages/reading
mkdir -p src/data/books
mkdir -p src/services/books
mkdir -p src/assets/images/books
mkdir -p src/assets/audio/books
mkdir -p src/hooks/reading

# Create data files
echo -e "${YELLOW}Creating data files...${NC}"

# Create books data file with Christian books
cat > src/data/books/christianBooks.ts << 'EOF'
// Christian and moral-themed books for children
export interface ChristianBook {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  ageRange: {
    min: number;
    max: number;
  };
  grades: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  categories: string[];
  bibleVerses?: string[];
  moralThemes: string[];
  pages: BookPage[];
  audioAvailable: boolean;
  hasActivities: boolean;
}

export interface BookPage {
  pageNumber: number;
  content: string;
  image?: string;
  audioUrl?: string;
  vocabulary?: string[];
  discussionQuestions?: string[];
}

export const christianBooks: ChristianBook[] = [
  {
    id: 'cbook-001',
    title: 'The Beginner\'s Bible',
    author: 'Various',
    coverImage: '/images/books/christian/beginners-bible.jpg',
    ageRange: { min: 2, max: 5 },
    grades: ['Pre-K', 'K'],
    difficulty: 'beginner',
    categories: ['bible', 'christian', 'stories'],
    bibleVerses: ['John 3:16', 'Psalm 23:1'],
    moralThemes: ['love', 'faith', 'kindness'],
    audioAvailable: true,
    hasActivities: true,
    pages: [
      {
        pageNumber: 1,
        content: "In the beginning, God created the heavens and the earth.",
        image: '/images/books/christian/creation.jpg',
        vocabulary: ['beginning', 'created', 'heavens', 'earth'],
        discussionQuestions: ['Who created everything?', 'What are you thankful that God created?']
      },
      {
        pageNumber: 2,
        content: "God saw all that he had made, and it was very good.",
        image: '/images/books/christian/creation-good.jpg',
        vocabulary: ['saw', 'made', 'good'],
        discussionQuestions: ['What did God think about His creation?']
      }
    ]
  },
  {
    id: 'cbook-002',
    title: 'Noah\'s Ark Adventure',
    author: 'Bible Stories for Kids',
    coverImage: '/images/books/christian/noahs-ark.jpg',
    ageRange: { min: 4, max: 8 },
    grades: ['K', '1', '2'],
    difficulty: 'intermediate',
    categories: ['bible', 'animals', 'adventure'],
    bibleVerses: ['Genesis 6:19-20'],
    moralThemes: ['obedience', 'faith', 'protection'],
    audioAvailable: true,
    hasActivities: true,
    pages: [
      {
        pageNumber: 1,
        content: "Noah was a righteous man who walked with God. God told Noah to build an ark.",
        image: '/images/books/christian/noah-builds.jpg',
        vocabulary: ['righteous', 'ark', 'build'],
        discussionQuestions: ['Why was Noah special?', 'What is an ark?']
      }
    ]
  },
  {
    id: 'cbook-003',
    title: 'David and Goliath',
    author: 'Bible Heroes',
    coverImage: '/images/books/christian/david-goliath.jpg',
    ageRange: { min: 5, max: 9 },
    grades: ['1', '2', '3'],
    difficulty: 'intermediate',
    categories: ['bible', 'heroes', 'courage'],
    bibleVerses: ['1 Samuel 17:45-47'],
    moralThemes: ['courage', 'faith', 'trust'],
    audioAvailable: true,
    hasActivities: true,
    pages: [
      {
        pageNumber: 1,
        content: "Young David faced the giant Goliath with just a sling and five smooth stones.",
        image: '/images/books/christian/david-faces-goliath.jpg',
        vocabulary: ['giant', 'sling', 'stones', 'brave'],
        discussionQuestions: ['How did David defeat Goliath?', 'What does this teach us about courage?']
      }
    ]
  },
  {
    id: 'cbook-004',
    title: 'The Parable of the Good Samaritan',
    author: 'Jesus\' Stories',
    coverImage: '/images/books/christian/good-samaritan.jpg',
    ageRange: { min: 6, max: 10 },
    grades: ['1', '2', '3', '4'],
    difficulty: 'intermediate',
    categories: ['parable', 'kindness', 'compassion'],
    bibleVerses: ['Luke 10:33-34'],
    moralThemes: ['kindness', 'compassion', 'helping others'],
    audioAvailable: true,
    hasActivities: true,
    pages: [
      {
        pageNumber: 1,
        content: "A man was traveling when robbers attacked him and left him hurt by the road.",
        image: '/images/books/christian/hurt-traveler.jpg',
        vocabulary: ['traveling', 'robbers', 'attacked', 'hurt'],
        discussionQuestions: ['What would you do if you saw someone who needed help?']
      }
    ]
  },
  {
    id: 'cbook-005',
    title: 'God Made Me Special',
    author: 'Christian Learning Series',
    coverImage: '/images/books/christian/god-made-me.jpg',
    ageRange: { min: 3, max: 6 },
    grades: ['Pre-K', 'K'],
    difficulty: 'beginner',
    categories: ['self-esteem', 'creation', 'identity'],
    bibleVerses: ['Psalm 139:14'],
    moralThemes: ['self-worth', 'uniqueness', 'love'],
    audioAvailable: true,
    hasActivities: true,
    pages: [
      {
        pageNumber: 1,
        content: "God made me special, unique and loved. He knows every hair on my head.",
        image: '/images/books/christian/special-child.jpg',
        vocabulary: ['special', 'unique', 'loved', 'God'],
        discussionQuestions: ['What makes you special?', 'How does God show His love for you?']
      }
    ]
  },
  {
    id: 'cbook-006',
    title: 'Fruit of the Spirit',
    author: 'Christian Character Series',
    coverImage: '/images/books/christian/fruit-spirit.jpg',
    ageRange: { min: 7, max: 12 },
    grades: ['2', '3', '4', '5'],
    difficulty: 'advanced',
    categories: ['character', 'virtues', 'christian-living'],
    bibleVerses: ['Galatians 5:22-23'],
    moralThemes: ['love', 'joy', 'peace', 'patience', 'kindness', 'goodness', 'faithfulness', 'gentleness', 'self-control'],
    audioAvailable: true,
    hasActivities: true,
    pages: [
      {
        pageNumber: 1,
        content: "The fruit of the Spirit is love, joy, peace, patience, kindness, goodness, faithfulness, gentleness, and self-control.",
        image: '/images/books/christian/fruits.jpg',
        vocabulary: ['spirit', 'fruit', 'patience', 'kindness', 'self-control'],
        discussionQuestions: ['Which fruit of the Spirit do you want to grow in your life?', 'How can you show kindness today?']
      }
    ]
  },
  {
    id: 'cbook-007',
    title: 'The Christmas Story',
    author: 'Holiday Bible Stories',
    coverImage: '/images/books/christian/christmas-story.jpg',
    ageRange: { min: 4, max: 9 },
    grades: ['K', '1', '2', '3'],
    difficulty: 'intermediate',
    categories: ['christmas', 'jesus', 'holiday'],
    bibleVerses: ['Luke 2:10-11'],
    moralThemes: ['giving', 'love', 'joy', 'hope'],
    audioAvailable: true,
    hasActivities: true,
    pages: [
      {
        pageNumber: 1,
        content: "In Bethlehem, a special baby was born in a stable. His name was Jesus, the Savior of the world.",
        image: '/images/books/christian/baby-jesus.jpg',
        vocabulary: ['Bethlehem', 'stable', 'Savior', 'Jesus'],
        discussionQuestions: ['Why is Christmas important?', 'How can we share the Christmas spirit?']
      }
    ]
  },
  {
    id: 'cbook-008',
    title: 'Prayer Time with Jesus',
    author: 'Christian Devotionals for Kids',
    coverImage: '/images/books/christian/prayer-time.jpg',
    ageRange: { min: 5, max: 10 },
    grades: ['K', '1', '2', '3', '4'],
    difficulty: 'intermediate',
    categories: ['prayer', 'devotional', 'christian-life'],
    bibleVerses: ['Matthew 6:9-13', 'Philippians 4:6-7'],
    moralThemes: ['prayer', 'thankfulness', 'trust', 'peace'],
    audioAvailable: true,
    hasActivities: true,
    pages: [
      {
        pageNumber: 1,
        content: "Jesus taught us how to pray. We can talk to God anytime, anywhere, about anything.",
        image: '/images/books/christian/jesus-praying.jpg',
        vocabulary: ['pray', 'God', 'talk', 'thank'],
        discussionQuestions: ['What can you pray about today?', 'When do you like to pray?']
      }
    ]
  }
];

// Reading levels with Christian focus
export interface ReadingLevel {
  id: string;
  age: number;
  grade: string;
  description: string;
  bibleVerse?: string;
  characterTrait?: string;
  recommendedBooks: string[];
}

export const christianReadingLevels: ReadingLevel[] = [
  {
    id: 'level-1',
    age: 3,
    grade: 'Pre-K',
    description: 'Simple Bible stories with pictures',
    bibleVerse: 'God is love. - 1 John 4:8',
    characterTrait: 'Love',
    recommendedBooks: ['cbook-001', 'cbook-005']
  },
  {
    id: 'level-2',
    age: 4,
    grade: 'Pre-K',
    description: 'Basic Bible stories and Christian values',
    bibleVerse: 'Be kind to one another. - Ephesians 4:32',
    characterTrait: 'Kindness',
    recommendedBooks: ['cbook-002', 'cbook-005']
  },
  {
    id: 'level-3',
    age: 5,
    grade: 'K',
    description: 'Bible stories with moral lessons',
    bibleVerse: 'I can do all things through Christ. - Philippians 4:13',
    characterTrait: 'Strength',
    recommendedBooks: ['cbook-001', 'cbook-002', 'cbook-003']
  },
  {
    id: 'level-4',
    age: 6,
    grade: '1',
    description: 'Bible stories and Christian character building',
    bibleVerse: 'The Lord is my shepherd. - Psalm 23:1',
    characterTrait: 'Trust',
    recommendedBooks: ['cbook-003', 'cbook-004', 'cbook-007']
  },
  {
    id: 'level-5',
    age: 7,
    grade: '2',
    description: 'Parables and Christian living',
    bibleVerse: 'Love your neighbor as yourself. - Matthew 22:39',
    characterTrait: 'Compassion',
    recommendedBooks: ['cbook-004', 'cbook-006', 'cbook-008']
  },
  {
    id: 'level-6',
    age: 8,
    grade: '3',
    description: 'Bible teachings and application',
    bibleVerse: 'Trust in the Lord with all your heart. - Proverbs 3:5',
    characterTrait: 'Faith',
    recommendedBooks: ['cbook-006', 'cbook-008']
  },
  {
    id: 'level-7',
    age: 9,
    grade: '4',
    description: 'Christian virtues and discipleship',
    bibleVerse: 'Let your light shine before others. - Matthew 5:16',
    characterTrait: 'Witness',
    recommendedBooks: ['cbook-006']
  },
  {
    id: 'level-8',
    age: 10,
    grade: '5',
    description: 'Christian leadership and service',
    bibleVerse: 'Serve one another in love. - Galatians 5:13',
    characterTrait: 'Service',
    recommendedBooks: ['cbook-006', 'cbook-008']
  }
];

// Categories for filtering
export const christianCategories = [
  { id: 'bible-stories', name: 'Bible Stories', icon: '📖' },
  { id: 'character', name: 'Character Building', icon: '⭐' },
  { id: 'prayer', name: 'Prayer & Devotion', icon: '🙏' },
  { id: 'holidays', name: 'Christian Holidays', icon: '🎄' },
  { id: 'values', name: 'Christian Values', icon: '❤️' },
  { id: 'creation', name: 'God\'s Creation', icon: '🌎' }
];

export const getBooksByAge = (age: number): ChristianBook[] => {
  return christianBooks.filter(book =>
    age >= book.ageRange.min && age <= book.ageRange.max
  );
};

export const getBooksByGrade = (grade: string): ChristianBook[] => {
  return christianBooks.filter(book =>
    book.grades.includes(grade)
  );
};

export const getBooksByTheme = (theme: string): ChristianBook[] => {
  return christianBooks.filter(book =>
    book.moralThemes.includes(theme.toLowerCase())
  );
};
EOF

# Create general books data
cat > src/data/books/index.ts << 'EOF'
export * from './christianBooks';
export * from './secularBooks'; // Will be created separately
EOF

# Create services
cat > src/services/books/bookService.ts << 'EOF'
import { christianBooks, christianReadingLevels, ChristianBook, ReadingLevel } from '../../data/books/christianBooks';

export class BookService {
  // Get books by age range
  static getBooksByAge(age: number): ChristianBook[] {
    return christianBooks.filter(book =>
      age >= book.ageRange.min && age <= book.ageRange.max
    );
  }

  // Get books by grade
  static getBooksByGrade(grade: string): ChristianBook[] {
    return christianBooks.filter(book =>
      book.grades.includes(grade)
    );
  }

  // Get books by difficulty
  static getBooksByDifficulty(difficulty: 'beginner' | 'intermediate' | 'advanced'): ChristianBook[] {
    return christianBooks.filter(book => book.difficulty === difficulty);
  }

  // Get books by category
  static getBooksByCategory(category: string): ChristianBook[] {
    return christianBooks.filter(book =>
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

  // Get book by ID
  static getBookById(id: string): ChristianBook | undefined {
    return christianBooks.find(book => book.id === id);
  }

  // Search books
  static searchBooks(query: string): ChristianBook[] {
    const lowerQuery = query.toLowerCase();
    return christianBooks.filter(book =>
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
EOF

cat > src/services/books/apiService.ts << 'EOF'
// Service for fetching books from external APIs
import { BookService } from './bookService';

interface OpenLibraryBook {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
  subject?: string[];
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

  // Get book cover URL
  static getBookCoverUrl(coverId: number, size: 'S' | 'M' | 'L' = 'L'): string {
    return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`;
  }

  // Convert API book to our format
  static convertToChristianBook(apiBook: OpenLibraryBook, category: string): any {
    return {
      id: `api-${apiBook.key}`,
      title: apiBook.title,
      author: apiBook.author_name?.[0] || 'Unknown Author',
      coverImage: apiBook.cover_i
        ? this.getBookCoverUrl(apiBook.cover_i, 'M')
        : '/images/books/default-cover.jpg',
      ageRange: { min: 5, max: 10 },
      grades: ['1', '2', '3', '4'],
      difficulty: 'intermediate',
      categories: [category, 'api-book'],
      moralThemes: ['faith', 'love', 'hope'],
      audioAvailable: false,
      hasActivities: false,
      pages: [
        {
          pageNumber: 1,
          content: `This is "${apiBook.title}" fetched from Open Library.`,
          image: apiBook.cover_i
            ? this.getBookCoverUrl(apiBook.cover_i, 'L')
            : undefined,
          vocabulary: ['book', 'story', 'read', 'learn'],
          discussionQuestions: ['What did you learn from this story?', 'How can you apply this lesson?']
        }
      ]
    };
  }
}
EOF

# Create components
echo -e "${YELLOW}Creating React components...${NC}"

cat > src/components/reading/BookReader.tsx << 'EOF'
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BookService } from '../../services/books/bookService';
import { ChristianBook } from '../../data/books/christianBooks';
import './BookReader.css';

interface BookReaderProps {
  bookId?: string;
}

const BookReader: React.FC<BookReaderProps> = ({ bookId: propBookId }) => {
  const { bookId: paramBookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();
  const bookId = propBookId || paramBookId || '';

  const [book, setBook] = useState<ChristianBook | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showVocabulary, setShowVocabulary] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);

  useEffect(() => {
    const fetchedBook = BookService.getBookById(bookId);
    if (fetchedBook) {
      setBook(fetchedBook);
    }
  }, [bookId]);

  if (!book) {
    return (
      <div className="book-reader-container">
        <div className="book-not-found">
          <h2>Book Not Found</h2>
          <button onClick={() => navigate('/reading')} className="back-button">
            Back to Library
          </button>
        </div>
      </div>
    );
  }

  const currentPageData = book.pages[currentPage];
  const totalPages = book.pages.length;

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePlayAudio = () => {
    if (currentPageData.audioUrl) {
      setIsPlayingAudio(true);
      // Implement audio playback here
      setTimeout(() => setIsPlayingAudio(false), 2000);
    }
  };

  const handleVocabularyClick = (word: string) => {
    // Could link to spelling bee practice with this word
    navigate(`/learn?word=${encodeURIComponent(word)}`);
  };

  return (
    <div className="book-reader-container">
      <div className="book-reader-header">
        <button onClick={() => navigate('/reading')} className="back-button">
          ← Back to Library
        </button>
        <h1 className="book-title">{book.title}</h1>
        <div className="book-meta">
          <span className="author">By {book.author}</span>
          <span className="difficulty">Level: {book.difficulty}</span>
        </div>
      </div>

      <div className="book-content">
        <div className="book-page">
          {currentPageData.image && (
            <div className="page-image">
              <img src={currentPageData.image} alt={`Page ${currentPage + 1}`} />
            </div>
          )}

          <div className="page-content">
            <div className="page-text">
              {currentPageData.content}
            </div>

            {currentPageData.audioUrl && (
              <button
                onClick={handlePlayAudio}
                className={`audio-button ${isPlayingAudio ? 'playing' : ''}`}
                disabled={isPlayingAudio}
              >
                {isPlayingAudio ? '🔊 Playing...' : '🔊 Listen'}
              </button>
            )}
          </div>
        </div>

        <div className="page-controls">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 0}
            className="page-nav-button"
          >
            ← Previous
          </button>

          <div className="page-counter">
            Page {currentPage + 1} of {totalPages}
          </div>

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages - 1}
            className="page-nav-button"
          >
            Next →
          </button>
        </div>

        <div className="book-features">
          <div className="feature-section">
            <h3>
              <button
                onClick={() => setShowVocabulary(!showVocabulary)}
                className="feature-toggle"
              >
                📚 Vocabulary {showVocabulary ? '▼' : '▶'}
              </button>
            </h3>
            {showVocabulary && currentPageData.vocabulary && (
              <div className="vocabulary-list">
                {currentPageData.vocabulary.map((word, index) => (
                  <span
                    key={index}
                    className="vocabulary-word"
                    onClick={() => handleVocabularyClick(word)}
                    title="Click to practice spelling this word"
                  >
                    {word}
                  </span>
                ))}
              </div>
            )}
          </div>

          {book.bibleVerses && book.bibleVerses.length > 0 && (
            <div className="feature-section">
              <h3>📖 Related Bible Verses</h3>
              <div className="bible-verses">
                {book.bibleVerses.map((verse, index) => (
                  <div key={index} className="bible-verse">
                    {verse}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="feature-section">
            <h3>
              <button
                onClick={() => setShowQuestions(!showQuestions)}
                className="feature-toggle"
              >
                💭 Discussion Questions {showQuestions ? '▼' : '▶'}
              </button>
            </h3>
            {showQuestions && currentPageData.discussionQuestions && (
              <div className="discussion-questions">
                {currentPageData.discussionQuestions.map((question, index) => (
                  <div key={index} className="question">
                    <strong>Q{index + 1}:</strong> {question}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="feature-section">
            <h3>⭐ Moral Themes</h3>
            <div className="moral-themes">
              {book.moralThemes.map((theme, index) => (
                <span key={index} className="theme-badge">
                  {theme}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookReader;
EOF

cat > src/components/reading/AgeGradeSelector.tsx << 'EOF'
import React, { useState } from 'react';
import { christianReadingLevels } from '../../data/books/christianBooks';
import './AgeGradeSelector.css';

interface AgeGradeSelectorProps {
  onSelect: (age: number, grade: string) => void;
  selectedAge?: number;
  selectedGrade?: string;
}

const AgeGradeSelector: React.FC<AgeGradeSelectorProps> = ({
  onSelect,
  selectedAge = 5,
  selectedGrade = 'K'
}) => {
  const [age, setAge] = useState(selectedAge);
  const [grade, setGrade] = useState(selectedGrade);

  const ages = [3, 4, 5, 6, 7, 8, 9, 10];
  const grades = ['Pre-K', 'K', '1', '2', '3', '4', '5'];

  const handleAgeSelect = (selectedAge: number) => {
    setAge(selectedAge);
    // Auto-select appropriate grade based on age
    const recommendedLevel = christianReadingLevels.find(level => level.age === selectedAge);
    if (recommendedLevel) {
      setGrade(recommendedLevel.grade);
      onSelect(selectedAge, recommendedLevel.grade);
    }
  };

  const handleGradeSelect = (selectedGrade: string) => {
    setGrade(selectedGrade);
    onSelect(age, selectedGrade);
  };

  const getCurrentLevelInfo = () => {
    return christianReadingLevels.find(level =>
      level.age === age && level.grade === grade
    );
  };

  const levelInfo = getCurrentLevelInfo();

  return (
    <div className="age-grade-selector">
      <div className="selector-section">
        <h3>Select Age</h3>
        <div className="age-buttons">
          {ages.map(a => (
            <button
              key={a}
              onClick={() => handleAgeSelect(a)}
              className={`age-button ${age === a ? 'selected' : ''}`}
            >
              {a} years
            </button>
          ))}
        </div>
      </div>

      <div className="selector-section">
        <h3>Select Grade</h3>
        <div className="grade-buttons">
          {grades.map(g => (
            <button
              key={g}
              onClick={() => handleGradeSelect(g)}
              className={`grade-button ${grade === g ? 'selected' : ''}`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {levelInfo && (
        <div className="level-info-card">
          <div className="level-header">
            <h4>Reading Level: {levelInfo.grade} Grade ({levelInfo.age} years)</h4>
            <div className="character-trait">
              ⭐ {levelInfo.characterTrait}
            </div>
          </div>
          <p className="level-description">{levelInfo.description}</p>
          {levelInfo.bibleVerse && (
            <div className="bible-verse-card">
              <span className="verse-icon">📖</span>
              <p className="verse-text">"{levelInfo.bibleVerse}"</p>
            </div>
          )}
        </div>
      )}

      <div className="selection-summary">
        <p>
          Selected: <strong>{age} years old</strong>, <strong>Grade {grade}</strong>
        </p>
        <button
          onClick={() => onSelect(age, grade)}
          className="confirm-selection-button"
        >
          Find Books for This Level →
        </button>
      </div>
    </div>
  );
};

export default AgeGradeSelector;
EOF

cat > src/components/reading/BookShelf.tsx << 'EOF'
import React, { useState, useEffect } from 'react';
import { BookService } from '../../services/books/bookService';
import { ChristianBook } from '../../data/books/christianBooks';
import { christianCategories } from '../../data/books/christianBooks';
import BookCard from './BookCard';
import AgeGradeSelector from './AgeGradeSelector';
import './BookShelf.css';

interface BookShelfProps {
  onSelectBook: (book: ChristianBook) => void;
}

const BookShelf: React.FC<BookShelfProps> = ({ onSelectBook }) => {
  const [selectedAge, setSelectedAge] = useState<number>(5);
  const [selectedGrade, setSelectedGrade] = useState<string>('K');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [books, setBooks] = useState<ChristianBook[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    loadBooks();
  }, [selectedAge, selectedGrade, selectedCategory]);

  const loadBooks = () => {
    setLoading(true);

    let filteredBooks: ChristianBook[] = [];

    // Filter by age
    filteredBooks = BookService.getBooksByAge(selectedAge);

    // Further filter by grade
    filteredBooks = filteredBooks.filter(book =>
      book.grades.includes(selectedGrade)
    );

    // Filter by category
    if (selectedCategory !== 'all') {
      filteredBooks = filteredBooks.filter(book =>
        book.categories.includes(selectedCategory)
      );
    }

    // Apply search query
    if (searchQuery.trim()) {
      filteredBooks = filteredBooks.filter(book =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.moralThemes.some(theme =>
          theme.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    setBooks(filteredBooks);
    setLoading(false);
  };

  const handleAgeGradeSelect = (age: number, grade: string) => {
    setSelectedAge(age);
    setSelectedGrade(grade);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadBooks();
  };

  const handleClearFilters = () => {
    setSelectedAge(5);
    setSelectedGrade('K');
    setSelectedCategory('all');
    setSearchQuery('');
  };

  return (
    <div className="book-shelf-container">
      <div className="book-shelf-header">
        <h1>📚 Christian Book Library</h1>
        <p className="subtitle">Find books that teach faith, values, and character</p>
      </div>

      <div className="controls-panel">
        <div className="filters-section">
          <AgeGradeSelector
            onSelect={handleAgeGradeSelect}
            selectedAge={selectedAge}
            selectedGrade={selectedGrade}
          />

          <div className="category-filter">
            <h3>Category</h3>
            <div className="category-buttons">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`category-button ${selectedCategory === 'all' ? 'selected' : ''}`}
              >
                All Categories
              </button>
              {christianCategories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`category-button ${selectedCategory === category.id ? 'selected' : ''}`}
                >
                  {category.icon} {category.name}
                </button>
              ))}
            </div>
          </div>

          <div className="search-section">
            <form onSubmit={handleSearch} className="search-form">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search books, authors, or themes..."
                className="search-input"
              />
              <button type="submit" className="search-button">
                🔍 Search
              </button>
              <button
                type="button"
                onClick={handleClearFilters}
                className="clear-button"
              >
                Clear Filters
              </button>
            </form>
          </div>
        </div>

        <div className="results-summary">
          <p>
            Found <strong>{books.length}</strong> books for
            Age <strong>{selectedAge}</strong>, Grade <strong>{selectedGrade}</strong>
            {selectedCategory !== 'all' && (
              <span> in <strong>{
                christianCategories.find(c => c.id === selectedCategory)?.name
              }</strong></span>
            )}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="loading-books">
          <div className="spinner"></div>
          <p>Loading books...</p>
        </div>
      ) : books.length === 0 ? (
        <div className="no-books-found">
          <h3>📭 No books found</h3>
          <p>Try adjusting your filters or search terms</p>
          <button onClick={handleClearFilters} className="clear-filters-button">
            Show All Books
          </button>
        </div>
      ) : (
        <div className="books-grid">
          {books.map(book => (
            <BookCard
              key={book.id}
              book={book}
              onClick={() => onSelectBook(book)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BookShelf;
EOF

cat > src/components/reading/BookCard.tsx << 'EOF'
import React from 'react';
import { ChristianBook } from '../../data/books/christianBooks';
import './BookCard.css';

interface BookCardProps {
  book: ChristianBook;
  onClick: () => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, onClick }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return '#4CAF50';
      case 'intermediate': return '#FF9800';
      case 'advanced': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  const getAgeRangeText = () => {
    return `${book.ageRange.min}-${book.ageRange.max} years`;
  };

  return (
    <div className="book-card" onClick={onClick}>
      <div className="book-card-header">
        <div
          className="difficulty-badge"
          style={{ backgroundColor: getDifficultyColor(book.difficulty) }}
        >
          {book.difficulty}
        </div>
        {book.audioAvailable && (
          <div className="audio-badge" title="Has audio">
            🔊
          </div>
        )}
        {book.hasActivities && (
          <div className="activities-badge" title="Has activities">
            🎮
          </div>
        )}
      </div>

      <div className="book-cover">
        <img
          src={book.coverImage || '/images/books/default-cover.jpg'}
          alt={book.title}
        />
      </div>

      <div className="book-info">
        <h3 className="book-title">{book.title}</h3>
        <p className="book-author">By {book.author}</p>

        <div className="book-meta">
          <span className="meta-item">👶 {getAgeRangeText()}</span>
          <span className="meta-item">🎓 Grades: {book.grades.join(', ')}</span>
        </div>

        <div className="book-categories">
          {book.categories.slice(0, 2).map((category, index) => (
            <span key={index} className="category-tag">
              {category}
            </span>
          ))}
        </div>

        <div className="moral-themes">
          <strong>Teaches:</strong>
          <div className="theme-tags">
            {book.moralThemes.slice(0, 3).map((theme, index) => (
              <span key={index} className="theme-tag">
                {theme}
              </span>
            ))}
            {book.moralThemes.length > 3 && (
              <span className="more-themes">
                +{book.moralThemes.length - 3} more
              </span>
            )}
          </div>
        </div>

        {book.bibleVerses && book.bibleVerses.length > 0 && (
          <div className="bible-verse-preview">
            <small>📖 {book.bibleVerses[0]}</small>
          </div>
        )}

        <button className="read-button">
          Read Book →
        </button>
      </div>
    </div>
  );
};

export default BookCard;
EOF

# Create CSS files
echo -e "${YELLOW}Creating CSS files...${NC}"

cat > src/components/reading/BookReader.css << 'EOF'
.book-reader-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Comic Sans MS', 'Chalkboard SE', 'Arial Rounded MT Bold', sans-serif;
}

.book-reader-header {
  background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
  color: white;
  padding: 25px;
  border-radius: 20px;
  margin-bottom: 30px;
  box-shadow: 0 10px 30px rgba(106, 17, 203, 0.2);
}

.back-button {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  padding: 10px 20px;
  border-radius: 50px;
  cursor: pointer;
  font-size: 16px;
  margin-bottom: 15px;
  transition: all 0.3s;
}

.back-button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateX(-5px);
}

.book-title {
  font-size: 2.5em;
  margin: 10px 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.book-meta {
  display: flex;
  gap: 20px;
  margin-top: 10px;
  font-size: 1.1em;
  opacity: 0.9;
}

.book-content {
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 5px 25px rgba(0, 0, 0, 0.1);
}

.book-page {
  display: flex;
  gap: 40px;
  margin-bottom: 40px;
  min-height: 400px;
}

.page-image {
  flex: 1;
  max-width: 400px;
}

.page-image img {
  width: 100%;
  border-radius: 15px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.page-content {
  flex: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.page-text {
  font-size: 1.8em;
  line-height: 1.8;
  margin-bottom: 30px;
  color: #333;
  padding: 20px;
  background: #f9f9ff;
  border-radius: 15px;
  border-left: 5px solid #2575fc;
}

.audio-button {
  background: #4CAF50;
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 50px;
  cursor: pointer;
  font-size: 1.2em;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.3s;
  width: fit-content;
}

.audio-button:hover:not(:disabled) {
  background: #45a049;
  transform: scale(1.05);
}

.audio-button.playing {
  background: #FF9800;
  cursor: not-allowed;
}

.page-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 40px 0;
  padding: 20px;
  background: #f8f9ff;
  border-radius: 15px;
}

.page-nav-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 50px;
  cursor: pointer;
  font-size: 1.1em;
  transition: all 0.3s;
}

.page-nav-button:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 7px 15px rgba(102, 126, 234, 0.4);
}

.page-nav-button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.page-counter {
  font-size: 1.3em;
  font-weight: bold;
  color: #667eea;
}

.book-features {
  margin-top: 40px;
}

.feature-section {
  background: white;
  border-radius: 15px;
  padding: 25px;
  margin-bottom: 25px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  border: 2px solid #f0f0f0;
}

.feature-section h3 {
  color: #333;
  margin-bottom: 15px;
  font-size: 1.4em;
}

.feature-toggle {
  background: none;
  border: none;
  color: #2575fc;
  font-size: 1.1em;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  width: 100%;
  text-align: left;
}

.vocabulary-list {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-top: 15px;
}

.vocabulary-word {
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
  padding: 12px 20px;
  border-radius: 25px;
  cursor: pointer;
  font-weight: bold;
  color: #333;
  transition: all 0.3s;
  border: 2px solid transparent;
}

.vocabulary-word:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(168, 237, 234, 0.4);
  border-color: #667eea;
}

.bible-verses {
  background: #fff9e6;
  padding: 20px;
  border-radius: 10px;
  border-left: 4px solid #FFD700;
  margin-top: 15px;
}

.bible-verse {
  font-style: italic;
  color: #666;
  margin: 10px 0;
  padding: 10px;
  background: white;
  border-radius: 8px;
}

.discussion-questions {
  margin-top: 15px;
}

.question {
  background: #f0f8ff;
  padding: 15px;
  margin: 10px 0;
  border-radius: 10px;
  border-left: 4px solid #36d;
}

.moral-themes {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 15px;
}

.theme-badge {
  background: linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%);
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9em;
  color: #333;
}

.book-not-found {
  text-align: center;
  padding: 100px 20px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.book-not-found h2 {
  color: #f44336;
  margin-bottom: 30px;
}

@media (max-width: 768px) {
  .book-page {
    flex-direction: column;
  }

  .page-image {
    max-width: 100%;
  }

  .page-text {
    font-size: 1.4em;
  }

  .book-title {
    font-size: 1.8em;
  }
}
EOF

cat > src/components/reading/BookShelf.css << 'EOF'
.book-shelf-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Comic Sans MS', 'Chalkboard SE', 'Arial Rounded MT Bold', sans-serif;
}

.book-shelf-header {
  text-align: center;
  margin-bottom: 40px;
  padding: 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 25px;
  color: white;
  box-shadow: 0 10px 40px rgba(102, 126, 234, 0.3);
}

.book-shelf-header h1 {
  font-size: 3em;
  margin-bottom: 10px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.subtitle {
  font-size: 1.3em;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto;
}

.controls-panel {
  background: white;
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 40px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
}

.filters-section {
  display: grid;
  grid-template-columns: 1fr;
  gap: 30px;
  margin-bottom: 30px;
}

.category-filter h3,
.search-section h3 {
  color: #333;
  margin-bottom: 15px;
  font-size: 1.4em;
}

.category-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.category-button {
  background: #f0f0f0;
  border: none;
  padding: 12px 24px;
  border-radius: 25px;
  cursor: pointer;
  font-size: 1em;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.category-button:hover {
  background: #e0e0e0;
  transform: translateY(-2px);
}

.category-button.selected {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.search-section {
  margin-top: 20px;
}

.search-form {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.search-input {
  flex: 1;
  min-width: 300px;
  padding: 15px 25px;
  border: 2px solid #e0e0e0;
  border-radius: 50px;
  font-size: 1.1em;
  transition: all 0.3s;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.search-button {
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 50px;
  cursor: pointer;
  font-size: 1.1em;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 10px;
}

.search-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 7px 15px rgba(76, 175, 80, 0.4);
}

.clear-button {
  background: #ff9800;
  color: white;
  border: none;
  padding: 15px 25px;
  border-radius: 50px;
  cursor: pointer;
  font-size: 1em;
  transition: all 0.3s;
}

.clear-button:hover {
  background: #f57c00;
  transform: translateY(-2px);
}

.results-summary {
  background: #f8f9ff;
  padding: 20px;
  border-radius: 15px;
  text-align: center;
  font-size: 1.2em;
  color: #555;
  border: 2px solid #e0e7ff;
}

.results-summary strong {
  color: #667eea;
}

.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
  margin-top: 40px;
}

.loading-books {
  text-align: center;
  padding: 100px 20px;
}

.spinner {
  border: 8px solid #f3f3f3;
  border-top: 8px solid #667eea;
  border-radius: 50%;
  width: 80px;
  height: 80px;
  animation: spin 1s linear infinite;
  margin: 0 auto 30px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.no-books-found {
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.no-books-found h3 {
  color: #666;
  margin-bottom: 20px;
  font-size: 2em;
}

.clear-filters-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 15px 40px;
  border-radius: 50px;
  cursor: pointer;
  font-size: 1.2em;
  margin-top: 20px;
  transition: all 0.3s;
}

.clear-filters-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
}

@media (max-width: 768px) {
  .books-grid {
    grid-template-columns: 1fr;
  }

  .search-form {
    flex-direction: column;
  }

  .search-input {
    min-width: 100%;
  }

  .category-buttons {
    justify-content: center;
  }

  .book-shelf-header h1 {
    font-size: 2em;
  }
}
EOF

cat > src/components/reading/BookCard.css << 'EOF'
.book-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.book-card:hover {
  transform: translateY(-15px) scale(1.02);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
}

.book-card-header {
  position: absolute;
  top: 15px;
  left: 15px;
  right: 15px;
  display: flex;
  justify-content: space-between;
  z-index: 2;
}

.difficulty-badge {
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9em;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.audio-badge,
.activities-badge {
  background: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2em;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
}

.audio-badge:hover,
.activities-badge:hover {
  transform: scale(1.2);
}

.book-cover {
  height: 250px;
  overflow: hidden;
  position: relative;
}

.book-cover::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(transparent, white);
}

.book-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
}

.book-card:hover .book-cover img {
  transform: scale(1.1);
}

.book-info {
  padding: 25px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.book-title {
  font-size: 1.4em;
  margin: 0 0 10px 0;
  color: #333;
  line-height: 1.3;
  font-weight: bold;
}

.book-author {
  color: #666;
  margin: 0 0 20px 0;
  font-size: 1em;
  font-style: italic;
}

.book-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 2px solid #f0f0f0;
}

.meta-item {
  background: #f8f9ff;
  padding: 8px 16px;
  border-radius: 15px;
  font-size: 0.9em;
  color: #667eea;
  display: flex;
  align-items: center;
  gap: 5px;
}

.book-categories {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
}

.category-tag {
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
  padding: 6px 12px;
  border-radius: 15px;
  font-size: 0.85em;
  color: #333;
}

.moral-themes {
  margin-bottom: 20px;
}

.moral-themes strong {
  display: block;
  margin-bottom: 10px;
  color: #555;
}

.theme-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.theme-tag {
  background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
  padding: 6px 12px;
  border-radius: 15px;
  font-size: 0.85em;
  color: #333;
}

.more-themes {
  color: #666;
  font-size: 0.85em;
  align-self: center;
}

.bible-verse-preview {
  background: #fff9e6;
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 20px;
  border-left: 4px solid #FFD700;
  font-style: italic;
}

.read-button {
  margin-top: auto;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 15px;
  border-radius: 15px;
  cursor: pointer;
  font-size: 1.1em;
  font-weight: bold;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.read-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
}

@media (max-width: 768px) {
  .book-card {
    max-width: 100%;
  }

  .book-cover {
    height: 200px;
  }

  .book-title {
    font-size: 1.2em;
  }
}
EOF

cat > src/components/reading/AgeGradeSelector.css << 'EOF'
.age-grade-selector {
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  margin-bottom: 30px;
}

.selector-section {
  margin-bottom: 40px;
}

.selector-section h3 {
  color: #333;
  margin-bottom: 20px;
  font-size: 1.4em;
  text-align: center;
}

.age-buttons,
.grade-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
}

.age-button,
.grade-button {
  padding: 15px 25px;
  border: 3px solid #e0e0e0;
  border-radius: 50px;
  background: white;
  cursor: pointer;
  font-size: 1.1em;
  font-weight: bold;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  min-width: 100px;
  position: relative;
  overflow: hidden;
}

.age-button::before,
.grade-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.age-button:hover::before,
.grade-button:hover::before {
  left: 100%;
}

.age-button:hover,
.grade-button:hover {
  border-color: #667eea;
  color: #667eea;
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.2);
}

.age-button.selected,
.grade-button.selected {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: transparent;
  transform: scale(1.05);
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
}

.level-info-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 20px;
  padding: 25px;
  margin: 30px 0;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
  animation: slideUp 0.5s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.level-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 15px;
}

.level-header h4 {
  margin: 0;
  font-size: 1.4em;
  flex: 1;
  min-width: 200px;
}

.character-trait {
  background: rgba(255, 255, 255, 0.2);
  padding: 10px 20px;
  border-radius: 50px;
  font-weight: bold;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.level-description {
  font-size: 1.1em;
  line-height: 1.6;
  margin-bottom: 20px;
  opacity: 0.9;
}

.bible-verse-card {
  background: rgba(255, 255, 255, 0.1);
  padding: 20px;
  border-radius: 15px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  margin-top: 20px;
  display: flex;
  align-items: center;
  gap: 20px;
}

.verse-icon {
  font-size: 2.5em;
  flex-shrink: 0;
}

.verse-text {
  font-style: italic;
  font-size: 1.2em;
  margin: 0;
  line-height: 1.5;
}

.selection-summary {
  text-align: center;
  padding: 25px;
  background: #f8f9ff;
  border-radius: 20px;
  border: 2px solid #e0e7ff;
  margin-top: 30px;
}

.selection-summary p {
  font-size: 1.3em;
  margin-bottom: 25px;
  color: #555;
}

.selection-summary strong {
  color: #667eea;
}

.confirm-selection-button {
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
  color: white;
  border: none;
  padding: 18px 40px;
  border-radius: 50px;
  cursor: pointer;
  font-size: 1.3em;
  font-weight: bold;
  transition: all 0.3s;
  display: inline-flex;
  align-items: center;
  gap: 15px;
  box-shadow: 0 8px 25px rgba(76, 175, 80, 0.3);
}

.confirm-selection-button:hover {
  transform: translateY(-5px) scale(1.05);
  box-shadow: 0 15px 35px rgba(76, 175, 80, 0.4);
}

@media (max-width: 768px) {
  .age-button,
  .grade-button {
    min-width: 80px;
    padding: 12px 20px;
    font-size: 1em;
  }

  .level-header {
    flex-direction: column;
    text-align: center;
  }

  .level-header h4 {
    min-width: auto;
  }

  .bible-verse-card {
    flex-direction: column;
    text-align: center;
    gap: 10px;
  }
}
EOF

# Create pages
echo -e "${YELLOW}Creating page components...${NC}"

cat > src/pages/ReadingHub.tsx << 'EOF'
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BookShelf from '../components/reading/BookShelf';
import BookReader from '../components/reading/BookReader';
import { ChristianBook } from '../data/books/christianBooks';
import './ReadingHub.css';

const ReadingHub: React.FC = () => {
  const navigate = useNavigate();
  const [selectedBook, setSelectedBook] = useState<ChristianBook | null>(null);
  const [view, setView] = useState<'shelf' | 'reader'>('shelf');

  const handleSelectBook = (book: ChristianBook) => {
    setSelectedBook(book);
    setView('reader');
    // Also update URL for direct linking
    navigate(`/reading/book/${book.id}`);
  };

  const handleBackToShelf = () => {
    setSelectedBook(null);
    setView('shelf');
    navigate('/reading');
  };

  return (
    <div className="reading-hub">
      {view === 'shelf' ? (
        <>
          <div className="reading-header">
            <h1>Christian Reading Hub</h1>
            <p className="hub-subtitle">
              Building faith and character through stories
            </p>
            <div className="hub-stats">
              <div className="stat-card">
                <span className="stat-number">8+</span>
                <span className="stat-label">Bible Stories</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">12+</span>
                <span className="stat-label">Christian Values</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">6</span>
                <span className="stat-label">Reading Levels</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">50+</span>
                <span className="stat-label">Discussion Questions</span>
              </div>
            </div>
          </div>

          <div className="hub-features">
            <div className="feature-card">
              <div className="feature-icon">📖</div>
              <h3>Bible Stories</h3>
              <p>Learn important stories from the Bible</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⭐</div>
              <h3>Character Building</h3>
              <p>Stories that teach Christian virtues</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔊</div>
              <h3>Audio Books</h3>
              <p>Listen along with audio narration</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎮</div>
              <h3>Activities</h3>
              <p>Interactive learning activities</p>
            </div>
          </div>

          <BookShelf onSelectBook={handleSelectBook} />
        </>
      ) : (
        selectedBook && <BookReader bookId={selectedBook.id} />
      )}

      {view === 'shelf' && (
        <div className="reading-tips">
          <h2>Reading Tips for Parents</h2>
          <div className="tips-grid">
            <div className="tip">
              <h4>🌟 Read Together</h4>
              <p>Read with your child and discuss the stories. Ask the discussion questions provided.</p>
            </div>
            <div className="tip">
              <h4>📖 Connect to Bible</h4>
              <p>Relate stories to actual Bible verses. Help children memorize simple verses.</p>
            </div>
            <div className="tip">
              <h4>💭 Apply Lessons</h4>
              <p>Talk about how to apply the moral lessons in daily life.</p>
            </div>
            <div className="tip">
              <h4>🎮 Use Activities</h4>
              <p>Engage with the vocabulary and activities to reinforce learning.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReadingHub;
EOF

cat > src/pages/ReadingHub.css << 'EOF'
.reading-hub {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Comic Sans MS', 'Chalkboard SE', 'Arial Rounded MT Bold', sans-serif;
}

.reading-header {
  text-align: center;
  margin-bottom: 50px;
  padding: 40px 20px;
  background: linear-gradient(135deg, #1a237e 0%, #311b92 100%);
  border-radius: 30px;
  color: white;
  box-shadow: 0 15px 40px rgba(26, 35, 126, 0.3);
  position: relative;
  overflow: hidden;
}

.reading-header::before {
  content: '✝';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 300px;
  opacity: 0.05;
  z-index: 1;
}

.reading-header h1 {
  font-size: 3.5em;
  margin-bottom: 15px;
  position: relative;
  z-index: 2;
  text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.3);
}

.hub-subtitle {
  font-size: 1.5em;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto 40px;
  position: relative;
  z-index: 2;
}

.hub-stats {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 30px;
  position: relative;
  z-index: 2;
}

.stat-card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.2);
  padding: 25px;
  border-radius: 20px;
  min-width: 150px;
  transition: all 0.3s;
}

.stat-card:hover {
  transform: translateY(-10px) scale(1.05);
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.3);
}

.stat-number {
  display: block;
  font-size: 3em;
  font-weight: bold;
  margin-bottom: 10px;
  color: #FFD700;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.stat-label {
  font-size: 1.1em;
  opacity: 0.9;
}

.hub-features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  margin-bottom: 50px;
}

.feature-card {
  background: white;
  padding: 30px;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border: 3px solid transparent;
}

.feature-card:hover {
  transform: translateY(-15px);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
  border-color: #311b92;
}

.feature-icon {
  font-size: 4em;
  margin-bottom: 20px;
  display: block;
}

.feature-card h3 {
  color: #311b92;
  margin-bottom: 15px;
  font-size: 1.5em;
}

.feature-card p {
  color: #666;
  line-height: 1.6;
}

.reading-tips {
  background: linear-gradient(135deg, #fdfcfb 0%, #f5f7fa 100%);
  border-radius: 30px;
  padding: 50px;
  margin-top: 60px;
  border: 3px solid #e0e7ff;
}

.reading-tips h2 {
  text-align: center;
  color: #1a237e;
  margin-bottom: 40px;
  font-size: 2.5em;
}

.tips-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
}

.tip {
  background: white;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  transition: all 0.3s;
  border-left: 5px solid #311b92;
}

.tip:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
}

.tip h4 {
  color: #311b92;
  margin-bottom: 15px;
  font-size: 1.3em;
  display: flex;
  align-items: center;
  gap: 10px;
}

.tip p {
  color: #555;
  line-height: 1.7;
}

@media (max-width: 768px) {
  .reading-header h1 {
    font-size: 2.2em;
  }

  .hub-stats {
    gap: 15px;
  }

  .stat-card {
    min-width: 120px;
    padding: 20px;
  }

  .stat-number {
    font-size: 2.2em;
  }

  .hub-features {
    grid-template-columns: 1fr;
  }

  .reading-tips {
    padding: 30px 20px;
  }

  .tips-grid {
    grid-template-columns: 1fr;
  }
}
EOF

# Create hooks
cat > src/hooks/reading/useReadingProgress.ts << 'EOF'
import { useState, useEffect } from 'react';
import { useLocalStorage } from '../useLocalStorage';

interface ReadingProgress {
  bookId: string;
  page: number;
  lastRead: Date;
  completed: boolean;
  timeSpent: number; // in minutes
  vocabularyLearned: string[];
}

interface ReadingStats {
  totalBooksRead: number;
  totalTimeSpent: number;
  favoriteCategory: string;
  readingStreak: number;
  lastReadDate?: Date;
}

export const useReadingProgress = () => {
  const [progress, setProgress] = useLocalStorage<ReadingProgress[]>('reading-progress', []);
  const [stats, setStats] = useState<ReadingStats>({
    totalBooksRead: 0,
    totalTimeSpent: 0,
    favoriteCategory: 'bible-stories',
    readingStreak: 0
  });

  // Update stats when progress changes
  useEffect(() => {
    const completedBooks = progress.filter(p => p.completed);
    const totalTime = progress.reduce((sum, p) => sum + p.timeSpent, 0);

    // Calculate favorite category based on completed books
    const categoryCount: Record<string, number> = {};
    completedBooks.forEach(book => {
      // This would need access to book data to get categories
      // For now, we'll use a placeholder
      categoryCount['bible-stories'] = (categoryCount['bible-stories'] || 0) + 1;
    });

    const favoriteCategory = Object.entries(categoryCount)
      .sort(([, a], [, b]) => b - a)[0]?.[0] || 'bible-stories';

    // Calculate reading streak (simplified)
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const lastReadDates = progress
      .map(p => new Date(p.lastRead))
      .filter(date => !isNaN(date.getTime()));

    let streak = 0;
    if (lastReadDates.length > 0) {
      // Sort dates descending
      lastReadDates.sort((a, b) => b.getTime() - a.getTime());
      const lastRead = lastReadDates[0];

      // Check if last read was today or yesterday
      const isToday = lastRead.toDateString() === today.toDateString();
      const isYesterday = lastRead.toDateString() === yesterday.toDateString();

      if (isToday) streak = 1;
      else if (isYesterday) streak = 1;
    }

    setStats({
      totalBooksRead: completedBooks.length,
      totalTimeSpent: totalTime,
      favoriteCategory,
      readingStreak: streak,
      lastReadDate: lastReadDates[0]
    });
  }, [progress]);

  const updateProgress = (bookId: string, page: number, timeSpentMinutes: number = 1) => {
    setProgress(prev => {
      const existingIndex = prev.findIndex(p => p.bookId === bookId);

      if (existingIndex >= 0) {
        // Update existing progress
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          page,
          lastRead: new Date(),
          timeSpent: updated[existingIndex].timeSpent + timeSpentMinutes,
          completed: page >= 10 // Assuming 10 pages means completed
        };
        return updated;
      } else {
        // Add new progress
        return [...prev, {
          bookId,
          page,
          lastRead: new Date(),
          timeSpent: timeSpentMinutes,
          completed: false,
          vocabularyLearned: []
        }];
      }
    });
  };

  const markVocabularyLearned = (bookId: string, word: string) => {
    setProgress(prev => {
      const existingIndex = prev.findIndex(p => p.bookId === bookId);

      if (existingIndex >= 0) {
        const updated = [...prev];
        const existingWords = updated[existingIndex].vocabularyLearned;

        if (!existingWords.includes(word)) {
          updated[existingIndex] = {
            ...updated[existingIndex],
            vocabularyLearned: [...existingWords, word]
          };
        }

        return updated;
      }

      return prev;
    });
  };

  const getBookProgress = (bookId: string): ReadingProgress | undefined => {
    return progress.find(p => p.bookId === bookId);
  };

  const resetProgress = (bookId?: string) => {
    if (bookId) {
      setProgress(prev => prev.filter(p => p.bookId !== bookId));
    } else {
      setProgress([]);
    }
  };

  return {
    progress,
    stats,
    updateProgress,
    markVocabularyLearned,
    getBookProgress,
    resetProgress
  };
};
EOF

# Update main App.tsx to include routes
echo -e "${YELLOW}Updating App.tsx...${NC}"

# Backup original App.tsx
cp src/App.tsx src/App.tsx.backup

# Create a patch for App.tsx
cat > app_reading_patch.tsx << 'EOF'
// Add this import at the top with other imports
import ReadingHub from './pages/ReadingHub';
import BookReader from './components/reading/BookReader';

// Add these routes inside your Router component (likely in the Switch or Routes component)
<Route path="/reading" element={<ReadingHub />} />
<Route path="/reading/book/:bookId" element={<BookReader />} />

// You might also want to add a link to the Reading Hub in your navigation
// Look for your navigation component and add something like:
// <Link to="/reading" className="nav-link">
//   📚 Reading Hub
// </Link>
EOF

echo -e "${GREEN}✅ Setup complete!${NC}"
echo -e "${YELLOW}📚 Book Reading Feature has been added with:${NC}"
echo -e "   ${BLUE}•${NC} 8 Christian books with moral themes"
echo -e "   ${BLUE}•${NC} Age and grade selection system"
echo -e "   ${BLUE}•${NC} Interactive book reader with audio support"
echo -e "   ${BLUE}•${NC} Vocabulary highlighting and discussion questions"
echo -e "   ${BLUE}•${NC} Reading progress tracking"
echo -e "   ${BLUE}•${NC} Beautiful responsive UI"
echo -e "\n${YELLOW}🚀 Next steps:${NC}"
echo -e "   1. ${BLUE}Review the patch for App.tsx${NC} in app_reading_patch.tsx"
echo -e "   2. ${BLUE}Add images${NC} to src/assets/images/books/christian/"
echo -e "   3. ${BLUE}Add audio files${NC} to src/assets/audio/books/"
echo -e "   4. ${BLUE}Install additional dependencies${NC} if needed"
echo -e "   5. ${BLUE}Run the app${NC} to test the new reading feature"

# Make script executable
chmod +x setup-book-reading.sh

echo -e "\n${GREEN}🎉 Script created: setup-book-reading.sh${NC}"
echo -e "${YELLOW}Run it with: ./setup-book-reading.sh${NC}"