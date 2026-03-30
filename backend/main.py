import os
import shutil
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from backend.ingest import ingest_document
from backend.query import answer_query
from vectorstore.embedder import get_embedder
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="DocuMind API",
    description="RAG-powered document Q&A system",
    version="1.0.0"
)

ALLOWED_ORIGINS = os.environ.get("ALLOWED_ORIGINS", "http://localhost:5173").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

print("Loading embedding model...")
embedder = get_embedder()
print("Model ready.")


class QueryRequest(BaseModel):
    question: str

class QueryResponse(BaseModel):
    answer: str
    sources: list[str]


@app.get("/")
def root():
    return {"message": "DocuMind API is running!"}

@app.get("/health")
def health():
    return {"status": "healthy", "model": "llama-3.3-70b-versatile"}

@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")

    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    result = ingest_document(file_path, embedder)

    if "error" in result:
        raise HTTPException(status_code=500, detail=result["error"])

    return {
        "message": "Document ingested successfully",
        "filename": file.filename,
        "chunks_created": result["chunks_created"]
    }

@app.post("/query", response_model=QueryResponse)
async def query_document(request: QueryRequest):
    if not request.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty")

    result = answer_query(request.question, embedder)
    return result

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("backend.main:app", host="0.0.0.0", port=port)