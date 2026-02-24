import os
import faiss
import numpy as np
import pickle

INDEX_PATH = "faiss_index/index.faiss"
CHUNKS_PATH = "faiss_index/chunks.pkl"

def save_index(chunks: list[str], embedder) -> None:
    """
    Converts chunks to vectors and saves them in FAISS.
    FAISS is like a super-fast similarity search engine.
    """
    os.makedirs("faiss_index", exist_ok=True)

    print("Embedding chunks...")
    embeddings = embedder.encode(chunks, show_progress_bar=True)
    embeddings = np.array(embeddings).astype("float32")

    dimension = embeddings.shape[1]
    index = faiss.IndexFlatL2(dimension)
    index.add(embeddings)

    faiss.write_index(index, INDEX_PATH)

    with open(CHUNKS_PATH, "wb") as f:
        pickle.dump(chunks, f)

    print(f"Saved {len(chunks)} vectors to FAISS index")


def load_index():
    """
    Loads the saved FAISS index and original chunks back into memory.
    """
    if not os.path.exists(INDEX_PATH):
        raise FileNotFoundError("No FAISS index found. Please upload a PDF first.")

    index = faiss.read_index(INDEX_PATH)

    with open(CHUNKS_PATH, "rb") as f:
        chunks = pickle.load(f)

    return index, chunks


def search_index(query_vector: np.ndarray, top_k: int = 5):
    """
    Given a query vector, finds the top_k most similar chunks.
    This is the core of semantic search!
    """
    index, chunks = load_index()
    query_vector = np.array(query_vector).astype("float32").reshape(1, -1)

    distances, indices = index.search(query_vector, top_k)

    results = []
    for i, idx in enumerate(indices[0]):
        if idx != -1:
            results.append({
                "chunk": chunks[idx],
                "score": float(distances[0][i])
            })
    return results