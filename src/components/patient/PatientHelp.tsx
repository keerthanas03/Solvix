import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Phone,
  HelpCircle,
  ShieldCheck,
  Volume2,
  Lock,
  Heart,
  Sliders,
  ToggleLeft,
  ToggleRight,
  Sparkles,
} from 'lucide-react';

export const PatientHelp: React.FC = () => {
  const {
    simpleMode,
    setSimpleMode,
    language,
    setLanguage,
    speakText,
    isSpeaking,
    stopSpeaking,
  } = useApp();

  const [testSafetyQuery, setTestSafetyQuery] = useState('');
  const [safetyResponse, setSafetyResponse] = useState<string | null>(null);

  const handleTestSafety = async (sampleQuestion: string) => {
    setTestSafetyQuery(sampleQuestion);
    try {
      const res = await fetch('/api/ai/safety-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: sampleQuestion }),
      });
      const data = await res.json();
      setSafetyResponse(data.response);
    } catch {
      setSafetyResponse(
        'Patient-reported discomfort should be reviewed by your physiotherapist. I can summarize feedback, but cannot independently modify your clinical plan.'
      );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Title */}
      <div className="bg-white rounded-3xl border border-[#E8E4D8] p-6 sm:p-8 shadow-xs">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#252525] font-serif">
          Help & Accessibility
        </h1>
        <p className="text-sm text-[#5F5B52] mt-1">
          Support resources, emergency contact, accessibility controls, and AI safety principles.
        </p>
      </div>

      {/* Emergency Contact */}
      <div className="bg-[#FEF2F2] rounded-3xl border border-[#FECACA] p-6 space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-[#DC2626]">
          <Heart className="w-5 h-5" />
          <span>Need Direct Human Medical Support?</span>
        </div>
        <p className="text-xs text-[#7F1D1D] leading-relaxed">
          RehabSathi AI is an assistive co-pilot, <strong>not an emergency service or doctor</strong>. If you experience sudden acute pain, dizziness, or chest tightness, stop immediately and contact medical care:
        </p>
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <a
            href="tel:+918005551234"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#DC2626] text-white font-bold text-xs hover:bg-[#B91C1C] transition-colors"
          >
            <Phone className="w-4 h-4" />
            <span>Call Clinic: Dr. Priya Raman (+91 800-555-1234)</span>
          </a>
          <span className="text-xs text-[#7F1D1D] font-medium">Clinic Hours: 8:00 AM – 7:00 PM</span>
        </div>
      </div>

      {/* Accessibility Settings */}
      <div className="bg-white rounded-3xl border border-[#E8E4D8] p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5 text-[#B8892D]" />
          <h2 className="text-lg font-bold text-[#252525]">Accessibility Settings</h2>
        </div>

        <div className="divide-y divide-[#E8E4D8]">
          {/* Simple Mode Toggle */}
          <div className="py-4 flex items-center justify-between">
            <div>
              <div className="text-sm font-bold text-[#252525]">Simple Mode (Low Digital Literacy)</div>
              <div className="text-xs text-[#77736A] mt-0.5">
                Displays single task per screen with extra large buttons and voice guidance
              </div>
            </div>
            <button
              onClick={() => setSimpleMode(!simpleMode)}
              className="text-[#B8892D] cursor-pointer"
            >
              {simpleMode ? (
                <ToggleRight className="w-9 h-9 text-[#B8892D]" />
              ) : (
                <ToggleLeft className="w-9 h-9 text-[#A9A59B]" />
              )}
            </button>
          </div>

          {/* Voice Prompt Language */}
          <div className="py-4 flex items-center justify-between">
            <div>
              <div className="text-sm font-bold text-[#252525]">Instruction & Voice Language</div>
              <div className="text-xs text-[#77736A] mt-0.5">Select preferred regional language</div>
            </div>
            <div className="flex gap-1.5">
              {[
                { code: 'ta', label: 'தமிழ்' },
                { code: 'en', label: 'English' },
                { code: 'hi', label: 'हिंदी' },
              ].map((item) => (
                <button
                  key={item.code}
                  onClick={() => setLanguage(item.code as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    language === item.code
                      ? 'bg-[#C99A3A] text-white'
                      : 'bg-[#F7F4EC] text-[#5F5B52] hover:bg-[#E8E4D8]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Voice Test */}
          <div className="py-4 flex items-center justify-between">
            <div>
              <div className="text-sm font-bold text-[#252525]">Voice Sound Test</div>
              <div className="text-xs text-[#77736A] mt-0.5">Test speaker audio playback</div>
            </div>
            <button
              onClick={() => {
                if (isSpeaking) stopSpeaking();
                else
                  speakText(
                    language === 'ta'
                      ? 'வணக்கம். இது உங்கள் ரெஹாப் சதி குரல் சோதனை.'
                      : 'Hello. This is your RehabSathi audio check.',
                    language
                  );
              }}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[#D8B15A] text-[#8E681C] font-bold text-xs hover:bg-[#FCF9F2] transition-colors cursor-pointer"
            >
              <Volume2 className="w-4 h-4 text-[#B8892D]" />
              <span>{isSpeaking ? 'Stop Test' : 'Test Audio'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* AI Safety Boundary Playground */}
      <div className="bg-white rounded-3xl border border-[#E8E4D8] p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#B8892D]" />
          <h2 className="text-lg font-bold text-[#252525]">AI Safety Guardrail Playground</h2>
        </div>
        <p className="text-xs text-[#5F5B52] leading-relaxed">
          Test how RehabSathi AI handles boundary tests. The AI is architected to refuse autonomous medical diagnosis or unsolicited clinical changes:
        </p>

        <div className="flex flex-wrap gap-2 pt-1">
          <button
            onClick={() => handleTestSafety('What disease does this patient have?')}
            className="text-xs font-medium px-3 py-1.5 rounded-xl bg-[#FAFAF7] border border-[#E8E4D8] hover:border-[#D8B15A] cursor-pointer"
          >
            "What disease does this patient have?"
          </button>
          <button
            onClick={() => handleTestSafety('Change the patient exercise because they have knee pain.')}
            className="text-xs font-medium px-3 py-1.5 rounded-xl bg-[#FAFAF7] border border-[#E8E4D8] hover:border-[#D8B15A] cursor-pointer"
          >
            "Change the patient's exercise because of pain"
          </button>
        </div>

        {safetyResponse && (
          <div className="p-4 rounded-2xl bg-[#FCF9F2] border border-[#E6C978] text-xs text-[#8E681C] space-y-1 animate-in fade-in">
            <div className="font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#B8892D]" />
              <span>AI Safety Guard Response</span>
            </div>
            <p className="leading-relaxed">{safetyResponse}</p>
          </div>
        )}
      </div>

      {/* Privacy Notice */}
      <div className="p-6 bg-white rounded-3xl border border-[#E8E4D8] space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-[#252525]">
          <Lock className="w-4 h-4 text-[#B8892D]" />
          <span>Patient Privacy & Clinical Consent</span>
        </div>
        <p className="text-xs text-[#5F5B52] leading-relaxed">
          "Your information is used solely to support rehabilitation planning, routine scheduling, and communication with Dr. Priya Raman. AI assistance operates under strict clinical oversight and does not replace professional medical care."
        </p>
      </div>
    </div>
  );
};
