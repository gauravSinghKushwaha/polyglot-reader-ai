from langchain_core.output_parsers import PydanticOutputParser

from hackathon.models.ai.query_responser import QueryResponderModel
from hackathon.prompts.query_responser_prompt import QUERY_RESPONDER_PROMPT
from hackathon.services.vector_store import query_db
from hackathon.utils.ai_helper import create_prompt_template, invoke_prompt, stream_answer


class QueryResponderService:

    def respond_to_query(self, text: str, query: str) -> str:
        input_variables = ["text", "query"]
        pydantic_parser = PydanticOutputParser(pydantic_object=QueryResponderModel)
        partial_variables = { "format_instructions": pydantic_parser.get_format_instructions()}
        prompt_template = create_prompt_template(QUERY_RESPONDER_PROMPT, input_variables, partial_variables)
        input_data = { "text": text, "query": query }
        result = invoke_prompt(prompt_template, pydantic_parser, input_data)
        return result
    
    def respond_to_query_stream(self, text: str, query: str, page_no: str, book_id: str) -> str:
        input_variables = ["text", "query"]
        pydantic_parser = PydanticOutputParser(pydantic_object=QueryResponderModel)
        partial_variables = { "format_instructions": pydantic_parser.get_format_instructions()}
        prompt_template = create_prompt_template(QUERY_RESPONDER_PROMPT, input_variables, partial_variables)
        result = query_db(page_no, book_id, query)

        final_text = ""
        if result is None or result['data'] is None:
            final_text = text
        else:
            ids = result['ids'][0]
            docs = result['documents'][0]
            if page_no in ids:
                final_text = " ".join(docs)
            else:
                final_text = " ".join(docs) + "\n\n" + text

        input_data = { "text": final_text, "query": query }
        result = stream_answer(prompt_template, pydantic_parser, input_data)
        return result
