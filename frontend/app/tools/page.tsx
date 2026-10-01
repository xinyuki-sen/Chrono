"use client";
import { useState, useEffect } from "react";
import { MagnifyingGlassIcon, ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";

interface Tool {
  title: string;
  category: string;
  description: string;
  link: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  "Coding": "bg-blue-100 text-blue-700",
  "Image": "bg-purple-100 text-purple-700",
  "Audio": "bg-green-100 text-green-700",
  "Video": "bg-red-100 text-red-700",
  "Productivity": "bg-orange-100 text-orange-700",
  "Writing": "bg-yellow-100 text-yellow-700",
  "Research": "bg-cyan-100 text-cyan-700",
  "default": "bg-slate-100 text-slate-600",
};

export default function ToolsPage() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");

  useEffect(() => {
    fetch("/tools.json").then(r => r.json()).then(setTools).catch(() => {});
  }, []);

  const categories = ["All", ...Array.from(new Set(tools.map(t => t.category))).sort()];
  const filtered = tools.filter(t => {
    const matchCat = cat === "All" || t.category === cat;
    const matchQ = !q || t.title.toLowerCase().includes(q.toLowerCase()) || t.description?.toLowerCase().includes(q.toLowerCase());
    return matchCat && matchQ;
  });

  return (
    <div className="px-6 py-6 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">AI Tools Directory</h1>
        <p className="text-slate-500 text-sm mt-1">Curated tools, updated regularly · {tools.length} tools</p>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text" placeholder="Search tools..."
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((tool, i) => {
          const colorClass = CATEGORY_COLORS[tool.category] || CATEGORY_COLORS.default;
          return (
            <a key={i} href={tool.link} target="_blank" rel="noopener noreferrer"
              className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 p-5 flex flex-col gap-3 group">
              <div className="flex items-start justify-between">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${colorClass}`}>
                  {tool.category}
                </span>
                <ArrowTopRightOnSquareIcon className="w-4 h-4 text-slate-300 group-hover:text-blue-500" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 text-sm leading-snug">{tool.title}</h3>
                {tool.description && (
                  <p className="text-slate-500 text-xs mt-1 line-clamp-2 leading-relaxed">{tool.description}</p>
                )}
              </div>
            </a>
          );
        })}
        {filtered.length === 0 && (
          <div className="col-span-3 text-center py-16 text-slate-400 text-sm">No tools found.</div>
        )}
      </div>
    </div>
  );
}
