from fastapi import FastAPI, HTTPException
from app.models.text_input import TextInput
from app.services.core_service import CoreService
from app.services.language_translation_service import LanguageTranslationService
from app.services.vocabulary_assistance_service import VocabularyAssistanceService
from app.services.summary_generator_service import SummaryGeneratorService
from app.services.quiz_generator_service import QuizGeneratorService
from app.services.query_responder_service import QueryResponderService
from app.llm.llm_client import LLMClient
from app.utils.response_builder import ResponseBuilder

app = FastAPI()

# Initialize LLM client
llm_client = LLMClient()

# Initialize services
core_service = CoreService(llm_client)
translation_service = LanguageTranslationService(llm_client)
vocab_service = VocabularyAssistanceService(llm_client)
summary_service = SummaryGeneratorService(llm_client)
quiz_service = QuizGeneratorService(llm_client)
query_service = QueryResponderService(llm_client)

@app.post("/vocab")
async def vocab_assistance(input: TextInput):
    if not input.text:
        raise HTTPException(status_code=400, detail="Text is required")
    response = vocab_service.provide_assistance(input.text)
    return ResponseBuilder.build_response(response)

@app.post("/translate")
async def translate_text(input: TextInput):
    if not input.text or not input.target_language:
        raise HTTPException(status_code=400, detail="Text and target language are required")
    response = translation_service.translate(input.text, input.target_language)
    return ResponseBuilder.build_response(response)

@app.post("/comprehend/build_summary")
async def build_summary(input: TextInput):
    if not input.text:
        raise HTTPException(status_code=400, detail="Text is required")
    summary = summary_service.generate_summary(input.text, level="PageLevel")
    return ResponseBuilder.build_response(summary)

@app.post("/comprehend/generate_quiz")
async def generate_quiz(input: TextInput):
    if not input.text:
        raise HTTPException(status_code=400, detail="Text is required")
    quiz = quiz_service.generate_quiz(input.text, level="PageLevel")
    return ResponseBuilder.build_response(quiz)

@app.post("/comprehend/ask_question")
async def ask_question(input: TextInput):
    if not input.text or not input.context:
        raise HTTPException(status_code=400, detail="Text and context are required")
    answer = query_service.respond_to_query(input.context, input.text)
    return ResponseBuilder.build_response(answer)
