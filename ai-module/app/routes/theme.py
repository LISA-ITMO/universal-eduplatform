from fastapi import APIRouter, HTTPException
from app.schemas.theme import CreateThemeRequest, ThemeResponse
from app.services.theme import create_theme, delete_theme, get_all_themes, \
    get_theme_by_id

from typing import List

router = APIRouter()

@router.post("/create",
             response_model=ThemeResponse,
             summary="Create theme")
async def create_new_theme(request: CreateThemeRequest):
    try:
        return await create_theme(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/delete/{theme_id}",
               summary="Delete theme by id")
async def delete_existing_theme(theme_id: int):
    try:
        await delete_theme(theme_id)
        return {"detail": "Theme deleted"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/get-all",
             response_model=List[ThemeResponse],
             summary="Get all themes")
async def create_new_theme():
    try:
        return await get_all_themes()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/get/{theme_id}",
             response_model=ThemeResponse,
             summary="Get theme by id")
async def create_new_theme(theme_id):
    try:
        return await get_theme_by_id(theme_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))