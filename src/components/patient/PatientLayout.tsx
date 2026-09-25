import React, { useState, useEffect, useCallback } from 'react';
import { PatientHome } from './PatientHome';
import { PatientMyPlan } from './PatientMyPlan';
import { PatientExerciseLibrary } from './PatientExerciseLibrary';
import { VisualGuideView } from './VisualGuideView';
import { PatientProgress } from './PatientProgress';
import { PatientHelp } from './PatientHelp';
import { DailyTaskProgressDashboard } from './DailyTaskProgressDashboard';
import { ExercisePlayerModal } from './ExercisePlayerModal';
import { VisualGuideModal } from './VisualGuideModal';
import { PatientNotificationToast } from './PatientNotificationToast';
import { PersistentNotificationBar } from './PersistentNotificationBar';
import { NotificationCenterModal } from './NotificationCenterModal';
import { VoiceTaskLoggerModal } from './VoiceTaskLoggerModal';
import { VoiceCommandQuickBar } from './VoiceCommandQuickBar';
import { DailyStreakBadge } from './DailyStreakBadge';
import { StreakRewardModal } from './StreakRewardModal';
import { Home, Calendar, Video, Eye, TrendingUp, HelpCircle, Bell, BellRing, Mic, Flame } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PlanExercise, TaskNotification, NotificationSettings, DailyStreakData } from '../../types';
import {
  deriveTaskNotifications,
  loadNotificationSettings,
  saveNotificationSettings,
  setSnoozedTime,
  markNotificationDismissed,
  showBrowserPush,
  playGentleChime,
} from '../../services/notificationService';
import {
  loadStreakData,
  evaluateDailyTasksForStreak,
} from '../../services/streakService';
import confetti from 'canvas-confetti';

export const PatientLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'plan' | 'library' | 'visual_guide' | 'progress' | 'help'>('home');
  const [playerExercise, setPlayerExercise] = useState<PlanExercise | null>(null);
  const [visualGuideExerciseName, setVisualGuideExerciseName] = useState<string | null>(null);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState<boolean>(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState<boolean>(false);
  const [streakData, setStreakData] = useState<DailyStreakData>(loadStreakData);
  const [isStreakModalOpen, setIsStreakModalOpen] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<TaskNotification[]>([]);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(loadNotificationSettings);

  const { language, activePlan, dailyTasks, currentPatient, speakText } = useApp();

  // Evaluate daily task completion to automatically award daily streak
  useEffect(() => {
    const result = evaluateDailyTasksForStreak(streakData, dailyTasks);
    if (result.updated) {
      setStreakData(result.streak);
      playGentleChime();
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#EA580C', '#C99A3A', '#15803D', '#FDE68A'],
        });
      } catch {}

      const praiseText =
        language === 'ta'
          ? `வாழ்த்துகள் ${currentPatient.name}! உங்கள் தொடர் உடற்பயிற்சி முன்னேற்றம் ${result.streak.currentStreak} நாட்களை எட்டியுள்ளது!`
          : language === 'hi'
          ? `बधाई हो ${currentPatient.name}! आपकी दैनिक निरंतरता ${result.streak.currentStreak} दिनों तक पहुँच गई है!`
          : `Congratulations ${currentPatient.name}! Your daily rehabilitation streak is now ${result.streak.currentStreak} days!`;
      speakText(praiseText, language);
    }
  }, [dailyTasks, streakData, language, speakText, currentPatient.name]);

  // Refresh active task notifications whenever daily tasks or settings change
  const refreshNotifications = useCallback(() => {
    const list = deriveTaskNotifications(dailyTasks, currentPatient.name);
    setNotifications(list);
  }, [dailyTasks, currentPatient.name]);

  useEffect(() => {
    refreshNotifications();
  }, [refreshNotifications]);

  // Periodic reminder checker every 20 seconds for timely scheduling alerts
  useEffect(() => {
    const interval = setInterval(() => {
      refreshNotifications();
    }, 20000);
    return () => clearInterval(interval);
  }, [refreshNotifications]);

  // Update Settings handler
  const handleUpdateSettings = (newSettings: NotificationSettings) => {
    setNotificationSettings(newSettings);
    saveNotificationSettings(newSettings);
  };

  // Dismiss notification toast
  const handleDismissNotification = (id: string) => {
    markNotificationDismissed(id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Snooze notification
  const handleSnoozeNotification = (taskId: string) => {
    setSnoozedTime(taskId, 10);
    refreshNotifications();
  };

  // Trigger test reminder for patients and evaluators to experience push/toast
  const handleTriggerTestReminder = () => {
    // 1. Play gentle harmonic chime if enabled
    if (notificationSettings.soundEnabled) {
      playGentleChime();
    }

    // 2. Browser push notification if enabled
    if (notificationSettings.pushEnabled) {
      showBrowserPush('⏰ Rehabilitation Task Reminder', {
        body: `Time for Seated Knee Extension (3 sets × 10 reps). Prescribed by Dr. Priya Raman.`,
      });
    }

    // 3. Spoken voice announcement if enabled
    if (notificationSettings.voiceReadout) {
      const speech =
        language === 'ta'
          ? 'நினைவூட்டல்: உங்கள் நாற்காலி முழங்கால் நீட்சி உடற்பயிற்சியை தொடங்கவும்.'
          : language === 'hi'
          ? 'याद दिलाना: अपना घुटना सीधा करने का व्यायाम शुरू करें।'
          : 'Reminder: Time to begin your Seated Knee Extension rehabilitation exercise.';
      speakText(speech, language);
    }

    // 4. Inject active test notification into toast stack
    const testNotif: TaskNotification = {
      id: `test-notif-${Date.now()}`,
      taskId: 'task-test-now',
      exerciseName: 'Seated Knee Extension',
      slotName: 'Evening Session',
      scheduledTime: 'Now (07:30 PM)',
      title: '⚡ Task Due Now: Seated Knee Extension',
      body: 'Doctor prescribed 3 sets × 10 reps. Execute in pain-free 0°-90° range.',
      type: 'due_now',
      createdAt: 'Just Now',
      timestamp: Date.now(),
      dosage: '3 sets × 10 reps',
      dismissed: false,
    };

    setNotifications((prev) => [testNotif, ...prev.filter((n) => n.id !== testNotif.id)]);
  };

  const dueCount = notifications.filter((n) => n.type === 'due_now' || n.type === 'missed').length;

  const navItems = [
    {
      id: 'home' as const,
      labelEn: 'HOME',
      labelTa: 'முகப்பு',
      labelHi: 'होम',
      icon: Home,
    },
    {
      id: 'plan' as const,
      labelEn: 'MY PLAN',
      labelTa: 'என் திட்டம்',
      labelHi: 'योजना',
      icon: Calendar,
    },
    {
      id: 'library' as const,
      labelEn: 'EXERCISE LIBRARY',
      labelTa: 'உடற்பயிற்சி கூடம்',
      labelHi: 'व्यायाम लाइब्रेरी',
      icon: Video,
    },
    {
      id: 'visual_guide' as const,
      labelEn: 'VISUAL GUIDE',
      labelTa: 'காட்சி வழிகாட்டி',
      labelHi: 'दृश्य गाइड',
      icon: Eye,
    },
    {
      id: 'progress' as const,
      labelEn: 'PROGRESS',
      labelTa: 'முன்னேற்றம்',
      labelHi: 'प्रगति',
      icon: TrendingUp,
    },
    {
      id: 'help' as const,
      labelEn: 'HELP',
      labelTa: 'உதவி',
      labelHi: 'सहायता',
      icon: HelpCircle,
    },
  ];

  const getNavLabel = (item: typeof navItems[0]) => {
    if (language === 'ta') return item.labelTa;
    if (language === 'hi') return item.labelHi;
    return item.labelEn;
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7] pb-24 md:pb-12">
      {/* Desktop Top Sub-nav */}
      <div className="hidden md:block border-b border-[#E8E4D8] bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-2 py-2.5">
          <div className="flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs tracking-wider transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#C99A3A] text-white shadow-2xs'
                      : 'text-[#5F5B52] hover:bg-[#F7F4EC] hover:text-[#252525]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{getNavLabel(item)}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Action Triggers: Streak, Voice Log & Notification Bell */}
          <div className="flex items-center gap-2">
            <DailyStreakBadge
              streakData={streakData}
              onClick={() => setIsStreakModalOpen(true)}
              compact={true}
            />

            <button
              type="button"
              onClick={() => setIsVoiceModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E6C978] bg-[#FCF9F2] hover:bg-[#F7F1E1] text-[#8E681C] text-xs font-bold transition-all cursor-pointer shadow-2xs"
              title="Log completed exercises using voice commands"
            >
              <Mic className="w-3.5 h-3.5 text-[#B8892D]" />
              <span>Voice Log</span>
            </button>

            <button
              type="button"
              onClick={() => setIsNotificationCenterOpen(true)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-2xs ${
                dueCount > 0
                  ? 'bg-[#FEF3C7] border-[#FDE68A] text-[#92400E] ring-2 ring-[#FDE68A]/60'
                  : 'bg-[#FAFAF7] border-[#E8E4D8] text-[#5F5B52] hover:bg-[#F7F1E1] hover:text-[#252525]'
              }`}
              title="Open Reminders & Push Notification Center"
            >
              <div className="relative">
                {dueCount > 0 ? (
                  <BellRing className="w-4 h-4 animate-bounce text-[#B45309]" />
                ) : (
                  <Bell className="w-4 h-4 text-[#8E681C]" />
                )}
                {dueCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#DC2626] animate-ping" />
                )}
              </div>
              <span>
                {dueCount > 0
                  ? `${dueCount} Task${dueCount > 1 ? 's' : ''} Due`
                  : 'Reminders'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Floating Persistent Toast Notification Stack */}
      <PatientNotificationToast
        notifications={notifications}
        onDismiss={handleDismissNotification}
        onSnooze={handleSnoozeNotification}
        onStartExercise={(exerciseName) => {
          const match =
            activePlan.exercises.find((e) => e.exerciseName === exerciseName) ||
            activePlan.exercises[0];
          setPlayerExercise(match);
        }}
        onOpenVisualGuide={(exerciseName) => {
          setVisualGuideExerciseName(exerciseName);
        }}
        onOpenSettings={() => setIsNotificationCenterOpen(true)}
      />

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-5 sm:pt-7 space-y-5">
        {/* Persistent Task Notification & Alert Bar */}
        <PersistentNotificationBar
          notifications={notifications}
          onStartExercise={(exerciseName) => {
            const match =
              activePlan.exercises.find((e) => e.exerciseName === exerciseName) ||
              activePlan.exercises[0];
            setPlayerExercise(match);
          }}
          onOpenVisualGuide={(exerciseName) => {
            setVisualGuideExerciseName(exerciseName);
          }}
          onOpenNotificationCenter={() => setIsNotificationCenterOpen(true)}
          onDismiss={handleDismissNotification}
          onSnooze={handleSnoozeNotification}
          onTriggerTestReminder={handleTriggerTestReminder}
        />

        {/* 1-Tap Browser-Based Voice Command Quick Bar */}
        <VoiceCommandQuickBar
          onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
        />

        {/* Visual Progress Dashboard with Circular Progress Ring & Daily Streak */}
        <DailyTaskProgressDashboard
          onStartExercise={(exerciseName) => {
            const match =
              activePlan.exercises.find((e) => e.exerciseName === exerciseName) ||
              activePlan.exercises[0];
            setPlayerExercise(match);
          }}
          onOpenVisualGuide={(exerciseName) => {
            setVisualGuideExerciseName(exerciseName);
          }}
          onNavigateToTab={(tab) => setActiveTab(tab)}
          onOpenNotificationCenter={() => setIsNotificationCenterOpen(true)}
          onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
          streakData={streakData}
          onOpenStreakModal={() => setIsStreakModalOpen(true)}
        />

        {activeTab === 'home' && (
          <PatientHome
            onNavigateToPlan={() => setActiveTab('plan')}
            onNavigateToVisualGuide={() => setActiveTab('visual_guide')}
            onNavigateToLibrary={() => setActiveTab('library')}
          />
        )}
        {activeTab === 'plan' && (
          <PatientMyPlan onNavigateToVisualGuide={() => setActiveTab('visual_guide')} />
        )}
        {activeTab === 'library' && (
          <PatientExerciseLibrary
            onStartExercise={(exerciseName) => {
              const match =
                activePlan.exercises.find((e) => e.exerciseName === exerciseName) || {
                  id: `lib-${Date.now()}`,
                  exerciseId: `ex-${Date.now()}`,
                  exerciseName,
                  frequency: 'Twice daily',
                  sets: 3,
                  reps: 10,
                  holdTimeSec: 3,
                  restTimeSec: 15,
                  patientInstructionEn: 'Execute smoothly with 3-second hold in pain-free range.',
                  patientInstructionTa: 'வலியில்லாத வரம்பில் 3 வினாடிகள் நிதானமாக பிடித்து செய்யவும்.',
                  patientInstructionHi: 'दर्द-मुक्त सीमा में 3 सेकंड रोकते हुए शांत गति से करें।',
                  audioScriptEn: `Begin ${exerciseName}. Perform 3 sets of 10 repetitions with a 3-second hold.`,
                  audioScriptTa: `${exerciseName} உடற்பயிற்சியை தொடங்கவும். 3 வினாடிகள் பிடித்து செய்யவும்.`,
                  audioScriptHi: `${exerciseName} व्यायाम शुरू करें। 3 सेकंड रोकते हुए करें।`,
                  completedToday: false,
                  completedCount: 0,
                  scheduledTime: 'Anytime',
                  slotName: 'Exercise Library Session',
                  professionalInstruction: 'Targeted biomechanical exercise from clinical protocol library.',
                  timeSlot: 'Flexible',
                  repetitions: '3 sets × 10 reps',
                  timeCategory: 'morning' as const,
                };
              setPlayerExercise(match);
            }}
            onNavigateToPlan={() => setActiveTab('plan')}
          />
        )}
        {activeTab === 'visual_guide' && (
          <VisualGuideView onStartExercise={() => setActiveTab('home')} />
        )}
        {activeTab === 'progress' && <PatientProgress />}
        {activeTab === 'help' && <PatientHelp />}
      </main>

      {/* Exercise Runner Modal */}
      {playerExercise && (
        <ExercisePlayerModal
          exercise={playerExercise}
          onClose={() => setPlayerExercise(null)}
        />
      )}

      {/* Visual Guide Modal */}
      {visualGuideExerciseName && (
        <VisualGuideModal
          isOpen={Boolean(visualGuideExerciseName)}
          onClose={() => setVisualGuideExerciseName(null)}
          initialExerciseName={visualGuideExerciseName}
          onStartExercise={(exerciseName) => {
            setVisualGuideExerciseName(null);
            const match =
              activePlan.exercises.find((e) => e.exerciseName === exerciseName) ||
              activePlan.exercises[0];
            setPlayerExercise(match);
          }}
        />
      )}

      {/* Notification Center & Push Preferences Modal */}
      <NotificationCenterModal
        isOpen={isNotificationCenterOpen}
        onClose={() => setIsNotificationCenterOpen(false)}
        notifications={notifications}
        settings={notificationSettings}
        onUpdateSettings={handleUpdateSettings}
        onStartExercise={(exerciseName) => {
          setIsNotificationCenterOpen(false);
          const match =
            activePlan.exercises.find((e) => e.exerciseName === exerciseName) ||
            activePlan.exercises[0];
          setPlayerExercise(match);
        }}
        onOpenVisualGuide={(exerciseName) => {
          setIsNotificationCenterOpen(false);
          setVisualGuideExerciseName(exerciseName);
        }}
        onTriggerTestReminder={handleTriggerTestReminder}
      />

      {/* Voice Task Logger Modal */}
      <VoiceTaskLoggerModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
      />

      {/* Streak Reward & Milestone Modal */}
      <StreakRewardModal
        isOpen={isStreakModalOpen}
        onClose={() => setIsStreakModalOpen(false)}
        streakData={streakData}
        onUpdateStreak={setStreakData}
      />

      {/* Mobile Floating Action Buttons (Streak, Voice & Reminders) */}
      <div className="md:hidden fixed bottom-20 right-3 z-40 flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => setIsStreakModalOpen(true)}
          className={`flex items-center gap-1 px-2.5 py-2 rounded-full shadow-lg border cursor-pointer transition-all active:scale-95 ${
            streakData.todayCompleted
              ? 'bg-[#FEF3C7] border-[#FDE68A] text-[#92400E]'
              : 'bg-white border-[#E6C978] text-[#8E681C]'
          }`}
          title="Daily Streak"
        >
          <Flame className={`w-4 h-4 fill-current ${streakData.todayCompleted ? 'text-[#EA580C] animate-pulse' : 'text-[#D97706]'}`} />
          <span className="text-xs font-black">{streakData.currentStreak}d</span>
        </button>

        <button
          type="button"
          onClick={() => setIsVoiceModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-full shadow-lg border border-[#E6C978] bg-[#FCF9F2] text-[#8E681C] cursor-pointer transition-all active:scale-95"
          title="Log by Voice"
        >
          <Mic className="w-4 h-4 text-[#B8892D]" />
          <span className="text-xs font-bold">Voice</span>
        </button>

        <button
          type="button"
          onClick={() => setIsNotificationCenterOpen(true)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-full shadow-lg border cursor-pointer transition-all active:scale-95 ${
            dueCount > 0
              ? 'bg-[#FEF3C7] border-[#FDE68A] text-[#92400E] animate-bounce'
              : 'bg-white border-[#E8E4D8] text-[#8E681C]'
          }`}
          title="Open Reminders"
        >
          <Bell className="w-4 h-4 text-[#B8892D]" />
          <span className="text-xs font-bold">
            {dueCount > 0 ? `${dueCount} Due` : 'Alerts'}
          </span>
        </button>
      </div>

      {/* Mobile Bottom Navigation (Persistent, Touch friendly) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E8E4D8] shadow-lg px-1 py-1.5">
        <div className="grid grid-cols-6 gap-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center py-1 px-0.5 rounded-xl transition-all cursor-pointer ${
                  isActive
                    ? 'text-[#B8892D] bg-[#FCF9F2] font-bold'
                    : 'text-[#77736A] hover:text-[#252525]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'stroke-[2.5]' : ''}`} />
                <span className="text-[8px] tracking-tight mt-0.5 font-semibold truncate max-w-full">
                  {getNavLabel(item)}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
