import random
from datetime import date, timedelta
from database import engine, Base, SessionLocal
from models import User, Department, Subject, Student, Teacher, Mark, Attendance, Notice, SearchHistory, SQLDemoRecord, OOBDemoEvent, BloodInventory
from auth import get_password_hash

# Create tables
Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)

db = SessionLocal()

try:
    print("Seeding Departments...")
    depts = [
        Department(name="Computer Science and Engineering", code="CSE"),
        Department(name="Information Technology", code="IT"),
        Department(name="Electronics and Communication Engineering", code="ECE"),
        Department(name="Mechanical Engineering", code="MECH")
    ]
    db.add_all(depts)
    db.commit()

    print("Seeding Subjects...")
    subjects = [
        Subject(code="CS101", name="Data Structures", department_id=1, semester=3),
        Subject(code="CS102", name="Operating Systems", department_id=1, semester=3),
        Subject(code="IT101", name="Web Technologies", department_id=2, semester=3),
        Subject(code="IT102", name="Database Systems", department_id=2, semester=3),
        Subject(code="EC101", name="Signals and Systems", department_id=3, semester=3),
        Subject(code="ME101", name="Thermodynamics", department_id=4, semester=3),
    ]
    db.add_all(subjects)
    db.commit()

    print("Seeding Teachers...")
    t_pass = get_password_hash("teacher123")
    teacher_user1 = User(username="EMP001", hashed_password=t_pass, role="teacher")
    teacher_user2 = User(username="EMP002", hashed_password=t_pass, role="teacher")
    db.add_all([teacher_user1, teacher_user2])
    db.commit()

    t1 = Teacher(user_id=teacher_user1.id, employee_id="EMP001", name="Dr. Anand Kumar", email="anand.kumar@siit.edu", phone="9876543210", department_id=1, designation="Professor")
    t2 = Teacher(user_id=teacher_user2.id, employee_id="EMP002", name="Management", email="management@siit.edu", phone="9876543211", department_id=2, designation="Administration")
    db.add_all([t1, t2])
    db.commit()

    print("Seeding Students...")
    s_pass = get_password_hash("student123")
    
    first_names = ["Rahul", "Priya", "Sanjay", "Sneha", "Karthik", "Divya", "Arjun", "Anjali", "Vikram", "Swati", "Manoj", "Pooja", "Gautam", "Neha", "Ravi", "Shruti", "Ajay", "Kiran", "Nitin", "Meera"]
    last_names = ["Sharma", "Verma", "Patil", "Reddy", "Iyer", "Nair", "Menon", "Das", "Bose", "Gupta"]
    
    students = []
    users = []
    
    for i in range(20):
        reg_num = f"REG2023{str(100+i)}"
        u = User(username=reg_num, hashed_password=s_pass, role="student")
        users.append(u)
    
    db.add_all(users)
    db.commit()

    for i, u in enumerate(users):
        fname = random.choice(first_names)
        lname = random.choice(last_names)
        gender = "Male" if fname in ["Rahul", "Sanjay", "Karthik", "Arjun", "Vikram", "Manoj", "Gautam", "Ravi", "Ajay", "Nitin"] else "Female"
        dept_id = random.choice([1, 2, 3, 4])
        
        s = Student(
            user_id=u.id,
            register_number=u.username,
            name=f"{fname} {lname}",
            email=f"{u.username.lower()}@student.siit.edu",
            phone=f"99{random.randint(10000000, 99999999)}",
            department_id=dept_id,
            year=2,
            semester=3,
            dob=date(2003, random.randint(1,12), random.randint(1,28)),
            gender=gender,
            address="123 College Hostel, SIIT Campus",
            admission_year=2023,
            profile_photo=None,
            blood_group=random.choice(["O+", "A+", "B+", "AB+", "O-", "A-", "B-", "AB-"])
        )
        students.append(s)
        
    db.add_all(students)
    db.commit()

    print("Seeding Marks...")
    marks = []
    for s in students:
        marks.append(Mark(
            student_id=s.id,
            subject_id=1,
            internal=random.randint(30, 50),
            external=random.randint(30, 50),
            total=random.randint(60, 100),
            grade="A",
            academic_year="2023-2024",
            semester=3
        ))
    db.add_all(marks)
    db.commit()

    print("Seeding Attendance...")
    attendances = []
    start_date = date.today() - timedelta(days=30)
    for i in range(30):
        current_date = start_date + timedelta(days=i)
        # Skip weekends (Saturday=5, Sunday=6)
        if current_date.weekday() >= 5:
            continue
        for s in students:
            attendances.append(Attendance(
                student_id=s.id,
                subject_id=1,
                date=current_date,
                status=random.choice(["Present", "Present", "Present", "Absent", "Excused"]),
                semester=3
            ))
    db.add_all(attendances)
    db.commit()

    print("Seeding Notices...")
    n1 = Notice(title="Mid-Semester Exam Schedule", category="Exam", content="The mid-semester exams for the 3rd semester will commence on Oct 15th.", target_audience="students", publish_date=date.today(), expiry_date=date.today() + timedelta(days=30), author_id=1)
    n2 = Notice(title="Management Board Meeting Minutes", category="Admin", content="Confidential minutes of the Q3 board meeting. Salary revisions discussed.", target_audience="staff", publish_date=date.today() - timedelta(days=60), expiry_date=date.today() - timedelta(days=30), author_id=2)
    n3 = Notice(title="Upcoming Staff Appraisal Process", category="Admin", content="Appraisal forms are due by the end of this month. Only for internal staff.", target_audience="staff", publish_date=date.today() - timedelta(days=15), expiry_date=date.today() - timedelta(days=5), author_id=2)
    n4 = Notice(title="Bonus Announcement", category="Admin", content="Annual bonus has been credited to all active staff accounts.", target_audience="staff", publish_date=date.today() - timedelta(days=120), expiry_date=date.today() - timedelta(days=90), author_id=1)
    n5 = Notice(title="Welcome to Academic Year 2023", category="General", content="Welcome all freshers to SIIT! Classes begin on Sept 1st.", target_audience="students", publish_date=date.today() - timedelta(days=365), expiry_date=date.today() - timedelta(days=330), author_id=2)
    n6 = Notice(title="Library Rules Update", category="Admin", content="Library late fees have been increased to Rs. 5 per day.", target_audience="students", publish_date=date.today() - timedelta(days=200), expiry_date=date.today() - timedelta(days=180), author_id=2)
    db.add_all([n1, n2, n3, n4, n5, n6])
    db.commit()

    print("Seeding Blood Inventory...")
    blood_groups = ["O+", "A+", "B+", "AB+", "O-", "A-", "B-", "AB-"]
    inventory = []
    for bg in blood_groups:
        inventory.append(BloodInventory(blood_group=bg, count=random.randint(10, 50)))
    db.add_all(inventory)
    db.commit()

    print("Seeding complete! Demo Credentials:")
    print("Teacher: EMP001 / teacher123")
    print("Student: REG2023100 / student123")

except Exception as e:
    print(f"Error seeding database: {e}")
finally:
    db.close()
