/**
 * Achievement utilities for checking and unlocking achievements
 * Evaluates achievement conditions based on session history and app state
 */

import { ACHIEVEMENTS } from '../constants/achievements.js';
import {
  hasConsecutiveDays,
  getSessionsInLastNDays,
  hasSessionInTimeRange,
  countSessionsByEmotion,
} from './calculations.js';

/**
 * Checks if a specific achievement should be unlocked based on app data
 * @param {Object} achievement - Achievement definition from constants
 * @param {Object} appData - Application data containing sessionHistory and mischiefCount
 * @param {Array} appData.sessionHistory - Array of session records
 * @param {number} appData.mischiefCount - Count of jumpscares experienced
 * @returns {boolean} True if the achievement condition is met
 */
export function checkAchievementCondition(achievement, appData) {
  const { condition, conditionParams } = achievement;
  const { sessionHistory, mischiefCount } = appData;

  switch (condition) {
    case 'hasConsecutiveDays':
      return hasConsecutiveDays(sessionHistory, conditionParams.days);

    case 'getSessionsInLastNDays':
      return getSessionsInLastNDays(sessionHistory, conditionParams.days) >= conditionParams.sessions;

    case 'hasSessionInTimeRange':
      return hasSessionInTimeRange(sessionHistory, conditionParams.startHour, conditionParams.endHour);

    case 'countSessionsByEmotion':
      return countSessionsByEmotion(sessionHistory, conditionParams.emotion) >= conditionParams.count;

    case 'mischiefCount':
      return mischiefCount >= conditionParams.count;

    default:
      console.warn(`Unknown achievement condition: ${condition}`);
      return false;
  }
}

/**
 * Checks all achievements and returns which ones should be unlocked
 * @param {Object} appData - Application data containing sessionHistory and mischiefCount
 * @param {Array} appData.sessionHistory - Array of session records
 * @param {number} appData.mischiefCount - Count of jumpscares experienced
 * @param {Object} currentAchievementState - Current state of achievements (unlocked status)
 * @returns {Object} Object mapping achievement IDs to their unlock status
 */
export function checkAchievements(appData, currentAchievementState = {}) {
  const updatedAchievements = { ...currentAchievementState };

  Object.values(ACHIEVEMENTS).forEach(achievement => {
    const achievementId = achievement.id;
    
    // Skip if already unlocked
    if (updatedAchievements[achievementId]?.unlocked) {
      return;
    }

    // Check if condition is met
    const shouldUnlock = checkAchievementCondition(achievement, appData);

    if (shouldUnlock) {
      updatedAchievements[achievementId] = {
        unlocked: true,
        unlockedAt: new Date().toISOString(),
      };
    } else if (!updatedAchievements[achievementId]) {
      // Initialize if not present
      updatedAchievements[achievementId] = {
        unlocked: false,
        unlockedAt: null,
      };
    }
  });

  return updatedAchievements;
}

/**
 * Gets a list of newly unlocked achievements by comparing old and new states
 * @param {Object} oldState - Previous achievement state
 * @param {Object} newState - New achievement state
 * @returns {Array} Array of achievement IDs that were newly unlocked
 */
export function getNewlyUnlockedAchievements(oldState, newState) {
  const newlyUnlocked = [];

  Object.keys(newState).forEach(achievementId => {
    const wasUnlocked = oldState[achievementId]?.unlocked || false;
    const isNowUnlocked = newState[achievementId]?.unlocked || false;

    if (!wasUnlocked && isNowUnlocked) {
      newlyUnlocked.push(achievementId);
    }
  });

  return newlyUnlocked;
}
