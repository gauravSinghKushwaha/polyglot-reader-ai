from pydantic import BaseModel, Field

class SelectedTextModel(BaseModel):
    """A model to represent the HTML response to the given task"""

    html: str = Field(
        title="html",
        description="The answer to the task formatted as HTML using h1, p, ul, li only and links in a[target = _blank] tags only.",
    )

    def __str__(self):
        return f"data: {self.html}"

    def to_dict(self):
        return {"data": self.html}
