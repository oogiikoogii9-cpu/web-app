import React, { useEffect, useRef, useState } from 'react';
import { EngineSimulationState, LubricationComponent } from '../types';
import { COMPONENTS_DATA } from '../data/componentsData';
import { AlertTriangle, Info, Play, Pause, Thermometer, Gauge, Droplets, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface EngineSimulationCanvasProps {
  state: EngineSimulationState;
  onSelectComponent: (component: LubricationComponent) => void;
  selectedComponentId: string | null;
  onToggleRunning: () => void;
}

export const EngineSimulationCanvas: React.FC<EngineSimulationCanvasProps> = ({
  state,
  onSelectComponent,
  selectedComponentId,
  onToggleRunning,
}) => {
  const [crankAngle, setCrankAngle] = useState(0);
  const [hoveredComponentId, setHoveredComponentId] = useState<string | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());

  // Animation loop for crankshaft rotation and fluid flow
  useEffect(() => {
    const animate = (currentTime: number) => {
      const deltaTime = (currentTime - lastTimeRef.current) / 1000;
      lastTimeRef.current = currentTime;

      if (state.isRunning && state.rpm > 0) {
        // Rotations per second: rpm / 60
        // Degrees per second: (rpm / 60) * 360
        const degreesDelta = (state.rpm / 60) * 360 * deltaTime * 0.35; // smoothed visually
        setCrankAngle((prev) => (prev + degreesDelta) % 360);
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    lastTimeRef.current = performance.now();
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [state.isRunning, state.rpm]);

  // Derive piston heights for a 4-cylinder inline engine (firing order 1-3-4-2)
  const rad = (crankAngle * Math.PI) / 180;
  const stroke = 24; // stroke amplitude in pixels
  const p1Y = Math.cos(rad) * stroke;
  const p2Y = Math.cos(rad + Math.PI) * stroke;
  const p3Y = Math.cos(rad + Math.PI) * stroke;
  const p4Y = Math.cos(rad) * stroke;

  // Flow animation speed calculation
  const flowDashOffset = state.isRunning ? (crankAngle * 2) % 100 : 0;

  // Determine oil color based on temperature and condition
  const getOilColor = () => {
    if (state.temperature < 0) return '#f59e0b'; // thick cold amber
    if (state.temperature > 110) return '#b45309'; // hot darkened amber
    return '#fbbf24'; // rich golden oil
  };

  const oilColor = getOilColor();

  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // Zoom handlers for mobile/desktop
  const handleZoomIn = () => setZoomLevel((prev) => Math.min(2.0, Number((prev + 0.3).toFixed(1))));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(1.0, Number((prev - 0.3).toFixed(1))));
  const handleZoomReset = () => setZoomLevel(1.0);

  return (
    <div className="relative w-full rounded-2xl border border-slate-800 bg-slate-900/90 shadow-2xl overflow-hidden flex flex-col">
      {/* Simulation Header with Quick Telemetry Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 bg-slate-950/70 p-3 sm:px-5 sm:py-3">
        <div className="flex items-center justify-between sm:justify-start gap-3 w-full sm:w-auto">
          <button
            onClick={onToggleRunning}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 sm:py-1.5 rounded-xl text-xs font-semibold transition-all min-h-[44px] sm:min-h-[36px] shadow-sm ${
              state.isRunning
                ? 'bg-amber-400 text-slate-950 hover:bg-amber-300'
                : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
            }`}
          >
            {state.isRunning ? (
              <>
                <Pause className="w-4 h-4" /> Хөдөлгүүр зогсоох
              </>
            ) : (
              <>
                <Play className="w-4 h-4" /> Хөдөлгүүр асаах
              </>
            )}
          </button>

          <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/80 px-3 py-2 rounded-xl border border-slate-800/80 min-h-[44px] sm:min-h-0">
            <span className="text-slate-400">Төлөв:</span>
            <span
              className={`font-semibold ${
                state.isRunning ? 'text-emerald-400' : 'text-slate-400'
              }`}
            >
              {state.isRunning ? 'Асаалттай' : 'Унтарсан'}
            </span>
            <span className="text-slate-600">·</span>
            <span className="font-mono tabular-nums text-slate-200 font-medium">
              {state.isRunning ? `${state.rpm} эрг/м` : '0'}
            </span>
          </div>
        </div>

        {/* Live Gauges Summary (Responsive Grid on Mobile) */}
        <div className="grid grid-cols-3 sm:flex items-center gap-2 sm:gap-4 text-xs font-mono tabular-nums bg-slate-900/50 p-2 sm:p-0 rounded-xl sm:bg-transparent">
          {/* Pressure metric */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-1.5 p-1.5 sm:p-0 rounded-lg bg-slate-950/60 sm:bg-transparent border border-slate-800/60 sm:border-0">
            <div className="flex items-center gap-1 text-[11px] text-slate-400">
              <Gauge className="w-3.5 h-3.5 text-amber-400" />
              <span>Даралт</span>
            </div>
            <span
              className={`font-semibold text-xs sm:text-sm ${
                state.oilPressure < 0.8 && state.isRunning
                  ? 'text-rose-400 animate-pulse'
                  : state.oilPressure > 5.2
                  ? 'text-amber-400'
                  : 'text-emerald-400'
              }`}
            >
              {state.oilPressure.toFixed(2)} bar
            </span>
          </div>

          {/* Temperature metric */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-1.5 p-1.5 sm:p-0 rounded-lg bg-slate-950/60 sm:bg-transparent border border-slate-800/60 sm:border-0">
            <div className="flex items-center gap-1 text-[11px] text-slate-400">
              <Thermometer className="w-3.5 h-3.5 text-rose-400" />
              <span>Темп</span>
            </div>
            <span
              className={`font-semibold text-xs sm:text-sm ${
                state.temperature > 105
                  ? 'text-rose-400'
                  : state.temperature < 15
                  ? 'text-sky-400'
                  : 'text-amber-300'
              }`}
            >
              {state.temperature > 0 ? `+${state.temperature}` : state.temperature}°C
            </span>
          </div>

          {/* Flow rate */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-1.5 p-1.5 sm:p-0 rounded-lg bg-slate-950/60 sm:bg-transparent border border-slate-800/60 sm:border-0">
            <div className="flex items-center gap-1 text-[11px] text-slate-400">
              <Droplets className="w-3.5 h-3.5 text-sky-400" />
              <span>Урсгал</span>
            </div>
            <span className="text-slate-200 font-semibold text-xs sm:text-sm">
              {state.oilFlowRate.toFixed(1)} л/м
            </span>
          </div>
        </div>
      </div>

      {/* Mobile Horizontal Quick-Component Carousel */}
      <div className="border-b border-slate-800/80 bg-slate-950/90 px-3 py-2 overflow-x-auto scrollbar-none flex items-center gap-2">
        <span className="text-[11px] text-slate-400 font-medium whitespace-nowrap hidden sm:inline mr-1">
          Эд ангиуд:
        </span>
        {COMPONENTS_DATA.map((comp) => {
          const isSelected = selectedComponentId === comp.id;
          return (
            <button
              key={comp.id}
              onClick={() => onSelectComponent(comp)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all min-h-[38px] flex items-center gap-1.5 shrink-0 ${
                isSelected
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-slate-950' : 'bg-amber-400'}`} />
              {comp.nameMn.split(' ')[0]}
            </button>
          );
        })}
      </div>

      {/* Warning Banners if critical states active */}
      {state.oilWarningLamp && state.isRunning && (
        <div className="bg-rose-500/15 border-b border-rose-500/30 px-4 sm:px-5 py-2 text-xs text-rose-300 flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-2 font-medium">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>АНХААР: Тосны даралт аюултай доод хязгаарт хүрсэн!</span>
          </div>
          <span className="text-rose-400 font-bold uppercase tracking-wider text-[10px] sm:text-[11px] whitespace-nowrap ml-2">
            &lt; 0.5 bar
          </span>
        </div>
      )}

      {state.bypassValveOpen && (
        <div className="bg-amber-500/15 border-b border-amber-500/30 px-4 sm:px-5 py-2 text-xs text-amber-300 flex items-center justify-between">
          <div className="flex items-center gap-2 font-medium">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>ШҮҮРИЙН BYPASS ХАВХЛАГА НЭЭГДЛЭЭ (Шүүгдээгүй тосоор тосолж байна)</span>
          </div>
          <span className="text-amber-400 font-semibold text-[10px] sm:text-[11px] whitespace-nowrap ml-2">
            Тойрох зам
          </span>
        </div>
      )}

      {/* SVG Canvas Workspace */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] min-h-[300px] sm:min-h-[460px] max-h-[620px] bg-slate-950 flex items-center justify-center p-1 sm:p-2 select-none overflow-hidden">
        {/* Floating Zoom & Reset Controls on Top-Right */}
        <div className="absolute top-3 right-3 z-20 flex items-center gap-1 bg-slate-900/90 border border-slate-800 rounded-xl p-1 shadow-lg backdrop-blur-md">
          <button
            onClick={handleZoomIn}
            title="Томруулах"
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 active:scale-95 transition-all"
          >
            <ZoomIn className="w-4 h-4 text-amber-400" />
          </button>
          <button
            onClick={handleZoomOut}
            title="Багасгах"
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 active:scale-95 transition-all"
          >
            <ZoomOut className="w-4 h-4 text-amber-400" />
          </button>
          {zoomLevel !== 1 && (
            <button
              onClick={handleZoomReset}
              title="100% буцаах"
              className="px-2 h-8 text-[11px] font-mono font-medium rounded-lg text-amber-400 hover:bg-slate-800 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              {Math.round(zoomLevel * 100)}%
            </button>
          )}
        </div>

        <svg
          viewBox="0 0 1000 640"
          className="w-full h-full object-contain"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Gradients */}
            <linearGradient id="metalBlock" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>

            <linearGradient id="cylinderGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="50%" stopColor="#475569" />
              <stop offset="100%" stopColor="#334155" />
            </linearGradient>

            <linearGradient id="pistonGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#64748b" />
              <stop offset="50%" stopColor="#94a3b8" />
              <stop offset="100%" stopColor="#64748b" />
            </linearGradient>

            <linearGradient id="crankGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#94a3b8" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>

            <linearGradient id="oilSumpGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#b45309" stopOpacity="0.95" />
            </linearGradient>

            <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Marker arrow for flow */}
            <marker
              id="flowArrow"
              viewBox="0 0 10 10"
              refX="6"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill={oilColor} />
            </marker>
          </defs>

          {/* Zoomable Engine Graphics Container */}
          <g style={{ transform: zoomLevel !== 1 ? `scale(${zoomLevel})` : undefined, transformOrigin: '500px 320px', transition: 'transform 0.25s ease-out' }}>

          {/* ================= BACKGROUND ENGINE CHASSIS / BLOCK ================= */}
          <g id="engine-block-cutaway">
            {/* Engine outer silhouette outline */}
            <path
              d="M 120 40 L 880 40 Q 900 40 900 60 L 900 490 L 820 490 L 800 620 L 220 620 L 200 490 L 100 490 L 100 60 Q 100 40 120 40 Z"
              fill="url(#metalBlock)"
              stroke="#334155"
              strokeWidth="3"
            />

            {/* Cylinder bores (Cyl 1, 2, 3, 4) */}
            {[0, 1, 2, 3].map((i) => {
              const xPos = 360 + i * 130;
              return (
                <g key={`cyl-bore-${i}`}>
                  {/* Cylinder Liner */}
                  <rect
                    x={xPos - 45}
                    y={130}
                    width={90}
                    height={190}
                    fill="#090d16"
                    stroke="#1e293b"
                    strokeWidth="2"
                    rx="2"
                  />
                  {/* Honing cross-hatch marks on cylinder walls */}
                  <line
                    x1={xPos - 43}
                    y1={140}
                    x2={xPos - 35}
                    y2={310}
                    stroke="#1e293b"
                    strokeWidth="1"
                    strokeDasharray="4 6"
                  />
                  <line
                    x1={xPos + 43}
                    y1={140}
                    x2={xPos + 35}
                    y2={310}
                    stroke="#1e293b"
                    strokeWidth="1"
                    strokeDasharray="4 6"
                  />
                </g>
              );
            })}

            {/* Cylinder Head Chamber Background (Valvetrain chamber) */}
            <rect
              x={140}
              y={50}
              width={740}
              height={70}
              fill="#0d1527"
              stroke="#1e293b"
              strokeWidth="2"
              rx="6"
            />
          </g>

          {/* ================= MOVING MECHANICAL COMPONENTS ================= */}
          <g id="pistons-and-crankshaft">
            {/* Pistons & Connecting Rods for Cylinders 1, 2, 3, 4 */}
            {[
              { idx: 0, x: 360, yOffset: p1Y },
              { idx: 1, x: 490, yOffset: p2Y },
              { idx: 2, x: 620, yOffset: p3Y },
              { idx: 3, x: 750, yOffset: p4Y },
            ].map(({ idx, x, yOffset }) => {
              const pistonBaseY = 200 + yOffset;
              const crankPinY = 440 + yOffset * 0.9;
              const crankPinX = x + Math.sin(rad + (idx === 1 || idx === 2 ? Math.PI : 0)) * 26;

              return (
                <g key={`piston-assembly-${idx}`}>
                  {/* Connecting Rod (Шатун) */}
                  <line
                    x1={x}
                    y1={pistonBaseY + 25}
                    x2={crankPinX}
                    y2={crankPinY}
                    stroke="#64748b"
                    strokeWidth="10"
                    strokeLinecap="round"
                  />
                  <line
                    x1={x}
                    y1={pistonBaseY + 25}
                    x2={crankPinX}
                    y2={crankPinY}
                    stroke="#94a3b8"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />

                  {/* Piston Body (Поршин) */}
                  <rect
                    x={x - 40}
                    y={pistonBaseY - 35}
                    width={80}
                    height={55}
                    rx="4"
                    fill="url(#pistonGrad)"
                    stroke="#334155"
                    strokeWidth="1.5"
                  />

                  {/* Piston Rings (Кольцоны ховил) */}
                  <line x1={x - 40} y1={pistonBaseY - 28} x2={x + 40} y2={pistonBaseY - 28} stroke="#1e293b" strokeWidth="2" />
                  <line x1={x - 40} y1={pistonBaseY - 20} x2={x + 40} y2={pistonBaseY - 20} stroke="#1e293b" strokeWidth="2" />
                  <line x1={x - 40} y1={pistonBaseY - 12} x2={x + 40} y2={pistonBaseY - 12} stroke="#1e293b" strokeWidth="3" />

                  {/* Piston Pin (Хуруу) */}
                  <circle cx={x} cy={pistonBaseY + 5} r="7" fill="#475569" stroke="#94a3b8" strokeWidth="2" />

                  {/* Connecting Rod Bearing (Шатуны хүзүүний вкладыш) */}
                  <circle
                    cx={crankPinX}
                    cy={crankPinY}
                    r="14"
                    fill="#1e293b"
                    stroke={selectedComponentId === 'crank_bearings' ? '#fbbf24' : '#475569'}
                    strokeWidth="3"
                  />
                  {/* Journal highlight */}
                  <circle cx={crankPinX} cy={crankPinY} r="9" fill="#94a3b8" />

                  {/* Splash lubrication mist on cylinder wall when engine is running */}
                  {state.isRunning && (
                    <g opacity={Math.min(1, state.rpm / 2000)}>
                      <circle cx={x - 38} cy={pistonBaseY - 10} r="1.5" fill={oilColor} />
                      <circle cx={x + 38} cy={pistonBaseY - 5} r="1.5" fill={oilColor} />
                      <circle cx={x - 36} cy={pistonBaseY + 15} r="1.5" fill={oilColor} />
                      <circle cx={x + 36} cy={pistonBaseY + 20} r="1.5" fill={oilColor} />
                    </g>
                  )}
                </g>
              );
            })}

            {/* Crankshaft Counterweights & Main Journals (5 Main Bearings) */}
            <g id="crank-main-journals">
              {[295, 425, 555, 685, 815].map((mX, mIdx) => (
                <g key={`main-journal-${mIdx}`}>
                  {/* Main Bearing Cap */}
                  <rect
                    x={mX - 16}
                    y={425}
                    width={32}
                    height={34}
                    rx="4"
                    fill="#1e293b"
                    stroke={selectedComponentId === 'crank_bearings' ? '#fbbf24' : '#334155'}
                    strokeWidth="2"
                  />
                  {/* Internal drilling hole receiving oil */}
                  <circle cx={mX} cy={442} r="10" fill="#334155" />
                  <circle cx={mX} cy={442} r="5" fill={oilColor} />
                </g>
              ))}
            </g>

            {/* Camshafts in Cylinder Head (Intake & Exhaust DOHC) */}
            <g id="valvetrain-camshafts">
              {/* Intake Camshaft (Top) */}
              <rect x={260} y={65} width={590} height={14} rx="4" fill="#475569" stroke="#334155" />
              {/* Exhaust Camshaft (Bottom) */}
              <rect x={260} y={95} width={590} height={14} rx="4" fill="#475569" stroke="#334155" />

              {/* Cam lobes on cylinder head */}
              {[340, 470, 600, 730].map((camX, cIdx) => (
                <g key={`cam-valves-${cIdx}`}>
                  {/* Rotating lobe simulation */}
                  <circle cx={camX} cy={72} r="11" fill="#64748b" stroke="#94a3b8" strokeWidth="1.5" />
                  <circle cx={camX + 30} cy={102} r="11" fill="#64748b" stroke="#94a3b8" strokeWidth="1.5" />
                  {/* Valve springs & lifters */}
                  <line x1={camX} y1={83} x2={camX} y2={120} stroke="#94a3b8" strokeWidth="4" />
                  <line x1={camX + 30} y1={113} x2={camX + 30} y2={120} stroke="#94a3b8" strokeWidth="4" />
                </g>
              ))}
            </g>
          </g>

          {/* ================= LUBRICATION HYDRAULIC CONDUITS (OIL CHANNELS) ================= */}
          <g id="oil-conduits">
            {/* Conduit 1: Sump to Pump Pickup (Suction Line) */}
            <path
              d="M 370 575 L 350 510 L 280 510 L 280 470"
              fill="none"
              stroke="#334155"
              strokeWidth="16"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M 370 575 L 350 510 L 280 510 L 280 470"
              fill="none"
              stroke={oilColor}
              strokeWidth="8"
              strokeDasharray={state.isRunning ? '8 6' : 'none'}
              strokeDashoffset={flowDashOffset}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.9"
            />

            {/* Conduit 2: Pump Outlet to Oil Cooler & Filter */}
            <path
              d="M 230 430 L 180 430 L 180 345"
              fill="none"
              stroke="#334155"
              strokeWidth="14"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M 230 430 L 180 430 L 180 345"
              fill="none"
              stroke={oilColor}
              strokeWidth="7"
              strokeDasharray={state.isRunning ? '8 6' : 'none'}
              strokeDashoffset={-flowDashOffset}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.9"
            />

            {/* Relief Valve Bypass Conduit (Returns excess oil to sump when > 5 bar) */}
            <path
              d="M 210 430 L 210 500 L 250 540"
              fill="none"
              stroke={state.reliefValveOpen ? '#f97316' : '#1e293b'}
              strokeWidth="6"
              strokeDasharray={state.reliefValveOpen && state.isRunning ? '6 4' : 'none'}
              strokeDashoffset={-flowDashOffset}
              strokeLinecap="round"
            />

            {/* Filter Bypass Channel (When filter is clogged) */}
            <path
              d="M 140 330 Q 115 315 140 300"
              fill="none"
              stroke={state.bypassValveOpen ? '#ef4444' : '#1e293b'}
              strokeWidth="6"
              strokeDasharray={state.bypassValveOpen && state.isRunning ? '6 4' : 'none'}
              strokeDashoffset={-flowDashOffset}
            />

            {/* Conduit 3: Filter Outlet to Oil Cooler to Main Gallery */}
            <path
              d="M 180 280 L 180 230 L 260 230 L 260 280 L 850 280"
              fill="none"
              stroke="#334155"
              strokeWidth="16"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* The Main Oil Gallery core flow */}
            <path
              d="M 180 280 L 180 230 L 260 230 L 260 280 L 850 280"
              fill="none"
              stroke={oilColor}
              strokeWidth="9"
              strokeDasharray={state.isRunning ? '10 6' : 'none'}
              strokeDashoffset={-flowDashOffset}
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#glowEffect)"
            />

            {/* Conduit 4: Feeds from Main Gallery DOWN to Crankshaft Main Bearings */}
            {[295, 425, 555, 685, 815].map((mX, mIdx) => (
              <g key={`gallery-down-feed-${mIdx}`}>
                <line x1={mX} y1={285} x2={mX} y2={430} stroke="#334155" strokeWidth="10" strokeLinecap="round" />
                <line
                  x1={mX}
                  y1={285}
                  x2={mX}
                  y2={430}
                  stroke={oilColor}
                  strokeWidth="5"
                  strokeDasharray={state.isRunning ? '6 4' : 'none'}
                  strokeDashoffset={-flowDashOffset}
                />
              </g>
            ))}

            {/* Conduit 5: Piston Oil Cooling Jets (Squirters) spraying up to pistons */}
            {[360, 490, 620, 750].map((jetX, jIdx) => (
              <g key={`jet-squirter-${jIdx}`}>
                {/* Squirter nozzle */}
                <path d={`M ${jetX - 10} 280 L ${jetX - 10} 250 L ${jetX - 5} 240`} fill="none" stroke="#64748b" strokeWidth="4" />
                {/* Sprayed oil stream (active when pressure > 1.8 bar) */}
                {state.isRunning && state.oilPressure > 1.8 && (
                  <path
                    d={`M ${jetX - 5} 240 Q ${jetX} 210 ${jetX} 180`}
                    fill="none"
                    stroke={oilColor}
                    strokeWidth="3"
                    strokeDasharray="4 4"
                    strokeDashoffset={-flowDashOffset * 1.5}
                    opacity="0.8"
                  />
                )}
              </g>
            ))}

            {/* Conduit 6: Riser Gallery UP to Cylinder Head / Valvetrain */}
            <path
              d="M 260 280 L 260 75 L 840 75"
              fill="none"
              stroke="#334155"
              strokeWidth="12"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M 260 280 L 260 75 L 840 75"
              fill="none"
              stroke={oilColor}
              strokeWidth="6"
              strokeDasharray={state.isRunning ? '8 6' : 'none'}
              strokeDashoffset={-flowDashOffset}
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Conduit 7: Gravity Drain channels from Head back to Sump */}
            <path
              d="M 870 110 L 870 480 L 780 540"
              fill="none"
              stroke="#1e293b"
              strokeWidth="10"
              strokeLinecap="round"
            />
            {state.isRunning && (
              <path
                d="M 870 110 L 870 480 L 780 540"
                fill="none"
                stroke={oilColor}
                strokeWidth="4"
                strokeDasharray="4 8"
                strokeDashoffset={flowDashOffset}
                opacity="0.6"
              />
            )}
          </g>

          {/* ================= INTERACTIVE COMPONENT UNITS (HOTSPOTS) ================= */}

          {/* 1. Тосны картер (Sump / Oil Pan) */}
          <g
            id="comp-sump"
            className="cursor-pointer transition-transform hover:opacity-95"
            onClick={() => onSelectComponent(COMPONENTS_DATA.find((c) => c.id === 'sump')!)}
            onMouseEnter={() => setHoveredComponentId('sump')}
            onMouseLeave={() => setHoveredComponentId(null)}
          >
            {/* Pan casing */}
            <path
              d="M 210 500 L 230 615 Q 235 625 245 625 L 775 625 Q 785 625 790 615 L 810 500 Z"
              fill="#0b1120"
              stroke={selectedComponentId === 'sump' || hoveredComponentId === 'sump' ? '#fbbf24' : '#334155'}
              strokeWidth={selectedComponentId === 'sump' ? '3' : '2'}
            />

            {/* Liquid Oil Reservoir in Sump (Height responds to oilLevel) */}
            {(() => {
              const fillHeight = 110 * (state.oilLevel / 100);
              const topY = 620 - fillHeight;
              return (
                <g>
                  <path
                    d={`M 230 615 L 245 620 L 775 620 L 790 615 L ${790 - (fillHeight * 0.15)} ${topY} Q 500 ${topY + (state.isRunning ? 3 : 0)} ${230 + (fillHeight * 0.15)} ${topY} Z`}
                    fill="url(#oilSumpGrad)"
                    opacity="0.85"
                  />
                  {/* Surface ripples when engine runs */}
                  {state.isRunning && (
                    <line
                      x1="260"
                      y1={topY}
                      x2="760"
                      y2={topY}
                      stroke="#fef3c7"
                      strokeWidth="2"
                      strokeDasharray="15 10"
                      opacity="0.7"
                    />
                  )}
                </g>
              );
            })()}

            {/* Baffle Plate (Тосны долгион хаагч ялтас) */}
            <line x1="320" y1="540" x2="480" y2="540" stroke="#475569" strokeWidth="4" strokeLinecap="round" />
            <line x1="560" y1="540" x2="720" y2="540" stroke="#475569" strokeWidth="4" strokeLinecap="round" />

            {/* Magnetic Drain Plug (Соронзон боолт) */}
            <rect x="250" y="620" width="24" height="12" rx="2" fill="#64748b" stroke="#94a3b8" />
            <circle cx="262" cy="623" r="3" fill="#cbd5e1" />

            {/* Label */}
            <text x="510" y="595" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="600">
              Картер (Тосны сан)
            </text>
            <text x="510" y="612" textAnchor="middle" fill="#cbd5e1" fontSize="10">
              {state.oilLevel}% Түвшин · {state.temperature}°C
            </text>
          </g>

          {/* 2. Тос сорох хоолой ба шүүр (Oil Pickup & Strainer) */}
          <g
            id="comp-pickup"
            className="cursor-pointer"
            onClick={() => onSelectComponent(COMPONENTS_DATA.find((c) => c.id === 'pickup')!)}
            onMouseEnter={() => setHoveredComponentId('pickup')}
            onMouseLeave={() => setHoveredComponentId(null)}
          >
            {/* Strainer Bell Funnel */}
            <path
              d="M 345 565 L 395 565 L 410 595 L 330 595 Z"
              fill="#1e293b"
              stroke={selectedComponentId === 'pickup' || hoveredComponentId === 'pickup' ? '#fbbf24' : '#64748b'}
              strokeWidth="2"
            />
            {/* Mesh Wire Screen Grid */}
            <line x1="335" y1="588" x2="405" y2="588" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3 3" />
            <line x1="340" y1="592" x2="400" y2="592" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3 3" />
            <circle cx="370" cy="578" r="4" fill={oilColor} />
          </g>

          {/* 3. Тосны насос (Oil Pump - Trochoid Gear) */}
          <g
            id="comp-pump"
            className="cursor-pointer"
            onClick={() => onSelectComponent(COMPONENTS_DATA.find((c) => c.id === 'pump')!)}
            onMouseEnter={() => setHoveredComponentId('pump')}
            onMouseLeave={() => setHoveredComponentId(null)}
          >
            {/* Pump Housing */}
            <rect
              x={220}
              y={415}
              width={75}
              height={70}
              rx="8"
              fill="#1e293b"
              stroke={selectedComponentId === 'pump' || hoveredComponentId === 'pump' ? '#fbbf24' : '#475569'}
              strokeWidth={selectedComponentId === 'pump' ? '3' : '2'}
            />
            {/* Outer Rotor Chamber */}
            <circle cx="258" cy="450" r="26" fill="#0f172a" stroke="#475569" strokeWidth="2" />
            {/* Inner Rotating Rotor */}
            <g transform={`rotate(${crankAngle} 258 450)`}>
              <circle cx="258" cy="450" r="17" fill="#334155" stroke="#94a3b8" strokeWidth="2" />
              <line x1="241" y1="450" x2="275" y2="450" stroke="#94a3b8" strokeWidth="3" />
              <line x1="258" y1="433" x2="258" y2="467" stroke="#94a3b8" strokeWidth="3" />
            </g>
            <text x="258" y="475" textAnchor="middle" fill="#e2e8f0" fontSize="9" fontWeight="600">
              НАСОС
            </text>
          </g>

          {/* 4. Редукцийн хавхлага (Pressure Relief Valve) */}
          <g
            id="comp-relief"
            className="cursor-pointer"
            onClick={() => onSelectComponent(COMPONENTS_DATA.find((c) => c.id === 'relief_valve')!)}
            onMouseEnter={() => setHoveredComponentId('relief_valve')}
            onMouseLeave={() => setHoveredComponentId(null)}
          >
            <rect
              x={185}
              y={395}
              width={45}
              height={30}
              rx="4"
              fill="#1e293b"
              stroke={selectedComponentId === 'relief_valve' || hoveredComponentId === 'relief_valve' ? '#fbbf24' : '#64748b'}
              strokeWidth="2"
            />
            {/* Spring & Ball */}
            <path d="M 190 410 Q 195 405 200 410 Q 205 415 210 410" fill="none" stroke="#94a3b8" strokeWidth="2" />
            <circle
              cx={state.reliefValveOpen ? '218' : '213'}
              cy="410"
              r="4"
              fill={state.reliefValveOpen ? '#f97316' : '#cbd5e1'}
            />
            <text x="207" y="420" textAnchor="middle" fill="#94a3b8" fontSize="7">
              {state.reliefValveOpen ? 'НЭЭЛТТЭЙ' : 'ХААЛТТАЙ'}
            </text>
          </g>

          {/* 5. Тосны шүүр (Oil Filter) */}
          <g
            id="comp-filter"
            className="cursor-pointer"
            onClick={() => onSelectComponent(COMPONENTS_DATA.find((c) => c.id === 'filter')!)}
            onMouseEnter={() => setHoveredComponentId('filter')}
            onMouseLeave={() => setHoveredComponentId(null)}
          >
            {/* Filter Canister */}
            <rect
              x={140}
              y={305}
              width={80}
              height={70}
              rx="6"
              fill="#1e293b"
              stroke={selectedComponentId === 'filter' || hoveredComponentId === 'filter' ? '#fbbf24' : '#475569'}
              strokeWidth={selectedComponentId === 'filter' ? '3' : '2'}
            />
            {/* Pleated Paper Filter Elements */}
            {[0, 1, 2, 3, 4].map((pIdx) => (
              <line
                key={`pleat-${pIdx}`}
                x1={155 + pIdx * 10}
                y1="315"
                x2={155 + pIdx * 10}
                y2="365"
                stroke={state.filterClogged ? '#78350f' : '#f59e0b'}
                strokeWidth="3"
                strokeLinecap="round"
              />
            ))}
            {/* Anti-drainback valve membrane */}
            <line x1="145" y1="365" x2="215" y2="365" stroke="#ef4444" strokeWidth="2" />
            <text x="180" y="360" textAnchor="middle" fill="#f8fafc" fontSize="9" fontWeight="600">
              ШҮҮР
            </text>
            <text x="180" y="371" textAnchor="middle" fill={state.filterClogged ? '#f87171' : '#a3e635'} fontSize="8">
              {state.filterClogged ? 'БӨГЛӨРСӨН' : 'ЦЭВЭР'}
            </text>
          </g>

          {/* 6. Шүүрийн тойрох (Bypass) хавхлага */}
          <g
            id="comp-bypass"
            className="cursor-pointer"
            onClick={() => onSelectComponent(COMPONENTS_DATA.find((c) => c.id === 'bypass_valve')!)}
            onMouseEnter={() => setHoveredComponentId('bypass_valve')}
            onMouseLeave={() => setHoveredComponentId(null)}
          >
            <circle
              cx="140"
              cy="315"
              r="10"
              fill="#1e293b"
              stroke={state.bypassValveOpen ? '#ef4444' : '#64748b'}
              strokeWidth="2"
            />
            <path
              d="M 135 315 L 145 315"
              stroke={state.bypassValveOpen ? '#ef4444' : '#94a3b8'}
              strokeWidth="3"
            />
            {state.bypassValveOpen && (
              <circle cx="140" cy="315" r="14" fill="none" stroke="#ef4444" strokeWidth="1.5" className="animate-ping" />
            )}
          </g>

          {/* 7. Тос хөргөгч (Oil Cooler / Heat Exchanger) */}
          <g
            id="comp-cooler"
            className="cursor-pointer"
            onClick={() => onSelectComponent(COMPONENTS_DATA.find((c) => c.id === 'cooler')!)}
            onMouseEnter={() => setHoveredComponentId('cooler')}
            onMouseLeave={() => setHoveredComponentId(null)}
          >
            <rect
              x={140}
              y={210}
              width={80}
              height={50}
              rx="6"
              fill="#1e293b"
              stroke={selectedComponentId === 'cooler' || hoveredComponentId === 'cooler' ? '#fbbf24' : '#475569'}
              strokeWidth="2"
            />
            {/* Heat fins / coolant flow lines */}
            {[0, 1, 2].map((finIdx) => (
              <line
                key={`fin-${finIdx}`}
                x1="150"
                y1={222 + finIdx * 12}
                x2="210"
                y2={222 + finIdx * 12}
                stroke="#38bdf8"
                strokeWidth="2"
                strokeDasharray="4 3"
              />
            ))}
            <text x="180" y="240" textAnchor="middle" fill="#f8fafc" fontSize="8" fontWeight="600">
              ТОС ХӨРГӨГЧ
            </text>
          </g>

          {/* 8. Даралтын мэдрэгч (Oil Pressure Sensor) */}
          <g
            id="comp-sensor"
            className="cursor-pointer"
            onClick={() => onSelectComponent(COMPONENTS_DATA.find((c) => c.id === 'sensor')!)}
            onMouseEnter={() => setHoveredComponentId('sensor')}
            onMouseLeave={() => setHoveredComponentId(null)}
          >
            {/* Hexagonal sensor body */}
            <rect
              x={240}
              y={210}
              width={35}
              height={26}
              rx="4"
              fill="#1e293b"
              stroke={selectedComponentId === 'sensor' || hoveredComponentId === 'sensor' ? '#fbbf24' : '#64748b'}
              strokeWidth="2"
            />
            {/* Terminal pin */}
            <line x1="257" y1="210" x2="257" y2="195" stroke="#94a3b8" strokeWidth="3" />
            <circle cx="257" cy="193" r="3" fill="#38bdf8" />
            <text x="257" y="227" textAnchor="middle" fill="#38bdf8" fontSize="7" fontWeight="bold">
              PS
            </text>
          </g>

          {/* 9. Гол магистраль суваг (Main Gallery Label Bar) */}
          <g
            id="comp-gallery"
            className="cursor-pointer"
            onClick={() => onSelectComponent(COMPONENTS_DATA.find((c) => c.id === 'gallery')!)}
            onMouseEnter={() => setHoveredComponentId('gallery')}
            onMouseLeave={() => setHoveredComponentId(null)}
          >
            <rect
              x={440}
              y={265}
              width={260}
              height={30}
              rx="6"
              fill="#0f172a"
              stroke={selectedComponentId === 'gallery' || hoveredComponentId === 'gallery' ? '#fbbf24' : '#475569'}
              strokeWidth="2"
              opacity="0.9"
            />
            <text x="570" y="284" textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="600">
              Гол Магистраль (Даралтат тосны суваг)
            </text>
          </g>

          {/* 10. Тахир голын холхивчуудын товчлуур (Crank bearings) */}
          <g
            id="comp-crank-bearings"
            className="cursor-pointer"
            onClick={() => onSelectComponent(COMPONENTS_DATA.find((c) => c.id === 'crank_bearings')!)}
            onMouseEnter={() => setHoveredComponentId('crank_bearings')}
            onMouseLeave={() => setHoveredComponentId(null)}
          >
            <rect
              x={440}
              y={470}
              width={260}
              height={26}
              rx="6"
              fill="#0f172a"
              stroke={selectedComponentId === 'crank_bearings' || hoveredComponentId === 'crank_bearings' ? '#fbbf24' : '#475569'}
              strokeWidth="2"
              opacity="0.95"
            />
            <text x="570" y="487" textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="600">
              Тахир голын үндсэн ба шатуны вкладыш
            </text>
          </g>

          {/* 11. Valvetrain hotspot (Хуваарилах гол ба клапан) */}
          <g
            id="comp-valvetrain"
            className="cursor-pointer"
            onClick={() => onSelectComponent(COMPONENTS_DATA.find((c) => c.id === 'valvetrain')!)}
            onMouseEnter={() => setHoveredComponentId('valvetrain')}
            onMouseLeave={() => setHoveredComponentId(null)}
          >
            <rect
              x={440}
              y={52}
              width={260}
              height={24}
              rx="4"
              fill="#0f172a"
              stroke={selectedComponentId === 'valvetrain' || hoveredComponentId === 'valvetrain' ? '#fbbf24' : '#475569'}
              strokeWidth="2"
              opacity="0.95"
            />
            <text x="570" y="68" textAnchor="middle" fill="#f8fafc" fontSize="10" fontWeight="600">
              Хуваарилах гол (Camshaft) ба Клапан механизм
            </text>
          </g>

          {/* 12. Piston Jets hotspot */}
          <g
            id="comp-piston-jets"
            className="cursor-pointer"
            onClick={() => onSelectComponent(COMPONENTS_DATA.find((c) => c.id === 'piston_jets')!)}
            onMouseEnter={() => setHoveredComponentId('piston_jets')}
            onMouseLeave={() => setHoveredComponentId(null)}
          >
            <circle
              cx="355"
              cy="240"
              r="8"
              fill="#1e293b"
              stroke={selectedComponentId === 'piston_jets' || hoveredComponentId === 'piston_jets' ? '#fbbf24' : '#64748b'}
              strokeWidth="2"
            />
            <text x="355" y="243" textAnchor="middle" fill="#cbd5e1" fontSize="7" fontWeight="bold">
              JET
            </text>
          </g>

          {/* Informational Callout Badge */}
          <g transform="translate(760, 520)">
            <rect x="0" y="0" width="125" height="45" rx="6" fill="#0f172a" stroke="#334155" strokeWidth="1" />
            <text x="12" y="18" fill="#94a3b8" fontSize="9">
              Шингэний хальс:
            </text>
            <text x="12" y="34" fill="#38bdf8" fontSize="12" fontWeight="bold" fontFamily="monospace">
              {(0.035 * (state.oilViscosityCst / 12) * (Math.max(1, state.rpm) / 2000)).toFixed(3)} мм
            </text>
          </g>
          </g>
        </svg>

        {/* Hover / Click Helper Overlay */}
        <div className="absolute bottom-3 left-4 text-xs text-slate-400 bg-slate-950/80 backdrop-blur-sm border border-slate-800 rounded-lg px-3 py-1.5 flex items-center gap-2 pointer-events-none">
          <Info className="w-3.5 h-3.5 text-amber-400" />
          <span>Эд анги дээр дарж дэлгэрэнгүй ажиллах зарчим, үзүүлэлт, эвдрэлийн шалтгааныг үзнэ үү.</span>
        </div>
      </div>
    </div>
  );
};
