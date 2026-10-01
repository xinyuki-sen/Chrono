import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "")

_client: Client | None = None


def get_client() -> Client:
    global _client
    if _client is None:
        if not SUPABASE_URL or not SUPABASE_KEY or "←" in SUPABASE_URL:
            raise RuntimeError(
                "Supabase not configured. Copy backend/.env.example to backend/.env and fill in your credentials."
            )
        _client = create_client(SUPABASE_URL, SUPABASE_KEY)
    return _client


def is_configured() -> bool:
    return bool(SUPABASE_URL and SUPABASE_KEY and "←" not in SUPABASE_URL)
