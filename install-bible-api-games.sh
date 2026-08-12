#!/bin/bash

echo "📖 Installing Bible Games with API Integration..."

# Create directories
mkdir -p src/components/games/BibleTriviaEnhanced
mkdir -p src/components/games/BibleMemorizer
mkdir -p src/components/games/BibleApiDashboard
mkdir -p src/services

# Install axios if not already installed
if ! npm list axios &>/dev/null; then
  echo "Installing axios for API calls..."
  npm install axios
fi

# Create files
echo "Creating Bible API service..."
cat > src/services/bibleApi.ts << 'API'
[The Bible API service code from above]
API

echo "Creating Enhanced Bible Trivia game..."
cat > src/components/games/BibleTriviaEnhanced/index.tsx << 'TRIVIA'
[The Enhanced Bible Trivia game code from above]
TRIVIA

cat > src/components/games/BibleTriviaEnhanced/BibleTriviaEnhanced.css << 'TRIVIA_CSS'
[The Enhanced Bible Trivia CSS from above]
TRIVIA_CSS

echo "Creating Bible Memorizer game..."
cat > src/components/games/BibleMemorizer/index.tsx << 'MEMORIZER'
[The Bible Memorizer game code from above]
MEMORIZER

cat > src/components/games/BibleMemorizer/BibleMemorizer.css << 'MEMORIZER_CSS'
[The Bible Memorizer CSS code - create empty and add content]
MEMORIZER_CSS

echo "Creating Bible API Dashboard..."
cat > src/components/games/BibleApiDashboard/index.tsx << 'DASHBOARD'
[The Bible API Dashboard code from above]
DASHBOARD

cat > src/components/games/BibleApiDashboard/BibleApiDashboard.css << 'DASHBOARD_CSS'
[Dashboard CSS code - create empty and add content]
DASHBOARD_CSS

echo "Updating game exports..."
# Update or create barrel export
if [ -f "src/components/games/index.ts" ]; then
  # Backup
  cp src/components/games/index.ts src/components/games/index.ts.bak

  # Add new games to existing export
  cat >> src/components/games/index.ts << 'EXPORTS'

// Bible Games with API Integration
export { default as BibleTriviaEnhanced } from './BibleTriviaEnhanced'
export { default as BibleMemorizer } from './BibleMemorizer'
EXPORTS
else
  # Create new export file
  cat > src/components/games/index.ts << 'EXPORTS'
// Bible Games with API Integration
export { default as BibleTriviaEnhanced } from './BibleTriviaEnhanced'
export { default as BibleMemorizer } from './BibleMemorizer'
export { default as BibleApiDashboard } from './BibleApiDashboard'

// Original Bible Games (if they exist)
export { default as BibleTrivia } from './BibleTrivia'
export { default as BibleStudy } from './BibleStudy'
EXPORTS
fi

# Create CSS files
cat > src/components/games/BibleMemorizer/BibleMemorizer.css << 'MEMCSS'
.bible-memorizer {
  max-width: 1000px;
  margin: 0 auto;
  padding: var(--spacing-lg);
  background: linear-gradient(135deg, #1a2980 0%, #26d0ce 100%);
  border-radius: var(--radius-lg);
  color: white;
}

.game-header {
  margin-bottom: var(--spacing-xl);
  padding: var(--spacing-lg);
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-lg);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
}

.game-title {
  font-size: 2.5rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  color: #FFD700;
}

.title-icon {
  font-size: 2.8rem;
  animation: gentleBounce 2s infinite;
}

@keyframes gentleBounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.version-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-lg);
}

.version-label {
  font-size: 0.9rem;
  opacity: 0.8;
}

.version-name {
  font-weight: bold;
  color: #FFD700;
}

.game-stats {
  display: flex;
  gap: var(--spacing-md);
  justify-content: space-between;
}

.stat {
  text-align: center;
  padding: var(--spacing-sm) var(--spacing-md);
  background: rgba(0, 0, 0, 0.3);
  border-radius: var(--radius-lg);
  flex: 1;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.stat-label {
  display: block;
  font-size: 0.7rem;
  opacity: 0.8;
  margin-bottom: var(--spacing-xs);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  display: block;
  font-size: 1.4rem;
  font-weight: bold;
  font-family: monospace;
}

.stat-value.time-left {
  animation: pulse 1s infinite;
}

.stat-value.multiplier {
  color: #FFD700;
}

.stage-badge {
  color: #FFD700;
  font-weight: bold;
}

.verse-section {
  margin-bottom: var(--spacing-xl);
  padding: var(--spacing-xl);
  background: rgba(0, 0, 0, 0.3);
  border-radius: var(--radius-lg);
  border: 2px solid rgba(255, 215, 0, 0.3);
}

.verse-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xl);
  padding: var(--spacing-lg);
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-lg);
}

.verse-reference {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
}

.reference-icon {
  font-size: 1.5rem;
}

.reference-text {
  font-weight: bold;
  font-size: 1.3rem;
  color: #FFD700;
}

.verse-category {
  padding: var(--spacing-xs) var(--spacing-sm);
  background: rgba(255, 215, 0, 0.2);
  border-radius: var(--radius-md);
  font-size: 0.8rem;
  font-weight: bold;
  text-transform: uppercase;
}

.stage-info {
  text-align: right;
}

.stage-progress {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.stage-label {
  font-size: 0.9rem;
  opacity: 0.8;
  margin-bottom: var(--spacing-xs);
}

.stage-levels {
  display: flex;
  gap: var(--spacing-sm);
}

.stage-level {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-lg);
  font-weight: bold;
  transition: all 0.3s;
}

.stage-level.active {
  background: linear-gradient(135deg, #FF6B6B, #FF8E8E);
  transform: scale(1.1);
  box-shadow: 0 0 15px rgba(255, 107, 107, 0.4);
}

.stage-level.completed {
  background: linear-gradient(135deg, #4ECDC4, #06D6A0);
  opacity: 0.8;
}

.verse-display {
  margin-bottom: var(--spacing-xl);
  padding: var(--spacing-lg);
  background: rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-lg);
  min-height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.verse-text {
  font-size: 1.4rem;
  line-height: 1.8;
  text-align: center;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--spacing-xs);
  align-items: center;
}

.word-container {
  position: relative;
  display: inline-block;
}

.verse-input {
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 215, 0, 0.5);
  border-radius: var(--radius-md);
  color: white;
  padding: var(--spacing-sm);
  font-size: 1.2rem;
  text-align: center;
  font-family: inherit;
  transition: all 0.3s;
}

.verse-input:focus {
  outline: none;
  border-color: #FFD700;
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
}

.verse-input.correct {
  border-color: #06D6A0;
  background: rgba(6, 214, 160, 0.1);
}

.verse-input.incorrect {
  border-color: #FF6B6B;
  background: rgba(239, 71, 111, 0.1);
}

.verse-input:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.word-hint {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.8rem;
  color: #FFD700;
  background: rgba(0, 0, 0, 0.8);
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  white-space: nowrap;
  z-index: 10;
}

.verse-word {
  margin-right: var(--spacing-xs);
}

.verse-feedback {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(78, 205, 196, 0.1));
  border-radius: var(--radius-lg);
  margin-top: var(--spacing-lg);
  animation: slideIn 0.3s ease;
}

.feedback-icon {
  font-size: 1.8rem;
}

.feedback-text {
  font-size: 1.2rem;
  font-weight: bold;
  color: #FFD700;
}

.memorization-help {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-lg);
  padding: var(--spacing-lg);
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-lg);
}

.help-tip {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-lg);
}

.tip-icon {
  font-size: 1.2rem;
  color: #FFD700;
}

.tip-text {
  flex: 1;
  font-size: 0.9rem;
  opacity: 0.9;
}

.stage-progress-section {
  margin-bottom: var(--spacing-xl);
  padding: var(--spacing-lg);
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-lg);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.progress-info {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--spacing-xl);
}

.progress-item {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.progress-label {
  font-size: 0.9rem;
  opacity: 0.8;
}

.progress-bar {
  height: 10px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-xl);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #FFD700, #FF6B6B);
  border-radius: var(--radius-xl);
  transition: width 0.5s ease;
}

.progress-text {
  font-size: 0.9rem;
  opacity: 0.9;
  text-align: center;
}

.difficulty-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: rgba(0, 0, 0, 0.3);
  border-radius: var(--radius-lg);
}

.difficulty-label {
  font-size: 0.9rem;
  opacity: 0.8;
  margin-bottom: var(--spacing-xs);
}

.difficulty-details {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.detail-item {
  padding: var(--spacing-xs) var(--spacing-sm);
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-md);
  font-size: 0.9rem;
}

.game-footer {
  padding: var(--spacing-lg);
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-lg);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.scoring-breakdown {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.breakdown-title {
  font-size: 1.2rem;
  font-weight: bold;
  color: #FFD700;
  margin-bottom: var(--spacing-sm);
}

.breakdown-items {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: var(--spacing-md);
}

.breakdown-item {
  padding: var(--spacing-md);
  background: rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-lg);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.breakdown-item.total {
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 107, 107, 0.2));
}

.item-label {
  font-size: 0.8rem;
  opacity: 0.8;
}

.item-value {
  font-size: 1.1rem;
  font-weight: bold;
  color: #FFD700;
}

.bible-memorizer-loading {
  text-align: center;
  padding: var(--spacing-xl);
  background: linear-gradient(135deg, #1a2980 0%, #26d0ce 100%);
  border-radius: var(--radius-lg);
  color: white;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-lg);
  padding: var(--spacing-xl);
}

.loading-icon {
  font-size: 4rem;
  animation: gentleBounce 2s infinite;
}

.loading-text {
  font-size: 1.5rem;
  font-weight: bold;
  color: #FFD700;
}

.loading-subtext {
  font-size: 1rem;
  opacity: 0.8;
  font-style: italic;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

@media (max-width: 768px) {
  .bible-memorizer {
    padding: var(--spacing-md);
  }

  .game-stats {
    flex-wrap: wrap;
  }

  .stat {
    min-width: 120px;
  }

  .verse-header {
    flex-direction: column;
    gap: var(--spacing-lg);
    text-align: center;
  }

  .memorization-help {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
  }

  .progress-info {
    grid-template-columns: 1fr;
    gap: var(--spacing-lg);
  }

  .breakdown-items {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
  }

  .verse-text {
    font-size: 1.2rem;
  }

  .verse-input {
    font-size: 1rem;
  }
}
MEMCSS

cat > src/components/games/BibleApiDashboard/BibleApiDashboard.css << 'DASHCSS'
.bible-api-dashboard {
  max-width: 1400px;
  margin: 0 auto;
  padding: var(--spacing-lg);
  background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
  border-radius: var(--radius-lg);
  color: white;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xl);
  padding: var(--spacing-xl);
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-lg);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.header-title h1 {
  font-size: 2.5rem;
  margin: 0;
  color: #FFD700;
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.title-icon {
  font-size: 2.8rem;
  animation: gentleGlow 2s infinite alternate;
}

.header-subtitle {
  font-size: 1.1rem;
  opacity: 0.8;
  margin-top: var(--spacing-sm);
  font-style: italic;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-xl);
}

.version-selector {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.version-selector label {
  font-weight: bold;
  color: #FFD700;
}

.version-select {
  padding: var(--spacing-sm) var(--spacing-lg);
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: var(--radius-lg);
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
}

.version-select:hover {
  background: rgba(255, 255, 255, 0.15);
}

.version-select:focus {
  outline: none;
  border-color: #FFD700;
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
}

.clear-cache-btn {
  padding: var(--spacing-sm) var(--spacing-lg);
  background: linear-gradient(135deg, #FF6B6B, #FF8E8E);
  color: white;
  border: none;
  border-radius: var(--radius-lg);
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
}

.clear-cache-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
}

.dashboard-content {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-xl);
}

.left-column,
.right-column {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.daily-verse-card,
.search-section,
.favorites-section,
.games-section,
.stats-section,
.api-info-section,
.random-verse-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.card-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
  padding-bottom: var(--spacing-md);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.card-header h3 {
  margin: 0;
  color: #FFD700;
  font-size: 1.3rem;
}

.card-icon {
  font-size: 1.5rem;
}

.card-date {
  margin-left: auto;
  font-size: 0.9rem;
  opacity: 0.8;
}

.verse-content {
  margin-bottom: var(--spacing-lg);
}

.verse-text {
  font-size: 1.2rem;
  line-height: 1.6;
  margin-bottom: var(--spacing-md);
  font-style: italic;
  min-height: 80px;
}

.verse-reference {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
  color: #FFD700;
}

.verse-theme,
.verse-version {
  padding: var(--spacing-xs) var(--spacing-sm);
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-md);
  font-size: 0.8rem;
  font-weight: bold;
  text-transform: uppercase;
}

.favorite-btn,
.refresh-btn {
  width: 100%;
  padding: var(--spacing-md);
  background: linear-gradient(135deg, #FF6B6B, #FF8E8E);
  color: white;
  border: none;
  border-radius: var(--radius-lg);
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
}

.favorite-btn:hover,
.refresh-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
}

.search-header,
.favorites-header,
.games-header,
.stats-header,
.api-info-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.search-header h3,
.favorites-header h3,
.games-header h3,
.stats-header h3,
.api-info-header h3 {
  margin: 0;
  color: #FFD700;
}

.search-icon,
.favorites-icon,
.games-icon,
.stats-icon,
.api-info-icon {
  font-size: 1.5rem;
}

.favorites-count {
  margin-left: auto;
  padding: var(--spacing-xs) var(--spacing-sm);
  background: rgba(255, 215, 0, 0.3);
  border-radius: var(--radius-md);
  font-weight: bold;
  color: #FFD700;
}

.search-box {
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.search-input {
  flex: 1;
  padding: var(--spacing-md) var(--spacing-lg);
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: var(--radius-lg);
  color: white;
  font-size: 1rem;
  transition: all 0.3s;
}

.search-input:focus {
  outline: none;
  border-color: #FFD700;
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.search-btn {
  padding: var(--spacing-md) var(--spacing-xl);
  background: linear-gradient(135deg, #4ECDC4, #06D6A0);
  color: white;
  border: none;
  border-radius: var(--radius-lg);
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.search-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(78, 205, 196, 0.4);
}

.search-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.search-results {
  margin-top: var(--spacing-lg);
}

.search-results h4 {
  color: #FFD700;
  margin-bottom: var(--spacing-md);
}

.search-result {
  padding: var(--spacing-md);
  background: rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-lg);
  margin-bottom: var(--spacing-md);
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.result-text {
  flex: 1;
  font-size: 0.9rem;
  opacity: 0.9;
}

.result-reference {
  font-weight: bold;
  color: #FFD700;
  min-width: 80px;
}

.result-favorite-btn {
  background: none;
  border: none;
  color: #FF6B6B;
  font-size: 1.2rem;
  cursor: pointer;
  transition: transform 0.2s;
}

.result-favorite-btn:hover {
  transform: scale(1.2);
}

.favorites-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.no-favorites {
  text-align: center;
  padding: var(--spacing-lg);
  opacity: 0.5;
  font-style: italic;
}

.favorite-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-md);
  background: rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-lg);
}

.favorite-reference {
  font-weight: bold;
  color: #FFD700;
}

.remove-favorite-btn {
  background: none;
  border: none;
  color: #FF6B6B;
  cursor: pointer;
  font-size: 1rem;
  opacity: 0.7;
  transition: all 0.2s;
}

.remove-favorite-btn:hover {
  opacity: 1;
  transform: scale(1.1);
}

.games-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-lg);
}

.game-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  cursor: pointer;
  transition: all 0.3s;
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--spacing-md);
}

.game-card:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 215, 0, 0.3);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.game-icon {
  font-size: 3rem;
  margin-bottom: var(--spacing-sm);
}

.game-name {
  font-size: 1.3rem;
  font-weight: bold;
  color: #FFD700;
}

.game-description {
  font-size: 0.9rem;
  opacity: 0.8;
  margin-bottom: var(--spacing-md);
  flex: 1;
}

.play-btn {
  padding: var(--spacing-sm) var(--spacing-lg);
  background: linear-gradient(135deg, #4ECDC4, #06D6A0);
  color: white;
  border: none;
  border-radius: var(--radius-lg);
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;
}

.play-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(78, 205, 196, 0.4);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-lg);
}

.stat-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s;
}

.stat-card:hover {
  border-color: rgba(255, 215, 0, 0.3);
  transform: translateY(-3px);
}

.stat-icon {
  font-size: 2rem;
  margin-bottom: var(--spacing-sm);
  color: #FFD700;
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
  color: white;
  margin-bottom: var(--spacing-xs);
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.8;
}

.api-info-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.api-status {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: rgba(6, 214, 160, 0.1);
  border-radius: var(--radius-lg);
  border: 1px solid rgba(6, 214, 160, 0.3);
}

.status-indicator {
  width: 12px;
  height: 12px;
  background: #06D6A0;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.status-indicator.active {
  background: #06D6A0;
}

.status-text {
  font-weight: bold;
  color: #06D6A0;
}

.api-details {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-sm) var(--spacing-md);
  background: rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-md);
}

.detail-label {
  font-size: 0.9rem;
  opacity: 0.8;
}

.detail-value {
  font-weight: bold;
  color: #FFD700;
}

@keyframes gentleGlow {
  0% { transform: scale(1); }
  100% { transform: scale(1.1); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

@media (max-width: 768px) {
  .bible-api-dashboard {
    padding: var(--spacing-md);
  }

  .dashboard-header {
    flex-direction: column;
    gap: var(--spacing-lg);
    text-align: center;
  }

  .header-actions {
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .dashboard-content {
    grid-template-columns: 1fr;
    gap: var(--spacing-lg);
  }

  .games-grid {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .search-box {
    flex-direction: column;
  }

  .search-btn {
    width: 100%;
  }
}
DASHCSS

echo "✅ Bible Games with API Integration installed successfully!"
echo ""
echo "📖 Features Added:"
echo "  1. 📖 Bible API Service - Real Bible data integration"
echo "  2. 🎮 Enhanced Bible Trivia - With API-powered questions"
echo "  3. 💭 Bible Memorizer - Progressive verse memorization"
echo "  4. 📊 Bible API Dashboard - Central hub with daily verses"
echo ""
echo "🚀 Usage:"
echo "  import { BibleTriviaEnhanced, BibleMemorizer, BibleApiDashboard } from './components/games'"
echo ""
echo "🔧 API Features:"
echo "  • Real Bible verse fetching"
echo "  • Multiple translations (KJV, NIV, ESV, etc.)"
echo "  • Verse search functionality"
echo "  • Daily verse updates"
echo "  • Caching for performance"
echo ""
echo "📚 Complete Bible gaming suite ready!"
