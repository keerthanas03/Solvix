import React from 'react';
import { useApp } from '../context/AppContext';
import { GoldEmblem } from './common/GoldEmblem';
import {
  X,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Stethoscope,
  User,
  CheckCircle2,
  WifiOff,
  Wifi,
  RefreshCw,
  Play,
  Volume2,
  Frown,
  Activity,
  ArrowRight,
} from 'lucide-react';

export const GuidedDemoModal: React.FC = () => {
  const {
    isGuidedDemoOpen,
    setIsGuidedDemoOpen,
    guidedDemoStep,
    setGuidedDemoStep,
    setUserRole,
    createDraftPlan,
    approveDraftPlan,
    completeExercise,
    toggleOffline,
    syncPendingNow,
    isOffline,
  } = useApp();

  if (!isGuidedDemoOpen) return null;

  const totalSteps = 12;

  const stepsData = [
    {
      step: 1,
      title: 'Physiotherapist Prescribes Recommendation',
      role: 'therapist' as const,
      description: 'Dr. Priya Raman prescribes "Knee Extension: 3 sets × 10 repetitions, twice daily within pain-free range."',
      actionText: 'Switch to Dr. Priya & Input Prescription',
      onAction: async () => {
        setUserRole('therapist');
      },
    },
    {
      step: 2,
      title: 'AI Co-Pilot Simplifies & Localizes',
      role: 'therapist' as const,
      description: 'RehabSathi AI analyzes Kumar\'s low digital literacy and Tamil language preference, generating simple step-by-step guidance.',
      actionText: 'Trigger AI Simplification Engine',
      onAction: async () => {
        setUserRole('therapist');
        await createDraftPlan(
          'Knee Extension',
          'Perform active knee extension within pain-free arc. Hold 3s.',
          '3 sets × 10 repetitions',
          'Twice daily'
        );
      },
    },
    {
      step: 3,
      title: 'Physiotherapist Inspects & Approves Draft',
      role: 'therapist' as const,
      description: 'Dr. Priya reviews the AI draft, inspects the 5 explainable factors, and officially clicks "APPROVE PLAN".',
      actionText: 'Approve & Activate Plan',
      onAction: async () => {
        setUserRole('therapist');
        approveDraftPlan();
      },
    },
    {
      step: 4,
      title: 'Patient Sees Simplified Home Plan',
      role: 'patient' as const,
      description: 'Kumar opens his app. He sees "Good Morning, Kumar 👋", his 65% progress, and the next activity formatted with simple Tamil audio prompts.',
      actionText: 'View Kumar\'s Mobile Home',
      onAction: async () => {
        setUserRole('patient');
      },
    },
    {
      step: 5,
      title: 'Patient Starts Exercise in Simple Mode',
      role: 'patient' as const,
      description: 'Kumar taps the large "START EXERCISE" button. Simple Mode guides him one step at a time with big audio buttons.',
      actionText: 'Experience Step-by-Step Guidance',
      onAction: async () => {
        setUserRole('patient');
      },
    },
    {
      step: 6,
      title: 'Patient Completes Exercise Session',
      role: 'patient' as const,
      description: 'Kumar completes his 10 repetitions smoothly. The app logs his activity adherence.',
      actionText: 'Simulate Exercise Completion',
      onAction: async () => {
        setUserRole('patient');
      },
    },
    {
      step: 7,
      title: 'Patient Reports Difficulty & Discomfort',
      role: 'patient' as const,
      description: 'Kumar selects "😣 Difficult" and records voice note: "Yesterday evening I found the knee exercise difficult."',
      actionText: 'Record Difficulty & Voice Note',
      onAction: async () => {
        setUserRole('patient');
        await completeExercise(
          'pe-1',
          'difficult',
          true,
          'Yesterday evening I found the knee exercise difficult and I could only complete half of it.',
          'voice'
        );
      },
    },
    {
      step: 8,
      title: 'AI Summarizes Feedback Without Diagnosing',
      role: 'therapist' as const,
      description: 'AI summarizes the raw voice note into an objective clinical observation: "Patient reported difficulty completing Knee Extension. Adherence: Partial. Requires review."',
      actionText: 'View AI Summary in Feedback Portal',
      onAction: async () => {
        setUserRole('therapist');
      },
    },
    {
      step: 9,
      title: 'Physiotherapist Reviews AI Flag',
      role: 'therapist' as const,
      description: 'Dr. Priya sees the yellow priority flag on her dashboard. She reviews the clinical note and decides whether to adjust the sets.',
      actionText: 'Review Flag on Clinical Dashboard',
      onAction: async () => {
        setUserRole('therapist');
      },
    },
    {
      step: 10,
      title: 'Simulate Intermittent Disconnection',
      role: 'patient' as const,
      description: 'Kumar enters a rural area without internet. The app instantly switches to Offline Mode with a clear banner.',
      actionText: 'Simulate Network Disconnection',
      onAction: async () => {
        setUserRole('patient');
        if (!isOffline) toggleOffline();
      },
    },
    {
      step: 11,
      title: 'Offline Continuity: Cache & Queued Feedback',
      role: 'patient' as const,
      description: 'Even offline, Kumar still accesses his approved plan and audio instructions. He completes another exercise, which safely queues locally.',
      actionText: 'Log Offline Completion',
      onAction: async () => {
        setUserRole('patient');
        await completeExercise('pe-2', 'okay', false, 'Completed offline midday stretch.', 'tap');
      },
    },
    {
      step: 12,
      title: 'Connection Restored & Automatic Sync',
      role: 'patient' as const,
      description: 'Internet returns. The system announces: "Connection restored — Syncing pending updates..." and marks all logs synchronized ✓.',
      actionText: 'Restore Connection & Auto-Sync',
      onAction: async () => {
        setUserRole('patient');
        if (isOffline) toggleOffline();
        await syncPendingNow();
      },
    },
  ];

  const currentStepData = stepsData[guidedDemoStep - 1] || stepsData[0];

  const handleNext = async () => {
    if (guidedDemoStep < totalSteps) {
      const nextStepNum = guidedDemoStep + 1;
      setGuidedDemoStep(nextStepNum);
      const nextData = stepsData[nextStepNum - 1];
      if (nextData && nextData.onAction) {
        await nextData.onAction();
      }
    } else {
      setIsGuidedDemoOpen(false);
    }
  };

  const handlePrev = async () => {
    if (guidedDemoStep > 1) {
      const prevStepNum = guidedDemoStep - 1;
      setGuidedDemoStep(prevStepNum);
      const prevData = stepsData[prevStepNum - 1];
      if (prevData && prevData.onAction) {
        await prevData.onAction();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white border border-[#E8E4D8] rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={() => setIsGuidedDemoOpen(false)}
          className="absolute top-4 right-4 p-2 text-[#77736A] hover:text-[#252525] rounded-full hover:bg-[#F7F4EC] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <GoldEmblem size="sm" withGlow />
          <div>
            <div className="text-xs font-bold text-[#8E681C] uppercase tracking-wider">
              Interactive Guided Demo Walkthrough
            </div>
            <h2 className="text-xl font-bold text-[#252525] font-serif">
              Step {currentStepData.step} of {totalSteps}: {currentStepData.title}
            </h2>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 bg-[#F7F4EC] rounded-full overflow-hidden border border-[#E8E4D8]">
          <div
            className="h-full bg-[#B8892D] transition-all duration-300"
            style={{ width: `${(guidedDemoStep / totalSteps) * 100}%` }}
          />
        </div>

        {/* Step description card */}
        <div className="p-5 rounded-2xl bg-[#FCF9F2] border border-[#E6C978] space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-[#8E681C]">
            <span>Active Perspective: {currentStepData.role === 'therapist' ? 'Dr. Priya Raman (Physiotherapist)' : 'Kumar R (Patient)'}</span>
            <span className="bg-white px-2 py-0.5 rounded-full border border-[#E6C978]">
              Step {currentStepData.step}
            </span>
          </div>

          <p className="text-sm text-[#252525] font-medium leading-relaxed">
            {currentStepData.description}
          </p>

          <div className="pt-2">
            <button
              onClick={currentStepData.onAction}
              className="w-full py-3 rounded-xl bg-white hover:bg-[#F7F1E1] border-2 border-[#D8B15A] text-[#8E681C] font-bold text-xs shadow-2xs transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[#B8892D]" />
              <span>{currentStepData.actionText}</span>
            </button>
          </div>
        </div>

        {/* Footer controls */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <button
            onClick={handlePrev}
            disabled={guidedDemoStep === 1}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#E8E4D8] text-xs font-bold text-[#5F5B52] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <span className="text-xs text-[#77736A] font-medium">
            {guidedDemoStep} / {totalSteps}
          </span>

          <button
            onClick={handleNext}
            className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-[#C99A3A] hover:bg-[#B8892D] text-white text-xs font-bold shadow-md transition-all cursor-pointer"
          >
            <span>{guidedDemoStep === totalSteps ? 'Finish Demo ✓' : 'Next Step'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
