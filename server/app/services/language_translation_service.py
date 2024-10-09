from langchain_core.output_parsers import PydanticOutputParser

from app.utils.ai_helper import create_prompt_template, invoke_prompt
from app.models.ai.translation import TranslationModel
from app.prompts.translate_prompt import TRANSLATE_PROMPT

class LanguageTranslationService:

    def translate(self, text: str, target_language: str) -> str:

        input_variables = ["text", "target_language"]
        pydantic_parser = PydanticOutputParser(pydantic_object=TranslationModel)
        partial_variables = { "format_instructions": pydantic_parser.get_format_instructions()}
        prompt_template = create_prompt_template(TRANSLATE_PROMPT, input_variables, partial_variables)
        input_data = { "text": text, "target_language": target_language }
        result = invoke_prompt(prompt_template, pydantic_parser, input_data)
        print(result)
        return result
