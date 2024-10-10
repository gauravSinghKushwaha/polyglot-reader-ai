from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.models.server.generate_quiz_request_dto import GenerateQuizDto
from app.models.server.query_request_dto import AnswerQueryDto
from app.models.server.summarize_request_dto import SummarizeTextDto
from app.models.server.translate_request_dto import TranslateTextDto
from app.services.language_translation_service import LanguageTranslationService
from app.services.summary_generator_service import SummaryGeneratorService
from app.services.quiz_generator_service import QuizGeneratorService
from app.services.query_responder_service import QueryResponderService
from app.utils.response_builder import ResponseBuilder
import uvicorn

# as supported by llama3.1
SUPPORTED_LANGUAGES = ["English", "German", "French", "Italian", "Portuguese", "Hindi", "Spanish", "Thai"]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # allow specific origins
    allow_methods=["*"],  # allow all HTTP methods
    allow_headers=["*"],  # allow all headers
)

# Initialize services
translation_service = LanguageTranslationService()
summary_service = SummaryGeneratorService()
quiz_service = QuizGeneratorService()
query_service = QueryResponderService()

@app.post("/translate")
async def translate_text(req: TranslateTextDto):
    if not req.text or not req.target_language:
        raise HTTPException(status_code=400, detail="Text and target language are required")
    try:
        response = translation_service.translate(req.text, req.target_language)
        return ResponseBuilder.build_list_response(response)
    except Exception as ex:
        print("Exception: ", ex)
        raise HTTPException(status_code=422, detail="AI could not respond to your request.")

@app.post("/comprehend/build_summary")
async def build_summary(req: SummarizeTextDto):
    if not req.text:
        raise HTTPException(status_code=400, detail="Text is required")
    try:
        summary = summary_service.generate_summary(req.text)
        return ResponseBuilder.build_response(summary)
    except Exception as ex:
        print("Exception: ", ex)
        raise HTTPException(status_code=422, detail="AI could not respond to your request.")

@app.post("/comprehend/generate_quiz")
async def generate_quiz(req: GenerateQuizDto):
    if not req.text:
        raise HTTPException(status_code=400, detail="Text is required")
    try:
        quiz = quiz_service.generate_quiz(req.text)
        return ResponseBuilder.build_response(quiz)
    except Exception as ex:
        print("Exception: ", ex)
        raise HTTPException(status_code=422, detail="AI could not respond to your request.")

@app.post("/comprehend/ask_question")
async def ask_question(req: AnswerQueryDto):
    if not req.text or not req.query:
        raise HTTPException(status_code=400, detail="Text and query are required")
    try:
        answer = query_service.respond_to_query(req.text, req.query)
        return ResponseBuilder.build_response(answer)
    except Exception as ex:
        print("Exception: ", ex)
        raise HTTPException(status_code=422, detail="AI could not respond to your request.")


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)