import React from 'react';
import { Flame, Sparkles, Check, ChevronRight } from 'lucide-react';
import { DailyStreakData } from '../../types';

interface DailyStreakBadgeProps {
  streakData: DailyStreakData;
  onClick: () => void;
  compact?: boolean;
  className?: string;
}

export const DailyStreakBadge: React.FC<DailyStreakBadgeProps> = ({
  streakData,
  onClick,
  compact = false,
  className = '',
}) => {
  const { currentStreak, todayCompleted } = streakData;

  if (compact) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border font-bold text-xs cursor-pointer transition-all active:scale-95 shadow-2xs ${
          todayCompleted
            ? 'bg-[#FEF3C7] border-[#FDE68A] text-[#92400E] ring-2 ring-[#FDE68A]/60'
            : 'bg-[#FCF9F2] border-[#E6C978] text-[#8E681C] hover:bg-[#F7F1E1]'
        } ${className}`}
        title={`Current Daily Streak: ${currentStreak} Days. Tap to view rewards!`}
        aria-label={`Daily streak: ${currentStreak} days`}
      >
        <div className="relative flex items-center justify-center">
          <Flame
            className={`w-4 h-4 fill-current ${
              todayCompleted ? 'text-[#EA580C] animate-bounce' : 'text-[#D97706]'
            }`}
          />
          {todayCompleted && (
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#15803D]" />
          )}
        </div>
        <span className="tabular-nums font-black">{currentStreak}</span>
        <span className="text-[10px] uppercase font-bold tracking-tight">
          {currentStreak === 1 ? 'Day' : 'Days'}
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex items-center justify-between gap-3 p-3 sm:px-4 sm:py-3 rounded-2xl border transition-all cursor-pointer shadow-xs ${
        todayCompleted
          ? 'bg-gradient-to-r from-[#FFFBEB] via-[#FEF3C7] to-[#FDE68A]/40 border-[#FDE68A] ring-1 ring-[#FDE68A]'
          : 'bg-[#FCF9F2] hover:bg-[#F7F1E1] border-[#E6C978]'
      } ${className}`}
      aria-label={`Daily Streak: ${currentStreak} Days. Tap to view achievements and rewards.`}
    >
      <div className="flex items-center gap-3">
        {/* Animated Flame Icon Container */}
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-2xs transition-transform group-hover:scale-105 ${
            todayCompleted
              ? 'bg-gradient-to-br from-[#EA580C] to-[#C2410C] text-white ring-2 ring-[#FDBA74]'
              : 'bg-white border border-[#E6C978] text-[#D97706]'
          }`}
        >
          <Flame className={`w-5 h-5 fill-current ${todayCompleted ? 'animate-pulse' : ''}`} />
        </div>

        {/* Labels & Numbers */}
        <div className="text-left">
          <div className="flex items-center gap-1.5">
            <span className="text-xs sm:text-sm font-black text-[#252525] tabular-nums">
              {currentStreak} Day Rehabilitation Streak
            </span>
            {todayCompleted && (
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#15803D] bg-[#F0FDF4] px-1.5 py-0.5 rounded border border-[#BBF7D0] flex items-center gap-0.5">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
                <span>Secured</span>
              </span>
            )}
          </div>

          <p className="text-[11px] text-[#5F5B52] leading-tight mt-0.5">
            {todayCompleted
              ? 'Today’s exercises complete! Streak extended 🔥'
              : 'Complete today’s tasks to secure your streak!'}
          </p>
        </div>
      </div>

      {/* Right chevron and reward tease */}
      <div className="flex items-center gap-1 text-[#8E681C] text-xs font-bold shrink-0">
        <span className="hidden sm:inline text-[11px] uppercase tracking-wider text-[#92400E]">
          Rewards
        </span>
        <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
      </div>
    </button>
  );
};
