from pydantic import BaseModel, Field

class SelectedTextModel(BaseModel):
    """A model to represent the answer to a query based on the given text."""

    answer: str = Field(
        title="answer",
        description="The answer to a query",
    )

    def __str__(self):
        return f"Answer: {self.answer}"

    def to_dict(self):
        return {"answer": self.answer}
