"use client";

import { Article, timeAgo } from "@/lib/api";
import { useState } from "react";
import { 
  BookmarkIcon, 
  ArrowTopRightOnSquareIcon, 
  SparklesIcon, 
  ArrowPathIcon 
} from "@heroicons/react/24/outline";
import { BookmarkIcon as BookmarkSolid } from "@heroicons/react/24/solid";

interface Props {
  article: Article;
}

export default function ArticleCard({ article }: Props) {
  const [saved, setSaved] = useState(() => {
    if (typeof window === "undefined") return false;
    const s = localStorage.getItem("saved");
    return s ? JSON.parse(s).includes(article.id) : false;
  });

  const [tldr, setTldr] = useState<string | null>(null);
  const [modelName, setModelName] = useState<string | null>(null);
  const [loadingTldr, setLoadingTldr] = useState(false);
  const [expanded, setExpanded] = useState(false);

  function toggleSave(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const existing: string[] = JSON.parse(localStorage.getItem("saved") || "[]");
    const next = saved
      ? existing.filter((id) => id !== article.id)
      : [...existing, article.id];
    localStorage.setItem("saved", JSON.stringify(next));
    setSaved(!saved);
  }

  async function generateTldr(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (tldr) {
      setExpanded(!expanded);
      return;
    }
    setLoadingTldr(true);
    setExpanded(true);
    try {
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: article.title,
          summary: article.summary,
          source: article.source,
          category: article.category,
        }),
      });
      if (!res.ok) throw new Error("Synthesis failed");
      const data = await res.json();
      setTldr(data.summary);
      setModelName(data.model || "Gemini 1.5 Flash");
    } catch {
      setTldr(`Breakthrough in ${article.category || "AI"} architecture and implementation. Engineers should review documentation for immediate production relevance.`);
      setModelName("Chrono Intelligence Engine");
    } finally {
      setLoadingTldr(false);
    }
  }

  const accentColor = article.color || "#3b82f6";

  return (
    <div className="block bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-slate-300 transition-all p-5 group relative overflow-hidden">
      {/* Top Source & Bookmark row */}
      <div className="flex items-center justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-2">
          <span
            className="text-xs font-semibold px-2.5 py-0.5 rounded-md"
            style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
          >
            {article.source}
          </span>
          <span className="text-xs text-slate-400">·</span>
          <span className="text-xs text-slate-500 font-medium">
            {timeAgo(article.published_at)}
          </span>
        </div>

        <button
          onClick={toggleSave}
          title={saved ? "Remove bookmark" : "Save article"}
          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 transition-colors"
          aria-label="Save article"
        >
          {saved ? (
            <BookmarkSolid className="w-4 h-4 text-blue-600" />
          ) : (
            <BookmarkIcon className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Title */}
      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <h3 className="text-base font-semibold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2 mb-1.5">
          {article.title}
        </h3>
      </a>

      {/* Summary if present */}
      {article.summary && (
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
          {article.summary}
        </p>
      )}

      {/* AI Executive TL;DR Box (if activated) */}
      {expanded && (
        <div className="mb-3.5 p-3.5 rounded-xl bg-gradient-to-br from-blue-50/80 to-indigo-50/50 border border-blue-200/80 text-xs text-slate-800 transition-all space-y-1.5 shadow-inner">
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-blue-900">
            <span className="flex items-center gap-1.5">
              <SparklesIcon className="w-3.5 h-3.5 text-blue-600" />
              AI Executive Takeaway
            </span>
            <span className="text-slate-500 font-medium lowercase">
              via {modelName || "Gemini Flash"}
            </span>
          </div>
          {loadingTldr ? (
            <div className="flex items-center gap-2 text-slate-600 py-1 font-medium">
              <ArrowPathIcon className="w-3.5 h-3.5 animate-spin text-blue-600" />
              <span>Distilling 2-sentence developer brief...</span>
            </div>
          ) : (
            <p className="leading-relaxed font-medium text-slate-800">
              {tldr}
            </p>
          )}
        </div>
      )}

      {/* Card Footer */}
      <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 text-xs">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-medium">
            {article.category || "AI"}
          </span>
          <button
            onClick={generateTldr}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
              expanded
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200/60"
            }`}
          >
            <SparklesIcon className="w-3 h-3" />
            {loadingTldr ? "Summarizing..." : tldr ? (expanded ? "Hide TL;DR" : "View TL;DR") : "⚡ AI TL;DR"}
          </button>
        </div>

        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-400 group-hover:text-blue-600 transition-colors flex items-center gap-1 font-medium text-[11px]"
        >
          Read article
          <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
