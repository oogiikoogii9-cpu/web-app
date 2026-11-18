import React, { useState, useEffect, useRef } from 'react';
import { DIPSTICK_SAMPLES, DipstickSample } from '../data/labsData';
import {
  Beaker,
  Play,
  RotateCcw,
  CheckCircle,
  XCircle,
  HelpCircle,
  Info,
  Thermometer,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';

export const LabsViewer: React.FC = () => {
  const [activeLab, setActiveLab] = useState<'viscosity' | 'bypass' | 'dipstick'>('viscosity');

  // ================= LAB 1: VISCOSITY LAB STATE =================
  const [viscTemp, setViscTemp] = useState<-20 | 20 | 100>(20);
  const [isDropping, setIsDropping] = useState(false);
  const [sphereY, setSphereY] = useState<{ oil1: number; oil2: number; oil3: number }>({
    oil1: 0,
    oil2: 0,
    oil3: 0,
  });
  const [dropTimes, setDropTimes] = useState<{ oil1: string; oil2: string; oil3: string } | null>(null);

  // Viscosity physics coefficients based on temperature
  // Tube height is 220px
  const handleDropSpheres = () => {
    if (isDropping) return;
    setIsDropping(true);
    setSphereY({ oil1: 0, oil2: 0, oil3: 0 });
    setDropTimes(null);

    // Speed factors depending on viscTemp:
    // oil1: 0W-20, oil2: 5W-30, oil3: 20W-50
    let duration1 = 1.0;
    let duration2 = 1.6;
    let duration3 = 3.2;

    if (viscTemp === -20) {
      duration1 = 1.8;
      duration2 = 3.8;
      duration3 = 9.5; // very thick/frozen!
    } else if (viscTemp === 100) {
      duration1 = 0.5;
      duration2 = 0.7;
      duration3 = 1.1;
    }

    const startTime = performance.now();
    const tubeHeight = 210;

    const interval = setInterval(() => {
      const elapsed = (performance.now() - startTime) / 1000;

      const y1 = Math.min(tubeHeight, (elapsed / duration1) * tubeHeight);
      const y2 = Math.min(tubeHeight, (elapsed / duration2) * tubeHeight);
      const y3 = Math.min(tubeHeight, (elapsed / duration3) * tubeHeight);

      setSphereY({ oil1: y1, oil2: y2, oil3: y3 });

      if (elapsed >= Math.max(duration1, duration2, duration3)) {
        clearInterval(interval);
        setIsDropping(false);
        setDropTimes({
          oil1: `${duration1.toFixed(2)} с`,
          oil2: `${duration2.toFixed(2)} с`,
          oil3: `${duration3.toFixed(2)} с`,
        });
      }
    }, 20);
  };

  const handleResetViscosity = () => {
    setIsDropping(false);
    setSphereY({ oil1: 0, oil2: 0, oil3: 0 });
    setDropTimes(null);
  };

  // ================= LAB 2: BYPASS VALVE LAB STATE =================
  const [filterClogLevel, setFilterClogLevel] = useState<number>(0); // 0 to 100%
  const [pumpPressure, setPumpPressure] = useState<number>(3.5); // bar

  // Calculate differential pressure across filter element
  // Clean filter deltaP = 0.2 bar; Clogged filter deltaP climbs to 2.5 bar
  const deltaP = 0.2 + (filterClogLevel / 100) * 2.2;
  const isBypassOpen = deltaP >= 1.2;

  // ================= LAB 3: DIPSTICK WORKSHOP STATE =================
  const [currentSampleIndex, setCurrentSampleIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isDipstickPulled, setIsDipstickPulled] = useState(false);

  const sample = DIPSTICK_SAMPLES[currentSampleIndex];

  const handleSelectOption = (idx: number) => {
    if (hasSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmitDiagnosis = () => {
    if (selectedOption === null || hasSubmitted) return;
    setHasSubmitted(true);
    if (selectedOption === sample.correctOptionIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextSample = () => {
    if (currentSampleIndex < DIPSTICK_SAMPLES.length - 1) {
      setCurrentSampleIndex((prev) => prev + 1);
      setSelectedOption(null);
      setHasSubmitted(false);
      setIsDipstickPulled(false);
    }
  };

  const handleResetWorkshop = () => {
    setCurrentSampleIndex(0);
    setSelectedOption(null);
    setHasSubmitted(false);
    setScore(0);
    setIsDipstickPulled(false);
  };

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-6 py-2">
      {/* Labs Tab Navigation Bar */}
      <div className="flex overflow-x-auto gap-2 p-1.5 bg-slate-900 border border-slate-800 rounded-2xl scrollbar-none -mx-1 px-1">
        <button
          onClick={() => setActiveLab('viscosity')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all flex items-center gap-2 whitespace-nowrap shrink-0 min-h-[44px] ${
            activeLab === 'viscosity'
              ? 'bg-amber-400 text-slate-950 shadow-md font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Beaker className="w-4 h-4" />
          <span>Лаб 1: Зуурамтгай чанар</span>
        </button>

        <button
          onClick={() => setActiveLab('bypass')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all flex items-center gap-2 whitespace-nowrap shrink-0 min-h-[44px] ${
            activeLab === 'bypass'
              ? 'bg-amber-400 text-slate-950 shadow-md font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Лаб 2: Bypass хавхлага</span>
        </button>

        <button
          onClick={() => setActiveLab('dipstick')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all flex items-center gap-2 whitespace-nowrap shrink-0 min-h-[44px] ${
            activeLab === 'dipstick'
              ? 'bg-amber-400 text-slate-950 shadow-md font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Info className="w-4 h-4" />
          <span>Лаб 3: Щуп оношилгоо</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* LAB 1: VISCOSITY FALLING SPHERE EXPERIMENT */}
      {/* ========================================================================= */}
      {activeLab === 'viscosity' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 shadow-2xl flex flex-col gap-8">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400">
              Виртуаль Лаборатори 01
            </span>
            <h2 className="text-2xl font-bold text-slate-100 tracking-tight mt-1">
              Зуурамтгай чанарын унах бөмбөлгийн туршилт (Falling Sphere Test)
            </h2>
            <p className="text-sm text-slate-400 mt-2 max-w-3xl leading-relaxed">
              Моторын тосны урсах чадвар нь температураас шууд хамаардаг. Доорх 3 шилэн цилиндрт
              төмөр бөмбөлөг унагаж, хүйтэн өвлийн (-20°C) болон ажлын халуун (+100°C) нөхцөлд
              янз бүрийн тоснууд хэрхэн эсэргүүцэл үзүүлж буйг бодитоор туршаарай.
            </p>
          </div>

          {/* Interactive Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-950 border border-slate-800">
            {/* Temperature Switcher */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                Туршилтын температур:
              </span>
              <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-lg border border-slate-800">
                <button
                  onClick={() => {
                    setViscTemp(-20);
                    handleResetViscosity();
                  }}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                    viscTemp === -20
                      ? 'bg-sky-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  -20°C (Өвлийн хүйтэн)
                </button>
                <button
                  onClick={() => {
                    setViscTemp(20);
                    handleResetViscosity();
                  }}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                    viscTemp === 20
                      ? 'bg-amber-400 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  20°C (Өрөөний температур)
                </button>
                <button
                  onClick={() => {
                    setViscTemp(100);
                    handleResetViscosity();
                  }}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                    viscTemp === 100
                      ? 'bg-rose-500 text-white font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  100°C (Мотор халсан үе)
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleDropSpheres}
                disabled={isDropping}
                className="px-5 py-2.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 disabled:opacity-40 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm min-h-[44px]"
              >
                <Play className="w-4 h-4" />
                Бөмбөлгүүдийг унагаах
              </button>
              <button
                onClick={handleResetViscosity}
                className="px-4 py-2.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded-xl transition-all flex items-center justify-center gap-1.5 min-h-[44px]"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Дахин эхлэх
              </button>
            </div>
          </div>

          {/* Test Bench Cylinders Visualization (3 Columns side-by-side on mobile) */}
          <div className="grid grid-cols-3 gap-2 sm:gap-6">
            {/* Tube 1: 0W-20 */}
            <div className="flex flex-col items-center p-2.5 sm:p-5 rounded-xl sm:rounded-2xl bg-slate-950 border border-slate-800 gap-2 sm:gap-4">
              <div className="text-center">
                <span className="text-xs sm:text-sm font-bold text-amber-400 font-mono">0W-20</span>
                <p className="text-[10px] sm:text-xs text-slate-400 truncate">Шингэн</p>
              </div>

              {/* Glass Cylinder */}
              <div className="relative w-10 sm:w-16 h-52 sm:h-64 rounded-full border-2 border-slate-600 bg-slate-900/60 overflow-hidden shadow-inner flex justify-center">
                {/* Liquid */}
                <div
                  className="absolute inset-x-0 bottom-0 top-3 bg-amber-400/35 border-t border-amber-300/50"
                  style={{
                    backgroundColor:
                      viscTemp === -20
                        ? 'rgba(245, 158, 11, 0.45)'
                        : viscTemp === 100
                        ? 'rgba(251, 191, 36, 0.25)'
                        : 'rgba(245, 158, 11, 0.35)',
                  }}
                />

                {/* Depth tick lines */}
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="absolute w-4 h-0.5 bg-slate-500/40"
                    style={{ top: `${20 + i * 45}px` }}
                  />
                ))}

                {/* Steel Sphere */}
                <div
                  className="absolute w-8 h-8 rounded-full bg-gradient-to-br from-slate-200 via-slate-400 to-slate-700 border border-slate-100 shadow-md"
                  style={{
                    top: `${16 + sphereY.oil1}px`,
                    transition: isDropping ? 'none' : 'top 0.3s ease',
                  }}
                />
              </div>

              {/* Telemetry outcome */}
              <div className="text-xs font-mono text-center">
                <span className="text-slate-400">Унах хугацаа: </span>
                <span className="font-bold text-emerald-400 tabular-nums">
                  {dropTimes ? dropTimes.oil1 : isDropping ? 'Унаж байна...' : '—'}
                </span>
              </div>
            </div>

            {/* Tube 2: 5W-30 */}
            <div className="flex flex-col items-center p-2.5 sm:p-5 rounded-xl sm:rounded-2xl bg-slate-950 border border-slate-800 gap-2 sm:gap-4">
              <div className="text-center">
                <span className="text-xs sm:text-sm font-bold text-amber-400 font-mono">5W-30</span>
                <p className="text-[10px] sm:text-xs text-slate-400 truncate">Нийтлэг</p>
              </div>

              {/* Glass Cylinder */}
              <div className="relative w-10 sm:w-16 h-52 sm:h-64 rounded-full border-2 border-slate-600 bg-slate-900/60 overflow-hidden shadow-inner flex justify-center">
                <div
                  className="absolute inset-x-0 bottom-0 top-3 bg-amber-500/45 border-t border-amber-300/50"
                  style={{
                    backgroundColor:
                      viscTemp === -20
                        ? 'rgba(217, 119, 6, 0.65)'
                        : viscTemp === 100
                        ? 'rgba(245, 158, 11, 0.35)'
                        : 'rgba(217, 119, 6, 0.5)',
                  }}
                />

                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="absolute w-4 h-0.5 bg-slate-500/40"
                    style={{ top: `${20 + i * 45}px` }}
                  />
                ))}

                {/* Steel Sphere */}
                <div
                  className="absolute w-8 h-8 rounded-full bg-gradient-to-br from-slate-200 via-slate-400 to-slate-700 border border-slate-100 shadow-md"
                  style={{
                    top: `${16 + sphereY.oil2}px`,
                    transition: isDropping ? 'none' : 'top 0.3s ease',
                  }}
                />
              </div>

              <div className="text-xs font-mono text-center">
                <span className="text-slate-400">Унах: </span>
                <span className="font-bold text-amber-400 tabular-nums">
                  {dropTimes ? dropTimes.oil2 : isDropping ? '...' : '—'}
                </span>
              </div>
            </div>

            {/* Tube 3: 20W-50 */}
            <div className="flex flex-col items-center p-2.5 sm:p-5 rounded-xl sm:rounded-2xl bg-slate-950 border border-slate-800 gap-2 sm:gap-4">
              <div className="text-center">
                <span className="text-xs sm:text-sm font-bold text-amber-400 font-mono">20W-50</span>
                <p className="text-[10px] sm:text-xs text-slate-400 truncate">Өтгөн</p>
              </div>

              {/* Glass Cylinder */}
              <div className="relative w-10 sm:w-16 h-52 sm:h-64 rounded-full border-2 border-slate-600 bg-slate-900/60 overflow-hidden shadow-inner flex justify-center">
                <div
                  className="absolute inset-x-0 bottom-0 top-3 bg-amber-700/60 border-t border-amber-300/50"
                  style={{
                    backgroundColor:
                      viscTemp === -20
                        ? 'rgba(120, 53, 15, 0.85)'
                        : viscTemp === 100
                        ? 'rgba(180, 83, 9, 0.45)'
                        : 'rgba(146, 64, 14, 0.65)',
                  }}
                />

                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="absolute w-4 h-0.5 bg-slate-500/40"
                    style={{ top: `${20 + i * 45}px` }}
                  />
                ))}

                {/* Steel Sphere */}
                <div
                  className="absolute w-8 h-8 rounded-full bg-gradient-to-br from-slate-200 via-slate-400 to-slate-700 border border-slate-100 shadow-md"
                  style={{
                    top: `${16 + sphereY.oil3}px`,
                    transition: isDropping ? 'none' : 'top 0.3s ease',
                  }}
                />
              </div>

              <div className="text-xs font-mono text-center">
                <span className="text-slate-400">Унах: </span>
                <span className="font-bold text-rose-400 tabular-nums">
                  {dropTimes ? dropTimes.oil3 : isDropping ? '...' : '—'}
                </span>
              </div>
            </div>
          </div>

          {/* Educational Conclusion Note */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 leading-relaxed flex items-start gap-3">
            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-100 block mb-1">
                Туршилтын инженерийн дүгнэлт:
              </span>
              -20°C хүйтэнд 20W-50 тос өтгөрөн зөгийн бал шиг болж бөмбөлөг маш удаан унаж байгааг
              анзаараарай. Хэрэв өвөл ийм өтгөн тостой моторыг асаавал насос тосоо шахаж амжихгүй
              эхний 30 секунд хуурай үрэлт болж мотор маш хурдан цохидог. Тийм учраас хүйтэн өвөлд
              хүйтэн асаалтын урсах чадвар өндөртэй <strong>0W-20</strong> эсвэл <strong>5W-30</strong> тос амин чухал байдаг!
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* LAB 2: FILTER BYPASS VALVE SIMULATION */}
      {/* ========================================================================= */}
      {activeLab === 'bypass' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 shadow-2xl flex flex-col gap-8">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400">
              Виртуаль Лаборатори 02
            </span>
            <h2 className="text-2xl font-bold text-slate-100 tracking-tight mt-1">
              Шүүрийн тойрох (Bypass) хавхлагын аврах механизм
            </h2>
            <p className="text-sm text-slate-400 mt-2 max-w-3xl leading-relaxed">
              Тосны шүүрийн шүүх цаас шороо, нагараар бөглөрөх үед оролт болон гаралтын хооронд
              даралтын зөрүү (ΔP) үүсдэг. Энэхүү даралтын зөрүү пүршийг шахаж Bypass хавхлагыг нээх
              процессийг туршиж үзээрэй.
            </p>
          </div>

          {/* Control Slider */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex-1 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-semibold">
                  Шүүх элементийн бөглөрөлт:
                </span>
                <span className="font-mono text-amber-400 font-bold tabular-nums">
                  {filterClogLevel}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={filterClogLevel}
                onChange={(e) => setFilterClogLevel(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                <span>0% (Цоо шинэ шүүр)</span>
                <span>50% (Хэвийн хуучирсан)</span>
                <span>100% (Бүрэн бөглөрсөн)</span>
              </div>
            </div>

            {/* Live Delta P Telemetry Gauge */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-center min-w-[200px]">
              <span className="text-[11px] text-slate-400">Даралтын зөрүү (ΔP):</span>
              <span
                className={`text-2xl font-bold font-mono tabular-nums my-1 ${
                  isBypassOpen ? 'text-rose-400 animate-pulse' : 'text-emerald-400'
                }`}
              >
                {deltaP.toFixed(2)} bar
              </span>
              <span
                className={`text-xs px-2 py-0.5 rounded font-medium ${
                  isBypassOpen
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    : 'bg-emerald-500/20 text-emerald-300'
                }`}
              >
                {isBypassOpen ? 'Bypass нээлттэй (> 1.2 bar)' : 'Bypass хаалттай (Хэвийн)'}
              </span>
            </div>
          </div>

          {/* Interactive Mechanical Cutaway View */}
          <div className="relative w-full aspect-[16/8] bg-slate-950 rounded-2xl border border-slate-800 p-4 flex items-center justify-center overflow-hidden">
            <svg viewBox="0 0 800 360" className="w-full h-full">
              {/* Filter Housing Shell */}
              <rect
                x="200"
                y="50"
                width="400"
                height="260"
                rx="16"
                fill="#1e293b"
                stroke="#334155"
                strokeWidth="4"
              />

              {/* Pleated Paper Filter Bed */}
              <g id="pleated-paper">
                {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                  <path
                    key={i}
                    d={`M ${270 + i * 36} 90 L ${288 + i * 36} 270 L ${306 + i * 36} 90`}
                    fill="none"
                    stroke={filterClogLevel > 80 ? '#78350f' : filterClogLevel > 40 ? '#d97706' : '#f59e0b'}
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ))}
              </g>

              {/* Oil Intake Channel */}
              <path d="M 120 180 L 200 180" stroke="#f59e0b" strokeWidth="18" strokeLinecap="round" />
              <text x="140" y="165" fill="#f8fafc" fontSize="11" fontWeight="600">
                Орох урсгал
              </text>

              {/* Central Tube (Clean Oil Exit) */}
              <rect x="560" y="130" width="160" height="100" rx="8" fill="#0f172a" stroke="#475569" strokeWidth="2" />
              <path d="M 600 180 L 720 180" stroke="#fbbf24" strokeWidth="18" strokeLinecap="round" />
              <text x="630" y="165" fill="#f8fafc" fontSize="11" fontWeight="600">
                Гарах урсгал
              </text>

              {/* Bypass Valve Spring & Piston Assembly */}
              <g transform="translate(560, 250)">
                <rect x="-30" y="-15" width="60" height="30" rx="4" fill="#0f172a" stroke="#64748b" />
                {/* Valve disc */}
                <circle
                  cx={isBypassOpen ? '15' : '0'}
                  cy="0"
                  r="10"
                  fill={isBypassOpen ? '#ef4444' : '#cbd5e1'}
                  stroke="#f87171"
                  strokeWidth="2"
                />
                {/* Calibrated Spring */}
                <path
                  d={isBypassOpen ? 'M -25 0 Q -15 -8 -5 0 Q 5 8 15 0' : 'M -25 0 Q -18 -8 -10 0 Q -2 8 0 0'}
                  fill="none"
                  stroke="#94a3b8"
                  strokeWidth="3"
                />
                <text x="0" y="28" textAnchor="middle" fill="#cbd5e1" fontSize="10" fontWeight="bold">
                  Bypass Хавхлага
                </text>
              </g>

              {/* Flow Arrows Visualization */}
              {!isBypassOpen ? (
                // Normal path: Through pleated paper
                <g opacity="0.9">
                  <path
                    d="M 220 180 Q 320 120 450 160 Q 520 175 580 180"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="6"
                    strokeDasharray="8 6"
                    className="animate-pulse"
                  />
                  <text x="380" y="75" textAnchor="middle" fill="#34d399" fontSize="12" fontWeight="bold">
                    ✓ Шүүх цаасаар бүрэн цэвэрлэгдэн урсаж байна
                  </text>
                </g>
              ) : (
                // Emergency bypass path: directly through bypass valve without filtering!
                <g opacity="0.95">
                  <path
                    d="M 220 200 Q 350 260 550 250 L 620 200"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="8"
                    strokeDasharray="8 4"
                  />
                  <text x="380" y="325" textAnchor="middle" fill="#f87171" fontSize="12" fontWeight="bold">
                    ▲ АЮУЛ: Шүүх цаас бөглөрсөн тул тойрох хавхлагаар ШҮҮГДЭЭГҮЙ тос урсаж байна!
                  </text>
                </g>
              )}
            </svg>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* LAB 3: DIPSTICK DIAGNOSTIC WORKSHOP */}
      {/* ========================================================================= */}
      {activeLab === 'dipstick' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 shadow-2xl flex flex-col gap-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-amber-400">
                Виртуаль Лаборатори 03 · Авто засварын дадлага
              </span>
              <h2 className="text-2xl font-bold text-slate-100 tracking-tight mt-1">
                Тосны щуп (Dipstick) оношилгооны дадлага ажил
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Кейс {currentSampleIndex + 1}/{DIPSTICK_SAMPLES.length}: {sample.vehicleName}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-slate-400">
                Оноо: <strong className="text-amber-400">{score}</strong> / {DIPSTICK_SAMPLES.length}
              </span>
              <button
                onClick={handleResetWorkshop}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white border border-slate-800 rounded-lg"
              >
                Эхнээс нь
              </button>
            </div>
          </div>

          {/* Vehicle Case Description */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
            <span className="font-semibold text-amber-400 block mb-1">
              Үйлчлүүлэгчийн гомдол ба нөхцөл байдал:
            </span>
            {sample.description}
          </div>

          {/* Interactive Dipstick Extraction Workbench */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Left: Dipstick Graphic */}
            <div className="md:col-span-5 flex flex-col items-center p-6 rounded-2xl bg-slate-950 border border-slate-800 gap-4">
              <button
                onClick={() => setIsDipstickPulled(!isDipstickPulled)}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
                  isDipstickPulled
                    ? 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                    : 'bg-amber-400 text-slate-950 hover:bg-amber-300 animate-bounce'
                }`}
              >
                {isDipstickPulled ? 'Щупийг буцааж хийх' : 'Щупийг сугалж шалгах'}
              </button>

              {/* Dipstick Blade Graphic */}
              <div className="relative w-20 h-72 flex flex-col items-center">
                {/* Yellow handle */}
                <div className="w-10 h-8 rounded-t-full border-2 border-amber-400 bg-amber-500/20 flex items-center justify-center cursor-pointer">
                  <div className="w-4 h-4 rounded-full border border-amber-400" />
                </div>

                {/* Steel Blade */}
                <div className="w-3 flex-1 bg-slate-400 border border-slate-500 relative flex justify-center">
                  {/* Markings: MAX and MIN */}
                  <div className="absolute top-12 -left-6 text-[10px] font-mono text-slate-300">
                    MAX —
                  </div>
                  <div className="absolute top-36 -left-6 text-[10px] font-mono text-slate-300">
                    MIN —
                  </div>

                  {/* Oil film coat on dipstick tip */}
                  {isDipstickPulled && (
                    <div
                      className="absolute bottom-0 w-3 rounded-b transition-all duration-500 shadow-md"
                      style={{
                        height: `${sample.levelPercentage * 1.5}px`,
                        backgroundColor: sample.color,
                      }}
                    />
                  )}
                </div>
              </div>

              {/* Wipe test paper circle */}
              {isDipstickPulled && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800 w-full">
                  <div
                    className="w-10 h-10 rounded-full border-2 border-white/20 shadow-md shrink-0"
                    style={{ backgroundColor: sample.color }}
                  />
                  <div className="text-xs">
                    <span className="font-semibold text-slate-200 block">
                      {sample.colorName}
                    </span>
                    <span className="text-slate-400">{sample.texture}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Inspection details & Diagnostic Choices */}
            <div className="md:col-span-7 flex flex-col gap-4">
              {!isDipstickPulled ? (
                <div className="p-8 text-center text-slate-400 border border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center gap-3">
                  <HelpCircle className="w-8 h-8 text-amber-400" />
                  <p className="text-sm">
                    Эхлээд зүүн талын товчлуур дээр дарж щупийг сугалан түвшин, өнгө, үнэрийг
                    шалгана уу.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Visual Inspection Card */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                      <span className="text-slate-400 block mb-0.5">Тосны түвшин:</span>
                      <span className="font-semibold text-amber-300">
                        {sample.oilLevel === 'nominal' && 'MIN ба MAX голд (Хэвийн)'}
                        {sample.oilLevel === 'critical_low' && 'MIN-ээс доош (Аюултай дундарсан)'}
                        {sample.oilLevel === 'above_max' && 'MAX-аас их (Хэтэрсэн)'}
                      </span>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                      <span className="text-slate-400 block mb-0.5">Үнэр ба шинж:</span>
                      <span className="font-semibold text-slate-200">{sample.odor}</span>
                    </div>
                  </div>

                  {/* Diagnostic Questions */}
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                      Таны инженерийн оношилгоо, дүгнэлт:
                    </h3>
                    <div className="space-y-2">
                      {sample.options.map((opt, oIdx) => {
                        const isChosen = selectedOption === oIdx;
                        const isCorrect = oIdx === sample.correctOptionIndex;

                        let style = 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700';

                        if (hasSubmitted) {
                          if (isCorrect) {
                            style = 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200';
                          } else if (isChosen && !isCorrect) {
                            style = 'bg-rose-500/15 border-rose-500/40 text-rose-200';
                          }
                        } else if (isChosen) {
                          style = 'bg-amber-400/10 border-amber-400 text-amber-200';
                        }

                        return (
                          <button
                            key={oIdx}
                            disabled={hasSubmitted}
                            onClick={() => handleSelectOption(oIdx)}
                            className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between ${style}`}
                          >
                            <span>{opt}</span>
                            {hasSubmitted && isCorrect && (
                              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                            )}
                            {hasSubmitted && isChosen && !isCorrect && (
                              <XCircle className="w-4 h-4 text-rose-400 shrink-0 ml-2" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Submit / Next Button */}
                  {!hasSubmitted ? (
                    <button
                      onClick={handleSubmitDiagnosis}
                      disabled={selectedOption === null}
                      className="w-full py-2.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 disabled:opacity-40 rounded-xl transition-colors"
                    >
                      Оношийг баталгаажуулах
                    </button>
                  ) : (
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                      <div className="flex items-center gap-2">
                        {selectedOption === sample.correctOptionIndex ? (
                          <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                            <CheckCircle className="w-4 h-4" /> Зөв оношиллоо!
                          </span>
                        ) : (
                          <span className="text-xs font-bold text-rose-400 flex items-center gap-1">
                            <XCircle className="w-4 h-4" /> Буруу байна.
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-300">{sample.explanation}</p>
                      <div className="text-xs text-amber-300 pt-1 border-t border-slate-800">
                        <strong>Зөвлөмж:</strong> {sample.recommendation}
                      </div>

                      {currentSampleIndex < DIPSTICK_SAMPLES.length - 1 ? (
                        <button
                          onClick={handleNextSample}
                          className="mt-3 px-4 py-2 text-xs font-semibold rounded-lg bg-amber-400 text-slate-950 hover:bg-amber-300 transition-colors flex items-center gap-1 ml-auto"
                        >
                          Дараагийн машин руу шилжих <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <div className="mt-3 text-xs text-emerald-400 font-semibold">
                          Бүх 5 автомашины оношилгоо амжилттай дууслаа!
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
