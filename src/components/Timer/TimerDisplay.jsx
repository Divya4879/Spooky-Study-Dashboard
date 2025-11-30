import React from 'react';

/**
 * Formats seconds into MM:SS format
 * @param {number} seconds - Total seconds
 * @returns {string} Formatted time string
 */
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

/**
 * TimerDisplay Component
 * Displays countdown timer in a spooky coffin design with session type indicator
 * 
 * @param {Object} props - Component props
 * @param {number} props.currentTime - Current time in seconds
 * @param {string} props.sessionType - Type of session ('study' or 'rest')
 * @param {number} props.progress - Progress value between 0 and 1
 * @param {boolean} props.isActive - Whether timer is currently active
 * @returns {React.ReactElement} Timer display component
 */
export function TimerDisplay({ currentTime, sessionType, progress, isActive }) {
  const formattedTime = formatTime(currentTime);
  const sessionLabel = sessionType === 'study' ? 'Study' : 'Rest';
  
  const progressPercentage = Math.round(progress * 100);
  const minutes = Math.floor(currentTime / 60);
  const seconds = currentTime % 60;
  
  // Create accessible time description
  const timeDescription = `${minutes} minute${minutes !== 1 ? 's' : ''} and ${seconds} second${seconds !== 1 ? 's' : ''} remaining`;
  const statusDescription = isActive ? 'Timer is running' : 'Timer is paused';

  return (
    <div 
      className="spooky-timer-container"
      role="timer"
      aria-label={`${sessionLabel} session timer`}
    >
      {/* Session Type Indicator */}
      <div className="session-indicator">
        <span 
          className="session-label"
          aria-label={`Current session type: ${sessionLabel}`}
        >
          {sessionType === 'study' ? '📚 CURSED STUDY SESSION 📚' : '☠️ HAUNTED REST TIME ☠️'}
        </span>
      </div>

      {/* Spooky Coffin Timer */}
      <div 
        className="coffin-timer"
        role="img"
        aria-label={`Timer progress: ${progressPercentage}% complete`}
      >
        {/* Coffin Shape */}
        <div className="coffin-shape">
          {/* Progress Bar */}
          <div className="coffin-progress-container">
            <div 
              className="coffin-progress-bar"
              style={{ 
                width: `${progressPercentage}%`,
                backgroundColor: sessionType === 'study' ? '#dc143c' : '#8b0000'
              }}
            />
          </div>
          
          {/* Timer Display */}
          <div className="coffin-timer-display">
            <div className="timer-skull">💀</div>
            <div 
              className="timer-text"
              aria-label={timeDescription}
            >
              {formattedTime}
            </div>
            <div className="timer-bones">🦴 🦴</div>
          </div>
          
          {/* Coffin Decorations */}
          <div className="coffin-decorations">
            <div className="coffin-cross">✝️</div>
            <div className="coffin-handles">
              <span>🔗</span>
              <span>🔗</span>
            </div>
          </div>
        </div>
      </div>

      {/* Screen reader only status */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {statusDescription}. {timeDescription} in {sessionLabel} session.
      </div>

      {/* Status indicator */}
      <div className="timer-status">
        {isActive ? (
          <div className="status-active">
            <span className="pulse-dot">🔥</span>
            <span className="status-text">ACTIVE</span>
          </div>
        ) : (
          <div className="status-paused">
            <span className="pause-icon">⏸️</span>
            <span className="status-text">PAUSED</span>
          </div>
        )}
      </div>
    </div>
  );
}
