import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { AppProvider, useAppContext } from './AppContext';

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
    removeItem: (key) => {
      delete store[key];
    }
  };
})();

global.localStorage = localStorageMock;

describe('AppContext', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should provide context value', () => {
    const wrapper = ({ children }) => <AppProvider>{children}</AppProvider>;
    const { result } = renderHook(() => useAppContext(), { wrapper });

    expect(result.current).toBeDefined();
    expect(result.current.timer).toBeDefined();
    expect(result.current.sessionHistory).toBeDefined();
    expect(result.current.achievements).toBeDefined();
    expect(result.current.metrics).toBeDefined();
    expect(result.current.mischiefCount).toBeDefined();
  });

  it('should throw error when used outside provider', () => {
    // Suppress console.error for this test
    const originalError = console.error;
    console.error = vi.fn();

    expect(() => {
      renderHook(() => useAppContext());
    }).toThrow('useAppContext must be used within an AppProvider');

    console.error = originalError;
  });

  it('should initialize with default preferences', () => {
    const wrapper = ({ children }) => <AppProvider>{children}</AppProvider>;
    const { result } = renderHook(() => useAppContext(), { wrapper });

    expect(result.current.preferences).toEqual({
      studyDuration: 25,
      restDuration: 5,
      cyclesPlanned: 1,
      theme: 'pumpkinGlow',
      ghostVariant: 'baby-ghost'
    });
  });

  it('should initialize with empty session history', () => {
    const wrapper = ({ children }) => <AppProvider>{children}</AppProvider>;
    const { result } = renderHook(() => useAppContext(), { wrapper });

    expect(result.current.sessionHistory).toEqual([]);
  });

  it('should initialize mischief count to 0', () => {
    const wrapper = ({ children }) => <AppProvider>{children}</AppProvider>;
    const { result } = renderHook(() => useAppContext(), { wrapper });

    expect(result.current.mischiefCount).toBe(0);
  });

  it('should update theme preference', () => {
    const wrapper = ({ children }) => <AppProvider>{children}</AppProvider>;
    const { result } = renderHook(() => useAppContext(), { wrapper });

    act(() => {
      result.current.updateTheme('vampireCrimson');
    });

    expect(result.current.preferences.theme).toBe('vampireCrimson');
  });

  it('should update ghost variant preference', () => {
    const wrapper = ({ children }) => <AppProvider>{children}</AppProvider>;
    const { result } = renderHook(() => useAppContext(), { wrapper });

    act(() => {
      result.current.updateGhostVariant('witch-ghost');
    });

    expect(result.current.preferences.ghostVariant).toBe('witch-ghost');
  });

  it('should increment mischief count', () => {
    const wrapper = ({ children }) => <AppProvider>{children}</AppProvider>;
    const { result } = renderHook(() => useAppContext(), { wrapper });

    act(() => {
      result.current.incrementMischiefCount();
    });

    expect(result.current.mischiefCount).toBe(1);

    act(() => {
      result.current.incrementMischiefCount();
    });

    expect(result.current.mischiefCount).toBe(2);
  });

  it('should update ghost emotion', () => {
    const wrapper = ({ children }) => <AppProvider>{children}</AppProvider>;
    const { result } = renderHook(() => useAppContext(), { wrapper });

    expect(result.current.ghostEmotion).toBe('sleepy');

    act(() => {
      result.current.updateGhostEmotion('mischievous');
    });

    expect(result.current.ghostEmotion).toBe('mischievous');
  });

  it('should only accept valid ghost emotions', () => {
    const wrapper = ({ children }) => <AppProvider>{children}</AppProvider>;
    const { result } = renderHook(() => useAppContext(), { wrapper });

    act(() => {
      result.current.updateGhostEmotion('invalid');
    });

    // Should remain at default
    expect(result.current.ghostEmotion).toBe('sleepy');
  });

  it('should integrate timer controls', () => {
    const wrapper = ({ children }) => <AppProvider>{children}</AppProvider>;
    const { result } = renderHook(() => useAppContext(), { wrapper });

    expect(result.current.timer.studyDuration).toBe(25);
    expect(result.current.timer.restDuration).toBe(5);
    expect(result.current.timer.cyclesPlanned).toBe(1);
  });

  it('should update study duration and persist preference', () => {
    const wrapper = ({ children }) => <AppProvider>{children}</AppProvider>;
    const { result } = renderHook(() => useAppContext(), { wrapper });

    act(() => {
      result.current.timer.setStudyDuration(45);
    });

    expect(result.current.timer.studyDuration).toBe(45);
    expect(result.current.preferences.studyDuration).toBe(45);
  });

  it('should update rest duration and persist preference', () => {
    const wrapper = ({ children }) => <AppProvider>{children}</AppProvider>;
    const { result } = renderHook(() => useAppContext(), { wrapper });

    act(() => {
      result.current.timer.setRestDuration(10);
    });

    expect(result.current.timer.restDuration).toBe(10);
    expect(result.current.preferences.restDuration).toBe(10);
  });

  it('should provide metrics from session history', () => {
    const wrapper = ({ children }) => <AppProvider>{children}</AppProvider>;
    const { result } = renderHook(() => useAppContext(), { wrapper });

    expect(result.current.metrics).toBeDefined();
    expect(result.current.metrics.completedSessionsCount).toBe(0);
    expect(result.current.metrics.productivityScore).toBeDefined();
  });

  it('should provide achievements tracking', () => {
    const wrapper = ({ children }) => <AppProvider>{children}</AppProvider>;
    const { result } = renderHook(() => useAppContext(), { wrapper });

    expect(result.current.achievements).toBeDefined();
    expect(result.current.achievements.achievementState).toBeDefined();
    expect(result.current.achievements.newlyUnlocked).toEqual([]);
  });

  it('should clear session history', () => {
    const wrapper = ({ children }) => <AppProvider>{children}</AppProvider>;
    const { result } = renderHook(() => useAppContext(), { wrapper });

    // Add a mock session first (would normally come from timer completion)
    // For this test, we just verify the clear function exists and works
    act(() => {
      result.current.clearSessionHistory();
    });

    expect(result.current.sessionHistory).toEqual([]);
  });

  it('should reset mischief count', () => {
    const wrapper = ({ children }) => <AppProvider>{children}</AppProvider>;
    const { result } = renderHook(() => useAppContext(), { wrapper });

    act(() => {
      result.current.incrementMischiefCount();
      result.current.incrementMischiefCount();
    });

    expect(result.current.mischiefCount).toBe(2);

    act(() => {
      result.current.resetMischiefCount();
    });

    expect(result.current.mischiefCount).toBe(0);
  });
});
