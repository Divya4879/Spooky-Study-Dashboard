import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { StatsDisplay } from './StatsDisplay';
import { useAppContext } from '../../context/AppContext';

// Mock the AppContext
vi.mock('../../context/AppContext', () => ({
  useAppContext: vi.fn()
}));

describe('StatsDisplay', () => {
  afterEach(() => {
    cleanup();
  });

  it('should render detailed statistics summary', () => {
    // Mock context data
    useAppContext.mockReturnValue({
      metrics: {
        completedSessionsCount: 15,
        todayStudyTime: 90,
        weeklyStatistics: {
          totalTime: 300,
          sessionCount: 10,
          averageSessionLength: 30,
          daysActive: 5
        },
        productivityScore: 75
      },
      sessionHistory: []
    });

    render(<StatsDisplay />);

    // Check that summary section is rendered
    expect(screen.getByText('Detailed Statistics')).toBeTruthy();
    expect(screen.getByText('Summary')).toBeTruthy();
    
    // Check metrics are displayed
    expect(screen.getByText('15')).toBeTruthy(); // completed sessions
    expect(screen.getByText('75/100')).toBeTruthy(); // productivity score
  });

  it('should display message when no sessions exist', () => {
    useAppContext.mockReturnValue({
      metrics: {
        completedSessionsCount: 0,
        todayStudyTime: 0,
        weeklyStatistics: {
          totalTime: 0,
          sessionCount: 0,
          averageSessionLength: 0,
          daysActive: 0
        },
        productivityScore: 0
      },
      sessionHistory: []
    });

    render(<StatsDisplay />);

    expect(screen.getByText(/No completed sessions yet/i)).toBeTruthy();
  });

  it('should display recent sessions with correct formatting', () => {
    const mockSessions = [
      {
        id: 'session-1',
        startTime: new Date('2024-01-15T10:00:00').toISOString(),
        duration: 45,
        completed: true,
        ghostEmotion: 'sleepy'
      },
      {
        id: 'session-2',
        startTime: new Date('2024-01-15T14:00:00').toISOString(),
        duration: 60,
        completed: true,
        ghostEmotion: 'mischievous'
      }
    ];

    useAppContext.mockReturnValue({
      metrics: {
        completedSessionsCount: 2,
        todayStudyTime: 105,
        weeklyStatistics: {
          totalTime: 105,
          sessionCount: 2,
          averageSessionLength: 52,
          daysActive: 1
        },
        productivityScore: 50
      },
      sessionHistory: mockSessions
    });

    render(<StatsDisplay />);

    // Check that recent sessions section is rendered
    expect(screen.getByText('Recent Sessions')).toBeTruthy();
    
    // Check that sessions are displayed
    expect(screen.getByText('45 minutes')).toBeTruthy();
    expect(screen.getByText('1 hour')).toBeTruthy();
    
    // Check emotion badges
    expect(screen.getByText('sleepy')).toBeTruthy();
    expect(screen.getByText('mischievous')).toBeTruthy();
  });

  it('should format time correctly for hours and minutes', () => {
    useAppContext.mockReturnValue({
      metrics: {
        completedSessionsCount: 1,
        todayStudyTime: 125, // 2 hours 5 minutes
        weeklyStatistics: {
          totalTime: 180, // 3 hours
          sessionCount: 1,
          averageSessionLength: 90, // 1 hour 30 minutes
          daysActive: 1
        },
        productivityScore: 60
      },
      sessionHistory: []
    });

    render(<StatsDisplay />);

    // Check that the time formatting works correctly
    expect(screen.getByText('2 hours 5 minutes')).toBeTruthy(); // Today's study time
    expect(screen.getByText('3 hours')).toBeTruthy(); // Weekly study time
    expect(screen.getByText('1 hour 30 minutes')).toBeTruthy(); // Average session length
  });

  it('should limit recent sessions to 10 most recent', () => {
    const mockSessions = Array.from({ length: 15 }, (_, i) => ({
      id: `session-${i}`,
      startTime: new Date(Date.now() - i * 3600000).toISOString(),
      duration: 45, // Use 45 to avoid conflict with average session length
      completed: true,
      ghostEmotion: 'sleepy'
    }));

    useAppContext.mockReturnValue({
      metrics: {
        completedSessionsCount: 15,
        todayStudyTime: 450,
        weeklyStatistics: {
          totalTime: 450,
          sessionCount: 15,
          averageSessionLength: 30, // Different from session duration
          daysActive: 7
        },
        productivityScore: 85
      },
      sessionHistory: mockSessions
    });

    render(<StatsDisplay />);

    // Count the number of session items displayed (should be 10)
    const sessionItems = screen.getAllByText('45 minutes');
    expect(sessionItems.length).toBe(10);
  });
});
