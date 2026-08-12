#!/bin/bash

# create-rewards-system.sh
# Run this script to create all reward system files for Kids Spelling Bee

echo "🎮 Creating comprehensive rewards system for Kids Spelling Bee..."
echo "================================================================"

# Create rewards directory structure within existing project
echo "📁 Creating rewards directory structure..."
mkdir -p src/components/rewards
mkdir -p src/services/rewards
mkdir -p src/stores/rewards
mkdir -p src/hooks/rewards
mkdir -p src/assets/images/rewards
mkdir -p src/assets/images/badges
mkdir -p src/assets/images/stickers
mkdir -p src/types/rewards

# 1. Create Reward Types
echo "📝 Creating reward type definitions..."
cat > src/types/rewards.ts << 'EOF'
export interface RewardItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  category: 'avatar' | 'badge' | 'theme' | 'powerup' | 'real' | 'sticker' | 'unlockable';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  image?: string;
  icon?: string;
  unlocked: boolean;
  purchased?: boolean;
  equipped?: boolean;
  realLifeValue?: string;
  animated?: boolean;
  effect?: string;
  themeColor?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  image?: string;
  unlocked: boolean;
  dateEarned?: Date;
  requirements: {
    type: 'streak' | 'points' | 'words' | 'quizzes' | 'games' | 'combo' | 'perfectQuiz' | 'dailyGoal' | 'bible';
    target: number;
    current: number;
  };
  rewardPoints: number;
  category: 'learning' | 'games' | 'faith' | 'streak' | 'special';
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  unlocked: boolean;
  tier?: number;
  progress?: number;
  target?: number;
}

export interface UserPoints {
  totalPoints: number;
  availablePoints: number;
  spentPoints: number;
  lastEarned: Date;
  dailyStreak: number;
  lastLogin: Date;
  highestCombo: number;
  pointsToday: number;
  weeklyPoints: number;
}

export interface PurchaseHistory {
  id: string;
  rewardId: string;
  rewardName: string;
  purchaseDate: Date;
  cost: number;
  category: string;
}

export interface StickerCollection {
  id: string;
  name: string;
  theme: 'faith' | 'animals' | 'fantasy' | 'nature' | 'space' | 'bee';
  stickers: RewardItem[];
  collected: number;
  total: number;
  unlockCost: number;
  unlocked: boolean;
}

export interface DailyReward {
  day: number;
  reward: 'points' | 'sticker' | 'badge' | 'theme' | 'avatar';
  amount?: number;
  itemId?: string;
  claimed: boolean;
  special?: boolean;
}

export interface FaithActivity {
  id: string;
  type: 'bibleVerse' | 'trivia' | 'prayer';
  completed: boolean;
  pointsEarned: number;
  date: Date;
}

export interface RewardCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  description?: string;
}
EOF

# 2. Create Points Service
echo "💰 Creating Points Service..."
cat > src/services/rewards/PointsService.ts << 'EOF'
import { UserPoints, PurchaseHistory, RewardItem } from '../../types/rewards';

export class PointsService {
  private static STORAGE_KEY = 'kids_spelling_points';
  private static HISTORY_KEY = 'kids_spelling_purchase_history';
  private static STREAK_KEY = 'kids_spelling_streak';

  static initializePoints(): UserPoints {
    const defaultPoints: UserPoints = {
      totalPoints: 100,
      availablePoints: 100,
      spentPoints: 0,
      lastEarned: new Date(),
      dailyStreak: 0,
      lastLogin: new Date(),
      highestCombo: 0,
      pointsToday: 0,
      weeklyPoints: 0
    };

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(defaultPoints));
    localStorage.setItem(this.STREAK_KEY, JSON.stringify({
      lastLogin: new Date().toDateString(),
      streak: 0
    }));

    return defaultPoints;
  }

  static getPoints(): UserPoints {
    const points = localStorage.getItem(this.STORAGE_KEY);
    if (!points) {
      return this.initializePoints();
    }

    const parsedPoints = JSON.parse(points);
    this.updateStreak();

    return parsedPoints;
  }

  static updateStreak(): void {
    const today = new Date().toDateString();
    const streakData = localStorage.getItem(this.STREAK_KEY);
    let streak = streakData ? JSON.parse(streakData) : { lastLogin: '', streak: 0 };

    if (streak.lastLogin !== today) {
      const lastLogin = new Date(streak.lastLogin);
      const todayDate = new Date(today);
      const diffTime = Math.abs(todayDate.getTime() - lastLogin.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        streak.streak += 1;
      } else if (diffDays > 1) {
        streak.streak = 1;
      }

      streak.lastLogin = today;
      localStorage.setItem(this.STREAK_KEY, JSON.stringify(streak));

      const points = this.getPoints();
      points.dailyStreak = streak.streak;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(points));
    }
  }

  static addPoints(amount: number, reason: string = 'activity'): UserPoints {
    const points = this.getPoints();
    const updatedPoints: UserPoints = {
      ...points,
      totalPoints: points.totalPoints + amount,
      availablePoints: points.availablePoints + amount,
      pointsToday: points.pointsToday + amount,
      weeklyPoints: points.weeklyPoints + amount,
      lastEarned: new Date()
    };

    // Streak bonus
    if (points.dailyStreak >= 7) {
      updatedPoints.availablePoints += 50;
    }

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedPoints));

    // Trigger points earned event for UI
    const event = new CustomEvent('pointsEarned', {
      detail: { amount, reason, total: updatedPoints.availablePoints }
    });
    window.dispatchEvent(event);

    return updatedPoints;
  }

  static addComboPoints(combo: number): number {
    const basePoints = 10;
    const comboBonus = Math.floor(combo / 5) * 5;
    const total = basePoints + comboBonus;

    this.addPoints(total, `${combo}-word combo`);

    const points = this.getPoints();
    if (combo > points.highestCombo) {
      points.highestCombo = combo;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(points));
    }

    return total;
  }

  static spendPoints(amount: number, reward: RewardItem): boolean {
    const points = this.getPoints();

    if (points.availablePoints < amount) {
      return false;
    }

    const updatedPoints: UserPoints = {
      ...points,
      availablePoints: points.availablePoints - amount,
      spentPoints: points.spentPoints + amount
    };

    const purchase: PurchaseHistory = {
      id: Date.now().toString(),
      rewardId: reward.id,
      rewardName: reward.name,
      purchaseDate: new Date(),
      cost: amount,
      category: reward.category
    };

    this.addToHistory(purchase);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedPoints));

    // Trigger purchase event
    const event = new CustomEvent('rewardPurchased', { detail: { reward, points: updatedPoints } });
    window.dispatchEvent(event);

    return true;
  }

  static addToHistory(purchase: PurchaseHistory): void {
    const history = localStorage.getItem(this.HISTORY_KEY);
    const purchases: PurchaseHistory[] = history ? JSON.parse(history) : [];
    purchases.push(purchase);
    localStorage.setItem(this.HISTORY_KEY, JSON.stringify(purchases));
  }

  static getPurchaseHistory(): PurchaseHistory[] {
    const history = localStorage.getItem(this.HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  }

  static resetDailyPoints(): void {
    const points = this.getPoints();
    points.pointsToday = 0;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(points));
  }

  static resetWeeklyPoints(): void {
    const points = this.getPoints();
    points.weeklyPoints = 0;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(points));
  }

  static getDailyStreak(): number {
    const streakData = localStorage.getItem(this.STREAK_KEY);
    return streakData ? JSON.parse(streakData).streak : 0;
  }
}
EOF

# 3. Create Rewards Data Service
echo "🎁 Creating Rewards Data Service..."
cat > src/services/rewards/RewardsDataService.ts << 'EOF'
import { RewardItem, Badge, StickerCollection, DailyReward, RewardCategory } from '../../types/rewards';

export class RewardsDataService {
  static getAvailableRewards(): RewardItem[] {
    return [
      // Real-life rewards
      {
        id: 'ice-cream',
        name: 'Ice Cream Treat',
        description: 'Redeem for a real ice cream!',
        cost: 500,
        category: 'real',
        rarity: 'epic',
        icon: '🍦',
        unlocked: true,
        realLifeValue: 'One ice cream cone'
      },
      {
        id: 'movie-night',
        name: 'Movie Night',
        description: 'Family movie night of your choice',
        cost: 1000,
        category: 'real',
        rarity: 'legendary',
        icon: '🎬',
        unlocked: true,
        realLifeValue: 'One family movie night'
      },
      {
        id: 'park-day',
        name: 'Park Day',
        description: 'Trip to the park',
        cost: 300,
        category: 'real',
        rarity: 'rare',
        icon: '🌳',
        unlocked: true
      },
      {
        id: 'stay-up-late',
        name: 'Stay Up 30 Min Late',
        description: 'Extra 30 minutes before bedtime',
        cost: 250,
        category: 'real',
        rarity: 'rare',
        icon: '🌙',
        unlocked: true
      },

      // Themes
      {
        id: 'princess-theme',
        name: 'Princess Theme',
        description: 'Unlock magical princess theme',
        cost: 200,
        category: 'theme',
        rarity: 'epic',
        icon: '👑',
        unlocked: false,
        themeColor: '#FFB6C1'
      },
      {
        id: 'unicorn-theme',
        name: 'Unicorn Theme',
        description: 'Magical unicorn background',
        cost: 300,
        category: 'theme',
        rarity: 'legendary',
        icon: '🦄',
        unlocked: false,
        themeColor: '#DDA0DD'
      },
      {
        id: 'ocean-theme',
        name: 'Ocean Theme',
        description: 'Underwater adventure theme',
        cost: 150,
        category: 'theme',
        rarity: 'rare',
        icon: '🐠',
        unlocked: false,
        themeColor: '#87CEEB'
      },
      {
        id: 'space-theme',
        name: 'Space Theme',
        description: 'Explore the galaxy theme',
        cost: 250,
        category: 'theme',
        rarity: 'epic',
        icon: '🚀',
        unlocked: false,
        themeColor: '#000033'
      },

      // Avatars
      {
        id: 'bee-avatar',
        name: 'Happy Bee Avatar',
        description: 'Cute bee character',
        cost: 100,
        category: 'avatar',
        rarity: 'common',
        icon: '🐝',
        unlocked: true
      },
      {
        id: 'dove-avatar',
        name: 'Peace Dove Avatar',
        description: 'Beautiful white dove',
        cost: 150,
        category: 'avatar',
        rarity: 'rare',
        icon: '🕊️',
        unlocked: false
      },
      {
        id: 'lion-avatar',
        name: 'Brave Lion Avatar',
        description: 'As brave as a lion!',
        cost: 200,
        category: 'avatar',
        rarity: 'epic',
        icon: '🦁',
        unlocked: false
      },

      // Power-ups
      {
        id: 'double-points',
        name: 'Double Points',
        description: 'Double points for 30 minutes',
        cost: 50,
        category: 'powerup',
        rarity: 'rare',
        icon: '⚡',
        unlocked: true,
        effect: 'doublePoints'
      },
      {
        id: 'hint-powerup',
        name: 'Free Hint',
        description: 'Get a free hint in quizzes',
        cost: 30,
        category: 'powerup',
        rarity: 'common',
        icon: '💡',
        unlocked: true,
        effect: 'freeHint'
      },
      {
        id: 'streak-protector',
        name: 'Streak Protector',
        description: 'Protect your streak for one day',
        cost: 75,
        category: 'powerup',
        rarity: 'epic',
        icon: '🛡️',
        unlocked: false,
        effect: 'protectStreak'
      },

      // Stickers
      {
        id: 'star-sticker',
        name: 'Shining Star',
        description: 'Twinkling star sticker',
        cost: 25,
        category: 'sticker',
        rarity: 'common',
        icon: '⭐',
        unlocked: true,
        animated: true
      },
      {
        id: 'cross-sticker',
        name: 'Golden Cross',
        description: 'Beautiful cross sticker',
        cost: 40,
        category: 'sticker',
        rarity: 'rare',
        icon: '✝️',
        unlocked: false,
        animated: true
      },
      {
        id: 'heart-sticker',
        name: 'Glowing Heart',
        description: 'Animated heart sticker',
        cost: 35,
        category: 'sticker',
        rarity: 'common',
        icon: '❤️',
        unlocked: true,
        animated: true
      }
    ];
  }

  static getBadges(): Badge[] {
    return [
      {
        id: 'first-word',
        name: 'First Word',
        description: 'Spell your first word correctly',
        icon: '🎯',
        unlocked: false,
        requirements: {
          type: 'words',
          target: 1,
          current: 0
        },
        rewardPoints: 25,
        category: 'learning'
      },
      {
        id: 'spelling-pro',
        name: 'Spelling Pro',
        description: 'Spell 100 words correctly',
        icon: '🏆',
        unlocked: false,
        requirements: {
          type: 'words',
          target: 100,
          current: 0
        },
        rewardPoints: 100,
        category: 'learning'
      },
      {
        id: 'perfect-quiz',
        name: 'Perfect Quiz',
        description: 'Complete a quiz with no mistakes',
        icon: '✨',
        unlocked: false,
        requirements: {
          type: 'perfectQuiz',
          target: 1,
          current: 0
        },
        rewardPoints: 50,
        category: 'learning'
      },
      {
        id: 'combo-master',
        name: 'Combo Master',
        description: 'Get a 10-word combo',
        icon: '🔥',
        unlocked: false,
        requirements: {
          type: 'combo',
          target: 10,
          current: 0
        },
        rewardPoints: 75,
        category: 'games'
      },
      {
        id: 'streak-champion',
        name: '7-Day Champion',
        description: 'Maintain a 7-day streak',
        icon: '📅',
        unlocked: false,
        requirements: {
          type: 'streak',
          target: 7,
          current: 0
        },
        rewardPoints: 150,
        category: 'streak'
      },
      {
        id: 'bible-expert',
        name: 'Bible Expert',
        description: 'Complete 10 Bible activities',
        icon: '📖',
        unlocked: false,
        requirements: {
          type: 'bible',
          target: 10,
          current: 0
        },
        rewardPoints: 100,
        category: 'faith'
      },
      {
        id: 'game-master',
        name: 'Game Master',
        description: 'Play all mini-games',
        icon: '🎮',
        unlocked: false,
        requirements: {
          type: 'games',
          target: 8,
          current: 0
        },
        rewardPoints: 200,
        category: 'games'
      },
      {
        id: 'daily-goal-star',
        name: 'Daily Goal Star',
        description: 'Complete daily goal 5 times',
        icon: '⭐',
        unlocked: false,
        requirements: {
          type: 'dailyGoal',
          target: 5,
          current: 0
        },
        rewardPoints: 125,
        category: 'streak'
      }
    ];
  }

  static getStickerCollections(): StickerCollection[] {
    return [
      {
        id: 'faith-collection',
        name: 'Faith Collection',
        theme: 'faith',
        stickers: [],
        collected: 0,
        total: 8,
        unlockCost: 200,
        unlocked: false
      },
      {
        id: 'animal-collection',
        name: 'Animal Friends',
        theme: 'animals',
        stickers: [],
        collected: 0,
        total: 10,
        unlockCost: 150,
        unlocked: true
      },
      {
        id: 'bee-collection',
        name: 'Busy Bee Collection',
        theme: 'bee',
        stickers: [],
        collected: 0,
        total: 12,
        unlockCost: 180,
        unlocked: true
      },
      {
        id: 'space-collection',
        name: 'Space Adventure',
        theme: 'space',
        stickers: [],
        collected: 0,
        total: 8,
        unlockCost: 250,
        unlocked: false
      }
    ];
  }

  static getDailyRewards(): DailyReward[] {
    return [
      { day: 1, reward: 'points', amount: 10, claimed: false },
      { day: 2, reward: 'points', amount: 15, claimed: false },
      { day: 3, reward: 'sticker', itemId: 'star-sticker', claimed: false },
      { day: 4, reward: 'points', amount: 25, claimed: false },
      { day: 5, reward: 'badge', itemId: 'daily-goal-star', claimed: false, special: true },
      { day: 6, reward: 'points', amount: 40, claimed: false },
      { day: 7, reward: 'theme', itemId: 'special-weekly-theme', claimed: false, special: true }
    ];
  }

  static getRewardCategories(): RewardCategory[] {
    return [
      { id: 'real', name: 'Real Rewards', icon: '🎁', color: '#FF6B6B' },
      { id: 'theme', name: 'Themes', icon: '🎨', color: '#4ECDC4' },
      { id: 'avatar', name: 'Avatars', icon: '👤', color: '#45B7D1' },
      { id: 'powerup', name: 'Power-ups', icon: '⚡', color: '#96CEB4' },
      { id: 'sticker', name: 'Stickers', icon: '⭐', color: '#FFEAA7' },
      { id: 'badge', name: 'Badges', icon: '🏅', color: '#DDA0DD' }
    ];
  }

  static getRewardById(id: string): RewardItem | undefined {
    return this.getAvailableRewards().find(reward => reward.id === id);
  }
}
EOF

# 4. Create Achievements Service
echo "🏆 Creating Achievements Service..."
cat > src/services/rewards/AchievementsService.ts << 'EOF'
import { Badge } from '../../types/rewards';
import { PointsService } from './PointsService';
import { RewardsDataService } from './RewardsDataService';

export class AchievementsService {
  private static BADGES_KEY = 'kids_spelling_badges';

  static initializeBadges(): Badge[] {
    const badges = RewardsDataService.getBadges();
    localStorage.setItem(this.BADGES_KEY, JSON.stringify(badges));
    return badges;
  }

  static getBadges(): Badge[] {
    const badges = localStorage.getItem(this.BADGES_KEY);
    if (!badges) {
      return this.initializeBadges();
    }
    return JSON.parse(badges);
  }

  static updateBadgeProgress(badgeId: string, increment: number = 1): Badge[] {
    const badges = this.getBadges();
    const badgeIndex = badges.findIndex(b => b.id === badgeId);

    if (badgeIndex !== -1) {
      badges[badgeIndex].requirements.current += increment;

      if (badges[badgeIndex].requirements.current >= badges[badgeIndex].requirements.target) {
        if (!badges[badgeIndex].unlocked) {
          badges[badgeIndex].unlocked = true;
          badges[badgeIndex].dateEarned = new Date();

          PointsService.addPoints(badges[badgeIndex].rewardPoints, `Badge: ${badges[badgeIndex].name}`);

          const event = new CustomEvent('badgeUnlocked', {
            detail: {
              badge: badges[badgeIndex],
              points: badges[badgeIndex].rewardPoints
            }
          });
          window.dispatchEvent(event);
        }
      }

      localStorage.setItem(this.BADGES_KEY, JSON.stringify(badges));
    }

    return badges;
  }

  static recordWordSpelled(correct: boolean, isQuiz: boolean = false): void {
    if (correct) {
      this.updateBadgeProgress('first-word');
      this.updateBadgeProgress('spelling-pro');

      const wordCount = localStorage.getItem('total_words_spelled') || '0';
      localStorage.setItem('total_words_spelled', (parseInt(wordCount) + 1).toString());
    }
  }

  static recordQuizComplete(perfect: boolean, quizType: string): void {
    if (perfect) {
      this.updateBadgeProgress('perfect-quiz');
    }

    if (quizType === 'bible') {
      this.updateBadgeProgress('bible-expert');
    }

    const quizCount = localStorage.getItem('total_quizzes_completed') || '0';
    localStorage.setItem('total_quizzes_completed', (parseInt(quizCount) + 1).toString());
  }

  static recordGamePlayed(gameId: string): void {
    const gamesPlayed = JSON.parse(localStorage.getItem('games_played') || '{}');
    gamesPlayed[gameId] = (gamesPlayed[gameId] || 0) + 1;
    localStorage.setItem('games_played', JSON.stringify(gamesPlayed));

    const allGames = ['word-race', 'spell-sprint', 'memory-match', 'balloon-pop',
                     'word-scramble', 'shape-catcher', 'spelling-adventure', 'bonus-game'];
    const playedGames = Object.keys(gamesPlayed).filter(game => gamesPlayed[game] > 0).length;

    if (playedGames >= allGames.length) {
      this.updateBadgeProgress('game-master');
    }
  }

  static recordDailyGoalComplete(): void {
    this.updateBadgeProgress('daily-goal-star');

    const dailyGoals = localStorage.getItem('daily_goals_completed') || '0';
    localStorage.setItem('daily_goals_completed', (parseInt(dailyGoals) + 1).toString());
  }

  static recordComboAchieved(combo: number): void {
    if (combo >= 10) {
      this.updateBadgeProgress('combo-master');
    }
  }

  static recordStreakAchieved(streak: number): void {
    if (streak >= 7) {
      this.updateBadgeProgress('streak-champion');
    }
  }

  static getUnlockedBadges(): Badge[] {
    const badges = this.getBadges();
    return badges.filter(badge => badge.unlocked);
  }

  static getBadgeProgress(badgeId: string): number {
    const badges = this.getBadges();
    const badge = badges.find(b => b.id === badgeId);
    if (!badge) return 0;

    return (badge.requirements.current / badge.requirements.target) * 100;
  }

  static getTotalUnlockedBadges(): number {
    return this.getUnlockedBadges().length;
  }
}
EOF

# 5. Create Reward Store (Zustand)
echo "🏪 Creating Reward Store (Zustand)..."
cat > src/stores/rewards/useRewardStore.ts << 'EOF'
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

  // Actions
  loadPoints: () => {
    set({ points: PointsService.getPoints() });
  },

  loadRewards: () => {
    const rewards = RewardsDataService.getAvailableRewards();
    const history = PointsService.getPurchaseHistory();
    set({ rewards, purchaseHistory: history });
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
          purchaseHistory: history,
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
    set({ points });

    // Check for point-based badges
    if (points.totalPoints >= 1000) {
      AchievementsService.updateBadgeProgress('spelling-pro');
    }
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
EOF

# 6. Create Reward Components
echo "🎨 Creating Reward Components..."

# RewardShop Component
cat > src/components/rewards/RewardShop.tsx << 'EOF'
import React, { useState, useEffect } from 'react';
import { useRewardStore } from '../../stores/rewards/useRewardStore';
import { RewardItem } from '../../types/rewards';
import { RewardsDataService } from '../../services/rewards/RewardsDataService';
import PointsDisplay from './PointsDisplay';
import RewardCard from './RewardCard';
import BadgeCollection from './BadgeCollection';
import './RewardShop.css';

const RewardShop: React.FC = () => {
  const {
    points,
    rewards,
    selectedCategory,
    setSelectedCategory,
    purchaseReward,
    getFilteredRewards,
    loadPoints,
    loadRewards
  } = useRewardStore();

  const [purchaseMessage, setPurchaseMessage] = useState<string>('');
  const [showRealRewards, setShowRealRewards] = useState<boolean>(true);

  useEffect(() => {
    loadPoints();
    loadRewards();

    // Listen for points earned events
    const handlePointsEarned = () => loadPoints();
    window.addEventListener('pointsEarned', handlePointsEarned);

    return () => {
      window.removeEventListener('pointsEarned', handlePointsEarned);
    };
  }, [loadPoints, loadRewards]);

  const handlePurchase = async (reward: RewardItem) => {
    if (points.availablePoints >= reward.cost) {
      const success = await purchaseReward(reward);

      if (success) {
        let message = `🎉 You purchased "${reward.name}"!`;

        if (reward.category === 'real' && reward.realLifeValue) {
          message = `🎉 You redeemed "${reward.name}"! Show this to a parent to claim your ${reward.realLifeValue}!`;
        }

        setPurchaseMessage(message);
        setTimeout(() => setPurchaseMessage(''), 4000);
      } else {
        setPurchaseMessage('❌ Purchase failed. Please try again.');
        setTimeout(() => setPurchaseMessage(''), 3000);
      }
    } else {
      const needed = reward.cost - points.availablePoints;
      setPurchaseMessage(`❌ Need ${needed} more Heavenly Stars!`);
      setTimeout(() => setPurchaseMessage(''), 3000);
    }
  };

  const filteredRewards = getFilteredRewards();
  const categories = [
    { id: 'all', name: 'All Items', icon: '🌟' },
    ...RewardsDataService.getRewardCategories()
  ];

  return (
    <div className="reward-shop">
      <div className="shop-header">
        <h1>🏆 Heavenly Rewards Shop</h1>
        <p>Spend your Heavenly Stars on awesome rewards!</p>

        <PointsDisplay />
      </div>

      {purchaseMessage && (
        <div className={`purchase-message ${purchaseMessage.includes('❌') ? 'error' : 'success'}`}>
          {purchaseMessage}
        </div>
      )}

      <div className="category-filter">
        {categories.map(category => (
          <button
            key={category.id}
            className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category.id)}
            style={{ borderLeftColor: category.color || '#ffd700' }}
          >
            <span className="category-icon">{category.icon}</span>
            <span className="category-name">{category.name}</span>
          </button>
        ))}
      </div>

      {showRealRewards && (
        <div className="real-rewards-banner">
          <div className="banner-content">
            <span className="banner-icon">🎁</span>
            <div className="banner-text">
              <h3>Real-Life Rewards Available!</h3>
              <p>Save up your Heavenly Stars for special treats and activities!</p>
            </div>
            <button
              className="close-banner"
              onClick={() => setShowRealRewards(false)}
              aria-label="Close banner"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div className="rewards-grid">
        {filteredRewards.length > 0 ? (
          filteredRewards.map(reward => (
            <RewardCard
              key={reward.id}
              reward={reward}
              points={points.availablePoints}
              onPurchase={() => handlePurchase(reward)}
            />
          ))
        ) : (
          <div className="no-rewards">
            <p>No rewards found in this category.</p>
          </div>
        )}
      </div>

      <BadgeCollection />

      <div className="earning-tips">
        <h3>💡 Ways to Earn Heavenly Stars</h3>
        <ul>
          <li>✅ Spell words correctly: <strong>+10 stars</strong></li>
          <li>🔥 Combo bonus: <strong>+5 stars every 5 combo</strong></li>
          <li>🏆 Complete quizzes: <strong>+25 stars</strong></li>
          <li>📅 Daily login streak: <strong>Bonus stars</strong></li>
          <li>🎮 Play mini-games: <strong>+15-30 stars</strong></li>
          <li>📖 Read daily Bible verse: <strong>+20 stars</strong></li>
          <li>✨ Unlock badges: <strong>+25-200 stars</strong></li>
        </ul>
      </div>
    </div>
  );
};

export default RewardShop;
EOF

# PointsDisplay Component
cat > src/components/rewards/PointsDisplay.tsx << 'EOF'
import React, { useState, useEffect } from 'react';
import { useRewardStore } from '../../stores/rewards/useRewardStore';
import './RewardShop.css';

const PointsDisplay: React.FC = () => {
  const { points, resetDailyStats } = useRewardStore();
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    // Check if it's a new day for reset
    const today = new Date().toDateString();
    const lastReset = localStorage.getItem('last_points_reset');

    if (lastReset !== today) {
      resetDailyStats();
      localStorage.setItem('last_points_reset', today);
    }
  }, [resetDailyStats]);

  const handlePointsClick = () => {
    setShowAnimation(true);
    setTimeout(() => setShowAnimation(false), 1000);
  };

  return (
    <div className="points-display" onClick={handlePointsClick}>
      <div className="points-count">
        <span className="points-icon">⭐</span>
        <span className="points-amount">{points.availablePoints}</span>
        <span className="points-label">Heavenly Stars Available</span>
      </div>

      <div className="points-stats">
        <div className="stat-item">
          <span className="stat-label">Total Earned:</span>
          <span className="stat-value">{points.totalPoints} ⭐</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Daily Streak:</span>
          <span className="stat-value streak">{points.dailyStreak} days 🔥</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Highest Combo:</span>
          <span className="stat-value">{points.highestCombo} 🔗</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Today's Points:</span>
          <span className="stat-value">{points.pointsToday} ⭐</span>
        </div>
      </div>

      {showAnimation && (
        <div className="points-animation">
          <span>⭐</span>
          <span>✨</span>
          <span>🌟</span>
        </div>
      )}
    </div>
  );
};

export default PointsDisplay;
EOF

# RewardCard Component
cat > src/components/rewards/RewardCard.tsx << 'EOF'
import React from 'react';
import { RewardItem } from '../../types/rewards';
import './RewardShop.css';

interface RewardCardProps {
  reward: RewardItem;
  points: number;
  onPurchase: () => void;
}

const RewardCard: React.FC<RewardCardProps> = ({ reward, points, onPurchase }) => {
  const getRarityColor = (rarity: string) => {
    switch(rarity) {
      case 'common': return '#2ecc71';
      case 'rare': return '#3498db';
      case 'epic': return '#9b59b6';
      case 'legendary': return '#f1c40f';
      default: return '#95a5a6';
    }
  };

  const canAfford = points >= reward.cost;
  const isLocked = !reward.unlocked;

  return (
    <div
      className={`reward-card ${isLocked ? 'locked' : 'unlocked'} ${!canAfford ? 'cannot-afford' : ''}`}
      style={{
        borderColor: getRarityColor(reward.rarity),
        background: reward.themeColor ? `${reward.themeColor}20` : 'white'
      }}
    >
      <div className="reward-header">
        <span className="reward-icon">{reward.icon}</span>
        <span className="reward-rarity" style={{ color: getRarityColor(reward.rarity) }}>
          {reward.rarity.toUpperCase()}
        </span>
      </div>

      <div className="reward-content">
        <h3>{reward.name}</h3>
        <p>{reward.description}</p>

        {reward.category === 'real' && reward.realLifeValue && (
          <div className="real-reward-info">
            <span className="real-badge">REAL REWARD</span>
            <p className="real-value">🎯 {reward.realLifeValue}</p>
          </div>
        )}

        {reward.animated && (
          <span className="animated-badge">✨ ANIMATED</span>
        )}

        {reward.effect && (
          <span className="effect-badge">⚡ {reward.effect.toUpperCase().replace('-', ' ')}</span>
        )}
      </div>

      <div className="reward-footer">
        <div className="reward-cost">
          <span className="cost-icon">⭐</span>
          <span className="cost-amount">{reward.cost}</span>
        </div>

        <button
          className="purchase-btn"
          onClick={onPurchase}
          disabled={isLocked || !canAfford}
          aria-label={`Purchase ${reward.name} for ${reward.cost} points`}
        >
          {isLocked ? (
            <>
              <span className="lock-icon">🔒</span>
              <span>Locked</span>
            </>
          ) : !canAfford ? (
            <>
              <span className="star-icon">⭐</span>
              <span>Need More</span>
            </>
          ) : reward.category === 'real' ? (
            'REDEEM'
          ) : (
            'PURCHASE'
          )}
        </button>
      </div>

      {!canAfford && !isLocked && (
        <div className="need-more-stars">
          Need {reward.cost - points} more stars
        </div>
      )}
    </div>
  );
};

export default RewardCard;
EOF

# BadgeCollection Component
cat > src/components/rewards/BadgeCollection.tsx << 'EOF'
import React from 'react';
import { useRewardStore } from '../../stores/rewards/useRewardStore';
import './RewardShop.css';

const BadgeCollection: React.FC = () => {
  const { unlockedBadges } = useRewardStore();

  if (unlockedBadges.length === 0) {
    return null;
  }

  return (
    <div className="badges-section">
      <h2>
        <span className="badge-icon">🏅</span>
        Your Earned Badges
        <span className="badge-count">({unlockedBadges.length})</span>
      </h2>

      <div className="badges-grid">
        {unlockedBadges.map(badge => (
          <div key={badge.id} className="badge-card">
            <div className="badge-icon-large">{badge.icon}</div>
            <div className="badge-content">
              <h4>{badge.name}</h4>
              <p>{badge.description}</p>

              {badge.dateEarned && (
                <div className="badge-date">
                  <span className="date-icon">📅</span>
                  <span>{new Date(badge.dateEarned).toLocaleDateString()}</span>
                </div>
              )}

              <div className="badge-reward">
                <span className="reward-icon">⭐</span>
                <span>{badge.rewardPoints} points earned</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BadgeCollection;
EOF

# 7. Create CSS for Reward Components
echo "🎨 Creating CSS for reward components..."
cat > src/components/rewards/RewardShop.css << 'EOF'
/* RewardShop.css */
:root {
  --spacing-xs: 0.5rem;
  --spacing-sm: 1rem;
  --spacing-md: 1.5rem;
  --spacing-lg: 2rem;
  --spacing-xl: 3rem;

  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 20px;
  --radius-xl: 30px;

  --color-primary: #667eea;
  --color-secondary: #764ba2;
  --color-success: #2ecc71;
  --color-warning: #f39c12;
  --color-danger: #e74c3c;
  --color-info: #3498db;

  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.15);
  --shadow-lg: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.reward-shop {
  max-width: 1400px;
  margin: 0 auto;
  padding: var(--spacing-lg);
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
}

/* Shop Header */
.shop-header {
  text-align: center;
  margin-bottom: var(--spacing-xl);
  padding: var(--spacing-xl);
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  border-radius: var(--radius-xl);
  color: white;
  box-shadow: var(--shadow-lg);
  position: relative;
  overflow: hidden;
}

.shop-header::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
  background-size: 30px 30px;
  animation: float 20s linear infinite;
}

@keyframes float {
  0% { transform: translate(0, 0) rotate(0deg); }
  100% { transform: translate(-30px, -30px) rotate(360deg); }
}

.shop-header h1 {
  font-size: 3rem;
  margin-bottom: var(--spacing-sm);
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  position: relative;
}

.shop-header p {
  font-size: 1.3rem;
  opacity: 0.9;
  margin-bottom: var(--spacing-lg);
  position: relative;
}

/* Points Display */
.points-display {
  background: rgba(255, 255, 255, 0.15);
  padding: var(--spacing-lg);
  border-radius: var(--radius-lg);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.2);
  position: relative;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.points-display:hover {
  transform: translateY(-2px);
}

.points-count {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.points-icon {
  font-size: 2.5rem;
  animation: pulse 2s infinite;
  filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.5));
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.points-amount {
  font-size: 3.5rem;
  font-weight: bold;
  color: #FFD700;
  text-shadow: 0 0 20px rgba(255, 215, 0, 0.7);
  font-family: 'Comic Sans MS', cursive, sans-serif;
}

.points-label {
  font-size: 1.2rem;
  opacity: 0.9;
  background: rgba(0, 0, 0, 0.2);
  padding: 0.5rem 1rem;
  border-radius: var(--radius-md);
}

.points-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-md);
  justify-items: center;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--spacing-sm);
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-md);
  min-width: 150px;
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.8;
  margin-bottom: 0.3rem;
}

.stat-value {
  font-size: 1.2rem;
  font-weight: bold;
}

.stat-value.streak {
  color: #FF6B6B;
  animation: glow 1.5s ease-in-out infinite alternate;
}

@keyframes glow {
  from { text-shadow: 0 0 5px rgba(255, 107, 107, 0.5); }
  to { text-shadow: 0 0 15px rgba(255, 107, 107, 0.8); }
}

.points-animation {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;
}

.points-animation span {
  position: absolute;
  font-size: 2rem;
  animation: float-up 1s ease-out forwards;
}

@keyframes float-up {
  0% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  100% {
    opacity: 0;
    transform: translateY(-50px) scale(1.5);
  }
}

/* Purchase Message */
.purchase-message {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: var(--spacing-md) var(--spacing-xl);
  border-radius: var(--radius-lg);
  font-weight: bold;
  z-index: 1000;
  animation: slide-down 0.3s ease-out;
  box-shadow: var(--shadow-md);
  max-width: 500px;
  text-align: center;
}

@keyframes slide-down {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

.purchase-message.success {
  background: var(--color-success);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.purchase-message.error {
  background: var(--color-danger);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

/* Category Filter */
.category-filter {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-lg);
  justify-content: center;
}

.category-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  background: white;
  border: none;
  border-radius: var(--radius-md);
  border-left: 4px solid;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  box-shadow: var(--shadow-sm);
}

.category-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.category-btn.active {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  color: white;
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.category-icon {
  font-size: 1.2rem;
}

.category-name {
  font-size: 0.9rem;
}

/* Real Rewards Banner */
.real-rewards-banner {
  background: linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%);
  border-radius: var(--radius-lg);
  margin-bottom: var(--spacing-lg);
  padding: var(--spacing-md);
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.banner-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: white;
}

.banner-icon {
  font-size: 2.5rem;
  margin-right: var(--spacing-md);
}

.banner-text h3 {
  margin: 0 0 var(--spacing-xs) 0;
  font-size: 1.3rem;
}

.banner-text p {
  margin: 0;
  opacity: 0.9;
}

.close-banner {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s ease;
}

.close-banner:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* Rewards Grid */
.rewards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.no-rewards {
  grid-column: 1 / -1;
  text-align: center;
  padding: var(--spacing-xl);
  background: white;
  border-radius: var(--radius-lg);
  font-size: 1.2rem;
  color: #666;
}

/* Reward Card */
.reward-card {
  background: white;
  border-radius: var(--radius-lg);
  padding: var(--spacing-md);
  border: 3px solid;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: var(--shadow-md);
  display: flex;
  flex-direction: column;
}

.reward-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
}

.reward-card.locked {
  opacity: 0.7;
  filter: grayscale(0.5);
}

.reward-card.cannot-afford:not(.locked) {
  border-style: dashed;
}

.reward-card.cannot-afford:not(.locked)::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent 49%, rgba(255, 107, 107, 0.1) 50%, transparent 51%);
  background-size: 10px 10px;
}

.reward-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-sm);
}

.reward-icon {
  font-size: 2.5rem;
  animation: wiggle 3s ease-in-out infinite;
}

@keyframes wiggle {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-5deg); }
  75% { transform: rotate(5deg); }
}

.reward-rarity {
  font-size: 0.8rem;
  font-weight: bold;
  padding: 0.2rem 0.6rem;
  border-radius: var(--radius-sm);
  background: rgba(0, 0, 0, 0.05);
}

.reward-content {
  flex: 1;
  margin-bottom: var(--spacing-md);
}

.reward-content h3 {
  margin: 0 0 var(--spacing-xs) 0;
  color: #2c3e50;
  font-size: 1.3rem;
}

.reward-content p {
  margin: 0 0 var(--spacing-sm) 0;
  color: #666;
  font-size: 0.95rem;
  line-height: 1.4;
}

.real-reward-info {
  background: rgba(255, 107, 107, 0.1);
  padding: var(--spacing-sm);
  border-radius: var(--radius-md);
  margin: var(--spacing-sm) 0;
}

.real-badge {
  display: inline-block;
  background: #FF6B6B;
  color: white;
  font-size: 0.7rem;
  padding: 0.2rem 0.6rem;
  border-radius: var(--radius-sm);
  margin-bottom: 0.3rem;
}

.real-value {
  margin: 0;
  font-size: 0.9rem;
  font-weight: bold;
  color: #FF6B6B;
}

.animated-badge,
.effect-badge {
  display: inline-block;
  background: rgba(155, 89, 182, 0.1);
  color: #9b59b6;
  font-size: 0.7rem;
  padding: 0.2rem 0.6rem;
  border-radius: var(--radius-sm);
  margin-right: 0.5rem;
  margin-bottom: 0.3rem;
}

.effect-badge {
  background: rgba(52, 152, 219, 0.1);
  color: #3498db;
}

.reward-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.reward-cost {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.cost-icon {
  font-size: 1.5rem;
  color: #f1c40f;
}

.cost-amount {
  font-size: 1.8rem;
  font-weight: bold;
  color: #f39c12;
}

.purchase-btn {
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: var(--radius-md);
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.purchase-btn:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.purchase-btn:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
  opacity: 0.7;
}

.purchase-btn:disabled .lock-icon,
.purchase-btn:disabled .star-icon {
  opacity: 0.8;
}

.need-more-stars {
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--color-danger);
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: var(--radius-sm);
  font-size: 0.8rem;
  white-space: nowrap;
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

/* Badges Section */
.badges-section {
  margin-top: var(--spacing-xl);
  padding: var(--spacing-lg);
  background: white;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
}

.badges-section h2 {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-lg);
  color: #2c3e50;
}

.badge-icon {
  font-size: 1.5rem;
}

.badge-count {
  background: var(--color-primary);
  color: white;
  padding: 0.2rem 0.6rem;
  border-radius: var(--radius-sm);
  font-size: 0.9rem;
}

.badges-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-md);
}

.badge-card {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: #f8f9fa;
  border-radius: var(--radius-lg);
  border-left: 4px solid var(--color-primary);
  transition: transform 0.3s ease;
}

.badge-card:hover {
  transform: translateX(5px);
}

.badge-icon-large {
  font-size: 2.5rem;
  background: white;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: var(--shadow-sm);
}

.badge-content {
  flex: 1;
}

.badge-content h4 {
  margin: 0 0 var(--spacing-xs) 0;
  color: #2c3e50;
}

.badge-content p {
  margin: 0 0 var(--spacing-sm) 0;
  color: #666;
  font-size: 0.9rem;
}

.badge-date,
.badge-reward {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: #7f8c8d;
  margin-top: 0.3rem;
}

.badge-reward {
  color: #f39c12;
  font-weight: bold;
}

.date-icon,
.reward-icon {
  font-size: 1rem;
}

/* Earning Tips */
.earning-tips {
  margin-top: var(--spacing-xl);
  padding: var(--spacing-lg);
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
}

.earning-tips h3 {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
  color: #2c3e50;
}

.earning-tips ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: var(--spacing-sm);
}

.earning-tips li {
  padding: var(--spacing-sm);
  background: rgba(255, 255, 255, 0.3);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.earning-tips li::before {
  content: '→';
  font-weight: bold;
  color: var(--color-primary);
}

.earning-tips strong {
  color: var(--color-primary);
  margin-left: auto;
}

/* Responsive Design */
@media (max-width: 768px) {
  .reward-shop {
    padding: var(--spacing-sm);
  }

  .shop-header h1 {
    font-size: 2rem;
  }

  .points-stats {
    grid-template-columns: 1fr;
  }

  .rewards-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }

  .category-filter {
    overflow-x: auto;
    justify-content: flex-start;
    padding-bottom: var(--spacing-sm);
  }

  .category-btn {
    white-space: nowrap;
  }

  .earning-tips ul {
    grid-template-columns: 1fr;
  }
}

/* Loading Animation */
@keyframes shimmer {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}

.loading-shimmer {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
EOF

# 8. Create Integration Hooks
echo "⚛️ Creating integration hooks..."

# useRewards hook
cat > src/hooks/rewards/useRewards.ts << 'EOF'
import { useEffect } from 'react';
import { useRewardStore } from '../../stores/rewards/useRewardStore';
import { PointsService } from '../../services/rewards/PointsService';
import { AchievementsService } from '../../services/rewards/AchievementsService';

export const useRewards = () => {
  const {
    points,
    addPoints,
    addComboPoints,
    recordActivity,
    loadPoints,
    loadRewards,
    loadBadges
  } = useRewardStore();

  // Initialize rewards system
  useEffect(() => {
    loadPoints();
    loadRewards();
    loadBadges();
  }, [loadPoints, loadRewards, loadBadges]);

  // Check daily reset
  useEffect(() => {
    const today = new Date().toDateString();
    const lastReset = localStorage.getItem('last_daily_reset');

    if (lastReset !== today) {
      PointsService.resetDailyPoints();
      localStorage.setItem('last_daily_reset', today);
      loadPoints();
    }
  }, [loadPoints]);

  return {
    points,
    addPoints,
    addComboPoints,
    recordActivity,
    getCurrentStreak: PointsService.getDailyStreak,
    getTotalUnlockedBadges: AchievementsService.getTotalUnlockedBadges
  };
};
EOF

# useRewardNotifications hook
cat > src/hooks/rewards/useRewardNotifications.ts << 'EOF'
import { useEffect } from 'react';
import { useRewardStore } from '../../stores/rewards/useRewardStore';

export const useRewardNotifications = () => {
  const { unlockedBadges } = useRewardStore();

  useEffect(() => {
    // Listen for badge unlock events
    const handleBadgeUnlocked = (event: CustomEvent) => {
      const { badge, points } = event.detail;

      // Show notification (could be integrated with your existing notification system)
      console.log(`🎉 New badge unlocked: ${badge.name}! Earned ${points} points.`);

      // You could dispatch this to your notification store
      // useNotificationStore.getState().addNotification({
      //   type: 'success',
      //   title: 'Badge Unlocked!',
      //   message: `You earned the "${badge.name}" badge and ${points} points!`,
      //   duration: 5000
      // });
    };

    const handlePointsEarned = (event: CustomEvent) => {
      const { amount, reason, total } = event.detail;

      console.log(`✨ +${amount} Heavenly Stars! (${reason}) Total: ${total}`);

      // You could show a floating points animation here
    };

    window.addEventListener('badgeUnlocked', handleBadgeUnlocked as EventListener);
    window.addEventListener('pointsEarned', handlePointsEarned as EventListener);

    return () => {
      window.removeEventListener('badgeUnlocked', handleBadgeUnlocked as EventListener);
      window.removeEventListener('pointsEarned', handlePointsEarned as EventListener);
    };
  }, []);

  // Show notification for new badges
  useEffect(() => {
    const lastBadgeCount = parseInt(localStorage.getItem('last_badge_count') || '0');
    const currentBadgeCount = unlockedBadges.length;

    if (currentBadgeCount > lastBadgeCount) {
      const newBadges = unlockedBadges.slice(lastBadgeCount);

      newBadges.forEach(badge => {
        // Trigger confetti or celebration
        const event = new CustomEvent('showCelebration', {
          detail: {
            type: 'badge',
            message: `New badge: ${badge.name}!`,
            icon: badge.icon
          }
        });
        window.dispatchEvent(event);
      });

      localStorage.setItem('last_badge_count', currentBadgeCount.toString());
    }
  }, [unlockedBadges]);

  return null;
};
EOF

# 9. Create Integration Points with Learning System
echo "🔗 Creating integration points..."

# Learning Progress Integration
cat > src/services/rewards/ProgressIntegration.ts << 'EOF'
import { AchievementsService } from './AchievementsService';
import { PointsService } from './PointsService';

export class ProgressIntegration {
  /**
   * Call this when a word is spelled in Learn/Spell mode
   */
  static onWordSpelled(word: string, correct: boolean, isQuiz: boolean = false) {
    AchievementsService.recordWordSpelled(correct, isQuiz);

    if (correct) {
      // Add points for correct spelling
      PointsService.addPoints(10, `Spelled "${word}" correctly`);

      // Track combo (simplified - you'd want more robust combo tracking)
      const currentCombo = parseInt(localStorage.getItem('current_combo') || '0') + 1;
      localStorage.setItem('current_combo', currentCombo.toString());

      // Check for combo milestones
      if (currentCombo % 5 === 0) {
        const comboPoints = PointsService.addComboPoints(currentCombo);
        console.log(`🔥 ${currentCombo}-word combo! +${comboPoints} bonus points!`);
      }
    } else {
      // Reset combo on incorrect
      localStorage.setItem('current_combo', '0');
    }
  }

  /**
   * Call this when a quiz is completed
   */
  static onQuizComplete(quizType: 'spell' | 'vocab' | 'bible', perfect: boolean, score: number) {
    AchievementsService.recordQuizComplete(perfect, quizType);

    // Award points based on performance
    let points = perfect ? 50 : 25;
    points += Math.floor(score / 10); // Bonus for high score

    PointsService.addPoints(points, `${quizType} quiz completed`);

    if (perfect) {
      console.log('✨ Perfect quiz! Bonus points awarded.');
    }
  }

  /**
   * Call this when a mini-game is completed
   */
  static onGameComplete(gameId: string, score: number, timePlayed: number) {
    AchievementsService.recordGamePlayed(gameId);

    // Award points based on game performance
    const basePoints = 15;
    const scoreBonus = Math.floor(score / 100);
    const timeBonus = Math.floor(timePlayed / 30);
    const totalPoints = basePoints + scoreBonus + timeBonus;

    PointsService.addPoints(totalPoints, `${gameId} game`);

    return totalPoints;
  }

  /**
   * Call this when daily goal is reached
   */
  static onDailyGoalReached(wordsSpelled: number) {
    AchievementsService.recordDailyGoalComplete();

    // Bonus points for reaching daily goal
    const basePoints = 30;
    const wordBonus = Math.floor(wordsSpelled / 10);
    const totalPoints = basePoints + wordBonus;

    PointsService.addPoints(totalPoints, 'Daily goal reached');

    return totalPoints;
  }

  /**
   * Call this for Bible/faith activities
   */
  static onBibleActivityCompleted(activityType: 'verse' | 'trivia' | 'prayer', correctAnswers?: number) {
    AchievementsService.updateBadgeProgress('bible-expert');

    let points = 20; // Base for reading verse
    if (activityType === 'trivia' && correctAnswers) {
      points += correctAnswers * 5; // Bonus for correct trivia answers
    }

    PointsService.addPoints(points, `Bible ${activityType}`);

    return points;
  }

  /**
   * Call this when user logs in daily
   */
  static onDailyLogin() {
    PointsService.updateStreak();
    const streak = PointsService.getDailyStreak();

    // Award streak bonus
    let streakBonus = 0;
    if (streak >= 7) {
      streakBonus = 50;
    } else if (streak >= 3) {
      streakBonus = 20;
    }

    if (streakBonus > 0) {
      PointsService.addPoints(streakBonus, `${streak}-day login streak`);
    }

    // Check for streak achievements
    AchievementsService.recordStreakAchieved(streak);

    return { streak, streakBonus };
  }

  /**
   * Get current progress summary
   */
  static getProgressSummary() {
    const points = PointsService.getPoints();
    const unlockedBadges = AchievementsService.getUnlockedBadges();

    return {
      totalPoints: points.totalPoints,
      availablePoints: points.availablePoints,
      dailyStreak: points.dailyStreak,
      highestCombo: points.highestCombo,
      unlockedBadges: unlockedBadges.length,
      badges: unlockedBadges,
      pointsToday: points.pointsToday
    };
  }

  /**
   * Reset daily progress (call at midnight or new day)
   */
  static resetDailyProgress() {
    PointsService.resetDailyPoints();

    // Reset combo for new day
    localStorage.setItem('current_combo', '0');

    // Reset daily goal tracking
    localStorage.setItem('daily_words_spelled', '0');

    console.log('📅 Daily progress reset for new day');
  }
}
EOF

# 10. Create Main Rewards Page
cat > src/pages/RewardsPage.tsx << 'EOF'
import React from 'react';
import RewardShop from '../components/rewards/RewardShop';
import { useRewardNotifications } from '../hooks/rewards/useRewardNotifications';

const RewardsPage: React.FC = () => {
  // Initialize reward notifications
  useRewardNotifications();

  return (
    <div className="rewards-page">
      <RewardShop />
    </div>
  );
};

export default RewardsPage;
EOF

# 11. Create Integration Example for App.tsx
cat > integration-example.txt << 'EOF'
// Example integration in your App.tsx or main component:

import { useRewards } from './hooks/rewards/useRewards';
import { ProgressIntegration } from './services/rewards/ProgressIntegration';

// In your learning components, call these when events occur:

// When a word is spelled correctly:
ProgressIntegration.onWordSpelled('example', true, false);

// When a quiz is completed:
ProgressIntegration.onQuizComplete('spell', true, 95);

// When a game is completed:
ProgressIntegration.onGameComplete('word-race', 1500, 60);

// When daily goal is reached:
ProgressIntegration.onDailyGoalReached(50);

// On daily login (call in useEffect when app loads):
useEffect(() => {
  ProgressIntegration.onDailyLogin();
}, []);

// For Bible activities:
ProgressIntegration.onBibleActivityCompleted('verse');
ProgressIntegration.onBibleActivityCompleted('trivia', 8);
EOF

# 12. Create README for Rewards System
cat > REWARDS_SYSTEM_README.md << 'EOF'
# Kids Spelling Bee - Rewards System

## Overview
A comprehensive points-based rewards system with Heavenly Stars, badges, achievements, and a reward shop.

## Structure