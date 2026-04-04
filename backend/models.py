from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    selected_path: Optional[str] = None
    resume_uploaded: bool = False

class CareerQuestionnaire(BaseModel):
    interests: List[str]
    cgpa: float
    skills: List[str]
    financial_condition: str
    time_availability: int
    career_preference: Optional[str] = None
