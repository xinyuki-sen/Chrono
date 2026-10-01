"use client";

import { Article, timeAgo } from "@/lib/api";
import { useState } from "react";
import { BookmarkIcon, ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
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

  const accentColor = article.color || "#3b82f6";

  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-slate-300 transition-all p-5 group relative overflow-hidden"
    >
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
      <h3 className="text-base font-semibold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2 mb-1.5">
        {article.title}
      </h3>

      {/* Summary if present */}
      {article.summary && (
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
          {article.summary}
        </p>
      )}

      {/* Card Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-medium">
          {article.category || "AI"}
        </span>
        <span className="text-slate-400 group-hover:text-blue-600 transition-colors flex items-center gap-1 font-medium text-[11px]">
          Read article
          <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5" />
        </span>
      </div>
    </a>
  );
}
