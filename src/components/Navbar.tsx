import React from 'react';
import { BookOpen, Activity, Beaker, Award, BookMarked, RotateCcw } from 'lucide-react';

export type ActiveTab = 'simulation' | 'lessons' | 'labs' | 'quiz' | 'glossary';

interface NavbarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onResetSimulation: () => void;
  completedLessonsCount: number;
  totalLessonsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  onResetSimulation,
  completedLessonsCount,
  totalLessonsCount,
}) => {
  return (
    <>
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 md:h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#simulation"
            onClick={(e) => {
              e.preventDefault();
              onTabChange('simulation');
            }}
            className="text-base sm:text-lg font-bold tracking-tight text-amber-400 hover:text-amber-300 transition-colors whitespace-nowrap flex items-center gap-1.5"
          >
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse md:hidden" />
            Моторын Тосолгоо
          </a>

          {/* Zone 2: Desktop 4-6 clean text navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
            <button
              onClick={() => onTabChange('simulation')}
              className={`transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'simulation'
                  ? 'text-amber-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-100'
              }`}
            >
              <Activity className="w-4 h-4" />
              Интерактив симуляци
            </button>

            <button
              onClick={() => onTabChange('lessons')}
              className={`transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'lessons'
                  ? 'text-amber-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-100'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Онолын хичээл
              {completedLessonsCount > 0 && (
                <span className="text-xs text-amber-500 font-mono">
                  ({completedLessonsCount}/{totalLessonsCount})
                </span>
              )}
            </button>

            <button
              onClick={() => onTabChange('labs')}
              className={`transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'labs'
                  ? 'text-amber-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-100'
              }`}
            >
              <Beaker className="w-4 h-4" />
              Лаборатори туршилт
            </button>

            <button
              onClick={() => onTabChange('quiz')}
              className={`transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'quiz'
                  ? 'text-amber-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-100'
              }`}
            >
              <Award className="w-4 h-4" />
              Мэдлэгийн сорил
            </button>

            <button
              onClick={() => onTabChange('glossary')}
              className={`transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'glossary'
                  ? 'text-amber-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-100'
              }`}
            >
              <BookMarked className="w-4 h-4" />
              Нэр томьёо
            </button>
          </nav>

          {/* Zone 3: Actions (Desktop & Mobile quick actions) */}
          <div className="flex items-center gap-2">
            {activeTab === 'simulation' && (
              <button
                onClick={onResetSimulation}
                title="Симуляцийн анхны утгыг сэргээх"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors whitespace-nowrap min-h-[36px]"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Сэргээх</span>
              </button>
            )}

            <button
              onClick={() => onTabChange(activeTab === 'quiz' ? 'simulation' : 'quiz')}
              className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 active:bg-amber-500 rounded-lg transition-colors whitespace-nowrap shadow-sm shadow-amber-500/20 min-h-[36px]"
            >
              {activeTab === 'quiz' ? 'Симуляци' : 'Сорил өгөх'}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Fixed Bottom Navigation Bar (Thumb Zone) */}
      <nav
        aria-label="Mobile navigation"
        className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/90 shadow-2xl safe-area-pb"
      >
        <div className="grid grid-cols-5 h-16 max-w-lg mx-auto px-1 items-center">
          {/* Tab 1: Simulation */}
          <button
            onClick={() => onTabChange('simulation')}
            className={`flex flex-col items-center justify-center h-full min-h-[48px] py-1 transition-colors ${
              activeTab === 'simulation'
                ? 'text-amber-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] tracking-tight">Симуляци</span>
            {activeTab === 'simulation' && (
              <span className="w-1 h-1 rounded-full bg-amber-400 mt-0.5" />
            )}
          </button>

          {/* Tab 2: Lessons */}
          <button
            onClick={() => onTabChange('lessons')}
            className={`flex flex-col items-center justify-center h-full min-h-[48px] py-1 transition-colors relative ${
              activeTab === 'lessons'
                ? 'text-amber-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="relative">
              <BookOpen className="w-5 h-5 mb-0.5" />
              {completedLessonsCount > 0 && (
                <span className="absolute -top-1 -right-2 text-[9px] font-mono bg-amber-500 text-slate-950 font-bold px-1 rounded-full leading-none py-0.5">
                  {completedLessonsCount}
                </span>
              )}
            </div>
            <span className="text-[10px] tracking-tight">Онол</span>
            {activeTab === 'lessons' && (
              <span className="w-1 h-1 rounded-full bg-amber-400 mt-0.5" />
            )}
          </button>

          {/* Tab 3: Labs */}
          <button
            onClick={() => onTabChange('labs')}
            className={`flex flex-col items-center justify-center h-full min-h-[48px] py-1 transition-colors ${
              activeTab === 'labs'
                ? 'text-amber-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Beaker className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] tracking-tight">Лаб</span>
            {activeTab === 'labs' && (
              <span className="w-1 h-1 rounded-full bg-amber-400 mt-0.5" />
            )}
          </button>

          {/* Tab 4: Quiz */}
          <button
            onClick={() => onTabChange('quiz')}
            className={`flex flex-col items-center justify-center h-full min-h-[48px] py-1 transition-colors ${
              activeTab === 'quiz'
                ? 'text-amber-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Award className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] tracking-tight">Сорил</span>
            {activeTab === 'quiz' && (
              <span className="w-1 h-1 rounded-full bg-amber-400 mt-0.5" />
            )}
          </button>

          {/* Tab 5: Glossary */}
          <button
            onClick={() => onTabChange('glossary')}
            className={`flex flex-col items-center justify-center h-full min-h-[48px] py-1 transition-colors ${
              activeTab === 'glossary'
                ? 'text-amber-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookMarked className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] tracking-tight">Толь</span>
            {activeTab === 'glossary' && (
              <span className="w-1 h-1 rounded-full bg-amber-400 mt-0.5" />
            )}
          </button>
        </div>
      </nav>
    </>
  );
};
