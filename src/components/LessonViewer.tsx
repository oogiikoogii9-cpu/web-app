import React, { useState } from 'react';
import { LESSONS_DATA } from '../data/lessonsData';
import { LessonChapter } from '../types';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  ArrowRight,
  ArrowLeft,
  Activity,
  Info,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react';

interface LessonViewerProps {
  completedChapterIds: string[];
  onToggleCompleteChapter: (chapterId: string) => void;
  onJumpToSimulationComponent: (componentId: string) => void;
  initialChapterId?: string;
}

export const LessonViewer: React.FC<LessonViewerProps> = ({
  completedChapterIds,
  onToggleCompleteChapter,
  onJumpToSimulationComponent,
  initialChapterId,
}) => {
  const [selectedChapterId, setSelectedChapterId] = useState<string>(
    initialChapterId || LESSONS_DATA[0].id
  );

  const currentChapter =
    LESSONS_DATA.find((c) => c.id === selectedChapterId) || LESSONS_DATA[0];

  const currentIdx = LESSONS_DATA.findIndex((c) => c.id === currentChapter.id);
  const isCompleted = completedChapterIds.includes(currentChapter.id);

  const handleNext = () => {
    if (currentIdx < LESSONS_DATA.length - 1) {
      setSelectedChapterId(LESSONS_DATA[currentIdx + 1].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setSelectedChapterId(LESSONS_DATA[currentIdx - 1].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col lg:grid lg:grid-cols-12 gap-6 py-2">
      {/* Mobile Top Chapter Picker (Horizontal Carousel) */}
      <div className="lg:hidden flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span className="font-semibold text-amber-400 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            Бүлэг сонгох:
          </span>
          <span className="font-mono text-[11px]">
            {completedChapterIds.length}/{LESSONS_DATA.length} дууссан
          </span>
        </div>
        <div className="flex overflow-x-auto gap-2 pb-1 scrollbar-none -mx-1 px-1">
          {LESSONS_DATA.map((ch) => {
            const active = ch.id === currentChapter.id;
            const done = completedChapterIds.includes(ch.id);

            return (
              <button
                key={ch.id}
                onClick={() => {
                  setSelectedChapterId(ch.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`px-3 py-2 text-xs rounded-xl font-medium whitespace-nowrap transition-all shrink-0 min-h-[44px] flex items-center gap-2 border ${
                  active
                    ? 'bg-amber-400 text-slate-950 font-bold border-amber-400 shadow-md'
                    : 'bg-slate-900 text-slate-300 border-slate-800'
                }`}
              >
                <span className={`font-mono font-bold text-[11px] ${active ? 'text-slate-950' : 'text-amber-400'}`}>
                  {ch.number}
                </span>
                <span>{ch.title.split(' ')[0]}</span>
                {done && (
                  <CheckCircle2 className={`w-3.5 h-3.5 ${active ? 'text-slate-950' : 'text-emerald-400'}`} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Desktop Left Sidebar: Chapters Index */}
      <div className="hidden lg:flex lg:col-span-4 flex-col gap-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl flex flex-col gap-4 sticky top-20">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Хичээлийн бүлгүүд
            </h2>
            <span className="text-xs font-mono text-slate-400">
              {completedChapterIds.length}/{LESSONS_DATA.length} дууссан
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {LESSONS_DATA.map((ch) => {
              const active = ch.id === currentChapter.id;
              const done = completedChapterIds.includes(ch.id);

              return (
                <button
                  key={ch.id}
                  onClick={() => setSelectedChapterId(ch.id)}
                  className={`text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 ${
                    active
                      ? 'bg-amber-400/10 border-amber-400/40 text-slate-100 shadow-sm'
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <span
                    className={`font-mono text-xs font-bold px-1.5 py-0.5 rounded ${
                      active
                        ? 'bg-amber-400 text-slate-950'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {ch.number}
                  </span>

                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-xs font-semibold leading-snug line-clamp-2 ${
                        active ? 'text-amber-300' : 'text-slate-300'
                      }`}
                    >
                      {ch.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {ch.estimatedMinutes} мин
                      </span>
                      {done && (
                        <span className="text-emerald-400 flex items-center gap-0.5 font-medium">
                          <CheckCircle2 className="w-3 h-3" /> Судалсан
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Content Area: Detailed Chapter Content */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 sm:p-8 shadow-xl flex flex-col gap-6">
          {/* Chapter Header */}
          <div className="border-b border-slate-800 pb-5">
            <div className="flex items-center justify-between text-xs text-amber-400 font-mono mb-2">
              <span>БҮЛЭГ {currentChapter.number}</span>
              <span className="flex items-center gap-1 text-slate-400">
                <Clock className="w-3.5 h-3.5" /> {currentChapter.estimatedMinutes} минут
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
              {currentChapter.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
              {currentChapter.subtitle}
            </p>

            {/* Summary Box */}
            <div className="mt-4 p-3.5 sm:p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 leading-relaxed">
              <span className="font-semibold text-amber-400 block mb-1">Хураангуй:</span>
              {currentChapter.summary}
            </div>
          </div>

          {/* Interactive Goal & Simulator Link Banner */}
          {currentChapter.interactiveGoal && (
            <div className="p-3.5 sm:p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <Activity className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                <div className="text-xs text-amber-200">
                  <span className="font-semibold block text-amber-300">Дадлагын даалгавар:</span>
                  {currentChapter.interactiveGoal}
                </div>
              </div>
              {currentChapter.recommendedComponentId && (
                <button
                  onClick={() =>
                    onJumpToSimulationComponent(currentChapter.recommendedComponentId!)
                  }
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-amber-400 text-slate-950 hover:bg-amber-300 transition-colors whitespace-nowrap min-h-[40px] flex items-center justify-center self-stretch sm:self-center shrink-0 shadow-sm"
                >
                  Симуляци дээр харах
                </button>
              )}
            </div>
          )}

          {/* Sections Flow */}
          <div className="space-y-6 sm:space-y-8">
            {currentChapter.sections.map((sec, sIdx) => (
              <div key={sIdx} className="space-y-3">
                <h2 className="text-sm sm:text-base font-bold text-slate-200 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                  {sec.title}
                </h2>

                <div className="space-y-2.5 text-xs sm:text-sm leading-relaxed text-slate-300">
                  {sec.paragraphs.map((p, pIdx) => (
                    <p key={pIdx}>{p}</p>
                  ))}
                </div>

                {/* Bullet Highlights if present */}
                {sec.highlights && sec.highlights.length > 0 && (
                  <div className="p-3.5 sm:p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 mt-3">
                    <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider block">
                      Гол санаа:
                    </span>
                    {sec.highlights.map((h, hIdx) => (
                      <div key={hIdx} className="flex items-start gap-2 text-xs text-slate-300 leading-relaxed">
                        <span className="text-amber-400 font-bold shrink-0">•</span>
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Callout box if present */}
                {sec.callout && (
                  <div
                    className={`p-3.5 sm:p-4 rounded-xl border text-xs leading-relaxed mt-3 flex items-start gap-2.5 ${
                      sec.callout.type === 'warning'
                        ? 'bg-rose-500/10 border-rose-500/30 text-rose-200'
                        : sec.callout.type === 'tip'
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                        : 'bg-sky-500/10 border-sky-500/30 text-sky-200'
                    }`}
                  >
                    {sec.callout.type === 'warning' ? (
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    ) : sec.callout.type === 'tip' ? (
                      <Lightbulb className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <span className="font-bold block mb-0.5">{sec.callout.title}</span>
                      <span>{sec.callout.text}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Chapter Footer: Mark Complete & Prev/Next */}
          <div className="border-t border-slate-800 pt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <button
              onClick={() => onToggleCompleteChapter(currentChapter.id)}
              className={`w-full sm:w-auto px-4 py-2.5 text-xs font-semibold rounded-xl border transition-all flex items-center justify-center gap-2 min-h-[44px] ${
                isCompleted
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                  : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
              }`}
            >
              <CheckCircle2 className={`w-4 h-4 ${isCompleted ? 'text-emerald-400' : 'text-slate-400'}`} />
              {isCompleted ? 'Энэ бүлгийг судалсан ✓' : 'Судалж дууссанаар тэмдэглэх'}
            </button>

            <div className="grid grid-cols-2 sm:flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handlePrev}
                disabled={currentIdx === 0}
                className="px-4 py-2.5 text-xs font-medium rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center gap-1.5 min-h-[44px]"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Өмнөх
              </button>

              <button
                onClick={handleNext}
                disabled={currentIdx === LESSONS_DATA.length - 1}
                className="px-4 py-2.5 text-xs font-semibold rounded-xl bg-amber-400 text-slate-950 hover:bg-amber-300 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center gap-1.5 min-h-[44px]"
              >
                Дараах <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
