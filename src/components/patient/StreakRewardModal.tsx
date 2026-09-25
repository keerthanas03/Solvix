import React from 'react';
import { useApp } from '../../context/AppContext';
import { DailyStreakData, StreakMilestone } from '../../types';
import {
  STREAK_MILESTONES,
  resetStreakData,
  awardDemoStreakIncrement,
} from '../../services/streakService';
import { playGentleChime } from '../../services/notificationService';
import { VisualBadge } from '../common/VisualBadges';
import {
  Flame,
  Award,
  Sparkles,
  Check,
  Calendar,
  ShieldCheck,
  RotateCcw,
  X,
  Volume2,
  VolumeX,
  TrendingUp,
  Heart,
  ChevronRight,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface StreakRewardModalProps {
  isOpen: boolean;
  onClose: () => void;
  streakData: DailyStreakData;
  onUpdateStreak: (newData: DailyStreakData) => void;
}

export const StreakRewardModal: React.FC<StreakRewardModalProps> = ({
  isOpen,
  onClose,
  streakData,
  onUpdateStreak,
}) => {
  const { currentPatient, language, speakText, isSpeaking, stopSpeaking } = useApp();

  if (!isOpen) return null;

  const { currentStreak, longestStreak, todayCompleted, history, totalDaysLogged } = streakData;

  // Next milestone calculation
  const nextMilestone = STREAK_MILESTONES.find((m) => m.requiredDays > currentStreak) || STREAK_MILESTONES[STREAK_MILESTONES.length - 1];
  const progressToNext = Math.min(100, Math.round((currentStreak / nextMilestone.requiredDays) * 100));

  const handleCelebrate = () => {
    playGentleChime();
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#EA580C', '#C99A3A', '#15803D', '#FDE68A'],
      });
    } catch {}

    const speechText =
      language === 'ta'
        ? `அற்புதம் ${currentPatient.name}! நீங்கள் தொடர்ந்து ${currentStreak} நாட்கள் உடற்பயிற்சிகளை முடித்துள்ளீர்கள்!`
        : language === 'hi'
        ? `शाबाश ${currentPatient.name}! आपकी ${currentStreak} दिन की दैनिक व्यायाम लकीर जारी है!`
        : `Fantastic work ${currentPatient.name}! You are on an impressive ${currentStreak}-day continuous rehabilitation streak!`;

    speakText(speechText, language);
  };

  const handleSimulateIncrement = () => {
    const updated = awardDemoStreakIncrement(streakData);
    onUpdateStreak(updated);
    playGentleChime();
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#EA580C', '#C99A3A', '#15803D'],
      });
    } catch {}
  };

  const handleReset = () => {
    const fresh = resetStreakData();
    onUpdateStreak(fresh);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white border border-[#E8E4D8] rounded-3xl shadow-2xl p-5 sm:p-7 space-y-5 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#77736A] hover:text-[#252525] rounded-full hover:bg-[#F7F4EC] cursor-pointer"
          title="Close rewards"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start gap-3.5 pr-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#EA580C] to-[#C2410C] text-white flex items-center justify-center shrink-0 shadow-md">
            <Flame className="w-6 h-6 fill-current animate-pulse" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#EA580C] bg-[#FFF7ED] px-2.5 py-0.5 rounded-full border border-[#FFEDD5]">
                Habit Adherence Rewards
              </span>
              <VisualBadge type="patient_completed" customText="PERSISTED STREAK" size="sm" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#252525]">
              Daily Rehabilitation Streak
            </h2>
            <p className="text-xs text-[#5F5B52] mt-0.5">
              Consistent daily movement accelerates soft-tissue healing and knee joint range of motion.
            </p>
          </div>
        </div>

        {/* Central Streak Banner with Big Flame & Count */}
        <div className="p-6 bg-gradient-to-br from-[#FFFBEB] via-[#FEF3C7] to-[#FDE68A]/30 rounded-3xl border-2 border-[#FDE68A] text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#EA580C] to-[#9A3412] text-white flex items-center justify-center shadow-lg">
              <Flame className="w-8 h-8 fill-current animate-bounce" />
            </div>
            <div className="text-left">
              <div className="text-4xl sm:text-5xl font-black text-[#92400E] tabular-nums tracking-tight leading-none">
                {currentStreak} <span className="text-xl font-bold text-[#B45309]">Days</span>
              </div>
              <div className="text-xs font-bold text-[#78350F] uppercase tracking-wider mt-1 flex items-center gap-1.5">
                <span>Current Daily Streak</span>
                {todayCompleted ? (
                  <span className="text-[10px] font-extrabold text-[#15803D] bg-[#F0FDF4] px-2 py-0.5 rounded-full border border-[#BBF7D0]">
                    ✓ Today Completed
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-[#B45309] bg-white px-2 py-0.5 rounded-full border border-[#FDE68A]">
                    Complete today to keep streak!
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#FDE68A] text-center text-xs">
            <div className="bg-white/80 rounded-xl p-2 border border-[#FDE68A]">
              <span className="text-[10px] text-[#77736A] uppercase font-bold block">Longest</span>
              <span className="text-sm font-black text-[#252525] tabular-nums">{longestStreak} Days</span>
            </div>
            <div className="bg-white/80 rounded-xl p-2 border border-[#FDE68A]">
              <span className="text-[10px] text-[#77736A] uppercase font-bold block">Total Logged</span>
              <span className="text-sm font-black text-[#252525] tabular-nums">{totalDaysLogged} Days</span>
            </div>
            <div className="bg-white/80 rounded-xl p-2 border border-[#FDE68A]">
              <span className="text-[10px] text-[#77736A] uppercase font-bold block">Streak Shield</span>
              <span className="text-sm font-black text-[#15803D]">
                {streakData.streakFreezeAvailable ? 'Active 🛡️' : 'Used'}
              </span>
            </div>
          </div>

          {/* Next Milestone Progress Bar */}
          <div className="bg-white rounded-2xl p-3.5 border border-[#FDE68A] space-y-1.5 text-left">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#252525] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#EA580C]" />
                <span>Next Milestone: {nextMilestone.title}</span>
              </span>
              <span className="font-mono font-bold text-[#92400E]">
                {currentStreak} / {nextMilestone.requiredDays} Days ({progressToNext}%)
              </span>
            </div>

            <div className="w-full bg-[#EFECE4] rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#F59E0B] to-[#EA580C] h-2.5 rounded-full transition-all duration-700"
                style={{ width: `${progressToNext}%` }}
              />
            </div>

            <p className="text-[11px] text-[#5F5B52]">
              {nextMilestone.requiredDays - currentStreak <= 0
                ? 'Milestone unlocked! Keep going for maximum joint stability.'
                : `Only ${nextMilestone.requiredDays - currentStreak} more day${
                    nextMilestone.requiredDays - currentStreak > 1 ? 's' : ''
                  } of verified tasks to unlock ${nextMilestone.badgeName}!`}
            </p>
          </div>
        </div>

        {/* 7-Day Adherence Calendar Strip */}
        <div className="p-4 bg-[#FAFAF7] rounded-2xl border border-[#E8E4D8] space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#252525] uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#B8892D]" />
              <span>Weekly Task Streak Calendar</span>
            </span>
            <span className="text-[11px] text-[#77736A]">Saved locally</span>
          </div>

          <div className="grid grid-cols-7 gap-1.5">
            {history.map((item, idx) => {
              const isToday = item.dayOfWeek.includes('Today');
              const isDone = item.completed;

              return (
                <div
                  key={idx}
                  className={`p-2 rounded-xl text-center flex flex-col items-center justify-between border transition-all ${
                    isDone
                      ? 'bg-[#F0FDF4] border-[#BBF7D0] text-[#15803D]'
                      : isToday
                      ? 'bg-[#FFFBEB] border-[#FDE68A] text-[#92400E] ring-2 ring-[#FDE68A]'
                      : 'bg-white border-[#E8E4D8] text-[#77736A]'
                  }`}
                >
                  <span className="text-[10px] font-bold block truncate max-w-full">
                    {item.dayOfWeek.split(' ')[0]}
                  </span>
                  <div className="my-1">
                    {isDone ? (
                      <div className="w-5 h-5 rounded-full bg-[#15803D] text-white flex items-center justify-center mx-auto">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full border border-dashed border-[#C99A3A] flex items-center justify-center mx-auto text-[9px] font-bold text-[#C99A3A]">
                        {isToday ? '⏳' : '—'}
                      </div>
                    )}
                  </div>
                  <span className="text-[9px] font-mono text-[#77736A]">
                    {isDone ? 'Done' : isToday ? 'Due' : 'Rest'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Clinical Milestones List */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#252525] uppercase tracking-wider">
              Rehabilitation Milestones & Clinical Benefits
            </span>
          </div>

          <div className="space-y-2">
            {STREAK_MILESTONES.map((m) => {
              const isUnlocked = currentStreak >= m.requiredDays;

              return (
                <div
                  key={m.id}
                  className={`p-3 rounded-2xl border text-xs flex items-start gap-3 transition-all ${
                    isUnlocked
                      ? 'bg-[#F0FDF4]/70 border-[#BBF7D0]'
                      : 'bg-[#FAFAF7] border-[#E8E4D8] opacity-80'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${
                      isUnlocked
                        ? 'bg-[#15803D] text-white'
                        : 'bg-white border border-[#E8E4D8] text-[#77736A]'
                    }`}
                  >
                    {isUnlocked ? <Award className="w-5 h-5" /> : <ShieldCheck className="w-4 h-4" />}
                  </div>

                  <div className="flex-1 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#252525]">{m.badgeName}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          isUnlocked
                            ? 'bg-[#F0FDF4] text-[#15803D] border-[#BBF7D0]'
                            : 'bg-white text-[#77736A] border-[#E8E4D8]'
                        }`}
                      >
                        {isUnlocked ? 'Unlocked ✓' : `${m.requiredDays} Days Required`}
                      </span>
                    </div>

                    <p className="text-[11px] text-[#5F5B52]">{m.description}</p>
                    <div className="text-[10px] font-bold text-[#8E681C] flex items-center gap-1 pt-0.5">
                      <Heart className="w-3 h-3 text-[#EA580C]" />
                      <span>{m.rewardBenefit}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Evaluator / Demo Simulator Strip */}
        <div className="p-3 bg-[#FCF9F2] rounded-2xl border border-[#E6C978]/60 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1 text-[11px] text-[#8E681C] font-semibold">
            <Zap className="w-3.5 h-3.5 text-[#EA580C]" />
            <span>Demo Tester: Simulate completing today's tasks to advance streak</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleSimulateIncrement}
              className="px-2.5 py-1 rounded-xl bg-white border border-[#D8B15A] hover:bg-[#F7F1E1] text-[#8E681C] text-[11px] font-bold cursor-pointer shadow-2xs"
            >
              +1 Day (Simulate)
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="px-2.5 py-1 rounded-xl text-[#77736A] hover:bg-black/5 text-[11px] cursor-pointer"
              title="Reset streak to initial baseline"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-[#E8E4D8] flex items-center justify-between">
          <button
            type="button"
            onClick={handleCelebrate}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-bold shadow-md cursor-pointer transition-all"
          >
            <Flame className="w-4 h-4 fill-current" />
            <span>Celebrate Streak!</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#FAFAF7] hover:bg-[#F7F4EC] border border-[#E8E4D8] text-xs font-bold text-[#5F5B52] cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
