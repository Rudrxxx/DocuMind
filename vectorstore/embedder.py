from sentence_transformers import SentenceTransformer

def get_embedder():
    """
    Loads a lightweight but powerful embedding model.
    This converts text into vectors (lists of numbers)
    that capture the MEANING of the text, not just keywords.
    """
    model = SentenceTransformer("all-MiniLM-L6-v2")
    return model