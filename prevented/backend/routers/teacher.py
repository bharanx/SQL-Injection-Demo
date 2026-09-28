from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List, Optional

from database import SessionLocal
from auth import get_db
from models import Teacher, Student, Subject, Mark, Attendance, Notice
from schemas import (
    TeacherProfile, StudentProfile, TeacherStudentUpdate, 
    SubjectBase, MarkCreateUpdate, MarkResponse, 
    AttendanceCreate, AttendanceResponse, 
    NoticeCreate, NoticeResponse
)
from routers.dependencies import get_current_teacher

router = APIRouter(prefix="/api/teacher", tags=["Teacher"])

@router.get("/profile", response_model=TeacherProfile)
def get_own_profile(teacher: Teacher = Depends(get_current_teacher)):
    return teacher

@router.get("/students", response_model=List[StudentProfile])
def list_students(
    department_id: Optional[int] = None, 
    year: Optional[int] = None, 
    q: Optional[str] = None,
    teacher: Teacher = Depends(get_current_teacher), 
    db: Session = Depends(get_db)
):
    query = db.query(Student)
    if department_id is None:
        department_id = teacher.department_id
    query = query.filter(Student.department_id == department_id)
    if year:
        query = query.filter(Student.year == year)
    if q:
        query = query.filter(or_(
            Student.name.ilike(f"%{q}%"),
            Student.register_number.ilike(f"%{q}%")
        ))
    
    return query.all()

@router.get("/verify-student")
def verify_student(register_number: str, teacher: Teacher = Depends(get_current_teacher), db: Session = Depends(get_db)):
    # PREVENTED: Parameterized ORM
    student = db.query(Student).filter(Student.register_number == register_number).first()
    return {"verified": student is not None}

@router.get("/students/{student_id}", response_model=StudentProfile)
def get_student(student_id: str, teacher: Teacher = Depends(get_current_teacher), db: Session = Depends(get_db)):
    from models import SearchHistory
    # PREVENTED: Parameterized ORM insertion
    history = SearchHistory(term=student_id)
    db.add(history)
    db.commit()

    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return student

@router.put("/students/{student_id}", response_model=StudentProfile)
def update_student(student_id: str, data: TeacherStudentUpdate, teacher: Teacher = Depends(get_current_teacher), db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
        
    if data.email is not None:
        student.email = data.email
    if data.phone is not None:
        student.phone = data.phone
    if data.address is not None:
        student.address = data.address
    if data.year is not None:
        student.year = data.year
    if data.semester is not None:
        student.semester = data.semester
        
    db.commit()
    db.refresh(student)
    return student

@router.get("/subjects", response_model=List[SubjectBase])
def get_subjects(teacher: Teacher = Depends(get_current_teacher), db: Session = Depends(get_db)):
    # Teachers can view subjects in their department
    subjects = db.query(Subject).filter(Subject.department_id == teacher.department_id).all()
    return subjects

def get_grade(total: float) -> str:
    if total >= 90: return "O"
    if total >= 80: return "A+"
    if total >= 70: return "A"
    if total >= 60: return "B+"
    if total >= 50: return "B"
    return "U"

@router.post("/marks", response_model=MarkResponse)
def enter_marks(data: MarkCreateUpdate, teacher: Teacher = Depends(get_current_teacher), db: Session = Depends(get_db)):
    # Verify student exists
    student = db.query(Student).filter(Student.id == data.student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
        
    # Verify subject exists
    subject = db.query(Subject).filter(Subject.id == data.subject_id).first()
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")

    total = data.internal + data.external
    grade = get_grade(total)

    mark = db.query(Mark).filter(
        Mark.student_id == data.student_id, 
        Mark.subject_id == data.subject_id
    ).first()
    
    if mark:
        mark.internal = data.internal
        mark.external = data.external
        mark.total = total
        mark.grade = grade
        mark.academic_year = data.academic_year
        mark.semester = data.semester
    else:
        mark = Mark(
            student_id=data.student_id,
            subject_id=data.subject_id,
            internal=data.internal,
            external=data.external,
            total=total,
            grade=grade,
            academic_year=data.academic_year,
            semester=data.semester
        )
        db.add(mark)
        
    db.commit()
    db.refresh(mark)
    
    return MarkResponse(
        id=mark.id,
        student_id=mark.student_id,
        subject_id=mark.subject_id,
        subject_code=subject.code,
        subject_name=subject.name,
        internal=mark.internal,
        external=mark.external,
        total=mark.total,
        grade=mark.grade,
        academic_year=mark.academic_year,
        semester=mark.semester
    )

@router.post("/attendance", response_model=AttendanceResponse)
def record_attendance(data: AttendanceCreate, teacher: Teacher = Depends(get_current_teacher), db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == data.student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
        
    subject = db.query(Subject).filter(Subject.id == data.subject_id).first()
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")
        
    att = db.query(Attendance).filter(
        Attendance.student_id == data.student_id,
        Attendance.subject_id == data.subject_id,
        Attendance.date == data.date
    ).first()
    
    if att:
        att.status = data.status
        att.semester = data.semester
    else:
        att = Attendance(
            student_id=data.student_id,
            subject_id=data.subject_id,
            date=data.date,
            status=data.status,
            semester=data.semester
        )
        db.add(att)
        
    db.commit()
    db.refresh(att)
    
    return AttendanceResponse(
        id=att.id,
        student_id=att.student_id,
        subject_id=att.subject_id,
        subject_code=subject.code,
        subject_name=subject.name,
        date=att.date,
        status=att.status,
        semester=att.semester
    )

@router.post("/notices", response_model=NoticeResponse)
def create_notice(data: NoticeCreate, teacher: Teacher = Depends(get_current_teacher), db: Session = Depends(get_db)):
    notice = Notice(
        title=data.title,
        category=data.category,
        content=data.content,
        target_audience=data.target_audience,
        publish_date=data.publish_date,
        expiry_date=data.expiry_date,
        author_id=teacher.id
    )
    db.add(notice)
    db.commit()
    db.refresh(notice)
    
    return NoticeResponse(
        id=notice.id,
        title=notice.title,
        category=notice.category,
        content=notice.content,
        target_audience=notice.target_audience,
        publish_date=notice.publish_date,
        expiry_date=notice.expiry_date,
        author_name=teacher.name
    )

@router.get("/blood-drive-status/{register_number}")
def blood_drive_status(register_number: str, teacher: Teacher = Depends(get_current_teacher), db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.register_number == register_number).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
        
    if not student.blood_group:
        return {"student": student.name, "blood_group": "Unknown", "inventory_status": "Please update blood group first"}
        
    from sqlalchemy import text
    # PREVENTED: Using parameterized query for second-order data
    query = text("SELECT count FROM blood_inventory WHERE blood_group = :bg")
    try:
        result = db.execute(query, {"bg": student.blood_group}).fetchone()
        if result:
            count = result[0]
            return {"student": student.name, "blood_group": student.blood_group, "count": count, "inventory_status": "Needed" if count < 50 else "Sufficient"}
        else:
            return {"student": student.name, "blood_group": student.blood_group, "count": 0, "inventory_status": "Not Found"}
    except Exception as e:
        return {"student": student.name, "blood_group": student.blood_group, "count": 0, "inventory_status": "Error: Database lookup failed"}
