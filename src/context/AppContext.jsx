import React, { createContext, useContext, useCallback, useState } from 'react';
import { useTimer } from '../hooks/useTimer';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useAchievements } from '../hooks/useAchievements';
import { useMetrics } from '../hooks/useMetrics';

/**
 * Application Context
 * Provides global state management for timer, session history, achievements, and mischief counter
 */
const AppContext = createContext(null);

/**
 * Hook to access the application context
 * @returns {Object} Application context value
 * @throws {Error} If used outside of AppProvider
 */
export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}

/**
 * Application Context Provider
 * Integrates all custom hooks and provides global state
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {React.ReactElement} Provider component
 */
export function AppProvider({ children }) {
  // Persist user preferences
  const [preferences, setPreferences] = useLocalStorage('preferences', {
    studyDuration: 25,
    restDuration: 5,
    cyclesPlanned: 1,
    theme: 'pumpkinGlow',
    ghostVariant: 'baby-ghost'
  });

  // Persist session history
  const [sessionHistory, setSessionHistory] = useLocalStorage('sessionHistory', []);

  // Persist mischief counter
  const [mischiefCount, setMischiefCount] = useLocalStorage('mischiefCount', 0);

  // Ghost emotion state (not persisted, changes during sessions)
  const [ghostEmotion, setGhostEmotion] = useState('sleepy');

  /**
   * Handle session completion
   * Records session to history and updates achievements
   */
  const handleSessionComplete = useCallback((sessionData) => {
    const newSession = {
      id: `session-${Date.now()}-${Math.random()}`,
      startTime: sessionData.timestamp.toISOString(),
      duration: sessionData.duration,
      completed: true,
      ghostEmotion: ghostEmotion,
      sessionType: sessionData.sessionType
    };

    setSessionHistory(prev => [...prev, newSession]);
  }, [ghostEmotion, setSessionHistory]);

  /**
   * Handle cycle completion
   * Can be used for notifications or other cycle-based logic
   */
  const handleCycleComplete = useCallback((cycleData) => {
    // Placeholder for cycle completion logic
    // Could trigger notifications, update stats, etc.
    console.log('Cycle completed:', cycleData);
  }, []);

  // Initialize timer with persisted preferences
  const timer = useTimer({
    initialStudyDuration: preferences.studyDuration,
    initialRestDuration: preferences.restDuration,
    initialCyclesPlanned: preferences.cyclesPlanned,
    onSessionComplete: handleSessionComplete,
    onCycleComplete: handleCycleComplete
  });

  // Initialize achievements tracking
  const achievements = useAchievements(sessionHistory, mischiefCount);

  // Initialize metrics calculation
  const metrics = useMetrics(sessionHistory);

  /**
   * Update study duration preference
   */
  const updateStudyDuration = useCallback((duration) => {
    const result = timer.setStudyDuration(duration);
    if (result.success) {
      setPreferences(prev => ({ ...prev, studyDuration: duration }));
    }
    return result;
  }, [timer, setPreferences]);

  /**
   * Update rest duration preference
   */
  const updateRestDuration = useCallback((duration) => {
    const result = timer.setRestDuration(duration);
    if (result.success) {
      setPreferences(prev => ({ ...prev, restDuration: duration }));
    }
    return result;
  }, [timer, setPreferences]);

  /**
   * Update cycles planned preference
   */
  const updateCyclesPlanned = useCallback((count) => {
    const result = timer.setCyclesPlanned(count);
    if (result.success) {
      setPreferences(prev => ({ ...prev, cyclesPlanned: count }));
    }
    return result;
  }, [timer, setPreferences]);

  /**
   * Update theme preference
   */
  const updateTheme = useCallback((theme) => {
    setPreferences(prev => ({ ...prev, theme }));
  }, [setPreferences]);

  /**
   * Update ghost variant preference
   */
  const updateGhostVariant = useCallback((variant) => {
    setPreferences(prev => ({ ...prev, ghostVariant: variant }));
  }, [setPreferences]);

  /**
   * Increment mischief counter (for jumpscares)
   */
  const incrementMischiefCount = useCallback(() => {
    setMischiefCount(prev => prev + 1);
  }, [setMischiefCount]);

  /**
   * Update ghost emotion
   */
  const updateGhostEmotion = useCallback((emotion) => {
    if (emotion === 'sleepy' || emotion === 'mischievous') {
      setGhostEmotion(emotion);
    }
  }, []);

  /**
   * Clear all session history (useful for testing or reset)
   */
  const clearSessionHistory = useCallback(() => {
    setSessionHistory([]);
  }, [setSessionHistory]);

  /**
   * Reset mischief counter
   */
  const resetMischiefCount = useCallback(() => {
    setMischiefCount(0);
  }, [setMischiefCount]);

  // Context value
  const value = {
    // Timer state and controls
    timer: {
      ...timer,
      setStudyDuration: updateStudyDuration,
      setRestDuration: updateRestDuration,
      setCyclesPlanned: updateCyclesPlanned
    },

    // Session history
    sessionHistory,
    clearSessionHistory,

    // Achievements
    achievements,

    // Metrics
    metrics,

    // Mischief counter
    mischiefCount,
    incrementMischiefCount,
    resetMischiefCount,

    // Ghost state
    ghostEmotion,
    updateGhostEmotion,

    // Preferences
    preferences,
    updateTheme,
    updateGhostVariant
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}
