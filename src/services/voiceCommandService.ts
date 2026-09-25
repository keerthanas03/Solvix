import { DailyScheduledTask } from '../types';

export interface VoiceParseResult {
  matchedTask: DailyScheduledTask | null;
  allMatchedTasks?: DailyScheduledTask[];
  action: 'complete_task' | 'complete_session' | 'query_status' | 'unknown';
  confidence: 'high' | 'medium' | 'low';
  difficulty: 'easy' | 'okay' | 'difficult';
  discomfort: boolean;
  notes: string;
  transcript: string;
}

// Check Web Speech API support
export const isSpeechRecognitionSupported = (): boolean => {
  return typeof window !== 'undefined' && Boolean((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
};

// Create a SpeechRecognition instance with proper language
export const createSpeechRecognition = (language: 'en' | 'ta' | 'hi' = 'en'): any | null => {
  if (!isSpeechRecognitionSupported()) return null;

  const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  const recognition = new SpeechRecognitionClass();

  // Language mapping
  const langMap: Record<string, string> = {
    en: 'en-US',
    ta: 'ta-IN',
    hi: 'hi-IN',
  };

  recognition.lang = langMap[language] || 'en-US';
  recognition.interimResults = true;
  recognition.maxAlternatives = 3;
  recognition.continuous = false;

  return recognition;
};

// Parse spoken text to identify patient rehabilitation task intent
export const parseVoiceTaskCommand = (
  rawTranscript: string,
  dailyTasks: DailyScheduledTask[],
  language: 'en' | 'ta' | 'hi' = 'en'
): VoiceParseResult => {
  const text = rawTranscript.toLowerCase().trim();

  // 1. Detect Discomfort / Pain signals
  let discomfort = false;
  const painWords = ['pain', 'hurts', 'hurt', 'aching', 'ache', 'sore', 'வலி', 'வலிக்குது', 'दर्द', 'तकलीफ'];
  const noPainWords = ['no pain', 'no hurt', 'without pain', 'pain free', 'வலியில்லை', 'வலி இல்லை', 'दर्द नहीं', 'बिना दर्द'];

  const hasNoPain = noPainWords.some((phrase) => text.includes(phrase));
  const hasPain = painWords.some((word) => text.includes(word));

  if (hasPain && !hasNoPain) {
    discomfort = true;
  }

  // 2. Detect Difficulty
  let difficulty: 'easy' | 'okay' | 'difficult' = 'okay';
  const easyWords = ['easy', 'simple', 'smooth', 'effortless', 'சுலபம்', 'எளிது', 'சுலபமாக', 'सरल', 'आसान'];
  const hardWords = ['hard', 'difficult', 'tough', 'heavy', 'stiff', 'கடினம்', 'கஷ்டம்', 'कठिन', 'मुश्किल'];

  if (easyWords.some((w) => text.includes(w))) {
    difficulty = 'easy';
  } else if (hardWords.some((w) => text.includes(w))) {
    difficulty = 'difficult';
  }

  // 3. Detect completion keywords
  const completionWords = [
    'done',
    'finish',
    'finished',
    'complete',
    'completed',
    'did',
    'logged',
    'log',
    'mark',
    'verified',
    'verify',
    'yes',
    'over',
    // Tamil keywords
    'முடிந்தது',
    'முடித்தேன்',
    'முடிச்சுட்டேன்',
    'செய்தேன்',
    'பண்ணிட்டேன்',
    'ஆச்சு',
    'ஆகிவிட்டது',
    // Hindi keywords
    'पूरा',
    'किया',
    'हो गया',
    'कर लिया',
    'खत्म',
  ];

  const hasCompletionIntent = completionWords.some((w) => text.includes(w)) || text.length > 3;

  // 4. Match specific exercise
  // Exercise dictionary matching keywords
  const exerciseKeywords: { key: string; keywords: string[] }[] = [
    {
      key: 'knee',
      keywords: [
        'knee',
        'extension',
        'seated knee',
        'leg extension',
        'knee extend',
        'முழங்கால்',
        'நீட்சி',
        'முட்டி',
        'घुटना',
        'सीधा',
        'नी एक्सटेंशन',
      ],
    },
    {
      key: 'ankle',
      keywords: [
        'ankle',
        'pump',
        'pumps',
        'foot',
        'gentle ankle',
        'கெண்டைக்கால்',
        'ஆங்கிள்',
        'பம்பு',
        'பாதம்',
        'एंकल',
        'पंप',
        'पैर',
      ],
    },
    {
      key: 'quad',
      keywords: [
        'quad',
        'quads',
        'isometric',
        'thigh',
        'quadriceps',
        'குவாட்ஸ்',
        'தொடை',
        'जांघ',
        'क्वाड',
      ],
    },
    {
      key: 'heel',
      keywords: ['heel', 'slide', 'slides', 'ஹீல்', 'ஸ்லைடு', 'हील', 'स्लाइड'],
    },
    {
      key: 'straight',
      keywords: ['straight', 'leg', 'raise', 'slr', 'ஸ்ட்ரெயிட்', 'लेग रेज'],
    },
  ];

  // Check matching against uncompleted tasks first, then all tasks
  const pendingOrDueTasks = dailyTasks.filter((t) => t.status !== 'completed');
  const targetTasksPool = pendingOrDueTasks.length > 0 ? pendingOrDueTasks : dailyTasks;

  let matchedTask: DailyScheduledTask | null = null;
  let confidence: 'high' | 'medium' | 'low' = 'low';

  // Strategy A: Match exercise name by keywords
  for (const group of exerciseKeywords) {
    const matchedKeyword = group.keywords.find((k) => text.includes(k));
    if (matchedKeyword) {
      // Find task with matching exerciseName
      const found = targetTasksPool.find((t) =>
        group.keywords.some((kw) => t.exerciseName.toLowerCase().includes(kw))
      );
      if (found) {
        matchedTask = found;
        confidence = 'high';
        break;
      }
    }
  }

  // Strategy B: Session period match (e.g., "morning session done", "completed evening tasks")
  const isMorning = text.includes('morning') || text.includes('காலை') || text.includes('सुबह');
  const isEvening = text.includes('evening') || text.includes('மாலை') || text.includes('இரவு') || text.includes('शाम');

  if (!matchedTask) {
    if (isMorning) {
      const morningTask = targetTasksPool.find((t) => t.period === 'morning');
      if (morningTask) {
        matchedTask = morningTask;
        confidence = 'medium';
      }
    } else if (isEvening) {
      const eveningTask = targetTasksPool.find((t) => t.period === 'evening');
      if (eveningTask) {
        matchedTask = eveningTask;
        confidence = 'medium';
      }
    }
  }

  // Strategy C: Contextual fallback - "I'm done", "Completed next task", "I finished my exercise"
  if (!matchedTask && hasCompletionIntent) {
    // Pick the due_now task or the earliest pending task
    const dueNow = targetTasksPool.find((t) => t.status === 'due_now');
    const missed = targetTasksPool.find((t) => t.status === 'missed');
    const firstPending = targetTasksPool[0];

    matchedTask = dueNow || missed || firstPending || null;
    confidence = matchedTask ? 'medium' : 'low';
  }

  const notes = discomfort
    ? `Patient reported mild discomfort via voice input: "${rawTranscript}"`
    : `Logged via browser voice input: "${rawTranscript}"`;

  return {
    matchedTask,
    action: matchedTask ? 'complete_task' : 'unknown',
    confidence,
    difficulty,
    discomfort,
    notes,
    transcript: rawTranscript,
  };
};
