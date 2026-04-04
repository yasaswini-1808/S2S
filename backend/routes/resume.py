from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from routes.auth import get_current_user
from database import db
from services.ai_service import analyze_resume
from bson import ObjectId
import PyPDF2
import io

router = APIRouter(prefix="/api/resume", tags=["resume"])

@router.post("/upload")
async def upload_resume(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
        
    content = await file.read()
    pdf_reader = PyPDF2.PdfReader(io.BytesIO(content))
    text = ""
    for page in pdf_reader.pages:
        text += page.extract_text() or ""
        
    if not text.strip():
        raise HTTPException(status_code=400, detail="Could not extract text from the PDF")
        
    analysis = await analyze_resume(text)
    
    resume_doc = {
        "user_id": current_user["_id"],
        "filename": file.filename,
        "extracted_skills": analysis.get("skills", []),
        "gaps": analysis.get("missing_skills", []),
        "suggested_roles": analysis.get("suggested_roles", [])
    }
    await db.resumes.insert_one(resume_doc)
    
    return analysis
