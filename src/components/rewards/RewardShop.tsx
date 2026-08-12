import React, { useState, useEffect } from 'react';
import { useRewardStore } from '../../stores/rewards/useRewardStore';
import { RewardItem } from '../../types/rewards';
import { RewardsDataService } from '../../services/rewards/RewardsDataService';
import PointsDisplay from './PointsDisplay';
import RewardCard from './RewardCard';
import BadgeCollection from './BadgeCollection';
import { useRewardStore as useV2RewardStore } from '../../stores/rewards/useRewardStore';
import { useRewardStore as useV1RewardStore } from '../../stores/rewardStore';
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
  } = useV2RewardStore();

  const { addStars } = useV1RewardStore();

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
    { id: 'all', name: 'All Items', icon: '🌟', color: '#ffd700' },
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
