from pydantic import BaseModel
from typing import Optional

class TextInput(BaseModel):
    text: str
    target_language: Optional[str] = None  # Used for translation
    context: Optional[str] = None          # Used for context-specific queries
