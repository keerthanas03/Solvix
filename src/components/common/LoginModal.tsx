import React from 'react';
import { useApp } from '../../context/AppContext';
import { GoldEmblem } from './GoldEmblem';
import { User, Activity, Building2, X, Check, ShieldCheck } from 'lucide-react';
import { UserRole } from '../../types';

export const LoginModal: React.FC = () => {
  const { isLoginModalOpen, setIsLoginModalOpen, userRole, setUserRole, patients, selectedPatientId, setSelectedPatientId } = useApp();

  if (!isLoginModalOpen) return null;

  const handleSelectRole = (role: UserRole) => {
    setUserRole(role);
    setIsLoginModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#FAFAF7] border border-[#E8E4D8] rounded-3xl shadow-2xl p-6 sm:p-8 text-center overflow-hidden">
        {/* Close Button */}
        <button
          onClick={() => setIsLoginModalOpen(false)}
          className="absolute top-4 right-4 p-2 text-[#77736A] hover:text-[#252525] rounded-full hover:bg-[#F7F4EC] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Emblem */}
        <div className="flex justify-center mb-4">
          <GoldEmblem size="lg" withGlow />
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-[#252525] tracking-tight font-serif">
          RehabMitra <span className="text-[#B8892D]">AI</span>
        </h2>
        <p className="text-sm font-medium text-[#77736A] mt-1 mb-6">
          Human-Centered Rehabilitation Co-Pilot
        </p>

        <div className="bg-white rounded-2xl p-4 border border-[#E8E4D8] text-left mb-6 space-y-3">
          <div className="text-xs font-bold text-[#5F5B52] uppercase tracking-wider">
            Select Demo Account Role
          </div>

          {/* 1. Patient */}
          <button
            onClick={() => {
              setSelectedPatientId('pat-kumar-1');
              handleSelectRole('patient');
            }}
            className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
              userRole === 'patient'
                ? 'border-[#C99A3A] bg-[#FCF9F2] shadow-xs'
                : 'border-[#E8E4D8] hover:border-[#D8B15A] bg-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F7F1E1] text-[#8E681C] flex items-center justify-center font-bold">
                <User className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-[#252525]">Kumar R (Patient)</div>
                <div className="text-xs text-[#77736A]">
                  Tamil • Low Digital Literacy • Voice First • Post-Knee Care
                </div>
              </div>
            </div>
            {userRole === 'patient' && <Check className="w-5 h-5 text-[#B8892D]" />}
          </button>

          {/* 2. Physiotherapist */}
          <button
            onClick={() => handleSelectRole('therapist')}
            className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
              userRole === 'therapist'
                ? 'border-[#C99A3A] bg-[#FCF9F2] shadow-xs'
                : 'border-[#E8E4D8] hover:border-[#D8B15A] bg-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#1D4ED8] flex items-center justify-center font-bold">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-[#252525]">Dr. Priya Raman (Physiotherapist)</div>
                <div className="text-xs text-[#77736A]">
                  Clinical Decision-Maker • AI Co-Pilot Planning • Feedback Review
                </div>
              </div>
            </div>
            {userRole === 'therapist' && <Check className="w-5 h-5 text-[#B8892D]" />}
          </button>

          {/* 3. Clinic Admin */}
          <button
            onClick={() => handleSelectRole('admin')}
            className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
              userRole === 'admin'
                ? 'border-[#C99A3A] bg-[#FCF9F2] shadow-xs'
                : 'border-[#E8E4D8] hover:border-[#D8B15A] bg-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F5F3FF] text-[#6D28D9] flex items-center justify-center font-bold">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-[#252525]">Clinic Manager / Admin</div>
                <div className="text-xs text-[#77736A]">
                  Operational Analytics • AI Governance & Audit Trail
                </div>
              </div>
            </div>
            {userRole === 'admin' && <Check className="w-5 h-5 text-[#B8892D]" />}
          </button>
        </div>

        {/* Core Promise Footer */}
        <div className="flex items-center justify-center gap-2 text-xs font-medium text-[#77736A]">
          <ShieldCheck className="w-4 h-4 text-[#B8892D]" />
          <span>AI assists. Professionals decide. Patients participate.</span>
        </div>
      </div>
    </div>
  );
};
