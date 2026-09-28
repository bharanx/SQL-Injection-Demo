from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import date

class UserLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class UserBase(BaseModel):
    username: str
    role: str

class DepartmentBase(BaseModel):
    id: int
    name: str
    code: str
    class Config:
        from_attributes = True

class SubjectBase(BaseModel):
    id: int
    code: str
    name: str
    semester: int
    department_id: int
    class Config:
        from_attributes = True

class StudentProfile(BaseModel):
    id: int
    register_number: str
    name: str
    email: str
    phone: str
    department: DepartmentBase
    year: int
    semester: int
    dob: date
    gender: str
    address: str
    admission_year: int
    blood_group: Optional[str] = None
    class Config:
        from_attributes = True

class TeacherProfile(BaseModel):
    id: int
    employee_id: str
    name: str
    email: str
    phone: str
    department: DepartmentBase
    designation: str
    class Config:
        from_attributes = True

# --- API Request/Response Schemas ---

class StudentUpdate(BaseModel):
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    blood_group: Optional[str] = None

class TeacherStudentUpdate(BaseModel):
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    year: Optional[int] = None
    semester: Optional[int] = None

class MarkResponse(BaseModel):
    id: int
    student_id: int
    subject_id: int
    subject_code: str
    subject_name: str
    internal: float
    external: float
    total: float
    grade: str
    academic_year: str
    semester: int
    student_name: Optional[str] = None
    register_number: Optional[str] = None
    class Config:
        from_attributes = True

class MarkCreateUpdate(BaseModel):
    student_id: int
    subject_id: int
    internal: float = Field(ge=0, le=40)
    external: float = Field(ge=0, le=60)
    academic_year: str
    semester: int

class AttendanceResponse(BaseModel):
    id: int
    student_id: int
    subject_id: int
    subject_code: str
    subject_name: str
    date: date
    status: str
    semester: int
    class Config:
        from_attributes = True

class AttendanceCreate(BaseModel):
    student_id: int
    subject_id: int
    date: date
    status: str = Field(pattern="^(Present|Absent)$")
    semester: int

class NoticeResponse(BaseModel):
    id: int
    title: str
    category: str
    content: str
    target_audience: str
    publish_date: date
    expiry_date: date
    author_name: str
    class Config:
        from_attributes = True

class NoticeCreate(BaseModel):
    title: str
    category: str
    content: str
    target_audience: str
    publish_date: date
    expiry_date: date
