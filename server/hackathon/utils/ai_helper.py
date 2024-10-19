import uuid

from langchain_ollama.llms import OllamaLLM
from langchain_core.exceptions import OutputParserException
from langchain_core.output_parsers import PydanticOutputParser
from langchain_core.prompts import PromptTemplate
from retry import retry

USE_OPENAI = False

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

def getOpenAiLLMModel():
    LLM_MODEL_SMALL_CONTEXT_OPENAI = ChatOpenAI(
        name="gpt-4", temperature=0,
    )

    # LLM_MODEL_SMALL_CONTEXT_OPENAI = OpenAI(model="gpt-3.5-turbo",temperature=0)

    return LLM_MODEL_SMALL_CONTEXT_OPENAI

def get_llm():
    if USE_OPENAI:
        return getOpenAiLLMModel()
    
    return OllamaLLM(
        # base_url= "https://pfai.splashmath.com",
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

def invoke_simple_chain(prompt: PromptTemplate, input_data: dict):

    model = get_llm()
    run_id = uuid.uuid4()
    chain = prompt | model
    result = chain.invoke(input_data, config={"run_id": run_id})
    return result

def stream_answer(prompt: PromptTemplate, pydantic_parser: PydanticOutputParser, input_data: dict):
    model = get_llm()
    run_id = uuid.uuid4()
    chain = prompt | model | pydantic_parser
    print(prompt.format(**input_data))

    for chunk in chain.stream(input_data, config={"run_id": run_id}):
        yield chunk  # Yield each chunk as it's produced

