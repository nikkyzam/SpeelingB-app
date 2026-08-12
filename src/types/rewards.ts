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
