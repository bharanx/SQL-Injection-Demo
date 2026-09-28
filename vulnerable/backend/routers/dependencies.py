from fastapi import Depends, HTTPException, status
from auth import get_current_user
from models import User

def get_current_student(current_user: User = Depends(get_current_user)):
    if current_user.role != 'student' or not current_user.student_profile:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access forbidden: requires student privileges",
        )
    return current_user.student_profile

def get_current_teacher(current_user: User = Depends(get_current_user)):
    if current_user.role != 'teacher' or not current_user.teacher_profile:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access forbidden: requires teacher privileges",
        )
    return current_user.teacher_profile
