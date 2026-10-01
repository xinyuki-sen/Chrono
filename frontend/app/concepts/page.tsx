"use client";
import { useState, useEffect } from "react";
import { MagnifyingGlassIcon, XMarkIcon, SparklesIcon, CalculatorIcon, LightBulbIcon } from "@heroicons/react/24/outline";

interface Concept {
  id: string;
  name: string;
  category: string;
  level: string;
  simple_definition: string;
  analogy: string;
  why_it_matters: string;
  math_intuition?: string;
  tags: string[];
}

export default function ConceptsPage() {
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [selected, setSelected] = useState<Concept | null>(null);

  useEffect(() => {
    fetch("/concepts.json").then(r => r.json()).then(setConcepts).catch(() => {});
  }, []);

  const categories = ["All", ...Array.from(new Set(concepts.map(c => c.category))).sort()];
  const filtered = concepts.filter(c => {
    const matchCat = cat === "All" || c.category === cat;
    const matchQ = !q || c.name.toLowerCase().includes(q.toLowerCase()) || c.simple_definition.toLowerCase().includes(q.toLowerCase());
    return matchCat && matchQ;
  });

  return (
    <div className="px-6 py-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <SparklesIcon className="w-6 h-6 text-indigo-500 stroke-2" />
          AI Concepts & Orbit
        </h1>
        <p className="text-slate-500 text-sm mt-1">Demystifying AI jargon, architectures, and math.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1 max-w-md">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text" placeholder="Search concepts..."
            value={q} onChange={e => setQ(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="flex gap-2 flex-wrap flex-1">
          {categories.map(c => (
            <button key={c} onClick={() => setCat(c)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                cat === c ? "bg-indigo-600 text-white" : "bg-white border border-slate-200 text-slate-600 hover:border-slate-400"
              }`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pb-12">
        {filtered.map(c => (
          <button key={c.id} onClick={() => setSelected(c)}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 p-5 text-left transition-all group flex flex-col h-48">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-slate-900 text-base group-hover:text-indigo-600 transition-colors">{c.name}</h3>
            </div>
            <div className="flex gap-2 mb-3">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-500 uppercase tracking-wide border border-slate-200">{c.category}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-600 uppercase tracking-wide border border-indigo-100">{c.level}</span>
            </div>
            <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed flex-1">{c.simple_definition}</p>
          </button>
        ))}
      </div>

      {/* Modal Overlay */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setSelected(null)}></div>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col relative z-10 animate-fade-in-up">
            <div className="p-5 sm:p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
              <div>
                <div className="flex gap-2 mb-2">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-slate-100 text-slate-500 uppercase tracking-wide border border-slate-200">{selected.category}</span>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-600 uppercase tracking-wide border border-indigo-100">{selected.level}</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900">{selected.name}</h2>
              </div>
              <button onClick={() => setSelected(null)} className="p-2 rounded-xl hover:bg-slate-200 text-slate-500 transition-colors bg-white border border-slate-200 shadow-sm">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-2 uppercase tracking-wider flex items-center gap-2">
                  Definition
                </h4>
                <p className="text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">{selected.simple_definition}</p>
              </div>

              {selected.analogy && (
                <div>
                  <h4 className="text-sm font-bold text-amber-700 mb-2 uppercase tracking-wider flex items-center gap-2">
                    <LightBulbIcon className="w-4 h-4 stroke-2" /> Analogy
                  </h4>
                  <p className="text-amber-900 leading-relaxed bg-amber-50 p-4 rounded-xl border border-amber-100/50">{selected.analogy}</p>
                </div>
              )}

              {selected.why_it_matters && (
                <div>
                  <h4 className="text-sm font-bold text-emerald-700 mb-2 uppercase tracking-wider flex items-center gap-2">
                    Why it Matters
                  </h4>
                  <p className="text-emerald-900 leading-relaxed bg-emerald-50 p-4 rounded-xl border border-emerald-100/50">{selected.why_it_matters}</p>
                </div>
              )}

              {selected.math_intuition && (
                <div>
                  <h4 className="text-sm font-bold text-blue-700 mb-2 uppercase tracking-wider flex items-center gap-2">
                    <CalculatorIcon className="w-4 h-4 stroke-2" /> Math Intuition
                  </h4>
                  <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl">
                    <code className="text-sm text-blue-800 font-mono block whitespace-pre-wrap">{selected.math_intuition}</code>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
