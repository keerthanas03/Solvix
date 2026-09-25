import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ExerciseVisualCue } from './ExerciseVisualCue';
import { VisualBadge } from '../common/VisualBadges';
import {
  REAL_CLINICAL_EXERCISE_DATASET,
  ClinicalExerciseData,
} from '../../data/clinicalRehabilitationDataset';
import {
  X,
  Volume2,
  VolumeX,
  Play,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Check,
  ShieldCheck,
  Eye,
  Activity,
} from 'lucide-react';

interface VisualGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialExerciseName?: string;
  onStartExercise?: (exerciseName: string) => void;
}

export const VisualGuideModal: React.FC<VisualGuideModalProps> = ({
  isOpen,
  onClose,
  initialExerciseName,
  onStartExercise,
}) => {
  const { language, speakText, isSpeaking, stopSpeaking } = useApp();
  const [selectedId, setSelectedId] = useState<string>(REAL_CLINICAL_EXERCISE_DATASET[0].id);

  // If initialExerciseName changes, match to real dataset
  useEffect(() => {
    if (initialExerciseName) {
      const match = REAL_CLINICAL_EXERCISE_DATASET.find(
        (e) =>
          e.name.toLowerCase().includes(initialExerciseName.toLowerCase()) ||
          initialExerciseName.toLowerCase().includes(e.name.toLowerCase())
      );
      if (match) setSelectedId(match.id);
    }
  }, [initialExerciseName]);

  if (!isOpen) return null;

  const currentGuide =
    REAL_CLINICAL_EXERCISE_DATASET.find((e) => e.id === selectedId) ||
    REAL_CLINICAL_EXERCISE_DATASET[0];

  const handleSpeak = (text: string) => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speakText(text, language);
    }
  };

  const getAudio = (ex: ClinicalExerciseData) => {
    if (language === 'ta') return ex.audioTa;
    if (language === 'hi') return ex.audioHi;
    return ex.audioEn;
  };

  const getSteps = (ex: ClinicalExerciseData) => {
    if (language === 'ta') return ex.stepsTa;
    if (language === 'hi') return ex.stepsHi;
    return ex.stepsEn;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white border border-[#E8E4D8] rounded-3xl shadow-2xl p-5 sm:p-7 space-y-5 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#77736A] hover:text-[#252525] rounded-full hover:bg-[#F7F4EC] cursor-pointer"
          title="Close guide"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start gap-3.5 pr-8">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#C99A3A] to-[#8E681C] text-white flex items-center justify-center shrink-0 shadow-md">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E681C] bg-[#FCF9F2] px-2.5 py-0.5 rounded-full border border-[#E6C978]">
                {currentGuide.bodyPartLabel}
              </span>
              <VisualBadge type="evidence_based" customText={`ICD-10: ${currentGuide.icd10Code}`} size="sm" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#252525] font-serif">
              {currentGuide.name}
            </h2>
            <p className="text-xs text-[#5F5B52]">
              Clinical Protocol: {currentGuide.clinicalDiagnosis}
            </p>
          </div>
        </div>

        {/* Quick Body Part Selector Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {REAL_CLINICAL_EXERCISE_DATASET.map((ex) => {
            const isSelected = ex.id === currentGuide.id;
            return (
              <button
                key={ex.id}
                type="button"
                onClick={() => setSelectedId(ex.id)}
                className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-[#8E681C] text-white shadow-xs'
                    : 'bg-[#FAFAF7] hover:bg-[#FCF9F2] text-[#5F5B52] border border-[#E8E4D8]'
                }`}
              >
                <span>{ex.name}</span>
                <span className="opacity-75 font-normal text-[10px] ml-1">
                  ({ex.bodyPart})
                </span>
              </button>
            );
          })}
        </div>

        {/* Grid Layout: Visual Vector Cue (7 cols) & Form Rules (5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left Column: Visual Cue & Steps (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-[#77736A]">
                <span className="font-bold text-[#252525]">Biomechanical Movement Arc</span>
                <span className="font-mono text-[#8E681C] font-semibold">
                  ROM: {currentGuide.safeRangeOfMotion}
                </span>
              </div>

              {/* Dynamic SVG Animation for any selected body part */}
              <ExerciseVisualCue
                exerciseName={currentGuide.name}
                bodyPart={currentGuide.visualCueType}
                isPerforming={true}
                size="lg"
              />
            </div>

            {/* Audio Voice Guide Player Bar */}
            <div className="p-3 bg-[#FCF9F2] rounded-2xl border border-[#E6C978]/60 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => handleSpeak(getAudio(currentGuide))}
                  className={`p-2.5 rounded-xl cursor-pointer shadow-2xs transition-all ${
                    isSpeaking
                      ? 'bg-[#DC2626] text-white animate-pulse'
                      : 'bg-[#8E681C] text-white hover:bg-[#6D4E12]'
                  }`}
                  title="Listen in your language"
                >
                  {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <div className="text-xs">
                  <span className="font-bold text-[#252525] block">
                    {isSpeaking ? 'Playing Voice Guide...' : 'Audio Guidance'}
                  </span>
                  <span className="text-[11px] text-[#77736A]">
                    {language === 'ta' ? 'தமிழ் குரல் வழிகாட்டல்' : language === 'hi' ? 'हिंदी ऑडियो निर्देश' : 'Spoken English Cues'}
                  </span>
                </div>
              </div>

              <span className="text-[10px] font-mono font-semibold text-[#8E681C] bg-white px-2 py-0.5 rounded border border-[#E6C978]">
                {currentGuide.cadence}
              </span>
            </div>

            {/* Step-by-Step Instructions */}
            <div className="p-4 bg-white rounded-2xl border border-[#E8E4D8] space-y-2">
              <span className="text-xs font-bold text-[#252525] uppercase tracking-wider">
                Step-by-Step Instructions:
              </span>
              <div className="space-y-1.5 text-xs text-[#5F5B52]">
                {getSteps(currentGuide).map((step, idx) => (
                  <div key={idx} className="p-2 bg-[#FAFAF7] rounded-xl border border-[#E8E4D8]/80 font-medium">
                    {step}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Form Do's, Don'ts & Clinical Safety (5 Cols) */}
          <div className="lg:col-span-5 space-y-3.5">
            {/* Form Do's */}
            <div className="p-3.5 bg-[#F0FDF4] rounded-2xl border border-[#BBF7D0] space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#15803D]">
                <CheckCircle2 className="w-4 h-4" />
                <span>CLINICAL DO'S (செய்ய வேண்டியவை)</span>
              </div>
              <ul className="space-y-1 text-xs text-[#166534]">
                {currentGuide.dos.map((item, i) => (
                  <li key={i} className="flex items-start gap-1.5 leading-snug">
                    <Check className="w-3.5 h-3.5 text-[#15803D] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Form Don'ts */}
            <div className="p-3.5 bg-[#FEF2F2] rounded-2xl border border-[#FECACA] space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#DC2626]">
                <AlertCircle className="w-4 h-4" />
                <span>SAFETY GUARDRAILS (தவிர்க்கவும்)</span>
              </div>
              <ul className="space-y-1 text-xs text-[#991B1B]">
                {currentGuide.donts.map((item, i) => (
                  <li key={i} className="flex items-start gap-1.5 leading-snug">
                    <X className="w-3.5 h-3.5 text-[#DC2626] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Anatomy & Equipment info */}
            <div className="p-3 bg-[#FAFAF7] rounded-2xl border border-[#E8E4D8] space-y-2 text-xs">
              <div>
                <span className="font-bold text-[#252525] block">Target Musculature:</span>
                <span className="text-[#5F5B52]">{currentGuide.targetMuscles}</span>
              </div>
              <div className="pt-1.5 border-t border-[#E8E4D8]">
                <span className="font-bold text-[#252525] block">Required Equipment:</span>
                <span className="text-[#5F5B52]">{currentGuide.equipment}</span>
              </div>
              <div className="pt-1.5 border-t border-[#E8E4D8]">
                <span className="font-bold text-[#252525] block">Clinical Evidence Base:</span>
                <span className="text-[#5F5B52]">{currentGuide.evidenceSource}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-1">
              {onStartExercise && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onStartExercise(currentGuide.name);
                  }}
                  className="w-full py-2.5 rounded-2xl bg-[#8E681C] hover:bg-[#6D4E12] text-white text-xs font-bold shadow-md cursor-pointer flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Start Exercise with Rep Counter</span>
                </button>
              )}

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2 rounded-2xl border border-[#E8E4D8] hover:bg-[#FAFAF7] text-xs font-bold text-[#5F5B52] cursor-pointer"
              >
                Close Visual Guide
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
