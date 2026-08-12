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
