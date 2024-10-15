from pydantic import BaseModel

class TranslateTextDto(BaseModel):
    text: str
    target_language: str
