import React, { useState, useEffect } from 'react'
import { bibleApi, BibleVersion, BibleVerse, DailyVerse } from '../../../services/bibleApi'
import './BibleApiDashboard.css'

interface BibleApiDashboardProps {
  onGameSelect: (game: string) => void
}

const BibleApiDashboard: React.FC<BibleApiDashboardProps> = ({ onGameSelect }) => {
  const [dailyVerse, setDailyVerse] = useState<DailyVerse | null>(null)
  const [randomVerse, setRandomVerse] = useState<BibleVerse | null>(null)
  const [selectedVersion, setSelectedVersion] = useState<BibleVersion>('KJV')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<BibleVerse[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [favoriteVerses, setFavoriteVerses] = useState<string[]>([])
  const [stats, setStats] = useState({
    versesRead: 0,
    gamesPlayed: 0,
    totalScore: 0
  })

  useEffect(() => {
    loadDashboardData()
    loadStats()
    loadFavorites()
  }, [])

  useEffect(() => {
    if (searchQuery.length >= 3) {
      handleSearch()
    } else {
      setSearchResults([])
    }
  }, [searchQuery])

  const loadDashboardData = async () => {
    try {
      const [daily, random] = await Promise.all([
        bibleApi.getDailyVerse(),
        bibleApi.getRandomVerse(selectedVersion)
      ])

      setDailyVerse(daily)
      setRandomVerse(random)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    }
  }

  const loadStats = () => {
    // Load from localStorage
    const savedStats = localStorage.getItem('bible_game_stats')
    if (savedStats) {
      setStats(JSON.parse(savedStats))
    }
  }

  const loadFavorites = () => {
    const savedFavorites = localStorage.getItem('bible_favorites')
    if (savedFavorites) {
      setFavoriteVerses(JSON.parse(savedFavorites))
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    try {
      const results = await bibleApi.searchBible(searchQuery, selectedVersion)
      setSearchResults(results.results.slice(0, 5))
    } catch (error) {
      console.error('Error searching:', error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleAddFavorite = (reference: string) => {
    if (!favoriteVerses.includes(reference)) {
      const newFavorites = [...favoriteVerses, reference]
      setFavoriteVerses(newFavorites)
      localStorage.setItem('bible_favorites', JSON.stringify(newFavorites))
    }
  }

  const handleRemoveFavorite = (reference: string) => {
    const newFavorites = favoriteVerses.filter(fav => fav !== reference)
    setFavoriteVerses(newFavorites)
    localStorage.setItem('bible_favorites', JSON.stringify(newFavorites))
  }

  const handleVersionChange = (version: BibleVersion) => {
    setSelectedVersion(version)
    loadDashboardData()
  }

  const handleClearCache = () => {
    bibleApi.clearCache()
    alert('Cache cleared successfully!')
  }

  const games = [
    { id: 'reading', name: 'Bible Reading', icon: '📖', description: 'Read faith-based stories' },
    { id: 'trivia', name: 'Bible Trivia', icon: '❓', description: 'Test your Bible knowledge' },
    { id: 'memorizer', name: 'Verse Memorizer', icon: '💭', description: 'Memorize Bible verses' },
    { id: 'study', name: 'Bible Study', icon: '📚', description: 'Study the Word deeply' },
    { id: 'quiz', name: 'Bible Quiz', icon: '🎯', description: 'Challenge yourself' }
  ]

  return (
    <div className="bible-api-dashboard">
      <div className="dashboard-header">
        <div className="header-title">
          <h1><span className="title-icon">📖</span> Bible Games Dashboard</h1>
          <p className="header-subtitle">Explore, Learn, and Grow in God's Word</p>
        </div>

        <div className="header-actions">
          <div className="version-selector">
            <label>Bible Version:</label>
            <select
              value={selectedVersion}
              onChange={(e) => handleVersionChange(e.target.value as BibleVersion)}
              className="version-select"
            >
              <option value="KJV">KJV</option>
              <option value="NIV">NIV</option>
              <option value="ESV">ESV</option>
              <option value="NASB">NASB</option>
              <option value="NKJV">NKJV</option>
              <option value="NLT">NLT</option>
            </select>
          </div>

          <button className="clear-cache-btn" onClick={handleClearCache}>
            Clear Cache
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="left-column">
          <div className="daily-verse-card">
            <div className="card-header">
              <span className="card-icon">🌅</span>
              <h3>Daily Verse</h3>
              <span className="card-date">{dailyVerse?.date || 'Today'}</span>
            </div>
            <div className="verse-content">
              <div className="verse-text">{dailyVerse?.text || 'Loading...'}</div>
              <div className="verse-reference">
                {dailyVerse?.reference || ''}
                <span className="verse-theme">{dailyVerse?.theme || 'inspiration'}</span>
              </div>
            </div>
            <button
              className="favorite-btn"
              onClick={() => dailyVerse && handleAddFavorite(dailyVerse.reference)}
            >
              ❤️ Add to Favorites
            </button>
          </div>

          <div className="search-section">
            <div className="search-header">
              <span className="search-icon">🔍</span>
              <h3>Search the Bible</h3>
            </div>
            <div className="search-box">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for verses (e.g., 'love', 'faith', 'hope')..."
                className="search-input"
              />
              <button
                onClick={handleSearch}
                disabled={isSearching || searchQuery.length < 3}
                className="search-btn"
              >
                {isSearching ? 'Searching...' : 'Search'}
              </button>
            </div>

            {searchResults.length > 0 && (
              <div className="search-results">
                <h4>Search Results:</h4>
                {searchResults.map((result, index) => (
                  <div key={index} className="search-result">
                    <div className="result-text">{result.text.substring(0, 100)}...</div>
                    <div className="result-reference">{result.reference}</div>
                    <button
                      className="result-favorite-btn"
                      onClick={() => handleAddFavorite(result.reference)}
                    >
                      ❤️
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="favorites-section">
            <div className="favorites-header">
              <span className="favorites-icon">⭐</span>
              <h3>Favorite Verses</h3>
              <span className="favorites-count">{favoriteVerses.length}</span>
            </div>
            <div className="favorites-list">
              {favoriteVerses.length === 0 ? (
                <div className="no-favorites">No favorite verses yet</div>
              ) : (
                favoriteVerses.map((verse, index) => (
                  <div key={index} className="favorite-item">
                    <span className="favorite-reference">{verse}</span>
                    <button
                      className="remove-favorite-btn"
                      onClick={() => handleRemoveFavorite(verse)}
                    >
                      🗑️
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="right-column">
          <div className="games-section">
            <div className="games-header">
              <span className="games-icon">🎮</span>
              <h3>Bible Games</h3>
            </div>
            <div className="games-grid">
              {games.map(game => (
                <div
                  key={game.id}
                  className="game-card"
                  onClick={() => onGameSelect(game.id)}
                >
                  <div className="game-icon">{game.icon}</div>
                  <div className="game-name">{game.name}</div>
                  <div className="game-description">{game.description}</div>
                  <button className="play-btn">Play Now →</button>
                </div>
              ))}
            </div>
          </div>

          <div className="stats-section">
            <div className="stats-header">
              <span className="stats-icon">📊</span>
              <h3>Your Statistics</h3>
            </div>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">📖</div>
                <div className="stat-value">{stats.versesRead}</div>
                <div className="stat-label">Verses Read</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🎮</div>
                <div className="stat-value">{stats.gamesPlayed}</div>
                <div className="stat-label">Games Played</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">⭐</div>
                <div className="stat-value">{stats.totalScore}</div>
                <div className="stat-label">Total Score</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📈</div>
                <div className="stat-value">--</div>
                <div className="stat-label">Daily Streak</div>
              </div>
            </div>
          </div>

          <div className="api-info-section">
            <div className="api-info-header">
              <span className="api-info-icon">⚙️</span>
              <h3>API Information</h3>
            </div>
            <div className="api-info-content">
              <div className="api-status">
                <div className="status-indicator active"></div>
                <span className="status-text">Bible API Connected</span>
              </div>
              <div className="api-details">
                <div className="detail-item">
                  <span className="detail-label">Current Version:</span>
                  <span className="detail-value">{selectedVersion}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Cache Size:</span>
                  <span className="detail-value">--</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Last Updated:</span>
                  <span className="detail-value">Just now</span>
                </div>
              </div>
            </div>
          </div>

          {randomVerse && (
            <div className="random-verse-card">
              <div className="card-header">
                <span className="card-icon">🎲</span>
                <h3>Random Verse</h3>
                <button
                  className="refresh-btn"
                  onClick={() => loadDashboardData()}
                >
                  🔄 New Verse
                </button>
              </div>
              <div className="verse-content">
                <div className="verse-text">{randomVerse.text}</div>
                <div className="verse-reference">
                  {randomVerse.reference}
                  <span className="verse-version">{selectedVersion}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BibleApiDashboard
