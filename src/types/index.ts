export type UserRole = 'patient' | 'therapist' | 'admin';

export type LanguageCode = 'en' | 'ta' | 'hi';

export type DigitalLiteracy = 'Low' | 'Medium' | 'High';

export type ConnectivityLevel = 'Intermittent' | 'Reliable' | 'Mostly Offline';

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  preferredLanguage: LanguageCode;
  digitalLiteracy: DigitalLiteracy;
  connectivity: ConnectivityLevel;
  preferredInstructionMode: 'voice' | 'simple_text' | 'visual_steps';
  preferredTimes: string[];
  equipment: string;
  dailyRoutine: string;
  rehabilitationGoal: string;
  adherenceRate: number; // e.g. 82%
  assignedTherapist: string;
  simpleModeEnabled: boolean;
  avatarSeed: string;
}

export interface ExerciseItem {
  id: string;
  name: string;
  category: string;
  simpleDescription: string;
  professionalDescription: string;
  defaultReps: string;
  defaultSets: string;
  defaultFrequency: string;
  equipment: string;
  stepsEn: string[];
  stepsTa: string[];
  stepsHi: string[];
  audioScriptEn: string;
  audioScriptTa: string;
  audioScriptHi: string;
}

export interface PlanExercise {
  id: string;
  exerciseId: string;
  exerciseName: string;
  timeSlot: string; // e.g. "06:30 AM"
  timeCategory: 'morning' | 'afternoon' | 'evening';
  professionalInstruction: string;
  patientInstructionEn: string;
  patientInstructionTa: string;
  patientInstructionHi: string;
  audioScriptEn: string;
  audioScriptTa: string;
  audioScriptHi: string;
  repetitions: string;
  duration?: string;
  frequency: string;
  completedToday: boolean;
  completedAt?: string;
  difficultyReported?: 'easy' | 'okay' | 'difficult';
  discomfortReported?: boolean;
}

export interface RehabilitationPlan {
  id: string;
  patientId: string;
  patientName: string;
  therapistId: string;
  therapistName: string;
  title: string;
  status: 'approved' | 'draft_awaiting_approval' | 'rejected';
  version: number;
  createdAt: string;
  approvedAt?: string;
  exercises: PlanExercise[];
  aiReasoningFactors?: string[];
  patientPreferenceInvolved?: string;
  previousPlanSummary?: string;
  clinicalNote?: string;
}

export interface PatientFeedback {
  id: string;
  patientId: string;
  patientName: string;
  exerciseId: string;
  exerciseName: string;
  rawFeedback: string;
  feedbackMethod: 'voice' | 'text' | 'tap';
  difficulty: 'easy' | 'okay' | 'difficult';
  discomfortReported: boolean;
  discomfortDetails?: string;
  createdAt: string;
  syncStatus: 'synced' | 'pending';
  aiSummary: {
    feedbackSummary: string;
    adherenceImpact: string;
    suggestedAction: string;
    requiresReview: boolean;
    safetyNotice: string;
  };
  therapistReviewStatus: 'pending' | 'reviewed';
  therapistNotes?: string;
}

export interface AiFlag {
  id: string;
  patientId: string;
  patientName: string;
  type: 'difficulty_reported' | 'missed_sessions' | 'discomfort_repeated' | 'schedule_adjustment' | 'sync_pending';
  title: string;
  description: string;
  aiInterpretation: string;
  recommendedAction: string;
  status: 'requires_review' | 'resolved';
  severity: 'moderate' | 'priority';
  createdAt: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userName: string;
  userRole: UserRole | 'AI_SYSTEM';
  action: string;
  entity: string;
  classification: 'AI_ASSISTED' | 'PROFESSIONAL_CLINICAL' | 'PATIENT_ACTION' | 'GOVERNANCE';
  status: string;
}

export interface SyncQueueItem {
  id: string;
  action: 'exercise_completion' | 'patient_feedback' | 'preference_update';
  payload: any;
  timestamp: string;
  synced: boolean;
}

export interface PrescriptionExerciseExtracted {
  name: string;
  dosage: string;
  holdTime?: string;
  frequency: string;
  equipment?: string;
  clinicalInstruction: string;
  simpleInstructionEn: string;
  simpleInstructionTa: string;
  simpleInstructionHi: string;
}

export interface SuggestedScheduleSlot {
  slotName: string;
  time: string;
  period: 'morning' | 'afternoon' | 'evening';
  rationale: string;
  exercises: string[];
}

export interface UploadedPrescription {
  id: string;
  patientId: string;
  patientName: string;
  doctorName: string;
  clinicOrHospital: string;
  prescribedDate: string;
  clinicalDiagnosis: string;
  precautions: string;
  uploadedAt: string;
  sourceType: 'photo_scan' | 'sample_slip' | 'text_prescription';
  sampleName?: string;
  extractedExercises: PrescriptionExerciseExtracted[];
  suggestedSchedule: SuggestedScheduleSlot[];
  aiExplanation: string;
  status: 'analyzed' | 'schedule_active' | 'archived';
  adherenceCheckpoints?: {
    checkpoint: string;
    verificationMethod: string;
    missedSessionAction: string;
  }[];
}

export interface DailyScheduledTask {
  id: string;
  prescriptionId?: string;
  exerciseName: string;
  slotName: string;
  scheduledTime: string;
  period: 'morning' | 'afternoon' | 'evening';
  repetitions: string;
  status: 'pending' | 'due_now' | 'completed' | 'missed';
  completedAt?: string;
  verified: boolean;
  verificationMethod?: 'runner_completed' | 'voice_verified' | 'manual_confirm';
  reportedDifficulty?: 'easy' | 'okay' | 'difficult';
  discomfortReported?: boolean;
  patientNotes?: string;
}

export interface TaskNotification {
  id: string;
  taskId: string;
  exerciseName: string;
  slotName: string;
  scheduledTime: string;
  title: string;
  body: string;
  type: 'due_now' | 'upcoming' | 'missed' | 'adherence_milestone';
  createdAt: string;
  timestamp: number;
  snoozedUntil?: number;
  dismissed: boolean;
  dosage: string;
}

export interface NotificationSettings {
  pushEnabled: boolean;
  soundEnabled: boolean;
  voiceReadout: boolean;
  leadTimeMinutes: number;
}

export interface StreakMilestone {
  id: string;
  title: string;
  description: string;
  requiredDays: number;
  unlocked: boolean;
  badgeName: string;
  rewardBenefit: string;
}

export interface DailyStreakData {
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate: string | null; // e.g. '2026-09-24'
  todayCompleted: boolean;
  history: {
    date: string; // 'YYYY-MM-DD'
    dayOfWeek: string; // 'Mon', 'Tue', etc.
    completed: boolean;
    taskCount: number;
  }[];
  totalDaysLogged: number;
  streakFreezeAvailable: boolean;
}

