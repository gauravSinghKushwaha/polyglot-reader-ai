from app.llm.llm_client import LLMClient

class QuizGeneratorService:
    def __init__(self, llm_client: LLMClient):
        self.llm_client = llm_client

    def generate_quiz(self, text: str, level: str) -> str:
        prompt = f"Generate a {level} quiz for the following text: {text}"
        return self.llm_client.get_response(prompt)
