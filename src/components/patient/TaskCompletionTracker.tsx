import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DailyScheduledTask } from '../../types';
import { VisualBadge } from '../common/VisualBadges';
import {
  CheckCircle,
  Clock,
  Play,
  AlertTriangle,
  Sparkles,
  Volume2,
  Calendar,
  Smile,
  Meh,
  Frown,
  Check,
  ShieldCheck,
  RotateCcw,
  ArrowRight,
  Eye,
} from 'lucide-react';

interface TaskCompletionTrackerProps {
  onOpenUploadModal: () => void;
  onStartExerciseModal: (exerciseName: string) => void;
  onOpenVisualGuide?: (exerciseName: string) => void;
}

export const TaskCompletionTracker: React.FC<TaskCompletionTrackerProps> = ({
  onOpenUploadModal,
  onStartExerciseModal,
  onOpenVisualGuide,
}) => {
  const {
    dailyTasks,
    verifyAndCompleteTask,
    markTaskDueOrMissed,
    activePrescription,
    language,
    speakText,
  } = useApp();

  const [selectedTaskForQuickVerify, setSelectedTaskForQuickVerify] = useState<DailyScheduledTask | null>(null);
  const [quickDifficulty, setQuickDifficulty] = useState<'easy' | 'okay' | 'difficult'>('okay');
  const [quickDiscomfort, setQuickDiscomfort] = useState<boolean>(false);
  const [verificationFeedbackNotice, setVerificationFeedbackNotice] = useState<string | null>(null);

  // Stats
  const completedCount = dailyTasks.filter((t) => t.status === 'completed').length;
  const totalTasks = dailyTasks.length || 1;
  const adherencePercent = Math.round((completedCount / totalTasks) * 100);

  const handleConfirmVerification = async () => {
    if (!selectedTaskForQuickVerify) return;

    await verifyAndCompleteTask(
      selectedTaskForQuickVerify.id,
      quickDifficulty,
      quickDiscomfort,
      'Verified via daily adherence checklist',
      'manual_confirm'
    );

    setVerificationFeedbackNotice(
      `Task "${selectedTaskForQuickVerify.exerciseName}" verified! Adherence updated to ${Math.round(
        ((completedCount + 1) / totalTasks) * 100
      )}%.`
    );

    setTimeout(() => {
      setVerificationFeedbackNotice(null);
      setSelectedTaskForQuickVerify(null);
    }, 1800);
  };

  return (
    <div className="bg-white rounded-3xl border border-[#E8E4D8] p-5 sm:p-6 shadow-sm space-y-5">
      {/* Header with Title and Adherence Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E8E4D8]">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#8E681C] bg-[#FCF9F2] px-2.5 py-0.5 rounded-full border border-[#E6C978]">
              Daily Adherence Guardian
            </span>
            <VisualBadge type="patient_completed" customText="LIVE TASK VERIFICATION" size="sm" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-[#252525] flex items-center gap-2">
            <span>Today's Scheduled Tasks</span>
            {activePrescription && (
              <span className="text-xs font-normal text-[#77736A] hidden sm:inline">
                (From {activePrescription.doctorName}'s plan)
              </span>
            )}
          </h2>
          <p className="text-xs text-[#5F5B52] mt-0.5">
            AI ensures tasks are completed according to your tailored schedule. Discomfort is flagged directly to your physiotherapist.
          </p>
        </div>

        {/* Progress & Upload Slip button */}
        <div className="flex items-center gap-2 sm:gap-3 self-start sm:self-auto shrink-0 flex-wrap">
          {onOpenVisualGuide && (
            <button
              type="button"
              onClick={() => onOpenVisualGuide('Seated Knee Extension')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#FCF9F2] hover:bg-[#F7F1E1] border border-[#E6C978] text-[#8E681C] text-xs font-bold transition-colors cursor-pointer shadow-2xs"
              title="Open animated visual guide"
            >
              <Eye className="w-3.5 h-3.5 text-[#B8892D]" />
              <span>Visual Guide</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenUploadModal}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#FCF9F2] hover:bg-[#F7F1E1] border border-[#E6C978] text-[#8E681C] text-xs font-bold transition-colors cursor-pointer shadow-2xs"
            title="Upload a new doctor prescription slip"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#B8892D]" />
            <span>Upload Doctor Plan</span>
          </button>

          {/* Adherence Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#FAFAF7] rounded-2xl border border-[#E8E4D8]">
            <div className="text-right">
              <div className="text-[10px] text-[#77736A] uppercase font-bold">Adherence</div>
              <div className="text-xs font-extrabold text-[#15803D]">
                {adherencePercent}% ({completedCount}/{totalTasks})
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-white border border-[#BBF7D0] flex items-center justify-center text-xs font-bold text-[#15803D] shadow-2xs">
              {completedCount}
            </div>
          </div>
        </div>
      </div>

      {/* Verification Notice Toast */}
      {verificationFeedbackNotice && (
        <div className="p-3 bg-[#F0FDF4] rounded-2xl border border-[#BBF7D0] text-xs font-bold text-[#15803D] flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{verificationFeedbackNotice}</span>
        </div>
      )}

      {/* Task List Cards */}
      <div className="space-y-3">
        {dailyTasks.map((task) => {
          const isCompleted = task.status === 'completed';
          const isDue = task.status === 'due_now';
          const isMissed = task.status === 'missed';

          return (
            <div
              key={task.id}
              className={`p-4 rounded-2xl border transition-all ${
                isCompleted
                  ? 'bg-[#F0FDF4]/50 border-[#BBF7D0]'
                  : isDue
                  ? 'bg-[#FCF9F2] border-[#C99A3A] ring-1 ring-[#D8B15A]/40 shadow-xs'
                  : isMissed
                  ? 'bg-[#FEF2F2] border-[#FECACA]'
                  : 'bg-[#FAFAF7] border-[#E8E4D8]'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {/* Left Info */}
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-extrabold text-[#252525]">
                      {task.exerciseName}
                    </span>

                    {/* Status Pill */}
                    {isCompleted ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#DCFCE7] text-[#15803D] text-[10px] font-bold border border-[#86EFAC]">
                        <Check className="w-3 h-3" />
                        <span>Verified Completed {task.completedAt}</span>
                      </span>
                    ) : isDue ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FEF3C7] text-[#B45309] text-[10px] font-bold border border-[#FDE68A] animate-pulse">
                        <Clock className="w-3 h-3" />
                        <span>Due Now ({task.scheduledTime})</span>
                      </span>
                    ) : isMissed ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FEE2E2] text-[#B91C1C] text-[10px] font-bold border border-[#FCA5A5]">
                        <AlertTriangle className="w-3 h-3" />
                        <span>Missed Session ({task.scheduledTime})</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white text-[#77736A] text-[10px] font-semibold border border-[#E8E4D8]">
                        <Clock className="w-3 h-3" />
                        <span>Scheduled {task.scheduledTime}</span>
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-[#5F5B52]">
                    <span className="font-semibold text-[#8E681C] bg-white px-2 py-0.5 rounded-md border border-[#E8E4D8]">
                      {task.slotName}
                    </span>
                    <span>Dosage: <strong className="text-[#252525]">{task.repetitions}</strong></span>
                    {task.reportedDifficulty && (
                      <span className="text-[11px] text-[#77736A]">
                        Feeling: <strong className="capitalize">{task.reportedDifficulty}</strong>
                      </span>
                    )}
                    {task.discomfortReported && (
                      <span className="text-[11px] font-bold text-[#DC2626] bg-[#FEF2F2] px-2 py-0.5 rounded-md border border-[#FECACA]">
                        Discomfort Logged for Therapist
                      </span>
                    )}
                  </div>
                </div>

                {/* Right Actions */}
                <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                  {/* If completed, show checkmark */}
                  {isCompleted ? (
                    <div className="flex items-center gap-2">
                      {onOpenVisualGuide && (
                        <button
                          type="button"
                          onClick={() => onOpenVisualGuide(task.exerciseName)}
                          className="px-2.5 py-1.5 rounded-xl bg-white border border-[#E8E4D8] hover:border-[#D8B15A] text-[#8E681C] text-xs font-semibold cursor-pointer flex items-center gap-1 shadow-2xs"
                          title="View exercise visual guide"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#B8892D]" />
                          <span>Guide</span>
                        </button>
                      )}
                      <div className="flex items-center gap-1 text-xs text-[#15803D] font-bold bg-white px-3 py-1.5 rounded-xl border border-[#BBF7D0]">
                        <CheckCircle className="w-4 h-4 text-[#15803D]" />
                        <span>{task.verificationMethod === 'voice_verified' ? '🎙️ Voice Verified' : 'Verified'}</span>
                      </div>
                    </div>
                  ) : isMissed ? (
                    <div className="flex items-center gap-1.5">
                      {onOpenVisualGuide && (
                        <button
                          type="button"
                          onClick={() => onOpenVisualGuide(task.exerciseName)}
                          className="px-2.5 py-1.5 rounded-xl bg-white border border-[#E8E4D8] hover:border-[#D8B15A] text-[#8E681C] text-xs font-semibold cursor-pointer flex items-center gap-1 shadow-2xs"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#B8892D]" />
                          <span>Guide</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => onStartExerciseModal(task.exerciseName)}
                        className="px-3.5 py-2 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Catch Up Now</span>
                      </button>
                    </div>
                  ) : (
                    <>
                      {onOpenVisualGuide && (
                        <button
                          type="button"
                          onClick={() => onOpenVisualGuide(task.exerciseName)}
                          className="px-3 py-2 rounded-xl bg-[#FCF9F2] hover:bg-[#F7F1E1] border border-[#E6C978] text-[#8E681C] text-xs font-bold cursor-pointer flex items-center gap-1.5 shadow-2xs"
                          title="View movement visual guide"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#B8892D]" />
                          <span>Visual Guide</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => onStartExerciseModal(task.exerciseName)}
                        className="px-4 py-2 rounded-xl bg-[#C99A3A] hover:bg-[#B8892D] text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Start Exercise</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedTaskForQuickVerify(task)}
                        className="px-3 py-2 rounded-xl bg-white border border-[#E8E4D8] hover:border-[#D8B15A] text-[#8E681C] text-xs font-bold cursor-pointer"
                        title="Quickly record completed task"
                      >
                        Verify Done
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Evaluator / Demo Simulation Controls */}
      <div className="pt-3 border-t border-[#E8E4D8] flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1 text-[11px] text-[#77736A]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#B8892D]" />
          <span>Completed tasks are visible to Dr. Priya Raman in real time.</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#A9A59B]">
            Demo Simulator:
          </span>
          <button
            type="button"
            onClick={() => {
              if (dailyTasks[2]) {
                markTaskDueOrMissed(dailyTasks[2].id, 'missed');
              }
            }}
            className="px-2 py-1 rounded-md bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626] text-[10px] font-bold cursor-pointer hover:bg-[#FEE2E2]"
            title="Simulate missed evening task to test adherence alerts"
          >
            Simulate Missed Task
          </button>
          <button
            type="button"
            onClick={() => {
              dailyTasks.forEach((t) => markTaskDueOrMissed(t.id, 'due_now'));
            }}
            className="px-2 py-1 rounded-md bg-[#FAFAF7] border border-[#E8E4D8] text-[#5F5B52] text-[10px] font-bold cursor-pointer hover:bg-[#F7F4EC]"
            title="Reset tasks to due now"
          >
            Reset All to Due
          </button>
        </div>
      </div>

      {/* Quick Verification Modal */}
      {selectedTaskForQuickVerify && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl border border-[#E8E4D8] p-6 max-w-md w-full space-y-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0] flex items-center justify-center font-bold">
                <Check className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#252525]">
                  Verify Task Completion
                </h3>
                <p className="text-xs text-[#77736A]">
                  {selectedTaskForQuickVerify.exerciseName} • {selectedTaskForQuickVerify.repetitions}
                </p>
              </div>
            </div>

            {/* Feeling selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#252525] block">
                How did this exercise feel?
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'easy' as const, label: 'Easy 😊', icon: Smile, border: 'border-[#BBF7D0]' },
                  { value: 'okay' as const, label: 'Okay 😐', icon: Meh, border: 'border-[#E6C978]' },
                  { value: 'difficult' as const, label: 'Difficult 😣', icon: Frown, border: 'border-[#FECACA]' },
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setQuickDifficulty(item.value)}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer text-center ${
                      quickDifficulty === item.value
                        ? 'bg-[#C99A3A] text-white border-[#C99A3A]'
                        : `bg-[#FAFAF7] text-[#5F5B52] ${item.border}`
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Discomfort checkbox */}
            <div className="p-3 bg-[#FAFAF7] rounded-xl border border-[#E8E4D8] flex items-center justify-between">
              <div className="text-xs">
                <span className="font-bold text-[#252525] block">Did you experience knee discomfort?</span>
                <span className="text-[11px] text-[#77736A]">Will flag Dr. Priya without altering plan</span>
              </div>
              <input
                type="checkbox"
                checked={quickDiscomfort}
                onChange={(e) => setQuickDiscomfort(e.target.checked)}
                className="w-5 h-5 accent-[#C99A3A] rounded cursor-pointer"
              />
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E8E4D8]">
              <button
                type="button"
                onClick={() => setSelectedTaskForQuickVerify(null)}
                className="px-4 py-2 rounded-xl border border-[#E8E4D8] text-xs font-bold text-[#5F5B52] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmVerification}
                className="px-5 py-2 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Confirm Verification</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
