import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { VisualBadge } from '../common/VisualBadges';
import { ExercisePlayerModal } from './ExercisePlayerModal';
import { PatientPreferenceModal } from './PatientPreferenceModal';
import { PatientPrescriptionUploadModal } from './PatientPrescriptionUploadModal';
import { TaskCompletionTracker } from './TaskCompletionTracker';
import { VisualGuideModal } from './VisualGuideModal';
import {
  Volume2,
  VolumeX,
  Play,
  CheckCircle2,
  Clock,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  ShieldCheck,
  ChevronRight,
  Calendar,
  Sliders,
  UploadCloud,
  Eye,
  Video,
} from 'lucide-react';
import { PlanExercise } from '../../types';

export const PatientHome: React.FC<{
  onNavigateToPlan: () => void;
  onNavigateToVisualGuide?: () => void;
  onNavigateToLibrary?: () => void;
}> = ({ onNavigateToPlan, onNavigateToVisualGuide, onNavigateToLibrary }) => {
  const {
    currentPatient,
    activePlan,
    language,
    setLanguage,
    simpleMode,
    setSimpleMode,
    speakText,
    stopSpeaking,
    isSpeaking,
    isPrescriptionUploadModalOpen,
    setIsPrescriptionUploadModalOpen,
  } = useApp();

  const [activeExerciseForModal, setActiveExerciseForModal] = useState<PlanExercise | null>(null);
  const [isPreferenceModalOpen, setIsPreferenceModalOpen] = useState(false);
  const [isVisualGuideModalOpen, setIsVisualGuideModalOpen] = useState(false);
  const [visualGuideExerciseName, setVisualGuideExerciseName] = useState<string>('Seated Knee Extension');

  // Compute completed count
  const totalExercises = activePlan.exercises.length;
  const completedCount = activePlan.exercises.filter((e) => e.completedToday).length;
  const progressPercent = Math.round((completedCount / (totalExercises || 1)) * 100);

  // Find next pending exercise
  const nextExercise =
    activePlan.exercises.find((e) => !e.completedToday) || activePlan.exercises[0];

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

  const handleListenNext = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speakText(getAudioScript(nextExercise), language);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-br from-white via-[#FCF9F2] to-[#F7F1E1] rounded-3xl p-6 sm:p-8 border border-[#E8E4D8] shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8E681C] bg-[#FFF8E7] px-2.5 py-0.5 rounded-full border border-[#E6C978]">
                {language === 'ta' ? 'அங்கீகரிக்கப்பட்ட திட்டம்' : 'Approved Rehabilitation Plan'}
              </span>
              <span className="text-xs text-[#77736A] font-medium">
                Dr. Priya Raman • v{activePlan.version}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#252525] font-serif tracking-tight">
              {language === 'ta'
                ? `வணக்கம், ${currentPatient.name} 👋`
                : `Good Morning, ${currentPatient.name} 👋`}
            </h1>
            <p className="text-sm sm:text-base text-[#5F5B52] mt-1">
              {language === 'ta'
                ? 'உங்கள் இன்றைய உடற்பயிற்சி திட்டம் தயாராக உள்ளது.'
                : 'Your rehabilitation plan is ready for today.'}
            </p>
          </div>

          {/* Controls: Upload Slip, Visual Guide, Preferences & Simple Mode */}
          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
            <button
              onClick={() => setIsPrescriptionUploadModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-[#B8892D] to-[#C99A3A] hover:from-[#A87922] hover:to-[#B8892D] text-xs font-bold text-white shadow-xs transition-colors cursor-pointer"
              title="Upload Doctor/Physiotherapist Prescription"
            >
              <UploadCloud className="w-4 h-4 text-white" />
              <span>Upload Doctor Plan</span>
            </button>

            <button
              onClick={() => {
                if (onNavigateToVisualGuide) {
                  onNavigateToVisualGuide();
                } else {
                  setVisualGuideExerciseName(nextExercise?.exerciseName || 'Seated Knee Extension');
                  setIsVisualGuideModalOpen(true);
                }
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-[#FCF9F2] hover:bg-[#F7F1E1] border border-[#E6C978] text-[#8E681C] text-xs font-bold transition-colors cursor-pointer shadow-2xs"
              title="Open Biomechanical Visual Guide"
            >
              <Eye className="w-4 h-4 text-[#B8892D]" />
              <span>{language === 'ta' ? 'காட்சி வழிகாட்டி' : 'Visual Guide'}</span>
            </button>

            <button
              onClick={() => setIsPreferenceModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white/90 border border-[#E8E4D8] hover:border-[#D8B15A] text-xs font-bold text-[#8E681C] shadow-2xs transition-colors cursor-pointer"
              title="Configure Routine & Preferences"
            >
              <Sliders className="w-4 h-4 text-[#B8892D]" />
              <span>Preferences</span>
            </button>

            <div className="flex items-center gap-2.5 bg-white/80 backdrop-blur-xs p-2 rounded-2xl border border-[#E8E4D8] shadow-2xs">
              <div className="text-left">
                <div className="text-xs font-bold text-[#252525]">Simple Mode</div>
                <div className="text-[10px] text-[#77736A]">Large 1-task view</div>
              </div>
              <button
                onClick={() => setSimpleMode(!simpleMode)}
                className="cursor-pointer text-[#B8892D] transition-transform hover:scale-105"
                aria-label="Toggle Simple Mode"
              >
                {simpleMode ? (
                  <ToggleRight className="w-7 h-7 text-[#B8892D]" />
                ) : (
                  <ToggleLeft className="w-7 h-7 text-[#A9A59B]" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Today's Progress Stats */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-[#E8E4D8]/80">
          <div className="bg-white/80 p-3.5 rounded-2xl border border-[#E8E4D8]">
            <div className="text-xs font-medium text-[#77736A]">Today's Progress</div>
            <div className="text-2xl font-extrabold text-[#B8892D] mt-0.5">
              {progressPercent}%
            </div>
            <div className="w-full h-1.5 bg-[#F7F4EC] rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-[#B8892D] transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="bg-white/80 p-3.5 rounded-2xl border border-[#E8E4D8]">
            <div className="text-xs font-medium text-[#77736A]">Today's Exercises</div>
            <div className="text-2xl font-extrabold text-[#252525] mt-0.5">
              {completedCount} of {totalExercises} <span className="text-sm font-normal text-[#77736A]">done</span>
            </div>
            <div className="text-[11px] text-[#15803D] font-medium mt-1">
              {completedCount === totalExercises ? 'All tasks complete! ✓' : `${totalExercises - completedCount} remaining`}
            </div>
          </div>

          <div className="bg-white/80 p-3.5 rounded-2xl border border-[#E8E4D8]">
            <div className="text-xs font-medium text-[#77736A]">Next Up</div>
            <div className="text-lg font-bold text-[#252525] truncate mt-0.5">
              {nextExercise?.exerciseName || 'All Done'}
            </div>
            <div className="text-xs text-[#8E681C] font-semibold mt-1">
              {nextExercise?.timeSlot || 'Great job today!'}
            </div>
          </div>
        </div>
      </div>

      {/* Daily Scheduled Tasks & Task Completion Verification Tracker */}
      <TaskCompletionTracker
        onOpenUploadModal={() => setIsPrescriptionUploadModalOpen(true)}
        onStartExerciseModal={(exerciseName) => {
          const match = activePlan.exercises.find((e) => e.exerciseName === exerciseName) || activePlan.exercises[0];
          setActiveExerciseForModal(match);
        }}
        onOpenVisualGuide={(exerciseName) => {
          setVisualGuideExerciseName(exerciseName);
          setIsVisualGuideModalOpen(true);
        }}
      />

      {/* Exercise Video Library Callout Banner */}
      {onNavigateToLibrary && (
        <div className="bg-gradient-to-r from-[#211F1B] via-[#2A2722] to-[#1E1C18] rounded-3xl p-5 sm:p-6 text-white border border-[#3E3A33] shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#15803D] animate-pulse" />
              <span className="text-xs font-bold text-[#E6C978] uppercase tracking-wider">
                {language === 'ta' ? 'உடற்பயிற்சி வீடியோ கூடம்' : 'Instructional Video Library'}
              </span>
            </div>
            <h3 className="text-lg font-bold font-serif text-white">
              {language === 'ta'
                ? 'தோள்பட்டை, முதுகு, கணுக்கால் & முழங்கால் வீடியோக்களை பார்க்கவும்'
                : 'Need Video Demonstrations for Other Body Parts?'}
            </h3>
            <p className="text-xs text-[#A9A59B] max-w-xl">
              {language === 'ta'
                ? 'மெதுவான அசைவு, கோண அளவீடுகள் மற்றும் தமிழ் குரல் வழிகாட்டுதலுடன் உடற்பயிற்சிகளை கற்றுக்கொள்ளுங்கள்.'
                : 'Watch slow-motion clinical videos with angle gauges and voice guides across shoulder, back, ankle, knee, neck, and hip.'}
            </p>
          </div>

          <button
            type="button"
            onClick={onNavigateToLibrary}
            className="px-5 py-3 rounded-2xl bg-[#C99A3A] hover:bg-[#D8B15A] text-black font-bold text-xs tracking-wide shrink-0 cursor-pointer shadow-md flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <Video className="w-4 h-4 fill-current" />
            <span>{language === 'ta' ? 'வீடியோ கூடம் திறக்க ▶' : 'Explore Exercise Library ▶'}</span>
          </button>
        </div>
      )}

      {/* Next Up Main Exercise Card (Hero Action) */}
      {nextExercise && (
        <div className="bg-white rounded-3xl border-2 border-[#D8B15A] p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FCF9F2] text-[#8E681C] border border-[#E6C978]">
                <Clock className="w-3.5 h-3.5" />
                {nextExercise.timeSlot} • {nextExercise.timeCategory.toUpperCase()}
              </span>
              {nextExercise.completedToday && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0]">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Completed Today
                </span>
              )}
            </div>

            <div className="text-xs font-medium text-[#77736A]">
              Routine Target: {nextExercise.repetitions}
            </div>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#252525]">
              {nextExercise.exerciseName}
            </h2>
            <p className="text-sm sm:text-base text-[#5F5B52] mt-2">
              {getLocalizedInstruction(nextExercise)}
            </p>
          </div>

          {/* DUAL TRANSPARENCY CARDS (Professional vs AI Simplified) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {/* Box 1: Professional Clinical Instruction */}
            <div className="p-4 rounded-2xl bg-[#F0F4F8] border border-[#BFDBFE] space-y-2">
              <VisualBadge type="professional_instruction" size="sm" />
              <div className="text-xs font-semibold text-[#1E3A8A]">
                {nextExercise.professionalInstruction}
              </div>
              <div className="text-[11px] text-[#475569]">
                Clinical instruction approved by your physiotherapist.
              </div>
            </div>

            {/* Box 2: AI-Assisted Simplified Explanation */}
            <div className="p-4 rounded-2xl bg-[#FCF9F2] border border-[#E6C978] space-y-2">
              <VisualBadge type="ai_assisted_explanation" size="sm" />
              <div className="text-xs font-semibold text-[#8E681C]">
                {getLocalizedInstruction(nextExercise)}
              </div>
              <div className="text-[11px] text-[#78350F]">
                AI-assisted simplified explanation for easy home execution.
              </div>
            </div>
          </div>

          {/* Big Action Buttons for Low Literacy */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              onClick={() => setActiveExerciseForModal(nextExercise)}
              className="w-full sm:w-auto flex-1 flex items-center justify-center gap-3 px-8 py-5 rounded-2xl bg-[#C99A3A] hover:bg-[#B8892D] text-white font-extrabold text-lg sm:text-xl shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <Play className="w-6 h-6 fill-current" />
              <span>{language === 'ta' ? 'பயிற்சியை தொடங்குங்கள்' : 'START EXERCISE'}</span>
            </button>

            <button
              onClick={() => {
                setVisualGuideExerciseName(nextExercise.exerciseName);
                setIsVisualGuideModalOpen(true);
              }}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-5 rounded-2xl font-bold text-base border-2 bg-white hover:bg-[#FCF9F2] border-[#D8B15A] text-[#8E681C] transition-all cursor-pointer shadow-2xs"
            >
              <Eye className="w-5 h-5 text-[#B8892D]" />
              <span>{language === 'ta' ? 'காட்சி வழிகாட்டி' : 'Visual Guide'}</span>
            </button>

            <button
              onClick={handleListenNext}
              className={`w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-5 rounded-2xl font-bold text-base border-2 transition-all cursor-pointer ${
                isSpeaking
                  ? 'bg-[#B8892D] text-white border-[#B8892D] animate-pulse'
                  : 'bg-white hover:bg-[#F7F1E1] border-[#D8B15A] text-[#8E681C]'
              }`}
            >
              {isSpeaking ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5 text-[#B8892D]" />}
              <span>{isSpeaking ? 'Stop' : '🔊 Listen'}</span>
            </button>
          </div>

          {/* Language Quick Switcher */}
          <div className="flex items-center justify-between pt-2 border-t border-[#E8E4D8] text-xs text-[#77736A]">
            <span>Switch voice & text language:</span>
            <div className="flex gap-2">
              <button
                onClick={() => setLanguage('ta')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                  language === 'ta' ? 'bg-[#C99A3A] text-white' : 'bg-[#F7F4EC] hover:bg-[#E8E4D8]'
                }`}
              >
                தமிழ்
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                  language === 'en' ? 'bg-[#C99A3A] text-white' : 'bg-[#F7F4EC] hover:bg-[#E8E4D8]'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage('hi')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                  language === 'hi' ? 'bg-[#C99A3A] text-white' : 'bg-[#F7F4EC] hover:bg-[#E8E4D8]'
                }`}
              >
                हिंदी
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Summary of Today's Full Schedule */}
      <div className="bg-white rounded-3xl border border-[#E8E4D8] p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#B8892D]" />
            <h3 className="text-lg font-bold text-[#252525]">Today's Schedule</h3>
          </div>
          <button
            onClick={onNavigateToPlan}
            className="flex items-center gap-1 text-xs font-bold text-[#8E681C] hover:underline cursor-pointer"
          >
            <span>View All Exercises</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          {activePlan.exercises.map((item, idx) => (
            <div
              key={item.id || idx}
              className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                item.completedToday
                  ? 'bg-[#F0FDF4]/50 border-[#BBF7D0]'
                  : 'bg-white border-[#E8E4D8] hover:border-[#D8B15A]'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                    item.completedToday
                      ? 'bg-[#15803D] text-white'
                      : 'bg-[#FCF9F2] text-[#8E681C] border border-[#E6C978]'
                  }`}
                >
                  {item.completedToday ? '✓' : idx + 1}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#252525]">{item.exerciseName}</span>
                    <span className="text-xs font-semibold text-[#77736A]">({item.timeSlot})</span>
                  </div>
                  <p className="text-xs text-[#5F5B52] line-clamp-1 mt-0.5">
                    {getLocalizedInstruction(item)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  onClick={() => speakText(getAudioScript(item), language)}
                  className="p-2 rounded-xl bg-[#F7F4EC] hover:bg-[#E8E4D8] text-[#5F5B52] transition-colors cursor-pointer"
                  title="Listen"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setActiveExerciseForModal(item)}
                  className={`px-4 py-2 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
                    item.completedToday
                      ? 'bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0]'
                      : 'bg-[#C99A3A] hover:bg-[#B8892D] text-white'
                  }`}
                >
                  {item.completedToday ? 'Review ✓' : 'Start ▶'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Safety Policy Notice */}
      <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#FCF9F2] border border-[#E6C978] text-xs text-[#8E681C]">
        <ShieldCheck className="w-5 h-5 shrink-0 text-[#B8892D]" />
        <span>
          <strong>AI Safety Guarantee:</strong> All clinical exercises are prescribed and approved by Dr. Priya Raman. AI assists with language, voice, and scheduling.
        </span>
      </div>

      {/* Exercise Modal if open */}
      {activeExerciseForModal && (
        <ExercisePlayerModal
          exercise={activeExerciseForModal}
          onClose={() => setActiveExerciseForModal(null)}
        />
      )}

      {/* Patient Preference Engine Modal */}
      <PatientPreferenceModal
        isOpen={isPreferenceModalOpen}
        onClose={() => setIsPreferenceModalOpen(false)}
      />

      {/* Patient Prescription Upload & AI Schedule Modal */}
      <PatientPrescriptionUploadModal
        isOpen={isPrescriptionUploadModalOpen}
        onClose={() => setIsPrescriptionUploadModalOpen(false)}
      />

      {/* Biomechanical Visual Guide Modal */}
      <VisualGuideModal
        isOpen={isVisualGuideModalOpen}
        onClose={() => setIsVisualGuideModalOpen(false)}
        initialExerciseName={visualGuideExerciseName}
        onStartExercise={(exerciseName) => {
          const match = activePlan.exercises.find((e) => e.exerciseName === exerciseName) || activePlan.exercises[0];
          setActiveExerciseForModal(match);
        }}
      />
    </div>
  );
};
