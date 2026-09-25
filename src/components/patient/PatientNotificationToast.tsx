import React from 'react';
import { useApp } from '../../context/AppContext';
import { TaskNotification } from '../../types';
import {
  Bell,
  Clock,
  AlertTriangle,
  Play,
  Eye,
  Volume2,
  VolumeX,
  X,
  RotateCcw,
  Sparkles,
  CheckCircle,
} from 'lucide-react';

interface PatientNotificationToastProps {
  notifications: TaskNotification[];
  onDismiss: (id: string) => void;
  onSnooze: (taskId: string) => void;
  onStartExercise: (exerciseName: string) => void;
  onOpenVisualGuide: (exerciseName: string) => void;
  onOpenSettings: () => void;
}

export const PatientNotificationToast: React.FC<PatientNotificationToastProps> = ({
  notifications,
  onDismiss,
  onSnooze,
  onStartExercise,
  onOpenVisualGuide,
  onOpenSettings,
}) => {
  const { language, speakText, stopSpeaking, isSpeaking } = useApp();

  // If no active notifications, do not render floating toast stack
  if (!notifications || notifications.length === 0) return null;

  // Show up to 2 most pressing notifications at a time to prevent screen clutter
  const visibleNotifications = notifications.slice(0, 2);

  const handleSpeak = (notif: TaskNotification) => {
    if (isSpeaking) {
      stopSpeaking();
      return;
    }

    let speech = '';
    if (language === 'ta') {
      speech = `நினைவூட்டல்: ${notif.exerciseName}. நேரம்: ${notif.scheduledTime}. மருத்துவர் பரிந்துரைத்த அளவு: ${notif.dosage}. இப்போது தொடங்கவும்.`;
    } else if (language === 'hi') {
      speech = `याद दिलाना: ${notif.exerciseName} का समय हो गया है। समय: ${notif.scheduledTime}। निर्धारित मात्रा: ${notif.dosage}।`;
    } else {
      speech = `Rehabilitation Reminder: ${notif.exerciseName} is scheduled for ${notif.scheduledTime}. Prescribed dosage: ${notif.dosage}. Tap to start now.`;
    }

    speakText(speech, language);
  };

  return (
    <aside
      aria-label="Rehabilitation Task Reminders"
      className="fixed top-20 right-4 z-40 max-w-sm sm:max-w-md w-full pointer-events-none flex flex-col gap-3"
    >
      {visibleNotifications.map((notif) => {
        const isDue = notif.type === 'due_now';
        const isMissed = notif.type === 'missed';

        const borderStyle = isDue
          ? 'border-[#C99A3A] ring-2 ring-[#C99A3A]/30 bg-white'
          : isMissed
          ? 'border-[#DC2626] ring-2 ring-[#DC2626]/20 bg-white'
          : 'border-[#E8E4D8] bg-white';

        const iconBg = isDue
          ? 'bg-[#FCF9F2] text-[#B8892D] border border-[#E6C978]'
          : isMissed
          ? 'bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]'
          : 'bg-[#FAFAF7] text-[#8E681C] border border-[#E8E4D8]';

        return (
          <div
            key={notif.id}
            role="alert"
            className={`pointer-events-auto rounded-2xl border p-4 shadow-xl backdrop-blur-xs transition-all animate-in slide-in-from-top-3 fade-in duration-300 ${borderStyle}`}
          >
            {/* Top Bar: Icon, Tag & Dismiss */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${iconBg}`}>
                  {isDue ? (
                    <Bell className="w-4 h-4 animate-bounce" />
                  ) : isMissed ? (
                    <AlertTriangle className="w-4 h-4" />
                  ) : (
                    <Clock className="w-4 h-4" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                        isDue
                          ? 'bg-[#FCF9F2] text-[#8E681C] border-[#E6C978]'
                          : isMissed
                          ? 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]'
                          : 'bg-[#FAFAF7] text-[#5F5B52] border-[#E8E4D8]'
                      }`}
                    >
                      {isDue ? '⚡ Due Right Now' : isMissed ? '⚠️ Catch-Up Due' : '⏰ Scheduled'}
                    </span>
                    <span className="text-[11px] font-mono font-bold text-[#77736A]">
                      {notif.scheduledTime}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-[#252525] mt-0.5 leading-snug line-clamp-1">
                    {notif.exerciseName}
                  </h3>
                </div>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => onDismiss(notif.id)}
                className="p-1 text-[#77736A] hover:text-[#252525] hover:bg-[#F7F4EC] rounded-lg cursor-pointer transition-colors"
                title="Dismiss reminder"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Subtext description & dosage */}
            <div className="mt-2 text-xs text-[#5F5B52] leading-relaxed">
              <span className="font-semibold text-[#252525]">Prescribed:</span> {notif.dosage} · {notif.slotName}
            </div>

            {/* Action Bar */}
            <div className="mt-3 pt-2.5 border-t border-[#E8E4D8] flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => onStartExercise(notif.exerciseName)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#C99A3A] hover:bg-[#B8892D] text-white text-xs font-bold shadow-2xs cursor-pointer transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Start Now</span>
                </button>

                <button
                  type="button"
                  onClick={() => onOpenVisualGuide(notif.exerciseName)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#FCF9F2] hover:bg-[#F7F1E1] border border-[#E6C978] text-[#8E681C] text-xs font-semibold cursor-pointer transition-colors shadow-2xs"
                  title="Check biomechanical movement form"
                >
                  <Eye className="w-3.5 h-3.5 text-[#B8892D]" />
                  <span>Guide</span>
                </button>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleSpeak(notif)}
                  className={`p-1.5 rounded-lg border text-xs cursor-pointer transition-all ${
                    isSpeaking
                      ? 'bg-[#DC2626] text-white border-[#DC2626] animate-pulse'
                      : 'bg-white border-[#E8E4D8] text-[#8E681C] hover:bg-[#FCF9F2]'
                  }`}
                  title="Listen in your language"
                >
                  {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>

                <button
                  type="button"
                  onClick={() => onSnooze(notif.taskId)}
                  className="px-2 py-1 rounded-lg text-[11px] font-semibold text-[#77736A] hover:text-[#252525] hover:bg-[#FAFAF7] cursor-pointer"
                  title="Snooze for 10 minutes"
                >
                  Snooze 10m
                </button>
              </div>
            </div>
          </div>
        );
      })}

      {/* Overflow count hint */}
      {notifications.length > 2 && (
        <div className="pointer-events-auto bg-[#252525]/80 backdrop-blur-md text-white text-[11px] font-semibold py-1.5 px-3 rounded-full text-center shadow-md flex items-center justify-center gap-1.5 self-end">
          <Bell className="w-3 h-3 text-[#E6C978]" />
          <span>+{notifications.length - 2} more reminders</span>
          <button
            type="button"
            onClick={onOpenSettings}
            className="underline ml-1 text-[#E6C978] cursor-pointer hover:text-white"
          >
            View All
          </button>
        </div>
      )}
    </aside>
  );
};
