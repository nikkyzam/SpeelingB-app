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
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadBook();
  }, [bookId]);

  const loadBook = async () => {
    if (!bookId) return;
    
    setIsLoading(true);
    try {
      // First get basic book info
      const fetchedBook = BookService.getBookById(bookId);
      if (fetchedBook) {
        setBook(fetchedBook);
        
        // If it's an online book and doesn't have full content yet, fetch it
        if (bookId.startsWith('api-') || bookId.startsWith('guten-')) {
          const fullBook = await BookService.fetchFullBookContent(bookId);
          if (fullBook) {
            setBook({ ...fullBook });
          }
        }
      }
    } catch (error) {
      console.error('Error loading book:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !book) {
    return (
      <div className="book-reader-container">
        <div className="book-loading">
          <div className="spinner"></div>
          <p>Opening your book...</p>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="book-reader-container">
        <div className="book-not-found">
          <h2>Book Not Found</h2>
          <button onClick={() => navigate('/reading')} className="back-button">
            ← Back to Library
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
    if (currentPageData.audioUrl || book.audioAvailable) {
      setIsPlayingAudio(true);
      // Use speech synthesis if no audioUrl but audio is available
      if (!currentPageData.audioUrl && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(currentPageData.content);
        utterance.onend = () => setIsPlayingAudio(false);
        window.speechSynthesis.speak(utterance);
      } else {
        setTimeout(() => setIsPlayingAudio(false), 3000);
      }
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

            { (currentPageData.audioUrl || book.audioAvailable) && (
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
