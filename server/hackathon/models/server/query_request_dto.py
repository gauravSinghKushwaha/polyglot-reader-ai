from pydantic import BaseModel
from typing import Optional

class AnswerQueryDto(BaseModel):
    text: str
    query: str
