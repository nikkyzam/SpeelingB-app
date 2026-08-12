# 📖 Bible Games with Real API Integration

A comprehensive suite of Bible games that connect to real Bible APIs for authentic scripture data, translations, and interactive learning.

## 🎯 Features Overview

### **1. 📖 Bible API Service** (`src/services/bibleApi.ts`)
- **Real Bible Data**: Connect to `bible-api.com` for authentic scripture
- **Multiple Translations**: KJV, NIV, ESV, NASB, NKJV, NLT support
- **Advanced Features**:
  - Verse fetching with references
  - Bible search functionality
  - Random verse generation
  - Daily verse updates
  - Cross-references
  - Verse context (surrounding verses)
- **Performance Optimized**:
  - Intelligent caching system
  - Error handling with fallbacks
  - Rate limiting protection
  - Offline capability

### **2. 🎮 Enhanced Bible Trivia** (`BibleTriviaEnhanced`)
- **API-Powered Questions**: Real Bible verses for authentic questions
- **Dual Game Modes**:
  - **Trivia Mode**: Multiple choice questions
  - **Verse Study Mode**: Read verses alongside questions
- **Advanced Scoring**:
  - Difficulty multipliers (Easy 1x, Medium 1.5x, Hard 2x)
  - Time-based bonuses
  - Streak bonuses
  - Accuracy tracking
- **Educational Features**:
  - Biblical insights and explanations
  - Verse context display
  - Reference verification

### **3. 💭 Bible Memorizer** (`BibleMemorizer`)
- **Progressive Learning**:
  - 4 difficulty levels (Beginner to Expert)
  - Increasing missing words per level
  - Decreasing time limits
- **Memory Training**:
  - Fill-in-the-blank verses
  - Accuracy requirements (70% to advance)
  - Time pressure for focus
- **Scoring System**:
  - Base points + bonuses
  - Level progression rewards
  - Accuracy multipliers

### **4. 📊 Bible API Dashboard** (`src/components/bible/BibleApiDashboard`)
- **Central Hub**:
  - Daily verse display
  - Bible search functionality
  - Favorite verses management
  - Game selection interface
- **User Features**:
  - Statistics tracking
  - Version selection
  - Cache management
  - Personal favorites
- **API Status**:
  - Connection monitoring
  - Version information
  - Performance metrics

## 🚀 Installation

```bash
# Make script executable
chmod +x install-bible-api-games.sh

# Run installation
./install-bible-api-games.sh

# Install axios (if not already installed)
npm install axios
