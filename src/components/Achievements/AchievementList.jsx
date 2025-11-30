import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { ACHIEVEMENTS } from '../../constants/achievements';

/**
 * AchievementList Component
 * Displays all five achievements with locked/unlocked states
 * Shows achievement descriptions and unlock timestamps
 * 
 * Requirements: 6.1, 6.2, 6.3, 6.4, 6.5
 * 
 * @returns {React.ReactElement} Achievement list component
 */
export function AchievementList() {
  const { achievements } = useAppContext();
  const { achievementState } = achievements;

  /**
   * Format unlock timestamp for display
   * @param {string|null} timestamp - ISO timestamp string
   * @returns {string} Formatted date string
   */
  const formatUnlockDate = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    // Show relative time for recent unlocks
    if (diffDays === 0) {
      return 'Unlocked today';
    } else if (diffDays === 1) {
      return 'Unlocked yesterday';
    } else if (diffDays < 7) {
      return `Unlocked ${diffDays} days ago`;
    }

    // Show formatted date for older unlocks
    return `Unlocked ${date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    })}`;
  };

  // Convert achievements object to array for rendering
  const achievementList = Object.values(ACHIEVEMENTS).map(achievement => {
    const state = achievementState[achievement.id] || { unlocked: false, unlockedAt: null };
    return {
      ...achievement,
      ...state
    };
  });

  return (
    <div className="achievement-list">
      <h2 
        className="text-2xl font-bold mb-6 text-center"
        style={{ color: 'var(--color-text)' }}
      >
        Spooky Achievements
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievementList.map((achievement) => (
          <div
            key={achievement.id}
            className={`achievement-card relative overflow-hidden rounded-lg shadow-lg transition-all duration-300 ${
              achievement.unlocked 
                ? 'hover:scale-105 hover:shadow-xl' 
                : 'opacity-60 grayscale'
            }`}
            style={{
              backgroundColor: 'var(--color-background)',
              borderWidth: '2px',
              borderStyle: 'solid',
              borderColor: achievement.unlocked 
                ? 'var(--color-accent)' 
                : 'var(--color-primary)',
            }}
            role="article"
            aria-label={`${achievement.name} achievement ${achievement.unlocked ? 'unlocked' : 'locked'}`}
          >
            {/* Status indicator */}
            <div
              className="h-2"
              style={{ 
                backgroundColor: achievement.unlocked 
                  ? 'var(--color-accent)' 
                  : 'var(--color-secondary)' 
              }}
              aria-hidden="true"
            />

            {/* Card content */}
            <div className="p-6">
              {/* Icon and lock status */}
              <div className="flex items-center justify-center mb-4">
                <div 
                  className="text-5xl relative"
                  aria-hidden="true"
                >
                  {achievement.icon}
                  {!achievement.unlocked && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-4xl opacity-80">🔒</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Achievement name */}
              <h3
                className="text-lg font-bold text-center mb-2"
                style={{ color: 'var(--color-text)' }}
              >
                {achievement.name}
              </h3>

              {/* Description */}
              <p
                className="text-sm text-center mb-4"
                style={{ color: 'var(--color-text)', opacity: 0.8 }}
              >
                {achievement.description}
              </p>

              {/* Unlock timestamp or locked message */}
              <div
                className="text-xs text-center pt-3 border-t"
                style={{
                  color: 'var(--color-text)',
                  opacity: 0.7,
                  borderColor: 'var(--color-primary)'
                }}
              >
                {achievement.unlocked ? (
                  <span className="font-semibold" style={{ color: 'var(--color-accent)' }}>
                    {formatUnlockDate(achievement.unlockedAt)}
                  </span>
                ) : (
                  <span className="italic">
                    Keep studying to unlock!
                  </span>
                )}
              </div>
            </div>

            {/* Decorative corner elements */}
            <div
              className="absolute top-4 left-4 w-3 h-3 border-t-2 border-l-2"
              style={{ borderColor: 'var(--color-secondary)' }}
              aria-hidden="true"
            />
            <div
              className="absolute top-4 right-4 w-3 h-3 border-t-2 border-r-2"
              style={{ borderColor: 'var(--color-secondary)' }}
              aria-hidden="true"
            />
            <div
              className="absolute bottom-4 left-4 w-3 h-3 border-b-2 border-l-2"
              style={{ borderColor: 'var(--color-secondary)' }}
              aria-hidden="true"
            />
            <div
              className="absolute bottom-4 right-4 w-3 h-3 border-b-2 border-r-2"
              style={{ borderColor: 'var(--color-secondary)' }}
              aria-hidden="true"
            />

            {/* Unlocked badge */}
            {achievement.unlocked && (
              <div
                className="absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-bold"
                style={{
                  backgroundColor: 'var(--color-accent)',
                  color: 'var(--color-background)'
                }}
                aria-label="Unlocked"
              >
                ✓
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Summary stats */}
      <div 
        className="mt-8 text-center text-sm"
        style={{ color: 'var(--color-text)', opacity: 0.8 }}
      >
        <p>
          <span className="font-bold" style={{ color: 'var(--color-accent)' }}>
            {achievementList.filter(a => a.unlocked).length}
          </span>
          {' of '}
          <span className="font-bold">
            {achievementList.length}
          </span>
          {' achievements unlocked'}
        </p>
      </div>
    </div>
  );
}
