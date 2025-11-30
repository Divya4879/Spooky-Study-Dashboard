import { useState, useEffect } from 'react';
import { saveToStorage, loadFromStorage } from '../utils/storage';

/**
 * Custom hook for synchronizing state with localStorage
 * @param {string} key - The localStorage key
 * @param {any} defaultValue - The default value if no stored value exists
 * @returns {[any, Function]} A stateful value and a function to update it
 */
export function useLocalStorage(key, defaultValue) {
  // Initialize state with value from localStorage or default
  const [value, setValue] = useState(() => {
    return loadFromStorage(key, defaultValue);
  });

  // Update localStorage whenever value changes
  useEffect(() => {
    try {
      saveToStorage(key, value);
    } catch (error) {
      console.error(`Failed to save ${key} to localStorage:`, error);
    }
  }, [key, value]);

  return [value, setValue];
}
