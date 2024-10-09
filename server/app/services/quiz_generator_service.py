from langchain_core.output_parsers import PydanticOutputParser

from app.models.ai.quiz_generator import QuizGeneratorModel
from app.prompts.quiz_generator_prompt import QUIZ_GENERATOR_PROMPT
from app.utils.ai_helper import invoke_prompt, create_prompt_template


class QuizGeneratorService:

    def generate_quiz(self, text: str) -> str:
        input_variables = ["text"]
        pydantic_parser = PydanticOutputParser(pydantic_object=QuizGeneratorModel)
        partial_variables = { "format_instructions": pydantic_parser.get_format_instructions()}
        prompt_template = create_prompt_template(QUIZ_GENERATOR_PROMPT, input_variables, partial_variables)
        input_data = { "text": text }
        result = invoke_prompt(prompt_template, pydantic_parser, input_data)
        return result
