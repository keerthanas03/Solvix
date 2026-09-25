import React from 'react';
import { useApp } from '../../context/AppContext';
import { TaskNotification } from '../../types';
import {
  Bell,
  BellRing,
  Clock,
  AlertTriangle,
  Play,
  Eye,
  Volume2,
  VolumeX,
  CheckCircle,
  Sliders,
  Send,
  X,
} from 'lucide-react';

interface PersistentNotificationBarProps {
  notifications: TaskNotification[];
  onStartExercise: (exerciseName: string) => void;
  onOpenVisualGuide: (exerciseName: string) => void;
  onOpenNotificationCenter: () => void;
  onDismiss: (id: string) => void;
  onSnooze: (taskId: string) => void;
  onTriggerTestReminder: () => void;
}

export const PersistentNotificationBar: React.FC<PersistentNotificationBarProps> = ({
  notifications,
  onStartExercise,
  onOpenVisualGuide,
  onOpenNotificationCenter,
  onDismiss,
  onSnooze,
  onTriggerTestReminder,
}) => {
  const { currentPatient, dailyTasks, language, speakText, stopSpeaking, isSpeaking } = useApp();

  const primaryAlert = notifications[0];
  const totalTasks = dailyTasks.length;
  const completedTasks = dailyTasks.filter((t) => t.status === 'completed');
  const isAllComplete = totalTasks > 0 && completedTasks.length === totalTasks;

  const handleSpeak = (notif: TaskNotification) => {
    if (isSpeaking) {
      stopSpeaking();
      return;
    }

    let speech = '';
    if (language === 'ta') {
      speech = `நினைவூட்டல்: ${notif.exerciseName}. நேரம்: ${notif.scheduledTime}. பரிந்துரைக்கப்பட்ட அளவு: ${notif.dosage}. இப்போது தொடங்கவும்.`;
    } else if (language === 'hi') {
      speech = `याद दिलाना: ${notif.exerciseName} का समय हो गया है। समय: ${notif.scheduledTime}।`;
    } else {
      speech = `Scheduled Task Reminder: ${notif.exerciseName} is scheduled for ${notif.scheduledTime}. Doctor prescribed ${notif.dosage}.`;
    }

    speakText(speech, language);
  };

  // If there's an active due or missed notification
  if (primaryAlert) {
    const isDue = primaryAlert.type === 'due_now';
    const isMissed = primaryAlert.type === 'missed';

    const barBg = isDue
      ? 'bg-[#FEF3C7]/90 border-[#FDE68A] text-[#92400E]'
      : isMissed
      ? 'bg-[#FEF2F2] border-[#FECACA] text-[#991B1B]'
      : 'bg-[#FCF9F2] border-[#E6C978] text-[#8E681C]';

    return (
      <div
        role="region"
        aria-label="Rehabilitation Reminder Banner"
        className={`w-full rounded-2xl border p-3.5 sm:p-4 shadow-xs transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 ${barBg}`}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white border border-[#E6C978] text-[#B8892D] flex items-center justify-center shrink-0 shadow-2xs">
            {isDue ? (
              <BellRing className="w-4 h-4 animate-bounce text-[#B8892D]" />
            ) : isMissed ? (
              <AlertTriangle className="w-4 h-4 text-[#DC2626]" />
            ) : (
              <Clock className="w-4 h-4 text-[#8E681C]" />
            )}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider bg-white px-2 py-0.5 rounded-md border border-[#E6C978] text-[#8E681C]">
                {isDue ? '⚡ TASK DUE NOW' : isMissed ? '⚠️ CATCH UP REMINDER' : '⏰ SCHEDULED SESSION'}
              </span>
              <span className="text-xs font-bold text-[#252525]">
                {primaryAlert.scheduledTime} · {primaryAlert.exerciseName}
              </span>
              <span className="text-[11px] text-[#5F5B52] hidden sm:inline">
                ({primaryAlert.dosage})
              </span>
            </div>
            <div className="text-xs text-[#5F5B52] mt-0.5 leading-snug">
              Doctor-prescribed rehabilitation task for {currentPatient.name}. Please execute within safe pain-free range.
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto shrink-0">
          <button
            type="button"
            onClick={() => onStartExercise(primaryAlert.exerciseName)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#C99A3A] hover:bg-[#B8892D] text-white text-xs font-bold shadow-xs cursor-pointer transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Start Now</span>
          </button>

          <button
            type="button"
            onClick={() => onOpenVisualGuide(primaryAlert.exerciseName)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white hover:bg-[#F7F1E1] border border-[#E6C978] text-[#8E681C] text-xs font-semibold cursor-pointer shadow-2xs"
            title="Open visual biomechanics guide"
          >
            <Eye className="w-3.5 h-3.5 text-[#B8892D]" />
            <span>Guide</span>
          </button>

          <button
            type="button"
            onClick={() => handleSpeak(primaryAlert)}
            className={`p-2 rounded-xl border text-xs cursor-pointer transition-all ${
              isSpeaking
                ? 'bg-[#DC2626] text-white border-[#DC2626] animate-pulse'
                : 'bg-white border-[#E8E4D8] text-[#8E681C] hover:bg-[#FCF9F2]'
            }`}
            title="Read reminder aloud"
          >
            {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>

          <button
            type="button"
            onClick={onOpenNotificationCenter}
            className="p-2 rounded-xl bg-white border border-[#E8E4D8] text-[#5F5B52] hover:text-[#252525] hover:border-[#D8B15A] text-xs cursor-pointer shadow-2xs"
            title="Notification Center & Push Settings"
          >
            <Sliders className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => onSnooze(primaryAlert.taskId)}
            className="px-2.5 py-1.5 rounded-xl text-[11px] font-semibold text-[#5F5B52] hover:bg-black/5 cursor-pointer"
            title="Snooze for 10 minutes"
          >
            Snooze
          </button>

          <button
            type="button"
            onClick={() => onDismiss(primaryAlert.id)}
            className="p-1.5 text-[#77736A] hover:text-[#252525] rounded-lg cursor-pointer"
            title="Dismiss reminder banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // If all completed today, display positive reinforcement bar with quick test button
  if (isAllComplete) {
    return (
      <div className="w-full rounded-2xl border border-[#BBF7D0] bg-[#F0FDF4] p-3 sm:p-4 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs text-[#15803D]">
        <div className="flex items-center gap-2.5 font-medium">
          <CheckCircle className="w-4 h-4 text-[#15803D] shrink-0" />
          <span>
            <strong>All daily rehabilitation tasks verified!</strong> Great job adhering to Dr. Priya Raman's regimen. Next session tomorrow morning at 06:45 AM.
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={onTriggerTestReminder}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-[#BBF7D0] text-[#15803D] text-[11px] font-bold hover:bg-[#DCFCE7] cursor-pointer shadow-2xs"
            title="Simulate push notification test"
          >
            <Send className="w-3 h-3" />
            <span>Test Reminder</span>
          </button>

          <button
            type="button"
            onClick={onOpenNotificationCenter}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-[#BBF7D0] text-[#15803D] text-[11px] font-bold hover:bg-[#DCFCE7] cursor-pointer shadow-2xs"
          >
            <Bell className="w-3 h-3" />
            <span>Reminders</span>
          </button>
        </div>
      </div>
    );
  }

  // Default quiet state: subtle reminder status pill
  return (
    <div className="w-full rounded-2xl border border-[#E8E4D8] bg-[#FAFAF7] px-4 py-2.5 text-xs flex items-center justify-between gap-3 text-[#5F5B52]">
      <div className="flex items-center gap-2">
        <Bell className="w-3.5 h-3.5 text-[#B8892D]" />
        <span>
          Rehab task reminders active for <strong>{currentPatient.name}</strong>. Daily schedule: 06:45 AM & 07:30 PM.
        </span>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={onTriggerTestReminder}
          className="text-[11px] text-[#8E681C] font-semibold hover:underline cursor-pointer flex items-center gap-1"
        >
          <Send className="w-3 h-3" />
          <span className="hidden sm:inline">Send Test Push</span>
        </button>

        <button
          type="button"
          onClick={onOpenNotificationCenter}
          className="px-2.5 py-1 rounded-lg bg-white border border-[#E8E4D8] hover:border-[#D8B15A] text-[#8E681C] text-[11px] font-bold cursor-pointer shadow-2xs"
        >
          Notification Center
        </button>
      </div>
    </div>
  );
};
