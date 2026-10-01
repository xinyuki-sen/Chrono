# Chrono v2 — AI News Intelligence Dashboard

A real-time AI news aggregator with a proper backend API and modern dashboard UI.

## Stack
- **Frontend**: Next.js 14 + Tailwind CSS → deployed on Vercel  
- **Backend**: FastAPI (Python) → deployed on Render  
- **Database**: Supabase (PostgreSQL) — optional, works without it  

## Running Locally

### 1. Backend
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate        # Windows
pip install -r requirements.txt

# Optional: configure Supabase (works without it)
copy .env.example .env
# Edit .env and fill in your Supabase credentials

uvicorn main:app --port 8000 --reload
```

Backend runs at: http://localhost:8000  
API docs at: http://localhost:8000/docs

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: http://localhost:3000

## Supabase Setup (optional but recommended for persistence)

1. Go to https://supabase.com → New Project
2. Go to SQL Editor → run this:

```sql
create table articles (
  id           text primary key,
  title        text not null,
  url          text not null,
  summary      text,
  source       text,
  category     text,
  color        text,
  published_at timestamptz
);
```

3. Go to Settings → API → copy `Project URL` and `anon key`
4. Paste into `backend/.env`

## Deploying

### Frontend → Vercel
1. Push to GitHub
2. Import repo at vercel.com
3. Set root directory to `frontend`
4. Add env var: `NEXT_PUBLIC_API_URL=https://your-render-url.onrender.com`

### Backend → Render
1. New Web Service at render.com
2. Root directory: `backend`
3. Build command: `pip install -r requirements.txt`
4. Start command: `uvicorn main:app --host 0.0.0.0 --port 10000`
5. Add env vars: `SUPABASE_URL` and `SUPABASE_KEY`
