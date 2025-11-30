import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAchievements } from './useAchievements';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('useAchievements Hook', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('should initialize with default achievement state', () => {
    const { result } = renderHook(() => useAchievements([], 0));

    expect(result.current.achievementState).toBeDefined();
    expect(result.current.newlyUnlocked).toEqual([]);
  });

  it('should unlock Mischievous Master achievement when mischief count reaches 5', () => {
    const { result, rerender } = renderHook(
      ({ sessionHistory, mischiefCount }) => useAchievements(sessionHistory, mischiefCount),
      {
        initialProps: { sessionHistory: [], mischiefCount: 0 },
      }
    );

    // Initially, achievement should not be unlocked
    expect(result.current.achievementState['mischievous-master']?.unlocked).toBe(false);

    // Update mischief count to 5
    rerender({ sessionHistory: [], mischiefCount: 5 });

    // Achievement should now be unlocked
    expect(result.current.achievementState['mischievous-master']?.unlocked).toBe(true);
    expect(result.current.newlyUnlocked).toContain('mischievous-master');
  });

  it('should unlock Sleepy Survivor achievement with 3 sleepy sessions', () => {
    const sessionHistory = [
      {
        id: '1',
        startTime: new Date('2024-01-01T10:00:00').toISOString(),
        duration: 25,
        completed: true,
        ghostEmotion: 'sleepy',
      },
      {
        id: '2',
        startTime: new Date('2024-01-02T10:00:00').toISOString(),
        duration: 25,
        completed: true,
        ghostEmotion: 'sleepy',
      },
      {
        id: '3',
        startTime: new Date('2024-01-03T10:00:00').toISOString(),
        duration: 25,
        completed: true,
        ghostEmotion: 'sleepy',
      },
    ];

    const { result } = renderHook(() => useAchievements(sessionHistory, 0));

    expect(result.current.achievementState['sleepy-survivor']?.unlocked).toBe(true);
    expect(result.current.newlyUnlocked).toContain('sleepy-survivor');
  });

  it('should clear notification when clearNotification is called', () => {
    const { result, rerender } = renderHook(
      ({ sessionHistory, mischiefCount }) => useAchievements(sessionHistory, mischiefCount),
      {
        initialProps: { sessionHistory: [], mischiefCount: 5 },
      }
    );

    // Achievement should be unlocked
    expect(result.current.newlyUnlocked).toContain('mischievous-master');

    // Clear the notification
    act(() => {
      result.current.clearNotification('mischievous-master');
    });

    // Notification should be cleared
    expect(result.current.newlyUnlocked).not.toContain('mischievous-master');
  });

  it('should persist achievement state to localStorage', () => {
    const { result } = renderHook(() => useAchievements([], 5));

    // Achievement should be unlocked and persisted
    expect(result.current.achievementState['mischievous-master']?.unlocked).toBe(true);

    // Check localStorage
    const stored = JSON.parse(localStorage.getItem('achievements'));
    expect(stored['mischievous-master']?.unlocked).toBe(true);
  });

  it('should not unlock achievement twice', () => {
    const { result, rerender } = renderHook(
      ({ sessionHistory, mischiefCount }) => useAchievements(sessionHistory, mischiefCount),
      {
        initialProps: { sessionHistory: [], mischiefCount: 5 },
      }
    );

    // Achievement should be unlocked once
    expect(result.current.newlyUnlocked).toHaveLength(1);

    // Clear notification
    act(() => {
      result.current.clearNotification('mischievous-master');
    });

    // Rerender with same data
    rerender({ sessionHistory: [], mischiefCount: 5 });

    // Should not unlock again
    expect(result.current.newlyUnlocked).toHaveLength(0);
  });
});
