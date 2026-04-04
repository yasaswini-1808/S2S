from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()

from routes import auth, career, resume, roadmap, community, courses, mock, chat

app = FastAPI(title="Study2Success API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(career.router)
app.include_router(resume.router)
app.include_router(roadmap.router)
app.include_router(community.router)
app.include_router(courses.router)
app.include_router(mock.router)
app.include_router(chat.router)

@app.get("/")
async def root():
    return {"message": "Welcome to Study2Success API"}
