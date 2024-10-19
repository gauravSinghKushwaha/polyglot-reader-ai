from langchain_core.output_parsers import PydanticOutputParser

from app.models.ai.summary import SummaryModel
from app.prompts.summarize_prompt import SUMMARIZE_PROMPT
from app.utils.ai_helper import invoke_prompt, create_prompt_template, stream_answer


class SummaryGeneratorService:

    def generate_summary(self, text: str) -> SummaryModel:
        input_variables = ["text"]
        pydantic_parser = PydanticOutputParser(pydantic_object=SummaryModel)
        partial_variables = { "format_instructions": pydantic_parser.get_format_instructions()}
        prompt_template = create_prompt_template(SUMMARIZE_PROMPT, input_variables, partial_variables)
        input_data = { "text": text }
        run_id, result = invoke_prompt(prompt_template, pydantic_parser, input_data)
        return result
    
    def generate_summary_stream(self, text: str) -> SummaryModel:
        input_variables = ["text"]
        pydantic_parser = PydanticOutputParser(pydantic_object=SummaryModel)
        partial_variables = { "format_instructions": pydantic_parser.get_format_instructions()}
        prompt_template = create_prompt_template(SUMMARIZE_PROMPT, input_variables, partial_variables)
        input_data = { "text": text }
        result = stream_answer(prompt_template, pydantic_parser, input_data)
        return result
