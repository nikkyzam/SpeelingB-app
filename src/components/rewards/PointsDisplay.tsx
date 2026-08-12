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
