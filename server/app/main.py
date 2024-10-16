import json

import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sse_starlette import EventSourceResponse

from app.models.ai.vocab import VocabModel
from app.models.server.query_request_dto import AnswerQueryDto
from app.models.server.summarize_request_dto import SummarizeTextDto
from app.models.server.translate_request_dto import TranslateTextDto
from app.models.server.vocab_request_dto import VocabTextDto
from app.services.language_translation_service import LanguageTranslationService
from app.services.query_responder_service import QueryResponderService
from app.services.summary_generator_service import SummaryGeneratorService
from app.services.vocab_generator_service import VocabGeneratorService
from pydantic import BaseModel

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
vocab_service = VocabGeneratorService()
query_service = QueryResponderService()

# @app.post("/translate")
# async def translate_text(req: TranslateTextDto):
#     if not req.text or not req.target_language:
#         raise HTTPException(status_code=400, detail="Text and target language are required")
#     try:
#         result = translation_service.translate(req.text, req.target_language)
#         return ResponseBuilder.build_response(result)
#     except Exception as ex:
#         print("Exception: ", ex)
#         raise HTTPException(status_code=422, detail="AI could not respond to your request.")

# @app.post("/comprehend/build_summary")
# async def build_summary(req: SummarizeTextDto):
#     if not req.text:
#         raise HTTPException(status_code=400, detail="Text is required")
#     try:
#         summary = summary_service.generate_summary(req.text)
#         return ResponseBuilder.build_response(summary)
#     except Exception as ex:
#         print("Exception: ", ex)
#         raise HTTPException(status_code=422, detail="AI could not respond to your request.")

# @app.post("/comprehend/generate_quiz")
# async def generate_quiz(req: GenerateQuizDto):
#     if not req.text:
#         raise HTTPException(status_code=400, detail="Text is required")
#     try:
#         quiz = quiz_service.generate_quiz(req.text)
#         return ResponseBuilder.build_str_response(quiz)
#     except Exception as ex:
#         print("Exception: ", ex)
#         raise HTTPException(status_code=422, detail="AI could not respond to your request.")

# @app.post("/comprehend/ask_question")
# def ask_question(req: AnswerQueryDto):
#     if not req.text or not req.query:
#         raise HTTPException(status_code=400, detail="Text and query are required")
#     try:
#         answer = query_service.respond_to_query(req.text, req.query)
#         return ResponseBuilder.build_str_response(answer)
#     except Exception as ex:
#         print("Exception: ", ex)
#         raise HTTPException(status_code=422, detail="AI could not respond to your request.")

@app.post("/translate")
def translate_text_stream(req: TranslateTextDto):
    if not req.text or not req.target_language:
        raise HTTPException(status_code=400, detail="Text and target language are required")

    def event_generator():
        try:
            # Call the function that generates your answer, yielding results as they are produced
            for answer_chunk in translation_service.translate_stream(req.text, req.target_language):
                yield answer_chunk.translated_text # SSE format
        except Exception as ex:
            print("Exception: ", ex)
            yield "data: AI could not respond to your request.\n\n"

    return EventSourceResponse(event_generator(), media_type="text/event-stream")


@app.post("/summary")
def build_summary_stream(req: SummarizeTextDto):
    if not req.text:
        raise HTTPException(status_code=400, detail="Text is required")
    def event_generator():
        try:
            # Call the function that generates your answer, yielding results as they are produced
            for answer_chunk in summary_service.generate_summary_stream(req.text):
                yield prepare_sse_output(answer_chunk) # SSE format
        except Exception as ex:
            print("Exception: ", ex)
            yield "data: AI could not respond to your request.\n\n"

    return EventSourceResponse(event_generator(), media_type="text/event-stream")

@app.post("/vocab")
def build_vocab_stream(req: VocabTextDto):
    if not req.text:
        raise HTTPException(status_code=400, detail="Text is required")
    def event_generator():
        try:
            # Call the function that generates your answer, yielding results as they are produced
            for answer_chunk in vocab_service.generate_vocab_stream(req.text):
                yield prepare_sse_output(answer_chunk) # SSE format
        except Exception as ex:
            print("Exception: ", ex)
            yield "data: AI could not respond to your request.\n\n"

    return EventSourceResponse(event_generator(), media_type="text/event-stream")

@app.post("/ask")
def ask_question_stream(req: AnswerQueryDto):
    if not req.text or not req.query:
        raise HTTPException(status_code=400, detail="Text and query are required")

    def event_generator():
        try:
            # Call the function that generates your answer, yielding results as they are produced
            for answer_chunk in query_service.respond_to_query_stream(req.text, req.query):
                yield answer_chunk.answer # SSE format
        except Exception as ex:
            print("Exception: ", ex)
            yield "data: AI could not respond to your request.\n\n"

    return EventSourceResponse(event_generator(), media_type="text/event-stream")

def prepare_sse_output(result) -> str:
    json_output = result.model_dump(mode='json')
    stringified_json = json.dumps(json_output)  # SSE format
    print(stringified_json)
    return stringified_json

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)