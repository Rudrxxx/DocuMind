import os
from pypdf import PdfReader
from vectorstore.store import save_index
from dotenv import load_dotenv
from langchain_text_splitters import RecursiveCharacterTextSplitter

load_dotenv()

def load_pdf(file_path: str) -> str:
    reader = PdfReader(file_path)
    full_text = ""
    for page in reader.pages:
        full_text += page.extract_text() or ""
    return full_text

def chunk_text(text: str) -> list[str]:
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=50,
        separators=["\n\n", "\n", ".", " "]
    )
    return splitter.split_text(text)

def ingest_document(file_path: str, embedder=None) -> dict:
    print(f"Loading PDF: {file_path}")
    raw_text = load_pdf(file_path)

    if not raw_text.strip():
        return {"error": "Could not extract text from PDF"}

    chunks = chunk_text(raw_text)
    print(f"Created {len(chunks)} chunks")

    if embedder is None:
        from vectorstore.embedder import get_embedder
        embedder = get_embedder()

    save_index(chunks, embedder)

    return {
        "status": "success",
        "chunks_created": len(chunks),
        "file": os.path.basename(file_path)
    }