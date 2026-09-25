import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ExerciseVisualCue } from './ExerciseVisualCue';
import { VisualBadge } from '../common/VisualBadges';
import {
  REAL_CLINICAL_EXERCISE_DATASET,
  REAL_CLINICAL_PATIENT_CASES,
  ClinicalExerciseData,
} from '../../data/clinicalRehabilitationDataset';
import {
  Eye,
  Volume2,
  VolumeX,
  Play,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  Clock,
  Activity,
  ArrowRight,
  Filter,
  UserCheck,
  Stethoscope,
  Info,
} from 'lucide-react';

interface VisualGuideViewProps {
  onStartExercise?: (exerciseName: string) => void;
}

type BodyPartFilter = 'all' | 'neck' | 'shoulder' | 'back' | 'hip' | 'knee' | 'ankle' | 'wrist' | 'posture';

export const VisualGuideView: React.FC<VisualGuideViewProps> = ({ onStartExercise }) => {
  const { language, speakText, isSpeaking, stopSpeaking, currentPatient, setSelectedPatientId, updatePatient } = useApp();
  const [selectedBodyPart, setSelectedBodyPart] = useState<BodyPartFilter>('all');
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>(REAL_CLINICAL_EXERCISE_DATASET[0].id);

  // Filter exercises by body part
  const filteredExercises =
    selectedBodyPart === 'all'
      ? REAL_CLINICAL_EXERCISE_DATASET
      : REAL_CLINICAL_EXERCISE_DATASET.filter((ex) => ex.bodyPart === selectedBodyPart);

  // Active exercise to display in detail
  const activeExercise =
    filteredExercises.find((ex) => ex.id === selectedExerciseId) || filteredExercises[0] || REAL_CLINICAL_EXERCISE_DATASET[0];

  const handleSpeak = (text: string) => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speakText(text, language);
    }
  };

  const getAudioForExercise = (ex: ClinicalExerciseData) => {
    if (language === 'ta') return ex.audioTa;
    if (language === 'hi') return ex.audioHi;
    return ex.audioEn;
  };

  const getStepsForExercise = (ex: ClinicalExerciseData) => {
    if (language === 'ta') return ex.stepsTa;
    if (language === 'hi') return ex.stepsHi;
    return ex.stepsEn;
  };

  // Body part navigation tabs
  const bodyPartTabs: { id: BodyPartFilter; label: string; icon: string; count: number }[] = [
    { id: 'all', label: 'All Regions', icon: '🌐', count: REAL_CLINICAL_EXERCISE_DATASET.length },
    { id: 'neck', label: 'Neck & Cervical', icon: '🧠', count: REAL_CLINICAL_EXERCISE_DATASET.filter((e) => e.bodyPart === 'neck').length },
    { id: 'shoulder', label: 'Shoulder & Arm', icon: '💪', count: REAL_CLINICAL_EXERCISE_DATASET.filter((e) => e.bodyPart === 'shoulder').length },
    { id: 'back', label: 'Back & Spine', icon: '🦴', count: REAL_CLINICAL_EXERCISE_DATASET.filter((e) => e.bodyPart === 'back').length },
    { id: 'hip', label: 'Hip & Pelvis', icon: '🦵', count: REAL_CLINICAL_EXERCISE_DATASET.filter((e) => e.bodyPart === 'hip').length },
    { id: 'knee', label: 'Knee & Thigh', icon: '🦵', count: REAL_CLINICAL_EXERCISE_DATASET.filter((e) => e.bodyPart === 'knee').length },
    { id: 'ankle', label: 'Ankle & Foot', icon: '🦶', count: REAL_CLINICAL_EXERCISE_DATASET.filter((e) => e.bodyPart === 'ankle').length },
    { id: 'wrist', label: 'Wrist & Hand', icon: '✋', count: REAL_CLINICAL_EXERCISE_DATASET.filter((e) => e.bodyPart === 'wrist').length },
    { id: 'posture', label: 'Posture & Core', icon: '🧘', count: REAL_CLINICAL_EXERCISE_DATASET.filter((e) => e.bodyPart === 'posture').length },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-white via-[#FCF9F2] to-[#F7F1E1] rounded-3xl border border-[#E8E4D8] p-5 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8E681C] bg-white px-2.5 py-0.5 rounded-full border border-[#E6C978]">
                Authentic Rehabilitation Dataset
              </span>
              <VisualBadge type="evidence_based" customText="EVIDENCE-BASED PROTOCOLS" size="sm" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#252525] font-serif">
              Visual Biomechanical Exercise Guide
            </h1>
            <p className="text-sm text-[#5F5B52] mt-1 max-w-2xl leading-relaxed">
              Real clinical physical therapy protocols with safe range of motion arcs, 4-phase cadences, and anatomical animations across all major body regions.
            </p>
          </div>

          {/* Clinical Patient Context Pill */}
          <div className="p-3 bg-white rounded-2xl border border-[#E8E4D8] shadow-2xs self-start sm:self-auto shrink-0 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FCF9F2] border border-[#E6C978] flex items-center justify-center text-[#B8892D]">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] text-[#77736A] font-bold uppercase">Active Prescription</div>
              <div className="text-xs font-bold text-[#252525]">{currentPatient.rehabilitationGoal}</div>
              <div className="text-[10px] text-[#15803D] font-semibold">Doctor: {currentPatient.assignedTherapist}</div>
            </div>
          </div>
        </div>

        {/* Real Patient Clinical Case Switcher Strip */}
        <div className="mt-5 pt-4 border-t border-[#E8E4D8] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-[#77736A] font-semibold">
            <UserCheck className="w-4 h-4 text-[#B8892D]" />
            <span>Switch Patient Clinical Case:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {REAL_CLINICAL_PATIENT_CASES.map((patientCase) => {
              const isSelected = currentPatient.name === patientCase.name;
              return (
                <button
                  key={patientCase.patientId}
                  type="button"
                  onClick={() => {
                    setSelectedPatientId(patientCase.patientId);
                    setSelectedBodyPart(patientCase.bodyPart as BodyPartFilter);
                    const firstMatch = REAL_CLINICAL_EXERCISE_DATASET.find(
                      (e) => e.bodyPart === patientCase.bodyPart
                    );
                    if (firstMatch) setSelectedExerciseId(firstMatch.id);
                  }}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs ${
                    isSelected
                      ? 'bg-[#B8892D] text-white shadow-xs'
                      : 'bg-white border border-[#E8E4D8] hover:bg-[#FAFAF7] text-[#5F5B52]'
                  }`}
                  title={`${patientCase.name} (${patientCase.clinicalDiagnosis})`}
                >
                  <span>{patientCase.name}</span>
                  <span className="opacity-75 font-normal text-[10px] ml-1">
                    ({patientCase.bodyPart})
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Body Part Filter Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {bodyPartTabs.map((tab) => {
          const isActive = selectedBodyPart === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setSelectedBodyPart(tab.id);
                const first =
                  tab.id === 'all'
                    ? REAL_CLINICAL_EXERCISE_DATASET[0]
                    : REAL_CLINICAL_EXERCISE_DATASET.find((e) => e.bodyPart === tab.id);
                if (first) setSelectedExerciseId(first.id);
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
                isActive
                  ? 'bg-[#252525] text-white shadow-md'
                  : 'bg-white border border-[#E8E4D8] text-[#5F5B52] hover:bg-[#FCF9F2] hover:border-[#E6C978]'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-white/20 text-white' : 'bg-[#FAFAF7] text-[#77736A]'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Two-Column View: Exercise List (4 cols) & Live Biomechanical Detail (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Exercises in this Category */}
        <div className="lg:col-span-4 space-y-2.5">
          <div className="text-xs font-bold uppercase tracking-wider text-[#77736A] px-1">
            Clinical Protocols ({filteredExercises.length})
          </div>

          <div className="space-y-2">
            {filteredExercises.map((ex) => {
              const isSelected = ex.id === activeExercise.id;
              return (
                <button
                  key={ex.id}
                  type="button"
                  onClick={() => setSelectedExerciseId(ex.id)}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer shadow-2xs ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#FFFBEB] to-[#FEF3C7]/80 border-[#FDE68A] ring-2 ring-[#FDE68A]'
                      : 'bg-white border-[#E8E4D8] hover:bg-[#FCF9F2] hover:border-[#E6C978]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E681C] bg-[#FCF9F2] px-2 py-0.5 rounded border border-[#E6C978]">
                      {ex.bodyPartLabel}
                    </span>
                    <span className="text-[10px] font-mono text-[#77736A]">
                      {ex.icd10Code}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-[#252525] mt-1.5 leading-snug">
                    {ex.name}
                  </h3>

                  <p className="text-xs text-[#5F5B52] mt-0.5 line-clamp-1">
                    {ex.clinicalDiagnosis}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-[#77736A] mt-2 pt-2 border-t border-[#E8E4D8]/60">
                    <span className="font-semibold">{ex.dosage}</span>
                    <span className="text-[#8E681C] font-bold flex items-center gap-0.5">
                      <span>View</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Live Animated Biomechanical Demo & Clinical Details */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-[#E8E4D8] p-5 sm:p-7 shadow-xs space-y-6">
          {/* Header of Active Exercise */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-[#E8E4D8]">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-[#15803D] bg-[#F0FDF4] px-2.5 py-0.5 rounded-full border border-[#BBF7D0]">
                  {activeExercise.bodyPartLabel}
                </span>
                <span className="text-xs font-mono font-bold text-[#8E681C] bg-[#FCF9F2] px-2 py-0.5 rounded border border-[#E6C978]">
                  ICD-10: {activeExercise.icd10Code}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#252525] font-serif">
                {activeExercise.name}
              </h2>
              <p className="text-xs text-[#5F5B52] mt-0.5">
                Indication: <strong>{activeExercise.clinicalDiagnosis}</strong>
              </p>
            </div>

            {/* Action Buttons: Audio Readout & Start Exercise */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => handleSpeak(getAudioForExercise(activeExercise))}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs ${
                  isSpeaking
                    ? 'bg-[#DC2626] text-white animate-pulse'
                    : 'bg-[#FCF9F2] hover:bg-[#F7F1E1] border border-[#E6C978] text-[#8E681C]'
                }`}
                title="Listen to voice exercise cues in preferred language"
              >
                {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                <span>{isSpeaking ? 'Stop Audio' : 'Voice Guide'}</span>
              </button>

              {onStartExercise && (
                <button
                  type="button"
                  onClick={() => onStartExercise(activeExercise.name)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#15803D] hover:bg-[#166534] text-white cursor-pointer shadow-md transition-all active:scale-95"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Start Practice</span>
                </button>
              )}
            </div>
          </div>

          {/* Interactive Biomechanical SVG Animation */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-[#77736A]">
              <span className="font-bold uppercase tracking-wider text-[#252525] flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-[#B8892D]" />
                <span>Real-Time Biomechanical Animation</span>
              </span>
              <span className="font-mono text-[#8E681C] font-semibold">
                ROM: {activeExercise.safeRangeOfMotion}
              </span>
            </div>

            <ExerciseVisualCue
              exerciseName={activeExercise.name}
              bodyPart={activeExercise.visualCueType}
              isPerforming={true}
              size="lg"
            />
          </div>

          {/* Real Clinical Prescription Parameters Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-[#FCF9F2] rounded-2xl border border-[#E6C978]/60 space-y-1">
              <span className="text-[10px] font-bold uppercase text-[#8E681C]">Target Muscles</span>
              <p className="text-xs font-bold text-[#252525] leading-snug">
                {activeExercise.targetMuscles}
              </p>
            </div>

            <div className="p-3 bg-[#FCF9F2] rounded-2xl border border-[#E6C978]/60 space-y-1">
              <span className="text-[10px] font-bold uppercase text-[#8E681C]">Therapeutic Dosage</span>
              <p className="text-xs font-bold text-[#252525] leading-snug">
                {activeExercise.dosage}
              </p>
              <div className="text-[10px] font-mono text-[#77736A]">{activeExercise.cadence}</div>
            </div>

            <div className="p-3 bg-[#FCF9F2] rounded-2xl border border-[#E6C978]/60 space-y-1">
              <span className="text-[10px] font-bold uppercase text-[#8E681C]">Required Equipment</span>
              <p className="text-xs font-bold text-[#252525] leading-snug">
                {activeExercise.equipment}
              </p>
              <div className="text-[10px] text-[#15803D] font-semibold">✓ Zero expensive gear</div>
            </div>
          </div>

          {/* Evidence Base Citation */}
          <div className="p-3 bg-[#FAFAF7] rounded-2xl border border-[#E8E4D8] flex items-start gap-2.5 text-xs text-[#5F5B52]">
            <ShieldCheck className="w-4 h-4 text-[#15803D] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-[#252525]">Clinical Evidence Guideline: </span>
              <span>{activeExercise.evidenceSource}</span>
            </div>
          </div>

          {/* Step-by-Step Instructions */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#252525]">
              Step-by-Step Execution ({language.toUpperCase()})
            </h3>

            <div className="space-y-2">
              {getStepsForExercise(activeExercise).map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-2xl bg-[#FAFAF7] border border-[#E8E4D8] text-xs text-[#252525]"
                >
                  <span className="w-6 h-6 rounded-full bg-[#FCF9F2] border border-[#E6C978] text-[#8E681C] font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span className="mt-0.5 leading-relaxed font-medium">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Do's & Safety Don'ts Checklist */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {/* Clinical Do's */}
            <div className="p-4 bg-[#F0FDF4] rounded-2xl border border-[#BBF7D0] space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#15803D] uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4" />
                <span>Clinical Recommendations</span>
              </div>
              <ul className="space-y-1.5 text-xs text-[#166534]">
                {activeExercise.dos.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 leading-snug">
                    <span className="text-[#15803D] font-bold">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Safety Don'ts */}
            <div className="p-4 bg-[#FEF2F2] rounded-2xl border border-[#FECACA] space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#DC2626] uppercase tracking-wider">
                <AlertCircle className="w-4 h-4" />
                <span>Safety Guardrails (Avoid)</span>
              </div>
              <ul className="space-y-1.5 text-xs text-[#991B1B]">
                {activeExercise.donts.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 leading-snug">
                    <span className="text-[#DC2626] font-bold">✕</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
