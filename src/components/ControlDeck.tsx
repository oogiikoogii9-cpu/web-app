import React from 'react';
import { EngineSimulationState, OilGrade } from '../types';
import { Sliders, ShieldAlert, CheckCircle, Snowflake, Flame, AlertOctagon } from 'lucide-react';

interface ControlDeckProps {
  state: EngineSimulationState;
  onChangeRpm: (rpm: number) => void;
  onChangeTemperature: (temp: number) => void;
  onChangeOilGrade: (grade: OilGrade) => void;
  onChangeFilterClogged: (clogged: boolean) => void;
  onChangeOilLevel: (level: number) => void;
  onApplyPreset: (scenario: 'cold' | 'normal' | 'overheat' | 'clogged' | 'low_oil') => void;
}

export const ControlDeck: React.FC<ControlDeckProps> = ({
  state,
  onChangeRpm,
  onChangeTemperature,
  onChangeOilGrade,
  onChangeFilterClogged,
  onChangeOilLevel,
  onApplyPreset,
}) => {
  const oilGrades: OilGrade[] = ['0W-20', '5W-30', '10W-40', '20W-50'];

  return (
    <div className="w-full rounded-2xl border border-slate-800 bg-slate-900/80 p-4 sm:p-5 shadow-xl flex flex-col gap-5">
      {/* Header and Quick Scenarios Carousel */}
      <div className="flex flex-col gap-3 border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-sm sm:text-base font-semibold text-slate-100 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-amber-400" />
            Интерактив удирдлагын самбар
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Параметрүүдийг өөрчилж тосолгооны системийн физик хариу үйлдлийг бодитоор туршаарай.
          </p>
        </div>

        {/* Quick Learning Scenarios - Horizontally Scrollable on Mobile */}
        <div className="flex overflow-x-auto gap-2 items-center py-1 scrollbar-none -mx-1 px-1">
          <span className="text-xs text-slate-400 whitespace-nowrap hidden sm:inline mr-1">
            Бэлэн горимууд:
          </span>
          <button
            onClick={() => onApplyPreset('cold')}
            className="px-3 py-2 text-xs font-medium rounded-xl bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 border border-sky-500/20 transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 min-h-[40px] active:scale-95"
          >
            <Snowflake className="w-3.5 h-3.5" />
            Хүйтэн асаалт (-20°C)
          </button>
          <button
            onClick={() => onApplyPreset('normal')}
            className="px-3 py-2 text-xs font-medium rounded-xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 min-h-[40px] active:scale-95"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            Хэвийн горим (90°C)
          </button>
          <button
            onClick={() => onApplyPreset('overheat')}
            className="px-3 py-2 text-xs font-medium rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 min-h-[40px] active:scale-95"
          >
            <Flame className="w-3.5 h-3.5" />
            Хэт халалт (120°C)
          </button>
          <button
            onClick={() => onApplyPreset('clogged')}
            className="px-3 py-2 text-xs font-medium rounded-xl bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/20 transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 min-h-[40px] active:scale-95"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            Шүүр бөглөрсөн
          </button>
          <button
            onClick={() => onApplyPreset('low_oil')}
            className="px-3 py-2 text-xs font-medium rounded-xl bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 border border-purple-500/20 transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 min-h-[40px] active:scale-95"
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            Тос дундарсан
          </button>
        </div>
      </div>

      {/* Grid of Sliders and Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* 1. RPM Slider */}
        <div className="flex flex-col gap-2 p-3 sm:p-0 rounded-xl bg-slate-950/40 sm:bg-transparent border border-slate-800/60 sm:border-0">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-slate-300">Хөдөлгүүрийн эргэлт (RPM):</span>
            <span className="font-mono font-semibold text-amber-400 tabular-nums text-sm">
              {state.rpm} эрг/м
            </span>
          </div>
          <div className="py-2">
            <input
              type="range"
              min="0"
              max="6500"
              step="100"
              value={state.rpm}
              onChange={(e) => onChangeRpm(Number(e.target.value))}
              className="w-full h-2.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-400 font-mono">
            <span>0</span>
            <span>800 (Сул)</span>
            <span>3000</span>
            <span>6500</span>
          </div>
        </div>

        {/* 2. Temperature Slider */}
        <div className="flex flex-col gap-2 p-3 sm:p-0 rounded-xl bg-slate-950/40 sm:bg-transparent border border-slate-800/60 sm:border-0">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-slate-300">Тосны температур:</span>
            <span
              className={`font-mono font-semibold tabular-nums text-sm ${
                state.temperature > 105
                  ? 'text-rose-400'
                  : state.temperature < 20
                  ? 'text-sky-400'
                  : 'text-amber-400'
              }`}
            >
              {state.temperature > 0 ? `+${state.temperature}` : state.temperature}°C
            </span>
          </div>
          <div className="py-2">
            <input
              type="range"
              min="-20"
              max="125"
              step="1"
              value={state.temperature}
              onChange={(e) => onChangeTemperature(Number(e.target.value))}
              className="w-full h-2.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-400 font-mono">
            <span>-20°C (Өвөл)</span>
            <span>90°C (Хэвийн)</span>
            <span>125°C</span>
          </div>
        </div>

        {/* 3. Oil Viscosity Grade */}
        <div className="flex flex-col gap-2 p-3 sm:p-0 rounded-xl bg-slate-950/40 sm:bg-transparent border border-slate-800/60 sm:border-0">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-slate-300">Зуурамтгай чанар (SAE):</span>
            <span className="font-mono text-amber-400 font-semibold">{state.oilGrade}</span>
          </div>
          <div className="grid grid-cols-4 gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800">
            {oilGrades.map((grade) => (
              <button
                key={grade}
                onClick={() => onChangeOilGrade(grade)}
                className={`py-2 text-xs font-mono font-medium rounded-lg transition-all min-h-[44px] flex items-center justify-center ${
                  state.oilGrade === grade
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {grade}
              </button>
            ))}
          </div>
          <span className="text-[11px] text-slate-400 truncate">
            {state.oilGrade === '0W-20' && 'Шингэн · Эко шинэ хөдөлгүүр'}
            {state.oilGrade === '5W-30' && 'Тэнцвэртэй · 4 улирлын нийтлэг'}
            {state.oilGrade === '10W-40' && 'Хагас өтгөн · Их гүйлттэй'}
            {state.oilGrade === '20W-50' && 'Өтгөн · Хүнд даац ба элэгдэл'}
          </span>
        </div>

        {/* 4. Oil Level & Filter Condition */}
        <div className="flex flex-col gap-2 p-3 sm:p-0 rounded-xl bg-slate-950/40 sm:bg-transparent border border-slate-800/60 sm:border-0">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-slate-300">Тосны түвшин:</span>
            <span className="font-mono font-semibold text-amber-400 tabular-nums text-sm">
              {state.oilLevel}%
            </span>
          </div>
          <div className="py-2">
            <input
              type="range"
              min="20"
              max="100"
              step="5"
              value={state.oilLevel}
              onChange={(e) => onChangeOilLevel(Number(e.target.value))}
              className="w-full h-2.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-slate-400">Шүүр:</span>
            <button
              onClick={() => onChangeFilterClogged(!state.filterClogged)}
              className={`px-3 py-1.5 text-xs rounded-xl font-medium transition-all min-h-[38px] ${
                state.filterClogged
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {state.filterClogged ? 'Бөглөрсөн (Bypass)' : 'Цэвэр (Хэвийн)'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
