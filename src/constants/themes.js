/**
 * Theme palette definitions for the Spooky Study Dashboard
 * Each theme provides a complete color scheme for the application
 */

export const THEMES = {
  vampireCrimson: {
    name: 'Vampire Crimson',
    primary: '#8B0000',      // Dark red
    secondary: '#DC143C',    // Crimson
    accent: '#FF0000',       // Bright red
    background: '#0D0208',   // Almost black
    text: '#FFE4E1',         // Misty rose
  },
  witchForest: {
    name: 'Witch Forest',
    primary: '#2D5016',      // Forest green
    secondary: '#6B4C9A',    // Purple
    accent: '#9D4EDD',       // Bright purple
    background: '#0A0E0A',   // Very dark green
    text: '#E8F5E9',         // Light green
  },
  hauntedMidnight: {
    name: 'Haunted Midnight',
    primary: '#4A148C',      // Deep purple
    secondary: '#7B1FA2',    // Purple
    accent: '#BA68C8',       // Light purple
    background: '#0D0221',   // Dark navy
    text: '#E1BEE7',         // Light lavender
  },
  graveyard: {
    name: 'Graveyard',
    primary: '#424242',      // Dark gray
    secondary: '#616161',    // Medium gray
    accent: '#00E676',       // Toxic green
    background: '#121212',   // Near black
    text: '#E0E0E0',         // Light gray
  },
};

export const THEME_KEYS = Object.keys(THEMES);

export const DEFAULT_THEME = 'vampireCrimson';
