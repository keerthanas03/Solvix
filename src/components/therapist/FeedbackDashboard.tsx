import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { VisualBadge } from '../common/VisualBadges';
import {
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  FileText,
  User,
  Clock,
  Volume2,
  ChevronDown,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { PatientFeedback } from '../../types';

export const FeedbackDashboard: React.FC<{ onNavigateToPlanBuilder: () => void }> = ({
  onNavigateToPlanBuilder,
}) => {
  const { feedbackList, addTherapistNoteToFeedback, speakText } = useApp();
  const [selectedFeedback, setSelectedFeedback] = useState<PatientFeedback | null>(null);
  const [noteInput, setNoteInput] = useState('');
  const [showNoteModal, setShowNoteModal] = useState(false);

  const handleOpenNoteModal = (fb: PatientFeedback) => {
    setSelectedFeedback(fb);
    setNoteInput(fb.therapistNotes || '');
    setShowNoteModal(true);
  };

  const handleSaveNote = () => {
    if (selectedFeedback) {
      addTherapistNoteToFeedback(selectedFeedback.id, noteInput);
      setShowNoteModal(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-[#E8E4D8] p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider bg-[#EFF6FF] text-[#1D4ED8] px-2.5 py-0.5 rounded-full border border-[#BFDBFE]">
                Feedback Intelligence
              </span>
              <span className="text-xs text-[#77736A]">Non-Diagnostic Summaries</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#252525] font-serif">
              Patient Feedback & Adherence Analysis
            </h1>
            <p className="text-sm text-[#5F5B52] mt-1">
              AI translates and summarizes patient voice/text into structured clinical observations without making medical diagnoses.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-[#8E681C] bg-[#FCF9F2] p-3 rounded-2xl border border-[#E6C978]">
            <ShieldCheck className="w-4 h-4 text-[#B8892D]" />
            <span>AI does not prescribe changes automatically.</span>
          </div>
        </div>
      </div>

      {/* Feedback List Cards */}
      <div className="space-y-4">
        {feedbackList.map((item) => (
          <div
            key={item.id}
            className={`bg-white rounded-3xl border-2 p-6 sm:p-7 shadow-xs transition-all ${
              item.discomfortReported || item.difficulty === 'difficult'
                ? 'border-[#FCD34D] bg-[#FFFDF7]'
                : 'border-[#E8E4D8]'
            }`}
          >
            <div className="space-y-4">
              {/* Top metadata */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E8E4D8] pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#F7F1E1] text-[#8E681C] font-bold text-xs flex items-center justify-center">
                    {item.patientName.charAt(0)}
                  </div>
                  <div>
                    <span className="text-sm font-bold text-[#252525]">{item.patientName}</span>
                    <span className="text-xs text-[#77736A] ml-2">
                      Exercise: <strong>{item.exerciseName}</strong>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {item.discomfortReported && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#DC2626] bg-[#FEF2F2] border border-[#FECACA] px-2.5 py-1 rounded-lg">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Discomfort Reported
                    </span>
                  )}
                  <VisualBadge type="human_review_required" size="sm" />
                </div>
              </div>

              {/* Side-by-Side: Raw Patient Input vs AI Objective Clinical Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left: Raw Voice / Text Input */}
                <div className="p-4 rounded-2xl bg-[#FAFAF7] border border-[#E8E4D8] space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-[#77736A]">
                    <span className="flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-[#B8892D]" />
                      RAW PATIENT FEEDBACK ({item.feedbackMethod.toUpperCase()})
                    </span>
                    <span className="text-[10px] text-[#A9A59B]">
                      {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-sm text-[#252525] font-serif italic leading-relaxed">
                    "{item.rawFeedback}"
                  </p>
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                    <div className="flex items-center gap-2 text-xs text-[#77736A]">
                      <span>Rated Difficulty:</span>
                      <span
                        className={`font-bold uppercase ${
                          item.difficulty === 'difficult'
                            ? 'text-[#DC2626]'
                            : item.difficulty === 'okay'
                            ? 'text-[#D97706]'
                            : 'text-[#15803D]'
                        }`}
                      >
                        {item.difficulty}
                      </span>
                    </div>

                    <button
                      onClick={() => speakText(item.rawFeedback, 'ta')}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FCF9F2] hover:bg-[#F7F1E1] border border-[#E6C978] text-[#8E681C] text-[11px] font-bold transition-colors cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-[#B8892D]" />
                      <span>Play Voice Recording</span>
                    </button>
                  </div>
                </div>

                {/* Right: AI Clinical Summary (Non-diagnostic) */}
                <div className="p-4 rounded-2xl bg-[#FCF9F2] border border-[#E6C978] space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-[#8E681C]">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#B8892D]" />
                      AI OBJECTIVE SUMMARY (NON-DIAGNOSTIC)
                    </span>
                    <span className="text-[10px] text-[#8E681C] bg-[#FFF8E7] px-2 py-0.5 rounded-full border border-[#E6C978]">
                      {item.aiSummary.adherenceImpact}
                    </span>
                  </div>
                  <p className="text-xs text-[#3F3D38] leading-relaxed">
                    <strong>Reported Issue:</strong> {item.aiSummary.feedbackSummary}
                  </p>
                  <div className="text-xs text-[#8E681C] font-medium pt-1 border-t border-[#E8E4D8]/60">
                    <strong>Suggested Action:</strong> {item.aiSummary.suggestedAction}
                  </div>
                </div>
              </div>

              {/* Therapist Note if added */}
              {item.therapistNotes && (
                <div className="p-3 bg-[#F0FDF4] rounded-xl border border-[#BBF7D0] text-xs text-[#15803D]">
                  <span className="font-bold">Clinical Note by Dr. Priya:</span> {item.therapistNotes}
                </div>
              )}

              {/* Actions: Review, Add Note, Modify Plan */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <span className="text-xs text-[#77736A]">
                  Review Status: {item.therapistReviewStatus === 'reviewed' ? '✓ Clinical Review Logged' : 'Pending Action'}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenNoteModal(item)}
                    className="px-4 py-2 rounded-xl bg-white border border-[#E8E4D8] text-xs font-bold text-[#5F5B52] hover:bg-[#F7F4EC] transition-colors cursor-pointer"
                  >
                    {item.therapistNotes ? 'Edit Clinical Note' : 'Add Clinical Note'}
                  </button>

                  <button
                    onClick={onNavigateToPlanBuilder}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#C99A3A] hover:bg-[#B8892D] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                  >
                    <span>Modify Plan in Co-Pilot</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Note Modal */}
      {showNoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-[#E8E4D8] p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-[#252525]">
              Add Clinical Note for {selectedFeedback?.patientName}
            </h3>
            <p className="text-xs text-[#77736A]">
              Record your professional assessment and next follow-up decision.
            </p>
            <textarea
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              placeholder="e.g. Discussed with patient. Chair height was too low. Advised 45cm chair."
              rows={4}
              className="w-full p-3 text-sm rounded-xl border border-[#E8E4D8] focus:border-[#C99A3A] focus:outline-none"
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowNoteModal(false)}
                className="px-4 py-2 rounded-xl border border-[#E8E4D8] text-xs font-bold text-[#5F5B52]"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNote}
                className="px-5 py-2 rounded-xl bg-[#B8892D] text-white text-xs font-bold shadow-xs"
              >
                Save Clinical Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
