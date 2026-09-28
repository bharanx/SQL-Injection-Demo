from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date

from database import SessionLocal
from auth import get_db
from models import Student, Subject, Mark, Attendance, Notice
from schemas import StudentProfile, StudentUpdate, SubjectBase, MarkResponse, AttendanceResponse, NoticeResponse
from routers.dependencies import get_current_student

router = APIRouter(prefix="/api/student", tags=["Student"])

@router.get("/profile", response_model=StudentProfile)
def get_own_profile(student: Student = Depends(get_current_student)):
    return student

@router.put("/profile", response_model=StudentProfile)
def update_profile(data: StudentUpdate, student: Student = Depends(get_current_student), db: Session = Depends(get_db)):
    if data.email is not None:
        student.email = data.email
    if data.phone is not None:
        student.phone = data.phone
    if data.address is not None:
        student.address = data.address
    if data.blood_group is not None:
        student.blood_group = data.blood_group
    db.commit()
    db.refresh(student)
    return student

@router.get("/subjects", response_model=List[SubjectBase])
def get_own_subjects(student: Student = Depends(get_current_student), db: Session = Depends(get_db)):
    # Assuming students take subjects from their department and semester
    subjects = db.query(Subject).filter(
        Subject.department_id == student.department_id,
        Subject.semester == student.semester
    ).all()
    return subjects

@router.get("/marks", response_model=List[MarkResponse])
def get_own_marks(semester: Optional[int] = None, student: Student = Depends(get_current_student), db: Session = Depends(get_db)):
    query = db.query(Mark).filter(Mark.student_id == student.id)
    if semester is not None:
        query = query.filter(Mark.semester == semester)
    
    marks = query.all()
    results = []
    for m in marks:
        results.append(MarkResponse(
            id=m.id,
            student_id=m.student_id,
            subject_id=m.subject_id,
            subject_code=m.subject.code,
            subject_name=m.subject.name,
            internal=m.internal,
            external=m.external,
            total=m.total,
            grade=m.grade,
            academic_year=m.academic_year,
            semester=m.semester
        ))
    return results

@router.get("/marks/search", response_model=List[MarkResponse])
def search_student_marks(register_number: str, student: Student = Depends(get_current_student), db: Session = Depends(get_db)):
    import re
    if register_number != student.register_number and re.match(r"^REG\d+$", register_number, re.IGNORECASE):
        raise HTTPException(status_code=403, detail="This is not your register number")
    marks = db.query(Mark).join(Student).filter(Student.register_number == register_number).all()
    results = []
    for m in marks:
        results.append(MarkResponse(
            id=m.id,
            student_id=m.student_id,
            subject_id=m.subject_id,
            subject_code=m.subject.code,
            subject_name=m.subject.name,
            internal=m.internal,
            external=m.external,
            total=m.total,
            grade=m.grade,
            academic_year=m.academic_year,
            semester=m.semester,
            student_name=m.student.name,
            register_number=m.student.register_number
        ))
    return results

@router.get("/attendance", response_model=List[AttendanceResponse])
def get_own_attendance(semester: Optional[int] = None, student: Student = Depends(get_current_student), db: Session = Depends(get_db)):
    query = db.query(Attendance).filter(Attendance.student_id == student.id)
    if semester is not None:
        query = query.filter(Attendance.semester == semester)
        
    att_records = query.all()
    results = []
    for a in att_records:
        results.append(AttendanceResponse(
            id=a.id,
            student_id=a.student_id,
            subject_id=a.subject_id,
            subject_code=a.subject.code,
            subject_name=a.subject.name,
            date=a.date,
            status=a.status,
            semester=a.semester
        ))
    return results

@router.get("/notices", response_model=List[NoticeResponse])
def get_notices(student: Student = Depends(get_current_student), db: Session = Depends(get_db)):
    today = date.today()
    # Notices for everyone or students or specific department
    notices = db.query(Notice).filter(
        Notice.publish_date <= today,
        Notice.expiry_date >= today,
        Notice.target_audience.in_(["all", "students", student.department.code.lower()])
    ).all()
    
    results = []
    for n in notices:
        results.append(NoticeResponse(
            id=n.id,
            title=n.title,
            category=n.category,
            content=n.content,
            target_audience=n.target_audience,
            publish_date=n.publish_date,
            expiry_date=n.expiry_date,
            author_name=n.author.name
        ))
    return results

@router.get("/notices/{notice_id}", response_model=List[NoticeResponse])
def get_notice(notice_id: str, student: Student = Depends(get_current_student), db: Session = Depends(get_db)):
    # PREVENTED: Parameterized ORM lookup
    notice = db.query(Notice).filter(Notice.id == notice_id).first()
    if not notice:
        raise HTTPException(status_code=404, detail="Notice not found")
        
    return [NoticeResponse(
        id=notice.id,
        title=notice.title,
        category=notice.category,
        content=notice.content,
        target_audience=notice.target_audience,
        publish_date=notice.publish_date,
        expiry_date=notice.expiry_date,
        author_name=notice.author.name if notice.author else "Unknown"
    )]

@router.get("/check-eligibility")
def check_eligibility(subject_code: str, student: Student = Depends(get_current_student), db: Session = Depends(get_db)):
    # PREVENTED: Parameterized ORM
    subject = db.query(Subject).filter(Subject.code == subject_code).first()
    if subject:
        return {"eligible": True, "subject": subject.name}
    return {"eligible": False}

from pydantic import BaseModel
class IssueReport(BaseModel):
    title: str
    description: str

@router.post("/report-issue")
def report_issue(data: IssueReport, student: Student = Depends(get_current_student), db: Session = Depends(get_db)):
    from models import SQLDemoRecord
    # PREVENTED: Parameterized ORM
    record = SQLDemoRecord(data=f"Issue: {data.title} - {data.description}")
    db.add(record)
    db.commit()
    return {"status": "success", "message": "Issue reported successfully"}

@router.get("/oob-events")
def get_oob_events(db: Session = Depends(get_db)):
    from models import OOBDemoEvent
    events = db.query(OOBDemoEvent).order_by(OOBDemoEvent.id.desc()).limit(10).all()
    return [{"id": e.id, "url": e.url, "timestamp": e.timestamp} for e in events]
