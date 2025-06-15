from fastapi import APIRouter, HTTPException
from app.schemas.test import TestCreateRequest, TestCreateResponse, TestPassRequest, TestPassResponse
from app.services.test import create_test, pass_test

router = APIRouter()

@router.post("/create",
             response_model=TestCreateResponse,
             summary="Create test on theme")
async def create_new_test(request: TestCreateRequest):
    try:
        return await create_test(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/pass",
             response_model=TestPassResponse,
             summary="Pass test on theme")
async def pass_existing_test(request: TestPassRequest):
    try:
        return await pass_test(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))