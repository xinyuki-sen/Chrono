from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from apscheduler.schedulers.background import BackgroundScheduler
from contextlib import asynccontextmanager
from datetime import datetime, timezone
from typing import Optional
import database
import scraper

# ── In-memory cache (used when Supabase not configured) ──────────
_cache: list[dict] = []
_last_scraped: Optional[str] = None


def run_scrape():
    global _cache, _last_scraped
    _last_scraped = datetime.now(timezone.utc).isoformat()
    if database.is_configured():
        db = database.get_client()
        scraper.scrape_and_store(db)
    else:
        # fallback: store in memory
        _cache = scraper.scrape_all()
    print(f"[scheduler] Scrape complete at {_last_scraped}")


# ── App lifecycle ─────────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Run once on startup
    run_scrape()
    # Then every hour
    scheduler = BackgroundScheduler()
    scheduler.add_job(run_scrape, "interval", hours=1)
    scheduler.start()
    yield
    scheduler.shutdown()


app = FastAPI(title="Chrono API", version="2.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten in production
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Helpers ───────────────────────────────────────────────────────
def fetch_articles(
    category: Optional[str] = None,
    source: Optional[str] = None,
    q: Optional[str] = None,
    limit: int = 50,
    offset: int = 0,
) -> list[dict]:
    if database.is_configured():
        db = database.get_client()
        query = db.table("articles").select("*").order("published_at", desc=True)
        if category and category.lower() != "all":
            query = query.eq("category", category)
        if source:
            query = query.eq("source", source)
        if q:
            query = query.ilike("title", f"%{q}%")
        result = query.range(offset, offset + limit - 1).execute()
        return result.data or []
    else:
        # in-memory fallback
        data = _cache
        if category and category.lower() != "all":
            data = [a for a in data if a["category"].lower() == category.lower()]
        if source:
            data = [a for a in data if a["source"].lower() == source.lower()]
        if q:
            data = [a for a in data if q.lower() in a["title"].lower()]
        return data[offset: offset + limit]


# ── Routes ────────────────────────────────────────────────────────
@app.get("/health")
def health():
    return {"status": "ok", "db": database.is_configured(), "last_scraped": _last_scraped}


@app.get("/articles")
def get_articles(
    category: Optional[str] = Query(None, description="Filter by category: LLMs, Tools, Research, Models, Papers"),
    source:   Optional[str] = Query(None, description="Filter by source name"),
    q:        Optional[str] = Query(None, description="Search in title"),
    limit:    int           = Query(50,   ge=1, le=100),
    offset:   int           = Query(0,    ge=0),
):
    articles = fetch_articles(category=category, source=source, q=q, limit=limit, offset=offset)
    return {"articles": articles, "count": len(articles)}


@app.get("/articles/trending")
def get_trending():
    """Return top 5 most recent articles across all sources."""
    articles = fetch_articles(limit=5)
    return {"articles": articles}


@app.get("/stats")
def get_stats():
    """Return dashboard stats: total today, source counts, last updated."""
    if database.is_configured():
        db = database.get_client()
        today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
        total = db.table("articles").select("id", count="exact").gte("published_at", today).execute()
        by_source = db.table("articles").select("source").execute()
        source_counts: dict[str, int] = {}
        for row in (by_source.data or []):
            s = row["source"]
            source_counts[s] = source_counts.get(s, 0) + 1
        return {
            "today": total.count or 0,
            "sources_active": len(source_counts),
            "source_counts": source_counts,
            "last_updated": _last_scraped,
        }
    else:
        source_counts: dict[str, int] = {}
        for a in _cache:
            s = a["source"]
            source_counts[s] = source_counts.get(s, 0) + 1
        return {
            "today": len(_cache),
            "sources_active": len(source_counts),
            "source_counts": source_counts,
            "last_updated": _last_scraped,
        }


@app.post("/scrape")
def trigger_scrape():
    """Manually trigger a scrape (useful for testing)."""
    run_scrape()
    return {"status": "ok", "last_scraped": _last_scraped}
