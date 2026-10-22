import React, { useState, useMemo, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useProgress } from '../../contexts/ProgressContext'
import { useUser } from '../../contexts/UserContext'
import { useRewardStore } from '../../stores/rewards/useRewardStore'
import { wordBank } from '../../services/wordBank'
import { getSeasonalEventById } from '../../services/seasonal'
import { useStreak } from '../../hooks/useStreak'
import WordMastery, {
  MASTERY_EVENT,
  LEARN_CHALLENGE_TARGET,
  LEARN_CHALLENGE_REWARD,
} from '../../services/progress/WordMastery'
import ExplorerLevel from '../../components/progress/ExplorerLevel'
import { PRIVATE_LISTS, WORD_LISTS_EVENT } from '../../services/wordLists'
import QuestMap from '../../components/progress/QuestMap'
import Button from '../../components/common/Button'
import Celebration, { CelebrationData } from '../../components/common/Celebration'
import LearnMode from '../../components/learning/LearnMode'
import SpellMode, { SpellResult } from '../../components/learning/SpellMode'
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
  const [levels, setLevels] = useState<(1 | 2 | 3)[]>(() => learningFlow.getWordLevels())
  // A private list (the 2026 School Bee list) replaces the levels while chosen.
  const [wordList, setWordList] = useState<string | null>(() => learningFlow.getWordList())
  // The private list arrives after sign-in; re-render when it does so it can be offered.
  const [, setListsTick] = useState(0)
  useEffect(() => {
    const onLists = () => setListsTick((t) => t + 1)
    window.addEventListener(WORD_LISTS_EVENT, onLists)
    return () => window.removeEventListener(WORD_LISTS_EVENT, onLists)
  }, [])
  const listReady = !!wordList && wordBank.hasList(wordList)
  const difficulty: Difficulty = levels.length === 1 ? levels[0] : undefined
  const [selectedGroup, setSelectedGroup] = useState(() => learningFlow.getSelectedGroup())
  const [isGroupsExpanded, setIsGroupsExpanded] = useState(false)
  // Tests, the collection and the word-level pickers: folded under "More" so
  // the hub leads with one big next step.
  const [showMore, setShowMore] = useState(false)
  // The finish moment for a spelled set (it used to snap straight back here).
  const [spellDone, setSpellDone] = useState<CelebrationData | null>(null)
  // Re-read today's challenge whenever a word is learned or spelled.
  const [challengeTick, setChallengeTick] = useState(0)
  const navigate = useNavigate()
  const { addStars } = useRewardStore()
  const [searchParams] = useSearchParams()
  const { streakData } = useStreak()
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

  const filteredWords = useMemo(() => {
    if (seasonalEvent) return seasonalEvent.words
    // A grown-up can pick one Bee level or a blend of them; getWordsForLevels
    // interleaves a blend so every group mixes, and falls back to everything if
    // the chosen levels turn out to be empty.
    const base = wordBank.getLearningList(levels, wordList)
    return base.length > 0 ? base : wordBank.getAllWords()
  }, [levels, wordList, listReady, seasonalEvent])

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

  // What the games really are right now. Spelling a group used to announce
  // "You unlocked a game — go play!" even on a day when nothing was open.
  const gate = learningFlow.gamesLockedReason()
  const starterOpen = learningFlow.areStarterGamesOpen()
  const canPlay = gate === null || starterOpen

  // Home's "Spell It!" and "Keep Practicing" link here with ?mode=spell: go
  // straight to spelling when there is a learned group to spell.
  const wantsSpell = searchParams.get('mode') === 'spell'
  useEffect(() => {
    if (wantsSpell && isGroupLearned) setActiveMode('spell')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wantsSpell])

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
    const next: (1 | 2 | 3)[] = level ? [level] : []
    setLevels(next)
    setWordList(null)
    setSelectedGroup(0)
    learningFlow.setWordLevels(next)
  }

  const handleListSelect = (list: string) => {
    setWordList(list)
    setSelectedGroup(0)
    learningFlow.setWordList(list)
  }

  /**
   * Move to a word group. During a seasonal event the groups are the event's,
   * so the child's saved place in their own list is left alone — saving the
   * event's index (or adding one to the saved group and clamping it to the
   * event's count) moved a child on group 37 back to group 2.
   */
  const goToGroup = (index: number) => {
    const target = Math.min(Math.max(index, 0), groupsCount - 1)
    setSelectedGroup(target)
    if (!seasonalEvent) learningFlow.setSelectedGroup(target)
  }
  const handleGroupSelect = (index: number) => goToGroup(index)

  // Entering an event starts at its first group; leaving it goes back to the
  // child's own place.
  useEffect(() => {
    setSelectedGroup(seasonalEvent ? 0 : learningFlow.getSelectedGroup())
  }, [seasonalEvent, learningFlow])

  const renderCommonSelectors = () => (
    <>
      <div className="difficulty-selector">
        <h3>🐝 Word level</h3>
        <div className="difficulty-buttons">
          <Button
            onClick={() => handleDifficultySelect(1)}
            variant={!listReady && difficulty === 1 ? 'primary' : 'secondary'}
          >
            🐝 One Bee
          </Button>
          <Button
            onClick={() => handleDifficultySelect(2)}
            variant={!listReady && difficulty === 2 ? 'primary' : 'secondary'}
          >
            🐝🐝 Two Bee
          </Button>
          <Button
            onClick={() => handleDifficultySelect(3)}
            variant={!listReady && difficulty === 3 ? 'primary' : 'secondary'}
          >
            🐝🐝🐝 Three Bee
          </Button>
          <Button
            onClick={() => handleDifficultySelect(undefined)}
            variant={!listReady && difficulty === undefined ? 'primary' : 'secondary'}
          >
            🌟 All Words
          </Button>
          {/* Private lists show only once downloaded — i.e. for signed-in children. */}
          {PRIVATE_LISTS.filter((l) => wordBank.hasList(l.id)).map((l) => (
            <Button
              key={l.id}
              onClick={() => handleListSelect(l.id)}
              variant={listReady && wordList === l.id ? 'primary' : 'secondary'}
            >
              {l.icon} {l.title}
            </Button>
          ))}
        </div>
      </div>

      {groupsCount > 1 && (
        <div className={`group-selector ${isGroupsExpanded ? 'expanded' : 'collapsed'}`}>
          <div className="selector-header" onClick={() => setIsGroupsExpanded(!isGroupsExpanded)}>
            <h3>📚 Word groups (sets of {groupSize})</h3>
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

  /**
   * A finished quiz. A spelling quiz credits nothing here: QuizMode credited
   * each right answer as it came, and passing every id along credited the
   * words missed or skipped as spelled too.
   *
   * The vocabulary quiz finishes the set, once. `completeVocabQuiz` moves the
   * saved word group on by one from wherever it is, so running it again for
   * the same words — "Try Again", or Back to Hub and through the quizzes once
   * more — skipped a group the child had never met.
   */
  const vocabFinished = useRef(new Set<string>())
  const handleQuizComplete = (_score: number, wrongAnswers: number, wordIds: string[]) => {
    if (quizType !== 'vocab') return
    const set = groupIds.join('|')
    if (vocabFinished.current.has(set)) return
    vocabFinished.current.add(set)
    const savedGroup = learningFlow.getSelectedGroup()
    learningFlow.completeVocabQuiz(wordIds, wrongAnswers)
    // An event's groups are the event's: like goToGroup, leave the child's
    // place in their own list where it was.
    if (seasonalEvent) learningFlow.setSelectedGroup(savedGroup)
  }

  const handleSpellComplete = (_wordIds: string[], result?: SpellResult) => {
    // Nothing to credit: SpellMode credits each word as it is spelled right.
    // `wordIds` is the whole set — misses, "Stuck?" words and words before the
    // resume point too — and crediting it ticked words never spelled (the hub's
    // ✅, mastery, XP and collection stars). An unspelled word keeps "Spell
    // your words" as the next step; "Stuck?" showed it, so next time it can be.
    // Succession: once every word in this group is spelled, a game is unlocked.
    const allSpelled = learningFlow.areWordsSpelled(groupIds)
    if (allSpelled) {
      learningFlow.unlockGames()
    }
    // A moment to enjoy it before the hub. SpellMode already paid a star per
    // word spelled; this only shows them, it pays nothing more.
    const spelledTotal = learningFlow.getWordsSpelledTotal()
    const spelled = groupIds.filter((id) => spelledTotal.includes(id)).length
    const n = groupIds.length
    setSpellDone({
      title: allSpelled ? 'All spelled! ✏️' : 'Spelling practice done! ✏️',
      message: allSpelled
        ? learningFlow.gamesLockedReason() === null
          ? `You spelled your ${n} words — every game is open!`
          : `You spelled your ${n} words — brilliant!`
        : spelled > 0
        ? `You’ve spelled ${spelled} of your ${n} words — the rest get another go next time! 💪`
        : 'Every go makes the words stick — they get another go next time! 💪',
      stars: result?.stars ?? 0,
    })
  }

  // The ONE next step, from the same ladder as the steps below and the real
  // state of the games. It used to be buried under nine sections, with Learn
  // and Spell buttons repeated three times.
  const nextStep: { icon: string; label: string; go: () => void } = (() => {
    if (!isGroupLearned) {
      const left = groupCount - groupLearnedCount
      return { icon: '📖', label: `Learn ${left} new ${left === 1 ? 'word' : 'words'}`, go: () => handleModeSelect('learn') }
    }
    if (!isGroupSpelled) {
      return { icon: '✏️', label: `Spell your ${groupCount} ${groupCount === 1 ? 'word' : 'words'}`, go: () => handleModeSelect('spell') }
    }
    // This group is done but today's new words aren't — the same order as
    // Home's "Next up" card: today's words before play.
    if (!seasonalEvent && !learningFlow.isDailyGoalReached('learn') && safeGroup < groupsCount - 1) {
      return {
        icon: '➡️',
        label: 'Meet your next words',
        go: () => { goToGroup(safeGroup + 1); handleModeSelect('learn') },
      }
    }
    if (gate === null) return { icon: '🎮', label: 'Play a game!', go: () => navigate('/games') }
    if (gate === 'review') return { icon: '🧠', label: 'Quick review — then every game opens!', go: () => navigate('/review') }
    if (starterOpen) return { icon: '🏆', label: 'Take today’s quiz', go: () => navigate('/daily-quiz') }
    if (safeGroup < groupsCount - 1) {
      return {
        icon: '➡️',
        label: 'Meet your next words',
        go: () => { goToGroup(safeGroup + 1); handleModeSelect('learn') },
      }
    }
    // The last group is done: an earlier group may still have words to meet.
    const learned = new Set(learnedTotal)
    for (let g = 0; g < safeGroup; g++) {
      if (filteredWords.slice(g * groupSize, (g + 1) * groupSize).some((w) => !learned.has(w.id))) {
        return {
          icon: '➡️',
          label: 'Meet your next words',
          go: () => { goToGroup(g); handleModeSelect('learn') },
        }
      }
    }
    // An event's words are all met and spelled, and what is left today is in
    // the child's own list. Learning the event again moved nothing (and paid
    // stars each lap), so this button used to come straight back.
    if (seasonalEvent) {
      return { icon: '📚', label: 'Back to my words', go: () => navigate('/learn') }
    }
    return { icon: '📖', label: 'Learn these words again', go: () => handleModeSelect('learn') }
  })()

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
          <h1>📚 Learn</h1>
        </div>
        {/* No onComplete handler on purpose: finishing a set should land on
            LearnMode's own celebration (stars, best streak, a word joke), not
            snap straight back to the hub. "Back to Hub" sits in the header. */}
        <LearnMode
          words={groupWords}
          difficulty={difficulty}
          onMoveToPractice={() => handleModeSelect('spell')}
          // "More Words" means new words: the next group, as "Next Word Group"
          // does. At the last group it keeps LearnMode's own behaviour.
          onMoreWords={safeGroup < groupsCount - 1 ? () => goToGroup(safeGroup + 1) : undefined}
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
          <h1>✏️ Spell</h1>
        </div>
        <SpellMode
          words={groupWords}
          difficulty={difficulty}
          onComplete={handleSpellComplete}
          onMoveToQuiz={() => handleQuizSelect('spell')}
          summary={false}
        />
        <Celebration
          data={spellDone}
          autoClose={false}
          onClose={() => { setSpellDone(null); handleBack() }}
          closeLabel="What’s next? →"
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
            {quizType === 'spell' ? '✏️ Spelling Quiz' : '📚 Word Meanings'}
          </h1>
        </div>
        <QuizMode
          // Which words a child is tested on must not depend on whether a
          // panel happens to be open. Collapsed — the default — this handed
          // QuizMode nothing, and it made a quiz out of the whole word bank.
          words={groupWords}
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
          <h1>📝 Practice Test</h1>
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
        {/* A name only, never an email: on a shared iPad that was a parent's address. */}
        <p className="welcome-message">
          {user?.name ? `Hi ${user.name}!` : 'Hi there!'} Ready for some words?
        </p>

        <div className="progress-summary">
          <div className="progress-item">
            <span className="progress-icon">📚</span>
            <span className="progress-value">{learningFlow.getWordsLearnedToday().length}/{learningFlow.getLearnGoalToday()}</span>
            <span className="progress-label">Today's Goal</span>
          </div>
          <div className="progress-item">
            <span className="progress-icon">⭐</span>
            <span className="progress-value">{learningFlow.getWordsLearnedTotal().length}</span>
            <span className="progress-label">Total Words</span>
          </div>
          <div className="progress-item">
            <span className="progress-icon">🔥</span>
            {/* The same streak Home shows — this used to read a counter nothing ever
                moved, so it said 0 days beside Home's 1. */}
            <span className="progress-value">{streakData.currentStreak} {streakData.currentStreak === 1 ? 'day' : 'days'}</span>
            <span className="progress-label">Day Streak</span>
          </div>
        </div>
      </div>

      <div className="next-up">
        <span className="next-up-label">Next up</span>
        <Button onClick={nextStep.go} variant="primary" size="large" icon={nextStep.icon} className="next-up-btn">
          {nextStep.label}
        </Button>
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

        {/* The end of the word list: nothing new is left to meet, so say so
            rather than asking for words that don't exist. */}
        {!seasonalEvent && learningFlow.isLevelFinished() && (
          <div className="level-finished" role="status">
            🎉 You've met every word in your level! Keep practising them — and ask a
            grown-up to choose your next level.
          </div>
        )}

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
              <p>
                {!isGroupSpelled
                  ? 'Spell all the words to unlock'
                  : gate === null
                  ? 'Every game is open — go play! 🎉'
                  : !starterOpen
                  ? 'Meet today’s new words to open the starter games.'
                  : gate === 'review'
                  ? 'Starter games are open! A quick review opens all the rest. 🎉'
                  : 'Starter games are open! Pass today’s quiz for all the rest. 🎉'}
              </p>
              <Button
                onClick={() => navigate('/games')}
                variant={isGroupSpelled && canPlay ? 'success' : 'secondary'}
                disabled={!isGroupSpelled || !canPlay}
                icon={isGroupSpelled && canPlay ? '🎮' : '🔒'}
              >
                {isGroupSpelled && canPlay ? 'Play a Game!' : 'Locked'}
              </Button>
              {isGroupSpelled && starterOpen && gate !== null && (
                <Button
                  onClick={() => navigate(gate === 'review' ? '/review' : '/daily-quiz')}
                  variant="primary"
                  icon={gate === 'review' ? '🧠' : '🏆'}
                >
                  {gate === 'review' ? 'Start Review' : 'Take the Quiz'}
                </Button>
              )}
              {isGroupSpelled && groupsCount > 1 && (
                <Button
                  onClick={() => goToGroup(safeGroup + 1)}
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

      <div className={`hub-more ${showMore ? 'open' : ''}`}>
        <button className="hub-more-toggle" aria-expanded={showMore} onClick={() => setShowMore((m) => !m)}>
          {showMore ? '▲ Less' : '▼ More'}
        </button>
        {showMore && (
          <div className="hub-more-body">
            <div className="modes-grid">
              <div className="mode-card">
                <div className="mode-icon">📝</div>
                <h3>Practice Test</h3>
                <p>Spell this group&apos;s words — just you, no help</p>
                <Button onClick={() => handleModeSelect('test')} variant="warning">
                  {groupCount}-Word Test
                </Button>
              </div>

              <div className="mode-card">
                <div className="mode-icon">🗂️</div>
                <h3>My Word Collection</h3>
                <p>Every word you&apos;ve met, with the stars you earned for it</p>
                <Button onClick={() => navigate('/collection')} variant="primary">
                  Open Collection
                </Button>
              </div>
            </div>

            {/* The level and group pickers live here, not above every lesson,
                where a child could switch level in the middle of one. */}
            {renderCommonSelectors()}
          </div>
        )}
      </div>
    </div>
  )
}

export default LearningHub
