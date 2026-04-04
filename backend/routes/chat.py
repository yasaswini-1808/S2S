from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from routes.auth import get_current_user
from services.ai_service import get_chat_response

router = APIRouter(prefix="/api/chat", tags=["chat"])

class ChatMessage(BaseModel):
    role: str # "user" or "assistant"
    content: str

class ChatRequest(BaseModel):
    query: str
    history: List[ChatMessage]
    careerPath: Optional[str] = "General"
    currentPage: Optional[str] = "/dashboard"

@router.post("/message")
async def process_chat(req: ChatRequest, current_user: dict = Depends(get_current_user)):
    try:
        # history is a list of dicts: [{"role": "user", "content": "..."}, ...]
        history_dicts = [{"role": m.role, "content": m.content} for m in req.history]
        
        response = await get_chat_response(
            query=req.query,
            history=history_dicts,
            career_path=req.careerPath,
            current_page=req.currentPage
        )
        return {"success": True, "response": response}
    except Exception as e:
        print(f"Chat API Error: {e}")
        raise HTTPException(status_code=500, detail="Failed to process chat message")
