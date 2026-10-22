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
import BeeTournament from './pages/BeeTournament'
import TrophyRoom from './pages/TrophyRoom'
import SiblingChallenge from './pages/SiblingChallenge'
import WordHunt from './pages/WordHunt'
import Subjects from './pages/Subjects'
import SubjectPage from './pages/Subjects/SubjectPage'
import TestPage from './pages/Subjects/TestPage'
import MathQuest from './pages/Subjects/MathQuest'
import QuestTopic from './pages/Subjects/QuestTopic'
import MathArcadePage from './pages/Subjects/MathArcadePage'
import MathProofs from './pages/Subjects/MathProofs'
import MathPuzzles from './pages/Subjects/MathPuzzles'
import TopicGames from './pages/Subjects/TopicGames'
import SiblingShowdown from './components/games/SiblingShowdown'

// Layout Components
import Header from './components/layout/Header'
import Navigation from './components/layout/Navigation'
import Confetti from './components/common/Confetti'
import FunFx from './components/common/FunFx'
import BuddyCompanion from './components/buddy/BuddyCompanion'
import { useTheme } from './contexts/ThemeContext'
import { WorldPickerModal } from './components/theme/WorldPicker'
import { setWordsLeftCounter } from './services/progress/LearningFlow'
import { wordBank } from './services/wordBank'

// LearningFlow can't see the word bank, so it is told how to count the words
// a child still has to meet in their levels. At the end of a word list that
// shrinks the day's goal to what is left, instead of a goal nobody can meet.
// Cached: the answer only changes when a word is learned or the levels change.
{
  let lastKey = ''
  let lastLeft = 0
  setWordsLeftCounter((levels, learned) => {
    const key = `${levels.join(',')}|${learned.length}|${learned[learned.length - 1] ?? ''}`
    if (key !== lastKey) {
      const known = new Set(learned)
      lastLeft = wordBank.getWordsForLevels(levels).filter((w) => !known.has(w.id)).length
      lastKey = key
    }
    return lastLeft
  })
}

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

  useEffect(() => {
    // The day also turns over while the app stays open — an iPad left on the
    // table overnight. Checking only at start-up counted the morning's words
    // as yesterday's, and the next reload then wiped them. The reset runs at
    // most once a day and tells ProgressContext to re-read what it rewrote.
    const newDayCheck = () => {
      if (document.visibilityState === 'visible') DailyResetService.initialize()
    }
    const minute = window.setInterval(newDayCheck, 60_000)
    document.addEventListener('visibilitychange', newDayCheck)
    window.addEventListener('focus', newDayCheck)
    return () => {
      window.clearInterval(minute)
      document.removeEventListener('visibilitychange', newDayCheck)
      window.removeEventListener('focus', newDayCheck)
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
                    <Route path="/" element={<Subjects />} />
                    <Route path="/spelling" element={<Home />} />
                    <Route path="/learn" element={<LearningHub />} />
                    <Route path="/review" element={<Review />} />
                    <Route path="/daily-quiz" element={<DailyQuiz />} />
                    <Route path="/weekly-quiz" element={<DailyQuiz mode="weekly" />} />
                    <Route path="/collection" element={<WordCollection />} />
                    <Route path="/progress" element={<ProgressReport />} />
                    <Route path="/games" element={<GameCenter />} />
                    <Route path="/bible" element={<BibleDashboard />} />
                    <Route path="/reading" element={<ReadingHub />} />
                    <Route path="/reading/book/:bookId" element={<ReadingHub />} />
                    <Route path="/rewards" element={<RewardShop />} />
                    <Route path="/sentences" element={<SentenceMaker />} />
                    <Route path="/tournament" element={<BeeTournament />} />
                    <Route path="/trophies" element={<TrophyRoom />} />
                    <Route path="/challenge" element={<SiblingChallenge />} />
                    <Route path="/hunt" element={<WordHunt />} />
                    <Route path="/showdown" element={<SiblingShowdown />} />
                    <Route path="/subjects" element={<Navigate to="/" replace />} />
                    <Route path="/subjects/math/quest/topic/:topicId" element={<QuestTopic />} />
                    <Route path="/subjects/math/quest/:grade" element={<MathQuest />} />
                    <Route path="/subjects/math/arcade" element={<MathArcadePage />} />
                    <Route path="/subjects/math/proofs" element={<MathProofs />} />
                    <Route path="/subjects/math/puzzles" element={<MathPuzzles />} />
                    <Route path="/subjects/play/:source/:id" element={<TopicGames />} />
                    <Route path="/subjects/:subjectId/tests/:testId" element={<TestPage />} />
                    <Route path="/subjects/:subjectId" element={<SubjectPage />} />
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
