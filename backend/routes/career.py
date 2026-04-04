from fastapi import APIRouter, Depends
from models import CareerQuestionnaire
from pydantic import BaseModel
from routes.auth import get_current_user
from database import db
from services.ai_service import classify_career_path
from bson import ObjectId

router = APIRouter(prefix="/api/career", tags=["career"])

class PathSelection(BaseModel):
    path: str

@router.post("/select-path")
async def select_path(
    selection: PathSelection,
    current_user: dict = Depends(get_current_user)
):
    await db.users.update_one(
        {"_id": ObjectId(current_user["_id"])},
        {"$set": {"selected_path": selection.path}}
    )
    return {"status": "success", "selected_path": selection.path}

@router.post("/analyze")
async def analyze_career(
    questionnaire: CareerQuestionnaire,
    current_user: dict = Depends(get_current_user)
):
    result = await classify_career_path(questionnaire.dict())
    
    # Save the selected path to user
    suggested_path = result.get("suggested_path")
    if suggested_path:
        await db.users.update_one(
            {"_id": ObjectId(current_user["_id"])},
            {"$set": {"selected_path": suggested_path}}
        )
    
    return result
