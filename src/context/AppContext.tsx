import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  LanguageCode,
  Patient,
  RehabilitationPlan,
  PlanExercise,
  PatientFeedback,
  AiFlag,
  AuditLog,
  SyncQueueItem,
  UploadedPrescription,
  DailyScheduledTask,
} from '../types';
import {
  INITIAL_PATIENTS,
  INITIAL_REHAB_PLAN,
  INITIAL_FEEDBACK,
  INITIAL_AI_FLAGS,
  INITIAL_AUDIT_LOGS,
  INITIAL_PRESCRIPTIONS,
  INITIAL_DAILY_TASKS,
} from '../data/mockData';

interface AppContextType {
  // Role & Identity
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  selectedPatientId: string;
  setSelectedPatientId: (id: string) => void;
  currentPatient: Patient;
  patients: Patient[];
  updatePatient: (patient: Patient) => void;

  // Uploaded Prescriptions & Daily Task Adherence
  uploadedPrescriptions: UploadedPrescription[];
  dailyTasks: DailyScheduledTask[];
  activePrescription: UploadedPrescription | null;
  isPrescriptionUploadModalOpen: boolean;
  setIsPrescriptionUploadModalOpen: (open: boolean) => void;
  uploadAndAnalyzePrescription: (
    prescriptionText: string,
    sampleSlipId?: string,
    imageDescription?: string
  ) => Promise<{ success: boolean; data: UploadedPrescription }>;
  activateSuggestedSchedule: (prescriptionId: string) => void;
  verifyAndCompleteTask: (
    taskId: string,
    difficulty?: 'easy' | 'okay' | 'difficult',
    discomfort?: boolean,
    notes?: string,
    method?: 'runner_completed' | 'voice_verified' | 'manual_confirm'
  ) => Promise<void>;
  markTaskDueOrMissed: (taskId: string, status: 'due_now' | 'missed' | 'pending') => void;

  // Language & Accessibility
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  simpleMode: boolean;
  setSimpleMode: (enabled: boolean) => void;
  isSpeaking: boolean;
  speakText: (text: string, lang?: LanguageCode) => void;
  stopSpeaking: () => void;

  // Offline & Synchronization
  isOffline: boolean;
  setIsOffline: (offline: boolean) => void;
  toggleOffline: () => void;
  syncQueue: SyncQueueItem[];
  lastSyncTime: string;
  isSyncing: boolean;
  syncPendingNow: () => Promise<void>;
  syncBannerMessage: string | null;

  // Rehabilitation Plans
  activePlan: RehabilitationPlan;
  draftPlan: RehabilitationPlan | null;
  setDraftPlan: (plan: RehabilitationPlan | null) => void;
  createDraftPlan: (
    exerciseName: string,
    clinicalInstruction: string,
    repetitions: string,
    frequency: string
  ) => Promise<{ success: boolean; data: any }>;
  approveDraftPlan: () => void;
  rejectDraftPlan: () => void;
  completeExercise: (
    exerciseId: string,
    difficulty: 'easy' | 'okay' | 'difficult',
    discomfort: boolean,
    feedbackText?: string,
    feedbackMethod?: 'voice' | 'text' | 'tap'
  ) => Promise<void>;

  // Feedback & Flags
  feedbackList: PatientFeedback[];
  aiFlags: AiFlag[];
  resolveFlag: (flagId: string) => void;
  addTherapistNoteToFeedback: (feedbackId: string, note: string) => void;

  // Audit Logs
  auditLogs: AuditLog[];
  addAuditLog: (
    action: string,
    entity: string,
    classification: 'AI_ASSISTED' | 'PROFESSIONAL_CLINICAL' | 'PATIENT_ACTION' | 'GOVERNANCE',
    role?: UserRole | 'AI_SYSTEM',
    userName?: string
  ) => void;

  // Guided Demo & Modals
  isGuidedDemoOpen: boolean;
  setIsGuidedDemoOpen: (open: boolean) => void;
  guidedDemoStep: number;
  setGuidedDemoStep: (step: number) => void;
  isJudgeModeOpen: boolean;
  setIsJudgeModeOpen: (open: boolean) => void;
  isHowAiHelpsOpen: boolean;
  setIsHowAiHelpsOpen: (open: boolean) => void;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PLAN: 'rehabsathi_plan_v2',
  FEEDBACK: 'rehabsathi_feedback_v2',
  FLAGS: 'rehabsathi_flags_v2',
  AUDIT: 'rehabsathi_audit_v2',
  SYNC_QUEUE: 'rehabsathi_sync_queue_v2',
  OFFLINE: 'rehabsathi_offline_mode',
  PRESCRIPTIONS: 'rehabsathi_prescriptions_v2',
  DAILY_TASKS: 'rehabsathi_daily_tasks_v2',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Role
  const [userRole, setUserRole] = useState<UserRole>('patient');
  const [selectedPatientId, setSelectedPatientId] = useState<string>('pat-kumar-1');
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);

  // Accessibility & Language
  const [language, setLanguage] = useState<LanguageCode>('ta');
  const [simpleMode, setSimpleMode] = useState<boolean>(true);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Offline & Synchronization
  const [isOffline, setIsOfflineState] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEYS.OFFLINE) === 'true';
  });
  const [syncQueue, setSyncQueue] = useState<SyncQueueItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SYNC_QUEUE);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [lastSyncTime, setLastSyncTime] = useState<string>('Today, 09:42 AM');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncBannerMessage, setSyncBannerMessage] = useState<string | null>(null);

  // Active Plan & Draft Plan
  const [activePlan, setActivePlan] = useState<RehabilitationPlan>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PLAN);
      return saved ? JSON.parse(saved) : INITIAL_REHAB_PLAN;
    } catch {
      return INITIAL_REHAB_PLAN;
    }
  });
  const [draftPlan, setDraftPlan] = useState<RehabilitationPlan | null>(null);

  // Feedback & AI Flags
  const [feedbackList, setFeedbackList] = useState<PatientFeedback[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FEEDBACK);
      return saved ? JSON.parse(saved) : INITIAL_FEEDBACK;
    } catch {
      return INITIAL_FEEDBACK;
    }
  });

  const [aiFlags, setAiFlags] = useState<AiFlag[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FLAGS);
      return saved ? JSON.parse(saved) : INITIAL_AI_FLAGS;
    } catch {
      return INITIAL_AI_FLAGS;
    }
  });

  // Audit Logs
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.AUDIT);
      return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
    } catch {
      return INITIAL_AUDIT_LOGS;
    }
  });

  // Uploaded Prescriptions & Daily Tasks
  const [uploadedPrescriptions, setUploadedPrescriptions] = useState<UploadedPrescription[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRESCRIPTIONS);
      return saved ? JSON.parse(saved) : INITIAL_PRESCRIPTIONS;
    } catch {
      return INITIAL_PRESCRIPTIONS;
    }
  });

  const [dailyTasks, setDailyTasks] = useState<DailyScheduledTask[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DAILY_TASKS);
      return saved ? JSON.parse(saved) : INITIAL_DAILY_TASKS;
    } catch {
      return INITIAL_DAILY_TASKS;
    }
  });

  const [isPrescriptionUploadModalOpen, setIsPrescriptionUploadModalOpen] = useState<boolean>(false);

  // Modals & Guided Walkthrough
  const [isGuidedDemoOpen, setIsGuidedDemoOpen] = useState<boolean>(false);
  const [guidedDemoStep, setGuidedDemoStep] = useState<number>(1);
  const [isJudgeModeOpen, setIsJudgeModeOpen] = useState<boolean>(false);
  const [isHowAiHelpsOpen, setIsHowAiHelpsOpen] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  // Current Patient
  const currentPatient =
    patients.find((p) => p.id === selectedPatientId) || patients[0];

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PLAN, JSON.stringify(activePlan));
  }, [activePlan]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FEEDBACK, JSON.stringify(feedbackList));
  }, [feedbackList]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FLAGS, JSON.stringify(aiFlags));
  }, [aiFlags]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AUDIT, JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify(syncQueue));
  }, [syncQueue]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.OFFLINE, String(isOffline));
  }, [isOffline]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRESCRIPTIONS, JSON.stringify(uploadedPrescriptions));
  }, [uploadedPrescriptions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DAILY_TASKS, JSON.stringify(dailyTasks));
  }, [dailyTasks]);

  // Speech helper
  const speakText = (text: string, langCode: LanguageCode = language) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9; // calm, accessible pace
    utterance.pitch = 1.0;

    const bcp47Map: Record<LanguageCode, string> = {
      ta: 'ta-IN',
      hi: 'hi-IN',
      en: 'en-US',
    };
    utterance.lang = bcp47Map[langCode] || 'en-US';

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Audit Log helper
  const addAuditLog = (
    action: string,
    entity: string,
    classification: 'AI_ASSISTED' | 'PROFESSIONAL_CLINICAL' | 'PATIENT_ACTION' | 'GOVERNANCE',
    role?: UserRole | 'AI_SYSTEM',
    userName?: string
  ) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const user =
      userName ||
      (role === 'AI_SYSTEM'
        ? 'RehabSathi Co-Pilot'
        : userRole === 'therapist'
        ? 'Dr. Priya Raman'
        : userRole === 'patient'
        ? currentPatient.name
        : 'Clinic Admin');

    const newLog: AuditLog = {
      id: `aud-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: timeStr,
      userName: user,
      userRole: role || userRole,
      action,
      entity,
      classification,
      status: 'Recorded',
    };

    setAuditLogs((prev) => [newLog, ...prev.slice(0, 49)]);
  };

  // Toggle Offline mode with simulation
  const toggleOffline = () => {
    const nextOffline = !isOffline;
    setIsOfflineState(nextOffline);

    if (nextOffline) {
      setSyncBannerMessage('Offline Mode Active: Your approved rehabilitation plan and instructions remain fully available.');
      setTimeout(() => setSyncBannerMessage(null), 5000);
    } else {
      // Reconnected
      setSyncBannerMessage('Connection restored. Checking sync queue...');
      syncPendingNow();
    }
  };

  const syncPendingNow = async () => {
    setIsSyncing(true);
    const count = syncQueue.length;

    // Simulate real network request
    await new Promise((r) => setTimeout(r, 1200));

    if (count > 0) {
      setSyncQueue([]);
      // Mark feedback as synced
      setFeedbackList((prev) =>
        prev.map((fb) => (fb.syncStatus === 'pending' ? { ...fb, syncStatus: 'synced' } : fb))
      );
      setSyncBannerMessage(`All ${count} pending update${count > 1 ? 's' : ''} synchronized successfully ✓`);
      addAuditLog(`Synchronized ${count} pending offline updates to clinic server`, 'Sync Queue Manager', 'GOVERNANCE');
    } else {
      setSyncBannerMessage('All clinical updates and records are up to date ✓');
    }

    const now = new Date();
    setLastSyncTime(`Today, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
    setIsSyncing(false);
    setTimeout(() => setSyncBannerMessage(null), 4000);
  };

  // Complete exercise
  const completeExercise = async (
    exerciseId: string,
    difficulty: 'easy' | 'okay' | 'difficult',
    discomfort: boolean,
    feedbackText: string = '',
    feedbackMethod: 'voice' | 'text' | 'tap' = 'tap'
  ) => {
    // 1. Mark in active plan
    const updatedExercises: PlanExercise[] = activePlan.exercises.map((ex) => {
      if (ex.id === exerciseId || ex.exerciseId === exerciseId) {
        return {
          ...ex,
          completedToday: true,
          completedAt: `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
          difficultyReported: difficulty,
          discomfortReported: discomfort,
        };
      }
      return ex;
    });

    const updatedPlan: RehabilitationPlan = {
      ...activePlan,
      exercises: updatedExercises,
    };
    setActivePlan(updatedPlan);

    // 2. Build patient feedback item
    const targetExercise = activePlan.exercises.find((e) => e.id === exerciseId || e.exerciseId === exerciseId);
    const exName = targetExercise ? targetExercise.exerciseName : 'Knee Extension';

    let aiSummary = {
      feedbackSummary: feedbackText.trim()
        ? `Patient reported: "${feedbackText.trim()}". Exercise completed with ${difficulty} difficulty.`
        : `Patient rated exercise as ${difficulty}. Discomfort: ${discomfort ? 'Yes' : 'No'}.`,
      adherenceImpact: difficulty === 'difficult' ? 'Partial / Difficult completion' : 'Full adherence',
      suggestedAction: discomfort
        ? 'Physiotherapist review recommended. Evaluate movement tolerance before advancing repetitions.'
        : 'Continue current approved schedule as tolerated.',
      requiresReview: discomfort || difficulty === 'difficult',
      safetyNotice: 'AI does not diagnose. This is an objective summary of patient-reported feedback.',
    };

    // If online, call server to generate real Gemini summary
    if (!isOffline) {
      try {
        const res = await fetch('/api/ai/summarize-feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            rawFeedback: feedbackText,
            exerciseName: exName,
            difficultyRating: difficulty,
            discomfortReported: discomfort,
          }),
        });
        if (res.ok) {
          const resJson = await res.json();
          if (resJson.data) {
            aiSummary = {
              ...aiSummary,
              ...resJson.data,
            };
          }
        }
      } catch (err) {
        console.warn('Feedback summarization API unavailable, used deterministic summary:', err);
      }
    }

    const newFeedback: PatientFeedback = {
      id: `fb-${Date.now()}`,
      patientId: currentPatient.id,
      patientName: currentPatient.name,
      exerciseId: targetExercise ? targetExercise.exerciseId : 'ex-knee-ext',
      exerciseName: exName,
      rawFeedback: feedbackText || `Selected: ${difficulty} | Discomfort: ${discomfort ? 'Yes' : 'No'}`,
      feedbackMethod,
      difficulty,
      discomfortReported: discomfort,
      discomfortDetails: discomfort ? 'Discomfort reported during activity.' : undefined,
      createdAt: new Date().toISOString(),
      syncStatus: isOffline ? 'pending' : 'synced',
      aiSummary,
      therapistReviewStatus: 'pending',
    };

    setFeedbackList((prev) => [newFeedback, ...prev]);

    // 3. If offline, enqueue
    if (isOffline) {
      const queueItem: SyncQueueItem = {
        id: `sq-${Date.now()}`,
        action: 'exercise_completion',
        payload: { exerciseId, difficulty, discomfort, feedbackText },
        timestamp: new Date().toISOString(),
        synced: false,
      };
      setSyncQueue((prev) => [...prev, queueItem]);
    }

    // 4. If difficulty or discomfort, trigger AI Flag for Physiotherapist Review!
    if (discomfort || difficulty === 'difficult') {
      const newFlag: AiFlag = {
        id: `flag-${Date.now()}`,
        patientId: currentPatient.id,
        patientName: currentPatient.name,
        type: 'difficulty_reported',
        title: `Patient Reported Exercise Difficulty: ${exName}`,
        description: `${currentPatient.name} reported difficulty with ${exName}. Discomfort: ${discomfort ? 'Yes' : 'No'}.`,
        aiInterpretation: `Patient reported difficulty completing ${exName}. Suggested physiotherapist review to ensure safe range of motion.`,
        recommendedAction: 'Physiotherapist review recommended. Evaluate technique and adjust load if indicated.',
        status: 'requires_review',
        severity: 'priority',
        createdAt: new Date().toISOString(),
      };
      setAiFlags((prev) => [newFlag, ...prev]);
    }

    addAuditLog(
      `Completed exercise: ${exName} (${difficulty})`,
      'Exercise Execution',
      'PATIENT_ACTION',
      'patient',
      currentPatient.name
    );
  };

  // Create Draft Plan via AI Co-Pilot
  const createDraftPlan = async (
    exerciseName: string,
    clinicalInstruction: string,
    repetitions: string,
    frequency: string
  ) => {
    let aiResponseData: any = null;

    try {
      const res = await fetch('/api/ai/simplify-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exerciseName,
          clinicalInstruction,
          repetitions,
          frequency,
          patientContext: currentPatient,
        }),
      });
      const data = await res.json();
      aiResponseData = data.data;
    } catch (err) {
      console.warn('API error, using local fallback:', err);
    }

    // Assemble AI Draft Plan
    const newDraft: RehabilitationPlan = {
      id: `plan-draft-${Date.now()}`,
      patientId: currentPatient.id,
      patientName: currentPatient.name,
      therapistId: 'tp-priya',
      therapistName: 'Dr. Priya Raman',
      title: `${exerciseName} Personalized Rehabilitation Plan`,
      status: 'draft_awaiting_approval',
      version: activePlan.version + 1,
      createdAt: new Date().toISOString(),
      clinicalNote: `Clinical instruction by Dr. Priya: "${clinicalInstruction}" (${repetitions}, ${frequency}).`,
      patientPreferenceInvolved: `Patient language: ${currentPatient.preferredLanguage === 'ta' ? 'Tamil' : 'English'}, Available: ${currentPatient.preferredTimes.join(' & ')}, No equipment.`,
      previousPlanSummary: `Version ${activePlan.version}: Previous schedule before AI adaptation.`,
      aiReasoningFactors: aiResponseData?.reasons || [
        `Simplified into step-by-step instructions for ${currentPatient.digitalLiteracy} digital literacy`,
        `Formatted in ${currentPatient.preferredLanguage === 'ta' ? 'Tamil' : 'English'} with voice script`,
        `Fitted to routine times: ${currentPatient.preferredTimes.join(', ')}`,
        `Requires zero specialized equipment`,
        `Ready for offline storage on patient's device`,
      ],
      exercises: [
        {
          id: `pe-draft-1`,
          exerciseId: 'ex-knee-ext',
          exerciseName,
          timeSlot: currentPatient.preferredTimes[0] || '06:30 AM',
          timeCategory: 'morning',
          professionalInstruction: clinicalInstruction,
          patientInstructionEn:
            aiResponseData?.simplifiedInstruction ||
            'Sit comfortably. Slowly straighten your leg. Hold for 3 seconds. Relax. Repeat 10 times.',
          patientInstructionTa:
            aiResponseData?.translatedInstruction ||
            'நாற்காலியில் வசதியாக அமருங்கள். உங்கள் காலை மெதுவாக நேராக நீட்டவும். 3 வினாடிகள் பிடித்து, பின் தளர்த்தவும். 10 முறை செய்யவும்.',
          patientInstructionHi:
            'कुर्सी पर बैठें। पैर को धीरे-धीरे सीधा करें। 3 सेकंड रोकें, फिर आराम दें। 10 बार दोहराएं।',
          audioScriptEn:
            aiResponseData?.audioScript ||
            'Sit on the chair. Slowly straighten your leg. Hold for 3 seconds. Gently relax.',
          audioScriptTa:
            'நாற்காலியில் அமருங்கள். உங்கள் காலை மெதுவாக நேராக்குங்கள். மூன்று வினாடிகள் பிடியுங்கள். மெதுவாக தளர்த்துங்கள்.',
          audioScriptHi:
            'कुर्सी पर बैठें। पैर को धीरे से सीधा करें। तीन सेकंड रोकें और फिर आराम दें।',
          repetitions,
          frequency: `Morning ${currentPatient.preferredTimes[0] || '06:30 AM'}`,
          completedToday: false,
        },
        {
          id: `pe-draft-2`,
          exerciseId: 'ex-knee-ext',
          exerciseName: `${exerciseName} (Evening)`,
          timeSlot: currentPatient.preferredTimes[1] || '08:00 PM',
          timeCategory: 'evening',
          professionalInstruction: `Evening repeat session of ${exerciseName} (${repetitions}).`,
          patientInstructionEn:
            'Sit comfortably in the evening. Straighten your leg gently 10 times. Stop if uncomfortable.',
          patientInstructionTa:
            'மாலையில் நாற்காலியில் அமர்ந்து காலை மெதுவாக 10 முறை நேராக்கவும். வலி இருந்தால் நிறுத்தவும்.',
          patientInstructionHi:
            'शाम को आराम से बैठें और पैर को 10 बार सीधा करें। असहज लगे तो रुकें।',
          audioScriptEn:
            'Sit comfortably. Slowly straighten your leg 10 times. Stop if uncomfortable.',
          audioScriptTa:
            'நாற்காலியில் அமர்ந்து காலை மெதுவாக 10 முறை நேராக்குங்கள். வலி ஏற்பட்டால் நிறுத்துங்கள்.',
          audioScriptHi:
            'आराम से बैठें और पैर को 10 बार सीधा करें।',
          repetitions,
          frequency: `Evening ${currentPatient.preferredTimes[1] || '08:00 PM'}`,
          completedToday: false,
        },
      ],
    };

    setDraftPlan(newDraft);
    addAuditLog(
      `AI generated simplified draft plan for ${currentPatient.name}`,
      'AI Co-Pilot Plan Builder',
      'AI_ASSISTED',
      'AI_SYSTEM'
    );

    return { success: true, data: newDraft };
  };

  // Approve Draft Plan
  const approveDraftPlan = () => {
    if (!draftPlan) return;

    const approvedPlan: RehabilitationPlan = {
      ...draftPlan,
      status: 'approved',
      approvedAt: new Date().toISOString(),
    };

    setActivePlan(approvedPlan);
    setDraftPlan(null);

    addAuditLog(
      `Approved and activated Rehabilitation Plan v${approvedPlan.version} for ${approvedPlan.patientName}`,
      `Rehabilitation Plan #${approvedPlan.version}`,
      'PROFESSIONAL_CLINICAL',
      'therapist',
      'Dr. Priya Raman'
    );
  };

  const rejectDraftPlan = () => {
    if (draftPlan) {
      addAuditLog(
        `Rejected AI draft plan for ${draftPlan.patientName}`,
        'AI Co-Pilot Draft',
        'PROFESSIONAL_CLINICAL',
        'therapist',
        'Dr. Priya Raman'
      );
    }
    setDraftPlan(null);
  };

  const resolveFlag = (flagId: string) => {
    setAiFlags((prev) =>
      prev.map((f) => (f.id === flagId ? { ...f, status: 'resolved' } : f))
    );
    addAuditLog(`Resolved AI Flag: ${flagId}`, 'AI Flag Center', 'PROFESSIONAL_CLINICAL');
  };

  const addTherapistNoteToFeedback = (feedbackId: string, note: string) => {
    setFeedbackList((prev) =>
      prev.map((fb) =>
        fb.id === feedbackId
          ? { ...fb, therapistNotes: note, therapistReviewStatus: 'reviewed' }
          : fb
      )
    );
    addAuditLog(
      `Added clinical note to patient feedback: "${note}"`,
      'Feedback Review',
      'PROFESSIONAL_CLINICAL'
    );
  };

  const activePrescription =
    uploadedPrescriptions.find(
      (p) => p.patientId === selectedPatientId && p.status === 'schedule_active'
    ) || uploadedPrescriptions[0] || null;

  const uploadAndAnalyzePrescription = async (
    prescriptionText: string,
    sampleSlipId?: string,
    imageDescription?: string
  ): Promise<{ success: boolean; data: UploadedPrescription }> => {
    try {
      const res = await fetch('/api/ai/parse-prescription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prescriptionText,
          sampleSlipId,
          imageDescription,
          patientContext: currentPatient,
        }),
      });
      const json = await res.json();
      const parsedData = json.data;

      const newPrescription: UploadedPrescription = {
        id: `presc-${Date.now()}`,
        patientId: currentPatient.id,
        patientName: currentPatient.name,
        doctorName: parsedData.doctorName || 'Dr. Priya Raman, MPT (Ortho)',
        clinicOrHospital: parsedData.clinicOrHospital || 'Apex Physical Therapy & Mobility Clinic',
        prescribedDate: parsedData.prescribedDate || new Date().toISOString().split('T')[0],
        clinicalDiagnosis: parsedData.clinicalDiagnosis || 'Knee Rehabilitation Protocol',
        precautions: parsedData.precautions || 'Perform within pain-free range.',
        uploadedAt: 'Just now',
        sourceType: sampleSlipId ? 'sample_slip' : 'photo_scan',
        sampleName: sampleSlipId,
        extractedExercises: parsedData.extractedExercises || [],
        suggestedSchedule: parsedData.suggestedSchedule || [],
        aiExplanation: parsedData.aiExplanation || 'Schedule personalized based on patient routine.',
        status: 'schedule_active',
        adherenceCheckpoints: parsedData.adherenceCheckpoints || [],
      };

      setUploadedPrescriptions((prev) => [newPrescription, ...prev]);

      // Automatically construct daily tasks based on the suggested schedule slots!
      const newDailyTasks: DailyScheduledTask[] = [];
      newPrescription.suggestedSchedule.forEach((slot, slotIdx) => {
        slot.exercises.forEach((exName, exIdx) => {
          const matchedEx = newPrescription.extractedExercises.find((e) => e.name === exName);
          newDailyTasks.push({
            id: `task-${Date.now()}-${slotIdx}-${exIdx}`,
            prescriptionId: newPrescription.id,
            exerciseName: exName,
            slotName: slot.slotName,
            scheduledTime: slot.time,
            period: slot.period,
            repetitions: matchedEx ? matchedEx.dosage : '3 sets × 10 reps',
            status: slotIdx === 0 ? 'due_now' : 'pending',
            verified: false,
          });
        });
      });

      if (newDailyTasks.length > 0) {
        setDailyTasks(newDailyTasks);
      }

      addAuditLog(
        `Uploaded & analyzed clinical prescription slip from ${newPrescription.doctorName}`,
        'Prescription AI Extractor',
        'AI_ASSISTED',
        'patient',
        currentPatient.name
      );

      return { success: true, data: newPrescription };
    } catch (err: any) {
      console.error('Failed to parse prescription:', err);
      return { success: false, data: INITIAL_PRESCRIPTIONS[0] };
    }
  };

  const activateSuggestedSchedule = (prescriptionId: string) => {
    setUploadedPrescriptions((prev) =>
      prev.map((p) =>
        p.id === prescriptionId ? { ...p, status: 'schedule_active' } : p
      )
    );
    const target = uploadedPrescriptions.find((p) => p.id === prescriptionId);
    if (target) {
      const refreshedTasks: DailyScheduledTask[] = [];
      target.suggestedSchedule.forEach((slot, sIdx) => {
        slot.exercises.forEach((exName, eIdx) => {
          const matchedEx = target.extractedExercises.find((e) => e.name === exName);
          refreshedTasks.push({
            id: `task-${Date.now()}-${sIdx}-${eIdx}`,
            prescriptionId: target.id,
            exerciseName: exName,
            slotName: slot.slotName,
            scheduledTime: slot.time,
            period: slot.period,
            repetitions: matchedEx ? matchedEx.dosage : '3 sets × 10 reps',
            status: sIdx === 0 ? 'due_now' : 'pending',
            verified: false,
          });
        });
      });
      setDailyTasks(refreshedTasks);
    }
    addAuditLog(
      `Activated AI suggested schedule for daily tasks`,
      'Schedule Optimizer',
      'PATIENT_ACTION',
      'patient',
      currentPatient.name
    );
  };

  const verifyAndCompleteTask = async (
    taskId: string,
    difficulty: 'easy' | 'okay' | 'difficult' = 'okay',
    discomfort: boolean = false,
    notes?: string,
    method: 'runner_completed' | 'voice_verified' | 'manual_confirm' = 'runner_completed'
  ) => {
    const completedAtStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setDailyTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              status: 'completed',
              completedAt: completedAtStr,
              verified: true,
              verificationMethod: method,
              reportedDifficulty: difficulty,
              discomfortReported: discomfort,
              patientNotes: notes,
            }
          : t
      )
    );

    // Call adherence verification endpoint
    try {
      const targetTask = dailyTasks.find((t) => t.id === taskId);
      await fetch('/api/ai/verify-task-adherence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scheduledTime: targetTask?.scheduledTime,
          completedAt: completedAtStr,
          taskName: targetTask?.exerciseName,
          difficulty,
          discomfortReported: discomfort,
        }),
      });
    } catch {
      // safe fallback
    }

    // If discomfort reported, automatically flag for therapist
    if (discomfort) {
      const flagId = `flag-discomfort-${Date.now()}`;
      const newFlag: AiFlag = {
        id: flagId,
        patientId: currentPatient.id,
        patientName: currentPatient.name,
        type: 'discomfort_repeated',
        title: `Patient-reported discomfort during verified task`,
        description: `${currentPatient.name} completed scheduled task at ${completedAtStr} and reported discomfort.`,
        aiInterpretation: `Adherence task was verified, but patient reported discomfort. Professional assessment advised before continuing intensity.`,
        recommendedAction: `Review exercise form and tolerance with ${currentPatient.name}.`,
        status: 'requires_review',
        severity: 'priority',
        createdAt: 'Just now',
      };
      setAiFlags((prev) => [newFlag, ...prev]);
    }

    addAuditLog(
      `Verified completion of scheduled rehabilitation task at ${completedAtStr}`,
      'Task Adherence Guardian',
      'PATIENT_ACTION',
      'patient',
      currentPatient.name
    );
  };

  const markTaskDueOrMissed = (taskId: string, status: 'due_now' | 'missed' | 'pending') => {
    setDailyTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status, verified: false } : t))
    );
    if (status === 'missed') {
      const missedFlag: AiFlag = {
        id: `flag-missed-${Date.now()}`,
        patientId: currentPatient.id,
        patientName: currentPatient.name,
        type: 'missed_sessions',
        title: `Scheduled rehabilitation session missed`,
        description: `${currentPatient.name} missed a scheduled session. AI suggested catch-up window.`,
        aiInterpretation: `Missed session detected by Adherence Guardian. Rescheduled gentle session offered.`,
        recommendedAction: `Check in with patient if multiple sessions are missed.`,
        status: 'requires_review',
        severity: 'moderate',
        createdAt: 'Just now',
      };
      setAiFlags((prev) => [missedFlag, ...prev]);
    }
  };

  const updatePatient = (updated: Patient) => {
    setPatients((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  return (
    <AppContext.Provider
      value={{
        userRole,
        setUserRole,
        selectedPatientId,
        setSelectedPatientId,
        currentPatient,
        patients,
        updatePatient,
        uploadedPrescriptions,
        dailyTasks,
        activePrescription,
        isPrescriptionUploadModalOpen,
        setIsPrescriptionUploadModalOpen,
        uploadAndAnalyzePrescription,
        activateSuggestedSchedule,
        verifyAndCompleteTask,
        markTaskDueOrMissed,
        language,
        setLanguage,
        simpleMode,
        setSimpleMode,
        isSpeaking,
        speakText,
        stopSpeaking,
        isOffline,
        setIsOffline: setIsOfflineState,
        toggleOffline,
        syncQueue,
        lastSyncTime,
        isSyncing,
        syncPendingNow,
        syncBannerMessage,
        activePlan,
        draftPlan,
        setDraftPlan,
        createDraftPlan,
        approveDraftPlan,
        rejectDraftPlan,
        completeExercise,
        feedbackList,
        aiFlags,
        resolveFlag,
        addTherapistNoteToFeedback,
        auditLogs,
        addAuditLog,
        isGuidedDemoOpen,
        setIsGuidedDemoOpen,
        guidedDemoStep,
        setGuidedDemoStep,
        isJudgeModeOpen,
        setIsJudgeModeOpen,
        isHowAiHelpsOpen,
        setIsHowAiHelpsOpen,
        isLoginModalOpen,
        setIsLoginModalOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
