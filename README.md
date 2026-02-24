# DocuMind — RAG-Powered Document Intelligence

Ask anything about your PDFs. Powered by LangChain, FAISS, Groq LLaMA 70B and React.

## Tech Stack
- **Backend** — FastAPI, Python
- **RAG** — LangChain, sentence-transformers
- **Vector DB** — FAISS
- **LLM** — Groq LLaMA 3.3 70B
- **Frontend** — React, Vite

## Setup
```bash
# Backend
python3 -m venv venv
source venv/bin/activate
pip3 install -r requirements.txt
python3 -m uvicorn backend.main:app --reload

# Frontend
cd frontend
npm install
npm run dev
```

## Features
- PDF upload with drag and drop
- Semantic search using vector embeddings
- Source-cited answers with zero hallucination
- Gamified XP and achievement system
- Query history tracking
