import os

import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sse_starlette import EventSourceResponse

from hackathon.models.server.selected_text_dto import SelectedTextDto
from hackathon.services.query_responder_service import QueryResponderService
from hackathon.models.server.query_request_dto import QueryResponderDto
from hackathon.models.server.translate_request_dto import TranslateTextDto
from hackathon.services.language_translation_service import LanguageTranslationService
from hackathon.services.selected_text_service import SelectedTextService
from hackathon.utils.response_builder import ResponseBuilder
from hackathon.utils.file_reader import read_json_file


# as supported by llama3.1
SUPPORTED_LANGUAGES = ["English", "German", "French", "Italian", "Portuguese", "Hindi", "Spanish", "Thai"]

app = FastAPI()
translation_service = LanguageTranslationService()
query_service = QueryResponderService()
selected_text_service = SelectedTextService()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # allow specific origins
    allow_methods=["*"],  # allow all HTTP methods
    allow_headers=["*"],  # allow all headers
)

def get_absolute_path(relative_path):
    return os.path.abspath(relative_path)

@app.get("/book")
async def book(book_id: str):
    if not book_id:
        raise HTTPException(status_code=400, detail="Book ID required")
    try:
        book_file_json = "/" + book_id + ".json"
        result = read_json_file(get_absolute_path("hackathon/output") + book_file_json)
        return ResponseBuilder.build_response(result)
    except Exception as ex:
        print("Exception: ", ex)
        raise HTTPException(status_code=422, detail="AI could not respond to your request.")

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

@app.post("/ask")
def ask_question_stream(req: QueryResponderDto):
    if not req.text or not req.query:
        raise HTTPException(status_code=400, detail="Text and query are required")

    def event_generator():
        try:
            # Call the function that generates your answer, yielding results as they are produced
            for answer_chunk in query_service.respond_to_query_stream(req.text, req.query, req.page_no, req.book_id):
                yield answer_chunk.answer # SSE format
        except Exception as ex:
            print("Exception: ", ex)
            yield "data: AI could not respond to your request.\n\n"

    return EventSourceResponse(event_generator(), media_type="text/event-stream")

@app.post("/selected_text")
def selected_text(req: SelectedTextDto):
    if not req.text or not req.content or not req.target_language:
        raise HTTPException(status_code=400, detail="Text, content and language are required")

    def event_generator():
        try:
            # Call the function that generates your answer, yielding results as they are produced
            for answer_chunk in selected_text_service.generate_meta_data(req.text, req.content, req.target_language):
                yield answer_chunk # SSE format
        except Exception as ex:
            print("Exception: ", ex)
            yield "data: AI could not respond to your request.\n\n"

    return EventSourceResponse(event_generator(), media_type="text/event-stream")


# @app.post("/summary")
# def build_summary_stream(req: SummarizeTextDto):
#     if not req.text:
#         raise HTTPException(status_code=400, detail="Text is required")
#     def event_generator():
#         try:
#             # Call the function that generates your answer, yielding results as they are produced
#             for answer_chunk in summary_service.generate_summary_stream(req.text):
#                 yield prepare_sse_output(answer_chunk) # SSE format
#         except Exception as ex:
#             print("Exception: ", ex)
#             yield "data: AI could not respond to your request.\n\n"
#
#     return EventSourceResponse(event_generator(), media_type="text/event-stream")
#
# @app.post("/vocab")
# def build_vocab_stream(req: VocabTextDto):
#     if not req.text:
#         raise HTTPException(status_code=400, detail="Text is required")
#     def event_generator():
#         try:
#             # Call the function that generates your answer, yielding results as they are produced
#             for answer_chunk in vocab_service.generate_vocab_stream(req.text):
#                 yield prepare_sse_output(answer_chunk) # SSE format
#         except Exception as ex:
#             print("Exception: ", ex)
#             yield "data: AI could not respond to your request.\n\n"
#
#     return EventSourceResponse(event_generator(), media_type="text/event-stream")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)