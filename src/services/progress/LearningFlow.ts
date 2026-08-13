import { useUserStore } from '../../stores/userStore'

export interface LearningProgress {
  wordsLearnedToday: string[]
  wordsLearnedTotal: string[]
  wordsPracticedToday: string[]
  wordsSpelledToday: string[]
  wordsSpelledTotal: string[] // persistent: every word ever spelled (drives per-group gating)
  dailyGoal: number // Legacy for 'learn'
  dailyGoalSpell: number
  dailyGoalVocab: number
  spellQuizUnlocked: boolean
  vocabQuizUnlocked: boolean
  gamesUnlocked: boolean
  unlockedGames: string[]
  lockedModes: ('learn' | 'spell')[]
  currentStreak: number
  selectedGroup: number
  difficulty: 1 | 2 | 3 | undefined
  missedDays: string[] // Array of date strings "YYYY-MM-DD"
  lastGoalCheck: string | null // Last date goals were checked/reset
  lastReviewDate: string | null // Last date the "Review Time!" quiz was completed
}

// How often the spaced-repetition review of already-learned words is offered.
export const REVIEW_INTERVAL_DAYS = 2
// Need at least this many learned words before a review is worthwhile.
const MIN_WORDS_FOR_REVIEW = 5

export class LearningFlowController {
  private progress: LearningProgress

  constructor() {
    this.progress = this.loadProgress()
  }

  private loadProgress(): LearningProgress {
    const saved = localStorage.getItem('learningProgress')
    const user = useUserStore.getState().user
    // Kid-friendly daily goal: a short, winnable set of words per stage.
    const defaultGoal = user?.dailyGoal || 5

    // Base default state to ensure all properties are always present
    const baseDefault: LearningProgress = {
      wordsLearnedToday: [],
      wordsLearnedTotal: [],
      wordsPracticedToday: [],
      wordsSpelledToday: [],
      wordsSpelledTotal: [],
      dailyGoal: user?.dailyGoal || defaultGoal,
      dailyGoalSpell: user?.dailyGoal || defaultGoal,
      dailyGoalVocab: user?.dailyGoal || defaultGoal,
      spellQuizUnlocked: false,
      vocabQuizUnlocked: false,
      gamesUnlocked: false,
      unlockedGames: [],
      lockedModes: [],
      currentStreak: 0,
      selectedGroup: 0,
      // Start on the easiest tier so young kids meet approachable words first.
      difficulty: 1,
      missedDays: [],
      lastGoalCheck: null,
      lastReviewDate: null
    }

    if (saved) {
      const parsed = JSON.parse(saved)
      // Merge parsed state with baseDefault to ensure all properties exist
      return {
        ...baseDefault, // Start with all default properties
        ...parsed,     // Override with saved properties
        // Ensure arrays are initialized if they were null/undefined in parsed
        wordsLearnedToday: parsed.wordsLearnedToday || [],
        wordsLearnedTotal: parsed.wordsLearnedTotal || [],
        wordsPracticedToday: parsed.wordsPracticedToday || [],
        wordsSpelledToday: parsed.wordsSpelledToday || [],
        wordsSpelledTotal: parsed.wordsSpelledTotal || [],
        unlockedGames: parsed.unlockedGames || [],
        lockedModes: parsed.lockedModes || [],
        missedDays: parsed.missedDays || [],
        // Handle boolean flags explicitly to avoid issues with undefined/null
        spellQuizUnlocked: !!parsed.spellQuizUnlocked,
        vocabQuizUnlocked: !!parsed.vocabQuizUnlocked,
        gamesUnlocked: !!parsed.gamesUnlocked,
        // Ensure numbers are numbers
        dailyGoal: parsed.dailyGoal !== undefined ? parsed.dailyGoal : baseDefault.dailyGoal,
        dailyGoalSpell: parsed.dailyGoalSpell !== undefined ? parsed.dailyGoalSpell : baseDefault.dailyGoalSpell,
        dailyGoalVocab: parsed.dailyGoalVocab !== undefined ? parsed.dailyGoalVocab : baseDefault.dailyGoalVocab,
        currentStreak: parsed.currentStreak !== undefined ? parsed.currentStreak : baseDefault.currentStreak,
        selectedGroup: parsed.selectedGroup !== undefined ? parsed.selectedGroup : baseDefault.selectedGroup,
      }
    }
    
    return baseDefault
  }

  private saveProgress() {
    localStorage.setItem('learningProgress', JSON.stringify(this.progress))
    // Trigger sync to Firebase if possible
    import('../persistence/FirebaseSync').then(m => m.default.syncToServer());
    // Dispatch event to notify listeners
    window.dispatchEvent(new Event('learningProgressUpdated'));
  }

  refreshProgress(): void {
    this.progress = this.loadProgress()
  }

  setSelectedGroup(group: number): void {
    this.progress.selectedGroup = group
    this.saveProgress()
  }

  getSelectedGroup(): number {
    return this.progress.selectedGroup || 0
  }

  setDifficulty(difficulty: 1 | 2 | 3 | undefined): void {
    this.progress.difficulty = difficulty
    this.saveProgress()
  }

  getDifficulty(): 1 | 2 | 3 | undefined {
    return this.progress.difficulty
  }

  completeWord(wordId: string): void {
    // Add to total learned words if not already there
    if (!this.progress.wordsLearnedTotal.includes(wordId)) {
      this.progress.wordsLearnedTotal.push(wordId)
    }

    // Mark as learned today as well (if needed for progress tracking)
    if (!this.progress.wordsLearnedToday.includes(wordId)) {
      this.progress.wordsLearnedToday.push(wordId)
    }

    // Keep track of words practiced today
    if (!this.progress.wordsPracticedToday.includes(wordId)) {
      this.progress.wordsPracticedToday.push(wordId)
    }

    // Viewing a word no longer counts towards daily progress
    // We just unlock spell quiz by default or different logic
    // For now, let's say spell quiz is always unlocked if you've reached the daily goal
    if (this.isDailyGoalReached()) {
      this.progress.spellQuizUnlocked = true
    }

    this.saveProgress()
  }

  completeSpellQuiz(wordIds: string[], remainingWrong: number): void {
    // Track words spelled correctly today
    wordIds.forEach(id => {
      if (!this.progress.wordsSpelledToday.includes(id)) {
        this.progress.wordsSpelledToday.push(id)
      }
      if (!this.progress.wordsSpelledTotal.includes(id)) {
        this.progress.wordsSpelledTotal.push(id)
      }
    })

    // Finishing the spelling stage always opens the next one, so kids can't
    // get permanently stuck on a single tricky word. (remainingWrong is still
    // reported for stars/feedback.)
    void remainingWrong
    this.progress.vocabQuizUnlocked = true
    this.saveProgress()
  }

  completeVocabQuiz(wordIds: string[], remainingWrong: number): void {
    // Completing the vocab stage unlocks games and moves on. Kept forgiving on
    // purpose so the flow always progresses. (remainingWrong drives star rewards.)
    void remainingWrong
    this.progress.gamesUnlocked = true

    // Advance to next word group
    this.progress.selectedGroup += 1

    // Also unlock the first non-default game by default when games are unlocked
    if (!this.progress.unlockedGames.includes('word-scramble')) {
      this.progress.unlockedGames.push('word-scramble')
    }

    // Mark progress towards daily goal upon vocab quiz completion
    wordIds.forEach(id => {
      if (!this.progress.wordsLearnedToday.includes(id)) {
        this.progress.wordsLearnedToday.push(id)
      }
      if (!this.progress.wordsLearnedTotal.includes(id)) {
        this.progress.wordsLearnedTotal.push(id)
      }
    })
    this.saveProgress()
  }

  isSpellQuizUnlocked(): boolean {
    return this.progress.spellQuizUnlocked
  }

  isVocabQuizUnlocked(): boolean {
    return this.progress.vocabQuizUnlocked
  }

  areGamesUnlocked(): boolean {
    return this.progress.gamesUnlocked
  }

  isGameUnlocked(gameId: string): boolean {
    // Some games might be unlocked by default
    const defaultUnlocked = ['bonus', 'word-race', 'memory-match', 'balloon-pop', 'word-builder', 'missing-letter', 'spelling-check', 'rescue-the-bee', 'word-search', 'bee-catch', 'bible-trivia', 'bible-memorizer']
    if (defaultUnlocked.includes(gameId)) return true
    
    // Others require the general games unlock AND being in the unlockedGames list
    return this.progress.gamesUnlocked && this.progress.unlockedGames.includes(gameId)
  }

  unlockNextGame(currentGameId: string): string | null {
    if (!this.progress.gamesUnlocked) return null

    const gameOrder = [
      'bonus', 'word-race', 'memory-match', 'balloon-pop',
      'word-scramble', 'spell-sprint', 'shape-catcher', 'spelling-adventure',
      'pattern-memory', 'rhythm-tap', 'memory-grid', 'reaction-test',
      'pattern-sequencer', 'color-mixer', 'math-puzzle', 'music-composer',
      'physics-puzzle', 'puzzle-slider'
    ]

    const currentIndex = gameOrder.indexOf(currentGameId)
    if (currentIndex !== -1 && currentIndex < gameOrder.length - 1) {
      const nextGameId = gameOrder[currentIndex + 1]
      if (!this.progress.unlockedGames.includes(nextGameId)) {
        this.progress.unlockedGames.push(nextGameId)
        this.saveProgress()
        return nextGameId
      }
    }
    return null
  }

  getLockedModes(): ('learn' | 'spell')[] {
    return this.progress.lockedModes
  }

  getWordsLearnedToday(): string[] {
    return [...this.progress.wordsLearnedToday]
  }

  isDailyGoalReached(mode: 'learn' | 'spell' | 'vocab' = 'learn'): boolean {
    if (mode === 'spell') return this.progress.wordsSpelledToday.length >= this.progress.dailyGoalSpell
    if (mode === 'vocab') return this.progress.gamesUnlocked // Games unlock upon vocab completion
    return this.progress.wordsLearnedToday.length >= this.progress.dailyGoal
  }

  getWordsPracticedToday(): string[] {
    return [...this.progress.wordsPracticedToday]
  }

  getWordsSpelledToday(): string[] {
    return [...this.progress.wordsSpelledToday]
  }

  getWordsSpelledTotal(): string[] {
    return [...this.progress.wordsSpelledTotal]
  }

  // --- Per-group succession helpers ---
  // The learning journey is a strict chain per word group:
  //   learn every word in the group  ->  spelling unlocks
  //   spell every word in the group  ->  a game unlocks
  areWordsLearned(wordIds: string[]): boolean {
    return wordIds.length > 0 && wordIds.every(id => this.progress.wordsLearnedTotal.includes(id))
  }

  areWordsSpelled(wordIds: string[]): boolean {
    return wordIds.length > 0 && wordIds.every(id => this.progress.wordsSpelledTotal.includes(id))
  }

  /** Unlock games directly (used when a whole word group has been spelled). */
  unlockGames(): void {
    this.progress.gamesUnlocked = true
    if (!this.progress.unlockedGames.includes('word-scramble')) {
      this.progress.unlockedGames.push('word-scramble')
    }
    this.saveProgress()
  }

  /** Move on to the next word group (called when the kid chooses to continue). */
  advanceToNextGroup(): void {
    this.progress.selectedGroup += 1
    this.saveProgress()
  }

  getWordsLearnedTotal(): string[] {
    return [...this.progress.wordsLearnedTotal]
  }

  getDailyGoal(mode: 'learn' | 'spell' | 'vocab' = 'learn'): number {
    if (mode === 'spell') return this.progress.dailyGoalSpell
    if (mode === 'vocab') return this.progress.dailyGoalVocab
    return this.progress.dailyGoal
  }

  setDailyGoal(goal: number, mode: 'learn' | 'spell' | 'vocab' = 'learn'): void {
    if (mode === 'spell') this.progress.dailyGoalSpell = goal
    else if (mode === 'vocab') this.progress.dailyGoalVocab = goal
    else this.progress.dailyGoal = goal
    this.saveProgress()
  }

  getMissedDays(): string[] {
    return this.progress.missedDays || []
  }

  resetDailyProgress(): void {
    this.progress.wordsLearnedToday = []
    this.progress.wordsPracticedToday = []
    this.progress.wordsSpelledToday = []
    this.progress.spellQuizUnlocked = false
    this.progress.vocabQuizUnlocked = false
    this.progress.gamesUnlocked = false
    this.progress.lockedModes = []
    this.saveProgress()
  }

  incrementStreak(): void {
    this.progress.currentStreak += 1
    this.saveProgress()
  }

  getCurrentStreak(): number {
    return this.progress.currentStreak
  }

  resetStreak(): void {
    this.progress.currentStreak = 0
    this.saveProgress()
  }

  // --- Spaced-repetition review of already-learned words ---

  /** True when enough words have been learned and it's been REVIEW_INTERVAL_DAYS
   *  since the last review (or one has never been done). */
  isReviewDue(): boolean {
    if (this.progress.wordsLearnedTotal.length < MIN_WORDS_FOR_REVIEW) return false
    const last = this.progress.lastReviewDate
    if (!last) return true
    const days = (Date.now() - new Date(last).getTime()) / (1000 * 60 * 60 * 24)
    return days >= REVIEW_INTERVAL_DAYS
  }

  /** A random sample of previously-learned word IDs to quiz on. */
  getReviewWordIds(count = 8): string[] {
    const pool = [...this.progress.wordsLearnedTotal]
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[pool[i], pool[j]] = [pool[j], pool[i]]
    }
    return pool.slice(0, count)
  }

  /** Record that today's review was completed so it won't be offered again
   *  until the interval passes. */
  markReviewDone(): void {
    this.progress.lastReviewDate = new Date().toISOString()
    this.saveProgress()
  }

  getLastReviewDate(): string | null {
    return this.progress.lastReviewDate
  }
}
