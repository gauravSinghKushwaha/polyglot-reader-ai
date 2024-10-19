import json

from hackathon.utils.ai_helper import create_prompt_template
from hackathon.prompts.selected_text_prompt import SELECTED_TEXT_PROMPT, SELECTED_TEXT_FORMAT
from hackathon.utils.ai_helper import invoke_simple_chain


class SelectedTextService:

    def generate_meta_data(self, text: str, content: str, target_language: str) -> str:
        input_variables = ["selected_text", "content", "target_language"]

        partial_variables = { "format_instructions": SELECTED_TEXT_FORMAT}
        prompt_template = create_prompt_template(SELECTED_TEXT_PROMPT, input_variables, partial_variables)
        input_data = { "selected_text": text, "content": content, "target_language": target_language }

        result = invoke_simple_chain(prompt_template, input_data)

        return result
