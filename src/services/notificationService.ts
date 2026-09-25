import { DailyScheduledTask, TaskNotification, NotificationSettings } from '../types';

const SETTINGS_KEY = 'rehabsathi_notification_settings_v1';
const SNOOZED_KEY = 'rehabsathi_snoozed_notifications_v1';
const DISMISSED_KEY = 'rehabsathi_dismissed_notifications_v1';

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  pushEnabled: true,
  soundEnabled: true,
  voiceReadout: false,
  leadTimeMinutes: 10,
};

// Check if browser native notifications are supported
export const isPushSupported = (): boolean => {
  return typeof window !== 'undefined' && 'Notification' in window;
};

// Get current permission status
export const getPushPermissionState = (): 'granted' | 'denied' | 'default' | 'unsupported' => {
  if (!isPushSupported()) return 'unsupported';
  return Notification.permission;
};

// Request push permission from user
export const requestPushPermission = async (): Promise<'granted' | 'denied' | 'default' | 'unsupported'> => {
  if (!isPushSupported()) return 'unsupported';
  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (err) {
    console.warn('Notification permission request failed:', err);
    return Notification.permission || 'denied';
  }
};

// Native Browser Push Notification
export const showBrowserPush = (title: string, options?: NotificationOptions): boolean => {
  if (!isPushSupported()) return false;
  if (Notification.permission !== 'granted') return false;

  try {
    const notification = new Notification(title, {
      icon: '/vite.svg',
      badge: '/vite.svg',
      silent: false,
      tag: 'rehabsathi-task-reminder',
      ...options,
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    return true;
  } catch (err) {
    console.warn('Native browser push dispatch error:', err);
    return false;
  }
};

// Gentle Harmonic Web Audio Chime (Zero external dependencies)
export const playGentleChime = () => {
  try {
    const AudioContextClass =
      window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;

    // First note: C5 (523.25 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(523.25, now);
    gain1.gain.setValueAtTime(0.12, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.5);

    // Second harmonic note: G5 (783.99 Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(783.99, now + 0.15);
    gain2.gain.setValueAtTime(0.14, now + 0.15);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.85);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.15);
    osc2.stop(now + 0.85);
  } catch (e) {
    // Audio context may be restricted before user gesture
  }
};

// Load Notification Settings from LocalStorage
export const loadNotificationSettings = (): NotificationSettings => {
  try {
    const saved = localStorage.getItem(SETTINGS_KEY);
    return saved ? { ...DEFAULT_NOTIFICATION_SETTINGS, ...JSON.parse(saved) } : DEFAULT_NOTIFICATION_SETTINGS;
  } catch {
    return DEFAULT_NOTIFICATION_SETTINGS;
  }
};

// Save Notification Settings
export const saveNotificationSettings = (settings: NotificationSettings) => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save notification settings:', err);
  }
};

// Read Snoozed and Dismissed IDs
export const getSnoozedMap = (): Record<string, number> => {
  try {
    const raw = localStorage.getItem(SNOOZED_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

export const setSnoozedTime = (taskId: string, minutes: number = 10) => {
  try {
    const snoozed = getSnoozedMap();
    snoozed[taskId] = Date.now() + minutes * 60 * 1000;
    localStorage.setItem(SNOOZED_KEY, JSON.stringify(snoozed));
  } catch (err) {
    console.error('Failed to set snoozed notification:', err);
  }
};

export const getDismissedIds = (): string[] => {
  try {
    const raw = localStorage.getItem(DISMISSED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const markNotificationDismissed = (id: string) => {
  try {
    const list = getDismissedIds();
    if (!list.includes(id)) {
      list.push(id);
      localStorage.setItem(DISMISSED_KEY, JSON.stringify(list));
    }
  } catch (err) {
    console.error('Failed to dismiss notification:', err);
  }
};

export const clearAllDismissed = () => {
  try {
    localStorage.removeItem(DISMISSED_KEY);
    localStorage.removeItem(SNOOZED_KEY);
  } catch (err) {
    console.error('Failed to clear dismissed list:', err);
  }
};

// Build Notification Items from Daily Tasks
export const deriveTaskNotifications = (
  tasks: DailyScheduledTask[],
  patientName: string = 'Patient'
): TaskNotification[] => {
  const snoozedMap = getSnoozedMap();
  const dismissedIds = getDismissedIds();
  const now = Date.now();

  const notifications: TaskNotification[] = [];

  tasks.forEach((task) => {
    // If completed, don't show active alert unless milestone
    if (task.status === 'completed') return;

    // Check if currently snoozed
    const snoozedUntil = snoozedMap[task.id];
    if (snoozedUntil && snoozedUntil > now) return;

    const notifId = `notif-${task.id}`;
    if (dismissedIds.includes(notifId)) return;

    if (task.status === 'due_now') {
      notifications.push({
        id: notifId,
        taskId: task.id,
        exerciseName: task.exerciseName,
        slotName: task.slotName,
        scheduledTime: task.scheduledTime,
        title: `Rehabilitation Task Due: ${task.exerciseName}`,
        body: `Scheduled for ${task.scheduledTime} (${task.slotName}). Doctor prescribed ${task.repetitions}. Tap to start with voice counter.`,
        type: 'due_now',
        createdAt: 'Due Right Now',
        timestamp: Date.now(),
        dosage: task.repetitions,
        dismissed: false,
      });
    } else if (task.status === 'missed') {
      notifications.push({
        id: notifId,
        taskId: task.id,
        exerciseName: task.exerciseName,
        slotName: task.slotName,
        scheduledTime: task.scheduledTime,
        title: `Catch-up Reminder: ${task.exerciseName}`,
        body: `Your ${task.scheduledTime} session was missed. Perform safely within pain-free range to maintain continuity.`,
        type: 'missed',
        createdAt: 'Earlier Today',
        timestamp: Date.now() - 3600000,
        dosage: task.repetitions,
        dismissed: false,
      });
    } else if (task.status === 'pending') {
      // Upcoming reminder
      notifications.push({
        id: notifId,
        taskId: task.id,
        exerciseName: task.exerciseName,
        slotName: task.slotName,
        scheduledTime: task.scheduledTime,
        title: `Upcoming Session: ${task.exerciseName}`,
        body: `Scheduled for ${task.scheduledTime} (${task.slotName}). Recommended equipment: Sturdy chair.`,
        type: 'upcoming',
        createdAt: `Scheduled ${task.scheduledTime}`,
        timestamp: Date.now() + 1800000,
        dosage: task.repetitions,
        dismissed: false,
      });
    }
  });

  return notifications;
};
