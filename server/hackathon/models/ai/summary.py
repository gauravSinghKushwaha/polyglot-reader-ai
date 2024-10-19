from pydantic import BaseModel, Field

class CulturalInferences(BaseModel):

    cultural_inference: str = Field(
        title="cultural_inference",
        description="Important cultural information or inference made from the text, be it historic, geographic, societal etc"
    )

    relevance_to_text: str = Field(
        title="relevance_to_text",
        description="why this cultural information is relevant or important to the given text"
    )

    additional_info: str = Field(
        title="additional_info",
        description="Any other useful information not present in the given text"
    )

    def __str__(self):
        return f"Cultural inference: {self.cultural_inference}, Relevance to text: {self.relevance_to_text}, Additional information: {self.additional_info}"

    def to_dict(self):
        return {"cultural_inference": self.cultural_inference, "relevance_to_text": self.relevance_to_text, "additional_info": self.additional_info}


class SummaryModel(BaseModel):
    """A model to represent a text's summary."""

    summary: str = Field(
        title="summary",
        description="The summary of the given text",
    )

    cultural_inferences: list[CulturalInferences] = Field(
        title="cultural_inferences",
        description="List of culturally important information and additional information about them",
    )

    def __str__(self):
        return f"Summary: {self.summary}, Cultural information: {self.cultural_inferences}"

    def to_dict(self):
        return {"summary": self.summary, "cultural_inferences": self.cultural_inferences}
