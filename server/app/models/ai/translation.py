from pydantic import BaseModel, Field

class TranslationModel(BaseModel):
    """A model to represent a text's translation to another language."""

    translated_text: str = Field(
        title="translated_text",
        description="The translated text of the given input text",
    )

    def __str__(self):
        return f"Translated text: {self.translated_text}"

    def to_dict(self):
        return {"translated_text": self.translated_text}
