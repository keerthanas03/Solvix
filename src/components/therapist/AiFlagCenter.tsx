import React from 'react';
import { useApp } from '../../context/AppContext';
import { VisualBadge } from '../common/VisualBadges';
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  ShieldAlert,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const AiFlagCenter: React.FC<{ onNavigateToPlanBuilder: () => void }> = ({
  onNavigateToPlanBuilder,
}) => {
  const { aiFlags, resolveFlag } = useApp();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-[#E8E4D8] p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider bg-[#FEF3C7] text-[#92400E] px-2.5 py-0.5 rounded-full border border-[#FCD34D]">
                Clinical Safety
              </span>
              <span className="text-xs text-[#77736A]">Active Flags: {aiFlags.filter((f) => f.status === 'requires_review').length}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#252525] font-serif">
              AI Flag Center
            </h1>
            <p className="text-sm text-[#5F5B52] mt-1">
              Automated alerts flagging patient difficulty, adherence drops, or offline syncs. Every item requires human oversight.
            </p>
          </div>

          <div className="flex items-center gap-2 p-3 bg-[#FCF9F2] rounded-2xl border border-[#E6C978] text-xs text-[#8E681C]">
            <ShieldAlert className="w-5 h-5 text-[#B8892D]" />
            <span>AI flags notify; only physiotherapists take clinical action.</span>
          </div>
        </div>
      </div>

      {/* Flag Cards */}
      <div className="space-y-4">
        {aiFlags.map((flag) => (
          <div
            key={flag.id}
            className={`bg-white rounded-3xl border-2 p-6 sm:p-7 shadow-xs transition-all ${
              flag.status === 'resolved'
                ? 'border-[#E8E4D8] opacity-70 bg-[#FAFAF7]'
                : flag.severity === 'priority'
                ? 'border-[#FCD34D] bg-[#FFFDF7]'
                : 'border-[#E8E4D8]'
            }`}
          >
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E8E4D8] pb-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${
                      flag.status === 'resolved'
                        ? 'bg-[#F0FDF4] text-[#15803D]'
                        : 'bg-[#FEF3C7] text-[#92400E]'
                    }`}
                  >
                    {flag.status === 'resolved' ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <AlertTriangle className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#252525]">{flag.title}</h3>
                    <div className="text-xs text-[#77736A] flex items-center gap-2 mt-0.5">
                      <span className="font-semibold text-[#252525]">{flag.patientName}</span>
                      <span>•</span>
                      <span>{new Date(flag.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {flag.status === 'requires_review' ? (
                    <VisualBadge type="human_review_required" size="sm" />
                  ) : (
                    <span className="text-xs font-bold text-[#15803D] bg-[#F0FDF4] px-2.5 py-1 rounded-lg border border-[#BBF7D0]">
                      ✓ Resolved by Therapist
                    </span>
                  )}
                </div>
              </div>

              {/* Description & Interpretation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-[#FAFAF7] border border-[#E8E4D8] space-y-1.5">
                  <div className="font-bold text-[#77736A] uppercase tracking-wider">
                    Reported Observation
                  </div>
                  <p className="text-[#3F3D38] leading-relaxed">{flag.description}</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#FCF9F2] border border-[#E6C978] space-y-1.5">
                  <div className="font-bold text-[#8E681C] uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#B8892D]" />
                    AI Interpretation & Recommended Action
                  </div>
                  <p className="text-[#252525] font-medium leading-relaxed">
                    {flag.aiInterpretation}
                  </p>
                  <p className="text-[#8E681C] pt-1">{flag.recommendedAction}</p>
                </div>
              </div>

              {/* Actions */}
              {flag.status === 'requires_review' && (
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    onClick={() => resolveFlag(flag.id)}
                    className="px-4 py-2 rounded-xl bg-white border border-[#E8E4D8] text-xs font-bold text-[#5F5B52] hover:bg-[#F7F4EC] transition-colors cursor-pointer"
                  >
                    Mark as Handled / Resolved
                  </button>

                  <button
                    onClick={onNavigateToPlanBuilder}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#C99A3A] hover:bg-[#B8892D] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                  >
                    <span>Review Plan in Co-Pilot</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
