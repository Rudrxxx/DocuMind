from backend.query import answer_query

TEST_QUESTIONS = [
    "What is this document about?",
    "What are the main topics?",
    "Summarize the key points.",
]

def evaluate():
    print("=" * 50)
    print("DocuMind — Response Evaluation")
    print("=" * 50)
    for q in TEST_QUESTIONS:
        print(f"\nQ: {q}")
        result = answer_query(q)
        answer = result["answer"]
        sources_used = len(result["sources"])
        has_citation = sources_used > 0
        too_short = len(answer) < 50
        print(f"A: {answer[:300]}...")
        print(f"Sources used : {sources_used}")
        print(f"Has citations: {has_citation}")
        print(f"Quality flag : {'⚠ Too short' if too_short else '✓ OK'}")
    print("\n" + "=" * 50)

if __name__ == "__main__":
    evaluate()