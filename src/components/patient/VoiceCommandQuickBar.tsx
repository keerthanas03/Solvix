import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  isSpeechRecognitionSupported,
  createSpeechRecognition,
  parseVoiceTaskCommand,
} from '../../services/voiceCommandService';
import { playGentleChime } from '../../services/notificationService';
import { Mic, MicOff, Check, Sparkles, Volume2, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface VoiceCommandQuickBarProps {
  onOpenVoiceModal: () => void;
  onTaskLogged?: (taskName: string) => void;
}

export const VoiceCommandQuickBar: React.FC<VoiceCommandQuickBarProps> = ({
  onOpenVoiceModal,
  onTaskLogged,
}) => {
  const {
    dailyTasks,
    verifyAndCompleteTask,
    language,
    speakText,
    currentPatient,
  } = useApp();

  const [isQuickListening, setIsQuickListening] = useState<boolean>(false);
  const [quickTranscript, setQuickTranscript] = useState<string>('');
  const [quickFeedback, setQuickFeedback] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
    };
  }, []);

  const handleToggleQuickMic = () => {
    if (isQuickListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
      setIsQuickListening(false);
      return;
    }

    if (!isSpeechRecognitionSupported()) {
      onOpenVoiceModal();
      return;
    }

    try {
      const recognition = createSpeechRecognition(language || 'en');
      if (!recognition) {
        onOpenVoiceModal();
        return;
      }

      setQuickFeedback(null);
      setQuickTranscript('');

      recognition.onstart = () => {
        setIsQuickListening(true);
      };

      recognition.onresult = async (event: any) => {
        let text = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          text += event.results[i][0].transcript;
        }

        const trimmed = text.trim();
        setQuickTranscript(trimmed);

        if (event.results[0].isFinal) {
          const parsed = parseVoiceTaskCommand(trimmed, dailyTasks, language || 'en');
          if (parsed.matchedTask) {
            await verifyAndCompleteTask(
              parsed.matchedTask.id,
              parsed.difficulty,
              parsed.discomfort,
              `Quick voice command: "${trimmed}"`,
              'voice_verified'
            );

            playGentleChime();
            try {
              confetti({
                particleCount: 40,
                spread: 55,
                origin: { y: 0.8 },
                colors: ['#C99A3A', '#15803D'],
              });
            } catch {}

            const confirmMsg =
              language === 'ta'
                ? `${parsed.matchedTask.exerciseName} முடிந்தது!`
                : language === 'hi'
                ? `${parsed.matchedTask.exerciseName} पूरा हो गया!`
                : `${parsed.matchedTask.exerciseName} logged!`;

            speakText(confirmMsg, language || 'en');

            setQuickFeedback(`✓ ${parsed.matchedTask.exerciseName} logged by voice!`);
            if (onTaskLogged) onTaskLogged(parsed.matchedTask.exerciseName);

            setTimeout(() => {
              setQuickFeedback(null);
              setQuickTranscript('');
            }, 3500);
          } else {
            // Didn't find exact match, open modal for guided clarification
            onOpenVoiceModal();
          }
        }
      };

      recognition.onerror = () => {
        setIsQuickListening(false);
      };

      recognition.onend = () => {
        setIsQuickListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsQuickListening(false);
      onOpenVoiceModal();
    }
  };

  return (
    <div
      role="region"
      aria-label="Voice Command Quick Bar"
      className="w-full bg-white rounded-2xl border border-[#E8E4D8] p-3 sm:px-4 sm:py-2.5 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-2.5 transition-all"
    >
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <button
          type="button"
          onClick={handleToggleQuickMic}
          className={`relative p-2.5 rounded-xl font-bold text-xs flex items-center justify-center shrink-0 cursor-pointer transition-all ${
            isQuickListening
              ? 'bg-[#DC2626] text-white ring-4 ring-[#DC2626]/20 animate-pulse'
              : 'bg-[#FCF9F2] hover:bg-[#F7F1E1] border border-[#E6C978] text-[#8E681C]'
          }`}
          title={isQuickListening ? 'Listening... tap to stop' : 'Tap to speak voice command'}
        >
          {isQuickListening ? (
            <Mic className="w-4 h-4 animate-bounce" />
          ) : (
            <Mic className="w-4 h-4 text-[#B8892D]" />
          )}
        </button>

        <div className="text-xs">
          {quickFeedback ? (
            <div className="font-bold text-[#15803D] flex items-center gap-1.5 animate-in fade-in">
              <Check className="w-4 h-4" />
              <span>{quickFeedback}</span>
            </div>
          ) : isQuickListening ? (
            <div className="text-[#DC2626] font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#DC2626] animate-ping" />
              <span>
                {quickTranscript ? `"${quickTranscript}"` : 'Listening... say "I finished Knee Extension"'}
              </span>
            </div>
          ) : (
            <div className="text-[#5F5B52]">
              <span className="font-bold text-[#252525]">Voice Task Logger: </span>
              <span className="hidden md:inline">
                Say "I completed Knee Extension" or "Done morning session"
              </span>
              <span className="md:hidden">Tap mic to log tasks by voice</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
        <button
          type="button"
          onClick={onOpenVoiceModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FCF9F2] hover:bg-[#F7F1E1] border border-[#E6C978] text-[#8E681C] text-xs font-bold cursor-pointer transition-colors shadow-2xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#B8892D]" />
          <span>Open Voice Hub</span>
        </button>
      </div>
    </div>
  );
};
