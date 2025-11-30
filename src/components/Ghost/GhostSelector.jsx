import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { GHOST_VARIANTS } from '../../constants/ghosts';

/**
 * GhostSelector component displays five ghost variant options
 * Allows users to select their ghost companion and persists the selection
 * 
 * Requirements: 3.1, 3.2, 3.3
 */
export function GhostSelector() {
  const { preferences, updateGhostVariant } = useAppContext();
  const currentGhostVariant = preferences.ghostVariant;

  /**
   * Handles ghost variant selection
   * @param {string} variantId - The ID of the ghost variant to select
   */
  const handleGhostSelect = (variantId) => {
    updateGhostVariant(variantId);
  };

  // Convert GHOST_VARIANTS object to array for mapping
  const ghostVariants = Object.values(GHOST_VARIANTS);

  return (
    <div className="ghost-selector">
      <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text)' }}>
        Choose Your Ghost Companion
      </h3>
      
      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        {ghostVariants.map((ghost) => {
          const isActive = currentGhostVariant === ghost.id;
          
          return (
            <button
              key={ghost.id}
              onClick={() => handleGhostSelect(ghost.id)}
              className={`
                ghost-button
                relative
                p-4
                rounded-lg
                border-2
                transition-all
                duration-200
                hover:scale-105
                focus:outline-none
                focus:ring-2
                focus:ring-offset-2
                ${isActive ? 'border-4 shadow-lg' : 'border-gray-300 hover:border-gray-400'}
              `}
              style={{
                backgroundColor: 'var(--color-background)',
                borderColor: isActive ? 'var(--color-accent)' : 'var(--color-primary)',
              }}
              aria-label={`Select ${ghost.name} ghost companion`}
              aria-pressed={isActive}
            >
              {/* Ghost name */}
              <div 
                className="text-sm font-medium mb-2 text-center"
                style={{ color: 'var(--color-text)' }}
              >
                {ghost.name}
              </div>
              
              {/* Ghost icon placeholder - will be replaced with actual ghost graphics */}
              <div 
                className="flex items-center justify-center h-16 mb-2"
                aria-hidden="true"
              >
                <div 
                  className="text-4xl"
                  role="img"
                  aria-label={ghost.name}
                >
                  👻
                </div>
              </div>
              
              {/* Ghost description */}
              <div 
                className="text-xs text-center"
                style={{ color: 'var(--color-text)', opacity: 0.8 }}
              >
                {ghost.description}
              </div>
              
              {/* Active indicator */}
              {isActive && (
                <div 
                  className="absolute top-2 right-2 w-3 h-3 rounded-full"
                  style={{ backgroundColor: 'var(--color-accent)' }}
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
