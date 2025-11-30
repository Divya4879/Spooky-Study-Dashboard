import React, { useEffect, useState } from 'react';

/**
 * ScreenReaderAnnouncer Component
 * Provides accessible announcements for screen readers using ARIA live regions
 * 
 * @param {Object} props - Component props
 * @param {string} props.message - Message to announce
 * @param {string} props.priority - Priority level ('polite' or 'assertive')
 * @returns {React.ReactElement} Screen reader announcer component
 */
export function ScreenReaderAnnouncer({ message, priority = 'polite' }) {
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    if (message) {
      // Clear first to ensure the same message can be announced multiple times
      setAnnouncement('');
      // Use setTimeout to ensure the DOM updates and screen readers pick up the change
      const timer = setTimeout(() => {
        setAnnouncement(message);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div
      role="status"
      aria-live={priority}
      aria-atomic="true"
      className="sr-only"
    >
      {announcement}
    </div>
  );
}

/**
 * Global announcer hook for managing screen reader announcements
 * @returns {Object} Announcer state and announce function
 */
export function useScreenReaderAnnouncer() {
  const [announcement, setAnnouncement] = useState({ message: '', priority: 'polite' });

  const announce = (message, priority = 'polite') => {
    setAnnouncement({ message, priority });
  };

  return { announcement, announce };
}
