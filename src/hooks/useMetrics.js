import { useMemo } from 'react';
import { calculateProductivityScore } from '../utils/calculations';

/**
 * Custom hook for calculating productivity metrics from session history
 * @param {Array} sessionHistory - Array of session records
 * @returns {Object} Calculated metrics
 */
export function useMetrics(sessionHistory = []) {
  /**
   * Calculate daily study time for a specific date
   * @param {Date} date - The date to calculate for
   * @returns {number} Total study time in minutes for that day
   */
  const getDailyStudyTime = useMemo(() => {
    return (date) => {
      if (!sessionHistory || sessionHistory.length === 0) {
        return 0;
      }

      const targetDate = new Date(date);
      const targetYear = targetDate.getFullYear();
      const targetMonth = targetDate.getMonth();
      const targetDay = targetDate.getDate();

      return sessionHistory
        .filter(session => {
          if (!session.completed) {
            return false;
          }
          const sessionDate = new Date(session.startTime);
          return (
            sessionDate.getFullYear() === targetYear &&
            sessionDate.getMonth() === targetMonth &&
            sessionDate.getDate() === targetDay
          );
        })
        .reduce((total, session) => total + (session.duration || 0), 0);
    };
  }, [sessionHistory]);

  /**
   * Calculate weekly study statistics
   * @returns {Object} Weekly statistics including total time and session count
   */
  const getWeeklyStatistics = useMemo(() => {
    if (!sessionHistory || sessionHistory.length === 0) {
      return {
        totalTime: 0,
        sessionCount: 0,
        averageSessionLength: 0,
        daysActive: 0
      };
    }

    const now = new Date();
    const oneWeekAgo = new Date(now);
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const weekSessions = sessionHistory.filter(session => {
      if (!session.completed) {
        return false;
      }
      const sessionDate = new Date(session.startTime);
      return sessionDate >= oneWeekAgo;
    });

    const totalTime = weekSessions.reduce((total, session) => total + (session.duration || 0), 0);
    const sessionCount = weekSessions.length;

    // Calculate unique days with sessions
    const uniqueDays = new Set(
      weekSessions.map(session => {
        const date = new Date(session.startTime);
        return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      })
    );

    return {
      totalTime,
      sessionCount,
      averageSessionLength: sessionCount > 0 ? Math.round(totalTime / sessionCount) : 0,
      daysActive: uniqueDays.size
    };
  }, [sessionHistory]);

  /**
   * Get count of completed sessions
   * @returns {number} Total number of completed sessions
   */
  const getCompletedSessionsCount = useMemo(() => {
    if (!sessionHistory || sessionHistory.length === 0) {
      return 0;
    }

    return sessionHistory.filter(session => session.completed).length;
  }, [sessionHistory]);

  /**
   * Calculate productivity score
   * @returns {number} Productivity score (0-100)
   */
  const getProductivityScore = useMemo(() => {
    return calculateProductivityScore(sessionHistory);
  }, [sessionHistory]);

  /**
   * Get today's study time
   * @returns {number} Study time in minutes for today
   */
  const getTodayStudyTime = useMemo(() => {
    return getDailyStudyTime(new Date());
  }, [getDailyStudyTime]);

  return {
    // Functions
    getDailyStudyTime,
    
    // Computed values
    weeklyStatistics: getWeeklyStatistics,
    completedSessionsCount: getCompletedSessionsCount,
    productivityScore: getProductivityScore,
    todayStudyTime: getTodayStudyTime
  };
}
