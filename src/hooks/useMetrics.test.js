import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import * as fc from 'fast-check';
import { useMetrics } from './useMetrics';
import { saveToStorage, loadFromStorage } from '../utils/storage';

describe('useMetrics Hook', () => {
  // Clean up localStorage before and after each test
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should return zero values for empty session history', () => {
    const { result } = renderHook(() => useMetrics([]));

    expect(result.current.completedSessionsCount).toBe(0);
    expect(result.current.productivityScore).toBe(0);
    expect(result.current.todayStudyTime).toBe(0);
    expect(result.current.weeklyStatistics).toEqual({
      totalTime: 0,
      sessionCount: 0,
      averageSessionLength: 0,
      daysActive: 0
    });
  });

  it('should calculate daily study time correctly', () => {
    const today = new Date();
    const sessionHistory = [
      {
        startTime: today.toISOString(),
        duration: 30,
        completed: true,
        ghostEmotion: 'sleepy'
      },
      {
        startTime: today.toISOString(),
        duration: 45,
        completed: true,
        ghostEmotion: 'mischievous'
      }
    ];

    const { result } = renderHook(() => useMetrics(sessionHistory));

    expect(result.current.todayStudyTime).toBe(75);
    expect(result.current.completedSessionsCount).toBe(2);
  });

  it('should calculate weekly statistics correctly', () => {
    const now = new Date();
    const threeDaysAgo = new Date(now);
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    const sessionHistory = [
      {
        startTime: now.toISOString(),
        duration: 30,
        completed: true,
        ghostEmotion: 'sleepy'
      },
      {
        startTime: threeDaysAgo.toISOString(),
        duration: 45,
        completed: true,
        ghostEmotion: 'mischievous'
      }
    ];

    const { result } = renderHook(() => useMetrics(sessionHistory));

    expect(result.current.weeklyStatistics.totalTime).toBe(75);
    expect(result.current.weeklyStatistics.sessionCount).toBe(2);
    expect(result.current.weeklyStatistics.averageSessionLength).toBe(38); // rounded
    expect(result.current.weeklyStatistics.daysActive).toBe(2);
  });

  it('should filter out incomplete sessions', () => {
    const today = new Date();
    const sessionHistory = [
      {
        startTime: today.toISOString(),
        duration: 30,
        completed: true,
        ghostEmotion: 'sleepy'
      },
      {
        startTime: today.toISOString(),
        duration: 45,
        completed: false,
        ghostEmotion: 'mischievous'
      }
    ];

    const { result } = renderHook(() => useMetrics(sessionHistory));

    expect(result.current.completedSessionsCount).toBe(1);
    expect(result.current.todayStudyTime).toBe(30);
  });

  it('should calculate productivity score using calculations utility', () => {
    const sessionHistory = [
      {
        startTime: new Date().toISOString(),
        duration: 50,
        completed: true,
        ghostEmotion: 'sleepy'
      }
    ];

    const { result } = renderHook(() => useMetrics(sessionHistory));

    // Should return a score between 0 and 100
    expect(result.current.productivityScore).toBeGreaterThanOrEqual(0);
    expect(result.current.productivityScore).toBeLessThanOrEqual(100);
  });

  it('should provide getDailyStudyTime function', () => {
    const specificDate = new Date('2024-01-15');
    const sessionHistory = [
      {
        startTime: new Date('2024-01-15T10:00:00').toISOString(),
        duration: 30,
        completed: true,
        ghostEmotion: 'sleepy'
      },
      {
        startTime: new Date('2024-01-16T10:00:00').toISOString(),
        duration: 45,
        completed: true,
        ghostEmotion: 'mischievous'
      }
    ];

    const { result } = renderHook(() => useMetrics(sessionHistory));

    expect(result.current.getDailyStudyTime(specificDate)).toBe(30);
    expect(result.current.getDailyStudyTime(new Date('2024-01-16'))).toBe(45);
    expect(result.current.getDailyStudyTime(new Date('2024-01-17'))).toBe(0);
  });

  /**
   * Feature: spooky-study-dashboard, Property 10: Session persistence
   * Validates: Requirements 5.1
   * 
   * For any completed session, the session data (duration, timestamp, ghost emotion) 
   * stored to localStorage should match the original session data when retrieved.
   */
  it('Property 10: Session persistence', () => {
    // Generator for a valid timestamp (ISO string)
    const arbTimestamp = fc.integer({ min: 1577836800000, max: 1924905600000 })
      .map(ms => new Date(ms).toISOString());

    // Generator for a completed session with the key fields: duration, timestamp (startTime), ghost emotion
    const arbCompletedSession = fc.record({
      startTime: arbTimestamp,
      duration: fc.integer({ min: 1, max: 180 }), // 1-180 minutes
      completed: fc.constant(true), // Only completed sessions per property definition
      ghostEmotion: fc.constantFrom('sleepy', 'mischievous'),
    });

    fc.assert(
      fc.property(arbCompletedSession, (session) => {
        // Store the session to localStorage
        saveToStorage('testSession', session);
        
        // Load the session back
        const loadedSession = loadFromStorage('testSession', null);
        
        // The loaded session should match the original session
        // Specifically checking duration, timestamp (startTime), and ghost emotion
        expect(loadedSession).not.toBeNull();
        expect(loadedSession.duration).toBe(session.duration);
        expect(loadedSession.startTime).toBe(session.startTime);
        expect(loadedSession.ghostEmotion).toBe(session.ghostEmotion);
        expect(loadedSession.completed).toBe(session.completed);
      }),
      { numRuns: 100 }
    );
  });
});
