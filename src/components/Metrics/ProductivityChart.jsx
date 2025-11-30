import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useAppContext } from '../../context/AppContext';

/**
 * ProductivityChart Component
 * Displays study time trends over days/weeks using Recharts
 * 
 * Requirements: 5.4
 * 
 * @param {Object} props - Component props
 * @param {string} props.period - Time period to display ('week' or 'month')
 * @returns {React.ReactElement} Productivity chart component
 */
export function ProductivityChart({ period = 'week' }) {
  const { sessionHistory, metrics } = useAppContext();

  /**
   * Prepare chart data from session history
   * Groups sessions by day and calculates total study time
   */
  const chartData = useMemo(() => {
    if (!sessionHistory || sessionHistory.length === 0) {
      return [];
    }

    const now = new Date();
    const daysToShow = period === 'week' ? 7 : 30;
    
    // Create a map of dates to study time
    const dateMap = new Map();
    
    // Initialize all dates with 0
    for (let i = daysToShow - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      dateMap.set(dateKey, {
        date: dateKey,
        displayDate: `${date.getMonth() + 1}/${date.getDate()}`,
        studyTime: 0,
        sessionCount: 0
      });
    }

    // Aggregate session data
    sessionHistory.forEach(session => {
      if (!session.completed) {
        return;
      }

      const sessionDate = new Date(session.startTime);
      const dateKey = `${sessionDate.getFullYear()}-${String(sessionDate.getMonth() + 1).padStart(2, '0')}-${String(sessionDate.getDate()).padStart(2, '0')}`;
      
      if (dateMap.has(dateKey)) {
        const dayData = dateMap.get(dateKey);
        dayData.studyTime += session.duration || 0;
        dayData.sessionCount += 1;
      }
    });

    // Convert map to array and sort by date
    return Array.from(dateMap.values()).sort((a, b) => a.date.localeCompare(b.date));
  }, [sessionHistory, period]);

  /**
   * Calculate average study time for the period
   */
  const averageStudyTime = useMemo(() => {
    if (chartData.length === 0) {
      return 0;
    }
    const total = chartData.reduce((sum, day) => sum + day.studyTime, 0);
    return Math.round(total / chartData.length);
  }, [chartData]);

  /**
   * Custom tooltip component for the chart
   */
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div
          className="custom-tooltip p-3 rounded shadow-lg"
          style={{
            backgroundColor: 'var(--color-background)',
            border: '2px solid var(--color-primary)',
            color: 'var(--color-text)'
          }}
        >
          <p className="font-semibold mb-1">{data.displayDate}</p>
          <p className="text-sm">
            Study Time: <span className="font-bold" style={{ color: 'var(--color-accent)' }}>
              {data.studyTime} min
            </span>
          </p>
          <p className="text-sm">
            Sessions: <span className="font-bold">{data.sessionCount}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  /**
   * Format time for display
   */
  const formatTime = (minutes) => {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  return (
    <div className="productivity-chart">
      <div className="mb-4">
        <h2 
          className="text-2xl font-bold mb-2"
          style={{ color: 'var(--color-text)' }}
        >
          Study Time Trends
        </h2>
        <p 
          className="text-sm"
          style={{ color: 'var(--color-text)', opacity: 0.7 }}
        >
          {period === 'week' ? 'Last 7 days' : 'Last 30 days'} • Average: {formatTime(averageStudyTime)} per day
        </p>
      </div>

      {chartData.length === 0 ? (
        <div 
          className="text-center py-12 rounded-lg"
          style={{
            backgroundColor: 'var(--color-background)',
            border: '2px solid var(--color-primary)',
            color: 'var(--color-text)',
            opacity: 0.7
          }}
        >
          <p className="text-lg mb-2">👻 No study data yet</p>
          <p className="text-sm">Complete some study sessions to see your trends!</p>
        </div>
      ) : (
        <div 
          className="chart-container p-6 rounded-lg"
          style={{
            backgroundColor: 'var(--color-background)',
            border: '2px solid var(--color-primary)'
          }}
        >
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="var(--color-primary)" 
                opacity={0.3}
              />
              <XAxis 
                dataKey="displayDate" 
                stroke="var(--color-text)"
                style={{ fontSize: '12px' }}
                tick={{ fill: 'var(--color-text)' }}
              />
              <YAxis 
                stroke="var(--color-text)"
                style={{ fontSize: '12px' }}
                tick={{ fill: 'var(--color-text)' }}
                label={{ 
                  value: 'Minutes', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { fill: 'var(--color-text)', fontSize: '12px' }
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ color: 'var(--color-text)' }}
                iconType="line"
              />
              <Line 
                type="monotone" 
                dataKey="studyTime" 
                stroke="var(--color-accent)" 
                strokeWidth={3}
                dot={{ fill: 'var(--color-accent)', r: 4 }}
                activeDot={{ r: 6, fill: 'var(--color-secondary)' }}
                name="Study Time (min)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
