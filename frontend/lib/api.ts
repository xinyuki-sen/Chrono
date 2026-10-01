export interface Article {
  id: string;
  title: string;
  url: string;
  summary: string;
  source: string;
  category: string;
  color?: string;
  published_at: string;
}

export interface Stats {
  today: number;
  sources_active: number;
  source_counts: Record<string, number>;
  last_updated: string | null;
}

const API = process.env.NEXT_PUBLIC_API_URL || "https://chrono-1j4d.onrender.com";

const SOURCE_COLORS: Record<string, string> = {
  "ArXiv": "#3b82f6",
  "HuggingFace": "#f97316",
  "DeepMind": "#10b981",
  "OpenAI": "#8b5cf6",
  "Google AI": "#ef4444",
  "ProductHunt": "#f43f5e",
  "O'Reilly": "#06b6d4",
  "TechCrunch": "#10b981",
  "The Verge": "#8b5cf6",
  "Nature": "#ef4444",
  "Meta AI Blog": "#3b82f6",
};

// Fallback helper to read /news.json if Render is in cold-sleep
async function getFallbackArticles(): Promise<Article[]> {
  try {
    const res = await fetch("/news.json");
    if (!res.ok) return [];
    const data = await res.json();
    return (data.articles || []).map((a: Record<string, unknown>) => ({
      id: String(a.id || Math.random()),
      title: String(a.title || ""),
      url: String(a.url || "#"),
      summary: String(a.summary || ""),
      source: String(a.source || "AI Feed"),
      category: String(a.category || "General"),
      color: String(a.color || SOURCE_COLORS[String(a.source)] || "#3b82f6"),
      published_at: String(a.published_at || new Date().toISOString()),
    }));
  } catch {
    return [];
  }
}

export async function fetchArticles(params: {
  category?: string;
  source?: string;
  q?: string;
  limit?: number;
  offset?: number;
}): Promise<{ articles: Article[]; count: number }> {
  try {
    const url = new URL(`${API}/articles`);
    if (params.category && params.category !== "All") url.searchParams.set("category", params.category);
    if (params.source) url.searchParams.set("source", params.source);
    if (params.q) url.searchParams.set("q", params.q);
    if (params.limit) url.searchParams.set("limit", String(params.limit));
    if (params.offset) url.searchParams.set("offset", String(params.offset));

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(url.toString(), { 
      signal: controller.signal,
      next: { revalidate: 60 } 
    });
    clearTimeout(timeout);

    if (!res.ok) throw new Error("Backend response error");
    const data = await res.json();
    if (data.articles && data.articles.length > 0) {
      return data;
    }
  } catch (err) {
    console.warn("Live API slow or offline, using cached snapshot:", err);
  }

  // Graceful fallback to static cached snapshot
  let fallback = await getFallbackArticles();
  if (params.category && params.category !== "All") {
    fallback = fallback.filter(a => a.category.toLowerCase() === params.category!.toLowerCase());
  }
  if (params.q) {
    const q = params.q.toLowerCase();
    fallback = fallback.filter(a => a.title.toLowerCase().includes(q) || a.summary.toLowerCase().includes(q));
  }
  return {
    articles: fallback.slice(params.offset || 0, (params.offset || 0) + (params.limit || 50)),
    count: fallback.length,
  };
}

export async function fetchTrending(): Promise<{ articles: Article[] }> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);
    const res = await fetch(`${API}/articles/trending`, { 
      signal: controller.signal,
      next: { revalidate: 60 } 
    });
    clearTimeout(timeout);
    if (!res.ok) throw new Error("Trending API error");
    const data = await res.json();
    if (data.articles && data.articles.length > 0) return data;
  } catch {
    // ignore
  }
  const fallback = await getFallbackArticles();
  return { articles: fallback.slice(0, 5) };
}

export async function fetchStats(): Promise<Stats> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);
    const res = await fetch(`${API}/stats`, { 
      signal: controller.signal,
      next: { revalidate: 60 } 
    });
    clearTimeout(timeout);
    if (!res.ok) throw new Error("Stats API error");
    return await res.json();
  } catch {
    // ignore
  }
  const fallback = await getFallbackArticles();
  const counts: Record<string, number> = {};
  fallback.forEach(a => {
    counts[a.source] = (counts[a.source] || 0) + 1;
  });
  return {
    today: fallback.length,
    sources_active: Object.keys(counts).length,
    source_counts: counts,
    last_updated: new Date().toISOString(),
  };
}

export function timeAgo(dateStr: string): string {
  try {
    const diff = Date.now() - new Date(dateStr).getTime();
    if (isNaN(diff)) return "recently";
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  } catch {
    return "today";
  }
}
