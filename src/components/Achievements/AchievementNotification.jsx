import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ACHIEVEMENTS } from '../../constants/achievements';

/**
 * Achievement Notification Component
 * Displays toast-style notifications when achievements are unlocked
 * Auto-dismisses after 5 seconds with Framer Motion animations
 * 
 * Requirements: 6.6 - Display notification when achievement unlocks
 * 
 * @param {Object} props - Component props
 * @param {string} props.achievementId - ID of the unlocked achievement
 * @param {Function} props.onDismiss - Callback when notification is dismissed
 * @returns {React.ReactElement} Notification component
 */
export function AchievementNotification({ achievementId, onDismiss }) {
  // Find the achievement details
  const achievement = Object.values(ACHIEVEMENTS).find(a => a.id === achievementId);

  // Auto-dismiss after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(achievementId);
    }, 5000);

    return () => clearTimeout(timer);
  }, [achievementId, onDismiss]);

  // If achievement not found, don't render
  if (!achievement) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.8 }}
      transition={{ 
        type: 'spring', 
        stiffness: 300, 
        damping: 25 
      }}
      className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg shadow-2xl p-4 mb-3 max-w-sm"
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        {/* Achievement Icon */}
        <div className="text-4xl flex-shrink-0">
          {achievement.icon}
        </div>

        {/* Achievement Details */}
        <div className="flex-1 min-w-0">
          <div className="font-bold text-lg mb-1">
            Achievement Unlocked!
          </div>
          <div className="font-semibold text-base">
            {achievement.name}
          </div>
          <div className="text-sm opacity-90 mt-1">
            {achievement.description}
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={() => onDismiss(achievementId)}
          className="flex-shrink-0 text-white hover:text-gray-200 transition-colors"
          aria-label="Dismiss notification"
        >
          <svg 
            className="w-5 h-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M6 18L18 6M6 6l12 12" 
            />
          </svg>
        </button>
      </div>
    </motion.div>
  );
}

/**
 * Achievement Notification Container
 * Manages multiple achievement notifications in a stack
 * 
 * @param {Object} props - Component props
 * @param {Array<string>} props.achievements - Array of achievement IDs to display
 * @param {Function} props.onDismiss - Callback when a notification is dismissed
 * @returns {React.ReactElement} Notification container
 */
export function AchievementNotificationContainer({ achievements = [], onDismiss }) {
  return (
    <div 
      className="fixed top-4 right-4 z-50 pointer-events-none"
      aria-live="polite"
      aria-atomic="false"
    >
      <div className="pointer-events-auto">
        <AnimatePresence mode="popLayout">
          {achievements.map((achievementId) => (
            <AchievementNotification
              key={achievementId}
              achievementId={achievementId}
              onDismiss={onDismiss}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
