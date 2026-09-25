import React, { useState, useEffect } from 'react';

interface ExerciseVisualCueProps {
  exerciseName: string;
  isPerforming?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const ExerciseVisualCue: React.FC<ExerciseVisualCueProps> = ({
  exerciseName,
  isPerforming = true,
  size = 'md',
}) => {
  const [phase, setPhase] = useState<number>(0); // 0: start, 1: moving, 2: hold, 3: return

  useEffect(() => {
    if (!isPerforming) return;
    const interval = setInterval(() => {
      setPhase((prev) => (prev + 1) % 4);
    }, 1500);
    return () => clearInterval(interval);
  }, [isPerforming]);

  const normName = (exerciseName || '').toLowerCase();
  const isAnkle = normName.includes('ankle');
  const isFlexionOrHeelSlide = normName.includes('flexion') || normName.includes('heel slide');
  const isQuadSet = normName.includes('quad') || normName.includes('isometric');
  const isShoulder = normName.includes('shoulder') || normName.includes('scapular');

  // Dynamic values based on phase
  // Knee Extension: 0: 85 deg, 1: 45 deg, 2: 5 deg (hold), 3: 50 deg
  const kneeLowerLegAngle = phase === 0 ? 85 : phase === 1 ? 40 : phase === 2 ? 0 : 50;

  // Ankle: 0: neutral (0 deg), 1: dorsiflex (-25 deg toes up), 2: hold (-25 deg), 3: plantarflex (+25 deg toes down)
  const ankleAngle = phase === 0 ? 0 : phase === 1 ? -25 : phase === 2 ? -25 : 25;

  const phaseLabel =
    phase === 0
      ? '1. Ready Position'
      : phase === 1
      ? '2. Smooth Movement'
      : phase === 2
      ? '3. Hold 3 Seconds'
      : '4. Controlled Return';

  const containerHeight = size === 'sm' ? 'h-36' : size === 'lg' ? 'h-64' : 'h-48';

  return (
    <div className="flex flex-col items-center justify-center p-3 sm:p-4 bg-[#FCF9F2]/60 rounded-3xl border border-[#E6C978]/60 relative overflow-hidden">
      {/* Background Grid Pattern for Medical Precision Feel */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(#C99A3A 1px, transparent 1px), radial-gradient(#C99A3A 1px, #FCF9F2 1px)',
          backgroundSize: '20px 20px',
        }}
      />

      {/* Main SVG Graphic */}
      <div className={`relative w-full max-w-[280px] ${containerHeight} flex items-center justify-center`}>
        {/* --- SCENARIO 1: ANKLE PUMPS --- */}
        {isAnkle ? (
          <svg viewBox="0 0 240 180" className="w-full h-full drop-shadow-xs" fill="none">
            {/* Floor / Footrest */}
            <path d="M 20 155 L 220 155" stroke="#D8B15A" strokeWidth="3" strokeDasharray="6 4" />

            {/* Lower Leg / Calf */}
            <path d="M 60 70 L 110 130" stroke="#B8892D" strokeWidth="12" strokeLinecap="round" />
            <path d="M 75 60 L 120 125" stroke="#C99A3A" strokeWidth="8" strokeLinecap="round" />

            {/* Ankle Joint */}
            <circle cx="115" cy="130" r="7" fill="#E6C978" stroke="#8E681C" strokeWidth="3" />

            {/* Moving Foot Plate */}
            <g
              style={{
                transformOrigin: '115px 130px',
                transform: `rotate(${ankleAngle}deg)`,
                transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              {/* Heel & Sole */}
              <path d="M 98 135 L 175 135" stroke="#8E681C" strokeWidth="12" strokeLinecap="round" />
              {/* Toes */}
              <circle cx="175" cy="135" r="7" fill="#C99A3A" />
              {/* Direction Indicator Arrow on Toes */}
              <path
                d="M 185 130 L 185 115 M 180 120 L 185 115 L 190 120"
                stroke="#15803D"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={phase === 1 || phase === 2 ? 1 : 0.2}
              />
            </g>

            {/* Calf Blood Flow Waves */}
            <path
              d="M 50 85 Q 65 75 75 95"
              stroke="#22C55E"
              strokeWidth="2.5"
              strokeLinecap="round"
              opacity={phase === 2 ? 0.9 : 0.2}
            />
            <path
              d="M 55 105 Q 70 95 80 115"
              stroke="#22C55E"
              strokeWidth="2.5"
              strokeLinecap="round"
              opacity={phase === 2 ? 0.9 : 0.2}
            />

            {/* Motion Arc */}
            <path
              d="M 175 110 C 185 125, 185 145, 170 160"
              stroke="#D8B15A"
              strokeWidth="2"
              strokeDasharray="4 3"
            />
          </svg>
        ) : isShoulder ? (
          /* --- SCENARIO 2: SHOULDER ROTATION --- */
          <svg viewBox="0 0 240 180" className="w-full h-full drop-shadow-xs" fill="none">
            {/* Human Torso */}
            <circle cx="120" cy="40" r="14" fill="#C99A3A" />
            <path d="M 120 54 L 120 130" stroke="#B8892D" strokeWidth="10" strokeLinecap="round" />
            {/* Left Upper Arm */}
            <path d="M 120 68 L 75 95" stroke="#B8892D" strokeWidth="8" strokeLinecap="round" />
            {/* Right Upper Arm held snug to ribcage */}
            <path d="M 120 68 L 155 105" stroke="#B8892D" strokeWidth="8" strokeLinecap="round" />
            <circle cx="155" cy="105" r="6" fill="#E6C978" stroke="#8E681C" strokeWidth="2" />

            {/* Rotating Forearm */}
            <g
              style={{
                transformOrigin: '155px 105px',
                transform: `rotate(${phase === 0 ? 0 : phase === 1 ? 40 : phase === 2 ? 45 : 15}deg)`,
                transition: 'transform 0.9s ease-in-out',
              }}
            >
              <path d="M 155 105 L 195 105" stroke="#C99A3A" strokeWidth="7" strokeLinecap="round" />
              <circle cx="195" cy="105" r="5" fill="#8E681C" />
            </g>
            <path
              d="M 195 90 C 205 100, 205 115, 195 125"
              stroke="#D8B15A"
              strokeWidth="2"
              strokeDasharray="4 3"
            />
          </svg>
        ) : (
          /* --- SCENARIO 3: SEATED KNEE EXTENSION (DEFAULT & HIGH FREQUENCY) --- */
          <svg viewBox="0 0 240 180" className="w-full h-full drop-shadow-xs" fill="none">
            {/* Chair Posture Frame */}
            <path d="M 70 85 L 70 160" stroke="#A9A59B" strokeWidth="5" strokeLinecap="round" />
            <path d="M 115 85 L 115 160" stroke="#A9A59B" strokeWidth="5" strokeLinecap="round" />
            <path d="M 50 85 L 125 85" stroke="#77736A" strokeWidth="7" strokeLinecap="round" />
            <path d="M 55 30 L 55 85" stroke="#77736A" strokeWidth="7" strokeLinecap="round" />

            {/* Human Head */}
            <circle cx="80" cy="38" r="12" fill="#C99A3A" />

            {/* Upright Back Spine */}
            <path d="M 80 50 L 83 85" stroke="#B8892D" strokeWidth="9" strokeLinecap="round" />

            {/* Quad Muscle Activation Highlight Glow (when extending/holding) */}
            <path
              d="M 85 85 L 135 85"
              stroke={phase === 2 ? '#22C55E' : '#B8892D'}
              strokeWidth={phase === 2 ? '13' : '10'}
              strokeLinecap="round"
              className="transition-all duration-300"
            />
            {phase === 2 && (
              <text x="95" y="76" fill="#15803D" fontSize="8" fontWeight="bold">
                QUAD ENGAGED
              </text>
            )}

            {/* Knee Pivot Joint */}
            <circle cx="135" cy="85" r="7" fill="#E6C978" stroke="#8E681C" strokeWidth="3" />

            {/* Moving Lower Leg & Foot */}
            <g
              style={{
                transformOrigin: '135px 85px',
                transform: `rotate(${kneeLowerLegAngle - 85}deg)`,
                transition: 'transform 1.1s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              {/* Shin / Calf */}
              <path d="M 135 85 L 135 145" stroke="#C99A3A" strokeWidth="8" strokeLinecap="round" />
              {/* Ankle Joint */}
              <circle cx="135" cy="145" r="4" fill="#8E681C" />
              {/* Foot with toes up */}
              <path d="M 135 145 L 158 142" stroke="#8E681C" strokeWidth="6" strokeLinecap="round" />
            </g>

            {/* Safe 0° - 90° Movement Arc */}
            <path
              d="M 142 142 C 170 135, 185 115, 192 88"
              stroke="#D8B15A"
              strokeWidth="2.5"
              strokeDasharray="4 3"
              opacity={phase === 1 || phase === 2 ? 0.9 : 0.4}
            />

            {/* Degree Arc Label */}
            <text x="180" y="80" fill="#8E681C" fontSize="10" fontWeight="bold">
              0° (Level)
            </text>
            <text x="145" y="160" fill="#77736A" fontSize="9">
              90° (Seated)
            </text>
          </svg>
        )}

        {/* Phase Pill Indicator */}
        <div className="absolute top-2 right-2 text-[10px] font-bold px-2.5 py-1 rounded-full bg-white border border-[#E6C978] text-[#8E681C] shadow-xs flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#C99A3A] animate-ping" />
          <span>{phaseLabel}</span>
        </div>

        {/* Safe Arc Stamp */}
        <div className="absolute bottom-2 left-2 text-[9px] font-bold px-2 py-0.5 rounded-md bg-[#F0FDF4] border border-[#BBF7D0] text-[#15803D]">
          ✓ Pain-Free Arc (0°-90°)
        </div>
      </div>

      {/* Caption & Cadence Meter */}
      <div className="w-full pt-2 mt-1 border-t border-[#E8E4D8]/80 flex items-center justify-between text-xs text-[#5F5B52]">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold">
          <span className="w-2 h-2 rounded-full bg-[#15803D]" />
          <span>Hold steady for 3 full seconds at terminal position</span>
        </div>
        <div className="text-[10px] font-mono text-[#8E681C] bg-white px-2 py-0.5 rounded border border-[#E6C978]">
          Cadence: 2s-3s-2s
        </div>
      </div>
    </div>
  );
};
