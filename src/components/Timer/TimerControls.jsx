import React, { useEffect, useCallback } from 'react';

/**
 * TimerControls Component
 * Provides Start/Pause/Reset buttons with keyboard accessibility
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isActive - Whether timer is currently active
 * @param {Function} props.onStart - Callback to start the timer
 * @param {Function} props.onPause - Callback to pause the timer
 * @param {Function} props.onReset - Callback to reset the timer
 * @returns {React.ReactElement} Timer controls component
 */
export function TimerControls({ isActive, onStart, onPause, onReset }) {
  /**
   * Handle keyboard events for accessibility
   * Enter key or Space bar triggers start/pause
   */
  const handleKeyDown = useCallback((event) => {
    // Only handle if the event target is not an input or button
    // (to avoid interfering with other controls)
    if (event.target.tagName === 'INPUT' || event.target.tagName === 'BUTTON') {
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (isActive) {
        onPause();
      } else {
        onStart();
      }
    }
  }, [isActive, onStart, onPause]);

  /**
   * Set up keyboard event listener
   */
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  /**
   * Handle start button click
   */
  const handleStartClick = () => {
    onStart();
  };

  /**
   * Handle pause button click
   */
  const handlePauseClick = () => {
    onPause();
  };

  /**
   * Handle reset button click
   */
  const handleResetClick = () => {
    onReset();
  };

  return (
    <div className="flex items-center justify-center gap-4 mt-8">
      {/* Start/Pause Button */}
      {!isActive ? (
        <button
          onClick={handleStartClick}
          className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          aria-label="Start timer"
        >
          Start
        </button>
      ) : (
        <button
          onClick={handlePauseClick}
          className="px-8 py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded-lg shadow-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
          aria-label="Pause timer"
        >
          Pause
        </button>
      )}

      {/* Reset Button */}
      <button
        onClick={handleResetClick}
        className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        aria-label="Reset timer"
      >
        Reset
      </button>
    </div>
  );
}
