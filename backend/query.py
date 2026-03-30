import numpy as np
from dotenv import load_dotenv
from groq import Groq
from vectorstore.store import search_index

load_dotenv()

client = Groq()

def answer_query(question: str, embedder=None) -> dict:
    if embedder is None:
        from vectorstore.embedder import get_embedder
        embedder = get_embedder()

    query_vector = embedder.encode([question])[0]
    results = search_index(query_vector, top_k=5)

    if not results:
        return {"answer": "No relevant content found.", "sources": []}

    context = "\n\n---\n\n".join([r["chunk"] for r in results])

    system_prompt = """You are DocuMind, an intelligent document assistant.
Answer the user's question using ONLY the context provided below.
If the answer is not in the context, say "I couldn't find that in the document."
Always be concise, accurate, and cite which part of the context you used.
Never make up information."""

    user_prompt = f"""Context from the document:
{context}

Question: {question}

Answer:"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        temperature=0.2,
        max_tokens=1024
    )

    return {
        "answer": response.choices[0].message.content,
        "sources": [r["chunk"][:200] for r in results]
    }