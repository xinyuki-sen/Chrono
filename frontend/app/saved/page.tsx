"use client";

import { useEffect, useState } from "react";
import ArticleCard from "@/components/ArticleCard";
import { Article, fetchArticles } from "@/lib/api";
import { BookmarkIcon } from "@heroicons/react/24/outline";

export default function SavedPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ids: string[] = JSON.parse(localStorage.getItem("saved") || "[]");
    if (ids.length === 0) {
      setLoading(false);
      return;
    }
    fetchArticles({ limit: 100 })
      .then((res) => setArticles(res.articles.filter((a) => ids.includes(a.id))))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="px-6 py-6 max-w-4xl mx-auto min-h-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
          <BookmarkIcon className="w-6 h-6 text-blue-600 stroke-[2.2]" />
          Saved Reading List
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Articles and papers you have bookmarked for offline review · {articles.length} saved
        </p>
      </div>

      {loading ? (
        <div className="space-y-3.5">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm animate-pulse space-y-3">
              <div className="w-16 h-4 bg-slate-200 rounded"></div>
              <div className="w-3/4 h-5 bg-slate-200 rounded"></div>
              <div className="w-full h-3 bg-slate-100 rounded"></div>
            </div>
          ))}
        </div>
      ) : articles.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center shadow-sm max-w-lg mx-auto mt-10">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3.5">
            <BookmarkIcon className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-800">No saved articles yet</h3>
          <p className="text-xs text-slate-500 mt-1">
            Tap the bookmark icon on any headline in the live feed to store it here.
          </p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {articles.map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </div>
      )}
    </div>
  );
}
