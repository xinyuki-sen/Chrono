"use client";
import { useState, useEffect } from "react";
import { MagnifyingGlassIcon, ClipboardDocumentIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface Prompt {
  title: string;
  category: string;
  description: string;
}

export default function PromptsPage() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [selected, setSelected] = useState<Prompt | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/prompts.json").then(r => r.json()).then(setPrompts).catch(() => {});
  }, []);

  const categories = ["All", ...Array.from(new Set(prompts.map(p => p.category))).sort()];
  const filtered = prompts.filter(p => {
    const matchCat = cat === "All" || p.category === cat;
    const matchQ = !q || p.title.toLowerCase().includes(q.toLowerCase()) || p.description.toLowerCase().includes(q.toLowerCase());
    return matchCat && matchQ;
  });

  const handleCopy = () => {
    if (!selected) return;
    navigator.clipboard.writeText(selected.description);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="px-6 py-6 max-w-7xl mx-auto flex">
      <div className="flex-1 transition-all duration-300">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Prompt Library</h1>
          <p className="text-slate-500 text-sm mt-1">Curated AI prompts for coding, writing, design, and more · {prompts.length} prompts</p>
        </div>

        {/* Search */}
        <div className="relative mb-4 max-w-3xl">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text" placeholder="Search prompts..."
            value={q} onChange={e => setQ(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap mb-6">
          {categories.map(c => (
            <button key={c} onClick={() => setCat(c)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                cat === c ? "bg-slate-900 text-white" : "bg-white border border-slate-200 text-slate-600 hover:border-slate-400"
              }`}>
              {c}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-10">
          {filtered.map((p, i) => (
            <button key={i} onClick={() => setSelected(p)}
              className={`bg-white rounded-2xl border ${selected === p ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-100'} shadow-sm hover:shadow-md hover:-translate-y-0.5 p-5 flex flex-col gap-3 group text-left transition-all duration-200 h-40`}>
              <div className="flex items-start justify-between w-full">
                <h3 className="font-semibold text-slate-900 text-sm leading-snug line-clamp-2">{p.title}</h3>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 shrink-0 ml-2">
                  {p.category}
                </span>
              </div>
              <p className="text-slate-500 text-xs mt-1 line-clamp-3 leading-relaxed">{p.description}</p>
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-3 text-center py-16 text-slate-400 text-sm">No prompts found.</div>
          )}
        </div>
      </div>

      {/* Slide-over panel */}
      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity" onClick={() => setSelected(null)}></div>
          <div className="w-96 max-w-full bg-white h-full shadow-2xl relative flex flex-col animate-slide-in-right">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="font-semibold text-slate-800 text-sm uppercase tracking-wide">Prompt Preview</h2>
              <button onClick={() => setSelected(null)} className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 transition-colors">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 mb-4 inline-block border border-blue-100">
                {selected.category}
              </span>
              <h3 className="text-xl font-bold text-slate-900 mb-4">{selected.title}</h3>
              
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
                {selected.description}
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-white">
              <button 
                onClick={handleCopy}
                className={`w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                  copied ? 'bg-green-500 text-white' : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
              >
                {copied ? <CheckIcon className="w-4 h-4 stroke-2" /> : <ClipboardDocumentIcon className="w-4 h-4 stroke-2" />}
                {copied ? 'Copied!' : 'Copy Prompt'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
