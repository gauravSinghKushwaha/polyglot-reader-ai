from pydantic import BaseModel, Field

class Words(BaseModel):

    word: str = Field(
        title="word",
        description="One of the top word in the text",
    )
    meaning: str = Field(
        title="meaning",
        description="Meaning of the word",
    )

    def __str__(self):
        return f"word: {self.word}, meaning: {self.meaning}"

    def to_dict(self):
        return {"word": self.word, "meaning": self.meaning}

class SummaryModel(BaseModel):
    """A model to represent a text's summary."""

    summary: str = Field(
        title="summary",
        description="The summary of the given text",
    )

    top_words: list[Words] = Field(
        title="top_words",
        description="The top_words of the given text and their meaning",
    )

    cultural_inferences: list[str] = Field(
        title="cultural_inferences",
        description="List of culturally important information",
    )

    def __str__(self):
        return f"Summary: {self.summary}, Top Words: {self.top_words}, Cultural information: {self.cultural_inferences}"

    def to_dict(self):
        return {"summary": self.summary, "top_words": self.top_words, "cultural_inferences": self.cultural_inferences}
