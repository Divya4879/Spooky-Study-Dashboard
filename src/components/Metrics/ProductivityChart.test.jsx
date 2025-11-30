import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { ProductivityChart } from './ProductivityChart';
import { useAppContext } from '../../context/AppContext';

// Mock the AppContext
vi.mock('../../context/AppContext', () => ({
  useAppContext: vi.fn()
}));

// Mock Recharts components to avoid rendering issues in tests
vi.mock('recharts', () => ({
  LineChart: ({ children }) => <div data-testid="line-chart">{children}</div>,
  Line: () => <div data-testid="line" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  ResponsiveContainer: ({ children }) => <div data-testid="responsive-container">{children}</div>,
  Legend: () => <div data-testid="legend" />
}));

describe('ProductivityChart', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders the chart title', () => {
    useAppContext.mockReturnValue({
      sessionHistory: [],
      metrics: {
        todayStudyTime: 0,
        weeklyStatistics: { totalTime: 0, sessionCount: 0, daysActive: 0 },
        completedSessionsCount: 0,
        productivityScore: 0
      }
    });

    render(<ProductivityChart />);
    expect(screen.getByText('Study Time Trends')).toBeTruthy();
  });

  it('displays empty state when no session data exists', () => {
    useAppContext.mockReturnValue({
      sessionHistory: [],
      metrics: {
        todayStudyTime: 0,
        weeklyStatistics: { totalTime: 0, sessionCount: 0, daysActive: 0 },
        completedSessionsCount: 0,
        productivityScore: 0
      }
    });

    render(<ProductivityChart />);
    expect(screen.getByText(/No study data yet/i)).toBeTruthy();
    expect(screen.getByText(/Complete some study sessions to see your trends!/i)).toBeTruthy();
  });

  it('shows week period by default', () => {
    useAppContext.mockReturnValue({
      sessionHistory: [],
      metrics: {
        todayStudyTime: 0,
        weeklyStatistics: { totalTime: 0, sessionCount: 0, daysActive: 0 },
        completedSessionsCount: 0,
        productivityScore: 0
      }
    });

    render(<ProductivityChart />);
    expect(screen.getByText(/Last 7 days/i)).toBeTruthy();
  });

  it('shows month period when specified', () => {
    useAppContext.mockReturnValue({
      sessionHistory: [],
      metrics: {
        todayStudyTime: 0,
        weeklyStatistics: { totalTime: 0, sessionCount: 0, daysActive: 0 },
        completedSessionsCount: 0,
        productivityScore: 0
      }
    });

    render(<ProductivityChart period="month" />);
    expect(screen.getByText(/Last 30 days/i)).toBeTruthy();
  });

  it('displays average study time', () => {
    useAppContext.mockReturnValue({
      sessionHistory: [],
      metrics: {
        todayStudyTime: 0,
        weeklyStatistics: { totalTime: 0, sessionCount: 0, daysActive: 0 },
        completedSessionsCount: 0,
        productivityScore: 0
      }
    });

    render(<ProductivityChart />);
    expect(screen.getByText(/Average:/i)).toBeTruthy();
  });

  it('displays chart when session data exists', () => {
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);

    useAppContext.mockReturnValue({
      sessionHistory: [
        {
          id: 'session-1',
          startTime: yesterday.toISOString(),
          duration: 45,
          completed: true,
          ghostEmotion: 'sleepy'
        },
        {
          id: 'session-2',
          startTime: now.toISOString(),
          duration: 60,
          completed: true,
          ghostEmotion: 'mischievous'
        }
      ],
      metrics: {
        todayStudyTime: 60,
        weeklyStatistics: { totalTime: 105, sessionCount: 2, daysActive: 2 },
        completedSessionsCount: 2,
        productivityScore: 75
      }
    });

    render(<ProductivityChart />);
    
    // Should render the chart container instead of empty state
    expect(screen.getByTestId('responsive-container')).toBeTruthy();
    expect(screen.queryByText(/No study data yet/i)).toBeFalsy();
  });
});
