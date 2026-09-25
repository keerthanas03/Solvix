import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PlanExercise } from '../../types';
import { VisualBadge } from '../common/VisualBadges';
import { ExercisePlayerModal } from './ExercisePlayerModal';
import { VisualGuideModal } from './VisualGuideModal';
import {
  Clock,
  Volume2,
  Play,
  CheckCircle2,
  Sparkles,
  Info,
  Calendar,
  AlertTriangle,
  Eye,
} from 'lucide-react';

export const PatientMyPlan: React.FC<{
  onNavigateToVisualGuide?: () => void;
}> = ({ onNavigateToVisualGuide }) => {
  const { activePlan, language, speakText } = useApp();
  const [selectedExercise, setSelectedExercise] = useState<PlanExercise | null>(null);
  const [isVisualGuideModalOpen, setIsVisualGuideModalOpen] = useState(false);
  const [visualGuideExerciseName, setVisualGuideExerciseName] = useState<string>('Seated Knee Extension');

  const getLocalizedInstruction = (ex: PlanExercise) => {
    if (language === 'ta') return ex.patientInstructionTa || ex.patientInstructionEn;
    if (language === 'hi') return ex.patientInstructionHi || ex.patientInstructionEn;
    return ex.patientInstructionEn;
  };

  const getAudioScript = (ex: PlanExercise) => {
    if (language === 'ta') return ex.audioScriptTa || ex.patientInstructionTa;
    if (language === 'hi') return ex.audioScriptHi || ex.patientInstructionHi;
    return ex.audioScriptEn || ex.patientInstructionEn;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Plan Header */}
      <div className="bg-white rounded-3xl border border-[#E8E4D8] p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider bg-[#F0FDF4] text-[#15803D] px-2.5 py-0.5 rounded-full border border-[#BBF7D0]">
                Active Rehabilitation Plan
              </span>
              <span className="text-xs text-[#77736A]">Version {activePlan.version}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#252525] font-serif">
              {activePlan.title}
            </h1>
            <p className="text-sm text-[#5F5B52] mt-1">
              Prescribed by {activePlan.therapistName} • Tailored for your daily schedule
            </p>
          </div>

          <div className="p-3 bg-[#FCF9F2] rounded-2xl border border-[#E6C978] text-xs text-[#8E681C] max-w-xs">
            <div className="font-bold flex items-center gap-1.5 mb-0.5">
              <Sparkles className="w-3.5 h-3.5 text-[#B8892D]" />
              <span>AI Personalization Note</span>
            </div>
            <span>
              {activePlan.patientPreferenceInvolved || 'Adapted to morning and evening home routine.'}
            </span>
          </div>
        </div>
      </div>

      {/* Exercise Cards List (Large touch targets) */}
      <div className="space-y-4">
        {activePlan.exercises.map((item, index) => (
          <div
            key={item.id || index}
            className={`bg-white rounded-3xl border-2 p-6 sm:p-7 shadow-xs transition-all ${
              item.completedToday
                ? 'border-[#BBF7D0] bg-[#FAFCF8]'
                : 'border-[#E8E4D8] hover:border-[#D8B15A]'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-3">
                {/* Time & Badges */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-[#F7F4EC] text-[#5F5B52] border border-[#E8E4D8]">
                    <Clock className="w-3.5 h-3.5 text-[#B8892D]" />
                    {item.timeSlot}
                  </span>

                  <VisualBadge type="ai_assisted_explanation" size="sm" />

                  {item.completedToday && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-bold bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Completed {item.completedAt || 'Today'}
                    </span>
                  )}

                  {item.discomfortReported && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-bold bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]">
                      <AlertTriangle className="w-3 h-3" />
                      Discomfort Flagged
                    </span>
                  )}
                </div>

                {/* Name & Repetitions */}
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#252525]">
                    {item.exerciseName}
                  </h3>
                  <div className="text-sm font-semibold text-[#B8892D] mt-0.5">
                    Target: {item.repetitions} ({item.frequency})
                  </div>
                </div>

                {/* Simplified Instruction */}
                <p className="text-sm text-[#3F3D38] leading-relaxed max-w-2xl">
                  {getLocalizedInstruction(item)}
                </p>

                {/* Clinical note attribution */}
                <div className="text-xs text-[#77736A] italic">
                  Clinical recommendation: "{item.professionalInstruction}"
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5 shrink-0 pt-2 md:pt-0">
                <button
                  type="button"
                  onClick={() => {
                    setVisualGuideExerciseName(item.exerciseName);
                    setIsVisualGuideModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-3 rounded-2xl bg-[#FCF9F2] hover:bg-[#F7F1E1] border border-[#E6C978] text-[#8E681C] font-bold text-xs sm:text-sm transition-colors cursor-pointer shadow-2xs"
                  title="View animated visual biomechanics guide"
                >
                  <Eye className="w-4 h-4 text-[#B8892D]" />
                  <span>Visual Guide</span>
                </button>

                <button
                  onClick={() => speakText(getAudioScript(item), language)}
                  className="flex items-center gap-1.5 px-3.5 py-3 rounded-2xl bg-[#FAFAF7] hover:bg-[#F7F1E1] border border-[#E8E4D8] text-[#5F5B52] font-bold text-xs sm:text-sm transition-colors cursor-pointer"
                  title="Listen to instruction"
                >
                  <Volume2 className="w-4 h-4 text-[#B8892D]" />
                  <span>Listen</span>
                </button>

                <button
                  onClick={() => setSelectedExercise(item)}
                  className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-sm sm:text-base shadow-sm hover:shadow-md transition-all cursor-pointer ${
                    item.completedToday
                      ? 'bg-white border-2 border-[#22C55E] text-[#15803D] hover:bg-[#F0FDF4]'
                      : 'bg-[#C99A3A] hover:bg-[#B8892D] text-white'
                  }`}
                >
                  <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                  <span>{item.completedToday ? 'Do Again' : 'START'}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Explainable AI schedule transparency box */}
      {activePlan.aiReasoningFactors && (
        <div className="p-6 bg-white rounded-3xl border border-[#E8E4D8] space-y-3">
          <div className="text-xs font-bold text-[#8E681C] uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#B8892D]" />
            <span>Why did AI suggest this schedule format?</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#5F5B52]">
            {activePlan.aiReasoningFactors.map((reason, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-[#B8892D] font-bold">✓</span>
                <span>{reason}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Exercise Modal */}
      {selectedExercise && (
        <ExercisePlayerModal
          exercise={selectedExercise}
          onClose={() => setSelectedExercise(null)}
        />
      )}

      {/* Visual Guide Modal */}
      <VisualGuideModal
        isOpen={isVisualGuideModalOpen}
        onClose={() => setIsVisualGuideModalOpen(false)}
        initialExerciseName={visualGuideExerciseName}
        onStartExercise={(exerciseName) => {
          const match = activePlan.exercises.find((e) => e.exerciseName === exerciseName) || activePlan.exercises[0];
          setSelectedExercise(match);
        }}
      />
    </div>
  );
};
