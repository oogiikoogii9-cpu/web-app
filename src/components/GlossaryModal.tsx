import React, { useState } from 'react';
import { GLOSSARY_TERMS } from '../data/glossaryData';
import { GlossaryTerm } from '../types';
import { Search } from 'lucide-react';

export const GlossaryModal: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(GLOSSARY_TERMS.map((t) => t.category)))];

  const filteredTerms = GLOSSARY_TERMS.filter((term) => {
    const matchesSearch =
      term.mn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      term.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      term.definition.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' || term.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full max-w-5xl mx-auto py-2 flex flex-col gap-5">
      {/* Search & Header */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 sm:p-6 shadow-xl flex flex-col gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-amber-400">
            Монгол-Англи нэр томьёо
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight mt-1">
            Тосолгооны системийн толь бичиг
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Автомашины онол, засвар, үйлчилгээнд хэрэглэгддэг техникийн нэр томьёо, тайлбар.
          </p>
        </div>

        {/* Search input & category chips */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Монгол эсвэл англи нэрээр хайх..."
              className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-amber-400 min-h-[44px]"
            />
          </div>

          {/* Category buttons - Horizontally Scrollable on Mobile */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none -mx-1 px-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-xl whitespace-nowrap transition-all min-h-[38px] ${
                  selectedCategory === cat
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat === 'all' ? 'Бүгд' : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Terms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
        {filteredTerms.map((term, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 sm:p-5 flex flex-col justify-between gap-3 shadow-lg hover:border-slate-700 transition-colors"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-100">{term.mn}</h3>
                  <p className="text-xs font-mono text-amber-400 mt-0.5">{term.en}</p>
                </div>
                <span className="text-[10px] sm:text-[11px] font-medium text-slate-400 bg-slate-950 px-2 py-0.5 rounded-lg border border-slate-800 shrink-0">
                  {term.category}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mt-2.5">
                {term.definition}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 italic">
              Жишээ: "{term.example}"
            </div>
          </div>
        ))}

        {filteredTerms.length === 0 && (
          <div className="col-span-2 text-center py-12 text-slate-400 text-sm">
            Таны хайсан түлхүүр үгээр нэр томьёо олдсонгүй.
          </div>
        )}
      </div>
    </div>
  );
};
