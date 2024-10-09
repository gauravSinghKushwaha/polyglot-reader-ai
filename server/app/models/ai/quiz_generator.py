from pydantic import BaseModel, Field


class QuestionAnswerModel(BaseModel):

    question: str = Field(
        title="question",
        description="A question in a quiz",
    )

    answer: str = Field(
        title="answer",
        description="The answer to the question",
    )

    def __str__(self):
        return f"question: {self.question}, answer: {self.answer}"

    def to_dict(self):
        return {"question": self.question, "answer": self.answer}


class QuizGeneratorModel(BaseModel):
    """A model to represent a quiz generated based on given text."""

    quiz: list[QuestionAnswerModel] = Field(
        title="",
        description="list of questions and answers",
    )

    def __str__(self):
        return f"Quiz: {self.quiz}"

    def to_dict(self):
        return {"quiz": self.quiz}
