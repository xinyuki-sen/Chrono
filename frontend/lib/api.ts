export interface Article {
  id: string;
  title: string;
  url: string;
  summary: string;
  source: string;
  category: string;
  color: string;
  published_at: string;
}

export interface Stats {
  today: number;
  sources_active: number;
  source_counts: Record<string, number>;
  last_updated: string | null;
}

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function fetchArticles(params: {
  category?: string;
  source?: string;
  q?: string;
  limit?: number;
  offset?: number;
}): Promise<{ articles: Article[]; count: number }> {
  const url = new URL(`${API}/articles`);
  if (params.category && params.category !== "All") url.searchParams.set("category", params.category);
  if (params.source) url.searchParams.set("source", params.source);
  if (params.q) url.searchParams.set("q", params.q);
  if (params.limit) url.searchParams.set("limit", String(params.limit));
  if (params.offset) url.searchParams.set("offset", String(params.offset));
  const res = await fetch(url.toString(), { next: { revalidate: 60 } });
  if (!res.ok) throw new Error("Failed to fetch articles");
  return res.json();
}

export async function fetchTrending(): Promise<{ articles: Article[] }> {
  const res = await fetch(`${API}/articles/trending`, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error("Failed to fetch trending");
  return res.json();
}

export async function fetchStats(): Promise<Stats> {
  const res = await fetch(`${API}/stats`, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error("Failed to fetch stats");
  return res.json();
}

export function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}
