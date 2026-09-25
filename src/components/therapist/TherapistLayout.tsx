import React, { useState } from 'react';
import { TherapistOverview } from './TherapistOverview';
import { PatientManagement } from './PatientManagement';
import { AiPlanBuilder } from './AiPlanBuilder';
import { FeedbackDashboard } from './FeedbackDashboard';
import { AiFlagCenter } from './AiFlagCenter';
import { ExerciseLibraryView } from './ExerciseLibraryView';
import { GoldEmblem } from '../common/GoldEmblem';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  Sparkles,
  MessageSquare,
  AlertTriangle,
  BookOpen,
  FileText,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

export const TherapistLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const { aiFlags, feedbackList } = useApp();

  const activeFlagsCount = aiFlags.filter((f) => f.status === 'requires_review').length;
  const pendingFeedbackCount = feedbackList.filter(
    (fb) => fb.therapistReviewStatus === 'pending'
  ).length;

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'patients', label: 'Patients', icon: Users, badge: '24' },
    { id: 'plans', label: 'AI Plan Builder', icon: Sparkles, highlight: true },
    { id: 'feedback', label: 'Patient Feedback', icon: MessageSquare, badge: pendingFeedbackCount > 0 ? String(pendingFeedbackCount) : undefined },
    { id: 'flags', label: 'AI Flag Center', icon: AlertTriangle, badge: activeFlagsCount > 0 ? String(activeFlagsCount) : undefined, alert: activeFlagsCount > 0 },
    { id: 'library', label: 'Exercise Library', icon: BookOpen },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAF7] flex flex-col md:flex-row">
      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex w-64 bg-white border-r border-[#E8E4D8] flex-col justify-between shrink-0 p-4 space-y-6">
        <div className="space-y-6">
          {/* Therapist Card in Sidebar */}
          <div className="p-3.5 rounded-2xl bg-[#FCF9F2] border border-[#E6C978] flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-[#D8B15A] text-[#8E681C] font-bold text-sm flex items-center justify-center font-serif shadow-2xs">
              DR
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-bold text-[#252525] truncate">Dr. Priya Raman</div>
              <div className="text-[11px] text-[#77736A] truncate">Physiotherapist</div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#C99A3A] text-white shadow-2xs'
                      : item.highlight
                      ? 'bg-[#FCF9F2] text-[#8E681C] hover:bg-[#F7F1E1]'
                      : 'text-[#5F5B52] hover:bg-[#F7F4EC] hover:text-[#252525]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-white text-[#B8892D]'
                          : item.alert
                          ? 'bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]'
                          : 'bg-[#F7F4EC] text-[#77736A]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Safety Boundary in Sidebar Footer */}
        <div className="p-3 bg-[#FAFAF7] rounded-2xl border border-[#E8E4D8] space-y-1.5 text-left">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#8E681C]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#B8892D]" />
            <span>Human-in-the-Loop</span>
          </div>
          <p className="text-[10px] text-[#77736A] leading-snug">
            All AI draft plans require explicit professional review and signoff before reaching patient apps.
          </p>
        </div>
      </aside>

      {/* Mobile Top Sub-nav */}
      <div className="md:hidden bg-white border-b border-[#E8E4D8] px-3 py-2 overflow-x-auto flex gap-2">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap transition-colors cursor-pointer ${
                isActive
                  ? 'bg-[#C99A3A] text-white'
                  : 'bg-[#FAFAF7] text-[#5F5B52] border border-[#E8E4D8]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
              {item.badge && (
                <span className="text-[9px] bg-black/10 px-1.5 py-0.2 rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {activeTab === 'dashboard' && (
          <TherapistOverview onNavigateTab={(tab) => setActiveTab(tab)} />
        )}
        {activeTab === 'patients' && (
          <PatientManagement onOpenPlanBuilder={() => setActiveTab('plans')} />
        )}
        {activeTab === 'plans' && <AiPlanBuilder />}
        {activeTab === 'feedback' && (
          <FeedbackDashboard onNavigateToPlanBuilder={() => setActiveTab('plans')} />
        )}
        {activeTab === 'flags' && (
          <AiFlagCenter onNavigateToPlanBuilder={() => setActiveTab('plans')} />
        )}
        {activeTab === 'library' && (
          <ExerciseLibraryView onSelectForPlan={() => setActiveTab('plans')} />
        )}
      </main>
    </div>
  );
};
