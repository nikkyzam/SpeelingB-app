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

  const loadBooks = async () => {
    setLoading(true);

    try {
      // Ensure online books are fetched at least once
      if (BookService.getAllAvailableBooks().length <= 8) {
        await BookService.fetchOnlineBooks();
      }

      let filteredBooks: ChristianBook[] = [];

      // Get combined books
      filteredBooks = await BookService.getBooksByAge(selectedAge);

      // Further filter by grade
      filteredBooks = filteredBooks.filter(book =>
        book.grades.includes(selectedGrade)
      );

      // Filter by category
      if (selectedCategory !== 'all') {
        filteredBooks = filteredBooks.filter(book =>
          book.categories.includes(selectedCategory) || 
          (selectedCategory === 'bible-stories' && book.categories.includes('bible'))
        );
      }

      // Apply search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        filteredBooks = filteredBooks.filter(book =>
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query) ||
          book.moralThemes.some(theme =>
            theme.toLowerCase().includes(query)
          )
        );
      }

      setBooks(filteredBooks);
    } catch (error) {
      console.error('Error loading books:', error);
    } finally {
      setLoading(false);
    }
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
              <button
                onClick={() => setSelectedCategory('online')}
                className={`category-button ${selectedCategory === 'online' ? 'selected' : ''}`}
              >
                🌐 Online Books
              </button>
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
