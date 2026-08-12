import { create } from 'zustand';
import { RewardItem, Badge, UserPoints, PurchaseHistory } from '../../types/rewards';
import { PointsService } from '../../services/rewards/PointsService';
import { RewardsDataService } from '../../services/rewards/RewardsDataService';
import { AchievementsService } from '../../services/rewards/AchievementsService';

interface RewardStore {
  // State
  points: UserPoints;
  rewards: RewardItem[];
  badges: Badge[];
  unlockedBadges: Badge[];
  purchaseHistory: PurchaseHistory[];
  selectedCategory: string;
  isLoading: boolean;

  // Actions
  loadPoints: () => void;
  loadRewards: () => void;
  loadBadges: () => void;
  setSelectedCategory: (category: string) => void;
  purchaseReward: (reward: RewardItem) => Promise<boolean>;
  addPoints: (amount: number, reason: string) => void;
  addComboPoints: (combo: number) => number;
  recordActivity: (type: string, data?: any) => void;
  getFilteredRewards: () => RewardItem[];
  getCategoryStats: () => Record<string, number>;
  resetDailyStats: () => void;
  
  // V1 Compatibility
  heavenlyStars: number;
  addStars: (amount: number) => void;
  purchasedItems: string[];
}

export const useRewardStore = create<RewardStore>((set, get) => ({
  // Initial State
  points: PointsService.getPoints(),
  rewards: [],
  badges: [],
  unlockedBadges: [],
  purchaseHistory: [],
  selectedCategory: 'all',
  isLoading: false,
  heavenlyStars: PointsService.getPoints().availablePoints,
  purchasedItems: PointsService.getPurchaseHistory().map(h => h.rewardId),

  // Actions
  loadPoints: () => {
    const points = PointsService.getPoints();
    set({ points, heavenlyStars: points.availablePoints });
  },

  loadRewards: () => {
    const rewards = RewardsDataService.getAvailableRewards();
    const history = PointsService.getPurchaseHistory();
    set({ rewards, purchaseHistory: history, purchasedItems: history.map(h => h.rewardId) });
  },

  loadBadges: () => {
    const badges = AchievementsService.getBadges();
    const unlockedBadges = AchievementsService.getUnlockedBadges();
    set({ badges, unlockedBadges });
  },

  setSelectedCategory: (category: string) => {
    set({ selectedCategory: category });
  },

  purchaseReward: async (reward: RewardItem): Promise<boolean> => {
    set({ isLoading: true });

    try {
      const success = PointsService.spendPoints(reward.cost, reward);

      if (success) {
        // Update local state
        const points = PointsService.getPoints();
        const history = PointsService.getPurchaseHistory();

        set(state => ({
          points,
          heavenlyStars: points.availablePoints,
          purchaseHistory: history,
          purchasedItems: history.map(h => h.rewardId),
          rewards: state.rewards.map(r =>
            r.id === reward.id ? { ...r, purchased: true } : r
          )
        }));

        // Record achievement if applicable
        if (reward.category === 'badge') {
          AchievementsService.updateBadgeProgress(reward.id);
        }
      }

      set({ isLoading: false });
      return success;
    } catch (error) {
      console.error('Purchase error:', error);
      set({ isLoading: false });
      return false;
    }
  },

  addPoints: (amount: number, reason: string) => {
    const points = PointsService.addPoints(amount, reason);
    set({ points, heavenlyStars: points.availablePoints });

    // Check for point-based badges
    if (points.totalPoints >= 1000) {
      AchievementsService.updateBadgeProgress('spelling-pro');
    }
  },

  addStars: (amount: number) => {
    const points = PointsService.addPoints(amount, 'earned stars');
    set({ points, heavenlyStars: points.availablePoints });
  },

  addComboPoints: (combo: number) => {
    const earned = PointsService.addComboPoints(combo);
    const points = PointsService.getPoints();
    set({ points });

    // Record combo achievement
    AchievementsService.recordComboAchieved(combo);

    return earned;
  },

  recordActivity: (type: string, data?: any) => {
    switch(type) {
      case 'wordSpelled':
        AchievementsService.recordWordSpelled(data.correct, data.isQuiz);
        if (data.correct) {
          const points = PointsService.addPoints(10, 'Correct spelling');
          set({ points });
        }
        break;

      case 'quizComplete':
        AchievementsService.recordQuizComplete(data.perfect, data.quizType);
        const quizPoints = data.perfect ? 50 : 25;
        const points = PointsService.addPoints(quizPoints, `${data.quizType} quiz`);
        set({ points });
        break;

      case 'gamePlayed':
        AchievementsService.recordGamePlayed(data.gameId);
        const gamePoints = data.score ? Math.floor(data.score / 10) : 15;
        const gameEarned = PointsService.addPoints(gamePoints, `${data.gameId} game`);
        set({ points: gameEarned });
        break;

      case 'dailyGoal':
        AchievementsService.recordDailyGoalComplete();
        const goalPoints = PointsService.addPoints(30, 'Daily goal complete');
        set({ points: goalPoints });
        break;

      case 'bibleActivity':
        const biblePoints = PointsService.addPoints(20, 'Bible activity');
        set({ points: biblePoints });
        AchievementsService.updateBadgeProgress('bible-expert');
        break;

      case 'streakUpdate':
        AchievementsService.recordStreakAchieved(data.streak);
        break;
    }

    // Reload badges after activity
    const unlockedBadges = AchievementsService.getUnlockedBadges();
    set({ unlockedBadges });
  },

  getFilteredRewards: () => {
    const { rewards, selectedCategory } = get();
    return selectedCategory === 'all'
      ? rewards
      : rewards.filter(reward => reward.category === selectedCategory);
  },

  getCategoryStats: () => {
    const { rewards } = get();
    const stats: Record<string, number> = {};

    rewards.forEach(reward => {
      stats[reward.category] = (stats[reward.category] || 0) + 1;
    });

    return stats;
  },

  resetDailyStats: () => {
    PointsService.resetDailyPoints();
    const points = PointsService.getPoints();
    set({ points });
  }
}));

// Subscribe to localStorage changes
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key === PointsService.STORAGE_KEY) {
      useRewardStore.getState().loadPoints();
    }
  });
}
