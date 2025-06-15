from pydantic import BaseModel
from typing import List, Dict

class Question(BaseModel):
    question_text: str
    options: List[str]

class Test(BaseModel):
    id: int
    theme: str
    questions: List[Question]