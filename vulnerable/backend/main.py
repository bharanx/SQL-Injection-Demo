from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import List

from database import engine, Base, SessionLocal
from models import User, Student, Teacher
from schemas import Token, StudentProfile, TeacherProfile
from auth import get_db, verify_password, create_access_token, get_current_user

from routers import student, teacher

Base.metadata.create_all(bind=engine)

app = FastAPI(title="SIIT College ERP API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(student.router)
app.include_router(teacher.router)

@app.post("/api/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user.username, "role": user.role})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/api/me")
def read_users_me(current_user: User = Depends(get_current_user)):
    if current_user.role == 'student':
        return {"role": "student", "profile": current_user.student_profile}
    elif current_user.role == 'teacher':
        return {"role": "teacher", "profile": current_user.teacher_profile}
    return {"role": current_user.role}

# Temporary ping endpoint for testing
@app.get("/api/ping")
def ping():
    return {"status": "ok"}

from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

# Serve static SPA
if os.path.isdir("static"):
    app.mount("/assets", StaticFiles(directory="static/assets"), name="assets")
    
    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        path = f"static/{full_path}"
        if os.path.isfile(path):
            return FileResponse(path)
        return FileResponse("static/index.html")
