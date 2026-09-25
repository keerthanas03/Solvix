import React from 'react';
import { useApp } from '../../context/AppContext';
import { CircularProgressRing } from './CircularProgressRing';
import { loadStreakData } from '../../services/streakService';
import {
  CheckCircle2,
  Calendar,
  Heart,
  Sparkles,
  TrendingUp,
  Award,
  Clock,
  Smile,
  Flame,
} from 'lucide-react';

export const PatientProgress: React.FC = () => {
  const { currentPatient, feedbackList, dailyTasks } = useApp();
  const streak = loadStreakData();

  const totalDaily = dailyTasks.length;
  const completedDaily = dailyTasks.filter((t) => t.status === 'completed').length;
  const todayPercentage = totalDaily > 0 ? Math.round((completedDaily / totalDaily) * 100) : 0;

  const weeklySchedule = [
    { day: 'Monday', checks: 3, total: 3, label: 'Completed all 3' },
    { day: 'Tuesday', checks: 2, total: 3, label: '2 completed' },
    { day: 'Wednesday', checks: 3, total: 3, label: 'Completed all 3' },
    { day: 'Thursday', checks: 1, total: 3, label: '1 completed' },
    { day: 'Friday', checks: 2, total: 3, label: '2 completed' },
    { day: 'Saturday', checks: 3, total: 3, label: 'Completed all 3' },
    { day: 'Sunday (Today)', checks: completedDaily, total: totalDaily || 3, label: `${completedDaily} completed so far` },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Motivational Banner (Non-manipulative, encouraging) */}
      <div className="bg-gradient-to-br from-white via-[#FCF9F2] to-[#F7F1E1] rounded-3xl border border-[#E8E4D8] p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white text-[#8E681C] border border-[#E6C978] mb-3">
              <Award className="w-3.5 h-3.5 text-[#B8892D]" />
              <span>Weekly Activity Summary</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#252525] font-serif">
              Nice work staying consistent, {currentPatient.name}.
            </h1>
            <p className="text-sm text-[#5F5B52] mt-1.5 max-w-xl leading-relaxed">
              This week you completed <strong>12 of 15</strong> planned activities. You are making steady progress with your routine.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 self-start sm:self-auto shrink-0">
            <div className="p-4 bg-white rounded-2xl border border-[#E8E4D8] flex items-center gap-4 shrink-0 shadow-2xs">
              <CircularProgressRing
                percentage={82}
                size={84}
                strokeWidth={8}
                sublabel="Adherence"
              />
              <div className="text-left">
                <div className="text-xs font-medium text-[#77736A]">Weekly Adherence</div>
                <div className="text-xl font-black text-[#B8892D] tabular-nums mt-0.5">82% (12/15)</div>
                <div className="text-[11px] text-[#15803D] font-bold mt-0.5">Steady Consistency</div>
              </div>
            </div>

            <div className="p-4 bg-gradient-to-br from-[#FFFBEB] to-[#FEF3C7] rounded-2xl border border-[#FDE68A] flex items-center gap-3.5 shrink-0 shadow-2xs">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#EA580C] to-[#C2410C] text-white flex items-center justify-center shadow-xs">
                <Flame className="w-6 h-6 fill-current animate-pulse" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-[#92400E]">Continuous Streak</div>
                <div className="text-xl font-black text-[#78350F] tabular-nums mt-0.5">
                  {streak.currentStreak} Days 🔥
                </div>
                <div className="text-[11px] text-[#B45309] font-semibold mt-0.5">
                  {streak.todayCompleted ? 'Today Secured ✓' : 'Daily Adherence'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Day by Day Activity Calendar */}
      <div className="bg-white rounded-3xl border border-[#E8E4D8] p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#B8892D]" />
            <h2 className="text-lg sm:text-xl font-bold text-[#252525]">
              Daily Session Completion
            </h2>
          </div>
          <span className="text-xs text-[#77736A] font-medium">Target: 3 daily sessions</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
          {weeklySchedule.map((item, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border text-center transition-all ${
                item.checks === 3
                  ? 'bg-[#F0FDF4]/60 border-[#BBF7D0]'
                  : item.checks > 0
                  ? 'bg-[#FCF9F2] border-[#E6C978]'
                  : 'bg-white border-[#E8E4D8]'
              }`}
            >
              <div className="text-xs font-bold text-[#252525] mb-2">{item.day}</div>
              <div className="flex items-center justify-center gap-1.5 mb-2">
                {Array.from({ length: item.total }).map((_, cIdx) => (
                  <span
                    key={cIdx}
                    className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                      cIdx < item.checks
                        ? 'bg-[#15803D] text-white'
                        : 'bg-[#F7F4EC] text-[#A9A59B]'
                    }`}
                  >
                    {cIdx < item.checks ? '✓' : '•'}
                  </span>
                ))}
              </div>
              <div className="text-[11px] text-[#77736A] font-medium">{item.label}</div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-[#FAFAF7] rounded-2xl border border-[#E8E4D8] flex items-center justify-between text-xs text-[#5F5B52]">
          <span>
            <strong>Gentle Guidance:</strong> If you miss a session, do not worry. Simply continue your regular schedule when you feel comfortable.
          </span>
          <span className="text-[#8E681C] font-bold shrink-0 ml-2">No pressure recovery</span>
        </div>
      </div>

      {/* Patient Feedback History */}
      <div className="bg-white rounded-3xl border border-[#E8E4D8] p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Smile className="w-5 h-5 text-[#B8892D]" />
            <h3 className="text-lg font-bold text-[#252525]">Your Reported Feedback</h3>
          </div>
          <span className="text-xs text-[#77736A]">Shared with Dr. Priya Raman</span>
        </div>

        <div className="space-y-3">
          {feedbackList.slice(0, 3).map((fb) => (
            <div
              key={fb.id}
              className="p-4 rounded-2xl bg-[#FAFAF7] border border-[#E8E4D8] space-y-2"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#252525]">{fb.exerciseName}</span>
                <span className="text-[#77736A]">{new Date(fb.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="text-xs text-[#3F3D38] italic">"{fb.rawFeedback}"</p>
              <div className="flex items-center gap-2 pt-1">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    fb.difficulty === 'difficult'
                      ? 'bg-[#FEF2F2] text-[#DC2626]'
                      : 'bg-[#FCF9F2] text-[#8E681C]'
                  }`}
                >
                  Difficulty: {fb.difficulty}
                </span>
                <span className="text-[10px] text-[#77736A]">
                  Status: {fb.syncStatus === 'synced' ? 'Synchronized with clinic ✓' : 'Stored locally (Pending sync)'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
