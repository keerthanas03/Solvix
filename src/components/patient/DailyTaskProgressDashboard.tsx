import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CircularProgressRing } from './CircularProgressRing';
import { VisualBadge } from '../common/VisualBadges';
import {
  CheckCircle,
  Clock,
  RotateCcw,
  Volume2,
  VolumeX,
  Play,
  Eye,
  ChevronDown,
  ChevronUp,
  Award,
  Sparkles,
  AlertCircle,
  Calendar,
  ShieldCheck,
  Check,
  ArrowRight,
  Bell,
  Mic,
  Flame,
} from 'lucide-react';
import { DailyScheduledTask, DailyStreakData } from '../../types';
import { DailyStreakBadge } from './DailyStreakBadge';

interface DailyTaskProgressDashboardProps {
  onStartExercise?: (exerciseName: string) => void;
  onOpenVisualGuide?: (exerciseName: string) => void;
  onNavigateToTab?: (tab: 'home' | 'plan' | 'visual_guide' | 'progress' | 'help') => void;
  onOpenNotificationCenter?: () => void;
  onOpenVoiceModal?: () => void;
  streakData?: DailyStreakData;
  onOpenStreakModal?: () => void;
}

export const DailyTaskProgressDashboard: React.FC<DailyTaskProgressDashboardProps> = ({
  onStartExercise,
  onOpenVisualGuide,
  onNavigateToTab,
  onOpenNotificationCenter,
  onOpenVoiceModal,
  streakData,
  onOpenStreakModal,
}) => {
  const {
    dailyTasks,
    currentPatient,
    language,
    speakText,
    stopSpeaking,
    isSpeaking,
    setIsPrescriptionUploadModalOpen,
  } = useApp();

  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  // Compute Task Adherence Statistics
  const totalTasks = dailyTasks.length;
  const completedTasks = dailyTasks.filter((t) => t.status === 'completed');
  const dueNowTasks = dailyTasks.filter((t) => t.status === 'due_now');
  const missedTasks = dailyTasks.filter((t) => t.status === 'missed');
  const pendingTasks = dailyTasks.filter((t) => t.status === 'pending');

  const completionPercentage =
    totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;
  const isAllComplete = totalTasks > 0 && completedTasks.length === totalTasks;

  // Identify next upcoming or due task
  const nextActionableTask: DailyScheduledTask | undefined =
    dueNowTasks[0] || missedTasks[0] || pendingTasks[0];

  // Group tasks by period / slotName
  const morningTasks = dailyTasks.filter((t) => t.period === 'morning');
  const eveningTasks = dailyTasks.filter((t) => t.period === 'evening');
  const afternoonTasks = dailyTasks.filter((t) => t.period === 'afternoon');

  const morningCompleted = morningTasks.filter((t) => t.status === 'completed').length;
  const eveningCompleted = eveningTasks.filter((t) => t.status === 'completed').length;

  // Voice Readout for Visually Impaired / Multilingual Patients
  const handleVoiceProgressReadout = () => {
    if (isSpeaking) {
      stopSpeaking();
      return;
    }

    let speechText = '';
    if (language === 'ta') {
      speechText = `வணக்கம் ${currentPatient.name}. இன்று நீங்கள் ${totalTasks} உடற்பயிற்சிகளில் ${completedTasks.length} பயிற்சிகளை முடித்துள்ளீர்கள். முன்னேற்றம் ${completionPercentage} சதவீதம். ${
        nextActionableTask
          ? `அடுத்து நீங்கள் செய்ய வேண்டிய பயிற்சி: ${nextActionableTask.exerciseName}.`
          : 'இன்றைய அனைத்து பயிற்சிகளும் வெற்றிகரமாக முடிவடைந்தன.'
      }`;
    } else if (language === 'hi') {
      speechText = `नमस्ते ${currentPatient.name}. आज आपने ${totalTasks} में से ${completedTasks.length} व्यायाम पूरे कर लिए हैं। आपकी प्रगति ${completionPercentage} प्रतिशत है। ${
        nextActionableTask
          ? `अगला व्यायाम: ${nextActionableTask.exerciseName}.`
          : 'आज के सभी व्यायाम सफलतापूर्वक पूरे हो गए हैं।'
      }`;
    } else {
      speechText = `Hello ${currentPatient.name}. You have completed ${completedTasks.length} of ${totalTasks} scheduled rehabilitation tasks today, which is ${completionPercentage} percent complete. ${
        nextActionableTask
          ? `Next due task is ${nextActionableTask.exerciseName} for ${nextActionableTask.slotName}.`
          : 'All prescribed rehabilitation tasks for today are complete!'
      }`;
    }

    speakText(speechText, language);
  };

  return (
    <section
      aria-label="Daily Rehabilitation Progress Dashboard"
      className="bg-white rounded-3xl border border-[#E8E4D8] p-5 sm:p-7 shadow-xs space-y-5 transition-all"
    >
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E8E4D8]">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#8E681C] bg-[#FCF9F2] px-2.5 py-0.5 rounded-full border border-[#E6C978]">
              {language === 'ta'
                ? 'தினசரி உடற்பயிற்சி முன்னேற்றம்'
                : language === 'hi'
                ? 'दैनिक पुनर्वास प्रगति'
                : 'Daily Task Progress Dashboard'}
            </span>
            <VisualBadge type="patient_completed" customText="LIVE ADHERENCE RING" size="sm" />
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-[#252525]">
            Today's Rehabilitation Completion
          </h2>

          <div className="flex flex-wrap items-center gap-2 text-xs text-[#5F5B52] mt-1">
            <span>Doctor: Dr. Priya Raman</span>
            <span aria-hidden="true" className="text-[#C99A3A]">·</span>
            <span>Right Knee Post-Op Rehab</span>
            <span aria-hidden="true" className="text-[#C99A3A]">·</span>
            <span>{completedTasks.length} of {totalTasks} Tasks Verified</span>
          </div>
        </div>

        {/* Audio Announcement, Reminders & Collapse Toggle Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 flex-wrap">
          {streakData && onOpenStreakModal && (
            <DailyStreakBadge
              streakData={streakData}
              onClick={onOpenStreakModal}
              compact={true}
            />
          )}

          {onOpenVoiceModal && (
            <button
              type="button"
              onClick={onOpenVoiceModal}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-[#FCF9F2] hover:bg-[#F7F1E1] border border-[#E6C978] text-[#8E681C] transition-all cursor-pointer shadow-2xs"
              title="Log completed tasks using speech recognition"
            >
              <Mic className="w-3.5 h-3.5 text-[#B8892D]" />
              <span>Log by Voice</span>
            </button>
          )}

          {onOpenNotificationCenter && (
            <button
              type="button"
              onClick={onOpenNotificationCenter}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-[#FCF9F2] hover:bg-[#F7F1E1] border border-[#E6C978] text-[#8E681C] transition-all cursor-pointer shadow-2xs"
              title="Open Reminders & Push Notification Center"
            >
              <Bell className="w-3.5 h-3.5 text-[#B8892D]" />
              <span>Reminders</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleVoiceProgressReadout}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs ${
              isSpeaking
                ? 'bg-[#DC2626] text-white animate-pulse'
                : 'bg-[#FCF9F2] hover:bg-[#F7F1E1] border border-[#E6C978] text-[#8E681C]'
            }`}
            title="Listen to daily task progress audio summary"
          >
            {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            <span>{isSpeaking ? 'Stop Audio' : 'Listen Progress'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-xl border border-[#E8E4D8] hover:bg-[#FAFAF7] text-[#5F5B52] text-xs font-semibold cursor-pointer"
            title={isExpanded ? 'Collapse dashboard' : 'Expand dashboard'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Visual Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
        {/* Left Column: Circular Progress Ring & Summary (5 cols) */}
        <div className="lg:col-span-5 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 bg-[#FCF9F2]/60 rounded-2xl border border-[#E6C978]/60 p-4 sm:p-5">
          {/* Circular Progress Ring */}
          <div className="relative">
            <CircularProgressRing
              percentage={completionPercentage}
              size={124}
              strokeWidth={11}
              label={`Daily rehabilitation completion: ${completionPercentage}%`}
              sublabel={isAllComplete ? 'Complete' : 'Completed'}
            />
          </div>

          {/* Quick Metrics Next to Ring */}
          <div className="space-y-1.5 text-center sm:text-left">
            <div className="text-xs font-bold uppercase tracking-wider text-[#8E681C]">
              {isAllComplete ? 'Goal Achieved' : 'Daily Routine Status'}
            </div>
            <div className="text-xl sm:text-2xl font-black text-[#252525] tabular-nums">
              {completedTasks.length} <span className="text-sm font-semibold text-[#77736A]">/ {totalTasks} Tasks</span>
            </div>

            {isAllComplete ? (
              <div className="inline-flex items-center gap-1 text-xs font-bold text-[#15803D] bg-[#F0FDF4] px-2.5 py-1 rounded-lg border border-[#BBF7D0]">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>All tasks done today!</span>
              </div>
            ) : dueNowTasks.length > 0 ? (
              <div className="inline-flex items-center gap-1 text-xs font-bold text-[#B45309] bg-[#FEF3C7] px-2.5 py-1 rounded-lg border border-[#FDE68A] animate-pulse">
                <Clock className="w-3.5 h-3.5" />
                <span>{dueNowTasks.length} Task Due Now</span>
              </div>
            ) : missedTasks.length > 0 ? (
              <div className="inline-flex items-center gap-1 text-xs font-bold text-[#DC2626] bg-[#FEF2F2] px-2.5 py-1 rounded-lg border border-[#FECACA]">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{missedTasks.length} Task Missed</span>
              </div>
            ) : (
              <div className="text-xs text-[#5F5B52]">
                Scheduled on time
              </div>
            )}

            <div className="text-[11px] text-[#77736A] pt-0.5">
              100% Doctor Prescribed Dosages
            </div>

            {streakData && onOpenStreakModal && (
              <div className="pt-1.5 flex justify-center sm:justify-start">
                <button
                  type="button"
                  onClick={onOpenStreakModal}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-2xs ${
                    streakData.todayCompleted
                      ? 'bg-[#FEF3C7] border-[#FDE68A] text-[#92400E] ring-1 ring-[#FDE68A]'
                      : 'bg-white border-[#E6C978] hover:bg-[#FCF9F2] text-[#8E681C]'
                  }`}
                  title="View daily streak rewards and milestones"
                >
                  <Flame
                    className={`w-3.5 h-3.5 fill-current ${
                      streakData.todayCompleted ? 'text-[#EA580C] animate-pulse' : 'text-[#D97706]'
                    }`}
                  />
                  <span>{streakData.currentStreak} Day Streak 🔥</span>
                  <span className="text-[10px] text-[#77736A] font-semibold">
                    {streakData.todayCompleted ? '✓ Secured' : 'Extend'}
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Sessions Breakdown & Next Action (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          {/* Session Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Morning Session Slot */}
            <div
              className={`p-3.5 rounded-2xl border transition-all ${
                morningCompleted === morningTasks.length && morningTasks.length > 0
                  ? 'bg-[#F0FDF4] border-[#BBF7D0]'
                  : 'bg-[#FAFAF7] border-[#E8E4D8]'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-[#252525] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#C99A3A]" />
                  <span>Morning Session</span>
                </span>
                <span className="font-mono text-[11px] text-[#77736A]">06:45 AM</span>
              </div>
              <div className="flex items-center justify-between text-xs mt-2">
                <span className="text-[#5F5B52]">
                  {morningTasks.map((t) => t.exerciseName.split(' ')[0]).join(', ') || '2 Exercises'}
                </span>
                <span
                  className={`font-bold tabular-nums text-xs ${
                    morningCompleted === morningTasks.length && morningTasks.length > 0
                      ? 'text-[#15803D] flex items-center gap-1'
                      : 'text-[#8E681C]'
                  }`}
                >
                  {morningCompleted === morningTasks.length && morningTasks.length > 0 ? (
                    <>
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>{morningCompleted}/{morningTasks.length} Done</span>
                    </>
                  ) : (
                    <span>{morningCompleted}/{morningTasks.length} Done</span>
                  )}
                </span>
              </div>
            </div>

            {/* Evening Session Slot */}
            <div
              className={`p-3.5 rounded-2xl border transition-all ${
                eveningCompleted === eveningTasks.length && eveningTasks.length > 0
                  ? 'bg-[#F0FDF4] border-[#BBF7D0]'
                  : dueNowTasks.some((t) => t.period === 'evening')
                  ? 'bg-[#FEF3C7]/40 border-[#FDE68A]'
                  : 'bg-[#FAFAF7] border-[#E8E4D8]'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-[#252525] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#8E681C]" />
                  <span>Evening Session</span>
                </span>
                <span className="font-mono text-[11px] text-[#77736A]">07:30 PM</span>
              </div>
              <div className="flex items-center justify-between text-xs mt-2">
                <span className="text-[#5F5B52]">
                  {eveningTasks.map((t) => t.exerciseName.split(' ')[0]).join(', ') || '2 Exercises'}
                </span>
                <span
                  className={`font-bold tabular-nums text-xs ${
                    eveningCompleted === eveningTasks.length && eveningTasks.length > 0
                      ? 'text-[#15803D] flex items-center gap-1'
                      : dueNowTasks.some((t) => t.period === 'evening')
                      ? 'text-[#B45309]'
                      : 'text-[#5F5B52]'
                  }`}
                >
                  {eveningCompleted === eveningTasks.length && eveningTasks.length > 0 ? (
                    <>
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>{eveningCompleted}/{eveningTasks.length} Done</span>
                    </>
                  ) : dueNowTasks.some((t) => t.period === 'evening') ? (
                    <span>Due Now ({eveningCompleted}/{eveningTasks.length})</span>
                  ) : (
                    <span>{eveningCompleted}/{eveningTasks.length} Done</span>
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Actionable Next Task Callout Card */}
          {nextActionableTask ? (
            <div className="p-3.5 bg-[#FAFAF7] rounded-2xl border border-[#E8E4D8] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E681C] bg-white px-2 py-0.5 rounded border border-[#E6C978]">
                    {nextActionableTask.status === 'due_now'
                      ? 'Next Due Task'
                      : nextActionableTask.status === 'missed'
                      ? 'Catch Up Task'
                      : 'Upcoming'}
                  </span>
                  <span className="text-xs font-bold text-[#252525]">
                    {nextActionableTask.exerciseName}
                  </span>
                </div>
                <div className="text-[11px] text-[#5F5B52]">
                  {nextActionableTask.slotName} · {nextActionableTask.repetitions}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {onOpenVisualGuide && (
                  <button
                    type="button"
                    onClick={() => onOpenVisualGuide(nextActionableTask.exerciseName)}
                    className="p-2 sm:px-3 sm:py-2 rounded-xl bg-white border border-[#E8E4D8] hover:border-[#D8B15A] text-[#8E681C] text-xs font-bold cursor-pointer flex items-center gap-1 shadow-2xs"
                    title="Open visual biomechanics guide"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#B8892D]" />
                    <span className="hidden sm:inline">Guide</span>
                  </button>
                )}

                {onStartExercise && (
                  <button
                    type="button"
                    onClick={() => onStartExercise(nextActionableTask.exerciseName)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#C99A3A] hover:bg-[#B8892D] text-white text-xs font-bold shadow-xs cursor-pointer transition-all"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Start Exercise</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="p-3.5 bg-[#F0FDF4] rounded-2xl border border-[#BBF7D0] flex items-center justify-between text-xs text-[#15803D]">
              <div className="flex items-center gap-2 font-medium">
                <CheckCircle className="w-4 h-4 text-[#15803D] shrink-0" />
                <span>All scheduled exercises for today are complete and verified!</span>
              </div>
              <span className="font-bold text-[11px] bg-white px-2.5 py-1 rounded-lg border border-[#BBF7D0]">
                Next: Tomorrow 06:45 AM
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Expanded Details Section: Task Checklist Overview */}
      {isExpanded && (
        <div className="pt-3 border-t border-[#E8E4D8] space-y-2.5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#252525] uppercase tracking-wider">
              Today's Scheduled Tasks Checklist:
            </span>
            <div className="flex items-center gap-3 text-[11px] text-[#5F5B52]">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#15803D]" />
                <span>{completedTasks.length} Completed</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#B45309]" />
                <span>{dueNowTasks.length} Due Now</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#77736A]" />
                <span>{pendingTasks.length} Scheduled</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {dailyTasks.map((task) => {
              const isTaskCompleted = task.status === 'completed';
              const isTaskDue = task.status === 'due_now';
              const isTaskMissed = task.status === 'missed';

              return (
                <div
                  key={task.id}
                  className={`p-3 rounded-xl border text-xs flex flex-col justify-between transition-all ${
                    isTaskCompleted
                      ? 'bg-[#F0FDF4]/70 border-[#BBF7D0]'
                      : isTaskDue
                      ? 'bg-[#FEF3C7]/60 border-[#FDE68A]'
                      : isTaskMissed
                      ? 'bg-[#FEF2F2] border-[#FECACA]'
                      : 'bg-[#FAFAF7] border-[#E8E4D8]'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-[#8E681C]">
                        {task.scheduledTime}
                      </span>
                      {isTaskCompleted ? (
                        <span className="text-[10px] font-bold text-[#15803D] flex items-center gap-0.5">
                          <Check className="w-3 h-3 stroke-[2.5]" />
                          <span>Done</span>
                        </span>
                      ) : isTaskDue ? (
                        <span className="text-[10px] font-bold text-[#B45309]">Due</span>
                      ) : isTaskMissed ? (
                        <span className="text-[10px] font-bold text-[#DC2626]">Missed</span>
                      ) : (
                        <span className="text-[10px] text-[#77736A]">Upcoming</span>
                      )}
                    </div>

                    <div className="font-bold text-[#252525] truncate" title={task.exerciseName}>
                      {task.exerciseName}
                    </div>

                    <div className="text-[11px] text-[#5F5B52] truncate">
                      {task.repetitions}
                    </div>
                  </div>

                  {/* Task CTA */}
                  <div className="pt-2 mt-2 border-t border-[#E8E4D8]/60 flex items-center justify-between text-[11px]">
                    <span className="text-[#77736A]">
                      {task.period === 'morning' ? 'Morning' : 'Evening'}
                    </span>
                    {!isTaskCompleted && onStartExercise && (
                      <button
                        type="button"
                        onClick={() => onStartExercise(task.exerciseName)}
                        className="font-bold text-[#8E681C] hover:text-[#B8892D] cursor-pointer flex items-center gap-0.5"
                      >
                        <span>Start</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};
