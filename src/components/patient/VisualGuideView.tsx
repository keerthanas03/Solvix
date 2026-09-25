import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ExerciseVisualCue } from './ExerciseVisualCue';
import { VisualBadge } from '../common/VisualBadges';
import {
  Eye,
  Volume2,
  VolumeX,
  Play,
  Pause,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Check,
  ShieldCheck,
  Info,
  Clock,
  Activity,
  ArrowRight,
} from 'lucide-react';

interface VisualGuideViewProps {
  onStartExercise?: (exerciseName: string) => void;
}

const ALL_VISUAL_GUIDES = [
  {
    id: 'knee-ext',
    name: 'Seated Knee Extension',
    tag: 'Prescribed Quadriceps Rehab',
    dosage: '3 sets × 10 reps (3-second hold)',
    targetMuscle: 'Quadriceps Femoris (Vastus Medialis Obliquus) & Patellar Tendon',
    equipment: 'Sturdy dining or office chair (no wheels)',
    safeRangeOfMotion: '0° to 90° (Terminal extension without hyperextension)',
    cadence: '2s lift • 3s isometric hold • 2s controlled lower',
    dos: [
      'Sit fully back in the chair with spine resting comfortably against backrest.',
      'Smoothly lift your lower leg out in front until it is straight and parallel to the ground.',
      'Squeeze the front of your thigh gently during the 3-second hold.',
      'Maintain continuous rhythmic breathing — never hold your breath.',
    ],
    donts: [
      'Never kick or violently swing your foot upwards.',
      'Do not lean backward or slouch to get your leg higher.',
      'Stop immediately if you feel sharp, stabbing pain under the kneecap.',
    ],
    audioEn: 'Sit comfortably on a sturdy chair with your back supported. Slowly straighten your leg forward until level. Hold gently for 3 seconds. Slowly lower down.',
    audioTa: 'நாற்காலியில் நேராக அமருங்கள். உங்கள் காலை மெதுவாக நேராக நீட்டவும். மூன்று வினாடிகள் பிடியுங்கள். மெதுவாக கீழே இறக்குங்கள்.',
    audioHi: 'कुर्सी पर अपनी पीठ को सहारा देकर बैठें। पैर को धीरे से सीधा करें। 3 सेकंड रोकें और फिर नीचे लाएं।',
    steps: [
      'Step 1: Sit upright on a sturdy chair with feet flat on the floor.',
      'Step 2: Slowly extend your right knee, bringing your leg level with the chair.',
      'Step 3: Hold for 3 calm counts (1, 2, 3), keeping your toes pointed toward the ceiling.',
      'Step 4: Lower foot back smoothly under control.',
      'Step 5: Rest 2 seconds, then repeat for 10 repetitions.',
    ],
  },
  {
    id: 'ankle-pumps',
    name: 'Gentle Ankle Pumps',
    tag: 'Circulation & Calf Flexibility',
    dosage: '2 sets × 15 reps (twice daily)',
    targetMuscle: 'Gastrocnemius, Soleus & Anterior Tibialis',
    equipment: 'Chair or bed (zero equipment required)',
    safeRangeOfMotion: 'Full active dorsiflexion and plantarflexion',
    cadence: '1-2 seconds per pump (calm continuous rhythm)',
    dos: [
      'Pull your toes up toward your shins to stretch the calf.',
      'Point your toes down away from you like pressing a pedal.',
      'Feel the muscle pump activating blood circulation up the leg.',
    ],
    donts: [
      'Do not roll your ankle side-to-side.',
      'Avoid sudden jerky snaps.',
    ],
    audioEn: 'Point your toes up toward your nose, then press them down smoothly like a pedal. Repeat 15 times.',
    audioTa: 'உங்கள் கால் விரல்களை மேல்நோக்கி உயர்த்துங்கள், பின் கீழே அழுத்துங்கள். நிதானமாக செய்யுங்கள்.',
    audioHi: 'अपने पंजों को ऊपर उठाएं, फिर नीचे दबाएं। शांत गति से दोहराएं।',
    steps: [
      'Step 1: Sit or lie down comfortably with legs relaxed.',
      'Step 2: Flex foot upward toward your face as far as comfortable.',
      'Step 3: Point toes down away from you as far as comfortable.',
      'Step 4: Continue smooth alternating rhythm for 15 repetitions.',
    ],
  },
  {
    id: 'quad-sets',
    name: 'Isometric Quad Sets',
    tag: 'Post-Op Knee Stabilization',
    dosage: '2 sets × 10 reps (5-second hold)',
    targetMuscle: 'Quadriceps Isometric Recruitment',
    equipment: 'Firm bed or mat, small rolled washcloth',
    safeRangeOfMotion: 'Zero movement (static isometric tension)',
    cadence: '5s squeeze hold • 3s complete relaxation',
    dos: [
      'Place a rolled washcloth under your knee.',
      'Tighten your quadriceps and gently press the back of your knee into the cloth.',
      'Hold the firm contraction for 5 seconds.',
    ],
    donts: [
      'Do not lift your heel off the bed.',
      'Do not hold your breath.',
    ],
    audioEn: 'Tighten your thigh muscle and press the back of your knee into the towel. Hold for 5 seconds, then relax.',
    audioTa: 'உங்கள் தொடை தசையை இறுக்கி, முழங்காலின் பின்பகுதியை துண்டின் மீது அழுத்தவும். ஐந்து வினாடிகள் பிடியுங்கள்.',
    audioHi: 'अपनी जांघ की मांसपेशियों को कसें और 5 सेकंड के लिए रोकें।',
    steps: [
      'Step 1: Sit with your leg extended straight out on a firm bed.',
      'Step 2: Place a small rolled washcloth directly behind your knee.',
      'Step 3: Contract your thigh muscles, pushing downward into the roll.',
      'Step 4: Hold for 5 seconds, then completely relax.',
    ],
  },
];

export const VisualGuideView: React.FC<VisualGuideViewProps> = ({ onStartExercise }) => {
  const { language, speakText, stopSpeaking, isSpeaking } = useApp();
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const [isPlayingMotion, setIsPlayingMotion] = useState<boolean>(true);

  const current = ALL_VISUAL_GUIDES[selectedIdx];

  const handleAudio = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      const script =
        language === 'ta' ? current.audioTa : language === 'hi' ? current.audioHi : current.audioEn;
      speakText(script, language);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-[#E8E4D8] p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider bg-[#FCF9F2] text-[#8E681C] px-2.5 py-0.5 rounded-full border border-[#E6C978]">
                Visual Movement Hub (காட்சி வழிகாட்டி)
              </span>
              <VisualBadge type="professional_instruction" customText="BIOMECHANICAL ALIGNMENT" size="sm" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#252525] font-serif">
              Visual Exercise Guides & Form Checker
            </h1>
            <p className="text-sm text-[#5F5B52] mt-1">
              Clear visual demonstrations showing exact posture, target joint angles, and common mistakes to avoid.
            </p>
          </div>

          <div className="p-3 bg-[#FAFAF7] rounded-2xl border border-[#E8E4D8] text-xs text-[#5F5B52] flex items-center gap-2 max-w-xs">
            <ShieldCheck className="w-5 h-5 text-[#B8892D] shrink-0" />
            <span>Prescription dosages preserved exactly from your doctor's clinical slip.</span>
          </div>
        </div>
      </div>

      {/* Exercise Switcher Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {ALL_VISUAL_GUIDES.map((item, idx) => (
          <button
            key={item.id}
            onClick={() => setSelectedIdx(idx)}
            className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
              selectedIdx === idx
                ? 'bg-[#FCF9F2] border-[#C99A3A] ring-2 ring-[#D8B15A]/40 shadow-xs'
                : 'bg-white border-[#E8E4D8] hover:border-[#D8B15A]'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold text-[#8E681C] uppercase tracking-wider">
                {item.tag}
              </span>
              <span className="text-[10px] text-[#77736A]">{item.dosage}</span>
            </div>
            <div className="text-sm font-bold text-[#252525]">{item.name}</div>
          </button>
        ))}
      </div>

      {/* Main Visual Display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Biomechanical Demonstration */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-3xl border border-[#E8E4D8] p-5 sm:p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-[#252525]">{current.name}</h2>
                <p className="text-xs text-[#77736A]">
                  Safe Motion Range: <strong className="text-[#8E681C]">{current.safeRangeOfMotion}</strong>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlayingMotion(!isPlayingMotion)}
                  className="px-3 py-1.5 rounded-xl bg-[#FAFAF7] border border-[#E8E4D8] text-xs font-bold text-[#5F5B52] hover:text-[#252525] cursor-pointer flex items-center gap-1.5"
                >
                  {isPlayingMotion ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isPlayingMotion ? 'Pause Motion' : 'Play Motion'}</span>
                </button>
              </div>
            </div>

            {/* Dynamic Animated Graphic */}
            <ExerciseVisualCue
              exerciseName={current.name}
              isPerforming={isPlayingMotion}
              size="lg"
            />

            {/* Spoken Audio Helper Bar */}
            <div className="p-3.5 bg-[#FCF9F2] rounded-2xl border border-[#E6C978] flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleAudio}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer transition-all ${
                    isSpeaking
                      ? 'bg-[#DC2626] text-white animate-pulse'
                      : 'bg-white text-[#B8892D] border border-[#D8B15A] hover:bg-[#C99A3A] hover:text-white shadow-2xs'
                  }`}
                  title="Listen to Spoken Instructions"
                >
                  {isSpeaking ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                <div className="text-xs">
                  <span className="font-bold text-[#252525] block">
                    {isSpeaking ? 'Playing Voice Guide...' : 'Tap for Voice Audio Instructions'}
                  </span>
                  <span className="text-[11px] text-[#8E681C]">
                    {language === 'ta' ? 'தமிழ் ஒலி விளக்கம்' : language === 'hi' ? 'हिंदी आवाज निर्देश' : 'Spoken Voice Guide'}
                  </span>
                </div>
              </div>

              <span className="text-xs font-mono font-bold text-[#8E681C] bg-white px-3 py-1 rounded-xl border border-[#E6C978]">
                {current.cadence}
              </span>
            </div>

            {/* Step-by-Step Breakdown */}
            <div className="space-y-2 pt-2">
              <h3 className="text-xs font-bold text-[#252525] uppercase tracking-wider">
                Step-by-Step Movement Breakdown:
              </h3>
              <div className="space-y-2">
                {current.steps.map((st, i) => (
                  <div
                    key={i}
                    className="p-3 bg-[#FAFAF7] rounded-xl border border-[#E8E4D8] text-xs text-[#5F5B52] font-medium leading-relaxed"
                  >
                    {st}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Form Do's, Form Don'ts & Action */}
        <div className="lg:col-span-5 space-y-4">
          {/* Form Do's */}
          <div className="p-5 bg-[#F0FDF4] rounded-3xl border border-[#BBF7D0] space-y-3 shadow-2xs">
            <div className="flex items-center gap-2 text-xs font-bold text-[#15803D]">
              <CheckCircle2 className="w-4 h-4" />
              <span>FORM DO'S (செய்ய வேண்டிய சரியான முறைகள்)</span>
            </div>
            <ul className="space-y-2 text-xs text-[#166534]">
              {current.dos.map((d, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <Check className="w-3.5 h-3.5 text-[#15803D] shrink-0 mt-0.5" />
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Form Don'ts */}
          <div className="p-5 bg-[#FEF2F2] rounded-3xl border border-[#FECACA] space-y-3 shadow-2xs">
            <div className="flex items-center gap-2 text-xs font-bold text-[#DC2626]">
              <AlertCircle className="w-4 h-4" />
              <span>AVOID THESE MISTAKES (தவிர்க்க வேண்டியவை)</span>
            </div>
            <ul className="space-y-2 text-xs text-[#991B1B]">
              {current.donts.map((d, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626] shrink-0 mt-1.5" />
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Target Anatomy & Equipment */}
          <div className="p-5 bg-white rounded-3xl border border-[#E8E4D8] space-y-3 text-xs shadow-2xs">
            <div>
              <span className="font-bold text-[#252525] block mb-0.5">Target Anatomy:</span>
              <span className="text-[#5F5B52] leading-relaxed">{current.targetMuscle}</span>
            </div>
            <div className="pt-2.5 border-t border-[#E8E4D8]">
              <span className="font-bold text-[#252525] block mb-0.5">Home Equipment:</span>
              <span className="text-[#5F5B52] leading-relaxed">{current.equipment}</span>
            </div>
          </div>

          {/* Start Exercise Action */}
          {onStartExercise && (
            <button
              type="button"
              onClick={() => onStartExercise(current.name)}
              className="w-full py-3.5 rounded-2xl bg-[#C99A3A] hover:bg-[#B8892D] text-white text-xs font-bold shadow-md cursor-pointer flex items-center justify-center gap-2 transition-all"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Practice Now with Interactive Counter</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
