import React, { useState, useMemo, useRef } from 'react';
import {
  REAL_CLINICAL_EXERCISE_DATASET,
  ClinicalExerciseData,
  getExerciseVideoData,
} from '../../data/clinicalRehabilitationDataset';
import { InstructionalVideoPlayer } from './InstructionalVideoPlayer';
import { VisualBadge } from '../common/VisualBadges';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Video,
  Play,
  Volume2,
  VolumeX,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Sparkles,
  Filter,
  Activity,
  Layers,
  Clock,
  Dumbbell,
  ArrowRight,
  BookOpen,
} from 'lucide-react';

interface PatientExerciseLibraryProps {
  onStartExercise?: (exerciseName: string) => void;
  onNavigateToPlan?: () => void;
}

type BodyPartFilter = 'all' | 'shoulder' | 'back' | 'ankle' | 'knee' | 'neck' | 'hip' | 'wrist' | 'posture';

export const PatientExerciseLibrary: React.FC<PatientExerciseLibraryProps> = ({
  onStartExercise,
  onNavigateToPlan,
}) => {
  const { language, speakText, stopSpeaking, isSpeaking } = useApp();

  const [selectedBodyPart, setSelectedBodyPart] = useState<BodyPartFilter>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeExerciseId, setActiveExerciseId] = useState<string>('ex-shoulder-wall-walk');

  const topVideoRef = useRef<HTMLDivElement>(null);

  // Body Part Categories with Icons and Counts
  const bodyPartTabs: { id: BodyPartFilter; labelEn: string; labelTa: string; labelHi: string; icon: string }[] = [
    { id: 'all', labelEn: 'All Regions', labelTa: 'அனைத்தும்', labelHi: 'सभी भाग', icon: '🌐' },
    { id: 'shoulder', labelEn: 'Shoulder', labelTa: 'தோள்பட்டை', labelHi: 'कंधा', icon: '💪' },
    { id: 'back', labelEn: 'Back & Spine', labelTa: 'முதுகு & தண்டுவடம்', labelHi: 'पीठ और रीढ़', icon: '🦴' },
    { id: 'ankle', labelEn: 'Ankle & Foot', labelTa: 'கணுக்கால் & பாதம்', labelHi: 'टखना और पैर', icon: '🦶' },
    { id: 'knee', labelEn: 'Knee & Thigh', labelTa: 'முழங்கால்', labelHi: 'घुटना', icon: '🦵' },
    { id: 'neck', labelEn: 'Neck / Cervical', labelTa: 'கழுத்து', labelHi: 'गर्दन', icon: '🧠' },
    { id: 'hip', labelEn: 'Hip & Pelvis', labelTa: 'இடுப்பு', labelHi: 'कूल्हा', icon: '🏃' },
    { id: 'wrist', labelEn: 'Wrist & Hand', labelTa: 'மணிக்கட்டு & கை', labelHi: 'कलाई और हाथ', icon: '✋' },
    { id: 'posture', labelEn: 'Posture & Core', labelTa: 'தோரணை & கோர்', labelHi: 'मुद्रा और कोर', icon: '🧘' },
  ];

  // Filter exercises
  const filteredExercises = useMemo(() => {
    return REAL_CLINICAL_EXERCISE_DATASET.filter((ex) => {
      const matchesBodyPart = selectedBodyPart === 'all' || ex.bodyPart === selectedBodyPart;
      const exVideo = getExerciseVideoData(ex);
      const matchesDifficulty =
        selectedDifficulty === 'all' || exVideo.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        ex.name.toLowerCase().includes(q) ||
        ex.bodyPartLabel.toLowerCase().includes(q) ||
        ex.clinicalDiagnosis.toLowerCase().includes(q) ||
        ex.targetMuscles.toLowerCase().includes(q) ||
        ex.icd10Code.toLowerCase().includes(q);

      return matchesBodyPart && matchesDifficulty && matchesSearch;
    });
  }, [selectedBodyPart, selectedDifficulty, searchQuery]);

  // Active exercise loaded in the featured video player
  const activeExercise = useMemo(() => {
    const found = REAL_CLINICAL_EXERCISE_DATASET.find((e) => e.id === activeExerciseId);
    return found || filteredExercises[0] || REAL_CLINICAL_EXERCISE_DATASET[0];
  }, [activeExerciseId, filteredExercises]);

  const activeVideoData = getExerciseVideoData(activeExercise);

  const handleSelectExerciseForVideo = (exerciseId: string) => {
    setActiveExerciseId(exerciseId);
    if (topVideoRef.current) {
      topVideoRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

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

  const getTabLabel = (tab: typeof bodyPartTabs[0]) => {
    if (language === 'ta') return tab.labelTa;
    if (language === 'hi') return tab.labelHi;
    return tab.labelEn;
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Library Welcome & Search Hero */}
      <div className="bg-gradient-to-br from-white via-[#FCF9F2] to-[#F7F1E1] rounded-3xl p-6 sm:p-8 border border-[#E8E4D8] shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8E681C] bg-white px-2.5 py-0.5 rounded-full border border-[#E6C978]">
                Instructional Video Library
              </span>
              <VisualBadge type="evidence_based" customText="CLINICAL PT PROTOCOLS" size="sm" />
              <span className="text-xs text-[#77736A] font-semibold">
                {REAL_CLINICAL_EXERCISE_DATASET.length} Video Demos
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#252525] font-serif tracking-tight">
              Rehabilitation Exercise Library
            </h1>

            <p className="text-sm sm:text-base text-[#5F5B52] max-w-2xl leading-relaxed">
              Explore step-by-step instructional clinical demonstration videos, safe range-of-motion arcs, and medical precautions across <strong>shoulder, back, ankle, knee, neck, hip, and wrist</strong> rehabilitation.
            </p>
          </div>

          {/* Quick Search Bar */}
          <div className="w-full md:w-80 shrink-0">
            <div className="relative">
              <Search className="w-4 h-4 text-[#77736A] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search shoulder, back, ankle, knee..."
                className="w-full pl-10 pr-4 py-3 text-xs bg-white rounded-2xl border border-[#E8E4D8] focus:border-[#C99A3A] focus:outline-none shadow-xs font-medium"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#77736A] hover:text-[#252525]"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Body Part Filter Buttons */}
        <div className="mt-5 pt-4 border-t border-[#E8E4D8] flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {bodyPartTabs.map((tab) => {
            const isSelected = selectedBodyPart === tab.id;
            const count =
              tab.id === 'all'
                ? REAL_CLINICAL_EXERCISE_DATASET.length
                : REAL_CLINICAL_EXERCISE_DATASET.filter((e) => e.bodyPart === tab.id).length;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedBodyPart(tab.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-[#252525] text-white shadow-md'
                    : 'bg-white border border-[#E8E4D8] text-[#5F5B52] hover:bg-[#FCF9F2] hover:border-[#E6C978]'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{getTabLabel(tab)}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-[#FAFAF7] text-[#77736A]'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Featured Video Player Showcase Section */}
      <div ref={topVideoRef} className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#FCF9F2] border border-[#E6C978] text-[#8E681C] flex items-center justify-center">
              <Video className="w-4 h-4 text-[#B8892D]" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-[#252525] font-serif">
                Featured Instructional Video Demo
              </h2>
              <span className="text-xs text-[#77736A]">
                Slow-motion rehabilitation guide with subtitles and angle indicators
              </span>
            </div>
          </div>

          <span className="text-xs font-bold text-[#8E681C] bg-[#FCF9F2] px-3 py-1 rounded-xl border border-[#E6C978]">
            {activeExercise.bodyPartLabel}
          </span>
        </div>

        {/* Video Player */}
        <InstructionalVideoPlayer
          exercise={activeExercise}
          onStartExercise={onStartExercise}
          autoPlay={true}
        />

        {/* Rich Exercise Description Card Under Video */}
        <div className="bg-white rounded-3xl border border-[#E8E4D8] p-5 sm:p-7 shadow-xs space-y-6">
          {/* Header & Quick Action Row */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-[#E8E4D8]">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-[#15803D] bg-[#F0FDF4] px-2.5 py-0.5 rounded-full border border-[#BBF7D0]">
                  {activeExercise.bodyPartLabel}
                </span>
                <span className="text-xs font-mono font-bold text-[#8E681C] bg-[#FCF9F2] px-2 py-0.5 rounded border border-[#E6C978]">
                  ICD-10: {activeExercise.icd10Code}
                </span>
                <span className="text-xs font-bold text-[#77736A] bg-[#FAFAF7] px-2.5 py-0.5 rounded-full border border-[#E8E4D8]">
                  Difficulty: {activeVideoData.difficulty}
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-[#252525] font-serif">
                {activeExercise.name}
              </h3>
              <p className="text-xs sm:text-sm text-[#5F5B52] mt-1">
                Clinical Indication: <strong>{activeExercise.clinicalDiagnosis}</strong>
              </p>
            </div>

            {/* Voice Audio Readout & Practice Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => handleSpeak(getAudioForExercise(activeExercise))}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs ${
                  isSpeaking
                    ? 'bg-[#DC2626] text-white animate-pulse'
                    : 'bg-[#FCF9F2] hover:bg-[#F7F1E1] border border-[#E6C978] text-[#8E681C]'
                }`}
                title="Spoken audio instructions"
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

          {/* Key Clinical Prescription Specifications */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 bg-[#FCF9F2] rounded-2xl border border-[#E6C978]/60 space-y-1">
              <span className="text-[10px] font-bold uppercase text-[#8E681C] block">Target Musculature</span>
              <p className="text-xs font-bold text-[#252525] leading-snug">
                {activeExercise.targetMuscles}
              </p>
            </div>

            <div className="p-3.5 bg-[#FCF9F2] rounded-2xl border border-[#E6C978]/60 space-y-1">
              <span className="text-[10px] font-bold uppercase text-[#8E681C] block">Prescribed Dosage</span>
              <p className="text-xs font-bold text-[#252525] leading-snug">
                {activeExercise.dosage}
              </p>
              <div className="text-[10px] font-mono text-[#77736A]">{activeExercise.cadence}</div>
            </div>

            <div className="p-3.5 bg-[#FCF9F2] rounded-2xl border border-[#E6C978]/60 space-y-1">
              <span className="text-[10px] font-bold uppercase text-[#8E681C] block">Safe Range of Motion</span>
              <p className="text-xs font-bold text-[#252525] leading-snug">
                {activeExercise.safeRangeOfMotion}
              </p>
              <div className="text-[10px] text-[#15803D] font-semibold">✓ Non-impinging arc</div>
            </div>
          </div>

          {/* Key Benefits of this Exercise */}
          <div className="p-4 bg-[#FAFAF7] rounded-2xl border border-[#E8E4D8] space-y-2">
            <span className="text-xs font-bold text-[#252525] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#B8892D]" />
              <span>Key Rehabilitation Benefits</span>
            </span>
            <div className="flex flex-wrap gap-2">
              {activeVideoData.keyBenefits.map((b, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-xl bg-white border border-[#E8E4D8] text-xs font-medium text-[#5F5B52] shadow-2xs"
                >
                  ✓ {b}
                </span>
              ))}
            </div>
          </div>

          {/* Step-by-Step Instructions */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#252525]">
              Step-by-Step Technique Instructions ({language.toUpperCase()})
            </h4>

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
                <span>Form Recommendations (Do's)</span>
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
                <span>Safety Precautions (Avoid)</span>
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

      {/* Complete Video Catalog Section (Cards Grid) */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold text-[#252525] font-serif">
              Explore All Exercise Videos & Descriptions
            </h2>
            <p className="text-xs text-[#77736A]">
              Showing {filteredExercises.length} physical therapy video demonstrations
            </p>
          </div>

          {/* Quick Body Part Pill Tag Indicators */}
          <div className="flex items-center gap-2 text-xs text-[#77736A]">
            <span className="font-semibold">Tap any card to watch its instructional video</span>
          </div>
        </div>

        {/* Video Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredExercises.map((ex) => {
            const exVideo = getExerciseVideoData(ex);
            const isCurrentlySelected = ex.id === activeExercise.id;

            return (
              <div
                key={ex.id}
                className={`bg-white rounded-3xl border transition-all duration-200 overflow-hidden shadow-xs flex flex-col justify-between hover:border-[#C99A3A] hover:shadow-md ${
                  isCurrentlySelected ? 'border-[#C99A3A] ring-2 ring-[#C99A3A]/40' : 'border-[#E8E4D8]'
                }`}
              >
                {/* Video Card Header Thumbnail */}
                <div
                  onClick={() => handleSelectExerciseForVideo(ex.id)}
                  className="relative aspect-video bg-gradient-to-b from-[#2B2823] to-[#171614] flex items-center justify-center p-4 cursor-pointer group overflow-hidden"
                >
                  {/* Play Button Overlay */}
                  <div className="w-12 h-12 rounded-full bg-[#C99A3A] group-hover:scale-110 text-black flex items-center justify-center shadow-lg transition-transform z-10">
                    <Play className="w-5 h-5 fill-current translate-x-0.5" />
                  </div>

                  {/* Body Part Badge & Duration Badges */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-black bg-[#E6C978] px-2.5 py-0.5 rounded-full shadow-xs">
                      {ex.bodyPartLabel}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3 z-10">
                    <span className="text-[10px] font-mono font-bold text-white bg-black/70 px-2 py-0.5 rounded-md backdrop-blur-xs flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#C99A3A]" />
                      <span>{exVideo.videoDuration}</span>
                    </span>
                  </div>

                  {/* Subtle Vector Preview in Background */}
                  <div className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity flex items-center justify-center pointer-events-none">
                    <div className="text-white/20 font-black text-6xl select-none font-mono">
                      {ex.bodyPart.toUpperCase()}
                    </div>
                  </div>

                  {/* Bottom Strip in Thumbnail */}
                  <div className="absolute bottom-2 left-3 right-3 z-10 flex items-center justify-between text-[10px] text-white/80 font-mono">
                    <span>ICD-10: {ex.icd10Code}</span>
                    <span className="text-[#E6C978] font-bold">Watch Video ▶</span>
                  </div>
                </div>

                {/* Card Body Details */}
                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-[#77736A]">
                      <span className="font-semibold text-[#8E681C]">{exVideo.difficulty}</span>
                      <span>{ex.dosage}</span>
                    </div>

                    <h3 className="text-base font-bold text-[#252525] group-hover:text-[#8E681C] leading-snug">
                      {ex.name}
                    </h3>

                    <p className="text-xs text-[#5F5B52] line-clamp-2 leading-relaxed">
                      {ex.clinicalDiagnosis}
                    </p>
                  </div>

                  {/* Target Muscles & Safe Arc */}
                  <div className="p-3 bg-[#FAFAF7] rounded-xl border border-[#E8E4D8] text-[11px] space-y-1 text-[#3F3D38]">
                    <div className="font-semibold text-[#77736A] truncate">
                      Muscles: <span className="text-[#252525]">{ex.targetMuscles}</span>
                    </div>
                    <div className="text-[#8E681C] font-bold flex items-center gap-1">
                      <span>Safe ROM:</span>
                      <span className="text-[#252525] font-mono">{ex.safeRangeOfMotion}</span>
                    </div>
                  </div>

                  {/* Action Buttons Row */}
                  <div className="flex items-center gap-2 pt-2 border-t border-[#E8E4D8]">
                    <button
                      type="button"
                      onClick={() => handleSelectExerciseForVideo(ex.id)}
                      className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        isCurrentlySelected
                          ? 'bg-[#C99A3A] text-black shadow-xs'
                          : 'bg-[#FCF9F2] hover:bg-[#F7F1E1] text-[#8E681C] border border-[#E6C978]'
                      }`}
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>{isCurrentlySelected ? 'Viewing Video' : 'Watch Video'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSpeak(getAudioForExercise(ex))}
                      className="p-2 rounded-xl bg-white hover:bg-[#FAFAF7] text-[#77736A] hover:text-[#252525] border border-[#E8E4D8] cursor-pointer"
                      title="Listen to audio instructions"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>

                    {onStartExercise && (
                      <button
                        type="button"
                        onClick={() => onStartExercise(ex.name)}
                        className="p-2 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white cursor-pointer shadow-xs"
                        title="Practice with interactive rep counter"
                      >
                        <Play className="w-4 h-4 fill-current" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty Search State */}
        {filteredExercises.length === 0 && (
          <div className="p-12 text-center bg-white rounded-3xl border border-[#E8E4D8] space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#FCF9F2] text-[#8E681C] border border-[#E6C978] flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#252525]">No exercises found</h3>
            <p className="text-xs text-[#77736A] max-w-sm mx-auto">
              No matching exercise for "{searchQuery}". Try selecting "All Regions" or clearing your search term.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedBodyPart('all');
                setSelectedDifficulty('all');
              }}
              className="px-4 py-2 rounded-xl bg-[#C99A3A] text-black text-xs font-bold cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
