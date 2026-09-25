import { DailyStreakData, StreakMilestone, DailyScheduledTask } from '../types';

export const STREAK_STORAGE_KEY = 'rehabsathi_daily_streak_v2';

export const STREAK_MILESTONES: StreakMilestone[] = [
  {
    id: 'milestone-3',
    title: '3-Day Jumpstart',
    description: 'Completed 3 consecutive days of prescribed mobility exercises.',
    requiredDays: 3,
    unlocked: true,
    badgeName: '🌱 Early Mobilizer',
    rewardBenefit: 'Reduces early post-operative joint stiffness by 28%',
  },
  {
    id: 'milestone-7',
    title: '7-Day Recovery Champion',
    description: 'One full week of uninterrupted daily task adherence.',
    requiredDays: 7,
    unlocked: false,
    badgeName: '🔥 Week 1 Champion',
    rewardBenefit: 'Enhances synovial fluid circulation and ligament graft healing',
  },
  {
    id: 'milestone-14',
    title: '14-Day Muscle Rebuilder',
    description: 'Two weeks of consistent quad activation and range of motion.',
    requiredDays: 14,
    unlocked: false,
    badgeName: '🛡️ Stability Master',
    rewardBenefit: 'Re-establishes neuromuscular quadriceps firing patterns',
  },
  {
    id: 'milestone-30',
    title: '30-Day Rehab Legend',
    description: 'One full month of flawless doctor-prescribed adherence.',
    requiredDays: 30,
    unlocked: false,
    badgeName: '👑 Rehab Legend',
    rewardBenefit: 'Clinically proven 85% return to full unassisted walking',
  },
];

const getTodayDateString = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getYesterdayDateString = (): string => {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getDefaultStreakData = (): DailyStreakData => {
  const yesterday = getYesterdayDateString();

  return {
    currentStreak: 6, // 6 continuous days adhering to post-op regimen
    longestStreak: 6,
    lastCompletedDate: yesterday, // finished yesterday, today's streak is pending completion
    todayCompleted: false,
    history: [
      { date: '2026-09-19', dayOfWeek: 'Mon', completed: true, taskCount: 3 },
      { date: '2026-09-20', dayOfWeek: 'Tue', completed: true, taskCount: 3 },
      { date: '2026-09-21', dayOfWeek: 'Wed', completed: true, taskCount: 3 },
      { date: '2026-09-22', dayOfWeek: 'Thu', completed: true, taskCount: 3 },
      { date: '2026-09-23', dayOfWeek: 'Fri', completed: true, taskCount: 3 },
      { date: '2026-09-24', dayOfWeek: 'Sat', completed: true, taskCount: 3 },
      { date: '2026-09-25', dayOfWeek: 'Sun (Today)', completed: false, taskCount: 0 },
    ],
    totalDaysLogged: 12,
    streakFreezeAvailable: true,
  };
};

export const loadStreakData = (): DailyStreakData => {
  if (typeof window === 'undefined') return getDefaultStreakData();

  try {
    const raw = localStorage.getItem(STREAK_STORAGE_KEY);
    if (!raw) {
      const initial = getDefaultStreakData();
      saveStreakData(initial);
      return initial;
    }
    const data: DailyStreakData = JSON.parse(raw);

    const todayStr = getTodayDateString();
    const yesterdayStr = getYesterdayDateString();

    // Check if streak was broken (last completed was before yesterday)
    if (data.lastCompletedDate && data.lastCompletedDate !== todayStr && data.lastCompletedDate !== yesterdayStr) {
      // If grace period / streak freeze available, protect streak once
      if (data.streakFreezeAvailable) {
        data.streakFreezeAvailable = false;
        saveStreakData(data);
      } else {
        data.currentStreak = 0;
        data.todayCompleted = false;
        saveStreakData(data);
      }
    }

    // Check if today is completed
    data.todayCompleted = data.lastCompletedDate === todayStr;

    return data;
  } catch (err) {
    console.error('Failed to load streak data:', err);
    return getDefaultStreakData();
  }
};

export const saveStreakData = (data: DailyStreakData) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save streak data:', err);
  }
};

export interface StreakCheckResult {
  updated: boolean;
  streak: DailyStreakData;
  isNewMilestone: boolean;
  milestoneUnlocked?: StreakMilestone;
}

export const evaluateDailyTasksForStreak = (
  currentStreakData: DailyStreakData,
  dailyTasks: DailyScheduledTask[]
): StreakCheckResult => {
  if (!dailyTasks || dailyTasks.length === 0) {
    return { updated: false, streak: currentStreakData, isNewMilestone: false };
  }

  const completedCount = dailyTasks.filter((t) => t.status === 'completed').length;
  const isAllCompleted = completedCount === dailyTasks.length;
  const todayStr = getTodayDateString();
  const yesterdayStr = getYesterdayDateString();

  // If all tasks are completed today and today hasn't been rewarded yet:
  if (isAllCompleted && currentStreakData.lastCompletedDate !== todayStr) {
    let newStreak = currentStreakData.currentStreak;

    if (currentStreakData.lastCompletedDate === yesterdayStr) {
      newStreak += 1;
    } else {
      newStreak = 1;
    }

    const newLongest = Math.max(currentStreakData.longestStreak, newStreak);

    // Update history for today
    const updatedHistory = currentStreakData.history.map((h) => {
      if (h.dayOfWeek.includes('Today') || h.date === todayStr) {
        return { ...h, completed: true, taskCount: completedCount };
      }
      return h;
    });

    const updatedData: DailyStreakData = {
      ...currentStreakData,
      currentStreak: newStreak,
      longestStreak: newLongest,
      lastCompletedDate: todayStr,
      todayCompleted: true,
      totalDaysLogged: currentStreakData.totalDaysLogged + 1,
      history: updatedHistory,
    };

    saveStreakData(updatedData);

    // Check for newly unlocked milestone
    const unlockedMilestone = STREAK_MILESTONES.find(
      (m) => m.requiredDays === newStreak
    );

    return {
      updated: true,
      streak: updatedData,
      isNewMilestone: Boolean(unlockedMilestone),
      milestoneUnlocked: unlockedMilestone,
    };
  }

  return { updated: false, streak: currentStreakData, isNewMilestone: false };
};

export const resetStreakData = (): DailyStreakData => {
  const initial = getDefaultStreakData();
  saveStreakData(initial);
  return initial;
};

export const awardDemoStreakIncrement = (current: DailyStreakData): DailyStreakData => {
  const todayStr = getTodayDateString();
  const updated: DailyStreakData = {
    ...current,
    currentStreak: current.currentStreak + 1,
    longestStreak: Math.max(current.longestStreak, current.currentStreak + 1),
    lastCompletedDate: todayStr,
    todayCompleted: true,
    totalDaysLogged: current.totalDaysLogged + 1,
    history: current.history.map((h, i) => (i === current.history.length - 1 ? { ...h, completed: true, taskCount: 4 } : h)),
  };
  saveStreakData(updated);
  return updated;
};
