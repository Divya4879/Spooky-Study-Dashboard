import { motion } from 'framer-motion';
import { useAppContext } from '../../context/AppContext';
import { GHOST_VARIANTS } from '../../constants/ghosts';

/**
 * GhostCompanion component renders the selected ghost variant with current emotion
 * Implements animation states based on timer status (idle, studying, resting)
 * Uses Framer Motion for smooth animations
 * 
 * Requirements: 3.2, 3.4, 3.5
 */
export function GhostCompanion() {
  const { preferences, ghostEmotion, timer } = useAppContext();
  const { ghostVariant } = preferences;
  const { isActive, sessionType } = timer;

  // Get ghost variant details
  const currentGhost = Object.values(GHOST_VARIANTS).find(
    ghost => ghost.id === ghostVariant
  ) || GHOST_VARIANTS.babyGhost;

  /**
   * Determine animation state based on timer status
   * - idle: Timer is not active
   * - studying: Timer is active and in study session
   * - resting: Timer is active and in rest session
   */
  const getAnimationState = () => {
    if (!isActive) return 'idle';
    if (sessionType === 'study') return 'studying';
    if (sessionType === 'rest') return 'resting';
    return 'idle';
  };

  const animationState = getAnimationState();

  /**
   * Animation variants for different states
   */
  const ghostVariants = {
    idle: {
      y: [0, -10, 0],
      rotate: [0, -5, 5, 0],
      scale: 1,
      transition: {
        y: {
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut'
        },
        rotate: {
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut'
        }
      }
    },
    studying: {
      y: [0, -15, 0],
      rotate: [0, -8, 8, 0],
      scale: [1, 1.05, 1],
      transition: {
        y: {
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut'
        },
        rotate: {
          duration: 2.5,
          repeat: Infinity,
          ease: 'easeInOut'
        },
        scale: {
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut'
        }
      }
    },
    resting: {
      y: [0, -5, 0],
      rotate: [0, -3, 3, 0],
      scale: [1, 0.98, 1],
      transition: {
        y: {
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut'
        },
        rotate: {
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut'
        },
        scale: {
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut'
        }
      }
    }
  };

  /**
   * Get emoji representation based on ghost variant and emotion
   */
  const getGhostEmoji = () => {
    // Map ghost variants to emojis
    const variantEmojis = {
      'baby-ghost': '👻',
      'witch-ghost': '🧙',
      'vampire': '🧛',
      'werewolf': '🐺',
      'angel': '👼'
    };

    return variantEmojis[ghostVariant] || '👻';
  };

  /**
   * Get emotion indicator emoji
   */
  const getEmotionEmoji = () => {
    return ghostEmotion === 'sleepy' ? '😴' : '😈';
  };

  /**
   * Get animation state description for accessibility
   */
  const getStateDescription = () => {
    if (animationState === 'studying') {
      return `${currentGhost.name} is actively studying with you`;
    } else if (animationState === 'resting') {
      return `${currentGhost.name} is resting with you`;
    }
    return `${currentGhost.name} is waiting to start`;
  };

  return (
    <div className="ghost-companion flex flex-col items-center justify-center p-8">
      {/* Animated ghost container */}
      <motion.div
        className="relative"
        variants={ghostVariants}
        animate={animationState}
        initial="idle"
        aria-label={getStateDescription()}
        role="img"
      >
        {/* Main ghost character */}
        <div 
          className="text-9xl select-none"
          style={{
            filter: animationState === 'studying' 
              ? 'drop-shadow(0 0 20px var(--color-accent))'
              : animationState === 'resting'
              ? 'drop-shadow(0 0 10px var(--color-primary))'
              : 'none'
          }}
        >
          {getGhostEmoji()}
        </div>

        {/* Emotion indicator */}
        <motion.div
          className="absolute -top-2 -right-2 text-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          aria-hidden="true"
        >
          {getEmotionEmoji()}
        </motion.div>
      </motion.div>

      {/* Ghost name and status */}
      <div className="mt-6 text-center">
        <h3 
          className="text-2xl font-bold mb-2"
          style={{ color: 'var(--color-text)' }}
        >
          {currentGhost.name}
        </h3>
        
        <p 
          className="text-sm mb-2"
          style={{ color: 'var(--color-text)', opacity: 0.8 }}
        >
          {currentGhost.description}
        </p>

        {/* Status indicator */}
        <div className="flex items-center justify-center gap-2 mt-4">
          <motion.div
            className="w-2 h-2 rounded-full"
            style={{ 
              backgroundColor: animationState === 'studying' 
                ? 'var(--color-accent)'
                : animationState === 'resting'
                ? 'var(--color-primary)'
                : 'var(--color-secondary)'
            }}
            animate={{
              scale: isActive ? [1, 1.5, 1] : 1,
              opacity: isActive ? [1, 0.5, 1] : 0.5
            }}
            transition={{
              duration: 1.5,
              repeat: isActive ? Infinity : 0,
              ease: 'easeInOut'
            }}
            aria-hidden="true"
          />
          <span 
            className="text-xs font-medium uppercase tracking-wide"
            style={{ color: 'var(--color-text)' }}
          >
            {animationState === 'studying' && 'Studying'}
            {animationState === 'resting' && 'Resting'}
            {animationState === 'idle' && 'Ready'}
          </span>
        </div>

        {/* Emotion display */}
        <p 
          className="text-xs mt-2 capitalize"
          style={{ color: 'var(--color-text)', opacity: 0.6 }}
        >
          Feeling: {ghostEmotion}
        </p>
      </div>
    </div>
  );
}
