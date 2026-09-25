import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ExerciseVisualCue } from './ExerciseVisualCue';
import { VisualBadge } from '../common/VisualBadges';
import {
  X,
  Volume2,
  VolumeX,
  Play,
  Pause,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  RotateCcw,
  Check,
  ShieldCheck,
  ChevronRight,
  Eye,
  Info,
  Maximize2,
} from 'lucide-react';

interface VisualGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialExerciseName?: string;
  onStartExercise?: (exerciseName: string) => void;
}

const VISUAL_EXERCISE_GUIDES = [
  {
    id: 'knee-ext',
    name: 'Seated Knee Extension',
    tag: 'Primary Prescribed Movement',
    targetMuscle: 'Quadriceps (Vastus Medialis Obliquus) & Patellar Ligament',
    equipment: 'Sturdy dining or study chair (no wheels)',
    safeRangeOfMotion: '0° to 90° (Terminal extension without hyperextension)',
    cadence: '2 seconds raise • 3 seconds hold • 2 seconds lower',
    dos: [
      'Keep back firmly supported against the chair backrest.',
      'Straighten the leg until horizontal with toes pointing towards ceiling.',
      'Tighten the top of the thigh (quadriceps) gently during the 3-second hold.',
      'Breathe naturally — do not hold your breath during the extension.',
    ],
    donts: [
      'Do NOT kick or swing your leg violently.',
      'Do NOT arch your lower back or lean backward to lift the leg higher.',
      'Do NOT push through sharp, stabbing joint pain.',
    ],
    audioEn: 'Sit upright on your chair. Slowly raise your foot until your leg is straight out in front. Hold for 3 seconds while tightening your thigh. Gently lower your foot down. Repeat smoothly.',
    audioTa: 'நாற்காலியில் நேராக அமருங்கள். உங்கள் காலை மெதுவாக நேராக நீட்டவும். முழங்கால் நேராக இருக்கும்போது மூன்று வினாடிகள் பிடியுங்கள். பின் மெதுவாக தரைக்கு இறக்குங்கள்.',
    audioHi: 'कुर्सी पर सीधे बैठें। अपने पैर को धीरे-धीरे आगे सीधा करें। तीन सेकंड के लिए रोकें और फिर धीरे से नीचे लाएं।',
    simpleStepBullets: [
      '1. Sit upright with your back flat on the chair.',
      '2. Slowly straighten your right leg out.',
      '3. Hold level for 3 seconds (count 1... 2... 3).',
      '4. Lower foot down smoothly to the floor.',
    ],
  },
  {
    id: 'ankle-pumps',
    name: 'Gentle Ankle Pumps',
    tag: 'Circulation & Mobility',
    targetMuscle: 'Gastrocnemius, Soleus & Tibialis Anterior (Calf Muscle Pump)',
    equipment: 'Chair or comfortable firm bed',
    safeRangeOfMotion: 'Full active dorsiflexion and plantarflexion',
    cadence: '1-2 seconds per pump (smooth continuous pumping)',
    dos: [
      'Pull your toes firmly up towards your nose (dorsiflexion).',
      'Point your toes straight down like pressing an automobile gas pedal.',
      'Feel the gentle stretch and relaxation in the back of your calf.',
    ],
    donts: [
      'Do NOT roll the ankle outward or inward.',
      'Do NOT hold your breath.',
      'Do NOT bounce forcefully at the end range.',
    ],
    audioEn: 'Point your toes up towards your nose, then press them down smoothly like a car pedal. Keep the rhythm calm and steady.',
    audioTa: 'உங்கள் கால் விரல்களை மேல்நோக்கி உயர்த்துங்கள், பின் கீழே அழுத்துங்கள். நிதானமாக செய்யுங்கள்.',
    audioHi: 'अपने पंजों को ऊपर की ओर उठाएं, फिर नीचे दबाएं। शांत गति से दोहराएं।',
    simpleStepBullets: [
      '1. Rest your heel gently on the floor or bed.',
      '2. Pull your toes up towards your face.',
      '3. Point your toes down away from you.',
      '4. Repeat 15 times smoothly.',
    ],
  },
  {
    id: 'quad-sets',
    name: 'Isometric Quad Sets',
    tag: 'Joint Stabilization',
    targetMuscle: 'Quadriceps Femoris isometric contraction',
    equipment: 'Firm flat surface with small rolled towel under knee',
    safeRangeOfMotion: 'Static isometric contraction (zero joint movement)',
    cadence: '5 seconds hold • 3 seconds rest',
    dos: [
      'Place a small rolled washcloth under your knee.',
      'Tighten your thigh muscles to gently press the back of the knee into the towel.',
      'Hold the firm contraction for 5 seconds.',
    ],
    donts: [
      'Do NOT lift your heel off the bed.',
      'Do NOT tense your neck or shoulders.',
    ],
    audioEn: 'Tighten your thigh muscle and press the back of your knee gently into the towel. Hold for 5 seconds, then relax.',
    audioTa: 'உங்கள் தொடை தசையை இறுகப் பிடித்து, முழங்காலின் பின்பகுதியை துண்டின் மீது அழுத்தவும். ஐந்து வினாடிகள் பிடித்து பின் தளர்த்தவும்.',
    audioHi: 'अपनी जांघ की मांसपेशियों को कसें और घुटने के पिछले हिस्से को तौलिए पर दबाएं। 5 सेकंड रोकें।',
    simpleStepBullets: [
      '1. Lie or sit with leg straight.',
      '2. Tighten thigh muscle firmly.',
      '3. Press knee gently downward.',
      '4. Hold 5 seconds and relax.',
    ],
  },
];

export const VisualGuideModal: React.FC<VisualGuideModalProps> = ({
  isOpen,
  onClose,
  initialExerciseName = 'Seated Knee Extension',
  onStartExercise,
}) => {
  const { language, speakText, stopSpeaking, isSpeaking } = useApp();

  // Find matching exercise or default to first
  const initialIndex = Math.max(
    0,
    VISUAL_EXERCISE_GUIDES.findIndex((g) =>
      g.name.toLowerCase().includes((initialExerciseName || '').toLowerCase())
    )
  );

  const [selectedGuideIndex, setSelectedGuideIndex] = useState<number>(initialIndex);
  const [isPlayingMotion, setIsPlayingMotion] = useState<boolean>(true);
  const [manualAngleDegrees, setManualAngleDegrees] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'animated' | 'angle_meter'>('animated');

  if (!isOpen) return null;

  const currentGuide = VISUAL_EXERCISE_GUIDES[selectedGuideIndex] || VISUAL_EXERCISE_GUIDES[0];

  const handleAudioPlayback = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      const script =
        language === 'ta'
          ? currentGuide.audioTa
          : language === 'hi'
          ? currentGuide.audioHi
          : currentGuide.audioEn;
      speakText(script, language);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white border border-[#E8E4D8] rounded-3xl shadow-2xl p-5 sm:p-8 space-y-6 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#77736A] hover:text-[#252525] rounded-full hover:bg-[#F7F4EC] cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start gap-3.5 pr-8">
          <div className="w-12 h-12 rounded-2xl bg-[#FCF9F2] text-[#B8892D] border border-[#E6C978] flex items-center justify-center shrink-0 shadow-2xs">
            <Eye className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8E681C] bg-[#FCF9F2] px-2.5 py-0.5 rounded-full border border-[#E6C978]">
                Interactive Biomechanical Guide
              </span>
              <VisualBadge type="professional_instruction" customText="CLINICAL ALIGNMENT" size="sm" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#252525]">
              Visual Movement & Form Guide (காட்சி வழிகாட்டி)
            </h2>
            <p className="text-xs text-[#5F5B52] mt-0.5 leading-relaxed">
              Step-by-step visual posture alignment, safe range of motion angles (0°–90°), and spoken audio instructions to ensure safe, correct home exercise execution.
            </p>
          </div>
        </div>

        {/* Exercise Quick Switcher Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-[#E8E4D8]">
          {VISUAL_EXERCISE_GUIDES.map((guide, idx) => (
            <button
              key={guide.id}
              onClick={() => setSelectedGuideIndex(idx)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                selectedGuideIndex === idx
                  ? 'bg-[#C99A3A] text-white shadow-xs'
                  : 'bg-[#FAFAF7] text-[#5F5B52] hover:bg-[#F7F4EC] border border-[#E8E4D8]'
              }`}
            >
              <span>{guide.name}</span>
            </button>
          ))}
        </div>

        {/* Main Content 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Biomechanical Visual Demonstration (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-[#FAFAF7] rounded-3xl border border-[#E8E4D8] p-4 sm:p-5 space-y-4">
              {/* Graphic Title Bar */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#252525] flex items-center gap-1.5">
                    <span>{currentGuide.name}</span>
                    <span className="text-[10px] font-semibold text-[#8E681C] bg-[#FCF9F2] px-2 py-0.5 rounded border border-[#E6C978]">
                      {currentGuide.tag}
                    </span>
                  </h3>
                  <span className="text-[11px] text-[#77736A]">
                    Safe Range: {currentGuide.safeRangeOfMotion}
                  </span>
                </div>

                {/* Play/Pause Motion */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setIsPlayingMotion(!isPlayingMotion)}
                    className="p-2 rounded-xl bg-white border border-[#E8E4D8] hover:border-[#D8B15A] text-[#8E681C] cursor-pointer text-xs font-bold flex items-center gap-1 shadow-2xs"
                    title={isPlayingMotion ? 'Pause demonstration' : 'Play demonstration'}
                  >
                    {isPlayingMotion ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{isPlayingMotion ? 'Pause' : 'Play'}</span>
                  </button>
                </div>
              </div>

              {/* Enhanced Biomechanical Animated SVG Graphic */}
              <ExerciseVisualCue
                exerciseName={currentGuide.name}
                isPerforming={isPlayingMotion}
                size="lg"
              />

              {/* Spoken Voice Companion Bar */}
              <div className="p-3 bg-white rounded-2xl border border-[#E8E4D8] flex items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={handleAudioPlayback}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer transition-all ${
                      isSpeaking
                        ? 'bg-[#DC2626] text-white animate-pulse'
                        : 'bg-[#FCF9F2] text-[#B8892D] border border-[#E6C978] hover:bg-[#C99A3A] hover:text-white'
                    }`}
                    title="Play Spoken Audio Guide"
                  >
                    {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                  <div className="text-xs">
                    <span className="font-bold text-[#252525] block">
                      {isSpeaking ? 'Speaking Instructions...' : 'Listen in Your Language'}
                    </span>
                    <span className="text-[11px] text-[#77736A]">
                      {language === 'ta' ? 'தமிழ் ஆடியோ வழிகாட்டி' : language === 'hi' ? 'हिंदी ऑडियो गाइड' : 'English Voice Guide'}
                    </span>
                  </div>
                </div>

                <span className="text-[11px] font-mono font-semibold text-[#8E681C] bg-[#FAFAF7] px-2.5 py-1 rounded-lg border border-[#E8E4D8]">
                  {currentGuide.cadence}
                </span>
              </div>
            </div>

            {/* Step-by-Step Action List */}
            <div className="p-4 bg-white rounded-2xl border border-[#E8E4D8] space-y-2">
              <span className="text-xs font-bold text-[#252525] uppercase tracking-wider">
                Step-by-Step Instructions:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#5F5B52]">
                {currentGuide.simpleStepBullets.map((bullet, idx) => (
                  <div key={idx} className="p-2 bg-[#FAFAF7] rounded-xl border border-[#E8E4D8]/80 font-medium">
                    {bullet}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Form Do's, Don'ts & Clinical Safety (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Form Do's (Green) */}
            <div className="p-4 bg-[#F0FDF4] rounded-2xl border border-[#BBF7D0] space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#15803D]">
                <CheckCircle2 className="w-4 h-4" />
                <span>CORRECT FORM (செய்ய வேண்டியவை)</span>
              </div>
              <ul className="space-y-1.5 text-xs text-[#166534]">
                {currentGuide.dos.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 leading-relaxed">
                    <Check className="w-3.5 h-3.5 text-[#15803D] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Form Don'ts (Red Warning) */}
            <div className="p-4 bg-[#FEF2F2] rounded-2xl border border-[#FECACA] space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#DC2626]">
                <AlertCircle className="w-4 h-4" />
                <span>AVOID THESE MISTAKES (தவிர்க்க வேண்டியவை)</span>
              </div>
              <ul className="space-y-1.5 text-xs text-[#991B1B]">
                {currentGuide.donts.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 leading-relaxed">
                    <X className="w-3.5 h-3.5 text-[#DC2626] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Anatomy & Equipment info */}
            <div className="p-4 bg-[#FAFAF7] rounded-2xl border border-[#E8E4D8] space-y-2.5 text-xs">
              <div>
                <span className="font-bold text-[#252525] block">Target Musculature:</span>
                <span className="text-[#5F5B52]">{currentGuide.targetMuscle}</span>
              </div>
              <div className="pt-2 border-t border-[#E8E4D8]">
                <span className="font-bold text-[#252525] block">Recommended Equipment:</span>
                <span className="text-[#5F5B52]">{currentGuide.equipment}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              {onStartExercise && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onStartExercise(currentGuide.name);
                  }}
                  className="w-full py-3 rounded-2xl bg-[#C99A3A] hover:bg-[#B8892D] text-white text-xs font-bold shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Start Exercise with Rep Counter</span>
                </button>
              )}

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 rounded-2xl border border-[#E8E4D8] hover:bg-[#FAFAF7] text-xs font-bold text-[#5F5B52] cursor-pointer"
              >
                Close Visual Guide
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
