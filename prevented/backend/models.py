from sqlalchemy import Column, Integer, String, Float, ForeignKey, Date, Boolean, Text
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String)  # 'student' or 'teacher'
    
    student_profile = relationship("Student", back_populates="user", uselist=False)
    teacher_profile = relationship("Teacher", back_populates="user", uselist=False)

class Department(Base):
    __tablename__ = "departments"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    code = Column(String, unique=True, index=True)

    subjects = relationship("Subject", back_populates="department")
    students = relationship("Student", back_populates="department")
    teachers = relationship("Teacher", back_populates="department")

class Subject(Base):
    __tablename__ = "subjects"
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, index=True)
    name = Column(String)
    department_id = Column(Integer, ForeignKey("departments.id"))
    semester = Column(Integer)

    department = relationship("Department", back_populates="subjects")
    marks = relationship("Mark", back_populates="subject")
    attendance = relationship("Attendance", back_populates="subject")

class Student(Base):
    __tablename__ = "students"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    register_number = Column(String, unique=True, index=True)
    name = Column(String)
    email = Column(String, unique=True)
    phone = Column(String)
    department_id = Column(Integer, ForeignKey("departments.id"))
    year = Column(Integer)
    semester = Column(Integer)
    dob = Column(Date)
    gender = Column(String)
    address = Column(Text)
    admission_year = Column(Integer)
    profile_photo = Column(String, nullable=True)
    blood_group = Column(String, nullable=True)

    user = relationship("User", back_populates="student_profile")
    department = relationship("Department", back_populates="students")
    marks = relationship("Mark", back_populates="student")
    attendance = relationship("Attendance", back_populates="student")

class Teacher(Base):
    __tablename__ = "teachers"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    employee_id = Column(String, unique=True, index=True)
    name = Column(String)
    email = Column(String, unique=True)
    phone = Column(String)
    department_id = Column(Integer, ForeignKey("departments.id"))
    designation = Column(String)

    user = relationship("User", back_populates="teacher_profile")
    department = relationship("Department", back_populates="teachers")
    notices = relationship("Notice", back_populates="author")

class Mark(Base):
    __tablename__ = "marks"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    subject_id = Column(Integer, ForeignKey("subjects.id"))
    internal = Column(Float)
    external = Column(Float)
    total = Column(Float)
    grade = Column(String)
    academic_year = Column(String)
    semester = Column(Integer)

    student = relationship("Student", back_populates="marks")
    subject = relationship("Subject", back_populates="marks")

class Attendance(Base):
    __tablename__ = "attendance"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    subject_id = Column(Integer, ForeignKey("subjects.id"))
    date = Column(Date)
    status = Column(String)  # 'Present' or 'Absent'
    semester = Column(Integer)

    student = relationship("Student", back_populates="attendance")
    subject = relationship("Subject", back_populates="attendance")

class Notice(Base):
    __tablename__ = "notices"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    category = Column(String)
    content = Column(Text)
    target_audience = Column(String)  # 'all', 'students', 'teachers', or dept code
    publish_date = Column(Date)
    expiry_date = Column(Date)
    author_id = Column(Integer, ForeignKey("teachers.id"))

    author = relationship("Teacher", back_populates="notices")

class SearchHistory(Base):
    __tablename__ = "search_history"
    id = Column(Integer, primary_key=True, index=True)
    term = Column(String)

class SQLDemoRecord(Base):
    __tablename__ = "sql_demo_records"
    id = Column(Integer, primary_key=True, index=True)
    data = Column(String)

class OOBDemoEvent(Base):
    __tablename__ = "oob_demo_events"
    id = Column(Integer, primary_key=True, index=True)
    url = Column(String)
    timestamp = Column(String)

class BloodInventory(Base):
    __tablename__ = "blood_inventory"
    id = Column(Integer, primary_key=True, index=True)
    blood_group = Column(String)
    count = Column(Integer)
