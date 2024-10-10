from pydantic import BaseModel

class TranslateTextDto(BaseModel):
    text: list[str]
    target_language: str
