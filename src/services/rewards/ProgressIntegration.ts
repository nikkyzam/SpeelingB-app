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
