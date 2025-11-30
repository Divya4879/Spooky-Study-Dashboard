import React from 'react';
import { useAppContext } from '../../context/AppContext';

/**
 * MetricsCards Component
 * Displays tarot card-styled metric cards showing productivity statistics
 * 
 * Requirements: 5.2, 5.3
 * 
 * @returns {React.ReactElement} Metrics cards component
 */
export function MetricsCards() {
  const { metrics } = useAppContext();

  // Extract metrics data
  const todayStudyTime = metrics.todayStudyTime;
  const weeklyStats = metrics.weeklyStatistics;
  const completedSessions = metrics.completedSessionsCount;
  const productivityScore = metrics.productivityScore;

  /**
   * Format minutes into hours and minutes display
   * @param {number} minutes - Total minutes
   * @returns {string} Formatted time string
   */
  const formatTime = (minutes) => {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  /**
   * Get productivity score color based on value
   * @param {number} score - Productivity score (0-100)
   * @returns {string} Color class
   */
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  // Define metric cards data
  const cards = [
    {
      id: 'daily',
      title: 'Today\'s Study',
      value: formatTime(todayStudyTime),
      subtitle: 'Minutes focused',
      icon: '🎃',
      description: 'Your study time today'
    },
    {
      id: 'weekly',
      title: 'Weekly Stats',
      value: formatTime(weeklyStats.totalTime),
      subtitle: `${weeklyStats.sessionCount} sessions • ${weeklyStats.daysActive} days active`,
      icon: '🦇',
      description: 'Last 7 days'
    },
    {
      id: 'completed',
      title: 'Total Sessions',
      value: completedSessions.toString(),
      subtitle: 'Completed',
      icon: '🕷️',
      description: 'All time'
    },
    {
      id: 'productivity',
      title: 'Productivity',
      value: `${productivityScore}`,
      subtitle: 'Score',
      icon: '🔮',
      description: 'Your effectiveness',
      scoreColor: getScoreColor(productivityScore)
    }
  ];

  return (
    <div className="metrics-cards">
      <h2 
        className="text-2xl font-bold mb-6 text-center"
        style={{ color: 'var(--color-text)' }}
      >
        Your Spooky Stats
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div
            key={card.id}
            className="metric-card relative overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
            style={{
              backgroundColor: 'var(--color-background)',
              borderWidth: '2px',
              borderStyle: 'solid',
              borderColor: 'var(--color-primary)',
            }}
          >
            {/* Decorative top border */}
            <div
              className="h-2"
              style={{ backgroundColor: 'var(--color-accent)' }}
            />

            {/* Card content */}
            <div className="p-6">
              {/* Icon */}
              <div className="text-4xl mb-3 text-center" aria-hidden="true">
                {card.icon}
              </div>

              {/* Title */}
              <h3
                className="text-sm font-semibold uppercase tracking-wide text-center mb-2"
                style={{ color: 'var(--color-text)', opacity: 0.8 }}
              >
                {card.title}
              </h3>

              {/* Value */}
              <div
                className={`text-3xl font-bold text-center mb-2 ${card.scoreColor || ''}`}
                style={!card.scoreColor ? { color: 'var(--color-accent)' } : {}}
              >
                {card.value}
              </div>

              {/* Subtitle */}
              <p
                className="text-xs text-center mb-3"
                style={{ color: 'var(--color-text)', opacity: 0.7 }}
              >
                {card.subtitle}
              </p>

              {/* Description */}
              <div
                className="text-xs text-center italic pt-3 border-t"
                style={{
                  color: 'var(--color-text)',
                  opacity: 0.6,
                  borderColor: 'var(--color-primary)'
                }}
              >
                {card.description}
              </div>
            </div>

            {/* Decorative corner elements for tarot card style */}
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
          </div>
        ))}
      </div>
    </div>
  );
}
