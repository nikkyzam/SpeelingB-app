import { getFamilyRewards } from './FamilyRewards';
import { RewardItem, Badge, StickerCollection, DailyReward, RewardCategory } from '../../types/rewards';

export class RewardsDataService {
  static getAvailableRewards(): RewardItem[] {
    return getFamilyRewards().offers.map(offer => ({
      ...offer, description: 'A family reward. Ask your grown-up to approve it.',
      category: 'real' as const, rarity: 'common' as const, icon: '🎁', unlocked: true,
    }));
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
