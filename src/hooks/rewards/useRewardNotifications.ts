import { useEffect } from 'react';
import { useRewardStore } from '../../stores/rewards/useRewardStore';

export const useRewardNotifications = () => {
  const { unlockedBadges } = useRewardStore();

  useEffect(() => {
    // Listen for badge unlock events
    const handleBadgeUnlocked = (event: CustomEvent) => {
      const { badge, points } = event.detail;

      // Show notification (could be integrated with your existing notification system)
      console.log(`🎉 New badge unlocked: ${badge.name}! Earned ${points} points.`);

      // You could dispatch this to your notification store
      // useNotificationStore.getState().addNotification({
      //   type: 'success',
      //   title: 'Badge Unlocked!',
      //   message: `You earned the "${badge.name}" badge and ${points} points!`,
      //   duration: 5000
      // });
    };

    const handlePointsEarned = (event: CustomEvent) => {
      const { amount, reason, total } = event.detail;

      console.log(`✨ +${amount} Heavenly Stars! (${reason}) Total: ${total}`);

      // You could show a floating points animation here
    };

    window.addEventListener('badgeUnlocked', handleBadgeUnlocked as EventListener);
    window.addEventListener('pointsEarned', handlePointsEarned as EventListener);

    return () => {
      window.removeEventListener('badgeUnlocked', handleBadgeUnlocked as EventListener);
      window.removeEventListener('pointsEarned', handlePointsEarned as EventListener);
    };
  }, []);

  // Show notification for new badges
  useEffect(() => {
    const lastBadgeCount = parseInt(localStorage.getItem('last_badge_count') || '0');
    const currentBadgeCount = unlockedBadges.length;

    if (currentBadgeCount > lastBadgeCount) {
      const newBadges = unlockedBadges.slice(lastBadgeCount);

      newBadges.forEach(badge => {
        // Trigger confetti or celebration
        const event = new CustomEvent('showCelebration', {
          detail: {
            type: 'badge',
            message: `New badge: ${badge.name}!`,
            icon: badge.icon
          }
        });
        window.dispatchEvent(event);
      });

      localStorage.setItem('last_badge_count', currentBadgeCount.toString());
    }
  }, [unlockedBadges]);

  return null;
};
