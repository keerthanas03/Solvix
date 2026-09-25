import { Patient, ExerciseItem, RehabilitationPlan, PatientFeedback, AiFlag, AuditLog } from '../types';

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'pat-kumar-1',
    name: 'Kumar R',
    age: 45,
    gender: 'Male',
    preferredLanguage: 'ta',
    digitalLiteracy: 'Low',
    connectivity: 'Intermittent',
    preferredInstructionMode: 'voice',
    preferredTimes: ['06:30 AM', '08:00 PM'],
    equipment: 'No equipment (sturdy chair only)',
    dailyRoutine: 'Works in local shop from 8:00 AM to 6:00 PM. Best available slots: early morning (6:30 AM) and evening after 7:30 PM.',
    rehabilitationGoal: 'Post-knee arthroscopy rehabilitation & quadriceps strengthening',
    adherenceRate: 82,
    assignedTherapist: 'Dr. Priya Raman',
    simpleModeEnabled: true,
    avatarSeed: 'kumar',
  },
  {
    id: 'pat-anitha-2',
    name: 'Anitha S',
    age: 38,
    gender: 'Female',
    preferredLanguage: 'ta',
    digitalLiteracy: 'Medium',
    connectivity: 'Reliable',
    preferredInstructionMode: 'visual_steps',
    preferredTimes: ['07:00 AM', '05:30 PM'],
    equipment: 'Resistance band, wall support',
    dailyRoutine: 'School teacher; available early morning and late afternoon.',
    rehabilitationGoal: 'Rotator cuff tendinopathy recovery & shoulder stabilization',
    adherenceRate: 91,
    assignedTherapist: 'Dr. Priya Raman',
    simpleModeEnabled: false,
    avatarSeed: 'anitha',
  },
  {
    id: 'pat-ravi-3',
    name: 'Ravi K',
    age: 52,
    gender: 'Male',
    preferredLanguage: 'en',
    digitalLiteracy: 'Medium',
    connectivity: 'Reliable',
    preferredInstructionMode: 'simple_text',
    preferredTimes: ['08:00 AM', '07:00 PM'],
    equipment: 'Towel, chair',
    dailyRoutine: 'Accountant, sedentary work hours; exercises before work and after dinner.',
    rehabilitationGoal: 'Grade II Ankle ligament sprain functional restoration',
    adherenceRate: 74,
    assignedTherapist: 'Dr. Priya Raman',
    simpleModeEnabled: false,
    avatarSeed: 'ravi',
  },
  {
    id: 'pat-meena-4',
    name: 'Meena P',
    age: 61,
    gender: 'Female',
    preferredLanguage: 'ta',
    digitalLiteracy: 'Low',
    connectivity: 'Intermittent',
    preferredInstructionMode: 'voice',
    preferredTimes: ['07:30 AM', '04:00 PM'],
    equipment: 'Sturdy chair, wall rail',
    dailyRoutine: 'Homemaker; prefers voice guidance with family assistance nearby.',
    rehabilitationGoal: 'Post-operative hip mobility & balance restoration',
    adherenceRate: 78,
    assignedTherapist: 'Dr. Priya Raman',
    simpleModeEnabled: true,
    avatarSeed: 'meena',
  },
  {
    id: 'pat-arjun-5',
    name: 'Arjun V',
    age: 29,
    gender: 'Male',
    preferredLanguage: 'hi',
    digitalLiteracy: 'Medium',
    connectivity: 'Reliable',
    preferredInstructionMode: 'visual_steps',
    preferredTimes: ['06:00 AM', '08:30 PM'],
    equipment: 'Dumbbell (1kg), table',
    dailyRoutine: 'Warehouse supervisor; high physical activity during day.',
    rehabilitationGoal: 'Upper-limb post-fracture mobility & wrist strengthening',
    adherenceRate: 88,
    assignedTherapist: 'Dr. Priya Raman',
    simpleModeEnabled: false,
    avatarSeed: 'arjun',
  },
  {
    id: 'pat-lakshmi-6',
    name: 'Lakshmi M',
    age: 67,
    gender: 'Female',
    preferredLanguage: 'ta',
    digitalLiteracy: 'Low',
    connectivity: 'Intermittent',
    preferredInstructionMode: 'voice',
    preferredTimes: ['08:00 AM', '06:00 PM'],
    equipment: 'Bed / chair',
    dailyRoutine: 'Retired; prefers simple voice steps and seated exercises only.',
    rehabilitationGoal: 'Bilateral Knee Osteoarthritis gentle mobility & pain management',
    adherenceRate: 69,
    assignedTherapist: 'Dr. Priya Raman',
    simpleModeEnabled: true,
    avatarSeed: 'lakshmi',
  },
];

export const EXERCISE_LIBRARY: ExerciseItem[] = [
  {
    id: 'ex-knee-ext',
    name: 'Knee Extension',
    category: 'Lower Limb / Knee',
    simpleDescription: 'Sit on a chair and gently straighten your leg forward.',
    professionalDescription: 'Seated active quadriceps extension with terminal knee extension hold to improve vastus medialis obliquus recruitment.',
    defaultReps: '10 repetitions',
    defaultSets: '3 sets',
    defaultFrequency: 'Twice daily',
    equipment: 'Sturdy chair',
    stepsEn: [
      'Sit comfortably on a sturdy chair with your back supported.',
      'Slowly straighten your leg forward until it is level.',
      'Hold the position gently for 3 seconds.',
      'Slowly lower your foot back to the floor.',
      'Repeat 10 times at a calm pace.'
    ],
    stepsTa: [
      'நாற்காலியில் முதுகு சாய்ந்து வசதியாக அமரவும்.',
      'உங்கள் காலை மெதுவாக முன்னோக்கி நேராக்கவும்.',
      'சிரமமின்றி 3 வினாடிகள் அப்படியே வைக்கவும்.',
      'உங்கள் பாதத்தை மெதுவாக தரைக்கு இறக்கவும்.',
      'இதை நிதானமாக 10 முறை செய்யவும்.'
    ],
    stepsHi: [
      'कुर्सी पर अपनी पीठ को सहारा देकर आराम से बैठें।',
      'अपने पैर को धीरे-धीरे आगे सीधा करें।',
      '3 सेकंड के लिए पैर को इसी स्थिति में रखें।',
      'पैर को धीरे-धीरे फर्श पर वापस लाएं।',
      'शांत गति से इसे 10 बार दोहराएं।'
    ],
    audioScriptEn: 'Sit on the chair. Slowly straighten your leg. Hold for 3 seconds. Gently relax. Repeat 10 times.',
    audioScriptTa: 'நாற்காலியில் அமருங்கள். உங்கள் காலை மெதுவாக நேராக்குங்கள். மூன்று வினாடிகள் பிடியுங்கள். மெதுவாக தளர்த்துங்கள்.',
    audioScriptHi: 'कुर्सी पर बैठें। पैर को धीरे से सीधा करें। तीन सेकंड रोकें और फिर आराम दें।',
  },
  {
    id: 'ex-knee-flex',
    name: 'Knee Flexion',
    category: 'Lower Limb / Knee',
    simpleDescription: 'Slide your heel back toward the chair to bend your knee gently.',
    professionalDescription: 'Active-assisted hamstring flexion in seated position within pain-free arc of motion.',
    defaultReps: '10 repetitions',
    defaultSets: '2 sets',
    defaultFrequency: 'Twice daily',
    equipment: 'Chair, smooth floor or towel',
    stepsEn: [
      'Sit on a chair with feet flat on the floor.',
      'Slowly slide your heel backwards under the chair.',
      'Bend only as far as comfortable without sharp pain.',
      'Hold for 3 seconds, then slide your foot forward.',
      'Repeat 10 times smoothly.'
    ],
    stepsTa: [
      'நாற்காலியில் பாதங்கள் தரையில் படிய அமரவும்.',
      'உங்கள் குதிக்காலை மெதுவாக நாற்காலிக்கு அடியில் பின்னோக்கி இழுக்கவும்.',
      'வலி இல்லாத அளவுக்கு மட்டுமே வளைக்கவும்.',
      '3 வினாடிகள் வைத்துவிட்டு மீண்டும் முன்னோக்கி நகர்த்தவும்.',
      'இதை 10 முறை நிதானமாக செய்யவும்.'
    ],
    stepsHi: [
      'कुर्सी पर बैठें और दोनों पैर फर्श पर रखें।',
      'अपनी एड़ी को धीरे-धीरे कुर्सी के नीचे पीछे की ओर खींचें।',
      'उतना ही मोड़ें जितना दर्द के बिना आरामदायक हो।',
      '3 सेकंड रोकें और फिर आगे लाएं।',
      'इसे 10 बार दोहराएं।'
    ],
    audioScriptEn: 'Sit comfortably. Slowly bend your knee by sliding your heel back. Stop if uncomfortable. Repeat 10 times.',
    audioScriptTa: 'நாற்காலியில் அமர்ந்து குதிக்காலை மெதுவாக பின்னுக்கு இழுக்கவும். வலி இல்லாமல் மெதுவாக செய்யவும்.',
    audioScriptHi: 'कुर्सी पर बैठें और पैर को धीरे से पीछे मोड़ें। दर्द न होने तक करें।',
  },
  {
    id: 'ex-ankle-pumps',
    name: 'Ankle Pumps',
    category: 'Circulation & Ankle',
    simpleDescription: 'Move your feet up and down like pressing a gas pedal.',
    professionalDescription: 'Active plantarflexion and dorsiflexion to enhance venous calf muscle pump circulation.',
    defaultReps: '15 repetitions',
    defaultSets: '3 sets',
    defaultFrequency: 'Three times daily',
    equipment: 'None',
    stepsEn: [
      'Sit or lie down with legs straight or bent comfortably.',
      'Point your toes downward away from you.',
      'Pull your toes back up toward your shins.',
      'Perform in a smooth, rhythmic pumping motion.',
      'Repeat 15 times.'
    ],
    stepsTa: [
      'கால்களை நீட்டி வசதியாக அமரவும் அல்லது படுக்கவும்.',
      'பாதத்தின் விரல்களை முன்னோக்கி கீழ்நோக்கி அழுத்தவும்.',
      'பிறகு விரல்களை மேல்நோக்கி உங்கள் பக்கம் இழுக்கவும்.',
      'இதை ரிதமிக் முறையில் 15 முறை செய்யவும்.'
    ],
    stepsHi: [
      'आराम से बैठें या लेटें।',
      'पैरों की उंगलियों को नीचे की ओर दबाएं।',
      'फिर उंगलियों को अपनी ओर ऊपर खींचें।',
      'इसे लयबद्ध तरीके से 15 बार दोहराएं।'
    ],
    audioScriptEn: 'Point your toes down, then pull them up. Continue pumping smoothly 15 times.',
    audioScriptTa: 'பாதத்தை கீழே அழுத்தவும், பின் மேலே இழுக்கவும். 15 முறை தொடரவும்.',
    audioScriptHi: 'पंजों को नीचे करें, फिर ऊपर उठाएं। 15 बार दोहराएं।',
  },
  {
    id: 'ex-shoulder-rot',
    name: 'Shoulder Rotation',
    category: 'Upper Limb / Shoulder',
    simpleDescription: 'Gently roll your shoulders in slow, relaxed circles.',
    professionalDescription: 'Active scapular retraction and elevation circles to reduce cervical-thoracic tension.',
    defaultReps: '8 repetitions',
    defaultSets: '2 sets',
    defaultFrequency: 'Twice daily',
    equipment: 'None',
    stepsEn: [
      'Sit tall with relaxed arms by your side.',
      'Slowly lift your shoulders upward toward your ears.',
      'Roll them backward and smoothly downward.',
      'Breathe normally throughout the motion.',
      'Repeat 8 gentle circles.'
    ],
    stepsTa: [
      'முதுகை நேராக வைத்து கைகளை தளர்த்தி அமரவும்.',
      'தோள்களை மெதுவாக காதுகளை நோக்கி மேலே தூக்கவும்.',
      'பின்னோக்கி சுழற்றி மெதுவாக கீழே இறக்கவும்.',
      'இயல்பாக சுவாசித்து 8 முறை சுழற்றவும்.'
    ],
    stepsHi: [
      'सीधे बैठें और बाहों को ढीला छोड़ें।',
      'कंधों को धीरे-धीरे कानों की ओर ऊपर उठाएं।',
      'उन्हें पीछे की ओर घुमाते हुए नीचे लाएं।',
      'सामान्य सांस लेते हुए 8 बार दोहराएं।'
    ],
    audioScriptEn: 'Gently roll your shoulders up, back, and down. Relax and repeat 8 times.',
    audioScriptTa: 'தோள்களை மேலே தூக்கி பின்னோக்கி மெதுவாக சுழற்றவும். 8 முறை செய்யவும்.',
    audioScriptHi: 'कंधों को ऊपर उठाएं और पीछे घुमाएं। 8 बार दोहराएं।',
  },
  {
    id: 'ex-seated-stretch',
    name: 'Seated Stretch',
    category: 'Mobility & Posture',
    simpleDescription: 'Gentle trunk and spine stretch while sitting safely.',
    professionalDescription: 'Axial elongation with gentle thoracic rotation to restore spinal segmental mobility.',
    defaultReps: '5 repetitions each side',
    defaultSets: '1 set',
    defaultFrequency: 'Once daily at midday',
    equipment: 'Sturdy chair',
    stepsEn: [
      'Sit upright in the middle of your chair.',
      'Rest your right hand on your left knee.',
      'Slowly turn your chest gently to the left.',
      'Hold for 5 seconds without straining.',
      'Return to center and switch sides.'
    ],
    stepsTa: [
      'நாற்காலியின் நடுவில் நேராக அமரவும்.',
      'உங்கள் வலது கையை இடது முழங்காலில் வைக்கவும்.',
      'மார்பை மெதுவாக இடதுபுறம் திருப்பவும்.',
      'சிரமமின்றி 5 வினாடிகள் பிடித்திருக்கவும்.',
      'மறுபுறமும் இதேபோல் செய்யவும்.'
    ],
    stepsHi: [
      'कुर्सी पर सीधे बैठें।',
      'अपना दायां हाथ बाएं घुटने पर रखें।',
      'अपनी छाती को धीरे-धीरे बाईं ओर मोड़ें।',
      '5 सेकंड के लिए रुकें।',
      'दूसरी तरफ भी दोहराएं।'
    ],
    audioScriptEn: 'Sit tall. Gently turn your body to the side. Hold for 5 seconds and breathe.',
    audioScriptTa: 'நேராக அமர்ந்து மெதுவாக பக்கவாட்டில் உடலை திருப்பவும். 5 வினாடிகள் வைக்கவும்.',
    audioScriptHi: 'सीधे बैठें और धीरे से एक तरफ मुड़ें। 5 सेकंड रोकें।',
  },
  {
    id: 'ex-breathing',
    name: 'Gentle Breathing Exercise',
    category: 'Relaxation & Recovery',
    simpleDescription: 'Deep, calm breathing to relax muscles and soothe pain.',
    professionalDescription: 'Diaphragmatic breathing with controlled exhalation to downregulate sympathetic tone.',
    defaultReps: '5 deep breaths',
    defaultSets: '1 set',
    defaultFrequency: 'Twice daily',
    equipment: 'None',
    stepsEn: [
      'Sit comfortably and place one hand on your stomach.',
      'Inhale slowly through your nose for 4 seconds.',
      'Feel your stomach gently rise under your hand.',
      'Exhale slowly through your mouth for 4 seconds.',
      'Repeat 5 calm, peaceful breaths.'
    ],
    stepsTa: [
      'வசதியாக அமர்ந்து ஒரு கையை வயிற்றில் வைக்கவும்.',
      'மூக்கு வழியாக 4 வினாடிகள் மெதுவாக மூச்சை உள்ளிழுக்கவும்.',
      'வாய் வழியாக 4 வினாடிகள் மெதுவாக மூச்சை வெளிவிடவும்.',
      'இதை அமைதியாக 5 முறை செய்யவும்.'
    ],
    stepsHi: [
      'आराम से बैठें और एक हाथ पेट पर रखें।',
      'नाक से 4 सेकंड तक धीरे-धीरे सांस अंदर लें।',
      'मुंह से 4 सेकंड तक धीरे-धीरे सांस छोड़ें।',
      'शांतिपूर्वक 5 बार दोहराएं।'
    ],
    audioScriptEn: 'Breathe in slowly through your nose. Breathe out gently through your mouth. Relax completely.',
    audioScriptTa: 'மெதுவாக மூச்சை உள்ளிழுத்து மெதுவாக வெளிவிடவும். உடலை தளர்த்தவும்.',
    audioScriptHi: 'नाक से सांस अंदर लें, मुंह से बाहर छोड़ें। पूरी तरह आराम करें।',
  },
];

export const INITIAL_REHAB_PLAN: RehabilitationPlan = {
  id: 'plan-kumar-active',
  patientId: 'pat-kumar-1',
  patientName: 'Kumar R',
  therapistId: 'tp-priya',
  therapistName: 'Dr. Priya Raman',
  title: 'Post-Knee Arthroscopy Quadriceps Recovery Plan',
  status: 'approved',
  version: 2,
  createdAt: '2026-09-22T09:00:00Z',
  approvedAt: '2026-09-22T09:15:00Z',
  clinicalNote: 'Patient demonstrated good form during in-clinic visit. Prioritize pain-free active terminal extension.',
  aiReasoningFactors: [
    "Patient prefers Tamil as primary language with voice instructions",
    "Scheduled at 06:30 AM and 08:00 PM to fit patient's shop work schedule (8 AM - 6 PM)",
    "Adapted for Low Digital Literacy with simplified step-by-step guidance",
    "Requires zero specialized gym equipment (home chair only)",
    "Fully pre-cached for offline access during intermittent village connectivity"
  ],
  patientPreferenceInvolved: "Patient requested morning exercise before 7:00 AM shop opening and voice-first prompts in Tamil.",
  previousPlanSummary: "Previous Plan v1: Exercises scheduled at 10:00 AM (conflicted with shop working hours).",
  exercises: [
    {
      id: 'pe-1',
      exerciseId: 'ex-knee-ext',
      exerciseName: 'Knee Extension',
      timeSlot: '06:30 AM',
      timeCategory: 'morning',
      professionalInstruction: 'Perform active knee extension: 3 sets × 10 repetitions within pain-free range. Hold terminal extension for 3 seconds.',
      patientInstructionEn: 'Sit comfortably. Slowly straighten your leg. Hold briefly for 3 seconds. Relax. Repeat 10 times.',
      patientInstructionTa: 'நாற்காலியில் வசதியாக அமருங்கள். உங்கள் காலை மெதுவாக நேராக நீட்டவும். 3 வினாடிகள் பிடித்து, பின் தளர்த்தவும். 10 முறை செய்யவும்.',
      patientInstructionHi: 'कुर्सी पर बैठें। पैर को धीरे-धीरे सीधा करें। 3 सेकंड रोकें, फिर आराम दें। 10 बार दोहराएं।',
      audioScriptEn: 'Sit on the chair. Slowly straighten your leg. Hold for 3 seconds. Gently relax. Repeat 10 times.',
      audioScriptTa: 'நாற்காலியில் அமருங்கள். உங்கள் காலை மெதுவாக நேராக்குங்கள். மூன்று வினாடிகள் பிடியுங்கள். மெதுவாக தளர்த்துங்கள். பத்து முறை செய்யவும்.',
      audioScriptHi: 'कुर्सी पर बैठें। पैर को धीरे से सीधा करें। तीन सेकंड रोकें और फिर आराम दें। 10 बार दोहराएं।',
      repetitions: '10 repetitions (3 sets)',
      frequency: 'Morning 6:30 AM',
      completedToday: true,
      completedAt: 'Today, 06:45 AM',
      difficultyReported: 'okay',
      discomfortReported: false,
    },
    {
      id: 'pe-2',
      exerciseId: 'ex-seated-stretch',
      exerciseName: 'Gentle Seated Stretch',
      timeSlot: '12:30 PM',
      timeCategory: 'afternoon',
      professionalInstruction: 'Gentle thoracic spine rotation and deep diaphragmatic breathing. 5 minutes midday.',
      patientInstructionEn: 'Sit tall in your chair. Gently turn your upper body left and right. Take 5 slow, deep breaths.',
      patientInstructionTa: 'நாற்காலியில் நேராக அமருங்கள். உடலின் மேற்பகுதியை மெதுவாக வலதும் இடதும் திருப்புங்கள். 5 முறை ஆழ்ந்து சுவாசியுங்கள்.',
      patientInstructionHi: 'कुर्सी पर सीधे बैठें। शरीर को धीरे से दाएं और बाएं घुमाएं। 5 गहरी सांसें लें।',
      audioScriptEn: 'Sit tall. Turn your upper body gently. Breathe deeply and relax.',
      audioScriptTa: 'நேராக அமருங்கள். உடலை மெதுவாக திருப்புங்கள். ஆழ்ந்து சுவாசித்து ஓய்வெடுங்கள்.',
      audioScriptHi: 'सीधे बैठें। धीरे से मुड़ें और गहरी सांस लें।',
      repetitions: '5 minutes',
      frequency: 'Midday 12:30 PM',
      completedToday: true,
      completedAt: 'Today, 12:40 PM',
      difficultyReported: 'easy',
      discomfortReported: false,
    },
    {
      id: 'pe-3',
      exerciseId: 'ex-knee-ext',
      exerciseName: 'Knee Extension (Evening)',
      timeSlot: '08:00 PM',
      timeCategory: 'evening',
      professionalInstruction: 'Evening knee extension session: 10 repetitions to reinforce daytime neuromuscular recruitment.',
      patientInstructionEn: 'Sit comfortably after your dinner. Straighten your leg slowly 10 times. Stop if you feel discomfort.',
      patientInstructionTa: 'இரவு உணவுக்குப் பின் நாற்காலியில் அமரவும். காலை மெதுவாக 10 முறை நேராக்கவும். வலி இருந்தால் உடனே நிறுத்தவும்.',
      patientInstructionHi: 'रात के खाने के बाद बैठें। पैर को धीरे-धीरे 10 बार सीधा करें। दर्द हो तो रोक दें।',
      audioScriptEn: 'Sit comfortably. Slowly straighten your leg 10 times. Stop if uncomfortable.',
      audioScriptTa: 'நாற்காலியில் அமர்ந்து காலை மெதுவாக 10 முறை நேராக்குங்கள். வலி ஏற்பட்டால் நிறுத்துங்கள்.',
      audioScriptHi: 'आराम से बैठें और पैर को 10 बार सीधा करें। असहज लगे तो रुकें।',
      repetitions: '10 repetitions',
      frequency: 'Evening 8:00 PM',
      completedToday: false,
    }
  ]
};

export const INITIAL_FEEDBACK: PatientFeedback[] = [
  {
    id: 'fb-101',
    patientId: 'pat-kumar-1',
    patientName: 'Kumar R',
    exerciseId: 'ex-knee-ext',
    exerciseName: 'Knee Extension',
    rawFeedback: 'Yesterday evening I found the knee exercise difficult and I could only complete half of it.',
    feedbackMethod: 'voice',
    difficulty: 'difficult',
    discomfortReported: true,
    discomfortDetails: 'Patient reported slight tightness in front of knee after repetition 5.',
    createdAt: '2026-09-24T19:42:00Z',
    syncStatus: 'synced',
    aiSummary: {
      feedbackSummary: 'Patient reported difficulty completing the prescribed 10 repetitions during evening session; stopped at repetition 5 due to reported tightness.',
      adherenceImpact: 'Partial completion (50%)',
      suggestedAction: 'Physiotherapist review recommended. Consider verifying seated chair height or reducing repetition count until next clinic visit.',
      requiresReview: true,
      safetyNotice: 'AI does not diagnose. This is an objective summary of patient-reported feedback.'
    },
    therapistReviewStatus: 'pending',
  },
  {
    id: 'fb-102',
    patientId: 'pat-lakshmi-6',
    patientName: 'Lakshmi M',
    exerciseId: 'ex-ankle-pumps',
    exerciseName: 'Ankle Pumps',
    rawFeedback: 'காலை உடற்பயிற்சி செய்யும்போது காலில் லேசான பிடிப்பு இருந்தது. (Felt a mild cramp in the leg during morning exercise.)',
    feedbackMethod: 'voice',
    difficulty: 'difficult',
    discomfortReported: true,
    discomfortDetails: 'Mild calf muscle cramp reported during repetition 8.',
    createdAt: '2026-09-24T08:15:00Z',
    syncStatus: 'synced',
    aiSummary: {
      feedbackSummary: 'Patient reported mild calf muscle cramp in Tamil voice note during morning ankle pumps.',
      adherenceImpact: 'Partial completion',
      suggestedAction: 'Physiotherapist review recommended. Advise hydration and gentle passive calf stretch.',
      requiresReview: true,
      safetyNotice: 'AI does not diagnose. This is an objective summary of patient-reported feedback.'
    },
    therapistReviewStatus: 'pending',
  }
];

export const INITIAL_AI_FLAGS: AiFlag[] = [
  {
    id: 'flag-1',
    patientId: 'pat-kumar-1',
    patientName: 'Kumar R',
    type: 'difficulty_reported',
    title: 'Patient Reported Exercise Difficulty',
    description: 'Kumar reported difficulty completing Knee Extension evening set; reported discomfort at rep 5.',
    aiInterpretation: 'Difficulty reported during evening quadriceps extension. Adherence decreased to partial.',
    recommendedAction: 'Physiotherapist review recommended. Clinical evaluation needed before adjusting sets.',
    status: 'requires_review',
    severity: 'priority',
    createdAt: '2026-09-24T19:43:00Z',
  },
  {
    id: 'flag-2',
    patientId: 'pat-lakshmi-6',
    patientName: 'Lakshmi M',
    type: 'missed_sessions',
    title: 'Multiple Sessions Incomplete',
    description: 'Lakshmi missed 2 evening sessions over the last 3 days; reported calf tightness.',
    aiInterpretation: 'Activity adherence decreased from 76% to 69%. Intermittent connectivity recorded.',
    recommendedAction: 'Care coordinator call or therapist follow-up recommended.',
    status: 'requires_review',
    severity: 'moderate',
    createdAt: '2026-09-24T10:00:00Z',
  },
  {
    id: 'flag-3',
    patientId: 'pat-ravi-3',
    patientName: 'Ravi K',
    type: 'schedule_adjustment',
    title: 'Patient Schedule Preference Change',
    description: 'Ravi noted: "Cannot exercise before 7:00 AM due to commute."',
    aiInterpretation: 'Patient preference conflict detected with standard 6:30 AM template.',
    recommendedAction: 'Therapist approval required to reschedule slot to 7:45 AM.',
    status: 'requires_review',
    severity: 'moderate',
    createdAt: '2026-09-23T18:00:00Z',
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'aud-1',
    timestamp: '10:32 AM',
    userName: 'Dr. Priya Raman',
    userRole: 'therapist',
    action: 'Created clinical recommendation: Knee Extension 3x10',
    entity: 'Rehabilitation Plan #104',
    classification: 'PROFESSIONAL_CLINICAL',
    status: 'Completed',
  },
  {
    id: 'aud-2',
    timestamp: '10:35 AM',
    userName: 'RehabMitra Co-Pilot',
    userRole: 'AI_SYSTEM',
    action: 'Generated patient-friendly explanation & Tamil draft schedule',
    entity: 'AI Co-Pilot Assistant',
    classification: 'AI_ASSISTED',
    status: 'Draft Ready',
  },
  {
    id: 'aud-3',
    timestamp: '10:36 AM',
    userName: 'Dr. Priya Raman',
    userRole: 'therapist',
    action: 'Reviewed and Approved AI draft plan for Kumar R',
    entity: 'Rehabilitation Plan #104',
    classification: 'PROFESSIONAL_CLINICAL',
    status: 'Approved & Signed',
  },
  {
    id: 'aud-4',
    timestamp: '06:45 AM',
    userName: 'Kumar R',
    userRole: 'patient',
    action: 'Completed morning Knee Extension (10 reps)',
    entity: 'Daily Activity Session',
    classification: 'PATIENT_ACTION',
    status: 'Logged',
  },
  {
    id: 'aud-5',
    timestamp: '07:42 PM',
    userName: 'Kumar R',
    userRole: 'patient',
    action: 'Submitted voice feedback: "Found knee exercise difficult"',
    entity: 'Patient Voice Feedback',
    classification: 'PATIENT_ACTION',
    status: 'Captured Offline & Synced',
  },
  {
    id: 'aud-6',
    timestamp: '07:43 PM',
    userName: 'RehabMitra Co-Pilot',
    userRole: 'AI_SYSTEM',
    action: 'Summarized patient feedback into clinical note; flagged for therapist review',
    entity: 'AI Feedback Analyzer',
    classification: 'AI_ASSISTED',
    status: 'Flagged for Review',
  },
];

export const SAMPLE_PRESCRIPTION_SLIPS = [
  {
    id: 'slip-kumar-post-op',
    title: 'Dr. Priya Raman: Hospital Discharge & Knee Protocol Slip',
    doctorName: 'Dr. Priya Raman, MPT (Ortho)',
    clinicOrHospital: 'Apex Physical Therapy & Mobility Clinic',
    patientName: 'Kumar R',
    diagnosis: 'Right Knee Post-Arthroscopy Meniscal Debridement',
    date: '2026-09-24',
    rawText: `APEX PHYSICAL THERAPY & MOBILITY CLINIC
Consultant: Dr. Priya Raman, MPT (Ortho), Reg: 74921
Patient: Kumar R | Age: 45 | Male | Date: 24-Sep-2026
Diagnosis: Right Knee Post-Arthroscopy Meniscal Debridement (Phase 2 Rehabilitation)

Rx (Rehabilitation Protocol):
1. Seated Active Knee Extension:
   - 3 sets × 10 repetitions with 3-second isometric hold at terminal extension
   - Frequency: Twice daily (Morning & Evening)
   - Precaution: Pain-free arc only (0° - 90°). Do not force through sharp pain.
2. Gentle Ankle Pumps:
   - 2 sets × 15 repetitions, twice daily for circulation.
3. Cold pack cryotherapy: 15 mins post-exercise if warmth is noted.

Special Instructions:
- Avoid prolonged squatting or cross-legged sitting.
- Patient works 8 AM - 6 PM at grocery store; schedule home exercises to prevent fatigue.
- Review in 2 weeks.

Signed: Dr. Priya Raman`,
  },
  {
    id: 'slip-anitha-rotator',
    title: 'Orthopedic Specialty Center: Shoulder Tendinopathy Slip',
    doctorName: 'Dr. Rajesh Nair, MS (Ortho), DNB',
    clinicOrHospital: 'City Center for Joint Restoration',
    patientName: 'Anitha S',
    diagnosis: 'Supraspinatus Tendinopathy (Subacromial Impingement)',
    date: '2026-09-23',
    rawText: `CITY CENTER FOR JOINT RESTORATION
Consultant: Dr. Rajesh Nair, MS Ortho
Patient: Anitha S | Female 38 | Date: 23-Sep-2026
Diagnosis: Right Subacromial Impingement & Rotator Cuff Tendinopathy

Rx / Physiotherapy Referral:
1. Isometric Shoulder External Rotation against doorframe: 3 sets x 10 reps (5s hold), twice daily.
2. Scapular Retraction & Setting: 2 sets x 12 reps, twice daily.
3. Pendulum exercise for gentle decompression.
Precautions: No overhead lifting above 90 degrees during acute phase.`,
  }
];

export const INITIAL_PRESCRIPTIONS: any[] = [
  {
    id: 'presc-kumar-1',
    patientId: 'pat-kumar-1',
    patientName: 'Kumar R',
    doctorName: 'Dr. Priya Raman, MPT (Ortho)',
    clinicOrHospital: 'Apex Physical Therapy & Mobility Clinic',
    prescribedDate: '2026-09-24',
    clinicalDiagnosis: 'Right Knee Post-Arthroscopy Meniscal Debridement',
    precautions: 'Pain-free arc only (0°-90°). Avoid rapid twisting or deep squats.',
    uploadedAt: 'Today, 06:15 AM',
    sourceType: 'sample_slip',
    sampleName: 'Dr. Priya Raman: Hospital Discharge & Knee Protocol Slip',
    extractedExercises: [
      {
        name: 'Seated Knee Extension',
        dosage: '3 sets × 10 repetitions',
        holdTime: '3 seconds terminal hold',
        frequency: 'Twice daily',
        equipment: 'Sturdy chair with back support',
        clinicalInstruction: 'Active terminal knee extension with 3-second isometric hold in 0-90 degree arc.',
        simpleInstructionEn: 'Sit upright on your sturdy chair. Gently straighten your right leg out in front. Count 1, 2, 3 calmly, then slowly lower it down.',
        simpleInstructionTa: 'நாற்காலியில் நேராக அமருங்கள். உங்கள் வலது காலை மெதுவாக நேராக நீட்டவும். 1, 2, 3 எண்ணிப் பிடித்து, பின் மெதுவாக கீழே இறக்குங்கள்.',
        simpleInstructionHi: 'कुर्सी पर सीधे बैठें। अपने दाहिने पैर को धीरे-धीरे आगे सीधा करें। 1, 2, 3 गिनें और धीरे से नीचे लाएं।'
      },
      {
        name: 'Gentle Ankle Pumps',
        dosage: '2 sets × 15 repetitions',
        holdTime: '2 seconds',
        frequency: 'Twice daily',
        equipment: 'None',
        clinicalInstruction: 'Active ankle dorsiflexion and plantarflexion for venous return and calf flexibility.',
        simpleInstructionEn: 'Point your toes up towards your nose, then point them down like pressing a pedal. Repeat smoothly.',
        simpleInstructionTa: 'உங்கள் கால் விரல்களை மேல்நோக்கி உயர்த்துங்கள், பின் கீழே அழுத்துங்கள். நிதானமாக செய்யுங்கள்.',
        simpleInstructionHi: 'अपने पंजों को ऊपर की ओर उठाएं, फिर नीचे दबाएं।'
      }
    ],
    suggestedSchedule: [
      {
        slotName: 'Morning Session',
        time: '06:45 AM',
        period: 'morning',
        rationale: 'Before your 8:00 AM grocery shift. Joints are warmed up early without causing daytime work fatigue.',
        exercises: ['Seated Knee Extension', 'Gentle Ankle Pumps']
      },
      {
        slotName: 'Evening Session',
        time: '07:30 PM',
        period: 'evening',
        rationale: 'Allows 90 mins of rest after finishing work at 6:00 PM. Maintains a safe 12-hour gap from the morning session.',
        exercises: ['Seated Knee Extension', 'Gentle Ankle Pumps']
      }
    ],
    aiExplanation: 'AI optimized schedule to protect your working hours at the grocery shop while ensuring proper joint recovery between sets.',
    status: 'schedule_active',
    adherenceCheckpoints: [
      {
        checkpoint: 'Morning 06:45 AM',
        verificationMethod: 'Interactive runner completion + 1-tap feeling check',
        missedSessionAction: 'If missed by 8:00 AM, send gentle lunchtime reminder or schedule catch-up before dinner'
      },
      {
        checkpoint: 'Evening 07:30 PM',
        verificationMethod: 'Voice feedback check + discomfort flag logging',
        missedSessionAction: 'If skipped, log as incomplete and notify physiotherapist dashboard'
      }
    ]
  }
];

export const INITIAL_DAILY_TASKS: any[] = [
  {
    id: 'task-morning-1',
    prescriptionId: 'presc-kumar-1',
    exerciseName: 'Seated Knee Extension',
    slotName: 'Morning Energizer Slot',
    scheduledTime: '06:45 AM',
    period: 'morning',
    repetitions: '3 sets × 10 reps',
    status: 'completed',
    completedAt: '06:50 AM',
    verified: true,
    verificationMethod: 'runner_completed',
    reportedDifficulty: 'okay',
    discomfortReported: false,
    patientNotes: 'Done sitting on wooden dining chair.',
  },
  {
    id: 'task-morning-2',
    prescriptionId: 'presc-kumar-1',
    exerciseName: 'Gentle Ankle Pumps',
    slotName: 'Morning Energizer Slot',
    scheduledTime: '06:45 AM',
    period: 'morning',
    repetitions: '2 sets × 15 reps',
    status: 'completed',
    completedAt: '06:55 AM',
    verified: true,
    verificationMethod: 'runner_completed',
    reportedDifficulty: 'easy',
    discomfortReported: false,
  },
  {
    id: 'task-evening-1',
    prescriptionId: 'presc-kumar-1',
    exerciseName: 'Seated Knee Extension',
    slotName: 'Evening Recovery Slot',
    scheduledTime: '07:30 PM',
    period: 'evening',
    repetitions: '3 sets × 10 reps',
    status: 'due_now',
    verified: false,
  },
  {
    id: 'task-evening-2',
    prescriptionId: 'presc-kumar-1',
    exerciseName: 'Gentle Ankle Pumps',
    slotName: 'Evening Recovery Slot',
    scheduledTime: '07:30 PM',
    period: 'evening',
    repetitions: '2 sets × 15 reps',
    status: 'pending',
    verified: false,
  },
];
