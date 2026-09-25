import React, { useState } from 'react';
import { EXERCISE_LIBRARY } from '../../data/mockData';
import { ExerciseItem } from '../../types';
import { Search, BookOpen, Volume2, Info, ArrowRight, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ExerciseLibraryView: React.FC<{
  onSelectForPlan?: (ex: ExerciseItem) => void;
}> = ({ onSelectForPlan }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEx, setSelectedEx] = useState<ExerciseItem | null>(null);
  const { speakText, language } = useApp();

  const filtered = EXERCISE_LIBRARY.filter((ex) => {
    const q = searchQuery.toLowerCase();
    return (
      ex.name.toLowerCase().includes(q) ||
      ex.category.toLowerCase().includes(q) ||
      ex.simpleDescription.toLowerCase().includes(q) ||
      ex.professionalDescription.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-[#E8E4D8] p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider bg-[#F7F1E1] text-[#8E681C] px-2.5 py-0.5 rounded-full border border-[#E6C978]">
                Clinical Repository
              </span>
              <span className="text-xs text-[#77736A]">Demo Exercise Library</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#252525] font-serif">
              Rehabilitation Exercise Library
            </h1>
            <p className="text-sm text-[#5F5B52] mt-1">
              Evidence-based template exercises pre-configured with professional descriptions, low-literacy steps, and multilingual audio scripts.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-[#77736A] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search knee, shoulder, stretch..."
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#FAFAF7] rounded-xl border border-[#E8E4D8] focus:border-[#C99A3A] focus:outline-none"
            />
          </div>
        </div>

        {/* Clear Medical Boundary Badge */}
        <div className="mt-4 p-3 bg-[#FCF9F2] rounded-2xl border border-[#E6C978] text-xs text-[#8E681C] flex items-center gap-2">
          <Info className="w-4 h-4 text-[#B8892D] shrink-0" />
          <span>
            <strong>Demo Exercise Library:</strong> These exercises are demonstrative templates. Clinical suitability for individual patients must be evaluated and prescribed by a licensed physiotherapist.
          </span>
        </div>
      </div>

      {/* Grid of Exercises */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl border border-[#E8E4D8] p-6 shadow-xs flex flex-col justify-between hover:border-[#D8B15A] transition-all space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#8E681C] uppercase tracking-wider bg-[#FCF9F2] px-2.5 py-0.5 rounded-full border border-[#E6C978]">
                  {item.category}
                </span>
                <span className="text-[#77736A]">{item.equipment}</span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#252525]">{item.name}</h3>
                <p className="text-xs text-[#5F5B52] mt-1 line-clamp-2">
                  {item.simpleDescription}
                </p>
              </div>

              <div className="p-3 bg-[#FAFAF7] rounded-xl border border-[#E8E4D8] text-[11px] space-y-1 text-[#3F3D38]">
                <div className="font-bold text-[#77736A]">Clinical Target:</div>
                <p className="italic line-clamp-2">{item.professionalDescription}</p>
              </div>

              <div className="flex items-center gap-3 text-xs text-[#77736A]">
                <span>Default: <strong>{item.defaultReps}</strong></span>
                <span>•</span>
                <span>{item.defaultFrequency}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-[#E8E4D8]">
              <button
                onClick={() =>
                  speakText(
                    language === 'ta'
                      ? item.audioScriptTa
                      : language === 'hi'
                      ? item.audioScriptHi
                      : item.audioScriptEn,
                    language
                  )
                }
                className="p-2 rounded-xl bg-[#FCF9F2] hover:bg-[#F7F1E1] text-[#8E681C] border border-[#E6C978] transition-colors cursor-pointer"
                title="Listen to sample audio script"
              >
                <Volume2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => setSelectedEx(item)}
                className="flex-1 py-2 rounded-xl bg-white border border-[#E8E4D8] text-xs font-bold text-[#5F5B52] hover:bg-[#F7F4EC] transition-colors cursor-pointer"
              >
                View Steps
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedEx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-[#E8E4D8] p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-5 max-h-[88vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E8E4D8] pb-3">
              <div>
                <span className="text-xs font-bold uppercase text-[#8E681C]">{selectedEx.category}</span>
                <h2 className="text-xl font-bold text-[#252525]">{selectedEx.name}</h2>
              </div>
              <button
                onClick={() => setSelectedEx(null)}
                className="text-xs font-bold px-3 py-1.5 rounded-lg border border-[#E8E4D8] text-[#77736A]"
              >
                Close
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-[#FAFAF7] rounded-xl border border-[#E8E4D8]">
                <div className="font-bold text-[#77736A]">Professional Prescription</div>
                <p className="mt-1 text-[#252525]">{selectedEx.professionalDescription}</p>
              </div>

              <div>
                <div className="font-bold text-[#252525] mb-1.5">Simplified English Steps:</div>
                <ol className="list-decimal pl-5 space-y-1 text-[#3F3D38]">
                  {selectedEx.stepsEn.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </div>

              <div>
                <div className="font-bold text-[#8E681C] mb-1.5">தமிழ் எளிய வழிகாட்டுதல் (Tamil):</div>
                <ol className="list-decimal pl-5 space-y-1 text-[#3F3D38]">
                  {selectedEx.stepsTa.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
