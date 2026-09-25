import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GoldEmblem } from './common/GoldEmblem';
import {
  X,
  Presentation,
  ShieldCheck,
  Stethoscope,
  Sparkles,
  UserCheck,
  WifiOff,
  HeartHandshake,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';

export const JudgeModeModal: React.FC = () => {
  const { isJudgeModeOpen, setIsJudgeModeOpen, setIsGuidedDemoOpen } = useApp();
  const [activeTab, setActiveTab] = useState<'architecture' | 'impact'>('architecture');

  if (!isJudgeModeOpen) return null;

  const fiveSteps = [
    {
      step: '01',
      title: 'Clinical Recommendation',
      actor: 'Physiotherapist',
      desc: 'Prescribes evidence-based exercise, target repetitions, and pain-free boundaries (e.g. Knee extension 3x10).',
      badge: 'Professional Instruction',
      classes: 'border-[#BFDBFE] bg-[#F0F4F8] text-[#1E3A8A]',
    },
    {
      step: '02',
      title: 'AI Personalization',
      actor: 'AI Co-Pilot',
      desc: 'Simplifies terminology into vernacular Tamil/Hindi, generates spoken voice scripts, and fits daily working routines.',
      badge: 'AI-Generated Draft',
      classes: 'border-[#E6C978] bg-[#FCF9F2] text-[#8E681C]',
    },
    {
      step: '03',
      title: 'Human Approval & Signoff',
      actor: 'Physiotherapist',
      desc: 'Inspects explainable AI factors. Strictly decides whether to ACCEPT, EDIT, or REJECT before activation.',
      badge: 'Clinical Authority',
      classes: 'border-[#D8B15A] bg-[#FFF8E7] text-[#8E681C]',
    },
    {
      step: '04',
      title: 'Patient Participation',
      actor: 'Patient (Kumar R)',
      desc: 'Engages with low-literacy Simple Mode, listens to audio, follows single-task screens, even with intermittent connectivity.',
      badge: 'Patient Action',
      classes: 'border-[#BBF7D0] bg-[#F0FDF4] text-[#15803D]',
    },
    {
      step: '05',
      title: 'Feedback + Adaptation',
      actor: 'Human + AI Feedback Loop',
      desc: 'Captures difficulty & discomfort without diagnosing. Summarizes observations into therapist priority review queue.',
      badge: 'Human Review Required',
      classes: 'border-[#FCD34D] bg-[#FFFDF7] text-[#92400E]',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white border border-[#E8E4D8] rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={() => setIsJudgeModeOpen(false)}
          className="absolute top-4 right-4 p-2 text-[#77736A] hover:text-[#252525] rounded-full hover:bg-[#F7F4EC] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8E4D8] pb-4">
          <div className="flex items-center gap-3">
            <GoldEmblem size="md" withGlow />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#8E681C] bg-[#FCF9F2] px-2.5 py-0.5 rounded-full border border-[#E6C978]">
                  Judge & Evaluator Briefing
                </span>
                <span className="text-xs text-[#77736A] font-semibold">Hackathon Edition</span>
              </div>
              <h2 className="text-2xl font-bold text-[#252525] font-serif mt-0.5">
                RehabMitra AI Architecture & Impact Summary
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIsJudgeModeOpen(false);
                setIsGuidedDemoOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-[#C99A3A] hover:bg-[#B8892D] text-white text-xs font-bold shadow-xs cursor-pointer"
            >
              Start 12-Step Guided Walkthrough ▶
            </button>
          </div>
        </div>

        {/* 5-Step Visual Workflow */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold text-[#8E681C] uppercase tracking-wider flex items-center gap-2">
              <Presentation className="w-4 h-4 text-[#B8892D]" />
              <span>The 5-Step Closed-Loop Human-AI Collaboration</span>
            </div>
            <span className="text-xs text-[#77736A] font-medium">AI assists • Humans decide</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {fiveSteps.map((item, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-2xl border-2 flex flex-col justify-between space-y-3 ${item.classes}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-lg font-black">{item.step}</span>
                    <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/80 border">
                      {item.actor}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold leading-snug">{item.title}</h3>
                  <p className="text-[11px] mt-1.5 leading-relaxed text-[#3F3D38]">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-black/10 text-[10px] font-bold">
                  {item.badge}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Evidence-Based Clinical Dataset & Multi-Anatomical Coverage */}
        <div className="p-4 bg-gradient-to-r from-[#FFFBEB] via-[#FEF3C7] to-[#FDE68A]/30 rounded-2xl border-2 border-[#FDE68A] space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#92400E] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#D97706]" />
              <span>Real Clinical Dataset & Multi-Anatomical Biomechanical Visual Demos</span>
            </span>
            <span className="text-[11px] font-mono font-bold text-[#B45309]">8 Body Regions • ICD-10 Grounded</span>
          </div>
          <p className="text-xs text-[#78350F] leading-relaxed">
            RehabMitra AI now integrates real clinical physical therapy protocols across <strong>all major anatomical regions</strong> (Neck/Cervical, Shoulder/Rotator Cuff, Lumbar Spine/Core, Hip/Pelvis, Knee/Quadriceps, Ankle/Foot, Wrist/Hand, and Posture/Thoracic) backed by APTA and Cochrane Rehabilitation evidence guidelines, with live SVG vector movement animations and safe range-of-motion arcs in degrees.
          </p>
        </div>

        {/* 4 Pillars Summary Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {/* Pillar 1 */}
          <div className="p-4 rounded-2xl bg-[#FAFAF7] border border-[#E8E4D8] space-y-2">
            <div className="flex items-center gap-2 font-bold text-xs text-[#252525]">
              <Sparkles className="w-4 h-4 text-[#B8892D]" />
              <span>1. Explainable AI</span>
            </div>
            <p className="text-xs text-[#5F5B52] leading-relaxed">
              Every draft schedule explains <strong>why</strong> it was generated (matching patient Tamil, shop hours, home chair). No black box.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="p-4 rounded-2xl bg-[#FAFAF7] border border-[#E8E4D8] space-y-2">
            <div className="flex items-center gap-2 font-bold text-xs text-[#252525]">
              <ShieldCheck className="w-4 h-4 text-[#B8892D]" />
              <span>2. Non-Diagnostic Boundary</span>
            </div>
            <p className="text-xs text-[#5F5B52] leading-relaxed">
              AI never acts as a doctor. It refuses autonomous diagnoses and logs pain as "patient-reported discomfort" for clinician review.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="p-4 rounded-2xl bg-[#FAFAF7] border border-[#E8E4D8] space-y-2">
            <div className="flex items-center gap-2 font-bold text-xs text-[#252525]">
              <WifiOff className="w-4 h-4 text-[#B8892D]" />
              <span>3. Offline-First Resilience</span>
            </div>
            <p className="text-xs text-[#5F5B52] leading-relaxed">
              Full client caching via localStorage. Exercises and audio remain accessible without internet; feedback queues for automatic sync.
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="p-4 rounded-2xl bg-[#FAFAF7] border border-[#E8E4D8] space-y-2">
            <div className="flex items-center gap-2 font-bold text-xs text-[#252525]">
              <HeartHandshake className="w-4 h-4 text-[#B8892D]" />
              <span>4. Measurable Equity</span>
            </div>
            <p className="text-xs text-[#5F5B52] leading-relaxed">
              Enables low-digital-literacy and non-English-speaking patients to sustain recovery routines that fit real work-life schedules.
            </p>
          </div>
        </div>

        {/* Footer Guarantee */}
        <div className="p-4 bg-[#FCF9F2] rounded-2xl border border-[#E6C978] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#8E681C]">
          <div className="flex items-center gap-2 font-semibold">
            <ShieldCheck className="w-5 h-5 text-[#B8892D] shrink-0" />
            <span>
              <strong>Product Principle:</strong> AI assists. Professionals decide. Patients participate.
            </span>
          </div>
          <button
            onClick={() => setIsJudgeModeOpen(false)}
            className="px-4 py-2 rounded-xl bg-white border border-[#D8B15A] text-[#8E681C] font-bold text-xs hover:bg-[#F7F1E1] cursor-pointer"
          >
            Close Presentation
          </button>
        </div>
      </div>
    </div>
  );
};
