"use client";

import { useEffect, useState } from "react";
import { fetchTrending, fetchStats, Article, Stats, timeAgo } from "@/lib/api";
import { FireIcon, ChartBarIcon } from "@heroicons/react/24/outline";

export default function RightPanelClient() {
  const [trending, setTrending] = useState<Article[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetchTrending().then((r) => setTrending(r.articles)).catch(() => {});
    fetchStats().then(setStats).catch(() => {});
  }, []);

  return (
    <aside className="w-80 flex-shrink-0 hidden xl:flex flex-col gap-5 py-6 pr-6 select-none">
      {/* Trending Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
          <FireIcon className="w-4 h-4 text-amber-500" />
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Trending Headlines
          </h3>
        </div>

        <ol className="space-y-3.5">
          {trending.length === 0 && (
            <li className="text-xs text-slate-400 py-2">Fetching trending topics…</li>
          )}
          {trending.map((a, i) => (
            <li key={a.id} className="flex gap-2.5 items-start group">
              <span className="text-xs font-bold text-slate-300 group-hover:text-blue-600 transition-colors w-4 flex-shrink-0 pt-0.5">
                0{i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <a
                  href={a.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-slate-700 group-hover:text-blue-600 transition-colors font-semibold line-clamp-2 leading-snug"
                >
                  {a.title}
                </a>
                <div className="flex items-center gap-1.5 mt-1">
                  <span
                    className="text-[10px] font-medium px-1.5 py-0.5 rounded"
                    style={{ backgroundColor: `${a.color || '#3b82f6'}15`, color: a.color || '#3b82f6' }}
                  >
                    {a.source}
                  </span>
                  <span className="text-[10px] text-slate-400">·</span>
                  <span className="text-[10px] text-slate-400">
                    {timeAgo(a.published_at)}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* Source Distribution Card */}
      {stats && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
            <ChartBarIcon className="w-4 h-4 text-blue-500" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Feed Ingestion
            </h3>
          </div>

          <ul className="space-y-2.5">
            {Object.entries(stats.source_counts)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 7)
              .map(([src, cnt]) => {
                const percentage = stats.today > 0 ? Math.round((cnt / stats.today) * 100) : 0;
                return (
                  <li key={src} className="text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-slate-600 font-medium truncate">{src}</span>
                      <span className="font-semibold text-slate-900">{cnt}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-blue-600 h-1.5 rounded-full"
                        style={{ width: `${Math.min(100, Math.max(10, percentage))}%` }}
                      />
                    </div>
                  </li>
                );
              })}
          </ul>

          {stats.last_updated && (
            <p className="text-[11px] text-slate-400 mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span>Next update: in 1 hour</span>
              <span>{timeAgo(stats.last_updated)}</span>
            </p>
          )}
        </div>
      )}
    </aside>
  );
}
