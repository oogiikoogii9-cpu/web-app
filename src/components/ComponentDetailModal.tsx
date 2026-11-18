import React from 'react';
import { LubricationComponent } from '../types';
import { X, Wrench, AlertTriangle, Layers, ArrowRight } from 'lucide-react';

interface ComponentDetailModalProps {
  component: LubricationComponent | null;
  onClose: () => void;
  onGoToLesson?: (componentId: string) => void;
}

export const ComponentDetailModal: React.FC<ComponentDetailModalProps> = ({
  component,
  onClose,
  onGoToLesson,
}) => {
  if (!component) return null;

  // Image mapping for generated high-res visual assets
  const getImageForComponent = (id: string) => {
    switch (id) {
      case 'filter':
      case 'bypass_valve':
        return '/src/assets/images/diagram_oil_filter_cutaway_1791422424010.jpg';
      case 'pump':
      case 'relief_valve':
        return '/src/assets/images/diagram_oil_pump_gears_1791422437860.jpg';
      case 'sump':
      case 'gallery':
      case 'crank_bearings':
      case 'valvetrain':
        return '/src/assets/images/hero_engine_lubrication_1791422411549.jpg';
      default:
        return null;
    }
  };

  const assetImage = getImageForComponent(component.id);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[88vh] sm:max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl flex flex-col">
        {/* Mobile Drag Handle Indicator */}
        <div className="w-12 h-1.5 bg-slate-700 rounded-full mx-auto my-2.5 sm:hidden shrink-0" />

        {/* Header Bar */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-800 bg-slate-900/95 backdrop-blur-md px-5 sm:px-6 py-3 sm:py-4">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
              {component.nameMn}
            </h3>
            <p className="text-xs text-amber-400 font-mono mt-0.5">{component.nameEn}</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Хаах"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 space-y-5 sm:space-y-6 text-sm text-slate-300">
          {/* Optional High-Res Technical Cutaway Visual */}
          {assetImage && (
            <div className="relative w-full h-44 sm:h-56 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
              <img
                src={assetImage}
                alt={component.nameMn}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent flex items-end p-3 sm:p-4">
                <span className="text-[11px] font-mono text-slate-300">
                  Инженерийн огтлол · 3D дүрслэл
                </span>
              </div>
            </div>
          )}

          {/* Short description */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-slate-950/70 border border-slate-800/80">
            <p className="text-xs sm:text-sm leading-relaxed text-slate-200">
              {component.fullDescription}
            </p>
          </div>

          {/* Operational Principles */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-2 mb-2.5">
              <Layers className="w-4 h-4" />
              Ажиллах үндсэн зарчим ба үүрэг
            </h4>
            <ul className="space-y-2">
              {component.operationalPrinciples.map((principle, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                  <span className="leading-relaxed">{principle}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Technical Specifications Grid */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
              Техникийн ажлын үзүүлэлтүүд
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {component.specs.map((spec, sIdx) => (
                <div
                  key={sIdx}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col gap-1"
                >
                  <span className="text-[11px] text-slate-400">{spec.label}</span>
                  <span className="text-xs font-mono font-medium text-amber-300">
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Failure Modes & Symptoms */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-rose-400 flex items-center gap-2 mb-2.5">
              <AlertTriangle className="w-4 h-4" />
              Түгээмэл гэмтэл ба илрэх шинж тэмдэг
            </h4>
            <div className="space-y-2.5">
              {component.failureModes.map((failure, fIdx) => (
                <div
                  key={fIdx}
                  className="p-3.5 rounded-xl bg-rose-500/5 border border-rose-500/20 space-y-1.5 text-xs"
                >
                  <div className="font-semibold text-rose-300 flex items-center gap-1.5">
                    <span className="text-slate-400">Шинж тэмдэг:</span> {failure.symptom}
                  </div>
                  <div className="text-slate-300">
                    <span className="text-slate-400">Үндсэн шалтгаан:</span> {failure.cause}
                  </div>
                  <div className="text-slate-300">
                    <span className="text-slate-400">Үр дагавар:</span> {failure.consequence}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Maintenance & Service Advice */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-2 mb-2.5">
              <Wrench className="w-4 h-4" />
              Засвар үйлчилгээний зөвлөмж
            </h4>
            <div className="space-y-2">
              {component.maintenanceAdvice.map((advice, mIdx) => (
                <div
                  key={mIdx}
                  className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-xs text-slate-300 flex items-start gap-2 leading-relaxed"
                >
                  <span className="text-emerald-400 font-bold shrink-0">✓</span>
                  <span>{advice}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 border-t border-slate-800 bg-slate-900/95 backdrop-blur-md px-5 sm:px-6 py-3 flex items-center justify-between gap-3 safe-area-pb">
          {onGoToLesson ? (
            <button
              onClick={() => {
                onClose();
                onGoToLesson(component.id);
              }}
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 min-h-[44px] py-1"
            >
              Онолын хичээл <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={onClose}
            className="px-5 py-2.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 active:bg-amber-500 rounded-xl transition-all min-h-[44px] flex items-center justify-center shadow-md shadow-amber-500/20"
          >
            Ойлголоо
          </button>
        </div>
      </div>
    </div>
  );
};
