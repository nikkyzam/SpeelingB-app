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
