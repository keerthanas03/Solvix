import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { LandingPage } from './components/landing/LandingPage';
import { PatientLayout } from './components/patient/PatientLayout';
import { TherapistLayout } from './components/therapist/TherapistLayout';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { LoginModal } from './components/common/LoginModal';
import { GuidedDemoModal } from './components/GuidedDemoModal';
import { JudgeModeModal } from './components/JudgeModeModal';
import { HowAiHelpsModal } from './components/HowAiHelpsModal';

const MainAppContent: React.FC = () => {
  const { userRole } = useApp();
  const [showLanding, setShowLanding] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#252525] flex flex-col">
      {/* Global Header */}
      <Header />

      {/* Main View Router */}
      <div className="flex-1">
        {showLanding ? (
          <LandingPage onExplore={() => setShowLanding(false)} />
        ) : userRole === 'patient' ? (
          <PatientLayout />
        ) : userRole === 'therapist' ? (
          <TherapistLayout />
        ) : (
          <AdminDashboard />
        )}
      </div>

      {/* Floating Toggle to switch to Landing / Workspace */}
      <div className="fixed bottom-4 left-4 z-30 hidden sm:block">
        <button
          onClick={() => setShowLanding(!showLanding)}
          className="px-3.5 py-2 rounded-xl bg-white/90 backdrop-blur-xs border border-[#E8E4D8] text-xs font-bold text-[#5F5B52] hover:text-[#252525] hover:border-[#D8B15A] shadow-md transition-all cursor-pointer"
        >
          {showLanding ? '← Return to Active Workspace' : '✦ View Landing Page'}
        </button>
      </div>

      {/* Global Modals */}
      <LoginModal />
      <GuidedDemoModal />
      <JudgeModeModal />
      <HowAiHelpsModal />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}

export default App;
