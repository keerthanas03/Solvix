import React from 'react';
import { useApp } from '../context/AppContext';
import { GoldEmblem } from './common/GoldEmblem';
import {
  X,
  Sparkles,
  ShieldCheck,
  Languages,
  UserCheck,
  MessageSquare,
  AlertTriangle,
  HeartHandshake,
  CheckCircle2,
} from 'lucide-react';

export const HowAiHelpsModal: React.FC = () => {
  const { isHowAiHelpsOpen, setIsHowAiHelpsOpen } = useApp();

  if (!isHowAiHelpsOpen) return null;

  const fiveCards = [
    {
      num: '01',
      title: 'Simplifies Instructions',
      desc: 'Translates dense clinical biomechanical instructions into bite-sized everyday terms without losing clinical accuracy.',
      icon: Sparkles,
    },
    {
      num: '02',
      title: 'Adapts Communication',
      desc: 'Localizes into regional vernacular (Tamil, Hindi, English) and generates natural spoken audio scripts for voice-first guidance.',
      icon: Languages,
    },
    {
      num: '03',
      title: 'Understands Patient Preferences',
      desc: 'Respects daily shop working hours, evening rest times, low digital confidence, and zero-equipment home setups.',
      icon: UserCheck,
    },
    {
      num: '04',
      title: 'Summarizes Feedback',
      desc: 'Distills patient speech and text into objective observations, separating reported discomfort from clinical diagnosis.',
      icon: MessageSquare,
    },
    {
      num: '05',
      title: 'Identifies Missing Information',
      desc: 'Checks if prescriptions lack repetitions or frequency, prompting clinicians before drafting rather than hallucinating details.',
      icon: AlertTriangle,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white border border-[#E8E4D8] rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={() => setIsHowAiHelpsOpen(false)}
          className="absolute top-4 right-4 p-2 text-[#77736A] hover:text-[#252525] rounded-full hover:bg-[#F7F4EC] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3">
          <GoldEmblem size="sm" withGlow />
          <div>
            <div className="text-xs font-bold text-[#8E681C] uppercase tracking-wider">
              Transparency & Human Oversight
            </div>
            <h2 className="text-2xl font-bold text-[#252525] font-serif">
              How AI Helps in RehabMitra
            </h2>
          </div>
        </div>

        {/* 5 Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {fiveCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <div
                key={i}
                className="p-4 rounded-2xl bg-[#FAFAF7] border border-[#E8E4D8] hover:border-[#D8B15A] transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-base font-black text-[#B8892D]">{card.num}</span>
                  <div className="w-8 h-8 rounded-xl bg-[#FCF9F2] text-[#8E681C] border border-[#E6C978] flex items-center justify-center">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-sm font-bold text-[#252525]">{card.title}</h3>
                <p className="text-xs text-[#5F5B52] leading-relaxed">{card.desc}</p>
              </div>
            );
          })}

          {/* 6th Card: Boundary Card */}
          <div className="p-4 rounded-2xl bg-[#FCF9F2] border-2 border-[#E6C978] flex flex-col justify-between space-y-2">
            <div>
              <div className="text-base font-black text-[#8E681C]">06</div>
              <h3 className="text-sm font-bold text-[#8E681C] mt-1">
                AI Does NOT Replace the Physiotherapist
              </h3>
              <p className="text-xs text-[#3F3D38] mt-1 leading-relaxed">
                The AI does not diagnose pathologies, predict medical recovery dates, or modify treatments independently.
              </p>
            </div>
            <div className="text-[10px] font-bold text-[#8E681C] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#B8892D]" />
              <span>Strict Clinician Governance</span>
            </div>
          </div>
        </div>

        {/* Human-AI Collaboration Visual Flow */}
        <div className="p-5 rounded-2xl bg-white border-2 border-[#E8E4D8] text-center space-y-4">
          <div className="text-xs font-bold text-[#8E681C] uppercase tracking-wider">
            Closed-Loop Collaboration Cycle
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-3 bg-[#F0FDF4] rounded-xl border border-[#BBF7D0]">
              <div className="font-bold text-[#15803D]">PATIENT</div>
              <div className="text-[11px] text-[#5F5B52]">Preferences + Feedback</div>
            </div>
            <div className="p-3 bg-[#FCF9F2] rounded-xl border border-[#E6C978]">
              <div className="font-bold text-[#8E681C]">AI CO-PILOT</div>
              <div className="text-[11px] text-[#5F5B52]">Translate + Simplify + Organize</div>
            </div>
            <div className="p-3 bg-[#F0F4F8] rounded-xl border border-[#BFDBFE]">
              <div className="font-bold text-[#1E3A8A]">PHYSIOTHERAPIST</div>
              <div className="text-[11px] text-[#5F5B52]">Review + Approve + Decide</div>
            </div>
            <div className="p-3 bg-[#FFFDF7] rounded-xl border border-[#FCD34D]">
              <div className="font-bold text-[#92400E]">APPROVED PLAN</div>
              <div className="text-[11px] text-[#5F5B52]">Delivered to Patient</div>
            </div>
          </div>

          <div className="pt-2 text-sm font-bold text-[#252525] font-serif">
            "AI assists. Professionals decide. Patients participate."
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          <button
            onClick={() => setIsHowAiHelpsOpen(false)}
            className="px-6 py-2.5 rounded-xl bg-[#C99A3A] hover:bg-[#B8892D] text-white text-xs font-bold shadow-xs cursor-pointer"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};
