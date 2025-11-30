/**
 * Achievement definitions for the Spooky Study Dashboard
 * Each achievement has a unique condition that must be met to unlock it
 */

export const ACHIEVEMENTS = {
  cursedConsistency: {
    id: 'cursed-consistency',
    name: 'Cursed Consistency',
    description: 'Study for 7 consecutive days',
    icon: '🔥',
    condition: 'hasConsecutiveDays',
    conditionParams: { days: 7 },
  },
  demonDiscipline: {
    id: 'demon-discipline',
    name: 'Demon of Discipline',
    description: 'Complete 10+ sessions in 7 days',
    icon: '😈',
    condition: 'getSessionsInLastNDays',
    conditionParams: { sessions: 10, days: 7 },
  },
  witchingHour: {
    id: 'witching-hour',
    name: 'Witching Hour Warrior',
    description: 'Study between midnight and 3 AM',
    icon: '🌙',
    condition: 'hasSessionInTimeRange',
    conditionParams: { startHour: 0, endHour: 3 },
  },
  sleepySurvivor: {
    id: 'sleepy-survivor',
    name: 'Sleepy Survivor',
    description: 'Complete 3 sessions with sleepy ghost',
    icon: '😴',
    condition: 'countSessionsByEmotion',
    conditionParams: { emotion: 'sleepy', count: 3 },
  },
  mischievousMaster: {
    id: 'mischievous-master',
    name: 'Mischievous Master',
    description: 'Experience 5 jumpscares',
    icon: '👻',
    condition: 'mischiefCount',
    conditionParams: { count: 5 },
  },
};

export const ACHIEVEMENT_IDS = Object.values(ACHIEVEMENTS).map(a => a.id);

export const DEFAULT_ACHIEVEMENT_STATE = ACHIEVEMENT_IDS.reduce((acc, id) => {
  acc[id] = {
    unlocked: false,
    unlockedAt: null,
  };
  return acc;
}, {});
