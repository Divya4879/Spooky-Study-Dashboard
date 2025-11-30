import { useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { checkAchievements, getNewlyUnlockedAchievements } from '../utils/achievements';
import { DEFAULT_ACHIEVEMENT_STATE } from '../constants/achievements';

/**
 * Custom hook for achievement tracking and unlocking
 * Manages achievement state, checks conditions, and triggers notifications
 * 
 * @param {Array} sessionHistory - Array of session records
 * @param {number} mischiefCount - Count of jumpscares experienced
 * @returns {Object} Achievement state and functions
 */
export function useAchievements(sessionHistory = [], mischiefCount = 0) {
  // Persist achievement state to localStorage
  const [achievementState, setAchievementState] = useLocalStorage(
    'achievements',
    DEFAULT_ACHIEVEMENT_STATE
  );

  // Track newly unlocked achievements for notifications
  const [newlyUnlocked, setNewlyUnlocked] = useState([]);

  /**
   * Check all achievements and update state
   * This is called whenever session history or mischief count changes
   */
  const checkAndUpdateAchievements = useCallback(() => {
    const appData = {
      sessionHistory,
      mischiefCount,
    };

    // Check which achievements should be unlocked
    const updatedAchievements = checkAchievements(appData, achievementState);

    // Find newly unlocked achievements
    const newUnlocks = getNewlyUnlockedAchievements(achievementState, updatedAchievements);

    // Update state if there are changes
    if (newUnlocks.length > 0) {
      setAchievementState(updatedAchievements);
      setNewlyUnlocked(prev => [...prev, ...newUnlocks]);
    }
  }, [sessionHistory, mischiefCount, achievementState, setAchievementState]);

  /**
   * Check achievements on session completion
   * This effect runs whenever sessionHistory or mischiefCount changes
   */
  useEffect(() => {
    checkAndUpdateAchievements();
  }, [checkAndUpdateAchievements]);

  /**
   * Clear a notification after it has been displayed
   * @param {string} achievementId - The ID of the achievement to clear from notifications
   */
  const clearNotification = useCallback((achievementId) => {
    setNewlyUnlocked(prev => prev.filter(id => id !== achievementId));
  }, []);

  /**
   * Clear all notifications
   */
  const clearAllNotifications = useCallback(() => {
    setNewlyUnlocked([]);
  }, []);

  /**
   * Manually trigger achievement check (useful for testing or manual refresh)
   */
  const recheckAchievements = useCallback(() => {
    checkAndUpdateAchievements();
  }, [checkAndUpdateAchievements]);

  /**
   * Reset all achievements (useful for testing or user reset)
   */
  const resetAchievements = useCallback(() => {
    setAchievementState(DEFAULT_ACHIEVEMENT_STATE);
    setNewlyUnlocked([]);
  }, [setAchievementState]);

  return {
    // Achievement state
    achievementState,
    
    // Newly unlocked achievements for notifications
    newlyUnlocked,
    
    // Functions
    clearNotification,
    clearAllNotifications,
    recheckAchievements,
    resetAchievements,
  };
}
