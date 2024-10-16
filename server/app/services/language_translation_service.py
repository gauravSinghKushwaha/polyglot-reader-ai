from langchain_core.output_parsers import PydanticOutputParser
import ast

from app.utils.ai_helper import create_prompt_template, invoke_prompt, stream_answer
from app.models.ai.translation import TranslationModel
from app.prompts.translate_prompt import TRANSLATE_PROMPT

class LanguageTranslationService:

    def translate(self, text: list[str], target_language: str) -> str:

        complete_text = '\n'.join(text)
        if len(complete_text.strip()) == 0:
            return text

        input_variables = ["text", "target_language"]
        pydantic_parser = PydanticOutputParser(pydantic_object=TranslationModel)
        partial_variables = { "format_instructions": pydantic_parser.get_format_instructions()}
        prompt_template = create_prompt_template(TRANSLATE_PROMPT, input_variables, partial_variables)
        input_data = { "text": text, "target_language": target_language }
        run_id, result = invoke_prompt(prompt_template, pydantic_parser, input_data)
        print(result)
        translated_text_list: list[str] = result.translated_text
        try:
            # in case llm returned a stringified array in the first element of array
            first_element = translated_text_list[0]
            str_array = ast.literal_eval(first_element)

            if isinstance(str_array, list):
                return str_array

            return translated_text_list
        except Exception as e:
            return translated_text_list


    def translate_stream(self, text: str, target_language: str) -> str:

        if len(text.strip()) == 0:
            return text

        input_variables = ["text", "target_language"]
        pydantic_parser = PydanticOutputParser(pydantic_object=TranslationModel)
        partial_variables = { "format_instructions": pydantic_parser.get_format_instructions()}
        prompt_template = create_prompt_template(TRANSLATE_PROMPT, input_variables, partial_variables)
        input_data = { "text": text, "target_language": target_language }
        result: TranslationModel = stream_answer(prompt_template, pydantic_parser, input_data)
        return result


