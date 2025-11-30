import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { MetricsCards } from './MetricsCards';
import { useAppContext } from '../../context/AppContext';

// Mock the AppContext
vi.mock('../../context/AppContext', () => ({
  useAppContext: vi.fn()
}));

describe('MetricsCards', () => {
  afterEach(() => {
    cleanup();
  });

  it('should render all four metric cards', () => {
    // Mock metrics data
    useAppContext.mockReturnValue({
      metrics: {
        todayStudyTime: 45,
        weeklyStatistics: {
          totalTime: 180,
          sessionCount: 5,
          daysActive: 3,
          averageSessionLength: 36
        },
        completedSessionsCount: 12,
        productivityScore: 75
      }
    });

    render(<MetricsCards />);

    // Check that all card titles are present
    expect(screen.getByText("Today's Study")).toBeTruthy();
    expect(screen.getByText('Weekly Stats')).toBeTruthy();
    expect(screen.getByText('Total Sessions')).toBeTruthy();
    expect(screen.getByText('Productivity')).toBeTruthy();
  });

  it('should display today study time correctly', () => {
    useAppContext.mockReturnValue({
      metrics: {
        todayStudyTime: 90,
        weeklyStatistics: {
          totalTime: 0,
          sessionCount: 0,
          daysActive: 0,
          averageSessionLength: 0
        },
        completedSessionsCount: 0,
        productivityScore: 0
      }
    });

    render(<MetricsCards />);

    // 90 minutes should be displayed as "1h 30m"
    expect(screen.getByText('1h 30m')).toBeTruthy();
  });

  it('should display weekly statistics correctly', () => {
    useAppContext.mockReturnValue({
      metrics: {
        todayStudyTime: 0,
        weeklyStatistics: {
          totalTime: 300,
          sessionCount: 8,
          daysActive: 5,
          averageSessionLength: 37
        },
        completedSessionsCount: 0,
        productivityScore: 0
      }
    });

    render(<MetricsCards />);

    // Check weekly time display
    expect(screen.getByText('5h')).toBeTruthy();
    // Check sessions and days active
    expect(screen.getByText('8 sessions • 5 days active')).toBeTruthy();
  });

  it('should display completed sessions count', () => {
    useAppContext.mockReturnValue({
      metrics: {
        todayStudyTime: 0,
        weeklyStatistics: {
          totalTime: 0,
          sessionCount: 0,
          daysActive: 0,
          averageSessionLength: 0
        },
        completedSessionsCount: 25,
        productivityScore: 0
      }
    });

    render(<MetricsCards />);

    expect(screen.getByText('25')).toBeTruthy();
  });

  it('should display productivity score', () => {
    useAppContext.mockReturnValue({
      metrics: {
        todayStudyTime: 0,
        weeklyStatistics: {
          totalTime: 0,
          sessionCount: 0,
          daysActive: 0,
          averageSessionLength: 0
        },
        completedSessionsCount: 0,
        productivityScore: 85
      }
    });

    render(<MetricsCards />);

    expect(screen.getByText('85')).toBeTruthy();
  });

  it('should format time correctly for values under 60 minutes', () => {
    useAppContext.mockReturnValue({
      metrics: {
        todayStudyTime: 45,
        weeklyStatistics: {
          totalTime: 30,
          sessionCount: 1,
          daysActive: 1,
          averageSessionLength: 30
        },
        completedSessionsCount: 1,
        productivityScore: 50
      }
    });

    render(<MetricsCards />);

    // Check that 45m appears in the document (for today's study)
    const elements = screen.getAllByText('45m');
    expect(elements.length).toBeGreaterThan(0);
  });

  it('should handle zero values gracefully', () => {
    useAppContext.mockReturnValue({
      metrics: {
        todayStudyTime: 0,
        weeklyStatistics: {
          totalTime: 0,
          sessionCount: 0,
          daysActive: 0,
          averageSessionLength: 0
        },
        completedSessionsCount: 0,
        productivityScore: 0
      }
    });

    render(<MetricsCards />);

    // Should render without errors
    expect(screen.getByText("Today's Study")).toBeTruthy();
    // Check for 0m in today's study card
    const zeroMinutes = screen.getAllByText('0m');
    expect(zeroMinutes.length).toBeGreaterThan(0);
  });
});
