from app.llm.llm_client import LLMClient

class QueryResponderService:
    def __init__(self, llm_client: LLMClient):
        self.llm_client = llm_client

    def respond_to_query(self, context: str, query: str) -> str:
        prompt = f"Answer the following question based on the provided context: {query} Context: {context}"
        return self.llm_client.get_response(prompt)
