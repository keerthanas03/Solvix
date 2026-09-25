import React, { useState } from 'react';
import {
  REAL_CLINICAL_EXERCISE_DATASET,
  ClinicalExerciseData,
} from '../../data/clinicalRehabilitationDataset';
import { ExerciseVisualCue } from '../patient/ExerciseVisualCue';
import { Search, Volume2, Info, Eye, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface ExerciseLibraryViewProps {
  onSelectForPlan?: (ex: any) => void;
}

export const ExerciseLibraryView: React.FC<ExerciseLibraryViewProps> = ({ onSelectForPlan }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBodyPart, setSelectedBodyPart] = useState<string>('all');
  const [selectedEx, setSelectedEx] = useState<ClinicalExerciseData | null>(null);
  const { speakText, language } = useApp();

  const bodyParts = [
    { id: 'all', label: 'All Regions' },
    { id: 'neck', label: 'Neck / Cervical' },
    { id: 'shoulder', label: 'Shoulder' },
    { id: 'back', label: 'Back & Core' },
    { id: 'hip', label: 'Hip & Pelvis' },
    { id: 'knee', label: 'Knee & Thigh' },
    { id: 'ankle', label: 'Ankle & Foot' },
    { id: 'wrist', label: 'Wrist & Hand' },
    { id: 'posture', label: 'Posture & Thoracic' },
  ];

  const filtered = REAL_CLINICAL_EXERCISE_DATASET.filter((ex) => {
    const matchesCategory = selectedBodyPart === 'all' || ex.bodyPart === selectedBodyPart;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      ex.name.toLowerCase().includes(q) ||
      ex.bodyPartLabel.toLowerCase().includes(q) ||
      ex.clinicalDiagnosis.toLowerCase().includes(q) ||
      ex.icd10Code.toLowerCase().includes(q) ||
      ex.targetMuscles.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-[#E8E4D8] p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider bg-[#F7F1E1] text-[#8E681C] px-2.5 py-0.5 rounded-full border border-[#E6C978]">
                Real Clinical Repository
              </span>
              <span className="text-xs text-[#77736A]">All Anatomical Regions ({REAL_CLINICAL_EXERCISE_DATASET.length} Verified Protocols)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#252525] font-serif">
              Rehabilitation Exercise & Biomechanics Library
            </h1>
            <p className="text-sm text-[#5F5B52] mt-1 max-w-2xl">
              Authentic orthopedic physical therapy protocols with ICD-10 classifications, safe angle ranges of motion, 4-phase cadences, and dynamic vector visual cues.
            </p>
          </div>

          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[#77736A] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search neck, shoulder, knee, ICD-10..."
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#FAFAF7] rounded-xl border border-[#E8E4D8] focus:border-[#C99A3A] focus:outline-none"
            />
          </div>
        </div>

        {/* Body Part Filter Buttons */}
        <div className="mt-4 pt-4 border-t border-[#E8E4D8] flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {bodyParts.map((bp) => {
            const isSelected = selectedBodyPart === bp.id;
            return (
              <button
                key={bp.id}
                type="button"
                onClick={() => setSelectedBodyPart(bp.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-[#8E681C] text-white shadow-xs'
                    : 'bg-[#FAFAF7] hover:bg-[#FCF9F2] text-[#5F5B52] border border-[#E8E4D8]'
                }`}
              >
                {bp.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Exercises */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl border border-[#E8E4D8] p-5 shadow-xs flex flex-col justify-between hover:border-[#D8B15A] transition-all space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#8E681C] uppercase tracking-wider bg-[#FCF9F2] px-2.5 py-0.5 rounded-full border border-[#E6C978]">
                  {item.bodyPartLabel}
                </span>
                <span className="font-mono text-[11px] text-[#77736A] font-semibold">
                  {item.icd10Code}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-[#252525]">{item.name}</h3>
                <p className="text-xs text-[#5F5B52] mt-0.5 line-clamp-2">
                  {item.clinicalDiagnosis}
                </p>
              </div>

              {/* Compact Visual Cue Preview */}
              <div className="bg-[#FAFAF7] rounded-2xl p-2 border border-[#E8E4D8]">
                <ExerciseVisualCue
                  exerciseName={item.name}
                  bodyPart={item.visualCueType}
                  isPerforming={true}
                  size="sm"
                />
              </div>

              <div className="p-3 bg-[#FAFAF7] rounded-xl border border-[#E8E4D8] text-[11px] space-y-1 text-[#3F3D38]">
                <div className="font-bold text-[#77736A]">Muscles: {item.targetMuscles}</div>
                <div className="text-[#8E681C] font-semibold">Safe Arc: {item.safeRangeOfMotion}</div>
              </div>

              <div className="flex items-center justify-between text-xs text-[#77736A]">
                <span>Dosage: <strong>{item.dosage}</strong></span>
                <span>•</span>
                <span className="font-mono text-[10px]">{item.cadence}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-[#E8E4D8]">
              <button
                type="button"
                onClick={() =>
                  speakText(
                    language === 'ta'
                      ? item.audioTa
                      : language === 'hi'
                      ? item.audioHi
                      : item.audioEn,
                    language
                  )
                }
                className="p-2.5 rounded-xl bg-[#FCF9F2] hover:bg-[#F7F1E1] text-[#8E681C] border border-[#E6C978] transition-colors cursor-pointer"
                title="Listen to audio cue"
              >
                <Volume2 className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setSelectedEx(item)}
                className="flex-1 py-2.5 rounded-xl bg-white border border-[#E8E4D8] text-xs font-bold text-[#5F5B52] hover:bg-[#F7F4EC] transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5 text-[#B8892D]" />
                <span>Full Protocol & Steps</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Protocol Inspection Modal */}
      {selectedEx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl border border-[#E8E4D8] p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-[#E8E4D8] pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase text-[#8E681C]">
                    {selectedEx.bodyPartLabel}
                  </span>
                  <span className="text-xs font-mono text-[#77736A]">
                    {selectedEx.icd10Code}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-[#252525] mt-0.5">{selectedEx.name}</h2>
                <p className="text-xs text-[#5F5B52]">{selectedEx.clinicalDiagnosis}</p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedEx(null)}
                className="text-xs font-bold px-3 py-1.5 rounded-lg border border-[#E8E4D8] text-[#77736A] hover:bg-black/5 cursor-pointer"
              >
                Close
              </button>
            </div>

            {/* Visual Vector Demo */}
            <div>
              <div className="text-xs font-bold uppercase text-[#77736A] mb-1">
                Biomechanical Vector Animation
              </div>
              <ExerciseVisualCue
                exerciseName={selectedEx.name}
                bodyPart={selectedEx.visualCueType}
                isPerforming={true}
                size="md"
              />
            </div>

            {/* Clinical Evidence Citation */}
            <div className="p-3 bg-[#FAFAF7] rounded-xl border border-[#E8E4D8] text-xs flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#15803D] shrink-0" />
              <div>
                <span className="font-bold text-[#252525]">Evidence Standard: </span>
                <span className="text-[#5F5B52]">{selectedEx.evidenceSource}</span>
              </div>
            </div>

            {/* Steps & Safety */}
            <div className="space-y-3 text-xs">
              <div>
                <div className="font-bold text-[#252525] mb-1">Step-by-Step Execution:</div>
                <div className="space-y-1">
                  {selectedEx.stepsEn.map((step, i) => (
                    <div key={i} className="p-2 bg-[#FAFAF7] rounded-lg border border-[#E8E4D8]">
                      {step}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-[#F0FDF4] rounded-xl border border-[#BBF7D0]">
                  <div className="font-bold text-[#15803D] mb-1">Clinical Do's:</div>
                  <ul className="space-y-1 text-[#166534]">
                    {selectedEx.dos.map((d, i) => (
                      <li key={i}>✓ {d}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 bg-[#FEF2F2] rounded-xl border border-[#FECACA]">
                  <div className="font-bold text-[#DC2626] mb-1">Safety Don'ts:</div>
                  <ul className="space-y-1 text-[#991B1B]">
                    {selectedEx.donts.map((d, i) => (
                      <li key={i}>✕ {d}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
