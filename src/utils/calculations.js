/**
 * Calculation utilities for productivity metrics and session analysis
 * Implements productivity score calculation and helper functions for achievement tracking
 */

/**
 * Checks if there are completed sessions on N consecutive days
 * @param {Array} sessionHistory - Array of session records
 * @param {number} days - Number of consecutive days to check
 * @returns {boolean} True if there are sessions on N consecutive days
 */
export function hasConsecutiveDays(sessionHistory, days) {
  if (!sessionHistory || sessionHistory.length === 0 || days <= 0) {
    return false;
  }

  // Get unique dates with completed sessions, sorted in descending order
  const sessionDates = sessionHistory
    .filter(session => session.completed)
    .map(session => {
      const date = new Date(session.startTime);
      // Normalize to midnight to compare dates only
      return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
    })
    .filter((date, index, self) => self.indexOf(date) === index) // Remove duplicates
    .sort((a, b) => b - a); // Sort descending (most recent first)

  if (sessionDates.length < days) {
    return false;
  }

  // Check for consecutive days
  let consecutiveCount = 1;
  for (let i = 0; i < sessionDates.length - 1; i++) {
    const currentDate = sessionDates[i];
    const nextDate = sessionDates[i + 1];
    const dayDifference = (currentDate - nextDate) / (1000 * 60 * 60 * 24);

    if (dayDifference === 1) {
      consecutiveCount++;
      if (consecutiveCount >= days) {
        return true;
      }
    } else {
      // Reset counter if not consecutive
      consecutiveCount = 1;
    }
  }

  return consecutiveCount >= days;
}

/**
 * Gets the count of completed sessions in the last N days
 * @param {Array} sessionHistory - Array of session records
 * @param {number} days - Number of days to look back
 * @returns {number} Count of completed sessions in the last N days
 */
export function getSessionsInLastNDays(sessionHistory, days) {
  if (!sessionHistory || sessionHistory.length === 0 || days <= 0) {
    return 0;
  }

  const now = new Date();
  const cutoffDate = new Date(now);
  cutoffDate.setDate(cutoffDate.getDate() - days);

  return sessionHistory.filter(session => {
    if (!session.completed) {
      return false;
    }
    const sessionDate = new Date(session.startTime);
    return sessionDate >= cutoffDate;
  }).length;
}

/**
 * Checks if there is at least one completed session within a specific time range
 * @param {Array} sessionHistory - Array of session records
 * @param {number} startHour - Start hour (0-23)
 * @param {number} endHour - End hour (0-23)
 * @returns {boolean} True if there is at least one session in the time range
 */
export function hasSessionInTimeRange(sessionHistory, startHour, endHour) {
  if (!sessionHistory || sessionHistory.length === 0) {
    return false;
  }

  return sessionHistory.some(session => {
    if (!session.completed) {
      return false;
    }
    const sessionDate = new Date(session.startTime);
    const hour = sessionDate.getHours();

    // Handle time ranges that cross midnight
    if (startHour <= endHour) {
      return hour >= startHour && hour < endHour;
    } else {
      return hour >= startHour || hour < endHour;
    }
  });
}

/**
 * Counts the number of completed sessions with a specific ghost emotion
 * @param {Array} sessionHistory - Array of session records
 * @param {string} emotion - The ghost emotion to count ('sleepy' or 'mischievous')
 * @returns {number} Count of sessions with the specified emotion
 */
export function countSessionsByEmotion(sessionHistory, emotion) {
  if (!sessionHistory || sessionHistory.length === 0) {
    return 0;
  }

  return sessionHistory.filter(session => 
    session.completed && session.ghostEmotion === emotion
  ).length;
}

/**
 * Calculates the productivity score based on session history
 * Score is calculated as:
 * - Base score from completion rate (completed / started) × 50
 * - Consistency bonus: +10 for each consecutive day (max +30)
 * - Session length bonus: +20 for sessions ≥ 45 minutes
 * - Capped at 100
 * 
 * @param {Array} sessionHistory - Array of session records
 * @returns {number} Productivity score (0-100)
 */
export function calculateProductivityScore(sessionHistory) {
  if (!sessionHistory || sessionHistory.length === 0) {
    return 0;
  }

  // Base score from completion rate
  const completedSessions = sessionHistory.filter(s => s.completed).length;
  const totalSessions = sessionHistory.length;
  const completionRate = totalSessions > 0 ? completedSessions / totalSessions : 0;
  let score = completionRate * 50;

  // Consistency bonus: +10 for each consecutive day (max +30)
  let maxConsecutiveDays = 0;
  for (let days = 1; days <= 7; days++) {
    if (hasConsecutiveDays(sessionHistory, days)) {
      maxConsecutiveDays = days;
    } else {
      break;
    }
  }
  const consistencyBonus = Math.min(maxConsecutiveDays * 10, 30);
  score += consistencyBonus;

  // Session length bonus: +20 for sessions ≥ 45 minutes
  const hasLongSession = sessionHistory.some(session => 
    session.completed && session.duration >= 45
  );
  if (hasLongSession) {
    score += 20;
  }

  // Cap at 100
  return Math.min(Math.round(score), 100);
}
