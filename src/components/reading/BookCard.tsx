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
