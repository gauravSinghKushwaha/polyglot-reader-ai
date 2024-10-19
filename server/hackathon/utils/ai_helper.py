import uuid

from langchain_core.output_parsers import PydanticOutputParser
from langchain_core.prompts import PromptTemplate
from langchain_ollama.llms import OllamaLLM


def create_prompt_template(
    template: str, input_variables=None, partial_variables=None
) -> PromptTemplate:
    """
    Reusable method to create a PromptTemplate from a template string.
    """
    return PromptTemplate(
        template=template,
        input_variables=input_variables or [],
        partial_variables=partial_variables or {},
    )

def get_llm():

    return OllamaLLM(
        base_url="https://pfai.splashmath.com",
        model="llama3.2",
        temperature=0,
        format="json",
    )


def invoke_prompt(
    prompt: PromptTemplate, pydantic_parser: PydanticOutputParser, input_data: dict
):

    model = get_llm()
    run_id = uuid.uuid4()
    chain = prompt | model | pydantic_parser
    print(prompt.format(**input_data))
    result = chain.invoke(input_data, config={"run_id": run_id})
    return run_id, result


def invoke_simple_chain(prompt: PromptTemplate, input_data: dict):

    model = get_llm()
    run_id = uuid.uuid4()
    chain = prompt | model
    print(prompt.format(**input_data))
    result = chain.invoke(input_data, config={"run_id": run_id})
    return result


def stream_answer(
    prompt: PromptTemplate, pydantic_parser: PydanticOutputParser, input_data: dict
):
    model = get_llm()
    run_id = uuid.uuid4()
    chain = prompt | model
    print(prompt.format(**input_data))

    for chunk in chain.stream(input_data, config={"run_id": run_id}):
        print(chunk)
        yield chunk  # Yield each chunk as it's produced

def stream_simple_answer(
    prompt: PromptTemplate, input_data: dict
):
    model = get_llm()
    run_id = uuid.uuid4()
    chain = prompt | model
    print(prompt.format(**input_data))

    for chunk in chain.stream(input_data, config={"run_id": run_id}):
        print(chunk)
        yield chunk  # Yield each chunk as it's produced
