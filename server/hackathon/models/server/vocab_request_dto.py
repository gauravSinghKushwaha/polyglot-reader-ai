from pydantic import BaseModel
from typing import Optional

class VocabTextDto(BaseModel):
    text: str
