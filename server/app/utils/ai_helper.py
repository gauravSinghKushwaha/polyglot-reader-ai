import uuid

from langchain_ollama.llms import OllamaLLM
from langchain_core.exceptions import OutputParserException
from langchain_core.output_parsers import PydanticOutputParser
from langchain_core.prompts import PromptTemplate
from retry import retry


def create_prompt_template(template: str, input_variables=None, partial_variables=None) -> PromptTemplate:
    """
    Reusable method to create a PromptTemplate from a template string.
    """
    return PromptTemplate(
        template=template,
        input_variables=input_variables or [],
        partial_variables=partial_variables or {},
    )

@retry(
    exceptions=OutputParserException,
    delay=1,
    backoff=2,
    max_delay=4,
    tries=1,
)

def get_llm():
    return OllamaLLM(
        model="llama3.2",
        temperature=0,
        format="json",
    )


def invoke_prompt(prompt: PromptTemplate, pydantic_parser: PydanticOutputParser, input_data: dict):

    model = get_llm()
    run_id = uuid.uuid4()
    chain = prompt | model | pydantic_parser
    result = chain.invoke(input_data, config={"run_id": run_id})
    return run_id, result

