from typing import List
from peewee import DoesNotExist
from app.config import db
from app.models.theme import Theme as ThemeModel
from app.schemas.theme import CreateThemeRequest, ThemeResponse

async def create_theme(request: CreateThemeRequest) -> ThemeResponse:
    """
    Сохраняем новую тему в БД и возвращаем её Pydantic-модель.
    """
    db.connect(reuse_if_open=True)
    theme = ThemeModel.create(name=request.name, descr=request.descr)
    # если нужно сразу сохранить (Peewee обычно сохраняет сразу при .create())
    db.close()
    return ThemeResponse(id=theme.id, name=theme.name, descr=theme.descr)

async def delete_theme(theme_id: int) -> None:
    """
    Удаляем тему по ID. Если темы нет — не даём упасть.
    """
    db.connect(reuse_if_open=True)
    (ThemeModel
        .delete()
        .where(ThemeModel.id == theme_id)
        .execute()
    )
    db.close()

async def get_all_themes() -> List[ThemeResponse]:
    """
    Возвращаем список всех тем.
    """
    db.connect(reuse_if_open=True)
    themes = [
        ThemeResponse(id=t.id, name=t.name, descr=t.descr)
        for t in ThemeModel.select()
    ]
    db.close()
    return themes

async def get_theme_by_id(theme_id: int) -> ThemeResponse:
    """
    Возвращаем одну тему или кидаем исключение.
    """
    db.connect(reuse_if_open=True)
    try:
        t = ThemeModel.get(ThemeModel.id == theme_id)
    except DoesNotExist:
        db.close()
        raise
    db.close()
    return ThemeResponse(id=t.id, name=t.name, descr=t.descr)