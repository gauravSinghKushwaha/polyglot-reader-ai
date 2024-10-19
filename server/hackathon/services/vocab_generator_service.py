from langchain_core.output_parsers import PydanticOutputParser

from hackathon.models.ai.vocab import VocabModel
from hackathon.prompts.vocab_prompt import VOCAB_PROMPT
from hackathon.utils.ai_helper import invoke_prompt, create_prompt_template, stream_answer


class VocabGeneratorService:

    def generate_vocab(self, text: str) -> VocabModel:
        input_variables = ["text"]
        pydantic_parser = PydanticOutputParser(pydantic_object=VocabModel)
        partial_variables = { "format_instructions": pydantic_parser.get_format_instructions()}
        prompt_template = create_prompt_template(VOCAB_PROMPT, input_variables, partial_variables)
        input_data = { "text": text }
        run_id, result = invoke_prompt(prompt_template, pydantic_parser, input_data)
        return result
    
    def generate_vocab_stream(self, text: str) -> VocabModel:
        input_variables = ["text", "num_words"]
        words = text.split()
        num_words = 5
        if len(words) <= 5:
            num_words = len(words)

        pydantic_parser = PydanticOutputParser(pydantic_object=VocabModel)
        partial_variables = { "format_instructions": pydantic_parser.get_format_instructions()}
        prompt_template = create_prompt_template(VOCAB_PROMPT, input_variables, partial_variables)
        input_data = { "text": text, "num_words": num_words }
        result = stream_answer(prompt_template, pydantic_parser, input_data)
        return result
