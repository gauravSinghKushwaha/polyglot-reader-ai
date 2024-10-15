from langchain_core.output_parsers import PydanticOutputParser

from app.models.ai.query_responser import QueryResponderModel
from app.prompts.query_responser_prompt import QUERY_RESPONDER_PROMPT
from app.utils.ai_helper import create_prompt_template, invoke_prompt, stream_answer


class QueryResponderService:

    def respond_to_query(self, text: str, query: str) -> str:
        input_variables = ["text", "query"]
        pydantic_parser = PydanticOutputParser(pydantic_object=QueryResponderModel)
        partial_variables = { "format_instructions": pydantic_parser.get_format_instructions()}
        prompt_template = create_prompt_template(QUERY_RESPONDER_PROMPT, input_variables, partial_variables)
        input_data = { "text": text, "query": query }
        result = invoke_prompt(prompt_template, pydantic_parser, input_data)
        return result
    
    def respond_to_query_stream(self, text: str, query: str) -> str:
        input_variables = ["text", "query"]
        pydantic_parser = PydanticOutputParser(pydantic_object=QueryResponderModel)
        partial_variables = { "format_instructions": pydantic_parser.get_format_instructions()}
        prompt_template = create_prompt_template(QUERY_RESPONDER_PROMPT, input_variables, partial_variables)
        input_data = { "text": text, "query": query }
        print("hello")
        result = stream_answer(prompt_template, pydantic_parser, input_data)
        return result
