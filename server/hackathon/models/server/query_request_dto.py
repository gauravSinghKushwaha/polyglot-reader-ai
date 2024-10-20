from pydantic import BaseModel

class QueryResponderDto(BaseModel):
    text: str
    query: str
    page_no: str
    book_id: str
