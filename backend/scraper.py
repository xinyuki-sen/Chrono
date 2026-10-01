import hashlib
import feedparser
import requests
from datetime import datetime, timezone
from typing import Optional

# ── RSS Feed Sources ──────────────────────────────────────────────
FEEDS = [
    {"url": "https://arxiv.org/rss/cs.AI",      "source": "ArXiv",        "category": "Research", "color": "#3b82f6"},
    {"url": "https://arxiv.org/rss/cs.CL",      "source": "ArXiv",        "category": "LLMs",     "color": "#3b82f6"},
    {"url": "https://arxiv.org/rss/cs.LG",      "source": "ArXiv",        "category": "Research", "color": "#3b82f6"},
    {"url": "https://huggingface.co/blog/feed.xml", "source": "HuggingFace", "category": "Models",   "color": "#f97316"},
    {"url": "https://deepmind.google/blog/rss.xml", "source": "DeepMind",   "category": "Research", "color": "#10b981"},
    {"url": "https://openai.com/blog/rss.xml",   "source": "OpenAI",       "category": "LLMs",     "color": "#8b5cf6"},
    {"url": "https://blog.google/technology/ai/rss/", "source": "Google AI", "category": "Research", "color": "#ef4444"},
    {"url": "https://feeds.feedburner.com/oreilly/radar/atom", "source": "O'Reilly", "category": "Tools", "color": "#06b6d4"},
    {"url": "https://www.producthunt.com/feed?category=artificial-intelligence", "source": "ProductHunt", "category": "Tools", "color": "#f43f5e"},
]


def make_hash(title: str, url: str) -> str:
    """Generate a deterministic hash to deduplicate articles."""
    return hashlib.sha256(f"{title}{url}".encode()).hexdigest()[:16]


def parse_date(entry) -> str:
    """Parse published date from feed entry, fallback to now."""
    for attr in ("published_parsed", "updated_parsed"):
        val = getattr(entry, attr, None)
        if val:
            try:
                return datetime(*val[:6], tzinfo=timezone.utc).isoformat()
            except Exception:
                pass
    return datetime.now(timezone.utc).isoformat()


def scrape_all() -> list[dict]:
    """Scrape all RSS feeds and return list of article dicts."""
    articles = []
    for feed_cfg in FEEDS:
        try:
            feed = feedparser.parse(feed_cfg["url"])
            for entry in feed.entries[:15]:  # max 15 per source
                title = getattr(entry, "title", "").strip()
                link  = getattr(entry, "link",  "").strip()
                summary = getattr(entry, "summary", "").strip()
                if not title or not link:
                    continue
                # strip HTML tags from summary
                import re
                summary = re.sub(r"<[^>]+>", "", summary)[:300]
                articles.append({
                    "id":         make_hash(title, link),
                    "title":      title,
                    "url":        link,
                    "summary":    summary,
                    "source":     feed_cfg["source"],
                    "category":   feed_cfg["category"],
                    "color":      feed_cfg["color"],
                    "published_at": parse_date(entry),
                })
        except Exception as e:
            print(f"[scraper] Failed {feed_cfg['source']}: {e}")
    return articles


def scrape_and_store(db_client) -> int:
    """Scrape feeds and upsert into Supabase. Returns count of new articles."""
    articles = scrape_all()
    if not articles:
        return 0
    try:
        db_client.table("articles").upsert(articles, on_conflict="id").execute()
        return len(articles)
    except Exception as e:
        print(f"[scraper] DB upsert failed: {e}")
        return 0
