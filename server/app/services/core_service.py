from app.utils.input_text_parser import InputTextParser
from app.llm.llm_client import LLMClient

class CoreService:
    def __init__(self, llm_client: LLMClient):
        self.llm_client = llm_client

    def handle_request(self, prompt: str) -> str:
        parsed_text = InputTextParser.parse(prompt)
        llm_response = self.llm_client.get_response(parsed_text)
        return llm_response
