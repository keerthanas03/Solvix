import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { DailyScheduledTask } from '../../types';
import {
  isSpeechRecognitionSupported,
  createSpeechRecognition,
  parseVoiceTaskCommand,
  VoiceParseResult,
} from '../../services/voiceCommandService';
import { playGentleChime } from '../../services/notificationService';
import { VisualBadge } from '../common/VisualBadges';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  CheckCircle,
  AlertTriangle,
  Clock,
  Sparkles,
  RotateCcw,
  Check,
  X,
  Radio,
  ArrowRight,
  Smile,
  Meh,
  Frown,
  ShieldCheck,
  Info,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface VoiceTaskLoggerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskLogged?: (taskName: string) => void;
}

export const VoiceTaskLoggerModal: React.FC<VoiceTaskLoggerModalProps> = ({
  isOpen,
  onClose,
  onTaskLogged,
}) => {
  const {
    dailyTasks,
    verifyAndCompleteTask,
    language,
    speakText,
    isSpeaking,
    stopSpeaking,
    currentPatient,
  } = useApp();

  const [selectedVoiceLang, setSelectedVoiceLang] = useState<'en' | 'ta' | 'hi'>(
    language || 'en'
  );
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [interimText, setInterimText] = useState<string>('');
  const [errorNotice, setErrorNotice] = useState<string | null>(null);
  const [parsedResult, setParsedResult] = useState<VoiceParseResult | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'okay' | 'difficult'>('okay');
  const [reportDiscomfort, setReportDiscomfort] = useState<boolean>(false);
  const [isSuccessFeedback, setIsSuccessFeedback] = useState<boolean>(false);
  const [successTaskName, setSuccessTaskName] = useState<string>('');

  const recognitionRef = useRef<any>(null);

  // Sync modal language with AppContext language initially
  useEffect(() => {
    if (language) {
      setSelectedVoiceLang(language);
    }
  }, [language]);

  // Clean up recognition instance when modal closes
  useEffect(() => {
    if (!isOpen) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
        recognitionRef.current = null;
      }
      setIsListening(false);
      setTranscript('');
      setInterimText('');
      setParsedResult(null);
      setErrorNotice(null);
      setIsSuccessFeedback(false);
    } else {
      // Auto-start listening on open for seamless experience if supported
      startVoiceListening(selectedVoiceLang);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
    };
  }, [isOpen]);

  const startVoiceListening = (lang: 'en' | 'ta' | 'hi' = selectedVoiceLang) => {
    setErrorNotice(null);
    setInterimText('');

    if (!isSpeechRecognitionSupported()) {
      setErrorNotice(
        'Speech recognition is not directly supported by this browser. You can click on any sample voice phrase or manual task below to verify.'
      );
      return;
    }

    try {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }

      const recognition = createSpeechRecognition(lang);
      if (!recognition) return;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let currentInterim = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const res = event.results[i];
          if (res.isFinal) {
            finalTranscript += res[0].transcript;
          } else {
            currentInterim += res[0].transcript;
          }
        }

        if (currentInterim) {
          setInterimText(currentInterim);
        }

        if (finalTranscript) {
          const text = finalTranscript.trim();
          setTranscript(text);
          setInterimText('');
          processVoiceTranscript(text, lang);
        }
      };

      recognition.onerror = (event: any) => {
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setErrorNotice('Microphone access was denied. Please allow microphone permissions in browser settings.');
        } else if (event.error === 'no-speech') {
          // Silent timeout, keep ready
        } else {
          setErrorNotice(`Voice recognition notice: ${event.error || 'Please speak again clearly.'}`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      setIsListening(false);
      setErrorNotice('Could not initialize microphone. Please check permissions.');
    }
  };

  const stopVoiceListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
    setIsListening(false);
  };

  const processVoiceTranscript = (text: string, lang: 'en' | 'ta' | 'hi') => {
    const parse = parseVoiceTaskCommand(text, dailyTasks, lang);
    setParsedResult(parse);
    setSelectedDifficulty(parse.difficulty);
    setReportDiscomfort(parse.discomfort);
  };

  // Simulate or set a phrase from sample chips
  const handleApplySamplePhrase = (phrase: string) => {
    setTranscript(phrase);
    setInterimText('');
    processVoiceTranscript(phrase, selectedVoiceLang);
  };

  // Confirm Task Verification
  const handleConfirmTaskCompletion = async () => {
    const task = parsedResult?.matchedTask;
    if (!task) return;

    try {
      await verifyAndCompleteTask(
        task.id,
        selectedDifficulty,
        reportDiscomfort,
        parsedResult.notes,
        'voice_verified'
      );

      // Play chime & confetti
      playGentleChime();
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#C99A3A', '#15803D', '#FDE68A'],
        });
      } catch {}

      // Spoken confirmation
      const confirmationSpeech =
        selectedVoiceLang === 'ta'
          ? `${task.exerciseName} பயிற்சி வெற்றிகரமாக பதிவு செய்யப்பட்டது!`
          : selectedVoiceLang === 'hi'
          ? `${task.exerciseName} सफलतापूर्वक दर्ज कर लिया गया है!`
          : `${task.exerciseName} verified and logged as completed!`;

      speakText(confirmationSpeech, selectedVoiceLang);

      setSuccessTaskName(task.exerciseName);
      setIsSuccessFeedback(true);
      if (onTaskLogged) onTaskLogged(task.exerciseName);

      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      console.error('Failed to log voice task:', err);
    }
  };

  if (!isOpen) return null;

  // Pending uncompleted tasks for quick manual selection if speech didn't match
  const uncompletedTasks = dailyTasks.filter((t) => t.status !== 'completed');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white border border-[#E8E4D8] rounded-3xl shadow-2xl p-5 sm:p-7 space-y-5 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#77736A] hover:text-[#252525] rounded-full hover:bg-[#F7F4EC] cursor-pointer"
          title="Close voice logger"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start gap-3.5 pr-8">
          <div className="w-11 h-11 rounded-2xl bg-[#FCF9F2] text-[#B8892D] border border-[#E6C978] flex items-center justify-center shrink-0 shadow-2xs">
            <Mic className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8E681C] bg-[#FCF9F2] px-2.5 py-0.5 rounded-full border border-[#E6C978]">
                Voice Adherence Logger
              </span>
              <VisualBadge type="patient_completed" customText="HANDS-FREE LOGGING" size="sm" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#252525]">
              Log Completed Tasks by Voice
            </h2>
            <p className="text-xs text-[#5F5B52] mt-0.5">
              Speak naturally to log doctor-prescribed exercises for {currentPatient.name}.
            </p>
          </div>
        </div>

        {/* Language Selection Row */}
        <div className="flex items-center justify-between p-2.5 bg-[#FAFAF7] rounded-2xl border border-[#E8E4D8] text-xs">
          <span className="font-bold text-[#5F5B52] flex items-center gap-1.5 ml-1">
            <Radio className="w-3.5 h-3.5 text-[#B8892D]" />
            <span>Voice Language:</span>
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => {
                setSelectedVoiceLang('en');
                if (isListening) startVoiceListening('en');
              }}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                selectedVoiceLang === 'en'
                  ? 'bg-[#C99A3A] text-white shadow-2xs'
                  : 'bg-white text-[#5F5B52] hover:bg-[#F7F4EC] border border-[#E8E4D8]'
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedVoiceLang('ta');
                if (isListening) startVoiceListening('ta');
              }}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                selectedVoiceLang === 'ta'
                  ? 'bg-[#C99A3A] text-white shadow-2xs'
                  : 'bg-white text-[#5F5B52] hover:bg-[#F7F4EC] border border-[#E8E4D8]'
              }`}
            >
              தமிழ்
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedVoiceLang('hi');
                if (isListening) startVoiceListening('hi');
              }}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                selectedVoiceLang === 'hi'
                  ? 'bg-[#C99A3A] text-white shadow-2xs'
                  : 'bg-white text-[#5F5B52] hover:bg-[#F7F4EC] border border-[#E8E4D8]'
              }`}
            >
              हिंदी
            </button>
          </div>
        </div>

        {/* Central Animated Microphone Recording Stage */}
        <div className="flex flex-col items-center justify-center p-6 bg-radial from-[#FCF9F2] to-white rounded-3xl border border-[#E6C978]/70 text-center space-y-4">
          {/* Animated Pulsing Mic Button */}
          <div className="relative flex items-center justify-center">
            {isListening && (
              <>
                <div className="absolute w-24 h-24 rounded-full bg-[#E6C978]/40 animate-ping" />
                <div className="absolute w-20 h-20 rounded-full bg-[#C99A3A]/30 animate-pulse" />
              </>
            )}

            <button
              type="button"
              onClick={() => {
                if (isListening) {
                  stopVoiceListening();
                } else {
                  startVoiceListening(selectedVoiceLang);
                }
              }}
              className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95 cursor-pointer ${
                isListening
                  ? 'bg-[#DC2626] text-white ring-4 ring-[#DC2626]/30 animate-pulse'
                  : 'bg-[#C99A3A] hover:bg-[#B8892D] text-white ring-4 ring-[#E6C978]/50'
              }`}
              title={isListening ? 'Tap to pause microphone' : 'Tap to start speaking'}
            >
              {isListening ? <Mic className="w-8 h-8" /> : <MicOff className="w-7 h-7" />}
            </button>
          </div>

          {/* Status Label */}
          <div>
            <div className="text-sm font-bold text-[#252525]">
              {isListening ? (
                <span className="flex items-center gap-1.5 text-[#DC2626]">
                  <span className="w-2 h-2 rounded-full bg-[#DC2626] animate-ping" />
                  <span>
                    {selectedVoiceLang === 'ta'
                      ? 'கேட்கிறது... பேசுங்கள்...'
                      : selectedVoiceLang === 'hi'
                      ? 'सुन रहे हैं... बोलिए...'
                      : 'Listening... speak now...'}
                  </span>
                </span>
              ) : (
                <span>
                  {selectedVoiceLang === 'ta'
                    ? 'மைக்ரோஃபோனைத் தொடவும்'
                    : selectedVoiceLang === 'hi'
                    ? 'माइक दबाकर बोलें'
                    : 'Tap microphone to speak'}
                </span>
              )}
            </div>

            <p className="text-xs text-[#77736A] mt-0.5">
              {selectedVoiceLang === 'ta'
                ? 'எ.கா: "முழங்கால் நீட்சி பயிற்சி முடிந்தது"'
                : selectedVoiceLang === 'hi'
                ? 'उदा: "घुटना सीधा करने का व्यायाम पूरा हो गया"'
                : 'Say e.g., "I finished Knee Extension" or "Completed Ankle Pumps"'}
            </p>
          </div>

          {/* Live Transcript Display Box */}
          <div className="w-full min-h-[56px] p-3.5 bg-white rounded-2xl border border-[#E8E4D8] text-center flex items-center justify-center shadow-2xs">
            {interimText ? (
              <span className="text-xs italic text-[#8E681C] animate-pulse">
                "{interimText}..."
              </span>
            ) : transcript ? (
              <span className="text-xs font-bold text-[#252525]">
                "{transcript}"
              </span>
            ) : (
              <span className="text-xs text-[#77736A] italic">
                (Your spoken words will appear here in real-time)
              </span>
            )}
          </div>
        </div>

        {/* Error Notice if any */}
        {errorNotice && (
          <div className="p-3 bg-[#FEF2F2] border border-[#FECACA] rounded-2xl text-xs text-[#DC2626] flex items-center gap-2">
            <Info className="w-4 h-4 shrink-0" />
            <span>{errorNotice}</span>
          </div>
        )}

        {/* Success Verification Card */}
        {isSuccessFeedback && (
          <div className="p-4 bg-[#F0FDF4] border border-[#BBF7D0] rounded-2xl text-center space-y-1 animate-in zoom-in duration-200">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#15803D] text-white mx-auto">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>
            <div className="text-sm font-bold text-[#15803D]">
              Verified & Logged!
            </div>
            <div className="text-xs text-[#5F5B52]">
              "{successTaskName}" logged with voice verification timestamp.
            </div>
          </div>
        )}

        {/* Parsed Match Result Card */}
        {parsedResult?.matchedTask && !isSuccessFeedback && (
          <div className="p-4 bg-[#FCF9F2] rounded-2xl border-2 border-[#D8B15A] space-y-3 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#8E681C] bg-white px-2 py-0.5 rounded-full border border-[#E6C978]">
                  Matched Prescription Task
                </span>
                {parsedResult.confidence === 'high' ? (
                  <span className="text-[10px] font-bold text-[#15803D] bg-[#F0FDF4] px-2 py-0.5 rounded-full border border-[#BBF7D0]">
                    High Match Confidence
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-[#B45309] bg-[#FEF3C7] px-2 py-0.5 rounded-full border border-[#FDE68A]">
                    Closest Match
                  </span>
                )}
              </div>

              <span className="text-xs font-mono font-bold text-[#8E681C]">
                {parsedResult.matchedTask.scheduledTime}
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-[#252525]">
                {parsedResult.matchedTask.exerciseName}
              </h3>
              <div className="text-xs text-[#5F5B52] mt-0.5">
                {parsedResult.matchedTask.slotName} · {parsedResult.matchedTask.repetitions}
              </div>
            </div>

            {/* Quick Adjustments for Difficulty & Discomfort */}
            <div className="pt-2 border-t border-[#E6C978]/60 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="block text-[11px] font-bold text-[#5F5B52] mb-1">
                  How did it feel?
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setSelectedDifficulty('easy')}
                    className={`flex-1 py-1 px-2 rounded-lg font-bold text-[11px] transition-all cursor-pointer flex items-center justify-center gap-1 border ${
                      selectedDifficulty === 'easy'
                        ? 'bg-[#15803D] text-white border-[#15803D]'
                        : 'bg-white text-[#5F5B52] border-[#E8E4D8]'
                    }`}
                  >
                    <Smile className="w-3 h-3" />
                    <span>Easy</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedDifficulty('okay')}
                    className={`flex-1 py-1 px-2 rounded-lg font-bold text-[11px] transition-all cursor-pointer flex items-center justify-center gap-1 border ${
                      selectedDifficulty === 'okay'
                        ? 'bg-[#C99A3A] text-white border-[#C99A3A]'
                        : 'bg-white text-[#5F5B52] border-[#E8E4D8]'
                    }`}
                  >
                    <Meh className="w-3 h-3" />
                    <span>Okay</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedDifficulty('difficult')}
                    className={`flex-1 py-1 px-2 rounded-lg font-bold text-[11px] transition-all cursor-pointer flex items-center justify-center gap-1 border ${
                      selectedDifficulty === 'difficult'
                        ? 'bg-[#DC2626] text-white border-[#DC2626]'
                        : 'bg-white text-[#5F5B52] border-[#E8E4D8]'
                    }`}
                  >
                    <Frown className="w-3 h-3" />
                    <span>Hard</span>
                  </button>
                </div>
              </div>

              <div>
                <span className="block text-[11px] font-bold text-[#5F5B52] mb-1">
                  Discomfort / Pain Check:
                </span>
                <button
                  type="button"
                  onClick={() => setReportDiscomfort(!reportDiscomfort)}
                  className={`w-full py-1 px-2 rounded-lg font-bold text-[11px] transition-all cursor-pointer flex items-center justify-center gap-1.5 border ${
                    reportDiscomfort
                      ? 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]'
                      : 'bg-[#F0FDF4] text-[#15803D] border-[#BBF7D0]'
                  }`}
                >
                  {reportDiscomfort ? (
                    <>
                      <AlertTriangle className="w-3 h-3 text-[#DC2626]" />
                      <span>Pain/Discomfort Noted (Flagged)</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-3 h-3 text-[#15803D]" />
                      <span>Pain-Free Movement ✓</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Confirmation CTA */}
            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setParsedResult(null);
                  setTranscript('');
                  startVoiceListening(selectedVoiceLang);
                }}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-[#77736A] hover:bg-[#F7F4EC] cursor-pointer"
              >
                Cancel & Try Again
              </button>

              <button
                type="button"
                onClick={handleConfirmTaskCompletion}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white text-xs font-bold shadow-md cursor-pointer transition-all"
              >
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>Confirm & Log Task</span>
              </button>
            </div>
          </div>
        )}

        {/* Sample Voice Command Practice Chips */}
        <div className="space-y-2">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#77736A]">
            Try saying (or tap to test):
          </div>

          <div className="flex flex-wrap gap-1.5">
            {selectedVoiceLang === 'ta' ? (
              <>
                <button
                  type="button"
                  onClick={() => handleApplySamplePhrase('முழங்கால் நீட்சி பயிற்சி முடிந்தது')}
                  className="px-2.5 py-1.5 rounded-xl bg-[#FAFAF7] hover:bg-[#F7F1E1] border border-[#E8E4D8] hover:border-[#D8B15A] text-xs font-medium text-[#252525] cursor-pointer transition-colors shadow-2xs"
                >
                  🎙️ "முழங்கால் நீட்சி பயிற்சி முடிந்தது"
                </button>
                <button
                  type="button"
                  onClick={() => handleApplySamplePhrase('கெண்டைக்கால் பயிற்சி முடித்தேன், சுலபமாக இருந்தது')}
                  className="px-2.5 py-1.5 rounded-xl bg-[#FAFAF7] hover:bg-[#F7F1E1] border border-[#E8E4D8] hover:border-[#D8B15A] text-xs font-medium text-[#252525] cursor-pointer transition-colors shadow-2xs"
                >
                  🎙️ "கெண்டைக்கால் பயிற்சி முடித்தேன், சுலபம்"
                </button>
                <button
                  type="button"
                  onClick={() => handleApplySamplePhrase('காலை உடற்பயிற்சி முடிந்தது')}
                  className="px-2.5 py-1.5 rounded-xl bg-[#FAFAF7] hover:bg-[#F7F1E1] border border-[#E8E4D8] hover:border-[#D8B15A] text-xs font-medium text-[#252525] cursor-pointer transition-colors shadow-2xs"
                >
                  🎙️ "காலை உடற்பயிற்சி முடிந்தது"
                </button>
              </>
            ) : selectedVoiceLang === 'hi' ? (
              <>
                <button
                  type="button"
                  onClick={() => handleApplySamplePhrase('घुटना सीधा करने का व्यायाम पूरा हो गया')}
                  className="px-2.5 py-1.5 rounded-xl bg-[#FAFAF7] hover:bg-[#F7F1E1] border border-[#E8E4D8] hover:border-[#D8B15A] text-xs font-medium text-[#252525] cursor-pointer transition-colors shadow-2xs"
                >
                  🎙️ "घुटना सीधा करने का व्यायाम पूरा हो गया"
                </button>
                <button
                  type="button"
                  onClick={() => handleApplySamplePhrase('एंकल पंप्स का व्यायाम किया')}
                  className="px-2.5 py-1.5 rounded-xl bg-[#FAFAF7] hover:bg-[#F7F1E1] border border-[#E8E4D8] hover:border-[#D8B15A] text-xs font-medium text-[#252525] cursor-pointer transition-colors shadow-2xs"
                >
                  🎙️ "एंकल पंप्स का व्यायाम किया"
                </button>
                <button
                  type="button"
                  onClick={() => handleApplySamplePhrase('सुबह का व्यायाम पूरा कर लिया')}
                  className="px-2.5 py-1.5 rounded-xl bg-[#FAFAF7] hover:bg-[#F7F1E1] border border-[#E8E4D8] hover:border-[#D8B15A] text-xs font-medium text-[#252525] cursor-pointer transition-colors shadow-2xs"
                >
                  🎙️ "सुबह का व्यायाम पूरा कर लिया"
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => handleApplySamplePhrase('I finished Seated Knee Extension')}
                  className="px-2.5 py-1.5 rounded-xl bg-[#FAFAF7] hover:bg-[#F7F1E1] border border-[#E8E4D8] hover:border-[#D8B15A] text-xs font-medium text-[#252525] cursor-pointer transition-colors shadow-2xs"
                >
                  🎙️ "I finished Seated Knee Extension"
                </button>
                <button
                  type="button"
                  onClick={() => handleApplySamplePhrase('Done with Gentle Ankle Pumps with no pain')}
                  className="px-2.5 py-1.5 rounded-xl bg-[#FAFAF7] hover:bg-[#F7F1E1] border border-[#E8E4D8] hover:border-[#D8B15A] text-xs font-medium text-[#252525] cursor-pointer transition-colors shadow-2xs"
                >
                  🎙️ "Done with Ankle Pumps, no pain"
                </button>
                <button
                  type="button"
                  onClick={() => handleApplySamplePhrase('Completed morning session')}
                  className="px-2.5 py-1.5 rounded-xl bg-[#FAFAF7] hover:bg-[#F7F1E1] border border-[#E8E4D8] hover:border-[#D8B15A] text-xs font-medium text-[#252525] cursor-pointer transition-colors shadow-2xs"
                >
                  🎙️ "Completed morning session"
                </button>
              </>
            )}
          </div>
        </div>

        {/* Fallback Uncompleted Task Picker if speech is not matching */}
        {uncompletedTasks.length > 0 && !parsedResult?.matchedTask && (
          <div className="pt-3 border-t border-[#E8E4D8] space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#77736A]">
              Or select directly to verify:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {uncompletedTasks.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    setTranscript(`Finished ${t.exerciseName}`);
                    processVoiceTranscript(`Finished ${t.exerciseName}`, selectedVoiceLang);
                  }}
                  className="p-2.5 rounded-xl border border-[#E8E4D8] bg-white hover:bg-[#FCF9F2] hover:border-[#D8B15A] text-left text-xs cursor-pointer flex items-center justify-between transition-colors shadow-2xs"
                >
                  <div>
                    <span className="font-bold text-[#252525] block truncate">
                      {t.exerciseName}
                    </span>
                    <span className="text-[10px] text-[#77736A]">
                      {t.scheduledTime} · {t.slotName}
                    </span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[#8E681C] shrink-0" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-2 border-t border-[#E8E4D8] flex items-center justify-between text-xs text-[#77736A]">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#B8892D]" />
            <span>Voice adherence logs are timestamped and verified.</span>
          </div>

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
