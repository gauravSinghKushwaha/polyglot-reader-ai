import json

from langchain_core.output_parsers import PydanticOutputParser

from hackathon.models.ai.selected_text import SelectedTextModel
from hackathon.models.server.selected_text_dto import SelectedTextDto
from hackathon.utils.ai_helper import create_prompt_template, stream_simple_answer, stream_answer
from hackathon.prompts.selected_text_prompt import SELECTED_TEXT_PROMPT, SELECTED_TEXT_FORMAT
from hackathon.utils.ai_helper import invoke_simple_chain


class SelectedTextService:

    def generate_meta_data(self, text: str, content: str, target_language: str) -> str:
        input_variables = ["selected_text", "content", "target_language"]
        pydantic_parser = PydanticOutputParser(pydantic_object=SelectedTextModel)
        partial_variables = { "format_instructions": pydantic_parser.get_format_instructions()}
        prompt_template = create_prompt_template(SELECTED_TEXT_PROMPT, input_variables, partial_variables)
        input_data = { "selected_text": text, "content": content, "target_language": target_language }

        result = stream_answer(prompt_template, pydantic_parser, input_data)
        print(result)
        return result
