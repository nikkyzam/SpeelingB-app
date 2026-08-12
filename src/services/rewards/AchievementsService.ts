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
