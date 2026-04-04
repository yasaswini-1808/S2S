from fastapi import APIRouter, Depends
from pydantic import BaseModel
from routes.auth import get_current_user
from services.ai_service import fetch_video_recommendations

router = APIRouter(prefix="/api/courses", tags=["courses"])

class VideoFetchRequest(BaseModel):
    topic: str
    level: str = "beginner/intermediate"
    careerPath: str = "placement"

@router.post("/recommendations")
async def get_video_recommendations(
    req: VideoFetchRequest,
    current_user: dict = Depends(get_current_user)
):
    videos = await fetch_video_recommendations(req.topic, req.level, req.careerPath)
    
    return {
        "success": True,
        "topic": req.topic,
        "videos": videos
    }
