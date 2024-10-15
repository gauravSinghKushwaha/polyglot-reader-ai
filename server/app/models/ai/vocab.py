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
    synonym: str = Field(
        title="synonym",
        description="Synonym of the word",
    )
    example: str = Field(
        title="example",
        description="Example of the word being used in another sentence",
    )

    def __str__(self):
        return f"word: {self.word}, meaning: {self.meaning}, synonym: {self.synonym}, example: {self.example}"

    def to_dict(self):
        return {"word": self.word, "meaning": self.meaning, "synonym": self.synonym, "example": self.example}

class VocabModel(BaseModel):
    """A model to represent a text's summary."""

    top_words: list[Words] = Field(
        title="top_words",
        description="The top_words of the given text and their meaning",
    )

    def __str__(self):
        return f"Top Words: {self.top_words}"

    def to_dict(self):
        return {"top_words": self.top_words}
