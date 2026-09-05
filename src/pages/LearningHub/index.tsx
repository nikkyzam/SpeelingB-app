import React, { useState, useMemo, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useProgress } from '../../contexts/ProgressContext'
import { useUser } from '../../contexts/UserContext'
import { useRewardStore } from '../../stores/rewards/useRewardStore'
import { wordBank } from '../../services/wordBank'
import { getSeasonalEventById } from '../../services/seasonal'
import WordMastery, {
  MASTERY_EVENT,
  LEARN_CHALLENGE_TARGET,
  LEARN_CHALLENGE_REWARD,
} from '../../services/progress/WordMastery'
import ExplorerLevel from '../../components/progress/ExplorerLevel'
import QuestMap from '../../components/progress/QuestMap'
import Button from '../../components/common/Button'
import LearnMode from '../../components/learning/LearnMode'
import SpellMode from '../../components/learning/SpellMode'
import QuizMode from '../../components/learning/QuizMode'
import TestAll from '../../components/learning/TestAll'
import './LearningHub.css'

type LearningMode = 'learn' | 'spell' | 'quiz' | 'test' | null
type QuizType = 'spell' | 'vocab' | null
type Difficulty = 1 | 2 | 3 | undefined


const LearningHub: React.FC = () => {
  const { user } = useUser()
  const { learningFlow } = useProgress()
  const [activeMode, setActiveMode] = useState<LearningMode>(null)
  const [quizType, setQuizType] = useState<QuizType>(null)
  const [difficulty, setDifficulty] = useState<Difficulty>(() => learningFlow.getDifficulty())
  const [selectedGroup, setSelectedGroup] = useState(() => learningFlow.getSelectedGroup())
  const [isGroupsExpanded, setIsGroupsExpanded] = useState(false)
  // Re-read today's challenge whenever a word is learned or spelled.
  const [challengeTick, setChallengeTick] = useState(0)
  const navigate = useNavigate()
  const { addStars } = useRewardStore()
  const [searchParams] = useSearchParams()
  // A seasonal event (?seasonal=halloween) swaps the whole word list for the
  // event's curated set — everything downstream (groups, learn, spell) just works.
  const seasonalEvent = useMemo(
    () => getSeasonalEventById(searchParams.get('seasonal') || ''),
    [searchParams]
  )

  useEffect(() => {
    const bump = () => setChallengeTick((t) => t + 1)
    window.addEventListener(MASTERY_EVENT, bump)
    return () => window.removeEventListener(MASTERY_EVENT, bump)
  }, [])

  const challenge = useMemo(() => WordMastery.getChallenge(), [challengeTick, activeMode])
  const challengeDone = challenge.learned >= LEARN_CHALLENGE_TARGET.learned
    && challenge.spelled >= LEARN_CHALLENGE_TARGET.spelled
  const challengeSteps = LEARN_CHALLENGE_TARGET.learned + LEARN_CHALLENGE_TARGET.spelled
  const challengeProgress =
    Math.min(challenge.learned, LEARN_CHALLENGE_TARGET.learned) +
    Math.min(challenge.spelled, LEARN_CHALLENGE_TARGET.spelled)

  const dailyGoal = learningFlow.getDailyGoal('learn')
  const groupSize = dailyGoal // Word groups based on daily goal
  const spellGoal = learningFlow.getDailyGoal('spell')
  const vocabGoal = learningFlow.getDailyGoal('vocab')

  const wordsLearnedToday = learningFlow.getWordsLearnedToday().length
  const wordsSpelledToday = learningFlow.getWordsSpelledToday().length
  
  // For vocabulary progress, we can use wordsSpelledToday as a proxy if we don't have a specific tracker,
  // or just show the goal.
  const vocabProgress = learningFlow.areGamesUnlocked() ? vocabGoal : 0

  const missedDays = learningFlow.getMissedDays()

  const filteredWords = useMemo(() => {
    if (seasonalEvent) return seasonalEvent.words
    const base = difficulty ? wordBank.getWordsByDifficulty(difficulty) : wordBank.getAllWords()
    // Some difficulty tiers may have no words yet — never leave the learner with
    // an empty set (which would soft-lock on "Loading words...").
    return base.length > 0 ? base : wordBank.getAllWords()
  }, [difficulty, seasonalEvent])

  const groupsCount = Math.max(1, Math.ceil(filteredWords.length / groupSize))

  // A stored group can point past the end (e.g. after finishing the last group,
  // or after switching to a level with fewer words). Clamp it, or the learner
  // gets an EMPTY word set and the whole learn -> spell -> game chain freezes.
  const safeGroup = Math.min(Math.max(selectedGroup, 0), groupsCount - 1)

  useEffect(() => {
    // A seasonal event swaps in a much shorter word list, so the clamp above
    // fires — but that is a temporary detour, not a move. Writing it back would
    // lose the child's place in the main list (group 37 becomes group 1).
    if (seasonalEvent) return
    if (safeGroup !== selectedGroup) {
      setSelectedGroup(safeGroup)
      learningFlow.setSelectedGroup(safeGroup)
    }
  }, [safeGroup, selectedGroup, learningFlow, seasonalEvent])

  const groupWords = useMemo(() => {
    const start = safeGroup * groupSize
    return filteredWords.slice(start, start + groupSize)
  }, [filteredWords, safeGroup, groupSize])

  // --- Per-group succession: Learn all -> Spell unlocks -> spell all -> Game unlocks ---
  const groupIds = useMemo(() => groupWords.map(w => w.id), [groupWords])
  const learnedTotal = learningFlow.getWordsLearnedTotal()
  const spelledTotal = learningFlow.getWordsSpelledTotal()
  const groupLearnedCount = groupIds.filter(id => learnedTotal.includes(id)).length
  const groupSpelledCount = groupIds.filter(id => spelledTotal.includes(id)).length
  const groupCount = groupWords.length
  const isGroupLearned = groupCount > 0 && groupLearnedCount === groupCount
  const isGroupSpelled = groupCount > 0 && groupSpelledCount === groupCount

  const handleModeSelect = (mode: LearningMode) => {
    setActiveMode(mode)
    setQuizType(null)
    setIsGroupsExpanded(false) // Reset group expansion when switching modes
  }

  const handleQuizSelect = (type: QuizType) => {
    setQuizType(type)
    setActiveMode('quiz')
  }

  const handleBack = () => {
    setActiveMode(null)
    setQuizType(null)
    setIsGroupsExpanded(false)
  }

  const handleDifficultySelect = (level: Difficulty) => {
    setDifficulty(level)
    setSelectedGroup(0)
    learningFlow.setDifficulty(level)
    learningFlow.setSelectedGroup(0)
  }

  const handleGroupSelect = (index: number) => {
    setSelectedGroup(index)
    learningFlow.setSelectedGroup(index)
    setIsGroupsExpanded(true) // Ensure we use groupWords when explicitly selected
  }

  const renderCommonSelectors = () => (
    <>
      <div className="difficulty-selector">
        <h3>Select Difficulty:</h3>
        <div className="difficulty-buttons">
          <Button
            onClick={() => handleDifficultySelect(1)}
            variant={difficulty === 1 ? 'primary' : 'secondary'}
          >
            🐝 One Bee
          </Button>
          <Button
            onClick={() => handleDifficultySelect(2)}
            variant={difficulty === 2 ? 'primary' : 'secondary'}
          >
            🐝🐝 Two Bee
          </Button>
          <Button
            onClick={() => handleDifficultySelect(3)}
            variant={difficulty === 3 ? 'primary' : 'secondary'}
          >
            🐝🐝🐝 Three Bee
          </Button>
          <Button
            onClick={() => handleDifficultySelect(undefined)}
            variant={difficulty === undefined ? 'primary' : 'secondary'}
          >
            🌟 All Words
          </Button>
        </div>
      </div>

      {groupsCount > 1 && (
        <div className={`group-selector ${isGroupsExpanded ? 'expanded' : 'collapsed'}`}>
          <div className="selector-header" onClick={() => setIsGroupsExpanded(!isGroupsExpanded)}>
            <h3>Select Word Group (Sets of {groupSize}):</h3>
            <span className="toggle-icon">{isGroupsExpanded ? '🔼' : '🔽'}</span>
          </div>
          {isGroupsExpanded && (
            <div className="group-buttons">
              {Array.from({ length: groupsCount }).map((_, i) => (
                <Button
                  key={i}
                  onClick={() => handleGroupSelect(i)}
                  variant={safeGroup === i ? 'primary' : 'secondary'}
                  size="small"
                >
                  Group {i + 1} ({i * groupSize + 1}-{Math.min((i + 1) * groupSize, filteredWords.length)})
                </Button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  )

  const handleQuizComplete = (score: number, wrongAnswers: number, wordIds: string[]) => {
    if (quizType === 'spell') {
      learningFlow.completeSpellQuiz(wordIds, wrongAnswers)
    } else if (quizType === 'vocab') {
      learningFlow.completeVocabQuiz(wordIds, wrongAnswers)
    }
  }

  const handleSpellComplete = (wordIds: string[]) => {
    // Track spelled words
    learningFlow.completeSpellQuiz(wordIds, 0) // Treat practice as 0 errors for tracking
    // Succession: once every word in this group is spelled, a game is unlocked.
    if (learningFlow.areWordsSpelled(groupIds)) {
      learningFlow.unlockGames()
    }
    handleBack()
  }

  const isSpellQuizUnlocked = learningFlow.isSpellQuizUnlocked()
  const isVocabQuizUnlocked = learningFlow.isVocabQuizUnlocked()
  const renderMissedDays = () => {
    if (missedDays.length === 0) return null;
    
    return (
      <div className="missed-days-calendar">
        <h3>📅 Missed Goals Tracking</h3>
        <p>Days where some goals were carried over:</p>
        <div className="missed-days-list">
          {missedDays.map((date, index) => (
            <div key={index} className="missed-day-badge">
              {date}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const isLearnLocked = learningFlow.getLockedModes().includes('learn')
  const isSpellLocked = learningFlow.getLockedModes().includes('spell')

  /** Claim today's bonus, or jump to whichever half of it is still unfinished. */
  const handleChallengeAction = () => {
    if (challengeDone) {
      if (WordMastery.claimChallenge()) {
        addStars(LEARN_CHALLENGE_REWARD)
        setChallengeTick((t) => t + 1)
      }
      return
    }
    handleModeSelect(challenge.learned < LEARN_CHALLENGE_TARGET.learned ? 'learn' : 'spell')
  }

  if (activeMode === 'learn') {
    return (
      <div className="learning-mode-container">
        <div className="mode-header">
          <Button onClick={handleBack} variant="secondary" size="small">
            ← Back to Hub
          </Button>
          <h1>📚 Learn Mode</h1>
          {renderCommonSelectors()}
        </div>
        {/* No onComplete handler on purpose: finishing a set should land on
            LearnMode's own celebration (stars, best streak, a word joke), not
            snap straight back to the hub. "Back to Hub" sits in the header. */}
        <LearnMode
          words={groupWords}
          difficulty={difficulty}
          onMoveToPractice={() => handleModeSelect('spell')}
        />
      </div>
    )
  }

  if (activeMode === 'spell') {
    return (
      <div className="learning-mode-container">
        <div className="mode-header">
          <Button onClick={handleBack} variant="secondary" size="small">
            ← Back to Hub
          </Button>
          <h1>✏️ Practice Spelling</h1>
          {renderCommonSelectors()}
        </div>
        <SpellMode
          words={groupWords}
          difficulty={difficulty}
          onComplete={handleSpellComplete}
          onMoveToQuiz={() => handleQuizSelect('spell')}
        />
      </div>
    )
  }

  if (activeMode === 'quiz' && quizType) {
    return (
      <div className="learning-mode-container">
        <div className="mode-header">
          <Button onClick={handleBack} variant="secondary" size="small">
            ← Back to Hub
          </Button>
          <h1>
            {quizType === 'spell' ? '✏️ Spelling Quiz' : '📚 Vocabulary Quiz'}
          </h1>
          {renderCommonSelectors()}
        </div>
        <QuizMode
          words={isGroupsExpanded ? groupWords : undefined}
          type={quizType}
          difficulty={difficulty}
          onComplete={handleQuizComplete}
          onNextFlow={() => {
            if (quizType === 'spell') {
              handleQuizSelect('vocab')
            } else {
              navigate('/games')
            }
          }}
        />
      </div>
    )
  }

  if (activeMode === 'test') {
    return (
      <div className="learning-mode-container">
        <div className="mode-header">
          <Button onClick={handleBack} variant="secondary" size="small">
            ← Back to Hub
          </Button>
          <h1>📝 Comprehensive Test</h1>
          {renderCommonSelectors()}
        </div>
        <TestAll 
          words={groupWords} 
          difficulty={difficulty} 
          onMoveToGames={() => navigate('/games')}
        />
      </div>
    )
  }

  return (
    <div className="learning-hub">
      <div className="hub-header">
        <h1>Learning Hub 🎓</h1>
        <p className="welcome-message">
          Welcome, {user?.email || user?.name}! Ready to learn some new words?
        </p>

        <div className="progress-summary">
          <div className="progress-item">
            <span className="progress-icon">📚</span>
            <span className="progress-value">{learningFlow.getWordsLearnedToday().length}/{learningFlow.getDailyGoal()}</span>
            <span className="progress-label">Today's Goal</span>
          </div>
          <div className="progress-item">
            <span className="progress-icon">⭐</span>
            <span className="progress-value">{learningFlow.getWordsLearnedTotal().length}</span>
            <span className="progress-label">Total Words</span>
          </div>
          <div className="progress-item">
            <span className="progress-icon">🔥</span>
            <span className="progress-value">{learningFlow.getCurrentStreak()} days</span>
            <span className="progress-label">Learning Streak</span>
          </div>
        </div>
      </div>

      {/* The rank that only ever goes up — tap it to see the words behind it. */}
      <ExplorerLevel onClick={() => navigate('/collection')} />

      {seasonalEvent && (
        <div className="seasonal-hub-banner pop-in">
          <span className="seasonal-hub-icon" aria-hidden>{seasonalEvent.icon}</span>
          <div>
            <h2>{seasonalEvent.name}</h2>
            <p>{seasonalEvent.tagline} These special words are only here for a little while!</p>
          </div>
          <Button variant="secondary" size="small" onClick={() => navigate('/learn')}>
            ← Regular words
          </Button>
        </div>
      )}

      <div className="learning-path">
        <h2>{seasonalEvent ? `${seasonalEvent.icon} ${seasonalEvent.name}` : '🚀 Your Word Adventure'}</h2>
        <p className="path-intro">
          Group {safeGroup + 1} • {groupCount} words. Learn them all, spell them all, then a game pops open! 🎮
        </p>

        {/* The whole adventure as a winding trail, with the mascot on today's stop */}
        <QuestMap
          words={filteredWords}
          groupSize={groupSize}
          current={safeGroup}
          learnedIds={learnedTotal}
          spelledIds={spelledTotal}
          onSelect={handleGroupSelect}
        />

        {renderMissedDays()}

        <div className="path-steps">
          {/* Step 1 — Learn every word in the group */}
          <div className={`path-step ${isGroupLearned ? 'completed' : 'active'}`}>
            <div className="step-icon">{isGroupLearned ? '✅' : '1️⃣'}</div>
            <div className="step-content">
              <h3>Learn the Words</h3>
              <p>Meet all {groupCount} words in this group</p>
              <div className="step-progress">
                <div
                  className="progress-bar"
                  style={{ width: `${groupCount ? (groupLearnedCount / groupCount) * 100 : 0}%` }}
                />
              </div>
              <p className="step-status">{groupLearnedCount}/{groupCount} learned</p>
              <Button onClick={() => handleModeSelect('learn')} variant="primary" icon="📖">
                {isGroupLearned ? 'Learn Again' : groupLearnedCount > 0 ? 'Keep Learning' : 'Start Learning'}
              </Button>
            </div>
          </div>

          {/* Step 2 — Spell every word (unlocks once the group is learned) */}
          <div className={`path-step ${isGroupSpelled ? 'completed' : isGroupLearned ? 'active' : 'locked'}`}>
            <div className="step-icon">{isGroupSpelled ? '✅' : isGroupLearned ? '2️⃣' : '🔒'}</div>
            <div className="step-content">
              <h3>Spell the Words</h3>
              <p>Spell all {groupCount} to earn a game</p>
              <div className="step-progress">
                <div
                  className="progress-bar"
                  style={{ width: `${groupCount ? (groupSpelledCount / groupCount) * 100 : 0}%` }}
                />
              </div>
              <p className="step-status">{groupSpelledCount}/{groupCount} spelled</p>
              <Button
                onClick={() => handleModeSelect('spell')}
                variant={isGroupLearned ? 'primary' : 'secondary'}
                disabled={!isGroupLearned}
                icon={isGroupLearned ? '✏️' : '🔒'}
              >
                {!isGroupLearned ? 'Learn first' : isGroupSpelled ? 'Spell Again' : 'Start Spelling'}
              </Button>
            </div>
          </div>

          {/* Step 3 — A game is unlocked once the whole group is spelled */}
          <div className={`path-step ${isGroupSpelled ? 'active' : 'locked'}`}>
            <div className="step-icon">{isGroupSpelled ? '🎮' : '🔒'}</div>
            <div className="step-content">
              <h3>Play a Game!</h3>
              <p>{isGroupSpelled ? 'You unlocked a game — go play! 🎉' : 'Spell all the words to unlock'}</p>
              <Button
                onClick={() => navigate('/games')}
                variant={isGroupSpelled ? 'success' : 'secondary'}
                disabled={!isGroupSpelled}
                icon={isGroupSpelled ? '🎮' : '🔒'}
              >
                {isGroupSpelled ? 'Play a Game!' : 'Locked'}
              </Button>
              {isGroupSpelled && groupsCount > 1 && (
                <Button
                  onClick={() => {
                    learningFlow.advanceToNextGroup(groupsCount)
                    setSelectedGroup(g => Math.min(g + 1, groupsCount - 1))
                  }}
                  variant="secondary"
                  icon="➡️"
                >
                  Next Word Group
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="learning-modes">
        <h2>🎯 Learning Modes</h2>
        <div className="modes-grid">
          <div className={`mode-card ${isLearnLocked ? 'locked' : ''}`}>
            <div className="mode-icon">📚</div>
            <h3>Learn</h3>
            <p>Learn new words with meanings and examples</p>
            <Button
              onClick={() => handleModeSelect('learn')}
              variant="primary"
              disabled={isLearnLocked}
            >
              {isLearnLocked ? '🔒 Locked' : 'Start Learning'}
            </Button>
            {isLearnLocked && (
              <p className="lock-message">
                Complete daily goal to unlock
              </p>
            )}
          </div>

          <div className={`mode-card ${!isGroupLearned ? 'locked' : ''}`}>
            <div className="mode-icon">✏️</div>
            <h3>Spell</h3>
            <p>Spell this group's words with audio sentences</p>
            <Button
              onClick={() => handleModeSelect('spell')}
              variant="secondary"
              disabled={!isGroupLearned}
            >
              {!isGroupLearned ? '🔒 Locked' : 'Start Spelling'}
            </Button>
            {!isGroupLearned && (
              <p className="lock-message">
                Learn all the words first
              </p>
            )}
          </div>

          <div className="mode-card">
            <div className="mode-icon">📝</div>
            <h3>Comprehensive Test</h3>
            <p>Test all your spelling skills at once</p>
            <Button
              onClick={() => handleModeSelect('test')}
              variant="warning"
            >
              Take Test
            </Button>
          </div>

          <div className="mode-card">
            <div className="mode-icon">🗂️</div>
            <h3>My Word Collection</h3>
            <p>Every word you&apos;ve met, with the stars you earned for it</p>
            <Button
              onClick={() => navigate('/collection')}
              variant="primary"
            >
              Open Collection
            </Button>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h2>⚡ Quick Actions</h2>
        <div className="action-buttons">
          <Button
            onClick={() => handleModeSelect('learn')}
            variant="primary"
            icon="📚"
            disabled={isLearnLocked}
          >
            Learn 5 New Words
          </Button>
          <Button
            onClick={() => handleModeSelect('spell')}
            variant="secondary"
            icon="✏️"
            disabled={!isGroupLearned}
          >
            Spell This Group
          </Button>
          <Button
            onClick={() => handleModeSelect('test')}
            variant="warning"
            icon="📝"
          >
            10-Word Test
          </Button>
        </div>
      </div>

      {/* Counted from what actually happened today, not a fixed 30% bar. */}
      <div className="todays-challenge">
        <h2>🏆 Today&apos;s Challenge</h2>
        <div className="challenge-card">
          <div className="challenge-icon">{challengeDone ? '🎉' : '🎯'}</div>
          <div className="challenge-content">
            <h3>Learn {LEARN_CHALLENGE_TARGET.learned} words &amp; spell {LEARN_CHALLENGE_TARGET.spelled}</h3>
            <p>
              {challenge.claimed
                ? 'Bonus claimed — what a day of learning! 🌟'
                : challengeDone
                  ? `You did it! Claim your ${LEARN_CHALLENGE_REWARD} bonus stars.`
                  : `📖 ${Math.min(challenge.learned, LEARN_CHALLENGE_TARGET.learned)}/${LEARN_CHALLENGE_TARGET.learned} learned · ✏️ ${Math.min(challenge.spelled, LEARN_CHALLENGE_TARGET.spelled)}/${LEARN_CHALLENGE_TARGET.spelled} spelled — ${LEARN_CHALLENGE_REWARD} stars when you finish!`}
            </p>
            <div className="challenge-progress">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${(challengeProgress / challengeSteps) * 100}%` }}
                />
              </div>
              <span className="progress-text">{challengeProgress}/{challengeSteps} done</span>
            </div>
          </div>
          <Button
            variant="success"
            icon={challengeDone && !challenge.claimed ? '⭐' : '🏃‍♀️'}
            onClick={handleChallengeAction}
            disabled={challenge.claimed}
          >
            {challenge.claimed ? 'Claimed' : challengeDone ? 'Claim stars' : 'Keep going'}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default LearningHub
