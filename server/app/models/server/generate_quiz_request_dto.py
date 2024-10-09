from pydantic import BaseModel

class GenerateQuizDto(BaseModel):
    text: str
