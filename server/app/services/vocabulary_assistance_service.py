from app.llm.llm_client import LLMClient

class VocabularyAssistanceService:
    def __init__(self, llm_client: LLMClient):
        self.llm_client = llm_client

    def provide_assistance(self, text: str) -> str:
        prompt = f"Provide vocabulary assistance for the following text: {text}"
        return self.llm_client.get_response(prompt)
