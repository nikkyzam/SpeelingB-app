import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Sticker {
  id: string
  name: string
  emoji: string
  price: number
  unlocked: boolean
  animated: boolean
}

interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  unlocked: boolean
  unlockedAt: string | null
}

interface ShopItem {
  id: string
  name: string
  description: string
  price: number
  purchased: boolean
  realLife: boolean
  requiresParent: boolean
}

interface RewardState {
  // Heavenly Stars (Gems)
  heavenlyStars: number

  // Stickers
  stickers: Sticker[]
  unlockedStickers: string[]

  // Achievements
  achievements: Achievement[]

  // Shop items
  shopItems: ShopItem[]
  purchasedItems: string[]

  // Actions
  addStars: (amount: number) => void
  spendStars: (amount: number) => boolean
  unlockSticker: (stickerId: string) => void
  unlockAchievement: (achievementId: string) => void
  purchaseItem: (itemId: string) => boolean
  getStickerById: (id: string) => Sticker | undefined
  getAchievementById: (id: string) => Achievement | undefined
}

export const useRewardStore = create<RewardState>()(
  persist(
    (set, get) => ({
      heavenlyStars: 50, // Starting stars

      stickers: [
        { id: 'sticker-1', name: 'Happy Bee', emoji: '🐝', price: 10, unlocked: true, animated: true },
        { id: 'sticker-2', name: 'Sparkle Star', emoji: '⭐', price: 15, unlocked: false, animated: true },
        { id: 'sticker-3', name: 'Rainbow Unicorn', emoji: '🦄', price: 25, unlocked: false, animated: true },
        { id: 'sticker-4', name: 'Dove', emoji: '🕊️', price: 20, unlocked: true, animated: false },
        { id: 'sticker-5', name: 'Cross', emoji: '✝️', price: 30, unlocked: false, animated: false }
      ],

      unlockedStickers: ['sticker-1', 'sticker-4'],

      achievements: [
        { id: 'first-word', name: 'First Word', description: 'Learn your first word', icon: '🎯', unlocked: false, unlockedAt: null },
        { id: 'spelling-pro', name: 'Spelling Pro', description: 'Master 50 words', icon: '🏆', unlocked: false, unlockedAt: null },
        { id: 'combo-master', name: 'Combo Master', description: 'Get a 10-word combo', icon: '🔥', unlocked: false, unlockedAt: null },
        { id: 'streak-champ', name: 'Streak Champion', description: '7-day learning streak', icon: '📅', unlocked: false, unlockedAt: null },
        { id: 'quiz-whiz', name: 'Quiz Whiz', description: 'Perfect score on all quizzes', icon: '🧠', unlocked: false, unlockedAt: null }
      ],

      shopItems: [
        { id: 'ice-cream', name: 'Ice Cream', description: 'Delicious treat!', price: 100, purchased: false, realLife: true, requiresParent: true },
        { id: 'movie-night', name: 'Movie Night', description: 'Family movie night', price: 200, purchased: false, realLife: true, requiresParent: true },
        { id: 'extra-game', name: 'Extra Game Time', description: '15 extra minutes of games', price: 50, purchased: false, realLife: false, requiresParent: false },
        { id: 'theme-unlock', name: 'Unicorn Theme', description: 'Unlock the unicorn theme', price: 75, purchased: false, realLife: false, requiresParent: false },
        { id: 'special-sticker', name: 'Golden Sticker Pack', description: 'Special animated stickers', price: 150, purchased: false, realLife: false, requiresParent: false }
      ],

      purchasedItems: [],

      addStars: (amount) =>
        set((state) => ({
          heavenlyStars: state.heavenlyStars + amount
        })),

      spendStars: (amount) => {
        const state = get()
        if (state.heavenlyStars >= amount) {
          set({ heavenlyStars: state.heavenlyStars - amount })
          return true
        }
        return false
      },

      unlockSticker: (stickerId) =>
        set((state) => ({
          stickers: state.stickers.map(sticker =>
            sticker.id === stickerId ? { ...sticker, unlocked: true } : sticker
          ),
          unlockedStickers: [...state.unlockedStickers, stickerId]
        })),

      unlockAchievement: (achievementId) =>
        set((state) => ({
          achievements: state.achievements.map(achievement =>
            achievement.id === achievementId
              ? { ...achievement, unlocked: true, unlockedAt: new Date().toISOString() }
              : achievement
          )
        })),

      purchaseItem: (itemId) => {
        const state = get()
        const item = state.shopItems.find(item => item.id === itemId)

        if (!item || state.heavenlyStars < item.price) {
          return false
        }

        set((state) => ({
          heavenlyStars: state.heavenlyStars - item.price,
          shopItems: state.shopItems.map(shopItem =>
            shopItem.id === itemId ? { ...shopItem, purchased: true } : shopItem
          ),
          purchasedItems: [...state.purchasedItems, itemId]
        }))

        return true
      },

      getStickerById: (id) => {
        return get().stickers.find(sticker => sticker.id === id)
      },

      getAchievementById: (id) => {
        return get().achievements.find(achievement => achievement.id === id)
      }
    }),
    {
      name: 'reward-storage'
    }
  )
)
