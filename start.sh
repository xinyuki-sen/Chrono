#!/bin/bash
# Start both backend and frontend with one command
echo "Starting Chrono..."

# Backend
cd backend
source .venv/bin/activate 2>/dev/null || .venv\Scripts\activate
uvicorn main:app --port 8000 --reload &
BACKEND_PID=$!

# Frontend
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Chrono is running!"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:8000"
echo "   API Docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop both."

wait $BACKEND_PID $FRONTEND_PID
