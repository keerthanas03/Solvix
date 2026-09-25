import React from 'react';
import { useApp } from '../../context/AppContext';
import { GoldEmblem } from './GoldEmblem';
import {
  Wifi,
  WifiOff,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  Presentation,
  User,
  Activity,
  Building2,
  Check,
} from 'lucide-react';
import { LanguageCode, UserRole } from '../../types';

export const Header: React.FC = () => {
  const {
    userRole,
    setUserRole,
    language,
    setLanguage,
    isOffline,
    toggleOffline,
    syncQueue,
    isSyncing,
    syncPendingNow,
    syncBannerMessage,
    setIsGuidedDemoOpen,
    setIsJudgeModeOpen,
    setIsHowAiHelpsOpen,
    setIsLoginModalOpen,
  } = useApp();

  const roleLabels: Record<UserRole, { label: string; icon: any; desc: string }> = {
    patient: { label: 'Patient View', icon: User, desc: 'Kumar R (Low Literacy)' },
    therapist: { label: 'Physiotherapist', icon: Activity, desc: 'Dr. Priya Raman' },
    admin: { label: 'Clinic Admin', icon: Building2, desc: 'RehabSathi Central' },
  };

  const languages: { code: LanguageCode; label: string; native: string }[] = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
    { code: 'hi', label: 'Hindi', native: 'हिंदी' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E8E4D8] shadow-2xs">
      {/* Offline Sync Banner if active */}
      {syncBannerMessage && (
        <div
          className={`px-4 py-2 text-xs md:text-sm font-medium text-center flex items-center justify-center gap-2 transition-all ${
            isOffline
              ? 'bg-[#FEF3C7] text-[#92400E] border-b border-[#FCD34D]'
              : 'bg-[#F0FDF4] text-[#15803D] border-b border-[#BBF7D0]'
          }`}
        >
          {isOffline ? <WifiOff className="w-4 h-4 shrink-0" /> : <Check className="w-4 h-4 shrink-0" />}
          <span>{syncBannerMessage}</span>
          {!isOffline && syncQueue.length > 0 && (
            <button
              onClick={syncPendingNow}
              className="ml-2 underline font-bold cursor-pointer hover:text-green-900"
            >
              Sync Now
            </button>
          )}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          {/* Logo & Product Name */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setIsLoginModalOpen(true)}>
            <GoldEmblem size="sm" withGlow />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl font-bold tracking-tight text-[#252525] font-serif">
                  RehabSathi <span className="text-[#B8892D]">AI</span>
                </span>
                <span className="hidden md:inline-flex items-center text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-[#FCF9F2] text-[#8E681C] border border-[#E6C978]">
                  Co-Pilot
                </span>
              </div>
              <p className="hidden sm:block text-[11px] text-[#77736A] font-medium leading-none mt-0.5">
                Human-Centered Rehabilitation Co-Pilot
              </p>
            </div>
          </div>

          {/* Quick Action Navigation Bar */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Presentation & Judge Mode Trigger */}
            <button
              onClick={() => setIsJudgeModeOpen(true)}
              className="hidden lg:flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-[#D8B15A] text-[#8E681C] bg-[#FCF9F2] hover:bg-[#F7F1E1] transition-colors cursor-pointer"
              title="Presentation Mode for Evaluators"
            >
              <Presentation className="w-3.5 h-3.5 text-[#B8892D]" />
              <span>Judge Mode</span>
            </button>

            {/* Guided Demo Button */}
            <button
              onClick={() => setIsGuidedDemoOpen(true)}
              className="flex items-center gap-1 text-xs font-semibold px-2.5 sm:px-3 py-1.5 rounded-lg bg-[#C99A3A] hover:bg-[#B8892D] text-white shadow-2xs transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Guided Demo</span>
              <span className="sm:hidden">Demo</span>
            </button>

            {/* Safety & Transparency Trigger */}
            <button
              onClick={() => setIsHowAiHelpsOpen(true)}
              className="hidden md:flex items-center gap-1 text-xs font-medium text-[#5F5B52] hover:text-[#252525] px-2 py-1.5 rounded-lg hover:bg-[#F7F4EC] transition-colors cursor-pointer"
              title="AI Safety Principles & Oversight"
            >
              <ShieldCheck className="w-4 h-4 text-[#B8892D]" />
              <span className="hidden xl:inline">AI Safety</span>
            </button>

            {/* Multilingual Selector */}
            <div className="flex items-center bg-[#F7F4EC] rounded-lg p-0.5 border border-[#E8E4D8]">
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLanguage(l.code)}
                  className={`text-xs font-medium px-2 py-1 rounded-md transition-all cursor-pointer ${
                    language === l.code
                      ? 'bg-white text-[#B8892D] font-bold shadow-2xs'
                      : 'text-[#77736A] hover:text-[#252525]'
                  }`}
                  title={l.label}
                >
                  {l.native}
                </button>
              ))}
            </div>

            {/* Offline Simulation Toggle & Sync Status */}
            <div className="flex items-center gap-1 bg-[#FAFAF7] border border-[#E8E4D8] rounded-lg p-1">
              <button
                onClick={toggleOffline}
                className={`flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-md transition-colors cursor-pointer ${
                  isOffline
                    ? 'bg-[#FEF3C7] text-[#92400E] font-bold'
                    : 'text-[#15803D] hover:bg-[#F0FDF4]'
                }`}
                title={isOffline ? 'Currently Offline (Click to restore)' : 'Currently Online (Click to simulate offline)'}
              >
                {isOffline ? (
                  <>
                    <WifiOff className="w-3.5 h-3.5 text-[#D97706]" />
                    <span className="hidden sm:inline">Offline</span>
                  </>
                ) : (
                  <>
                    <Wifi className="w-3.5 h-3.5 text-[#15803D]" />
                    <span className="hidden sm:inline">Online</span>
                  </>
                )}
              </button>

              {/* Sync status indicator */}
              <button
                onClick={syncPendingNow}
                disabled={isOffline || isSyncing}
                className="flex items-center gap-1 text-xs px-2 py-1 text-[#77736A] hover:text-[#252525] disabled:opacity-50 cursor-pointer"
                title={`Last sync: ${useApp().lastSyncTime}`}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-[#B8892D]' : ''}`} />
                {syncQueue.length > 0 && (
                  <span className="inline-flex items-center justify-center bg-[#D97706] text-white text-[10px] font-bold rounded-full w-4 h-4">
                    {syncQueue.length}
                  </span>
                )}
              </button>
            </div>

            {/* Role Switcher Pill */}
            <div className="relative group">
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 bg-[#FAF9F5] border border-[#D8B15A]/60 rounded-xl hover:bg-[#F7F1E1] transition-all cursor-pointer"
              >
                {React.createElement(roleLabels[userRole].icon, {
                  className: 'w-4 h-4 text-[#B8892D]',
                })}
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-bold text-[#252525] leading-tight">
                    {roleLabels[userRole].label}
                  </div>
                  <div className="text-[10px] text-[#77736A] leading-tight">
                    {roleLabels[userRole].desc}
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
