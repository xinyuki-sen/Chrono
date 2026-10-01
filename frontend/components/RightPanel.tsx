import { fetchStats, fetchTrending, timeAgo } from "@/lib/api";

export default async function RightPanel() {
  const [statsData, trendingData] = await Promise.allSettled([
    fetchStats(),
    fetchTrending(),
  ]);

  const stats  = statsData.status  === "fulfilled" ? statsData.value  : null;
  const trending = trendingData.status === "fulfilled" ? trendingData.value.articles : [];

  return (
    <aside className="w-56 flex-shrink-0 hidden lg:flex flex-col gap-6 py-6 px-4">
      {/* Trending */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-widest mb-3">
          Trending Now
        </h3>
        <ol className="space-y-3">
          {trending.length === 0 && (
            <li className="text-xs text-gray-400">Loading…</li>
          )}
          {trending.map((a, i) => (
            <li key={a.id} className="flex gap-2">
              <span className="text-xs font-bold text-blue-500 w-4 flex-shrink-0">
                {i + 1}.
              </span>
              <div className="min-w-0">
                <a
                  href={a.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-gray-700 hover:text-blue-600 font-medium line-clamp-2 leading-snug"
                >
                  {a.title}
                </a>
                <span
                  className="inline-block text-[10px] px-1.5 py-0.5 rounded-full mt-1"
                  style={{ backgroundColor: a.color + "20", color: a.color }}
                >
                  {a.source}
                </span>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* Sources Today */}
      {stats && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-widest mb-3">
            Sources Today
          </h3>
          <ul className="space-y-2">
            {Object.entries(stats.source_counts)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 6)
              .map(([src, count]) => (
                <li key={src} className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">{src}</span>
                  <span className="font-semibold text-gray-900">{count}</span>
                </li>
              ))}
          </ul>
          {stats.last_updated && (
            <p className="text-[10px] text-gray-400 mt-3 border-t pt-2">
              Updated {timeAgo(stats.last_updated)}
            </p>
          )}
        </div>
      )}
    </aside>
  );
}
