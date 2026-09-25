import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Patient } from '../../types';
import {
  Search,
  User,
  SlidersHorizontal,
  ChevronRight,
  Globe2,
  Wifi,
  WifiOff,
  Activity,
  Calendar,
  X,
  Sparkles,
  Phone,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { VisualBadge } from '../common/VisualBadges';

export const PatientManagement: React.FC<{ onOpenPlanBuilder: () => void }> = ({
  onOpenPlanBuilder,
}) => {
  const { patients, selectedPatientId, setSelectedPatientId, aiFlags } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatientForProfile, setSelectedPatientForProfile] = useState<Patient | null>(null);

  const filteredPatients = patients.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.rehabilitationGoal.toLowerCase().includes(q) ||
      p.preferredLanguage.toLowerCase().includes(q) ||
      p.digitalLiteracy.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-[#E8E4D8] p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider bg-[#F7F1E1] text-[#8E681C] px-2.5 py-0.5 rounded-full border border-[#E6C978]">
                Patient Registry
              </span>
              <span className="text-xs text-[#77736A]">Total Assigned: {patients.length}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#252525] font-serif">
              Assigned Patients
            </h1>
            <p className="text-sm text-[#5F5B52] mt-1">
              Select any patient to review digital literacy profile, connectivity constraints, and co-created rehabilitation plans.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-[#77736A] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, knee, language..."
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#FAFAF7] rounded-xl border border-[#E8E4D8] focus:border-[#C99A3A] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Patient Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPatients.map((patient) => {
          const patientFlags = aiFlags.filter(
            (f) => f.patientId === patient.id && f.status === 'requires_review'
          );
          const isSelected = selectedPatientId === patient.id;

          return (
            <div
              key={patient.id}
              className={`bg-white rounded-3xl border-2 p-6 shadow-xs flex flex-col justify-between transition-all hover:shadow-md ${
                isSelected
                  ? 'border-[#B8892D] ring-2 ring-[#B8892D]/20'
                  : 'border-[#E8E4D8] hover:border-[#D8B15A]'
              }`}
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#FCF9F2] border border-[#E6C978] text-[#8E681C] font-bold text-lg flex items-center justify-center font-serif">
                      {patient.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#252525] flex items-center gap-1.5">
                        <span>{patient.name}</span>
                        {isSelected && (
                          <span className="text-[10px] bg-[#C99A3A] text-white px-2 py-0.5 rounded-full font-bold">
                            Active
                          </span>
                        )}
                      </h3>
                      <div className="text-xs text-[#77736A]">
                        {patient.age} yrs • {patient.gender}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-xl ${
                      patient.adherenceRate >= 80
                        ? 'bg-[#F0FDF4] text-[#15803D]'
                        : 'bg-[#FEF3C7] text-[#92400E]'
                    }`}
                  >
                    {patient.adherenceRate}% Adherence
                  </span>
                </div>

                {/* Goal */}
                <div className="text-xs text-[#3F3D38] font-medium line-clamp-2">
                  {patient.rehabilitationGoal}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 text-[11px]">
                  <span className="px-2 py-0.5 rounded-md bg-[#FAFAF7] border border-[#E8E4D8] text-[#5F5B52]">
                    🗣️ {patient.preferredLanguage === 'ta' ? 'Tamil' : patient.preferredLanguage === 'hi' ? 'Hindi' : 'English'}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-[#FAFAF7] border border-[#E8E4D8] text-[#5F5B52]">
                    📱 {patient.digitalLiteracy} Literacy
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-[#FAFAF7] border border-[#E8E4D8] text-[#5F5B52]">
                    📶 {patient.connectivity}
                  </span>
                </div>

                {/* AI Flag notice if exists */}
                {patientFlags.length > 0 && (
                  <div className="p-2.5 rounded-xl bg-[#FEF3C7] border border-[#FCD34D] text-xs text-[#92400E] flex items-center gap-2">
                    <span className="font-bold">🟡 {patientFlags.length} AI Flag</span>
                    <span className="truncate">{patientFlags[0].title}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-5 border-t border-[#E8E4D8] mt-4">
                <button
                  onClick={() => setSelectedPatientForProfile(patient)}
                  className="flex-1 py-2 rounded-xl bg-white border border-[#E8E4D8] text-xs font-bold text-[#5F5B52] hover:bg-[#F7F4EC] transition-colors cursor-pointer"
                >
                  View Profile
                </button>

                <button
                  onClick={() => {
                    setSelectedPatientId(patient.id);
                    onOpenPlanBuilder();
                  }}
                  className="flex-1 py-2 rounded-xl bg-[#C99A3A] hover:bg-[#B8892D] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  Co-Create Plan
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Patient Profile Modal */}
      {selectedPatientForProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-[#E8E4D8] p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E8E4D8] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#FCF9F2] border border-[#E6C978] text-[#8E681C] font-bold text-xl flex items-center justify-center font-serif">
                  {selectedPatientForProfile.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#252525]">
                    {selectedPatientForProfile.name}
                  </h2>
                  <p className="text-xs text-[#77736A]">
                    {selectedPatientForProfile.age} yrs • Assigned to Dr. Priya Raman
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedPatientForProfile(null)}
                className="p-2 text-[#77736A] hover:text-[#252525] rounded-full hover:bg-[#F7F4EC]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Sections */}
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-[#FAFAF7] rounded-2xl border border-[#E8E4D8] space-y-2">
                <div className="font-bold text-[#77736A] uppercase tracking-wider">
                  Rehabilitation Goal
                </div>
                <div className="text-sm font-semibold text-[#252525]">
                  {selectedPatientForProfile.rehabilitationGoal}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-white rounded-xl border border-[#E8E4D8]">
                  <div className="text-[#77736A]">Language</div>
                  <div className="font-bold text-[#252525] mt-0.5">
                    {selectedPatientForProfile.preferredLanguage === 'ta' ? 'Tamil' : selectedPatientForProfile.preferredLanguage === 'hi' ? 'Hindi' : 'English'}
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-[#E8E4D8]">
                  <div className="text-[#77736A]">Digital Literacy</div>
                  <div className="font-bold text-[#252525] mt-0.5">
                    {selectedPatientForProfile.digitalLiteracy} (Voice Guidance)
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-[#E8E4D8]">
                  <div className="text-[#77736A]">Connectivity</div>
                  <div className="font-bold text-[#D97706] mt-0.5">
                    {selectedPatientForProfile.connectivity}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-[#E8E4D8] space-y-2">
                <div className="font-bold text-[#77736A] uppercase tracking-wider">
                  Daily Routine & Working Hours
                </div>
                <p className="text-[#3F3D38] leading-relaxed">
                  "{selectedPatientForProfile.dailyRoutine}"
                </p>
                <div className="flex items-center gap-2 pt-1 text-[#8E681C]">
                  <Clock className="w-4 h-4" />
                  <span>
                    Preferred Session Times: <strong>{selectedPatientForProfile.preferredTimes.join(', ')}</strong>
                  </span>
                </div>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-[#E8E4D8] space-y-1">
                <div className="font-bold text-[#77736A] uppercase tracking-wider">
                  Equipment Available at Home
                </div>
                <div className="text-[#252525] font-medium">
                  {selectedPatientForProfile.equipment}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E8E4D8]">
              <button
                onClick={() => setSelectedPatientForProfile(null)}
                className="px-4 py-2.5 rounded-xl border border-[#E8E4D8] text-xs font-bold text-[#5F5B52]"
              >
                Close
              </button>

              <button
                onClick={() => {
                  setSelectedPatientId(selectedPatientForProfile.id);
                  setSelectedPatientForProfile(null);
                  onOpenPlanBuilder();
                }}
                className="px-6 py-2.5 rounded-xl bg-[#C99A3A] hover:bg-[#B8892D] text-white text-xs font-bold shadow-md transition-all cursor-pointer"
              >
                Open Plan Builder for {selectedPatientForProfile.name}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
