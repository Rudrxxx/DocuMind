# DocuMind — RAG-Powered Document Intelligence

> Upload any PDF. Ask anything. Get grounded, cited answers — powered by LLaMA 70B, FAISS and LangChain.

![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=flat-square&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.110-009688?style=flat-square&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)
![LangChain](https://img.shields.io/badge/LangChain-0.1-1C3C3C?style=flat-square)
![FAISS](https://img.shields.io/badge/FAISS-Vector_DB-0467DF?style=flat-square)
![Groq](https://img.shields.io/badge/Groq-LLaMA_70B-F55036?style=flat-square)

---

## What is DocuMind?

DocuMind is a full-stack **Retrieval-Augmented Generation (RAG)** application that lets you have intelligent conversations with your PDF documents.

Instead of reading through hundreds of pages, just ask a question — DocuMind retrieves the most relevant chunks from your document using **semantic vector search**, then passes them to **LLaMA 3.3 70B** to generate a precise, source-cited answer.

No hallucinations. No guessing. Every answer is grounded in your document.

---

## Features

- **Full RAG Pipeline** — PDF ingestion → chunking → embedding → FAISS indexing → semantic retrieval → LLM response
- **LLaMA 70B via Groq** — Free, blazing-fast inference with the most capable open-source LLM
- **Semantic Search** — Sentence-transformer embeddings, not keyword matching
- **Source Citations** — Every answer shows exactly which document chunks it drew from
- **Gamified UX** — XP system, level progression, and achievement unlocks
- **Query History** — Full session history of every question and answer
- **Multi-page React App** — Landing page, chat interface, and history page
- **REST API** — Clean FastAPI backend with Swagger docs at `/docs`
- **Dockerized** — One command deployment with docker-compose

---

## Architecture

```
User uploads PDF
      │
      ▼
┌─────────────────┐
│  PDF Ingestion  │  PyPDF extracts raw text
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    Chunking     │  LangChain RecursiveCharacterTextSplitter
│  500 chars,     │  chunk_size=500, chunk_overlap=50
│  50 overlap     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Embedding     │  sentence-transformers/all-MiniLM-L6-v2
│  384-dim vectors│  Runs locally, no API key needed
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    FAISS Index  │  IndexFlatL2 — stores all chunk vectors
│  (persisted)    │  + original chunk text via pickle
└─────────────────┘

User asks question
      │
      ▼
┌─────────────────┐
│  Query Embed    │  Same embedding model as ingestion
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Similarity      │  FAISS cosine search — top-5 chunks
│ Search          │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Prompt Build    │  System prompt + context chunks + question
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Groq LLaMA 70B │  llama-3.3-70b-versatile
│  (LLM API call) │  temp=0.2, max_tokens=1024
└────────┬────────┘
         │
         ▼
   Answer + Sources
```

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| LLM | Groq — LLaMA 3.3 70B | Language model inference |
| RAG | LangChain | Pipeline orchestration |
| Vector DB | FAISS | Semantic similarity search |
| Embeddings | sentence-transformers | Text → vector conversion |
| Backend | FastAPI + Uvicorn | REST API server |
| PDF Parsing | PyPDF | Text extraction |
| Frontend | React + Vite | User interface |
| HTTP Client | Axios | Frontend → backend calls |
| Deployment | Docker + docker-compose | Containerization |
| Database | PostgreSQL (metadata) | Session and file tracking |

---

## Project Structure

```
DocuMind/
├── backend/
│   ├── main.py          # FastAPI app — /upload and /query endpoints
│   ├── ingest.py        # PDF loading, chunking, embedding, FAISS indexing
│   └── query.py         # Semantic search + Groq LLaMA response
├── vectorstore/
│   ├── embedder.py      # Sentence-transformer model loader
│   └── store.py         # FAISS index save/load/search
├── frontend/
│   └── src/
│       └── App.jsx      # Full React app — home, chat, history pages
├── docker/
│   ├── Dockerfile       # Backend container
│   └── compose.yml      # Multi-service orchestration
├── faiss_index/         # Auto-created — stores vector index
├── uploads/             # Auto-created — stores uploaded PDFs
├── eval.py              # LLM response evaluation layer
├── requirements.txt     # Python dependencies
└── .env                 # API keys (never commit this)
```

---

## Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+
- A free [Groq API key](https://console.groq.com)

### 1. Clone the repo

```bash
git clone https://github.com/Rudrxxx/DocuMind.git
cd DocuMind
```

### 2. Set up the backend

```bash
# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate  # Mac/Linux
# venv\Scripts\activate   # Windows

# Install dependencies
pip3 install fastapi uvicorn python-multipart
pip3 install langchain langchain-community langchain-text-splitters
pip3 install sentence-transformers faiss-cpu
pip3 install pypdf groq python-dotenv
pip3 install psycopg2-binary sqlalchemy
```

### 3. Configure environment

Create a `.env` file in the root:

```bash
GROQ_API_KEY=your_groq_api_key_here
```

Get your free key at [console.groq.com](https://console.groq.com) — no credit card required.

### 4. Start the backend

```bash
python3 -m uvicorn backend.main:app --reload
```

API runs at `http://localhost:8000`
Swagger docs at `http://localhost:8000/docs`

### 5. Set up and start the frontend

```bash
cd frontend
npm install
npm install axios react-dropzone react-markdown
npm run dev
```

App runs at `http://localhost:5173`

---

## API Reference

### `POST /upload`
Upload a PDF document. Triggers the full ingestion pipeline.

**Request:** `multipart/form-data` with `file` field (PDF only)

**Response:**
```json
{
  "message": "Document ingested successfully",
  "filename": "research_paper.pdf",
  "chunks_created": 47
}
```

### `POST /query`
Ask a question about the uploaded document.

**Request:**
```json
{
  "question": "What are the main findings of this paper?"
}
```

**Response:**
```json
{
  "answer": "The paper concludes that...",
  "sources": [
    "chunk 1 text preview...",
    "chunk 2 text preview..."
  ]
}
```

### `GET /health`
Health check endpoint. Returns model info.

---

## Docker Deployment

```bash
cd docker
docker-compose up --build
```

---

## How RAG Works (Interview-Ready Explanation)

**RAG = Retrieval-Augmented Generation**

Standard LLMs hallucinate because they answer from memorized training data. RAG fixes this by:

1. **Storing your document** as vector embeddings in a database
2. **When you ask a question**, converting it to a vector and finding the most similar document chunks
3. **Passing those chunks** as context to the LLM along with your question
4. **The LLM answers only from the provided context** — not from memory

This means answers are always grounded in the actual document, and you can verify them using the source citations.

---

## Roadmap

- [ ] Multi-document support — query across multiple PDFs simultaneously
- [ ] Pinecone integration — cloud-hosted vector storage
- [ ] Conversation memory — maintain context across follow-up questions
- [ ] Export answers — download Q&A sessions as PDF reports
- [ ] Authentication — user accounts with persistent history
- [ ] Streaming responses — token-by-token answer streaming

---

## License

MIT License — free to use, modify and distribute.

---

Built with LangChain · FAISS · Groq LLaMA 70B · FastAPI · React
