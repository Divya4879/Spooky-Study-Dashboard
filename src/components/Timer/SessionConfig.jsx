import React, { useState, useEffect } from 'react';

/**
 * SessionConfig Component
 * Provides configuration inputs for study duration, rest duration, and Pomodoro cycles
 * with validation and error messaging
 * 
 * @param {Object} props - Component props
 * @param {number} props.studyDuration - Current study duration in minutes (25-90)
 * @param {number} props.restDuration - Current rest duration in minutes (5-20)
 * @param {number} props.cyclesPlanned - Current number of planned cycles (1-4)
 * @param {Function} props.onStudyDurationChange - Callback when study duration changes
 * @param {Function} props.onRestDurationChange - Callback when rest duration changes
 * @param {Function} props.onCyclesPlannedChange - Callback when cycles planned changes
 * @param {boolean} props.disabled - Whether inputs should be disabled (e.g., during active session)
 * @returns {React.ReactElement} Session configuration component
 */
export function SessionConfig({
  studyDuration,
  restDuration,
  cyclesPlanned,
  onStudyDurationChange,
  onRestDurationChange,
  onCyclesPlannedChange,
  disabled = false
}) {
  // Local state for input values (allows typing without immediate validation)
  const [studyInput, setStudyInput] = useState(studyDuration.toString());
  const [restInput, setRestInput] = useState(restDuration.toString());
  const [cyclesInput, setCyclesInput] = useState(cyclesPlanned.toString());

  // Error states
  const [studyError, setStudyError] = useState('');
  const [restError, setRestError] = useState('');
  const [cyclesError, setCyclesError] = useState('');

  // Update local state when props change
  useEffect(() => {
    setStudyInput(studyDuration.toString());
  }, [studyDuration]);

  useEffect(() => {
    setRestInput(restDuration.toString());
  }, [restDuration]);

  useEffect(() => {
    setCyclesInput(cyclesPlanned.toString());
  }, [cyclesPlanned]);

  /**
   * Handle study duration input change
   */
  const handleStudyInputChange = (e) => {
    const value = e.target.value;
    setStudyInput(value);
    setStudyError('');
  };

  /**
   * Handle study duration blur (validation on focus loss)
   */
  const handleStudyBlur = () => {
    const value = parseInt(studyInput, 10);
    
    if (isNaN(value)) {
      setStudyError('Please enter a valid number');
      setStudyInput(studyDuration.toString());
      return;
    }

    const result = onStudyDurationChange(value);
    if (!result.success) {
      setStudyError(result.error);
      setStudyInput(studyDuration.toString());
    }
  };

  /**
   * Handle rest duration input change
   */
  const handleRestInputChange = (e) => {
    const value = e.target.value;
    setRestInput(value);
    setRestError('');
  };

  /**
   * Handle rest duration blur (validation on focus loss)
   */
  const handleRestBlur = () => {
    const value = parseInt(restInput, 10);
    
    if (isNaN(value)) {
      setRestError('Please enter a valid number');
      setRestInput(restDuration.toString());
      return;
    }

    const result = onRestDurationChange(value);
    if (!result.success) {
      setRestError(result.error);
      setRestInput(restDuration.toString());
    }
  };

  /**
   * Handle cycles input change
   */
  const handleCyclesInputChange = (e) => {
    const value = e.target.value;
    setCyclesInput(value);
    setCyclesError('');
  };

  /**
   * Handle cycles blur (validation on focus loss)
   */
  const handleCyclesBlur = () => {
    const value = parseInt(cyclesInput, 10);
    
    if (isNaN(value)) {
      setCyclesError('Please enter a valid number');
      setCyclesInput(cyclesPlanned.toString());
      return;
    }

    const result = onCyclesPlannedChange(value);
    if (!result.success) {
      setCyclesError(result.error);
      setCyclesInput(cyclesPlanned.toString());
    }
  };

  /**
   * Handle Enter key press to blur input
   */
  const handleKeyDown = (e, blurHandler) => {
    if (e.key === 'Enter') {
      e.target.blur();
    }
  };

  return (
    <div className="space-y-6 p-6 bg-white bg-opacity-10 rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold text-center mb-4">Session Configuration</h3>
      
      {/* Study Duration Input */}
      <div className="space-y-2">
        <label 
          htmlFor="study-duration" 
          className="block text-sm font-medium"
        >
          Study Duration (25-90 minutes)
        </label>
        <input
          id="study-duration"
          type="number"
          min="25"
          max="90"
          value={studyInput}
          onChange={handleStudyInputChange}
          onBlur={handleStudyBlur}
          onKeyDown={(e) => handleKeyDown(e, handleStudyBlur)}
          disabled={disabled}
          className={`w-full px-4 py-2 rounded-md border ${
            studyError 
              ? 'border-red-500 focus:ring-red-500' 
              : 'border-gray-300 focus:ring-blue-500'
          } focus:outline-none focus:ring-2 disabled:bg-gray-100 disabled:cursor-not-allowed`}
          aria-invalid={!!studyError}
          aria-describedby={studyError ? 'study-error' : undefined}
        />
        {studyError && (
          <p 
            id="study-error" 
            className="text-sm text-red-500 mt-1"
            role="alert"
          >
            {studyError}
          </p>
        )}
      </div>

      {/* Rest Duration Input */}
      <div className="space-y-2">
        <label 
          htmlFor="rest-duration" 
          className="block text-sm font-medium"
        >
          Rest Duration (5-20 minutes)
        </label>
        <input
          id="rest-duration"
          type="number"
          min="5"
          max="20"
          value={restInput}
          onChange={handleRestInputChange}
          onBlur={handleRestBlur}
          onKeyDown={(e) => handleKeyDown(e, handleRestBlur)}
          disabled={disabled}
          className={`w-full px-4 py-2 rounded-md border ${
            restError 
              ? 'border-red-500 focus:ring-red-500' 
              : 'border-gray-300 focus:ring-blue-500'
          } focus:outline-none focus:ring-2 disabled:bg-gray-100 disabled:cursor-not-allowed`}
          aria-invalid={!!restError}
          aria-describedby={restError ? 'rest-error' : undefined}
        />
        {restError && (
          <p 
            id="rest-error" 
            className="text-sm text-red-500 mt-1"
            role="alert"
          >
            {restError}
          </p>
        )}
      </div>

      {/* Pomodoro Cycles Selector */}
      <div className="space-y-2">
        <label 
          htmlFor="cycles-planned" 
          className="block text-sm font-medium"
        >
          Pomodoro Cycles (1-4)
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((count) => (
            <button
              key={count}
              onClick={() => {
                const result = onCyclesPlannedChange(count);
                if (!result.success) {
                  setCyclesError(result.error);
                } else {
                  setCyclesError('');
                }
              }}
              disabled={disabled}
              className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                cyclesPlanned === count
                  ? 'bg-blue-600 text-white focus:ring-blue-500'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-400'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              aria-label={`${count} cycle${count > 1 ? 's' : ''}`}
              aria-pressed={cyclesPlanned === count}
            >
              {count}
            </button>
          ))}
        </div>
        {cyclesError && (
          <p 
            id="cycles-error" 
            className="text-sm text-red-500 mt-1"
            role="alert"
          >
            {cyclesError}
          </p>
        )}
      </div>

      {/* Alternative: Number input for cycles (hidden by default, using buttons instead) */}
      {/* Uncomment if you prefer a number input over buttons */}
      {/* <div className="space-y-2">
        <label 
          htmlFor="cycles-planned" 
          className="block text-sm font-medium"
        >
          Pomodoro Cycles (1-4)
        </label>
        <input
          id="cycles-planned"
          type="number"
          min="1"
          max="4"
          value={cyclesInput}
          onChange={handleCyclesInputChange}
          onBlur={handleCyclesBlur}
          onKeyDown={(e) => handleKeyDown(e, handleCyclesBlur)}
          disabled={disabled}
          className={`w-full px-4 py-2 rounded-md border ${
            cyclesError 
              ? 'border-red-500 focus:ring-red-500' 
              : 'border-gray-300 focus:ring-blue-500'
          } focus:outline-none focus:ring-2 disabled:bg-gray-100 disabled:cursor-not-allowed`}
          aria-invalid={!!cyclesError}
          aria-describedby={cyclesError ? 'cycles-error' : undefined}
        />
        {cyclesError && (
          <p 
            id="cycles-error" 
            className="text-sm text-red-500 mt-1"
            role="alert"
          >
            {cyclesError}
          </p>
        )}
      </div> */}
    </div>
  );
}
