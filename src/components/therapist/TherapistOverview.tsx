import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Calendar,
  AlertTriangle,
  Sparkles,
  TrendingUp,
  Activity,
  ArrowRight,
  Clock,
  CheckCircle,
  FileCheck,
  ShieldCheck,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
} from 'recharts';

export const TherapistOverview: React.FC<{
  onNavigateTab: (tab: string) => void;
}> = ({ onNavigateTab }) => {
  const { patients, activePlan, draftPlan, feedbackList, aiFlags, uploadedPrescriptions, dailyTasks } = useApp();

  const activeFlagsCount = aiFlags.filter((f) => f.status === 'requires_review').length;
  const pendingFeedbackCount = feedbackList.filter(
    (fb) => fb.therapistReviewStatus === 'pending' && (fb.discomfortReported || fb.difficulty === 'difficult')
  ).length;

  const completedTasksCount = dailyTasks.filter((t) => t.status === 'completed').length;
  const totalDailyTasksCount = dailyTasks.length || 1;
  const todayTaskAdherenceRate = Math.round((completedTasksCount / totalDailyTasksCount) * 100);

  const adherenceChartData = [
    { day: 'Mon', completed: 22, scheduled: 24, rate: 91 },
    { day: 'Tue', completed: 20, scheduled: 24, rate: 83 },
    { day: 'Wed', completed: 21, scheduled: 24, rate: 87 },
    { day: 'Thu', completed: 18, scheduled: 24, rate: 75 },
    { day: 'Fri', completed: 20, scheduled: 24, rate: 83 },
    { day: 'Sat', completed: 23, scheduled: 24, rate: 95 },
    { day: 'Sun', completed: 19, scheduled: 24, rate: 79 },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Top Greeting & Metric Cards */}
      <div className="bg-white rounded-3xl border border-[#E8E4D8] p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8E4D8] pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider bg-[#F0FDF4] text-[#15803D] px-2.5 py-0.5 rounded-full border border-[#BBF7D0]">
                Clinical Portal
              </span>
              <span className="text-xs text-[#77736A]">Active Practice</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#252525] font-serif">
              Good morning, Dr. Priya Raman
            </h1>
            <p className="text-sm text-[#5F5B52] mt-1">
              Here is your clinic overview, patient adherence trends, and AI-flagged observations for today.
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('plans')}
            className="self-start sm:self-auto flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#C99A3A] hover:bg-[#B8892D] text-white font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Open AI Plan Builder</span>
          </button>
        </div>

        {/* 5 Metric Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 mt-6">
          <div className="p-4 rounded-2xl bg-[#FAFAF7] border border-[#E8E4D8]">
            <div className="flex items-center justify-between text-[#77736A] text-xs font-medium">
              <span>Total Patients</span>
              <Users className="w-4 h-4 text-[#B8892D]" />
            </div>
            <div className="text-2xl font-extrabold text-[#252525] mt-1">24</div>
            <div className="text-[11px] text-[#15803D] font-medium mt-0.5">18 active today</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAFAF7] border border-[#E8E4D8]">
            <div className="flex items-center justify-between text-[#77736A] text-xs font-medium">
              <span>Active Plans</span>
              <Calendar className="w-4 h-4 text-[#B8892D]" />
            </div>
            <div className="text-2xl font-extrabold text-[#252525] mt-1">21</div>
            <div className="text-[11px] text-[#77736A] font-medium mt-0.5">3 completed cycles</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFFDF7] border border-[#FCD34D]">
            <div className="flex items-center justify-between text-[#92400E] text-xs font-medium">
              <span>Needs Review</span>
              <Activity className="w-4 h-4 text-[#D97706]" />
            </div>
            <div className="text-2xl font-extrabold text-[#D97706] mt-1">4</div>
            <div className="text-[11px] text-[#92400E] font-medium mt-0.5">Feedback & notes</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#FEF2F2] border border-[#FECACA]">
            <div className="flex items-center justify-between text-[#DC2626] text-xs font-medium">
              <span>AI Flags</span>
              <AlertTriangle className="w-4 h-4 text-[#DC2626]" />
            </div>
            <div className="text-2xl font-extrabold text-[#DC2626] mt-1">
              {activeFlagsCount}
            </div>
            <div className="text-[11px] text-[#DC2626] font-medium mt-0.5">Requires review</div>
          </div>

          <div className="col-span-2 sm:col-span-4 lg:col-span-1 p-4 rounded-2xl bg-[#FAFAF7] border border-[#E8E4D8]">
            <div className="flex items-center justify-between text-[#77736A] text-xs font-medium">
              <span>Avg Adherence</span>
              <TrendingUp className="w-4 h-4 text-[#15803D]" />
            </div>
            <div className="text-2xl font-extrabold text-[#15803D] mt-1">82%</div>
            <div className="text-[11px] text-[#77736A] font-medium mt-0.5">Across cohort</div>
          </div>
        </div>
      </div>

      {/* Priority Action Items & AI Pending Drafts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Priority Action Items (Flags & Feedback) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-[#E8E4D8] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-[#D97706]" />
              <h2 className="text-lg font-bold text-[#252525]">
                Priority Action Queue (Human Review Required)
              </h2>
            </div>
            <button
              onClick={() => onNavigateTab('feedback')}
              className="text-xs font-bold text-[#8E681C] hover:underline cursor-pointer"
            >
              View All
            </button>
          </div>

          <div className="space-y-3">
            {/* Action Item 1: Kumar's Reported Discomfort */}
            <div className="p-4 rounded-2xl bg-[#FFFDF7] border border-[#FCD34D] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#252525]">Kumar R</span>
                  <span className="text-[10px] font-bold uppercase bg-[#FEF2F2] text-[#DC2626] px-2 py-0.5 rounded-md border border-[#FECACA]">
                    Discomfort Reported
                  </span>
                </div>
                <p className="text-xs text-[#5F5B52]">
                  "Yesterday evening I found the knee exercise difficult and could only complete half of it."
                </p>
                <div className="text-[11px] text-[#8E681C] font-semibold">
                  AI Summary: Partial completion due to knee tightness at rep 5.
                </div>
              </div>
              <button
                onClick={() => onNavigateTab('feedback')}
                className="self-end sm:self-auto px-4 py-2 rounded-xl bg-[#C99A3A] hover:bg-[#B8892D] text-white text-xs font-bold shrink-0 transition-colors cursor-pointer"
              >
                Review Feedback
              </button>
            </div>

            {/* Action Item 2: AI Plan Draft Awaiting Approval */}
            {draftPlan ? (
              <div className="p-4 rounded-2xl bg-[#FCF9F2] border border-[#E6C978] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#252525]">{draftPlan.patientName}</span>
                    <span className="text-[10px] font-bold uppercase bg-[#FFF8E7] text-[#8E681C] px-2 py-0.5 rounded-md border border-[#E6C978]">
                      AI Draft Awaiting Signoff
                    </span>
                  </div>
                  <p className="text-xs text-[#5F5B52]">
                    Simplified plan tailored in Tamil for home chair routine.
                  </p>
                </div>
                <button
                  onClick={() => onNavigateTab('plans')}
                  className="self-end sm:self-auto px-4 py-2 rounded-xl bg-[#B8892D] hover:bg-[#8E681C] text-white text-xs font-bold shrink-0 transition-colors cursor-pointer"
                >
                  Inspect & Approve
                </button>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-[#FAFAF7] border border-[#E8E4D8] text-xs text-[#77736A] flex items-center justify-between">
                <span>No pending AI plan drafts. Ready to create new recommendations.</span>
                <button
                  onClick={() => onNavigateTab('plans')}
                  className="text-xs font-bold text-[#8E681C] hover:underline"
                >
                  + New Plan
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right: Cohort Adherence Analytics Chart */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-[#E8E4D8] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#252525]">Weekly Activity Adherence</h3>
              <p className="text-xs text-[#77736A]">Completed vs scheduled exercise sessions</p>
            </div>
            <span className="text-xs font-bold text-[#15803D]">82% Overall</span>
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={adherenceChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8E4D8" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#77736A' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#77736A' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    borderColor: '#E8E4D8',
                    fontSize: '12px',
                  }}
                  formatter={(val: any) => [`${val} sessions`, 'Completed']}
                />
                <Bar dataKey="completed" fill="#C99A3A" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="text-[11px] text-[#77736A] flex items-center gap-1.5 pt-2 border-t border-[#E8E4D8]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#B8892D]" />
            <span>Activity adherence measures completed routine compliance, not clinical recovery.</span>
          </div>
        </div>
      </div>

      {/* Patient-Uploaded Prescriptions & Task Adherence Monitor */}
      <div className="bg-white rounded-3xl border border-[#E8E4D8] p-6 sm:p-8 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E8E4D8]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8E681C] bg-[#FCF9F2] px-2.5 py-0.5 rounded-full border border-[#E6C978]">
                Prescription Intake & Task Verification
              </span>
              <span className="text-xs font-semibold text-[#15803D]">
                Today: {todayTaskAdherenceRate}% Verified Tasks
              </span>
            </div>
            <h2 className="text-xl font-bold text-[#252525]">
              Patient-Uploaded Plans & Daily Task Verification
            </h2>
            <p className="text-xs text-[#5F5B52] mt-0.5">
              Patients upload their clinic prescription slips; AI Co-Pilot extracts clinical dosages, schedules conflict-free routines, and continuously checks task completion.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#77736A]">Active Prescriptions:</span>
            <span className="text-xs font-bold text-[#8E681C] bg-[#FAFAF7] px-2.5 py-1 rounded-xl border border-[#E8E4D8]">
              {uploadedPrescriptions.length}
            </span>
          </div>
        </div>

        {/* Prescription List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {uploadedPrescriptions.map((presc) => (
            <div
              key={presc.id}
              className="p-5 bg-[#FAFAF7] rounded-2xl border border-[#E8E4D8] space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-[#8E681C] bg-white px-2 py-0.5 rounded border border-[#E6C978]">
                    Uploaded by {presc.patientName}
                  </span>
                  <h3 className="text-sm font-bold text-[#252525] mt-1.5">
                    {presc.clinicalDiagnosis}
                  </h3>
                  <div className="text-xs text-[#77736A]">
                    Doctor: <span className="font-semibold text-[#252525]">{presc.doctorName}</span> • {presc.clinicOrHospital}
                  </div>
                </div>

                <span className="text-[10px] font-bold text-[#15803D] bg-[#F0FDF4] px-2 py-0.5 rounded-full border border-[#BBF7D0]">
                  Schedule Active
                </span>
              </div>

              {/* Suggested Schedule slots */}
              <div className="p-3 bg-white rounded-xl border border-[#E8E4D8] space-y-1.5 text-xs">
                <div className="font-bold text-[#8E681C] flex items-center justify-between">
                  <span>AI Personalized Routine Slots:</span>
                  <span className="text-[10px] text-[#77736A] font-normal">Adapted to grocery store shift</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  {presc.suggestedSchedule.map((slot, sIdx) => (
                    <div key={sIdx} className="p-2 bg-[#FAFAF7] rounded-lg border border-[#E8E4D8]">
                      <div className="font-bold text-[#252525]">{slot.slotName}</div>
                      <div className="text-[#8E681C] font-semibold">{slot.time}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Today's Tasks Verification Status for this prescription */}
              <div className="pt-2 border-t border-[#E8E4D8] space-y-1.5">
                <div className="text-xs font-bold text-[#252525] flex items-center justify-between">
                  <span>Task Verification Status:</span>
                  <span className="text-xs font-bold text-[#15803D]">
                    {dailyTasks.filter((t) => t.status === 'completed').length} / {dailyTasks.length} Completed
                  </span>
                </div>

                <div className="space-y-1">
                  {dailyTasks.slice(0, 3).map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between text-xs p-1.5 bg-white rounded-lg border border-[#E8E4D8]"
                    >
                      <span className="text-[#252525] font-medium truncate max-w-[200px]">
                        {task.exerciseName} ({task.slotName.split(' ')[0]})
                      </span>
                      {task.status === 'completed' ? (
                        <span className="text-[10px] font-bold text-[#15803D] bg-[#F0FDF4] px-2 py-0.5 rounded border border-[#BBF7D0] flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          <span>Done {task.completedAt}</span>
                        </span>
                      ) : task.status === 'due_now' ? (
                        <span className="text-[10px] font-bold text-[#B45309] bg-[#FEF3C7] px-2 py-0.5 rounded border border-[#FDE68A]">
                          Due Now
                        </span>
                      ) : task.status === 'missed' ? (
                        <span className="text-[10px] font-bold text-[#DC2626] bg-[#FEF2F2] px-2 py-0.5 rounded border border-[#FECACA]">
                          Missed
                        </span>
                      ) : (
                        <span className="text-[10px] text-[#77736A]">
                          {task.scheduledTime}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
