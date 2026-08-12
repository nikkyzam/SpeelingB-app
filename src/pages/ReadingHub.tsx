import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BookShelf from '../components/reading/BookShelf';
import BookReader from '../components/reading/BookReader';
import { ChristianBook } from '../data/books/christianBooks';
import './ReadingHub.css';

const ReadingHub: React.FC = () => {
  const navigate = useNavigate();
  const { bookId } = useParams<{ bookId: string }>();
  const [selectedBook, setSelectedBook] = useState<ChristianBook | null>(null);
  const [view, setView] = useState<'shelf' | 'reader'>('shelf');

  useEffect(() => {
    if (bookId) {
      setView('reader');
    } else {
      setView('shelf');
      setSelectedBook(null);
    }
  }, [bookId]);

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
        <BookReader bookId={bookId} />
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
