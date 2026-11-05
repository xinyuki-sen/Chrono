# Chrono

Autonomous Frontier AI Research & Intelligence Radar that monitors 17+ feeds across ArXiv, DeepMind, Hugging Face, and more — fully serverless at zero hosting cost.

## What It Does

Chrono automatically crawls the latest AI research, models, tools, prompts, and conceptual breakthroughs every day. It deduplicates entries using SHA-256 state hashing, generates executive summaries via Gemini Flash, and surfaces them through a clean Next.js dashboard.

## Architecture

```
GitHub Actions (Cron)
       │
       ▼
 Python Scraper ──► SQLite DB ──► JSON exports
       │
       ▼
 Gemini Flash (Summarization)
       │
       ▼
 Next.js Frontend (Static reads from JSON)
```

## Tech Stack

| Layer | Technology |
|---|---|
| Scraper | Python 3.11, `requests`, `feedparser` |
| Database | SQLite (file-based, zero-config) |
| AI | Google Gemini Flash API |
| Frontend | Next.js 15, React, TypeScript, Tailwind CSS |
| Automation | GitHub Actions (daily cron schedule) |
| Deployment | Vercel (frontend), GitHub Actions (backend) |

## Key Engineering Decisions

- **SHA-256 deduplication** — each article is hashed to prevent cross-feed duplicates across 17+ sources
- **Temporal pruning** — old entries are automatically aged out to keep the database lean
- **Gemini Flash over GPT** — chosen for speed and cost efficiency on high-volume summarization
- **Static JSON export** — the frontend reads pre-built JSON files, so there's zero runtime API cost

## Project Structure

```
backend/          Python scraper, database layer, and FastAPI server
frontend/         Next.js dashboard with article cards, sidebar, and category pages
legacy_v1/        Original single-page HTML prototype
.github/workflows Daily cron automation via GitHub Actions
```

## Getting Started

```bash
# Backend
cd backend
pip install -r requirements.txt
cp .env.example .env   # Add your Gemini API key
python main.py

# Frontend
cd frontend
npm install
npm run dev
```

## License

MIT
