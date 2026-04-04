from fastapi import APIRouter, Depends
from pydantic import BaseModel
from routes.auth import get_current_user
from database import db
from bson import ObjectId
import datetime

router = APIRouter(prefix="/api/community", tags=["community"])

class PostCreate(BaseModel):
    content: str
    
class CommentCreate(BaseModel):
    content: str

@router.post("/posts")
async def create_post(
    req: PostCreate,
    current_user: dict = Depends(get_current_user)
):
    post = {
        "user_id": current_user["_id"],
        "user_name": current_user["name"],
        "content": req.content,
        "likes": 0,
        "comments": [],
        "createdAt": datetime.datetime.utcnow()
    }
    result = await db.posts.insert_one(post)
    post["_id"] = str(result.inserted_id)
    return post

@router.get("/posts")
async def get_posts():
    cursor = db.posts.find().sort("createdAt", -1).limit(50)
    posts = []
    async for post in cursor:
        post["_id"] = str(post["_id"])
        posts.append(post)
    return posts
