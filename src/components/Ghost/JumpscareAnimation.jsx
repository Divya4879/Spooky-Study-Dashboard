import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../../context/AppContext';

/**
 * JumpscareAnimation component
 * Implements random jumpscare trigger logic during active study sessions
 * Creates non-blocking overlay animation
 * Increments mischief counter on jumpscare
 * 
 * Requirements: 4.1, 4.2, 4.3
 * 
 * Usage:
 * ```jsx
 * import { JumpscareAnimation } from './components/Ghost/JumpscareAnimation';
 * 
 * function App() {
 *   return (
 *     <AppProvider>
 *       <JumpscareAnimation />
 *       {/* Other components *\/}
 *     </AppProvider>
 *   );
 * }
 * ```
 * 
 * The component automatically:
 * - Monitors timer state from AppContext
 * - Triggers jumpscares with 5-15% probability per minute during study sessions
 * - Displays a 1-second non-blocking animation overlay
 * - Increments the mischief counter for achievement tracking
 */
export function JumpscareAnimation() {
  const { timer, incrementMischiefCount, preferences } = useAppContext();
  const { isActive, sessionType } = timer;
  const { ghostVariant } = preferences;

  const [showJumpscare, setShowJumpscare] = useState(false);

  /**
   * Get jumpscare emoji based on ghost variant
   */
  const getJumpscareEmoji = () => {
    const jumpscareEmojis = {
      'baby-ghost': '👻',
      'witch-ghost': '🧙‍♀️',
      'vampire': '🧛',
      'werewolf': '🐺',
      'angel': '😇'
    };
    return jumpscareEmojis[ghostVariant] || '👻';
  };

  /**
   * Trigger a jumpscare animation
   * Increments mischief counter and shows animation for 1 second
   */
  const triggerJumpscare = useCallback(() => {
    setShowJumpscare(true);
    incrementMischiefCount();

    // Auto-dismiss after 1 second
    setTimeout(() => {
      setShowJumpscare(false);
    }, 1000);
  }, [incrementMischiefCount]);

  /**
   * Check if jumpscare should trigger
   * 5-15% chance per minute during active study sessions
   */
  useEffect(() => {
    // Only trigger during active study sessions
    if (!isActive || sessionType !== 'study') {
      return;
    }

    // Check every minute (60000ms)
    const checkInterval = 60000;

    const intervalId = setInterval(() => {
      // Random chance between 5% and 15%
      const minChance = 0.05;
      const maxChance = 0.15;
      const randomChance = Math.random();
      const triggerThreshold = minChance + Math.random() * (maxChance - minChance);

      if (randomChance < triggerThreshold) {
        triggerJumpscare();
      }
    }, checkInterval);

    return () => clearInterval(intervalId);
  }, [isActive, sessionType, triggerJumpscare]);

  return (
    <AnimatePresence>
      {showJumpscare && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
          aria-live="polite"
          aria-label="Jumpscare animation"
        >
          {/* Dark overlay */}
          <motion.div
            className="absolute inset-0 bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
          />

          {/* Jumpscare ghost */}
          <motion.div
            className="relative text-[20rem] select-none"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ 
              scale: [0, 1.5, 1.2],
              rotate: [180, 0, 10, -10, 0]
            }}
            exit={{ 
              scale: 0,
              rotate: 180,
              opacity: 0
            }}
            transition={{
              duration: 0.8,
              ease: 'easeOut'
            }}
            style={{
              filter: 'drop-shadow(0 0 40px rgba(255, 0, 0, 0.8))'
            }}
          >
            {getJumpscareEmoji()}
          </motion.div>

          {/* Spooky text */}
          <motion.div
            className="absolute bottom-1/4 text-4xl font-bold text-red-500"
            initial={{ opacity: 0, y: 50 }}
            animate={{ 
              opacity: [0, 1, 1, 0],
              y: [50, 0, 0, -20]
            }}
            transition={{
              duration: 0.8,
              times: [0, 0.2, 0.8, 1]
            }}
            style={{
              textShadow: '0 0 20px rgba(255, 0, 0, 0.8)',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}
          >
            BOO!
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
