from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from routes.auth import get_current_user
from database import db
from services.ai_service import generate_roadmap
from bson import ObjectId

router = APIRouter(prefix="/api/roadmap", tags=["roadmap"])

class RoadmapRequest(BaseModel):
    role: str
    time_weeks: int
    hours_per_day: int

@router.post("/generate")
async def create_roadmap(
    req: RoadmapRequest,
    current_user: dict = Depends(get_current_user)
):
    path_type = current_user.get("selected_path", "Placement Preparation")
    plan = await generate_roadmap(req.role, req.time_weeks, req.hours_per_day, path_type)
    
    roadmap_doc = {
        "user_id": current_user["_id"],
        "path_type": path_type,
        "goal": req.role,
        "daily_hours": req.hours_per_day,
        "time_weeks": req.time_weeks,
        "plan": plan,
        "progress": 0
    }
    
    await db.roadmaps.update_one(
        {"user_id": current_user["_id"]},
        {"$set": roadmap_doc},
        upsert=True
    )
    
    roadmap_doc["_id"] = "new" # mocking objectid for simplicity
    return roadmap_doc

@router.get("/me")
async def get_roadmap(current_user: dict = Depends(get_current_user)):
    roadmap = await db.roadmaps.find_one({"user_id": current_user["_id"]})
    if not roadmap:
        raise HTTPException(status_code=404, detail="No roadmap found")
    roadmap["_id"] = str(roadmap["_id"])
    return roadmap

class ModuleCompleteRequest(BaseModel):
    module_id: str

class TaskCompleteRequest(BaseModel):
    module_topic: str
    task_text: str

class ScoreSaveRequest(BaseModel):
    topic: str
    score: int
    total: int
    assessment_type: str # "test" or "interview"

@router.post("/complete-module")
async def complete_module(req: ModuleCompleteRequest, current_user: dict = Depends(get_current_user)):
    await db.users.update_one(
        {"_id": current_user["_id"]},
        {"$addToSet": {"completed_modules": req.module_id}}
    )
    return {"success": True}

@router.post("/complete-task")
async def complete_task(req: TaskCompleteRequest, current_user: dict = Depends(get_current_user)):
    # Store as a dict of module_topic -> list of completed tasks
    field = f"completed_tasks.{req.module_topic}"
    await db.users.update_one(
        {"_id": current_user["_id"]},
        {"$addToSet": {field: req.task_text}}
    )
    return {"success": True}

@router.post("/save-score")
async def save_score(req: ScoreSaveRequest, current_user: dict = Depends(get_current_user)):
    # Store scores separately to avoid nested complexity
    score_entry = {
        "score": req.score,
        "total": req.total,
        "type": req.assessment_type,
        "timestamp": ObjectId().generation_time
    }
    field = f"mock_scores.{req.topic}.{req.assessment_type}"
    await db.users.update_one(
        {"_id": current_user["_id"]},
        {"$set": {field: score_entry}}
    )
    return {"success": True}

@router.get("/grades")
async def get_grades(current_user: dict = Depends(get_current_user)):
    print(f"Fetching grades for user: {current_user['_id']}")
    roadmap = await db.roadmaps.find_one({"user_id": current_user["_id"]})
    print(f"Roadmap found: {True if roadmap else False}")
    user = await db.users.find_one({"_id": current_user["_id"]})
    
    if not roadmap:
        return {"modules": [], "overall": {"completed": 0, "average": 0}}
    
    completed_tasks_map = user.get("completed_tasks", {})
    mock_scores_map = user.get("mock_scores", {})
    
    grade_data = []
    total_score = 0
    total_possible = 0
    total_modules_completed = 0
    
    for module in roadmap.get("plan", []):
        topic = module["topic"]
        tasks = module.get("tasks", [])
        done_tasks = completed_tasks_map.get(topic, [])
        
        # Learning Score calculation (10 marks per task)
        learning_score = len(done_tasks) * 10
        learning_total = len(tasks) * 10
        
        # Mock scores
        m_scores = mock_scores_map.get(topic, {})
        test_score = m_scores.get("test", {}).get("score", 0)
        test_total = m_scores.get("test", {}).get("total", 0)
        
        interview_score = m_scores.get("interview", {}).get("score", 0)
        interview_total = m_scores.get("interview", {}).get("total", 0)
        
        # Final aggregation
        status = "Not Started"
        if len(done_tasks) == len(tasks) and len(tasks) > 0:
            status = "Completed"
            total_modules_completed += 1
        elif len(done_tasks) > 0:
            status = "In Progress"
            
        grade_data.append({
            "name": topic,
            "week": module.get("week"),
            "submitted": len(done_tasks),
            "total_tasks": len(tasks),
            "status": status,
            "learning_score": learning_score,
            "learning_total": learning_total,
            "mock_test_score": test_score,
            "mock_test_total": test_total,
            "interview_score": interview_score,
            "interview_total": interview_total,
            "final_score": learning_score + test_score + interview_score,
            "final_total": learning_total + test_total + interview_total
        })
        
        total_score += (learning_score + test_score + interview_score)
        total_possible += (learning_total + test_total + interview_total)
    
    # Add standalone Interview score if it exists and wasn't matched to a module
    if "Mock Interview" in mock_scores_map:
        m_scores = mock_scores_map["Mock Interview"]
        interview_score = m_scores.get("interview", {}).get("score", 0)
        interview_total = m_scores.get("interview", {}).get("total", 0)
        
        # Check if already added (unlikely if topic is literal "Mock Interview")
        grade_data.append({
            "name": "General Mock Interview",
            "week": "Final",
            "submitted": 1,
            "total_tasks": 1,
            "status": "Completed",
            "learning_score": 0,
            "learning_total": 0,
            "mock_test_score": 0,
            "mock_test_total": 0,
            "interview_score": interview_score,
            "interview_total": interview_total,
            "final_score": interview_score,
            "final_total": interview_total
        })
        total_score += interview_score
        total_possible += interview_total
        
    avg = (total_score / total_possible * 100) if total_possible > 0 else 0
    
    return {
        "modules": grade_data,
        "overall": {
            "completed": total_modules_completed,
            "total": len(roadmap.get("plan", [])),
            "average": round(avg, 1)
        }
    }

@router.get("/completed-modules")
async def get_completed_modules(current_user: dict = Depends(get_current_user)):
    user = await db.users.find_one({"_id": current_user["_id"]})
    return {"completed": user.get("completed_modules", [])}
