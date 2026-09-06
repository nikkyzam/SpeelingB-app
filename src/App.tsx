import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { UserProvider } from './contexts/UserContext'
import { ProgressProvider } from './contexts/ProgressContext'
import { AudioProvider } from './contexts/AudioContext'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './config/firebase'
import DailyResetService from './services/progress/DailyReset'
import FirebaseSync from './services/persistence/FirebaseSync'
import AuthService from './services/auth/AuthService'
import migrateLegacyStars from './services/rewards/migrateLegacyStars'
import { useRewardStore } from './stores/rewards/useRewardStore'

// Pages
import Home from './pages/Home'
import LearningHub from './pages/LearningHub'
import GameCenter from './pages/GameCenter'
import RewardShop from './pages/RewardShop'
import Settings from './pages/Settings'
import BibleDashboard from './pages/BibleDashboard'
import ReadingHub from './pages/ReadingHub'
import Review from './pages/Review'
import DailyQuiz from './pages/DailyQuiz'
import WordCollection from './pages/WordCollection'
import ProgressReport from './pages/Progress'
import SentenceMaker from './pages/SentenceMaker'
import WordHunt from './pages/WordHunt'
import SiblingShowdown from './components/games/SiblingShowdown'

// Layout Components
import Header from './components/layout/Header'
import Navigation from './components/layout/Navigation'
import Confetti from './components/common/Confetti'
import FunFx from './components/common/FunFx'
import BuddyCompanion from './components/buddy/BuddyCompanion'
import { useTheme } from './contexts/ThemeContext'
import { WorldPickerModal } from './components/theme/WorldPicker'

function FirstRunWorldPicker() {
  const { hasChosenWorld, markWorldChosen } = useTheme()
  return <WorldPickerModal open={!hasChosenWorld} onClose={markWorldChosen} />
}

function App() {
  useEffect(() => {
    // Initialize Auth
    AuthService.init()

    // Initialize daily reset service
    DailyResetService.initialize()

    // Fold stars from the retired second balance into the live one (once).
    // The store was built from PointsService before this ran, so pull the new
    // total in — otherwise the child sees yesterday's number until a reload.
    if (migrateLegacyStars() > 0) useRewardStore.getState().loadPoints()

    // Note: AuthService.init() already pulls saved progress from Firebase on
    // sign-in (and blocks uploads until that completes), so no sync here.

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  return (
    <Router>
      <ThemeProvider>
        <UserProvider>
          <ProgressProvider>
            <AudioProvider>
              <div className="app-container" data-testid="app-container">
                <Header />
                <main className="main-content">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/learn" element={<LearningHub />} />
                    <Route path="/review" element={<Review />} />
                    <Route path="/daily-quiz" element={<DailyQuiz />} />
                    <Route path="/collection" element={<WordCollection />} />
                    <Route path="/progress" element={<ProgressReport />} />
                    <Route path="/games" element={<GameCenter />} />
                    <Route path="/bible" element={<BibleDashboard />} />
                    <Route path="/reading" element={<ReadingHub />} />
                    <Route path="/reading/book/:bookId" element={<ReadingHub />} />
                    <Route path="/rewards" element={<RewardShop />} />
                    <Route path="/sentences" element={<SentenceMaker />} />
                    <Route path="/hunt" element={<WordHunt />} />
                    <Route path="/showdown" element={<SiblingShowdown />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </main>
                <Navigation />
                <Confetti />
                <FunFx />
                <BuddyCompanion />
                <FirstRunWorldPicker />
              </div>
            </AudioProvider>
          </ProgressProvider>
        </UserProvider>
      </ThemeProvider>
    </Router>
  )
}

export default App
