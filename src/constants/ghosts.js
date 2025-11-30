/**
 * Ghost variant and emotion definitions for the Spooky Study Dashboard
 * Defines the available ghost companions and their emotional states
 */

export const GHOST_VARIANTS = {
  babyGhost: {
    id: 'baby-ghost',
    name: 'Baby Ghost',
    description: 'A cute and innocent little ghost',
  },
  witchGhost: {
    id: 'witch-ghost',
    name: 'Witch Ghost',
    description: 'A spooky ghost with magical powers',
  },
  vampire: {
    id: 'vampire',
    name: 'Vampire',
    description: 'A sophisticated creature of the night',
  },
  werewolf: {
    id: 'werewolf',
    name: 'Werewolf',
    description: 'A fierce and loyal companion',
  },
  angel: {
    id: 'angel',
    name: 'Angel',
    description: 'A heavenly guardian watching over you',
  },
};

export const GHOST_EMOTIONS = {
  sleepy: 'sleepy',
  mischievous: 'mischievous',
};

export const GHOST_VARIANT_IDS = Object.values(GHOST_VARIANTS).map(v => v.id);

export const DEFAULT_GHOST_VARIANT = 'baby-ghost';
export const DEFAULT_GHOST_EMOTION = 'sleepy';
