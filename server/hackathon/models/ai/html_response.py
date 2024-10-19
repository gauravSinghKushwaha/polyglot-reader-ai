from pydantic import BaseModel, Field

class HtmlResponseModel(BaseModel):
    """A model to represent the information required to be formatted using appropriate HTML tags."""

    html_response: str = Field(
        title="html_response",
        description="information desired formatted using HTML tags",
    )

    def __str__(self):
        return f"HTML response: {self.html_response}"

    def to_dict(self):
        return {"html_response": self.html_response}
