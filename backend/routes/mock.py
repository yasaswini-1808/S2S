from fastapi import APIRouter, Depends
from pydantic import BaseModel
from routes.auth import get_current_user
from services.ai_service import generate_mock_test, generate_mock_interview
from database import db

router = APIRouter(prefix="/api/mock", tags=["mock"])

class MockRequest(BaseModel):
    topics: list[str]
    careerPath: str

@router.post("/test")
async def get_mock_test(req: MockRequest, current_user: dict = Depends(get_current_user)):
    questions = await generate_mock_test(req.topics, req.careerPath)
    return {"success": True, "questions": questions}

class InterviewRequest(BaseModel):
    careerPath: str

@router.post("/interview")
async def get_mock_interview(req: InterviewRequest, current_user: dict = Depends(get_current_user)):
    user = await db.users.find_one({"_id": current_user["_id"]})
    completed = user.get("completed_modules", [])
    
    questions = await generate_mock_interview(completed, req.careerPath)
    return {"success": True, "questions": questions}
