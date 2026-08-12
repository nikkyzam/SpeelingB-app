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
