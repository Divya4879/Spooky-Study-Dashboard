import React from 'react';
import { useTheme } from '../../context/ThemeContext';

/**
 * ThemePalette component displays a grid of theme selection buttons
 * Each button shows a visual preview of the theme colors and highlights the active theme
 * 
 * Requirements: 2.1, 2.2
 */
export function ThemePalette() {
  const { currentTheme, setTheme, themes, themeKeys } = useTheme();

  /**
   * Handles theme selection
   * @param {string} themeKey - The key of the theme to select
   */
  const handleThemeSelect = (themeKey) => {
    setTheme(themeKey);
  };

  const getThemeIcon = (themeKey) => {
    const icons = {
      vampireCrimson: '🧛',
      witchForest: '🧙',
      hauntedMidnight: '🌙',
      graveyard: '⚰️',
    };
    return icons[themeKey] || '🎨';
  };

  return (
    <div className="theme-palette max-w-4xl mx-auto">
      <h3 className="text-2xl font-bold mb-6 text-center" style={{ color: 'var(--color-text)' }}>
        Choose Your Dark Theme
      </h3>
      
      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {themeKeys.map((themeKey) => {
          const theme = themes[themeKey];
          const isActive = currentTheme === themeKey;
          
          return (
            <button
              key={themeKey}
              onClick={() => handleThemeSelect(themeKey)}
              className={`
                theme-button
                relative
                p-6
                rounded-xl
                border-3
                transition-all
                duration-300
                hover:scale-105
                focus:outline-none
                focus:ring-4
                focus:ring-offset-2
                ${isActive ? 'border-4 shadow-2xl scale-110' : 'shadow-lg hover:shadow-xl'}
              `}
              style={{
                backgroundColor: theme.background,
                borderColor: isActive ? theme.accent : theme.primary,
                borderWidth: '3px',
              }}
              aria-label={`Select ${theme.name} theme`}
              aria-pressed={isActive}
            >
              {/* Theme icon */}
              <div className="text-4xl mb-3 text-center">
                {getThemeIcon(themeKey)}
              </div>
              
              {/* Theme name */}
              <div 
                className="text-base font-bold mb-3 text-center"
                style={{ color: theme.text }}
              >
                {theme.name}
              </div>
              
              {/* Color preview swatches */}
              <div className="flex gap-2 justify-center">
                <div
                  className="w-5 h-5 rounded-full border-2"
                  style={{ 
                    backgroundColor: theme.primary,
                    borderColor: theme.text,
                    opacity: 0.8
                  }}
                  title="Primary color"
                />
                <div
                  className="w-5 h-5 rounded-full border-2"
                  style={{ 
                    backgroundColor: theme.secondary,
                    borderColor: theme.text,
                    opacity: 0.8
                  }}
                  title="Secondary color"
                />
                <div
                  className="w-5 h-5 rounded-full border-2"
                  style={{ 
                    backgroundColor: theme.accent,
                    borderColor: theme.text,
                    opacity: 0.8
                  }}
                  title="Accent color"
                />
              </div>
              
              {/* Active indicator */}
              {isActive && (
                <div 
                  className="absolute top-3 right-3 w-4 h-4 rounded-full animate-pulse"
                  style={{ backgroundColor: theme.accent }}
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
