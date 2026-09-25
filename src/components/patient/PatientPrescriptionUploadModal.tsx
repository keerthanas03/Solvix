import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SAMPLE_PRESCRIPTION_SLIPS } from '../../data/mockData';
import { VisualBadge } from '../common/VisualBadges';
import { VisualGuideModal } from './VisualGuideModal';
import {
  X,
  UploadCloud,
  FileText,
  Camera,
  Sparkles,
  CheckCircle,
  Clock,
  Calendar,
  AlertCircle,
  Volume2,
  ChevronRight,
  ShieldCheck,
  Stethoscope,
  ArrowRight,
  RotateCcw,
  Eye,
} from 'lucide-react';
import { UploadedPrescription } from '../../types';

interface PatientPrescriptionUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PatientPrescriptionUploadModal: React.FC<PatientPrescriptionUploadModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    currentPatient,
    uploadAndAnalyzePrescription,
    activateSuggestedSchedule,
    speakText,
    language,
  } = useApp();

  const [selectedSample, setSelectedSample] = useState<string>(SAMPLE_PRESCRIPTION_SLIPS[0].id);
  const [customText, setCustomText] = useState<string>('');
  const [useCustomText, setUseCustomText] = useState<boolean>(false);
  const [uploadMode, setUploadMode] = useState<'sample' | 'custom' | 'file'>('sample');
  const [fileName, setFileName] = useState<string | null>(null);

  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisStep, setAnalysisStep] = useState<number>(0);
  const [analyzedResult, setAnalyzedResult] = useState<UploadedPrescription | null>(null);
  const [previewVisualGuideExercise, setPreviewVisualGuideExercise] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentSampleObj = SAMPLE_PRESCRIPTION_SLIPS.find((s) => s.id === selectedSample) || SAMPLE_PRESCRIPTION_SLIPS[0];

  const handleStartAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisStep(1);

    // Staged realistic progress for low-literacy clarity
    const timer1 = setTimeout(() => setAnalysisStep(2), 700);
    const timer2 = setTimeout(() => setAnalysisStep(3), 1400);

    const prescriptionPayload = useCustomText
      ? customText
      : currentSampleObj.rawText;

    try {
      const res = await uploadAndAnalyzePrescription(
        prescriptionPayload,
        useCustomText ? undefined : currentSampleObj.id,
        fileName || 'Prescription Slip Photo Scan'
      );

      setTimeout(() => {
        setIsAnalyzing(false);
        setAnalyzedResult(res.data);
      }, 1900);
    } catch {
      setIsAnalyzing(false);
    }

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  };

  const handleActivateSchedule = () => {
    if (analyzedResult) {
      activateSuggestedSchedule(analyzedResult.id);
      onClose();
    }
  };

  const handleReset = () => {
    setAnalyzedResult(null);
    setIsAnalyzing(false);
    setAnalysisStep(0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white border border-[#E8E4D8] rounded-3xl shadow-2xl p-5 sm:p-8 space-y-6 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#77736A] hover:text-[#252525] rounded-full hover:bg-[#F7F4EC] cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start gap-3.5 pr-8">
          <div className="w-12 h-12 rounded-2xl bg-[#FCF9F2] text-[#B8892D] border border-[#E6C978] flex items-center justify-center shrink-0">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8E681C] bg-[#FCF9F2] px-2.5 py-0.5 rounded-full border border-[#E6C978]">
                Patient Plan Intake
              </span>
              <VisualBadge type="ai_assisted_explanation" customText="AI SCHEDULE & TASK OPTIMIZER" size="sm" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#252525]">
              Upload Doctor / Physiotherapist Plan
            </h2>
            <p className="text-xs text-[#5F5B52] mt-0.5 leading-relaxed">
              Upload your doctor's clinical prescription slip. AI Co-Pilot reads the medical instructions, creates a routine schedule matching your work hours, and tracks daily task completion.
            </p>
          </div>
        </div>

        {/* State 1: Input / Selection State */}
        {!isAnalyzing && !analyzedResult && (
          <div className="space-y-5">
            {/* Step Selection Tabs */}
            <div className="grid grid-cols-3 gap-2 p-1.5 bg-[#FAFAF7] rounded-2xl border border-[#E8E4D8] text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setUploadMode('sample');
                  setUseCustomText(false);
                }}
                className={`py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  uploadMode === 'sample'
                    ? 'bg-white text-[#8E681C] shadow-xs border border-[#E6C978]'
                    : 'text-[#77736A] hover:text-[#252525]'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Doctor's Clinic Slip</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setUploadMode('file');
                  setUseCustomText(false);
                }}
                className={`py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  uploadMode === 'file'
                    ? 'bg-white text-[#8E681C] shadow-xs border border-[#E6C978]'
                    : 'text-[#77736A] hover:text-[#252525]'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Take Photo / Upload</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setUploadMode('custom');
                  setUseCustomText(true);
                }}
                className={`py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  uploadMode === 'custom'
                    ? 'bg-white text-[#8E681C] shadow-xs border border-[#E6C978]'
                    : 'text-[#77736A] hover:text-[#252525]'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Type Doctor's Note</span>
              </button>
            </div>

            {/* Mode A: Select Doctor Clinic Slip */}
            {uploadMode === 'sample' && (
              <div className="space-y-3">
                <label className="text-xs font-bold text-[#252525] block">
                  Select Clinic Prescription Slip to Analyze:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SAMPLE_PRESCRIPTION_SLIPS.map((sample) => (
                    <div
                      key={sample.id}
                      onClick={() => setSelectedSample(sample.id)}
                      className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                        selectedSample === sample.id
                          ? 'bg-[#FCF9F2] border-[#C99A3A] ring-2 ring-[#D8B15A]/40 shadow-xs'
                          : 'bg-white border-[#E8E4D8] hover:border-[#D8B15A]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-bold text-[#8E681C] uppercase tracking-wider">
                          {sample.clinicOrHospital}
                        </span>
                        <span className="text-[10px] text-[#77736A]">{sample.date}</span>
                      </div>
                      <div className="text-xs font-bold text-[#252525] mb-1">
                        {sample.title}
                      </div>
                      <div className="text-[11px] text-[#5F5B52]">
                        Prescriber: <span className="font-semibold">{sample.doctorName}</span>
                      </div>
                      <div className="text-[10px] text-[#77736A] mt-2 line-clamp-2 italic bg-white/70 p-1.5 rounded-lg border border-[#E8E4D8]">
                        "{sample.rawText.substring(0, 100)}..."
                      </div>
                    </div>
                  ))}
                </div>

                {/* Patient Context Tag */}
                <div className="p-3.5 bg-[#FAFAF7] rounded-2xl border border-[#E8E4D8] flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-[#252525]">Your Routine Constraints: </span>
                    <span className="text-[#5F5B52]">{currentPatient.dailyRoutine}</span>
                  </div>
                  <span className="text-[11px] font-bold text-[#8E681C] bg-[#FCF9F2] px-2 py-0.5 rounded-md border border-[#E6C978]">
                    Grocery Store 8AM-6PM
                  </span>
                </div>
              </div>
            )}

            {/* Mode B: Take Photo / Upload File */}
            {uploadMode === 'file' && (
              <div className="space-y-3">
                <div className="border-2 border-dashed border-[#D8B15A] bg-[#FCF9F2]/50 rounded-2xl p-6 sm:p-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-white text-[#B8892D] border border-[#E6C978] mx-auto flex items-center justify-center shadow-xs">
                    <Camera className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#252525]">
                      Capture Photo of Prescription Slip
                    </h3>
                    <p className="text-xs text-[#77736A] mt-0.5">
                      Ensure the doctor's name, exercise repetitions, and instructions are clearly visible.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <label className="px-4 py-2 bg-[#C99A3A] hover:bg-[#B8892D] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer inline-flex items-center gap-2">
                      <Camera className="w-4 h-4" />
                      <span>Take Photo / Choose File</span>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            setFileName(e.target.files[0].name);
                          }
                        }}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => setFileName('Knee_Prescription_Dr_Priya_24Sep.jpg')}
                      className="px-3 py-2 bg-white border border-[#E8E4D8] hover:border-[#D8B15A] text-xs font-semibold text-[#8E681C] rounded-xl cursor-pointer"
                    >
                      Use Demo Photo Slip
                    </button>
                  </div>

                  {fileName && (
                    <div className="mt-3 p-2.5 bg-white rounded-xl border border-[#BBF7D0] text-xs text-[#15803D] font-bold inline-flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>Loaded: {fileName}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Mode C: Custom Text */}
            {uploadMode === 'custom' && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#252525] block">
                  Paste or Type Doctor's Clinical Instructions:
                </label>
                <textarea
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  rows={4}
                  placeholder="e.g. Dr. Priya Raman prescribed: Active Knee Extension 3 sets x 10 reps with 3-second hold. Ankle pumps 2x15 BID. Pain-free arc only."
                  className="w-full p-3.5 bg-[#FAFAF7] rounded-2xl border border-[#E8E4D8] focus:border-[#C99A3A] focus:outline-none text-xs text-[#252525] leading-relaxed"
                />
              </div>
            )}

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-3 border-t border-[#E8E4D8]">
              <div className="flex items-center gap-1.5 text-[11px] text-[#77736A]">
                <ShieldCheck className="w-4 h-4 text-[#B8892D]" />
                <span>AI will extract verbatim clinical dosages & adapt schedule to your day</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl border border-[#E8E4D8] text-xs font-bold text-[#5F5B52] hover:bg-[#FAFAF7] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleStartAnalysis}
                  className="px-6 py-2.5 rounded-xl bg-[#C99A3A] hover:bg-[#B8892D] text-white text-xs font-bold shadow-md cursor-pointer flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Send to AI Co-Pilot</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* State 2: Analyzing State */}
        {isAnalyzing && (
          <div className="py-12 px-6 text-center space-y-6">
            <div className="relative w-16 h-16 mx-auto">
              <div className="w-16 h-16 rounded-full border-4 border-[#E6C978] border-t-[#B8892D] animate-spin" />
              <Sparkles className="w-6 h-6 text-[#B8892D] absolute inset-0 m-auto" />
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <h3 className="text-lg font-bold text-[#252525]">
                AI Co-Pilot is Analyzing Prescription
              </h3>
              <p className="text-xs text-[#5F5B52]">
                Please wait while we read the clinical dosage and coordinate with your grocery store schedule...
              </p>
            </div>

            {/* Stepped progress */}
            <div className="max-w-sm mx-auto space-y-2.5 text-left text-xs">
              <div className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition-all ${
                analysisStep >= 1 ? 'bg-[#FCF9F2] border-[#E6C978] text-[#8E681C] font-bold' : 'text-[#A9A59B]'
              }`}>
                <CheckCircle className={`w-4 h-4 ${analysisStep >= 1 ? 'text-[#15803D]' : 'text-[#A9A59B]'}`} />
                <span>1. Reading doctor's prescription slip & clinical parameters</span>
              </div>
              <div className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition-all ${
                analysisStep >= 2 ? 'bg-[#FCF9F2] border-[#E6C978] text-[#8E681C] font-bold' : 'text-[#A9A59B]'
              }`}>
                <CheckCircle className={`w-4 h-4 ${analysisStep >= 2 ? 'text-[#15803D]' : 'text-[#A9A59B]'}`} />
                <span>2. Analyzing daily routine (Work: 8 AM - 6 PM; 12h recovery spacing)</span>
              </div>
              <div className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition-all ${
                analysisStep >= 3 ? 'bg-[#FCF9F2] border-[#E6C978] text-[#8E681C] font-bold' : 'text-[#A9A59B]'
              }`}>
                <CheckCircle className={`w-4 h-4 ${analysisStep >= 3 ? 'text-[#15803D]' : 'text-[#A9A59B]'}`} />
                <span>3. Generating conflict-free schedule & low-literacy voice guides</span>
              </div>
            </div>
          </div>
        )}

        {/* State 3: Analysis Results with Suggested Schedule */}
        {analyzedResult && !isAnalyzing && (
          <div className="space-y-5 animate-in fade-in duration-200">
            {/* Success Banner */}
            <div className="p-4 bg-[#F0FDF4] rounded-2xl border border-[#BBF7D0] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-[#15803D] shrink-0" />
                <div>
                  <div className="text-xs font-bold text-[#15803D]">
                    Prescription Analyzed Successfully!
                  </div>
                  <div className="text-[11px] text-[#166534]">
                    From {analyzedResult.doctorName} • {analyzedResult.clinicalDiagnosis}
                  </div>
                </div>
              </div>
              <VisualBadge type="professional_instruction" customText="DOCTOR PRESCRIBED" size="sm" />
            </div>

            {/* Extracted Clinical Exercises (Verbatim Protection) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#252525] uppercase tracking-wider flex items-center gap-1.5">
                  <Stethoscope className="w-3.5 h-3.5 text-[#B8892D]" />
                  <span>Extracted Exercises from Doctor Slip</span>
                </span>
                <span className="text-[10px] text-[#77736A]">Clinical dosages preserved exactly</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {analyzedResult.extractedExercises.map((ex, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-[#FAFAF7] rounded-2xl border border-[#E8E4D8] space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#252525]">{ex.name}</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setPreviewVisualGuideExercise(ex.name)}
                          className="px-2 py-0.5 rounded-md bg-white border border-[#E6C978] hover:border-[#C99A3A] text-[#8E681C] text-[10px] font-bold cursor-pointer flex items-center gap-1 shadow-2xs"
                          title="Open visual movement guide"
                        >
                          <Eye className="w-3 h-3 text-[#B8892D]" />
                          <span>Visual Guide</span>
                        </button>
                        <span className="text-[10px] font-bold text-[#8E681C] bg-white px-2 py-0.5 rounded-md border border-[#E6C978]">
                          {ex.dosage}
                        </span>
                      </div>
                    </div>
                    <div className="text-[11px] text-[#5F5B52] leading-relaxed">
                      {ex.simpleInstructionEn}
                    </div>
                    {language === 'ta' && (
                      <div className="text-[11px] font-tamil text-[#8E681C] pt-1 border-t border-[#E8E4D8]/60 flex items-center justify-between">
                        <span>{ex.simpleInstructionTa}</span>
                        <button
                          onClick={() => speakText(ex.simpleInstructionTa, 'ta')}
                          className="p-1 text-[#B8892D] hover:bg-white rounded-md cursor-pointer shrink-0"
                          title="Listen in Tamil"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* AI Suggested Schedule (Highlight of User Flow) */}
            <div className="p-4 sm:p-5 bg-[#FCF9F2] rounded-3xl border-2 border-[#E6C978] space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-white text-[#B8892D] border border-[#D8B15A] flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#252525]">
                      AI-Suggested Personalized Schedule
                    </h3>
                    <p className="text-[11px] text-[#77736A]">
                      Optimized for grocery shop work hours (8:00 AM - 6:00 PM)
                    </p>
                  </div>
                </div>
                <VisualBadge type="ai_assisted_explanation" customText="AI SCHEDULE" size="sm" />
              </div>

              {/* Slot Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {analyzedResult.suggestedSchedule.map((slot, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-white rounded-2xl border border-[#E8E4D8] space-y-2 shadow-2xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold text-[#252525]">{slot.slotName}</div>
                      <div className="px-2.5 py-0.5 rounded-full bg-[#FAFAF7] border border-[#E6C978] text-[#8E681C] text-xs font-bold">
                        {slot.time}
                      </div>
                    </div>
                    <p className="text-[11px] text-[#5F5B52] leading-relaxed">
                      {slot.rationale}
                    </p>
                    <div className="text-[10px] text-[#77736A] font-semibold flex items-center gap-1">
                      <span>Exercises:</span>
                      <span className="text-[#252525]">{slot.exercises.join(', ')}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Explainable AI rationale box */}
              <div className="p-3 bg-white/80 rounded-xl border border-[#E8E4D8] text-[11px] text-[#5F5B52] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#B8892D] shrink-0" />
                <span>{analyzedResult.aiExplanation}</span>
              </div>
            </div>

            {/* Task Adherence & Verification Checkpoints Notice */}
            <div className="p-3.5 bg-[#FAFAF7] rounded-2xl border border-[#E8E4D8] space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#252525] flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-[#15803D]" />
                  <span>Continuous Task Adherence Tracking</span>
                </span>
                <span className="text-[10px] font-semibold text-[#8E681C]">Physiotherapist Oversight Enabled</span>
              </div>
              <p className="text-[11px] text-[#5F5B52] leading-relaxed">
                When you activate this schedule, daily task cards will guide you through each session with audio voice prompts. The AI will verify each completed exercise and automatically notify Dr. Priya Raman if any discomfort is reported.
              </p>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-[#E8E4D8]">
              <button
                type="button"
                onClick={handleReset}
                className="px-3 py-2 rounded-xl text-xs font-bold text-[#77736A] hover:text-[#252525] flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Upload Another Slip</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-[#E8E4D8] text-xs font-bold text-[#5F5B52] hover:bg-[#FAFAF7] cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleActivateSchedule}
                  className="px-6 py-2.5 rounded-xl bg-[#C99A3A] hover:bg-[#B8892D] text-white text-xs font-bold shadow-md cursor-pointer flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Confirm & Activate Schedule</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Visual Guide Modal Preview */}
      <VisualGuideModal
        isOpen={Boolean(previewVisualGuideExercise)}
        onClose={() => setPreviewVisualGuideExercise(null)}
        initialExerciseName={previewVisualGuideExercise || undefined}
      />
    </div>
  );
};
