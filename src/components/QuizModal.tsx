import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../data/quizData';
import { QuizQuestion } from '../types';
import { Award, CheckCircle, XCircle, RotateCcw, ArrowRight, Printer, Sparkles } from 'lucide-react';

export const QuizModal: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [studentName, setStudentName] = useState('Суралцагч');
  const [isCertificateView, setIsCertificateView] = useState(false);

  const question = QUIZ_QUESTIONS[currentIdx];
  const selectedAnswer = selectedAnswers[currentIdx];

  const handleSelectOption = (optIdx: number) => {
    if (showExplanation) return;
    setSelectedAnswers((prev) => ({ ...prev, [currentIdx]: optIdx }));
    setShowExplanation(true);
  };

  const handleNext = () => {
    setShowExplanation(false);
    if (currentIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedAnswers({});
    setShowExplanation(false);
    setIsCompleted(false);
    setIsCertificateView(false);
  };

  // Calculate score
  const correctCount = Object.entries(selectedAnswers).filter(
    ([qIdx, ansIdx]) => QUIZ_QUESTIONS[Number(qIdx)].correctAnswerIndex === ansIdx
  ).length;

  const percentage = Math.round((correctCount / QUIZ_QUESTIONS.length) * 100);
  const isPassed = percentage >= 70;

  return (
    <div className="w-full max-w-4xl mx-auto py-2">
      {!isCompleted ? (
        /* ================= IN-PROGRESS QUIZ SCREEN ================= */
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 sm:p-8 shadow-2xl flex flex-col gap-5 sm:gap-6">
          {/* Progress Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 sm:pb-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-amber-400">
                Хичээл шалгах сорил
              </span>
              <h2 className="text-base sm:text-lg font-bold text-slate-100 mt-0.5">
                Асуулт {currentIdx + 1} / {QUIZ_QUESTIONS.length}
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-400">
              {question.category}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-400 transition-all duration-300"
              style={{ width: `${((currentIdx + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
            />
          </div>

          {/* Question Text */}
          <div className="py-1">
            <h3 className="text-sm sm:text-lg font-medium text-slate-100 leading-relaxed">
              {question.question}
            </h3>
          </div>

          {/* Options with mobile touch ergonomics */}
          <div className="space-y-2.5 sm:space-y-3">
            {question.options.map((opt, oIdx) => {
              const isChosen = selectedAnswer === oIdx;
              const isCorrect = oIdx === question.correctAnswerIndex;

              let style = 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700 active:scale-[0.99]';

              if (showExplanation) {
                if (isCorrect) {
                  style = 'bg-emerald-500/15 border-emerald-500 text-emerald-200';
                } else if (isChosen && !isCorrect) {
                  style = 'bg-rose-500/15 border-rose-500 text-rose-200';
                }
              }

              return (
                <button
                  key={oIdx}
                  disabled={showExplanation}
                  onClick={() => handleSelectOption(oIdx)}
                  className={`w-full text-left p-3.5 sm:p-4 rounded-xl border text-xs sm:text-sm transition-all flex items-center justify-between min-h-[48px] ${style}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs w-6 h-6 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center shrink-0">
                      {String.fromCharCode(65 + oIdx)}
                    </span>
                    <span className="leading-snug">{opt}</span>
                  </div>
                  {showExplanation && isCorrect && (
                    <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 ml-2" />
                  )}
                  {showExplanation && isChosen && !isCorrect && (
                    <XCircle className="w-5 h-5 text-rose-400 shrink-0 ml-2" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Feedback & Next Button */}
          {showExplanation && (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 animate-in fade-in">
              <div className="flex items-center gap-2">
                {selectedAnswer === question.correctAnswerIndex ? (
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" /> Зөв хариуллаа!
                  </span>
                ) : (
                  <span className="text-xs font-bold text-rose-400 flex items-center gap-1">
                    <XCircle className="w-4 h-4" /> Буруу хариуллаа.
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>Тайлбар:</strong> {question.explanation}
              </p>

              <button
                onClick={handleNext}
                className="w-full py-3 text-xs font-semibold rounded-xl bg-amber-400 text-slate-950 hover:bg-amber-300 transition-colors flex items-center justify-center gap-1.5 min-h-[44px]"
              >
                {currentIdx < QUIZ_QUESTIONS.length - 1 ? 'Дараагийн асуулт' : 'Үр дүнг харах'}{' '}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      ) : !isCertificateView ? (
        /* ================= QUIZ RESULT SCREEN ================= */
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 sm:p-10 shadow-2xl text-center space-y-5 sm:space-y-6">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 mx-auto flex items-center justify-center">
            <Award className="w-7 h-7 sm:w-8 sm:h-8" />
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-100">Сорилын дүгнэлт</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Та нийт {QUIZ_QUESTIONS.length} асуултаас {correctCount}-д зөв хариуллаа.
            </p>
          </div>

          {/* Score percentage circle */}
          <div className="text-3xl sm:text-4xl font-extrabold font-mono text-amber-400">
            {percentage}%
          </div>

          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
            {isPassed
              ? 'Баяр хүргэе! Та автомашины хөдөлгүүрийн тосолгооны системийн онол, ажиллах зарчим болон оношилгоог амжилттай эзэмшсэн тул Гэрчилгээ авах болзлоо хангалаа.'
              : 'Харамсалтай нь тэнцэх оноо (70%)-д хүрсэнгүй. Онолын хичээл болон симуляцийг дахин нягталж үзээд шалгалтаа дахин өгнө үү.'}
          </p>

          {isPassed && (
            <div className="max-w-xs mx-auto text-left space-y-1.5">
              <label className="text-xs text-slate-400">Гэрчилгээнд бичигдэх таны нэр:</label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Овог нэрээ бичнэ үү"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-amber-400 min-h-[44px]"
              />
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
            <button
              onClick={handleRestart}
              className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors flex items-center justify-center gap-1.5 min-h-[44px]"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Дахин өгөх
            </button>

            {isPassed && (
              <button
                onClick={() => setIsCertificateView(true)}
                className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold rounded-xl bg-amber-400 text-slate-950 hover:bg-amber-300 transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 min-h-[44px]"
              >
                <Award className="w-4 h-4" /> Гэрчилгээгээ үзэх
              </button>
            )}
          </div>
        </div>
      ) : (
        /* ================= OFFICIAL CERTIFICATE VIEW ================= */
        <div className="flex flex-col items-center gap-4">
          <div
            id="certificate-print-area"
            className="w-full max-w-3xl rounded-2xl border-2 sm:border-4 border-amber-500/40 bg-gradient-to-b from-slate-900 to-slate-950 p-5 sm:p-10 shadow-2xl relative flex flex-col justify-between overflow-hidden min-h-[440px]"
          >
            {/* Background watermark seal */}
            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
              <Award className="w-64 sm:w-96 h-64 sm:h-96 text-amber-400" />
            </div>

            {/* Certificate Top Header */}
            <div className="text-center space-y-1">
              <span className="text-[10px] sm:text-[11px] font-mono tracking-widest text-amber-400 uppercase">
                CERTIFICATE OF COMPLETION · СУРГАЛТЫН ГЭРЧИЛГЭЭ
              </span>
              <h1 className="text-lg sm:text-2xl font-extrabold text-slate-100 tracking-tight">
                МЭРГЭШСЭН СУРАЛЦАГЧИЙН БАТЛАМЖ
              </h1>
            </div>

            {/* Body Text */}
            <div className="text-center space-y-2 sm:space-y-3 my-4">
              <p className="text-[11px] sm:text-xs text-slate-400">Энэхүү батламжийг</p>
              <h2 className="text-lg sm:text-2xl font-bold text-amber-300 underline underline-offset-8 decoration-amber-400/50">
                {studentName || 'Суралцагч'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed pt-2">
                нь <strong>"Автомашины хөдөлгүүрийн тосолгооны систем, түүний бүтэц, гидродинамик ажиллах зарчим ба оношилгоо"</strong> сургалтыг {percentage}% амжилттай дүүргэсэн тул олгов.
              </p>
            </div>

            {/* Signatures & Metadata Footer */}
            <div className="flex items-end justify-between border-t border-slate-800 pt-4 text-xs gap-2">
              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-400 block">Олгосон огноо:</span>
                <span className="font-mono text-slate-200 text-[11px]">
                  {new Date().toLocaleDateString('mn-MN')}
                </span>
              </div>

              <div className="text-center space-y-1">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-amber-400 flex items-center justify-center mx-auto text-amber-400 font-bold text-xs">
                  {percentage}%
                </div>
                <span className="text-[9px] text-amber-400 font-mono">БАТЛАГДСАН</span>
              </div>

              <div className="space-y-0.5 text-right">
                <span className="text-[10px] text-slate-400 block">Сургалтын хөтөлбөр:</span>
                <span className="font-semibold text-slate-200 text-[11px]">Авто Механик</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => window.print()}
              className="flex-1 sm:flex-none px-4 py-2.5 text-xs font-semibold rounded-xl bg-amber-400 text-slate-950 hover:bg-amber-300 transition-colors flex items-center justify-center gap-1.5 shadow-sm min-h-[44px]"
            >
              <Printer className="w-4 h-4" /> Гэрчилгээ хэвлэх
            </button>
            <button
              onClick={() => setIsCertificateView(false)}
              className="px-4 py-2.5 text-xs font-medium rounded-xl bg-slate-800 text-slate-300 hover:text-white transition-colors min-h-[44px]"
            >
              Буцах
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
