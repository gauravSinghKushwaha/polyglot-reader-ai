from app.llm.llm_client import LLMClient

class LanguageTranslationService:
    def __init__(self, llm_client: LLMClient):
        self.llm_client = llm_client

    def translate(self, text: str, target_language: str) -> str:
        prompt = f"Translate the following text to {target_language}: {text}"
        return self.llm_client.get_response(prompt)
