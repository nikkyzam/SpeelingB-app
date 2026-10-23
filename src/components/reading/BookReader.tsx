import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BookService } from '../../services/books/bookService';
import { ChristianBook } from '../../data/books/christianBooks';
import './BookReader.css';
import { useAudio } from '../../contexts/AudioContext';

interface BookReaderProps {
  bookId?: string;
}

const BookReader: React.FC<BookReaderProps> = ({ bookId: propBookId }) => {
  const { bookId: paramBookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();
  const bookId = propBookId || paramBookId || '';
  const { speak, stopSpeaking, isSpeaking, speechError } = useAudio();
  const stop = React.useRef(stopSpeaking);
  stop.current = stopSpeaking;

  const [book, setBook] = useState<ChristianBook | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showVocabulary, setShowVocabulary] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setBook(null);
    let savedPage = 0;
    try { const saved = JSON.parse(localStorage.getItem('reading_resume') || '{}'); if (saved.bookId === bookId) savedPage = Math.max(0, Number(saved.page) || 0); } catch { /* start at the beginning */ }
    setCurrentPage(savedPage);
    // No id, nothing to fetch — but still clear a book or spinner from before.
    if (!bookId) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    const load = async () => {
      try {
        const loaded = await BookService.fetchFullBookContent(bookId);
        if (!cancelled) { setBook(loaded || null); setCurrentPage(Math.min(savedPage, Math.max(0, (loaded?.pages.length || 1) - 1))); }
      } catch (error) {
        console.error('Error loading book:', error);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    void load();
    return () => { cancelled = true; stop.current(); };
  }, [bookId]);

  useEffect(() => {
    stop.current();
    setIsPlayingAudio(false);
    if (book) localStorage.setItem('reading_resume', JSON.stringify({ bookId, page: currentPage }));
  }, [currentPage, book, bookId]);

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
    if (isPlayingAudio || isSpeaking) { stopSpeaking(); setIsPlayingAudio(false); }
    else { setIsPlayingAudio(true); void speak(currentPageData.content).finally(() => setIsPlayingAudio(false)); }
  };

  const handleVocabularyClick = (word: string) => {
    void speak(word);
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
          <div className="story-illustration" aria-hidden>
            {{ 'cbook-001': '🌳', 'cbook-002': '🌈', 'cbook-003': '🛡️', 'cbook-004': '🤝', 'cbook-005': '💛', 'cbook-006': '🍎', 'cbook-007': '🌟', 'cbook-008': '🕊️' }[book.id] || '📖'}
          </div>

          <div className="page-content">
            <div className="page-text">
              {currentPageData.content}
            </div>

            { (currentPageData.audioUrl || book.audioAvailable) && (
              <button
                onClick={handlePlayAudio}
                className={`audio-button ${isPlayingAudio || isSpeaking ? 'playing' : ''}`}
              >
                {isPlayingAudio || isSpeaking ? '■ Stop reading' : '🔊 Listen'}
              </button>
            )}
            {speechError && <p role="status">Read aloud is not available right now. You can still read this page or ask someone to read with you.</p>}
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
                  <button
                    key={index}
                    className="vocabulary-word"
                    onClick={() => handleVocabularyClick(word)}
                    title="Hear this word"
                  >
                    {word}
                  </button>
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
      {currentPage === totalPages - 1 && <section className="card"><h2>You finished this story!</h2><p>Great reading. You can stop here or choose another story.</p><button className="btn" onClick={() => navigate('/reading')}>Done for now</button></section>}
    </div>
  );
};

export default BookReader;
