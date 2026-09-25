import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { VisualBadge } from '../common/VisualBadges';
import {
  Sparkles,
  Stethoscope,
  CheckCircle,
  XCircle,
  Edit3,
  AlertCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  Check,
  RotateCcw,
  Volume2,
} from 'lucide-react';

export const AiPlanBuilder: React.FC = () => {
  const {
    currentPatient,
    activePlan,
    draftPlan,
    createDraftPlan,
    approveDraftPlan,
    rejectDraftPlan,
    isOffline,
  } = useApp();

  // Clinical input fields
  const [exerciseName, setExerciseName] = useState('Knee Extension');
  const [repetitions, setRepetitions] = useState('3 sets × 10 repetitions');
  const [frequency, setFrequency] = useState('Twice daily');
  const [clinicalNotes, setClinicalNotes] = useState(
    'Perform active knee extension within pain-free arc. Emphasize 3-second terminal hold as demonstrated in clinic.'
  );

  // Missing info check state
  const [missingInfo, setMissingInfo] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [planApprovedToast, setPlanApprovedToast] = useState(false);

  // Missing info validation
  const validateForm = () => {
    const missing: string[] = [];
    if (!exerciseName.trim()) missing.push('Exercise Name');
    if (!repetitions.trim()) missing.push('Repetitions / Sets');
    if (!frequency.trim()) missing.push('Daily Frequency');
    if (!clinicalNotes.trim()) missing.push('Clinical Execution Instructions');
    setMissingInfo(missing);
    return missing.length === 0;
  };

  const handleGenerateDraft = async () => {
    if (!validateForm()) return;

    setIsGenerating(true);
    await createDraftPlan(exerciseName, clinicalNotes, repetitions, frequency);
    setIsGenerating(false);
  };

  const handleApprove = () => {
    approveDraftPlan();
    setPlanApprovedToast(true);
    setTimeout(() => setPlanApprovedToast(false), 3500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-[#E8E4D8] p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider bg-[#FCF9F2] text-[#8E681C] px-2.5 py-0.5 rounded-full border border-[#E6C978]">
                Core Feature
              </span>
              <span className="text-xs text-[#77736A]">AI Co-Created Plan Builder</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#252525] font-serif">
              Co-Create Plan for {currentPatient.name}
            </h1>
            <p className="text-sm text-[#5F5B52] mt-1">
              Physiotherapist prescribes clinical intent. AI simplifies, translates, and formats around patient realities.
            </p>
          </div>

          <div className="p-3.5 bg-[#F0FDF4] rounded-2xl border border-[#BBF7D0] text-xs text-[#15803D] self-start md:self-auto">
            <div className="font-bold flex items-center gap-1 mb-0.5">
              <ShieldCheck className="w-4 h-4 text-[#15803D]" />
              <span>Human Approval Required</span>
            </div>
            <span>No AI draft goes to the patient without your signoff.</span>
          </div>
        </div>
      </div>

      {/* Success Notification */}
      {planApprovedToast && (
        <div className="p-4 bg-[#F0FDF4] rounded-2xl border-2 border-[#22C55E] text-[#15803D] flex items-center justify-between shadow-sm animate-in zoom-in-95">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 shrink-0" />
            <div>
              <div className="font-bold text-sm">Plan Approved and Activated!</div>
              <div className="text-xs">
                {currentPatient.name}'s mobile device will now display the updated schedule in {currentPatient.preferredLanguage === 'ta' ? 'Tamil' : 'English'}.
              </div>
            </div>
          </div>
          <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 bg-white rounded-lg border border-[#BBF7D0]">
            Version {activePlan.version} Live
          </span>
        </div>
      )}

      {/* Two Column Layout: Prescription Input vs Patient Context */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Step 1 - Physiotherapist Enters Recommendation */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-[#E8E4D8] p-6 sm:p-7 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-[#E8E4D8] pb-4">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-[#F0F4F8] text-[#1E3A8A] border border-[#BFDBFE] font-bold text-xs flex items-center justify-center">
                1
              </span>
              <h2 className="text-base font-bold text-[#252525]">
                Physiotherapist Clinical Prescription
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setExerciseName('Knee Extension');
                  setRepetitions('3 sets × 10 repetitions');
                  setFrequency('Twice daily');
                  setClinicalNotes('Perform active knee extension within pain-free arc. Emphasize 3-second terminal hold as demonstrated in clinic.');
                  setMissingInfo([]);
                }}
                className="text-[11px] font-bold text-[#8E681C] hover:underline cursor-pointer"
              >
                Reset Preset
              </button>
              <button
                type="button"
                onClick={() => {
                  setExerciseName('Knee exercises');
                  setRepetitions('');
                  setFrequency('');
                  setClinicalNotes('Knee exercises twice a day.');
                  setMissingInfo([
                    'Specific Anatomical Target (e.g. Knee Extension)',
                    'Repetitions & Hold Duration (e.g. 3 sets × 10 reps)',
                    'Technique Guidance (e.g. Pain-free arc, seating posture)'
                  ]);
                }}
                className="text-[11px] font-bold text-[#DC2626] bg-[#FEF2F2] border border-[#FECACA] px-2 py-0.5 rounded-md hover:bg-[#FEE2E2] cursor-pointer"
                title="Test AI Missing Information Detection Guard"
              >
                ⚠️ Test Missing Info Guard
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-[#3F3D38] block mb-1">
                Exercise Name & Joint Target
              </label>
              <select
                value={exerciseName}
                onChange={(e) => setExerciseName(e.target.value)}
                className="w-full p-3 text-sm bg-[#FAFAF7] rounded-xl border border-[#E8E4D8] focus:border-[#C99A3A] focus:outline-none"
              >
                <option value="Knee Extension">Knee Extension (Quadriceps recruitment)</option>
                <option value="Knee Flexion">Knee Flexion (Hamstring mobility)</option>
                <option value="Ankle Pumps">Ankle Pumps (Venous circulation)</option>
                <option value="Shoulder Rotation">Shoulder Rotation (Scapular mobility)</option>
                <option value="Seated Stretch">Seated Stretch (Thoracic spine rotation)</option>
                <option value="Gentle Breathing Exercise">Gentle Breathing Exercise (Relaxation)</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-[#3F3D38] block mb-1">
                  Repetitions & Sets
                </label>
                <input
                  type="text"
                  value={repetitions}
                  onChange={(e) => setRepetitions(e.target.value)}
                  placeholder="e.g. 3 sets × 10 repetitions"
                  className="w-full p-3 text-sm bg-[#FAFAF7] rounded-xl border border-[#E8E4D8] focus:border-[#C99A3A] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#3F3D38] block mb-1">
                  Frequency
                </label>
                <input
                  type="text"
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  placeholder="e.g. Twice daily"
                  className="w-full p-3 text-sm bg-[#FAFAF7] rounded-xl border border-[#E8E4D8] focus:border-[#C99A3A] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#3F3D38] block mb-1">
                Clinical Execution Instructions & Precautions
              </label>
              <textarea
                value={clinicalNotes}
                onChange={(e) => setClinicalNotes(e.target.value)}
                rows={3}
                placeholder="Prescribe clinical guidance for the AI to simplify..."
                className="w-full p-3 text-sm bg-[#FAFAF7] rounded-xl border border-[#E8E4D8] focus:border-[#C99A3A] focus:outline-none leading-relaxed"
              />
            </div>

            {/* Missing Info Warning */}
            {missingInfo.length > 0 && (
              <div className="p-3.5 bg-[#FEF2F2] rounded-xl border border-[#FECACA] text-xs text-[#DC2626] flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Clinical information required from physiotherapist:</span>
                  <ul className="list-disc pl-4 mt-1 space-y-0.5">
                    {missingInfo.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                  <p className="mt-1 text-[11px] text-[#7F1D1D]">
                    AI cannot invent clinical recommendations. Please provide required parameters.
                  </p>
                </div>
              </div>
            )}

            {/* Action to trigger AI Co-Pilot */}
            <div className="pt-2">
              <button
                onClick={handleGenerateDraft}
                disabled={isGenerating}
                className="w-full py-4 rounded-2xl bg-[#C99A3A] hover:bg-[#B8892D] disabled:opacity-60 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                <span>
                  {isGenerating
                    ? 'AI Co-Pilot is synthesizing patient context...'
                    : 'AI Co-Pilot: Generate Simplified Plan Draft'}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Step 2 - Patient Reality Context Engine */}
        <div className="lg:col-span-5 bg-[#FAFAF7] rounded-3xl border border-[#E8E4D8] p-6 sm:p-7 space-y-4">
          <div className="flex items-center justify-between border-b border-[#E8E4D8] pb-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-[#FCF9F2] text-[#8E681C] border border-[#E6C978] font-bold text-xs flex items-center justify-center">
                2
              </span>
              <h2 className="text-base font-bold text-[#252525]">
                Patient Context & Preferences
              </h2>
            </div>
            <VisualBadge type="patient_preference" size="sm" />
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-white rounded-xl border border-[#E8E4D8]">
              <div className="text-[#77736A] font-medium">Patient Name & Age</div>
              <div className="text-sm font-bold text-[#252525] mt-0.5">
                {currentPatient.name}, {currentPatient.age} y/o
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 bg-white rounded-xl border border-[#E8E4D8]">
                <div className="text-[#77736A] font-medium">Preferred Language</div>
                <div className="text-sm font-bold text-[#B8892D] mt-0.5">
                  {currentPatient.preferredLanguage === 'ta' ? 'Tamil (தமிழ்)' : currentPatient.preferredLanguage === 'hi' ? 'Hindi (हिंदी)' : 'English'}
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-[#E8E4D8]">
                <div className="text-[#77736A] font-medium">Digital Literacy</div>
                <div className="text-sm font-bold text-[#252525] mt-0.5">
                  {currentPatient.digitalLiteracy} (Voice-First)
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 bg-white rounded-xl border border-[#E8E4D8]">
                <div className="text-[#77736A] font-medium">Preferred Times</div>
                <div className="text-xs font-bold text-[#252525] mt-0.5">
                  {currentPatient.preferredTimes.join(' & ')}
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-[#E8E4D8]">
                <div className="text-[#77736A] font-medium">Connectivity</div>
                <div className="text-xs font-bold text-[#D97706] mt-0.5">
                  {currentPatient.connectivity}
                </div>
              </div>
            </div>

            <div className="p-3 bg-white rounded-xl border border-[#E8E4D8]">
              <div className="text-[#77736A] font-medium">Equipment at Home</div>
              <div className="text-xs font-bold text-[#252525] mt-0.5">
                {currentPatient.equipment}
              </div>
            </div>

            <div className="p-3 bg-white rounded-xl border border-[#E8E4D8]">
              <div className="text-[#77736A] font-medium">Daily Routine Constraint</div>
              <div className="text-xs text-[#3F3D38] mt-0.5 leading-snug">
                "{currentPatient.dailyRoutine}"
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Step 3 & 4: AI Draft Result with Plan Comparison and Explainability */}
      {draftPlan && (
        <div className="bg-[#FFFDF9] rounded-3xl border-2 border-[#D8B15A] p-6 sm:p-8 shadow-sm space-y-6 animate-in slide-in-from-bottom-4 duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E8E4D8] pb-4">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-[#FCF9F2] text-[#8E681C] border border-[#E6C978] font-bold text-sm flex items-center justify-center">
                3
              </span>
              <div>
                <h3 className="text-xl font-bold text-[#252525]">
                  AI-Generated Plan Draft (Awaiting Your Review)
                </h3>
                <p className="text-xs text-[#77736A]">
                  AI Co-Pilot tailored this schedule using {currentPatient.name}'s daily routine.
                </p>
              </div>
            </div>
            <VisualBadge type="ai_generated_draft" size="md" />
          </div>

          {/* Plan Comparison: Previous vs New Draft */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Box Left: Previous Approved Plan */}
            <div className="p-5 rounded-2xl bg-white border border-[#E8E4D8] space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-[#77736A]">
                <span>PREVIOUS PLAN (Version {activePlan.version})</span>
                <span className="text-[#15803D]">Currently in effect</span>
              </div>
              <div className="text-sm font-bold text-[#252525]">
                {activePlan.exercises[0]?.exerciseName} ({activePlan.exercises[0]?.timeSlot})
              </div>
              <p className="text-xs text-[#5F5B52] line-clamp-2">
                {activePlan.exercises[0]?.patientInstructionEn}
              </p>
              <div className="text-[11px] text-[#77736A] italic">
                {activePlan.previousPlanSummary || 'Standard clinical schedule.'}
              </div>
            </div>

            {/* Box Right: AI Proposed Draft */}
            <div className="p-5 rounded-2xl bg-[#FCF9F2] border-2 border-[#E6C978] space-y-3 shadow-2xs">
              <div className="flex items-center justify-between text-xs font-bold text-[#8E681C]">
                <span>NEW PROPOSED DRAFT (Version {draftPlan.version})</span>
                <span className="text-[#B8892D]">Needs Approval</span>
              </div>
              <div className="text-sm font-bold text-[#252525]">
                {draftPlan.exercises[0]?.exerciseName} (Fitted to {currentPatient.preferredTimes.join(' & ')})
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-[#E8E4D8] text-xs text-[#252525] space-y-1">
                <div className="font-bold text-[#8E681C]">Tamil Translation:</div>
                <p className="leading-relaxed">{draftPlan.exercises[0]?.patientInstructionTa}</p>
              </div>
              <div className="text-[11px] text-[#8E681C]">
                Audio script generated for one-tap speaker playback.
              </div>
            </div>
          </div>

          {/* Explainable AI: "Why did AI suggest this?" (No Black Box) */}
          <div className="p-5 bg-white rounded-2xl border border-[#E8E4D8] space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#8E681C] uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-[#B8892D]" />
              <span>Explainable AI: Why did AI suggest this draft format?</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#5F5B52]">
              {draftPlan.aiReasoningFactors?.map((factor, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-[#B8892D] font-bold">✓</span>
                  <span>{factor}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Decision Actions: ACCEPT, EDIT, REJECT */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-[#E8E4D8]">
            <div className="flex items-center gap-2 text-xs text-[#77736A]">
              <ShieldCheck className="w-4 h-4 text-[#B8892D]" />
              <span>Clinical responsibility remains with Dr. Priya Raman.</span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={rejectDraftPlan}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-[#FECACA] bg-white text-[#DC2626] font-bold text-xs hover:bg-[#FEF2F2] transition-colors cursor-pointer"
              >
                Reject Draft
              </button>

              <button
                onClick={() => alert('Opening draft fine-tuning editor...')}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-[#E8E4D8] bg-white text-[#5F5B52] font-bold text-xs hover:bg-[#F7F4EC] transition-colors cursor-pointer"
              >
                Edit Draft
              </button>

              <button
                onClick={handleApprove}
                className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-[#C99A3A] hover:bg-[#B8892D] text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>APPROVE & ACTIVATE PLAN</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
