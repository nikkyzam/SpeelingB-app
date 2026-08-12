import React from 'react';
import RewardShop from '../components/rewards/RewardShop';
import { useRewardNotifications } from '../hooks/rewards/useRewardNotifications';

const RewardsPage: React.FC = () => {
  // Initialize reward notifications
  useRewardNotifications();

  return (
    <div className="rewards-page">
      <RewardShop />
    </div>
  );
};

export default RewardsPage;
