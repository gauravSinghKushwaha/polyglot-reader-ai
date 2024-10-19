from pydantic import BaseModel

class SelectedTextDto(BaseModel):
    text: str
    content: str
    target_language: str
