/**
 * Storage utilities for persisting application data to localStorage
 * Handles serialization, deserialization, error handling, and default values
 */

/**
 * Saves data to localStorage with error handling
 * @param {string} key - The storage key
 * @param {any} data - The data to store (will be JSON serialized)
 * @throws {Error} If quota is exceeded after cleanup attempt
 */
export function saveToStorage(key, data) {
  try {
    const serialized = JSON.stringify(data);
    localStorage.setItem(key, serialized);
  } catch (error) {
    // Handle quota exceeded error
    if (error.name === 'QuotaExceededError' || error.code === 22) {
      console.warn('LocalStorage quota exceeded. Attempting to clear old session history...');
      
      try {
        // Attempt to clear old session history (keep only last 30 days)
        const sessionHistory = loadFromStorage('sessionHistory', []);
        if (sessionHistory.length > 0) {
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          
          const recentSessions = sessionHistory.filter(session => {
            const sessionDate = new Date(session.startTime);
            return sessionDate >= thirtyDaysAgo;
          });
          
          // Save the trimmed history
          localStorage.setItem('sessionHistory', JSON.stringify(recentSessions));
          
          // Retry the original save operation
          const serialized = JSON.stringify(data);
          localStorage.setItem(key, serialized);
          
          console.info('Storage cleanup successful. Data saved.');
        } else {
          throw new Error('Storage limit reached. Some history may not be saved.');
        }
      } catch (retryError) {
        console.error('Failed to save data after cleanup:', retryError);
        throw new Error('Storage limit reached. Some history may not be saved.');
      }
    } else {
      // Re-throw other errors
      console.error('Error saving to localStorage:', error);
      throw error;
    }
  }
}

/**
 * Loads data from localStorage with error handling and default fallback
 * @param {string} key - The storage key
 * @param {any} defaultValue - The default value to return if data is missing or corrupted
 * @returns {any} The parsed data or the default value
 */
export function loadFromStorage(key, defaultValue) {
  try {
    const item = localStorage.getItem(key);
    
    // Handle missing data - return default value
    if (item === null || item === undefined) {
      return defaultValue;
    }
    
    // Attempt to parse the data
    const parsed = JSON.parse(item);
    return parsed;
  } catch (error) {
    // Handle corrupted data
    if (error instanceof SyntaxError) {
      console.warn(`Corrupted data found for key "${key}". Using default value.`, error);
      console.info('Settings restored to defaults');
      return defaultValue;
    }
    
    // Handle other errors
    console.error('Error loading from localStorage:', error);
    return defaultValue;
  }
}

/**
 * Clears all application data from localStorage
 */
export function clearStorage() {
  try {
    // Clear all keys related to the application
    const keysToRemove = [
      'preferences',
      'sessionHistory',
      'achievements',
      'mischiefCount'
    ];
    
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });
    
    console.info('Storage cleared successfully');
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    throw error;
  }
}
