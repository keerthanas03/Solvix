import React from 'react';

interface GoldEmblemProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  withGlow?: boolean;
}

export const GoldEmblem: React.FC<GoldEmblemProps> = ({
  size = 'md',
  className = '',
  withGlow = false,
}) => {
  const sizeMap = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${sizeMap[size]} ${className}`}
      aria-label="RehabSathi Medical Gold Emblem"
    >
      {withGlow && (
        <div className="absolute inset-0 rounded-full bg-[#D8B15A]/20 blur-md transform scale-110 pointer-events-none" />
      )}
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_2px_4px_rgba(184,137,45,0.15)]"
      >
        <defs>
          <linearGradient id="goldGradient" x1="10" y1="10" x2="90" y2="90" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#E6C978" />
            <stop offset="40%" stopColor="#D8B15A" />
            <stop offset="75%" stopColor="#C99A3A" />
            <stop offset="100%" stopColor="#B8892D" />
          </linearGradient>
          <linearGradient id="innerGlow" x1="50" y1="15" x2="50" y2="85" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#B8892D" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* Outer Circular Laurel / Shield Border */}
        <circle cx="50" cy="50" r="44" stroke="url(#goldGradient)" strokeWidth="2.5" strokeDasharray="3 2" opacity="0.65" />
        <circle cx="50" cy="50" r="40" stroke="url(#goldGradient)" strokeWidth="1.8" />

        {/* Medical Cross & Rehabilitation Joint Mobius Harmony */}
        {/* Supporting Human Hands Base */}
        <path
          d="M 28 66 C 33 74, 45 77, 50 77 C 55 77, 67 74, 72 66 C 65 72, 57 73, 50 73 C 43 73, 35 72, 28 66 Z"
          fill="url(#goldGradient)"
        />

        {/* Central Spinal / Joint Alignment Rod with Caring Wings / Leaves */}
        <path
          d="M 50 22 C 48 30, 48 40, 50 49 C 52 40, 52 30, 50 22 Z"
          fill="url(#goldGradient)"
        />
        
        {/* Left Protective Care Arc */}
        <path
          d="M 33 46 C 30 38, 36 29, 45 28 C 43 33, 40 40, 44 48 C 39 49, 35 48, 33 46 Z"
          fill="url(#goldGradient)"
        />

        {/* Right Protective Care Arc */}
        <path
          d="M 67 46 C 70 38, 64 29, 55 28 C 57 33, 60 40, 56 48 C 61 49, 65 48, 67 46 Z"
          fill="url(#goldGradient)"
        />

        {/* Golden Central Heart / Node */}
        <circle cx="50" cy="48" r="4" fill="url(#goldGradient)" />

        {/* Asclepius & Joint Loop (Dynamic Recovery Wave) */}
        <path
          d="M 38 60 C 42 54, 47 56, 50 52 C 53 48, 58 52, 62 60"
          stroke="url(#goldGradient)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Subtle Crown / Sun Radiance Accent on Top */}
        <circle cx="50" cy="18" r="2.2" fill="#E6C978" />
        <circle cx="43" cy="20" r="1.5" fill="#D8B15A" />
        <circle cx="57" cy="20" r="1.5" fill="#D8B15A" />
      </svg>
    </div>
  );
};
