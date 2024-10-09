from pydantic import BaseModel, Field

class SummaryModel(BaseModel):
    """A model to represent a text's summary."""

    summary: str = Field(
        title="summary",
        description="The summary of the given text",
    )

    def __str__(self):
        return f"Summary: {self.summary}"

    def to_dict(self):
        return {"summary": self.summary}
