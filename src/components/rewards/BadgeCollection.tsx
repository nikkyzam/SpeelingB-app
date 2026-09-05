import React, { useEffect } from 'react';
import { useRewardStore } from '../../stores/rewards/useRewardStore';
import './RewardShop.css';

/**
 * The trophy case.
 *
 * It used to render only *earned* badges — and since nothing in the app ever
 * recorded badge progress, that meant it rendered nothing, ever. Locked badges
 * are now shown too, with how far along they are: a child needs to see the
 * thing they are chasing, and "2 more words" pulls much harder than a blank
 * space where a trophy case should be.
 */
const BadgeCollection: React.FC = () => {
  const { badges, unlockedBadges, loadBadges } = useRewardStore();

  useEffect(() => {
    loadBadges();
    const refresh = () => loadBadges();
    window.addEventListener('badgeUnlocked', refresh);
    return () => window.removeEventListener('badgeUnlocked', refresh);
  }, [loadBadges]);

  if (badges.length === 0) {
    return null;
  }

  // Closest to earning first, so there is always something within reach on top.
  const ordered = [...badges].sort((a, b) => {
    if (a.unlocked !== b.unlocked) return a.unlocked ? -1 : 1;
    const pa = a.requirements.current / Math.max(a.requirements.target, 1);
    const pb = b.requirements.current / Math.max(b.requirements.target, 1);
    return pb - pa;
  });

  return (
    <div className="badges-section">
      <h2>
        <span className="badge-icon">🏅</span>
        Badges
        <span className="badge-count">({unlockedBadges.length}/{badges.length})</span>
      </h2>

      <div className="badges-grid">
        {ordered.map(badge => {
          const { current, target } = badge.requirements;
          const percent = Math.min(100, Math.round((current / Math.max(target, 1)) * 100));
          const left = Math.max(0, target - current);

          return (
            <div key={badge.id} className={`badge-card ${badge.unlocked ? 'earned' : 'locked'}`}>
              <div className="badge-icon-large">{badge.unlocked ? badge.icon : '🔒'}</div>
              <div className="badge-content">
                <h4>{badge.name}</h4>
                <p>{badge.description}</p>

                {badge.unlocked ? (
                  <>
                    {badge.dateEarned && (
                      <div className="badge-date">
                        <span className="date-icon">📅</span>
                        <span>{new Date(badge.dateEarned).toLocaleDateString()}</span>
                      </div>
                    )}
                    <div className="badge-reward">
                      <span className="reward-icon">⭐</span>
                      <span>{badge.rewardPoints} stars earned</span>
                    </div>
                  </>
                ) : (
                  <div className="badge-progress">
                    <div className="badge-progress-track">
                      <div className="badge-progress-fill" style={{ width: `${percent}%` }} />
                    </div>
                    <span className="badge-progress-text">
                      {left} to go · {badge.rewardPoints} stars
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BadgeCollection;
