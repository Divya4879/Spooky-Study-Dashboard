import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Validates study duration (25-90 minutes)
 * @param {number} duration - Duration in minutes
 * @returns {boolean} True if valid
 */
function isValidStudyDuration(duration) {
  return typeof duration === 'number' && duration >= 25 && duration <= 90;
}

/**
 * Validates rest duration (5-20 minutes)
 * @param {number} duration - Duration in minutes
 * @returns {boolean} True if valid
 */
function isValidRestDuration(duration) {
  return typeof duration === 'number' && duration >= 5 && duration <= 20;
}

/**
 * Validates cycle count (1-4 cycles)
 * @param {number} count - Number of cycles
 * @returns {boolean} True if valid
 */
function isValidCycleCount(count) {
  return typeof count === 'number' && count >= 1 && count <= 4 && Number.isInteger(count);
}

/**
 * Custom hook for timer state management and countdown logic
 * @param {Object} config - Initial configuration
 * @param {number} config.initialStudyDuration - Initial study duration in minutes (25-90)
 * @param {number} config.initialRestDuration - Initial rest duration in minutes (5-20)
 * @param {number} config.initialCyclesPlanned - Initial number of cycles (1-4)
 * @param {Function} config.onSessionComplete - Callback when a session completes
 * @param {Function} config.onCycleComplete - Callback when all cycles complete
 * @returns {Object} Timer state and control functions
 */
export function useTimer({
  initialStudyDuration = 25,
  initialRestDuration = 5,
  initialCyclesPlanned = 1,
  onSessionComplete = () => {},
  onCycleComplete = () => {}
} = {}) {
  // Validate initial values
  const validatedStudyDuration = isValidStudyDuration(initialStudyDuration) ? initialStudyDuration : 25;
  const validatedRestDuration = isValidRestDuration(initialRestDuration) ? initialRestDuration : 5;
  const validatedCyclesPlanned = isValidCycleCount(initialCyclesPlanned) ? initialCyclesPlanned : 1;

  // Timer state
  const [studyDuration, setStudyDuration] = useState(validatedStudyDuration);
  const [restDuration, setRestDuration] = useState(validatedRestDuration);
  const [currentTime, setCurrentTime] = useState(validatedStudyDuration * 60); // in seconds
  const [isActive, setIsActive] = useState(false);
  const [sessionType, setSessionType] = useState('study'); // 'study' or 'rest'
  const [cyclesPlanned, setCyclesPlanned] = useState(validatedCyclesPlanned);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);

  // Refs for interval and timestamp tracking
  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);
  const pausedTimeRef = useRef(null);

  /**
   * Set study duration with validation
   * @param {number} minutes - Duration in minutes (25-90)
   * @returns {Object} Result with success status and optional error message
   */
  const setStudyDurationWithValidation = useCallback((minutes) => {
    if (!isValidStudyDuration(minutes)) {
      return {
        success: false,
        error: 'Study duration must be between 25 and 90 minutes'
      };
    }
    setStudyDuration(minutes);
    // Update current time if in study session and not active
    if (sessionType === 'study' && !isActive) {
      setCurrentTime(minutes * 60);
    }
    return { success: true };
  }, [sessionType, isActive]);

  /**
   * Set rest duration with validation
   * @param {number} minutes - Duration in minutes (5-20)
   * @returns {Object} Result with success status and optional error message
   */
  const setRestDurationWithValidation = useCallback((minutes) => {
    if (!isValidRestDuration(minutes)) {
      return {
        success: false,
        error: 'Rest duration must be between 5 and 20 minutes'
      };
    }
    setRestDuration(minutes);
    // Update current time if in rest session and not active
    if (sessionType === 'rest' && !isActive) {
      setCurrentTime(minutes * 60);
    }
    return { success: true };
  }, [sessionType, isActive]);

  /**
   * Set cycles planned with validation
   * @param {number} count - Number of cycles (1-4)
   * @returns {Object} Result with success status and optional error message
   */
  const setCyclesPlannedWithValidation = useCallback((count) => {
    if (!isValidCycleCount(count)) {
      return {
        success: false,
        error: 'Please select between 1 and 4 cycles'
      };
    }
    setCyclesPlanned(count);
    return { success: true };
  }, []);

  /**
   * Start the timer
   */
  const start = useCallback(() => {
    if (!isActive) {
      setIsActive(true);
      startTimeRef.current = Date.now();
      pausedTimeRef.current = currentTime;
    }
  }, [isActive, currentTime]);

  /**
   * Pause the timer
   */
  const pause = useCallback(() => {
    if (isActive) {
      setIsActive(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  }, [isActive]);

  /**
   * Reset the timer to initial state
   */
  const reset = useCallback(() => {
    setIsActive(false);
    setSessionType('study');
    setCurrentTime(studyDuration * 60);
    setCyclesCompleted(0);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    startTimeRef.current = null;
    pausedTimeRef.current = null;
  }, [studyDuration]);

  /**
   * Handle session transition from study to rest
   */
  const transitionToRest = useCallback(() => {
    setSessionType('rest');
    setCurrentTime(restDuration * 60);
    setIsActive(false);
    
    // Notify that study session completed
    onSessionComplete({
      sessionType: 'study',
      duration: studyDuration,
      timestamp: new Date()
    });
  }, [restDuration, studyDuration, onSessionComplete]);

  /**
   * Handle rest session completion
   */
  const completeRestSession = useCallback(() => {
    const newCyclesCompleted = cyclesCompleted + 1;
    setCyclesCompleted(newCyclesCompleted);
    
    // Notify that rest session completed
    onSessionComplete({
      sessionType: 'rest',
      duration: restDuration,
      timestamp: new Date()
    });

    // Check if all cycles are complete
    if (newCyclesCompleted >= cyclesPlanned) {
      setIsActive(false);
      setSessionType('study');
      setCurrentTime(studyDuration * 60);
      
      // Notify that all cycles are complete
      onCycleComplete({
        cyclesCompleted: newCyclesCompleted,
        timestamp: new Date()
      });
    } else {
      // Start next study session
      setSessionType('study');
      setCurrentTime(studyDuration * 60);
      setIsActive(false);
    }
  }, [cyclesCompleted, cyclesPlanned, restDuration, studyDuration, onSessionComplete, onCycleComplete]);

  /**
   * Timer tick effect - handles countdown and transitions
   */
  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        // Calculate elapsed time using timestamps to prevent drift
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        const newTime = pausedTimeRef.current - elapsed;

        if (newTime <= 0) {
          // Timer reached zero
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          
          if (sessionType === 'study') {
            // Transition to rest
            transitionToRest();
          } else {
            // Complete rest session and handle cycle logic
            completeRestSession();
          }
        } else {
          setCurrentTime(newTime);
        }
      }, 100); // Check every 100ms for smooth updates

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [isActive, sessionType, transitionToRest, completeRestSession]);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    // State
    studyDuration,
    restDuration,
    currentTime,
    isActive,
    sessionType,
    cyclesPlanned,
    cyclesCompleted,
    
    // Control functions
    start,
    pause,
    reset,
    setStudyDuration: setStudyDurationWithValidation,
    setRestDuration: setRestDurationWithValidation,
    setCyclesPlanned: setCyclesPlannedWithValidation,
    
    // Computed values
    remainingCycles: cyclesPlanned - cyclesCompleted,
    progress: sessionType === 'study' 
      ? 1 - (currentTime / (studyDuration * 60))
      : 1 - (currentTime / (restDuration * 60))
  };
}
