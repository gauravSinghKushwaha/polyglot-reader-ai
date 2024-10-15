from pydantic import BaseModel, Field

class SummaryAnswerModel(BaseModel):
    """A model to represent the summary and other information in html format."""

    summary: str = Field(
        title="summary",
        description="summary and other required information in html format",
    )

    def __str__(self):
        return f"summary: {self.summary}"

    def to_dict(self):
        return {"summary": self.summary}
