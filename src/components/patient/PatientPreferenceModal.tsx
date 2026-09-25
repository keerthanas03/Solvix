import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Patient, LanguageCode, DigitalLiteracy, ConnectivityLevel } from '../../types';
import {
  X,
  Sliders,
  Sparkles,
  Save,
  CheckCircle,
  Clock,
  Wifi,
  Globe2,
  Armchair,
  FileText,
} from 'lucide-react';

interface PatientPreferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient?: Patient;
}

export const PatientPreferenceModal: React.FC<PatientPreferenceModalProps> = ({
  isOpen,
  onClose,
  patient,
}) => {
  const { currentPatient, updatePatient, addAuditLog } = useApp();
  const targetPatient = patient || currentPatient;

  const [preferredLanguage, setPreferredLanguage] = useState<LanguageCode>(targetPatient.preferredLanguage);
  const [digitalLiteracy, setDigitalLiteracy] = useState<DigitalLiteracy>(targetPatient.digitalLiteracy);
  const [connectivity, setConnectivity] = useState<ConnectivityLevel>(targetPatient.connectivity);
  const [preferredInstructionMode, setPreferredInstructionMode] = useState(targetPatient.preferredInstructionMode);
  const [time1, setTime1] = useState(targetPatient.preferredTimes[0] || '06:30 AM');
  const [time2, setTime2] = useState(targetPatient.preferredTimes[1] || '08:00 PM');
  const [equipment, setEquipment] = useState(targetPatient.equipment);
  const [dailyRoutine, setDailyRoutine] = useState(targetPatient.dailyRoutine);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    const updated: Patient = {
      ...targetPatient,
      preferredLanguage,
      digitalLiteracy,
      connectivity,
      preferredInstructionMode,
      preferredTimes: [time1, time2].filter(Boolean),
      equipment,
      dailyRoutine,
    };

    updatePatient(updated);
    addAuditLog(
      `Updated patient preference profile for ${targetPatient.name}`,
      'Patient Preference Engine',
      'PATIENT_ACTION'
    );

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white border border-[#E8E4D8] rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#77736A] hover:text-[#252525] rounded-full hover:bg-[#F7F4EC]"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#FCF9F2] text-[#8E681C] border border-[#E6C978] flex items-center justify-center">
            <Sliders className="w-5 h-5 text-[#B8892D]" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#8E681C]">
              Structured Preference Engine
            </span>
            <h2 className="text-xl font-bold text-[#252525]">
              Patient Routine & Accessibility Preferences
            </h2>
          </div>
        </div>

        {savedSuccess && (
          <div className="p-3 bg-[#F0FDF4] rounded-xl border border-[#BBF7D0] text-xs font-bold text-[#15803D] flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span>Preferences saved! AI Co-Pilot will use these factors for future drafts.</span>
          </div>
        )}

        <div className="space-y-4 text-xs">
          {/* Language Selection */}
          <div className="p-4 bg-[#FAFAF7] rounded-2xl border border-[#E8E4D8] space-y-2">
            <label className="font-bold text-[#252525] block">
              1. Preferred Communication Language
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { code: 'ta' as const, label: 'தமிழ் (Tamil)' },
                { code: 'en' as const, label: 'English' },
                { code: 'hi' as const, label: 'हिंदी (Hindi)' },
              ].map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setPreferredLanguage(lang.code)}
                  className={`py-2 px-3 rounded-xl font-bold border transition-colors cursor-pointer ${
                    preferredLanguage === lang.code
                      ? 'bg-[#C99A3A] text-white border-[#C99A3A]'
                      : 'bg-white text-[#5F5B52] border-[#E8E4D8]'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          {/* Digital Literacy & Instruction Mode */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 bg-[#FAFAF7] rounded-2xl border border-[#E8E4D8] space-y-2">
              <label className="font-bold text-[#252525] block">
                2. Digital Literacy Level
              </label>
              <select
                value={digitalLiteracy}
                onChange={(e) => setDigitalLiteracy(e.target.value as DigitalLiteracy)}
                className="w-full p-2.5 bg-white rounded-xl border border-[#E8E4D8] focus:border-[#C99A3A] focus:outline-none"
              >
                <option value="Low">Low (Voice First + Simple Mode)</option>
                <option value="Medium">Medium (Standard Visual Steps)</option>
                <option value="High">High (Detailed Metrics)</option>
              </select>
            </div>

            <div className="p-4 bg-[#FAFAF7] rounded-2xl border border-[#E8E4D8] space-y-2">
              <label className="font-bold text-[#252525] block">
                3. Preferred Instruction Type
              </label>
              <select
                value={preferredInstructionMode}
                onChange={(e) => setPreferredInstructionMode(e.target.value as any)}
                className="w-full p-2.5 bg-white rounded-xl border border-[#E8E4D8] focus:border-[#C99A3A] focus:outline-none"
              >
                <option value="voice">Voice + Spoken Audio</option>
                <option value="simple_text">Simple Text (Bite-sized)</option>
                <option value="visual_steps">Visual Steps & Diagrams</option>
              </select>
            </div>
          </div>

          {/* Times & Connectivity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 bg-[#FAFAF7] rounded-2xl border border-[#E8E4D8] space-y-2">
              <label className="font-bold text-[#252525] block">
                4. Routine Exercise Time Slots
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={time1}
                  onChange={(e) => setTime1(e.target.value)}
                  placeholder="e.g. 06:30 AM"
                  className="w-1/2 p-2.5 bg-white rounded-xl border border-[#E8E4D8] focus:outline-none"
                />
                <input
                  type="text"
                  value={time2}
                  onChange={(e) => setTime2(e.target.value)}
                  placeholder="e.g. 08:00 PM"
                  className="w-1/2 p-2.5 bg-white rounded-xl border border-[#E8E4D8] focus:outline-none"
                />
              </div>
            </div>

            <div className="p-4 bg-[#FAFAF7] rounded-2xl border border-[#E8E4D8] space-y-2">
              <label className="font-bold text-[#252525] block">
                5. Home Connectivity Level
              </label>
              <select
                value={connectivity}
                onChange={(e) => setConnectivity(e.target.value as ConnectivityLevel)}
                className="w-full p-2.5 bg-white rounded-xl border border-[#E8E4D8] focus:border-[#C99A3A] focus:outline-none"
              >
                <option value="Intermittent">Intermittent (Offline Caching Required)</option>
                <option value="Reliable">Reliable (Consistent Wi-Fi/4G)</option>
                <option value="Mostly Offline">Mostly Offline (Weekly Sync Only)</option>
              </select>
            </div>
          </div>

          {/* Equipment Available */}
          <div className="p-4 bg-[#FAFAF7] rounded-2xl border border-[#E8E4D8] space-y-2">
            <label className="font-bold text-[#252525] block">
              6. Available Equipment at Home
            </label>
            <input
              type="text"
              value={equipment}
              onChange={(e) => setEquipment(e.target.value)}
              placeholder="e.g. Sturdy home chair only, no gym weights"
              className="w-full p-2.5 bg-white rounded-xl border border-[#E8E4D8] focus:border-[#C99A3A] focus:outline-none"
            />
          </div>

          {/* Daily Routine / Work Schedule Free Text */}
          <div className="p-4 bg-[#FAFAF7] rounded-2xl border border-[#E8E4D8] space-y-2">
            <label className="font-bold text-[#252525] block">
              7. Daily Work Routine & Practical Constraints (Free Text)
            </label>
            <textarea
              value={dailyRoutine}
              onChange={(e) => setDailyRoutine(e.target.value)}
              rows={2}
              placeholder="e.g. I work at a grocery shop from 8 AM to 6 PM. Cannot exercise before 6 AM or during the day."
              className="w-full p-2.5 bg-white rounded-xl border border-[#E8E4D8] focus:border-[#C99A3A] focus:outline-none leading-relaxed"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-[#E8E4D8]">
          <div className="flex items-center gap-1.5 text-[11px] text-[#77736A]">
            <Sparkles className="w-3.5 h-3.5 text-[#B8892D]" />
            <span>AI uses these preferences to suggest compatible draft times.</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[#E8E4D8] text-xs font-bold text-[#5F5B52]"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 rounded-xl bg-[#C99A3A] hover:bg-[#B8892D] text-white text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Save Preferences</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
