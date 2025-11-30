import React from 'react';
import { useAppContext } from '../../context/AppContext';

/**
 * StatsDisplay Component
 * Displays detailed productivity metrics and session history summary
 * 
 * Requirements: 5.2
 * 
 * @returns {React.ReactElement} Stats display component
 */
export function StatsDisplay() {
  const { metrics, sessionHistory } = useAppContext();

  /**
   * Format minutes into hours and minutes display
   * @param {number} minutes - Total minutes
   * @returns {string} Formatted time string
   */
  const formatTime = (minutes) => {
    if (minutes < 60) {
      return `${minutes} minutes`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours} hour${hours !== 1 ? 's' : ''} ${mins} minutes` : `${hours} hour${hours !== 1 ? 's' : ''}`;
  };

  /**
   * Format date for display
   * @param {string|Date} dateString - Date to format
   * @returns {string} Formatted date string
   */
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  /**
   * Get recent sessions (last 10)
   * @returns {Array} Recent session records
   */
  const getRecentSessions = () => {
    if (!sessionHistory || sessionHistory.length === 0) {
      return [];
    }

    return [...sessionHistory]
      .filter(session => session.completed)
      .sort((a, b) => new Date(b.startTime) - new Date(a.startTime))
      .slice(0, 10);
  };

  const recentSessions = getRecentSessions();
  const weeklyStats = metrics.weeklyStatistics;

  return (
    <div className="stats-display">
      <h2>
        🔮 DETAILED STATISTICS 🔮
      </h2>

      {/* Summary Section */}
      <div className="stats-summary">
        <h3>
          💀 SUMMARY 💀
        </h3>

        <div className="stats-grid">
          <div className="stat-item">
            <p className="stat-label">Total Completed Sessions</p>
            <p className="stat-value">{metrics.completedSessionsCount}</p>
          </div>

          <div className="stat-item">
            <p className="stat-label">Today's Study Time</p>
            <p className="stat-value">{formatTime(metrics.todayStudyTime)}</p>
          </div>

          <div className="stat-item">
            <p className="stat-label">Weekly Study Time</p>
            <p className="stat-value">{formatTime(weeklyStats.totalTime)}</p>
          </div>

          <div className="stat-item">
            <p className="stat-label">Average Session Length</p>
            <p className="stat-value">{formatTime(weeklyStats.averageSessionLength)}</p>
          </div>

          <div className="stat-item">
            <p className="stat-label">Days Active This Week</p>
            <p className="stat-value">{weeklyStats.daysActive}</p>
          </div>

          <div className="stat-item">
            <p className="stat-label">Productivity Score</p>
            <p className="stat-value">{metrics.productivityScore}/100</p>
          </div>
        </div>
      </div>

      {/* Session History Section */}
      <div className="session-history">
        <h3>
          🕯️ RECENT SESSIONS 🕯️
        </h3>

        {recentSessions.length === 0 ? (
          <p className="no-sessions">
            No completed sessions yet. Start studying to see your haunted history! 👻
          </p>
        ) : (
          <div>
            {recentSessions.map((session, index) => (
              <div key={session.id || index} className="session-item">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontSize: '2rem' }} aria-hidden="true">
                      {session.ghostEmotion === 'sleepy' ? '😴' : '😈'}
                    </span>
                    <div>
                      <p className="session-duration">
                        {formatTime(session.duration)}
                      </p>
                      <p className="session-date">
                        {formatDate(session.startTime)}
                      </p>
                    </div>
                  </div>

                  <div>
                    <span className="session-badge">
                      {session.ghostEmotion}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
