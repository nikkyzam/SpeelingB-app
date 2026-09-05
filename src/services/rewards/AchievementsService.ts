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

  /**
   * Set a badge's progress outright, for badges that track a *best so far*
   * rather than a running total.
   *
   * "Get a 10-word combo" and "Maintain a 7-day streak" were both being
   * incremented by one each time they were achieved, so a 10-combo had to
   * happen ten times before the badge for doing it once would unlock.
   */
  static setBadgeProgress(badgeId: string, value: number): Badge[] {
    const badges = this.getBadges();
    const index = badges.findIndex(b => b.id === badgeId);
    if (index === -1) return badges;

    const badge = badges[index];
    // Never walk progress backwards — a shorter streak today shouldn't undo it.
    const next = Math.min(Math.max(badge.requirements.current, value), badge.requirements.target);
    if (next === badge.requirements.current) return badges;

    // Reuse the increment path so unlocking, points and the event stay in one place.
    return this.updateBadgeProgress(badgeId, next - badge.requirements.current);
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

    // How many *different* games have been played. The old version compared
    // this against a hardcoded list of eight long-since-renamed game ids, then
    // incremented by one — so the badge needed eight more plays after already
    // qualifying. The badge's own target is the bar to clear.
    const distinctGames = Object.keys(gamesPlayed).filter(game => gamesPlayed[game] > 0).length;
    this.setBadgeProgress('game-master', distinctGames);
  }

  static recordDailyGoalComplete(): void {
    this.updateBadgeProgress('daily-goal-star');

    const dailyGoals = localStorage.getItem('daily_goals_completed') || '0';
    localStorage.setItem('daily_goals_completed', (parseInt(dailyGoals) + 1).toString());
  }

  static recordComboAchieved(combo: number): void {
    // Progress is the best combo so far, so the bar fills as they get closer.
    this.setBadgeProgress('combo-master', combo);
  }

  static recordStreakAchieved(streak: number): void {
    this.setBadgeProgress('streak-champion', streak);
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
