"use client";
import { useState, useEffect } from "react";
import { ChevronDownIcon, PresentationChartLineIcon } from "@heroicons/react/24/outline";

interface Model {
  id: string;
  name: string;
  provider: string;
  category: string;
  arena_elo: number;
  context_window: string;
  price_input: number;
  price_output: number;
  strengths: string;
  link: string;
  license_type: string;
}

export default function ModelsPage() {
  const [models, setModels] = useState<Model[]>([]);
  const [cat, setCat] = useState("All");
  const [sort, setSort] = useState("elo");

  useEffect(() => {
    fetch("/models.json").then(r => r.json()).then(setModels).catch(() => {});
  }, []);

  const categories = ["All", ...Array.from(new Set(models.map(m => m.category))).sort()];
  
  const filtered = models.filter(m => cat === "All" || m.category === cat);
  
  const sorted = [...filtered].sort((a, b) => {
    if (sort === "elo") return b.arena_elo - a.arena_elo;
    if (sort === "price") return (a.price_input + a.price_output) - (b.price_input + b.price_output);
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="px-6 py-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">AI Models Leaderboard</h1>
        <p className="text-slate-500 text-sm mt-1">Compare the best frontier models by performance, cost, and capabilities.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
        <div className="flex gap-2 flex-wrap">
          {categories.map(c => (
            <button key={c} onClick={() => setCat(c)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                cat === c ? "bg-slate-900 text-white" : "bg-white border border-slate-200 text-slate-600 hover:border-slate-400"
              }`}>
              {c}
            </button>
          ))}
        </div>
        
        <div className="relative">
          <select 
            value={sort} onChange={e => setSort(e.target.value)}
            className="appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2 pr-10 text-sm font-medium text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="elo">Sort by Elo Score (Highest)</option>
            <option value="price">Sort by Price (Lowest)</option>
            <option value="name">Sort by Name</option>
          </select>
          <ChevronDownIcon className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pb-10">
        {sorted.map(m => (
          <div key={m.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col group relative">
            <div className={`h-1.5 w-full ${m.provider === 'OpenAI' ? 'bg-green-500' : m.provider === 'Anthropic' ? 'bg-amber-600' : m.provider === 'Google DeepMind' ? 'bg-blue-500' : 'bg-purple-500'}`}></div>
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="text-xs font-medium text-slate-400 mb-1">{m.provider}</div>
                  <h3 className="text-lg font-bold text-slate-900 leading-tight">{m.name}</h3>
                </div>
                <div className="flex flex-col items-end">
                  <span className="inline-flex items-center gap-1 bg-slate-900 text-white text-xs font-bold px-2 py-1 rounded-lg">
                    <PresentationChartLineIcon className="w-3.5 h-3.5" />
                    {m.arena_elo}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium mt-1 uppercase tracking-wider">Elo Score</span>
                </div>
              </div>
              
              <div className="flex gap-2 mb-4">
                <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">{m.category}</span>
                <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">{m.license_type}</span>
              </div>

              <p className="text-sm text-slate-600 mb-5 line-clamp-2 flex-1">{m.strengths}</p>
              
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 mb-4">
                <div>
                  <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide mb-1">Context</div>
                  <div className="text-xs font-medium text-slate-800">{m.context_window}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide mb-1">Price / 1M Tkns</div>
                  <div className="text-xs font-medium text-slate-800">${m.price_input} in / ${m.price_output} out</div>
                </div>
              </div>
              
              <a href={m.link} target="_blank" rel="noopener noreferrer" className="w-full block text-center py-2 rounded-xl text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                View Model Docs
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
