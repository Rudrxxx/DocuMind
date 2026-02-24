import numpy as np
from dotenv import load_dotenv
from groq import Groq
from vectorstore.embedder import get_embedder
from vectorstore.store import search_index

load_dotenv()

client = Groq()

def answer_query(question: str) -> dict:
    """
    Full RAG query pipeline:
    1. Embed the user's question
    2. Search FAISS for relevant chunks
    3. Build a prompt with those chunks as context
    4. Send to Groq LLaMA and get an answer
    """

    # Step 1 — embed the question
    embedder = get_embedder()
    query_vector = embedder.encode([question])[0]

    # Step 2 — retrieve top 5 relevant chunks from FAISS
    results = search_index(query_vector, top_k=5)

    if not results:
        return {"answer": "No relevant content found.", "sources": []}

    # Step 3 — build context from retrieved chunks
    context = "\n\n---\n\n".join([r["chunk"] for r in results])

    # Step 4 — craft the prompt (this is prompt engineering!)
    system_prompt = """You are DocuMind, an intelligent document assistant.
Answer the user's question using ONLY the context provided below.
If the answer is not in the context, say "I couldn't find that in the document."
Always be concise, accurate, and cite which part of the context you used.
Never make up information."""

    user_prompt = f"""Context from the document:
{context}

Question: {question}

Answer:"""

    # Step 5 — call Groq LLaMA API
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        temperature=0.2,
        max_tokens=1024
    )

    answer = response.choices[0].message.content

    return {
        "answer": answer,
        "sources": [r["chunk"][:200] for r in results]
    }


if __name__ == "__main__":
    q = "What is this document about?"
    result = answer_query(q)
    print("\n=== ANSWER ===")
    print(result["answer"])
    print("\n=== SOURCES USED ===")
    for i, s in enumerate(result["sources"]):
        print(f"\n[{i+1}] {s}...")