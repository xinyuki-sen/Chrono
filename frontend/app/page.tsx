"use client";

import { useEffect, useState, useCallback } from "react";
import { 
  MagnifyingGlassIcon, 
  ArrowPathIcon, 
  BoltIcon, 
  RssIcon, 
  ClockIcon, 
  XMarkIcon 
} from "@heroicons/react/24/outline";
import ArticleCard from "@/components/ArticleCard";
import RightPanelClient from "@/components/RightPanelClient";
import { fetchArticles, fetchStats, Article, Stats, timeAgo } from "@/lib/api";

const CATEGORIES = ["All", "LLMs", "Research", "Tools", "Models", "Papers"];

export default function FeedPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [art, st] = await Promise.all([
        fetchArticles({ category, q: query || undefined, limit: 60 }),
        fetchStats(),
      ]);
      setArticles(art.articles);
      setStats(st);
    } catch (err) {
      console.error("Failed to load feed:", err);
    } finally {
      setLoading(false);
    }
  }, [category, query]);

  useEffect(() => {
    load();
  }, [load]);

  // Debounced search
  useEffect(() => {
    const t = setTimeout(load, 350);
    return () => clearTimeout(t);
  }, [query, load]);

  return (
    <div className="flex justify-center w-full min-h-full">
      {/* Center Feed Column */}
      <div className="flex-1 max-w-4xl px-6 py-6 min-w-0">
        {/* Top Header & Search */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Live Intelligence Feed
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Frontier AI research papers, model releases, and dev tooling
              </p>
            </div>
            
            <button
              onClick={() => load()}
              className="inline-flex items-center gap-1.5 self-start sm:self-auto px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm transition-colors"
            >
              <ArrowPathIcon className={`w-3.5 h-3.5 ${loading ? "animate-spin text-blue-600" : ""}`} />
              Refresh
            </button>
          </div>

          {/* Search Box */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search news, papers, authors, benchmarks..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 bg-white text-sm shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex gap-2 flex-wrap mb-6 select-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                category === cat
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              {cat}
              {cat === "All" && stats ? (
                <span className={`ml-1.5 text-[11px] font-normal ${category === cat ? "text-slate-300" : "text-slate-400"}`}>
                  {stats.today}
                </span>
              ) : null}
            </button>
          ))}
        </div>

        {/* 3 Metric Stat Cards */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-6">
            <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                <BoltIcon className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900">{stats.today}</p>
                <p className="text-xs text-slate-500 font-medium">Headlines Synced</p>
              </div>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                <RssIcon className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900">{stats.sources_active} Sources</p>
                <p className="text-xs text-slate-500 font-medium">Active RSS Pipelines</p>
              </div>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
                <ClockIcon className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900">
                  {stats.last_updated ? timeAgo(stats.last_updated) : "Just now"}
                </p>
                <p className="text-xs text-slate-500 font-medium">Latest Scrape Cycle</p>
              </div>
            </div>
          </div>
        )}

        {/* Feed List */}
        {loading ? (
          <div className="space-y-3.5">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm animate-pulse space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-16 h-4 bg-slate-200 rounded"></div>
                  <div className="w-12 h-4 bg-slate-100 rounded"></div>
                </div>
                <div className="w-3/4 h-5 bg-slate-200 rounded"></div>
                <div className="w-full h-3.5 bg-slate-100 rounded"></div>
                <div className="w-5/6 h-3.5 bg-slate-100 rounded"></div>
              </div>
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center shadow-sm">
            <MagnifyingGlassIcon className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-800">No articles match your criteria</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Try searching with different keywords or switch category filter to &quot;All&quot;.
            </p>
            {query && (
              <button
                onClick={() => setQuery("")}
                className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3.5">
            {articles.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        )}
      </div>

      {/* Right Column (Trending + Source breakdown) */}
      <RightPanelClient />
    </div>
  );
}
