import React from 'react';

interface CircularProgressRingProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  showCenterText?: boolean;
  className?: string;
}

export const CircularProgressRing: React.FC<CircularProgressRingProps> = ({
  percentage,
  size = 120,
  strokeWidth = 10,
  label,
  sublabel,
  showCenterText = true,
  className = '',
}) => {
  // Clamp percentage between 0 and 100
  const clampedPercentage = Math.min(100, Math.max(0, percentage));
  
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clampedPercentage / 100) * circumference;

  // Determine ring color depending on completion level
  const isComplete = clampedPercentage >= 100;
  const ringStrokeColor = isComplete ? '#15803D' : '#C99A3A'; // Emerald when 100%, Medical Gold otherwise

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
      role="progressbar"
      aria-valuenow={clampedPercentage}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label || `Daily task progress: ${clampedPercentage}%`}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        {/* Background Track Ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#EFECE4"
          strokeWidth={strokeWidth}
          fill="none"
          className="transition-colors duration-300"
        />

        {/* Dynamic Progress Fill Ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={ringStrokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="none"
          style={{
            transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.4s ease',
          }}
        />
      </svg>

      {/* Center Percentage & Label */}
      {showCenterText && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2 select-none pointer-events-none">
          <span className="text-2xl sm:text-3xl font-black text-[#252525] tabular-nums tracking-tight leading-none">
            {Math.round(clampedPercentage)}%
          </span>
          <span className="text-[10px] font-bold text-[#8E681C] uppercase tracking-wider mt-1">
            {sublabel || (isComplete ? 'Complete' : 'Done')}
          </span>
        </div>
      )}
    </div>
  );
};
