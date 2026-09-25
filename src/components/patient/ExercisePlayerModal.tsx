import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PlanExercise } from '../../types';
import { VisualBadge } from '../common/VisualBadges';
import { ExerciseVisualCue } from './ExerciseVisualCue';
import { VisualGuideModal } from './VisualGuideModal';
import { REAL_CLINICAL_EXERCISE_DATASET } from '../../data/clinicalRehabilitationDataset';
import {
  X,
  Volume2,
  VolumeX,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Mic,
  MicOff,
  AlertCircle,
  ThumbsUp,
  Smile,
  Meh,
  Frown,
  RotateCcw,
  Eye,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ExercisePlayerModalProps {
  exercise: PlanExercise;
  onClose: () => void;
}

export const ExercisePlayerModal: React.FC<ExercisePlayerModalProps> = ({ exercise, onClose }) => {
  const {
    language,
    simpleMode,
    speakText,
    stopSpeaking,
    isSpeaking,
    completeExercise,
    isOffline,
  } = useApp();

  // Multi-step player
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(false);
  const [currentRep, setCurrentRep] = useState(1);
  const totalReps = 10;

  // Feedback State
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'okay' | 'difficult'>('okay');
  const [reportedDiscomfort, setReportedDiscomfort] = useState<boolean | null>(null);
  const [feedbackNotes, setFeedbackNotes] = useState('');
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showDetailedVisualGuide, setShowDetailedVisualGuide] = useState(false);

  // Match exercise with real clinical dataset
  const matchedClinical = REAL_CLINICAL_EXERCISE_DATASET.find(
    (e) =>
      e.name.toLowerCase().includes(exercise.exerciseName.toLowerCase()) ||
      exercise.exerciseName.toLowerCase().includes(e.name.toLowerCase())
  );

  // Localized texts & steps
  const steps = matchedClinical
    ? language === 'ta'
      ? matchedClinical.stepsTa
      : language === 'hi'
      ? matchedClinical.stepsHi
      : matchedClinical.stepsEn
    : language === 'ta'
    ? [
        'படி 1: நாற்காலியில் முதுகு சாய்ந்து வசதியாக அமரவும்.',
        'படி 2: உங்கள் காலை மெதுவாக முன்னோக்கி நேராக்கவும்.',
        'படி 3: சிரமமின்றி 3 வினாடிகள் அப்படியே வைக்கவும்.',
        'படி 4: உங்கள் பாதத்தை மெதுவாக தரைக்கு இறக்கவும்.',
        'படி 5: இதை நிதானமாக 10 முறை செய்யவும்.',
      ]
    : language === 'hi'
    ? [
        'चरण 1: कुर्सी पर पीठ को सहारा देकर आराम से बैठें।',
        'चरण 2: अपने पैर को धीरे-धीरे आगे सीधा करें।',
        'चरण 3: 3 सेकंड तक पैर को इसी स्थिति में रखें।',
        'चरण 4: पैर को धीरे से फर्श पर वापस लाएं।',
        'चरण 5: शांत गति से 10 बार दोहराएं।',
      ]
    : [
        'Step 1: Sit comfortably on a sturdy chair with back support.',
        'Step 2: Slowly straighten your leg forward until it is level.',
        'Step 3: Hold the position gently for 3 seconds without straining.',
        'Step 4: Slowly lower your foot back to the floor.',
        'Step 5: Repeat 10 times at a calm, relaxed pace.',
      ];

  const audioText = matchedClinical
    ? language === 'ta'
      ? matchedClinical.audioTa
      : language === 'hi'
      ? matchedClinical.audioHi
      : matchedClinical.audioEn
    : language === 'ta'
    ? exercise.audioScriptTa || steps[currentStepIndex]
    : language === 'hi'
    ? exercise.audioScriptHi || steps[currentStepIndex]
    : exercise.audioScriptEn || steps[currentStepIndex];

  const handleListen = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speakText(steps[currentStepIndex] || audioText, language);
    }
  };

  const handleNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      setCompletedSteps(true);
      // Trigger subtle celebratory confetti
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#D8B15A', '#C99A3A', '#B8892D', '#22C55E'],
        });
      } catch (e) {
        // ignore
      }
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  // Toggle Simulated Voice Recording
  const handleToggleVoiceRecording = () => {
    if (!isRecordingVoice) {
      setIsRecordingVoice(true);
      // Simulate real-time speech recognition
      setTimeout(() => {
        const simulatedVoiceText =
          language === 'ta'
            ? 'நான் இந்த பயிற்சியை செய்யும்போது முழங்காலில் லேசான சிரமத்தை உணர்ந்தேன்.'
            : 'I felt slight discomfort in my knee during repetition 6.';
        setFeedbackNotes((prev) => (prev ? `${prev} ${simulatedVoiceText}` : simulatedVoiceText));
        setIsRecordingVoice(false);
      }, 2500);
    } else {
      setIsRecordingVoice(false);
    }
  };

  const handleSubmitFeedback = async () => {
    await completeExercise(
      exercise.id,
      selectedDifficulty,
      Boolean(reportedDiscomfort),
      feedbackNotes,
      feedbackNotes ? 'voice' : 'tap'
    );
    setIsSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white border border-[#E8E4D8] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#E8E4D8] flex items-center justify-between bg-[#FAFAF7]">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-[#252525]">
                {exercise.exerciseName}
              </h2>
              {simpleMode && (
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#F7F1E1] text-[#8E681C] px-2 py-0.5 rounded-full border border-[#E6C978]">
                  Simple Mode
                </span>
              )}
            </div>
            <p className="text-xs text-[#77736A] mt-0.5">
              {exercise.timeSlot} • {exercise.repetitions}
            </p>
          </div>
          <button
            onClick={() => {
              stopSpeaking();
              onClose();
            }}
            className="p-2 text-[#77736A] hover:text-[#252525] rounded-full hover:bg-[#F7F4EC] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {!completedSteps ? (
            /* Exercise Steps Runner */
            <div className="space-y-6">
              {/* Dual Visual Transparency Label */}
              <div className="flex flex-wrap items-center gap-2">
                <VisualBadge type="ai_assisted_explanation" size="sm" />
                <VisualBadge type="professional_instruction" size="sm" />
              </div>

              {/* Progress Indicator */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-[#77736A]">
                  <span>Step {currentStepIndex + 1} of {steps.length}</span>
                  <span>{Math.round(((currentStepIndex + 1) / steps.length) * 100)}%</span>
                </div>
                <div className="w-full h-2 bg-[#F7F4EC] rounded-full overflow-hidden border border-[#E8E4D8]">
                  <div
                    className="h-full bg-[#B8892D] transition-all duration-300"
                    style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Main Step Instruction Card (Big & Low-literacy friendly) */}
              <div className="p-5 sm:p-7 bg-[#FCF9F2] rounded-3xl border-2 border-[#E6C978] shadow-xs text-center space-y-4">
                <ExerciseVisualCue
                  exerciseName={exercise.exerciseName}
                  bodyPart={matchedClinical?.visualCueType}
                />

                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white text-[#B8892D] border border-[#D8B15A] font-bold text-base shadow-2xs">
                  {currentStepIndex + 1}
                </div>

                <div className="text-xl sm:text-2xl font-bold text-[#252525] leading-relaxed">
                  {steps[currentStepIndex]}
                </div>

                {/* Voice Listen & Visual Guide Action Buttons */}
                <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
                  <button
                    onClick={handleListen}
                    className={`inline-flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm transition-all shadow-xs cursor-pointer ${
                      isSpeaking
                        ? 'bg-[#B8892D] text-white animate-pulse'
                        : 'bg-white hover:bg-[#F7F1E1] border-2 border-[#D8B15A] text-[#8E681C]'
                    }`}
                  >
                    {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#B8892D]" />}
                    <span>{isSpeaking ? 'Pause Audio' : '🔊 Listen Voice'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowDetailedVisualGuide(true)}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm bg-[#FCF9F2] hover:bg-[#F7F1E1] border-2 border-[#E6C978] text-[#8E681C] transition-all shadow-xs cursor-pointer"
                  >
                    <Eye className="w-4 h-4 text-[#B8892D]" />
                    <span>👁️ Visual Form Guide</span>
                  </button>
                </div>
              </div>

              {/* Repetition Counter Widget */}
              <div className="flex items-center justify-between p-4 bg-[#FAFAF7] rounded-2xl border border-[#E8E4D8]">
                <div className="text-left">
                  <div className="text-xs font-bold text-[#77736A] uppercase tracking-wider">
                    Target Repetitions
                  </div>
                  <div className="text-lg font-bold text-[#252525]">
                    Repetition <span className="text-[#B8892D]">{currentRep}</span> of {totalReps}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentRep((prev) => Math.max(1, prev - 1))}
                    className="w-10 h-10 rounded-xl bg-white border border-[#E8E4D8] text-lg font-bold text-[#77736A] hover:bg-[#F7F4EC] transition-colors cursor-pointer"
                  >
                    -
                  </button>
                  <button
                    onClick={() => setCurrentRep((prev) => Math.min(totalReps, prev + 1))}
                    className="w-10 h-10 rounded-xl bg-[#C99A3A] hover:bg-[#B8892D] text-white text-lg font-bold transition-colors cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Step Navigation Buttons */}
              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  onClick={handlePrevStep}
                  disabled={currentStepIndex === 0}
                  className="flex items-center gap-2 px-5 py-3.5 rounded-xl border border-[#E8E4D8] text-[#5F5B52] font-bold text-sm hover:bg-[#F7F4EC] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <button
                  onClick={handleNextStep}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#C99A3A] hover:bg-[#B8892D] text-white font-bold text-base shadow-md transition-all cursor-pointer"
                >
                  <span>{currentStepIndex === steps.length - 1 ? 'Finish Exercise ✓' : 'Next Step'}</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : !isSubmitted ? (
            /* Post-Exercise Feedback Form */
            <div className="space-y-6 text-center animate-in fade-in duration-300">
              <div className="w-14 h-14 rounded-full bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-2xl font-bold text-[#252525] font-serif">
                  Exercise Completed!
                </h3>
                <p className="text-sm text-[#77736A] mt-1">
                  How did this feel for you today?
                </p>
              </div>

              {/* Simple Difficulty Choices: Easy, Okay, Difficult */}
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => setSelectedDifficulty('easy')}
                  className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all cursor-pointer ${
                    selectedDifficulty === 'easy'
                      ? 'border-[#22C55E] bg-[#F0FDF4] text-[#15803D] scale-[1.02] shadow-xs'
                      : 'border-[#E8E4D8] hover:border-[#BBF7D0] bg-white text-[#5F5B52]'
                  }`}
                >
                  <Smile className="w-8 h-8 text-[#22C55E]" />
                  <span className="font-bold text-sm">😊 Easy</span>
                </button>

                <button
                  onClick={() => setSelectedDifficulty('okay')}
                  className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all cursor-pointer ${
                    selectedDifficulty === 'okay'
                      ? 'border-[#C99A3A] bg-[#FCF9F2] text-[#8E681C] scale-[1.02] shadow-xs'
                      : 'border-[#E8E4D8] hover:border-[#D8B15A] bg-white text-[#5F5B52]'
                  }`}
                >
                  <Meh className="w-8 h-8 text-[#C99A3A]" />
                  <span className="font-bold text-sm">😐 Okay</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedDifficulty('difficult');
                    setReportedDiscomfort(true);
                  }}
                  className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all cursor-pointer ${
                    selectedDifficulty === 'difficult'
                      ? 'border-[#EF4444] bg-[#FEF2F2] text-[#DC2626] scale-[1.02] shadow-xs'
                      : 'border-[#E8E4D8] hover:border-[#FCA5A5] bg-white text-[#5F5B52]'
                  }`}
                >
                  <Frown className="w-8 h-8 text-[#EF4444]" />
                  <span className="font-bold text-sm">😣 Difficult</span>
                </button>
              </div>

              {/* Discomfort Question */}
              <div className="p-4 bg-[#FAFAF7] rounded-2xl border border-[#E8E4D8] text-left space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-[#252525]">
                    Did you feel discomfort during this exercise?
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setReportedDiscomfort(false)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                        reportedDiscomfort === false
                          ? 'bg-[#15803D] text-white border-[#15803D]'
                          : 'bg-white text-[#5F5B52] border-[#E8E4D8]'
                      }`}
                    >
                      No
                    </button>
                    <button
                      onClick={() => setReportedDiscomfort(true)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                        reportedDiscomfort === true
                          ? 'bg-[#DC2626] text-white border-[#DC2626]'
                          : 'bg-white text-[#5F5B52] border-[#E8E4D8]'
                      }`}
                    >
                      Yes
                    </button>
                  </div>
                </div>

                {/* If Discomfort or Difficult: Tell Physiotherapist */}
                {(reportedDiscomfort || selectedDifficulty === 'difficult') && (
                  <div className="pt-2 border-t border-[#E8E4D8] space-y-2 animate-in fade-in">
                    <label className="text-xs font-bold text-[#B8892D] block">
                      What would you like to tell your physiotherapist? (Voice or Text)
                    </label>

                    <div className="relative">
                      <textarea
                        value={feedbackNotes}
                        onChange={(e) => setFeedbackNotes(e.target.value)}
                        placeholder="I found the knee exercise difficult yesterday..."
                        rows={2}
                        className="w-full p-3 text-sm bg-white rounded-xl border border-[#E8E4D8] focus:border-[#C99A3A] focus:outline-none"
                      />
                      <button
                        onClick={handleToggleVoiceRecording}
                        className={`absolute bottom-2 right-2 p-2 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                          isRecordingVoice
                            ? 'bg-[#DC2626] text-white animate-pulse'
                            : 'bg-[#FCF9F2] hover:bg-[#F7F1E1] text-[#8E681C] border border-[#E6C978]'
                        }`}
                        title="Speak your feedback"
                      >
                        {isRecordingVoice ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                        <span>{isRecordingVoice ? 'Listening...' : '🎤 Speak'}</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] text-[#77736A]">
                      <AlertCircle className="w-3.5 h-3.5 text-[#B8892D]" />
                      <span>
                        AI will summarize this for Dr. Priya Raman without diagnosing.
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Feedback */}
              <div className="pt-2">
                <button
                  onClick={handleSubmitFeedback}
                  className="w-full py-4 rounded-xl bg-[#C99A3A] hover:bg-[#B8892D] text-white font-bold text-base shadow-md transition-all cursor-pointer"
                >
                  Save Feedback & Log Session ✓
                </button>
              </div>
            </div>
          ) : (
            /* Success confirmation */
            <div className="py-12 text-center space-y-4 animate-in zoom-in duration-200">
              <div className="w-16 h-16 rounded-full bg-[#F0FDF4] text-[#15803D] flex items-center justify-center mx-auto border-2 border-[#22C55E]">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-[#252525]">
                {language === 'ta' ? 'பயிற்சி பதிவு செய்யப்பட்டது ✓' : 'Session Recorded ✓'}
              </h3>
              <p className="text-sm text-[#77736A]">
                {isOffline
                  ? 'Saved safely to your device. Will sync once connected.'
                  : 'Your physiotherapist has been notified.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Deep-dive Biomechanical Visual Guide Modal */}
      <VisualGuideModal
        isOpen={showDetailedVisualGuide}
        onClose={() => setShowDetailedVisualGuide(false)}
        initialExerciseName={exercise.exerciseName}
      />
    </div>
  );
};
