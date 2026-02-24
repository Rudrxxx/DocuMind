import os
from pypdf import PdfReader
from vectorstore.embedder import get_embedder
from vectorstore.store import save_index, load_index
from dotenv import load_dotenv
from langchain_text_splitters import RecursiveCharacterTextSplitter

load_dotenv()

def load_pdf(file_path: str) -> str:
    """
    Reads a PDF file and extracts all text from it.
    Think of this as opening a book and reading every page.
    """
    reader = PdfReader(file_path)
    full_text = ""
    for page in reader.pages:
        full_text += page.extract_text() or ""
    return full_text


def chunk_text(text: str) -> list[str]:
    """
    Splits the big text into smaller overlapping chunks.
    Why overlap? So we don't lose meaning at chunk boundaries.
    Example: chunk size 500 chars, overlap 50 chars.
    """
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=50,
        separators=["\n\n", "\n", ".", " "]
    )
    chunks = splitter.split_text(text)
    return chunks


def ingest_document(file_path: str) -> dict:
    """
    Master function — runs the full pipeline:
    PDF → raw text → chunks → embeddings → saved to FAISS
    """
    print(f"Loading PDF: {file_path}")
    raw_text = load_pdf(file_path)

    if not raw_text.strip():
        return {"error": "Could not extract text from PDF"}

    print(f"Chunking text...")
    chunks = chunk_text(raw_text)
    print(f"Created {len(chunks)} chunks")

    print("Generating embeddings and saving to vector store...")
    embedder = get_embedder()
    save_index(chunks, embedder)

    return {
        "status": "success",
        "chunks_created": len(chunks),
        "file": os.path.basename(file_path)
    }
if __name__ == "__main__":
    result = ingest_document("test.pdf")
    print(result)
