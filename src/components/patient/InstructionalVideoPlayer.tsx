import React, { useState, useEffect, useRef } from 'react';
import { ExerciseVisualCue } from './ExerciseVisualCue';
import {
  ClinicalExerciseData,
  getExerciseVideoData,
  VideoChapter,
} from '../../data/clinicalRehabilitationDataset';
import { useApp } from '../../context/AppContext';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  CheckCircle2,
  ShieldCheck,
  Subtitles,
  Activity,
  Gauge,
  Sparkles,
} from 'lucide-react';

interface InstructionalVideoPlayerProps {
  exercise: ClinicalExerciseData;
  onStartExercise?: (exerciseName: string) => void;
  autoPlay?: boolean;
}

export const InstructionalVideoPlayer: React.FC<InstructionalVideoPlayerProps> = ({
  exercise,
  onStartExercise,
  autoPlay = true,
}) => {
  const { language, speakText, stopSpeaking, isSpeaking } = useApp();
  const videoData = getExerciseVideoData(exercise);
  const totalDuration = videoData.videoDurationSec; // e.g. 45 seconds

  const [isPlaying, setIsPlaying] = useState<boolean>(autoPlay);
  const [currentTimeSec, setCurrentTimeSec] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0); // 0.5x, 0.75x, 1.0x
  const [showCaptions, setShowCaptions] = useState<boolean>(true);
  const [isTheaterMode, setIsTheaterMode] = useState<boolean>(false);
  const [audioNarrationEnabled, setAudioNarrationEnabled] = useState<boolean>(false);

  const lastAnnouncedChapterRef = useRef<number>(-1);

  // Playback timer loop
  useEffect(() => {
    if (!isPlaying) return;

    const tickMs = 250;
    const interval = setInterval(() => {
      setCurrentTimeSec((prev) => {
        const increment = (tickMs / 1000) * playbackSpeed;
        const nextTime = prev + increment;
        if (nextTime >= totalDuration) {
          // Loop video automatically for continuous learning
          return 0;
        }
        return nextTime;
      });
    }, tickMs);

    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, totalDuration]);

  // Determine current chapter based on currentTimeSec
  const currentChapterIndex = Math.max(
    0,
    videoData.videoChapters.reduce((accIndex, chapter, idx) => {
      return currentTimeSec >= chapter.timeSec ? idx : accIndex;
    }, 0)
  );

  const activeChapter: VideoChapter =
    videoData.videoChapters[currentChapterIndex] || videoData.videoChapters[0];

  // Optional voice narration on chapter transition
  useEffect(() => {
    if (!audioNarrationEnabled) return;
    if (lastAnnouncedChapterRef.current !== currentChapterIndex) {
      lastAnnouncedChapterRef.current = currentChapterIndex;
      const speech =
        language === 'ta'
          ? `${activeChapter.titleTa}: ${activeChapter.instructionTa}`
          : language === 'hi'
          ? `${activeChapter.titleHi}: ${activeChapter.instructionHi}`
          : `${activeChapter.titleEn}: ${activeChapter.instructionEn}`;
      speakText(speech, language);
    }
  }, [currentChapterIndex, audioNarrationEnabled, activeChapter, language, speakText]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSeek = (newSec: number) => {
    setCurrentTimeSec(Math.min(totalDuration, Math.max(0, newSec)));
  };

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleRestart = () => {
    setCurrentTimeSec(0);
    setIsPlaying(true);
  };

  const getSubtitles = () => {
    if (language === 'ta') return activeChapter.instructionTa;
    if (language === 'hi') return activeChapter.instructionHi;
    return activeChapter.instructionEn;
  };

  const progressPercent = Math.min(100, (currentTimeSec / (totalDuration || 1)) * 100);

  return (
    <div
      className={`bg-[#171614] rounded-3xl border border-[#3E3A33] overflow-hidden shadow-2xl transition-all duration-300 ${
        isTheaterMode ? 'col-span-full ring-4 ring-[#C99A3A]/40' : ''
      }`}
    >
      {/* Video Header Strip */}
      <div className="px-4 py-3 bg-[#211F1B] border-b border-[#322F29] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#15803D] animate-pulse" />
          <span className="font-bold text-[#F4E8C1] tracking-wide font-serif">
            {videoData.videoTitle}
          </span>
          <span className="text-[10px] uppercase font-mono font-bold text-[#8E681C] bg-[#FFF8E7]/10 px-2 py-0.5 rounded border border-[#E6C978]/30">
            HD 1080p PT
          </span>
        </div>

        <div className="flex items-center gap-2 text-[#A9A59B] text-[11px]">
          <span className="flex items-center gap-1 text-[#E6C978]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#15803D]" />
            <span>Verified by {videoData.videoInstructor}</span>
          </span>
          <button
            type="button"
            onClick={() => setIsTheaterMode(!isTheaterMode)}
            className="p-1 rounded-md hover:bg-white/10 text-white cursor-pointer transition-colors"
            title={isTheaterMode ? 'Default Size' : 'Theater Mode'}
          >
            {isTheaterMode ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Video Viewport Screen */}
      <div className="relative w-full aspect-video sm:h-96 bg-gradient-to-b from-[#1C1A16] via-[#141311] to-[#0D0D0C] flex items-center justify-center overflow-hidden select-none">
        {/* Medical Studio Watermark */}
        <div className="absolute top-3 left-4 z-20 flex items-center gap-1.5 opacity-80 pointer-events-none">
          <div className="w-5 h-5 rounded-full bg-[#C99A3A] flex items-center justify-center text-[10px] font-black text-black shadow-xs">
            RM
          </div>
          <span className="text-[10px] font-bold text-white tracking-widest uppercase font-mono drop-shadow-sm">
            RehabMitra Clinical Studio
          </span>
        </div>

        {/* Biomechanical Angle & Muscle HUD in Video */}
        <div className="absolute top-3 right-4 z-20 flex flex-col items-end gap-1.5 pointer-events-none">
          <div className="px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-white/15 text-[10px] font-mono text-[#E6C978] shadow-md flex items-center gap-1.5">
            <Gauge className="w-3 h-3 text-[#15803D]" />
            <span>TARGET ROM: {exercise.safeRangeOfMotion}</span>
          </div>

          <div className="px-2.5 py-0.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-[9px] font-mono text-emerald-400 flex items-center gap-1">
            <Activity className="w-2.5 h-2.5 animate-pulse" />
            <span>{exercise.targetMuscles.split(',')[0]} ACTIVE</span>
          </div>
        </div>

        {/* Active Chapter / Phase Pill Overlay */}
        <div className="absolute top-12 left-4 z-20 pointer-events-none">
          <div className="px-3 py-1 rounded-full bg-[#C99A3A]/90 text-black text-[11px] font-bold tracking-wide shadow-md flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-black animate-ping" />
            <span>
              {language === 'ta'
                ? activeChapter.titleTa
                : language === 'hi'
                ? activeChapter.titleHi
                : activeChapter.titleEn}
            </span>
          </div>
        </div>

        {/* Dynamic Biomechanical Vector Motion Animation */}
        <div className="w-full max-w-sm px-4 transform transition-transform duration-500">
          <ExerciseVisualCue
            exerciseName={exercise.name}
            bodyPart={exercise.visualCueType}
            isPerforming={isPlaying}
            size="lg"
          />
        </div>

        {/* Closed Captions / Subtitles Overlay */}
        {showCaptions && (
          <div className="absolute bottom-4 left-4 right-4 z-20 flex justify-center pointer-events-none">
            <div className="px-4 py-2 rounded-2xl bg-black/85 backdrop-blur-md border border-white/20 text-white text-xs sm:text-sm font-semibold max-w-xl text-center shadow-xl leading-relaxed text-yellow-100">
              <span className="text-[10px] text-[#C99A3A] font-bold mr-1.5 uppercase font-mono">
                [CC {language.toUpperCase()}]:
              </span>
              <span>{getSubtitles()}</span>
            </div>
          </div>
        )}

        {/* Pause Overlay Indicator when Paused */}
        {!isPlaying && (
          <button
            type="button"
            onClick={handleTogglePlay}
            className="absolute inset-0 z-30 bg-black/40 flex items-center justify-center group cursor-pointer transition-all"
          >
            <div className="w-16 h-16 rounded-full bg-[#C99A3A] group-hover:scale-110 text-black flex items-center justify-center shadow-2xl transition-transform">
              <Play className="w-8 h-8 fill-current translate-x-0.5" />
            </div>
          </button>
        )}
      </div>

      {/* Video Scrubber & Playback Controls Bar */}
      <div className="p-4 bg-[#1E1C18] border-t border-[#322F29] space-y-3">
        {/* Timeline Slider with Interactive Seek */}
        <div className="space-y-1">
          <div className="relative w-full h-2 bg-black/60 rounded-full overflow-hidden cursor-pointer group">
            <div
              className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-[#C99A3A] to-[#E6C978] transition-all"
              style={{ width: `${progressPercent}%` }}
            />
            {/* Clickable range input over the bar */}
            <input
              type="range"
              min={0}
              max={totalDuration}
              step={0.5}
              value={currentTimeSec}
              onChange={(e) => handleSeek(parseFloat(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-[#8C877C]">
            <span>{formatTime(currentTimeSec)}</span>
            <span className="text-[#C99A3A] font-bold font-sans text-[10px]">
              {playbackSpeed !== 1 ? `${playbackSpeed}x SLOW-MO` : '1.0x NORMAL'}
            </span>
            <span>{formatTime(totalDuration)}</span>
          </div>
        </div>

        {/* Buttons Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          {/* Left: Play, Restart, Speed, Audio, Captions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleTogglePlay}
              className="p-2.5 rounded-xl bg-[#C99A3A] hover:bg-[#D8B15A] text-black font-bold cursor-pointer transition-all active:scale-95 shadow-md flex items-center justify-center"
              title={isPlaying ? 'Pause Video' : 'Play Video'}
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            </button>

            <button
              type="button"
              onClick={handleRestart}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 cursor-pointer transition-colors"
              title="Restart Video from 0:00"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Slow Motion Speed Selector */}
            <div className="flex items-center bg-black/50 rounded-xl p-0.5 border border-white/10 text-[10px] font-bold">
              {[0.5, 0.75, 1.0].map((spd) => (
                <button
                  key={spd}
                  type="button"
                  onClick={() => setPlaybackSpeed(spd)}
                  className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                    playbackSpeed === spd
                      ? 'bg-[#C99A3A] text-black shadow-xs font-black'
                      : 'text-white/60 hover:text-white'
                  }`}
                  title={`${spd}x playback speed`}
                >
                  {spd}x
                </button>
              ))}
            </div>

            {/* Audio Voice Narration Toggle */}
            <button
              type="button"
              onClick={() => {
                if (audioNarrationEnabled) {
                  stopSpeaking();
                  setAudioNarrationEnabled(false);
                } else {
                  setAudioNarrationEnabled(true);
                  speakText(
                    language === 'ta'
                      ? activeChapter.instructionTa
                      : language === 'hi'
                      ? activeChapter.instructionHi
                      : activeChapter.instructionEn,
                    language
                  );
                }
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                audioNarrationEnabled
                  ? 'bg-[#15803D] text-white shadow-xs animate-pulse'
                  : 'bg-white/5 hover:bg-white/10 text-white/80'
              }`}
              title="Toggle Spoken Audio Narration"
            >
              {audioNarrationEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">
                {audioNarrationEnabled ? 'Voice On' : 'Voice Off'}
              </span>
            </button>

            {/* Subtitles (CC) Toggle */}
            <button
              type="button"
              onClick={() => setShowCaptions(!showCaptions)}
              className={`p-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                showCaptions
                  ? 'bg-[#C99A3A]/20 text-[#E6C978] border border-[#E6C978]/40'
                  : 'bg-white/5 text-white/50 hover:text-white'
              }`}
              title="Toggle Closed Captions (Subtitles)"
            >
              <Subtitles className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Right: Practice Now in Interactive Rep Counter */}
          {onStartExercise && (
            <button
              type="button"
              onClick={() => onStartExercise(exercise.name)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#15803D] to-[#166534] hover:from-[#166534] hover:to-[#14532D] text-white text-xs font-bold shadow-md cursor-pointer flex items-center gap-2 transition-all active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Practice with Rep Counter</span>
            </button>
          )}
        </div>

        {/* Video Chapter Timeline Markers */}
        <div className="pt-2 border-t border-white/5">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {videoData.videoChapters.map((ch, idx) => {
              const isCurrent = currentChapterIndex === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSeek(ch.timeSec)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 ${
                    isCurrent
                      ? 'bg-[#C99A3A] text-black shadow-xs'
                      : 'bg-white/5 hover:bg-white/10 text-white/60'
                  }`}
                >
                  <span className="opacity-75 font-mono">{ch.timeLabel}</span>
                  <span>{ch.titleEn.split('. ')[1] || ch.titleEn}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
