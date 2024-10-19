from pydantic import BaseModel

class QueryResponderDto(BaseModel):
    text: str
    query: str
