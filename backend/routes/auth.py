from fastapi import APIRouter, HTTPException, status, Depends
import logging
from fastapi.security import OAuth2PasswordBearer
from models import UserCreate, UserLogin, Token, UserResponse
from database import db
from utils import get_password_hash, verify_password, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES, SECRET_KEY, ALGORITHM
from datetime import timedelta
import datetime
from jose import jwt, JWTError
from bson import ObjectId

router = APIRouter(prefix="/api/auth", tags=["auth"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

logger = logging.getLogger(__name__)

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
        
    user = await db.users.find_one({"_id": ObjectId(user_id)})
    if user is None:
        raise credentials_exception
    user["_id"] = str(user["_id"])
    return user

@router.get("/me", response_model=UserResponse)
async def read_users_me(current_user: dict = Depends(get_current_user)):
    resume = await db.resumes.find_one({"user_id": current_user["_id"]})
    return {
        "id": current_user["_id"],
        "name": current_user["name"],
        "email": current_user["email"],
        "selected_path": current_user.get("selected_path"),
        "resume_uploaded": True if resume else False
    }

@router.post("/register", response_model=Token)
async def register(user: UserCreate):
    existing_user = await db.users.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    # bcrypt has a 72-byte input limit; reject overly long passwords with a clear error
    pwd_bytes = user.password.encode('utf-8')
    if len(pwd_bytes) > 72:
        raise HTTPException(status_code=400, detail="Password too long; maximum is 72 bytes")

    hashed_password = get_password_hash(user.password)
    new_user = {
        "name": user.name,
        "email": user.email,
        "password_hash": hashed_password,
        "selected_path": None,
        "createdAt": datetime.datetime.utcnow()
    }

    try:
        result = await db.users.insert_one(new_user)
    except Exception as e:
        logger.exception("Failed to insert new user into DB")
        raise HTTPException(status_code=500, detail="Internal server error while creating account")

    access_token = create_access_token(
        data={"sub": str(result.inserted_id)}, 
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/login", response_model=Token)
async def login(user: UserLogin):
    db_user = await db.users.find_one({"email": user.email})
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # protect against bcrypt input length errors
    pwd_bytes = user.password.encode('utf-8')
    if len(pwd_bytes) > 72:
        raise HTTPException(status_code=400, detail="Password too long; maximum is 72 bytes")

    try:
        valid = verify_password(user.password, db_user["password_hash"])
    except ValueError:
        logger.exception("Bcrypt error during password verify - likely too long input")
        raise HTTPException(status_code=400, detail="Password too long; maximum is 72 bytes")
    except Exception:
        logger.exception("Unexpected error during password verification")
        raise HTTPException(status_code=500, detail="Internal server error during authentication")

    if not valid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(
        data={"sub": str(db_user["_id"])},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    return {"access_token": access_token, "token_type": "bearer"}
