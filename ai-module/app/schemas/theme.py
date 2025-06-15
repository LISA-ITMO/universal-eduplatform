from pydantic import BaseModel, Field

class CreateThemeRequest(BaseModel):
    name: str = Field(..., example="Искусственный интеллект")
    descr: str = Field(..., example="Зачем и как ИИ нужен и может использоваться для обучения?")

class ThemeResponse(BaseModel):
    id: int = Field(..., example=1)
    name: str = Field(..., example="Про ИИ")
    descr: str = Field(..., example="")