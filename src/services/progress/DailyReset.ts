/**
 * Ceiling for a goal that has grown from missed days.
 *
 * Carry-over used to be `goal = goal + missed`, which DOUBLES every missed day
 * (5 -> 10 -> 20 -> 40 ... 640 after a week away). Since the word-group size is
 * the daily goal, that made the learn -> spell -> game chain impossible to
 * finish and effectively bricked the app for any child who took a break.
 * Carry-over is now capped so coming back is always winnable.
 */
const MAX_CARRY_GOAL = 12

/** Grow a goal by what was missed, but never past a kid-sized ceiling.
 *  A goal a grown-up deliberately set higher is left alone, never inflated. */
const carryOver = (goal: number, missed: number): number =>
  Math.min(goal + missed, Math.max(goal, MAX_CARRY_GOAL))

export class DailyResetService {
  static initialize() {
    // Check if we need to reset daily progress
    const lastReset = localStorage.getItem('lastDailyReset')
    const today = new Date().toDateString()

    if (lastReset !== today) {
      this.resetDailyProgress()
      localStorage.setItem('lastDailyReset', today)
    }
  }

  static resetDailyProgress() {
    // Reset LearningFlow progress
    const saved = localStorage.getItem('learningProgress')
    if (saved) {
      const learningProgress = JSON.parse(saved)
      const lastReset = localStorage.getItem('lastDailyReset')
      
      // Calculate missed words and carry over to next day
      const learnGoal = learningProgress.dailyGoal || 30
      const spellGoal = learningProgress.dailyGoalSpell || learnGoal
      const vocabGoal = learningProgress.dailyGoalVocab || learnGoal

      const learnProgress = (learningProgress.wordsLearnedToday || []).length
      const spellProgress = (learningProgress.wordsSpelledToday || []).length
      const vocabProgress = learningProgress.gamesUnlocked ? vocabGoal : 0

      let wasGoalMissed = false
      
      // Learn carry over
      if (learnProgress < learnGoal) {
        const missed = learnGoal - learnProgress
        learningProgress.dailyGoal = carryOver(learnGoal, missed)
        wasGoalMissed = true
      }

      // Spell carry over
      if (spellProgress < spellGoal) {
        const missed = spellGoal - spellProgress
        learningProgress.dailyGoalSpell = carryOver(spellGoal, missed)
        wasGoalMissed = true
      }

      // Vocab carry over
      if (vocabProgress < vocabGoal) {
        const missed = vocabGoal - vocabProgress
        learningProgress.dailyGoalVocab = carryOver(vocabGoal, missed)
        wasGoalMissed = true
      }

      if (wasGoalMissed && lastReset) {
        if (!learningProgress.missedDays) learningProgress.missedDays = []
        learningProgress.missedDays.push(lastReset)
      }

      learningProgress.wordsLearnedToday = []
      learningProgress.wordsPracticedToday = []
      learningProgress.wordsSpelledToday = []
      learningProgress.spellQuizUnlocked = false
      learningProgress.vocabQuizUnlocked = false
      // gamesUnlocked intentionally left alone — games a child already earned
      // should not be taken back overnight.
      localStorage.setItem('learningProgress', JSON.stringify(learningProgress))
      // Notify the rest of the app about the reset
      window.dispatchEvent(new Event('learningProgressUpdated'));
    }

    // Reset daily progress in stores
    const progressStore = JSON.parse(localStorage.getItem('progress-storage') || '{}')

    if (progressStore.state) {
      progressStore.state.wordsLearnedToday = 0
      progressStore.state.dailyGoalCompleted = false
      localStorage.setItem('progress-storage', JSON.stringify(progressStore))
    }
  }
}

export default DailyResetService
