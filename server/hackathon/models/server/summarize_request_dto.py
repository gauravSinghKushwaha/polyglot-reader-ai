from pydantic import BaseModel
from typing import Optional

class SummarizeTextDto(BaseModel):
    text: str
