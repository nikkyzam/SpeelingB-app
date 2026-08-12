import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ProgressState {
  // Learning progress
  learnedWords: string[]
  masteredWords: string[]
  weakWords: string[]

  // Quiz progress
  spellQuizScore: number
  vocabQuizScore: number
  lastQuizDate: string | null

  // Daily progress
  wordsLearnedToday: number
  dailyGoal: number
  dailyGoalCompleted: boolean

  // Actions
  addLearnedWord: (wordId: string) => void
  addMasteredWord: (wordId: string) => void
  addWeakWord: (wordId: string) => void
  updateQuizScore: (type: 'spell' | 'vocab', score: number) => void
  incrementDailyWords: () => void
  resetDailyProgress: () => void
  setDailyGoal: (goal: number) => void
  checkDailyGoal: () => boolean
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      learnedWords: [],
      masteredWords: [],
      weakWords: [],
      spellQuizScore: 0,
      vocabQuizScore: 0,
      lastQuizDate: null,
      wordsLearnedToday: 0,
      dailyGoal: 30, // Default goal for everyone else (Joy has 10, handled by userStore)
      dailyGoalCompleted: false,

      addLearnedWord: (wordId) =>
        set((state) => ({
          learnedWords: state.learnedWords.includes(wordId)
            ? state.learnedWords
            : [...state.learnedWords, wordId],
          wordsLearnedToday: state.wordsLearnedToday + 1
        })),

      addMasteredWord: (wordId) =>
        set((state) => ({
          masteredWords: state.masteredWords.includes(wordId)
            ? state.masteredWords
            : [...state.masteredWords, wordId]
        })),

      addWeakWord: (wordId) =>
        set((state) => ({
          weakWords: state.weakWords.includes(wordId)
            ? state.weakWords
            : [...state.weakWords, wordId]
        })),

      updateQuizScore: (type, score) =>
        set(() => ({
          [type === 'spell' ? 'spellQuizScore' : 'vocabQuizScore']: score,
          lastQuizDate: new Date().toISOString()
        })),

      incrementDailyWords: () =>
        set((state) => ({
          wordsLearnedToday: state.wordsLearnedToday + 1
        })),

      resetDailyProgress: () =>
        set({
          wordsLearnedToday: 0,
          dailyGoalCompleted: false
        }),

      setDailyGoal: (goal: number) =>
        set({ dailyGoal: goal }),

      checkDailyGoal: () => {
        const state = get()
        const completed = state.wordsLearnedToday >= state.dailyGoal
        if (completed && !state.dailyGoalCompleted) {
          set({ dailyGoalCompleted: true })
        }
        return completed
      }
    }),
    {
      name: 'progress-storage'
    }
  )
)
