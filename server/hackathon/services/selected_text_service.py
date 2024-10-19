from app.utils.ai_helper import create_prompt_template
from hackathon.prompts.selected_text_prompt import SELECTED_TEXT_PROMPT
from hackathon.utils.ai_helper import stream_simple_answer


class SelectedTextService:

    def generate_meta_data_stream(self, text: str, content: str) -> str:
        input_variables = ["selected_text", "content"]
        prompt_template = create_prompt_template(SELECTED_TEXT_PROMPT, input_variables)
        input_data = { "selected_text": text, "content": content }
        result = stream_simple_answer(prompt_template, input_data)
        return result
