import React, { useState, useEffect } from 'react';

interface ExerciseVisualCueProps {
  exerciseName: string;
  bodyPart?: string;
  isPerforming?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const ExerciseVisualCue: React.FC<ExerciseVisualCueProps> = ({
  exerciseName,
  bodyPart,
  isPerforming = true,
  size = 'md',
}) => {
  const [phase, setPhase] = useState<number>(0); // 0: ready, 1: moving, 2: hold, 3: return

  useEffect(() => {
    if (!isPerforming) return;
    const interval = setInterval(() => {
      setPhase((prev) => (prev + 1) % 4);
    }, 1500);
    return () => clearInterval(interval);
  }, [isPerforming]);

  const normName = (exerciseName || '').toLowerCase();
  const bp = (bodyPart || '').toLowerCase();

  // Detect body part / exercise category
  const isNeck = bp === 'neck' || normName.includes('chin') || normName.includes('cervical') || normName.includes('neck');
  const isShoulder = bp === 'shoulder' || normName.includes('shoulder') || normName.includes('wall walk') || normName.includes('pendulum') || normName.includes('scapular');
  const isBack = bp === 'back' || normName.includes('cat') || normName.includes('camel') || normName.includes('spine') || normName.includes('lumbar') || normName.includes('bridge');
  const isHip = bp === 'hip' || normName.includes('clamshell') || normName.includes('hip') || normName.includes('pelvis');
  const isAnkle = bp === 'ankle' || normName.includes('ankle') || normName.includes('calf') || normName.includes('achilles');
  const isWrist = bp === 'wrist' || normName.includes('wrist') || normName.includes('tendon') || normName.includes('hand') || normName.includes('finger');
  const isPosture = bp === 'posture' || normName.includes('angel') || normName.includes('posture') || normName.includes('thoracic');
  const isKnee = bp === 'knee' || (!isNeck && !isShoulder && !isBack && !isHip && !isAnkle && !isWrist && !isPosture);

  // Dynamic values by phase
  // Knee Extension (0° to 90°)
  const kneeLowerLegAngle = phase === 0 ? 85 : phase === 1 ? 40 : phase === 2 ? 0 : 50;
  // Ankle (-25° dorsiflex to +25° plantarflex)
  const ankleAngle = phase === 0 ? 0 : phase === 1 ? -25 : phase === 2 ? -25 : 25;
  // Neck translation (0 to -14px backward glide)
  const neckShiftX = phase === 0 ? 0 : phase === 1 ? -8 : phase === 2 ? -14 : -4;
  // Shoulder elevation (0° to 135°)
  const shoulderArmAngle = phase === 0 ? 15 : phase === 1 ? 75 : phase === 2 ? 135 : 60;
  // Hip Clamshell abduction angle (0° to 40°)
  const clamAngle = phase === 0 ? 0 : phase === 1 ? 25 : phase === 2 ? 40 : 15;
  // Back Cat/Camel arch offset
  const catArch = phase === 0 ? 0 : phase === 1 ? -16 : phase === 2 ? -20 : 12;
  // Wrist tendon glide stage
  const wristStage = phase; // 0: straight, 1: hook, 2: fist, 3: tabletop
  // Posture Wall Angel arm height
  const angelArmHeight = phase === 0 ? 0 : phase === 1 ? -25 : phase === 2 ? -45 : -15;

  const phaseLabel =
    phase === 0
      ? '1. Ready Position'
      : phase === 1
      ? '2. Smooth Movement'
      : phase === 2
      ? '3. Hold 3 Seconds'
      : '4. Controlled Return';

  const containerHeight = size === 'sm' ? 'h-36' : size === 'lg' ? 'h-64' : 'h-52';

  return (
    <div className="flex flex-col items-center justify-center p-3 sm:p-4 bg-[#FCF9F2]/70 rounded-3xl border border-[#E6C978]/60 relative overflow-hidden shadow-2xs">
      {/* Background Precision Grid */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(#C99A3A 1px, transparent 1px), radial-gradient(#C99A3A 1px, #FCF9F2 1px)',
          backgroundSize: '18px 18px',
        }}
      />

      {/* Main Vector Diagram */}
      <div className={`relative w-full max-w-[290px] ${containerHeight} flex items-center justify-center`}>
        {/* ========================================================= */}
        {/* 1. NECK & CERVICAL SPINE ANIMATION (CHIN TUCK / RETRACTION) */}
        {/* ========================================================= */}
        {isNeck && (
          <svg viewBox="0 0 240 180" className="w-full h-full drop-shadow-xs" fill="none">
            {/* Vertical Postural Reference Line */}
            <line x1="90" y1="20" x2="90" y2="160" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="4 4" />
            <text x="50" y="30" fill="#94A3B8" fontSize="8" fontWeight="bold">POSTURE AXIS</text>

            {/* Torso & Upper Back */}
            <path d="M 90 90 L 90 160" stroke="#77736A" strokeWidth="12" strokeLinecap="round" />
            <path d="M 90 95 L 140 145" stroke="#A9A59B" strokeWidth="8" strokeLinecap="round" />

            {/* Cervical Spine (Vertebrae Column) */}
            <path
              d={`M 90 90 Q ${85 + neckShiftX * 0.4} 65 ${100 + neckShiftX} 50`}
              stroke={phase === 2 ? '#15803D' : '#B8892D'}
              strokeWidth="7"
              strokeLinecap="round"
              className="transition-all duration-700"
            />

            {/* Head & Skull (Gliding horizontally backward) */}
            <g
              style={{
                transform: `translateX(${neckShiftX}px)`,
                transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              {/* Skull */}
              <circle cx="102" cy="46" r="22" fill="#E6C978" stroke="#8E681C" strokeWidth="3" />
              {/* Nose & Chin Profile */}
              <path d="M 124 44 L 132 47 L 124 53 L 126 60 L 115 62" stroke="#8E681C" strokeWidth="3" strokeLinecap="round" fill="none" />
              {/* Ear Target Pivot */}
              <circle cx="100" cy="48" r="4" fill="#C99A3A" />
              {/* Eye */}
              <circle cx="118" cy="42" r="2" fill="#252525" />

              {/* Horizontal Axial Glide Arrow */}
              <path
                d="M 140 50 L 125 50 M 130 45 L 125 50 L 130 55"
                stroke="#15803D"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={phase === 1 || phase === 2 ? 1 : 0.2}
              />
            </g>

            {/* Deep Neck Flexors Activation Label */}
            {phase === 2 && (
              <g className="animate-in fade-in">
                <rect x="130" y="80" width="95" height="22" rx="6" fill="#F0FDF4" stroke="#BBF7D0" />
                <text x="136" y="94" fill="#15803D" fontSize="8" fontWeight="bold">
                  DEEP FLEXORS TIGHT
                </text>
              </g>
            )}
          </svg>
        )}

        {/* ========================================================= */}
        {/* 2. SHOULDER & ROTATOR CUFF (WALL WALK / ABDUCTION ELEVATION) */}
        {/* ========================================================= */}
        {isShoulder && (
          <svg viewBox="0 0 240 180" className="w-full h-full drop-shadow-xs" fill="none">
            {/* Wall Surface on Right */}
            <line x1="205" y1="15" x2="205" y2="165" stroke="#77736A" strokeWidth="6" strokeLinecap="round" />
            <text x="180" y="28" fill="#77736A" fontSize="8" fontWeight="bold">WALL</text>

            {/* Standing Patient Torso */}
            <circle cx="85" cy="40" r="14" fill="#E6C978" stroke="#8E681C" strokeWidth="2.5" />
            <path d="M 85 54 L 85 130" stroke="#B8892D" strokeWidth="10" strokeLinecap="round" />
            <path d="M 85 130 L 70 165" stroke="#8E681C" strokeWidth="6" strokeLinecap="round" />
            <path d="M 85 130 L 98 165" stroke="#8E681C" strokeWidth="6" strokeLinecap="round" />

            {/* Shoulder Pivot Joint */}
            <circle cx="95" cy="65" r="7" fill="#C99A3A" stroke="#8E681C" strokeWidth="3" />

            {/* Rotating Arm Climbing Wall */}
            <g
              style={{
                transformOrigin: '95px 65px',
                transform: `rotate(-${shoulderArmAngle}deg)`,
                transition: 'transform 0.9s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              {/* Upper Arm */}
              <line x1="95" y1="65" x2="155" y2="65" stroke={phase === 2 ? '#15803D' : '#C99A3A'} strokeWidth="8" strokeLinecap="round" />
              {/* Elbow */}
              <circle cx="155" cy="65" r="5" fill="#E6C978" />
              {/* Forearm & Hand touching wall */}
              <line x1="155" y1="65" x2="200" y2="65" stroke="#8E681C" strokeWidth="6" strokeLinecap="round" />
              <circle cx="200" cy="65" r="4" fill="#C99A3A" />
            </g>

            {/* Elevation Arc Indicator */}
            <path
              d="M 125 65 C 130 40, 150 15, 180 20"
              stroke="#D8B15A"
              strokeWidth="2.5"
              strokeDasharray="4 3"
            />
            <text x="145" y="24" fill="#8E681C" fontSize="9" fontWeight="bold">
              {phase === 2 ? '140° Abduction' : 'Wall Crawl'}
            </text>
          </svg>
        )}

        {/* ========================================================= */}
        {/* 3. THORACIC & LUMBAR SPINE (CAT-CAMEL & PELVIC BRIDGE) */}
        {/* ========================================================= */}
        {isBack && (
          <svg viewBox="0 0 240 180" className="w-full h-full drop-shadow-xs" fill="none">
            {/* Ground / Exercise Mat */}
            <line x1="20" y1="145" x2="220" y2="145" stroke="#8E681C" strokeWidth="5" strokeLinecap="round" />
            <text x="30" y="160" fill="#77736A" fontSize="8">FLOOR MAT</text>

            {/* Quadruped Hands & Knees Base */}
            {/* Arms planted */}
            <line x1="65" y1="95" x2="65" y2="145" stroke="#B8892D" strokeWidth="7" strokeLinecap="round" />
            {/* Thighs planted */}
            <line x1="175" y1="95" x2="175" y2="145" stroke="#B8892D" strokeWidth="7" strokeLinecap="round" />

            {/* Head */}
            <circle cx="50" cy={phase === 2 ? 100 : 85} r="12" fill="#E6C978" stroke="#8E681C" strokeWidth="2.5" />

            {/* Dynamic Segmental Spine Wave */}
            <path
              d={`M 65 95 Q 120 ${85 + catArch} 175 95`}
              stroke={phase === 2 ? '#15803D' : '#C99A3A'}
              strokeWidth="11"
              strokeLinecap="round"
              className="transition-all duration-800"
            />

            {/* Spinal Wave Direction Indicator */}
            {phase === 1 || phase === 2 ? (
              <path
                d="M 120 60 L 120 45 M 115 52 L 120 45 L 125 52"
                stroke="#15803D"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ) : null}

            {/* Status Pill */}
            <text x="95" y="125" fill="#8E681C" fontSize="9" fontWeight="bold">
              {phase === 2 ? 'Cat Arch (Flexion)' : phase === 0 ? 'Neutral Spine' : 'Fluid Wave'}
            </text>
          </svg>
        )}

        {/* ========================================================= */}
        {/* 4. HIP & PELVIS (SIDE-LYING CLAMSHELL ABDUCTION) */}
        {/* ========================================================= */}
        {isHip && (
          <svg viewBox="0 0 240 180" className="w-full h-full drop-shadow-xs" fill="none">
            {/* Mat Surface */}
            <line x1="20" y1="150" x2="220" y2="150" stroke="#8E681C" strokeWidth="4" />

            {/* Torso & Head */}
            <circle cx="50" cy="90" r="14" fill="#E6C978" stroke="#8E681C" strokeWidth="2" />
            <line x1="50" y1="104" x2="105" y2="120" stroke="#B8892D" strokeWidth="10" strokeLinecap="round" />

            {/* Pelvic Hub */}
            <circle cx="105" cy="120" r="9" fill="#C99A3A" stroke="#8E681C" strokeWidth="3" />

            {/* Stationary Bottom Thigh */}
            <line x1="105" y1="120" x2="165" y2="140" stroke="#A9A59B" strokeWidth="8" strokeLinecap="round" />
            <line x1="165" y1="140" x2="195" y2="120" stroke="#A9A59B" strokeWidth="6" strokeLinecap="round" />

            {/* Moving Top Thigh (Clamshell Opener) */}
            <g
              style={{
                transformOrigin: '105px 120px',
                transform: `rotate(-${clamAngle}deg)`,
                transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              <line x1="105" y1="120" x2="165" y2="120" stroke={phase === 2 ? '#15803D' : '#C99A3A'} strokeWidth="9" strokeLinecap="round" />
              <circle cx="165" cy="120" r="6" fill="#E6C978" stroke="#8E681C" strokeWidth="2" />
              {/* Lower leg meeting at feet */}
              <line x1="165" y1="120" x2="195" y2="120" stroke="#8E681C" strokeWidth="6" strokeLinecap="round" />
            </g>

            {/* Gluteus Medius Glow */}
            {phase === 2 && (
              <circle cx="105" cy="110" r="12" fill="#22C55E" opacity="0.35" className="animate-ping" />
            )}

            {/* Clamshell Abduction Arc */}
            <path d="M 165 140 C 175 130, 175 110, 165 95" stroke="#D8B15A" strokeWidth="2" strokeDasharray="3 3" />
            <text x="140" y="80" fill="#8E681C" fontSize="9" fontWeight="bold">
              0°-45° Clamshell
            </text>
          </svg>
        )}

        {/* ========================================================= */}
        {/* 5. KNEE & THIGH (SEATED EXTENSION WITH VMO GLOW) */}
        {/* ========================================================= */}
        {isKnee && (
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
                QUAD (VMO) ON
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

        {/* ========================================================= */}
        {/* 6. ANKLE & FOOT (PUMPS & CALF ACHILLES STRETCH) */}
        {/* ========================================================= */}
        {isAnkle && (
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
              {/* Direction Indicator Arrow */}
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
            <path d="M 50 85 Q 65 75 75 95" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" opacity={phase === 2 ? 0.9 : 0.2} />
            <path d="M 55 105 Q 70 95 80 115" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" opacity={phase === 2 ? 0.9 : 0.2} />

            {/* Motion Arc */}
            <path d="M 175 110 C 185 125, 185 145, 170 160" stroke="#D8B15A" strokeWidth="2" strokeDasharray="4 3" />
            <text x="160" y="95" fill="#8E681C" fontSize="9" fontWeight="bold">
              -25° / +35°
            </text>
          </svg>
        )}

        {/* ========================================================= */}
        {/* 7. WRIST & HAND (TENDON GLIDING & MEDIAN NERVE FLOSSING) */}
        {/* ========================================================= */}
        {isWrist && (
          <svg viewBox="0 0 240 180" className="w-full h-full drop-shadow-xs" fill="none">
            {/* Forearm */}
            <rect x="30" y="80" width="80" height="26" rx="10" fill="#C99A3A" stroke="#8E681C" strokeWidth="2.5" />
            {/* Median Nerve Path Glow */}
            <line x1="30" y1="93" x2="110" y2="93" stroke="#FEF08A" strokeWidth="3" strokeDasharray="4 2" />

            {/* Wrist Joint Hub */}
            <circle cx="110" cy="93" r="8" fill="#E6C978" stroke="#8E681C" strokeWidth="3" />

            {/* Palm & Knuckles */}
            <rect x="110" y="80" width="35" height="26" rx="6" fill="#E6C978" stroke="#8E681C" strokeWidth="2" />

            {/* Dynamic Fingers by Phase Stage */}
            {wristStage === 0 && (
              /* Stage 1: Straight Hand */
              <g className="animate-in fade-in">
                <line x1="145" y1="84" x2="195" y2="84" stroke="#8E681C" strokeWidth="5" strokeLinecap="round" />
                <line x1="145" y1="90" x2="200" y2="90" stroke="#8E681C" strokeWidth="5" strokeLinecap="round" />
                <line x1="145" y1="96" x2="198" y2="96" stroke="#8E681C" strokeWidth="5" strokeLinecap="round" />
                <line x1="145" y1="102" x2="190" y2="102" stroke="#8E681C" strokeWidth="5" strokeLinecap="round" />
                <text x="145" y="70" fill="#15803D" fontSize="9" fontWeight="bold">1. Straight Hand</text>
              </g>
            )}

            {wristStage === 1 && (
              /* Stage 2: Hook Fist */
              <g className="animate-in fade-in">
                <path d="M 145 85 L 175 85 L 175 105" stroke="#15803D" strokeWidth="5" strokeLinecap="round" fill="none" />
                <path d="M 145 92 L 180 92 L 180 112" stroke="#15803D" strokeWidth="5" strokeLinecap="round" fill="none" />
                <text x="145" y="70" fill="#15803D" fontSize="9" fontWeight="bold">2. Hook Fist</text>
              </g>
            )}

            {wristStage === 2 && (
              /* Stage 3: Full Gentle Fist */
              <g className="animate-in fade-in">
                <circle cx="155" cy="93" r="14" fill="#C99A3A" stroke="#8E681C" strokeWidth="3" />
                <text x="140" y="70" fill="#15803D" fontSize="9" fontWeight="bold">3. Full Fist</text>
              </g>
            )}

            {wristStage === 3 && (
              /* Stage 4: Tabletop (MCP 90°, IP Straight) */
              <g className="animate-in fade-in">
                <path d="M 145 82 L 145 110 L 170 110" stroke="#8E681C" strokeWidth="5" strokeLinecap="round" fill="none" />
                <text x="140" y="70" fill="#15803D" fontSize="9" fontWeight="bold">4. Tabletop</text>
              </g>
            )}

            {/* Carpal Tunnel Decompression Label */}
            <text x="40" y="135" fill="#77736A" fontSize="8" fontWeight="bold">
              CARPAL CANAL TENDON GLIDE
            </text>
          </svg>
        )}

        {/* ========================================================= */}
        {/* 8. POSTURE & THORACIC MOBILIZATION (WALL ANGELS) */}
        {/* ========================================================= */}
        {isPosture && (
          <svg viewBox="0 0 240 180" className="w-full h-full drop-shadow-xs" fill="none">
            {/* Back Wall Plane */}
            <rect x="25" y="20" width="190" height="140" rx="8" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="2" />
            <text x="35" y="38" fill="#94A3B8" fontSize="8" fontWeight="bold">WALL PLANE CONTACT</text>

            {/* Torso & Head Against Wall */}
            <circle cx="120" cy="50" r="14" fill="#E6C978" stroke="#8E681C" strokeWidth="2" />
            <line x1="120" y1="64" x2="120" y2="135" stroke="#B8892D" strokeWidth="12" strokeLinecap="round" />

            {/* Left & Right Goalpost Arms Sliding Up Wall */}
            <g
              style={{
                transform: `translateY(${angelArmHeight}px)`,
                transition: 'transform 0.9s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              {/* Left Upper Arm & Forearm */}
              <line x1="120" y1="85" x2="80" y2="85" stroke="#C99A3A" strokeWidth="7" strokeLinecap="round" />
              <line x1="80" y1="85" x2="80" y2="50" stroke={phase === 2 ? '#15803D' : '#8E681C'} strokeWidth="6" strokeLinecap="round" />
              <circle cx="80" cy="50" r="4" fill="#C99A3A" />

              {/* Right Upper Arm & Forearm */}
              <line x1="120" y1="85" x2="160" y2="85" stroke="#C99A3A" strokeWidth="7" strokeLinecap="round" />
              <line x1="160" y1="85" x2="160" y2="50" stroke={phase === 2 ? '#15803D' : '#8E681C'} strokeWidth="6" strokeLinecap="round" />
              <circle cx="160" cy="50" r="4" fill="#C99A3A" />
            </g>

            {/* Slide Arrows */}
            <path d="M 65 75 L 65 45 M 60 52 L 65 45 L 70 52" stroke="#15803D" strokeWidth="2" strokeLinecap="round" />
            <path d="M 175 75 L 175 45 M 170 52 L 175 45 L 180 52" stroke="#15803D" strokeWidth="2" strokeLinecap="round" />

            <text x="95" y="152" fill="#8E681C" fontSize="9" fontWeight="bold">
              90°-160° Scapular Slide
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
          ✓ Biomechanical Target
        </div>
      </div>

      {/* Caption & Cadence Meter */}
      <div className="w-full pt-2 mt-1 border-t border-[#E8E4D8]/80 flex items-center justify-between text-xs text-[#5F5B52]">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold">
          <span className="w-2 h-2 rounded-full bg-[#15803D]" />
          <span>Smooth controlled movement with 3-second hold</span>
        </div>
        <div className="text-[10px] font-mono text-[#8E681C] bg-white px-2 py-0.5 rounded border border-[#E6C978]">
          Cadence: 2s-3s-2s
        </div>
      </div>
    </div>
  );
};
