from pydantic import BaseModel, Field
from typing import List, Dict, Optional

class TestCreateRequest(BaseModel):
    theme: int = Field(..., example=1)
    options: Optional[str] = Field(None, example="Create 4 questions with 1 right answer")

class TestCreateResponse(BaseModel):
    theme: int = Field(..., example=1)
    question: str = Field(..., example="Где ИИ повышает эффективность обучения? (несколько)?")
    answers: List[Dict] = Field(..., example=[
        {
            "Анализ успеваемости": 't'
        },
        {
            "Персональные тесты": 't'
        },
        {
            "Соцсети без учёбы": 'f'
        },
        {
            "Виртуальные лаборатории": 'f'
        }
    ])

class TestPassRequest(BaseModel):
    theme: int = Field(..., example=1)
    question: str = Field(..., example="Где ИИ улучшает доступность обучения?")
    answers: List[str] = Field(..., example=[
        "Субтитры",
        "Озвучка",
        "Физический контроль",
        "Персональные ассистенты"
    ])

class TestPassResponse(BaseModel):
    right_answers: List[str] = Field(..., example=["A", "C"])