import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { TaskNotification, NotificationSettings } from '../../types';
import {
  isPushSupported,
  getPushPermissionState,
  requestPushPermission,
  showBrowserPush,
  playGentleChime,
  clearAllDismissed,
} from '../../services/notificationService';
import { VisualBadge } from '../common/VisualBadges';
import {
  Bell,
  BellRing,
  Volume2,
  VolumeX,
  X,
  CheckCircle,
  AlertTriangle,
  Clock,
  Play,
  Eye,
  Sliders,
  Sparkles,
  ShieldCheck,
  Send,
  RotateCcw,
  Check,
} from 'lucide-react';

interface NotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: TaskNotification[];
  settings: NotificationSettings;
  onUpdateSettings: (newSettings: NotificationSettings) => void;
  onStartExercise: (exerciseName: string) => void;
  onOpenVisualGuide: (exerciseName: string) => void;
  onTriggerTestReminder: () => void;
}

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({
  isOpen,
  onClose,
  notifications,
  settings,
  onUpdateSettings,
  onStartExercise,
  onOpenVisualGuide,
  onTriggerTestReminder,
}) => {
  const { currentPatient, dailyTasks, language, speakText, isSpeaking, stopSpeaking } = useApp();
  const [permissionState, setPermissionState] = useState<string>('default');
  const [testSentFeedback, setTestSentFeedback] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setPermissionState(getPushPermissionState());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleEnablePush = async () => {
    const res = await requestPushPermission();
    setPermissionState(res);
    if (res === 'granted') {
      onUpdateSettings({ ...settings, pushEnabled: true });
      showBrowserPush('🔔 RehabMitra Push Notifications Enabled', {
        body: `You will now receive timely reminders for ${currentPatient.name}'s daily rehabilitation exercises.`,
      });
      playGentleChime();
    }
  };

  const handleTestNotification = () => {
    onTriggerTestReminder();
    setTestSentFeedback(true);
    setTimeout(() => setTestSentFeedback(false), 3000);
  };

  const handleResetDismissed = () => {
    clearAllDismissed();
    onTriggerTestReminder();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white border border-[#E8E4D8] rounded-3xl shadow-2xl p-5 sm:p-8 space-y-6 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#77736A] hover:text-[#252525] rounded-full hover:bg-[#F7F4EC] cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start gap-3.5 pr-8">
          <div className="w-12 h-12 rounded-2xl bg-[#FCF9F2] text-[#B8892D] border border-[#E6C978] flex items-center justify-center shrink-0 shadow-2xs">
            <BellRing className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8E681C] bg-[#FCF9F2] px-2.5 py-0.5 rounded-full border border-[#E6C978]">
                Rehabilitation Task Reminders
              </span>
              <VisualBadge type="patient_completed" customText="PUSH & TOAST SYSTEM" size="sm" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#252525]">
              Notification Center & Reminders
            </h2>
            <p className="text-xs text-[#5F5B52] mt-0.5 leading-relaxed">
              Timely reminders for {currentPatient.name}'s doctor-prescribed exercises with native push notifications, gentle harmonic chimes, and multilingual audio prompts.
            </p>
          </div>
        </div>

        {/* Push Notification Permission Card */}
        <div className="p-4 sm:p-5 rounded-2xl border bg-[#FCF9F2]/70 border-[#E6C978] space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white border border-[#D8B15A] text-[#8E681C] flex items-center justify-center shrink-0">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#252525] flex items-center gap-1.5">
                  <span>Browser Push Notifications</span>
                  {permissionState === 'granted' ? (
                    <span className="text-[10px] font-bold text-[#15803D] bg-[#F0FDF4] px-2 py-0.5 rounded-md border border-[#BBF7D0]">
                      ✓ Enabled
                    </span>
                  ) : permissionState === 'denied' ? (
                    <span className="text-[10px] font-bold text-[#DC2626] bg-[#FEF2F2] px-2 py-0.5 rounded-md border border-[#FECACA]">
                      Blocked in Browser
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-[#8E681C] bg-white px-2 py-0.5 rounded-md border border-[#E6C978]">
                      Ready to Enable
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-[#5F5B52] mt-0.5">
                  Receive notifications on your device even when you navigate to other browser tabs.
                </div>
              </div>
            </div>

            {/* Permission Action Button */}
            {permissionState !== 'granted' && (
              <button
                type="button"
                onClick={handleEnablePush}
                className="px-4 py-2 rounded-xl bg-[#C99A3A] hover:bg-[#B8892D] text-white text-xs font-bold shadow-xs cursor-pointer shrink-0 transition-all"
              >
                Enable Push Alerts
              </button>
            )}
          </div>

          {/* Test Push Button */}
          <div className="pt-2 border-t border-[#E6C978]/60 flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="text-[#77736A] text-[11px]">
              Verify notification delivery and gentle harmonic chime right now:
            </span>
            <button
              type="button"
              onClick={handleTestNotification}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-2xs ${
                testSentFeedback
                  ? 'bg-[#F0FDF4] text-[#15803D] border-[#BBF7D0]'
                  : 'bg-white text-[#8E681C] border-[#D8B15A] hover:bg-[#FCF9F2]'
              }`}
            >
              {testSentFeedback ? <Check className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />}
              <span>{testSentFeedback ? 'Reminder Sent!' : 'Trigger Test Reminder'}</span>
            </button>
          </div>
        </div>

        {/* Preferences & Toggles */}
        <div className="p-4 bg-[#FAFAF7] rounded-2xl border border-[#E8E4D8] space-y-3 text-xs">
          <div className="font-bold text-[#252525] uppercase tracking-wider text-[11px]">
            Reminder Delivery Preferences:
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Harmonic Chime Toggle */}
            <label className="flex items-center justify-between p-3 bg-white rounded-xl border border-[#E8E4D8] cursor-pointer hover:border-[#D8B15A]">
              <div>
                <span className="font-bold text-[#252525] block">Audible Harmonic Chime</span>
                <span className="text-[11px] text-[#77736A]">Calming sound when a task is due</span>
              </div>
              <input
                type="checkbox"
                checked={settings.soundEnabled}
                onChange={(e) => onUpdateSettings({ ...settings, soundEnabled: e.target.checked })}
                className="w-4 h-4 accent-[#C99A3A] cursor-pointer"
              />
            </label>

            {/* Spoken Voice Readout */}
            <label className="flex items-center justify-between p-3 bg-white rounded-xl border border-[#E8E4D8] cursor-pointer hover:border-[#D8B15A]">
              <div>
                <span className="font-bold text-[#252525] block">Spoken Voice Prompt</span>
                <span className="text-[11px] text-[#77736A]">
                  Read aloud in {language === 'ta' ? 'தமிழ்' : language === 'hi' ? 'हिंदी' : 'English'}
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.voiceReadout}
                onChange={(e) => onUpdateSettings({ ...settings, voiceReadout: e.target.checked })}
                className="w-4 h-4 accent-[#C99A3A] cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Today's Tasks Reminders List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#252525] uppercase tracking-wider">
              Today's Scheduled Exercise Reminders ({dailyTasks.length})
            </span>
            <button
              type="button"
              onClick={handleResetDismissed}
              className="text-[11px] text-[#8E681C] hover:underline cursor-pointer flex items-center gap-1 font-semibold"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Dismissed Alerts</span>
            </button>
          </div>

          <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
            {dailyTasks.map((task) => {
              const isDue = task.status === 'due_now';
              const isCompleted = task.status === 'completed';
              const isMissed = task.status === 'missed';

              return (
                <div
                  key={task.id}
                  className={`p-3.5 rounded-2xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
                    isCompleted
                      ? 'bg-[#F0FDF4]/70 border-[#BBF7D0]'
                      : isDue
                      ? 'bg-[#FEF3C7]/60 border-[#FDE68A] ring-1 ring-[#FDE68A]'
                      : isMissed
                      ? 'bg-[#FEF2F2] border-[#FECACA]'
                      : 'bg-white border-[#E8E4D8]'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold text-[#8E681C]">
                        {task.scheduledTime}
                      </span>
                      <span
                        className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                          isCompleted
                            ? 'bg-[#F0FDF4] text-[#15803D] border-[#BBF7D0]'
                            : isDue
                            ? 'bg-[#FEF3C7] text-[#B45309] border-[#FDE68A]'
                            : isMissed
                            ? 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]'
                            : 'bg-[#FAFAF7] text-[#5F5B52] border-[#E8E4D8]'
                        }`}
                      >
                        {isCompleted
                          ? '✓ Verified Complete'
                          : isDue
                          ? '⚡ Due Now'
                          : isMissed
                          ? '⚠️ Missed'
                          : 'Upcoming'}
                      </span>
                    </div>

                    <div className="font-bold text-[#252525] text-sm">
                      {task.exerciseName}
                    </div>

                    <div className="text-[11px] text-[#5F5B52]">
                      {task.slotName} · {task.repetitions}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenVisualGuide(task.exerciseName);
                      }}
                      className="px-2.5 py-1.5 rounded-xl bg-white border border-[#E8E4D8] hover:border-[#D8B15A] text-[#8E681C] text-xs font-semibold cursor-pointer flex items-center gap-1 shadow-2xs"
                      title="View visual posture guide"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#B8892D]" />
                      <span>Guide</span>
                    </button>

                    {!isCompleted ? (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onStartExercise(task.exerciseName);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-[#C99A3A] hover:bg-[#B8892D] text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Start</span>
                      </button>
                    ) : (
                      <span className="text-[11px] font-bold text-[#15803D] bg-white px-2.5 py-1 rounded-lg border border-[#BBF7D0]">
                        Completed ✓
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-[#E8E4D8] flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-[#77736A]">
            <ShieldCheck className="w-4 h-4 text-[#B8892D]" />
            <span>Prescription dosages preserved exactly as written.</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-2xl bg-[#FAFAF7] hover:bg-[#F7F4EC] border border-[#E8E4D8] text-xs font-bold text-[#5F5B52] cursor-pointer"
          >
            Close Notification Center
          </button>
        </div>
      </div>
    </div>
  );
};
