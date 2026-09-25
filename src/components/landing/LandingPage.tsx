import React from 'react';
import { useApp } from '../../context/AppContext';
import { GoldEmblem } from '../common/GoldEmblem';
import {
  Sparkles,
  Stethoscope,
  Volume2,
  Globe2,
  WifiOff,
  ShieldCheck,
  ArrowRight,
  HeartHandshake,
  CheckCircle,
  Clock,
  Smartphone,
  Eye,
  Activity,
  Presentation,
} from 'lucide-react';

export const LandingPage: React.FC<{ onExplore: () => void }> = ({ onExplore }) => {
  const { setUserRole, setIsGuidedDemoOpen, setIsJudgeModeOpen } = useApp();

  const handleStartRole = (role: 'patient' | 'therapist') => {
    setUserRole(role);
    onExplore();
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#252525] selection:bg-[#D8B15A]/30">
      {/* Top Hero Section */}
      <section className="relative pt-12 pb-20 overflow-hidden border-b border-[#E8E4D8]/60">
        {/* Soft Gold Radiance in Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-b from-[#E6C978]/15 via-[#F7F1E1]/20 to-transparent blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Emblem & Pre-heading */}
          <div className="flex justify-center mb-6">
            <GoldEmblem size="lg" withGlow />
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FCF9F2] border border-[#E6C978] text-[#8E681C] text-xs font-semibold uppercase tracking-wider mb-6 shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-[#B8892D]" />
            <span>AI assists. Humans decide. Patients participate.</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#252525] font-serif max-w-4xl mx-auto leading-[1.15]">
            Personalized Rehabilitation. <br />
            <span className="text-[#B8892D] underline decoration-[#E6C978]/60 decoration-wavy decoration-2">
              Human-Centered AI.
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-[#5F5B52] max-w-2xl mx-auto font-normal leading-relaxed">
            Helping physiotherapists and low-digital-literacy patients co-create, adapt, and sustain rehabilitation plans that fit real cultural routines.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <button
              onClick={() => {
                setIsGuidedDemoOpen(true);
                onExplore();
              }}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#C99A3A] hover:bg-[#B8892D] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Explore Interactive Demo</span>
            </button>

            <button
              onClick={() => handleStartRole('patient')}
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white hover:bg-[#FCF9F2] border border-[#D8B15A] text-[#8E681C] font-bold text-sm shadow-2xs transition-all cursor-pointer"
            >
              <span>Continue as Patient (Kumar)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => handleStartRole('therapist')}
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white hover:bg-[#F7F4EC] border border-[#E8E4D8] text-[#3F3D38] font-bold text-sm shadow-2xs transition-all cursor-pointer"
            >
              <Stethoscope className="w-4 h-4 text-[#B8892D]" />
              <span>Physiotherapist Dashboard</span>
            </button>
          </div>

          {/* Core Collaboration Visual Flow */}
          <div className="mt-16 max-w-4xl mx-auto bg-white rounded-3xl border border-[#E8E4D8] p-6 sm:p-8 shadow-xs">
            <div className="text-xs font-bold text-[#8E681C] uppercase tracking-widest mb-6 flex items-center justify-center gap-2">
              <Activity className="w-4 h-4 text-[#B8892D]" />
              <span>The Human-in-the-Loop Workflow Architecture</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center">
              {/* Box 1 */}
              <div className="p-4 rounded-2xl bg-[#F0F4F8] border border-[#BFDBFE] text-left">
                <div className="text-[10px] font-bold text-[#1E3A8A] uppercase tracking-wider mb-1">
                  Physiotherapist
                </div>
                <div className="text-sm font-bold text-[#252525]">Clinical Prescription</div>
                <p className="text-xs text-[#5F5B52] mt-1 leading-snug">
                  Prescribes exercise & technique boundaries
                </p>
              </div>

              {/* Arrow */}
              <div className="hidden md:flex justify-center text-[#B8892D]">
                <ArrowRight className="w-5 h-5" />
              </div>

              {/* Box 2 */}
              <div className="p-4 rounded-2xl bg-[#FCF9F2] border border-[#E6C978] text-left">
                <div className="text-[10px] font-bold text-[#8E681C] uppercase tracking-wider mb-1">
                  AI Co-Pilot
                </div>
                <div className="text-sm font-bold text-[#252525]">Simplification & Draft</div>
                <p className="text-xs text-[#5F5B52] mt-1 leading-snug">
                  Translates into Tamil/Hindi, voice scripts, fits routine
                </p>
              </div>

              {/* Arrow */}
              <div className="hidden md:flex justify-center text-[#B8892D]">
                <ArrowRight className="w-5 h-5" />
              </div>

              {/* Box 3 */}
              <div className="p-4 rounded-2xl bg-[#F0FDF4] border border-[#BBF7D0] text-left">
                <div className="text-[10px] font-bold text-[#15803D] uppercase tracking-wider mb-1">
                  Patient
                </div>
                <div className="text-sm font-bold text-[#252525]">Participation & Feedback</div>
                <p className="text-xs text-[#5F5B52] mt-1 leading-snug">
                  Listens to voice, records difficulty, offline sync
                </p>
              </div>
            </div>

            {/* Bottom Loop statement */}
            <div className="mt-6 pt-4 border-t border-[#E8E4D8] flex flex-wrap items-center justify-between gap-2 text-xs text-[#77736A]">
              <div className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-4 h-4 text-[#B8892D]" />
                <span>AI never changes clinical treatment without explicit physiotherapist approval.</span>
              </div>
              <div className="font-bold text-[#8E681C]">
                Evidence-Based • Explainable AI • Low-Literacy Friendly
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Six Pillars Section */}
      <section className="py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#252525]">
            Built for Real-World Rehabilitation Equity
          </h2>
          <p className="mt-2 text-sm text-[#77736A] max-w-xl mx-auto">
            Addressing the critical barriers that prevent low-literacy and rural patients from sticking to recovery plans.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white rounded-2xl border border-[#E8E4D8] p-6 shadow-xs hover:border-[#D8B15A] transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#FCF9F2] text-[#8E681C] flex items-center justify-center mb-4">
              <Sparkles className="w-5 h-5 text-[#B8892D]" />
            </div>
            <h3 className="text-base font-bold text-[#252525]">Clinical Simplification</h3>
            <p className="text-xs text-[#5F5B52] mt-2 leading-relaxed">
              Transforms medical terminology ("active terminal quadriceps extension") into clear, bite-sized daily instructions without losing clinical fidelity.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl border border-[#E8E4D8] p-6 shadow-xs hover:border-[#D8B15A] transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#F0FDF4] text-[#15803D] flex items-center justify-center mb-4">
              <Smartphone className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#252525]">Simple Mode for Low Digital Literacy</h3>
            <p className="text-xs text-[#5F5B52] mt-2 leading-relaxed">
              Single-task screens, large 56px touch targets, high contrast, zero clutter, and clear step-by-step progress prompts.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl border border-[#E8E4D8] p-6 shadow-xs hover:border-[#D8B15A] transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#1D4ED8] flex items-center justify-center mb-4">
              <Globe2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#252525]">Multilingual & Voice-First</h3>
            <p className="text-xs text-[#5F5B52] mt-2 leading-relaxed">
              Full localized support in Tamil, Hindi, and English with one-tap audio read-aloud and spoken voice feedback recording.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-2xl border border-[#E8E4D8] p-6 shadow-xs hover:border-[#D8B15A] transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#FEF3C7] text-[#92400E] flex items-center justify-center mb-4">
              <WifiOff className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#252525]">Offline-First Resilience</h3>
            <p className="text-xs text-[#5F5B52] mt-2 leading-relaxed">
              Approved plans and voice guidance remain 100% accessible during intermittent rural connectivity. Feedback queues locally and synchronizes automatically.
            </p>
          </div>

          {/* Card 5 */}
          <div className="bg-white rounded-2xl border border-[#E8E4D8] p-6 shadow-xs hover:border-[#D8B15A] transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#F5F3FF] text-[#6D28D9] flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#252525]">Human-in-the-Loop Safety</h3>
            <p className="text-xs text-[#5F5B52] mt-2 leading-relaxed">
              Strict non-diagnostic boundary. The AI acts as an administrative co-pilot; all clinical decisions and plan alterations require therapist signoff.
            </p>
          </div>

          {/* Card 6 */}
          <div className="bg-white rounded-2xl border border-[#E8E4D8] p-6 shadow-xs hover:border-[#D8B15A] transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#F7F1E1] text-[#8E681C] flex items-center justify-center mb-4">
              <Eye className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#252525]">Explainable AI Reasons</h3>
            <p className="text-xs text-[#5F5B52] mt-2 leading-relaxed">
              No black-box recommendations. Every AI draft clearly lists the patient's language, work schedule, and equipment constraints that shaped the suggestion.
            </p>
          </div>
        </div>
      </section>

      {/* Social Impact Section ("Why RehabSathi?") */}
      <section className="py-16 bg-[#F7F4EC]/60 border-t border-b border-[#E8E4D8]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl border border-[#E8E4D8] p-8 sm:p-12 shadow-xs">
            <div className="text-xs font-bold text-[#B8892D] uppercase tracking-wider mb-2">
              Social Impact & Purpose
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#252525]">
              Why RehabSathi AI?
            </h2>
            <p className="mt-4 text-sm sm:text-base text-[#5F5B52] leading-relaxed">
              Many patients struggle not because rehabilitation instructions are unavailable, but because traditional paper handouts or complex smartphone portals fail to accommodate their language, daily manual labor hours, low digital confidence, or patchy rural internet.
            </p>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: 'Better Understanding', desc: 'Step-by-step guidance in everyday vernacular language.' },
                { title: 'Greater Patient Participation', desc: 'Empowers patients to share honest comfort feedback via voice.' },
                { title: 'Reduced Communication Barriers', desc: 'Tamil, Hindi, and English support removes linguistic isolation.' },
                { title: 'Zero Hardware Dependency', desc: 'No costly smartwatches or sensors required; runs on standard smartphones.' },
                { title: 'Therapist Time Efficiency', desc: 'Cuts routine schedule drafting time from 15 minutes to under 60 seconds.' },
                { title: 'Continuous Care Continuity', desc: 'Offline storage prevents dropouts during power cuts or travel.' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3.5 rounded-xl bg-[#FAFAF7] border border-[#E8E4D8]">
                  <CheckCircle className="w-5 h-5 text-[#B8892D] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-bold text-[#252525]">{item.title}</div>
                    <div className="text-xs text-[#77736A] mt-0.5">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-[#E8E4D8]">
              <div className="flex items-center gap-3">
                <GoldEmblem size="sm" />
                <span className="text-xs font-semibold text-[#5F5B52]">
                  Designed for Hospitals, Rehabilitation Centers, NGOs & Public Healthcare.
                </span>
              </div>
              <button
                onClick={onExplore}
                className="px-5 py-2.5 rounded-xl bg-[#B8892D] hover:bg-[#8E681C] text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Launch Prototype Workspace
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 text-center text-xs text-[#77736A]">
        <div className="flex justify-center mb-3">
          <GoldEmblem size="xs" />
        </div>
        <p className="font-bold text-[#252525]">RehabSathi AI — Human-Centered Rehabilitation Co-Pilot</p>
        <p className="mt-1">AI assists. Professionals decide. Patients participate.</p>
      </footer>
    </div>
  );
};
